'use client';
import Header from '@/components/layout/Header';

export default function IdentityPage() {
  return (
    <>
      <Header title="Identity Columns" />
      <div className="page-content">
        <div className="page-header">
          <h2 className="page-title">Identity Columns</h2>
          <p className="page-subtitle">Monitoreo de columnas identity cercanas al límite — En desarrollo</p>
        </div>
        <div className="card"><div className="card-body">
          <div className="empty-state">
            <div className="empty-state-icon">🔢</div>
            <div className="empty-state-title">Próximamente</div>
            <p style={{ color: 'var(--text-secondary)' }}>Esta sección está en desarrollo. Endpoint: /api/checks/identity</p>
          </div>
        </div></div>
      </div>
    </>
  );
}
