import { FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useStatesStore } from "@/store/states"

export function FormSummary() {
  const { selectedState, formSchema, formData } = useStatesStore()
  
  if (!selectedState || !formSchema) return null
  
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none shadow-md overflow-hidden">
      <CardContent className="p-8">
        <div className="flex items-center mb-6">
          <FileText className="h-8 w-8 text-blue-600 mr-3" />
          <h2 className="text-2xl font-semibold text-gray-900">Form Summary</h2>
        </div>

        <div className="space-y-6">
          {formSchema.fields && formSchema.fields.map(field => (
            <div key={field.name}>
              <h3 className="text-sm font-medium text-gray-500 mb-1">{field.name.charAt(0).toUpperCase() + field.name.slice(1).replace(/([A-Z])/g, ' $1')}</h3>
              <p className="text-lg font-semibold text-gray-900">
                {formData[field.name] !== undefined ? formData[field.name].toString() : 'N/A'}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 