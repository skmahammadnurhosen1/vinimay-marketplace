import React, { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  UserCheck,
  History,
  Lock,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Settings,
} from 'lucide-react';
import { AdminUser, AdminRole, AdminAuditLog } from '../../types/admin';

interface AdminSettingsSecurityPageProps {
  users: AdminUser[];
  auditLogs: AdminAuditLog[];
  onToggle2FA: (userId: string) => void;
  onUpdateUserRole: (userId: string, newRole: AdminRole) => void;
}

export const AdminSettingsSecurityPage: React.FC<AdminSettingsSecurityPageProps> = ({
  users,
  auditLogs,
  onToggle2FA,
  onUpdateUserRole,
}) => {
  const [defaultCommission, setDefaultCommission] = useState(10.0);
  const [show2FASimulationModal, setShow2FASimulationModal] = useState(false);
  const [activeUserFor2FA, setActiveUserFor2FA] = useState<AdminUser | null>(null);

  const roles: AdminRole[] = [
    'Super Admin',
    'Catalog Operations Admin',
    'Finance & Settlements Admin',
    'Customer Support Admin',
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <span>Platform Security, 2FA & Role-Based Access (RBAC)</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 mt-0.5">
            Future-ready authentication placeholders, role granularities, default take rates, and governance audit logs.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold self-start sm:self-auto">
          <Lock className="w-3.5 h-3.5" />
          <span>RBAC Enforcement: ACTIVE</span>
        </div>
      </div>

      {/* 2FA Integration Placeholder Banner */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C59B27]/20 border border-[#C59B27]/40 flex items-center justify-center text-[#E5C158] shrink-0 mt-0.5">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm sm:text-base text-white">
                Admin Multi-Factor Authentication (2FA) Security Integration
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C59B27] text-gray-950">
                RECOMMENDED
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1 max-w-2xl">
              Equip platform staff with TOTP time-based one-time passcodes (Google Authenticator / Microsoft Authenticator) for sensitive actions like commission overrides, refund approvals, and bank payouts.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveUserFor2FA(users[0]);
            setShow2FASimulationModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-[#C59B27] hover:bg-[#b08920] text-gray-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Configure 2FA Authenticator</span>
        </button>
      </div>

      {/* RBAC Administration Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Role-Based Access Control (RBAC) User Directory</span>
            </h2>
            <p className="text-xs text-gray-700">Manage internal permissions and operational assignments.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5 pl-4">Staff Member & Email</th>
                <th className="p-3.5">Assigned RBAC Role</th>
                <th className="p-3.5">2FA Protection</th>
                <th className="p-3.5">Granted Capabilities</th>
                <th className="p-3.5">Last Session</th>
                <th className="p-3.5 pr-4 text-right">Role Assignment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/70 transition">
                  <td className="p-3.5 pl-4">
                    <span className="font-bold text-gray-900 block">{u.name}</span>
                    <span className="text-[11px] text-gray-700">{u.email}</span>
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                        u.role === 'Super Admin'
                          ? 'bg-purple-100 text-purple-900 border border-purple-200'
                          : u.role === 'Catalog Operations Admin'
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : u.role === 'Finance & Settlements Admin'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <button
                      onClick={() => onToggle2FA(u.id)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
                        u.twoFactorEnabled
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span>{u.twoFactorEnabled ? '2FA Enabled' : 'Disabled (Click to toggle)'}</span>
                    </button>
                  </td>

                  <td className="p-3.5 max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {u.permissions.slice(0, 3).map((perm, idx) => (
                        <span key={idx} className="text-[9px] bg-gray-100 text-gray-700 px-1 rounded font-mono">
                          {perm}
                        </span>
                      ))}
                      {u.permissions.length > 3 && (
                        <span className="text-[9px] text-gray-700">+{u.permissions.length - 3} more</span>
                      )}
                    </div>
                  </td>

                  <td className="p-3.5 text-gray-700">{u.lastActive}</td>

                  <td className="p-3.5 pr-4 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => onUpdateUserRole(u.id, e.target.value as AdminRole)}
                      className="px-2 py-1 bg-gray-50 border border-gray-300 rounded text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#C59B27]"
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Default Take Rate & Commercial Config */}
      <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-xs space-y-3">
        <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2">
          <Settings className="w-4 h-4 text-[#C59B27]" />
          <span>Marketplace Default Take Rate & Commercial Defaults</span>
        </h2>
        <p className="text-xs text-gray-700">
          This default percentage is automatically applied to newly onboarded merchants who do not have an active bespoke volume agreement.
        </p>

        <div className="flex items-center gap-3 pt-1">
          <div className="relative w-36">
            <input
              type="number"
              step="0.5"
              min="1"
              max="25"
              value={defaultCommission}
              onChange={(e) => setDefaultCommission(parseFloat(e.target.value) || 0)}
              className="w-full pl-3 pr-8 py-1.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:border-[#C59B27]"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">%</span>
          </div>

          <button
            onClick={() => alert(`Platform default take rate set to ${defaultCommission}%.`)}
            className="px-4 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold cursor-pointer"
          >
            Save Default
          </button>
        </div>
      </div>

      {/* Platform Security Audit Logs */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <History className="w-4 h-4 text-purple-600" />
            <span>Platform Security Audit Trails</span>
          </h2>
          <span className="text-xs text-gray-700">Immutable ledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3 pl-4">Timestamp</th>
                <th className="p-3">Admin Operator</th>
                <th className="p-3">Module</th>
                <th className="p-3">Action Executed</th>
                <th className="p-3">Target Reference</th>
                <th className="p-3 pr-4">Operational Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition">
                  <td className="p-3 pl-4 text-gray-700">{log.timestamp}</td>
                  <td className="p-3 font-sans font-bold text-gray-900">{log.adminName}</td>
                  <td className="p-3 font-sans">
                    <span className="px-1.5 py-0.2 rounded bg-gray-100 text-gray-800 font-bold text-[10px]">
                      {log.module}
                    </span>
                  </td>
                  <td className="p-3 font-sans font-bold text-blue-700">{log.action}</td>
                  <td className="p-3 text-gray-700">{log.targetId}</td>
                  <td className="p-3 pr-4 font-sans text-gray-700">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2FA Simulation Modal */}
      {show2FASimulationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-full max-w-md animate-in fade-in space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#C59B27]" />
                <span>Configure TOTP Authenticator</span>
              </h3>
              <button
                onClick={() => setShow2FASimulationModal(false)}
                className="text-gray-400 hover:text-gray-900 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-600 leading-relaxed">
              Scan this QR code with your authenticator app (Google Authenticator, Microsoft Authenticator, or 1Password) to link your admin account:
            </p>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col items-center justify-center gap-2">
              <div className="w-40 h-40 bg-white p-2 rounded-lg border border-gray-300 flex items-center justify-center shadow-xs">
                {/* SVG Mock QR Code */}
                <svg className="w-full h-full text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4-2h2v2h-2v-2zm2 4h2v4h-2v-4zm-4 0h2v2h-2v-2zm4-4h2v2h-2v-2zm-2 2h2v2h-2v-2z" />
                </svg>
              </div>
              <span className="font-mono text-[10px] text-gray-500">
                Key: JBSW-Y3DP-EHPK-3PXP
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  if (activeUserFor2FA) {
                    onToggle2FA(activeUserFor2FA.id);
                  }
                  setShow2FASimulationModal(false);
                  alert('2FA successfully verified and linked!');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
              >
                Confirm & Enable 2FA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
