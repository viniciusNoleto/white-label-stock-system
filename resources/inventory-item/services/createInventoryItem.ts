import { appClient } from '@/src/utils/app-client';
import type { IInventoryItem } from '../models/InventoryItem';
import type { PayloadBody } from '@/src/shared/types/api';

export type CreateInventoryItemServicePayload = {
  name: string;
  unit_id: string;
  storage_id?: string | null;
  quantity?: number;
  category_ids?: string[];
  components?: Array<{ id: string; quantity_required: number }>;
};

export function createInventoryItemService({ body }: PayloadBody<CreateInventoryItemServicePayload>) {
  return appClient.post<IInventoryItem>('/api/inventory-items', { body });
}
