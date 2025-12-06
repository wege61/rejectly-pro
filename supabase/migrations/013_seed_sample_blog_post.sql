-- Seed a sample blog post to test the blog system

-- First, get the category ID for 'ATS Optimization'
DO $$
DECLARE
  ats_category_id UUID;
  resume_tag_id UUID;
  ats_tag_id UUID;
  job_search_tag_id UUID;
  new_post_id UUID;
BEGIN
  -- Get category ID
  SELECT id INTO ats_category_id FROM blog_categories WHERE slug = 'ats-optimization';

  -- Get tag IDs
  SELECT id INTO resume_tag_id FROM blog_tags WHERE slug = 'resume';
  SELECT id INTO ats_tag_id FROM blog_tags WHERE slug = 'ats';
  SELECT id INTO job_search_tag_id FROM blog_tags WHERE slug = 'job-search';

  -- Insert the blog post
  INSERT INTO blog_posts (
    title,
    slug,
    excerpt,
    content,
    featured_image,
    featured_image_alt,
    category_id,
    author_name,
    is_published,
    published_at,
    reading_time_minutes,
    meta_title,
    meta_description,
    meta_keywords
  ) VALUES (
    'ATS Nedir? Ozgecmisinizin Neden Reddedildigini Anlayin',
    'ats-nedir-ozgecmis-reddedilme-nedenleri',
    'Is basvurularinizin neden yanitlanmadigini merak mi ediyorsunuz? ATS (Aday Takip Sistemi) ozgecmisinizi insan gozleri gormeden eleyebilir. Bu yazida ATS sistemlerini ve nasil gecebileceginizi anlatiyoruz.',
    '## ATS Nedir?

ATS (Applicant Tracking System - Aday Takip Sistemi), sirketlerin is basvurularini yonetmek icin kullandigi bir yazilimdir. Fortune 500 sirketlerinin **%99''u** ve orta olcekli sirketlerin **%75''i** ATS kullanmaktadir.

Bu sistemler, is basvurularinizi:
- Otomatik olarak tarar ve puanlar
- Anahtar kelimelere gore filtreler
- Isverenlere en uygun adaylari listeler

### Neden Bu Kadar Onemli?

Arastirmalara gore, **ozgecmislerin yaklasik %75''i** hicbir zaman bir insan tarafindan incelenmeden reddedilmektedir. Bunun ana nedeni, ATS sistemlerinin bu ozgecmisleri "uyumsuz" olarak isaretlemesidir.

## ATS''nin Ozgecmisinizi Reddetme Nedenleri

### 1. Yanlis Dosya Formati

ATS sistemleri bazi dosya formatlarini okumakta zorlanir:

- **PDF**: Cogu ATS tarafindan desteklenir, ancak bazi eski sistemler sorun yasayabilir
- **DOCX**: En guvenli format
- **Gorsel-agirlikli tasarimlar**: ATS bunlari okuyamaz!

### 2. Eksik Anahtar Kelimeler

Is ilani ile ozgecmisiniz arasinda anahtar kelime uyumu cok onemlidir. Ornegin:

- Is ilani "proje yonetimi" istiyorsa, ozgecmisinizde bu terim olmali
- "JavaScript" yerine sadece "JS" yazmak elesme oranini dusurebilir
- Sektorel jargon ve kisaltmalar dikkatli kullanilmali

### 3. Karmasik Tasarim

- Tablolar ve sutunlar ATS''yi sasirtabilir
- Grafik ve ikonlar okunamaz
- Ozel fontlar sorun yaratabilir
- Baslik ve altbilgiler bazen atlanir

### 4. Iletisim Bilgisi Eksiklikleri

ATS, temel iletisim bilgilerinizi otomatik cikarir:
- E-posta adresi
- Telefon numarasi
- Konum

Bunlardan biri eksikse, basvurunuz elenebilir.

## ATS''den Gecmenin 5 Altin Kurali

### 1. Sade ve Temiz Format Kullanin

Tek sutunlu, temiz bir tasarim secin. Gereksiz grafik oge kullanmayin.

### 2. Is Ilanini Analiz Edin

Her is ilanindaki anahtar kelimeleri belirleyin ve ozgecmisinize dogal bir sekilde yerlestirin.

### 3. Dogru Basliklari Kullanin

Standart basliklar kullanin:
- "Is Deneyimi" veya "Profesyonel Deneyim"
- "Egitim"
- "Beceriler" veya "Yetenekler"

### 4. Olculebilir Basarilar Ekleyin

"Satislari %30 artirdim" gibi somut rakamlar hem ATS hem de insan okuyuculari etkiler.

### 5. Her Basvuru Icin Ozellestirin

Ayni ozgecmisi her yere gondermeyin. Her is ilanina gore ozellestirin.

## Rejectly ile ATS Kontrolu

Rejectly, ozgecmisinizi is ilanlarina gore analiz eder ve:

- **ATS uyumluluk puani** verir
- **Eksik anahtar kelimeleri** listeler
- **Iyilestirme onerileri** sunar
- **Optimize edilmis ozgecmis** olusturur

Ozgecmisinizin ATS testini gecip gecmedigini ogrenmek icin hemen [ucretsiz analiz](/dashboard) yapabilirsiniz.

## Sonuc

ATS sistemlerini anlamak, modern is arama surecinin vazgecilmez bir parcasidir. Ozgecmisinizi ATS uyumlu hale getirerek, basvurularinizin insan gozleri onune gecme sansini onemli olcude artirabilirsiniz.

Unutmayin: En iyi ozgecmis, hem ATS''den gecebilen hem de insanlari etkileyen ozgecmistir.',
    'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=630&fit=crop',
    'Bir kisi laptopunda ozgecmis hazirliyorken',
    ats_category_id,
    'Rejectly Team',
    true,
    NOW(),
    8,
    'ATS Nedir? Ozgecmisinizin Reddedilme Nedenlerini Ogrenin | Rejectly',
    'ATS (Aday Takip Sistemi) nedir ve ozgecmisinizi neden reddediyor? Is basvurularinizin neden yanitlanmadigini anlayin ve ATS''den gecmenin yollarini kesfet.',
    ARRAY['ats', 'ozgecmis', 'cv', 'is basvurusu', 'aday takip sistemi', 'kariyer']
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    excerpt = EXCLUDED.excerpt,
    content = EXCLUDED.content,
    featured_image = EXCLUDED.featured_image,
    featured_image_alt = EXCLUDED.featured_image_alt,
    is_published = EXCLUDED.is_published,
    published_at = EXCLUDED.published_at,
    updated_at = NOW()
  RETURNING id INTO new_post_id;

  -- Add tags to the post
  IF new_post_id IS NOT NULL THEN
    INSERT INTO blog_post_tags (post_id, tag_id)
    VALUES
      (new_post_id, resume_tag_id),
      (new_post_id, ats_tag_id),
      (new_post_id, job_search_tag_id)
    ON CONFLICT (post_id, tag_id) DO NOTHING;
  END IF;

END $$;
