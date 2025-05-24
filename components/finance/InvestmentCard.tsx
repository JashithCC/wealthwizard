import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Investment } from '@/types/finance';
import { colors } from '@/constants/colors';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface InvestmentCardProps {
  investment: Investment;
}

export const InvestmentCard: React.FC<InvestmentCardProps> = ({
  investment
}) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  const formatGrowth = (growth: number) => {
    return `${growth >= 0 ? '+' : ''}${growth.toFixed(2)}%`;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{investment.name}</Text>
        <View style={[
          styles.typeTag,
          investment.type === 'roundups' && styles.roundupsTag
        ]}>
          <Text style={styles.typeText}>
            {investment.type.toUpperCase()}
          </Text>
        </View>
      </View>
      
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{formatCurrency(investment.value)}</Text>
        <View style={styles.growthContainer}>
          {investment.growth >= 0 ? (
            <TrendingUp size={16} color={colors.positive} />
          ) : (
            <TrendingDown size={16} color={colors.accent} />
          )}
          <Text style={[
            styles.growth,
            investment.growth >= 0 ? styles.positiveGrowth : styles.negativeGrowth
          ]}>
            {formatGrowth(investment.growth)}
          </Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.initialValue}>
          Initial: {formatCurrency(investment.initialValue)}
        </Text>
        <Text style={styles.lastUpdated}>
          Updated: {formatDate(investment.lastUpdated)}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 4,
    width: 220,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  typeTag: {
    backgroundColor: `${colors.primary}30`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roundupsTag: {
    backgroundColor: `${colors.secondary}30`,
  },
  typeText: {
    color: colors.dark.text,
    fontSize: 10,
    fontWeight: '600',
  },
  valueContainer: {
    marginBottom: 12,
  },
  value: {
    color: colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  growthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  growth: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  positiveGrowth: {
    color: colors.positive,
  },
  negativeGrowth: {
    color: colors.accent,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  initialValue: {
    color: colors.dark.textSecondary,
    fontSize: 12,
  },
  lastUpdated: {
    color: colors.dark.textSecondary,
    fontSize: 12,
  },
});