import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  ListChecks,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import './Dashboard.css'

function Dashboard() {
  return (
    <div className="dashboard-page">

      <Sidebar activePage="dashboard" />

      <main className="dashboard-main">

        {/* Header */}
        <header className="dashboard-header">

          <div>
            <span className="dashboard-label">
              DASHBOARD
            </span>

            <h1>
              Hello User 👋
            </h1>

            <p>
              Check an opportunity before you apply.
            </p>
          </div>

          <div className="dashboard-user">

            <div className="user-avatar">
              U
            </div>

            <div>
              <strong>User</strong>
              <span>Student</span>
            </div>

          </div>

        </header>


        {/* Analyze Card */}
        <section className="analyze-card">

          <div className="analyze-card-content">

            <span className="dashboard-label dashboard-label--onbrand">
              QUICK CHECK
            </span>

            <h2>
              Is this internship safe?
            </h2>

            <p>
              Paste a job or internship URL and
              InternTrust will analyze it for potential risks.
            </p>

            <div className="url-input-wrapper">

              <input
                type="text"
                placeholder="Paste internship or job URL..."
              />

              <Link
                to="/analyze"
                className="primary-btn"
              >
                Analyze
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>

            </div>

          </div>

          <div className="analyze-decoration">
            <div className="shield-glow">
              <ShieldCheck className="shield-icon" size={44} strokeWidth={1.75} />
            </div>
          </div>

        </section>


        {/* Stats */}
        <section className="dashboard-stats">

          <div className="dashboard-stat-card">

            <div className="stat-top">
              <span>Total checks</span>
              <span className="stat-icon stat-icon--neutral">
                <ListChecks size={16} strokeWidth={2} />
              </span>
            </div>

            <strong>
              24
            </strong>

            <small>
              Opportunities analyzed
            </small>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-top">
              <span>Safe opportunities</span>
              <span className="stat-icon stat-icon--safe">
                <ShieldCheck size={16} strokeWidth={2} />
              </span>
            </div>

            <strong className="safe-number">
              18
            </strong>

            <small>
              Low-risk results
            </small>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-top">
              <span>Potential risks</span>
              <span className="stat-icon stat-icon--warning">
                <AlertTriangle size={16} strokeWidth={2} />
              </span>
            </div>

            <strong className="warning-number">
              6
            </strong>

            <small>
              Need your attention
            </small>

          </div>

        </section>


        {/* Recent Activity */}
        <section className="recent-section">

          <div className="section-top">

            <div>

              <span className="dashboard-label">
                ACTIVITY
              </span>

              <h2>
                Recent checks
              </h2>

            </div>

            <Link to="/history" className="view-all-link">
              View history
              <ArrowUpRight size={15} strokeWidth={2.5} />
            </Link>

          </div>


          <div className="recent-table">

            <div className="recent-row header-row">

              <span>
                Opportunity
              </span>

              <span>
                Date
              </span>

              <span>
                Risk score
              </span>

              <span>
                Status
              </span>

            </div>


            <div className="recent-row">

              <span className="opportunity-cell">
                Marketing Intern
              </span>

              <span className="muted-cell">
                Today
              </span>

              <span className="score-cell">
                87/100
              </span>

              <span className="status safe">
                <span className="status-dot" />
                Low risk
              </span>

            </div>


            <div className="recent-row">

              <span className="opportunity-cell">
                Software Developer Intern
              </span>

              <span className="muted-cell">
                Yesterday
              </span>

              <span className="score-cell">
                54/100
              </span>

              <span className="status warning">
                <span className="status-dot" />
                Review
              </span>

            </div>


            <div className="recent-row">

              <span className="opportunity-cell">
                Data Analyst Internship
              </span>

              <span className="muted-cell">
                2 days ago
              </span>

              <span className="score-cell">
                18/100
              </span>

              <span className="status danger">
                <span className="status-dot" />
                Suspicious
              </span>

            </div>

          </div>

        </section>

      </main>

    </div>
  )
}

export default Dashboard