import { NextResponse } from 'next/server';
import { executeSP } from '@/lib/sp-executor';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const instanceIDs = searchParams.get('instanceIDs') || '';

    const params: Record<string, unknown> = {};
    if (instanceIDs) params.InstanceIDs = instanceIDs;

    const summary = await executeSP('dbo.Summary_Get', params);

    return NextResponse.json({ data: summary });
  } catch (error) {
    console.error('Error fetching summary:', error);
    return NextResponse.json(
      { error: 'Error al obtener el resumen de estado' },
      { status: 500 }
    );
  }
}
