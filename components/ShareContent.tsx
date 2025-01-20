import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Facebook, Twitter } from "lucide-react"

interface ShareContentProps {
  contentType: "track" | "playlist"
  contentId: string
  contentName: string
}

export function ShareContent({ contentType, contentId, contentName }: ShareContentProps) {
  const [shareUrl, setShareUrl] = useState("")

  const generateShareUrl = async () => {
    const response = await fetch("/api/share", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contentType, contentId }),
    })
    const data = await response.json()
    setShareUrl(data.shareUrl)
  }

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")
  }

  const shareToTwitter = () => {
    const text = `Check out this ${contentType} on Music Licensing Platform: ${contentName}`
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank",
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={generateShareUrl}>
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share {contentType}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shareUrl" className="text-right">
              Share URL
            </Label>
            <Input id="shareUrl" value={shareUrl} readOnly className="col-span-3" />
          </div>
          <div className="flex justify-center space-x-4">
            <Button onClick={shareToFacebook} className="flex items-center">
              <Facebook className="mr-2 h-4 w-4" /> Share on Facebook
            </Button>
            <Button onClick={shareToTwitter} className="flex items-center">
              <Twitter className="mr-2 h-4 w-4" /> Share on Twitter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

