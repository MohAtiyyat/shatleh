import { Category, Product } from './index';

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


export function getRelatedProducts(
  currentProduct: Product,
  allProducts: Product[],
  categories: Category[],
  maxProducts: number = 10
): Product[] {
  if (!currentProduct || !currentProduct.category_id) {
    // If no current product or category_id, return random products
    const shuffledProducts = allProducts
      .filter((product) => product.id !== currentProduct?.id)
      .sort(() => Math.random() - 0.5);
    return shuffledProducts.slice(0, maxProducts);
  }

  // Find the parent category if the current product's category_id is a subcategory
  let parentCategoryId: number | null = null;
  for (const category of categories) {
    if (category.id === currentProduct.category_id) {
      parentCategoryId = category.id;
      break;
    }
    const subcategory = category.subcategories.find((sub) => sub.id === currentProduct.category_id);
    if (subcategory) {
      parentCategoryId = category.id;
      break;
    }
  }

  // Filter products that match the current product's category_id or parent category_id
  const relatedProducts = allProducts.filter((product) => {
    if (product.id === currentProduct.id) {
      return false; // Exclude the current product
    }
    if (product.category_id === currentProduct.category_id) {
      return true; // Match same category or subcategory
    }
    if (parentCategoryId && product.category_id === parentCategoryId) {
      return true; // Match parent category
    }
    // Check if product's category_id is a subcategory of the parent category
    if (parentCategoryId) {
      for (const category of categories) {
        if (category.id === parentCategoryId) {
          return category.subcategories.some((sub) => sub.id === product.category_id);
        }
      }
    }
    return false;
  });

  // If fewer than maxProducts, fill with random products
  const result = [...relatedProducts];
  if (result.length < maxProducts) {
    // Get remaining products, excluding current product and already selected products
    const selectedProductIds = new Set(result.map((p) => p.id).concat(currentProduct.id));
    const remainingProducts = allProducts.filter((product) => !selectedProductIds.has(product.id));
    // Shuffle remaining products
    const shuffledRemaining = remainingProducts.sort(() => Math.random() - 0.5);
    // Add random products to reach maxProducts
    result.push(...shuffledRemaining.slice(0, maxProducts - result.length));
  }

  // Shuffle the final list to mix related and random products
  const shuffledResult = result.sort(() => Math.random() - 0.5);
  return shuffledResult.slice(0, maxProducts);
}

// if (locale === 'ar') {
//   return "د.أ " +formatter.format(numericPrice) ;
// }
// return formatter.format(numericPrice) + ' JD';