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

    const data = await executeSP('dbo.IdentityColumns_Get', params);

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching identity columns:', error);
    return NextResponse.json(
      { error: 'Error al obtener identity columns' },
      { status: 500 }
    );
  }
}
