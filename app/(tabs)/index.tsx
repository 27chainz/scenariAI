import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { usePayments } from '@/contexts/PaymentContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { state, getPaymentStats } = usePayments();
  const colorScheme = useColorScheme();
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardBackground = useThemeColor({}, 'background');

  const stats = getPaymentStats();
  const recentPayments = state.payments
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            Payment Tracker
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Track your finances easily
          </ThemedText>
        </View>

        {/* Balance Card */}
        <ThemedView style={[styles.balanceCard, { backgroundColor: cardBackground }]}>
          <ThemedText type="subtitle" style={styles.balanceLabel}>
            Total Balance
          </ThemedText>
          <ThemedText 
            type="title" 
            style={[
              styles.balanceAmount, 
              { color: stats.balance >= 0 ? '#10B981' : '#EF4444' }
            ]}
          >
            {formatCurrency(stats.balance)}
          </ThemedText>
        </ThemedView>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <ThemedView style={[styles.statCard, { backgroundColor: cardBackground }]}>
              <IconSymbol name="arrow.up.circle.fill" size={24} color="#10B981" />
              <ThemedText style={styles.statLabel}>Income</ThemedText>
              <ThemedText type="defaultSemiBold" style={[styles.statValue, { color: '#10B981' }]}>
                {formatCurrency(stats.totalIncome)}
              </ThemedText>
            </ThemedView>

            <ThemedView style={[styles.statCard, { backgroundColor: cardBackground }]}>
              <IconSymbol name="arrow.down.circle.fill" size={24} color="#EF4444" />
              <ThemedText style={styles.statLabel}>Expenses</ThemedText>
              <ThemedText type="defaultSemiBold" style={[styles.statValue, { color: '#EF4444' }]}>
                {formatCurrency(stats.totalExpenses)}
              </ThemedText>
            </ThemedView>
          </View>

          <View style={styles.statsRow}>
            <ThemedView style={[styles.statCard, { backgroundColor: cardBackground }]}>
              <IconSymbol name="calendar" size={24} color={tintColor} />
              <ThemedText style={styles.statLabel}>This Month</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.statValue}>
                {formatCurrency(stats.monthlyBalance)}
              </ThemedText>
            </ThemedView>

            <ThemedView style={[styles.statCard, { backgroundColor: cardBackground }]}>
              <IconSymbol name="chart.bar.fill" size={24} color={tintColor} />
              <ThemedText style={styles.statLabel}>Transactions</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.statValue}>
                {state.payments.length}
              </ThemedText>
            </ThemedView>
          </View>
        </View>

        {/* Recent Transactions */}
        <ThemedView style={[styles.recentContainer, { backgroundColor: cardBackground }]}>
          <View style={styles.recentHeader}>
            <ThemedText type="subtitle" style={styles.recentTitle}>
              Recent Transactions
            </ThemedText>
            <TouchableOpacity>
              <ThemedText style={[styles.viewAllText, { color: tintColor }]}>
                View All
              </ThemedText>
            </TouchableOpacity>
          </View>

          {recentPayments.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="creditcard" size={48} color="#9CA3AF" />
              <ThemedText style={styles.emptyText}>
                No transactions yet
              </ThemedText>
              <ThemedText style={styles.emptySubtext}>
                Add your first payment to get started
              </ThemedText>
            </View>
          ) : (
            <View style={styles.transactionsList}>
              {recentPayments.map((payment) => (
                <View key={payment.id} style={styles.transactionItem}>
                  <View style={styles.transactionLeft}>
                    <View style={[
                      styles.categoryIcon, 
                      { backgroundColor: getCategoryColor(payment.category) + '20' }
                    ]}>
                      <IconSymbol 
                        name={getCategoryIcon(payment.category)} 
                        size={20} 
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
                    <ThemedText style={styles.transactionDate}>
                      {payment.date.toLocaleDateString()}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ThemedView>
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
  balanceCard: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  recentContainer: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 14,
    opacity: 0.7,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    opacity: 0.7,
  },
});