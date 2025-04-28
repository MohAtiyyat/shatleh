export const formatPrice = (price: string, locale: string) => {
    if (price.match(/[^0-9.,]/)) return price;
    return locale === 'en' ? `${price} JD` : `${price} د.أ`;
  };