# KMM‑Konverterare & GPS

Ett webbverktyg för att konvertera mellan järnvägs- (RW) och motorvägs- (MW) kilometerpunkter, samt visa närmaste punkt baserat på din GPS-position – direkt på karta.

🔗 **Live-demo:**  
[https://td-rebecka.github.io/kmm-conversion/](https://td-rebecka.github.io/kmm-conversion/)

---

## ✨ Funktioner

- 🔁 Konvertera KM mellan Järnväg (RW) ↔ Motorväg (MW)
- 📍 Visa närmaste punkt baserat på GPS-position
- 🗺️ Interaktiv karta via Leaflet (Esri Light Gray)
- 📜 Historik över senaste konverteringar
- 🧭 Visning av aktuellt spann (första/sista KM RW & MW)
- 📱 Mobilanpassad layout

---

## 📂 Filer

| Fil                 | Beskrivning                                 |
|----------------------|---------------------------------------------|
| `index.html`         | Huvudsida och layoutstruktur                |
| `style.css`          | Stilmall för responsiv design               |
| `script.js`          | JavaScript för konvertering, karta & GPS   |
| `km_match_close.json`| Dataset med lat/lon och KM_RW / KM_MW      |
| `ÖSB_logga.png`      | Logotyp som visas högst upp                 |

---

## 🛠️ Teknik

- **HTML, CSS, JavaScript**
- **Leaflet.js** (interaktiv karta)
- **Esri World Light Gray** som bakgrundskarta
- **Haversine-algoritm** för avståndsberäkning
- **GitHub Pages** för publicering

---

## 🧪 Så här kör du lokalt

1. Klona repo:
   ```bash
   git clone https://github.com/td-rebecka/kmm-conversion.git
   cd kmm-conversion
2. Starta lokal utvecklingsserver, exempelvis med Python:
   python -m http.server
3. Öppna i webbläsare:
   http://localhost:8000
