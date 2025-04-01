import axios from '@/lib/axios'

export interface StateData {
  state: string
  abbreviation: string
}

export interface ValidationRules {
  maxLength?: number
  minLength?: number
  format?: string
  minValue?: number
  maxValue?: number
  errorMessage?: string
}

export interface FormField {
  name: string
  type: string
  required: boolean
  validationRules: ValidationRules[]
  displayName: string
  detail: string
}

export interface FormTemplate {
  fields: FormField[]
  title: string
  description: string
}

export const taxPolicyAPI = {
  getBasicData: async () => {
    try {
      const response: { states: StateData[] } = await axios.get('/api/taxPolicy/basicData')
      return response?.states || []
    } catch (error) {
      throw error
    }
  },

  getFormTemplate: async (abbreviation: string) => {
    try {
      const response: FormTemplate = await axios.get(`/api/taxPolicy/${abbreviation}/formFields`)
      return response
    } catch (error) {
      throw error
    }
  },

  generatePdf: async (stateAbbreviation: string, formData: any): Promise<any> => {
    try {
      const response = await axios.post(`/api/taxPolicy/generatePdf/${stateAbbreviation}`, formData)
      return response
    } catch (error) {
      throw error
    }
  }
}
