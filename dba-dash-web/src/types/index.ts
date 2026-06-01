/* ========================================================
   DBA Dash Web Console — Type Definitions
   ======================================================== */

// --- Instances ---
export interface Instance {
  InstanceID: number;
  Instance: string;
  InstanceDisplayName: string;
  InstanceGroupName?: string;
  ShowInSummary: boolean;
  IsAzure: boolean;
  AzureDBName?: string;
  AzureDatabaseID?: number;
  EngineEdition?: number;
  ConnectionID?: string;
  HasInstanceMetadata: boolean;
  elastic_pool_name?: string;
  TagGroup?: string;
}

// --- Summary / Checks ---
export interface SummaryRow {
  InstanceID: number;
  Instance: string;
  InstanceDisplayName: string;
  BackupStatus: number;
  BackupStatusDescription: string;
  LogBackupStatus: number;
  LogBackupStatusDescription: string;
  DriveStatus: number;
  DriveStatusDescription: string;
  JobStatus: number;
  JobStatusDescription: string;
  CollectionDateStatus: number;
  LastCollected: string;
  FullBackupExcludedReason?: string;
  LogBackupExcludedReason?: string;
  CorruptionStatus: number;
  LastGoodCheckDBStatus: number;
  SnapshotAge: string;
  FilesStatus: number;
  UptimeStatus: number;
  IdentityStatus: number;
  AlertStatus: number;
  CustomCheckStatus: number;
  AvailabilityGroupStatus: number;
  LogShippingStatus: number;
  MirroringStatus: number;
}

// --- Backups ---
export interface BackupRow {
  InstanceID: number;
  Instance: string;
  name: string;
  DatabaseID: number;
  BackupType: string;
  LastBackup: string;
  LastBackupDuration: number;
  BackupSizeMB: number;
  CompressedSizeMB: number;
  TimeSinceLastBackup: string;
  Status: number;
  StatusDescription: string;
  ThresholdConfiguredLevel: string;
}

// --- Drives ---
export interface DriveRow {
  InstanceID: number;
  Instance: string;
  Name: string;
  Label: string;
  TotalGB: number;
  FreeGB: number;
  PctFreeSpace: number;
  DriveCheckType: string;
  Status: number;
  StatusDescription: string;
  FreeSpaceStatus: number;
  SnapshotDate: string;
}

// --- DBCC ---
export interface DBCCRow {
  InstanceID: number;
  Instance: string;
  name: string;
  DatabaseID: number;
  LastGoodCheckDB: string;
  DaysSinceLastGoodCheckDB: number;
  Status: number;
  StatusDescription: string;
  ExcludedReason?: string;
}

// --- Corruption ---
export interface CorruptionRow {
  InstanceID: number;
  Instance: string;
  name: string;
  DatabaseID: number;
  Status: number;
  StatusDescription: string;
  CorruptionDate?: string;
  AcknowledgedDate?: string;
}

// --- Performance ---
export interface CPUDataPoint {
  EventTime: string;
  SQLProcessCPU: number;
  SystemIdleCPU: number;
  OtherProcessCPU: number;
}

export interface WaitRow {
  WaitType: string;
  wait_time_ms: number;
  signal_wait_time_ms: number;
  waiting_tasks_count: number;
  wait_time_ms_per_sec: number;
}

export interface RunningQueryRow {
  session_id: number;
  Instance: string;
  login_name: string;
  host_name: string;
  database_name: string;
  status: string;
  command: string;
  wait_type: string;
  wait_time: number;
  blocking_session_id: number;
  elapsed_time_sec: number;
  cpu_time: number;
  reads: number;
  writes: number;
  text: string;
  SnapshotDate: string;
}

// --- Jobs ---
export interface AgentJobRow {
  InstanceID: number;
  Instance: string;
  JobID: string;
  name: string;
  enabled: boolean;
  LastRunDate: string;
  LastRunStatus: number;
  LastRunStatusDescription: string;
  LastRunDuration: number;
  NextRunDate?: string;
  CategoryName: string;
  Description: string;
  FailCount: number;
  TimeSinceLastFail?: string;
}

// --- HA/DR ---
export interface AGRow {
  InstanceID: number;
  Instance: string;
  ag_name: string;
  replica_server_name: string;
  role_desc: string;
  synchronization_health_desc: string;
  operational_state_desc: string;
  connected_state_desc: string;
  availability_mode_desc: string;
  failover_mode_desc: string;
}

// --- Status helpers ---
export enum StatusLevel {
  OK = 1,
  NA = 2,
  Warning = 3,
  Critical = 4,
}

export function getStatusColor(status: number): string {
  switch (status) {
    case StatusLevel.OK: return 'var(--status-ok)';
    case StatusLevel.NA: return 'var(--status-na)';
    case StatusLevel.Warning: return 'var(--status-warning)';
    case StatusLevel.Critical: return 'var(--status-critical)';
    default: return 'var(--status-na)';
  }
}

export function getStatusLabel(status: number): string {
  switch (status) {
    case StatusLevel.OK: return 'OK';
    case StatusLevel.NA: return 'N/A';
    case StatusLevel.Warning: return 'Warning';
    case StatusLevel.Critical: return 'Critical';
    default: return 'Unknown';
  }
}
