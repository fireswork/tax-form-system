"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { FormSummary } from "@/components/form-summary"
import { DownloadOptions } from "@/components/download-options"
import { useStatesStore } from "@/store/states"

interface SuccessScreenProps {
  stateName: string
  stateCode: string
  formTitle: string
  onReset: () => void
}

export function SuccessScreen({ stateName, stateCode, formTitle, onReset }: SuccessScreenProps) {
  const { downloadLinks } = useStatesStore()
  
  const confirmationId = `TX-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${stateCode}`

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6"
        >
          <CheckCircle className="h-12 w-12 text-green-600" />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Form Completed Successfully</h1>
        <p className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
          Your {formTitle || `${stateName} tax form`} has been processed and is ready for download
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <FormSummary />

        <DownloadOptions 
          downloadLinks={downloadLinks}
          onReset={onReset}
        />
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-1">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-blue-900">What's Next?</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p className="mb-2">Your tax form has been successfully processed. Here are the next steps:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Download and save your completed tax form</li>
                  <li>Review all information for accuracy</li>
                  <li>Submit to the appropriate state tax authority</li>
                  <li>Keep a copy for your records</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

