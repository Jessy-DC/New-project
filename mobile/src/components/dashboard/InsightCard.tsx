import React from 'react';
import {StyleSheet, Text} from 'react-native';

import {Card} from '../common/Card';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';

type InsightCardProps = {
  highlight: string;
  description: string;
};

export function InsightCard({highlight, description}: InsightCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Insight</Text>
      <Text style={styles.text}>
        Tu as dépensé <Text style={styles.highlight}>{highlight}</Text>{' '}
        {description}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primarySoft,
    borderColor: '#C9DED8',
  },
  title: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  text: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '600',
    lineHeight: 29,
    marginTop: spacing.lg,
  },
  highlight: {
    color: colors.primary,
    fontWeight: '900',
  },
});
