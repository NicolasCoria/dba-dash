'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: 'General',
    items: [
      { href: '/', label: 'Dashboard', icon: '📊' },
    ],
  },
  {
    title: 'Health Checks',
    items: [
      { href: '/checks/summary', label: 'Summary', icon: '✅' },
      { href: '/checks/backups', label: 'Backups', icon: '💾' },
      { href: '/checks/dbcc', label: 'DBCC CheckDB', icon: '🔍' },
      { href: '/checks/corruption', label: 'Corruption', icon: '⚠️' },
      { href: '/checks/identity', label: 'Identity Columns', icon: '🔢' },
      { href: '/checks/offline', label: 'Offline Instances', icon: '🔴' },
    ],
  },
  {
    title: 'Performance',
    items: [
      { href: '/performance', label: 'Summary', icon: '⚡' },
      { href: '/performance/cpu', label: 'CPU', icon: '🖥️' },
      { href: '/performance/waits', label: 'Waits', icon: '⏳' },
      { href: '/performance/io', label: 'IO', icon: '💿' },
      { href: '/performance/memory', label: 'Memory', icon: '🧠' },
      { href: '/performance/running', label: 'Running Queries', icon: '▶️' },
      { href: '/performance/slow-queries', label: 'Slow Queries', icon: '🐢' },
      { href: '/performance/blocking', label: 'Blocking', icon: '🚫' },
    ],
  },
  {
    title: 'Storage',
    items: [
      { href: '/storage/drives', label: 'Drives', icon: '💽' },
      { href: '/storage/files', label: 'DB Files', icon: '📁' },
    ],
  },
  {
    title: 'Agent Jobs',
    items: [
      { href: '/jobs', label: 'Job Status', icon: '⚙️' },
      { href: '/jobs/timeline', label: 'Timeline', icon: '📅' },
      { href: '/jobs/running', label: 'Running Jobs', icon: '🏃' },
    ],
  },
  {
    title: 'HA / DR',
    items: [
      { href: '/hadr/ag', label: 'Availability Groups', icon: '🔄' },
      { href: '/hadr/logshipping', label: 'Log Shipping', icon: '📤' },
      { href: '/hadr/mirroring', label: 'Mirroring', icon: '🪞' },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { href: '/config/patching', label: 'SQL Patching', icon: '🩹' },
      { href: '/config/hardware', label: 'Hardware', icon: '🖧' },
      { href: '/config/sysconfig', label: 'sys.configuration', icon: '🛠️' },
      { href: '/config/traceflags', label: 'Trace Flags', icon: '🏴' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">D</div>
          <div>
            <div className="sidebar-logo-text">DBA Dash</div>
            <div className="sidebar-logo-sub">Web Console</div>
          </div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navSections.map((section) => (
          <div key={section.title} className="sidebar-section">
            <div className="sidebar-section-title">{section.title}</div>
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
