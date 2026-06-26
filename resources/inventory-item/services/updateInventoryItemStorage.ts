import { appClient } from '@/src/utils/app-client';
import type { IInventoryItem } from '../models/InventoryItem';
import type { PayloadBody } from '@/src/shared/types/api';

export type UpdateInventoryItemStorageServicePayload = {
  storage_id: number | null;
};

export function updateInventoryItemStorageService({
  itemId,
  body,
}: PayloadBody<UpdateInventoryItemStorageServicePayload> & { itemId: string }) {
  return appClient.patch<IInventoryItem>(`/api/inventory-items/${itemId}`, { body });
}
