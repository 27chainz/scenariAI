export interface Payment {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  type: 'income' | 'expense';
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
}

export interface PaymentStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyBalance: number;
}

export interface DashboardData {
  stats: PaymentStats;
  recentPayments: Payment[];
  topCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

