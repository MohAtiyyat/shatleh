export interface Address {
    id?: string;
    city: string;
    floor: string;
    street: string;
    aptNo: string;
    buildingNo: string;
    zipCode: string;
    isDefault?: boolean;
}