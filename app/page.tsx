'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, ArrowLeft, Shield, HelpCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { SuccessScreen } from '@/components/success-screen'
import { StateSelector } from '@/components/state-selector'
import { PopularStates } from '@/components/popular-states'
import { TaxForm } from '@/components/tax-form'
import { useStatesStore } from '@/store/states'

export default function TaxFormPage() {
  const { 
    step, 
    progress, 
    selectedState, 
    formSchema, 
    isSubmitting, 
    loading, 
    error,
    goToPreviousStep,
    submitForm,
    reset,
    clearError,
    fetchStates
  } = useStatesStore()
  
  useEffect(() => {
    fetchStates()
  }, [fetchStates])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading form template...</p>
        </div>
      </div>
    )
  }

  const renderError = () => {
    if (!error) return null
    return (
      <div className="fixed bottom-24 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
          <div className="ml-auto pl-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="text-red-400 hover:text-red-500"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Tax Exempt</span>
            </div>
            <div className="flex items-center space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <HelpCircle className="h-5 w-5 text-gray-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Need help?</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Shield className="h-3 w-3 mr-1" /> Secure
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-500">Progress</span>
            <span className="text-sm font-medium text-blue-600">{progress}%</span>
          </div>
          <div className="flex items-center space-x-2">
            {step > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500"
                onClick={goToPreviousStep}
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            )}
            <div className="flex items-center space-x-1">
              <Badge
                variant={step >= 1 ? 'default' : 'outline'}
                className={step >= 1 ? 'bg-blue-600' : ''}
              >
                1
              </Badge>
              <Badge
                variant={step >= 2 ? 'default' : 'outline'}
                className={step >= 2 ? 'bg-blue-600' : ''}
              >
                2
              </Badge>
              <Badge
                variant={step >= 3 ? 'default' : 'outline'}
                className={step >= 3 ? 'bg-blue-600' : ''}
              >
                3
              </Badge>
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-1 mb-8" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-[140px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl font-inter">Select Your State</h1>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <StateSelector />
                <div className="lg:col-span-1">
                  <PopularStates />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && selectedState && formSchema && (
            <TaxForm
              state={selectedState}
              formSchema={formSchema}
              isSubmitting={isSubmitting}
              onSubmit={submitForm}
            />
          )}

          {step === 3 && selectedState && formSchema && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SuccessScreen
                stateName={selectedState.state}
                stateCode={selectedState.abbreviation}
                formTitle={formSchema.title}
                onReset={reset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t py-8 fixed bottom-0 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <FileText className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-lg font-bold text-gray-900"></span>
              <span className="ml-2 text-sm text-gray-500">© 2025 All rights reserved</span>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <Button variant="link" size="sm" className="text-gray-500">
                Privacy Policy
              </Button>
              <Button variant="link" size="sm" className="text-gray-500">
                Terms of Service
              </Button>
              <Button variant="link" size="sm" className="text-gray-500">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </footer>
      {renderError()}
    </div>
  )
}
