import { appClient } from '@/src/utils/app-client';
import type { IStorage } from '../models/Storage';
import type { PayloadBody } from '@/src/shared/types/api';

export type CreateStorageServicePayload = {
  name: string;
  description?: string;
};

export function createStorageService({ body }: PayloadBody<CreateStorageServicePayload>) {
  return appClient.post<IStorage>('/api/storages', { body });
}
