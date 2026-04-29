export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  stock: number;
  image: string;
  images: string;
  categoryId: number;
  categoryName: string;
  status: number;
  sort: number;
  sales: number;
  createTime: string;
}

export interface Category {
  id: number;
  name: string;
  sort: number;
  status: number;
}

export interface PageResult<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}
