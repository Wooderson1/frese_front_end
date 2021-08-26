//import { isNgTemplate } from "@angular/compiler";

// Entree interface
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  typeId: number;
  active: boolean;
  quantity: number;
  photoUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  name: string;
  phone: string;
  email: string;
  items: Product[];
}

// total cart balance
let total: number;
