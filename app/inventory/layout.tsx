import { InventorySidebar } from '@/src/components/layout/InventorySidebar';
import { InventoryHeader } from '@/src/components/layout/InventoryHeader';

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1">
      <InventorySidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <InventoryHeader />

        {children}
      </div>
    </div>
  );
}
