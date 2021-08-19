//import { isNgTemplate } from "@angular/compiler";

// Entree interface
export interface Item {
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

// total cart balance
let total: number;
