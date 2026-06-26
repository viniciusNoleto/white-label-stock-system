import { db } from '@/libs/db';
import { storages } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const rows = await db.select().from(storages).orderBy(storages.name);
    return NextResponse.json({ success: true, message: { 'pt-br': 'Operação realizada com sucesso.', 'es-mx': 'Operación realizada con éxito.', 'en-us': 'Operation completed successfully.' }, data: rows });
  } catch {
    return NextResponse.json({ success: false, message: { 'pt-br': 'Erro ao buscar armazenamentos.', 'es-mx': 'Error al buscar almacenamientos.', 'en-us': 'Error fetching storages.' }, data: null }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json({ success: false, message: { 'pt-br': 'Nome é obrigatório.', 'es-mx': 'El nombre es obligatorio.', 'en-us': 'Name is required.' }, data: null }, { status: 422 });
    }

    const now = new Date();
    const [storage] = await db.insert(storages).values({
      name: body.name,
      description: body.description || null,
      created_at: now,
      updated_at: now,
    }).returning();

    return NextResponse.json({ success: true, message: { 'pt-br': 'Armazenamento criado com sucesso.', 'es-mx': 'Almacenamiento creado con éxito.', 'en-us': 'Storage created successfully.' }, data: storage }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: { 'pt-br': 'Erro ao criar armazenamento.', 'es-mx': 'Error al crear el almacenamiento.', 'en-us': 'Error creating storage.' }, data: null }, { status: 500 });
  }
}
