import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {Card} from '../common/Card';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {formatCurrency} from '../../utils/formatCurrency';

type BudgetCardProps = {
  amount: number;
  delta: number;
};

export function BudgetCard({amount, delta}: BudgetCardProps) {
  const deltaPrefix = delta >= 0 ? '+' : '';

  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.marker} />
        <Text style={styles.title}>Disponible</Text>
      </View>
      <Text style={styles.amount}>{formatCurrency(amount)}</Text>
      <Text style={styles.delta}>
        {deltaPrefix}
        {formatCurrency(delta)} vs mois dernier
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  marker: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
    borderRadius: 999,
    borderWidth: 3,
    height: 18,
    width: 18,
  },
  title: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  amount: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '800',
    marginTop: spacing.xl,
    textAlign: 'center',
  },
  delta: {
    color: colors.positive,
    fontSize: typography.small,
    fontWeight: '600',
    marginTop: spacing.xl,
  },
});
