import { db } from '@/libs/db';
import { units } from '@/db/schema/units';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.name || !body.abbreviation) {
      return NextResponse.json(
        {
          success: false,
          message: {
            'pt-br': 'Nome e abreviação são obrigatórios.',
            'es-mx': 'El nombre y la abreviatura son obligatorios.',
            'en-us': 'Name and abbreviation are required.',
          },
          data: null,
        },
        { status: 422 },
      );
    }

    const [updated] = await db
      .update(units)
      .set({ name: body.name, abbreviation: body.abbreviation, updated_at: new Date() })
      .where(eq(units.id, Number(id)))
      .returning();

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          message: {
            'pt-br': 'Unidade não encontrada.',
            'es-mx': 'Unidad no encontrada.',
            'en-us': 'Unit not found.',
          },
          data: null,
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: {
        'pt-br': 'Unidade atualizada com sucesso.',
        'es-mx': 'Unidad actualizada con éxito.',
        'en-us': 'Unit updated successfully.',
      },
      data: updated,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        message: {
          'pt-br': 'Erro ao atualizar unidade.',
          'es-mx': 'Error al actualizar la unidad.',
          'en-us': 'Error updating unit.',
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

    const existing = await db
      .select()
      .from(units)
      .where(eq(units.id, Number(id)));

    if (existing.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: {
            'pt-br': 'Unidade não encontrada.',
            'es-mx': 'Unidad no encontrada.',
            'en-us': 'Unit not found.',
          },
          data: null,
        },
        { status: 404 },
      );
    }

    await db.delete(units).where(eq(units.id, Number(id)));

    return NextResponse.json({
      success: true,
      message: {
        'pt-br': 'Unidade excluída com sucesso.',
        'es-mx': 'Unidad eliminada con éxito.',
        'en-us': 'Unit deleted successfully.',
      },
      data: null,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        message: {
          'pt-br': 'Erro ao excluir unidade.',
          'es-mx': 'Error al eliminar la unidad.',
          'en-us': 'Error deleting unit.',
        },
        data: null,
      },
      { status: 500 },
    );
  }
}
