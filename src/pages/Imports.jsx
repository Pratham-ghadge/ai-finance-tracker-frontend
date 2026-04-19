import { DatabaseZap, FileSpreadsheet, MessagesSquare, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { accountsAPI, transactionsAPI } from '../utils/api';

const sampleSmsFeed = `Your a/c XXXX4321 debited by INR 450.00 on 11/04/2026 at Swiggy.

Your a/c XXXX4321 debited by INR 1799.00 on 10/04/2026 at Amazon.

Salary of INR 68000 credited on 08/04/2026 from Employer.

Your a/c XXXX4321 debited by INR 1200.00 on 07/04/2026 at Uber.`;

const Imports = () => {
  const [accounts, setAccounts] = useState([]);
  const [csvText, setCsvText] = useState('');
  const [smsText, setSmsText] = useState('');
  const [defaultAccountId, setDefaultAccountId] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState(localStorage.getItem('mobileSync') || '');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await accountsAPI.getAll();
        const nextAccounts = response.data.accounts || [];
        setAccounts(nextAccounts);
        setDefaultAccountId(nextAccounts[0]?.id || '');
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load accounts.');
      }
    };

    fetchAccounts();
  }, []);

  const handleCsvFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setCsvText(text);
  };

  const importCsv = async () => {
    setLoading(true);
    setError('');
    setStatus('');
    try {
      const response = await transactionsAPI.importCsv({ csvText, defaultAccountId });
      setStatus(`${response.data.importedCount} transactions imported from CSV.`);
      setCsvText('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'CSV import failed.');
    } finally {
      setLoading(false);
    }
  };

  const importSms = async (payload = smsText) => {
    setLoading(true);
    setError('');
    setStatus('');
    try {
      const response = await transactionsAPI.importSms({ smsText: payload, defaultAccountId });
      setStatus(`${response.data.importedCount} transactions imported from SMS messages.`);
      setSmsText('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'SMS import failed.');
    } finally {
      setLoading(false);
    }
  };

  const runSampleSync = async () => {
    await importSms(sampleSmsFeed);
  };

  return (
    <div className="space-y-6">
      <section className="hero-panel">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Imports</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Smart sync workspace for faster transaction capture</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
            A standard browser app still cannot directly read a user&apos;s phone inbox without native mobile permissions. This build reduces manual work with smart SMS parsing, CSV import, and a one-tap sample sync flow for quick onboarding.
          </p>
        </div>
      </section>

      {(error || status) && <div className={error ? 'alert-error' : 'alert-success'}>{error || status}</div>}

      <section className="panel border-cyan-100 bg-cyan-50/30 dark:border-cyan-900/30 dark:bg-cyan-900/10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500 text-white shadow-lg shadow-cyan-500/20">
              <DatabaseZap size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Automated Sync Hub</h3>
              <p className="text-xs text-slate-500">Enable hands-off tracking via bank-to-app connectivity</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Mobile Connectivity</span>
              <input
                type="text"
                className="input py-2 px-3 min-w-[200px]"
                placeholder="+91 XXXXX XXXXX"
                value={mobileNumber}
                onChange={(e) => {
                  setMobileNumber(e.target.value);
                  localStorage.setItem('mobileSync', e.target.value);
                }}
              />
            </div>
            <button className="btn-primary mt-4" disabled={loading || !defaultAccountId} onClick={runSampleSync}>
              <RefreshCw className={loading ? 'animate-spin' : ''} size={16} />
              Trigger Hand-off Sync
            </button>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <label className="field max-w-sm">
            <span>Default account for imported transactions</span>
            <select className="input" value={defaultAccountId} onChange={(event) => setDefaultAccountId(event.target.value)}>
              <option value="">Select account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </label>
          <button className="btn-primary justify-center" disabled={loading || !defaultAccountId} onClick={runSampleSync} type="button">
            <DatabaseZap size={16} />
            One-tap sample sync
          </button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="panel space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-100 dark:bg-cyan-900/30 p-3 text-cyan-800 dark:text-cyan-400">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">CSV import</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">Upload or paste statement data</h2>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Supported columns: amount, category, date, description, type, account.</p>
          <input className="input" onChange={handleCsvFile} type="file" accept=".csv,text/csv" />
          <textarea className="input min-h-72" placeholder="amount,category,date,description,type,account" value={csvText} onChange={(event) => setCsvText(event.target.value)} />
          <button className="btn-primary justify-center" disabled={loading || !csvText.trim() || !defaultAccountId} onClick={importCsv} type="button">
            {loading ? 'Importing...' : 'Import CSV'}
          </button>
        </section>

        <section className="panel space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-100 dark:bg-amber-900/30 p-3 text-amber-700 dark:text-amber-400">
              <MessagesSquare size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">SMS import</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">Parse bank alerts automatically</h2>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Separate messages with a blank line. The parser detects debit or credit, amount, date, and merchant text.</p>
          <textarea
            className="input min-h-72"
            placeholder={sampleSmsFeed}
            value={smsText}
            onChange={(event) => setSmsText(event.target.value)}
          />
          <button className="btn-primary justify-center" disabled={loading || !smsText.trim() || !defaultAccountId} onClick={() => importSms()} type="button">
            {loading ? 'Importing...' : 'Import SMS'}
          </button>
        </section>
      </div>
    </div>
  );
};

export default Imports;
