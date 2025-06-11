
import { useState } from "react";
import { Bell, Search, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/hooks/useAppStore";

export const Header = () => {
  const { toast } = useToast();
  const { sales, payments, ledgerEntries } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);

  const searchResults = () => {
    if (!searchTerm.trim()) return { sales: [], payments: [], ledgerEntries: [] };

    const term = searchTerm.toLowerCase();
    
    const filteredSales = sales.filter(sale => 
      sale.customerName.toLowerCase().includes(term) ||
      sale.items.some(item => item.name.toLowerCase().includes(term)) ||
      sale.id.toLowerCase().includes(term)
    );

    const filteredPayments = payments.filter(payment =>
      payment.customerName.toLowerCase().includes(term) ||
      payment.id.toLowerCase().includes(term) ||
      payment.transactionId?.toLowerCase().includes(term)
    );

    const filteredLedgerEntries = ledgerEntries.filter(entry =>
      entry.description.toLowerCase().includes(term) ||
      entry.category.toLowerCase().includes(term) ||
      entry.id.toLowerCase().includes(term)
    );

    return {
      sales: filteredSales,
      payments: filteredPayments,
      ledgerEntries: filteredLedgerEntries
    };
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowResults(true);
      console.log("Search term:", searchTerm);
    }
  };

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "No new notifications",
    });
  };

  const handleUserClick = () => {
    toast({
      title: "User Profile",
      description: "User profile clicked",
    });
  };

  const results = searchResults();
  const totalResults = results.sales.length + results.payments.length + results.ledgerEntries.length;

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <form onSubmit={handleSearch} className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search products, customers, sales..." 
                className="pl-10 w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm && setShowResults(true)}
              />
            </form>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleNotificationClick}
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleUserClick}
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Search Results Overlay */}
      {showResults && searchTerm && (
        <div className="absolute top-16 left-6 right-6 z-50 bg-white shadow-lg border rounded-lg max-h-96 overflow-y-auto">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">Search Results ({totalResults} found)</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowResults(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-4 space-y-4">
            {totalResults === 0 ? (
              <p className="text-gray-500 text-center py-4">No results found for "{searchTerm}"</p>
            ) : (
              <>
                {/* Sales Results */}
                {results.sales.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-2">Sales ({results.sales.length})</h4>
                    <div className="space-y-2">
                      {results.sales.slice(0, 5).map((sale) => (
                        <div key={sale.id} className="p-2 hover:bg-gray-50 rounded border">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{sale.customerName}</p>
                              <p className="text-sm text-gray-500">ID: {sale.id} • ${sale.total}</p>
                            </div>
                            <Badge variant={sale.status === "Completed" ? "secondary" : "destructive"}>
                              {sale.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payments Results */}
                {results.payments.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-2">Payments ({results.payments.length})</h4>
                    <div className="space-y-2">
                      {results.payments.slice(0, 5).map((payment) => (
                        <div key={payment.id} className="p-2 hover:bg-gray-50 rounded border">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{payment.customerName}</p>
                              <p className="text-sm text-gray-500">ID: {payment.id} • ${payment.amount} • {payment.method}</p>
                            </div>
                            <Badge variant={payment.status === "Completed" ? "secondary" : "destructive"}>
                              {payment.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ledger Results */}
                {results.ledgerEntries.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-2">Ledger Entries ({results.ledgerEntries.length})</h4>
                    <div className="space-y-2">
                      {results.ledgerEntries.slice(0, 5).map((entry) => (
                        <div key={entry.id} className="p-2 hover:bg-gray-50 rounded border">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{entry.description}</p>
                              <p className="text-sm text-gray-500">{entry.category} • ${entry.amount}</p>
                            </div>
                            <Badge variant={entry.type === "Income" ? "secondary" : "destructive"}>
                              {entry.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
