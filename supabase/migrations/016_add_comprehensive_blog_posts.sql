-- Add comprehensive blog posts for Rejectly.pro
-- Topics: Resume/CV, Job Search, Career Development, ATS, Interview Prep

DO $$
DECLARE
  resume_tips_id UUID;
  career_advice_id UUID;
  ats_optimization_id UUID;
  interview_prep_id UUID;
  industry_insights_id UUID;

  resume_tag_id UUID;
  cover_letter_tag_id UUID;
  ats_tag_id UUID;
  job_search_tag_id UUID;
  career_change_tag_id UUID;
  remote_work_tag_id UUID;
  tech_industry_tag_id UUID;
  entry_level_tag_id UUID;
  executive_tag_id UUID;
  linkedin_tag_id UUID;

  post_id UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO resume_tips_id FROM blog_categories WHERE slug = 'resume-tips';
  SELECT id INTO career_advice_id FROM blog_categories WHERE slug = 'career-advice';
  SELECT id INTO ats_optimization_id FROM blog_categories WHERE slug = 'ats-optimization';
  SELECT id INTO interview_prep_id FROM blog_categories WHERE slug = 'interview-prep';
  SELECT id INTO industry_insights_id FROM blog_categories WHERE slug = 'industry-insights';

  -- Get tag IDs
  SELECT id INTO resume_tag_id FROM blog_tags WHERE slug = 'resume';
  SELECT id INTO cover_letter_tag_id FROM blog_tags WHERE slug = 'cover-letter';
  SELECT id INTO ats_tag_id FROM blog_tags WHERE slug = 'ats';
  SELECT id INTO job_search_tag_id FROM blog_tags WHERE slug = 'job-search';
  SELECT id INTO career_change_tag_id FROM blog_tags WHERE slug = 'career-change';
  SELECT id INTO remote_work_tag_id FROM blog_tags WHERE slug = 'remote-work';
  SELECT id INTO tech_industry_tag_id FROM blog_tags WHERE slug = 'tech-industry';
  SELECT id INTO entry_level_tag_id FROM blog_tags WHERE slug = 'entry-level';
  SELECT id INTO executive_tag_id FROM blog_tags WHERE slug = 'executive';
  SELECT id INTO linkedin_tag_id FROM blog_tags WHERE slug = 'linkedin';

  -- Post 1: Perfect Resume Guide
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
    'Kusursuz CV Nasil Hazirlanir? 2025 Rehberi',
    'kusursuz-cv-hazirlama-rehberi-2025',
    'Profesyonel bir CV hazirlayarak hayalinizdeki ise bir adim daha yaklasabilirsiniz. Bu kapsamli rehberde, dikkat ceken bir CV olusturmanin tum sirlari.',
    '## Giris: CV Neden Bu Kadar Onemli?

CV''niz, potansiyel isverenlerle olan ilk temasinizdir. Arastirmalar, isveren temsilcilerinin bir CV''yi incelemek icin ortalama sadece **6 saniye** ayirdigini gosteriyor. Bu kisa surede etkili bir izlenim birakmak zorundasiniz.

## CV Hazirlama Temelleri

### 1. Dogru Format Secimi

CV formatiniz deneyim seviyenize ve hedeflerinize gore secilmelidir:

**Kronolojik Format**
- En yaygin kullanilan format
- Is deneyiminizi en yeniden en eskiye dogru siralar
- Istikrarli kariyer gecmisi olanlar icin ideal

**Fonksiyonel Format**
- Becerileri on plana cikarir
- Kariyer degisikligi yapanlar icin uygun
- Is gecmisinde bosluklari olan adaylar icin faydali

**Karma Format**
- Hem becerileri hem de is gecmisini vurgular
- Deneyimli profesyoneller icin mukemmel
- Cesitli alanlarda deneyimi olanlar icin uygun

### 2. CV''nizin Olmazsa Olmaz Bolumleri

**Kisisel Bilgiler**
- Ad Soyad (buyuk punto)
- Telefon numarasi
- E-posta adresi (profesyonel)
- LinkedIn profil linki
- Konum (sehir yeterli)

**Profesyonel Ozet**
- 2-3 cumlelik kisa tanitim
- Anahtar becerileriniz
- Kariyer hedefleriniz
- Benzersiz deger onerileriniz

**Is Deneyimi**
- Sirket adi ve konum
- Pozisyon unvani
- Calisma tarihleri
- Sorumluluklar ve basarilar (madde isaretleriyle)
- Olculebilir sonuclar

**Egitim**
- Universite/okul adi
- Bolum/alan
- Mezuniyet yili
- Onur dereceleri (varsa)

**Beceriler**
- Teknik beceriler
- Yazilimlar/programlar
- Diller ve seviyeleri
- Sertifikalar

### 3. Basarilari Olculebilir Hale Getirin

Yanlis: "Satis ekibini yonettim"
Dogru: "10 kisilik satis ekibini yoneterek yillik satislari %35 artirdim"

Yanlis: "Musteri memnuniyetini iyilestirdim"
Dogru: "Musteri sikayetlerini 6 ay icinde %60 azaltarak memnuniyet puanini 4.8/5''e cikardim"

### 4. ATS Uyumlu CV Hazirlama

Modern sirketlerin cogu ATS (Aday Takip Sistemi) kullanir. CV''nizin ATS uyumlu olmasi icin:

- Standart basliklar kullanin (Deneyim, Egitim, Beceriler)
- Sade, tek sutunlu tasarim tercih edin
- Gorsel ogeler yerine metin kullanin
- Is ilanindaki anahtar kelimeleri CV''nize ekleyin
- PDF veya DOCX formatini tercih edin

## Yapimamaniz Gerekenler

### 1. Cok Uzun veya Cok Kisa CV

- Yeni mezunlar: 1 sayfa
- Orta seviye (3-10 yil): 1-2 sayfa
- Kidemli/Executive: 2-3 sayfa

### 2. Kisisel Bilgi Fazlaligi

Eklemeyin:
- Dogum tarihi
- Medeni durum
- Fotograf (Turkiye haric)
- TCKN
- Referanslar (istenmedikce)

### 3. Genel Ifadeler

Kacinilmasi gerekenler:
- "Takim oyuncusuyum"
- "Hizli ogrenirim"
- "Detaylara dikkat ederim"
- "Iletisim becerilerim gucludur"

Bunlar yerine somut ornekler verin.

### 4. Yazim Hatalari

- CV''nizi en az 3 kez okuyun
- Baskasina okutun
- Grammarly gibi araclar kullanin
- Ozellikle isim, tarih ve iletisim bilgilerini kontrol edin

## Sektore Ozel Ipuclari

### Teknoloji

- GitHub/Portfolio linklerinizi ekleyin
- Kullandiginiz teknolojileri listeleyin
- Acik kaynak katkilarinizi belirtin
- Yan projelerinizden bahsedin

### Pazarlama

- Kampanya sonuclarinizi paylasin
- Kullandiginiz platformlari belirtin
- ROI metrikleri ekleyin
- Sertifikalarinizi vurgulayin

### Finans

- Sertifikalarinizi on plana cikarin (CFA, CPA, vb.)
- Finansal sonuclari sayilarla ifade edin
- Uyum/compliance deneyiminizi vurgulayin
- Analitik becerilerinizi gosterin

## Rejectly ile CV''nizi Optimize Edin

Rejectly, CV''nizi yapay zeka ile analiz ederek:

- Is ilaniyla uyumluluk skorunu gosterir
- Eksik anahtar kelimeleri tespit eder
- ATS uyumlulugunuzu degerlendirir
- Kisiyeselestirilmis iyilestirme onerileri sunar
- Optimize edilmis CV versiyonu olusturur

[Ucretsiz CV analizi icin tiklayin](/dashboard)

## Sonuc

Kusursuz bir CV hazirlamak, ilk basvurunuzda basarili olmayabilirsiniz. Surekli guncelleyin, her is basvurusu icin ozellestirin ve geri bildirimleri dikkate alin.

Unutmayin: CV''niz sizin profesyonel hikayenizdir. Onu etkili bir sekilde anlatmak sizin elinizde!',
    'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=630&fit=crop',
    'Masada CV hazirlayan kisi',
    resume_tips_id,
    'Rejectly Team',
    true,
    NOW() - INTERVAL '7 days',
    10,
    'Kusursuz CV Nasil Hazirlanir? 2025 Kapsamli Rehber | Rejectly',
    '2025 yilinda dikkat ceken bir CV nasil hazirlanir? Profesyonel CV hazirlama ipuclari, ornekler ve ATS uyumlu format onerileri ile hayalinizdeki ise kavusun.',
    ARRAY['cv hazirlama', 'ozgecmis', 'is basvurusu', 'kariyer', 'cv ornekleri', 'profesyonel cv']
  ) RETURNING id INTO post_id;

  INSERT INTO blog_post_tags (post_id, tag_id)
  VALUES (post_id, resume_tag_id), (post_id, job_search_tag_id), (post_id, ats_tag_id);

  -- Post 2: Cover Letter Guide
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
    'Etkileyici On Yazi Nasil Yazilir? Orneklerle Kapsamli Rehber',
    'etkileyici-on-yazi-nasil-yazilir',
    'On yazi (cover letter) is basvurunuzda fark yaratmanizi saglar. Bu rehberde, isverenleri etkileyecek on yazi yazmanin tum sirlari ve ornekleri.',
    '## On Yazi Nedir ve Neden Onemlidir?

On yazi, CV''nizle birlikte gonderdiginiz, kendinizi ve is basvurunuzu aciklayan resmi bir mektuptur. Arastirmalar, on yazi gonderen adaylarin **gorusmemeye cagirilma oraninin %40 daha yuksek** oldugunu gosteriyor.

## On Yazi Yapisi

### 1. Baslik ve Iletisim Bilgileri

```
[Adiniz Soyadiniz]
[E-posta Adresiniz]
[Telefon Numaraniz]
[Tarih]

[Is Veren Sirket Adi]
[Yetkili Kisi Adi (biliniyorsa)]
[Sirket Adresi]
```

### 2. Giris Paragraf

Ilk paragrafiniz dikkat cekici olmali:

**Yanlis Ornek:**
"Bu mektupla X pozisyonuna basvuruyorum."

**Dogru Ornek:**
"5 yillik dijital pazarlama deneyimim ve gecen yil yonettim kampanyalarda %150 ROI artisi saglamam, X sirketinin Pazarlama Muduru pozisyonu icin ideal aday olmami sagliyor."

### 3. Govde Paragraflar (1-2 paragraf)

**Birinci Paragraf:** Neden bu pozisyon?
- Sirket hakkinda arastirma yaptiginizi gosterin
- Sirket degerleriyle uyumunuzu vurgulayin
- Pozisyona neden ilgi duydugunuzu aciklayin

**Ikinci Paragraf:** Neden siz?
- Somut basarilarinizi paylasin
- Is ilani gereksinimlerine nasil uydugunuzu gosterin
- Benzersiz becerilerinizi vurgulayin

### 4. Kapanis Paragraf

- Gorusme talebi
- Tesekkur ifadesi
- Profesyonel kapanis

## On Yazi Yazarken Dikkat Edilmesi Gerekenler

### DO: Yapmaniz Gerekenler

1. **Kisiselestirin**
   - Her is basvurusu icin yeni on yazi yazin
   - Sirket arastirmasi yapin
   - Yetkili kisinin adini ogrenin

2. **Somut Olun**
   - Sayilar ve metrikler kullanin
   - Spesifik ornekler verin
   - Basarilarinizi olculebilir hale getirin

3. **Tutkulu Olun**
   - Pozisyona olan ilginizi gosterin
   - Sirket kulturune uyumunuzu vurgulayin
   - Katki saglama istegi aciklayin

4. **Profesyonel Olun**
   - Resmi dil kullanin
   - Yazim kurallarina dikkat edin
   - Uygun format tercih edin

### DON''T: Yapimamaniz Gerekenler

1. **Genel Sablonlar Kullanmayin**
   - "Sayin Yetkili" yerine isim kullanin
   - Kopyala-yapistir yapmaktan kacinin

2. **CV''nizi Tekrar Etmeyin**
   - On yazi CV''nin ozeti degildir
   - Yeni bilgiler ekleyin
   - Hikayenizi anlayin

3. **Cok Uzun Yazmayin**
   - Maksimum 1 sayfa
   - 3-4 paragraf yeterli
   - Her kelimeye dikkat edin

4. **Olumsuz Konulardan Bahsetmeyin**
   - Eski isverenlerinizi elestirmeyin
   - Zayif yonlerinizi vurgulamayin
   - Mazeretler uretmeyin

## Sektore Ozel On Yazi Ornekleri

### Teknoloji Sektoru Ornegi

```
Sayin [Yonetici Adi],

X sirketinin Yazilim Gelistirici pozisyonu icin basvuruyorum. React ve Node.js teknolojilerinde 4 yillik deneyimim ve acik kaynak projelerime 10,000''den fazla GitHub yildizi almaim, ekibinize degerli katkilar saglayabilecegimi gosteriyor.

Sirketinizin mikro servis mimarisine gecis projesini buyuk bir ilgiyle takip ediyorum. Onceki sirketimde benzer bir gecisi yoneterek sistem performansini %200 arirdim ve daginik sistem hata oranini %80 azaldim.

Ekibinize katilarak teknik vizyonunuza katki saglamak ve olceklenebilir cozumler gelistirmek isterim.

Saygirarimla,
[Adiniz]
```

### Pazarlama Sektoru Ornegi

```
Sayin [Yonetici Adi],

X sirketinin Dijital Pazarlama Uzmani pozisyonuna basvuruyorum. Son 3 yilda yonettim SoMed kampanyalariyla 2M+ kullaniciya ulasmam ve %45 engagement orani elde etmem, markanizin dijital varliini guclendirebilecegimi gosteriyor.

Sirketinizin surdurulebilirlik odakli marka konumlandirmaniz beni cok etkiledi. Onceki rolumde benzer degerlere sahip bir startup icin sifirdan marka stratejisi olusturarak 6 ayda 50K organik takipci kazandirdim.

Yaratici kampanya fikirlerim ve veri odakli yaklasimim ile markaniza deger katmak isterim.

En iyi dileklerimle,
[Adiniz]
```

## Rejectly ile On Yazi Olusturun

Rejectly, yapay zeka destekli on yazi olusturucu ile:

- CV''nize ve is ilanina uygun on yazi uretir
- Kisisellestirilmis icerik oneriler
- ATS uyumlu format
- Farkli ton ve stil secenekleri

[Hemen on yazi olusturmaya baslayin](/cover-letters)

## Sonuc

Etkili bir on yazi, sizi diger adaylardan ayiran en onemli faktordur. Zaman ayirip, kisisellestririlmis ve etkileyici bir on yazi yazmak, gorusme sansinizi onemli olcude artiracaktir.

Unutmayin: On yaziniz, profesyonel kimliginizin ve iletisim becerilerinizin ilk gostergesidir!',
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=630&fit=crop',
    'Laptopda yazi yazan kisi',
    resume_tips_id,
    'Rejectly Team',
    true,
    NOW() - INTERVAL '5 days',
    12,
    'Etkileyici On Yazi Nasil Yazilir? Ornekler ve Ipuclari | Rejectly',
    'Profesyonel on yazi (cover letter) nasil yazilir? Sektore ozel ornekler, sablonlar ve uzman ipuclariyla is basvurunuzda fark yaratin.',
    ARRAY['on yazi', 'cover letter', 'is basvurusu', 'kariyer', 'on yazi ornegi']
  ) RETURNING id INTO post_id;

  INSERT INTO blog_post_tags (post_id, tag_id)
  VALUES (post_id, cover_letter_tag_id), (post_id, job_search_tag_id), (post_id, resume_tag_id);

  -- Post 3: LinkedIn Optimization
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
    'LinkedIn Profilini Optimize Etme: Is Verenler Sizi Bulsun',
    'linkedin-profil-optimizasyonu-rehberi',
    'LinkedIn''de onemli bir profesyonel network olusturun ve is verenler sizi bulsun. Profil optimizasyonu, icerik stratejisi ve network ipuclari.',
    '## Neden LinkedIn?

LinkedIn, **900+ milyon** profesyonelin bulundugu dunyanin en buyuk is arama ve network platformudur. Arastirmalar, islere alimlarin **%87''sinin** LinkedIn''i kullanarak aday arasimaa yaptiini gosteriyor.

## LinkedIn Profil Optimizasyonu

### 1. Profil Fotografi

**Profesyonel olmali:**
- Yuksek cozunurluk
- Duz zemin
- Is kiytafeti
- Yuzunuz net gorulmeli
- Gulus profesyonel ve samimi

**Istatistikler:**
- Profil fotgrafli profiller **%21 daha fazla** goruntulenir
- **%36 daha fazla** mesaj alir

### 2. Kapak Gorseli

Kapak gorseliniz:
- Profesyonel kimliginizi yansitmali
- Markanizla uyumlu olmali
- Dikkat cekici ama asiri yüklü olmamali
- Idealinde 1584x396 piksel

### 3. Baslik (Headline)

Basligiz sadece unvaninz olmamaali:

**Yanlis:**
"Yazilim Gelistirici"

**Dogru:**
"Senior Full-Stack Developer | React & Node.js | Acik Kaynak Katkilimcisi | 50K+ GitHub Stars"

**Ipuclari:**
- Anahtar becerilerinizi ekleyin
- Benzersiz degerlerinizi vurgulayin
- 220 karakter limitini kullanin
- Emojiler dikkatli kullanin

### 4. Hakkimda (About) Bölümü

Bu bolum profesyonel hikayenizdir:

**Yapi:**
1. **Acilis (2-3 cumle):** Kim oldugunuz ve ne yaptiginiz
2. **Deneyim:** Anahtar basarilariniz ve deneyimleriniz
3. **Tutku:** Ne konuda heveslisiniz
4. **CTA:** Insanlara nasil ulasabilecekleri

**Ornek:**

```
7 yildir kullanici deneyimi tasarlaminda uzmanlasmis bir UX Designer''im. Fortune 500 sirketlerinden startuplara kadar 50''den fazla proje yoneterek kullanici memnuniyetini ortalama %40 artirdm.

Kariyerim boyunca iOS, Android ve web platformlari icin kullanici odakli tasarimlar olusturdum. En buyuk basarim, 5M+ kullanicili bir mobil uygulamanin UX''ini yeniden tasarlayarak kullanim oranini %200 artirmak oldu.

Erisilebilir tasarimi ve kapsyici dijital deneyimler olusturmayi seviyorum. Boş zamanlarimda tasarim topluluklarinda mentor olarak calisiyorum.

Is birligi veya proejler icin benimle iletisime gecin!
```

### 5. Deneyim Bolumu

Her pozisyon icin:

**Baslik:** Net ve aciklayici
**Tarihler:** Baslangic ve bitis
**Aciklama:**
- 3-5 madde işareti
- Her madde bir basari
- Olculebilir sonuclar
- Anahtar kelimeler

**Ornek:**

```
Senior Product Manager | TechCorp
Ocak 2020 - Simdi

• 3 cross-functional ekip yöneterek 5 büyük ürün lansmanı gerçekleştirdim
• Kullanıcı geri bildirimlerini analiz ederek ürün roadmap'ini optimize ettim, bu da %35 kullanıcı memnuniyeti artışı sağladı
• Agile metodolojisi uygulayarak ürün geliştirme sürecini %40 hızlandırdım
• $2M+ gelir artışı sağlayan premium özellik setini tasarladım ve piyasaya sürdüm
```

### 6. Beceriler (Skills)

**Stratejik beceri ekleme:**
- En önemli 5 beceriyi üste yerleştirin
- Sektörünüzle ilgili anahtar kelimeleri ekleyin
- Meslektaşlarınızdan onay isteyin
- Düzenli olarak güncelleyin

**İpucu:** LinkedIn'de en fazla 50 beceri ekleyebilirsiniz, ancak en önemli 10-15'e odaklanın.

### 7. Öneriler (Recommendations)

- Meslektaşlarınızdan öneri isteyin
- Karşılıklı öneri yazın
- Spesifik projeler hakkında öneri alın
- En az 3-5 öneri hedefleyin

## İçerik Stratejisi

### Ne Paylaşmalısınız?

1. **Sektör haberleri ve yorumlar**
2. **Profesyonel başarılarınız**
3. **Öğrendiğiniz dersler**
4. **Faydalı kaynaklar ve makaleler**
5. **Etkinlik ve konferans deneyimleri**

### Paylaşım Sıklığı

- **Minimum:** Haftada 2-3 gönderi
- **Optimum:** Her gün 1 gönderi veya etkileşim
- **Maksimum:** Günde 2-3 gönderi (spam gibi görünmemek için)

### En İyi Paylaşım Zamanları

**Türkiye için:**
- Hafta içi: 08:00-09:00, 12:00-13:00, 17:00-18:00
- En aktif günler: Salı, Çarşamba, Perşembe

### İçerik Formatları

**En çok etkileşim alan formatlar:**
1. **Doküman (Carousel):** %30 daha fazla etkileşim
2. **Video:** %20 daha fazla reach
3. **Resim + Metin:** İyi engagement
4. **Sadece Metin:** Otantik hikayeler için ideal

## Networking İpuçları

### 1. Bağlantı İstekleri

**İyi bir bağlantı mesajı:**
```
Merhaba [İsim],

[Ortak nokta / neden bağlanmak istiyorsunuz]. [LinkedIn'de sizi nasıl bulduğunuz]. Profesyonel networküme ekleme fırsatını çok isterim.

Teşekkürler,
[Adınız]
```

### 2. Mesajlaşma

- İlk mesajınızı kişiselleştirin
- Değer sunun
- Doğrudan satış yapmayın
- Takip mesajları gönderin

### 3. Gruplar ve Etkinlikler

- Sektörünüzle ilgili gruplara katılın
- Aktif olarak tartışmalara katılın
- Etkinliklere kayıt olun
- Yorum yaparak görünür olun

## LinkedIn SEO

### Anahtar Kelime Optimizasyonu

Şu bölümlerde anahtar kelime kullanın:
- Başlık
- Hakkımda
- Deneyim açıklamaları
- Beceriler
- Başlık ve sertifikalar

### URL Özelleştirme

Varsayılan: `linkedin.com/in/john-doe-123456789`
Özel: `linkedin.com/in/johndoe`

## LinkedIn Premium Değer mi?

### Ücretsiz vs Premium

**Premium Avantajları:**
- InMail kredileri
- Kim profilli görüntülüyor (tam liste)
- İş ilanlarında "Featured Applicant"
- LinkedIn Learning erişimi
- Gelişmiş arama filtreleri

**Kimler İçin Değerli?**
- Aktif iş arayanlar
- Freelancer ve danışmanlar
- Sales profesyonelleri
- Recruiter'lar

## Rejectly LinkedIn Entegrasyonu

Rejectly ile:
- CV'nizi LinkedIn profilinizle senkronize edin
- LinkedIn başlığınızı optimize edin
- Profil özetinizi AI ile geliştirin
- Becerilerinizi stratejik olarak düzenleyin

[LinkedIn profilinizi optimize edin](/dashboard)

## Sonuç

LinkedIn, modern kariyer yönetiminin vazgeçilmez bir parçasıdır. Profilinizi optimize etmek, düzenli içerik paylaşmak ve aktif networking yapmak, kariyer fırsatlarınızı önemli ölçüde artıracaktır.

Unutmayın: LinkedIn bir maraton, sprint değil. Tutarlı ve otantik olun!',
    'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=1200&h=630&fit=crop',
    'LinkedIn profil ekrani',
    career_advice_id,
    'Rejectly Team',
    true,
    NOW() - INTERVAL '3 days',
    15,
    'LinkedIn Profil Optimizasyonu: İş Verenler Sizi Bulsun | Rejectly',
    'LinkedIn profilinizi optimize ederek iş fırsatlarını yakalayın. Profil oluşturma, içerik stratejisi ve networking ipuçları ile profesyonel networku güçlendirin.',
    ARRAY['linkedin', 'kariyer', 'networking', 'iş arama', 'profesyonel gelişim']
  ) RETURNING id INTO post_id;

  INSERT INTO blog_post_tags (post_id, tag_id)
  VALUES (post_id, linkedin_tag_id), (post_id, career_advice_tag_id), (post_id, job_search_tag_id);

  -- Post 4: Remote Work Job Search
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
    'Uzaktan Çalışma İşi Nasıl Bulunur? Kapsamlı Rehber',
    'uzaktan-calisma-isi-nasil-bulunur',
    'Uzaktan çalışma hayalinizi gerçekleştirin. En iyi remote iş platformları, başvuru stratejileri ve home office kurulumu ipuçları.',
    '## Uzaktan Çalışma Devrimi

2025 itibarıyla, küresel işgücünün **%35''i** tamamen veya kısmen uzaktan çalışıyor. Türkiye''de ise bu oran **%22** ve hızla artıyor.

## Uzaktan Çalışmanın Avantajları

### Çalışanlar İçin
- **Esneklik:** Kendi programınızı belirleyin
- **Tasarruf:** Ulaşım ve yemek masrafları
- **Yaşam Kalitesi:** Daha fazla aile zamanı
- **Küresel Fırsatlar:** Dünyanın her yerinden iş

### İşverenler İçin
- **Geniş Yetenek Havuzu**
- **Maliyetlerin azaltılması**
- **Daha yüksek verimlilik**
- **Çalışan memnuniyeti**

## En İyi Uzaktan İş Platformları

### Uluslararası Platformlar

**1. We Work Remotely**
- Teknoloji odaklı
- Günde 100+ yeni ilan
- Ücretsiz başvuru
- www.weworkremotely.com

**2. Remote.co**
- Kaliteli iş ilanları
- Şirket profilleri
- Uzaktan çalışma kaynakları
- remote.co

**3. FlexJobs**
- Doğrulanmış ilanlar
- Scam-free garanti
- Ücretli üyelik ($14.95/ay)
- www.flexjobs.com

**4. AngelList (Wellfound)**
- Startup işleri
- Equity bilgisi
- Doğrudan kurucularla iletişim
- wellfound.com

**5. LinkedIn**
- "Remote" filtresini kullanın
- En büyük profesyonel network
- Doğrudan başvuru

### Türkiye Odaklı Platformlar

**1. Kariyer.net**
- "Uzaktan Çalışma" filtresi
- Türk şirketleri
- Yerli ve yabancı fırsatlar

**2. Toptal**
- Freelance uzmanlar için
- Seçici kabul süreci
- Yüksek ücretli projeler
- www.toptal.com

**3. Upwork**
- Freelance marketplace
- Proje bazlı işler
- Küresel müşteriler
- www.upwork.com

## Uzaktan İş Başvuru Stratejileri

### 1. CV ve Portfolio Hazırlığı

**CV için:**
- Uzaktan çalışma deneyiminizi vurgulayın
- Öz-disiplin ve zaman yönetimi becerilerinizi gösterin
- Kullandığınız uzaktan çalışma araçlarını listeleyin
- Asenkron iletişim becerinizi vurgulayın

**Portfolio için:**
- Online portfolyo oluşturun
- GitHub/Behance gibi platformları kullanın
- Somut proje sonuçları gösterin
- Video sunumlar ekleyin

### 2. Uzaktan Çalışma Becerileri

İşverenler şunları arar:
- **İletişim:** Yazılı ve sözlü
- **Öz-motivasyon:** Gözetim olmadan çalışabilme
- **Teknik Yeterlilik:** Araçları kullanabilme
- **Zaman Yönetimi:** Deadline''ları tutma
- **Sorun Çözme:** Bağımsız karar verme

### 3. Başvuru Sürecinde Dikkat Edilecekler

**İlk İzlenim:**
- E-posta imzanızı profesyonel yapın
- Hızlı yanıt verin (24 saat içinde)
- Farklı saat dilimlerini hesaba katın
- Video görüşme kurulumunuzu test edin

**Video Görüşmeler:**
- İyi aydınlatma
- Temiz arka plan
- Profesyonel kıyafet
- Stabil internet bağlantısı
- Sessiz ortam

## Uzaktan Çalışmada Başarılı Olmak

### Home Office Kurulumu

**Temel Ekipman:**
- Ergonomik sandalye
- Ayarlanabilir masa
- İyi laptop/desktop
- Harici monitör (tercihen)
- Kaliteli kulaklık/mikrofon
- Hızlı internet (min. 25 Mbps)

**Ortam:**
- Ayrı çalışma alanı
- Doğal ışık
- Minimal dikkat dağıtıcılar
- İyi havalandırma

### Zaman Yönetimi

**Teknikler:**
- **Pomodoro:** 25 dk çalış, 5 dk ara
- **Time Blocking:** Günü bloklara ayırın
- **Eat the Frog:** Zor görevi sabah yapın
- **2-Minute Rule:** 2 dk''dan kısa ise hemen yap

**Araçlar:**
- Trello/Asana: Proje yönetimi
- RescueTime: Zaman takibi
- Focus@Will: Odaklanma müziği
- Forest: Telefon bağımlılığını azalt

### İletişim Araçları

**Mesajlaşma:**
- Slack
- Microsoft Teams
- Discord (tech ekipleri için)

**Video Konferans:**
- Zoom
- Google Meet
- Microsoft Teams

**Proje Yönetimi:**
- Jira
- Trello
- Asana
- ClickUp

**Döküman Paylaşım:**
- Google Workspace
- Notion
- Confluence

## Yaygın Zorluklar ve Çözümler

### 1. İzolasyon Hissi

**Çözümler:**
- Co-working space kullanın
- Virtual coffee chat''ler düzenleyin
- Yerel meetup''lara katılın
- Online topluluklar Bulun

### 2. İş-Yaşam Dengesi

**Çözümler:**
- Net çalışma saatleri belirleyin
- Öğle yemeğini dışarıda yiyin
- Akşam bildirimlerini kapatın
- Haftalık planlar yapın

### 3. Motivasyon Kaybı

**Çözümler:**
- Kısa vadeli hedefler koyun
- Başarıları kutlayın
- Rutin oluşturun
- Accountability partner edinin

## Uzaktan Çalışma ve Vergi

### Türkiye''de Çalışanlar İçin

**Yurt Dışı Şirketlerden Gelir:**
- Serbest meslek makbuzu kesebilirsiniz
- Vergİ danışmanına danışın
- E-fatura sistemini kullanın

**Önemli:**
- Gelir beyan edin
- Vergi dilimlerinizi bilin
- SGK primleri ödemeyi unutmayın

## Rejectly ile Uzaktan İş Başvurusu

Rejectly''nin uzaktan iş özellikleri:
- Remote pozisyonlara özel CV optimizasyonu
- Uzaktan çalışma becerilerini vurgulama
- Küresel ATS sistemlerine uyumlu format
- Saat dilimi uyumlu başvuru takibi

[Uzaktan işe başvurmaya başlayın](/dashboard)

## Sonuç

Uzaktan çalışma artık bir lüks değil, standart bir çalışma şekli. Doğru araçlar, stratejiler ve mindset ile dünyanın her yerinden çalışabilir, hem kariyer hem de yaşam kalitenizi artırabilirsiniz.

Unutmayın: Uzaktan çalışmanın başarısı, disiplin ve doğru alışkanlıklar gerektirir!',
    'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=1200&h=630&fit=crop',
    'Evden laptop ile calisan kisi',
    career_advice_id,
    'Rejectly Team',
    true,
    NOW() - INTERVAL '1 day',
    14,
    'Uzaktan Çalışma İşi Nasıl Bulunur? 2025 Rehberi | Rejectly',
    'Remote iş bulmanın tüm püf noktaları. En iyi platformlar, başvuru stratejileri, home office kurulumu ve başarı ipuçlarıyla uzaktan çalışma hayatına başlayın.',
    ARRAY['uzaktan çalışma', 'remote work', 'iş arama', 'home office', 'freelance']
  ) RETURNING id INTO post_id;

  INSERT INTO blog_post_tags (post_id, tag_id)
  VALUES (post_id, remote_work_tag_id), (post_id, job_search_tag_id), (post_id, career_change_tag_id);

  -- Post 5: Tech Interview Prep
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
    'Yazılım Mülakat Hazırlığı: Algoritma, Sistem Tasarımı ve Davranışsal Sorular',
    'yazilim-mulakat-hazirligi-rehberi',
    'FAANG ve tech şirket mülakatlarına nasıl hazırlanılır? Algoritma soruları, sistem tasarımı, coding challenge''lar ve davranışsal mülakat ipuçları.',
    '## Tech Mülakat Süreci

Tech şirketlerinin mülakat süreci genellikle 4-6 aşamadan oluşur:

1. **Telefon Screening** (30-45 dk)
2. **Teknik Telefon Görüşmesi** (45-60 dk)
3. **Coding Challenge** (Take-home veya live)
4. **Onsite/Virtual Mülakat** (3-5 saat, 4-6 rounds)
5. **Hiring Manager Görüşmesi**
6. **Kültür Uyumu/Davranışsal**

## Algoritma ve Veri Yapıları

### Temel Konular

**1. Veri Yapıları:**
- Array ve String
- Linked List
- Stack ve Queue
- Hash Table
- Tree (Binary, BST, AVL)
- Heap
- Graph
- Trie

**2. Algoritmalar:**
- Searching (Binary Search, DFS, BFS)
- Sorting (Quick, Merge, Heap Sort)
- Dynamic Programming
- Greedy Algorithms
- Backtracking
- Divide and Conquer

### Çalışma Stratejisi

**Haftalık Plan (8 Hafta):**

**Hafta 1-2: Temel Veri Yapıları**
- Array/String: 15 problem
- Linked List: 10 problem
- Stack/Queue: 10 problem

**Hafta 3-4: Tree ve Graph**
- Binary Tree: 15 problem
- Binary Search Tree: 10 problem
- Graph: 15 problem

**Hafta 5-6: Dinamik Programlama**
- 1D DP: 10 problem
- 2D DP: 10 problem
- Advanced DP: 5 problem

**Hafta 7: Greedy ve Backtracking**
- Greedy: 10 problem
- Backtracking: 10 problem

**Hafta 8: Mock Interview ve Review**
- Tüm konuların tekrarı
- Mock interview''lar
- Zayıf noktaları çalışma

### En İyi Kaynaklar

**Problem Platformları:**
- **LeetCode:** 75 soru listesi (Blind 75)
- **HackerRank:** Interview preparation kit
- **CodeSignal:** Company-specific tracks
- **AlgoExpert:** Kapsamlı açıklamalı çözümler

**Kitaplar:**
- "Cracking the Coding Interview" - Gayle McDowell
- "Elements of Programming Interviews" - Aziz, Lee, Prakash
- "Introduction to Algorithms" - CLRS (Referans için)

### Problem Çözme Yaklaşımı

**UMPIRE Framework:**

1. **Understand:** Problemi anla
   - Inputlar nedir?
   - Outputlar nedir?
   - Edge case''ler neler?

2. **Match:** Pattern eşleştir
   - Hangi veri yapısı?
   - Daha önce benzer problem gördün mü?

3. **Plan:** Çözüm planla
   - Pseudocode yaz
   - Complexity''yi hesapla

4. **Implement:** Kod yaz
   - Temiz ve okunabilir
   - Değişken isimleri açıklayıcı

5. **Review:** Kontrol et
   - Edge case''leri test et
   - Syntax hatası var mı?

6. **Evaluate:** Değerlendir
   - Time complexity: O(?)
   - Space complexity: O(?)
   - Optimize edilebilir mi?

## Sistem Tasarımı Mülakatı

### Yaygın Sorular

1. URL Shortener tasarla (TinyURL)
2. Twitter/X benzeri sosyal platform
3. YouTube benzeri video platform
4. WhatsApp benzeri messaging uygulaması
5. Uber/Getir benzeri ride-sharing app
6. Rate Limiter tasarla
7. Web Crawler tasarla
8. Notification System tasarla

### Sistem Tasarım Yaklaşımı

**1. Requirements Clarification (5 dk)**
- Functional requirements
- Non-functional requirements
- Kullanıcı sayısı, ölçek
- Read vs Write ratio

**2. Back-of-envelope Estimation (5 dk)**
- QPS (Queries per second)
- Storage needs
- Bandwidth
- Memory/Cache

**3. High-level Design (10-15 dk)**
- API design
- Database schema
- Core components
- System flow

**4. Deep Dive (15-20 dk)**
- Scaling stratejileri
- Bottleneck''ları çözme
- Caching stratejisi
- Load balancing

**5. Wrap Up (5 dk)**
- Trade-off''ları tartış
- Monitoring ve alerting
- Deployment stratejisi

### Temel Kavramlar

**Scalability:**
- Horizontal vs Vertical scaling
- Load balancing
- Caching (Redis, Memcached)
- CDN
- Database sharding
- Microservices

**Reliability:**
- Replication
- Failover
- Backup strategies

**Performance:**
- Indexing
- Caching layers
- Async processing
- Message queues

### Kaynaklar

- **Grokking the System Design Interview** (educative.io)
- **System Design Primer** (GitHub)
- **Designing Data-Intensive Applications** - Martin Kleppmann
- **ByteByteGo** YouTube kanalı

## Davranışsal Mülakat

### STAR Metodu

**S**ituation: Durum
**T**ask: Görev
**A**ction: Aksiyon
**R**esult: Sonuç

### Yaygın Sorular ve Cevap Örnekleri

**1. "Tell me about a time you had a conflict with a teammate"**

**STAR Cevap:**
```
Situation: Önceki şirketimde, bir feature''ın implementation yaklaşımı konusunda senior developer ile anlaşmazlık yaşadık.

Task: Deadline''ı kaçırmadan, en iyi teknik çözümü bulmak gerekiyordu.

Action:
- İkimizin de yaklaşımını detaylı şekilde dokümante ettik
- Pros/cons listesi çıkardık
- Tech lead''e sunarak objektif görüş aldık
- Sonunda hybrid bir yaklaşım geliştirdik

Result: Hem deadline''ı tuttuk, hem de her iki yaklaşımın da iyi yönlerini birleştirerek %30 daha performanslı bir çözüm elde ettik. Bu deneyim bana farklı perspektiflerin değerini öğretti.
```

**2. "Tell me about your biggest failure"**

**İyi Cevap Yapısı:**
- Gerçek bir başarısızlık seçin
- Sorumluluğu kabul edin
- Ne öğrendiğinizi vurgulayın
- Nasıl geliştirdiğinizi gösterin

**3. "Why do you want to work here?"**

**Hazırlık:**
- Şirket kültürünü araştırın
- Ürünlerini kullanın
- Tech blog okuyun
- Son haberleri takip edin

### Hazırlanmanız Gereken 10 Soru

1. Tell me about yourself
2. Why this company?
3. Biggest strength/weakness
4. Conflict resolution
5. Leadership experience
6. Failure and learning
7. Challenging project
8. Tight deadline experience
9. Disagreement with manager
10. Questions for interviewer

## Mock Interview''lar

### Platformlar

- **Pramp:** Ücretsiz peer mock interview
- **interviewing.io:** Anonymous interview
- **Gainlo:** Experienced interviewers
- **Exponent:** System design focus

### Arkadaşınızla Mock Interview

**Tavsiyeler:**
- Real interview gibi davranın
- 45-60 dk ayırın
- Gerçek problemler kullanın
- Feedback alın ve verin
- Kayıt edin (izin alarak)

## Mülakat Günü İpuçları

### Öncesi (1 Gün)

- Erken uyuyun
- Stresli konuları çalışmayın
- Ekipmanı test edin
- Notlar hazırlayın
- Şirket hakkında son review

### Mülakat Sırasında

**Do:**
- Yüksek sesle düşünün
- Sorular sorun
- Clarification isteyin
- Test case''leri düşünün
- Trade-off''ları tartışın

**Don''t:**
- Hemen kod yazmaya başlamayın
- Sessiz kalmayın
- "Bilmiyorum" deyip geçmeyin
- Defensive olmayın
- Hint almayı reddetmeyin

### Sonrası

- Thank you email gönderin (24 saat içinde)
- Follow-up zamanlama sorun
- Notlarınızı yazın
- Neyi iyi/kötü yaptığınızı değerlendirin

## Red Flags - Kaçınılması Gerekenler

**Kod Yazarken:**
- Variable isimleri: a, b, c
- Global variables
- Hard-coded values
- Error handling yok
- Edge case testleri yok

**İletişimde:**
- Arrogant davranış
- Hint almayı reddetme
- Feedback''e kapalı olma
- Interview''ı monolog yapma

## Rejectly Mülakat Hazırlık

Rejectly ile:
- Şirkete özel CV optimizasyonu
- Pozisyon bazlı beceri vurgulama
- STAR metoduyla başarı hikayesi oluşturma
- Mock interview questions hazırlama

[Mülakat hazırlığına başlayın](/dashboard)

## Sonuç

Tech mülakat hazırlığı bir maraton, sprint değil. Düzenli çalışma, mock interview''lar ve gerçek problemleri çözme deneyimi, başarınızı garantiler.

**Ortalama Hazırlık Süresi:**
- Entry-level: 2-3 ay
- Mid-level: 1-2 ay
- Senior: 3-4 hafta

Unutmayın: Her başarısız mülakat bir öğrenme fırsatıdır. Devam edin!',
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&h=630&fit=crop',
    'Kod yazan yazilimci',
    interview_prep_id,
    'Rejectly Team',
    true,
    NOW(),
    18,
    'Yazılım Mülakat Hazırlığı: FAANG Rehberi 2025 | Rejectly',
    'Tech mülakat''larına nasıl hazırlanılır? Algoritma, sistem tasarımı, davranışsal sorular ve coding challenge ipuçlarıyla FAANG mülakatlarını kazanın.',
    ARRAY['mülakat', 'yazılım', 'algoritma', 'sistem tasarımı', 'FAANG', 'tech interview']
  ) RETURNING id INTO post_id;

  INSERT INTO blog_post_tags (post_id, tag_id)
  VALUES (post_id, tech_industry_tag_id), (post_id, job_search_tag_id);

END $$;
