'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, Copy, GripVertical } from 'lucide-react'

export default function AdminWorksList() {
  const router = useRouter()
  const [works, setWorks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isZh, setIsZh] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    const lang = localStorage.getItem('portfolio-language') || 'zh'
    setIsZh(lang === 'zh')
    fetchWorks()
  }, [])

  const fetchWorks = async () => {
    try {
      const res = await fetch('/api/works')
      const data = await res.json()
      if (data.works) setWorks(data.works)
    } catch (e) {
      console.error('Failed to fetch works', e)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/works/${id}`, { method: 'DELETE' })
      setWorks(works.filter((w) => w.id !== id))
      setDeleteConfirm(null)
    } catch (e) {
      console.error('Failed to delete', e)
    }
  }

  const handleDuplicate = async (id: string) => {
    try {
      await fetch(`/api/works/${id}/duplicate`, { method: 'POST' })
      fetchWorks()
    } catch (e) {
      console.error('Failed to duplicate', e)
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { zh: string; en: string }> = {
      published: { zh: '已发布', en: 'Published' },
      'in-progress': { zh: '进行中', en: 'In Progress' },
      'pending-result': { zh: '待出结果', en: 'Pending' },
      awarded: { zh: '已获奖', en: 'Awarded' },
      archived: { zh: '已归档', en: 'Archived' },
      draft: { zh: '草稿', en: 'Draft' },
    }
    return labels[status]?.[isZh ? 'zh' : 'en'] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      published: 'bg-emerald-100 text-emerald-700',
      awarded: 'bg-amber-100 text-amber-700',
      draft: 'bg-gray-100 text-gray-600',
      'pending-result': 'bg-blue-100 text-blue-700',
      'in-progress': 'bg-purple-100 text-purple-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-600'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text">
            {isZh ? '作品管理' : 'Works Management'}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {isZh ? `共 ${works.length} 个作品` : `${works.length} works total`}
          </p>
        </div>
        <Link
          href="/admin/works/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
        >
          <Plus className="h-4 w-4" />
          {isZh ? '新增作品' : 'New Work'}
        </Link>
      </div>

      {works.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-text-secondary">
            {isZh ? '还没有作品，点击上方按钮创建' : 'No works yet. Create one!'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-bg-alt border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-text-secondary w-8"></th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">
                  {isZh ? '标题' : 'Title'}
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary hidden md:table-cell">
                  {isZh ? '分类' : 'Category'}
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary hidden sm:table-cell">
                  {isZh ? '状态' : 'Status'}
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary hidden lg:table-cell">
                  {isZh ? '年份' : 'Year'}
                </th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">
                  {isZh ? '操作' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody>
              {works.map((work) => (
                <tr key={work.id} className="border-b border-border hover:bg-bg-alt/50 transition-colors">
                  <td className="px-4 py-3.5 text-text-secondary">
                    <GripVertical className="h-4 w-4 cursor-grab opacity-50" />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-text">
                      {work.title?.[isZh ? 'zh' : 'en'] || work.title?.zh || 'Untitled'}
                    </div>
                    <div className="text-xs text-text-secondary mt-0.5">{work.id}</div>
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary hidden md:table-cell">{work.category}</td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(work.status)}`}>
                      {getStatusLabel(work.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary hidden lg:table-cell">{work.year}</td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/works/${work.id}`}
                        target="_blank"
                        className="rounded-lg p-2 text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/works/${work.id}`}
                        className="rounded-lg p-2 text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDuplicate(work.id)}
                        className="rounded-lg p-2 text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors"
                        title={isZh ? '复制' : 'Duplicate'}
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      {deleteConfirm === work.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(work.id)}
                            className="rounded-lg px-2 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
                          >
                            {isZh ? '确认' : 'Confirm'}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="rounded-lg px-2 py-1.5 text-xs font-medium text-text-secondary hover:bg-bg-alt transition-colors"
                          >
                            {isZh ? '取消' : 'Cancel'}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(work.id)}
                          className="rounded-lg p-2 text-text-secondary hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}