'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import DataGrid, { Column } from '@/components/common/DataGrid';
import StatusBadge from '@/components/common/StatusBadge';
import MetricCard from '@/components/common/MetricCard';

interface DBCCRow {
  Instance: string;
  name: string;
  LastGoodCheckDB: string;
  DaysSinceLastGoodCheckDB: number;
  Status: number;
  StatusDescription?: string;
  [key: string]: unknown;
}

export default function DBCCPage() {
  const [data, setData] = useState<DBCCRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    try {
      const res = await fetch('/api/checks/dbcc');
      const json = await res.json();
      setData(json.data || []);
    } catch { setData([]); }
    finally { setLoading(false); }
  }

  const critical = data.filter(r => r.Status === 4).length;
  const warn = data.filter(r => r.Status === 3).length;

  const columns: Column<DBCCRow>[] = [
    { key: 'Instance', header: 'Instancia', render: r => <b>{r.Instance}</b> },
    { key: 'name', header: 'Base de Datos' },
    { key: 'LastGoodCheckDB', header: 'Último CheckDB',
      render: r => r.LastGoodCheckDB ? new Date(r.LastGoodCheckDB).toLocaleString('es-AR') : 'Nunca' },
    { key: 'DaysSinceLastGoodCheckDB', header: 'Días', align: 'right',
      render: r => r.DaysSinceLastGoodCheckDB != null ? r.DaysSinceLastGoodCheckDB.toString() : '-' },
    { key: 'Status', header: 'Estado', align: 'center',
      render: r => <StatusBadge status={r.Status} label={r.StatusDescription} /> },
  ];

  return (
    <>
      <Header title="DBCC CheckDB" />
      <div className="page-content">
        <div className="page-header">
          <h2 className="page-title">DBCC CheckDB</h2>
          <p className="page-subtitle">Estado del último DBCC CHECKDB exitoso por base de datos</p>
        </div>
        <div className="metric-grid">
          <MetricCard label="Total DBs" value={data.length} status="info" />
          <MetricCard label="Warnings" value={warn} status="warning" />
          <MetricCard label="Critical" value={critical} status="critical" />
        </div>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Detalle DBCC CheckDB</span>
            <button className="btn btn-secondary btn-sm" onClick={fetchData}>🔄 Actualizar</button>
          </div>
          <div className="card-body-compact">
            <DataGrid columns={columns} data={data} keyField="name" loading={loading} maxHeight="calc(100vh - 360px)" />
          </div>
        </div>
      </div>
    </>
  );
}
