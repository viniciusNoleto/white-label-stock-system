import { appClient } from '@/src/utils/app-client';

export function deleteItemCategoryService({ id }: { id: string }) {
  return appClient.delete<null>(`/api/item-categories/${id}`);
}
