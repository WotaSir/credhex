// Dashboard.jsx
import React, { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { useNavigate } from 'react-router-dom'
import UploadForm from './UploadForm'
import CertificateList from './CertificateList'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()

      if (error || !user) {
        toast.error('Session expired. Please log in again.')
        navigate('/login')
      } else {
        setUser(user)
      }
    }

    getUser()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>CredHex Dashboard</h2>
        <button onClick={handleLogout} style={styles.logout}>Logout</button>
      </div>

      {user && (
        <div style={styles.profileCard}>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Last Sign In:</strong> {new Date(user.last_sign_in_at).toLocaleString()}</p>
        </div>
      )}

      <div style={styles.section}>
        <UploadForm />
      </div>

      <div style={styles.section}>
        <CertificateList />
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    color: 'white',
    padding: '2rem',
    fontFamily: 'sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  title: {
    fontSize: '1.8rem'
  },
  logout: {
    background: '#ef4444',
    border: 'none',
    color: 'white',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  profileCard: {
    background: 'rgba(255,255,255,0.05)',
    padding: '1rem',
    borderRadius: '12px',
    marginBottom: '2rem'
  },
  section: {
    marginBottom: '2rem'
  }
}

export default Dashboard
