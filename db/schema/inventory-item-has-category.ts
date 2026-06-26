import { integer, pgTable, primaryKey, timestamp } from 'drizzle-orm/pg-core';
import { inventoryItems } from './inventory-items';
import { itemCategories } from './item-categories';

export const inventoryItemHasCategory = pgTable(
  'inventory_item_has_category',
  {
    inventory_item_id: integer('inventory_item_id').notNull().references(() => inventoryItems.id),
    item_category_id: integer('item_category_id').notNull().references(() => itemCategories.id),
    created_at: timestamp('created_at'),
  },
  (t) => [primaryKey({ columns: [t.inventory_item_id, t.item_category_id] })],
);
