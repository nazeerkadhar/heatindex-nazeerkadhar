class HeatStressCalculator {
  static calculateHeatIndex(tempC, humidity) {
    const tempF = (tempC * 9 / 5) + 32;
    if (tempF < 80) return tempC;
    const HI = -42.379 + 2.04901523 * tempF + 10.14333127 * humidity -
      0.22475541 * tempF * humidity - 0.00683783 * Math.pow(tempF, 2) -
      0.05481717 * Math.pow(humidity, 2) + 0.00122874 * Math.pow(tempF, 2) * humidity +
      0.00085282 * tempF * Math.pow(humidity, 2) - 0.00000199 * Math.pow(tempF, 2) * Math.pow(humidity, 2);
    return ((HI - 32) * 5 / 9);
  }

  static calculateWBGT(tempC, humidity) {
    const satVP = 6.112 * Math.exp((17.67 * tempC) / (tempC + 243.5));
    const vaporP = satVP * (humidity / 100);
    return 0.567 * tempC + 0.393 * vaporP + 3.94;
  }

  static getRiskLevel(wbgt) {
    if (wbgt >= 32.2) return { level: 'EXTREME', color: '#8B0000', icon: '🔴', message: 'EXTREME HEAT STRESS - Cease all outdoor work immediately!', recommendations: ['STOP all non-essential outdoor activities','Implement emergency cooling','Mandatory 15 min rest/hour in cooled area','Monitor for heat stroke symptoms','Ensure cold water & electrolytes','Buddy system required'] };
    if (wbgt >= 29.4) return { level: 'HIGH', color: '#FF0000', icon: '🟠', message: 'HIGH HEAT STRESS - Limit outdoor exposure', recommendations: ['Limit outdoor work to 45 min/hour','Mandatory 15 min rest in shade','Increase hydration','Wear light, breathable PPE','Rotate workers frequently','Monitor for heat exhaustion'] };
    if (wbgt >= 26.7) return { level: 'MODERATE', color: '#FFA500', icon: '🟡', message: 'MODERATE HEAT STRESS - Take precautions', recommendations: ['Work/rest ratio: 50 min / 10 min','Provide shaded rest areas','Ensure 1L water/hour/worker','Schedule heavy tasks for cooler hours','Train workers on heat illness','Increase ventilation'] };
    if (wbgt >= 22.2) return { level: 'LOW', color: '#FFFF00', icon: '🟢', message: 'LOW HEAT STRESS - General awareness', recommendations: ['Maintain normal work schedule','Ensure drinking water available','Encourage regular hydration','Watch for acclimatization','Review heat stress procedures'] };
    return { level: 'SAFE', color: '#00AA00', icon: '✅', message: 'SAFE conditions - No heat stress concerns', recommendations: ['Maintain standard hydration','Continue normal operations','Monitor weather for changes'] };
  }

  static assess(tempC, humidity, windSpeed, description) {
    const hi = this.calculateHeatIndex(tempC, humidity);
    const wbgt = this.calculateWBGT(tempC, humidity);
    const risk = this.getRiskLevel(wbgt);
    return { temperature: tempC, humidity, windSpeed, heatIndex: Math.round(hi*10)/10, wbgt: Math.round(wbgt*10)/10, weatherDescription: description, risk, timestamp: new Date().toISOString() };
  }
}
module.exports = HeatStressCalculator;