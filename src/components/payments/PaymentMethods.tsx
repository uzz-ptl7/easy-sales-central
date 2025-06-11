
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, CreditCard, Banknote, Settings, TrendingUp, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/hooks/useAppStore";

export const PaymentMethods = () => {
  const { toast } = useToast();
  const { payments, addPayment, updatePaymentStatus } = useAppStore();
  
  const [newPayment, setNewPayment] = useState<{
    customerName: string;
    amount: number | "";
    method: "Cash" | "Card" | "Momo Pay" | undefined;
    transactionId: string;
  }>({
    customerName: "",
    amount: "",
    method: undefined,
    transactionId: ""
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cashRegisterBalance, setCashRegisterBalance] = useState(1000);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [registerOperation, setRegisterOperation] = useState<"add" | "remove">("add");
  const [registerAmount, setRegisterAmount] = useState<number | "">(0);

  const handleAddPayment = () => {
    if (!newPayment.customerName?.trim()) {
      toast({
        title: "Error",
        description: "Customer name is required",
        variant: "destructive"
      });
      return;
    }

    if (!newPayment.amount || newPayment.amount <= 0) {
      toast({
        title: "Error",
        description: "Valid amount is required",
        variant: "destructive"
      });
      return;
    }

    if (!newPayment.method) {
      toast({
        title: "Error",
        description: "Payment method is required",
        variant: "destructive"
      });
      return;
    }

    if ((newPayment.method === "Card" || newPayment.method === "Momo Pay") && !newPayment.transactionId?.trim()) {
      toast({
        title: "Error",
        description: `Transaction ID is required for ${newPayment.method} payments`,
        variant: "destructive"
      });
      return;
    }

    addPayment({
      amount: Number(newPayment.amount),
      method: newPayment.method,
      transactionId: newPayment.method !== "Cash" ? newPayment.transactionId : undefined,
      customerName: newPayment.customerName,
      date: new Date().toISOString().split('T')[0],
      status: "Completed"
    });

    // Update cash register for cash payments
    if (newPayment.method === "Cash") {
      setCashRegisterBalance(prev => prev + Number(newPayment.amount));
    }

    setNewPayment({
      customerName: "",
      amount: "",
      method: undefined,
      transactionId: ""
    });
    setIsDialogOpen(false);

    toast({
      title: "Success",
      description: "Payment recorded successfully"
    });
  };

  const handleStatusUpdate = (paymentId: string, newStatus: "Completed" | "Pending" | "Failed") => {
    updatePaymentStatus(paymentId, newStatus);
    toast({
      title: "Success",
      description: `Payment status updated to ${newStatus}`
    });
  };

  const handleRegisterOperation = () => {
    if (!registerAmount || registerAmount <= 0) {
      toast({
        title: "Error",
        description: "Valid amount is required",
        variant: "destructive"
      });
      return;
    }

    if (registerOperation === "add") {
      setCashRegisterBalance(prev => prev + Number(registerAmount));
      toast({
        title: "Success",
        description: `Added $${registerAmount} to cash register`
      });
    } else {
      if (Number(registerAmount) > cashRegisterBalance) {
        toast({
          title: "Error",
          description: "Cannot remove more than current balance",
          variant: "destructive"
        });
        return;
      }
      setCashRegisterBalance(prev => prev - Number(registerAmount));
      toast({
        title: "Success",
        description: `Removed $${registerAmount} from cash register`
      });
    }

    setRegisterAmount("");
    setIsRegisterDialogOpen(false);
  };

  const totalCash = payments.filter(p => p.method === "Cash" && p.status === "Completed").reduce((sum, p) => sum + p.amount, 0);
  const totalCard = payments.filter(p => p.method === "Card" && p.status === "Completed").reduce((sum, p) => sum + p.amount, 0);
  const totalMomo = payments.filter(p => p.method === "Momo Pay" && p.status === "Completed").reduce((sum, p) => sum + p.amount, 0);
  const totalPayments = totalCash + totalCard + totalMomo;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                  value={newPayment.customerName}
                  onChange={(e) => setNewPayment({ ...newPayment, customerName: e.target.value })}
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) || "" })}
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <Label htmlFor="method">Payment Method</Label>
                <Select value={newPayment.method} onValueChange={(value) => setNewPayment({ ...newPayment, method: value as "Cash" | "Card" | "Momo Pay" })}>
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
              {(newPayment.method === "Card" || newPayment.method === "Momo Pay") && (
                <div>
                  <Label htmlFor="transactionId">
                    Transaction ID {newPayment.method === "Momo Pay" ? "(Mobile Money)" : "(Card)"}
                  </Label>
                  <Input
                    id="transactionId"
                    value={newPayment.transactionId}
                    onChange={(e) => setNewPayment({ ...newPayment, transactionId: e.target.value })}
                    placeholder={`Enter ${newPayment.method} transaction ID`}
                  />
                </div>
              )}
              <Button onClick={handleAddPayment} className="w-full">Record Payment</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            <CardTitle className="text-sm font-medium text-gray-600">Momo Pay</CardTitle>
            <Smartphone className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${totalMomo.toFixed(2)}</div>
            <p className="text-xs text-gray-500">
              {((totalMomo / totalPayments) * 100 || 0).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Processed</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Banknote className="h-5 w-5 mr-2 text-green-600" />
              Cash Register
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Balance</span>
              <span className="text-lg font-bold">${cashRegisterBalance.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Today's Cash Sales</span>
              <span className="text-sm">${totalCash.toFixed(2)}</span>
            </div>
            <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Cash Register
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Manage Cash Register</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Current Balance: ${cashRegisterBalance.toFixed(2)}</Label>
                  </div>
                  <div>
                    <Label htmlFor="operation">Operation</Label>
                    <Select value={registerOperation} onValueChange={(value) => setRegisterOperation(value as "add" | "remove")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="add">Add Money</SelectItem>
                        <SelectItem value="remove">Remove Money</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="registerAmount">Amount</Label>
                    <Input
                      id="registerAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={registerAmount}
                      onChange={(e) => setRegisterAmount(parseFloat(e.target.value) || "")}
                      placeholder="Enter amount"
                    />
                  </div>
                  <Button onClick={handleRegisterOperation} className="w-full">
                    {registerOperation === "add" ? "Add to Register" : "Remove from Register"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="h-5 w-5 mr-2 text-purple-600" />
              Momo Pay Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Momo Processing Volume</span>
              <span className="text-lg font-bold">${totalMomo.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Transactions Today</span>
              <span className="text-sm">{payments.filter(p => p.method === "Momo Pay" && p.date === new Date().toISOString().split('T')[0]).length}</span>
            </div>
            <Button variant="outline" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Configure Momo Pay
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
                <TableHead>Actions</TableHead>
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
                        payment.method === "Card" ?
                        <CreditCard className="h-4 w-4 mr-2 text-blue-600" /> :
                        <Smartphone className="h-4 w-4 mr-2 text-purple-600" />
                      }
                      {payment.method}
                    </div>
                  </TableCell>
                  <TableCell>{payment.transactionId || "N/A"}</TableCell>
                  <TableCell>
                    <Select
                      value={payment.status}
                      onValueChange={(value) => handleStatusUpdate(payment.id, value as "Completed" | "Pending" | "Failed")}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{payment.date}</TableCell>
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
