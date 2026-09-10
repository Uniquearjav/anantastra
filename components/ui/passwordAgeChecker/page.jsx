'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  Check, 
  AlertTriangle, 
  Download, 
  Upload, 
  Search, 
  Info, 
  Lock 
} from 'lucide-react';

const INITIAL_DEMO_ACCOUNTS = [
  { id: '1', name: 'Primary Google Account', category: 'Personal', date: new Date(Date.now() - 210 * 86400000).toISOString().split('T')[0], notes: 'Enabled 2FA with hardware key' },
  { id: '2', name: 'GitHub Enterprise', category: 'Developer', date: new Date(Date.now() - 45 * 86400000).toISOString().split('T')[0], notes: 'SSH keys rotated annually' },
  { id: '3', name: 'NetBanking Portal', category: 'Financial', date: new Date(Date.now() - 110 * 86400000).toISOString().split('T')[0], notes: 'Mandatory 90-day bank policy' },
  { id: '4', name: 'AWS Cloud Console', category: 'Developer', date: new Date(Date.now() - 15 * 86400000).toISOString().split('T')[0], notes: 'IAM root credentials protected' },
];

export default function PasswordAgeChecker() {
  const [accounts, setAccounts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Form state
  const [accountName, setAccountName] = useState('');
  const [changeDate, setChangeDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Personal');
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('anantastra_pwd_accounts');
      if (saved) {
        setAccounts(JSON.parse(saved));
      } else {
        setAccounts(INITIAL_DEMO_ACCOUNTS);
      }
    } catch {
      setAccounts(INITIAL_DEMO_ACCOUNTS);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('anantastra_pwd_accounts', JSON.stringify(accounts));
    }
  }, [accounts, isLoaded]);

  // Compute age metrics for each account
  const enrichedAccounts = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return accounts.map(acc => {
      const pDate = new Date(acc.date);
      pDate.setHours(0, 0, 0, 0);
      const diffMs = today.getTime() - pDate.getTime();
      const ageDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

      let status = 'safe'; // < 90 days
      let statusLabel = 'Fresh (< 90d)';
      if (ageDays >= 180) {
        status = 'critical';
        statusLabel = 'Critical (> 180d)';
      } else if (ageDays >= 90) {
        status = 'warning';
        statusLabel = 'Needs Review (90-180d)';
      }

      return {
        ...acc,
        ageDays,
        status,
        statusLabel,
      };
    });
  }, [accounts]);

  // Summary audit stats
  const auditStats = useMemo(() => {
    const total = enrichedAccounts.length;
    if (total === 0) return { total: 0, critical: 0, warning: 0, safe: 0, avgAge: 0 };

    const critical = enrichedAccounts.filter(a => a.status === 'critical').length;
    const warning = enrichedAccounts.filter(a => a.status === 'warning').length;
    const safe = enrichedAccounts.filter(a => a.status === 'safe').length;
    const avgAge = Math.round(enrichedAccounts.reduce((sum, a) => sum + a.ageDays, 0) / total);

    return { total, critical, warning, safe, avgAge };
  }, [enrichedAccounts]);

  // Filtered accounts list
  const filteredAccounts = useMemo(() => {
    return enrichedAccounts.filter(a => {
      const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || 
                          (a.notes && a.notes.toLowerCase().includes(search.toLowerCase()));
      const matchCat = filterCategory === 'all' || a.category === filterCategory;
      const matchStatus = filterStatus === 'all' || a.status === filterStatus;
      return matchSearch && matchCat && matchStatus;
    }).sort((a, b) => b.ageDays - a.ageDays); // Oldest first
  }, [enrichedAccounts, search, filterCategory, filterStatus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!accountName.trim()) return;

    if (editingId) {
      setAccounts(prev => prev.map(a => a.id === editingId ? {
        ...a,
        name: accountName.trim(),
        date: changeDate,
        category,
        notes: notes.trim()
      } : a));
      setEditingId(null);
    } else {
      const newAcc = {
        id: Date.now().toString(),
        name: accountName.trim(),
        date: changeDate,
        category,
        notes: notes.trim()
      };
      setAccounts(prev => [newAcc, ...prev]);
    }

    setAccountName('');
    setNotes('');
    setChangeDate(new Date().toISOString().split('T')[0]);
  };

  const handleEdit = (acc) => {
    setEditingId(acc.id);
    setAccountName(acc.name);
    setChangeDate(acc.date);
    setCategory(acc.category);
    setNotes(acc.notes || '');
  };

  const handleDelete = (id) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  const handleRotateNow = (id) => {
    const today = new Date().toISOString().split('T')[0];
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, date: today } : a));
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(accounts, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `password-audit-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-3 px-3 py-1 font-mono text-xs border-primary/30">
          <Lock className="w-3.5 h-3.5 mr-1.5 text-primary" />
          Security Hygiene Tracker
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Password Age Checker & Audit
        </h1>
        <p className="text-muted-foreground text-sm mt-1 max-w-xl mx-auto">
          Audit password expiration cycles and prevent credential rot across critical accounts with zero credential storage.
        </p>
      </div>

      {/* Security Banner */}
      <div className="mb-8 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center gap-3 text-xs text-emerald-700 dark:text-emerald-300">
        <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <div>
          <strong>Strict Zero-Knowledge Architecture:</strong> This tool only stores account names and rotation dates in your browser's local storage. Never enter actual passwords.
        </div>
      </div>

      {/* Audit Stats Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        <Card className="p-4 border-border/60 text-center shadow-xs">
          <div className="text-xs text-muted-foreground">Accounts Monitored</div>
          <div className="text-2xl font-bold font-mono text-foreground mt-1">{auditStats.total}</div>
        </Card>

        <Card className="p-4 border-rose-500/30 bg-rose-500/5 text-center shadow-xs">
          <div className="text-xs text-rose-700 dark:text-rose-400 font-semibold">Critical (&gt;180d)</div>
          <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">{auditStats.critical}</div>
        </Card>

        <Card className="p-4 border-amber-500/30 bg-amber-500/5 text-center shadow-xs">
          <div className="text-xs text-amber-700 dark:text-amber-400 font-semibold">Review (90–180d)</div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">{auditStats.warning}</div>
        </Card>

        <Card className="p-4 border-emerald-500/30 bg-emerald-500/5 text-center shadow-xs">
          <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">Fresh (&lt;90d)</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{auditStats.safe}</div>
        </Card>

        <Card className="p-4 border-border/60 text-center shadow-xs col-span-2 sm:col-span-1">
          <div className="text-xs text-muted-foreground">Average Age</div>
          <div className="text-2xl font-bold font-mono text-foreground mt-1">{auditStats.avgAge} <span className="text-xs font-normal text-muted-foreground">days</span></div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Add / Edit Account */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 border-border/60 shadow-xs">
            <h2 className="text-base font-bold text-foreground mb-4 flex items-center justify-between">
              <span>{editingId ? 'Edit Account Audit' : 'Add Account to Audit'}</span>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setAccountName('');
                    setNotes('');
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel Edit
                </button>
              )}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Account / Service Name
                </label>
                <Input
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g. Google Workspace, AWS, Bank"
                  className="text-sm"
                  required
                />
              </div>

              {/* Quick Suggestion Chips */}
              <div className="flex flex-wrap gap-1">
                {['Google', 'GitHub', 'AWS', 'NetBanking', 'Slack', 'Email'].map(name => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setAccountName(name)}
                    className="text-[11px] px-2 py-0.5 rounded border border-border/60 bg-muted/30 hover:bg-muted text-foreground font-mono"
                  >
                    +{name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Date Last Changed
                  </label>
                  <Input
                    type="date"
                    value={changeDate}
                    onChange={(e) => setChangeDate(e.target.value)}
                    className="text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Financial">Financial</option>
                    <option value="Developer">Developer</option>
                    <option value="Work">Work</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Security Notes (Optional)
                </label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. 2FA enabled, passkey active"
                  className="text-xs"
                />
              </div>

              <Button type="submit" className="w-full text-xs">
                {editingId ? 'Update Record' : 'Add to Security Tracker'}
              </Button>
            </form>
          </Card>

          {/* Export Action Card */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-card/60 text-xs">
            <span className="text-muted-foreground">Export tracker data:</span>
            <Button
              size="sm"
              variant="outline"
              onClick={exportJSON}
              className="h-7 text-xs px-2.5"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Download JSON
            </Button>
          </div>
        </div>

        {/* Right Audit List */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-6 border-border/60 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search accounts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 text-xs h-9"
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-1">
                {['all', 'critical', 'warning', 'safe'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFilterStatus(st)}
                    className={`px-2 py-1 rounded text-[11px] font-semibold uppercase border transition-colors ${
                      filterStatus === st
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted/30 text-muted-foreground border-border/60 hover:text-foreground'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* List items */}
            {filteredAccounts.length > 0 ? (
              <div className="space-y-3">
                {filteredAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    className={`p-4 rounded-xl border transition-all ${
                      acc.status === 'critical'
                        ? 'border-rose-500/40 bg-rose-500/5'
                        : acc.status === 'warning'
                        ? 'border-amber-500/40 bg-amber-500/5'
                        : 'border-border/60 bg-card'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground text-sm">{acc.name}</h3>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono">
                            {acc.category}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3 font-mono">
                          <span>Changed: {acc.date}</span>
                          <span>•</span>
                          <span className={`font-bold ${
                            acc.status === 'critical' ? 'text-rose-600 dark:text-rose-400' :
                            acc.status === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                            'text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {acc.ageDays} days old
                          </span>
                        </div>
                        {acc.notes && (
                          <div className="text-xs text-muted-foreground/80 mt-1 italic">
                            "{acc.notes}"
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Rotate Password Today"
                          onClick={() => handleRotateNow(acc.id)}
                          className="h-7 text-xs px-2 text-primary hover:bg-primary/10"
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Rotate
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(acc)}
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          title="Edit"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(acc.id)}
                          className="h-7 w-7 text-rose-500 hover:text-rose-600"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm border border-dashed border-border/60 rounded-xl">
                No accounts match the current filters.
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Security Guidance Guide */}
      <Card className="mt-8 p-6 border-border/60 shadow-xs">
        <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          NIST & Cybersecurity Guidelines for Password Lifecycles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">NIST Special Publication 800-63B</h3>
            <p className="text-xs text-muted-foreground">
              Modern security standards emphasize password length (16+ chars), randomness, and multi-factor authentication (MFA) over arbitrary 30-day forced rotations.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">When to Rotate Immediately</h3>
            <p className="text-xs text-muted-foreground">
              Always rotate credentials when a service announces a breach, when sharing accounts, after employee departures, or on shared devices.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Passkeys & Hardware MFA</h3>
            <p className="text-xs text-muted-foreground">
              Where available, migrate accounts to FIDO2 WebAuthn passkeys (YubiKey, Touch ID, Windows Hello) to achieve complete phishing immunity.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
