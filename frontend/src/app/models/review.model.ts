export interface Review {
  id: number;
  userId: number;
  username: string;
  avatar: string;
  productId: number;
  orderId: number;
  orderItemId: number;
  rating: number;
  content: string;
  images: string;
  status: number;
  createTime: string;
}

export interface CreateReviewRequest {
  orderItemId: number;
  orderId: number;
  productId: number;
  rating: number;
  content: string;
  images?: string;
}
