'use client';

import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import * as yup from 'yup';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from '@/src/components/form/Form';
import { FormButton } from '@/src/components/form/Button';
import { FormNumberInput } from '@/src/components/form/Number';
import { useValidatedFormState } from '@/src/utils/state';
import { resolveApiMessage } from '@/src/utils/apiMessage';
import { buildInventoryItemService } from '../services/buildInventoryItem';
import type { IInventoryItem } from '../models/InventoryItem';
import { UtilsFor } from '@/src/components/utils/For';
import { Badge } from '@mantine/core';

export function useBuildInventoryItemLogicData({
  editingItemId,
  onSuccess,
}: {
  editingItemId: string;
  onSuccess: () => void;
}) {
  const { t, i18n } = useTranslation();

  const buildSchema = useMemo(() => yup.object({
    quantity: yup.number().default(1).min(1, t('forms.build.validation.min')).required(t('forms.build.validation.required')),
  }), [t]);

  const buildValidatedFormState = useValidatedFormState(buildSchema);

  const buildMutation = useMutation({
    mutationFn: () =>
      buildInventoryItemService({
        itemId: editingItemId,
        body: { quantity: buildValidatedFormState.state.quantity },
      }),
    onSuccess: (res) => {
      notifications.show({ message: resolveApiMessage(res.message, i18n.language), color: 'green' });
      onSuccess();
    },
    onError: (err: any) => {
      notifications.show({
        title: t('common.notifications.errorTitle'),
        message: err?.message ? resolveApiMessage(err.message, i18n.language) : t('notifications.errors.build'),
        color: 'red',
      });
    },
  });

  function buildReset() {
    buildValidatedFormState.setState(buildSchema.getDefault());
    buildValidatedFormState.setErrors({});
  }

  return { buildValidatedFormState, buildMutation, buildReset };
}

export function BuildInventoryItemLogicComponent({
  logicData,
  item,
  onCancel,
}: {
  logicData: ReturnType<typeof useBuildInventoryItemLogicData>;
  item: IInventoryItem;
  onCancel: () => void;
}) {
  const { t } = useTranslation();

  const {
    buildValidatedFormState: { field: buildField, validate: validateBuild, state: buildState },
    buildMutation: { mutate: build, isLoading: buildIsPending },
  } = logicData;

  const maxBuildable = useMemo(() => {
    if (!item.components.length) return 0;
    return Math.floor(
      Math.min(
        ...item.components.map(c =>
          Number(c.current_quantity) / Number(c.quantity_required)
        )
      )
    );
  }, [item.components]);

  async function submit() {
    if (!await validateBuild()) return;
    build();
  }

  if (!item.components.length) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-600">
          {t('forms.build.noComponentsMessage')}
        </p>

        <div className="flex justify-end">
          <FormButton
            variant="subtle"
            color="gray"
            onClick={onCancel}
          >
            {t('common.actions.close')}
          </FormButton>
        </div>
      </div>
    );
  }

  return (
    <Form
      onSubmit={submit}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">
          {t('forms.build.requiredComponentsLabel')}
        </span>

        <div className="flex flex-col gap-1.5 p-3 bg-gray-50 rounded">
          <UtilsFor
            each={item.components}
            eachKey={({ item: comp }) => String(comp.id)}
          >
            {({ item: comp }) => {
              const required = Number(comp.quantity_required) * buildState.quantity;
              const available = Number(comp.current_quantity);
              const ok = available >= required;
              return (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">
                    {comp.name}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">
                      {t('forms.build.requiredLabel', { count: required })}
                    </span>

                    <Badge
                      size="sm"
                      color={ok ? 'green' : 'red'}
                    >
                      {t('forms.build.availableLabel', { count: available })}
                    </Badge>
                  </div>
                </div>
              );
            }}
          </UtilsFor>
        </div>
      </div>

      <div className="flex items-end gap-3">
        <FormNumberInput
          label={t('forms.build.quantity.label')}
          placeholder={t('forms.build.quantity.placeholder')}
          min={1}
          max={maxBuildable}
          required
          className="flex-1"
          {...buildField('quantity')}
        />

        <p className="text-xs text-gray-500 pb-2">
          {t('forms.build.maxPossibleLabel', { count: maxBuildable })}
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <FormButton
          variant="subtle"
          color="gray"
          onClick={onCancel}
          disabled={buildIsPending}
        >
          {t('common.actions.cancel')}
        </FormButton>

        <FormButton
          type="submit"
          color="primary"
          loading={buildIsPending}
          disabled={maxBuildable === 0}
        >
          {t('forms.build.submit')}
        </FormButton>
      </div>
    </Form>
  );
}
