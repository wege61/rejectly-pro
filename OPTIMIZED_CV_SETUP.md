# Optimized CV Feature Setup Guide

Bu rehber, optimize edilmiş CV özelliğinin kurulumu ve kullanımını açıklar.

## 🗄️ Database Migration

### 1. Migration'ı Çalıştır

Supabase Dashboard'a gidin ve şu SQL'i çalıştırın:

**Yol:** Dashboard → SQL Editor → New Query

```sql
-- supabase/migrations/007_create_optimized_cvs_table.sql dosyasının içeriğini buraya yapıştırın
```

Bu migration şunları oluşturur:
- ✅ `optimized_cvs` tablosu
- ✅ RLS (Row Level Security) policies
- ✅ İndeksler (performance için)
- ✅ Auto-update trigger (updated_at için)

### 2. Migration'ı Doğrula

```sql
-- Tabloyu kontrol et
SELECT * FROM optimized_cvs LIMIT 5;

-- RLS policies'i kontrol et
SELECT * FROM pg_policies WHERE tablename = 'optimized_cvs';
```

## 🎨 CV Sayfası Özellikleri

### Yeni Özellikler

1. **Split-Screen Layout**
   - Sol: CV listesi (Original + Optimized)
   - Sağ: PDF viewer

2. **CV Tipleri**
   - **Original CVs**: Kullanıcı tarafından yüklenen orijinal CV'ler
   - **Optimized CVs**: Raporlar aracılığıyla oluşturulan AI-optimize edilmiş CV'ler

3. **Badge Sistemi**
   - Original: Gri badge
   - Optimized: Yeşil badge (✨ Optimized)
   - Dil: Mavi badge (Turkish/English)

4. **PDF Preview**
   - Tam ekran PDF görüntüleme
   - Toolbar gizli
   - Smooth box-shadow

5. **Actions**
   - Download: PDF'i indir
   - Delete: CV'yi sil (confirmation modal ile)

## 🔧 Optimize CV Oluşturma

### Backend İş Akışı

Optimize edilmiş CV'ler şu şekilde oluşturulur:

1. **Report Generation**: Kullanıcı bir report oluşturur
2. **CV Optimization**: Report'tan "Generate Optimized CV" butonuna tıklar
3. **PDF Creation**: AI optimize edilmiş içeriği PDF'e çevirir
4. **Storage**: PDF Supabase Storage'a yüklenir
5. **Database**: `optimized_cvs` tablosuna kaydedilir

### Gerekli API Endpoints

```typescript
// Optimize CV oluşturma endpoint'i eklenecek
POST /api/cv/create-optimized
{
  "reportId": "uuid",
  "originalCvId": "uuid",
  "optimizedContent": "..."
}
```

## 📊 Database Schema

```sql
optimized_cvs:
  - id: UUID (PK)
  - user_id: UUID (FK → auth.users)
  - report_id: UUID (FK → reports)
  - original_cv_id: UUID (FK → documents, nullable)
  - title: TEXT
  - file_url: TEXT (Supabase Storage URL)
  - text: TEXT (full content)
  - lang: TEXT (en/tr)
  - created_at: TIMESTAMPTZ
  - updated_at: TIMESTAMPTZ
```

## 🔒 Security (RLS Policies)

Tüm optimized CV'ler user-specific:
- ✅ Users can only see their own optimized CVs
- ✅ Users can only create their own optimized CVs
- ✅ Users can only update their own optimized CVs
- ✅ Users can only delete their own optimized CVs

## 🚀 Kullanım

### CV Sayfasında

1. **Original CV Yükleme**
   - "Upload New CV" butonuna tıkla
   - PDF/DOCX seç
   - CV otomatik işlenir ve listelenir

2. **Optimized CV Görüntüleme**
   - Report oluşturduktan sonra
   - Optimize edilmiş CV otomatik olarak CV sayfasında görünür
   - "✨ Optimized" badge ile işaretlidir

3. **CV Silme**
   - Delete butonuna tıkla
   - Confirmation modal'ı onaylaBoth original and optimized CVs silinebilir

## 🎯 Next Steps

### PDF Generation için gerekli

Optimize edilmiş CV'leri PDF olarak oluşturmak için:

1. **PDF Library**: `jsPDF` veya `pdfkit` ekle
2. **Template**: CV template tasarla
3. **API Endpoint**: `/api/cv/create-optimized` oluştur
4. **Storage**: Supabase Storage'a yükle
5. **Database**: `optimized_cvs` tablosuna kaydet

### Report Detail Sayfası Entegrasyonu

Report detail sayfasına "Generate PDF" butonu ekle:
- Button: "📄 Download Optimized CV"
- Action: Optimize edilmiş CV'yi PDF olarak oluştur ve indir
- Cache: Zaten oluşturulmuşsa cached version'ı göster

## 📝 Notes

- Optimize edilmiş CV'ler raporlar sildiğinde silinir (CASCADE)
- Original CV silindiğinde optimize edilmiş CV'nin `original_cv_id` NULL olur (SET NULL)
- Her rapor için birden fazla optimize edilmiş CV oluşturulabilir
- PDF'ler Supabase Storage'da `optimized-cvs/` bucket'ında saklanır

## 🐛 Troubleshooting

### Migration Hatası
```bash
# Migration'ı manuel olarak çalıştır
# Supabase Dashboard → SQL Editor'da migration dosyasını çalıştır
```

### Optimized CVs Görünmüyor
```sql
-- RLS policies'i kontrol et
SELECT * FROM pg_policies WHERE tablename = 'optimized_cvs';

-- Kullanıcının CV'lerini kontrol et
SELECT * FROM optimized_cvs WHERE user_id = 'your-user-id';
```

### PDF Preview Çalışmıyor
- Supabase Storage permissions'ı kontrol et
- file_url'in doğru olduğunu kontrol et
- Browser console'da CORS hatalarını kontrol et
