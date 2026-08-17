'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Edit, Copy, Trash2, Eye, EyeOff, MoreHorizontal } from 'lucide-react'

interface WorkActionsProps {
  workId: string
  workStatus: string
  onDelete?: () => void
}

export default function WorkActions({ workId, workStatus, onDelete }: WorkActionsProps) {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(workStatus !== 'internal-only')

  // Check if admin on mount
  useEffect(() => {
    let active = true
    fetch('/api/auth/me')
      .then(res => { if (active) setIsAdmin(res.ok) })
      .catch(() => { if (active) setIsAdmin(false) })
    return () => { active = false }
  }, [])

  if (isAdmin === null || isAdmin === false) return null

  const handleDuplicate = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/works/${workId}/duplicate`, { method: 'POST' })
      if (res.ok) {
        router.push('/admin/works')
      }
    } catch (e) {
      console.error('Duplicate failed', e)
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this work?')) return
    setLoading(true)
    try {
      await fetch(`/api/works/${workId}`, { method: 'DELETE' })
      if (onDelete) onDelete()
      else router.refresh()
    } catch (e) {
      console.error('Delete failed', e)
    }
    setLoading(false)
  }

  return (
    <div className="absolute top-3 left-3 z-20">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-lg bg-white/90 backdrop-blur-sm border border-border px-2.5 py-1.5 text-xs font-medium text-text shadow-sm hover:bg-white transition-colors"
        title="Admin actions"
      >
        <MoreHorizontal className="h-3.5 w-3.5" />
        Edit
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-40 rounded-lg border border-border bg-white shadow-lg overflow-hidden z-30">
          <button
            onClick={() => { router.push(`/admin/works/${workId}`); setOpen(false) }}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-text hover:bg-bg-alt transition-colors"
          >
            <Edit className="h-3.5 w-3.5" />
            Edit Work
          </button>
          <button
            onClick={() => { handleDuplicate(); setOpen(false) }}
            disabled={loading}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-text hover:bg-bg-alt transition-colors disabled:opacity-50"
          >
            <Copy className="h-3.5 w-3.5" />
            Duplicate
          </button>
          <button
            onClick={() => { handleDelete(); setOpen(false) }}
            disabled={loading}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  )
}