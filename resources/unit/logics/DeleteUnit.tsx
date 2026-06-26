'use client';

import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { FormButton } from '@/src/components/form/Button';
import { resolveApiMessage } from '@/src/utils/apiMessage';
import { deleteUnitService } from '../services/deleteUnit';

export function useDeleteUnitLogicData({ editingUnitId, onSuccess }: { editingUnitId: string; onSuccess: () => void }) {
  const { t, i18n } = useTranslation();

  const deleteUnitMutation = useMutation({
    mutationFn: () => deleteUnitService({ id: editingUnitId }),
    onSuccess: (res) => {
      notifications.show({ message: resolveApiMessage(res.message, i18n.language), color: 'green' });
      onSuccess();
    },
    onError: (err: any) => {
      notifications.show({
        title: t('common.notifications.errorTitle'),
        message: err?.message ? resolveApiMessage(err.message, i18n.language) : t('notifications.errors.deleteUnit'),
        color: 'red',
      });
    },
  });

  return { deleteUnitMutation };
}

export function DeleteUnitLogicComponent({
  logicData,
  unitName,
  onCancel,
}: {
  logicData: ReturnType<typeof useDeleteUnitLogicData>;
  unitName: string;
  onCancel: () => void;
}) {
  const { t } = useTranslation();

  const {
    deleteUnitMutation: { mutate: deleteUnit, isPending: deleteUnitIsPending },
  } = logicData;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-gray-600 text-sm">
        {`Tem certeza que deseja excluir a unidade "${unitName}"? Esta ação não pode ser desfeita.`}
      </p>

      <div className="flex justify-end gap-2">
        <FormButton
          variant="subtle"
          color="gray"
          onClick={onCancel}
          disabled={deleteUnitIsPending}
        >
          {t('common.actions.cancel')}
        </FormButton>

        <FormButton
          color="red"
          loading={deleteUnitIsPending}
          onClick={() => deleteUnit()}
        >
          Excluir
        </FormButton>
      </div>
    </div>
  );
}
