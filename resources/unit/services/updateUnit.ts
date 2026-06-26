import { appClient } from '@/src/utils/app-client';
import type { IUnit } from '../models/Unit';
import type { PayloadBody } from '@/src/shared/types/api';

export type UpdateUnitServicePayload = {
  name: string;
  abbreviation: string;
};

export function updateUnitService({ id, body }: PayloadBody<UpdateUnitServicePayload> & { id: string }) {
  return appClient.put<IUnit>(`/api/units/${id}`, { body });
}
