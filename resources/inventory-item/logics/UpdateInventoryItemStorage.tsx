'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import * as yup from 'yup';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from '@/src/components/form/Form';
import { FormButton } from '@/src/components/form/Button';
import { FormSelect } from '@/src/components/form/Select';
import { useValidatedFormState } from '@/src/utils/state';
import { resolveApiMessage } from '@/src/utils/apiMessage';
import { updateInventoryItemStorageService } from '../services/updateInventoryItemStorage';
import { getStoragesService, GET_STORAGES_KEY } from '@/src/resources/storage/services/getStorages';
import type { IInventoryItem } from '../models/InventoryItem';

export function useUpdateInventoryItemStorageLogicData({
  editingItemId,
  onSuccess,
}: {
  editingItemId: string;
  onSuccess: () => void;
}) {
  const { t, i18n } = useTranslation();

  const { data: storagesData, isFetching: storagesIsFetching } = useQuery({
    queryKey: GET_STORAGES_KEY,
    queryFn: ({ signal }) => getStoragesService({ signal }),
  });

  const storages = useMemo(() => storagesData?.data ?? [], [storagesData]);

  const updateItemStorageSchema = useMemo(() => yup.object({
    storage_id: yup.string().default('').nullable().optional(),
  }), []);

  const updateItemStorageValidatedFormState = useValidatedFormState(updateItemStorageSchema);

  const updateItemStorageMutation = useMutation({
    mutationFn: () => {
      const { storage_id } = updateItemStorageValidatedFormState.state;
      return updateInventoryItemStorageService({
        itemId: editingItemId,
        body: { storage_id: storage_id ? Number(storage_id) : null },
      });
    },
    onSuccess: (res) => {
      notifications.show({ message: resolveApiMessage(res.message, i18n.language), color: 'green' });
      onSuccess();
    },
    onError: (err: any) => {
      notifications.show({
        title: t('common.notifications.errorTitle'),
        message: err?.message ? resolveApiMessage(err.message, i18n.language) : t('notifications.errors.updateItemStorage'),
        color: 'red',
      });
    },
  });

  function updateItemStorageInit(item: IInventoryItem) {
    updateItemStorageValidatedFormState.setState({
      storage_id: item.storage ? String(item.storage.id) : '',
    });
    updateItemStorageValidatedFormState.setErrors({});
  }

  return {
    updateItemStorageValidatedFormState,
    updateItemStorageMutation,
    updateItemStorageInit,
    storages,
    storagesIsFetching,
  };
}

export function UpdateInventoryItemStorageLogicComponent({
  logicData,
  onCancel,
}: {
  logicData: ReturnType<typeof useUpdateInventoryItemStorageLogicData>;
  onCancel: () => void;
}) {
  const { t } = useTranslation();

  const {
    updateItemStorageValidatedFormState: { field: storageField, validate: validateStorage, setValue: setStorageValue },
    updateItemStorageMutation: { mutate: updateItemStorage, isPending: updateItemStorageIsPending },
    storages,
    storagesIsFetching,
  } = logicData;

  async function submit() {
    if (!await validateStorage()) return;
    updateItemStorage();
  }

  return (
    <Form
      onSubmit={submit}
      className="flex flex-col gap-4"
    >
      <FormSelect
        label={t('forms.inventoryItem.storage.label')}
        placeholder={t('forms.inventoryItem.storage.placeholder')}
        data={storages}
        valueField="id"
        labelField="name"
        clearable
        disabled={storagesIsFetching}
        {...storageField('storage_id')}
        onChange={(v) => setStorageValue('storage_id', v ?? '')}
      />

      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <FormButton
          variant="subtle"
          color="gray"
          onClick={onCancel}
          disabled={updateItemStorageIsPending}
        >
          {t('common.actions.cancel')}
        </FormButton>

        <FormButton
          type="submit"
          color="primary"
          loading={updateItemStorageIsPending}
        >
          {t('common.actions.save')}
        </FormButton>
      </div>
    </Form>
  );
}
