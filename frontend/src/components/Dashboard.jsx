import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2, Users, Share2, Trash2, Info } from 'lucide-react'
import { toast } from 'sonner'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { urlsAPI } from '../api'

const Dashboard = () => {
  const [urls, setUrls] = useState([])
  const [loading, setLoading] = useState(true)
  const [shortenLoading, setShortenLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [isBatch, setIsBatch] = useState(false)
  const [formData, setFormData] = useState({ originalUrl: '', customAlias: '', password: '', maxClicks: 0, expireAt: '' })
  const [deleteShortCode, setDeleteShortCode] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchUrls()
  }, [])

  const fetchUrls = async () => {
    try {
      const { data } = await urlsAPI.list()
      setUrls(data)
    } catch (err) {
      toast.error('Failed to load links')
    }
    setLoading(false)
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleToggleBatch = () => {
    setIsBatch(!isBatch)
    if (!isBatch) {
      setFormData({ ...formData, originalUrl: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setShortenLoading(true)
    try {
      let results = []
      let successCount = 0
      if (isBatch) {
        const urlsList = formData.originalUrl.split('\n').filter(line => line.trim()).map(line => line.trim())
        if (urlsList.length === 0) {
          toast.error('No URLs provided in batch')
          setShortenLoading(false)
          return
        }
        toast.info(`Processing ${urlsList.length} URLs...`)
        for (let i = 0; i < urlsList.length; i++) {
          try {
            const batchData = { 
              ...formData, 
              originalUrl: urlsList[i],
              customAlias: i === 0 && formData.customAlias ? formData.customAlias : ''  
            }
            const { data } = await urlsAPI.shorten(batchData)
            results.push(data.shortLink)
            successCount++
            if (i === 0 && formData.customAlias && urlsList.length > 1) {
              toast.warning('Alias applied to first URL only—others auto-generated')
            }
          } catch (err) {
            console.error(`Batch URL ${i+1} failed:`, err)
            toast.error(`URL ${i+1} failed: ${err.response?.data?.error || 'Unknown error'}`)
          }
        }
        if (successCount > 0) {
          toast.success(`Batch complete! ${successCount}/${urlsList.length} links created.`)
          if (results.length > 0) {
            navigate(`/success/${results[0].split('/').pop()}`, { state: { password: formData.password } })  // ← Pass password state
          }
        } else {
          toast.error('Batch failed—no links created')
        }
      } else {
        const { data } = await urlsAPI.shorten(formData)
        results = [data.shortLink]
        toast.success('Shortened successfully!')
        navigate(`/success/${data.shortLink.split('/').pop()}`, { state: { password: formData.password } })  // ← Pass password state
      }
      setFormData({ originalUrl: '', customAlias: '', password: '', maxClicks: 0, expireAt: '' })
      fetchUrls()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Shorten failed')
    }
    setShortenLoading(false)
  }

  const handleDelete = (shortCode) => {
    setDeleteShortCode(shortCode)
  }

  const confirmDelete = async () => {
    if (!deleteShortCode) return
    setDeleteLoading(true)
    try {
      await urlsAPI.delete(deleteShortCode)
      toast.success('Deleted successfully!')
      fetchUrls()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Delete failed')
    }
    setDeleteLoading(false)
    setDeleteShortCode(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const getMaxClicksText = (maxClicks) => {
    if (maxClicks === 0) return 'Unlimited'
    return `Auto-deletes after ${maxClicks} clicks`
  }

  const getExpireText = (expireAt) => {
    if (!expireAt) return 'No expiration'
    const expireDate = new Date(expireAt)
    return expireDate > new Date() ? `Expires on ${expireDate.toLocaleDateString()}` : 'Expired'
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Shortener Form Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">✍️ Customize & Shorten</CardTitle>
            <CardDescription>Paste a URL </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-sm font-medium">Batch Mode</Label>
              <Switch checked={isBatch} onCheckedChange={handleToggleBatch} />
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {isBatch ? (
                <div className="space-y-2">
                  <Label htmlFor="originalUrl">URLs (one per line)</Label>
                  <Textarea 
                    id="originalUrl"
                    name="originalUrl" 
                    value={formData.originalUrl} 
                    onChange={handleChange} 
                    placeholder="https://example1.com&#10;https://example2.com&#10;https://example3.com" 
                    rows={4}
                    required 
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="originalUrl">Original URL</Label>
                  <Input 
                    id="originalUrl"
                    name="originalUrl" 
                    value={formData.originalUrl} 
                    onChange={handleChange} 
                    placeholder="https://example.com" 
                    required 
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="customAlias">Custom Alias (optional)</Label>
                <Input 
                  id="customAlias"
                  name="customAlias" 
                  value={formData.customAlias} 
                  onChange={handleChange} 
                  placeholder="my-short-link" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password Protect (optional)</Label>
                <Input 
                  id="password"
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="Enter password" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxClicks">Max Clicks</Label>
                <Input 
                  id="maxClicks"
                  type="number" 
                  name="maxClicks" 
                  value={formData.maxClicks} 
                  onChange={handleChange} 
                  placeholder="0" 
                  min="0" 
                />
                <p className="text-xs text-muted-foreground">Auto-deletes after X clicks; 0 = unlimited</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expireAt">Auto-Expire (optional)</Label>
                <Input 
                  id="expireAt"
                  type="datetime-local" 
                  name="expireAt" 
                  value={formData.expireAt} 
                  onChange={handleChange} 
                  placeholder="2025-10-15T12:00" 
                />
                <p className="text-xs text-muted-foreground">Link auto-expires on this date/time</p>
              </div>
              <Button type="submit" className="w-full" disabled={shortenLoading}>
                {shortenLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {shortenLoading ? 'Shortening...' : 'Linklytic It! 🚀'}
              </Button>
            </form>
            
          </CardContent>
        </Card>

        {/* Links Table Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Your Linklytics</CardTitle>
            <CardDescription>Total links: {urls.length}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {urls.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No links yet—shorten one above!</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Short Code</TableHead>
                    <TableHead>Original URL</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Max Clicks</TableHead>
                    <TableHead>Auto-Expire</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {urls.map((url) => (
                    <TableRow key={url._id}>
                      <TableCell className="font-medium">{url.shortCode}</TableCell>
                      <TableCell className="max-w-xs truncate">{url.originalUrl}</TableCell>
                      <TableCell className="font-medium text-green-600">{url.clicks}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{getMaxClicksText(url.maxClicks)}</TableCell>
                      <TableCell className="text-sm">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center gap-1 cursor-help">
                              {getExpireText(url.expireAt)}
                              <Info className="h-3 w-3 text-muted-foreground" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{url.expireAt ? 'Link auto-expires on this date' : 'No auto-expire set'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{new Date(url.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="space-x-2 p-2">
                        <Link to={`/analytics/${url.shortCode}`} className="text-primary hover:underline">
                          View Analytics
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => navigate(`/success/${url.shortCode}`)}
                          className="p-0 h-auto ml-4"
                        >
                          <Share2 className="h-4 w-4" />
                          <span className="ml-1">Share QR</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(url.shortCode)}
                              disabled={deleteLoading}
                              className="p-0 h-auto ml-2 text-destructive hover:text-destructive/80"
                            >
                              {deleteLoading && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                              <Trash2 className="h-4 w-4" />
                              <span className="ml-1">{deleteLoading ? 'Deleting...' : 'Delete'}</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Linklytic?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will delete the link and all its analytics.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={confirmDelete} disabled={deleteLoading}>
                                {deleteLoading ? 'Deleting...' : 'Delete'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}

export default Dashboard