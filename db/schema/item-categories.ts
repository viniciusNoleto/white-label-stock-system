import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const itemCategories = pgTable('item_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  color_hex: varchar('color_hex', { length: 7 }).notNull(),
  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at'),
});
