if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
const canvas   = document.getElementById('map');
const ctx      = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const log      = document.getElementById('log');
drawGrid();

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#ddd';
  for (let i = 0; i <= canvas.width; i += 40) {
    ctx.beginPath(); ctx.moveTo(i, 0);           ctx.lineTo(i, canvas.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i);           ctx.lineTo(canvas.width, i);  ctx.stroke();
  }
}
let watchId = null;
startBtn.addEventListener('click', () => {
  if (!('geolocation' in navigator)) { alert('Geolocation not supported'); return; }

  if (watchId === null) {                // ➜ start
    watchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        plotPoint(coords.latitude, coords.longitude);
        log.insertAdjacentHTML('afterbegin',
          `<li>${new Date().toLocaleTimeString()} – ${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}</li>`);
      },
      err => alert(err.message),
      { enableHighAccuracy: true }
    );
    startBtn.textContent = 'Stop Tracking';
  } else {                              
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    startBtn.textContent = 'Start Tracking';
  }
});

let origin = null;         

function plotPoint(lat, lon) {
  if (!origin) origin = { lat, lon };

  const scale = 100000;

  const x = canvas.width  / 2 + (lon - origin.lon) * scale;
  const y = canvas.height / 2 - (lat - origin.lat) * scale;

  ctx.fillStyle = '#ff5722';
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill();
}

const conn      = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
const statusEl  = document.getElementById('net-status');
function updateConn() {
  if (!conn) { statusEl.textContent = 'Network Information API not supported'; return; }
  statusEl.textContent = `Network: ${conn.effectiveType || conn.type}, ${conn.downlink} Mb/s`;
}
updateConn();
conn && conn.addEventListener('change', updateConn);
const lazyImgs = document.querySelectorAll('img.lazy');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.src = e.target.dataset.src;
        io.unobserve(e.target);
      }
    });
  });
  lazyImgs.forEach(img => io.observe(img));
}
