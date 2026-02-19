import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Download, Copy, ExternalLink, MessageCircle, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { QRCodeSVG } from 'qrcode.react'

const Success = () => {
  const { shortCode } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { password } = location.state || {}

  const [shortLink, setShortLink] = useState('')
  const [includePwInShare, setIncludePwInShare] = useState(true)
  const [loading, setLoading] = useState(true)

  const BASE_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    generateLink()
  }, [shortCode, includePwInShare])

  const generateLink = () => {
    try {
      let link = `${BASE_URL}/${shortCode}`

      if (includePwInShare && password) {
        link += `?pw=${encodeURIComponent(password)}`
      }

      setShortLink(link)
    } catch (err) {
      toast.error('Failed to generate link')
      navigate('/dashboard')
    }

    setLoading(false)
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shortLink)
      toast.success('Copied to clipboard!')
    } catch {
      toast.error('Copy failed—try manually!')
    }
  }

  const downloadQR = () => {
    const svg = document.getElementById('qr-svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      const pngUrl = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.href = pngUrl
      downloadLink.download = `linklytics-${shortCode}.png`
      downloadLink.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  const openLink = () => {
    window.open(shortLink, '_blank')
  }

  const shareWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shortLink)}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl flex items-center justify-center gap-2 mb-2">
            Success! 😊
          </CardTitle>

          <p className="text-muted-foreground">
            Here's your Linklytic:
          </p>

          {password && (
            <div className="flex items-center justify-center gap-2 text-xs text-destructive">
              <Lock className="h-3 w-3" />
              <span>
                Protected — users will need password to access.
              </span>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6 p-6">

          {/* Clickable URL */}
          <div
            className="bg-muted p-4 rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
            onClick={openLink}
            title="Click to open"
          >
            <p className="text-lg font-mono break-all text-primary underline flex items-center gap-2 justify-center">
              <ExternalLink className="h-4 w-4" />
              {shortLink}
            </p>
          </div>

          {/* QR Code */}
          <div
            className="flex justify-center p-4 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
            onClick={openLink}
            title="Click QR to open link"
          >
            <QRCodeSVG
              id="qr-svg"
              value={shortLink}
              size={200}
              bgColor="white"
              fgColor="#000000"
              level="H"
            />
          </div>

          {/* Password Toggle */}
          {password && (
            <div className="bg-muted p-3 rounded-lg space-y-3">
              <div className="flex flex-col items-center gap-2">
                <Label className="text-sm font-medium text-center">
                  Prompt for password?
                </Label>

                <Switch
                  checked={!includePwInShare}
                  onCheckedChange={() =>
                    setIncludePwInShare(!includePwInShare)
                  }
                  className="data-[state=checked]:bg-green-600"
                />
              </div>

              <Badge
                variant="secondary"
                className="text-xs w-full text-center"
              >
                Short Code: {shortCode}
              </Badge>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              onClick={copyLink}
              variant="outline"
              className="flex items-center gap-2 justify-center"
            >
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>

            <Button
              onClick={downloadQR}
              variant="outline"
              className="flex items-center gap-2 justify-center"
            >
              <Download className="h-4 w-4" />
              Download QR
            </Button>

            <Button
              onClick={shareWhatsApp}
              variant="outline"
              className="flex items-center gap-2 justify-center"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
          </div>

          <Button
            onClick={() => navigate('/dashboard')}
            className="w-full"
            variant="secondary"
          >
            Back to Home
          </Button>

          {password && !includePwInShare && (
            <p className="text-xs text-destructive text-center">
              Shared link will prompt users to enter password.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Success
