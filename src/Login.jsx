import React, { useState } from 'react'
import { supabase } from './supabase'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'


const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
  e.preventDefault()
  setLoading(true)

  const {  error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  setLoading(false)

  if (error) {
    if (error.message.toLowerCase().includes('invalid login credentials')) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid email or password.',
        background: '#1e1e2f',
        color: '#ffffff'
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        background: '#1e1e2f',
        color: '#ffffff'
      })
    }
  } else {
    Swal.fire({
      icon: 'success',
      title: 'Welcome!',
      text: 'Logged in successfully.',
      background: '#1e1e2f',
      color: '#ffffff'
    })
    navigate('/dashboard')
  }
}

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    })

    if (error) {
      toast.error(`Google login failed: ${error.message}`)
    }
  }

  const handleResetPassword = async () => {
  const { value: email } = await Swal.fire({
    title: 'Reset Password',
    input: 'email',
    inputLabel: 'Enter your registered email',
    inputPlaceholder: 'you@example.com',
    background: '#1e1e2f',
    color: '#fff',
    confirmButtonColor: '#4f46e5',
    showCancelButton: true
  })

  if (!email) return

  const { error } = await supabase.auth.resetPasswordForEmail(email)

  if (error) {
    Swal.fire('Failed', error.message, 'error')
  } else {
    Swal.fire('Email Sent!', 'Check your inbox for the reset link.', 'success')
  }
}


  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.card}>
        <h2 style={styles.title}>Login to CredHex</h2>

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
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <button type="button" style={styles.googleButton} onClick={handleGoogleLogin}>
          Sign in with Google
        </button>

        <p onClick={handleResetPassword} style={styles.forgotText}>
          Forgot Password?
        </p>

        <p style={styles.linkText}>
          Don’t have an account?{' '}
          <a href="/register" style={styles.link}>Register</a>
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
  googleButton: {
    padding: '12px',
    backgroundColor: '#ffffff',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '16px'
  },
  forgotText: {
    textAlign: 'center',
    color: '#ccc',
    textDecoration: 'underline',
    cursor: 'pointer',
    marginBottom: '10px'
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

export default Login
