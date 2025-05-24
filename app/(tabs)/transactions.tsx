import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/Card';
import { TransactionItem } from '@/components/finance/TransactionItem';
import { colors } from '@/constants/colors';
import { useFinanceStore } from '@/store/finance-store';
import { Transaction } from '@/types/finance';
import { Filter, Plus, Search } from 'lucide-react-native';

export default function TransactionsScreen() {
  const { transactions } = useFinanceStore();
  const [activeFilter, setActiveFilter] = useState<'all' | 'income' | 'expense' | 'transfer'>('all');
  
  // Filter transactions based on active filter
  const filteredTransactions = transactions.filter(transaction => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'income') return transaction.type === 'income';
    if (activeFilter === 'expense') return transaction.type === 'expense';
    if (activeFilter === 'transfer') return transaction.type === 'transfer';
    return true;
  });
  
  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Group transactions by date
  const groupTransactionsByDate = (transactions: Transaction[]) => {
    const groups: { [key: string]: Transaction[] } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(transaction);
    });
    
    return Object.entries(groups).map(([date, transactions]) => ({
      date,
      transactions,
    }));
  };
  
  const groupedTransactions = groupTransactionsByDate(sortedTransactions);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });
    }
  };
  
  const calculateDailyTotal = (transactions: Transaction[]) => {
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  };
  
  const renderTransactionGroup = ({ item }: { item: { date: string; transactions: Transaction[] } }) => {
    const dailyTotal = calculateDailyTotal(item.transactions);
    
    return (
      <View style={styles.transactionGroup}>
        <View style={styles.dateHeader}>
          <Text style={styles.dateText}>{formatDate(item.date)}</Text>
          <Text style={[
            styles.dailyTotal,
            dailyTotal >= 0 ? styles.positiveAmount : styles.negativeAmount
          ]}>
            {dailyTotal >= 0 ? '+' : ''}
            ${Math.abs(dailyTotal).toFixed(2)}
          </Text>
        </View>
        
        <Card>
          {item.transactions.map(transaction => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
            />
          ))}
        </Card>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Search size={20} color={colors.dark.text} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconButton}>
            <Filter size={20} color={colors.dark.text} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.iconButton, styles.addButton]}>
            <Plus size={20} color={colors.dark.text} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'all' && styles.activeFilter
          ]}
          onPress={() => setActiveFilter('all')}
        >
          <Text style={[
            styles.filterText,
            activeFilter === 'all' && styles.activeFilterText
          ]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'income' && styles.activeFilter
          ]}
          onPress={() => setActiveFilter('income')}
        >
          <Text style={[
            styles.filterText,
            activeFilter === 'income' && styles.activeFilterText
          ]}>
            Income
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'expense' && styles.activeFilter
          ]}
          onPress={() => setActiveFilter('expense')}
        >
          <Text style={[
            styles.filterText,
            activeFilter === 'expense' && styles.activeFilterText
          ]}>
            Expenses
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'transfer' && styles.activeFilter
          ]}
          onPress={() => setActiveFilter('transfer')}
        >
          <Text style={[
            styles.filterText,
            activeFilter === 'transfer' && styles.activeFilterText
          ]}>
            Transfers
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={groupedTransactions}
        keyExtractor={(item) => item.date}
        renderItem={renderTransactionGroup}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.transactionsList}
      />
    </View>
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
    marginBottom: 16,
  },
  title: {
    color: colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: colors.primary,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: colors.dark.card,
  },
  activeFilter: {
    backgroundColor: colors.primary,
  },
  filterText: {
    color: colors.dark.textSecondary,
    fontSize: 14,
  },
  activeFilterText: {
    color: colors.dark.text,
    fontWeight: '600',
  },
  transactionsList: {
    paddingBottom: 16,
  },
  transactionGroup: {
    marginBottom: 16,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  dateText: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
  },
  dailyTotal: {
    fontSize: 16,
    fontWeight: '600',
  },
  positiveAmount: {
    color: colors.positive,
  },
  negativeAmount: {
    color: colors.accent,
  },
});