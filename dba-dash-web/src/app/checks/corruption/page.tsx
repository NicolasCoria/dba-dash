'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import DataGrid, { Column } from '@/components/common/DataGrid';
import StatusBadge from '@/components/common/StatusBadge';

interface CorruptionRow {
  Instance: string;
  name: string;
  Status: number;
  StatusDescription?: string;
  CorruptionDate?: string;
  [key: string]: unknown;
}

export default function CorruptionPage() {
  const [data, setData] = useState<CorruptionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    try {
      const res = await fetch('/api/checks/corruption');
      const json = await res.json();
      setData(json.data || []);
    } catch { setData([]); }
    finally { setLoading(false); }
  }

  const columns: Column<CorruptionRow>[] = [
    { key: 'Instance', header: 'Instancia', render: r => <b>{r.Instance}</b> },
    { key: 'name', header: 'Base de Datos' },
    { key: 'Status', header: 'Estado', align: 'center',
      render: r => <StatusBadge status={r.Status} label={r.StatusDescription} /> },
    { key: 'CorruptionDate', header: 'Fecha Corrupción',
      render: r => r.CorruptionDate ? new Date(r.CorruptionDate).toLocaleString('es-AR') : '-' },
  ];

  return (
    <>
      <Header title="Corruption" />
      <div className="page-content">
        <div className="page-header">
          <h2 className="page-title">Corrupción de Datos</h2>
          <p className="page-subtitle">Detección de corrupción en bases de datos</p>
        </div>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Estado de Corrupción</span>
            <button className="btn btn-secondary btn-sm" onClick={fetchData}>🔄 Actualizar</button>
          </div>
          <div className="card-body-compact">
            <DataGrid columns={columns} data={data} keyField="name" loading={loading} maxHeight="calc(100vh - 300px)" />
          </div>
        </div>
      </div>
    </>
  );
}
