
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/hooks/useAppStore";

export const SalesManagement = () => {
  const { toast } = useToast();
  const { sales, addSale, updateSaleStatus } = useAppStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSale, setNewSale] = useState<{
    customerName: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    paymentMethod: "Cash" | "Card" | "Momo Pay" | undefined;
    transactionId?: string;
  }>({
    customerName: "",
    items: [{ name: "", quantity: 1, price: 0 }],
    paymentMethod: undefined,
    transactionId: ""
  });

  const filteredSales = sales.filter(sale =>
    sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSale = () => {
    // Validation
    if (!newSale.customerName || !newSale.customerName.trim()) {
      toast({
        title: "Error",
        description: "Customer name is required",
        variant: "destructive"
      });
      return;
    }

    if (!newSale.paymentMethod) {
      toast({
        title: "Error", 
        description: "Payment method is required",
        variant: "destructive"
      });
      return;
    }

    if (!newSale.items || newSale.items.length === 0 || !newSale.items[0].name) {
      toast({
        title: "Error",
        description: "At least one item is required",
        variant: "destructive"
      });
      return;
    }

    // Check if all items have valid data
    const invalidItems = newSale.items.filter(item => !item.name || item.quantity <= 0 || item.price <= 0);
    if (invalidItems.length > 0) {
      toast({
        title: "Error",
        description: "All items must have valid name, quantity, and price",
        variant: "destructive"
      });
      return;
    }

    // Validate transaction ID for non-cash payments
    if ((newSale.paymentMethod === "Card" || newSale.paymentMethod === "Momo Pay") && !newSale.transactionId?.trim()) {
      toast({
        title: "Error",
        description: `Transaction ID is required for ${newSale.paymentMethod} payments`,
        variant: "destructive"
      });
      return;
    }

    const total = newSale.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    
    addSale({
      customerName: newSale.customerName,
      items: newSale.items,
      total,
      paymentMethod: newSale.paymentMethod,
      status: "Completed",
      date: new Date().toISOString().split('T')[0]
    });
    
    // Reset form and close dialog
    setNewSale({
      customerName: "",
      items: [{ name: "", quantity: 1, price: 0 }],
      paymentMethod: undefined,
      transactionId: ""
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Sale created successfully and synced across all pages"
    });
  };

  const addItem = () => {
    setNewSale({
      ...newSale,
      items: [...newSale.items, { name: "", quantity: 1, price: 0 }]
    });
  };

  const removeItem = (index: number) => {
    if (newSale.items.length > 1) {
      const updatedItems = newSale.items.filter((_, i) => i !== index);
      setNewSale({ ...newSale, items: updatedItems });
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...newSale.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setNewSale({ ...newSale, items: updatedItems });
  };

  const handleStatusUpdate = (saleId: string, newStatus: "Completed" | "Pending" | "Refunded") => {
    updateSaleStatus(saleId, newStatus);
    toast({
      title: "Success",
      description: `Sale status updated to ${newStatus}`
    });
  };

  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const todaySales = sales.filter(sale => sale.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Sales Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Sale
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Sale</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={newSale.customerName}
                  onChange={(e) => setNewSale({ ...newSale, customerName: e.target.value })}
                  placeholder="Enter customer name"
                />
              </div>
              
              <div>
                <Label>Items</Label>
                {newSale.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 mt-2">
                    <Input
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) => updateItem(index, "name", e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Qty"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                    />
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => updateItem(index, "price", parseFloat(e.target.value) || 0)}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => removeItem(index)}
                      disabled={newSale.items.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addItem} className="mt-2">
                  Add Item
                </Button>
              </div>

              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={newSale.paymentMethod} onValueChange={(value) => setNewSale({ ...newSale, paymentMethod: value as "Cash" | "Card" | "Momo Pay" })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="Momo Pay">Momo Pay (Mobile Money)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(newSale.paymentMethod === "Card" || newSale.paymentMethod === "Momo Pay") && (
                <div>
                  <Label htmlFor="transactionId">
                    Transaction ID {newSale.paymentMethod === "Momo Pay" ? "(Mobile Money)" : "(Card)"}
                  </Label>
                  <Input
                    id="transactionId"
                    value={newSale.transactionId}
                    onChange={(e) => setNewSale({ ...newSale, transactionId: e.target.value })}
                    placeholder={`Enter ${newSale.paymentMethod} transaction ID`}
                  />
                </div>
              )}

              <div className="text-lg font-semibold">
                Total: ${newSale.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
              </div>

              <Button onClick={handleAddSale} className="w-full">Create Sale</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sales Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${totalSales.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Today's Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{todaySales.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg. Sale Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              ${(totalSales / sales.length || 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Recent Sales
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search sales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sale ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.id}</TableCell>
                  <TableCell>{sale.customerName}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {sale.items.map((item, index) => (
                        <div key={index}>
                          {item.name} (x{item.quantity})
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>${sale.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={sale.paymentMethod === "Cash" ? "secondary" : "default"}>
                      {sale.paymentMethod}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={sale.status}
                      onValueChange={(value) => handleStatusUpdate(sale.id, value as "Completed" | "Pending" | "Refunded")}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
