// UploadForm.jsx
import React, { useState } from 'react'
import { supabase } from './supabase'
import { toast } from 'react-toastify'

const UploadForm = () => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async (e) => {
    e.preventDefault()

    if (!file) {
      toast.error('Please select a file to upload.')
      return
    }

    setUploading(true)

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      toast.error('You must be logged in to upload.')
      setUploading(false)
      return
    }

    const filePath = `${user.id}/${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('certificates')
      .upload(filePath, file)

    setUploading(false)

    if (uploadError) {
      toast.error('Upload failed. Try again.')
    } else {
      toast.success('Upload successful!')
      setFile(null)
    }
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Upload Certificate</h3>
      <form onSubmit={handleUpload} style={styles.form}>
        <input type="file" accept="application/pdf" onChange={handleFileChange} style={styles.fileInput} />
        {file && <p style={styles.filename}>Selected: {file.name}</p>}
        <button type="submit" style={styles.button} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  )
}

const styles = {
  container: {
    background: 'rgba(255,255,255,0.05)',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px'
  },
  title: {
    fontSize: '1.2rem',
    marginBottom: '12px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  fileInput: {
    background: 'white',
    borderRadius: '8px',
    padding: '10px',
    border: 'none'
  },
  filename: {
    color: '#ccc'
  },
  button: {
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer'
  }
}

export default UploadForm
