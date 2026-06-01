'use client';

interface StatusBadgeProps {
  status: number;
  label?: string;
}

export function getStatusClass(status: number): string {
  switch (status) {
    case 1: return 'ok';
    case 2: return 'na';
    case 3: return 'warning';
    case 4: return 'critical';
    default: return 'na';
  }
}

export function getStatusText(status: number): string {
  switch (status) {
    case 1: return 'OK';
    case 2: return 'N/A';
    case 3: return 'Warning';
    case 4: return 'Critical';
    default: return 'Unknown';
  }
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const cls = getStatusClass(status);
  const text = label || getStatusText(status);

  return (
    <span className={`status-badge ${cls}`}>
      <span className={`status-dot ${cls}`} />
      {text}
    </span>
  );
}
