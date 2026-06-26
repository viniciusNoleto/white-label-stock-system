import { appClient } from '@/src/utils/app-client';
import type { IStorage } from '../models/Storage';
import type { PayloadBody } from '@/src/shared/types/api';

export type UpdateStorageServicePayload = {
  name: string;
  description?: string;
};

export function updateStorageService({ id, body }: PayloadBody<UpdateStorageServicePayload> & { id: string }) {
  return appClient.put<IStorage>(`/api/storages/${id}`, { body });
}
