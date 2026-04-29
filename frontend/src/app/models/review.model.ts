export interface Review {
  id: number;
  userId: number;
  username: string | null | undefined;
  avatar: string | null | undefined;
  productId: number;
  orderId: number;
  orderItemId: number;
  rating: number;
  content: string;
  images: string | null | undefined;
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
