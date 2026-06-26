import { db } from '@/libs/db';
import { storages } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        {
          success: false,
          message: {
            'pt-br': 'Nome é obrigatório.',
            'es-mx': 'El nombre es obligatorio.',
            'en-us': 'Name is required.',
          },
          data: null,
        },
        { status: 422 },
      );
    }

    const [updated] = await db
      .update(storages)
      .set({
        name: body.name,
        description: body.description || null,
        updated_at: new Date(),
      })
      .where(eq(storages.id, Number(id)))
      .returning();

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          message: {
            'pt-br': 'Armazenamento não encontrado.',
            'es-mx': 'Almacenamiento no encontrado.',
            'en-us': 'Storage not found.',
          },
          data: null,
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: {
        'pt-br': 'Armazenamento atualizado com sucesso.',
        'es-mx': 'Almacenamiento actualizado con éxito.',
        'en-us': 'Storage updated successfully.',
      },
      data: updated,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        message: {
          'pt-br': 'Erro ao atualizar armazenamento.',
          'es-mx': 'Error al actualizar el almacenamiento.',
          'en-us': 'Error updating storage.',
        },
        data: null,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const [deleted] = await db
      .delete(storages)
      .where(eq(storages.id, Number(id)))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: {
            'pt-br': 'Armazenamento não encontrado.',
            'es-mx': 'Almacenamiento no encontrado.',
            'en-us': 'Storage not found.',
          },
          data: null,
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: {
        'pt-br': 'Armazenamento excluído com sucesso.',
        'es-mx': 'Almacenamiento eliminado con éxito.',
        'en-us': 'Storage deleted successfully.',
      },
      data: null,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        message: {
          'pt-br': 'Erro ao excluir armazenamento.',
          'es-mx': 'Error al eliminar el almacenamiento.',
          'en-us': 'Error deleting storage.',
        },
        data: null,
      },
      { status: 500 },
    );
  }
}
