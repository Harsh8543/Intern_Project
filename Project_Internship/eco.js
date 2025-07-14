let lastPos = null;
const status = document.getElementById("status");
const co2 = document.getElementById("co2");
const batteryEl = document.getElementById("battery");
navigator.geolocation.watchPosition(
  pos => {
    const { latitude, longitude, speed } = pos.coords;
    status.textContent = `📍 Location: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

    let spd = speed;
    if (!spd && lastPos) {
      const dist = getDistanceFromLatLonInKm(lastPos.lat, lastPos.lon, latitude, longitude);
      const time = (Date.now() - lastPos.time) / 1000 / 3600; 
      spd = dist / time;
    }
    lastPos = { lat: latitude, lon: longitude, time: Date.now() };
    let emission = 0;
    let mode = '🌱 Walking';
    if (spd > 25) {
      emission = (spd / 60) * 150; 
      mode = '🚗 Driving';
    } else if (spd > 6) {
      emission = (spd / 60) * 60; 
      mode = '🛴 Light Vehicle';
    }
    co2.textContent = `${mode} – Estimated CO₂: ${emission.toFixed(1)}g`;
  },
  err => {
    status.textContent = " Location access denied";
  },
  { enableHighAccuracy: true }
);
navigator.getBattery?.().then(batt => {
  function updateBattery() {
    batteryEl.textContent = `🔋 Battery: ${(batt.level * 100).toFixed(0)}% ${batt.charging ? '(Charging)' : ''}`;
    if (batt.level < 0.2 && !batt.charging) {
      batteryEl.textContent += ' ⚠️ Low battery, avoid high-speed travel';
    }
  }
  updateBattery();
  batt.addEventListener('levelchange', updateBattery);
  batt.addEventListener('chargingchange', updateBattery);
});
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
