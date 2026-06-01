'use client';
import Header from '@/components/layout/Header';

export default function OfflinePage() {
  return (
    <>
      <Header title="Offline Instances" />
      <div className="page-content">
        <div className="page-header">
          <h2 className="page-title">Instancias Offline</h2>
          <p className="page-subtitle">Instancias que no están respondiendo — En desarrollo</p>
        </div>
        <div className="card"><div className="card-body">
          <div className="empty-state">
            <div className="empty-state-icon">🔴</div>
            <div className="empty-state-title">Próximamente</div>
            <p style={{ color: 'var(--text-secondary)' }}>Endpoint: /api/checks/offline</p>
          </div>
        </div></div>
      </div>
    </>
  );
}
