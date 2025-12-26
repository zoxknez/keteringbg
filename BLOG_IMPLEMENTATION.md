# Blog Funkcionalnost - Implementacija

## Implementirane Funkcije

### 1. **Baza Podataka (Prisma Schema)**
Dodati modeli:
- `BlogPost` - glavni model za blog postove
  - Osnovne informacije (naslov, slug, sadržaj, excerpt)
  - Kategorije (NEWS, RECIPES, EVENTS, TIPS, BEHIND_SCENES)
  - Tagovi za lakše pretraživanje
  - SEO polja (metaTitle, metaDescription)
  - Status objave (isPublished, publishedAt)
  - Veza sa autorom (Admin)

- `VideoEmbed` - model za video klipove
  - Podrška za YouTube, TikTok, Instagram, Vimeo, Facebook
  - Pozicija za sortiranje videa
  - Automatsko brisanje sa postom (onDelete: Cascade)

### 2. **Admin Panel**
- **Lista blog postova** (`/admin/blog`)
  - Prikaz svih postova sa osnovnim informacijama
  - Filter po kategorijama
  - Indikator za broj video klipova
  - Status objave (Published/Draft)
  
- **Kreiranje novog posta** (`/admin/blog/new`)
  - Rich forma za unos svih detalja
  - Auto-generisanje slug-a iz naslova
  - Dodavanje video klipova sa različitih platformi
  - Upravljanje tagovima
  - SEO optimizacija
  - Odabir slike iz Media biblioteke

- **Izmena postojećeg posta** (`/admin/blog/[id]`)
  - Sve funkcije kao kod kreiranja
  - Mogućnost brisanja posta

### 3. **Video Embed Sistem**
**Podržane platforme:**
- **YouTube** - Automatska ekstrakcija ID-a iz URL-a
- **TikTok** - Podrška za javne TikTok videe
- **Instagram** - Instagram Reels i video postovi
- **Vimeo** - Vimeo player integracija
- **Facebook** - Facebook javni video postovi

**Funkcionalnost:**
- Automatsko parsiranje URL-a u video ID
- Drag-and-drop redosled videa
- Preview pozicija u postu
- Responsive embed playeri

### 4. **Javne Stranice**
- **Blog pregled** (`/[locale]/blog`)
  - Grid prikaz svih objavljenih postova
  - Filter po kategorijama (sticky navigacija)
  - Prikaz cover slike ili placeholder-a
  - Indikator broja video klipova
  - Tagovi i meta informacije
  - Procena vremena čitanja

- **Pojedinačni post** (`/[locale]/blog/[slug]`)
  - Potpun prikaz sadržaja
  - Hero sekcija sa cover slikom
  - Svi ugrađeni video klipovi
  - Tagovi
  - Meta informacije (autor, datum, vreme čitanja)
  - SEO optimizovano
  - Social sharing meta tags

### 5. **API Routes**
- `GET /api/admin/blog` - Lista svih postova (sa filterima)
- `POST /api/admin/blog` - Kreiranje novog posta
- `GET /api/admin/blog/[id]` - Detalji pojedinačnog posta
- `PUT /api/admin/blog/[id]` - Izmena posta
- `DELETE /api/admin/blog/[id]` - Brisanje posta

### 6. **Prevodi**
Dodati prevodi za sve tri jezika (sr, en, ru):
- Blog navigacija
- Kategorije
- Meta informacije
- Poruke

## Korišćenje

### Kreiranje Blog Posta

1. Ulogujte se u admin panel
2. Idite na **Blog** u bočnoj navigaciji
3. Kliknite **Novi Post**
4. Popunite:
   - Naslov (slug se automatski generiše)
   - Kategoriju
   - Kratak opis (excerpt)
   - Sadržaj
   - Naslovna slika (iz Media biblioteke)
5. Dodajte video klipove:
   - Izaberite platformu
   - Zalepite URL ili unesite ID
   - Kliknite + da dodate
6. Dodajte tagove po potrebi
7. Popunite SEO polja (opciono)
8. Označite "Objavi odmah" ako želite da post bude odmah dostupan
9. Kliknite **Kreiraj Post**

### Dodavanje Video Klipova

**YouTube:**
```
URL: https://www.youtube.com/watch?v=VIDEO_ID
ili: https://youtu.be/VIDEO_ID
ili samo: VIDEO_ID
```

**TikTok:**
```
URL: https://www.tiktok.com/@username/video/VIDEO_ID
ili samo: VIDEO_ID
```

**Instagram:**
```
URL: https://www.instagram.com/p/POST_ID/
ili: https://www.instagram.com/reel/REEL_ID/
ili samo: POST_ID
```

**Vimeo:**
```
URL: https://vimeo.com/VIDEO_ID
ili samo: VIDEO_ID
```

**Facebook:**
```
Puna URL adresa Facebook videa
```

## Migracija Baze Podataka

Za aktiviranje novih modela u bazi:

```bash
npx prisma migrate dev --name add-blog-models
```

ili

```bash
npx prisma db push
```

## Tehnički Detalji

- **Autentifikacija**: Potrebna admin autentifikacija za sve admin rute
- **Validacija**: Slug mora biti jedinstven
- **Cascading Delete**: Brisanje posta automatski briše sve povezane video embede
- **Responsive**: Sve stranice su responsive
- **SEO**: Open Graph i Twitter Card meta tagovi
- **Performanse**: Server-side rendering za javne stranice

## Budući Razvoj (Opciono)

Moguća poboljšanja:
- Rich text editor (Markdown ili WYSIWYG)
- Komentari na postove
- Lajkovi/reakcije
- Related posts
- Full-text pretraga
- RSS feed
- Newsletter integracija
- Draft auto-save
- Scheduled publishing
- Image optimization
