-- Shared rate-limit counters. The app's limiter used per-instance memory, so
-- every serverless instance had its own counter and limits were easy to
-- exceed. Counters live here in fixed time windows; only the service role can
-- touch them (src/lib/rate-limit.ts falls back to memory until this exists).

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (key, window_start)
);

-- RLS on with no policies: anon/authenticated users can't read or write it.
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Atomically count one hit for `p_key` in the current window and return the
-- total so far in that window.
CREATE OR REPLACE FUNCTION rate_limit_hit(p_key TEXT, p_window_seconds INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_window TIMESTAMPTZ := to_timestamp(floor(extract(epoch FROM now()) / p_window_seconds) * p_window_seconds);
  v_count INTEGER;
BEGIN
  INSERT INTO rate_limits (key, window_start, count)
  VALUES (p_key, v_window, 1)
  ON CONFLICT (key, window_start) DO UPDATE SET count = rate_limits.count + 1
  RETURNING count INTO v_count;

  -- Occasionally drop old windows so the table stays small.
  IF random() < 0.01 THEN
    DELETE FROM rate_limits WHERE window_start < now() - INTERVAL '2 days';
  END IF;

  RETURN v_count;
END;
$$;

REVOKE ALL ON FUNCTION rate_limit_hit(TEXT, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION rate_limit_hit(TEXT, INTEGER) TO service_role;
