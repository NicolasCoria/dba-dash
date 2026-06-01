import { NextResponse } from 'next/server';
import { executeSP } from '@/lib/sp-executor';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const instanceIDs = searchParams.get('instanceIDs') || '';

    const params: Record<string, unknown> = {};
    if (instanceIDs) params.InstanceIDs = instanceIDs;

    const corruption = await executeSP('dbo.Corruption_Get', params);

    return NextResponse.json({ data: corruption });
  } catch (error) {
    console.error('Error fetching corruption data:', error);
    return NextResponse.json(
      { error: 'Error al obtener el estado de corrupción' },
      { status: 500 }
    );
  }
}
