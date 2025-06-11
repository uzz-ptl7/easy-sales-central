
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Sale {
  id: string;
  customerName: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  paymentMethod: "Cash" | "Card" | "Momo Pay";
  status: "Completed" | "Pending" | "Refunded";
  date: string;
}

interface PaymentRecord {
  id: string;
  amount: number;
  method: "Cash" | "Card" | "Momo Pay";
  transactionId?: string;
  customerName: string;
  date: string;
  status: "Completed" | "Pending" | "Failed";
}

interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  category: string;
  type: "Income" | "Expense";
  amount: number;
  paymentMethod: "Cash" | "Card" | "Bank Transfer" | "Momo Pay";
  reference?: string;
}

interface AppStore {
  sales: Sale[];
  payments: PaymentRecord[];
  ledgerEntries: LedgerEntry[];
  addSale: (sale: Omit<Sale, 'id'>) => void;
  addPayment: (payment: Omit<PaymentRecord, 'id'>) => void;
  addLedgerEntry: (entry: Omit<LedgerEntry, 'id'>) => void;
  updatePaymentStatus: (paymentId: string, status: PaymentRecord['status']) => void;
  updateSaleStatus: (saleId: string, status: Sale['status']) => void;
}

let store: AppStore = {
  sales: [
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
  ],
  payments: [
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
  ],
  ledgerEntries: [
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
  ],
  addSale: () => {},
  addPayment: () => {},
  addLedgerEntry: () => {},
  updatePaymentStatus: () => {},
  updateSaleStatus: () => {}
};

const listeners: Set<() => void> = new Set();

const notify = () => {
  listeners.forEach(listener => listener());
};

store.addSale = (newSale) => {
  const sale: Sale = {
    ...newSale,
    id: `S${(store.sales.length + 1).toString().padStart(3, '0')}`
  };
  store.sales = [...store.sales, sale];
  
  // Auto-create payment record
  const payment: PaymentRecord = {
    id: `P${(store.payments.length + 1).toString().padStart(3, '0')}`,
    amount: sale.total,
    method: sale.paymentMethod,
    transactionId: sale.paymentMethod !== "Cash" ? `TXN${Date.now()}` : undefined,
    customerName: sale.customerName,
    date: sale.date,
    status: sale.status === "Completed" ? "Completed" : "Pending"
  };
  store.payments = [...store.payments, payment];
  
  // Auto-create ledger entry
  const ledgerEntry: LedgerEntry = {
    id: `L${(store.ledgerEntries.length + 1).toString().padStart(3, '0')}`,
    date: sale.date,
    description: `Sale - ${sale.items.map(item => item.name).join(', ')}`,
    category: "Sales Revenue",
    type: "Income",
    amount: sale.total,
    paymentMethod: sale.paymentMethod === "Momo Pay" ? "Momo Pay" : sale.paymentMethod,
    reference: sale.id
  };
  store.ledgerEntries = [...store.ledgerEntries, ledgerEntry];
  
  notify();
};

store.addPayment = (newPayment) => {
  const payment: PaymentRecord = {
    ...newPayment,
    id: `P${(store.payments.length + 1).toString().padStart(3, '0')}`
  };
  store.payments = [...store.payments, payment];
  notify();
};

store.addLedgerEntry = (newEntry) => {
  const entry: LedgerEntry = {
    ...newEntry,
    id: `L${(store.ledgerEntries.length + 1).toString().padStart(3, '0')}`
  };
  store.ledgerEntries = [...store.ledgerEntries, entry];
  notify();
};

store.updatePaymentStatus = (paymentId, status) => {
  store.payments = store.payments.map(payment =>
    payment.id === paymentId ? { ...payment, status } : payment
  );
  notify();
};

store.updateSaleStatus = (saleId, status) => {
  store.sales = store.sales.map(sale =>
    sale.id === saleId ? { ...sale, status } : sale
  );
  notify();
};

export const useAppStore = (): AppStore => {
  const [, forceUpdate] = useState({});
  
  useEffect(() => {
    const listener = () => forceUpdate({});
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);
  
  return store;
};
