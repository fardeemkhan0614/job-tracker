import { useEffect, useMemo, useState } from "react";
import "./App.css";

const STORAGE_KEY = "jobTrackerApplications";
const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

function today() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function readJobs() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function App() {
  const [jobs, setJobs] = useState(readJobs);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({ role: "", company: "", date: today(), status: "Applied" });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  }, [jobs]);

  const visibleJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesText = `${job.role} ${job.company}`.toLowerCase().includes(query);
      return matchesText && (filter === "All" || job.status === filter);
    });
  }, [jobs, search, filter]);

  function updateForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function addJob(event) {
    event.preventDefault();
    const newJob = { ...form, id: crypto.randomUUID() };
    setJobs((current) => [newJob, ...current]);
    setForm({ role: "", company: "", date: today(), status: "Applied" });
  }

  function changeStatus(id, status) {
    setJobs((current) => current.map((job) => job.id === id ? { ...job, status } : job));
  }

  function deleteJob(id) {
    setJobs((current) => current.filter((job) => job.id !== id));
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Trackly home"><span className="brand-mark">T</span> trackly</a>
        <span className="topbar-note">Your job search, organized</span>
      </header>

      <div className="content" id="top">
        <section className="welcome">
          <div>
            <p className="eyebrow">CAREER DASHBOARD</p>
            <h1>Make your next move.</h1>
            <p className="welcome-copy">Keep every application in one place and see how your search is going.</p>
          </div>
          <div className="welcome-icon" aria-hidden="true">↗</div>
        </section>

        <section className="stats-grid" aria-label="Application summary">
          <StatCard label="Applications" value={jobs.length} icon="▤" color="blue" />
          <StatCard label="Interviews" value={jobs.filter((job) => job.status === "Interview").length} icon="◷" color="orange" />
          <StatCard label="Offers" value={jobs.filter((job) => job.status === "Offer").length} icon="✦" color="green" />
          <StatCard label="Responses" value={jobs.filter((job) => job.status !== "Applied").length} icon="↗" color="purple" />
        </section>

        <section className="panel add-panel">
          <div className="panel-heading">
            <div><p className="eyebrow">NEW OPPORTUNITY</p><h2>Add an application</h2></div>
            <span className="heading-icon">＋</span>
          </div>
          <form onSubmit={addJob}>
            <div className="form-grid">
              <Field label="Job title" name="role" placeholder="e.g. Frontend Developer" value={form.role} onChange={updateForm} />
              <Field label="Company" name="company" placeholder="e.g. Acme Studio" value={form.company} onChange={updateForm} />
              <div className="field"><label htmlFor="date">Date applied</label><input id="date" name="date" type="date" value={form.date} onChange={updateForm} required /></div>
              <div className="field"><label htmlFor="status">Current status</label><select id="status" name="status" value={form.status} onChange={updateForm}>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select></div>
            </div>
            <div className="form-footer"><span className="form-hint">You can update the status anytime.</span><button className="primary-button" type="submit">＋ &nbsp;Add application</button></div>
          </form>
        </section>

        <section className="applications">
          <div className="applications-heading"><div><p className="eyebrow">YOUR PIPELINE</p><h2>Applications <span className="count-pill">{jobs.length}</span></h2></div></div>
          <div className="toolbar">
            <label className="search-box"><span aria-hidden="true">⌕</span><input type="search" placeholder="Search jobs or companies..." value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search jobs or companies" />{search && <button type="button" className="clear-search" onClick={() => setSearch("")} aria-label="Clear search">×</button>}</label>
            <label className="filter-box"><span aria-hidden="true">☷</span><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter applications by status"><option>All</option>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label>
          </div>
          <div className="job-list" aria-live="polite">
            {visibleJobs.length === 0 ? <EmptyState hasJobs={jobs.length > 0} /> : visibleJobs.map((job) => <JobCard key={job.id} job={job} onStatusChange={changeStatus} onDelete={deleteJob} />)}
          </div>
        </section>
        <footer className="footer">Made for your next opportunity <span>✦</span></footer>
      </div>
    </main>
  );
}

function StatCard({ label, value, icon, color }) {
  return <article className="stat-card"><span className={`stat-icon ${color}`}>{icon}</span><div><p>{label}</p><strong>{value}</strong></div></article>;
}

function Field({ label, name, placeholder, value, onChange }) {
  return <div className="field"><label htmlFor={name}>{label}</label><input id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} required /></div>;
}

function JobCard({ job, onStatusChange, onDelete }) {
  return <article className="job-card"><div className="company-avatar" aria-hidden="true">{job.company.trim().charAt(0).toUpperCase()}</div><div className="job-main"><h3>{job.role}</h3><p className="company-name">{job.company}</p><p className="job-date">Applied on {job.date}</p></div><div className="job-controls"><label className={`status-select status-${job.status.toLowerCase()}`}><span className="status-dot" /><select aria-label={`Status for ${job.role} at ${job.company}`} value={job.status} onChange={(event) => onStatusChange(job.id, event.target.value)}>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label><button className="delete-button" type="button" onClick={() => onDelete(job.id)} aria-label={`Delete ${job.role} at ${job.company}`} title="Delete application">×</button></div></article>;
}

function EmptyState({ hasJobs }) {
  return <div className="empty-state"><div className="empty-icon">{hasJobs ? "⌕" : "＋"}</div><h3>{hasJobs ? "No matching applications" : "Your next opportunity starts here"}</h3><p>{hasJobs ? "Try a different search or status filter." : "Add your first application above and keep your job search organized."}</p></div>;
}

export default App;
