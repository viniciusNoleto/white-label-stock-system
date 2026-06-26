'use client';

import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import * as yup from 'yup';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ColorInput } from '@mantine/core';
import { Form } from '@/src/components/form/Form';
import { FormButton } from '@/src/components/form/Button';
import { FormTextInput } from '@/src/components/form/TextInput';
import { useValidatedFormState } from '@/src/utils/state';
import { resolveApiMessage } from '@/src/utils/apiMessage';
import { updateItemCategoryService } from '../services/updateItemCategory';

export function useUpdateItemCategoryLogicData({ editingCategoryId, onSuccess }: { editingCategoryId: string; onSuccess: () => void }) {
  const { t, i18n } = useTranslation();

  const updateItemCategorySchema = useMemo(() => yup.object({
    name: yup.string().default('').required(t('forms.category.validation.nameRequired')).max(100),
    color_hex: yup.string().default('#6F1FF9').required(t('forms.category.validation.colorRequired')),
  }), [t]);

  const updateItemCategoryValidatedFormState = useValidatedFormState(updateItemCategorySchema);

  const updateItemCategoryMutation = useMutation({
    mutationFn: () => updateItemCategoryService({
      id: editingCategoryId,
      body: updateItemCategoryValidatedFormState.state,
    }),
    onSuccess: (res) => {
      notifications.show({ message: resolveApiMessage(res.message, i18n.language), color: 'green' });
      onSuccess();
    },
    onError: (err: any) => {
      notifications.show({
        title: t('common.notifications.errorTitle'),
        message: err?.message ? resolveApiMessage(err.message, i18n.language) : t('notifications.errors.updateCategory'),
        color: 'red',
      });
    },
  });

  return {
    updateItemCategoryValidatedFormState,
    updateItemCategoryMutation,
  };
}

export function UpdateItemCategoryLogicComponent({
  logicData,
  onCancel,
}: {
  logicData: ReturnType<typeof useUpdateItemCategoryLogicData>;
  onCancel: () => void;
}) {
  const { t } = useTranslation();

  const {
    updateItemCategoryValidatedFormState: {
      field: categoryField,
      validate: validateCategory,
      setValue: setCategoryValue,
    },
    updateItemCategoryMutation: { mutate: updateItemCategoryMutate, isLoading: updateItemCategoryIsPending },
  } = logicData;

  async function submit() {
    if (!await validateCategory()) return;
    updateItemCategoryMutate();
  }

  return (
    <Form
      onSubmit={submit}
      className="flex flex-col gap-4"
    >
      <FormTextInput
        label={t('forms.category.name.label')}
        placeholder={t('forms.category.name.placeholder')}
        required
        {...categoryField('name')}
      />

      <ColorInput
        label={t('forms.category.color.label')}
        placeholder={t('forms.category.color.placeholder')}
        required
        value={categoryField('color_hex').value}
        onChange={(v) => setCategoryValue('color_hex', v)}
        error={categoryField('color_hex').error}
        format="hex"
        swatches={['#6F1FF9', '#881FF9', '#2482ED', '#E31E24', '#2ecc71', '#f39c12', '#e74c3c', '#1abc9c']}
      />

      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <FormButton
          variant="subtle"
          color="gray"
          onClick={onCancel}
          disabled={updateItemCategoryIsPending}
        >
          {t('common.actions.cancel')}
        </FormButton>

        <FormButton
          type="submit"
          color="primary"
          loading={updateItemCategoryIsPending}
        >
          {t('common.actions.save')}
        </FormButton>
      </div>
    </Form>
  );
}
