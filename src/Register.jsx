import React, { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import Swal from 'sweetalert2'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    Swal.fire({
      title: 'Welcome to CredHex!',
      text: 'Securely store and manage your certificates.',
      icon: 'info',
      confirmButtonText: 'Let’s Go!',
      background: '#1e1e2f',
      color: '#ffffff'
    })
  }, [])

 const handleRegister = async (e) => {
  e.preventDefault()
  setLoading(true)

  const { error } = await supabase.auth.signUp({
    email,
    password
  })

  setLoading(false)

  if (error) {
    if (error.message.toLowerCase().includes("user already registered")) {
      Swal.fire({
        icon: 'error',
        title: 'Already Registered!',
        text: 'This email is already in use. Please use another or login.',
        background: '#1e1e2f',
        color: '#ffffff'
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.message,
        background: '#1e1e2f',
        color: '#ffffff'
      })
    }
  } else {
    Swal.fire({
      icon: 'success',
      title: 'Almost Done!',
      text: 'Check your email to confirm registration.',
      background: '#1e1e2f',
      color: '#ffffff'
    })
    navigate('/login')
  }
}

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.card}>
        <h2 style={styles.title}>Create your CredHex Account</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <div style={styles.passwordWrapper}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={styles.toggleIcon}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit" style={styles.button}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p style={styles.linkText}>
          Already have an account?{' '}
          <a href="/login" style={styles.link}>Login</a>
        </p>
      </form>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif',
    padding: '20px'
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '30px',
    borderRadius: '16px',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    width: '100%',
    maxWidth: '360px',
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: '24px'
  },
  input: {
    padding: '12px',
    marginBottom: '16px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '1rem',
    width: '100%'
  },
  passwordWrapper: {
    position: 'relative'
  },
  toggleIcon: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#ccc'
  },
  button: {
    padding: '12px',
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '12px'
  },
  linkText: {
    color: '#ccc',
    fontSize: '0.9rem',
    textAlign: 'center'
  },
  link: {
    color: '#a5b4fc',
    textDecoration: 'underline'
  }
}

export default Register
