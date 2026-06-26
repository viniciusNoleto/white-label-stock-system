'use client';

import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import * as yup from 'yup';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from '@/src/components/form/Form';
import { FormButton } from '@/src/components/form/Button';
import { FormTextInput } from '@/src/components/form/TextInput';
import { FormTextarea } from '@/src/components/form/Textarea';
import { useValidatedFormState } from '@/src/utils/state';
import { resolveApiMessage } from '@/src/utils/apiMessage';
import { updateStorageService } from '../services/updateStorage';

export function useUpdateStorageLogicData({ editingStorageId, onSuccess }: { editingStorageId: string; onSuccess: () => void }) {
  const { t, i18n } = useTranslation();

  const updateStorageSchema = useMemo(() => yup.object({
    name: yup.string().default('').required(t('forms.storage.validation.nameRequired')).max(100),
    description: yup.string().default('').optional(),
  }), [t]);

  const updateStorageValidatedFormState = useValidatedFormState(updateStorageSchema);

  const updateStorageMutation = useMutation({
    mutationFn: () => updateStorageService({
      id: editingStorageId,
      body: {
        name: updateStorageValidatedFormState.state.name,
        description: updateStorageValidatedFormState.state.description || undefined,
      },
    }),
    onSuccess: (res) => {
      notifications.show({ message: resolveApiMessage(res.message, i18n.language), color: 'green' });
      onSuccess();
    },
    onError: (err: any) => {
      notifications.show({
        title: t('common.notifications.errorTitle'),
        message: err?.message ? resolveApiMessage(err.message, i18n.language) : t('notifications.errors.updateStorage'),
        color: 'red',
      });
    },
  });

  return { updateStorageValidatedFormState, updateStorageMutation };
}

export function UpdateStorageLogicComponent({
  logicData,
  onCancel,
}: {
  logicData: ReturnType<typeof useUpdateStorageLogicData>;
  onCancel: () => void;
}) {
  const { t } = useTranslation();

  const {
    updateStorageValidatedFormState: { field: storageField, validate: validateStorage },
    updateStorageMutation: { mutate: updateStorage, isPending: updateStorageIsPending },
  } = logicData;

  async function submit() {
    if (!await validateStorage()) return;
    updateStorage();
  }

  return (
    <Form
      onSubmit={submit}
      className="flex flex-col gap-4"
    >
      <FormTextInput
        label={t('forms.storage.name.label')}
        placeholder={t('forms.storage.name.placeholder')}
        required
        {...storageField('name')}
      />

      <FormTextarea
        label={t('forms.storage.description.label')}
        placeholder={t('forms.storage.description.placeholder')}
        rows={3}
        {...storageField('description')}
      />

      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <FormButton
          variant="subtle"
          color="gray"
          onClick={onCancel}
          disabled={updateStorageIsPending}
        >
          {t('common.actions.cancel')}
        </FormButton>

        <FormButton
          type="submit"
          color="primary"
          loading={updateStorageIsPending}
        >
          {t('common.actions.save')}
        </FormButton>
      </div>
    </Form>
  );
}
