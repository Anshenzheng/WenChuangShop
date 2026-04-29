export interface Cart {
  id: number;
  userId: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  createTime: string;
  selected?: boolean;
}

export interface AddCartRequest {
  productId: number;
  quantity: number;
}
