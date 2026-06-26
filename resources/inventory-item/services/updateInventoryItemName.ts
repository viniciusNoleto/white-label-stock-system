import { appClient } from '@/src/utils/app-client';
import type { IInventoryItem } from '../models/InventoryItem';
import type { PayloadBody } from '@/src/shared/types/api';

export type UpdateInventoryItemNameServicePayload = {
  name: string;
};

export function updateInventoryItemNameService({
  itemId,
  body,
}: PayloadBody<UpdateInventoryItemNameServicePayload> & { itemId: string }) {
  return appClient.patch<IInventoryItem>(`/api/inventory-items/${itemId}`, { body });
}
