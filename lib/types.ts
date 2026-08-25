// Definición de tipos para S.U.I.R.A. Dynamics

export type ItemType = 'product' | 'service';

export interface InventoryItem {
  id: string;
  user_id: string;
  name: string;
  sku: string;
  category: string; // Ej: Ferretería, Electrónica, etc.
  item_type: ItemType;
  price: number;
  stock: number;
  min_stock_alert: number; // Umbral configurable para alerta de stock bajo
  image_url?: string | null; // Opcional
  created_at: string;
}

export interface QuoteItem {
  item_id: string;
  item_name: string;
  sku: string;
  item_type: ItemType;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface Quote {
  id: string;
  user_id: string;
  public_token: string;
  client_name: string;
  client_phone: string;
  items: QuoteItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  status: 'pendiente' | 'vendida' | 'expirada';
  expires_at: string;
  viewed_at?: string | null;
  downloaded_at?: string | null;
  created_at: string;
}
