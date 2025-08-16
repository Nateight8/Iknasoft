"use client";

import type { RowSelectionState } from "@tanstack/react-table";
import { useState, useMemo, useCallback, useEffect } from "react";
import { StatusChips } from "./status-chips";
import { TotalsBar } from "./totals-bar";
import { AccessibilityAnnouncer } from "./accessibility-announcer";
import { TableToolbar } from "./table-toolbar";
import { BulkActionsToolbar } from "./bulk-actions-toolbar";
import { ExpandableRow } from "./expandable-row";
import { RowContextMenu } from "./row-context-menu";
import { ResizableHeader } from "./resizable-header";
import { ColumnManager } from "./column-manager";
import { KeyboardNavigation } from "./keyboard-navigation";
import { StageSelector } from "./cell-editors/stage-selector";
import { OwnerSelector } from "./cell-editors/owner-selector";
import { InlineEditor } from "./cell-editors/inline-editor";
import { ContactList } from "./cell-editors/contact-list";

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
  column: string;
  direction: "asc" | "desc";
}

type UIState = {
  rowSelection: Record<string, boolean>;
  columnConfig: ColumnConfig[];
  headerValues: Record<string, string>;
  selectedTemplates: string[];
  expandedRows: string[];
  filters: FilterState;
  sorts: SortState[];
  columnWidths: Record<string, number>;
  tableData?: Deal[];
};

export function DealsTable() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  // Removed unused state: editingHeader, setEditingHeader
  const [selectedTemplates] = useState<string[]>([]);
  const [headerValues] = useState<Record<string, string>>({
    activitiesTimeline: "Activities Timeline",
    stage: "Stage",
    lastInteraction: "Last Interaction",
    quotesInvoices: "Quotes & Invoices",
    dealValue: "Deal Value",
    contacts: "Contacts",
    owner: "Owner",
    accounts: "Accounts",
    expectedClose: "Expected Close",
    forecastValue: "Forecast Value",
  });
  const [tableData, setTableData] = useState<Deal[]>(mockData);

  // First, define the default column configuration
  const defaultColumnConfig: ColumnConfig[] = [
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
  ];

  // Initialize UI state first
  const [uiState, setUiState] = useState<UIState>(() => {
    // Default empty state with all required properties
    const defaultState: UIState = {
      columnConfig: defaultColumnConfig, // Start with default columns
      rowSelection: {},
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

    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("deals-table-ui-state");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Ensure all required properties exist in the saved state
          return { ...defaultState, ...parsed };
        } catch {
          return defaultState;
        }
      }
    }
    return defaultState;
  });

  // Then initialize other states that depend on UI state
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(
    uiState.columnConfig || defaultColumnConfig
  );

  // Sync columnConfig with uiState when it changes
  useEffect(() => {
    if (uiState.columnConfig && uiState.columnConfig.length > 0) {
      setColumnConfig(uiState.columnConfig);
    }
  }, [uiState.columnConfig]);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    stage: [],
    owner: [],
    dealValueRange: [0, 200000],
  });

  const [sorts, setSorts] = useState<SortState[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    select: DEFAULT_COLUMN_WIDTHS.select,
    expand: DEFAULT_COLUMN_WIDTHS.expand,
    deal: DEFAULT_COLUMN_WIDTHS.deal,
    activitiesTimeline: DEFAULT_COLUMN_WIDTHS.activitiesTimeline,
    stage: DEFAULT_COLUMN_WIDTHS.stage,
    lastInteraction: DEFAULT_COLUMN_WIDTHS.lastInteraction,
    quotesInvoices: DEFAULT_COLUMN_WIDTHS.quotesInvoices,
    templates: DEFAULT_COLUMN_WIDTHS.templates,
    ...Object.fromEntries(
      availableTemplates.map((t) => [t.id, DEFAULT_COLUMN_WIDTHS.template])
    ),
  });

  const [focusedCell, setFocusedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const [isNavigating, setIsNavigating] = useState(false);
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const saveUIState = useCallback((newState: Partial<UIState>) => {
    setUiState((prev) => {
      const updatedState: UIState = {
        ...prev,
        ...newState,
        columnConfig: newState.columnConfig || prev.columnConfig || [],
        filters: newState.filters ||
          prev.filters || {
            search: "",
            stage: [],
            owner: [],
            dealValueRange: [0, 200000],
          },
        sorts: newState.sorts || prev.sorts || [],
        rowSelection: newState.rowSelection || prev.rowSelection || {},
        headerValues: newState.headerValues || prev.headerValues || {},
        selectedTemplates:
          newState.selectedTemplates || prev.selectedTemplates || [],
        expandedRows: newState.expandedRows || prev.expandedRows || [],
        columnWidths: newState.columnWidths || prev.columnWidths || {},
      };

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "deals-table-ui-state",
          JSON.stringify(updatedState)
        );
      }

      return updatedState;
    });
  }, []);

  const handleColumnResize = useCallback(
    (columnId: string, width: number) => {
      setColumnWidths((prev) => ({
        ...prev,
        [columnId]: width,
      }));

      saveUIState({
        columnWidths: {
          ...columnWidths,
          [columnId]: width,
        },
      });
    },
    [columnWidths, saveUIState]
  );

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

  const handleSort = useCallback(
    (column: string) => {
      setSorts((prevSorts) => {
        const existingSort = prevSorts.find((s) => s.column === column);
        let newSorts: SortState[] = [];

        if (existingSort) {
          if (existingSort.direction === "asc") {
            newSorts = prevSorts.map((s) =>
              s.column === column ? { ...s, direction: "desc" } : s
            );
          } else {
            newSorts = prevSorts.filter((s) => s.column !== column);
          }
        } else {
          newSorts = [...prevSorts, { column, direction: "asc" }];
        }

        saveUIState({ ...uiState, sorts: newSorts });
        return newSorts;
      });
    },
    [saveUIState, uiState]
  );

  const toggleRowExpansion = useCallback(
    (rowId: string) => {
      setExpandedRows((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(rowId)) {
          newSet.delete(rowId);
        } else {
          newSet.add(rowId);
        }
        saveUIState({ ...uiState, expandedRows: Array.from(newSet) });
        return newSet;
      });
    },
    [uiState, saveUIState]
  );

  const handleBulkAction = useCallback(
    (action: string, value?: string | number | boolean) => {
      const selectedRowIds = Object.keys(rowSelection).filter(
        (id) => rowSelection[id]
      );

      switch (action) {
        case "delete":
          setTableData((prev) =>
            prev.filter((deal) => !selectedRowIds.includes(deal.id))
          );
          setRowSelection({});
          setAnnouncementMessage(
            `Deleted ${selectedRowIds.length} deal${
              selectedRowIds.length !== 1 ? "s" : ""
            }`
          );
          break;
        case "archive":
          setAnnouncementMessage(
            `Archived ${selectedRowIds.length} deal${
              selectedRowIds.length !== 1 ? "s" : ""
            }`
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
            const stageValue =
              typeof value === "string"
                ? stageMap[value] || value
                : String(value);
            setTableData((prev) =>
              prev.map((deal) =>
                selectedRowIds.includes(deal.id)
                  ? { ...deal, stage: stageValue }
                  : deal
              )
            );
            setAnnouncementMessage(
              `Changed ${selectedRowIds.length} deal${
                selectedRowIds.length !== 1 ? "s" : ""
              } to ${stageValue}`
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
            const ownerValue =
              typeof value === "string"
                ? ownerMap[value] || value
                : String(value);
            setTableData((prev) =>
              prev.map((deal) =>
                selectedRowIds.includes(deal.id)
                  ? { ...deal, owner: ownerValue }
                  : deal
              )
            );
            setAnnouncementMessage(
              `Assigned ${selectedRowIds.length} deal${
                selectedRowIds.length !== 1 ? "s" : ""
              } to ${ownerValue}`
            );
          }
          break;
        case "email":
          setAnnouncementMessage(
            `Preparing email for ${selectedRowIds.length} deal${
              selectedRowIds.length !== 1 ? "s" : ""
            }`
          );
          console.log("Sending email to deals:", selectedRowIds);
          break;
      }
    },
    [rowSelection]
  );

  const clearSelection = useCallback(() => {
    setRowSelection({});
    saveUIState({ ...uiState, rowSelection: {} });
  }, [uiState, saveUIState]);

  const updateCellValue = (
    rowId: string,
    columnId: string,
    value: string | number
  ) => {
    setTableData((prev) => {
      const updatedData = prev.map((row) =>
        row.id === rowId ? { ...row, [columnId]: value } : row
      );
      saveUIState({ ...uiState, tableData: updatedData });
      return updatedData;
    });
  };

  // Removed unused function: handleHeaderEdit

  // Removed unused function: handleTemplateToggle

  const totalTableWidth = useMemo(() => {
    const visibleColumns = columnConfig.filter((col) => col.visible);
    const visibleTemplateColumns = selectedTemplates.filter(
      (templateId) =>
        columnConfig.find((col) => col.id === templateId)?.visible !== false
    );

    let width = columnWidths.templates || DEFAULT_COLUMN_WIDTHS.templates;

    visibleColumns.forEach((col) => {
      width +=
        columnWidths[col.id] || col.width || DEFAULT_COLUMN_WIDTHS.template;
    });

    visibleTemplateColumns.forEach((templateId) => {
      if (!visibleColumns.find((col) => col.id === templateId)) {
        width += columnWidths[templateId] || DEFAULT_COLUMN_WIDTHS.template;
      }
    });

    return width;
  }, [columnConfig, selectedTemplates, columnWidths]);

  const handleKeyboardNavigation = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (!focusedCell) {
        setFocusedCell({ row: 0, col: 0 });
        return;
      }

      const maxRow = sortedData.length - 1;
      const columns = [
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
      ];
      const maxCol = columns.length - 1;

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

  const handleSelectRow = useCallback(() => {
    if (focusedCell && sortedData[focusedCell.row]) {
      const rowId = sortedData[focusedCell.row].id;
      setRowSelection((prev) => ({
        ...prev,
        [rowId]: !prev[rowId],
      }));
      saveUIState({
        ...uiState,
        rowSelection: {
          ...uiState.rowSelection,
          [rowId]: !uiState.rowSelection[rowId],
        },
      });
    }
  }, [focusedCell, sortedData, uiState, saveUIState]);

  const handleSelectAll = useCallback(() => {
    const allSelected = sortedData.every((row) => rowSelection[row.id]);
    if (allSelected) {
      setRowSelection({});
      saveUIState({ ...uiState, rowSelection: {} });
    } else {
      const newSelection: RowSelectionState = {};
      sortedData.forEach((row) => {
        newSelection[row.id] = true;
      });
      setRowSelection(newSelection);
      saveUIState({ ...uiState, rowSelection: newSelection });
    }
  }, [sortedData, rowSelection, uiState, saveUIState]);

  const handleRowAction = useCallback(
    (action: string, dealId: string, value?: string | number | boolean) => {
      switch (action) {
        case "edit":
          setAnnouncementMessage("Editing deal");
          console.log("Edit deal:", dealId);
          break;
        case "duplicate": {
          const originalDeal = tableData.find((deal) => deal.id === dealId);
          if (originalDeal) {
            const newDeal: Deal = {
              ...originalDeal,
              id: `${dealId}-copy-${Date.now()}`,
              deal: `${originalDeal.deal} (Copy)`,
            };
            setTableData((prev) => [...prev, newDeal]);
            setAnnouncementMessage("Deal duplicated successfully");
          }
          break;
        }
        case "changeOwner":
          if (value) {
            const ownerMap: Record<string, string> = {
              "alex-chen": "Alex Chen",
              "sam-wilson": "Sam Wilson",
              "emma-brown": "Emma Brown",
              "james-liu": "James Liu",
              "chris-taylor": "Chris Taylor",
            };
            const ownerValue =
              typeof value === "string"
                ? ownerMap[value] || value
                : String(value);
            setTableData((prev) =>
              prev.map((deal) =>
                deal.id === dealId ? { ...deal, owner: ownerValue } : deal
              )
            );
            setAnnouncementMessage(`Deal owner changed to ${ownerValue}`);
          }
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
            const stageValue =
              typeof value === "string"
                ? stageMap[value] || value
                : String(value);
            setTableData((prev) =>
              prev.map((deal) =>
                deal.id === dealId ? { ...deal, stage: stageValue } : deal
              )
            );
            setAnnouncementMessage(`Deal stage changed to ${stageValue}`);
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

  const handleColumnAction = useCallback(
    (
      action: string,
      columnId: string,
      value?: string | number | boolean
    ): void => {
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

  const getDynamicColumns = useCallback((): Array<{
    id: string;
    label: string;
    width: number;
  }> => {
    return selectedTemplates
      .map((templateId: string) => {
        const template = availableTemplates.find((t) => t.id === templateId);
        const columnConfigItem = columnConfig.find(
          (col) => col.id === templateId
        );

        if (!template || (columnConfigItem && !columnConfigItem.visible)) {
          return null;
        }

        return {
          id: templateId,
          label:
            headerValues[templateId as keyof typeof headerValues] ||
            template.label,
          width: columnWidths[templateId] || DEFAULT_COLUMN_WIDTHS.template,
        };
      })
      .filter(
        (col): col is { id: string; label: string; width: number } =>
          col !== null
      );
  }, [selectedTemplates, columnConfig, headerValues, columnWidths]);

  const visibleColumns = useMemo(() => {
    // Always return the same columns, but control visibility with CSS
    return columnConfig.filter((col) => col.visible);
  }, [columnConfig]);
  const dynamicColumns = useMemo(
    () => getDynamicColumns(),
    [getDynamicColumns]
  );

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

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
          onColumnsChange={(newColumns) => {
            setColumnConfig(newColumns);
            saveUIState({
              columnConfig: newColumns,
            });
          }}
        />
      </div>

      <TableToolbar
        filters={filters}
        onFiltersChange={setFilters}
        sorts={sorts}
        onSortsChange={(newSorts) => {
          setSorts(newSorts);
          saveUIState({ ...uiState, sorts: newSorts });
        }}
      />

      {Object.keys(rowSelection).some((id) => rowSelection[id]) && (
        <BulkActionsToolbar
          selectedCount={
            Object.keys(rowSelection).filter((id) => rowSelection[id]).length
          }
          onBulkAction={(action, value) => {
            // Only pass string values to maintain type safety
            if (typeof value === "string" || value === undefined) {
              handleBulkAction(action, value);
            } else {
              handleBulkAction(action, String(value));
            }
          }}
          onClearSelection={clearSelection}
        />
      )}

      <div
        className="rounded-md border"
        style={{
          minHeight: "400px", // Adjust based on your needs
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="overflow-x-auto">
          <table
            className="w-full"
            style={{
              minWidth: totalTableWidth,
              visibility: isMounted ? "visible" : "hidden",
              tableLayout: "fixed"
            }}
          >
            <colgroup>
              {visibleColumns.map(col => (
                <col 
                  key={col.id}
                  style={{
                    width: columnWidths[col.id] || col.width || '150px',
                    minWidth: columnWidths[col.id] || col.width || '150px',
                    maxWidth: columnWidths[col.id] || col.width || '150px'
                  }}
                />
              ))}
              {dynamicColumns.map(col => (
                <col 
                  key={col.id}
                  style={{
                    width: col.width,
                    minWidth: col.width,
                    maxWidth: col.width
                  }}
                />
              ))}
            </colgroup>
            <thead>
              <tr className="border-b bg-muted/50">
                {visibleColumns.map((col) => (
                  <ResizableHeader
                    key={col.id}
                    columnId={col.id}
                    columnLabel={col.label}
                    width={
                      columnWidths[col.id] ||
                      col.width ||
                      DEFAULT_COLUMN_WIDTHS.template
                    }
                    onResize={(width) => handleColumnResize(col.id, width)}
                    onSort={() => handleSort(col.id)}
                    sortDirection={
                      sorts.find((s) => s.column === col.id)?.direction
                    }
                    onAction={handleColumnAction}
                  />
                ))}
                {dynamicColumns.map((col) => (
                  <ResizableHeader
                    key={col.id}
                    columnId={col.id}
                    columnLabel={col.label}
                    width={col.width}
                    onResize={(width) => handleColumnResize(col.id, width)}
                    onSort={() => handleSort(col.id)}
                    sortDirection={
                      sorts.find((s) => s.column === col.id)?.direction
                    }
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
                              setRowSelection((prev) => ({
                                ...prev,
                                [deal.id]: e.target.checked,
                              }));
                              saveUIState({
                                ...uiState,
                                rowSelection: {
                                  ...uiState.rowSelection,
                                  [deal.id]: e.target.checked,
                                },
                              });
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
                            onChange={(value) =>
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
                            onChange={(value) => {
                              const stringValue = String(value);
                              const numValue = Number.parseInt(
                                stringValue.replace(/[$,]/g, "")
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
                            onChange={(value) =>
                              updateCellValue(deal.id, "expectedClose", value)
                            }
                          />
                        )}
                        {col.id === "contacts" && (
                          <ContactList
                            value={deal.contacts}
                            onChange={(newContacts: string) =>
                              updateCellValue(deal.id, "contacts", newContacts)
                            }
                          />
                        )}
                      </td>
                    ))}
                    {dynamicColumns.map((col) => {
                      const value = deal[col.id as keyof Deal];
                      return (
                        <td
                          key={col.id}
                          className="px-2 py-2 text-sm"
                          style={{ width: col.width }}
                        >
                          {col.id === "stage" ? (
                            <StatusChips status={String(value)} />
                          ) : (
                            <InlineEditor
                              value={String(value || "")}
                              onChange={(newValue: string | number) =>
                                updateCellValue(
                                  deal.id,
                                  col.id,
                                  String(newValue)
                                )
                              }
                            />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  {expandedRows.has(deal.id) && (
                    <tr>
                      <td
                        colSpan={visibleColumns.length + dynamicColumns.length}
                        className="p-0"
                      >
                        <ExpandableRow
                          deal={deal}
                          isExpanded={expandedRows.has(deal.id)}
                          onToggle={() => toggleRowExpansion(deal.id)}
                        />
                      </td>
                    </tr>
                  )}
                </RowContextMenu>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TotalsBar
        data={tableData}
        selectedData={
          Object.keys(rowSelection).length > 0
            ? tableData.filter((deal) => rowSelection[deal.id])
            : undefined
        }
      />
    </div>
  );
}
