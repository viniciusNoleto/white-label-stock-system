import { db } from '@/libs/db';
import { itemCategories } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.name || !body.color_hex) {
      return NextResponse.json(
        {
          success: false,
          message: {
            'pt-br': 'Nome e cor são obrigatórios.',
            'es-mx': 'El nombre y el color son obligatorios.',
            'en-us': 'Name and color are required.',
          },
          data: null,
        },
        { status: 422 }
      );
    }

    const [updated] = await db
      .update(itemCategories)
      .set({
        name: body.name,
        color_hex: body.color_hex,
        updated_at: new Date(),
      })
      .where(eq(itemCategories.id, Number(id)))
      .returning();

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          message: {
            'pt-br': 'Categoria não encontrada.',
            'es-mx': 'Categoría no encontrada.',
            'en-us': 'Category not found.',
          },
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: {
        'pt-br': 'Categoria atualizada com sucesso.',
        'es-mx': 'Categoría actualizada con éxito.',
        'en-us': 'Category updated successfully.',
      },
      data: updated,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        message: {
          'pt-br': 'Erro ao atualizar categoria.',
          'es-mx': 'Error al actualizar la categoría.',
          'en-us': 'Error updating category.',
        },
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [deleted] = await db
      .delete(itemCategories)
      .where(eq(itemCategories.id, Number(id)))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: {
            'pt-br': 'Categoria não encontrada.',
            'es-mx': 'Categoría no encontrada.',
            'en-us': 'Category not found.',
          },
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: {
        'pt-br': 'Categoria excluída com sucesso.',
        'es-mx': 'Categoría eliminada con éxito.',
        'en-us': 'Category deleted successfully.',
      },
      data: null,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        message: {
          'pt-br': 'Erro ao excluir categoria.',
          'es-mx': 'Error al eliminar la categoría.',
          'en-us': 'Error deleting category.',
        },
        data: null,
      },
      { status: 500 }
    );
  }
}
