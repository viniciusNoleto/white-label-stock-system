'use client';

import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { FormButton } from '@/src/components/form/Button';
import { resolveApiMessage } from '@/src/utils/apiMessage';
import { deleteItemCategoryService } from '../services/deleteItemCategory';

export function useDeleteItemCategoryLogicData({ editingCategoryId, onSuccess }: { editingCategoryId: string; onSuccess: () => void }) {
  const { t, i18n } = useTranslation();

  const deleteItemCategoryMutation = useMutation({
    mutationFn: () => deleteItemCategoryService({ id: editingCategoryId }),
    onSuccess: (res) => {
      notifications.show({ message: resolveApiMessage(res.message, i18n.language), color: 'green' });
      onSuccess();
    },
    onError: (err: any) => {
      notifications.show({
        title: t('common.notifications.errorTitle'),
        message: err?.message ? resolveApiMessage(err.message, i18n.language) : t('notifications.errors.deleteCategory'),
        color: 'red',
      });
    },
  });

  return {
    deleteItemCategoryMutation,
  };
}

export function DeleteItemCategoryLogicComponent({
  logicData,
  categoryName,
  onCancel,
}: {
  logicData: ReturnType<typeof useDeleteItemCategoryLogicData>;
  categoryName: string;
  onCancel: () => void;
}) {
  const { t } = useTranslation();

  const {
    deleteItemCategoryMutation: {
      mutate: deleteItemCategory,
      isLoading: deleteItemCategoryIsPending,
    },
  } = logicData;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-gray-600 text-sm">
        {`Tem certeza que deseja excluir a categoria "${categoryName}"? Esta ação não pode ser desfeita.`}
      </p>

      <div className="flex justify-end gap-2">
        <FormButton
          variant="subtle"
          color="gray"
          onClick={onCancel}
          disabled={deleteItemCategoryIsPending}
        >
          {t('common.actions.cancel')}
        </FormButton>

        <FormButton
          color="red"
          loading={deleteItemCategoryIsPending}
          onClick={() => deleteItemCategory()}
        >
          {t('categories.actions.delete')}
        </FormButton>
      </div>
    </div>
  );
}
