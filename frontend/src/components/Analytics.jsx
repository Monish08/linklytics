import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis } from 'recharts'
import { Loader2, Users } from 'lucide-react'
import { toast } from 'sonner'
import { urlsAPI } from '../api'

const Analytics = () => {
  const { shortCode } = useParams()
  const [data, setData] = useState({ url: null, clicks: [] })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [shortCode])

  const fetchData = async () => {
    try {
      const { data: res } = await urlsAPI.analytics(shortCode)
      setData(res)
    } catch (err) {
      toast.error('Analytics not found')
      navigate('/dashboard')
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const chartData = data.clicks.reduce((acc, click) => {
    const date = new Date(click.timestamp).toLocaleDateString()
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})
  const chartPoints = Object.entries(chartData).map(([date, count]) => ({ date, count: Number(count) }))

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">📊 Analytics for {data.url?.originalUrl}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-primary">Total Clicks: {data.url?.clicks || 0}</span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              {/* Removed "Loading unique visitors..." */}
            </div>
          </div>
          {chartPoints.length > 0 ? (
            <ChartContainer config={{ count: { color: 'hsl(var(--primary))' } }} className="h-80">
              <LineChart data={chartPoints}>
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="count" stroke="currentColor" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No clicks yet—share your link to see magic! 🚀</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Clicks Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Recent Clicks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.clicks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No recent activity yet.</p>
          ) : (
            <div className="space-y-3">
              {data.clicks.map((click, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-muted rounded-md">
                  <div className="font-medium text-sm">{new Date(click.timestamp).toLocaleString()}</div>
                  <div className="mt-2 sm:mt-0 text-xs text-muted-foreground flex flex-wrap gap-4">
                    <span>Referrer: {click.referrer || 'Direct'}</span>
                    <span>IP: {click.ip}</span>
                    <span>Location: {click.city}, {click.country}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Analytics