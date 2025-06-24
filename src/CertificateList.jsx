import React, { useEffect, useState } from 'react'
import { supabase } from './supabase'
import Swal from 'sweetalert2'

const CertificateList = () => {
  const [certs, setCerts] = useState([])
  const [userId, setUserId] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    const fetchFiles = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        console.warn("User not found:", error)
        return
      }

      setUserId(user.id)

      const { data: files, error: listError } = await supabase.storage
        .from('certificates')
        .list(`${user.id}/`, { limit: 100 })

      if (listError) {
        console.error("Error fetching certificates:", listError)
      } else {
        setCerts(files)
      }
    }

    fetchFiles()
  }, [])

  const handleDelete = async (fileName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${fileName}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      background: '#1e1e2f',
      color: '#ffffff'
    })

    if (!result.isConfirmed) return

    const filePath = `${userId}/${fileName}`

    const { error } = await supabase.storage
      .from('certificates')
      .remove([filePath])

    if (error) {
      Swal.fire('Failed to delete', error.message, 'error')
    } else {
      Swal.fire('Deleted!', 'Your certificate has been removed.', 'success')
      setCerts((prev) => prev.filter(file => file.name !== fileName))
    }
  }

  const handlePreview = (fileName) => {
    const url = `https://qjchthvinzvxfzkwyeqx.supabase.co/storage/v1/object/public/certificates/${userId}/${fileName}`
    setPreviewUrl(url)
  }

  const closePreview = () => {
    setPreviewUrl(null)
  }

  return (
    <div>
      <h3 style={{ textAlign: 'center', marginTop: '2rem' }}>
        Your Uploaded Certificates
      </h3>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {certs.map((file) => (
          <li key={file.name} style={styles.item}>
            <span onClick={() => handlePreview(file.name)} style={styles.link}>
              {file.name}
            </span>

            <div style={styles.meta}>
              <span style={styles.metaText}>{(file.metadata?.size / 1024).toFixed(2)} KB</span>
              <span style={styles.metaText}>{new Date(file.created_at).toLocaleDateString()}</span>
            </div>

            <button onClick={() => handleDelete(file.name)} style={styles.button}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      {previewUrl && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button onClick={closePreview} style={styles.closeBtn}>X</button>
            <iframe
              src={previewUrl}
              style={styles.iframe}
              title="PDF Preview"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  item: {
    background: 'rgba(255,255,255,0.05)',
    padding: '10px 15px',
    margin: '10px 0',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px'
  },
  link: {
    color: '#a5b4fc',
    cursor: 'pointer',
    textDecoration: 'underline',
    flex: 1
  },
  meta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginRight: '10px',
    color: '#aaa',
    fontSize: '0.8rem'
  },
  metaText: {
    marginBottom: '2px'
  },
  button: {
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '5px 10px',
    cursor: 'pointer'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    position: 'relative',
    width: '80%',
    height: '80%',
    backgroundColor: '#1e1e2f',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 0 20px rgba(255,255,255,0.1)'
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none'
  },
  closeBtn: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '1.5rem',
    cursor: 'pointer'
  }
}

export default CertificateList
