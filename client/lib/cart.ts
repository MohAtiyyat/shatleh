export type CartItem = {
    id: number;
    product_id?: number;
    name: {
        en: string;
        ar: string;
    };
    description?: {
        en: string;
        ar: string;
    };
    price: string;
    image: string;
    quantity: number;
};
// Mock data for testing, aligned with products page structure
export const mockCartItems: CartItem[] = [
    {
        id: 1,
        product_id: 1,
        name: {
            en: 'Calathea Plant',
            ar: 'نبات كالاثيا',
        },
        description: {
            en: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
            ar: 'لوريم إيبسوم دولور سيت أميت، كونسيكتيتور أديبيسينغ إليت',
        },
        price: '4.5JD',
        image: 'https://images.pexels.com/photos/129574/pexels-photo-129574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        quantity: 1,
    },
    {
        id: 2,
        product_id: 2,
        name: {
            en: 'Calathea Plant',
            ar: 'نبات كالاثيا',
        },
        description: {
            en: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
            ar: 'لوريم إيبسوم دولور سيت أميت، كونسيكتيتور أديبيسينغ إليت',
        },
        price: '5.0JD',
        image: 'https://images.pexels.com/photos/129574/pexels-photo-129574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        quantity: 1,
    },
    {
        id: 3,
        product_id: 3,
        name: {
            en: 'Calathea Plant',
            ar: 'نبات كالاثيا',
        },
        description: {
            en: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
            ar: 'لوريم إيبسوم دولور سيت أميت، كونسيكتيتور أديبيسينغ إليت',
        },
        price: '6.0JD',
        image: 'https://images.pexels.com/photos/129574/pexels-photo-129574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        quantity: 1,
    },
];