import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const storages = pgTable('storages', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at'),
});
