import React from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
  View,
} from 'react-native';

import {BudgetCard} from '../components/dashboard/BudgetCard';
import {GoalCard} from '../components/dashboard/GoalCard';
import {InsightCard} from '../components/dashboard/InsightCard';
import {SummaryCard} from '../components/dashboard/SummaryCard';
import {dashboardData} from '../mock/dashboard';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';

type DashboardScreenProps = {
  onOpenMenu?: () => void;
};

export function DashboardScreen({onOpenMenu}: DashboardScreenProps) {
  const androidTopInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;

  return (
    <SafeAreaView style={[styles.safeArea, {paddingTop: androidTopInset}]}> 
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityLabel="Ouvrir le menu"
            accessibilityRole="button"
            onPress={onOpenMenu}
            style={({pressed}) => [styles.hamburgerButton, pressed && styles.pressed]}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </Pressable>
          <Text style={styles.screenTitle}>Tableau de bord</Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.greeting}>
            Bonjour {dashboardData.userFirstName}
          </Text>
          <Text style={styles.period}>{dashboardData.periodLabel}</Text>
        </View>

        <BudgetCard
          amount={dashboardData.availableAmount}
          delta={dashboardData.availableDelta}
        />
        <SummaryCard summary={dashboardData.summary} />
        <GoalCard goal={dashboardData.mainGoal} />
        <InsightCard
          highlight={dashboardData.insight.highlight}
          description={dashboardData.insight.description}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    gap: spacing.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  hamburgerButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  hamburgerLine: {
    backgroundColor: colors.text,
    borderRadius: 999,
    height: 2,
    marginVertical: 2,
    width: 18,
  },
  screenTitle: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.85,
  },
  header: {
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
  },
  greeting: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '900',
  },
  period: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
});
