import { Link } from 'react-router-dom'
import { ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import './Analyze.css'

function Analyze() {
  return (
    <div className="analyze-page">

      <Sidebar activePage="analyze" />


      <main className="analyze-main">

        {/* Header */}
        <header className="analyze-header">

          <div>

            <span className="dashboard-label">
              OPPORTUNITY CHECK
            </span>

            <h1>
              Analyze an opportunity
            </h1>

            <p>
              Check a job or internship before you apply.
            </p>

          </div>

        </header>


        {/* Analyze Box */}
        <section className="analyze-box">

          <div className="analyze-icon">
            <ShieldCheck size={28} strokeWidth={1.75} />
          </div>

          <span className="analyze-step">
            STEP 01
          </span>

          <h2>
            Paste the opportunity URL
          </h2>

          <p>
            We'll check the opportunity for signs of
            suspicious or potentially fraudulent activity.
          </p>


          {/* URL Input */}
          <div className="analyze-input-area">

            <label>
              JOB / INTERNSHIP URL
            </label>

            <div className="analyze-input-wrapper">

              <input
                type="url"
                placeholder="https://example.com/job/internship"
              />

              <button
                type="button"
                className="analyze-button"
              >
                Analyze
                <ArrowRight size={15} strokeWidth={2.5} />
              </button>

            </div>

          </div>


          {/* Checks */}
          <div className="analyze-info">

            <div>
              <CheckCircle2 size={14} strokeWidth={2.25} />
              Company information
            </div>

            <div>
              <CheckCircle2 size={14} strokeWidth={2.25} />
              Job details
            </div>

            <div>
              <CheckCircle2 size={14} strokeWidth={2.25} />
              Risk indicators
            </div>

          </div>

        </section>


        {/* How It Works */}
        <section className="analyze-how">

          <div className="section-top">

            <div>

              <span className="dashboard-label">
                HOW IT WORKS
              </span>

              <h2>
                Three checks. One clear result.
              </h2>

            </div>

          </div>


          <div className="analyze-steps">

            <div className="analyze-step-card">

              <span>
                01
              </span>

              <h3>
                Submit
              </h3>

              <p>
                Paste the job or internship URL
                you want to verify.
              </p>

            </div>


            <div className="analyze-step-card">

              <span>
                02
              </span>

              <h3>
                Analyze
              </h3>

              <p>
                InternTrust checks multiple
                signals for potential risks.
              </p>

            </div>


            <div className="analyze-step-card">

              <span>
                03
              </span>

              <h3>
                Decide
              </h3>

              <p>
                Get a simple result so you can
                make a safer decision.
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  )
}

export default Analyze