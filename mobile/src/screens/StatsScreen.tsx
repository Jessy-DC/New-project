import React from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {statsData} from '../mock/stats';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';
import {formatCurrency} from '../utils/formatCurrency';

type StatsScreenProps = {
  onOpenMenu?: () => void;
};

type FilterType = 'month' | 'quarter' | 'year';

const filters: Array<{id: FilterType; label: string}> = [
  {id: 'month', label: 'Ce mois'},
  {id: 'quarter', label: '3 derniers mois'},
  {id: 'year', label: 'Cette annee'},
];

function formatDeltaPercent(value: number) {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value} %`;
}

function formatSignedCurrency(value: number) {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${formatCurrency(value)}`;
}

export function StatsScreen({onOpenMenu}: StatsScreenProps) {
  const [activeFilter, setActiveFilter] = React.useState<FilterType>('month');
  const androidTopInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;

  return (
    <SafeAreaView style={[styles.safeArea, {paddingTop: androidTopInset}]}> 
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityLabel="Ouvrir le menu"
            accessibilityRole="button"
            onPress={onOpenMenu}
            style={({pressed}) => [styles.squareButton, pressed && styles.pressed]}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </Pressable>

          <Text style={styles.screenTitle}>Statistiques</Text>
        </View>

        <View style={styles.filtersRow}>
          {filters.map(filter => {
            const isActive = filter.id === activeFilter;

            return (
              <Pressable
                key={filter.id}
                onPress={() => setActiveFilter(filter.id)}
                style={[styles.filterPill, isActive && styles.filterPillActive]}>
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.goodNewsCard}>
          <View style={styles.goodNewsLeft}>
            <View style={styles.goodNewsIconWrap}>
              <Text style={styles.goodNewsIconText}>OK</Text>
            </View>
            <View style={styles.goodNewsMain}>
              <Text style={styles.goodNewsTitle}>Bonne nouvelle !</Text>
              <Text style={styles.goodNewsLabel}>Tu as economise</Text>
              <Text style={styles.goodNewsAmount}>{formatCurrency(statsData.savedDeltaAmount)}</Text>
              <Text style={styles.goodNewsSub}>par rapport au mois dernier.</Text>
            </View>
          </View>
          <View style={styles.confettiWrap}>
            <Text style={styles.confettiText}>***</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Repartition des depenses</Text>
          <View style={styles.distributionLayout}>
            <View style={styles.distributionChartWrap}>
              <View style={styles.ringWrap}>
                <View style={styles.ringOuter}>
                  <View style={styles.ringInner} />
                </View>
                <View style={[styles.ringDot, styles.dotTop, {backgroundColor: statsData.expenseSplit[0].color}]} />
                <View
                  style={[styles.ringDot, styles.dotTopRight, {backgroundColor: statsData.expenseSplit[1].color}]}
                />
                <View
                  style={[styles.ringDot, styles.dotBottomRight, {backgroundColor: statsData.expenseSplit[2].color}]}
                />
                <View
                  style={[styles.ringDot, styles.dotBottomLeft, {backgroundColor: statsData.expenseSplit[3].color}]}
                />
                <View style={[styles.ringDot, styles.dotLeft, {backgroundColor: statsData.expenseSplit[4].color}]} />
              </View>
            </View>

            <View style={styles.distributionLegend}>
              {statsData.expenseSplit.map(category => (
                <View key={category.id} style={styles.legendRow}>
                  <View style={[styles.legendIconWrap, {backgroundColor: category.iconBackground}]}>
                    <Text style={styles.legendIconText}>{category.iconLabel}</Text>
                  </View>

                  <View style={styles.legendMain}>
                    <Text numberOfLines={1} style={styles.legendLabel}>{category.label}</Text>
                  </View>

                  <View style={styles.legendRight}>
                    <Text style={styles.legendPercent}>{category.percent} %</Text>
                    <Text style={styles.legendAmount}>{formatCurrency(category.amount)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Essentiel vs Plaisir</Text>
          <View style={styles.dualRow}>
            <View style={styles.dualBlock}>
              <Text style={styles.essentialLabel}>Essentiel</Text>
              <Text style={styles.dualPercent}>{statsData.essentialsPercent} %</Text>
              <Text style={styles.dualAmount}>{formatCurrency(statsData.essentialsAmount)}</Text>
              <View style={styles.dualProgressTrack}>
                <View
                  style={[
                    styles.dualProgressFill,
                    {backgroundColor: colors.primary, width: `${statsData.essentialsPercent}%`},
                  ]}
                />
              </View>
            </View>

            <View style={styles.dualDivider} />

            <View style={styles.dualBlock}>
              <Text style={styles.pleasureLabel}>Plaisir</Text>
              <Text style={styles.dualPercent}>{statsData.pleasurePercent} %</Text>
              <Text style={styles.dualAmount}>{formatCurrency(statsData.pleasureAmount)}</Text>
              <View style={styles.dualProgressTrack}>
                <View
                  style={[
                    styles.dualProgressFill,
                    {backgroundColor: '#F18700', width: `${statsData.pleasurePercent}%`},
                  ]}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Evolution par rapport au mois dernier</Text>
          <View style={styles.trendsList}>
            {statsData.trends.map((trend, index) => {
              const isPositive = trend.deltaPercent > 0;
              const showSeparator = index < statsData.trends.length - 1;

              return (
                <View key={trend.id}>
                  <View style={styles.trendRow}>
                    <View style={[styles.trendIconWrap, {backgroundColor: trend.iconBackground}]}>
                      <Text style={styles.trendIconText}>{trend.iconLabel}</Text>
                    </View>
                    <Text style={styles.trendLabel}>{trend.label}</Text>
                    <Text style={[styles.trendArrow, isPositive && styles.trendArrowUp]}>
                      {isPositive ? '^' : 'v'}
                    </Text>
                    <Text style={[styles.trendPercent, isPositive ? styles.trendUp : styles.trendDown]}>
                      {formatDeltaPercent(trend.deltaPercent)}
                    </Text>
                    <Text style={styles.trendAmount}>{formatSignedCurrency(trend.deltaAmount)}</Text>
                  </View>
                  {showSeparator && <View style={styles.rowSeparator} />}
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.bestCard}>
          <Text style={styles.bestTitle}>Meilleure categorie</Text>
          <View style={styles.bestRow}>
            <View style={styles.bestIconWrap}>
              <Text style={styles.bestIconText}>TOP</Text>
            </View>
            <View style={styles.bestMain}>
              <Text style={styles.bestCategory}>{statsData.bestCategory.title}</Text>
              <Text style={styles.bestDescription}>
                Tu depenses {statsData.bestCategory.deltaPercent} % de moins qu en avril. Bravo !
              </Text>
            </View>
          </View>
        </View>
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
  screenTitle: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '900',
  },
  squareButton: {
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
  filtersRow: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    padding: spacing.xs,
  },
  filterPill: {
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    paddingVertical: spacing.sm,
  },
  filterPillActive: {
    backgroundColor: colors.surfaceMuted,
  },
  filterText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
  },
  filterTextActive: {
    color: colors.primary,
  },
  goodNewsCard: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  goodNewsLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: spacing.md,
  },
  goodNewsIconWrap: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  goodNewsIconText: {
    color: '#FFFFFF',
    fontSize: typography.small,
    fontWeight: '900',
  },
  goodNewsMain: {
    flex: 1,
    gap: spacing.xs,
  },
  goodNewsTitle: {
    color: colors.primary,
    fontSize: typography.heading,
    fontWeight: '900',
  },
  goodNewsLabel: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '600',
  },
  goodNewsAmount: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  goodNewsSub: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '600',
  },
  confettiWrap: {
    marginLeft: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  confettiText: {
    color: '#F08A00',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    padding: spacing.lg,
  },
  cardTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '900',
    marginBottom: spacing.md,
  },
  distributionLayout: {
    flexDirection: 'column',
    gap: spacing.md,
  },
  distributionChartWrap: {
    alignItems: 'center',
  },
  ringWrap: {
    alignItems: 'center',
    height: 140,
    justifyContent: 'center',
    position: 'relative',
    width: 140,
  },
  ringOuter: {
    alignItems: 'center',
    borderColor: '#DCEBE6',
    borderRadius: 999,
    borderWidth: 22,
    height: 132,
    justifyContent: 'center',
    width: 132,
  },
  ringInner: {
    backgroundColor: colors.surface,
    borderRadius: 999,
    height: 70,
    width: 70,
  },
  ringDot: {
    borderRadius: 999,
    height: 16,
    position: 'absolute',
    width: 16,
  },
  dotTop: {
    top: 8,
  },
  dotTopRight: {
    right: 20,
    top: 24,
  },
  dotBottomRight: {
    bottom: 20,
    right: 16,
  },
  dotBottomLeft: {
    bottom: 16,
    left: 26,
  },
  dotLeft: {
    left: 8,
    top: 64,
  },
  distributionLegend: {
    width: '100%',
    gap: spacing.xs,
  },
  legendRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: 2,
  },
  legendIconWrap: {
    alignItems: 'center',
    borderRadius: 8,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  legendIconText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '900',
  },
  legendMain: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  legendLabel: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '700',
  },
  legendRight: {
    alignItems: 'flex-end',
    minWidth: 62,
  },
  legendPercent: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '900',
  },
  legendAmount: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '600',
  },
  dualRow: {
    alignItems: 'stretch',
    flexDirection: 'row',
    gap: spacing.md,
  },
  dualBlock: {
    flex: 1,
    gap: spacing.xs,
  },
  dualDivider: {
    backgroundColor: colors.border,
    width: 1,
  },
  essentialLabel: {
    color: colors.primary,
    fontSize: typography.small,
    fontWeight: '900',
  },
  pleasureLabel: {
    color: '#F18700',
    fontSize: typography.small,
    fontWeight: '900',
  },
  dualPercent: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  dualAmount: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  dualProgressTrack: {
    backgroundColor: colors.progressTrack,
    borderRadius: 999,
    height: 12,
    overflow: 'hidden',
    width: '100%',
  },
  dualProgressFill: {
    borderRadius: 999,
    height: '100%',
  },
  trendsList: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  trendRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  trendIconWrap: {
    alignItems: 'center',
    borderRadius: 8,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  trendIconText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '900',
  },
  trendLabel: {
    color: colors.text,
    flex: 1,
    fontSize: typography.small,
    fontWeight: '700',
  },
  trendArrow: {
    color: colors.positive,
    fontSize: typography.heading,
    fontWeight: '900',
    marginRight: spacing.xs,
  },
  trendArrowUp: {
    color: '#DA3E3E',
  },
  trendPercent: {
    fontSize: typography.small,
    fontWeight: '900',
    minWidth: 54,
  },
  trendDown: {
    color: colors.positive,
  },
  trendUp: {
    color: '#DA3E3E',
  },
  trendAmount: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '700',
    minWidth: 64,
    textAlign: 'right',
  },
  rowSeparator: {
    backgroundColor: colors.border,
    height: 1,
    marginLeft: 44,
  },
  bestCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  bestTitle: {
    color: colors.primary,
    fontSize: typography.heading,
    fontWeight: '900',
  },
  bestRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  bestIconWrap: {
    alignItems: 'center',
    backgroundColor: '#E8F2E7',
    borderRadius: 999,
    height: 82,
    justifyContent: 'center',
    width: 82,
  },
  bestIconText: {
    color: '#70A535',
    fontSize: typography.small,
    fontWeight: '900',
  },
  bestMain: {
    flex: 1,
    gap: spacing.xs,
  },
  bestCategory: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.4,
    lineHeight: 32,
  },
  bestDescription: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '600',
    lineHeight: 22,
  },
  pressed: {
    opacity: 0.85,
  },
});
