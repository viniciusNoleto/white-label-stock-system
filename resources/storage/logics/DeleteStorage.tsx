'use client';

import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { FormButton } from '@/src/components/form/Button';
import { resolveApiMessage } from '@/src/utils/apiMessage';
import { deleteStorageService } from '../services/deleteStorage';

export function useDeleteStorageLogicData({ editingStorageId, onSuccess }: { editingStorageId: string; onSuccess: () => void }) {
  const { t, i18n } = useTranslation();

  const deleteStorageMutation = useMutation({
    mutationFn: () => deleteStorageService({ id: editingStorageId }),
    onSuccess: (res) => {
      notifications.show({ message: resolveApiMessage(res.message, i18n.language), color: 'green' });
      onSuccess();
    },
    onError: (err: any) => {
      notifications.show({
        title: t('common.notifications.errorTitle'),
        message: err?.message ? resolveApiMessage(err.message, i18n.language) : t('notifications.errors.deleteStorage'),
        color: 'red',
      });
    },
  });

  return { deleteStorageMutation };
}

export function DeleteStorageLogicComponent({
  logicData,
  storageName,
  onCancel,
}: {
  logicData: ReturnType<typeof useDeleteStorageLogicData>;
  storageName: string;
  onCancel: () => void;
}) {
  const { t } = useTranslation();

  const {
    deleteStorageMutation: { mutate: deleteStorage, isPending: deleteStorageIsPending },
  } = logicData;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-gray-600 text-sm">
        {t('storages.delete.confirm', { name: storageName })}
      </p>

      <div className="flex justify-end gap-2">
        <FormButton
          variant="subtle"
          color="gray"
          onClick={onCancel}
          disabled={deleteStorageIsPending}
        >
          {t('common.actions.cancel')}
        </FormButton>

        <FormButton
          color="red"
          loading={deleteStorageIsPending}
          onClick={() => deleteStorage()}
        >
          {t('common.actions.delete')}
        </FormButton>
      </div>
    </div>
  );
}
