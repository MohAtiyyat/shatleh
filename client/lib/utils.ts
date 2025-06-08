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
  if (!currentProduct || !currentProduct.categories || currentProduct.categories.length === 0) {
    // If no current product or categories, return random products
    const shuffledProducts = allProducts
      .filter((product) => product.id !== currentProduct?.id)
      .sort(() => Math.random() - 0.5);
    return shuffledProducts.slice(0, maxProducts);
  }

  // Collect all category IDs (primary and subcategories) for the current product
  const parentCategoryIds = currentProduct.categories
    .filter((cat) => cat.parent_id === null)
    .map((cat) => cat.id);
  const subcategoryIds = currentProduct.categories
    .filter((cat) => cat.parent_id !== null)
    .map((cat) => cat.id);

  // Find parent category IDs for subcategories
  const relatedParentCategoryIds = new Set<number>();
  for (const subcategoryId of subcategoryIds) {
    for (const category of categories) {
      if (category.subcategories.some((sub) => sub.id === subcategoryId)) {
        relatedParentCategoryIds.add(category.id);
      }
    }
  }

  // Filter products that match the current product's categories or parent categories
  const relatedProducts = allProducts.filter((product) => {
    if (product.id === currentProduct.id) {
      return false; // Exclude the current product
    }
    // Check if product shares any category or subcategory
    const productCategoryIds = product.categories.map((cat) => cat.id);
    if (productCategoryIds.some((id) => productCategoryIds.includes(id))) {
      return true; // Match same category or subcategory
    }
    // Check if product belongs to a parent category of the current product's subcategories
    if (productCategoryIds.some((id) => relatedParentCategoryIds.has(id))) {
      return true; // Match parent category
    }
    // Check if product's category is a subcategory of any parent category
    for (const parentId of parentCategoryIds) {
      for (const category of categories) {
        if (category.id === parentId) {
          if (productCategoryIds.some((id) => category.subcategories.some((sub) => sub.id === id))) {
            return true;
          }
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