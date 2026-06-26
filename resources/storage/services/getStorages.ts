import { appClient } from '@/src/utils/app-client';
import type { IStorage } from '../models/Storage';
import type { QueryFnCtx } from '@/src/shared/types/tanstack';

export const GET_STORAGES_KEY = ['get-storages'];

export function getStoragesService({ signal }: QueryFnCtx) {
  return appClient.get<IStorage[]>('/api/storages', { signal });
}
