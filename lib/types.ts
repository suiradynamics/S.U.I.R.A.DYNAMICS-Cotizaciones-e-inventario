export interface BusinessProfile {
  id: string;
  company_name: string;
  ruc_or_id: string;
  phone: string;
  email: string;
  website?: string;
  address?: string;
  delete_password_hash: string;
  default_tax_rate: number;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description?: string;
  item_type: 'product' | 'service';
  category: string;
  price: number;
  stock: number;
  min_stock_alert: number;
  image_url?: string;
}

export interface QuoteItem {
  id?: string;
  item_id: string;
  item_name: string;
  sku: string;
  item_type: 'product' | 'service';
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface Quote {
  id: string;
  public_token: string;
  quote_number: string;
  client_name: string;
  client_phone: string;
  client_email?: string;
  items: QuoteItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  status: 'pendiente' | 'vendida' | 'expirada';
  expires_at: string;
  viewed_at?: string | null;
  downloaded_at?: string | null;
  assigned_device_id?: string | null;
  assigned_until?: string | null;
  created_at: string;
}
