export const getSuccessHtml = (data, t) => {

  const breakdownItems = [
    { label: t('search.checkIn'), value: data?.checkInDate, color: 'green' },
    { label: t('search.checkOut'), value: data?.checkOutDate, color: 'green' },
    { label: t('product.nightsBig'), value: data?.breakdown.nights },
    { label: t('product.pricePerNight'), value: `€${data?.breakdown.pricePerNight}` },
    { label: t('product.airbnb_service_fee'), value: `€${data?.breakdown.airbnbServiceFee}` },
    { label: t('product.cleaning_fee'), value: `€${data?.breakdown.cleaningFee}` },
    { label: t('product.long_stay_discount'), value: `€${data?.breakdown.longStayDiscount}` },
    { label: t('product.numberOfAdults'), value: data?.guestCounts.adults },
    { label: t('product.numberOfChildren'), value: data?.guestCounts.children },
    { label: t('product.numberOfInfants'), value: data?.guestCounts.infants },
    { label: t('product.numberOfPets'), value: data?.guestCounts.pets },
  ];

  const listItems = breakdownItems
    .map(
      (item) => `
      <li style="margin-bottom: 0.5rem; font-weight: 500; ${item.color ? `color: ${item.color};` : ''}">
        <strong style="color: #595959;">${item.label}:</strong> ${item.value}
      </li>
    `
    )
    .join('');

  return `
    <div style="margin: 0 auto; text-align: left; font-size: 1rem;">
      <ul style="text-align: left; list-style: none; padding: 0; font-size: 1rem;">
        ${listItems}
      </ul>
      <p style="margin-top: 1rem; font-size: 1.2rem; color: green; font-weight: bold;">
        ${t('product.totalPrice')}: €${data?.totalPrice}
      </p>
      <p style="text-align: center; margin-top: 1.6rem; font-weight: 500;">${t('product.thankYou')}😊</p>
    </div>
  `;
};