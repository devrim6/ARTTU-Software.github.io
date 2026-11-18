import { RecruitmentPage } from './pages/RecruitmentPage';

// main app component, renders just the recruitment page
export function App() {
  return (
    <div className="min-h-screen bg-warm-100 text-warm-900 font-sans">
      <header className="bg-white border-b border-warm-250">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-lg text-warm-900">
              ART TU Formula Student
            </h1>
            <p className="text-xs text-warm-600">Recruitment Portal</p>
          </div>
          <a
            href="http://localhost:8000/admin"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-mono font-semibold text-brand-red hover:underline"
          >
            Admin Panel
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <RecruitmentPage />
      </main>
    </div>
  );
}

export default App;
