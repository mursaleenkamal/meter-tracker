'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../app/scanner.module.css'
import { addReadingAction } from '@/lib/actions'
import { saveOfflineReading } from '@/lib/offlineStore'
import {
  Camera,
  Keyboard,
  ArrowLeft,
  Loader2,
  FileImage,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  WifiOff,
} from 'lucide-react'

interface ReadingFormProps {
  meterId: string
  meterNumber: string
  onClose?: () => void
  onSuccess?: () => void
}

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function ReadingForm({ meterId, meterNumber, onClose, onSuccess }: ReadingFormProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'manual' | 'ocr'>('manual')
  const [readingValue, setReadingValue] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [ocrResult, setOcrResult] = useState<{
    success: boolean
    text?: string
    raw?: string
  } | null>(null)
  
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [offlineSuccessMsg, setOfflineSuccessMsg] = useState<string | null>(null)
  const [isBillingReset, setIsBillingReset] = useState(false)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setIsScanning(true)
    setOcrResult(null)
    setScanProgress(0)

    try {
      // Dynamic import of tesseract.js to avoid SSR problems
      const Tesseract = await import('tesseract.js')
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setScanProgress(Math.round(m.progress * 100))
          }
        },
      })

      const text = result.data.text
      console.log('OCR Output:', text)

      // RegEx: look for numbers representing the meter dial values (typically 4-7 digits)
      const matches = text.match(/\b\d{4,7}(?:\.\d+)?\b/g)

      if (matches && matches.length > 0) {
        // Choose the first match that is 4 or more digits
        const cleanMatch = matches.find((m) => m.replace('.', '').length >= 4) || matches[0]
        const parsed = parseFloat(cleanMatch)
        
        if (!isNaN(parsed)) {
          setReadingValue(parsed.toString())
          setOcrResult({
            success: true,
            text: cleanMatch,
            raw: text,
          })
        } else {
          setOcrResult({ success: false, raw: text })
        }
      } else {
        setOcrResult({ success: false, raw: text })
      }
    } catch (err) {
      console.error('OCR Error:', err)
      setOcrResult({ success: false, raw: 'Failed to complete image analysis.' })
    } finally {
      setIsScanning(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setSubmitError(null)
    setOfflineSuccessMsg(null)

    const parsed = parseFloat(readingValue)
    if (isNaN(parsed) || parsed < 0) {
      setSubmitError('Please enter a valid reading value.')
      setIsLoading(false)
      return
    }

    const saveOffline = async (noteSuffix = '(Offline)') => {
      let imageDataUrl: string | null = null
      if (imageFile) {
        try {
          imageDataUrl = await fileToDataURL(imageFile)
        } catch (e) {
          console.error('Error converting image to data URL:', e)
        }
      }

      saveOfflineReading({
        meterId,
        readingValue: parsed,
        notes: `Logged via Reading Form ${noteSuffix}`,
        isBillingReset,
        imageDataUrl,
        imageFileName: imageFile?.name,
        imageFileType: imageFile?.type,
      })

      setIsLoading(false)
      setOfflineSuccessMsg('Saved offline! Reading logged locally and will auto-sync when internet is restored.')
      setTimeout(() => {
        if (onSuccess) onSuccess()
        else if (onClose) onClose()
        else window.location.href = '/dashboard'
      }, 1200)
    }

    if (typeof window !== 'undefined' && !navigator.onLine) {
      await saveOffline()
      return
    }

    try {
      const formData = new FormData()
      formData.append('meterId', meterId)
      formData.append('readingValue', readingValue)
      formData.append('isBillingReset', String(isBillingReset))
      if (imageFile) {
        formData.append('image', imageFile)
      }

      const result = await addReadingAction(formData)
      setIsLoading(false)

      if (result?.error) {
        setSubmitError(result.error)
      } else {
        if (onSuccess) {
          onSuccess()
        } else {
          window.location.href = '/dashboard'
        }
      }
    } catch (netErr) {
      console.warn('Network submission failed, saving offline:', netErr)
      await saveOffline('(Offline Fallback)')
    }
  }

  return (
    <div className={styles.main} style={onClose ? { padding: '0', maxWidth: '100%' } : undefined}>
      {/* Back button */}
      {!onClose && (
        <div className={styles.backHeader}>
          <Link href="/dashboard" className={styles.backLink}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>
      )}

      <h1 className={styles.title}>New Meter Reading</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
        Record consumption for Meter:{' '}
        <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
          {meterNumber}
        </strong>
      </p>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab('manual')}
          className={`${styles.tabBtn} ${activeTab === 'manual' ? styles.tabBtnActive : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Keyboard size={18} /> Manual Input
        </button>
        <button
          onClick={() => setActiveTab('ocr')}
          className={`${styles.tabBtn} ${activeTab === 'ocr' ? styles.tabBtnActive : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Camera size={18} /> Photo Scan (OCR)
        </button>
      </div>

      {submitError && (
        <div className={`${styles.alert} ${styles.errorAlert}`} style={{ marginBottom: '0.5rem' }}>
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <span>{submitError}</span>
        </div>
      )}

      {offlineSuccessMsg && (
        <div className={`${styles.alert} ${styles.errorAlert}`} style={{ marginBottom: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#fca5a5' }}>
          <WifiOff size={18} style={{ flexShrink: 0 }} />
          <span>{offlineSuccessMsg}</span>
        </div>
      )}

      {/* OCR Form Fields / Scanning Panel */}
      {activeTab === 'ocr' && (
        <div>
          {!imagePreview ? (
            <label className={`${styles.scannerPanel} fade-in`}>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                className={styles.fileInput}
                disabled={isScanning || isLoading}
              />
              <FileImage className={styles.scannerIcon} size={48} />
              <h3 className={styles.panelTitle}>Upload Meter Picture</h3>
              <p className={styles.panelSubtitle}>
                Take a picture or select an image of your electric meter display dials.
              </p>
            </label>
          ) : (
            <div className="fade-in">
              <div className={styles.previewContainer}>
                <img
                  src={imagePreview}
                  alt="Meter Preview"
                  className={styles.previewImage}
                />
                
                {/* Scanner Laser HUD animation */}
                {isScanning && (
                  <div className={styles.scanOverlay}>
                    <div className={styles.laserLine}></div>
                  </div>
                )}

                {/* Progress bar overlay */}
                {isScanning && (
                  <div className={styles.ocrProgressBox}>
                    <RefreshCw className={styles.ocrProgressCircle} size={16} />
                    <span>Analyzing Image ({scanProgress}%)</span>
                  </div>
                )}
              </div>

              {/* OCR Feedback */}
              {ocrResult && (
                <div className={`${styles.resultsBanner} ${ocrResult.success ? styles.ocrSuccess : styles.ocrFailure}`}>
                  {ocrResult.success ? (
                    <>
                      <CheckCircle size={20} style={{ flexShrink: 0 }} />
                      <div>
                        <strong>Meter Reading Detected: {ocrResult.text} Units</strong>
                        <p style={{ fontSize: '0.8rem', marginTop: '0.2rem', opacity: 0.9 }}>
                          The reading input field has been auto-populated. Please verify it matches your physical meter display before submitting.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={20} style={{ flexShrink: 0 }} />
                      <div>
                        <strong>OCR Scan Inconclusive</strong>
                        <p style={{ fontSize: '0.8rem', marginTop: '0.2rem', opacity: 0.9 }}>
                          Unable to read digits clearly from the image. Please enter the reading value manually in the input field below.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Retake/Reselect Action */}
              {!isScanning && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                  <label className="glow-btn" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', padding: '8px 16px' }}>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageChange}
                      className={styles.fileInput}
                      disabled={isLoading}
                    />
                    <RefreshCw size={14} /> Scan Different Photo
                  </label>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Data entry form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="readingValue" className={styles.label}>
            Current Meter Reading (Units)
          </label>
          <input
            type="number"
            id="readingValue"
            value={readingValue}
            onChange={(e) => setReadingValue(e.target.value)}
            step="1"
            placeholder="e.g. 1284"
            className={styles.input}
            required
            disabled={isLoading || isScanning}
          />
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Enter the exact cumulative value displayed on your meter.
          </p>
        </div>

        <div className={styles.inputGroup} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', margin: '1rem 0' }}>
          <input
            type="checkbox"
            id="isBillingReset"
            checked={isBillingReset}
            onChange={(e) => setIsBillingReset(e.target.checked)}
            disabled={isLoading || isScanning}
            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)', marginTop: '0.2rem' }}
          />
          <label htmlFor="isBillingReset" className={styles.label} style={{ marginBottom: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>Start New Billing Cycle</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 'normal', lineHeight: '1.4' }}>
              Check this if this reading represents the official monthly K-Electric bill reset date.
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="glow-btn-solid"
          disabled={isLoading || isScanning || !readingValue}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '0.5rem',
            width: '100%',
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Saving Reading Log...
            </>
          ) : (
            'Submit Meter Reading'
          )}
        </button>
      </form>
    </div>
  )
}
