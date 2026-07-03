import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {MonthlySummary} from '../../mock/dashboard';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {formatCurrency} from '../../utils/formatCurrency';
import {Card} from '../common/Card';

type SummaryCardProps = {
  summary: MonthlySummary;
};

const rows = [
  ['Revenus', 'income'],
  ['Dépenses', 'expenses'],
  ['Épargne', 'savings'],
] as const;

export function SummaryCard({summary}: SummaryCardProps) {
  return (
    <Card>
      <Text style={styles.title}>Ce mois</Text>
      <View style={styles.rows}>
        {rows.map(([label, key]) => (
          <View key={key} style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{formatCurrency(summary[key])}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  rows: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  value: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
});
