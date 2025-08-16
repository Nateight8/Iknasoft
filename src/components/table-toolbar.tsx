"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { X, Filter, Search, SortAsc, SortDesc } from "lucide-react"

interface FilterState {
  search: string
  stage: string[]
  owner: string[]
  dealValueRange: [number, number]
}

interface SortState {
  column: string
  direction: "asc" | "desc"
}

interface TableToolbarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  sorts: SortState[]
  onSortsChange: (sorts: SortState[]) => void
}

const STAGES = ["Discovery", "Proposal", "Negotiation", "Closed Won", "Closed Lost"]
const OWNERS = ["Alex Chen", "Sam Wilson", "Emma Brown", "James Liu", "Chris Taylor"]

export function TableToolbar({ filters, onFiltersChange, sorts, onSortsChange }: TableToolbarProps) {
  const [filterOpen, setFilterOpen] = useState(false)

  const safeFilters = {
    search: filters?.search || "",
    stage: filters?.stage || [],
    owner: filters?.owner || [],
    dealValueRange: filters?.dealValueRange || ([0, 200000] as [number, number]),
  }

  const safeSorts = sorts || []

  const updateFilter = (key: keyof FilterState, value: string | string[] | [number, number]) => {
    onFiltersChange({ ...safeFilters, [key]: value })
  }

  const addStageFilter = (stage: string) => {
    if (!safeFilters.stage.includes(stage)) {
      updateFilter("stage", [...safeFilters.stage, stage])
    }
  }

  const removeStageFilter = (stage: string) => {
    updateFilter(
      "stage",
      safeFilters.stage.filter((s) => s !== stage),
    )
  }

  const addOwnerFilter = (owner: string) => {
    if (!safeFilters.owner.includes(owner)) {
      updateFilter("owner", [...safeFilters.owner, owner])
    }
  }

  const removeOwnerFilter = (owner: string) => {
    updateFilter(
      "owner",
      safeFilters.owner.filter((o) => o !== owner),
    )
  }

  const addSort = (column: string) => {
    const existingSort = safeSorts.find((s) => s.column === column)
    if (existingSort) {
      // Toggle direction or remove if already desc
      if (existingSort.direction === "asc") {
        onSortsChange(safeSorts.map((s) => (s.column === column ? { ...s, direction: "desc" } : s)))
      } else {
        onSortsChange(safeSorts.filter((s) => s.column !== column))
      }
    } else {
      // Add new sort
      onSortsChange([...safeSorts, { column, direction: "asc" }])
    }
  }

  const clearAllFilters = () => {
    onFiltersChange({
      search: "",
      stage: [],
      owner: [],
      dealValueRange: [0, 200000],
    })
    onSortsChange([])
  }

  const hasActiveFilters =
    safeFilters.search ||
    safeFilters.stage.length > 0 ||
    safeFilters.owner.length > 0 ||
    safeFilters.dealValueRange[0] > 0 ||
    safeFilters.dealValueRange[1] < 200000 ||
    safeSorts.length > 0

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-2 flex-1">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search deals..."
            value={safeFilters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-8 w-64"
          />
        </div>

        {/* Filter Popover */}
        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  {safeFilters.stage.length +
                    safeFilters.owner.length +
                    (safeFilters.search ? 1 : 0) +
                    safeSorts.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Stage</label>
                <div className="space-y-2">
                  <Select onValueChange={addStageFilter}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Add stage filter..." />
                    </SelectTrigger>
                    <SelectContent>
                      {STAGES.filter((stage) => !safeFilters.stage.includes(stage)).map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-1">
                    {safeFilters.stage.map((stage) => (
                      <Badge key={stage} variant="secondary" className="text-xs">
                        {stage}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-3 w-3 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeStageFilter(stage)}
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Owner</label>
                <div className="space-y-2">
                  <Select onValueChange={addOwnerFilter}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Add owner filter..." />
                    </SelectTrigger>
                    <SelectContent>
                      {OWNERS.filter((owner) => !safeFilters.owner.includes(owner)).map((owner) => (
                        <SelectItem key={owner} value={owner}>
                          {owner}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-1">
                    {safeFilters.owner.map((owner) => (
                      <Badge key={owner} variant="secondary" className="text-xs">
                        {owner}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-3 w-3 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeOwnerFilter(owner)}
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Deal Value Range: ${safeFilters.dealValueRange[0].toLocaleString()} - $
                  {safeFilters.dealValueRange[1].toLocaleString()}
                </label>
                <Slider
                  value={safeFilters.dealValueRange}
                  onValueChange={(value) => updateFilter("dealValueRange", value as [number, number])}
                  max={200000}
                  min={0}
                  step={5000}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <div className="space-y-2">
                  <Select onValueChange={addSort}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Add sort column..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deal">Deal Name</SelectItem>
                      <SelectItem value="stage">Stage</SelectItem>
                      <SelectItem value="dealValue">Deal Value</SelectItem>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="expectedClose">Expected Close</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="space-y-1">
                    {safeSorts.map((sort, index) => (
                      <div
                        key={sort.column}
                        className="flex items-center justify-between bg-muted/50 rounded px-2 py-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">{index + 1}.</span>
                          <span className="text-xs">{sort.column}</span>
                          {sort.direction === "asc" ? (
                            <SortAsc className="h-3 w-3" />
                          ) : (
                            <SortDesc className="h-3 w-3" />
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => onSortsChange(safeSorts.filter((s) => s.column !== sort.column))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      <div className="flex items-center gap-2">
        {safeFilters.search && (
          <Badge variant="outline" className="text-xs">
            Search: &quot;{safeFilters.search}&quot;
            <Button variant="ghost" size="sm" className="h-3 w-3 p-0 ml-1" onClick={() => updateFilter("search", "")}>
              <X className="h-2 w-2" />
            </Button>
          </Badge>
        )}
        {safeSorts.map((sort) => (
          <Badge key={sort.column} variant="outline" className="text-xs">
            {sort.column} {sort.direction === "asc" ? "↑" : "↓"}
          </Badge>
        ))}
      </div>
    </div>
  )
}
