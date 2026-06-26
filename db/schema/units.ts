import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const units = pgTable('units', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  abbreviation: varchar('abbreviation', { length: 20 }).notNull(),
  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at'),
});
