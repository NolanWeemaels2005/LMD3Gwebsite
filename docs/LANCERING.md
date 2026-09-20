# Lancering: Combell-domein met GitHub Pages

De website is voorbereid op **https://lamaisondestroisgarçons.be/**.
De technische DNS-/GitHub-schrijfwijze van exact dezelfde domeinnaam is
`xn--lamaisondestroisgarons-i7b.be`.

De onderstaande accountinstellingen worden niet door een lokale build gewijzigd.
Op 20 september 2026 wees de publieke A-record nog naar `217.21.190.139`
in plaats van GitHub Pages. Controleer de actuele records vóór de omschakeling.

## 1. GitHub Pages instellen

Open de repository [NolanWeemaels2005/LMD3Gwebsite](https://github.com/NolanWeemaels2005/LMD3Gwebsite/settings/pages).

- Kies bij **Settings → Pages → Build and deployment** de bron **GitHub Actions**.
- Vul bij **Custom domain** `xn--lamaisondestroisgarons-i7b.be` in en sla op.
- Het bestand `public/CNAME` documenteert het domein, maar bij onze Actions-deployment
  stelt dit bestand de domeinkoppeling **niet** in. De instelling hierboven is nodig.
- GitHub biedt onder je account **Settings → Pages** ook domeinverificatie via een
  persoonlijke TXT-record aan. Neem de exacte naam en waarde uit GitHub over.

[Officiële GitHub-instructies](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## 2. DNS bij Combell

Open het Combell-controlepaneel, selecteer de geregistreerde domeinnaam en ga naar
**DNS & forwarding → DNS-records**. Bewaar eerst de bestaande website-records zodat
je een eerdere instelling kunt terugzetten. Gebruik de bestaande Combell-nameservers.

Vervang de huidige A-record(s) voor het hoofddomein door deze vier records:

| Type | Naam | Waarde |
| --- | --- | --- |
| A | `@` / leeg hoofddomein | `185.199.108.153` |
| A | `@` / leeg hoofddomein | `185.199.109.153` |
| A | `@` / leeg hoofddomein | `185.199.110.153` |
| A | `@` / leeg hoofddomein | `185.199.111.153` |
| CNAME | `www` | `nolanweemaels2005.github.io` |

De CNAME-waarde bevat geen `https://` en geen `/LMD3Gwebsite`.
Vervang een conflicterende website-record op `www` door deze CNAME.
Als er al AAAA-records voor het hoofddomein bestaan, moeten ook die naar GitHub
wijzen of worden verwijderd; oude IPv6-records kunnen bezoekers naar de oude host sturen.
Optionele GitHub-AAAA-waarden zijn `2606:50c0:8000::153`, `2606:50c0:8001::153`,
`2606:50c0:8002::153` en `2606:50c0:8003::153`.
Laat mailrecords (MX), SPF, DKIM en andere niet-website-records staan.

[Combell: DNS-records wijzigen](https://www.combell.com/nl/help/kb/wat-zijn-dns-records-en-hoe-kan-ik-mijn-dns-instellingen-wijzigen/).

## 3. De nieuwe versie publiceren

Na het instellen van het domein en DNS:

1. Voer lokaal `npm run build` uit. Dit controleert TypeScript en genereert 24 pagina’s.
2. Controleer de wijzigingen en publiceer ze naar `main` in GitHub.
3. Wacht tot **Actions → Deploy website to GitHub Pages** succesvol voltooid is.
4. Wacht tot GitHub de DNS herkent en een certificaat heeft uitgegeven. Schakel
   **Settings → Pages → Enforce HTTPS** in zodra dit beschikbaar is. GitHub vermeldt
   dat dit tot 24 uur kan duren.
5. Controleer zowel `https://lamaisondestroisgarçons.be/` als
   `https://www.lamaisondestroisgarçons.be/`; de tweede hoort naar het hoofddomein te leiden.

De build gebruikt nu `/` als basis. Publiceer deze versie samen met de domeininstelling;
de oude GitHub-project-URL met `/LMD3Gwebsite/` is niet langer de canonieke website-URL.

## 4. Zoekmachines na livegang

- Voeg het domein toe aan [Google Search Console](https://search.google.com/search-console/)
  en verifieer de door Google opgegeven TXT-record via Combell.
- Dien `https://xn--lamaisondestroisgarons-i7b.be/sitemap.xml` in.
- Gebruik URL-inspectie voor de homepage, `/pluspunten/` en `/activiteiten/` en vraag
  indexering aan. Controleer ook `/fr/` en `/en/`.
- Controleer indexering, zoektermen en Core Web Vitals na voldoende echte bezoeken.
- Laat relevante bestaande vermeldingen van het vakantiehuis naar het nieuwe domein verwijzen.
  Houd informatie over voorzieningen actueel en voeg alleen echte, verifieerbare inhoud toe.

De URL bepaalt de taal: Nederlands op `/`, Frans op `/fr/`, Engels op `/en/`.
Elke versie heeft eigen HTML, metadata, canonical en wederzijdse `hreflang`-links.
De sitemap bevat alle 24 pagina’s. Schema.org beschrijft de accommodatie en bevestigde
voorzieningen; er worden geen prijzen, maximale bezetting, coördinaten of beoordelingen verzonnen.
Er wordt geen Google-vakantiewoningenvermelding of bepaalde zoekpositie beloofd.

[Google over meertalige websites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites).

## 5. Controle na omschakelen

- Open de homepage en alle menu-items rechtstreeks en na herladen.
- Controleer NL/FR/EN, de datumkiezer en de mobiele menu-open-/sluitactie.
- Controleer op een echte iPhone en Android-telefoon ook het scrollen terwijl de
  browserbalk inklapt en weer verschijnt; browseremulatie bootst dit niet volledig na.
- Voer zelf één herkenbare reserveringstest uit en controleer ontvangst bij de beheerder.
  Geautomatiseerde tests onderscheppen de verzending en bewijzen geen e-mailbezorging.
- Als Formspree toegestane domeinen beperkt, voeg het nieuwe domein daar toe.
- Controleer `/robots.txt`, `/sitemap.xml` en een niet-bestaande URL (HTTP 404).
- De brochuresectie en PDF zijn verwijderd. Een kopie die een bezoeker eerder heeft
  gedownload, kan uiteraard niet uit diens opslag worden verwijderd.

## Reproduceerbare lokale controles

```sh
npm run build
npm run test:qa -- tests/seo.spec.ts tests/mobile-release.spec.ts tests/header-contrast.spec.ts tests/language-position.spec.ts
```

De testconfiguratie start de lokale ontwikkelserver op poort 5173 en de
productiepreview op poort 4181. Bouw opnieuw na bronwijzigingen voordat je de
productiecontroles uitvoert. De kalender- en verzendtests gebruiken onderschepte
Formspree-verzoeken en sturen geen berichten naar de beheerder.
