const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const API = 'https://api.wheretheiss.at/v1/satellites/25544';
let marker = null;

async function updateISS() {
  const status = document.getElementById('status');
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const d = await res.json();
    const pos = [d.latitude, d.longitude];

    if (!marker) {
      marker = L.marker(pos).addTo(map);
      map.setView(pos, 3);
    } else {
      marker.setLatLng(pos);
    }
    status.textContent = '';
  } catch (err) {
    console.error(err);
    status.textContent = 'Connection problem, retrying...';
  }
}

updateISS();
setInterval(updateISS, 5000);