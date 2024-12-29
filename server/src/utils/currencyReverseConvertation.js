function roundRate(rate, decimals = 2) {
  return parseFloat(rate?.toFixed(decimals));
}

function reverseCurrency(amount, rate, decimals = 2) {
  const preciseAmount = Math.round(amount * Math.pow(10, decimals)); 
  const reverted = preciseAmount / roundRate(rate, decimals); 
  return Math.round(reverted / Math.pow(10, decimals)); 
}

function convertCurrency(amount, rate, decimals = 2) {
  const preciseAmount = Math.round(amount * Math.pow(10, decimals));
  const converted = preciseAmount * roundRate(rate, decimals);
  return Math.round(converted / Math.pow(10, decimals)); 
}

module.exports = { reverseCurrency, convertCurrency };





