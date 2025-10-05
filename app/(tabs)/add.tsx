import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { usePayments } from '@/contexts/PaymentContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Payment } from '@/types/payment';

export default function AddPaymentScreen() {
  const { state, addPayment } = usePayments();
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackground = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>('expense');

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    if (numericValue === '') return '';
    return parseFloat(numericValue).toFixed(2);
  };

  const handleAmountChange = (text: string) => {
    const formatted = formatCurrency(text);
    setAmount(formatted);
  };

  const handleSubmit = () => {
    if (!amount || !description || !selectedCategory) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    const payment: Payment = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      description,
      category: selectedCategory,
      date: new Date(),
      type: selectedType,
    };

    addPayment(payment);
    
    // Reset form
    setAmount('');
    setDescription('');
    setSelectedCategory('');
    setSelectedType('expense');
    
    Alert.alert('Success', 'Payment added successfully!');
  };

  const expenseCategories = state.categories.filter(c => c.type === 'expense');
  const incomeCategories = state.categories.filter(c => c.type === 'income');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            Add Payment
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Track your income and expenses
          </ThemedText>
        </View>

        {/* Type Selection */}
        <ThemedView style={[styles.section, { backgroundColor: cardBackground }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Type
          </ThemedText>
          <View style={styles.typeButtons}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === 'expense' && styles.typeButtonActive,
                { borderColor }
              ]}
              onPress={() => setSelectedType('expense')}
            >
              <IconSymbol 
                name="arrow.down.circle.fill" 
                size={24} 
                color={selectedType === 'expense' ? '#EF4444' : '#9CA3AF'} 
              />
              <ThemedText style={[
                styles.typeButtonText,
                selectedType === 'expense' && styles.typeButtonTextActive
              ]}>
                Expense
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === 'income' && styles.typeButtonActive,
                { borderColor }
              ]}
              onPress={() => setSelectedType('income')}
            >
              <IconSymbol 
                name="arrow.up.circle.fill" 
                size={24} 
                color={selectedType === 'income' ? '#10B981' : '#9CA3AF'} 
              />
              <ThemedText style={[
                styles.typeButtonText,
                selectedType === 'income' && styles.typeButtonTextActive
              ]}>
                Income
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>

        {/* Amount Input */}
        <ThemedView style={[styles.section, { backgroundColor: cardBackground }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Amount *
          </ThemedText>
          <View style={[styles.inputContainer, { borderColor }]}>
            <IconSymbol name="dollarsign.circle.fill" size={20} color={tintColor} />
            <TextInput
              style={[styles.amountInput, { color: textColor }]}
              value={amount}
              onChangeText={handleAmountChange}
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              returnKeyType="next"
            />
          </View>
        </ThemedView>

        {/* Description Input */}
        <ThemedView style={[styles.section, { backgroundColor: cardBackground }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Description *
          </ThemedText>
          <View style={[styles.inputContainer, { borderColor }]}>
            <IconSymbol name="text.bubble.fill" size={20} color={tintColor} />
            <TextInput
              style={[styles.descriptionInput, { color: textColor }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={2}
              returnKeyType="next"
            />
          </View>
        </ThemedView>

        {/* Category Selection */}
        <ThemedView style={[styles.section, { backgroundColor: cardBackground }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Category *
          </ThemedText>
          <View style={styles.categoriesGrid}>
            {(selectedType === 'expense' ? expenseCategories : incomeCategories).map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategory === category.name && styles.categoryItemActive,
                  { borderColor }
                ]}
                onPress={() => setSelectedCategory(category.name)}
              >
                <View style={[
                  styles.categoryIcon,
                  { backgroundColor: selectedCategory === category.name ? category.color : category.color + '20' }
                ]}>
                  <IconSymbol 
                    name={category.icon} 
                    size={20} 
                    color={selectedCategory === category.name ? '#FFFFFF' : category.color} 
                  />
                </View>
                <ThemedText style={[
                  styles.categoryText,
                  selectedCategory === category.name && styles.categoryTextActive
                ]}>
                  {category.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </ThemedView>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: tintColor }]}
          onPress={handleSubmit}
        >
          <IconSymbol name="checkmark.circle.fill" size={24} color="#FFFFFF" />
          <ThemedText style={styles.submitButtonText}>
            Add Payment
          </ThemedText>
        </TouchableOpacity>
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
  section: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  typeButtonActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#3B82F6',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
  },
  descriptionInput: {
    flex: 1,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryItem: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 80,
  },
  categoryItemActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#3B82F6',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    gap: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

