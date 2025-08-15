"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type RowSelectionState,
  type Row,
  type HeaderGroup,
  type Header,
  type Table,
  type Cell,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Info } from "lucide-react";
import Templates from "./templates";

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

// Fixed column widths - define once and use everywhere
const COLUMN_WIDTHS = {
  select: 36,
  deal: 150,
  activitiesTimeline: 200,
  stage: 150,
  lastInteraction: 150,
  quotesInvoices: 220,
  template: 180, // Fixed width for all template columns
  templates: 60, // Templates dropdown column
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

export function DealsTable() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [editingHeader, setEditingHeader] = useState<string | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [headerValues, setHeaderValues] = useState<Record<string, string>>({
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

  const handleHeaderEdit = (key: string, value: string) => {
    setHeaderValues((prev) => ({ ...prev, [key]: value }));
    setEditingHeader(null);
  };

  const handleTemplateToggle = (templateId: string, isSelected: boolean) => {
    setSelectedTemplates((prev) => {
      if (isSelected) {
        return [...prev, templateId];
      } else {
        return prev.filter((id) => id !== templateId);
      }
    });
  };

  // Calculate total table width based on fixed column widths
  const totalTableWidth = useMemo(() => {
    const baseWidth =
      COLUMN_WIDTHS.select +
      COLUMN_WIDTHS.deal +
      COLUMN_WIDTHS.activitiesTimeline +
      COLUMN_WIDTHS.stage +
      COLUMN_WIDTHS.lastInteraction +
      COLUMN_WIDTHS.quotesInvoices +
      COLUMN_WIDTHS.templates;

    const templateColumnsWidth =
      selectedTemplates.length * COLUMN_WIDTHS.template;

    return baseWidth + templateColumnsWidth;
  }, [selectedTemplates.length]);

  // Create dynamic columns based on selected templates
  const getDynamicColumns = () => {
    const templateColumns = selectedTemplates.map((templateId) => {
      const template = availableTemplates.find(
        (t: Template) => t.id === templateId
      );
      return {
        id: templateId,
        accessorKey: templateId,
        header: () => (
          <EditableHeader
            columnKey={templateId}
            defaultValue={template?.label || templateId}
            tooltip={template?.description}
          />
        ),
        cell: ({ row }: { row: Row<Deal> }) => {
          const value = row.getValue(templateId) as string | number;
          if (templateId === "dealValue" || templateId === "forecastValue") {
            const amount = Number.parseFloat(String(value));
            const formatted = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(amount);
            return (
              <div className="truncate" title={formatted}>
                {formatted}
              </div>
            );
          }
          return (
            <div className="truncate" title={String(value)}>
              {String(value)}
            </div>
          );
        },
        size: COLUMN_WIDTHS.template,
        minSize: COLUMN_WIDTHS.template,
        maxSize: COLUMN_WIDTHS.template,
      };
    });

    return templateColumns;
  };

  const EditableHeader = ({
    columnKey,
    defaultValue,
    tooltip,
  }: {
    columnKey: string;
    defaultValue: string;
    tooltip?: string;
  }) => {
    const isEditing = editingHeader === columnKey;
    const currentValue = headerValues[columnKey] || defaultValue;

    if (isEditing) {
      return (
        <input
          type="text"
          defaultValue={currentValue}
          className="bg-transparent border-none outline-none text-center w-full px-1"
          autoFocus
          onBlur={(e) => handleHeaderEdit(columnKey, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleHeaderEdit(columnKey, e.currentTarget.value);
            }
            if (e.key === "Escape") {
              setEditingHeader(null);
            }
          }}
        />
      );
    }

    return (
      <div className="flex items-center justify-center gap-1 w-full min-w-0">
        <span
          className="truncate cursor-pointer hover:bg-muted/50 px-1 rounded flex-1 min-w-0"
          onClick={() => setEditingHeader(columnKey)}
          title={currentValue}
        >
          {currentValue}
        </span>
        {tooltip && (
          <Info className="h-3 w-3 text-muted-foreground cursor-help flex-shrink-0" />
        )}
      </div>
    );
  };

  const baseColumns: ColumnDef<Deal>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="w-full flex justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="w-full flex justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: COLUMN_WIDTHS.select,
      minSize: COLUMN_WIDTHS.select,
      maxSize: COLUMN_WIDTHS.select,
    },
    {
      accessorKey: "deal",
      header: "Deal",
      cell: ({ row }) => (
        <div className="truncate text-left px-1" title={row.getValue("deal")}>
          {row.getValue("deal")}
        </div>
      ),
      size: COLUMN_WIDTHS.deal,
      minSize: COLUMN_WIDTHS.deal,
      maxSize: COLUMN_WIDTHS.deal,
    },
    {
      accessorKey: "activitiesTimeline",
      header: () => (
        <EditableHeader
          columnKey="activitiesTimeline"
          defaultValue="Activities Timeline"
          tooltip="Timeline of activities and interactions"
        />
      ),
      cell: ({ row }) => (
        <div
          className="text-left truncate px-1"
          title={row.getValue("activitiesTimeline") || "No activities"}
        >
          {row.getValue("activitiesTimeline") || "-"}
        </div>
      ),
      size: COLUMN_WIDTHS.activitiesTimeline,
      minSize: COLUMN_WIDTHS.activitiesTimeline,
      maxSize: COLUMN_WIDTHS.activitiesTimeline,
    },
    {
      accessorKey: "stage",
      header: () => (
        <EditableHeader
          columnKey="stage"
          defaultValue=""
          tooltip=""
        />
      ),
      cell: () => (
        <div className="px-1">
          <div className="h-6"></div>
        </div>
      ),
      size: COLUMN_WIDTHS.stage,
      minSize: COLUMN_WIDTHS.stage,
      maxSize: COLUMN_WIDTHS.stage,
    },
    {
      accessorKey: "lastInteraction",
      header: () => (
        <EditableHeader
          columnKey="lastInteraction"
          defaultValue="Last Interaction"
          tooltip="Most recent interaction with the client"
        />
      ),
      cell: ({ row }) => (
        <div
          className="text-sm text-gray-600 truncate px-1"
          title={row.getValue("lastInteraction") || "No interactions"}
        >
          {row.getValue("lastInteraction") || "-"}
        </div>
      ),
      size: COLUMN_WIDTHS.lastInteraction,
      minSize: COLUMN_WIDTHS.lastInteraction,
      maxSize: COLUMN_WIDTHS.lastInteraction,
    },
    {
      accessorKey: "quotesInvoices",
      header: () => (
        <EditableHeader
          columnKey="quotesInvoices"
          defaultValue="Quotes & Invoices"
          tooltip="Quotes and invoices information"
        />
      ),
      cell: () => {
        return <div className="text-muted-foreground">-</div>;
      },
      size: COLUMN_WIDTHS.quotesInvoices,
      minSize: COLUMN_WIDTHS.quotesInvoices,
      maxSize: COLUMN_WIDTHS.quotesInvoices,
    },
  ];

  // Templates column (always at the end)
  const templatesColumn: ColumnDef<Deal> = {
    id: "templates",
    header: () => (
      <Templates
        selectedTemplates={selectedTemplates}
        onTemplateToggle={handleTemplateToggle}
      />
    ),
    cell: () => <div></div>,
    enableSorting: false,
    enableHiding: false,
    size: COLUMN_WIDTHS.templates,
    minSize: COLUMN_WIDTHS.templates,
    maxSize: COLUMN_WIDTHS.templates,
  };

  // Combine columns in the correct order
  const columns = useMemo(
    () => [...baseColumns, ...getDynamicColumns(), templatesColumn],
    [selectedTemplates, headerValues, editingHeader]
  );

  const table = useReactTable({
    data: mockData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table
            style={{
              tableLayout: "fixed",
              width: `${totalTableWidth}px`,
              minWidth: `${totalTableWidth}px`,
            }}
          >
            <thead>
              {table.getHeaderGroups().map((headerGroup: HeaderGroup<Deal>) => (
                <tr key={headerGroup.id} className="border-b">
                  {headerGroup.headers.map((header: Header<Deal, unknown>) => {
                    const isCheckbox = header.column.id === "select";
                    const isDeal = header.column.id === "deal";

                    let stickyClasses = "";
                    if (isCheckbox) {
                      stickyClasses =
                        "sticky left-0 z-20 !bg-background border-r";
                    } else if (isDeal) {
                      stickyClasses = `sticky left-[${COLUMN_WIDTHS.select}px] z-10 !bg-background border-r`;
                    }

                    return (
                      <th
                        key={header.id}
                        className={`h-9 px-2 text-center align-middle font-medium text-muted-foreground text-sm ${stickyClasses}`}
                        style={{
                          width: `${header.getSize()}px`,
                          minWidth: `${header.getSize()}px`,
                          maxWidth: `${header.getSize()}px`,
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row: Row<Deal>) => (
                  <tr
                    key={row.id}
                    className="border-b transition-colors bg-background hover:bg-muted/20 data-[state=selected]:bg-muted group"
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell: Cell<Deal, unknown>) => {
                      const isCheckbox = cell.column.id === "select";
                      const isDeal = cell.column.id === "deal";

                      let stickyClasses = "";
                      if (isCheckbox) {
                        stickyClasses =
                          "sticky left-0 z-20 !bg-background border-r group-hover:!bg-muted/20";
                      } else if (isDeal) {
                        stickyClasses = `sticky left-[${COLUMN_WIDTHS.select}px] z-10 !bg-background border-r group-hover:!bg-muted/20`;
                      }

                      return (
                        <td
                          key={cell.id}
                          className={`px-2 align-middle text-center text-sm ${stickyClasses}`}
                          style={{
                            height: "36px",
                            width: `${cell.column.getSize()}px`,
                            minWidth: `${cell.column.getSize()}px`,
                            maxWidth: `${cell.column.getSize()}px`,
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={table.getHeaderGroups()[0].headers.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex-1 text-sm text-muted-foreground mt-4">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
    </div>
  );
}
