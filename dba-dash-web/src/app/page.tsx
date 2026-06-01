'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import MetricCard from '@/components/common/MetricCard';
import DataGrid, { Column } from '@/components/common/DataGrid';
import StatusBadge from '@/components/common/StatusBadge';

interface SummaryData {
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

export default function DashboardPage() {
  const [data, setData] = useState<SummaryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    try {
      const res = await fetch('/api/checks/summary');
      if (!res.ok) throw new Error('Error al cargar datos');
      const json = await res.json();
      setData(json.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  // Calculate metrics from summary data
  const totalInstances = data.length;
  const criticalCount = data.filter((r) =>
    [r.BackupStatus, r.DriveStatus, r.JobStatus, r.CorruptionStatus, r.LastGoodCheckDBStatus]
      .some((s) => s === 4)
  ).length;
  const warningCount = data.filter((r) =>
    [r.BackupStatus, r.DriveStatus, r.JobStatus, r.CorruptionStatus, r.LastGoodCheckDBStatus]
      .some((s) => s === 3) &&
    ![r.BackupStatus, r.DriveStatus, r.JobStatus, r.CorruptionStatus, r.LastGoodCheckDBStatus]
      .some((s) => s === 4)
  ).length;
  const okCount = totalInstances - criticalCount - warningCount;

  const columns: Column<SummaryData>[] = [
    {
      key: 'InstanceDisplayName',
      header: 'Instancia',
      render: (row) => (
        <span style={{ fontWeight: 600 }}>{row.InstanceDisplayName || row.Instance}</span>
      ),
    },
    {
      key: 'BackupStatus',
      header: 'Backups',
      align: 'center',
      render: (row) => <StatusBadge status={row.BackupStatus} />,
    },
    {
      key: 'LogBackupStatus',
      header: 'Log Backup',
      align: 'center',
      render: (row) => <StatusBadge status={row.LogBackupStatus} />,
    },
    {
      key: 'DriveStatus',
      header: 'Drives',
      align: 'center',
      render: (row) => <StatusBadge status={row.DriveStatus} />,
    },
    {
      key: 'JobStatus',
      header: 'Jobs',
      align: 'center',
      render: (row) => <StatusBadge status={row.JobStatus} />,
    },
    {
      key: 'LastGoodCheckDBStatus',
      header: 'DBCC',
      align: 'center',
      render: (row) => <StatusBadge status={row.LastGoodCheckDBStatus} />,
    },
    {
      key: 'CorruptionStatus',
      header: 'Corruption',
      align: 'center',
      render: (row) => <StatusBadge status={row.CorruptionStatus} />,
    },
    {
      key: 'UptimeStatus',
      header: 'Uptime',
      align: 'center',
      render: (row) => <StatusBadge status={row.UptimeStatus} />,
    },
    {
      key: 'FilesStatus',
      header: 'Files',
      align: 'center',
      render: (row) => <StatusBadge status={row.FilesStatus} />,
    },
    {
      key: 'CollectionDateStatus',
      header: 'Collection',
      align: 'center',
      render: (row) => <StatusBadge status={row.CollectionDateStatus} />,
    },
  ];

  return (
    <>
      <Header title="Dashboard" />
      <div className="page-content">
        <div className="page-header">
          <h2 className="page-title">SQL Server Health Overview</h2>
          <p className="page-subtitle">
            Estado general de todas las instancias monitoreadas
          </p>
        </div>

        {error && (
          <div className="card" style={{ marginBottom: 'var(--space-4)', borderColor: 'var(--status-critical)' }}>
            <div className="card-body">
              <p style={{ color: 'var(--status-critical)' }}>⚠️ {error}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-2)' }}>
                Verifica la configuración de conexión a la base de datos en .env.local
              </p>
            </div>
          </div>
        )}

        <div className="metric-grid">
          <MetricCard
            label="Total Instancias"
            value={totalInstances}
            status="info"
            detail="Instancias monitoreadas"
          />
          <MetricCard
            label="OK"
            value={okCount}
            status="ok"
            detail="Sin problemas detectados"
          />
          <MetricCard
            label="Warnings"
            value={warningCount}
            status="warning"
            detail="Requieren atención"
          />
          <MetricCard
            label="Critical"
            value={criticalCount}
            status="critical"
            detail="Acción inmediata requerida"
          />
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Health Summary por Instancia</span>
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
              emptyMessage="No se encontraron instancias. Verifica la conexión a DBADashDB."
              maxHeight="calc(100vh - 340px)"
            />
          </div>
        </div>
      </div>
    </>
  );
}
