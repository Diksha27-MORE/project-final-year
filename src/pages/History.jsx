import Sidebar from '../components/Sidebar'
import { useMemo, useState } from 'react'
import './History.css'
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Clock,
  Search,
  Plus,
  ChevronDown,
  MapPin,
  Briefcase,
  CalendarDays,
  ListChecks,
  ExternalLink,
} from 'lucide-react'

// TODO: Replace with your real verification history data source
// (e.g. fetched from your API / existing history state / context).
// Sample records below are placeholders only, shaped the way a real
// verification record from InternTrust would look.
const SAMPLE_HISTORY = [
  {
    id: 'vh_1042',
    company: 'Google',
    role: 'Software Engineering Intern',
    location: 'Bengaluru, IN',
    status: 'verified',
    score: 96,
    date: '2026-08-12T09:14:00',
    summary: 'Company domain, careers page, and listing details all matched official records.',
  },
  {
    id: 'vh_1041',
    company: 'StratosTech Solutions',
    role: 'Marketing Intern',
    location: 'Remote',
    status: 'pending',
    score: null,
    date: '2026-08-11T16:40:00',
    summary: 'Awaiting confirmation from company registry — recheck usually completes within 24 hours.',
  },
  {
    id: 'vh_1039',
    company: 'QuantumLeap Ventures',
    role: 'Data Analyst Intern',
    location: 'Pune, IN',
    status: 'failed',
    score: 22,
    date: '2026-08-09T11:05:00',
    summary: 'No registered business entity found and recruiter contact could not be verified.',
  },
  {
    id: 'vh_1035',
    company: 'Microsoft',
    role: 'Cloud Support Intern',
    location: 'Hyderabad, IN',
    status: 'verified',
    score: 91,
    date: '2026-08-07T14:22:00',
    summary: 'Listing matched Microsoft careers portal with a verified recruiter email domain.',
  },
  {
    id: 'vh_1031',
    company: 'BrightPath Innovations',
    role: 'Business Development Intern',
    location: 'Remote',
    status: 'failed',
    score: 18,
    date: '2026-08-05T10:02:00',
    summary: 'Listing reused text from an unrelated company and requested upfront payment.',
  },
  {
    id: 'vh_1028',
    company: 'Meta',
    role: 'Product Design Intern',
    location: 'Gurugram, IN',
    status: 'verified',
    score: 94,
    date: '2026-08-02T08:47:00',
    summary: 'Verified against Meta careers listings and LinkedIn company confirmation.',
  },
  {
    id: 'vh_1024',
    company: 'NovaWorks Digital',
    role: 'Content Writing Intern',
    location: 'Remote',
    status: 'pending',
    score: null,
    date: '2026-07-30T19:11:00',
    summary: 'Manual review in progress due to a newly registered company domain.',
  },
  {
    id: 'vh_1019',
    company: 'Deloitte',
    role: 'Finance Intern',
    location: 'Mumbai, IN',
    status: 'verified',
    score: 88,
    date: '2026-07-27T13:30:00',
    summary: 'Company identity and role posting confirmed via official Deloitte careers page.',
  },
]

const STATUS_META = {
  verified: { label: 'Verified', icon: ShieldCheck, className: 'status-verified' },
  pending: { label: 'Pending', icon: Clock, className: 'status-pending' },
  failed: { label: 'Failed', icon: ShieldX, className: 'status-failed' },
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'verified', label: 'Verified' },
  { key: 'pending', label: 'Pending' },
  { key: 'failed', label: 'Failed' },
]

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTime(iso) {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function ScoreRing({ score, status }) {
  const radius = 18
  const circumference = 2 * Math.PI * radius
  const pct = score == null ? 0 : Math.max(0, Math.min(100, score))
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className={`score-ring score-ring-${status}`} aria-hidden="true">
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle
          className="score-ring-track"
          cx="22"
          cy="22"
          r={radius}
          strokeWidth="4"
          fill="none"
        />
        {score != null && (
          <circle
            className="score-ring-fill"
            cx="22"
            cy="22"
            r={radius}
            strokeWidth="4"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        )}
      </svg>
      <span className="score-ring-value">{score == null ? '—' : score}</span>
    </div>
  )
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] ?? STATUS_META.pending
  const Icon = meta.icon

  return (
    <span className={`status-badge ${meta.className}`}>
      <Icon size={14} strokeWidth={2.25} />
      {meta.label}
    </span>
  )
}

function History() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)

  // Existing history data — swap SAMPLE_HISTORY for your real data source.
  const history = SAMPLE_HISTORY

  const counts = useMemo(() => {
    return {
      total: history.length,
      verified: history.filter((h) => h.status === 'verified').length,
      pending: history.filter((h) => h.status === 'pending').length,
      failed: history.filter((h) => h.status === 'failed').length,
    }
  }, [history])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return history.filter((item) => {
      const matchesFilter =
        activeFilter === 'all' || item.status === activeFilter

      const matchesQuery =
        !q ||
        item.company.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)

      return matchesFilter && matchesQuery
    })
  }, [history, query, activeFilter])

  const toggleExpanded = (id) => {
    setExpandedId((current) => (current === id ? null : id))
  }

  return (
    <div className="dashboard-page">

      <Sidebar activePage="history" />

      <main className="dashboard-main">

        <div className="history-page">
          <div className="history-container">

            {/* Page header */}
            <header className="history-header">
              <div className="history-header-text">
                <h1>Verification History</h1>
                <p>
                  Every internship check you've run is stored here, so you can revisit results,
                  track outcomes, and spot patterns over time.
                </p>
              </div>

              <button className="btn-primary" type="button">
                <Plus size={18} strokeWidth={2.25} />
                Analyze New Internship
              </button>
            </header>

            {/* Summary stat cards */}
            <section className="stats-grid" aria-label="History summary">

              <div className="stat-card">
                <div className="stat-icon stat-icon-total">
                  <ListChecks size={20} strokeWidth={2.25} />
                </div>
                <div className="stat-body">
                  <span className="stat-value">{counts.total}</span>
                  <span className="stat-label">Total Analyses</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon stat-icon-verified">
                  <ShieldCheck size={20} strokeWidth={2.25} />
                </div>
                <div className="stat-body">
                  <span className="stat-value">{counts.verified}</span>
                  <span className="stat-label">Verified</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon stat-icon-pending">
                  <Clock size={20} strokeWidth={2.25} />
                </div>
                <div className="stat-body">
                  <span className="stat-value">{counts.pending}</span>
                  <span className="stat-label">Pending</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon stat-icon-failed">
                  <ShieldX size={20} strokeWidth={2.25} />
                </div>
                <div className="stat-body">
                  <span className="stat-value">{counts.failed}</span>
                  <span className="stat-label">Failed</span>
                </div>
              </div>

            </section>

            {/* Controls */}
            <section className="history-controls">

              <div className="search-field">
                <Search size={18} strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Search by company, role, or location"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search verification history"
                />
              </div>

              <div
                className="filter-tabs"
                role="tablist"
                aria-label="Filter by status"
              >
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    role="tab"
                    aria-selected={activeFilter === f.key}
                    className={`filter-tab ${
                      activeFilter === f.key ? 'is-active' : ''
                    }`}
                    onClick={() => setActiveFilter(f.key)}
                  >
                    {f.label}

                    <span className="filter-count">
                      {f.key === 'all' ? counts.total : counts[f.key]}
                    </span>
                  </button>
                ))}
              </div>

            </section>

            {/* History list */}
            <section
              className="history-list"
              aria-label="Verification records"
            >
              {filtered.length === 0 ? (
                <div className="empty-state">
                  <ShieldAlert size={28} strokeWidth={1.75} />
                  <h3>No matching records</h3>
                  <p>
                    Try a different search term or clear the status filter.
                  </p>
                </div>
              ) : (
                filtered.map((item) => {
                  const isExpanded = expandedId === item.id

                  return (
                    <article
                      key={item.id}
                      className={`history-row ${
                        isExpanded ? 'is-expanded' : ''
                      }`}
                    >

                      <button
                        type="button"
                        className="history-row-main"
                        onClick={() => toggleExpanded(item.id)}
                        aria-expanded={isExpanded}
                      >

                        <div className="row-cell row-cell-identity">
                          <ScoreRing
                            score={item.score}
                            status={item.status}
                          />

                          <div className="identity-text">
                            <span className="company-name">
                              {item.company}
                            </span>

                            <span className="role-name">
                              <Briefcase size={13} strokeWidth={2} />
                              {item.role}
                            </span>
                          </div>
                        </div>

                        <div className="row-cell row-cell-meta">

                          <span className="meta-item">
                            <MapPin size={13} strokeWidth={2} />
                            {item.location}
                          </span>

                          <span className="meta-item">
                            <CalendarDays size={13} strokeWidth={2} />
                            {formatDate(item.date)} · {formatTime(item.date)}
                          </span>

                        </div>

                        <div className="row-cell row-cell-status">
                          <StatusBadge status={item.status} />
                        </div>

                        <div className="row-cell row-cell-action">
                          <ChevronDown
                            className="chevron"
                            size={18}
                            strokeWidth={2}
                          />
                        </div>

                      </button>

                      {isExpanded && (
                        <div className="history-row-details">

                          <p>{item.summary}</p>

                          <div className="details-footer">

                            <span className="record-id">
                              Record ID: {item.id}
                            </span>

                            <button
                              type="button"
                              className="btn-secondary"
                            >
                              View Full Report
                              <ExternalLink
                                size={14}
                                strokeWidth={2.25}
                              />
                            </button>

                          </div>

                        </div>
                      )}

                    </article>
                  )
                })
              )}
            </section>

          </div>
        </div>

      </main>

    </div>
  )
}

export default History