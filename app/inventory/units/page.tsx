'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Modal } from '@mantine/core';
import { UtilsCard } from '@/src/components/utils/Card';
import { UtilsTable } from '@/src/components/utils/Table';
import { FormButton } from '@/src/components/form/Button';
import { getUnitsService, GET_UNITS_KEY } from '@/src/resources/unit/services/getUnits';
import { useCreateUnitLogicData, CreateUnitLogicComponent } from '@/src/resources/unit/logics/CreateUnit';
import { useUpdateUnitLogicData, UpdateUnitLogicComponent } from '@/src/resources/unit/logics/UpdateUnit';
import { useDeleteUnitLogicData, DeleteUnitLogicComponent } from '@/src/resources/unit/logics/DeleteUnit';
import type { IUnit } from '@/src/resources/unit/models/Unit';

export default function UnitsPage() {
  const { t } = useTranslation();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<IUnit | null>(null);

  const {
    data: unitsData,
    isFetching: unitsIsFetching,
    refetch: unitsRefetch,
  } = useQuery({
    queryKey: GET_UNITS_KEY,
    queryFn: ({ signal }) => getUnitsService({ signal }),
  });

  const units = useMemo(() => unitsData?.data ?? [], [unitsData]);

  const createUnitLogicData = useCreateUnitLogicData({
    onSuccess: () => {
      unitsRefetch();
      setCreateModalOpen(false);
    },
  });

  const updateUnitLogicData = useUpdateUnitLogicData({
    editingUnitId: editingUnit ? String(editingUnit.id) : '',
    onSuccess: () => {
      unitsRefetch();
      setUpdateModalOpen(false);
    },
  });

  const deleteUnitLogicData = useDeleteUnitLogicData({
    editingUnitId: editingUnit ? String(editingUnit.id) : '',
    onSuccess: () => {
      unitsRefetch();
      setDeleteModalOpen(false);
    },
  });

  function openCreate() {
    createUnitLogicData.createUnitReset();
    setCreateModalOpen(true);
  }

  function openUpdate(unit: IUnit) {
    setEditingUnit(unit);
    updateUnitLogicData.updateUnitValidatedFormState.setState(unit as any);
    setUpdateModalOpen(true);
  }

  function openDelete(unit: IUnit) {
    setEditingUnit(unit);
    setDeleteModalOpen(true);
  }

  return (
    <main className="flex flex-col flex-1 gap-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('units.page.title')}
          </h1>

          <span className="text-sm text-gray-500">
            {t('units.page.subtitle')}
          </span>
        </div>

        <FormButton
          color="primary"
          leftIcon="lucide:plus"
          onClick={openCreate}
        >
          {t('inventory.actions.newUnit')}
        </FormButton>
      </div>

      <UtilsCard>
        <UtilsTable
          rows={units}
          rowKey={({ item }) => String(item.id)}
          loading={unitsIsFetching}
          emptyText={t('units.table.empty')}
          columns={{
            name: t('units.table.columns.name'),
            abbreviation: t('units.table.columns.abbreviation'),
          }}
          actions={({ item }) => [
            {
              icon: 'lucide:pencil',
              label: t('common.actions.edit'),
              onClick: ({ item }) => openUpdate(item),
            },
            {
              icon: 'lucide:trash-2',
              label: t('common.actions.delete'),
              color: 'red',
              variant: 'subtle',
              onClick: ({ item }) => openDelete(item),
            },
          ]}
        />
      </UtilsCard>

      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title={t('inventory.modals.createUnit')}
        size="sm"
        centered
      >
        <CreateUnitLogicComponent
          logicData={createUnitLogicData}
          onCancel={() => setCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        opened={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        title={t('inventory.modals.updateUnit')}
        size="sm"
        centered
      >
        <UpdateUnitLogicComponent
          logicData={updateUnitLogicData}
          onCancel={() => setUpdateModalOpen(false)}
        />
      </Modal>

      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t('inventory.modals.deleteUnit')}
        size="sm"
        centered
      >
        <DeleteUnitLogicComponent
          logicData={deleteUnitLogicData}
          unitName={editingUnit?.name ?? ''}
          onCancel={() => setDeleteModalOpen(false)}
        />
      </Modal>
    </main>
  );
}
