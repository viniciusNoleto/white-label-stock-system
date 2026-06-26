'use client';

import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import * as yup from 'yup';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from '@/src/components/form/Form';
import { FormButton } from '@/src/components/form/Button';
import { FormTextInput } from '@/src/components/form/TextInput';
import { useValidatedFormState } from '@/src/utils/state';
import { resolveApiMessage } from '@/src/utils/apiMessage';
import { updateInventoryItemNameService } from '../services/updateInventoryItemName';
import type { IInventoryItem } from '../models/InventoryItem';

export function useUpdateInventoryItemNameLogicData({
  editingItemId,
  onSuccess,
}: {
  editingItemId: string;
  onSuccess: () => void;
}) {
  const { t, i18n } = useTranslation();

  const updateItemNameSchema = useMemo(() => yup.object({
    name: yup.string().default('').required(t('forms.inventoryItem.validation.nameRequired')).max(255),
  }), [t]);

  const updateItemNameValidatedFormState = useValidatedFormState(updateItemNameSchema);

  const updateItemNameMutation = useMutation({
    mutationFn: () => updateInventoryItemNameService({
      itemId: editingItemId,
      body: { name: updateItemNameValidatedFormState.state.name },
    }),
    onSuccess: (res) => {
      notifications.show({ message: resolveApiMessage(res.message, i18n.language), color: 'green' });
      onSuccess();
    },
    onError: (err: any) => {
      notifications.show({
        title: t('common.notifications.errorTitle'),
        message: err?.message ? resolveApiMessage(err.message, i18n.language) : t('notifications.errors.updateItemName'),
        color: 'red',
      });
    },
  });

  function updateItemNameInit(item: IInventoryItem) {
    updateItemNameValidatedFormState.setState({ name: item.name });
    updateItemNameValidatedFormState.setErrors({});
  }

  return { updateItemNameValidatedFormState, updateItemNameMutation, updateItemNameInit };
}

export function UpdateInventoryItemNameLogicComponent({
  logicData,
  onCancel,
}: {
  logicData: ReturnType<typeof useUpdateInventoryItemNameLogicData>;
  onCancel: () => void;
}) {
  const { t } = useTranslation();

  const {
    updateItemNameValidatedFormState: { field: nameField, validate: validateName },
    updateItemNameMutation: { mutate: updateItemName, isPending: updateItemNameIsPending },
  } = logicData;

  async function submit() {
    if (!await validateName()) return;
    updateItemName();
  }

  return (
    <Form
      onSubmit={submit}
      className="flex flex-col gap-4"
    >
      <FormTextInput
        label={t('forms.inventoryItem.name.label')}
        placeholder={t('forms.inventoryItem.name.placeholder')}
        required
        {...nameField('name')}
      />

      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <FormButton
          variant="subtle"
          color="gray"
          onClick={onCancel}
          disabled={updateItemNameIsPending}
        >
          {t('common.actions.cancel')}
        </FormButton>

        <FormButton
          type="submit"
          color="primary"
          loading={updateItemNameIsPending}
        >
          {t('common.actions.save')}
        </FormButton>
      </div>
    </Form>
  );
}
