// Kör när dokumentet är redo
document.addEventListener("DOMContentLoaded", () => {
  // Globala variabler
  let data = [];
  let map, userMarker, nearestMarker;
  let gpsPosition = null;
  const history = [];

  // Definiera ikoner
  const iconNearest = new L.Icon.Default();
  const iconConversion = new L.Icon.Default();

  // Ladda JSON-data
  fetch("km_match.json")
    .then((res) => res.json())
    .then((json) => (data = json))
    .catch(() => alert("Misslyckades att läsa data"));

  // Koppla knappen till funktionen
  document.getElementById("convertBtn").addEventListener("click", () => {
    convertKMInput(true);
  });

  // Haversine: beräkna avstånd i meter
  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371000,
      rad = (d) => (d * Math.PI) / 180;
    const dLat = rad(lat2 - lat1),
      dLon = rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // Initiera kartan med Esri Gray (light)
  function initMap(lat, lon) {
    if (!map) {
      map = L.map("map").setView([lat, lon], 13);
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Tiles © Esri", maxZoom: 16 }
      ).addTo(map);
    }
    if (userMarker) map.removeLayer(userMarker);
    userMarker = L.circleMarker([lat, lon], { color: "blue", radius: 6 })
      .addTo(map)
      .bindPopup("Din position")
      .openPopup();
  }

  // Hitta närmaste punkt i data
  function findClosest(lat, lon) {
    let best = null,
      minDist = Infinity;
    data.forEach((d) => {
      if (d.lat !== undefined && d.lon !== undefined) {
        const dist = haversine(lat, lon, d.lat, d.lon);
        if (dist < minDist) {
          minDist = dist;
          best = { ...d, dist };
        }
      }
    });
    return best || { ...data[0], dist: null };
  }

  // Uppdatera historik-tabellen med senaste 5 träffar
  function updateHistory(rw, mw) {
    history.unshift({ rw, mw });
    if (history.length > 5) history.pop();
    const tbody = document.querySelector("#conversionHistory tbody");
    tbody.innerHTML = "";
    history.forEach((h) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${h.rw}</td><td>${h.mw}</td>`;
      tbody.appendChild(tr);
    });
  }

  // Visa position + närmaste punkt
  function handlePosition(pos) {
    const lat = pos.coords.latitude,
      lon = pos.coords.longitude;
    gpsPosition = { lat, lon };
    document.getElementById("gpsLocation").innerText = `Position: ${lat.toFixed(
      5
    )}, ${lon.toFixed(5)}`;
    initMap(lat, lon);

    const nearest = findClosest(lat, lon);
    if (!nearest) {
      document.getElementById("result").innerText = "Inga data!";
      return;
    }

    if (nearestMarker) map.removeLayer(nearestMarker);

    nearestMarker = L.marker([nearest.lat, nearest.lon], { icon: iconNearest })
      .addTo(map)
      .bindPopup(
        `Närmsta punkt:<br>RW: ${nearest.KM_RW} ↔ MW: ${nearest.KM_MW}`
      )
      .openPopup();

    map.setView([nearest.lat, nearest.lon], 13);

    const distText =
      nearest.dist !== null ? `${nearest.dist.toFixed(1)} m bort` : "";
    document.getElementById(
      "result"
    ).innerText = `Närmaste punkt ${distText}\nRW: ${nearest.KM_RW} ↔ MW: ${nearest.KM_MW}`;
    updateHistory(nearest.KM_RW, nearest.KM_MW);
  }

  // Konvertera manuellt inmatat KM-värde och visa punkt
  function convertKMInput(showOnMap = true) {
    const val = parseFloat(document.getElementById("inputKM").value);
    if (isNaN(val)) return;

    const closest = data.reduce((prev, curr) => {
      const d1 = Math.abs(val - prev.KM_RW),
        d2 = Math.abs(val - prev.KM_MW);
      const c1 = Math.abs(val - curr.KM_RW),
        c2 = Math.abs(val - curr.KM_MW);
      return Math.min(c1, c2) < Math.min(d1, d2) ? curr : prev;
    }, data[0] || {});

    const isRW = Math.abs(val - closest.KM_RW) < Math.abs(val - closest.KM_MW);
    const matchText = isRW
      ? `RW ${closest.KM_RW} → MW ${closest.KM_MW}`
      : `MW ${closest.KM_MW} → RW ${closest.KM_RW}`;

    document.getElementById("result").innerText = `Konvertering:\n${matchText}`;
    updateHistory(closest.KM_RW, closest.KM_MW);

    // Lägg till säkerhetskontroll
    if (
      showOnMap &&
      typeof closest.lat === "number" &&
      typeof closest.lon === "number"
    ) {
      if (nearestMarker) map.removeLayer(nearestMarker);
      nearestMarker = L.marker([closest.lat, closest.lon], {
        icon: iconConversion,
      })
        .addTo(map)
        .bindPopup(
          `Konverterad punkt:<br>RW ${closest.KM_RW} ↔ MW ${closest.KM_MW}`
        )
        .openPopup();

      map.setView([closest.lat, closest.lon], 13);
    }
  }

  // Växla mellan lägen
  window.setViewMode = function (mode) {
    if (mode === "gps" && gpsPosition)
      handlePosition({
        coords: { latitude: gpsPosition.lat, longitude: gpsPosition.lon },
      });
    else if (mode === "input") convertKMInput(true);
  };

  // Hämta GPS-position vid sidladdning
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(handlePosition);
  else document.getElementById("gpsLocation").innerText = "GPS ej tillgängligt";
});
