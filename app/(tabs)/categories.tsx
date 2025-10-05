import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { usePayments } from '@/contexts/PaymentContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Category } from '@/types/payment';

const categoryIcons = [
  'fork.knife', 'car.fill', 'bag.fill', 'tv.fill', 'bolt.fill',
  'house.fill', 'gamecontroller.fill', 'book.fill', 'heart.fill',
  'dollarsign.circle.fill', 'briefcase.fill', 'chart.line.uptrend.xyaxis',
  'gift.fill', 'airplane', 'wrench.fill', 'pawprint.fill', 'leaf.fill'
];

const categoryColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#F7DC6F',
  '#D7BDE2', '#A9DFBF'
];

export default function CategoriesScreen() {
  const { state, addCategory, updateCategory, deleteCategory } = usePayments();
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackground = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(categoryIcons[0]);
  const [selectedColor, setSelectedColor] = useState(categoryColors[0]);
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>('expense');

  const handleAddCategory = () => {
    if (!categoryName.trim()) {
      Alert.alert('Error', 'Please enter a category name.');
      return;
    }

    if (state.categories.some(c => c.name.toLowerCase() === categoryName.toLowerCase())) {
      Alert.alert('Error', 'A category with this name already exists.');
      return;
    }

    const newCategory: Category = {
      id: Date.now().toString(),
      name: categoryName.trim(),
      icon: selectedIcon,
      color: selectedColor,
      type: selectedType,
    };

    addCategory(newCategory);
    resetForm();
    Alert.alert('Success', 'Category added successfully!');
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !categoryName.trim()) {
      Alert.alert('Error', 'Please enter a category name.');
      return;
    }

    const updatedCategory: Category = {
      ...editingCategory,
      name: categoryName.trim(),
      icon: selectedIcon,
      color: selectedColor,
      type: selectedType,
    };

    updateCategory(updatedCategory);
    resetForm();
    Alert.alert('Success', 'Category updated successfully!');
  };

  const handleDeleteCategory = (category: Category) => {
    const hasTransactions = state.payments.some(p => p.category === category.name);
    
    if (hasTransactions) {
      Alert.alert(
        'Cannot Delete',
        'This category is being used by existing transactions and cannot be deleted.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteCategory(category.id),
        },
      ]
    );
  };

  const resetForm = () => {
    setCategoryName('');
    setSelectedIcon(categoryIcons[0]);
    setSelectedColor(categoryColors[0]);
    setSelectedType('expense');
    setShowAddForm(false);
    setEditingCategory(null);
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setSelectedIcon(category.icon);
    setSelectedColor(category.color);
    setSelectedType(category.type);
    setShowAddForm(true);
  };

  const expenseCategories = state.categories.filter(c => c.type === 'expense');
  const incomeCategories = state.categories.filter(c => c.type === 'income');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            Categories
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Manage your payment categories
          </ThemedText>
        </View>

        {/* Add/Edit Form */}
        {showAddForm && (
          <ThemedView style={[styles.formContainer, { backgroundColor: cardBackground }]}>
            <View style={styles.formHeader}>
              <ThemedText type="subtitle" style={styles.formTitle}>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </ThemedText>
              <TouchableOpacity onPress={resetForm}>
                <IconSymbol name="xmark.circle.fill" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Category Name */}
            <View style={styles.inputSection}>
              <ThemedText style={styles.inputLabel}>Name *</ThemedText>
              <TextInput
                style={[styles.textInput, { color: textColor, borderColor }]}
                value={categoryName}
                onChangeText={setCategoryName}
                placeholder="Enter category name..."
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Type Selection */}
            <View style={styles.inputSection}>
              <ThemedText style={styles.inputLabel}>Type</ThemedText>
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
                    size={20} 
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
                    size={20} 
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
            </View>

            {/* Icon Selection */}
            <View style={styles.inputSection}>
              <ThemedText style={styles.inputLabel}>Icon</ThemedText>
              <View style={styles.iconsGrid}>
                {categoryIcons.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    style={[
                      styles.iconButton,
                      selectedIcon === icon && styles.iconButtonActive,
                      { borderColor }
                    ]}
                    onPress={() => setSelectedIcon(icon)}
                  >
                    <IconSymbol 
                      name={icon} 
                      size={20} 
                      color={selectedIcon === icon ? tintColor : '#6B7280'} 
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Color Selection */}
            <View style={styles.inputSection}>
              <ThemedText style={styles.inputLabel}>Color</ThemedText>
              <View style={styles.colorsGrid}>
                {categoryColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorButton,
                      { backgroundColor: color },
                      selectedColor === color && styles.colorButtonActive
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <IconSymbol name="checkmark" size={16} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton, { borderColor }]}
                onPress={resetForm}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton, { backgroundColor: tintColor }]}
                onPress={editingCategory ? handleUpdateCategory : handleAddCategory}
              >
                <ThemedText style={styles.saveButtonText}>
                  {editingCategory ? 'Update' : 'Add'} Category
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        )}

        {/* Add Button */}
        {!showAddForm && (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: tintColor }]}
            onPress={() => setShowAddForm(true)}
          >
            <IconSymbol name="plus.circle.fill" size={24} color="#FFFFFF" />
            <ThemedText style={styles.addButtonText}>Add New Category</ThemedText>
          </TouchableOpacity>
        )}

        {/* Expense Categories */}
        <ThemedView style={[styles.section, { backgroundColor: cardBackground }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Expense Categories
          </ThemedText>
          <View style={styles.categoriesGrid}>
            {expenseCategories.map((category) => (
              <View key={category.id} style={styles.categoryCard}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <IconSymbol name={category.icon} size={24} color="#FFFFFF" />
                </View>
                <ThemedText style={styles.categoryName}>{category.name}</ThemedText>
                <View style={styles.categoryActions}>
                  <TouchableOpacity
                    style={styles.actionIcon}
                    onPress={() => startEdit(category)}
                  >
                    <IconSymbol name="pencil" size={16} color={tintColor} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionIcon}
                    onPress={() => handleDeleteCategory(category)}
                  >
                    <IconSymbol name="trash" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ThemedView>

        {/* Income Categories */}
        <ThemedView style={[styles.section, { backgroundColor: cardBackground }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Income Categories
          </ThemedText>
          <View style={styles.categoriesGrid}>
            {incomeCategories.map((category) => (
              <View key={category.id} style={styles.categoryCard}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <IconSymbol name={category.icon} size={24} color="#FFFFFF" />
                </View>
                <ThemedText style={styles.categoryName}>{category.name}</ThemedText>
                <View style={styles.categoryActions}>
                  <TouchableOpacity
                    style={styles.actionIcon}
                    onPress={() => startEdit(category)}
                  >
                    <IconSymbol name="pencil" size={16} color={tintColor} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionIcon}
                    onPress={() => handleDeleteCategory(category)}
                  >
                    <IconSymbol name="trash" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
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
  formContainer: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
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
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  typeButtonActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#3B82F6',
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorButtonActive: {
    borderWidth: 3,
    borderColor: '#3B82F6',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {},
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
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
  categoriesGrid: {
    gap: 12,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  categoryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionIcon: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
});

