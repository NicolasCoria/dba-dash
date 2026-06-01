import { getPool, sql } from './db';

export interface SPParam {
  name: string;
  type?: sql.ISqlTypeFactoryWithNoParams | sql.ISqlTypeFactoryWithLength | sql.ISqlTypeFactoryWithScale | sql.ISqlTypeFactoryWithPrecisionScale;
  value: unknown;
}

/**
 * Executes a stored procedure and returns the result recordset(s).
 */
export async function executeSP<T = Record<string, unknown>>(
  spName: string,
  params?: SPParam[] | Record<string, unknown>
): Promise<T[]> {
  const pool = await getPool();
  const request = pool.request();

  if (params) {
    if (Array.isArray(params)) {
      for (const p of params) {
        if (p.value !== undefined && p.value !== null) {
          if (p.type) {
            request.input(p.name, p.type as unknown as sql.ISqlType, p.value);
          } else {
            request.input(p.name, p.value);
          }
        }
      }
    } else {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          request.input(key, value);
        }
      }
    }
  }

  const result = await request.execute(spName);
  return result.recordset as T[];
}

/**
 * Executes a stored procedure returning multiple recordsets.
 */
export async function executeSPMulti(
  spName: string,
  params?: Record<string, unknown>
): Promise<sql.IRecordSet<unknown>[]> {
  const pool = await getPool();
  const request = pool.request();

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        request.input(key, value);
      }
    }
  }

  const result = await request.execute(spName);
  return result.recordsets as unknown as sql.IRecordSet<unknown>[];
}

/**
 * Executes a raw SQL query (use sparingly — prefer SPs).
 */
export async function executeQuery<T = Record<string, unknown>>(
  query: string,
  params?: Record<string, unknown>
): Promise<T[]> {
  const pool = await getPool();
  const request = pool.request();

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        request.input(key, value);
      }
    }
  }

  const result = await request.query(query);
  return result.recordset as T[];
}
