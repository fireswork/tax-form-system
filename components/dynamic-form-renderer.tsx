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
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
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

  const getFieldLabel = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')
  }

  const generateZodSchema = (fields: FormFieldType[]) => {
    const schemaMap: Record<string, any> = {}

    fields.forEach((field) => {
      let fieldSchema: any
      const fieldLabel = getFieldLabel(field.name)

      if (field.type === 'number') {
        let baseSchema = z.number({
          required_error: `${fieldLabel} should be required`,
          invalid_type_error: `${fieldLabel} should be a number`
        })

        if (field.validationRules.minValue !== undefined) {
          baseSchema = baseSchema.min(field.validationRules.minValue, {
            message: `${fieldLabel} should be at least ${field.validationRules.minValue}`
          })
        }
        if (field.validationRules.maxValue !== undefined) {
          baseSchema = baseSchema.max(field.validationRules.maxValue, {
            message: `${fieldLabel} should be at most ${field.validationRules.maxValue}`
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
      } else if (field.type === 'string') {
        let baseSchema = z.string({
          required_error: `${fieldLabel} should be required`,
          invalid_type_error: `${fieldLabel} should be a string`
        })

        if (field.validationRules.minLength !== undefined) {
          baseSchema = baseSchema.min(field.validationRules.minLength, {
            message: `${fieldLabel} should be contain at least ${field.validationRules.minLength} character(s)`
          })
        }
        if (field.validationRules.maxLength !== undefined) {
          baseSchema = baseSchema.max(field.validationRules.maxLength, {
            message: `${fieldLabel} should be contain at most ${field.validationRules.maxLength} character(s)`
          })
        }
        
        // 特殊处理电话号码字段
        if (field.name.toLowerCase().includes('phone')) {
          // 对于电话号码，我们先验证格式化后的字符串，然后在提交前转换为纯数字
          // 移除正则表达式验证，因为我们已经有格式化函数
          if (field.validationRules.format) {
            // 忽略电话号码的格式验证，因为我们使用自己的格式化
            delete field.validationRules.format;
          }
        } else if (field.validationRules.format) {
          // 对于非电话号码字段，保留原有的正则验证
          baseSchema = baseSchema.regex(new RegExp(field.validationRules.format), {
            message: `${fieldLabel} should be valid`
          })
        }

        if (!field.required) {
          fieldSchema = baseSchema.optional()
        } else {
          fieldSchema = baseSchema
        }
      }

      schemaMap[field.name] = fieldSchema
    })

    return z.object(schemaMap)
  }

  const formSchema = generateZodSchema(fields)
  
  // 确保所有默认值都有定义，避免从未定义变为定义的转换
  const processedDefaultValues = { ...defaultValues }
  fields.forEach(field => {
    // 如果字段在默认值中不存在，设置一个初始值
    if (processedDefaultValues[field.name] === undefined) {
      if (field.type === 'number') {
        processedDefaultValues[field.name] = field.required ? 0 : ''
      } else {
        processedDefaultValues[field.name] = ''
      }
    }
    
    // 格式化电话号码字段
    if (field.type === 'string' && field.name.toLowerCase().includes('phone') && processedDefaultValues[field.name]) {
      processedDefaultValues[field.name] = formatPhoneNumber(processedDefaultValues[field.name])
    }
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: processedDefaultValues,
    mode: "onChange"
  })

  const getFieldDescription = (field: FormFieldType) => {
    const rules = field.validationRules
    const descriptions = []

    if (rules.minLength) descriptions.push(`Minimum ${rules.minLength} characters`)
    if (rules.maxLength) descriptions.push(`Maximum ${rules.maxLength} characters`)
    if (rules.minValue) descriptions.push(`Minimum value: ${rules.minValue}`)
    if (rules.maxValue) descriptions.push(`Maximum value: ${rules.maxValue}`)
    if (field.required) descriptions.push('Required')
    
    // 为电话号码添加格式提示
    if (field.name.toLowerCase().includes('phone')) {
      descriptions.push('Format: (xxx) xxx-xxxx')
    }

    return descriptions.join(' • ')
  }

  const handleSubmit = (data: any) => {
    // 在提交前确保电话号码是纯数字格式
    const processedData = { ...data }
    fields.forEach(field => {
      if (field.type === 'string' && field.name.toLowerCase().includes('phone') && processedData[field.name]) {
        processedData[field.name] = unformatPhoneNumber(processedData[field.name])
      }
    })
    
    onSubmit(processedData)
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
              <FormItem>
                <FormLabel>
                  {getFieldLabel(field.name)}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    type={field.type === 'number' ? 'number' : 'text'}
                    onChange={(e) => {
                      let value: any = e.target.value
                      
                      // 处理电话号码格式化
                      if (field.type === 'string' && field.name.toLowerCase().includes('phone')) {
                        // 保存光标位置
                        const input = e.target as HTMLInputElement
                        const selectionStart = input.selectionStart
                        const previousLength = value.length
                        
                        // 格式化电话号码
                        value = formatPhoneNumber(value)
                        
                        // 更新表单值
                        formField.onChange(value)
                        
                        // 在下一个事件循环中恢复光标位置
                        setTimeout(() => {
                          // 计算新的光标位置
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
