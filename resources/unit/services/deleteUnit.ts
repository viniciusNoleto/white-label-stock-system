import { appClient } from '@/src/utils/app-client';

export function deleteUnitService({ id }: { id: string }) {
  return appClient.delete<null>(`/api/units/${id}`);
}
