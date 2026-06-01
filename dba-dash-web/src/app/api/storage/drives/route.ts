import { NextResponse } from 'next/server';
import { executeSP } from '@/lib/sp-executor';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const instanceIDs = searchParams.get('instanceIDs') || '';
    const includeMetrics = searchParams.get('includeMetrics') === 'true';

    const params: Record<string, unknown> = {};
    if (instanceIDs) params.InstanceIDs = instanceIDs;
    params.IncludeCritical = true;
    params.IncludeWarning = true;
    params.IncludeNA = true;
    params.IncludeOK = true;
    params.IncludeMetrics = includeMetrics;
    params.ShowHidden = false;

    const drives = await executeSP('dbo.Drives_Get', params);

    return NextResponse.json({ data: drives });
  } catch (error) {
    console.error('Error fetching drives:', error);
    return NextResponse.json(
      { error: 'Error al obtener el estado de drives' },
      { status: 500 }
    );
  }
}
