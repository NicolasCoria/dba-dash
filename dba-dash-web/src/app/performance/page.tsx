'use client';
import Header from '@/components/layout/Header';

export default function PerformancePage() {
  return (
    <>
      <Header title="Performance Summary" />
      <div className="page-content">
        <div className="page-header">
          <h2 className="page-title">Performance Summary</h2>
          <p className="page-subtitle">Resumen de rendimiento — Fase 2</p>
        </div>
        <div className="card"><div className="card-body">
          <div className="empty-state">
            <div className="empty-state-icon">⚡</div>
            <div className="empty-state-title">Fase 2 — En desarrollo</div>
            <p style={{ color: 'var(--text-secondary)' }}>CPU, Waits, IO, Memory, Running Queries y más</p>
          </div>
        </div></div>
      </div>
    </>
  );
}
