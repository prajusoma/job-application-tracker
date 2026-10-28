import React, { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, Plus, Search, Trash2, RefreshCw } from "lucide-react";

const API = "http://localhost:5000/api/applications";
const emptyForm = {
  company: "", role: "", location: "", jobUrl: "",
  status: "Applied", notes: ""
};

export default function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (filter !== "All") params.set("status", filter);
      const response = await fetch(`${API}?${params}`);
      if (!response.ok) throw new Error("Unable to load applications.");
      setItems(await response.json());
    } catch {
      setError("Cannot connect to the API. Check that the server and MongoDB are running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [search, filter]);

  const stats = useMemo(() => ({
    total: items.length,
    interviews: items.filter(x => x.status === "Interview").length,
    offers: items.filter(x => x.status === "Offer").length,
    rejected: items.filter(x => x.status === "Rejected").length
  }), [items]);

  async function save(event) {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch(editing ? `${API}/${editing}` : API, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const result = response.status === 204 ? null : await response.json();
      if (!response.ok) throw new Error(result?.message || "Unable to save.");
      setForm(emptyForm);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  function edit(item) {
    setEditing(item._id);
    setForm({
      company: item.company, role: item.role, location: item.location || "",
      jobUrl: item.jobUrl || "", status: item.status, notes: item.notes || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id) {
    if (!window.confirm("Delete this application?")) return;
    try {
      const response = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Unable to delete application.");
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#"><span className="brand-icon"><BriefcaseBusiness size={21}/></span> ApplyFlow</a>
        <span className="top-note">YOUR JOB SEARCH, ORGANIZED</span>
      </header>

      <section className="intro">
        <div>
          <p className="eyebrow">CAREER DASHBOARD</p>
          <h1>Your next opportunity<br/><span>starts here.</span></h1>
          <p className="subtext">Keep every application, interview and opportunity in one place.</p>
        </div>
        <div className="intro-mark"><BriefcaseBusiness size={58}/></div>
      </section>

      <section className="stats">
        {[["Total applications", stats.total], ["Interviews", stats.interviews],
          ["Offers", stats.offers], ["Rejected", stats.rejected]].map(([label, value]) =>
          <article className="stat" key={label}><span>{label}</span><strong>{value}</strong></article>
        )}
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div><h2>{editing ? "Edit application" : "Add an application"}</h2>
          <p>Keep your job search moving forward.</p></div>
        </div>
        <form onSubmit={save} className="form-grid">
          <label>Company name<input required maxLength="100" placeholder="e.g. Google" value={form.company} onChange={e => setForm({...form, company:e.target.value})}/></label>
          <label>Job title<input required maxLength="100" placeholder="e.g. Software Engineer" value={form.role} onChange={e => setForm({...form, role:e.target.value})}/></label>
          <label>Location<input placeholder="e.g. Bengaluru / Remote" value={form.location} onChange={e => setForm({...form, location:e.target.value})}/></label>
          <label>Status<select value={form.status} onChange={e => setForm({...form, status:e.target.value})}>{["Applied","Interview","Offer","Rejected"].map(s=><option key={s}>{s}</option>)}</select></label>
          <label className="wide">Job URL<input type="url" placeholder="https://..." value={form.jobUrl} onChange={e => setForm({...form, jobUrl:e.target.value})}/></label>
          <label className="wide">Notes<textarea rows="2" placeholder="Recruiter details, follow-up reminders..." value={form.notes} onChange={e => setForm({...form, notes:e.target.value})}/></label>
          <div className="form-actions">
            {editing && <button type="button" className="button secondary" onClick={() => {setEditing(null);setForm(emptyForm)}}>Cancel</button>}
            <button className="button primary" type="submit"><Plus size={17}/>{editing ? "Save changes" : "Add application"}</button>
          </div>
        </form>
      </section>

      <section className="applications">
        <div className="list-heading"><div><h2>Applications</h2><p>Your latest opportunities</p></div><button className="icon-button" onClick={load} aria-label="Refresh"><RefreshCw size={17}/></button></div>
        <div className="toolbar">
          <div className="search"><Search size={18}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies or roles..."/></div>
          <select aria-label="Filter status" value={filter} onChange={e => setFilter(e.target.value)}>{["All","Applied","Interview","Offer","Rejected"].map(s=><option key={s}>{s}</option>)}</select>
        </div>

        {error && <div className="error">{error}</div>}
        {loading ? <p className="empty">Loading applications...</p> : items.length === 0 ?
          <div className="empty"><BriefcaseBusiness size={32}/><h3>No applications found</h3><p>Add your first opportunity using the form above.</p></div> :
          <div className="table-wrap"><table><thead><tr><th>Company / Role</th><th>Location</th><th>Status</th><th>Applied</th><th>Actions</th></tr></thead>
            <tbody>{items.map(item=><tr key={item._id}>
              <td><strong>{item.company}</strong><span className="role">{item.role}</span>{item.jobUrl && <a className="job-link" href={item.jobUrl} target="_blank" rel="noreferrer">View job ↗</a>}</td>
              <td>{item.location || "—"}</td><td><span className={`status ${item.status.toLowerCase()}`}>{item.status}</span></td>
              <td>{new Date(item.appliedDate || item.createdAt).toLocaleDateString()}</td>
              <td><div className="actions"><button onClick={() => edit(item)} className="text-button">Edit</button><button onClick={() => remove(item._id)} className="delete-button" aria-label="Delete"><Trash2 size={16}/></button></div></td>
            </tr>)}</tbody></table></div>}
      </section>
      <footer>Built with React, Express and MongoDB · ApplyFlow</footer>
    </main>
  );
}
