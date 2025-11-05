# 🔧 Migration Guide - Optimized CV Cache

## Problem
Cache özelliği çalışmıyor çünkü database kolonları henüz eklenmemiş.

## Çözüm
Migration'ı çalıştırarak `optimized_score` ve `improvement_breakdown` kolonlarını ekleyin.

---

## Adım 1: Kolonların Var Olup Olmadığını Kontrol Edin

### Supabase Dashboard'da:
1. **SQL Editor**'ı açın
2. Bu sorguyu çalıştırın:

```sql
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'reports'
AND column_name IN ('optimized_score', 'improvement_breakdown', 'generated_cv')
ORDER BY column_name;
```

### Beklenen Sonuç:
```
column_name              | data_type | is_nullable
-------------------------|-----------|-------------
generated_cv             | jsonb     | YES
improvement_breakdown    | jsonb     | YES
optimized_score          | integer   | YES
```

**Eğer sadece `generated_cv` görüyorsanız** → Migration gerekli! Adım 2'ye geçin.

---

## Adım 2: Migration'ı Çalıştırın

### Supabase Dashboard'da (Önerilen):

1. **SQL Editor**'ı açın
2. Aşağıdaki SQL'i çalıştırın:

```sql
-- Kolonları ekle
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS optimized_score INTEGER CHECK (optimized_score >= 0 AND optimized_score <= 100),
ADD COLUMN IF NOT EXISTS improvement_breakdown JSONB;

-- Açıklamalar ekle
COMMENT ON COLUMN reports.optimized_score IS 'Match score of the optimized CV (cached from AI analysis)';
COMMENT ON COLUMN reports.improvement_breakdown IS 'Detailed breakdown of improvements with impact values (cached from AI analysis)';

-- Index ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_reports_optimized_score ON reports(optimized_score) WHERE optimized_score IS NOT NULL;
```

3. ✅ "Success" mesajı görmelisiniz

---

## Adım 3: Verification

Migration'ın başarılı olduğunu doğrulayın:

```sql
-- Kolonları kontrol et
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'reports'
AND column_name IN ('optimized_score', 'improvement_breakdown')
ORDER BY column_name;
```

**Beklenen:** 2 satır dönmeli (optimized_score ve improvement_breakdown)

---

## Adım 4: Test Edin

1. Uygulamada bir CV generate edin
2. Console'da şu logları göreceksiniz:

```
💾 Attempting to cache results: { reportId: "...", optimizedScore: 90, breakdownLength: 5 }
✅ Successfully cached to database: [{ id: "...", optimized_score: 90, improvement_breakdown: [...] }]
```

3. Sayfayı yenileyin (F5)
4. Console'da şunu göreceksiniz:

```
📋 Report loaded from database: { optimizedScore: { value: 90, isNumber: true }, ... }
✅ Loading from cache: { score: 90, breakdownCount: 5 }
```

**Artık her refresh'de AI analizi YAPILMAYACAK!** 🎉

---

## Sorun Giderme

### ❌ Migration hata veriyor: "column already exists"
**Çözüm:** Migration zaten çalıştırılmış, bir şey yapmanıza gerek yok.

### ❌ Console'da "Failed to cache" görüyorum
**Sebep:** Migration henüz çalıştırılmamış.
**Çözüm:** Adım 2'yi tekrar çalıştırın.

### ❌ Migration çalıştırdım ama hala cache çalışmıyor
**Debug:**

1. Console'da ne görüyorsunuz?
   - `💾 Attempting to cache...` görüyor musunuz?
   - `❌ Failed to cache...` mi yoksa `✅ Successfully cached...` mı?

2. Eğer `❌ Failed to cache` görüyorsanız, error detaylarına bakın:
   ```
   ❌ Failed to cache analysis results: {
     message: "column 'optimized_score' does not exist",
     code: "42703"
   }
   ```
   → Migration çalıştırılmamış, Adım 2'yi tekrar çalıştırın.

3. Eğer `✅ Successfully cached` görüyorsanız ama refresh'de cache'den okumuyorsa:
   ```sql
   -- Database'de veriyi kontrol edin
   SELECT id, fit_score, optimized_score, improvement_breakdown
   FROM reports
   WHERE generated_cv IS NOT NULL
   ORDER BY created_at DESC
   LIMIT 5;
   ```
   → Eğer `optimized_score` ve `improvement_breakdown` dolu görünüyorsa, frontend sorunu vardır.

---

## Migration Durumu Kontrolü

Her zaman mevcut durumu bu sorgu ile kontrol edebilirsiniz:

```sql
SELECT
    COUNT(*) as total_reports,
    COUNT(generated_cv) as with_generated_cv,
    COUNT(optimized_score) as with_cached_score,
    COUNT(improvement_breakdown) as with_cached_breakdown
FROM reports;
```

**İdeal Sonuç:**
```
total_reports | with_generated_cv | with_cached_score | with_cached_breakdown
--------------|-------------------|-------------------|----------------------
10            | 5                 | 5                 | 5
```

Yani: Tüm generated CV'ler cache'lenmiş olmalı.

---

## Manuel Cache Temizleme (Gerekirse)

Eğer cache'i temizlemek isterseniz:

```sql
-- Tüm cache'i temizle
UPDATE reports
SET optimized_score = NULL,
    improvement_breakdown = NULL;

-- Sadece belirli bir rapor için
UPDATE reports
SET optimized_score = NULL,
    improvement_breakdown = NULL
WHERE id = 'YOUR_REPORT_ID';
```

---

## Önemli Notlar

1. **Migration geri alınamaz değildir:**
   - İsterseniz kolonları kaldırabilirsiniz
   - Mevcut data'ya zarar vermez

2. **Backward compatible:**
   - Migration çalıştırılmadan da app çalışır
   - Sadece cache özelliği aktif olmaz

3. **Production'da:**
   - Migration'ı production'da çalıştırmadan önce staging'de test edin
   - Backup alın (Supabase otomatik backup yapar ama emin olun)

---

## Hızlı Kontrol Komutu

```sql
-- Tek komutla her şeyi kontrol et
SELECT
    'Columns' as check_type,
    COUNT(*) as count
FROM information_schema.columns
WHERE table_name = 'reports'
AND column_name IN ('optimized_score', 'improvement_breakdown')

UNION ALL

SELECT
    'Reports with Cache' as check_type,
    COUNT(*) as count
FROM reports
WHERE optimized_score IS NOT NULL;
```

**Beklenen:**
```
check_type           | count
---------------------|------
Columns              | 2        ← İki kolon var
Reports with Cache   | 5        ← 5 rapor cache'lenmiş
```

---

## Yardıma İhtiyacınız Varsa

1. Console loglarını kopyalayın
2. Migration sorgusunun çıktısını paylaşın
3. Yukarıdaki kontrol sorgularının sonuçlarını paylaşın
