import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { InvestmentCard } from '@/components/finance/InvestmentCard';
import { colors } from '@/constants/colors';
import { useFinanceStore } from '@/store/finance-store';
import { getTotalRoundUps } from '@/mocks/transactions';
import { Plus, TrendingUp, Coins, ArrowUpRight } from 'lucide-react-native';

export default function InvestmentsScreen() {
  const { investments } = useFinanceStore();
  const [activeFilter, setActiveFilter] = useState<'all' | 'stocks' | 'etfs' | 'crypto' | 'roundups'>('all');
  
  // Filter investments based on active filter
  const filteredInvestments = investments.filter(investment => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'stocks') return investment.type === 'stock';
    if (activeFilter === 'etfs') return investment.type === 'etf';
    if (activeFilter === 'crypto') return investment.type === 'crypto';
    if (activeFilter === 'roundups') return investment.type === 'roundups';
    return true;
  });
  
  // Calculate totals
  const totalValue = investments.reduce((sum, investment) => sum + investment.value, 0);
  const totalInitial = investments.reduce((sum, investment) => sum + investment.initialValue, 0);
  const totalGrowth = ((totalValue - totalInitial) / totalInitial) * 100;
  
  // Get round-up data
  const roundUpInvestment = investments.find(inv => inv.type === 'roundups');
  const totalRoundUps = getTotalRoundUps();
  
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
        <Text style={styles.title}>Investments</Text>
        
        <TouchableOpacity style={[styles.iconButton, styles.addButton]}>
          <Plus size={20} color={colors.dark.text} />
        </TouchableOpacity>
      </View>
      
      <Card style={styles.overviewCard}>
        <Text style={styles.overviewTitle}>Portfolio Overview</Text>
        
        <View style={styles.overviewContent}>
          <View style={styles.valueContainer}>
            <Text style={styles.valueLabel}>Total Value</Text>
            <Text style={styles.valueAmount}>{formatCurrency(totalValue)}</Text>
            
            <View style={styles.growthContainer}>
              <ArrowUpRight size={16} color={totalGrowth >= 0 ? colors.positive : colors.accent} />
              <Text style={[
                styles.growthText,
                totalGrowth >= 0 ? styles.positiveGrowth : styles.negativeGrowth
              ]}>
                {totalGrowth >= 0 ? '+' : ''}{totalGrowth.toFixed(2)}%
              </Text>
            </View>
          </View>
          
          <ProgressRing
            progress={Math.min(totalGrowth, 100)}
            size={80}
            strokeWidth={8}
            color={totalGrowth >= 0 ? colors.positive : colors.accent}
            backgroundColor={`${totalGrowth >= 0 ? colors.positive : colors.accent}30`}
            showPercentage={false}
            label="Growth"
          />
        </View>
      </Card>
      
      <Card style={styles.roundUpsCard}>
        <View style={styles.roundUpsHeader}>
          <View style={styles.roundUpsIconContainer}>
            <Coins size={24} color={colors.secondary} />
          </View>
          <View>
            <Text style={styles.roundUpsTitle}>Round-Up Investments</Text>
            <Text style={styles.roundUpsSubtitle}>Invest your spare change</Text>
          </View>
        </View>
        
        <View style={styles.roundUpsContent}>
          <View style={styles.roundUpsStats}>
            <View style={styles.roundUpsStat}>
              <Text style={styles.roundUpsStatLabel}>Total Value</Text>
              <Text style={styles.roundUpsStatValue}>
                {formatCurrency(roundUpInvestment?.value || 0)}
              </Text>
            </View>
            
            <View style={styles.roundUpsStat}>
              <Text style={styles.roundUpsStatLabel}>This Month</Text>
              <Text style={styles.roundUpsStatValue}>
                {formatCurrency(totalRoundUps)}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.roundUpsButton}>
            <Text style={styles.roundUpsButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </Card>
      
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
            activeFilter === 'stocks' && styles.activeFilter
          ]}
          onPress={() => setActiveFilter('stocks')}
        >
          <Text style={[
            styles.filterText,
            activeFilter === 'stocks' && styles.activeFilterText
          ]}>
            Stocks
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'etfs' && styles.activeFilter
          ]}
          onPress={() => setActiveFilter('etfs')}
        >
          <Text style={[
            styles.filterText,
            activeFilter === 'etfs' && styles.activeFilterText
          ]}>
            ETFs
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'crypto' && styles.activeFilter
          ]}
          onPress={() => setActiveFilter('crypto')}
        >
          <Text style={[
            styles.filterText,
            activeFilter === 'crypto' && styles.activeFilterText
          ]}>
            Crypto
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredInvestments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <InvestmentCard investment={item} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.investmentsList}
      />
      
      <TouchableOpacity style={styles.addInvestmentButton}>
        <TrendingUp size={20} color={colors.primary} />
        <Text style={styles.addInvestmentText}>Add New Investment</Text>
      </TouchableOpacity>
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
    marginBottom: 16,
  },
  title: {
    color: colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: colors.primary,
  },
  overviewCard: {
    marginBottom: 16,
  },
  overviewTitle: {
    color: colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  overviewContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueContainer: {
    flex: 1,
  },
  valueLabel: {
    color: colors.dark.textSecondary,
    fontSize: 14,
  },
  valueAmount: {
    color: colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  growthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  growthText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  positiveGrowth: {
    color: colors.positive,
  },
  negativeGrowth: {
    color: colors.accent,
  },
  roundUpsCard: {
    marginBottom: 16,
  },
  roundUpsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  roundUpsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.secondary}30`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  roundUpsTitle: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
  },
  roundUpsSubtitle: {
    color: colors.dark.textSecondary,
    fontSize: 12,
  },
  roundUpsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roundUpsStats: {
    flex: 1,
  },
  roundUpsStat: {
    marginBottom: 8,
  },
  roundUpsStatLabel: {
    color: colors.dark.textSecondary,
    fontSize: 12,
  },
  roundUpsStatValue: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
  },
  roundUpsButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  roundUpsButtonText: {
    color: colors.dark.text,
    fontSize: 14,
    fontWeight: '600',
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
  investmentsList: {
    paddingVertical: 8,
  },
  addInvestmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.dark.border,
    borderStyle: 'dashed',
    marginVertical: 16,
  },
  addInvestmentText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});