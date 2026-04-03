require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cron = require('node-cron');
const HeatStressCalculator = require('./utils/heatCalculator');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
let subscribers = [];

async function fetchWeather(city) {
  try {
    const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { q: city, appid: process.env.OPENWEATHER_API_KEY, units: 'metric' }
    });
    return {
      city: res.data.name, country: res.data.sys.country,
      temp: res.data.main.temp, humidity: res.data.main.humidity,
      windSpeed: res.data.wind.speed, description: res.data.weather[0].description
    };
  } catch (e) { throw new Error('Weather fetch failed'); }
}

// ✅ TEST MODE: Simulates WhatsApp without Twilio
async function sendWhatsAppAlert(phone, data) {
  const r = data.risk;
  const recs = r.recommendations.map((x, i) => `${i + 1}. ${x}`).join('\n');
  const msg = `🔥 *HSE HEAT STRESS ALERT*\n📍 ${data.city}\n🌡️ ${data.temperature}°C | 💧 ${data.humidity}%\n📊 Heat Index: ${data.heatIndex}°C | WBGT: ${data.wbgt}°C\n\n${r.icon} *${r.level}*\n${r.message}\n\n📋 Recommendations:\n${recs}\n\n⏰ ${new Date(data.timestamp).toLocaleString()}\n\n👤 Created & Licensed by: NAZEER KADHAR, HSE Professional`;

  console.log(`\n📱 [TEST MODE] Would send WhatsApp to ${phone}:`);
  console.log(msg);
  return { success: true };
}

app.get('/api/heat-stress', async (req, res) => {
  try {
    const w = await fetchWeather(req.query.city);
    const a = HeatStressCalculator.assess(w.temp, w.humidity, w.windSpeed, w.description);
    a.city = w.city; a.country = w.country;
    res.json(a);
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

app.post('/api/subscribe', (req, res) => {
  const { phoneNumber, city, name } = req.body;
  if (!phoneNumber) return res.status(400).json({ error: 'Phone required' });
  subscribers.push({ id: Date.now(), phoneNumber, name: name || 'User', city, active: true });
  res.json({ success: true });
});

app.post('/api/test-alert', async (req, res) => {
  try {
    const { phoneNumber, city } = req.body;
    const w = await fetchWeather(city);
    const a = HeatStressCalculator.assess(w.temp, w.humidity, w.windSpeed, w.description);
    a.city = w.city;
    await sendWhatsAppAlert(phoneNumber, a);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

cron.schedule('*/30 * * * *', async () => {
  console.log('\n⏰ Scheduled check running...');
  for (const s of subscribers) {
    if (!s.active) continue;
    try {
      const w = await fetchWeather(s.city);
      const a = HeatStressCalculator.assess(w.temp, w.humidity, w.windSpeed, w.description);
      a.city = w.city;
      if (['MODERATE', 'HIGH', 'EXTREME'].includes(a.risk.level)) await sendWhatsAppAlert(s.phoneNumber, a);
    } catch (e) {}
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║  🔥 HSE Heat Stress Alert System                 ║
║  🚀 Running on http://localhost:${PORT}                ║
║  👤 Created & Licensed by: NAZEER KADHAR, HSE    ║
╚═══════════════════════════════════════════════════╝
  `);
});