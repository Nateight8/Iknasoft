import { DealsTable } from "@/components/data-table";

export default function Home() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Deals Management</h1>
      <DealsTable />
    </div>
  );
}
