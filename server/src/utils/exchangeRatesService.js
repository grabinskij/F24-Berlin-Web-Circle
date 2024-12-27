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


// exchangeRatesService.js


// class ExchangeRatesService {
//   constructor() {
//     this.rates = null;
//     this.selectedCurrency = null;
//   }

//   setRates(rates, selectedCurrency) {
//     this.rates = rates;
//     this.selectedCurrency = selectedCurrency;
//     console.log('Rates set:', { rates, selectedCurrency });
//   }

//   getRates() {
//     return {
//       rates: this.rates,
//       selectedCurrency: this.selectedCurrency
//     };
//   }
// }

// module.exports = global.exchangeRatesService = global.exchangeRatesService || new ExchangeRatesService();