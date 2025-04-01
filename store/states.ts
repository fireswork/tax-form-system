import { create } from 'zustand'
import { taxPolicyAPI, type StateData, type FormTemplate } from '@/services/api'

interface StatesStore {
  states: StateData[]
  popularStates: StateData[]
  loading: boolean
  error: string | null
  initialized: boolean
  
  step: number
  progress: number
  selectedState: StateData | null
  formSchema: FormTemplate | null
  formData: any
  isSubmitting: boolean
  pdfUrl: string | null
  downloadLinks: Array<{id: number, title: string, url: string}>
  
  fetchStates: () => Promise<void>
  setStep: (step: number) => void
  goToNextStep: () => void
  goToPreviousStep: () => void
  selectState: (state: StateData) => Promise<void>
  submitForm: (data: any) => Promise<void>
  downloadPDF: () => void
  reset: () => void
  clearError: () => void
}

export const useStatesStore = create<StatesStore>((set, get) => ({
  states: [],
  popularStates: [],
  loading: false,
  error: null,
  initialized: false,
  
  step: 1,
  progress: 0,
  selectedState: null,
  formSchema: null,
  formData: {},
  isSubmitting: false,
  pdfUrl: null,
  downloadLinks: [],
  
  fetchStates: async () => {
    if (get().initialized && get().states.length > 0) {
      return
    }

    try {
      set({ loading: true, error: null })
      const data = await taxPolicyAPI.getBasicData()
      set({ 
        states: data,
        popularStates: data.slice(0, 5),
        initialized: true,
        error: null 
      })
    } catch (err) {
      set({ 
        error: 'Failed to fetch states. Please try again later.',
        states: [],
        popularStates: [],
        initialized: true
      })
      console.error('Error fetching states:', err)
    } finally {
      set({ loading: false })
    }
  },
  
  setStep: (step: number) => {
    set({ step })
    if (step === 1) set({ progress: 0 })
    else if (step === 2) set({ progress: 50 })
    else if (step === 3) set({ progress: 100 })
  },
  
  goToNextStep: () => {
    const { step } = get()
    if (step < 3) {
      get().setStep(step + 1)
    }
  },
  
  goToPreviousStep: () => {
    const { step } = get()
    if (step > 1) {
      get().setStep(step - 1)
    }
  },
  
  selectState: async (state: StateData) => {
    try {
      set({ loading: true, error: null })
      const template = await taxPolicyAPI.getFormTemplate(state.abbreviation)
      set({
        selectedState: state,
        formSchema: {
          ...template,
          title: `${state.state} Tax Form`,
          description: `Complete the ${state.state} state tax form with all required information.`
        }
      })
      get().setStep(2)
    } catch (err) {
      set({ error: 'Unable to load form template. Please try again later.' })
    } finally {
      set({ loading: false })
    }
  },
  
  submitForm: async (data: any) => {
    const state = get().selectedState
    if (!state) {
      set({ error: 'No state selected' })
      return
    }
    
    try {
      set({ isSubmitting: true, formData: data, error: null })
      const response = await taxPolicyAPI.generatePdf(state.abbreviation, data)
      set({ 
        downloadLinks: response.downloadLinks || [],
        isSubmitting: false
      })
      get().setStep(3)
    } catch (err) {
      set({ 
        error: 'Failed to generate PDF. Please try again.',
        isSubmitting: false
      })
    }
  },
  
  downloadPDF: () => {
    const pdfUrl = get().pdfUrl
    if (pdfUrl) {
      window.open(pdfUrl, '_blank')
    } else {
      set({ error: 'PDF not available for download' })
    }
  },
  
  reset: () => {
    set({
      selectedState: null,
      formSchema: null,
      formData: {},
      pdfUrl: null,
      step: 1,
      progress: 0
    })
  },
  
  clearError: () => {
    set({ error: null })
  }
})) 