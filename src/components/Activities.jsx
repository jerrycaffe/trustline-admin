import React, { useEffect, useMemo, useState } from 'react'
import 'chart.js/auto'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { HiOutlineAdjustmentsVertical } from 'react-icons/hi2'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import '../css/Users.css'
import '../css/Activities.css'
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import { api } from '../services/api'

const PAGE_SIZE_OPTIONS = [20, 10, 30, 50]

const extractEntriesResponse = (response) => {
  const directItems = Array.isArray(response) ? response : null
  const dataObject = response?.data && typeof response.data === 'object' ? response.data : null

  const items =
    directItems
    || (Array.isArray(response?.data) ? response.data : null)
    || (Array.isArray(dataObject?.content) ? dataObject.content : null)
    || (Array.isArray(dataObject?.items) ? dataObject.items : null)
    || (Array.isArray(dataObject?.results) ? dataObject.results : null)
    || (Array.isArray(dataObject?.records) ? dataObject.records : null)
    || (Array.isArray(dataObject?.entries) ? dataObject.entries : null)
    || []

  const totalRaw =
    response?.total
    ?? dataObject?.total
    ?? response?.count
    ?? dataObject?.count
    ?? response?.totalCount
    ?? dataObject?.totalCount

  const total = Number(totalRaw)

  return {
    items,
    total: Number.isFinite(total) ? total : items.length,
  }
}

const normalizeEntry = (entry) => {
  if (!entry || typeof entry !== 'object') {
    return null
  }
  return {
    id: String(entry.id ?? entry._id ?? '').trim(),
    activityId: String(entry.activityId ?? '').trim(),
    activityName: String(entry.activityName ?? 'Untitled activity').trim(),
    gradeType: String(entry.gradeType ?? '—').trim(),
    unit: String(entry.unit ?? '—').trim(),
    userId: String(entry.userId ?? '').trim(),
    userName: String(entry.userName ?? 'Unknown user').trim(),
    value: entry.value ?? null,
    notes: entry.notes ?? '',
    createdAt: entry.createdAt ?? null,
    updatedAt: entry.updatedAt ?? null,
  }
}

const normalizeOverview = (payload) => {
  const data = payload?.data ?? payload ?? {}
  const toNumber = (value) => {
    if (value === null || value === undefined || value === '') return 0
    const numeric = Number(value)
    return Number.isFinite(numeric) ? numeric : 0
  }
  return {
    totalActivities: toNumber(data.totalActivities),
    totalEntries: toNumber(data.totalEntries),
    activeUsers: toNumber(data.activeUsers),
    perActivity: Array.isArray(data.perActivity)
      ? data.perActivity.map((activity) => ({
        activityId: String(activity?.activityId ?? activity?.id ?? '').trim(),
        activityName: activity?.activityName ?? activity?.name ?? 'Untitled activity',
        gradeType: activity?.gradeType ?? '—',
        unit: activity?.unit ?? '—',
        totalEntries: toNumber(activity?.totalEntries),
        uniqueUsers: toNumber(activity?.uniqueUsers),
        average: activity?.average ?? null,
        min: activity?.min ?? null,
        max: activity?.max ?? null,
        sum: activity?.sum ?? null,
        firstEntryAt: activity?.firstEntryAt ?? null,
        lastEntryAt: activity?.lastEntryAt ?? null,
      }))
      : [],
  }
}

const formatMetric = (value) => {
  if (value === null || value === undefined || value === '') return '—'
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return String(value)
  return Number.isInteger(numeric)
    ? numeric.toLocaleString()
    : numeric.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

const formatDateTime = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatRelativeTime = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  const diffMs = Date.now() - date.getTime()
  if (diffMs < 0) return 'Just now'
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  if (diffMs < hour) return `${Math.max(1, Math.floor(diffMs / minute))}m ago`
  if (diffMs < day) return `${Math.max(1, Math.floor(diffMs / hour))}h ago`
  return `${Math.max(1, Math.floor(diffMs / day))}d ago`
}

const clampPercent = (value) => {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return 0
  return Math.min(100, Math.max(0, numeric))
}

const Activities = () => {
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedActivityId, setSelectedActivityId] = useState('')
  const [fromDateTime, setFromDateTime] = useState('')
  const [toDateTime, setToDateTime] = useState('')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [draftFilters, setDraftFilters] = useState({
    userId: '',
    activityId: '',
    from: '',
    to: '',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [entries, setEntries] = useState([])
  const [totalEntriesCount, setTotalEntriesCount] = useState(0)
  const [isLoadingEntries, setIsLoadingEntries] = useState(true)
  const [entriesError, setEntriesError] = useState('')
  const [overview, setOverview] = useState(null)
  const [isLoadingOverview, setIsLoadingOverview] = useState(true)
  const [overviewError, setOverviewError] = useState('')

  useEffect(() => {
    let isActive = true
    const loadEntries = async () => {
      setIsLoadingEntries(true)
      try {
        const params = new URLSearchParams()
        if (selectedActivityId) params.set('activityId', selectedActivityId)
        if (selectedUserId) params.set('userId', selectedUserId)
        if (fromDateTime) params.set('from', fromDateTime)
        if (toDateTime) params.set('to', toDateTime)
        params.set('offset', String(Math.max(0, (currentPage - 1) * pageSize)))
        params.set('limit', String(pageSize))

        const response = await api.get(`/api/v1/admin/activities/entries?${params.toString()}`)
        const { items, total } = extractEntriesResponse(response)
        const normalized = items.map(normalizeEntry).filter(Boolean)
        if (!isActive) return
        setEntries(normalized)
        setTotalEntriesCount(total)
        setEntriesError('')
      } catch (error) {
        if (!isActive) return
        setEntries([])
        setTotalEntriesCount(0)
        setEntriesError(error.message || 'Unable to load activity entries.')
      } finally {
        if (isActive) setIsLoadingEntries(false)
      }
    }
    loadEntries()
    return () => { isActive = false }
  }, [currentPage, fromDateTime, pageSize, selectedActivityId, selectedUserId, toDateTime])

  useEffect(() => {
    let isActive = true
    const loadOverview = async () => {
      setIsLoadingOverview(true)
      try {
        const endpoint = selectedUserId
          ? `/api/v1/admin/activities/users/${encodeURIComponent(selectedUserId)}/metrics`
          : '/api/v1/admin/activities/metrics/overview'
        const response = await api.get(endpoint)
        if (!isActive) return
        setOverview(normalizeOverview(response))
        setOverviewError('')
      } catch (error) {
        if (!isActive) return
        setOverview(null)
        setOverviewError(error.message || 'Unable to load activity metrics.')
      } finally {
        if (isActive) setIsLoadingOverview(false)
      }
    }
    loadOverview()
    return () => { isActive = false }
  }, [selectedUserId])

  const tableRows = useMemo(() => overview?.perActivity || [], [overview])

  const userOptions = useMemo(() => {
    const seen = new Map()
    entries.forEach((entry) => {
      if (!entry.userId) return
      if (!seen.has(entry.userId)) {
        seen.set(entry.userId, { id: entry.userId, name: entry.userName || 'Unknown user' })
      }
    })
    return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [entries])

  const activityOptions = useMemo(() => {
    const seen = new Map()
    entries.forEach((entry) => {
      if (!entry.activityId) return
      if (!seen.has(entry.activityId)) {
        seen.set(entry.activityId, { id: entry.activityId, name: entry.activityName || 'Untitled activity' })
      }
    })
    return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [entries])

  const entryInsights = useMemo(() => {
    const uniqueUsersSet = new Set()
    const uniqueActivitiesSet = new Set()
    const numericValues = []
    const last7DaysMap = new Map()
    const last30DaysMap = new Map()
    const hourBuckets = Array.from({ length: 24 }, () => 0)
    const dowBuckets = Array.from({ length: 7 }, () => 0)
    const gradeTypeCounts = new Map()
    const userCounts = new Map()
    const activityCounts = new Map()

    for (let offset = 6; offset >= 0; offset -= 1) {
      const d = new Date()
      d.setHours(0, 0, 0, 0)
      d.setDate(d.getDate() - offset)
      const key = d.toISOString().slice(0, 10)
      last7DaysMap.set(key, { count: 0, totalValue: 0, numericCount: 0 })
    }
    for (let offset = 29; offset >= 0; offset -= 1) {
      const d = new Date()
      d.setHours(0, 0, 0, 0)
      d.setDate(d.getDate() - offset)
      const key = d.toISOString().slice(0, 10)
      last30DaysMap.set(key, 0)
    }

    entries.forEach((entry) => {
      if (entry.userId) uniqueUsersSet.add(entry.userId)
      if (entry.activityId) uniqueActivitiesSet.add(entry.activityId)
      const numeric = Number(entry.value)
      if (Number.isFinite(numeric)) numericValues.push(numeric)

      const gt = String(entry.gradeType || 'OTHER').toUpperCase()
      gradeTypeCounts.set(gt, (gradeTypeCounts.get(gt) || 0) + 1)

      if (entry.userId) {
        const u = userCounts.get(entry.userId) || { name: entry.userName, count: 0, totalValue: 0, numericCount: 0 }
        u.count += 1
        if (Number.isFinite(numeric)) { u.totalValue += numeric; u.numericCount += 1 }
        userCounts.set(entry.userId, u)
      }
      if (entry.activityId) {
        const a = activityCounts.get(entry.activityId) || { name: entry.activityName, count: 0 }
        a.count += 1
        activityCounts.set(entry.activityId, a)
      }

      const dt = entry.createdAt || entry.updatedAt
      const parsed = dt ? new Date(dt) : null
      if (parsed && !Number.isNaN(parsed.getTime())) {
        hourBuckets[parsed.getHours()] += 1
        dowBuckets[parsed.getDay()] += 1
        const dayKey = parsed.toISOString().slice(0, 10)
        if (last7DaysMap.has(dayKey)) {
          const bucket = last7DaysMap.get(dayKey)
          bucket.count += 1
          if (Number.isFinite(numeric)) {
            bucket.totalValue += numeric
            bucket.numericCount += 1
          }
        }
        if (last30DaysMap.has(dayKey)) {
          last30DaysMap.set(dayKey, last30DaysMap.get(dayKey) + 1)
        }
      }
    })

    const activeUsers = Number(overview?.activeUsers) || 0
    const uniqueUsers = uniqueUsersSet.size
    const totalEntries = entries.length
    const avgValue = numericValues.length
      ? numericValues.reduce((sum, v) => sum + v, 0) / numericValues.length
      : null
    const sortedValues = [...numericValues].sort((a, b) => a - b)
    const median = sortedValues.length ? sortedValues[Math.floor(sortedValues.length / 2)] : null
    const q1 = sortedValues.length ? sortedValues[Math.floor((sortedValues.length - 1) * 0.25)] : null
    const q3 = sortedValues.length ? sortedValues[Math.floor((sortedValues.length - 1) * 0.75)] : null
    const minValue = sortedValues.length ? sortedValues[0] : null
    const maxValue = sortedValues.length ? sortedValues[sortedValues.length - 1] : null

    const dailySeries = Array.from(last7DaysMap.entries()).map(([date, bucket]) => ({
      date,
      label: new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      count: bucket.count,
      avgValue: bucket.numericCount ? bucket.totalValue / bucket.numericCount : null,
    }))

    const trendSeries = Array.from(last30DaysMap.entries()).map(([date, count]) => ({
      date,
      label: new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      count,
    }))
    let cumulative = 0
    const cumulativeSeries = trendSeries.map((d) => {
      cumulative += d.count
      return { ...d, cumulative }
    })

    const topUsers = Array.from(userCounts.entries())
      .map(([id, v]) => ({
        id,
        name: v.name,
        count: v.count,
        avgValue: v.numericCount ? v.totalValue / v.numericCount : null,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)

    const dowLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const peakDowIndex = dowBuckets.reduce((best, val, idx) => (val > dowBuckets[best] ? idx : best), 0)
    const peakHourIndex = hourBuckets.reduce((best, val, idx) => (val > hourBuckets[best] ? idx : best), 0)
    const peakHourCount = hourBuckets[peakHourIndex] || 0
    const peakDowCount = dowBuckets[peakDowIndex] || 0

    const topActivity = Array.from(activityCounts.values()).sort((a, b) => b.count - a.count)[0] || null

    // Value distribution histogram (5 bins)
    let histogram = []
    if (sortedValues.length && Number.isFinite(minValue) && Number.isFinite(maxValue) && maxValue > minValue) {
      const bins = 5
      const step = (maxValue - minValue) / bins
      histogram = Array.from({ length: bins }, (_, i) => {
        const lo = minValue + step * i
        const hi = i === bins - 1 ? maxValue : lo + step
        const count = sortedValues.filter((v) => v >= lo && (i === bins - 1 ? v <= hi : v < hi)).length
        return {
          label: `${formatMetric(lo.toFixed(1))}–${formatMetric(hi.toFixed(1))}`,
          count,
        }
      })
    } else if (sortedValues.length) {
      histogram = [{ label: formatMetric(minValue), count: sortedValues.length }]
    }

    return {
      totalEntries,
      uniqueUsers,
      uniqueActivities: uniqueActivitiesSet.size,
      avgValue,
      median,
      q1,
      q3,
      minValue,
      maxValue,
      activeCoveragePct: activeUsers > 0 ? clampPercent((uniqueUsers / activeUsers) * 100) : 0,
      entriesPerUser: uniqueUsers > 0 ? totalEntries / uniqueUsers : 0,
      dailySeries,
      trendSeries: cumulativeSeries,
      hourBuckets,
      dowBuckets,
      dowLabels,
      peakDow: dowLabels[peakDowIndex],
      peakDowCount,
      peakHour: peakHourIndex,
      peakHourCount,
      gradeTypeCounts: Array.from(gradeTypeCounts.entries()).map(([k, v]) => ({ label: k, count: v })),
      topUsers,
      topActivity,
      histogram,
    }
  }, [entries, overview?.activeUsers])

  const enrichedEntries = useMemo(() => entries.map((entry) => {
    const numeric = Number(entry.value)
    let valueBand = 'No value'
    let valueBandClass = 'neutral'
    if (Number.isFinite(numeric)) {
      if (entryInsights.q1 !== null && numeric < entryInsights.q1) {
        valueBand = 'Low'; valueBandClass = 'low'
      } else if (entryInsights.q3 !== null && numeric > entryInsights.q3) {
        valueBand = 'High'; valueBandClass = 'high'
      } else {
        valueBand = 'Stable'; valueBandClass = 'stable'
      }
    }
    return {
      ...entry,
      valueBand,
      valueBandClass,
      recencyText: formatRelativeTime(entry.createdAt || entry.updatedAt),
    }
  }), [entries, entryInsights.q1, entryInsights.q3])

  const chartRows = useMemo(() => {
    if (!Array.isArray(tableRows) || tableRows.length === 0) return []
    const activeUsers = Number(overview?.activeUsers) || 0
    return tableRows.map((row) => {
      const min = Number(row?.min)
      const max = Number(row?.max)
      const average = Number(row?.average)
      const hasAll = Number.isFinite(min) && Number.isFinite(max) && Number.isFinite(average)
      let performanceScore = 0
      if (hasAll) {
        if (max === min) {
          performanceScore = average > 0 ? 100 : 0
        } else {
          const normalized = String(row?.gradeType || '').toUpperCase() === 'TIME'
            ? ((max - average) / (max - min)) * 100
            : ((average - min) / (max - min)) * 100
          performanceScore = clampPercent(normalized)
        }
      }
      const participationRate = activeUsers > 0
        ? clampPercent((Number(row?.uniqueUsers || 0) / activeUsers) * 100)
        : 0
      return {
        label: String(row?.activityName || 'Untitled activity'),
        performanceScore,
        participationRate,
        totalEntries: Number(row?.totalEntries || 0),
      }
    })
      .sort((a, b) => b.totalEntries - a.totalEntries)
      .slice(0, 8)
  }, [overview?.activeUsers, tableRows])

  const performanceChartData = useMemo(() => ({
    labels: chartRows.map((row) => (row.label.length > 20 ? `${row.label.slice(0, 20)}...` : row.label)),
    datasets: [
      {
        label: 'Performance score (%)',
        data: chartRows.map((row) => Number(row.performanceScore.toFixed(2))),
        backgroundColor: '#837AEF',
        borderRadius: 8,
        maxBarThickness: 32,
      },
      {
        label: 'Participation rate (%)',
        data: chartRows.map((row) => Number(row.participationRate.toFixed(2))),
        backgroundColor: '#4ECBB2',
        borderRadius: 8,
        maxBarThickness: 32,
      },
    ],
  }), [chartRows])

  const baseChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          useBorderRadius: true,
          borderRadius: 2,
          color: '#475467',
          font: { size: 12, weight: '500' },
        },
      },
      tooltip: {
        backgroundColor: '#001616',
        padding: 10,
        cornerRadius: 8,
        titleFont: { weight: '600' },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#7c8790', font: { size: 11, weight: '500' } },
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          callback: (value) => `${value}%`,
          color: '#98A2B3',
          font: { size: 11 },
        },
        grid: { color: '#EAECF0' },
      },
    },
  }), [])

  const velocityChartData = useMemo(() => ({
    labels: entryInsights.dailySeries.map((d) => d.label),
    datasets: [
      {
        type: 'bar',
        label: 'Entries',
        data: entryInsights.dailySeries.map((d) => d.count),
        backgroundColor: '#837AEF',
        borderRadius: 6,
        maxBarThickness: 28,
        yAxisID: 'y',
      },
      {
        type: 'line',
        label: 'Avg value',
        data: entryInsights.dailySeries.map((d) => (d.avgValue == null ? null : Number(d.avgValue.toFixed(2)))),
        borderColor: '#E72353',
        backgroundColor: '#E72353',
        tension: 0.35,
        pointRadius: 3,
        pointHoverRadius: 4,
        yAxisID: 'y1',
      },
    ],
  }), [entryInsights.dailySeries])

  const velocityChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 10,
          color: '#475467',
          font: { size: 12, weight: '500' },
        },
      },
      tooltip: {
        backgroundColor: '#001616',
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#7c8790', font: { size: 11, weight: '500' } },
      },
      y: {
        position: 'left',
        beginAtZero: true,
        grid: { color: '#EAECF0' },
        ticks: { color: '#98A2B3', font: { size: 11 } },
      },
      y1: {
        position: 'right',
        beginAtZero: true,
        grid: { drawOnChartArea: false },
        ticks: { color: '#98A2B3', font: { size: 11 } },
      },
    },
  }), [])

  // ---- Additional analytical charts ----

  const gradeMixData = useMemo(() => {
    const palette = ['#837AEF', '#4ECBB2', '#FED634', '#FF7C33', '#3DACF5', '#FF3389']
    return {
      labels: entryInsights.gradeTypeCounts.map((g) => g.label),
      datasets: [{
        data: entryInsights.gradeTypeCounts.map((g) => g.count),
        backgroundColor: entryInsights.gradeTypeCounts.map((_, i) => palette[i % palette.length]),
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 6,
      }],
    }
  }, [entryInsights.gradeTypeCounts])

  const doughnutOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          useBorderRadius: true,
          borderRadius: 2,
          color: '#475467',
          font: { size: 12, weight: '500' },
          padding: 12,
        },
      },
      tooltip: {
        backgroundColor: '#001616',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((s, v) => s + v, 0) || 1
            const pct = ((ctx.parsed / total) * 100).toFixed(1)
            return `${ctx.label}: ${ctx.parsed} (${pct}%)`
          },
        },
      },
    },
  }), [])

  const topUsersChartData = useMemo(() => ({
    labels: entryInsights.topUsers.map((u) => (u.name.length > 18 ? `${u.name.slice(0, 18)}…` : u.name)),
    datasets: [{
      label: 'Entries',
      data: entryInsights.topUsers.map((u) => u.count),
      backgroundColor: '#837AEF',
      borderRadius: 6,
      maxBarThickness: 22,
    }],
  }), [entryInsights.topUsers])

  const topUsersChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#001616', padding: 10, cornerRadius: 8 },
    },
    scales: {
      x: { beginAtZero: true, grid: { color: '#EAECF0' }, ticks: { color: '#98A2B3', font: { size: 11 } } },
      y: { grid: { display: false }, ticks: { color: '#21343b', font: { size: 11, weight: '500' } } },
    },
  }), [])

  const hourChartData = useMemo(() => ({
    labels: entryInsights.hourBuckets.map((_, i) => `${String(i).padStart(2, '0')}:00`),
    datasets: [{
      label: 'Entries',
      data: entryInsights.hourBuckets,
      backgroundColor: entryInsights.hourBuckets.map((v) => {
        const max = Math.max(...entryInsights.hourBuckets, 1)
        const intensity = v / max
        const alpha = 0.25 + intensity * 0.75
        return `rgba(131, 122, 239, ${alpha})`
      }),
      borderRadius: 4,
      maxBarThickness: 16,
    }],
  }), [entryInsights.hourBuckets])

  const hourChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#001616', padding: 10, cornerRadius: 8 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#98A2B3', font: { size: 10 }, maxRotation: 0, autoSkip: true, autoSkipPadding: 6 } },
      y: { beginAtZero: true, grid: { color: '#EAECF0' }, ticks: { color: '#98A2B3', font: { size: 11 }, precision: 0 } },
    },
  }), [])

  const dowChartData = useMemo(() => ({
    labels: entryInsights.dowLabels,
    datasets: [{
      label: 'Entries',
      data: entryInsights.dowBuckets,
      backgroundColor: '#4ECBB2',
      borderRadius: 6,
      maxBarThickness: 28,
    }],
  }), [entryInsights.dowBuckets, entryInsights.dowLabels])

  const dowChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#001616', padding: 10, cornerRadius: 8 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#7c8790', font: { size: 11, weight: '500' } } },
      y: { beginAtZero: true, grid: { color: '#EAECF0' }, ticks: { color: '#98A2B3', font: { size: 11 }, precision: 0 } },
    },
  }), [])

  const trendChartData = useMemo(() => ({
    labels: entryInsights.trendSeries.map((d) => d.label),
    datasets: [
      {
        type: 'bar',
        label: 'Daily entries',
        data: entryInsights.trendSeries.map((d) => d.count),
        backgroundColor: 'rgba(131, 122, 239, 0.25)',
        borderRadius: 4,
        maxBarThickness: 12,
        yAxisID: 'y',
      },
      {
        type: 'line',
        label: 'Cumulative',
        data: entryInsights.trendSeries.map((d) => d.cumulative),
        borderColor: '#837AEF',
        backgroundColor: 'rgba(131, 122, 239, 0.15)',
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 3,
        borderWidth: 2,
        yAxisID: 'y1',
      },
    ],
  }), [entryInsights.trendSeries])

  const trendChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'top', align: 'end', labels: { boxWidth: 10, color: '#475467', font: { size: 12, weight: '500' } } },
      tooltip: { backgroundColor: '#001616', padding: 10, cornerRadius: 8 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#98A2B3', font: { size: 10 }, autoSkip: true, maxRotation: 0 } },
      y: { position: 'left', beginAtZero: true, grid: { color: '#EAECF0' }, ticks: { color: '#98A2B3', font: { size: 11 }, precision: 0 } },
      y1: { position: 'right', beginAtZero: true, grid: { drawOnChartArea: false }, ticks: { color: '#98A2B3', font: { size: 11 }, precision: 0 } },
    },
  }), [])

  const histogramData = useMemo(() => ({
    labels: entryInsights.histogram.map((b) => b.label),
    datasets: [{
      label: 'Entries',
      data: entryInsights.histogram.map((b) => b.count),
      backgroundColor: '#FF7C33',
      borderRadius: 6,
      maxBarThickness: 36,
    }],
  }), [entryInsights.histogram])

  const histogramOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#001616', padding: 10, cornerRadius: 8 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#7c8790', font: { size: 10, weight: '500' }, maxRotation: 0, autoSkip: false } },
      y: { beginAtZero: true, grid: { color: '#EAECF0' }, ticks: { color: '#98A2B3', font: { size: 11 }, precision: 0 } },
    },
  }), [])

  const sparklineBarOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
      x: { display: false },
      y: { display: false, beginAtZero: true },
    },
    elements: { bar: { borderRadius: 2 } },
  }), [])

  const sparklineLineOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    elements: { point: { radius: 0 }, line: { tension: 0.4, borderWidth: 2 } },
  }), [])

  const kpiRingOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
  }), [])

  const sparklineVolumeData = useMemo(() => ({
    labels: entryInsights.dailySeries.map((d) => d.label),
    datasets: [{
      data: entryInsights.dailySeries.map((d) => d.count),
      backgroundColor: '#4ECBB2',
      maxBarThickness: 8,
    }],
  }), [entryInsights.dailySeries])

  const sparklineAvgData = useMemo(() => ({
    labels: entryInsights.dailySeries.map((d) => d.label),
    datasets: [{
      data: entryInsights.dailySeries.map((d) => d.avgValue || 0),
      borderColor: '#FF7C33',
      backgroundColor: 'rgba(255, 124, 51, 0.18)',
      fill: true,
    }],
  }), [entryInsights.dailySeries])

  const sparklineActivitiesData = useMemo(() => {
    const top = entryInsights.topUsers.slice(0, 7)
    return {
      labels: top.map((u) => u.name),
      datasets: [{
        data: top.map((u) => u.count),
        backgroundColor: '#FED634',
        maxBarThickness: 8,
      }],
    }
  }, [entryInsights.topUsers])

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalEntriesCount / pageSize)),
    [pageSize, totalEntriesCount],
  )

  const startItem = totalEntriesCount === 0 ? 0 : ((currentPage - 1) * pageSize) + 1
  const endItem = Math.min(currentPage * pageSize, totalEntriesCount)

  const appliedFilterChips = useMemo(() => {
    const chips = []
    if (selectedUserId) {
      const u = userOptions.find((user) => user.id === selectedUserId)
      chips.push({ key: 'user', label: `User: ${u?.name || selectedUserId}` })
    }
    if (selectedActivityId) {
      const a = activityOptions.find((activity) => activity.id === selectedActivityId)
      chips.push({ key: 'activity', label: `Activity: ${a?.name || selectedActivityId}` })
    }
    if (fromDateTime) chips.push({ key: 'from', label: `From: ${formatDateTime(fromDateTime)}` })
    if (toDateTime) chips.push({ key: 'to', label: `To: ${formatDateTime(toDateTime)}` })
    return chips
  }, [activityOptions, fromDateTime, selectedActivityId, selectedUserId, toDateTime, userOptions])

  const openFilterModal = () => {
    setDraftFilters({
      userId: selectedUserId,
      activityId: selectedActivityId,
      from: fromDateTime,
      to: toDateTime,
    })
    setIsFilterModalOpen(true)
  }

  const closeFilterModal = () => setIsFilterModalOpen(false)

  const handleDraftChange = (field, value) => {
    setDraftFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleApplyModalFilters = (event) => {
    event.preventDefault()
    setSelectedUserId(draftFilters.userId || '')
    setSelectedActivityId(draftFilters.activityId || '')
    setFromDateTime(draftFilters.from || '')
    setToDateTime(draftFilters.to || '')
    setCurrentPage(1)
    closeFilterModal()
  }

  const handleResetModalFilters = () => {
    setDraftFilters({ userId: '', activityId: '', from: '', to: '' })
  }

  const handleSelectUserFromTable = (userId) => {
    setSelectedUserId(userId)
    setCurrentPage(1)
  }

  const clearAppliedFilters = () => {
    setSelectedUserId('')
    setSelectedActivityId('')
    setFromDateTime('')
    setToDateTime('')
    setCurrentPage(1)
  }

  const renderPagination = () => (
    <div className='users-pagination'>
      <div className='pagination-left'>
        <p className='pagination-info'>
          Showing {startItem}&#8211;{endItem} of {totalEntriesCount} entries
        </p>
        <div className='page-size-wrap'>
          <label htmlFor='activities-page-size'>Rows per page</label>
          <select
            id='activities-page-size'
            className='page-size-select'
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1) }}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      <div className='pagination-controls'>
        <button
          className='page-btn'
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          aria-label='Previous page'
        >
          <MdKeyboardArrowLeft size={18} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={page === currentPage ? 'page-btn is-active' : 'page-btn'}
            onClick={() => setCurrentPage(page)}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
        <button
          className='page-btn'
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          aria-label='Next page'
        >
          <MdKeyboardArrowRight size={18} />
        </button>
      </div>
    </div>
  )

  return (
    <div className='users-container'>
      <Searchbar />
      <Sidebar />
      <div className='users'>
        <div className='header'>
          <p>Activities Analytics</p>
          <div className='head-right'>
            <button onClick={openFilterModal} aria-label='Filter'>
              <HiOutlineAdjustmentsVertical size={20} />Filter
            </button>
          </div>
        </div>

        {appliedFilterChips.length > 0 && (
          <div className='act-chips-row'>
            <div className='act-chips'>
              {appliedFilterChips.map((chip) => (
                <span key={chip.key} className='act-chip'>{chip.label}</span>
              ))}
            </div>
            <button type='button' className='act-chip-clear' onClick={clearAppliedFilters}>
              Clear all
            </button>
          </div>
        )}

        <section className='act-kpi-grid'>
          <article className='act-kpi'>
            <div className='act-kpi-top'>
              <span className='act-kpi-label'>Active Reach</span>
              <strong className='act-kpi-value'>
                {formatMetric(entryInsights.activeCoveragePct.toFixed(1))}<em>%</em>
              </strong>
            </div>
            <div className='act-kpi-ring'>
              <Doughnut
                data={{
                  labels: ['Engaged', 'Untouched'],
                  datasets: [{
                    data: [
                      entryInsights.activeCoveragePct,
                      Math.max(0, 100 - entryInsights.activeCoveragePct),
                    ],
                    backgroundColor: ['#837AEF', '#EEF0F6'],
                    borderWidth: 0,
                  }],
                }}
                options={kpiRingOptions}
              />
            </div>
          </article>
          <article className='act-kpi'>
            <div className='act-kpi-top'>
              <span className='act-kpi-label'>Entry Intensity</span>
              <strong className='act-kpi-value'>{formatMetric(entryInsights.entriesPerUser.toFixed(2))}</strong>
            </div>
            <div className='act-kpi-spark'>
              <Bar data={sparklineVolumeData} options={sparklineBarOptions} />
            </div>
          </article>
          <article className='act-kpi'>
            <div className='act-kpi-top'>
              <span className='act-kpi-label'>Outcome Quality</span>
              <strong className='act-kpi-value'>
                {entryInsights.avgValue == null ? '—' : formatMetric(entryInsights.avgValue.toFixed(2))}
              </strong>
            </div>
            <div className='act-kpi-spark'>
              <Line data={sparklineAvgData} options={sparklineLineOptions} />
            </div>
          </article>
          <article className='act-kpi'>
            <div className='act-kpi-top'>
              <span className='act-kpi-label'>Coverage</span>
              <strong className='act-kpi-value'>{formatMetric(entryInsights.uniqueActivities)}</strong>
            </div>
            <div className='act-kpi-spark'>
              <Bar data={sparklineActivitiesData} options={sparklineBarOptions} />
            </div>
          </article>
        </section>

        <div className='users-body'>
          <div className='act-board'>
            <div className='users-table-shell act-section act-card act-card--w8'>
              <div className='act-section-head'>
                <p className='act-section-title'>Entry Velocity · 7d</p>
                <div className='act-insight-pills'>
                  <span className='act-pill'>Peak <strong>{entryInsights.peakDow}</strong></span>
                  <span className='act-pill'>Hour <strong>{String(entryInsights.peakHour).padStart(2, '0')}:00</strong></span>
                  {entryInsights.topActivity && (
                    <span className='act-pill'>Top <strong>{entryInsights.topActivity.name}</strong></span>
                  )}
                </div>
              </div>
              <div className='act-chart-body'>
                {isLoadingEntries && <div className='act-empty'>…</div>}
                {!isLoadingEntries && entriesError && (
                  <div className='act-empty act-empty-error'>{entriesError}</div>
                )}
                {!isLoadingEntries && !entriesError && entryInsights.dailySeries.every((d) => d.count === 0) && (
                  <div className='act-empty'>No data in range.</div>
                )}
                {!isLoadingEntries && !entriesError && entryInsights.dailySeries.some((d) => d.count > 0) && (
                  <div className='act-chart-wrap'>
                    <Bar data={velocityChartData} options={velocityChartOptions} />
                  </div>
                )}
              </div>
            </div>

            <div className='users-table-shell act-section act-card act-card--w4'>
              <div className='act-section-head'>
                <p className='act-section-title'>Grade Type Mix</p>
              </div>
              <div className='act-chart-body'>
                {entryInsights.gradeTypeCounts.length === 0 ? (
                  <div className='act-empty'>No data.</div>
                ) : (
                  <div className='act-chart-wrap'>
                    <Doughnut data={gradeMixData} options={doughnutOptions} />
                  </div>
                )}
              </div>
            </div>

            <div className='users-table-shell act-section act-card act-card--w8'>
              <div className='act-section-head'>
                <p className='act-section-title'>30-Day Trend</p>
              </div>
              <div className='act-chart-body'>
                {entries.length === 0 ? (
                  <div className='act-empty'>No data.</div>
                ) : (
                  <div className='act-chart-wrap'>
                    <Bar data={trendChartData} options={trendChartOptions} />
                  </div>
                )}
              </div>
            </div>

            <div className='users-table-shell act-section act-card act-card--w4'>
              <div className='act-section-head'>
                <p className='act-section-title'>Hour of Day</p>
              </div>
              <div className='act-chart-body'>
                {entries.length === 0 ? (
                  <div className='act-empty'>No data.</div>
                ) : (
                  <div className='act-chart-wrap'>
                    <Bar data={hourChartData} options={hourChartOptions} />
                  </div>
                )}
              </div>
            </div>

            <div className='users-table-shell act-section act-card act-card--w6'>
              <div className='act-section-head'>
                <p className='act-section-title'>Top Contributors</p>
              </div>
              <div className='act-chart-body'>
                {entryInsights.topUsers.length === 0 ? (
                  <div className='act-empty'>No data.</div>
                ) : (
                  <div className='act-chart-wrap act-chart-tall'>
                    <Bar data={topUsersChartData} options={topUsersChartOptions} />
                  </div>
                )}
              </div>
            </div>

            <div className='users-table-shell act-section act-card act-card--w3'>
              <div className='act-section-head'>
                <p className='act-section-title'>Day of Week</p>
              </div>
              <div className='act-chart-body'>
                {entries.length === 0 ? (
                  <div className='act-empty'>No data.</div>
                ) : (
                  <div className='act-chart-wrap'>
                    <Bar data={dowChartData} options={dowChartOptions} />
                  </div>
                )}
              </div>
            </div>

            <div className='users-table-shell act-section act-card act-card--w3'>
              <div className='act-section-head'>
                <p className='act-section-title'>Value Distribution</p>
                <div className='act-insight-pills'>
                  <span className='act-pill'>Med <strong>{entryInsights.median == null ? '—' : formatMetric(Number(entryInsights.median).toFixed(2))}</strong></span>
                </div>
              </div>
              <div className='act-chart-body'>
                {entryInsights.histogram.length === 0 ? (
                  <div className='act-empty'>No data.</div>
                ) : (
                  <div className='act-chart-wrap'>
                    <Bar data={histogramData} options={histogramOptions} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='users-table-shell act-section'>
            <div className='act-section-head'>
              <p className='act-section-title'>Activity Entries</p>
            </div>

            {isLoadingEntries && <div className='act-empty'>Loading activity entries…</div>}
            {!isLoadingEntries && entriesError && (
              <div className='act-empty act-empty-error'>{entriesError}</div>
            )}
            {!isLoadingEntries && !entriesError && entries.length === 0 && (
              <div className='act-empty'>No activity entries found for the selected filters.</div>
            )}

            {!isLoadingEntries && !entriesError && entries.length > 0 && (
              <div className='users-body'>
                <table className='act-table'>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Activity</th>
                      <th>Value</th>
                      <th>Band</th>
                      <th>Grade</th>
                      <th>Unit</th>
                      <th>Date</th>
                      <th>Recency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrichedEntries.map((entry) => {
                      const isSelected = Boolean(selectedUserId && selectedUserId === entry.userId)
                      return (
                        <tr
                          key={entry.id || `${entry.userId}-${entry.activityId}-${entry.createdAt || 'row'}`}
                          className={isSelected ? 'is-selected' : ''}
                          onClick={() => handleSelectUserFromTable(entry.userId)}
                        >
                          <td className='name'>{entry.userName}</td>
                          <td>{entry.activityName}</td>
                          <td>{formatMetric(entry.value)}</td>
                          <td><span className={`value-band ${entry.valueBandClass}`}>{entry.valueBand}</span></td>
                          <td>{entry.gradeType}</td>
                          <td>{entry.unit}</td>
                          <td>{formatDateTime(entry.createdAt || entry.updatedAt)}</td>
                          <td className='act-muted'>{entry.recencyText}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {!isLoadingEntries && !entriesError && entries.length > 0 && renderPagination()}
          </div>

          <div className='users-table-shell act-section'>
            <div className='act-section-head'>
              <p className='act-section-title'>User Performance</p>
            </div>
            <div className='act-chart-body'>
              {isLoadingOverview && <div className='act-empty'>…</div>}
              {!isLoadingOverview && overviewError && (
                <div className='act-empty act-empty-error'>{overviewError}</div>
              )}
              {!isLoadingOverview && !overviewError && chartRows.length === 0 && (
                <div className='act-empty'>No data.</div>
              )}
              {!isLoadingOverview && !overviewError && chartRows.length > 0 && (
                <div className='act-chart-wrap'>
                  <Bar data={performanceChartData} options={baseChartOptions} />
                </div>
              )}
            </div>
          </div>

          <div className='users-table-shell act-section'>
            <div className='act-section-head'>
              <p className='act-section-title'>Per Activity Report</p>
            </div>

            {isLoadingOverview && <div className='act-empty'>Loading activity metrics…</div>}
            {!isLoadingOverview && overviewError && (
              <div className='act-empty act-empty-error'>{overviewError}</div>
            )}
            {!isLoadingOverview && !overviewError && tableRows.length === 0 && (
              <div className='act-empty'>No activity metrics available for this filter.</div>
            )}
            {!isLoadingOverview && !overviewError && tableRows.length > 0 && (
              <div className='users-body'>
                <table className='act-table'>
                  <thead>
                    <tr>
                      <th>Activity</th>
                      <th>Grade</th>
                      <th>Unit</th>
                      <th>Entries</th>
                      <th>Users</th>
                      <th>Average</th>
                      <th>Min</th>
                      <th>Max</th>
                      <th>Sum</th>
                      <th>Last Entry</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row) => (
                      <tr key={row.activityId || row.activityName}>
                        <td className='name'>{row.activityName}</td>
                        <td>{row.gradeType}</td>
                        <td>{row.unit}</td>
                        <td>{formatMetric(row.totalEntries)}</td>
                        <td>{formatMetric(row.uniqueUsers)}</td>
                        <td>{formatMetric(row.average)}</td>
                        <td>{formatMetric(row.min)}</td>
                        <td>{formatMetric(row.max)}</td>
                        <td>{formatMetric(row.sum)}</td>
                        <td className='act-muted'>{formatDateTime(row.lastEntryAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {isFilterModalOpen && (
          <div className='users-filter-modal-overlay' onClick={closeFilterModal}>
            <div className='users-filter-modal' role='dialog' aria-modal='true' onClick={(e) => e.stopPropagation()}>
              <div className='users-filter-modal-head'>
                <p>Filter Activity Entries</p>
                <button
                  type='button'
                  className='users-close-modal-btn'
                  onClick={closeFilterModal}
                  aria-label='Close filter modal'
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleApplyModalFilters} className='users-filter-modal-form'>
                <label htmlFor='act-filter-user'>User</label>
                <select
                  id='act-filter-user'
                  value={draftFilters.userId}
                  onChange={(e) => handleDraftChange('userId', e.target.value)}
                >
                  <option value=''>All users</option>
                  {userOptions.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>

                <label htmlFor='act-filter-activity'>Activity</label>
                <select
                  id='act-filter-activity'
                  value={draftFilters.activityId}
                  onChange={(e) => handleDraftChange('activityId', e.target.value)}
                >
                  <option value=''>All activities</option>
                  {activityOptions.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>

                <label htmlFor='act-filter-from'>From</label>
                <input
                  id='act-filter-from'
                  type='datetime-local'
                  value={draftFilters.from}
                  onChange={(e) => handleDraftChange('from', e.target.value)}
                />

                <label htmlFor='act-filter-to'>To</label>
                <input
                  id='act-filter-to'
                  type='datetime-local'
                  value={draftFilters.to}
                  onChange={(e) => handleDraftChange('to', e.target.value)}
                />

                <div className='users-filter-modal-actions'>
                  <button type='button' className='users-ghost-btn' onClick={handleResetModalFilters}>Reset</button>
                  <button type='button' className='users-ghost-btn' onClick={closeFilterModal}>Cancel</button>
                  <button type='submit' className='users-apply-btn'>Apply Filter</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Activities
