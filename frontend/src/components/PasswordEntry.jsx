import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, Lock, ArrowRight } from 'lucide-react'
import axios from 'axios'

const PasswordEntry = () => {
  const { shortCode } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.get(`http://localhost:5000/api/urls/${shortCode}/validate?pw=${password}`)
      const { originalUrl } = response.data
      toast.success('Access granted!')
      window.open(originalUrl, '_blank')  // ← Opens in new tab
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Incorrect password—try again')
      } else if (err.response?.status === 410) {
        toast.error('Link expired')
      } else {
        toast.error('Access denied')
      }
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Lock className="h-6 w-6 text-destructive" />
            Protected Link
          </CardTitle>
          <p className="text-muted-foreground">Enter the password to access the link.</p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter password" 
              required 
              className="text-lg"
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {loading ? 'Unlocking...' : 'Unlock & Go'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>
          <Button onClick={() => navigate('/dashboard')} className="w-full mt-4" variant="secondary">
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default PasswordEntry