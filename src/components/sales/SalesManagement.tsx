
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

interface Sale {
  id: string;
  customerName: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  paymentMethod: "Cash" | "Card";
  status: "Completed" | "Pending" | "Refunded";
  date: string;
}

export const SalesManagement = () => {
  const { toast } = useToast();
  const [sales, setSales] = useState<Sale[]>([
    {
      id: "S001",
      customerName: "John Smith",
      items: [
        { name: "Wireless Headphones", quantity: 1, price: 99.99 },
        { name: "Phone Case", quantity: 2, price: 19.99 }
      ],
      total: 139.97,
      paymentMethod: "Card",
      status: "Completed",
      date: "2024-01-15"
    },
    {
      id: "S002",
      customerName: "Sarah Johnson",
      items: [
        { name: "Coffee Mug", quantity: 3, price: 12.99 }
      ],
      total: 38.97,
      paymentMethod: "Cash",
      status: "Completed",
      date: "2024-01-15"
    },
    {
      id: "S003",
      customerName: "Mike Davis",
      items: [
        { name: "Laptop Stand", quantity: 1, price: 49.99 }
      ],
      total: 49.99,
      paymentMethod: "Card",
      status: "Pending",
      date: "2024-01-16"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSale, setNewSale] = useState<Partial<Sale>>({
    customerName: "",
    items: [{ name: "", quantity: 1, price: 0 }],
    paymentMethod: undefined
  });

  const filteredSales = sales.filter(sale =>
    sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addSale = () => {
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

    const total = newSale.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const sale: Sale = {
      id: `S${(sales.length + 1).toString().padStart(3, '0')}`,
      customerName: newSale.customerName,
      items: newSale.items,
      total,
      paymentMethod: newSale.paymentMethod,
      status: "Completed",
      date: new Date().toISOString().split('T')[0]
    };
    
    setSales([...sales, sale]);
    
    // Reset form and close dialog
    setNewSale({
      customerName: "",
      items: [{ name: "", quantity: 1, price: 0 }],
      paymentMethod: undefined
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Sale created successfully"
    });
  };

  const addItem = () => {
    setNewSale({
      ...newSale,
      items: [...(newSale.items || []), { name: "", quantity: 1, price: 0 }]
    });
  };

  const removeItem = (index: number) => {
    if (newSale.items && newSale.items.length > 1) {
      const updatedItems = newSale.items.filter((_, i) => i !== index);
      setNewSale({ ...newSale, items: updatedItems });
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...(newSale.items || [])];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setNewSale({ ...newSale, items: updatedItems });
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
                  value={newSale.customerName || ""}
                  onChange={(e) => setNewSale({ ...newSale, customerName: e.target.value })}
                  placeholder="Enter customer name"
                />
              </div>
              
              <div>
                <Label>Items</Label>
                {newSale.items?.map((item, index) => (
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
                      disabled={newSale.items?.length === 1}
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
                <Select value={newSale.paymentMethod} onValueChange={(value) => setNewSale({ ...newSale, paymentMethod: value as "Cash" | "Card" })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-lg font-semibold">
                Total: ${newSale.items?.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2) || "0.00"}
              </div>

              <Button onClick={addSale} className="w-full">Create Sale</Button>
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
                    <Badge 
                      variant={
                        sale.status === "Completed" ? "secondary" :
                        sale.status === "Pending" ? "default" : "destructive"
                      }
                    >
                      {sale.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{sale.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
