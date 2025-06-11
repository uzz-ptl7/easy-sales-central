
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { InventoryManagement } from "@/components/inventory/InventoryManagement";
import { CustomerManagement } from "@/components/customers/CustomerManagement";
import { SalesManagement } from "@/components/sales/SalesManagement";
import { PaymentMethods } from "@/components/payments/PaymentMethods";
import { Ledger } from "@/components/ledger/Ledger";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "inventory":
        return <InventoryManagement />;
      case "customers":
        return <CustomerManagement />;
      case "sales":
        return <SalesManagement />;
      case "payments":
        return <PaymentMethods />;
      case "ledger":
        return <Ledger />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
