import { decimal, integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { units } from './units';
import { storages } from './storages';

export const inventoryItems = pgTable('inventory_items', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  quantity: decimal('quantity', { precision: 15, scale: 4 }).notNull().default('0'),
  unit_id: integer('unit_id').notNull().references(() => units.id),
  storage_id: integer('storage_id').references(() => storages.id),
  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at'),
});
