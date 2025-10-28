export type Role = 'admin' | 'vendedor';

export type Product = {
  _id: string;
  name: string;
  sku: string;
  salePrice: number;
  costPrice: number;
  stock: number;
  category?: string;
  reorderLevel?: number;
};

export type Customer = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  taxId?: string;
};

export type SaleItem = {
  product: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  taxRate?: number;
  total: number;
};

export type Sale = {
  _id: string;
  invoiceNumber: string;
  customer: Customer;
  items: SaleItem[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  grandTotal: number;
  status: string;
  createdAt: string;
};

export type DashboardMetrics = {
  salesCount: number;
  totalRevenue: number;
  pendingPayments: number;
  lowStock: number;
  latestSales: Sale[];
};

export type Setting = {
  companyName: string;
  companyTaxId?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyAddress?: string;
  invoicePrefix?: string;
  invoiceTimbreUrl?: string;
  invoiceNotes?: string;
  currency?: string;
};
