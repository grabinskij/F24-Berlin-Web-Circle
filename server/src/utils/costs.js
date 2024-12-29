const { convertCurrency } = require('./currencyReverseConvertation')

function calculateCosts({
    checkInDate,
    checkOutDate,
    pricePerNight,
    airbnbServiceFee,
    cleaningFee,
    longStayDiscount,
    nightsCountForDiscount,
    selectedCurrency,
    exchangeRateUSD,
    exchangeRateUAH,
    totalPrice
}) {

  const priceCurrencyCalculation = (price) => {
    if (selectedCurrency === 'USD') {
        return convertCurrency(price, exchangeRateUSD) 
    } else if (selectedCurrency === 'UAH') {
        return convertCurrency(price, exchangeRateUAH);
    } else {
        return price
    }
  };

  const nights = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24) | 0;
  const isDiscount = nights >= nightsCountForDiscount;

  const basePriceCurrency = nights * priceCurrencyCalculation(pricePerNight)
  const totalPriceCurrency =
        basePriceCurrency +
        priceCurrencyCalculation(airbnbServiceFee) +
        priceCurrencyCalculation(cleaningFee) -
        (isDiscount ? priceCurrencyCalculation(longStayDiscount) : 0)

  if(totalPriceCurrency === totalPrice) {
    return {
      nights,
      totalPrice,
      totalPriceToCompare: totalPriceCurrency,
      breakdown: {
        nights,
        pricePerNight: priceCurrencyCalculation(pricePerNight),
        airbnbServiceFee: priceCurrencyCalculation(airbnbServiceFee),
        cleaningFee: priceCurrencyCalculation(cleaningFee),
        longStayDiscount: isDiscount ? priceCurrencyCalculation(longStayDiscount) : 0,
      },
    };
  }
    return null;
  }

module.exports = { calculateCosts };
