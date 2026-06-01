'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import DataGrid, { Column } from '@/components/common/DataGrid';
import StatusBadge from '@/components/common/StatusBadge';
import MetricCard from '@/components/common/MetricCard';

interface DriveRow {
  Instance: string;
  Name: string;
  Label: string;
  TotalGB: number;
  FreeGB: number;
  PctFreeSpace: number;
  Status: number;
  StatusDescription?: string;
  SnapshotDate: string;
  [key: string]: unknown;
}

export default function DrivesPage() {
  const [data, setData] = useState<DriveRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    try {
      const res = await fetch('/api/storage/drives');
      const json = await res.json();
      setData(json.data || []);
    } catch { setData([]); }
    finally { setLoading(false); }
  }

  const critical = data.filter(r => r.Status === 4).length;
  const warn = data.filter(r => r.Status === 3).length;

  const columns: Column<DriveRow>[] = [
    { key: 'Instance', header: 'Instancia', render: r => <b>{r.Instance}</b> },
    { key: 'Name', header: 'Drive' },
    { key: 'Label', header: 'Label' },
    { key: 'TotalGB', header: 'Total (GB)', align: 'right',
      render: r => r.TotalGB != null ? Number(r.TotalGB).toFixed(1) : '-' },
    { key: 'FreeGB', header: 'Libre (GB)', align: 'right',
      render: r => r.FreeGB != null ? Number(r.FreeGB).toFixed(1) : '-' },
    { key: 'PctFreeSpace', header: '% Libre', align: 'center',
      render: r => {
        if (r.PctFreeSpace == null) return '-';
        const used = 100 - r.PctFreeSpace;
        const c = used >= 95 ? 'critical' : used >= 85 ? 'warning' : 'ok';
        return (
          <div style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'center' }}>
            <div className="progress-bar" style={{ width:80 }}>
              <div className={`progress-bar-fill ${c}`} style={{ width:`${used}%` }} />
            </div>
            <span style={{ fontSize:'var(--font-size-xs)' }}>{r.PctFreeSpace.toFixed(1)}%</span>
          </div>
        );
      }
    },
    { key: 'Status', header: 'Estado', align: 'center',
      render: r => <StatusBadge status={r.Status} label={r.StatusDescription} /> },
  ];

  return (
    <>
      <Header title="Drives" />
      <div className="page-content">
        <div className="page-header">
          <h2 className="page-title">Espacio en Disco</h2>
          <p className="page-subtitle">Estado de almacenamiento en todas las instancias</p>
        </div>
        <div className="metric-grid">
          <MetricCard label="Drives" value={data.length} status="info" />
          <MetricCard label="Warnings" value={warn} status="warning" />
          <MetricCard label="Critical" value={critical} status="critical" />
        </div>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Detalle de Drives</span>
            <button className="btn btn-secondary btn-sm" onClick={fetchData}>🔄 Actualizar</button>
          </div>
          <div className="card-body-compact">
            <DataGrid columns={columns} data={data} keyField="Name" loading={loading} maxHeight="calc(100vh - 360px)" />
          </div>
        </div>
      </div>
    </>
  );
}
