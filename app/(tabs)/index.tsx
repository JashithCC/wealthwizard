import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AccountCard } from '@/components/finance/AccountCard';
import { TransactionItem } from '@/components/finance/TransactionItem';
import { InsightCard } from '@/components/finance/InsightCard';
import { BalanceChart } from '@/components/finance/BalanceChart';
import { colors } from '@/constants/colors';
import { useFinanceStore } from '@/store/finance-store';
import { mockUserProfile } from '@/mocks/user';
import { getRecentTransactions } from '@/mocks/transactions';
import { getRecentInsights } from '@/mocks/insights';
import { 
  User, 
  Bell, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  Settings
} from 'lucide-react-native';

export default function DashboardScreen() {
  const router = useRouter();
  const { 
    accounts, 
    transactions, 
    forecast,
    insights,
    selectedAccountId,
    setSelectedAccountId,
    markInsightAsRead
  } = useFinanceStore();
  
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  
  // Get recent data
  const recentTransactions = getRecentTransactions(5);
  const recentInsights = getRecentInsights(5);
  
  // Calculate totals
  const totalBalance = accounts
    .filter(account => account.type !== 'credit')
    .reduce((sum, account) => sum + account.balance, 0);
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const handleAccountPress = (accountId: string) => {
    setSelectedAccountId(accountId);
  };
  
  const handleInsightPress = (insightId: string) => {
    markInsightAsRead(insightId);
  };
  
  const handleProfilePress = () => {
    router.push('/profile');
  };
  
  const handleSettingsPress = () => {
    router.push('/settings');
  };
  
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={handleProfilePress}
          >
            {mockUserProfile.avatar ? (
              <View style={styles.avatar}>
                <User size={24} color={colors.dark.text} />
              </View>
            ) : (
              <View style={styles.avatar}>
                <User size={24} color={colors.dark.text} />
              </View>
            )}
          </TouchableOpacity>
          
          <View>
            <Text style={styles.greeting}>Hello, {mockUserProfile.name.split(' ')[0]}</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={24} color={colors.dark.text} />
            {recentInsights.some(insight => !insight.read) && (
              <View style={styles.notificationBadge} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={handleSettingsPress}
          >
            <Settings size={24} color={colors.dark.text} />
          </TouchableOpacity>
        </View>
      </View>
      
      <Card style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>{formatCurrency(totalBalance)}</Text>
        
        <View style={styles.incomeExpenseContainer}>
          <View style={styles.incomeContainer}>
            <View style={styles.incomeIconContainer}>
              <ArrowUpRight size={16} color={colors.positive} />
            </View>
            <View>
              <Text style={styles.incomeLabel}>Income</Text>
              <Text style={styles.incomeAmount}>{formatCurrency(totalIncome)}</Text>
            </View>
          </View>
          
          <View style={styles.expenseContainer}>
            <View style={styles.expenseIconContainer}>
              <ArrowDownRight size={16} color={colors.accent} />
            </View>
            <View>
              <Text style={styles.expenseLabel}>Expenses</Text>
              <Text style={styles.expenseAmount}>{formatCurrency(totalExpenses)}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.timeRangeSelector}>
          <TouchableOpacity
            style={[
              styles.timeRangeButton,
              timeRange === 'week' && styles.activeTimeRange
            ]}
            onPress={() => setTimeRange('week')}
          >
            <Text style={[
              styles.timeRangeText,
              timeRange === 'week' && styles.activeTimeRangeText
            ]}>
              Week
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.timeRangeButton,
              timeRange === 'month' && styles.activeTimeRange
            ]}
            onPress={() => setTimeRange('month')}
          >
            <Text style={[
              styles.timeRangeText,
              timeRange === 'month' && styles.activeTimeRangeText
            ]}>
              Month
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.timeRangeButton,
              timeRange === 'year' && styles.activeTimeRange
            ]}
            onPress={() => setTimeRange('year')}
          >
            <Text style={[
              styles.timeRangeText,
              timeRange === 'year' && styles.activeTimeRangeText
            ]}>
              Year
            </Text>
          </TouchableOpacity>
        </View>
        
        <BalanceChart data={forecast.slice(0, timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365)} />
      </Card>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Accounts</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AccountCard
            account={item}
            onPress={() => handleAccountPress(item.id)}
            selected={item.id === selectedAccountId}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.accountsList}
      />
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Insights</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={recentInsights}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <InsightCard
            insight={item}
            onPress={() => handleInsightPress(item.id)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.insightsList}
      />
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      <Card style={styles.transactionsCard}>
        {recentTransactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
          />
        ))}
        
        <Button
          title="Add Transaction"
          variant="outline"
          size="small"
          style={styles.addTransactionButton}
          icon={<Plus size={16} color={colors.primary} />}
          onPress={() => {}}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}30`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    color: colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
  },
  date: {
    color: colors.dark.textSecondary,
    fontSize: 14,
  },
  headerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  balanceCard: {
    marginBottom: 24,
  },
  balanceLabel: {
    color: colors.dark.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  balanceAmount: {
    color: colors.dark.text,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  incomeExpenseContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  incomeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  incomeIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.positive}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  incomeLabel: {
    color: colors.dark.textSecondary,
    fontSize: 12,
  },
  incomeAmount: {
    color: colors.positive,
    fontSize: 16,
    fontWeight: '600',
  },
  expenseContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.accent}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  expenseLabel: {
    color: colors.dark.textSecondary,
    fontSize: 12,
  },
  expenseAmount: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  timeRangeSelector: {
    flexDirection: 'row',
    backgroundColor: colors.dark.cardAlt,
    borderRadius: 20,
    padding: 4,
    marginBottom: 16,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 16,
  },
  activeTimeRange: {
    backgroundColor: colors.dark.card,
  },
  timeRangeText: {
    color: colors.dark.textSecondary,
    fontSize: 14,
  },
  activeTimeRangeText: {
    color: colors.primary,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
  },
  seeAllText: {
    color: colors.primary,
    fontSize: 14,
  },
  accountsList: {
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  insightsList: {
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  transactionsCard: {
    marginBottom: 24,
  },
  addTransactionButton: {
    marginTop: 16,
  },
});