"use client";

import type { RowSelectionState, SortingState } from "@tanstack/react-table";
import { useState, useMemo, useCallback, useRef } from "react";
import { InlineEditor } from "./cell/inline-editor";
import { StageSelector } from "./cell/stage-selector";
import { OwnerSelector } from "./cell/owner-selector";
import { ContactList } from "./cell/contactlist";
import { ColumnManager } from "./column-manager";
import { KeyboardNavigation } from "./keyboard-navigations";
import { AccessibilityAnnouncer } from "./accessiblilty-announcer";
import { TableToolbar } from "./table-toolbar";
import { ResizableHeader } from "./resizeable-header";
import { RowContextMenu } from "./row-context-menu";
import { StatusChip } from "./status-chip";
import { TotalsBar } from "./total-bar";
import { ExpandableRow } from "./expandable-row";

// Mock data type
type Deal = {
  id: string;
  deal: string;
  activitiesTimeline: string;
  stage: string;
  dealValue: number;
  contacts: string;
  owner: string;
  accounts: string;
  expectedClose: string;
  forecastValue: number;
};

// Template type
type Template = {
  id: string;
  label: string;
  description: string;
};

// Column configuration type
interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  locked?: boolean;
  width?: number;
}

// Fixed column widths - define once and use everywhere
const DEFAULT_COLUMN_WIDTHS = {
  select: 36,
  expand: 36,
  deal: 150,
  activitiesTimeline: 200,
  stage: 150,
  lastInteraction: 150,
  quotesInvoices: 220,
  template: 180,
  templates: 60,
} as const;

// Mock data
const mockData: Deal[] = [
  {
    id: "1",
    deal: "Enterprise Software License",
    activitiesTimeline: "",
    stage: "Proposal",
    dealValue: 125000,
    contacts: "John Smith, Mary Johnson",
    owner: "Alex Chen",
    accounts: "TechCorp Inc. - Enterprise",
    expectedClose: "2024-03-15",
    forecastValue: 112500,
  },
  {
    id: "2",
    deal: "Cloud Migration Project",
    activitiesTimeline: "",
    stage: "Negotiation",
    dealValue: 85000,
    contacts: "Sarah Johnson, Mike Davis, Lisa Wong",
    owner: "Sam Wilson",
    accounts: "DataFlow Systems - Mid-Market",
    expectedClose: "2024-02-28",
    forecastValue: 76500,
  },
  {
    id: "3",
    deal: "Marketing Automation Setup",
    activitiesTimeline: "",
    stage: "Proposal",
    dealValue: 45000,
    contacts: "Mike Davis, Jennifer Lee",
    owner: "Emma Brown",
    accounts: "GrowthCo - Small Business",
    expectedClose: "2024-02-15",
    forecastValue: 40500,
  },
  {
    id: "4",
    deal: "Security Audit & Compliance",
    activitiesTimeline: "",
    stage: "Closed Won",
    dealValue: 95000,
    contacts: "Lisa Chen, Robert Kim, David Park",
    owner: "James Liu",
    accounts: "SecureBank - Financial Services",
    expectedClose: "2024-01-30",
    forecastValue: 95000,
  },
  {
    id: "5",
    deal: "Custom Dashboard Development",
    activitiesTimeline: "",
    stage: "Discovery",
    dealValue: 65000,
    contacts: "Tom Wilson, Anna Martinez",
    owner: "Chris Taylor",
    accounts: "Analytics Pro - Technology",
    expectedClose: "2024-03-30",
    forecastValue: 58500,
  },
];

// Available templates
const availableTemplates: Template[] = [
  {
    id: "activitiesTimeline",
    label: "Activities Timeline",
    description: "Timeline of activities and interactions for this deal",
  },
  {
    id: "stage",
    label: "Stage",
    description: "Current stage of the deal in the sales pipeline",
  },
  {
    id: "dealValue",
    label: "Deal Value",
    description: "Total monetary value of the deal",
  },
  {
    id: "contacts",
    label: "Contacts",
    description: "Key contacts involved in this deal",
  },
  {
    id: "owner",
    label: "Owner",
    description: "Sales representative responsible for this deal",
  },
  {
    id: "accounts",
    label: "Accounts",
    description: "Account information and classification",
  },
  {
    id: "expectedClose",
    label: "Expected Close",
    description: "Anticipated closing date for this deal",
  },
  {
    id: "forecastValue",
    label: "Forecast Value",
    description: "Projected value based on probability and stage",
  },
];

interface FilterState {
  search: string;
  stage: string[];
  owner: string[];
  dealValueRange: [number, number];
}

interface SortState {
  column: keyof Omit<Deal, 'id'>;
  direction: "asc" | "desc";
}

interface UIState {
  rowSelection: Record<string, boolean>;
  columnConfig: ColumnConfig[];
  headerValues: Record<string, string>;
  selectedTemplates: string[];
  expandedRows: string[];
  filters: FilterState;
  sorts: SortState[];
  columnWidths: Record<string, number>;
}

export function DealsTable() {
  // Initialize state
  const [tableData, setTableData] = useState<Deal[]>(mockData);
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [announcementMessage, setAnnouncementMessage] = useState("");
  
  // Initialize UI state with localStorage persistence
  const [uiState, setUiState] = useState<UIState>(() => {
    // Try to load from localStorage
    if (typeof window !== 'undefined') {
      try {
        const savedState = localStorage.getItem('dealsTableUIState');
        if (savedState) {
          return JSON.parse(savedState);
        }
      } catch (error) {
        console.error("Failed to parse saved UI state:", error);
      }
    }
    
    // Default initial state
    return {
    const initialState: UIState = {
      rowSelection: {},
      columnConfig: [
        {
          id: "select",
          label: "Select",
          visible: true,
          locked: true,
          width: DEFAULT_COLUMN_WIDTHS.select,
        },
        {
          id: "expand",
          label: "Expand",
          visible: true,
          locked: true,
          width: DEFAULT_COLUMN_WIDTHS.expand,
        },
    {
      id: "deal",
      label: "Deal",
      visible: true,
      locked: true,
      width: DEFAULT_COLUMN_WIDTHS.deal,
    },
    {
      id: "stage",
      label: "Stage",
      visible: true,
      width: DEFAULT_COLUMN_WIDTHS.stage,
    },
    {
      id: "dealValue",
      label: "Deal Value",
      visible: true,
      width: DEFAULT_COLUMN_WIDTHS.template,
    },
    {
      id: "owner",
      label: "Owner",
      visible: true,
      width: DEFAULT_COLUMN_WIDTHS.template,
    },
    {
      id: "expectedClose",
      label: "Expected Close",
      visible: true,
      width: DEFAULT_COLUMN_WIDTHS.template,
    },
    {
      id: "activitiesTimeline",
      label: "Activities Timeline",
      visible: false,
      width: DEFAULT_COLUMN_WIDTHS.activitiesTimeline,
    },
    {
      id: "lastInteraction",
      label: "Last Interaction",
      visible: false,
      width: DEFAULT_COLUMN_WIDTHS.lastInteraction,
    },
    {
      id: "quotesInvoices",
      label: "Quotes & Invoices",
      visible: false,
      width: DEFAULT_COLUMN_WIDTHS.quotesInvoices,
    },
    {
      id: "contacts",
      label: "Contacts",
      visible: false,
      width: DEFAULT_COLUMN_WIDTHS.template,
    },
    {
      id: "accounts",
      label: "Accounts",
      visible: false,
      width: DEFAULT_COLUMN_WIDTHS.template,
    },
    {
      id: "forecastValue",
      label: "Forecast Value",
      visible: false,
      width: DEFAULT_COLUMN_WIDTHS.template,
    },
  ]);

  // Extract state for easier access
  // Save UI state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('dealsTableUIState', JSON.stringify(uiState));
    } catch (error) {
      console.error("Failed to save UI state:", error);
    }
  }, [uiState]);

  // Extract state with defaults
  const {
    rowSelection = {},
    columnConfig = [],
    headerValues = {},
    selectedTemplates = [],
    expandedRows = [],
    filters = {
      search: "",
      stage: [],
      owner: [],
      dealValueRange: [0, 200000] as [number, number]
    },
    sorts = [],
    columnWidths = {}
  } = uiState;
      return {
        rowSelection: {},
        columnConfig: [],
        headerValues: {},
        selectedTemplates: [],
        expandedRows: [],
        filters: {
          search: "",
          stage: [],
          owner: [],
          dealValueRange: [0, 200000],
        },
        sorts: [],
        columnWidths: {},
      };
    }

    try {
      const saved = localStorage.getItem("deals-table-ui-state");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Failed to parse saved UI state:", error);
    }

    return {
      rowSelection: {},
      columnConfig: [],
      headerValues: {},
      selectedTemplates: [],
      expandedRows: [],
      filters: {
        search: "",
        stage: [],
        owner: [],
        dealValueRange: [0, 200000],
      },
      sorts: [],
      columnWidths: {},
    };
  });

  const saveUIState = useCallback((updater: (prevState: UIState) => UIState) => {
    setUiState(prevState => {
      const newState = updater(prevState);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("deals-table-ui-state", JSON.stringify(newState));
        } catch (error) {
          console.error("Failed to save UI state:", error);
        }
      }
      return newState;
    });
  }, []);

  const handleColumnResize = useCallback((columnId: string, width: number) => {
    setUiState((prevState: UIState) => ({
      ...prevState,
      columnWidths: {
        ...(prevState.columnWidths || {}),
        [columnId]: width
      },
    }));
  }, []);

  const filteredData = useMemo(() => {
    return tableData.filter((deal) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const searchableFields = [
          deal.deal,
          deal.owner,
          deal.accounts,
          deal.contacts,
        ];
        if (
          !searchableFields.some((field) =>
            field.toLowerCase().includes(searchLower)
          )
        ) {
          return false;
        }
      }

      // Stage filter
      if (filters.stage.length > 0 && !filters.stage.includes(deal.stage)) {
        return false;
      }

      // Owner filter
      if (filters.owner.length > 0 && !filters.owner.includes(deal.owner)) {
        return false;
      }

      // Deal value range filter
      if (
        deal.dealValue < filters.dealValueRange[0] ||
        deal.dealValue > filters.dealValueRange[1]
      ) {
        return false;
      }

      return true;
    });
  }, [tableData, filters]);

  const sortedData = useMemo(() => {
    if (sorts.length === 0) return filteredData;

    return [...filteredData].sort((a, b) => {
      for (const sort of sorts) {
        let aVal = a[sort.column as keyof Deal];
        let bVal = b[sort.column as keyof Deal];

        // Handle different data types
        if (typeof aVal === "string" && typeof bVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (aVal < bVal) return sort.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sort.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sorts]);

  const handleSort = useCallback((columnId: string) => {
    const column = columnId as keyof Omit<Deal, 'id'>;
    
    setUiState((prev: UIState) => {
      const currentSorts = prev.sorts || [];
      const existingSort = currentSorts.find((s: SortState) => s.column === column);
      let newSorts: SortState[];

      if (existingSort) {
        if (existingSort.direction === "asc") {
          newSorts = currentSorts.map(s =>
            s.column === column ? { ...s, direction: "desc" } : s
          );
        } else {
          newSorts = currentSorts.filter(s => s.column !== column);
        }
      } else {
        newSorts = [...currentSorts, { column, direction: "asc" as const }];
      }

      return {
        ...prev,
        sorts: newSorts,
      };
    });
  }, []);

  const toggleRowExpansion = useCallback(
    (rowId: string) => {
      setUiState((prev: UIState) => {
        const currentExpanded = prev.expandedRows || [];
        const newExpanded = new Set(currentExpanded);
        
        if (newExpanded.has(rowId)) {
          newExpanded.delete(rowId);
        } else {
          newExpanded.add(rowId);
        }
        
        return {
          ...prev,
          expandedRows: Array.from(newExpanded)
        };
      });
    },
    []
  );

  // Commented out unused selectedDeals for now
  // const selectedDeals = useMemo(() => {
  //   const selectedIds = Object.keys(rowSelection).filter(
  //     (id) => rowSelection[id]
  //   );

  const handleBulkAction = useCallback((action: 'delete' | 'archive' | 'changeStage' | 'changeOwner' | 'email', value?: string) => {
    const selectedRowIds = Object.keys(rowSelection || {});

    switch (action) {
      case "delete":
        setTableData((prev: Deal[]) => prev.filter(deal => !selectedRowIds.includes(deal.id)));
        setUiState((prev: UIState) => ({
          ...prev,
          rowSelection: {}
        }));
        setAnnouncementMessage(
          `Deleted ${selectedRowIds.length} deal${selectedRowIds.length !== 1 ? 's' : ''}`
        );
        break;
      case "archive":
        setAnnouncementMessage(
          `Archived ${selectedRowIds.length} deal${selectedRowIds.length !== 1 ? 's' : ''}`
        );
        console.log("Archiving deals:", selectedRowIds);
        break;
      case "changeStage":
        if (value) {
          const stageMap: Record<string, string> = {
            discovery: "Discovery",
            proposal: "Proposal",
            negotiation: "Negotiation",
            "closed-won": "Closed Won",
            "closed-lost": "Closed Lost",
          };
          setTableData((prev: Deal[]) => 
            prev.map(deal => 
              selectedRowIds.includes(deal.id)
                ? { ...deal, stage: stageMap[value] || value }
                : deal
            )
          );
          setAnnouncementMessage(
            `Changed ${selectedRowIds.length} deal${selectedRowIds.length !== 1 ? 's' : ''} to ${stageMap[value] || value}`
          );
        }
        break;
      case "changeOwner":
        if (value) {
          const ownerMap: Record<string, string> = {
            "alex-chen": "Alex Chen",
            "sam-wilson": "Sam Wilson",
            "emma-brown": "Emma Brown",
            "james-liu": "James Liu",
            "chris-taylor": "Chris Taylor",
          };
          setTableData((prev: Deal[]) => 
            prev.map(deal => 
              selectedRowIds.includes(deal.id)
                ? { ...deal, owner: ownerMap[value] || value }
                : deal
            )
          );
          setAnnouncementMessage(
            `Assigned ${selectedRowIds.length} deal${selectedRowIds.length !== 1 ? 's' : ''} to ${ownerMap[value] || value}`
          );
        }
        break;
      case "email":
        setAnnouncementMessage(
          `Preparing email for ${selectedRowIds.length} deal${selectedRowIds.length !== 1 ? 's' : ''}`
        );
        console.log("Sending email to deals:", selectedRowIds);
        break;
    }
  }, [rowSelection]);

      let newRow = focusedCell.row;
      let newCol = focusedCell.col;

      switch (direction) {
        case "up":
          newRow = Math.max(0, focusedCell.row - 1);
          break;
        case "down":
          newRow = Math.min(maxRow, focusedCell.row + 1);
          break;
        case "left":
          newCol = Math.max(0, focusedCell.col - 1);
          break;
        case "right":
          newCol = Math.min(maxCol, focusedCell.col + 1);
          break;
      }

      setFocusedCell({ row: newRow, col: newCol });
    },
    [focusedCell, sortedData.length]
  );

  const handleEnterEdit = useCallback(() => {
    if (focusedCell) {
      // Trigger edit mode for the focused cell
      setIsNavigating(false);
    }
  }, [focusedCell]);

  const handleEscapeEdit = useCallback(() => {
    setIsNavigating(true);
    setFocusedCell(null);
  }, []);

  const handleSelectRow = useCallback((rowId: string) => {
    setUiState((prev: UIState) => ({
      ...prev,
      rowSelection: {
        ...(prev.rowSelection || {}),
        [rowId]: !prev.rowSelection?.[rowId],
      },
    }));
  }, []);

  const handleSelectAll = useCallback((rows: Deal[]) => {
    setUiState((prev: UIState) => {
      const currentSelection = prev.rowSelection || {};
      const allSelected = rows.every((row: Deal) => currentSelection[row.id]);
      
      return {
        ...prev,
        rowSelection: allSelected 
          ? {}
          : rows.reduce((acc: RowSelectionState, row: Deal) => ({
              ...acc,
              [row.id]: true,
            }), {} as RowSelectionState),
      };
    });
  }, []);

  type RowAction = 'edit' | 'duplicate' | 'changeOwner' | 'changeStage' | 'email' | 'call' | 'meeting' | 'archive' | 'delete';
  
  const handleRowAction = useCallback(
    (action: RowAction, dealId: string, value?: string) => {
      switch (action) {
        case "edit":
          setAnnouncementMessage("Editing deal");
          console.log("Edit deal:", dealId);
          break;
        case "duplicate":
          const originalDeal = tableData.find((deal) => deal.id === dealId);
          if (originalDeal) {
            const newDeal = {
              ...originalDeal,
              id: `${dealId}-copy-${Date.now()}`,
              deal: `${originalDeal.deal} (Copy)`,
            };
            setTableData((prev) => [...prev, newDeal]);
            setAnnouncementMessage("Deal duplicated successfully");
          }
          break;
        case "changeOwner":
          if (value) {
            setTableData((prev) =>
              prev.map((deal) =>
                deal.id === dealId ? { ...deal, owner: value } : deal
              )
            );
            setAnnouncementMessage(`Deal owner changed to ${value}`);
          }
          break;
        case "changeStage":
          if (value) {
            setTableData((prev) =>
              prev.map((deal) =>
                deal.id === dealId ? { ...deal, stage: value } : deal
              )
            );
            setAnnouncementMessage(`Deal stage changed to ${value}`);
          }
          break;
        case "email":
          setAnnouncementMessage("Preparing email for deal");
          console.log("Send email for deal:", dealId);
          break;
        case "call":
          setAnnouncementMessage("Scheduling call for deal");
          console.log("Schedule call for deal:", dealId);
          break;
        case "meeting":
          setAnnouncementMessage("Scheduling meeting for deal");
          console.log("Schedule meeting for deal:", dealId);
          break;
        case "archive":
          setAnnouncementMessage("Deal archived");
          console.log("Archive deal:", dealId);
          break;
        case "delete":
          setTableData((prev) => prev.filter((deal) => deal.id !== dealId));
          setAnnouncementMessage("Deal deleted");
          break;
      }
    },
    [tableData]
  );

  type ColumnAction = 'sort' | 'filter' | 'hide' | 'pin' | 'move' | 'resize';
  
  const handleColumnAction = useCallback(
    (action: ColumnAction, columnId: keyof Omit<Deal, 'id'>, value?: string) => {
      switch (action) {
        case "sort":
          if (value === "asc" || value === "desc") {
            setSorts([{ column: columnId, direction: value }]);
            setAnnouncementMessage(
              `Sorted by ${columnId} ${
                value === "asc" ? "ascending" : "descending"
              }`
            );
          }
          break;
        case "filter":
          setAnnouncementMessage(`Filtering by ${columnId}`);
          console.log("Filter by column:", columnId);
          break;
        case "hide":
          setColumnConfig((prev) =>
            prev.map((col) =>
              col.id === columnId ? { ...col, visible: false } : col
            )
          );
          setAnnouncementMessage(`Hidden ${columnId} column`);
          break;
        case "pin":
          setAnnouncementMessage(`${columnId} column pinned`);
          console.log("Pin/unpin column:", columnId);
          break;
        case "move":
          setAnnouncementMessage(`Moved ${columnId} column ${value}`);
          console.log("Move column:", columnId, value);
          break;
        case "resize":
          if (value === "auto" || value === "fit") {
            setAnnouncementMessage(`Auto-resized ${columnId} column`);
            console.log("Auto-resize column:", columnId);
          }
          break;
      }
    },
    []
  );

  const totals = useMemo(() => {
    const visible = sortedData.length;
    const total = tableData.length;
    const selected = Object.keys(rowSelection).filter(
      (id) => rowSelection[id]
    ).length;

    const dealValueSum = sortedData.reduce(
      (sum, deal) => sum + deal.dealValue,
      0
    );
    const forecastValueSum = sortedData.reduce(
      (sum, deal) => sum + deal.forecastValue,
      0
    );

    const stageBreakdown = sortedData.reduce((acc, deal) => {
      acc[deal.stage] = (acc[deal.stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const ownerBreakdown = sortedData.reduce((acc, deal) => {
      acc[deal.owner] = (acc[deal.owner] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      visible,
      total,
      selected,
      dealValueSum,
      forecastValueSum,
      stageBreakdown,
      ownerBreakdown,
      averageDealValue: visible > 0 ? dealValueSum / visible : 0,
      conversionRate: stageBreakdown["Closed Won"]
        ? (stageBreakdown["Closed Won"] / visible) * 100
        : 0,
    };
  }, [sortedData, tableData.length, rowSelection]);

  const availableTemplatesRef = useRef(availableTemplates);
  availableTemplatesRef.current = availableTemplates;

  const getDynamicColumns = useCallback(() => {
    return selectedTemplates
      .map((templateId) => {
        const template = availableTemplatesRef.current.find(t => t.id === templateId);
        const columnConfigItem = columnConfig.find(col => col.id === templateId);

        if (!template || (columnConfigItem && !columnConfigItem.visible)) {
          return null;
        }

        return {
          id: templateId,
          label: headerValues[templateId] || template.label,
          width: columnWidths[templateId] || DEFAULT_COLUMN_WIDTHS.template,
        };
      })
      .filter((col): col is { id: string; label: string; width: number } => col !== null);
  }, [selectedTemplates, columnConfig, headerValues, columnWidths]);

  const visibleColumns = columnConfig.filter((col) => col.visible);
  const dynamicColumns = getDynamicColumns();

  return (
    <div className="space-y-4">
      <AccessibilityAnnouncer message={announcementMessage} />

      <KeyboardNavigation
        onNavigate={handleKeyboardNavigation}
        onEnterEdit={handleEnterEdit}
        onEscapeEdit={handleEscapeEdit}
        onSelectRow={handleSelectRow}
        onSelectAll={handleSelectAll}
        isNavigating={isNavigating}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Deals</h1>
        <ColumnManager
          columns={columnConfig}
          onColumnToggle={(columnId, visible) => {
            setColumnConfig((prev) =>
              prev.map((col) =>
                col.id === columnId ? { ...col, visible } : col
              )
            );
            saveUIState({
              ...uiState,
              columnConfig: columnConfig.map((col) =>
                col.id === columnId ? { ...col, visible } : col
              ),
            });
          }}
          onColumnReorder={(fromIndex, toIndex) => {
            setColumnConfig((prev) => {
              const newConfig = [...prev];
              const [moved] = newConfig.splice(fromIndex, 1);
              newConfig.splice(toIndex, 0, moved);
              saveUIState({ ...uiState, columnConfig: newConfig });
              return newConfig;
            });
          }}
        />
      </div>

      <TableToolbar
        filters={filters}
        onFiltersChange={(newFilters) => {
          saveUIState(prev => ({
            ...prev,
            filters: newFilters
          }));
        }}
        data={tableData}
        onClearFilters={() => {
          const newFilters = {
            search: "",
            stage: [],
            owner: [],
            dealValueRange: [0, 200000] as [number, number],
          };
          saveUIState(prev => ({
            ...prev,
            filters: newFilters
          }));
        }}
      />

      {Object.keys(rowSelection).some((id) => rowSelection[id]) && (
        <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md mb-2">
          <div className="text-sm text-muted-foreground">
            {Object.keys(rowSelection).filter(id => rowSelection[id]).length} selected
          </div>
          <div className="space-x-2">
            <button
              onClick={() => handleBulkAction("delete")}
              className="text-sm text-destructive hover:underline"
            >
              Delete
            </button>
            <button
              onClick={clearSelection}
              className="text-sm text-muted-foreground hover:underline"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: totalTableWidth }}>
            <thead>
              <tr className="border-b bg-muted/50">
                {visibleColumns.map((col) => (
                  <ResizableHeader
                    key={col.id}
                    column={col}
                    width={
                      columnWidths[col.id] ||
                      col.width ||
                      DEFAULT_COLUMN_WIDTHS.template
                    }
                    onResize={(width) => handleColumnResize(col.id, width)}
                    onSort={() => handleSort(col.id)}
                    sortState={sorts.find((s) => s.column === col.id)}
                    onAction={handleColumnAction}
                  />
                ))}
                {dynamicColumns.map((col: any) => (
                  <ResizableHeader
                    key={col.id}
                    column={{ id: col.id, label: col.label, visible: true }}
                    width={col.width}
                    onResize={(width) => handleColumnResize(col.id, width)}
                    onSort={() => handleSort(col.id)}
                    sortState={sorts.find((s) => s.column === col.id)}
                    onAction={handleColumnAction}
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((deal) => (
                <RowContextMenu
                  key={deal.id}
                  deal={deal}
                  onAction={handleRowAction}
                >
                  <tr className="border-b hover:bg-muted/50">
                    {visibleColumns.map((col) => (
                      <td
                        key={col.id}
                        className="px-2 py-2 text-sm"
                        style={{ width: columnWidths[col.id] || col.width }}
                      >
                        {col.id === "select" && (
                          <input
                            type="checkbox"
                            checked={!!rowSelection[deal.id]}
                            onChange={(e) => {
                              const newSelection = {
                                ...rowSelection,
                                [deal.id]: e.target.checked,
                              };
                              saveUIState(prev => ({
                                ...prev,
                                rowSelection: newSelection,
                              }));
                            }}
                          />
                        )}
                        {col.id === "expand" && (
                          <button
                            onClick={() => toggleRowExpansion(deal.id)}
                            className="p-1 hover:bg-muted rounded"
                          >
                            {expandedRows.has(deal.id) ? "−" : "+"}
                          </button>
                        )}
                        {col.id === "deal" && (
                          <InlineEditor
                            value={deal.deal}
                            onSave={(value) =>
                              updateCellValue(deal.id, "deal", value)
                            }
                          />
                        )}
                        {col.id === "stage" && (
                          <StageSelector
                            value={deal.stage}
                            onChange={(value) =>
                              updateCellValue(deal.id, "stage", value)
                            }
                          />
                        )}
                        {col.id === "dealValue" && (
                          <InlineEditor
                            value={`$${deal.dealValue.toLocaleString()}`}
                            onSave={(value) => {
                              const numValue = Number.parseInt(
                                value.replace(/[$,]/g, "")
                              );
                              updateCellValue(deal.id, "dealValue", numValue);
                            }}
                          />
                        )}
                        {col.id === "owner" && (
                          <OwnerSelector
                            value={deal.owner}
                            onChange={(value) =>
                              updateCellValue(deal.id, "owner", value)
                            }
                          />
                        )}
                        {col.id === "expectedClose" && (
                          <InlineEditor
                            value={deal.expectedClose}
                            onSave={(value) =>
                              updateCellValue(deal.id, "expectedClose", value)
                            }
                          />
                        )}
                        {col.id === "contacts" && (
                          <ContactList
                            contacts={deal.contacts.split(", ")}
                            onChange={(contacts) =>
                              updateCellValue(
                                deal.id,
                                "contacts",
                                contacts.join(", ")
                              )
                            }
                          />
                        )}
                      </td>
                    ))}
                    {dynamicColumns.map((col: any) => (
                      <td
                        key={col.id}
                        className="px-2 py-2 text-sm"
                        style={{ width: col.width }}
                      >
                        {col.id === "stage" ? (
                          <StatusChip
                            stage={deal[col.id as keyof Deal] as string}
                          />
                        ) : (
                          <InlineEditor
                            value={String(deal[col.id as keyof Deal] || "")}
                            onSave={(value) =>
                              updateCellValue(deal.id, col.id, value)
                            }
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                  {expandedRows.has(deal.id) && (
                    <tr>
                      <td
                        colSpan={visibleColumns.length + dynamicColumns.length}
                        className="p-0"
                      >
                        <ExpandableRow deal={deal} />
                      </td>
                    </tr>
                  )}
                </RowContextMenu>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TotalsBar totals={totals} />
    </div>
  );
}
