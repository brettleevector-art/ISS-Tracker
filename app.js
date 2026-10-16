const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const API = 'https://api.wheretheiss.at/v1/satellites/25544';
let marker = null;





const MAX_POINTS = 500;
const points = [];
const trail = L.polyline([], { color: '#00cc66', weight: 2 }).addTo(map);

function updateTrail(pos) {
  points.push(pos);
  if (points.length > MAX_POINTS) points.shift();

  const segments = [[]];
  for (const p of points) {
    const seg = segments[segments.length - 1];
    const prev = seg[seg.length - 1];
    if (prev && Math.abs(p[1] - prev[1]) > 180) {
      segments.push([p]);
    } else {
      seg.push(p);
    }
  }
  trail.setLatLngs(segments);
}



async function updateISS() {
  const status = document.getElementById('status');
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const d = await res.json();
    const pos = [d.latitude, d.longitude];

        updateTrail(pos);
            document.getElementById('lat').textContent = d.latitude.toFixed(2);
            document.getElementById('lon').textContent = d.longitude.toFixed(2);
            document.getElementById('alt').textContent = d.altitude.toFixed(0);
            document.getElementById('vel').textContent = Math.round(d.velocity).toLocaleString();
            document.getElementById('time').textContent =
             new Date(d.timestamp * 1000).toLocaleTimeString();



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

async function loadCrew() {
  const list = document.getElementById('crew');
  try {
    const res = await fetch('http://api.open-notify.org/astros.json');
    const data = await res.json();
    const iss = data.people.filter(p => p.craft === 'ISS');
    list.innerHTML = iss.map(p => `<li>${p.name}</li>`).join('');
  } catch (err) {
    list.innerHTML = '<li>Crew list unavailable</li>';
  }
}
loadCrew();


navigator.geolocation.getCurrentPosition(
  pos => console.log('You are at', pos.coords.latitude, pos.coords.longitude),
  err => console.log('Location denied', err)
);