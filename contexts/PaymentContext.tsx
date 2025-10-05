import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Payment, Category, PaymentStats } from '@/types/payment';

interface PaymentState {
  payments: Payment[];
  categories: Category[];
  isLoading: boolean;
}

type PaymentAction =
  | { type: 'ADD_PAYMENT'; payload: Payment }
  | { type: 'UPDATE_PAYMENT'; payload: Payment }
  | { type: 'DELETE_PAYMENT'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_PAYMENTS'; payload: Payment[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: PaymentState = {
  payments: [],
  categories: [
    { id: '1', name: 'Food & Dining', icon: 'fork.knife', color: '#FF6B6B', type: 'expense' },
    { id: '2', name: 'Transportation', icon: 'car.fill', color: '#4ECDC4', type: 'expense' },
    { id: '3', name: 'Shopping', icon: 'bag.fill', color: '#45B7D1', type: 'expense' },
    { id: '4', name: 'Entertainment', icon: 'tv.fill', color: '#96CEB4', type: 'expense' },
    { id: '5', name: 'Bills & Utilities', icon: 'bolt.fill', color: '#FFEAA7', type: 'expense' },
    { id: '6', name: 'Salary', icon: 'dollarsign.circle.fill', color: '#DDA0DD', type: 'income' },
    { id: '7', name: 'Freelance', icon: 'briefcase.fill', color: '#98D8C8', type: 'income' },
    { id: '8', name: 'Investment', icon: 'chart.line.uptrend.xyaxis', color: '#F7DC6F', type: 'income' },
  ],
  isLoading: false,
};

function paymentReducer(state: PaymentState, action: PaymentAction): PaymentState {
  switch (action.type) {
    case 'ADD_PAYMENT':
      return { ...state, payments: [...state.payments, action.payload] };
    case 'UPDATE_PAYMENT':
      return {
        ...state,
        payments: state.payments.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'DELETE_PAYMENT':
      return {
        ...state,
        payments: state.payments.filter(p => p.id !== action.payload)
      };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(c => c.id === action.payload.id ? action.payload : c)
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.payload)
      };
    case 'SET_PAYMENTS':
      return { ...state, payments: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

interface PaymentContextType {
  state: PaymentState;
  addPayment: (payment: Payment) => void;
  updatePayment: (payment: Payment) => void;
  deletePayment: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  getPaymentStats: () => PaymentStats;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  const addPayment = (payment: Payment) => {
    dispatch({ type: 'ADD_PAYMENT', payload: payment });
  };

  const updatePayment = (payment: Payment) => {
    dispatch({ type: 'UPDATE_PAYMENT', payload: payment });
  };

  const deletePayment = (id: string) => {
    dispatch({ type: 'DELETE_PAYMENT', payload: id });
  };

  const addCategory = (category: Category) => {
    dispatch({ type: 'ADD_CATEGORY', payload: category });
  };

  const updateCategory = (category: Category) => {
    dispatch({ type: 'UPDATE_CATEGORY', payload: category });
  };

  const deleteCategory = (id: string) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: id });
  };

  const getPaymentStats = (): PaymentStats => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const totalIncome = state.payments
      .filter(p => p.type === 'income')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalExpenses = state.payments
      .filter(p => p.type === 'expense')
      .reduce((sum, p) => sum + p.amount, 0);

    const monthlyIncome = state.payments
      .filter(p => p.type === 'income' && 
        p.date.getMonth() === currentMonth && 
        p.date.getFullYear() === currentYear)
      .reduce((sum, p) => sum + p.amount, 0);

    const monthlyExpenses = state.payments
      .filter(p => p.type === 'expense' && 
        p.date.getMonth() === currentMonth && 
        p.date.getFullYear() === currentYear)
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      monthlyIncome,
      monthlyExpenses,
      monthlyBalance: monthlyIncome - monthlyExpenses,
    };
  };

  return (
    <PaymentContext.Provider value={{
      state,
      addPayment,
      updatePayment,
      deletePayment,
      addCategory,
      updateCategory,
      deleteCategory,
      getPaymentStats,
    }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayments() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayments must be used within a PaymentProvider');
  }
  return context;
}

