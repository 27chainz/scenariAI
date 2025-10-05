import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { usePayments } from '@/contexts/PaymentContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SettingsScreen() {
  const { state, getPaymentStats } = usePayments();
  const colorScheme = useColorScheme();
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackground = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);

  const stats = getPaymentStats();

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Export your payment data to CSV format?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => {
            // In a real app, you would implement actual CSV export
            Alert.alert('Success', 'Data exported successfully!');
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your payments and categories. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Are you absolutely sure?',
              'This action cannot be undone and will delete all your financial data.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Yes, Delete Everything',
                  style: 'destructive',
                  onPress: () => {
                    // In a real app, you would implement actual data clearing
                    Alert.alert('Success', 'All data has been cleared.');
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About Payment Tracker',
      'Version 1.0.0\n\nA simple and elegant way to track your personal finances.\n\nBuilt with React Native and Expo.',
      [{ text: 'OK' }]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightComponent,
    destructive = false 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
    destructive?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[
          styles.settingIcon,
          { backgroundColor: destructive ? '#EF4444' + '20' : tintColor + '20' }
        ]}>
          <IconSymbol 
            name={icon} 
            size={20} 
            color={destructive ? '#EF4444' : tintColor} 
          />
        </View>
        <View style={styles.settingContent}>
          <ThemedText style={[
            styles.settingTitle,
            destructive && styles.destructiveText
          ]}>
            {title}
          </ThemedText>
          {subtitle && (
            <ThemedText style={styles.settingSubtitle}>
              {subtitle}
            </ThemedText>
          )}
        </View>
      </View>
      {rightComponent || (onPress && (
        <IconSymbol name="chevron.right" size={16} color="#9CA3AF" />
      ))}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            Settings
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Manage your app preferences
          </ThemedText>
        </View>

        {/* App Info */}
        <ThemedView style={[styles.section, { backgroundColor: cardBackground }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            App Information
          </ThemedText>
          
          <View style={styles.appInfoCard}>
            <View style={[styles.appIcon, { backgroundColor: tintColor }]}>
              <IconSymbol name="chart.bar.fill" size={32} color="#FFFFFF" />
            </View>
            <View style={styles.appInfo}>
              <ThemedText type="defaultSemiBold" style={styles.appName}>
                Payment Tracker
              </ThemedText>
              <ThemedText style={styles.appVersion}>
                Version 1.0.0
              </ThemedText>
              <ThemedText style={styles.appDescription}>
                Simple personal finance tracking
              </ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* Statistics */}
        <ThemedView style={[styles.section, { backgroundColor: cardBackground }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Your Statistics
          </ThemedText>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <ThemedText type="defaultSemiBold" style={styles.statValue}>
                {state.payments.length}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Transactions</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText type="defaultSemiBold" style={styles.statValue}>
                {state.categories.length}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Categories</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText type="defaultSemiBold" style={[styles.statValue, { color: '#10B981' }]}>
                ${stats.totalIncome.toLocaleString()}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Total Income</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText type="defaultSemiBold" style={[styles.statValue, { color: '#EF4444' }]}>
                ${stats.totalExpenses.toLocaleString()}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Total Expenses</ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* Preferences */}
        <ThemedView style={[styles.section, { backgroundColor: cardBackground }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Preferences
          </ThemedText>
          
          <SettingItem
            icon="bell.fill"
            title="Notifications"
            subtitle="Get reminders and updates"
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#E5E7EB', true: tintColor + '40' }}
                thumbColor={notificationsEnabled ? tintColor : '#FFFFFF'}
              />
            }
          />
          
          <SettingItem
            icon="faceid"
            title="Biometric Lock"
            subtitle="Secure your app with biometrics"
            rightComponent={
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: '#E5E7EB', true: tintColor + '40' }}
                thumbColor={biometricEnabled ? tintColor : '#FFFFFF'}
              />
            }
          />
          
          <SettingItem
            icon="icloud.fill"
            title="Auto Backup"
            subtitle="Automatically backup your data"
            rightComponent={
              <Switch
                value={autoBackupEnabled}
                onValueChange={setAutoBackupEnabled}
                trackColor={{ false: '#E5E7EB', true: tintColor + '40' }}
                thumbColor={autoBackupEnabled ? tintColor : '#FFFFFF'}
              />
            }
          />
        </ThemedView>

        {/* Data Management */}
        <ThemedView style={[styles.section, { backgroundColor: cardBackground }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Data Management
          </ThemedText>
          
          <SettingItem
            icon="square.and.arrow.up"
            title="Export Data"
            subtitle="Export your data to CSV"
            onPress={handleExportData}
          />
          
          <SettingItem
            icon="square.and.arrow.down"
            title="Import Data"
            subtitle="Import data from CSV file"
            onPress={() => Alert.alert('Coming Soon', 'Import functionality will be available in a future update.')}
          />
          
          <SettingItem
            icon="trash.fill"
            title="Clear All Data"
            subtitle="Permanently delete all data"
            onPress={handleClearData}
            destructive
          />
        </ThemedView>

        {/* Support */}
        <ThemedView style={[styles.section, { backgroundColor: cardBackground }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Support
          </ThemedText>
          
          <SettingItem
            icon="questionmark.circle.fill"
            title="Help & FAQ"
            subtitle="Get help with using the app"
            onPress={() => Alert.alert('Help', 'Help documentation will be available soon.')}
          />
          
          <SettingItem
            icon="envelope.fill"
            title="Contact Support"
            subtitle="Get in touch with our team"
            onPress={() => Alert.alert('Contact', 'support@paymenttracker.com')}
          />
          
          <SettingItem
            icon="star.fill"
            title="Rate App"
            subtitle="Leave a review on the App Store"
            onPress={() => Alert.alert('Thank you!', 'Your feedback helps us improve the app.')}
          />
          
          <SettingItem
            icon="info.circle.fill"
            title="About"
            subtitle="App version and information"
            onPress={handleAbout}
          />
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
  appInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  appIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 20,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  appDescription: {
    fontSize: 14,
    opacity: 0.6,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  destructiveText: {
    color: '#EF4444',
  },
});

