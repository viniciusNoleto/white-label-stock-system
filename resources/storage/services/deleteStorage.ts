import { appClient } from '@/src/utils/app-client';

export function deleteStorageService({ id }: { id: string }) {
  return appClient.delete<null>(`/api/storages/${id}`);
}
