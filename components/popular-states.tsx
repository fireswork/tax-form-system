'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronRight, CheckCircle } from 'lucide-react'
import { useStatesStore } from '@/store/states'

export function PopularStates() {
  const { popularStates, selectState } = useStatesStore()

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular States</h3>
        <div className="space-y-3">
          {popularStates.map((state) => (
            <Button
              key={state.state}
              variant="outline"
              className="w-full justify-start h-auto py-3"
              onClick={() => selectState(state)}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 font-semibold text-xs">
                  {state.abbreviation}
                </div>
                <span className="ml-3">{state.state}</span>
              </div>
              <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
            </Button>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Why is this important?
          </h3>
          <div className="space-y-4">
            {/* <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">
                  Each state has different tax requirements
                </p>
              </div>
            </div> */}
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">
                  State-specific deductions and credits
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">
                  Filing deadlines may vary by state
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 