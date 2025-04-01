'use client'

import { Badge } from '@/components/ui/badge'
import { DynamicFormRenderer } from '@/components/dynamic-form-renderer'
import { motion } from 'framer-motion'
import type { StateData, FormTemplate } from '@/services/api'
import { Card, CardContent } from '@/components/ui/card'
import { useStatesStore } from '@/store/states'

interface TaxFormProps {
  state: StateData
  formSchema: FormTemplate
  isSubmitting: boolean
  onSubmit: (data: any) => void
}

export function TaxForm({ state, formSchema, isSubmitting, onSubmit }: TaxFormProps) {
  const { formData } = useStatesStore()
  
  if (!formSchema || !formSchema.fields) return null

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-inter">{`${state.state} Tax Form`}</h1>
          <p className="mt-2 text-gray-600">
            Complete the {state.state} state tax form with all required information.
          </p>
        </div>
        <Badge className="text-lg py-1 px-3 bg-blue-100 text-blue-800 hover:bg-blue-100">
          {state.abbreviation}
        </Badge>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DynamicFormRenderer
            fields={formSchema.fields}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            defaultValues={formData}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}
