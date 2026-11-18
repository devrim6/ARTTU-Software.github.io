import React, { useEffect, useState } from 'react';

// recruitment page connected directly to django rest api

interface Application {
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

const API_URL = 'http://localhost:8000/api/recruitment/';

const DEPARTMENTS = [
  'Mechanical',
  'Low Voltage & Harnessing',
  'High Voltage Powertrain',
  'Software & Telemetry',
  'Business & Marketing',
];

export function RecruitmentPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [faculty, setFaculty] = useState('Faculty of Automation and Computer Science');
  const [yearOfStudy, setYearOfStudy] = useState(2);
  const [department, setDepartment] = useState(DEPARTMENTS[3]);
  const [motivation, setMotivation] = useState('');

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // load existing applications from django on startup
  const loadApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = await res.json();
      setApplications(data);
    } catch {
      setError('could not reach django backend at http://localhost:8000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // send new application to django
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          email,
          faculty,
          year_of_study: Number(yearOfStudy),
          department,
          motivation,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData ? JSON.stringify(errData) : `status ${res.status}`);
      }

      const result = await res.json();
      setMessage(`saved application #${result.data?.id ?? ''}`);
      setFullName('');
      setEmail('');
      setMotivation('');
      await loadApplications();
    } catch {
      setError('failed to submit, check if django server is running');
    } finally {
      setSubmitting(false);
    }
  };

  // delete an application from django
  const handleDelete = async (id: number) => {
    setError(null);
    try {
      const res = await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`status ${res.status}`);
      setApplications((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError('could not delete application');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      {/* left side: application form */}
      <section className="bg-white border border-warm-250 rounded-xl p-6 space-y-4">
        <div>
          <h2 className="font-display font-bold text-xl text-warm-900">
            Apply to Join the Team
          </h2>
          <p className="text-xs text-warm-600 mt-1">
            Open to all UTCN students.
          </p>
        </div>

        {message && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
            {message}
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-warm-800 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Andrei Popescu"
              className="w-full px-3 py-2 rounded-lg border border-warm-300 text-sm bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-warm-800 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@student.utcluj.ro"
              className="w-full px-3 py-2 rounded-lg border border-warm-300 text-sm bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-warm-800 mb-1">
                Faculty
              </label>
              <input
                type="text"
                required
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-warm-300 text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-warm-800 mb-1">
                Year (1-6)
              </label>
              <input
                type="number"
                min={1}
                max={6}
                required
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2 rounded-lg border border-warm-300 text-sm bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-warm-800 mb-1">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-warm-300 text-sm bg-white"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-warm-800 mb-1">
              Motivation
            </label>
            <textarea
              required
              rows={3}
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              placeholder="why do you want to join?"
              className="w-full px-3 py-2 rounded-lg border border-warm-300 text-sm bg-white resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 rounded-lg bg-brand-red hover:bg-brand-darkRed text-white text-xs font-bold uppercase tracking-wider disabled:opacity-60 cursor-pointer"
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </section>

      {/* right side: applications from database */}
      <section className="bg-white border border-warm-250 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-warm-900">
              Submitted Applications
            </h2>
            <p className="text-xs text-warm-600">
              {applications.length} total
            </p>
          </div>
          <button
            type="button"
            onClick={loadApplications}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg border border-warm-300 text-xs font-mono hover:bg-warm-100 cursor-pointer"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {applications.length === 0 ? (
          <p className="text-xs text-warm-500 py-6 text-center">
            No applications yet.
          </p>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-3.5 rounded-lg border border-warm-250 bg-warm-100/40 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-bold text-warm-900">
                    #{app.id} {app.full_name}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-warm-200 text-warm-800 font-mono text-[10px] uppercase">
                      {app.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(app.id)}
                      className="text-[11px] text-brand-red hover:underline cursor-pointer"
                    >
                      delete
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-warm-600 font-mono">
                  {app.department} | Year {app.year_of_study} | {app.email}
                </div>

                <p className="text-warm-700">{app.motivation}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default RecruitmentPage;
