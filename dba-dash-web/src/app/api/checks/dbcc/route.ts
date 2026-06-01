import { NextResponse } from 'next/server';
import { executeSP } from '@/lib/sp-executor';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const instanceIDs = searchParams.get('instanceIDs') || '';

    const params: Record<string, unknown> = {};
    if (instanceIDs) params.InstanceIDs = instanceIDs;
    params.IncludeCritical = true;
    params.IncludeWarning = true;
    params.IncludeNA = true;
    params.IncludeOK = true;

    const dbcc = await executeSP('dbo.LastGoodCheckDB_Get', params);

    return NextResponse.json({ data: dbcc });
  } catch (error) {
    console.error('Error fetching DBCC data:', error);
    return NextResponse.json(
      { error: 'Error al obtener el estado de DBCC CheckDB' },
      { status: 500 }
    );
  }
}
