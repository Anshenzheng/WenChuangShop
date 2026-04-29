export interface Order {
  id: number;
  orderNo: string;
  userId: number;
  username: string;
  phone: string;
  address: string;
  totalAmount: number;
  status: number;
  remark: string;
  createTime: string;
  paymentTime?: string;
  deliveryTime?: string;
  completeTime?: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  orderNo: string;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  totalAmount: number;
  reviewed?: boolean;
}

export interface CreateOrderRequest {
  username: string;
  phone: string;
  address: string;
  cartIds: number[];
  remark?: string;
}

export interface CreateOrderResponse {
  orderId: number;
  orderNo: string;
  totalAmount: number;
}

export const OrderStatus = {
  PENDING: 0,
  PAID: 1,
  DELIVERED: 2,
  COMPLETED: 3,
  CANCELLED: 4
} as const;

export const OrderStatusText: { [key: number]: string } = {
  0: '待确认',
  1: '已确认',
  2: '已发货',
  3: '已完成',
  4: '已取消'
};
