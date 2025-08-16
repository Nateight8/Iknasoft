"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Calendar, DollarSign, Users, Building } from "lucide-react"
import { RowContextMenu } from "./row-context-menu"

interface Deal {
  id: string
  deal: string
  activitiesTimeline: string
  stage: string
  dealValue: number
  contacts: string
  owner: string
  accounts: string
  expectedClose: string
  forecastValue: number
}

interface ExpandableRowProps {
  deal: Deal
  isExpanded: boolean
  onToggle: () => void
  onRowAction?: (action: string, dealId: string, value?: string) => void
  isSelected?: boolean
  onSelect?: () => void
}

const mockActivities = [
  { id: 1, type: "call", description: "Initial discovery call", date: "2024-01-15", duration: "45 min" },
  { id: 2, type: "email", description: "Sent proposal document", date: "2024-01-18", duration: null },
  { id: 3, type: "meeting", description: "Technical requirements review", date: "2024-01-22", duration: "90 min" },
  { id: 4, type: "call", description: "Follow-up on pricing", date: "2024-01-25", duration: "30 min" },
]

const mockSubDeals = [
  { id: "sub-1", name: "Phase 1: Setup", value: 45000, stage: "Negotiation" },
  { id: "sub-2", name: "Phase 2: Implementation", value: 55000, stage: "Proposal" },
  { id: "sub-3", name: "Phase 3: Training", value: 25000, stage: "Discovery" },
]

export function ExpandableRow({
  deal,
  isExpanded,
  onToggle,
  onRowAction,
  isSelected = false,
  onSelect,
}: ExpandableRowProps) {
  const [activeTab, setActiveTab] = useState<"activities" | "sub-deals" | "details">("activities")

  const handleRowAction = (action: string, dealId: string, value?: string) => {
    if (onRowAction) {
      onRowAction(action, dealId, value)
    }
  }

  return (
    <>
      <RowContextMenu deal={deal} onAction={handleRowAction}>
        <tr
          className={`border-b transition-colors bg-background hover:bg-muted/20 group cursor-pointer ${
            isSelected ? "bg-muted data-[state=selected]:bg-muted" : ""
          }`}
          onClick={onSelect}
          data-state={isSelected ? "selected" : undefined}
        >
          <td className="sticky left-0 z-20 !bg-background border-r group-hover:!bg-muted/20 px-2 align-middle text-center text-sm">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                onToggle()
              }}
            >
              {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
          </td>
          <td colSpan={999} className="px-2 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-medium">{deal.deal}</span>
                <Badge variant="secondary" className="text-xs">
                  {deal.stage}
                </Badge>
                <span className="text-sm text-muted-foreground">${deal.dealValue.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{deal.contacts.split(", ").length} contacts</span>
                <Calendar className="h-3 w-3 ml-2" />
                <span>{deal.expectedClose}</span>
              </div>
            </div>
          </td>
        </tr>
      </RowContextMenu>

      {isExpanded && (
        <tr className="bg-muted/30">
          <td colSpan={999} className="p-0">
            <div className="border-l-2 border-primary/20 ml-4">
              <div className="p-4">
                {/* Tab Navigation */}
                <div className="flex gap-1 mb-4 border-b">
                  <Button
                    variant={activeTab === "activities" ? "default" : "ghost"}
                    size="sm"
                    className="h-8 px-3 rounded-b-none"
                    onClick={() => setActiveTab("activities")}
                  >
                    Activities
                  </Button>
                  <Button
                    variant={activeTab === "sub-deals" ? "default" : "ghost"}
                    size="sm"
                    className="h-8 px-3 rounded-b-none"
                    onClick={() => setActiveTab("sub-deals")}
                  >
                    Sub-deals
                  </Button>
                  <Button
                    variant={activeTab === "details" ? "default" : "ghost"}
                    size="sm"
                    className="h-8 px-3 rounded-b-none"
                    onClick={() => setActiveTab("details")}
                  >
                    Details
                  </Button>
                </div>

                {/* Tab Content */}
                {activeTab === "activities" && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Recent Activities</h4>
                    <div className="space-y-2">
                      {mockActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-2 bg-background rounded border"
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                              {activity.type}
                            </Badge>
                            <span className="text-sm">{activity.description}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{activity.date}</span>
                            {activity.duration && <span>• {activity.duration}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "sub-deals" && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Sub-deals</h4>
                    <div className="space-y-2">
                      {mockSubDeals.map((subDeal) => (
                        <div
                          key={subDeal.id}
                          className="flex items-center justify-between p-2 bg-background rounded border"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">{subDeal.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {subDeal.stage}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm font-medium">${subDeal.value.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "details" && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Deal Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Account</span>
                        </div>
                        <p className="text-sm text-muted-foreground pl-6">{deal.accounts}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Contacts</span>
                        </div>
                        <p className="text-sm text-muted-foreground pl-6">{deal.contacts}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Forecast Value</span>
                        </div>
                        <p className="text-sm text-muted-foreground pl-6">${deal.forecastValue.toLocaleString()}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Expected Close</span>
                        </div>
                        <p className="text-sm text-muted-foreground pl-6">{deal.expectedClose}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
