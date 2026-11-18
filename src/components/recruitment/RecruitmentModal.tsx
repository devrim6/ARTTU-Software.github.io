import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, AlertCircle, Loader2, Database, RefreshCw } from 'lucide-react';
import { departments } from '../../data/departments';

// modal for submitting recruitment applications to django and viewing existing ones

interface ApplicationRecord {
  id: number;
  full_name: string;
  email: string;
  faculty: string;
  year_of_study: number;
  department: string;
  motivation: string;
  status: 'pending' | 'interview' | 'accepted' | 'rejected';
  created_at: string;
}

interface RecruitmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDepartment?: string;
}

export const RecruitmentModal: React.FC<RecruitmentModalProps> = ({
  isOpen,
  onClose,
  defaultDepartment = '',
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'list'>('form');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [faculty, setFaculty] = useState('Faculty of Automation and Computer Science (UTCN)');
  const [yearOfStudy, setYearOfStudy] = useState(2);
  const [department, setDepartment] = useState(defaultDepartment || departments[0]?.name || 'Software & Telemetry');
  const [motivation, setMotivation] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ id: number; message: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [records, setRecords] = useState<ApplicationRecord[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [listErrorMessage, setListErrorMessage] = useState<string | null>(null);

  const fetchApplications = async () => {
    setIsLoadingRecords(true);
    setListErrorMessage(null);
    try {
      const res = await fetch('http://localhost:8000/api/recruitment/');
      if (!res.ok) {
        throw new Error(`status ${res.status}`);
      }
      const data = await res.json();
      setRecords(data);
    } catch {
      setListErrorMessage('cannot reach django server at http://localhost:8000');
    } finally {
      setIsLoadingRecords(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'list') {
      fetchApplications();
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessInfo(null);

    const payload = {
      full_name: fullName,
      email: email,
      faculty: faculty,
      year_of_study: Number(yearOfStudy),
      department: department,
      motivation: motivation,
    };

    try {
      const response = await fetch('http://localhost:8000/api/recruitment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => null);
        throw new Error(
          errorJson ? JSON.stringify(errorJson) : `status ${response.status}`
        );
      }

      const result = await response.json();
      setSuccessInfo({
        id: result.data?.id || 1,
        message: result.message || 'application saved',
      });
    } catch {
      setErrorMessage(
        'cannot connect to django backend at http://localhost:8000. make sure runserver is running.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSuccessInfo(null);
    setErrorMessage(null);
    setFullName('');
    setEmail('');
    setMotivation('');
    setActiveTab('form');
    onClose();
  };

  const getStatusBadge = (status: ApplicationRecord['status']) => {
    switch (status) {
      case 'accepted':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold uppercase">Accepted</span>;
      case 'interview':
        return <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-mono font-bold uppercase">Interview</span>;
      case 'rejected':
        return <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 text-[10px] font-mono font-bold uppercase">Rejected</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-mono font-bold uppercase">Pending</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl border border-warm-250 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={resetForm}
          className="absolute top-5 right-5 p-2 rounded-xl text-warm-500 hover:text-warm-900 hover:bg-warm-100 transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 mb-5">
          <h2 className="font-display font-black text-2xl text-warm-900 tracking-tight">
            Recruitment Portal
          </h2>
          <p className="text-xs text-warm-600">
            Submit an application or check saved entries.
          </p>
        </div>

        <div className="flex items-center gap-2 border-b border-warm-200 pb-3 mb-5 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'form'
                ? 'bg-brand-red text-white'
                : 'text-warm-600 hover:bg-warm-100'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Apply</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'list'
                ? 'bg-warm-900 text-white'
                : 'text-warm-600 hover:bg-warm-100'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Applications</span>
          </button>
        </div>

        {activeTab === 'form' && (
          <>
            {successInfo ? (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Application submitted</span>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Application <strong className="font-mono font-bold">#{successInfo.id}</strong> saved with status <span className="font-mono font-semibold">pending</span>.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('list')}
                    className="flex-1 py-3 rounded-xl bg-warm-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    View Applications
                  </button>
                  <button
                    type="button"
                    onClick={() => setSuccessInfo(null)}
                    className="px-4 py-3 rounded-xl border border-warm-300 hover:bg-warm-100 text-warm-700 text-xs font-bold transition cursor-pointer"
                  >
                    Submit Another
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold block">Connection error</span>
                      <p className="text-[11px] text-red-700">{errorMessage}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-warm-800 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Radu Popa"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-warm-800 uppercase tracking-wider mb-1">
                    Student Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. radu.popa@student.utcluj.ro"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-warm-800 uppercase tracking-wider mb-1">
                      Faculty
                    </label>
                    <input
                      type="text"
                      required
                      value={faculty}
                      onChange={(e) => setFaculty(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-warm-800 uppercase tracking-wider mb-1">
                      Year of Study (1 - 6)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      required
                      value={yearOfStudy}
                      onChange={(e) => setYearOfStudy(parseInt(e.target.value) || 1)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-warm-800 uppercase tracking-wider mb-1">
                    Preferred Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition"
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-warm-800 uppercase tracking-wider mb-1">
                    Motivation & Interests
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    placeholder="tell us about your interests..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-5 rounded-xl bg-brand-red hover:bg-brand-darkRed text-white font-display font-bold text-xs uppercase tracking-wider shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="py-3 px-4 rounded-xl border border-warm-300 hover:bg-warm-100 text-warm-700 text-xs font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {activeTab === 'list' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-warm-900">
                {records.length} applications
              </span>

              <button
                type="button"
                onClick={fetchApplications}
                disabled={isLoadingRecords}
                className="px-3 py-1.5 rounded-lg border border-warm-300 hover:bg-warm-100 text-warm-700 text-xs font-mono font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRecords ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {listErrorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-brand-red shrink-0" />
                <span>{listErrorMessage}</span>
              </div>
            )}

            {isLoadingRecords ? (
              <div className="py-12 flex flex-col items-center justify-center text-warm-500 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-brand-red" />
                <span className="text-xs font-mono">Loading...</span>
              </div>
            ) : records.length === 0 ? (
              <div className="py-8 text-center text-xs text-warm-500 bg-warm-50 rounded-2xl border border-warm-200 p-4">
                No applications found.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {records.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3.5 rounded-xl border border-warm-250 bg-warm-50/60 hover:bg-white transition space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-warm-500 font-semibold">#{rec.id}</span>
                        <span className="font-bold text-warm-900">{rec.full_name}</span>
                      </div>
                      {getStatusBadge(rec.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-warm-600 font-mono">
                      <span>Dept: <strong className="text-warm-800">{rec.department}</strong></span>
                      <span>Year: <strong className="text-warm-800">{rec.year_of_study}</strong></span>
                      <span>Email: <strong className="text-warm-800">{rec.email}</strong></span>
                    </div>

                    <p className="text-[11px] text-warm-600 italic bg-white p-2 rounded-lg border border-warm-200 line-clamp-2">
                      "{rec.motivation}"
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-warm-200 flex items-center justify-between text-[11px] text-warm-600">
              <a
                href="http://localhost:8000/admin/api/recruitmentapplication/"
                target="_blank"
                rel="noreferrer"
                className="text-brand-red font-bold underline"
              >
                Django Admin
              </a>

              <button
                type="button"
                onClick={resetForm}
                className="px-3 py-1.5 rounded-lg border border-warm-300 text-warm-700 font-semibold hover:bg-warm-100 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
