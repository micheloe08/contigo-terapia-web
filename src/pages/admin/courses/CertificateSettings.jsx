import { useState, useEffect, useRef } from 'react'
import apiClient from '../../../api/client'

export default function CertificateSettings() {
  const [signerName, setSignerName]   = useState('')
  const [signerTitle, setSignerTitle] = useState('')
  const [signatureUrl, setSignatureUrl] = useState(null)
  const [previewUrl, setPreviewUrl]   = useState(null)
  const [saving, setSaving]           = useState(false)
  const [uploading, setUploading]     = useState(false)
  const [message, setMessage]         = useState(null)
  const fileRef = useRef(null)

  useEffect(() => {
    apiClient.get('/admin/settings/certificates').then(res => {
      setSignerName(res.data.signer_name || '')
      setSignerTitle(res.data.signer_title || '')
      setSignatureUrl(res.data.signature_image_url || null)
    })
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      await apiClient.post('/admin/settings/certificates', {
        signer_name:  signerName,
        signer_title: signerTitle,
      })
      setMessage({ type: 'success', text: 'Configuración guardada correctamente.' })
    } catch {
      setMessage({ type: 'error', text: 'Error al guardar la configuración.' })
    } finally {
      setSaving(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) setPreviewUrl(URL.createObjectURL(file))
  }

  const handleUploadSignature = async () => {
    const file = fileRef.current?.files[0]
    if (!file) return

    setUploading(true)
    setMessage(null)
    try {
      const form = new FormData()
      form.append('signature', file)
      const res = await apiClient.post('/admin/settings/certificates/signature', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setSignatureUrl(res.data.signature_image_url)
      setPreviewUrl(null)
      if (fileRef.current) fileRef.current.value = ''
      setMessage({ type: 'success', text: 'Imagen de firma actualizada.' })
    } catch {
      setMessage({ type: 'error', text: 'Error al subir la imagen.' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Configuración de Certificados</h1>
      <p className="text-sm text-gray-500 mb-6">
        Personaliza el firmante y la imagen de firma que aparecerán en los certificados PDF.
      </p>

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
          message.type === 'success'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Información del firmante */}
      <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">Información del firmante</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del firmante
          </label>
          <input
            type="text"
            value={signerName}
            onChange={e => setSignerName(e.target.value)}
            maxLength={100}
            placeholder="Dr. Director Médico"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cargo del firmante
          </label>
          <input
            type="text"
            value={signerTitle}
            onChange={e => setSignerTitle(e.target.value)}
            maxLength={100}
            placeholder="Director de Formación"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {saving ? 'Guardando…' : 'Guardar configuración'}
        </button>
      </form>

      {/* Imagen de firma */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Imagen de firma</h2>
        <p className="text-xs text-gray-500 mb-4">
          Sube una imagen PNG con fondo transparente. Se sobreescribirá la imagen anterior.
        </p>

        {/* Preview imagen actual */}
        {signatureUrl && !previewUrl && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-1">Firma actual:</p>
            <img
              src={signatureUrl}
              alt="Firma actual"
              className="max-h-20 border border-gray-200 rounded p-2 bg-gray-50"
            />
          </div>
        )}

        {/* Preview nueva imagen */}
        {previewUrl && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-1">Nueva firma (previsualización):</p>
            <img
              src={previewUrl}
              alt="Nueva firma"
              className="max-h-20 border border-blue-200 rounded p-2 bg-blue-50"
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/png"
            onChange={handleFileChange}
            className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
          />
          <button
            type="button"
            onClick={handleUploadSignature}
            disabled={uploading || !previewUrl}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {uploading ? 'Subiendo…' : 'Subir firma'}
          </button>
        </div>
      </div>
    </div>
  )
}
