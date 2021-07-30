export interface Entree {
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

export interface Cart {
  item: string;
  price: number;
  quantity: number;
}

let total: number;
