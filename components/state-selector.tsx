'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Search } from 'lucide-react'
import { useStatesStore } from '@/store/states'
import type { StateData } from '@/services/api'

export function StateSelector() {
  const [searchQuery, setSearchQuery] = useState('')
  const { states, loading, error, fetchStates, selectState } = useStatesStore()
  const [filteredStates, setFilteredStates] = useState<StateData[]>([])

  useEffect(() => {
    fetchStates()
  }, [fetchStates])

  useEffect(() => {
    if (searchQuery) {
      const filtered = states.filter((data) =>
        data.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        data.state.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredStates(filtered)
    } else {
      setFilteredStates(states)
    }
  }, [searchQuery, states])

  if (loading) return <div>Loading states...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <Card className="overflow-hidden lg:col-span-2">
      <CardContent className="p-0">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">State Selection</h2>
          </div>
          {/* <p className="mt-2 text-gray-600">Tax laws vary by state. Select your state to get the correct form.</p> */}

          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search states..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="h-[400px] p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredStates.map((state) => (
              <Button
                key={state.state}
                variant="outline"
                className={`justify-start h-auto py-3 px-4`}
                onClick={() => selectState(state)}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 font-semibold text-xs">
                    {state.abbreviation}
                  </div>
                  <span className="ml-3 text-left">{state.state}</span>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
