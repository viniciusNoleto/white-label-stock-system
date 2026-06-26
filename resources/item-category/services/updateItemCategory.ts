import { appClient } from '@/src/utils/app-client';
import type { IItemCategory } from '../models/ItemCategory';
import type { PayloadBody } from '@/src/shared/types/api';

export type UpdateItemCategoryServicePayload = {
  name: string;
  color_hex: string;
};

export function updateItemCategoryService({ id, body }: PayloadBody<UpdateItemCategoryServicePayload> & { id: string }) {
  return appClient.put<IItemCategory>(`/api/item-categories/${id}`, { body });
}
