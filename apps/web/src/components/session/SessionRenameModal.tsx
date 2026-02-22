import { X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface SessionRenameModalProps {
  isOpen: boolean
  sessionId: string
  currentName: string
  onConfirm: (sessionId: string, newName: string) => void
  onCancel: () => void
}

export function SessionRenameModal({
  isOpen,
  sessionId,
  currentName,
  onConfirm,
  onCancel,
}: SessionRenameModalProps) {
  const { t } = useTranslation()
  const [name, setName] = useState(currentName)
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Reset name and open dialog when mounted
  useEffect(() => {
    setName(currentName)
    dialogRef.current?.showModal()
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 50)
  }, [currentName])

  // Handle escape key via dialog's cancel event
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    function handleCancel(event: Event) {
      event.preventDefault()
      onCancel()
    }

    dialog.addEventListener('cancel', handleCancel)
    return () => dialog.removeEventListener('cancel', handleCancel)
  }, [onCancel])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const trimmedName = name.trim()
      if (trimmedName && trimmedName !== currentName) {
        onConfirm(sessionId, trimmedName)
      } else {
        onCancel()
      }
    },
    [name, currentName, sessionId, onConfirm, onCancel],
  )

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onCancel()
      }
    },
    [onCancel],
  )

  const handleBackdropKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target === e.currentTarget) {
          onCancel()
        }
      }
    },
    [onCancel],
  )

  // Don't render when closed
  if (!isOpen) return null

  return (
    <dialog
      ref={dialogRef}
      className="session-modal-dialog"
      onClick={handleBackdropClick}
      onKeyDown={handleBackdropKeyDown}
      aria-labelledby="rename-modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 session-modal-backdrop" />

      {/* Modal */}
      <div className="session-modal relative w-full max-w-sm mx-4 p-6 rounded-lg shadow-xl">
        {/* Close button */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 session-modal-close p-1 rounded-md transition-colors"
          aria-label={t('common.close', 'Close')}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <h2 id="rename-modal-title" className="text-lg font-semibold mb-4 session-modal-title">
          {t('session.renameSession', 'Rename Session')}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="session-name"
              className="block text-xs font-mono mb-2 session-modal-label"
            >
              {t('session.sessionName', 'Session Name')}
            </label>
            <input
              ref={inputRef}
              id="session-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm font-mono rounded-md session-modal-input"
              placeholder={t('session.enterName', 'Enter session name')}
              maxLength={50}
              autoComplete="off"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-mono rounded-md transition-colors session-modal-btn-cancel"
            >
              {t('common.cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-mono rounded-md transition-colors session-modal-btn-confirm"
              disabled={!name.trim() || name.trim() === currentName}
            >
              {t('common.save', 'Save')}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}
