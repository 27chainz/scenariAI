import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { usePayments } from '@/contexts/PaymentContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Payment } from '@/types/payment';

export default function HistoryScreen() {
  const { state, deletePayment } = usePayments();
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackground = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = state.categories.find(c => c.name === categoryName);
    return category?.icon || 'dollarsign.circle';
  };

  const getCategoryColor = (categoryName: string) => {
    const category = state.categories.find(c => c.name === categoryName);
    return category?.color || '#6B7280';
  };

  const filteredPayments = state.payments.filter(payment => {
    if (filterType === 'all') return true;
    return payment.type === filterType;
  }).sort((a, b) => b.date.getTime() - a.date.getTime());

  const handleDeletePayment = (payment: Payment) => {
    Alert.alert(
      'Delete Payment',
      `Are you sure you want to delete "${payment.description}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deletePayment(payment.id),
        },
      ]
    );
  };

  const groupPaymentsByDate = (payments: Payment[]) => {
    const groups: { [key: string]: Payment[] } = {};
    
    payments.forEach(payment => {
      const dateKey = payment.date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(payment);
    });
    
    return groups;
  };

  const groupedPayments = groupPaymentsByDate(filteredPayments);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            Payment History
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            {filteredPayments.length} transaction{filteredPayments.length !== 1 ? 's' : ''}
          </ThemedText>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'all' && styles.filterButtonActive,
              { backgroundColor: filterType === 'all' ? tintColor : cardBackground }
            ]}
            onPress={() => setFilterType('all')}
          >
            <ThemedText style={[
              styles.filterButtonText,
              { color: filterType === 'all' ? '#FFFFFF' : textColor }
            ]}>
              All
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'income' && styles.filterButtonActive,
              { backgroundColor: filterType === 'income' ? tintColor : cardBackground }
            ]}
            onPress={() => setFilterType('income')}
          >
            <IconSymbol 
              name="arrow.up.circle.fill" 
              size={16} 
              color={filterType === 'income' ? '#FFFFFF' : '#10B981'} 
            />
            <ThemedText style={[
              styles.filterButtonText,
              { color: filterType === 'income' ? '#FFFFFF' : textColor }
            ]}>
              Income
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'expense' && styles.filterButtonActive,
              { backgroundColor: filterType === 'expense' ? tintColor : cardBackground }
            ]}
            onPress={() => setFilterType('expense')}
          >
            <IconSymbol 
              name="arrow.down.circle.fill" 
              size={16} 
              color={filterType === 'expense' ? '#FFFFFF' : '#EF4444'} 
            />
            <ThemedText style={[
              styles.filterButtonText,
              { color: filterType === 'expense' ? '#FFFFFF' : textColor }
            ]}>
              Expense
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
        {filteredPayments.length === 0 ? (
          <ThemedView style={[styles.emptyState, { backgroundColor: cardBackground }]}>
            <IconSymbol name="creditcard" size={64} color="#9CA3AF" />
            <ThemedText style={styles.emptyTitle}>
              No transactions found
            </ThemedText>
            <ThemedText style={styles.emptySubtitle}>
              {filterType === 'all' 
                ? 'Start by adding your first payment'
                : `No ${filterType} transactions yet`
              }
            </ThemedText>
          </ThemedView>
        ) : (
          <View style={styles.transactionsContainer}>
            {Object.entries(groupedPayments).map(([date, payments]) => (
              <View key={date} style={styles.dateGroup}>
                <ThemedText style={styles.dateHeader}>
                  {date}
                </ThemedText>
                
                {payments.map((payment) => (
                  <ThemedView 
                    key={payment.id} 
                    style={[styles.transactionCard, { backgroundColor: cardBackground }]}
                  >
                    <View style={styles.transactionContent}>
                      <View style={styles.transactionLeft}>
                        <View style={[
                          styles.categoryIcon,
                          { backgroundColor: getCategoryColor(payment.category) + '20' }
                        ]}>
                          <IconSymbol 
                            name={getCategoryIcon(payment.category)} 
                            size={24} 
                            color={getCategoryColor(payment.category)} 
                          />
                        </View>
                        <View style={styles.transactionDetails}>
                          <ThemedText type="defaultSemiBold" style={styles.transactionDescription}>
                            {payment.description}
                          </ThemedText>
                          <ThemedText style={styles.transactionCategory}>
                            {payment.category}
                          </ThemedText>
                          <ThemedText style={styles.transactionTime}>
                            {payment.date.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </ThemedText>
                        </View>
                      </View>

                      <View style={styles.transactionRight}>
                        <ThemedText 
                          type="defaultSemiBold" 
                          style={[
                            styles.transactionAmount,
                            { color: payment.type === 'income' ? '#10B981' : '#EF4444' }
                          ]}
                        >
                          {payment.type === 'income' ? '+' : '-'}{formatCurrency(payment.amount)}
                        </ThemedText>
                        
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeletePayment(payment)}
                        >
                          <IconSymbol name="trash" size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </ThemedView>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 6,
  },
  filterButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  transactionsContainer: {
    gap: 20,
  },
  dateGroup: {
    marginBottom: 16,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    opacity: 0.8,
  },
  transactionCard: {
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  transactionRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
});

