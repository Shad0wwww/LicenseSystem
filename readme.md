### Todo

- [x] Gem en **hashed** license key i databasen, mens brugeren får den rå (plaintext) key udleveret
- [x] Brug **JWT** til at gemme brugerens ID lokalt i en cookie

- [ ] Lav et emailsystem, der kan sende license keys til brugere

  - [ ] Husk rate limiting på endpointet
  - [ ] Lav et pænt / brugervenligt email-design (HTML mail)

- [ ] Overvej at erstatte Discord-login med email + engangskode (magic link / one-time code)
  - [ ] Undersøg mulighed for Google OAuth-integration som alternativ

- [ ] Find en sikker måde at lave forbindelse mellem klient og API
  - [ ] Sørg for **SSL/TLS** (HTTPS) overalt
  - [ ] Overvej evt. **mTLS** / client certificate eller API key + IP whitelisting (afhængig af trusselsmodel)

- [ ] Sæt en begrænsning på maks. antal licenser / maskiner pr. bruger

- [ ] Undersøg HWID (Hardware ID) metoder
  - Hvilke værdier kan kombineres stabilt?
  - Hvor meget ændrer de sig ved Windows geninstallation / hardware opgradering?
  - Privacy / GDPR overvejelser