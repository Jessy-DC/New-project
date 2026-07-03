import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {MainGoal} from '../../mock/dashboard';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {formatCurrency} from '../../utils/formatCurrency';
import {Card} from '../common/Card';
import {ProgressBar} from './ProgressBar';

type GoalCardProps = {
  goal: MainGoal;
};

export function GoalCard({goal}: GoalCardProps) {
  const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100);

  return (
    <Card>
      <Text style={styles.title}>Objectif principal</Text>
      <View style={styles.goalHeader}>
        <Text style={styles.goalTitle}>{goal.title}</Text>
        <Text style={styles.progress}>{progress} %</Text>
      </View>
      <ProgressBar value={progress} />
      <Text style={styles.amounts}>
        {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  goalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  goalTitle: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '800',
  },
  progress: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '800',
  },
  amounts: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '600',
    marginTop: spacing.md,
  },
});
