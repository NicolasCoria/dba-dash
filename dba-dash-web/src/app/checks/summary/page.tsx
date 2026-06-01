'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import DataGrid, { Column } from '@/components/common/DataGrid';
import StatusBadge from '@/components/common/StatusBadge';
import MetricCard from '@/components/common/MetricCard';

interface SummaryRow {
  InstanceDisplayName: string;
  Instance: string;
  InstanceID: number;
  BackupStatus: number;
  LogBackupStatus: number;
  DriveStatus: number;
  JobStatus: number;
  CorruptionStatus: number;
  LastGoodCheckDBStatus: number;
  UptimeStatus: number;
  IdentityStatus: number;
  AlertStatus: number;
  CustomCheckStatus: number;
  AvailabilityGroupStatus: number;
  LogShippingStatus: number;
  MirroringStatus: number;
  LastCollected: string;
  CollectionDateStatus: number;
  FilesStatus: number;
  [key: string]: unknown;
}

export default function ChecksSummaryPage() {
  const [data, setData] = useState<SummaryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    try {
      const res = await fetch('/api/checks/summary');
      const json = await res.json();
      setData(json.data || []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  // Count statuses across all checks
  function countStatus(status: number) {
    let count = 0;
    const fields: (keyof SummaryRow)[] = [
      'BackupStatus', 'LogBackupStatus', 'DriveStatus', 'JobStatus',
      'CorruptionStatus', 'LastGoodCheckDBStatus', 'FilesStatus',
    ];
    for (const row of data) {
      for (const f of fields) {
        if (row[f] === status) count++;
      }
    }
    return count;
  }

  const columns: Column<SummaryRow>[] = [
    {
      key: 'InstanceDisplayName',
      header: 'Instancia',
      render: (row) => <span style={{ fontWeight: 600 }}>{row.InstanceDisplayName || row.Instance}</span>,
    },
    { key: 'BackupStatus', header: 'Backups', align: 'center', render: (row) => <StatusBadge status={row.BackupStatus} /> },
    { key: 'LogBackupStatus', header: 'Log', align: 'center', render: (row) => <StatusBadge status={row.LogBackupStatus} /> },
    { key: 'LastGoodCheckDBStatus', header: 'DBCC', align: 'center', render: (row) => <StatusBadge status={row.LastGoodCheckDBStatus} /> },
    { key: 'CorruptionStatus', header: 'Corrupt.', align: 'center', render: (row) => <StatusBadge status={row.CorruptionStatus} /> },
    { key: 'DriveStatus', header: 'Drives', align: 'center', render: (row) => <StatusBadge status={row.DriveStatus} /> },
    { key: 'JobStatus', header: 'Jobs', align: 'center', render: (row) => <StatusBadge status={row.JobStatus} /> },
    { key: 'UptimeStatus', header: 'Uptime', align: 'center', render: (row) => <StatusBadge status={row.UptimeStatus} /> },
    { key: 'IdentityStatus', header: 'Identity', align: 'center', render: (row) => <StatusBadge status={row.IdentityStatus} /> },
    { key: 'CustomCheckStatus', header: 'Custom', align: 'center', render: (row) => <StatusBadge status={row.CustomCheckStatus} /> },
    {
      key: 'LastCollected',
      header: 'Última Recolección',
      render: (row) => row.LastCollected
        ? new Date(row.LastCollected).toLocaleString('es-AR')
        : '-',
    },
  ];

  return (
    <>
      <Header title="Health Summary" />
      <div className="page-content">
        <div className="page-header">
          <h2 className="page-title">Health Check Summary</h2>
          <p className="page-subtitle">Vista consolidada del estado de salud de todas las instancias</p>
        </div>

        <div className="metric-grid">
          <MetricCard label="Checks OK" value={countStatus(1)} status="ok" />
          <MetricCard label="Checks Warning" value={countStatus(3)} status="warning" />
          <MetricCard label="Checks Critical" value={countStatus(4)} status="critical" />
          <MetricCard label="Instancias" value={data.length} status="info" />
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Estado por Instancia</span>
            <button className="btn btn-secondary btn-sm" onClick={fetchData}>
              🔄 Actualizar
            </button>
          </div>
          <div className="card-body-compact">
            <DataGrid
              columns={columns}
              data={data}
              keyField="InstanceID"
              loading={loading}
              maxHeight="calc(100vh - 380px)"
            />
          </div>
        </div>
      </div>
    </>
  );
}
