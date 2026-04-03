const API = '/api';
const cityInput = document.getElementById('cityInput');
const btnCheck = document.getElementById('btnCheck');
const btnSub = document.getElementById('btnSub');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const subStatus = document.getElementById('subStatus');

btnCheck.onclick = async () => {
  const city = cityInput.value.trim();
  if (!city) return alert('Enter a city name');
  loading.classList.remove('hidden');
  results.classList.add('hidden');
  try {
    const res = await fetch(`${API}/heat-stress?city=${encodeURIComponent(city)}`);
    if (!res.ok) throw new Error('City not found');
    const d = await res.json();
    showResults(d);
  } catch (e) { alert(e.message); }
  loading.classList.add('hidden');
};

function showResults(d) {
  results.classList.remove('hidden');
  const banner = document.getElementById('riskBanner');
  banner.style.background = `${d.risk.color}22`;
  banner.style.borderColor = d.risk.color;
  document.getElementById('riskLevel').textContent = `${d.risk.icon} ${d.risk.level} RISK`;
  document.getElementById('riskLevel').style.color = d.risk.color;
  document.getElementById('riskMessage').textContent = d.risk.message;
  document.getElementById('metricTemp').textContent = `${d.temperature}°C`;
  document.getElementById('metricHumidity').textContent = `${d.humidity}%`;
  document.getElementById('metricHeatIndex').textContent = `${d.heatIndex}°C`;
  document.getElementById('metricWBGT').textContent = `${d.wbgt}°C`;
  const list = document.getElementById('recList');
  list.innerHTML = '';
  d.risk.recommendations.forEach(r => list.innerHTML += `<li>⚠️ ${r}</li>`);
}

btnSub.onclick = async () => {
  const phone = document.getElementById('subPhone').value.trim();
  const city = cityInput.value.trim() || 'Dubai';
  if (!phone) return showSub('Enter WhatsApp number', 'error');
  showSub('Subscribing...', 'success');
  try {
    const res = await fetch(`${API}/subscribe`, {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ phoneNumber: phone, city, name: 'Web User' })
    });
    const d = await res.json();
    showSub(d.success ? '✅ Subscribed! Alerts will arrive every 30 mins.' : '❌ Failed', d.success ? 'success' : 'error');
  } catch { showSub('❌ Network error', 'error'); }
};

function showSub(msg, type) {
  subStatus.textContent = msg;
  subStatus.className = `status ${type}`;
  subStatus.classList.remove('hidden');
}