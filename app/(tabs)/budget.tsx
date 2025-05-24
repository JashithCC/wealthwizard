import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { BudgetCard } from '@/components/finance/BudgetCard';
import { colors } from '@/constants/colors';
import { useFinanceStore } from '@/store/finance-store';
import { Plus, Settings } from 'lucide-react-native';

export default function BudgetScreen() {
  const { budgets } = useFinanceStore();
  
  // Calculate total budget and spending
  const totalAllocated = budgets.reduce((sum, budget) => sum + budget.allocated, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const overallProgress = (totalSpent / totalAllocated) * 100;
  
  // Sort budgets by percentage spent (highest first)
  const sortedBudgets = [...budgets].sort(
    (a, b) => (b.spent / b.allocated) - (a.spent / a.allocated)
  );
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Budget</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Settings size={20} color={colors.dark.text} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.iconButton, styles.addButton]}>
            <Plus size={20} color={colors.dark.text} />
          </TouchableOpacity>
        </View>
      </View>
      
      <Card style={styles.overviewCard}>
        <Text style={styles.overviewTitle}>Monthly Overview</Text>
        
        <View style={styles.overviewContent}>
          <ProgressRing
            progress={overallProgress}
            size={120}
            strokeWidth={12}
            color={overallProgress >= 100 ? colors.accent : colors.primary}
            backgroundColor={`${overallProgress >= 100 ? colors.accent : colors.primary}30`}
            showPercentage={true}
            label="of budget used"
          />
          
          <View style={styles.overviewDetails}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Total Budget</Text>
              <Text style={styles.overviewValue}>${totalAllocated.toFixed(2)}</Text>
            </View>
            
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Spent</Text>
              <Text style={styles.overviewValue}>${totalSpent.toFixed(2)}</Text>
            </View>
            
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Remaining</Text>
              <Text style={[
                styles.overviewValue,
                totalAllocated - totalSpent < 0 ? styles.negativeAmount : styles.positiveAmount
              ]}>
                ${Math.abs(totalAllocated - totalSpent).toFixed(2)}
                {totalAllocated - totalSpent < 0 ? ' over' : ''}
              </Text>
            </View>
          </View>
        </View>
      </Card>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Category Budgets</Text>
      </View>
      
      {sortedBudgets.map(budget => (
        <BudgetCard key={budget.id} budget={budget} />
      ))}
      
      <TouchableOpacity style={styles.addCategoryButton}>
        <Plus size={20} color={colors.primary} />
        <Text style={styles.addCategoryText}>Add Budget Category</Text>
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
  overviewCard: {
    marginBottom: 24,
  },
  overviewTitle: {
    color: colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  overviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overviewDetails: {
    flex: 1,
    marginLeft: 24,
  },
  overviewItem: {
    marginBottom: 16,
  },
  overviewLabel: {
    color: colors.dark.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  overviewValue: {
    color: colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
  },
  positiveAmount: {
    color: colors.positive,
  },
  negativeAmount: {
    color: colors.accent,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
  },
  addCategoryButton: {
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
  addCategoryText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});