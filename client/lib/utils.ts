export function formatPrice(price: number | string, locale: string): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numericPrice)) {
      return locale === 'ar' ? 'غير متوفر' : 'Not available';
  }

  const formatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-JO' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
  });

  return `${formatter.format(numericPrice)} ${locale === 'ar' ? 'د.أ' : 'JD'}`;
}

// if (locale === 'ar') {
//   return "د.أ " +formatter.format(numericPrice) ;
// }
// return formatter.format(numericPrice) + ' JD';