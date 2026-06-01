import { NextResponse } from 'next/server';
import { executeSP } from '@/lib/sp-executor';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tagIDs = searchParams.get('tagIDs') || '';
    const isActive = searchParams.get('isActive') !== 'false';
    const searchString = searchParams.get('search') || '';

    const params: Record<string, unknown> = {};
    if (tagIDs) params.TagIDs = tagIDs;
    params.IsActive = isActive;
    if (searchString) params.SearchString = `%${searchString}%`;

    const instances = await executeSP('dbo.Instances_Get', params);

    return NextResponse.json({ data: instances });
  } catch (error) {
    console.error('Error fetching instances:', error);
    return NextResponse.json(
      { error: 'Error al obtener las instancias' },
      { status: 500 }
    );
  }
}
