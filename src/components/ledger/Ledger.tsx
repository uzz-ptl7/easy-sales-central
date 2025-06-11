
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, BookOpen, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";

interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  category: string;
  type: "Income" | "Expense";
  amount: number;
  paymentMethod: "Cash" | "Card" | "Bank Transfer";
  reference?: string;
}

export const Ledger = () => {
  const [entries, setEntries] = useState<LedgerEntry[]>([
    {
      id: "L001",
      date: "2024-01-15",
      description: "Sale - Wireless Headphones",
      category: "Sales Revenue",
      type: "Income",
      amount: 139.97,
      paymentMethod: "Card",
      reference: "S001"
    },
    {
      id: "L002",
      date: "2024-01-15",
      description: "Sale - Coffee Mugs",
      category: "Sales Revenue",
      type: "Income",
      amount: 38.97,
      paymentMethod: "Cash",
      reference: "S002"
    },
    {
      id: "L003",
      date: "2024-01-14",
      description: "Office Supplies Purchase",
      category: "Office Expenses",
      type: "Expense",
      amount: 125.50,
      paymentMethod: "Card"
    },
    {
      id: "L004",
      date: "2024-01-13",
      description: "Rent Payment",
      category: "Operating Expenses",
      type: "Expense",
      amount: 2500.00,
      paymentMethod: "Bank Transfer"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [newEntry, setNewEntry] = useState<Partial<LedgerEntry>>({});

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || entry.type.toLowerCase() === filterType;
    return matchesSearch && matchesType;
  });

  const addEntry = () => {
    if (newEntry.description && newEntry.amount && newEntry.type && newEntry.category) {
      const entry: LedgerEntry = {
        id: `L${(entries.length + 1).toString().padStart(3, '0')}`,
        date: newEntry.date || new Date().toISOString().split('T')[0],
        description: newEntry.description,
        category: newEntry.category,
        type: newEntry.type,
        amount: newEntry.amount,
        paymentMethod: newEntry.paymentMethod || "Cash",
        reference: newEntry.reference
      };
      setEntries([...entries, entry]);
      setNewEntry({});
    }
  };

  const totalIncome = entries.filter(e => e.type === "Income").reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = entries.filter(e => e.type === "Expense").reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  const categories = ["Sales Revenue", "Service Revenue", "Office Expenses", "Operating Expenses", "Marketing", "Utilities", "Equipment"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Financial Ledger</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Ledger Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEntry.date || new Date().toISOString().split('T')[0]}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newEntry.description || ""}
                  onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={newEntry.type} onValueChange={(value) => setNewEntry({ ...newEntry, type: value as "Income" | "Expense" })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Income">Income</SelectItem>
                    <SelectItem value="Expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newEntry.category} onValueChange={(value) => setNewEntry({ ...newEntry, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={newEntry.amount || ""}
                  onChange={(e) => setNewEntry({ ...newEntry, amount: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={newEntry.paymentMethod} onValueChange={(value) => setNewEntry({ ...newEntry, paymentMethod: value as "Cash" | "Card" | "Bank Transfer" })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reference">Reference (Optional)</Label>
                <Input
                  id="reference"
                  value={newEntry.reference || ""}
                  onChange={(e) => setNewEntry({ ...newEntry, reference: e.target.value })}
                />
              </div>
              <Button onClick={addEntry} className="w-full">Add Entry</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netProfit.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Entries</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{entries.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Ledger Entries
          </CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income Only</SelectItem>
                <SelectItem value="expense">Expenses Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {entry.date}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{entry.description}</TableCell>
                  <TableCell>{entry.category}</TableCell>
                  <TableCell>
                    <Badge variant={entry.type === "Income" ? "secondary" : "destructive"}>
                      {entry.type}
                    </Badge>
                  </TableCell>
                  <TableCell className={`font-bold ${entry.type === "Income" ? "text-green-600" : "text-red-600"}`}>
                    {entry.type === "Income" ? "+" : "-"}${entry.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{entry.paymentMethod}</TableCell>
                  <TableCell>{entry.reference || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
