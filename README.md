# KM-Konverterare & GPS

Ett webbverktyg för att konvertera mellan järnvägs- (RW) och motorvägs- (MW) kilometerpunkter, samt visa närmaste position utifrån GPS.

🔗 **Live-demo:**  
[https://td-rebecka.github.io/kmm-conversion/](https://td-rebecka.github.io/kmm-conversion/)

## ✨ Funktioner

- 🔁 Konvertera KM mellan järnväg och motorväg
- 📍 Hitta närmaste punkt baserat på din GPS-position
- 🗺️ Interaktiv karta med Leaflet
- 📜 Historik över senaste konverteringar

## 🧾 Filer

| Fil           | Beskrivning                              |
|---------------|------------------------------------------|
| `index.html`  | Startsida och struktur                   |
| `style.css`   | Stilmall för design                      |
| `script.js`   | JavaScript för logik och karta           |
| `km_match.json` | Dataset med koordinater & KM-punkter  |

## 🛠️ Teknik

- HTML, CSS, JavaScript
- Leaflet.js (för karta)
- Haversine-algoritm för avståndsberäkning
- GitHub Pages för publicering

## 🧪 Så här kör du lokalt

1. Klona repo:
   ```bash
   git clone https://github.com/td-rebecka/kmm-conversion.git
   cd kmm-conversion
