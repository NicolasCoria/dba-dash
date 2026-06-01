import sql from 'mssql';

const config: sql.config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'DBADashDB',
  user: process.env.DB_WINDOWS_AUTH === 'true' ? undefined : process.env.DB_USER,
  password: process.env.DB_WINDOWS_AUTH === 'true' ? undefined : process.env.DB_PASSWORD,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false',
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 2,
    idleTimeoutMillis: 30000,
  },
  requestTimeout: 30000,
  connectionTimeout: 15000,
};

// Use Windows Auth if configured
if (process.env.DB_WINDOWS_AUTH === 'true') {
  (config as unknown as Record<string, unknown>).authentication = {
    type: 'ntlm',
    options: {
      domain: process.env.DB_DOMAIN || '',
      userName: process.env.DB_USER || '',
      password: process.env.DB_PASSWORD || '',
    },
  };
}

let pool: sql.ConnectionPool | null = null;
let poolPromise: Promise<sql.ConnectionPool> | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (pool?.connected) {
    return pool;
  }

  if (poolPromise) {
    return poolPromise;
  }

  poolPromise = sql.connect(config).then((p) => {
    pool = p;
    pool.on('error', (err) => {
      console.error('SQL Pool Error:', err);
      pool = null;
      poolPromise = null;
    });
    poolPromise = null;
    return p;
  }).catch((err) => {
    poolPromise = null;
    throw err;
  });

  return poolPromise;
}

export { sql };
