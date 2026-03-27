import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

function getScoreColor(score: number): string {
  if (score >= 85) return '#35A29F';
  if (score >= 70) return '#3B82F6';
  if (score >= 50) return '#EAB308';
  return '#F97316';
}

function getScoreLabel(score: number): string {
  if (score >= 85) return 'ATS Ready';
  if (score >= 70) return 'Looking Good';
  if (score >= 50) return 'Needs Attention';
  return 'Not Ready';
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const scoreParam = searchParams.get('score');
  const score = Math.min(100, Math.max(0, parseInt(scoreParam ?? '0', 10)));

  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const progressWidth = `${score}%`;

  // Fetch the actual logo
  const origin = new URL(req.url).origin;
  const logoData = await fetch(`${origin}/logo.png`).then(r => r.arrayBuffer());
  const logoBase64 = `data:image/png;base64,${Buffer.from(logoData).toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#151517',
          display: 'flex',
          flexDirection: 'row',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`,
            top: '50%',
            left: '30%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
          }}
        />

        {/* Left — Score (bigger) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '540px',
            padding: '0 40px',
            position: 'relative',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: `${color}18`,
              border: `1.5px solid ${color}40`,
              borderRadius: '100px',
              padding: '7px 18px',
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: color,
                display: 'flex',
              }}
            />
            <span
              style={{
                color: color,
                fontSize: '15px',
                fontWeight: '700',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
              }}
            >
              {label}
            </span>
          </div>

          {/* Score — BIGGER */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '6px',
            }}
          >
            <span
              style={{
                fontSize: '180px',
                fontWeight: '800',
                color: '#ffffff',
                lineHeight: '1',
                letterSpacing: '-10px',
                display: 'flex',
              }}
            >
              {score}
            </span>
            <span
              style={{
                fontSize: '44px',
                fontWeight: '400',
                color: 'rgba(255,255,255,0.2)',
                display: 'flex',
              }}
            >
              /100
            </span>
          </div>

          {/* Progress bar */}
          <div
            style={{
              width: '360px',
              height: '5px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '100px',
              overflow: 'hidden',
              marginTop: '12px',
              display: 'flex',
            }}
          >
            <div
              style={{
                width: progressWidth,
                height: '100%',
                background: color,
                borderRadius: '100px',
                display: 'flex',
              }}
            />
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: '1px',
            height: '300px',
            background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
            alignSelf: 'center',
            display: 'flex',
          }}
        />

        {/* Right — Logo + CTA (bigger) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            flex: '1',
            padding: '0 56px',
          }}
        >
          {/* Actual Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '28px',
            }}
          >
            <img
              src={logoBase64}
              width={56}
              height={56}
              style={{
                borderRadius: '14px',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  color: '#ffffff',
                  fontSize: '26px',
                  fontWeight: '700',
                  letterSpacing: '-0.5px',
                }}
              >
                Rejectly.pro
              </span>
              <span
                style={{
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                AI Resume Optimizer
              </span>
            </div>
          </div>

          {/* Headline bigger */}
          <span
            style={{
              fontSize: '32px',
              fontWeight: '700',
              color: 'rgba(255,255,255,0.88)',
              lineHeight: '1.25',
              letterSpacing: '-1px',
              marginBottom: '10px',
              display: 'flex',
            }}
          >
            ATS Compatibility Score
          </span>

          <span
            style={{
              fontSize: '17px',
              color: 'rgba(255,255,255,0.35)',
              lineHeight: '1.5',
              marginBottom: '32px',
              display: 'flex',
            }}
          >
            Will your resume pass ATS screening?
          </span>

          {/* CTA — BIGGER */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#FF7A73',
              borderRadius: '16px',
              padding: '18px 40px',
            }}
          >
            <span
              style={{
                color: '#fff',
                fontSize: '20px',
                fontWeight: '700',
                letterSpacing: '-0.2px',
              }}
            >
              Check yours free →
            </span>
          </div>

          {/* URL */}
          <span
            style={{
              color: 'rgba(255,255,255,0.18)',
              fontSize: '14px',
              marginTop: '18px',
              display: 'flex',
            }}
          >
            rejectly.pro/ats-check
          </span>
        </div>

        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '3px',
            background: `linear-gradient(90deg, ${color} 0%, #FF7A73 100%)`,
            display: 'flex',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
