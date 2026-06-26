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
import { updateUnitService } from '../services/updateUnit';

export function useUpdateUnitLogicData({ editingUnitId, onSuccess }: { editingUnitId: string; onSuccess: () => void }) {
  const { t, i18n } = useTranslation();

  const updateUnitSchema = useMemo(() => yup.object({
    name: yup.string().default('').required(t('forms.unit.validation.nameRequired')).max(100),
    abbreviation: yup.string().default('').required(t('forms.unit.validation.abbreviationRequired')).max(20),
  }), [t]);

  const updateUnitValidatedFormState = useValidatedFormState(updateUnitSchema);

  const updateUnitMutation = useMutation({
    mutationFn: () => updateUnitService({ id: editingUnitId, body: updateUnitValidatedFormState.state }),
    onSuccess: (res) => {
      notifications.show({ message: resolveApiMessage(res.message, i18n.language), color: 'green' });
      onSuccess();
    },
    onError: (err: any) => {
      notifications.show({
        title: t('common.notifications.errorTitle'),
        message: err?.message ? resolveApiMessage(err.message, i18n.language) : t('notifications.errors.updateUnit'),
        color: 'red',
      });
    },
  });

  return { updateUnitValidatedFormState, updateUnitMutation };
}

export function UpdateUnitLogicComponent({
  logicData,
  onCancel,
}: {
  logicData: ReturnType<typeof useUpdateUnitLogicData>;
  onCancel: () => void;
}) {
  const { t } = useTranslation();

  const {
    updateUnitValidatedFormState: { field: unitField, validate: validateUnit },
    updateUnitMutation: { mutate: updateUnit, isPending: updateUnitIsPending },
  } = logicData;

  async function submit() {
    if (!await validateUnit()) return;
    updateUnit();
  }

  return (
    <Form
      onSubmit={submit}
      className="flex flex-col gap-4"
    >
      <FormTextInput
        label={t('forms.unit.name.label')}
        placeholder={t('forms.unit.name.placeholder')}
        required
        {...unitField('name')}
      />

      <FormTextInput
        label={t('forms.unit.abbreviation.label')}
        placeholder={t('forms.unit.abbreviation.placeholder')}
        required
        {...unitField('abbreviation')}
      />

      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <FormButton
          variant="subtle"
          color="gray"
          onClick={onCancel}
          disabled={updateUnitIsPending}
        >
          {t('common.actions.cancel')}
        </FormButton>

        <FormButton
          type="submit"
          color="primary"
          loading={updateUnitIsPending}
        >
          {t('common.actions.save')}
        </FormButton>
      </div>
    </Form>
  );
}
