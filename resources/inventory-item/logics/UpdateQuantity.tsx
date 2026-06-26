'use client';

import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import * as yup from 'yup';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from '@/src/components/form/Form';
import { FormButton } from '@/src/components/form/Button';
import { FormNumberInput } from '@/src/components/form/Number';
import { useValidatedFormState } from '@/src/utils/state';
import { resolveApiMessage } from '@/src/utils/apiMessage';
import { updateInventoryItemQuantityService } from '../services/updateInventoryItemQuantity';
import type { IInventoryItem } from '../models/InventoryItem';
import { SegmentedControl } from '@mantine/core';

type QuantityMode = 'set' | 'add' | 'subtract';

export function useUpdateQuantityLogicData({
  editingItemId,
  onSuccess,
}: {
  editingItemId: string;
  onSuccess: () => void;
}) {
  const { t, i18n } = useTranslation();
  const [currentQuantity, setCurrentQuantity] = useState(0);

  const updateQuantitySchema = useMemo(() => yup.object({
    mode: yup.string().oneOf(['set', 'add', 'subtract'] as const).default('set').required(),
    amount: yup.number().default(0).min(0, t('forms.updateQuantity.validation.min')).required(t('forms.updateQuantity.validation.required')),
  }), [t]);

  const updateQuantityValidatedFormState = useValidatedFormState(updateQuantitySchema);

  function computeQuantity(mode: QuantityMode, amount: number) {
    if (mode === 'add') return currentQuantity + amount;
    if (mode === 'subtract') return Math.max(0, currentQuantity - amount);
    return amount;
  }

  const updateQuantityMutation = useMutation({
    mutationFn: () => {
      const { mode, amount } = updateQuantityValidatedFormState.state;
      return updateInventoryItemQuantityService({
        itemId: editingItemId,
        body: { quantity: computeQuantity(mode as QuantityMode, amount) },
      });
    },
    onSuccess: (res) => {
      notifications.show({ message: resolveApiMessage(res.message, i18n.language), color: 'green' });
      onSuccess();
    },
    onError: (err: any) => {
      notifications.show({
        title: t('common.notifications.errorTitle'),
        message: err?.message ? resolveApiMessage(err.message, i18n.language) : t('notifications.errors.updateQuantity'),
        color: 'red',
      });
    },
  });

  function updateQuantityInit(item: IInventoryItem) {
    setCurrentQuantity(Number(item.quantity));
    updateQuantityValidatedFormState.setState({ mode: 'set', amount: Number(item.quantity) });
    updateQuantityValidatedFormState.setErrors({});
  }

  return { updateQuantityValidatedFormState, updateQuantityMutation, updateQuantityInit, currentQuantity, computeQuantity };
}

export function UpdateQuantityLogicComponent({
  logicData,
  itemName,
  onCancel,
}: {
  logicData: ReturnType<typeof useUpdateQuantityLogicData>;
  itemName: string;
  onCancel: () => void;
}) {
  const { t } = useTranslation();

  const {
    updateQuantityValidatedFormState: { field: qtyField, validate: validateQty, state: qtyState, setValue: setQtyValue },
    updateQuantityMutation: { mutate: updateQuantity, isLoading: updateQuantityIsPending },
    currentQuantity,
    computeQuantity,
  } = logicData;

  const mode = qtyState.mode as QuantityMode;

  async function submit() {
    if (!await validateQty()) return;
    updateQuantity();
  }

  function handleModeChange(value: string) {
    const nextMode = value as QuantityMode;
    setQtyValue('mode', nextMode);
    setQtyValue('amount', nextMode === 'set' ? currentQuantity : 0);
  }

  return (
    <Form
      onSubmit={submit}
      className="flex flex-col gap-4"
    >
      <p className="text-sm text-gray-600">
        {t('forms.updateQuantity.description', { name: itemName })}
      </p>

      <SegmentedControl
        fullWidth
        value={mode}
        onChange={handleModeChange}
        data={[
          { label: t('forms.updateQuantity.mode.set'), value: 'set' },
          { label: t('forms.updateQuantity.mode.add'), value: 'add' },
          { label: t('forms.updateQuantity.mode.subtract'), value: 'subtract' },
        ]}
      />

      <FormNumberInput
        label={mode === 'set' ? t('forms.updateQuantity.quantity.label') : t('forms.updateQuantity.amount.label')}
        placeholder={mode === 'set' ? t('forms.updateQuantity.quantity.placeholder') : t('forms.updateQuantity.amount.placeholder')}
        min={0}
        step={1}
        required
        {...qtyField('amount')}
      />

      <p className="text-xs text-gray-500">
        {t('forms.updateQuantity.preview', { count: computeQuantity(mode, qtyState.amount) })}
      </p>

      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <FormButton
          variant="subtle"
          color="gray"
          onClick={onCancel}
          disabled={updateQuantityIsPending}
        >
          {t('common.actions.cancel')}
        </FormButton>

        <FormButton
          type="submit"
          color="primary"
          loading={updateQuantityIsPending}
        >
          {t('common.actions.save')}
        </FormButton>
      </div>
    </Form>
  );
}
