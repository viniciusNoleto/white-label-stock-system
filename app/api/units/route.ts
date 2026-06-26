import { db } from '@/libs/db';
import { units } from '@/db/schema/units';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const rows = await db.select().from(units).orderBy(units.name);
    return NextResponse.json({ success: true, message: { 'pt-br': 'Operação realizada com sucesso.', 'es-mx': 'Operación realizada con éxito.', 'en-us': 'Operation completed successfully.' }, data: rows });
  } catch {
    return NextResponse.json({ success: false, message: { 'pt-br': 'Erro ao buscar unidades.', 'es-mx': 'Error al buscar unidades.', 'en-us': 'Error fetching units.' }, data: null }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.abbreviation) {
      return NextResponse.json({ success: false, message: { 'pt-br': 'Nome e abreviação são obrigatórios.', 'es-mx': 'El nombre y la abreviatura son obligatorios.', 'en-us': 'Name and abbreviation are required.' }, data: null }, { status: 422 });
    }

    const now = new Date();
    const [unit] = await db.insert(units).values({
      name: body.name,
      abbreviation: body.abbreviation,
      created_at: now,
      updated_at: now,
    }).returning();

    return NextResponse.json({ success: true, message: { 'pt-br': 'Unidade criada com sucesso.', 'es-mx': 'Unidad creada con éxito.', 'en-us': 'Unit created successfully.' }, data: unit }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: { 'pt-br': 'Erro ao criar unidade.', 'es-mx': 'Error al crear la unidad.', 'en-us': 'Error creating unit.' }, data: null }, { status: 500 });
  }
}
