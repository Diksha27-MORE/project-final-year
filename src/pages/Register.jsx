import { Link } from 'react-router-dom'
import '../App.css'

function Register() {
  return (
    <div className="auth-page">

      {/* Left Side */}
      <div className="auth-brand">

        <div className="auth-logo">
          <span>Intern</span>Trust
        </div>

        <div className="auth-brand-content">

          <span className="auth-label">
            JOIN INTERNTRUST
          </span>

          <h1>
            Start applying
            <br />
            <span>with confidence.</span>
          </h1>

          <p>
            Create your account and start checking
            internships and job opportunities before
            you apply.
          </p>

        </div>

        <div className="auth-brand-footer">
          <span>🛡</span>
          Built to help students make safer career decisions.
        </div>

      </div>


      {/* Right Side */}
      <div className="auth-form-container">

        <div className="auth-form">

          {/* Back to Home */}
          <Link to="/" className="back-home">
            ← Back to home
          </Link>


          {/* Mobile Logo */}
          <div className="mobile-auth-logo">
            <span>Intern</span>Trust
          </div>


          <span className="auth-label">
            CREATE ACCOUNT
          </span>

          <h2>
            Get started
          </h2>

          <p className="auth-subtitle">
            Create your InternTrust account.
          </p>


          {/* Register Form */}
          <form>

            {/* Name */}
            <div className="form-group">

              <label>
                Full name
              </label>

              <input
                type="text"
                placeholder="Your name"
              />

            </div>


            {/* Email */}
            <div className="form-group">

              <label>
                Email address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
              />

            </div>


            {/* Password */}
            <div className="form-group">

              <label>
                Password
              </label>

              <input
                type="password"
                placeholder="Create a password"
              />

            </div>


            {/* Create Account */}
            <button
              type="submit"
              className="primary-btn auth-submit"
            >
              Create account
              <span>→</span>
            </button>

          </form>


          {/* Login Link */}
          <p className="auth-switch">
            Already have an account?

            <Link to="/login">
              Sign in
            </Link>
          </p>

        </div>

      </div>

    </div>
  )
}

export default Register