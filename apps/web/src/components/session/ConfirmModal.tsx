import { AlertTriangle, X } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const { t } = useTranslation()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const confirmBtnRef = useRef<HTMLButtonElement>(null)

  // Open dialog and focus confirm button when mounted
  useEffect(() => {
    dialogRef.current?.showModal()
    setTimeout(() => {
      confirmBtnRef.current?.focus()
    }, 50)
  }, [])

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

  const variantStyles = {
    danger: {
      icon: 'confirm-modal-icon-danger',
      confirmBtn: 'confirm-modal-btn-danger',
    },
    warning: {
      icon: 'confirm-modal-icon-warning',
      confirmBtn: 'confirm-modal-btn-warning',
    },
    info: {
      icon: 'confirm-modal-icon-info',
      confirmBtn: 'confirm-modal-btn-info',
    },
  }

  const styles = variantStyles[variant]

  // Don't render anything when closed
  if (!isOpen) return null

  return (
    <dialog
      ref={dialogRef}
      className="confirm-modal-dialog"
      onClick={handleBackdropClick}
      onKeyDown={handleBackdropKeyDown}
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-message"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 confirm-modal-backdrop" />

      {/* Modal */}
      <div className="confirm-modal relative w-full max-w-md mx-4 p-6 rounded-xl shadow-2xl">
        {/* Close button */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 confirm-modal-close p-1.5 rounded-lg transition-all duration-200"
          aria-label={t('common.close', 'Close')}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className={`confirm-modal-icon ${styles.icon} mx-auto mb-4`}>
          <AlertTriangle className="w-6 h-6" />
        </div>

        {/* Title */}
        <h2
          id="confirm-modal-title"
          className="text-lg font-semibold text-center mb-2 confirm-modal-title"
        >
          {title}
        </h2>

        {/* Message */}
        <p id="confirm-modal-message" className="text-sm text-center mb-6 confirm-modal-message">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 max-w-[140px] px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 confirm-modal-btn-cancel"
          >
            {cancelLabel ?? t('common.cancel', 'Cancel')}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            className={`flex-1 max-w-[140px] px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${styles.confirmBtn}`}
          >
            {confirmLabel ?? t('common.confirm', 'Confirm')}
          </button>
        </div>
      </div>
    </dialog>
  )
}
