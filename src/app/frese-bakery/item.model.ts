//import { isNgTemplate } from "@angular/compiler";

export interface Key {
  value: string;
  cost: number;
}

// Product interface
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
  selections?: Key[];
  addOns?: Key[];
}


export interface Item {
  name: string;
  phone: string;
  email: string;
  items: Product[];
  size?: string;
}

// total cart balance
let total: number;
