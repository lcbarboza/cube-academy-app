import { useSession, useSolveHistory } from '@/contexts'
import { ChevronDown, Edit2, Plus, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ConfirmModal } from './ConfirmModal'

interface SessionSelectorProps {
  /** Optional callback when rename is requested */
  onRenameRequest?: (sessionId: string, currentName: string) => void
}

export function SessionSelector({ onRenameRequest }: SessionSelectorProps) {
  const { t } = useTranslation()
  const { sessions, activeSession, createSession, switchSession, deleteSession } = useSession()
  const { deleteSessionSolves } = useSolveHistory()
  const [isOpen, setIsOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ sessionId: string; name: string } | null>(
    null,
  )
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const handleSessionSelect = useCallback(
    (sessionId: string) => {
      switchSession(sessionId)
      setIsOpen(false)
    },
    [switchSession],
  )

  const handleNewSession = useCallback(() => {
    createSession()
    setIsOpen(false)
  }, [createSession])

  const handleRenameClick = useCallback(
    (e: React.MouseEvent, sessionId: string, sessionName: string) => {
      e.stopPropagation()
      setIsOpen(false)
      onRenameRequest?.(sessionId, sessionName)
    },
    [onRenameRequest],
  )

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent, sessionId: string, sessionName: string) => {
      e.stopPropagation()
      setIsOpen(false)
      setDeleteConfirm({ sessionId, name: sessionName })
    },
    [],
  )

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirm) {
      // First delete all solves for this session
      deleteSessionSolves(deleteConfirm.sessionId)
      // Then delete the session itself
      deleteSession(deleteConfirm.sessionId)
      setDeleteConfirm(null)
    }
  }, [deleteConfirm, deleteSession, deleteSessionSolves])

  const handleDeleteCancel = useCallback(() => {
    setDeleteConfirm(null)
  }, [])

  const canDelete = sessions.length > 1

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Trigger Button */}
        <button
          type="button"
          onClick={handleToggle}
          className="session-selector-trigger flex items-center gap-2 py-2 px-3 text-xs font-mono rounded-md transition-all duration-200"
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label={t('session.selectSession', 'Select session')}
        >
          <span className="session-selector-label truncate max-w-[120px]">
            {activeSession?.name ?? t('session.defaultSession', 'Session 1')}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className="session-selector-dropdown absolute top-full left-0 mt-1 min-w-[200px] py-1 rounded-md shadow-lg z-50"
            aria-label={t('session.sessionList', 'Session list')}
          >
            {/* Session List */}
            <div className="max-h-[200px] overflow-y-auto">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`session-selector-item flex items-center justify-between transition-colors ${
                    session.id === activeSession?.id ? 'session-selector-item-active' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleSessionSelect(session.id)}
                    className="flex-1 text-left px-3 py-2 text-xs font-mono truncate"
                    aria-pressed={session.id === activeSession?.id}
                  >
                    {session.name}
                  </button>
                  <div className="flex items-center gap-1 pr-2">
                    {onRenameRequest && (
                      <button
                        type="button"
                        onClick={(e) => handleRenameClick(e, session.id, session.name)}
                        className="session-selector-action p-1 rounded opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity"
                        aria-label={t('session.rename', 'Rename session')}
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteClick(e, session.id, session.name)}
                        className="session-selector-action session-selector-delete p-1 rounded opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity"
                        aria-label={t('session.delete', 'Delete session')}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="session-selector-divider my-1" />

            {/* New Session Button */}
            <button
              type="button"
              onClick={handleNewSession}
              className="session-selector-new flex items-center gap-2 w-full px-3 py-2 text-xs font-mono transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('session.newSession', 'New Session')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteConfirm}
        title={t('session.deleteSession', 'Delete Session')}
        message={t(
          'session.deleteConfirmMessage',
          `Are you sure you want to delete "${deleteConfirm?.name}"? All solves in this session will be permanently deleted.`,
        )}
        confirmLabel={t('session.deleteConfirm', 'Delete')}
        cancelLabel={t('common.cancel', 'Cancel')}
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  )
}
