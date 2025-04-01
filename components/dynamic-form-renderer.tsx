'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import type { FormField as FormFieldType } from '@/services/api'
import { useStatesStore } from '@/store/states'
import { formatPhoneNumber, unformatPhoneNumber } from '@/utils/format'

interface DynamicFormProps {
  fields: FormFieldType[]
  onSubmit: (data: any) => void
  isSubmitting: boolean
  defaultValues?: Record<string, any>
}

export function DynamicFormRenderer({ fields, onSubmit, isSubmitting, defaultValues = {} }: DynamicFormProps) {
  const { goToPreviousStep } = useStatesStore()

  const getFieldLabel = (field: FormFieldType) => {
    return field.displayName || field.name.charAt(0).toUpperCase() + field.name.slice(1).replace(/([A-Z])/g, ' $1')
  }

  const generateZodSchema = (fields: FormFieldType[]) => {
    const schemaMap: Record<string, any> = {}

    fields.forEach((field) => {
      let fieldSchema: any
      const fieldLabel = getFieldLabel(field)

      if (field.type === 'number') {
        let baseSchema = z.number({
          required_error: `${fieldLabel} is required`,
          invalid_type_error: `${fieldLabel} should be a number`
        })

        if (field.validationRules) {
          field.validationRules.forEach(rule => {
            if (rule.minValue !== undefined) {
              baseSchema = baseSchema.min(rule.minValue, {
                message: rule.errorMessage || `${fieldLabel} should be at least ${rule.minValue}`
              })
            }
            if (rule.maxValue !== undefined) {
              baseSchema = baseSchema.max(rule.maxValue, {
                message: rule.errorMessage || `${fieldLabel} should be at most ${rule.maxValue}`
              })
            }
          })
        }

        if (!field.required) {
          fieldSchema = z
            .union([
              z
                .string()
                .trim()
                .length(0)
                .transform(() => undefined),
              baseSchema
            ])
            .optional()
        } else {
          fieldSchema = baseSchema
        }
      } else if (field.type === 'string' || field.type === 'date') {
        let baseSchema = z.string({
          required_error: `${fieldLabel} is required`,
          invalid_type_error: `${fieldLabel} should be a string`
        })

        if (field.required) {
          baseSchema = baseSchema.min(1, {
            message: `${fieldLabel} should not be empty`
          })
        }

        if (field.validationRules) {
          field.validationRules.forEach(rule => {
            if (rule.minLength !== undefined) {
              baseSchema = baseSchema.min(rule.minLength, {
                message: rule.errorMessage || `${fieldLabel} should contain at least ${rule.minLength} character(s)`
              })
            }
            if (rule.maxLength !== undefined) {
              baseSchema = baseSchema.max(rule.maxLength, {
                message: rule.errorMessage || `${fieldLabel} should contain at most ${rule.maxLength} character(s)`
              })
            }
            
            if (field.name.toLowerCase().includes('phone')) {
              // Skip format validation for phone fields as we handle formatting separately
            } else if (rule.format) {
              baseSchema = baseSchema.regex(new RegExp(rule.format), {
                message: rule.errorMessage || `${fieldLabel} should be valid`
              })
            }
          })
        }

        if (!field.required) {
          fieldSchema = baseSchema.optional()
        } else {
          fieldSchema = baseSchema
        }
      } else if (field.type === 'checkbox') {
        if (field.required) {
          fieldSchema = z.boolean().refine(val => val === true, {
            message: `${fieldLabel} is required`
          })
        } else {
          fieldSchema = z.boolean().optional()
        }
      }

      schemaMap[field.name] = fieldSchema
    })

    return z.object(schemaMap)
  }

  const formSchema = generateZodSchema(fields)
  
  const processedDefaultValues = { ...defaultValues }
  fields.forEach(field => {
    if (processedDefaultValues[field.name] === undefined) {
      if (field.type === 'number') {
        processedDefaultValues[field.name] = field.required ? 0 : ''
      } else if (field.type === 'checkbox') {
        processedDefaultValues[field.name] = false
      } else {
        processedDefaultValues[field.name] = ''
      }
    }
    
    if (field.type === 'string' && field.name.toLowerCase().includes('phone') && processedDefaultValues[field.name]) {
      processedDefaultValues[field.name] = formatPhoneNumber(processedDefaultValues[field.name])
    }
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: processedDefaultValues,
    mode: "onChange"
  })

  const handleSubmit = (data: any) => {
    const processedData = { ...data }
    fields.forEach(field => {
      if (field.type === 'string' && field.name.toLowerCase().includes('phone') && processedData[field.name]) {
        processedData[field.name] = unformatPhoneNumber(processedData[field.name])
      }
    })
    
    onSubmit(processedData)
  }

  const renderFormControl = (field: FormFieldType, formField: any) => {
    if (field.type === 'checkbox') {
      return (
        <FormControl>
          <Checkbox
            checked={formField.value}
            onCheckedChange={formField.onChange}
          />
        </FormControl>
      )
    }
    
    if (field.type === 'date') {
      return (
        <FormControl>
          <Input
            {...formField}
            type="date"
            value={formField.value ?? ''}
          />
        </FormControl>
      )
    }
    
    return (
      <FormControl>
        <Input
          {...formField}
          type={field.type === 'number' ? 'number' : 'text'}
          onChange={(e) => {
            let value: any = e.target.value
            
            if (field.type === 'string' && field.name.toLowerCase().includes('phone')) {
              const input = e.target as HTMLInputElement
              const selectionStart = input.selectionStart
              const previousLength = value.length
              
              value = formatPhoneNumber(value)
              
              formField.onChange(value)
              
              setTimeout(() => {
                const lengthDifference = value.length - previousLength
                const newPosition = selectionStart ? selectionStart + lengthDifference : value.length
                
                input.setSelectionRange(newPosition, newPosition)
              }, 0)
              
              return
            } else if (field.type === 'number') {
              value = e.target.value === '' ? '' : Number(e.target.value)
            }
            
            formField.onChange(value)
          }}
          value={formField.value ?? ''}
        />
      </FormControl>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem className={field.type === 'checkbox' ? "flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4" : ""}>
                <div className={field.type === 'checkbox' ? "flex-1 space-y-1 leading-none" : ""}>
                  <FormLabel>
                    {getFieldLabel(field)}
                    {field.required && field.type !== 'checkbox' && <span className="text-red-500 ml-1">*</span>}
                  </FormLabel>
                  {field.detail && <FormDescription>{field.detail}</FormDescription>}
                </div>
                {renderFormControl(field, formField)}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <div className="flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              goToPreviousStep()
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
