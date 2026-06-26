import { decimal, integer, pgTable, primaryKey, timestamp } from 'drizzle-orm/pg-core';
import { inventoryItems } from './inventory-items';

export const inventoryItemHasComponent = pgTable(
  'inventory_item_has_component',
  {
    inventory_item_id: integer('inventory_item_id').notNull().references(() => inventoryItems.id),
    component_inventory_item_id: integer('component_inventory_item_id').notNull().references(() => inventoryItems.id),
    quantity_required: decimal('quantity_required', { precision: 15, scale: 4 }).notNull(),
    created_at: timestamp('created_at'),
  },
  (t) => [primaryKey({ columns: [t.inventory_item_id, t.component_inventory_item_id] })],
);
