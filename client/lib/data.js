
export const mockProducts = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: {
    en: `Calathea Plant ${i + 1}`,
    ar: `نبات كالاثيا ${i + 1}`,
  },
  description: {
    en: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    ar: "لوريم إيبسوم دولور سيت أميت، كونسيكتيتور أديبيسينغ إليت",
  },
  price: "4.5JD",
  rating: 5,
  image:
    "https://images.pexels.com/photos/129574/pexels-photo-129574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  category:
    i % 4 === 0 ? "Seeds" : i % 4 === 1 ? "Home Plants" : i % 4 === 2 ? "Fruit plants" : "Supplies",
  categoryAr:
    i % 4 === 0 ? "بذور" : i % 4 === 1 ? "نباتات منزلية" : i % 4 === 2 ? "نباتات مثمرة" : "مستلزمات",
  inStock: i % 3 !== 0,
  isTopSelling: i < 3,
}));

export const mockFilters = {
  categories: [
    { id: 1, name: { en: "Seeds", ar: "بذور" }, selected: false },
    { id: 2, name: { en: "Home Plants", ar: "نباتات منزلية" }, selected: false },
    { id: 3, name: { en: "Fruit plants", ar: "نباتات مثمرة" }, selected: false },
    { id: 4, name: { en: "Supplies", ar: "مستلزمات" }, selected: false },
  ],
  availability: [
    { id: 1, name: { en: "In stock", ar: "متوفر" }, selected: false },
    { id: 2, name: { en: "Out of stock", ar: "غير متوفر" }, selected: false },
  ],
  ratings: [
    { id: 5, name: { en: "5 Stars", ar: "5 نجوم" }, count: 589, stars: 5, selected: false },
    { id: 4, name: { en: "4 Stars", ar: "4 نجوم" }, count: 461, stars: 4, selected: false },
    { id: 3, name: { en: "3 Stars", ar: "3 نجوم" }, count: 203, stars: 3, selected: false },
    { id: 2, name: { en: "2 Stars", ar: "2 نجوم" }, count: 50, stars: 2, selected: false },
    { id: 1, name: { en: "1 Star", ar: "1 نجمة" }, count: 18, stars: 1, selected: false },
  ],
};

// Home page data
export   const heroSlides = [
  {
    image:
      'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    subtitle: t('hero.slide1.subtitle'),
    title: t('hero.slide1.title'),
    description: t('hero.slide1.description'),
  },
  {
    image:
      'https://images.unsplash.com/photo-1535379453347-1ffd615e2e08?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    subtitle: t('hero.slide2.subtitle'),
    title: t('hero.slide2.title'),
    description: t('hero.slide2.description'),
  },
  {
    image:
      'https://images.unsplash.com/photo-1627920769541-daa658ed6b59?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    subtitle: t('hero.slide3.subtitle'),
    title: t('hero.slide3.title'),
    description: t('hero.slide3.description'),
  },
];

// Categories Data
export const categoriesData = [
  {
    title: t.raw('categories.treeShrubTrimming'),
    svg: `
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22V18" stroke="#a0f923" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8V2" stroke="#a0f923" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 12H4" stroke="#a0f923" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 12H16" stroke="#a0f923" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17.5 6.5L14 10" stroke="#a0f923" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 17.5L10 14" stroke="#a0f923" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17.5 17.5L14 14" stroke="#a0f923" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 6.5L10 10" stroke="#a0f923" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#a0f923" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    `,
  },
  {
    title: t.raw('categories.flowerGardens'),
    svg: `
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#a0f923" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="#a0f923" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="#a0f923" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    `,
  },
  {
    title: t.raw('categories.vegetableHerbGardens'),
    svg: `
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 9.5H12" stroke="#a0f923" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 14.5H9" stroke="#a0f923" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 9.5C16 11.7091 14.2091 13.5 12 13.5C9.79086 13.5 8 11.7091 8 9.5C8 7.29086 9.79086 5.5 12 5.5C14.2091 5.5 16 7.29086 16 9.5Z" stroke="#a0f923" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 9.5H16" stroke="#a0f923" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19 14.5H15" stroke="#a0f923" strokeWidth="1.5" WstrokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 9.5C8 7.29086 9.79086 5.5 12 5.5C14.2091 5.5 16 7.29086 16 9.5C16 11.7091 14.2091 13.5 12 13.5C9.79086 13.5 8 11.7091 8 9.5Z" stroke="#a0f923" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    `,
  },
  {
    title: t.raw('categories.landscaping'),
    svg: `
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#a0f923" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12H22" stroke="#a0f923" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="#a0f923" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    `,
  },
];

// Top Sellers Data (Updated to match ProductCard props)
export const topSellersData = [
  {
    id: 1,
    name: {
      en: t('topSellers.calatheaPlant.title'),
      ar: t('topSellers.calatheaPlant.title'),
    },
    description: {
      en: t('topSellers.calatheaPlant.description'),
      ar: t('topSellers.calatheaPlant.description'),
    },
    image:
      'https://images.pexels.com/photos/2395255/pexels-photo-2395255.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.5,
    price: '4.5JD', // Added for cart functionality
    inStock: true, // Added for cart functionality
  },
  {
    id: 2,
    name: {
      en: t('topSellers.calatheaPlant.title'),
      ar: t('topSellers.calatheaPlant.title'),
    },
    description: {
      en: t('topSellers.calatheaPlant.description'),
      ar: t('topSellers.calatheaPlant.description'),
    },
    image:
      'https://images.pexels.com/photos/971360/pexels-photo-971360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.5,
    price: '4.5JD',
    inStock: true,
  },
  {
    id: 3,
    name: {
      en: t('topSellers.calatheaPlant.title'),
      ar: t('topSellers.calatheaPlant.title'),
    },
    description: {
      en: t('topSellers.calatheaPlant.description'),
      ar: t('topSellers.calatheaPlant.description'),
    },
    image:
      'https://images.pexels.com/photos/3125195/pexels-photo-3125195.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.5,
    price: '4.5JD',
    inStock: true,
  },
];

// Services Data
export const servicesData = [
  {
    title: t('services.indoorPlants.title'),
    description: t('services.indoorPlants.description'),
    svg: `
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 13.3333C46.6667 13.3333 53.3333 16.6667 53.3333 23.3333C53.3333 30 46.6667 33.3333 40 33.3333C33.3333 33.3333 26.6667 30 26.6667 23.3333C26.6667 16.6667 33.3333 13.3333 40 13.3333Z" stroke="var(--accent-color)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 66.6667H60V53.3333C60 46.6667 53.3333 40 40 40C26.6667 40 20 46.6667 20 53.3333V66.6667Z" stroke="var(--accent-color)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M40 53.3333V60" stroke="var(--accent-color)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M33.3333 60H46.6667" stroke="var(--accent-color)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    `,
  },
  {
    title: t('services.outdoorPlants.title'),
    description: t('services.outdoorPlants.description'),
    svg: `
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="26.6667" r="13.3333" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M40 40V66.6667" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M26.6667 53.3333C33.3333 46.6667 46.6667 46.6667 53.3333 53.3333" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    `,
  },
  {
    title: t('services.plantPots.title'),
    description: t('services.plantPots.description'),
    svg: `
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M53.3333 26.6667V13.3333" stroke="var(--accent-color)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M40 26.6667V6.66666" stroke="var(--accent-color)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
       "TEMPORARY
        <path d="M26.6667 26.6667V13.3333" stroke="var(--accent-color)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 40H60C60 40 66.6667 43.3333 66.6667 53.3333C66.6667 63.3333 60 66.6667 60 66.6667H20C20 66.6667 13.3333 63.3333 13.3333 53.3333C13.3333 43.3333 20 40 20 40Z" stroke="var(--accent-color)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M26.6667 53.3333H53.3333" stroke="var(--accent-color)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    `,
  },
];

// Blog Data
export const blogData = [
  {
    title: t('blog.post1.title'),
    description: t('blog.post1.description'),
    image:
      'https://images.pexels.com/photos/129574/pexels-photo-129574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: t('blog.post1.date'),
  },
  {
    title: t('blog.post2.title'),
    description: t('blog.post2.description'),
    image:
      'https://images.pexels.com/photos/31638765/pexels-photo-31638765/free-photo-of-vibrant-orange-pumpkins-perfect-for-autumn-decor.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: t('blog.post2.date'),
  },
  {
    title: t('blog.post3.title'),
    description: t('blog.post3.description'),
    image:
      'https://images.pexels.com/photos/31630664/pexels-photo-31630664/free-photo-of-honeybee-collecting-pollen-from-purple-flower.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: t('blog.post3.date'),
  },
];

// Customer Review Data
export const customerReviewData = [
  {
    name: t('customerReviews.review1.name'),
    review: t('customerReviews.review1.review'),
    image:
      'https://images.pexels.com/photos/8090508/pexels-photo-8090508.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 5,
  },
  {
    name: t('customerReviews.review2.name'),
    review: t('customerReviews.review2.review'),
    image:
      'https://images.pexels.com/photos/5976933/pexels-photo-5976933.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 5,
  },
  {
    name: t('customerReviews.review3.name'),
    review: t('customerReviews.review3.review'),
    image:
      'https://images.pexels.com/photos/29739385/pexels-photo-29739385/free-photo-of-elderly-man-playing-traditional-rababah-in-petra.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 5,
  },
];