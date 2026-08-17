import { useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import './Profile.css'

function Profile() {
  const savedProfile = JSON.parse(
    localStorage.getItem('interntrust_profile') || 'null'
  )

  const defaultProfile = {
    name: 'Swarangi Kadam',
    role: 'Student',
    email: 'user@example.com',
  }

  const [profile, setProfile] = useState(
    savedProfile || defaultProfile
  )

  const [editing, setEditing] = useState(false)
  const [draftProfile, setDraftProfile] = useState(profile)

  const handleEdit = () => {
    setDraftProfile(profile)
    setEditing(true)
  }

  const handleCancel = () => {
    setDraftProfile(profile)
    setEditing(false)
  }

  const handleChange = (field, value) => {
    setDraftProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    setProfile(draftProfile)

    localStorage.setItem(
      'interntrust_profile',
      JSON.stringify(draftProfile)
    )

    setEditing(false)
  }

  return (
    <div className="profile-page">

      <Sidebar activePage="profile" />

      <main className="profile-main">

        {/* ================= HEADER ================= */}

        <header className="profile-header">

          <div>
            <div className="profile-eyebrow">
              ACCOUNT
            </div>

            <h1>My Profile</h1>

            <p>
              Manage your InternTrust account and personal information.
            </p>
          </div>

          <div className="profile-header-status">
            <span className="status-dot"></span>
            Account active
          </div>

        </header>


        {/* ================= PROFILE HERO ================= */}

        <section className="profile-hero">

          <div className="profile-avatar">
  {profile.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()}
</div>

          <div className="profile-identity">

            <h2>{profile.name}</h2>

<p>{profile.role} • InternTrust Member</p>
            <span className="profile-member">
              <span className="mini-shield">✓</span>
              Verified account
            </span>

          </div>

          <div className="profile-actions">

  {!editing ? (
    <button
      className="profile-edit-button"
      onClick={handleEdit}
    >
      <span>✎</span>
      Edit Profile
    </button>
  ) : (
    <>
      <button
        className="profile-cancel-button"
        onClick={handleCancel}
      >
        Cancel
      </button>

      <button
        className="profile-save-button"
        onClick={handleSave}
      >
        <span>✓</span>
        Save Changes
      </button>
    </>
  )}

</div>

        </section>


        {/* ================= MAIN GRID ================= */}

        <div className="profile-grid">

          {/* ACCOUNT INFORMATION */}

          <section className="profile-card account-card">

            <div className="card-heading">

              <div className="card-icon blue">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5 20c.8-4 3-6 7-6s6.2 2 7 6" />
                </svg>
              </div>

              <div>
                <h3>Personal information</h3>
                <p>Your basic account details</p>
              </div>

            </div>


            <div className="profile-fields">

  <div className="profile-field">

    <span className="field-label">
      Full name
    </span>

    {editing ? (
      <input
        className="profile-edit-input"
        type="text"
        value={draftProfile.name}
        onChange={(e) =>
          handleChange('name', e.target.value)
        }
      />
    ) : (
      <strong>{profile.name}</strong>
    )}

  </div>


  <div className="profile-field">

    <span className="field-label">
      Role
    </span>

    {editing ? (
      <select
        className="profile-edit-input"
        value={draftProfile.role}
        onChange={(e) =>
          handleChange('role', e.target.value)
        }
      >
        <option value="Student">Student</option>
        <option value="Graduate">Graduate</option>
        <option value="Job Seeker">Job Seeker</option>
      </select>
    ) : (
      <strong>{profile.role}</strong>
    )}

  </div>


  <div className="profile-field">

    <span className="field-label">
      Email address
    </span>

    {editing ? (
      <input
        className="profile-edit-input"
        type="email"
        value={draftProfile.email}
        onChange={(e) =>
          handleChange('email', e.target.value)
        }
      />
    ) : (
      <strong>{profile.email}</strong>
    )}

  </div>


  <div className="profile-field">

    <span className="field-label">
      Account type
    </span>

    <strong>
      {profile.role} account
    </strong>

  </div>

</div>
          </section>


          {/* SECURITY */}

          <section className="profile-card security-card">

            <div className="card-heading">

              <div className="card-icon green">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M12 3l7 3v5c0 4.5-2.8 8-7 10-4.2-2-7-5.5-7-10V6l7-3z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>

              <div>
                <h3>Account security</h3>
                <p>Your account protection status</p>
              </div>

            </div>


            <div className="security-status">

              <div className="security-check">
                <span>✓</span>
              </div>

              <div>
                <strong>Account protected</strong>
                <p>
                  Your InternTrust account is currently active.
                </p>
              </div>

            </div>


            <div className="security-line">
              <span>Verification status</span>
              <strong className="verified-text">
                Verified
              </strong>
            </div>

            <div className="security-line">
              <span>Account status</span>
              <strong className="active-text">
                Active
              </strong>
            </div>

          </section>


          {/* ACTIVITY */}

          <section className="profile-card activity-card">

            <div className="card-heading">

              <div className="card-icon purple">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M4 19V5" />
                  <path d="M4 19h16" />
                  <path d="M7 15l3-4 3 2 5-7" />
                </svg>
              </div>

              <div>
                <h3>Your activity</h3>
                <p>A quick look at your InternTrust usage</p>
              </div>

            </div>


            <div className="activity-stats">

              <div className="activity-stat">
                <strong>24</strong>
                <span>Total checks</span>
              </div>

              <div className="activity-stat">
                <strong>18</strong>
                <span>Safe opportunities</span>
              </div>

              <div className="activity-stat">
                <strong>6</strong>
                <span>Potential risks</span>
              </div>

            </div>

            <Link
              to="/history"
              className="activity-link"
            >
              View analysis history
              <span>→</span>
            </Link>

          </section>


          {/* PROTECTION MESSAGE */}

          <section className="profile-protection">

            <div className="protection-glow"></div>

            <div className="protection-icon">
              🛡
            </div>

            <div>
              <span>INTERNTRUST PROTECTION</span>

              <h3>
                Verify before you apply.
              </h3>

              <p>
                Always analyze an internship or job opportunity
                before sharing personal information or applying.
              </p>
            </div>

            <Link
              to="/analyze"
              className="protection-button"
            >
              Analyze opportunity
              <span>→</span>
            </Link>

          </section>

        </div>

      </main>

    </div>
  )
}

export default Profile