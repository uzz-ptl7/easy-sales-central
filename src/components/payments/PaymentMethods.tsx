
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, CreditCard, Banknote, Settings, TrendingUp } from "lucide-react";

interface PaymentRecord {
  id: string;
  amount: number;
  method: "Cash" | "Card";
  transactionId?: string;
  customerName: string;
  date: string;
  status: "Completed" | "Pending" | "Failed";
}

export const PaymentMethods = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([
    {
      id: "P001",
      amount: 139.97,
      method: "Card",
      transactionId: "TXN123456789",
      customerName: "John Smith",
      date: "2024-01-15",
      status: "Completed"
    },
    {
      id: "P002",
      amount: 38.97,
      method: "Cash",
      customerName: "Sarah Johnson",
      date: "2024-01-15",
      status: "Completed"
    },
    {
      id: "P003",
      amount: 49.99,
      method: "Card",
      transactionId: "TXN987654321",
      customerName: "Mike Davis",
      date: "2024-01-16",
      status: "Pending"
    }
  ]);

  const [newPayment, setNewPayment] = useState<Partial<PaymentRecord>>({});

  const addPayment = () => {
    if (newPayment.amount && newPayment.method && newPayment.customerName) {
      const payment: PaymentRecord = {
        id: `P${(payments.length + 1).toString().padStart(3, '0')}`,
        amount: newPayment.amount,
        method: newPayment.method,
        transactionId: newPayment.method === "Card" ? `TXN${Date.now()}` : undefined,
        customerName: newPayment.customerName,
        date: new Date().toISOString().split('T')[0],
        status: "Completed"
      };
      setPayments([...payments, payment]);
      setNewPayment({});
    }
  };

  const totalCash = payments.filter(p => p.method === "Cash" && p.status === "Completed").reduce((sum, p) => sum + p.amount, 0);
  const totalCard = payments.filter(p => p.method === "Card" && p.status === "Completed").reduce((sum, p) => sum + p.amount, 0);
  const totalPayments = totalCash + totalCard;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record New Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={newPayment.customerName || ""}
                  onChange={(e) => setNewPayment({ ...newPayment, customerName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={newPayment.amount || ""}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="method">Payment Method</Label>
                <Select value={newPayment.method} onValueChange={(value) => setNewPayment({ ...newPayment, method: value as "Cash" | "Card" })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addPayment} className="w-full">Record Payment</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cash Payments</CardTitle>
            <Banknote className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${totalCash.toFixed(2)}</div>
            <p className="text-xs text-gray-500">
              {((totalCash / totalPayments) * 100 || 0).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Card Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${totalCard.toFixed(2)}</div>
            <p className="text-xs text-gray-500">
              {((totalCard / totalPayments) * 100 || 0).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Processed</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${totalPayments.toFixed(2)}</div>
            <p className="text-xs text-gray-500">
              {payments.filter(p => p.status === "Completed").length} transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Banknote className="h-5 w-5 mr-2 text-green-600" />
              Cash Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Cash Register Balance</span>
              <span className="text-lg font-bold">${totalCash.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Transactions Today</span>
              <span className="text-sm">{payments.filter(p => p.method === "Cash" && p.date === new Date().toISOString().split('T')[0]).length}</span>
            </div>
            <Button variant="outline" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Manage Cash Register
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
              Card Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Card Processing Volume</span>
              <span className="text-lg font-bold">${totalCard.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Transactions Today</span>
              <span className="text-sm">{payments.filter(p => p.method === "Card" && p.date === new Date().toISOString().split('T')[0]).length}</span>
            </div>
            <Button variant="outline" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Configure Card Terminal
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.customerName}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {payment.method === "Cash" ? 
                        <Banknote className="h-4 w-4 mr-2 text-green-600" /> : 
                        <CreditCard className="h-4 w-4 mr-2 text-blue-600" />
                      }
                      {payment.method}
                    </div>
                  </TableCell>
                  <TableCell>{payment.transactionId || "N/A"}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        payment.status === "Completed" ? "secondary" :
                        payment.status === "Pending" ? "default" : "destructive"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{payment.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
