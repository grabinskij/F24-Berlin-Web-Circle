
function calculateCosts({
    checkInDate,
    checkOutDate,
    pricePerNight,
    airbnbServiceFee,
    cleaningFee,
    longStayDiscount,
    nightsCountForDiscount,
    rates,
    selectedCurrency,
}) {

  const usd = rates?.quotes?.EURUSD?.end_rate || 1;
  const uah = rates?.quotes?.EURUAH?.end_rate || 1;


  let pricePerNightCurrency = pricePerNight;
  let airbnbServiceFeeCurrency = airbnbServiceFee;
  let cleaningFeeCurrency = cleaningFee;
  let longStayDiscountCurrency = longStayDiscount;

  if (selectedCurrency === 'USD') {
    pricePerNightCurrency *= usd;
    airbnbServiceFeeCurrency *= usd;
    cleaningFeeCurrency *= usd;
    longStayDiscountCurrency *= usd;
  } else if (selectedCurrency === 'UAH') {
    pricePerNightCurrency *= uah;
    airbnbServiceFeeCurrency *= uah;
    cleaningFeeCurrency *= uah;
    longStayDiscountCurrency *= uah;
  }


  console.log('usd', usd)
  console.log('uah', uah)
  console.log('selectedCurrencyCalculateCosts', selectedCurrency)

 
  const nights = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
  const isDiscount = nights >= nightsCountForDiscount;

  const basePrice = nights * pricePerNightCurrency;
  const totalPrice =
    basePrice +
    airbnbServiceFeeCurrency +
    cleaningFeeCurrency -
    (isDiscount ? longStayDiscountCurrency : 0);

  return {
    nights,
    basePrice,
    totalPrice,
    breakdown: {
      nights,
      pricePerNight: pricePerNightCurrency,
      basePrice,
      airbnbServiceFee: airbnbServiceFeeCurrency,
      cleaningFee: cleaningFeeCurrency,
      longStayDiscount: isDiscount ? longStayDiscountCurrency : 0,
    },
  };
}

module.exports = { calculateCosts };
