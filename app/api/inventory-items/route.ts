import { db } from '@/libs/db';
import { inventoryItems, units, itemCategories, inventoryItemHasCategory, inventoryItemHasComponent, storages } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq, ilike, sql } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') ?? '';
    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const perPage = Math.min(100, Math.max(1, Number(searchParams.get('per_page') ?? 15)));

    const where = search ? ilike(inventoryItems.name, `%${search}%`) : undefined;

    const [{ count }] = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(inventoryItems)
      .where(where);

    const rows = await db
      .select({
        id: inventoryItems.id,
        name: inventoryItems.name,
        quantity: inventoryItems.quantity,
        created_at: inventoryItems.created_at,
        updated_at: inventoryItems.updated_at,
        unit_id: units.id,
        unit_name: units.name,
        unit_abbreviation: units.abbreviation,
        storage_id: storages.id,
        storage_name: storages.name,
      })
      .from(inventoryItems)
      .innerJoin(units, eq(inventoryItems.unit_id, units.id))
      .leftJoin(storages, eq(inventoryItems.storage_id, storages.id))
      .where(where)
      .orderBy(inventoryItems.name)
      .limit(perPage)
      .offset((page - 1) * perPage);

    const ids = rows.map(r => r.id);
    const categoryRows = ids.length > 0
      ? await db
          .select({
            inventory_item_id: inventoryItemHasCategory.inventory_item_id,
            id: itemCategories.id,
            name: itemCategories.name,
            color_hex: itemCategories.color_hex,
          })
          .from(inventoryItemHasCategory)
          .innerJoin(itemCategories, eq(inventoryItemHasCategory.item_category_id, itemCategories.id))
          .where(sql`${inventoryItemHasCategory.inventory_item_id} = ANY(${sql.raw(`ARRAY[${ids.join(',')}]::bigint[]`)})`)
      : [];

    const componentRows = ids.length > 0
      ? await db
          .select({
            inventory_item_id: inventoryItemHasComponent.inventory_item_id,
            component_id: inventoryItemHasComponent.component_inventory_item_id,
            quantity_required: inventoryItemHasComponent.quantity_required,
            component_name: inventoryItems.name,
            component_quantity: inventoryItems.quantity,
          })
          .from(inventoryItemHasComponent)
          .innerJoin(inventoryItems, eq(inventoryItemHasComponent.component_inventory_item_id, inventoryItems.id))
          .where(sql`${inventoryItemHasComponent.inventory_item_id} = ANY(${sql.raw(`ARRAY[${ids.join(',')}]::bigint[]`)})`)
      : [];

    const items = rows.map(row => ({
      id: row.id,
      name: row.name,
      quantity: row.quantity,
      created_at: row.created_at,
      updated_at: row.updated_at,
      unit: {
        id: row.unit_id,
        name: row.unit_name,
        abbreviation: row.unit_abbreviation,
      },
      storage: row.storage_id != null
        ? { id: row.storage_id, name: row.storage_name! }
        : null,
      categories: categoryRows
        .filter(c => String(c.inventory_item_id) === String(row.id))
        .map(c => ({ id: c.id, name: c.name, color_hex: c.color_hex })),
      components: componentRows
        .filter(c => String(c.inventory_item_id) === String(row.id))
        .map(c => ({
          id: c.component_id,
          name: c.component_name,
          quantity_required: c.quantity_required,
          current_quantity: c.component_quantity,
        })),
    }));

    const lastPage = Math.max(1, Math.ceil(count / perPage));

    return NextResponse.json({
      success: true,
      message: { 'pt-br': 'Operação realizada com sucesso.', 'es-mx': 'Operación realizada con éxito.', 'en-us': 'Operation completed successfully.' },
      data: {
        items,
        meta: { page, per_page: perPage, total: count, last_page: lastPage },
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: { 'pt-br': 'Erro ao buscar itens.', 'es-mx': 'Error al buscar artículos.', 'en-us': 'Error fetching items.' }, data: null }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.unit_id) {
      return NextResponse.json({ success: false, message: { 'pt-br': 'Nome e unidade são obrigatórios.', 'es-mx': 'El nombre y la unidad son obligatorios.', 'en-us': 'Name and unit are required.' }, data: null }, { status: 422 });
    }

    const now = new Date();
    const [item] = await db.insert(inventoryItems).values({
      name: body.name,
      quantity: String(body.quantity ?? 0),
      unit_id: Number(body.unit_id),
      storage_id: body.storage_id ? Number(body.storage_id) : null,
      created_at: now,
      updated_at: now,
    }).returning();

    if (body.category_ids?.length) {
      await db.insert(inventoryItemHasCategory).values(
        body.category_ids.map((catId: string) => ({
          inventory_item_id: item.id,
          item_category_id: Number(catId),
          created_at: now,
        }))
      );
    }

    if (body.components?.length) {
      await db.insert(inventoryItemHasComponent).values(
        body.components.map((c: { id: string; quantity_required: number }) => ({
          inventory_item_id: item.id,
          component_inventory_item_id: Number(c.id),
          quantity_required: String(c.quantity_required),
          created_at: now,
        }))
      );
    }

    return NextResponse.json({ success: true, message: { 'pt-br': 'Item criado com sucesso.', 'es-mx': 'Artículo creado con éxito.', 'en-us': 'Item created successfully.' }, data: item }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: { 'pt-br': 'Erro ao criar item.', 'es-mx': 'Error al criar el artículo.', 'en-us': 'Error creating item.' }, data: null }, { status: 500 });
  }
}
