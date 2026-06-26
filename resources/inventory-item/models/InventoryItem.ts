export interface IInventoryItemUnit {
  id: string;
  name: string;
  abbreviation: string;
}

export interface IInventoryItemCategory {
  id: string;
  name: string;
  color_hex: string;
}

export interface IInventoryItemComponent {
  id: string;
  name: string;
  quantity_required: string;
  current_quantity: string;
}

export interface IInventoryItemStorage {
  id: number;
  name: string;
}

export interface IInventoryItem {
  id: string;
  name: string;
  quantity: string;
  created_at: string | null;
  updated_at: string | null;
  unit: IInventoryItemUnit;
  storage: IInventoryItemStorage | null;
  categories: IInventoryItemCategory[];
  components: IInventoryItemComponent[];
}
