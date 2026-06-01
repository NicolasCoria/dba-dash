'use client';

interface MetricCardProps {
  label: string;
  value: string | number;
  status?: 'ok' | 'warning' | 'critical' | 'info';
  detail?: string;
}

export default function MetricCard({ label, value, status = 'info', detail }: MetricCardProps) {
  return (
    <div className={`metric-card ${status}`}>
      <div className="metric-card-label">{label}</div>
      <div className={`metric-card-value ${status}`}>{value}</div>
      {detail && <div className="metric-card-detail">{detail}</div>}
    </div>
  );
}
