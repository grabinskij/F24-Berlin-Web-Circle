class ExchangeRatesService {
  constructor() {
    this.exchangeRates = null;
    this.selectedCurrency = null;
  }

  setRates(rates, selectedCurrency) {
    this.exchangeRates = rates;
    this.selectedCurrency = selectedCurrency;
    console.log('Rates set in service:', { rates, selectedCurrency });
  }

  getRates() {
    console.log('Getting rates from service:', {
      rates: this.exchangeRates,
      selectedCurrency: this.selectedCurrency
    });
    return {
      rates: this.exchangeRates,
      selectedCurrency: this.selectedCurrency
    };
  }
}

// Export a singleton instance
module.exports = new ExchangeRatesService();