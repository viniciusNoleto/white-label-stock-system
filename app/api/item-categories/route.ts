import { db } from '@/libs/db';
import { itemCategories } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const rows = await db.select().from(itemCategories).orderBy(itemCategories.name);
    return NextResponse.json({ success: true, message: { 'pt-br': 'Operação realizada com sucesso.', 'es-mx': 'Operación realizada con éxito.', 'en-us': 'Operation completed successfully.' }, data: rows });
  } catch {
    return NextResponse.json({ success: false, message: { 'pt-br': 'Erro ao buscar categorias.', 'es-mx': 'Error al buscar categorías.', 'en-us': 'Error fetching categories.' }, data: null }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.color_hex) {
      return NextResponse.json({ success: false, message: { 'pt-br': 'Nome e cor são obrigatórios.', 'es-mx': 'El nombre y el color son obligatorios.', 'en-us': 'Name and color are required.' }, data: null }, { status: 422 });
    }

    const now = new Date();
    const [category] = await db.insert(itemCategories).values({
      name: body.name,
      color_hex: body.color_hex,
      created_at: now,
      updated_at: now,
    }).returning();

    return NextResponse.json({ success: true, message: { 'pt-br': 'Categoria criada com sucesso.', 'es-mx': 'Categoría creada con éxito.', 'en-us': 'Category created successfully.' }, data: category }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: { 'pt-br': 'Erro ao criar categoria.', 'es-mx': 'Error al crear la categoría.', 'en-us': 'Error creating category.' }, data: null }, { status: 500 });
  }
}
