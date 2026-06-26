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
import { createStorageService } from '../services/createStorage';

export function useCreateStorageLogicData({ onSuccess }: { onSuccess: () => void }) {
  const { t, i18n } = useTranslation();

  const createStorageSchema = useMemo(() => yup.object({
    name: yup.string().default('').required(t('forms.storage.validation.nameRequired')).max(100),
    description: yup.string().default('').optional(),
  }), [t]);

  const createStorageValidatedFormState = useValidatedFormState(createStorageSchema);

  const createStorageMutation = useMutation({
    mutationFn: () => createStorageService({
      body: {
        name: createStorageValidatedFormState.state.name,
        description: createStorageValidatedFormState.state.description || undefined,
      },
    }),
    onSuccess: (res) => {
      notifications.show({ message: resolveApiMessage(res.message, i18n.language), color: 'green' });
      onSuccess();
    },
    onError: (err: any) => {
      notifications.show({
        title: t('common.notifications.errorTitle'),
        message: err?.message ? resolveApiMessage(err.message, i18n.language) : t('notifications.errors.createStorage'),
        color: 'red',
      });
    },
  });

  function createStorageReset() {
    createStorageValidatedFormState.setState(createStorageSchema.getDefault());
    createStorageValidatedFormState.setErrors({});
  }

  return { createStorageValidatedFormState, createStorageMutation, createStorageReset };
}

export function CreateStorageLogicComponent({
  logicData,
  onCancel,
}: {
  logicData: ReturnType<typeof useCreateStorageLogicData>;
  onCancel: () => void;
}) {
  const { t } = useTranslation();

  const {
    createStorageValidatedFormState: { field: storageField, validate: validateStorage },
    createStorageMutation: { mutate: createStorage, isPending: createStorageIsPending },
  } = logicData;

  async function submit() {
    if (!await validateStorage()) return;
    createStorage();
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
          disabled={createStorageIsPending}
        >
          {t('common.actions.cancel')}
        </FormButton>

        <FormButton
          type="submit"
          color="primary"
          loading={createStorageIsPending}
        >
          {t('common.actions.save')}
        </FormButton>
      </div>
    </Form>
  );
}
