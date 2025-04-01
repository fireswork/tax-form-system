'use client'

import { useState } from 'react'
import { Download, FileText, ArrowRight, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface DownloadLink {
  id: number
  title: string
  url: string
}

interface DownloadOptionsProps {
  downloadLinks: DownloadLink[]
  onReset: () => void
}

export function DownloadOptions({ downloadLinks, onReset }: DownloadOptionsProps) {
  const [downloadingId, setDownloadingId] = useState<number | null>(null)
  const [downloadProgress, setDownloadProgress] = useState(0)

  const handleDownload = (url: string, id: number) => {
    setDownloadingId(id)
    setDownloadProgress(0)
    window.open(`${process.env.NEXT_PUBLIC_DOWNLOAD_URL}${url}`, '_blank')
  }

  const getFileName = (url: string) => {
    const parts = url.split('/')
    return parts[parts.length - 1]
  }

  return (
    <Card>
      <CardContent className="p-8">
        <div className='flex flex-col justify-between'>
          <div className="flex items-center mb-6">
            <Download className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Download Options</h2>
          </div>

          <div className="space-y-4">
            {downloadLinks.map((link) => (
              <Button
                key={link.id}
                className="w-full h-auto py-4 text-lg gap-3 justify-start"
                onClick={() => handleDownload(link.url, link.id)}
              >
                <FileText className="h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span>{link.title}</span>
                  <span className="text-xs text-blue-200">{getFileName(link.url)}</span>
                </div>
                {/* {downloadingId === link.id ? (
                <div className="ml-auto w-24">
                  <Progress value={downloadProgress} className="h-2" />
                </div>
              ) : (
                <ArrowRight className="ml-auto h-5 w-5" />
              )} */}
                <ArrowRight className="ml-auto h-5 w-5" />
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t">
          <Button variant="ghost" className="w-full gap-2" onClick={onReset}>
            <RefreshCw className="h-4 w-4" />
            Start a New Form
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
