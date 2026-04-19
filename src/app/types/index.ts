export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  available: boolean;
  category?: string;
  order?: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export type OrderStatus = 'processing' | 'preparing' | 'completed' | 'served';

export interface Order {
  id: string;
  tableNumber: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string | Date;
}
