export type ItemType = 'product' | 'service';

export interface InventoryItem {
  id: string;
  user_id: string;
  name: string;
  sku: string | null;
  category: string | null;
  quantity: number;
  price: number;
  low_stock_threshold: number;
  photo_url: string | null;
  currency: string;
  created_at: string;
}

export interface Service {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  price: number;
  created_at: string;
}

export interface QuoteItem {
  id: string;
  quote_id: string;
  item_type: ItemType;
  ref_id: string | null;
  name: string;
  quantity: number;
  unit_price: number;
}

export interface CompanySnapshot {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface Quote {
  id: string;
  user_id: string;
  client: string;
  whatsapp: string;
  base_amount: number;
  tax_enabled: boolean;
  tax_rate: number;
  expires_at: string | null;
  status: 'draft' | 'sent' | 'viewed' | 'downloaded' | 'sold' | 'cancelled' | 'expired';
  company_snapshot: CompanySnapshot;
  created_at: string;
}

export interface QuoteEvent {
  id: string;
  quote_id: string;
  event: 'sent' | 'viewed' | 'downloaded' | 'sold' | 'cancelled';
  created_at: string;
}
