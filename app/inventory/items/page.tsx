'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Modal, Badge } from '@mantine/core';
import { Icon } from '@iconify/react';
import { UtilsCard } from '@/src/components/utils/Card';
import { UtilsTable } from '@/src/components/utils/Table';
import { UtilsFor } from '@/src/components/utils/For';
import { FormButton } from '@/src/components/form/Button';
import { FormTextInput } from '@/src/components/form/TextInput';
import { useRecordState, useImmediateState } from '@/src/utils/state';
import { useDebouncedEffect } from '@/src/utils/hooks';
import { getInventoryItemsService, GET_INVENTORY_ITEMS_KEY } from '@/src/resources/inventory-item/services/getInventoryItems';
import { useCreateInventoryItemLogicData, CreateInventoryItemLogicComponent } from '@/src/resources/inventory-item/logics/CreateInventoryItem';
import { useUpdateQuantityLogicData, UpdateQuantityLogicComponent } from '@/src/resources/inventory-item/logics/UpdateQuantity';
import { useBuildInventoryItemLogicData, BuildInventoryItemLogicComponent } from '@/src/resources/inventory-item/logics/BuildInventoryItem';
import { useUpdateInventoryItemNameLogicData, UpdateInventoryItemNameLogicComponent } from '@/src/resources/inventory-item/logics/UpdateInventoryItemName';
import { useUpdateInventoryItemStorageLogicData, UpdateInventoryItemStorageLogicComponent } from '@/src/resources/inventory-item/logics/UpdateInventoryItemStorage';
import type { IInventoryItem } from '@/src/resources/inventory-item/models/InventoryItem';
import type { PaginatedMeta } from '@/src/shared/types/api';

type ModalKey = 'createItem' | 'updateQuantity' | 'updateName' | 'updateStorage' | 'build';

export default function ItemsPage() {
  const { t } = useTranslation();
  const [page, setPage] = useImmediateState(1);
  const [modals, setModals] = useState<Partial<Record<ModalKey, boolean>>>({});
  const [editingItem, setEditingItem] = useState<IInventoryItem | null>(null);

  const { state: filters, field: filterField } = useRecordState({ search: '' });

  const {
    data: itemsData,
    isFetching: itemsIsFetching,
    refetch: itemsRefetch,
  } = useQuery({
    queryKey: GET_INVENTORY_ITEMS_KEY,
    queryFn: ({ signal }) =>
      getInventoryItemsService({
        signal,
        query: { search: filters.search || undefined, page, per_page: 15 },
      }),
  });

  useDebouncedEffect(() => {
    setPage(1);
    itemsRefetch();
  }, [filters], 500);

  const items = useMemo(() => itemsData?.data?.items ?? [], [itemsData]);
  const meta = useMemo<Partial<PaginatedMeta>>(() => itemsData?.data?.meta ?? {}, [itemsData]);

  function openModal(key: ModalKey) { setModals(prev => ({ ...prev, [key]: true })); }
  function closeModal(key: ModalKey) { setModals(prev => ({ ...prev, [key]: false })); }

  const createItemLogicData = useCreateInventoryItemLogicData({
    onSuccess: () => {
      itemsRefetch();
      closeModal('createItem');
    },
  });

  const updateQuantityLogicData = useUpdateQuantityLogicData({
    editingItemId: String(editingItem?.id ?? ''),
    onSuccess: () => {
      itemsRefetch();
      closeModal('updateQuantity');
    },
  });

  const updateNameLogicData = useUpdateInventoryItemNameLogicData({
    editingItemId: String(editingItem?.id ?? ''),
    onSuccess: () => {
      itemsRefetch();
      closeModal('updateName');
    },
  });

  const updateStorageLogicData = useUpdateInventoryItemStorageLogicData({
    editingItemId: String(editingItem?.id ?? ''),
    onSuccess: () => {
      itemsRefetch();
      closeModal('updateStorage');
    },
  });

  const buildLogicData = useBuildInventoryItemLogicData({
    editingItemId: String(editingItem?.id ?? ''),
    onSuccess: () => {
      itemsRefetch();
      closeModal('build');
    },
  });

  function openUpdateQuantity(item: IInventoryItem) {
    setEditingItem(item);
    updateQuantityLogicData.updateQuantityInit(item);
    openModal('updateQuantity');
  }

  function openUpdateName(item: IInventoryItem) {
    setEditingItem(item);
    updateNameLogicData.updateItemNameInit(item);
    openModal('updateName');
  }

  function openUpdateStorage(item: IInventoryItem) {
    setEditingItem(item);
    updateStorageLogicData.updateItemStorageInit(item);
    openModal('updateStorage');
  }

  function openBuild(item: IInventoryItem) {
    setEditingItem(item);
    buildLogicData.buildReset();
    openModal('build');
  }

  return (
    <main className="flex flex-col flex-1 gap-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('inventory.page.title')}
          </h1>

          <span className="text-sm text-gray-500">
            {t('inventory.page.subtitle')}
          </span>
        </div>

        <FormButton
          color="primary"
          leftIcon="lucide:plus"
          onClick={() => {
            createItemLogicData.createInventoryItemReset();
            openModal('createItem');
          }}
        >
          {t('inventory.actions.newItem')}
        </FormButton>
      </div>

      <UtilsCard className="flex flex-col gap-6">
        <FormTextInput
          placeholder={t('inventory.search.placeholder')}
          leftSection={
            <Icon
              icon="lucide:search"
              className="text-gray-400"
            />
          }
          className="max-w-xs w-full"
          {...filterField('search')}
        />

        <UtilsTable
          rows={items}
          rowKey={({ item }) => String(item.id)}
          loading={itemsIsFetching}
          lastPage={meta.last_page ?? 1}
          page={page}
          setPage={(newPage) => {
            setPage(newPage);
            itemsRefetch();
          }}
          emptyText={t('inventory.table.empty')}
          columns={{
            name: t('inventory.table.columns.name'),
            categories: t('inventory.table.columns.categories'),
            quantity: t('inventory.table.columns.quantity'),
            unit: t('inventory.table.columns.unit'),
            storage: t('inventory.table.columns.storage'),
          }}
          renderCells={{
            name: ({ item }) => (
              <span
                className="font-medium text-gray-900 cursor-pointer hover:text-primary hover:underline"
                onClick={() => openUpdateName(item)}
                title={t('inventory.rowActions.editName')}
              >
                {item.name}
              </span>
            ),
            storage: ({ item }) => (
              <span
                className="text-gray-600 text-xs cursor-pointer hover:text-primary hover:underline"
                onClick={() => openUpdateStorage(item)}
                title={t('inventory.rowActions.editStorage')}
              >
                {item.storage?.name ?? '—'}
              </span>
            ),
            categories: ({ item }) => (
              <div className="flex flex-wrap gap-1">
                <UtilsFor
                  each={item.categories}
                  eachKey={({ item: cat }) => String(cat.id)}
                  empty={<span className="text-gray-400 text-xs">—</span>}
                >
                  {({ item: cat }) => (
                    <Badge
                      size="xs"
                      style={{ backgroundColor: cat.color_hex, color: '#fff' }}
                    >
                      {cat.name}
                    </Badge>
                  )}
                </UtilsFor>
              </div>
            ),
            quantity: ({ item }) => (
              <span
                className="font-medium cursor-pointer hover:text-primary hover:underline"
                onClick={() => openUpdateQuantity(item)}
                title={t('inventory.rowActions.editQuantity')}
              >
                {Number(item.quantity)}
              </span>
            ),
            unit: ({ item }) => (
              <span className="text-gray-600 text-xs font-medium">
                {item.unit.abbreviation}
              </span>
            ),
          }}
          actions={({ item }) => [
            {
              valid: item.components.length,
              icon: 'lucide:package-plus',
              label: t('inventory.rowActions.build'),
              color: 'primary',
              onClick: ({ item }: { item: IInventoryItem }) => openBuild(item),
            },
          ].filter(a => (a as any).valid === undefined || (a as any).valid)}
        />
      </UtilsCard>

      <Modal
        opened={!!modals.createItem}
        onClose={() => closeModal('createItem')}
        title={t('inventory.modals.createItem')}
        size="lg"
        centered
      >
        <CreateInventoryItemLogicComponent
          logicData={createItemLogicData}
          onCancel={() => closeModal('createItem')}
        />
      </Modal>

      <Modal
        opened={!!modals.updateQuantity}
        onClose={() => closeModal('updateQuantity')}
        title={t('inventory.modals.updateQuantity')}
        size="sm"
        centered
      >
        {editingItem && (
          <UpdateQuantityLogicComponent
            logicData={updateQuantityLogicData}
            itemName={editingItem.name}
            onCancel={() => closeModal('updateQuantity')}
          />
        )}
      </Modal>

      <Modal
        opened={!!modals.updateName}
        onClose={() => closeModal('updateName')}
        title={t('inventory.modals.updateName')}
        size="sm"
        centered
      >
        {editingItem && (
          <UpdateInventoryItemNameLogicComponent
            logicData={updateNameLogicData}
            onCancel={() => closeModal('updateName')}
          />
        )}
      </Modal>

      <Modal
        opened={!!modals.updateStorage}
        onClose={() => closeModal('updateStorage')}
        title={t('inventory.modals.updateStorage')}
        size="sm"
        centered
      >
        {editingItem && (
          <UpdateInventoryItemStorageLogicComponent
            logicData={updateStorageLogicData}
            onCancel={() => closeModal('updateStorage')}
          />
        )}
      </Modal>

      <Modal
        opened={!!modals.build}
        onClose={() => closeModal('build')}
        title={t('inventory.modals.build', { name: editingItem?.name ?? '' })}
        size="md"
        centered
      >
        {editingItem && (
          <BuildInventoryItemLogicComponent
            logicData={buildLogicData}
            item={editingItem}
            onCancel={() => closeModal('build')}
          />
        )}
      </Modal>
    </main>
  );
}
