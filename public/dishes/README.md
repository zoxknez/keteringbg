# 📸 Slike Jela

Ovde ubacite slike vaših jela. Kada dodate lokalne slike, ažurirajte `seed.ts` fajl da koristi lokalne putanje umesto Unsplash URL-ova.

## Preporučeni nazivi fajlova

### Meni 1 (500 RSD)
- `gulas-svinjski.jpg`
- `gulas-pileci.jpg`
- `grasak-svinjetina.jpg`
- `grasak-piletina.jpg`
- `muckalica-svinjska.jpg`
- `muckalica-pileca.jpg`
- `krompir-paprikas-svinjski.jpg`
- `krompir-paprikas-pileci.jpg`
- `vojnicki-pasulj.jpg`
- `corbast-pasulj.jpg`
- `boranija-svinjetina.jpg`
- `boranija-piletina.jpg`
- `musaka.jpg`
- `musaka-piletina.jpg`
- `pilav.jpg`
- `peceni-batak.jpg`
- `pohovano-belo-meso.jpg`
- `pileci-file-sampinjoni.jpg`
- `gibanica.jpg`
- `podvarak-batak.jpg`
- `podvarak-svinjetina.jpg`
- `pilece-cufte.jpg`
- `posna-sarma.jpg`
- `prebranac-kobasica.jpg`
- `prebranac-posni.jpg`

### Meni 2 (650 RSD) - dodatne slike
- `gulas-juneci.jpg`
- `becka-snicla.jpg`
- `punjene-paprike.jpg`
- `sarma.jpg`
- `pastrmka.jpg`
- `pileci-file-pomorandza.jpg`
- `laks-kare.jpg`
- `lazanje.jpg`
- `tortilja.jpg`
- `bauk-piletina.jpg`

### Meni 3 (750 RSD) - dodatne slike
- `svadbarski-kupus.jpg`
- `snicla-pivo.jpg`
- `mlinci.jpg`
- `rostilj.jpg`
- `cufte-paradajz.jpg`
- `karadjordjeva.jpg`

## Preporučene dimenzije
- **Rezolucija:** 800x600px (4:3 aspect ratio)
- **Format:** JPG ili WebP
- **Veličina:** ispod 200KB po slici

## Kako koristiti lokalne slike

Kada dodate slike, ažurirajte funkciju `getImageUrl` u `prisma/seed.ts`:

```typescript
const getImageUrl = (slug: string) => {
  // Koristite lokalne slike
  return `/dishes/${slug}.jpg`
}
```

Zatim ponovo pokrenite seed:
```bash
npx tsx prisma/seed.ts
```
