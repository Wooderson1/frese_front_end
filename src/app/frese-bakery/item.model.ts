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

// Cart interface
export interface Cart {
  item: string;
  price: number;
  quantity: number;
}

// total cart balance
let total: number;
