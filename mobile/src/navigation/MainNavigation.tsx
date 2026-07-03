import React from 'react';
import {
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {DashboardScreen} from '../screens/DashboardScreen';
import {GoalsScreen} from '../screens/GoalsScreen';
import {StatsScreen} from '../screens/StatsScreen';
import {TransactionsScreen} from '../screens/TransactionsScreen';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';

type ScreenId = 'dashboard' | 'transactions' | 'goals' | 'stats';

type PlaceholderScreenProps = {
  title: string;
  onOpenMenu?: () => void;
};

function PlaceholderScreen({title, onOpenMenu}: PlaceholderScreenProps) {
  const androidTopInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;

  return (
    <SafeAreaView style={[styles.placeholderSafeArea, {paddingTop: androidTopInset}]}>
      <View style={styles.placeholderTopBar}>
        <Pressable
          accessibilityLabel="Ouvrir le menu"
          accessibilityRole="button"
          onPress={onOpenMenu}
          style={({pressed}) => [styles.hamburgerButton, pressed && styles.pressed]}>
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
        </Pressable>
        <Text style={styles.placeholderScreenTitle}>{title}</Text>
      </View>

      <View style={styles.placeholderCard}>
        <Text style={styles.placeholderTitle}>{title}</Text>
        <Text style={styles.placeholderText}>Ecran en preparation.</Text>
      </View>
    </SafeAreaView>
  );
}

const bottomTabs: Array<{id: ScreenId; label: string; symbol: string}> = [
  {id: 'dashboard', label: 'Tableau de bord', symbol: 'D'},
  {id: 'transactions', label: 'Transactions', symbol: 'T'},
  {id: 'goals', label: 'Objectifs', symbol: 'O'},
  {id: 'stats', label: 'Statistiques', symbol: 'S'},
];

export function MainNavigation() {
  const [activeScreen, setActiveScreen] = React.useState<ScreenId>('dashboard');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isGoalsPrimaryView, setIsGoalsPrimaryView] = React.useState(true);
  const [isTransactionsPrimaryView, setIsTransactionsPrimaryView] = React.useState(true);
  const androidTopInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;
  const bottomOffset = Platform.OS === 'android' ? spacing.md : 0;

  const closeMenu = () => setIsMenuOpen(false);

  const openScreenFromMenu = (screen: ScreenId) => {
    setActiveScreen(screen);
    closeMenu();
  };

  const shouldShowBottomNav =
    activeScreen === 'dashboard' ||
    activeScreen === 'stats' ||
    (activeScreen === 'goals' && isGoalsPrimaryView) ||
    (activeScreen === 'transactions' && isTransactionsPrimaryView);

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>
        {activeScreen === 'dashboard' && <DashboardScreen onOpenMenu={() => setIsMenuOpen(true)} />}
        {activeScreen === 'transactions' && (
          <TransactionsScreen
            onNavigateDashboard={() => setActiveScreen('dashboard')}
            onOpenMenu={() => setIsMenuOpen(true)}
            onPrimaryViewChange={setIsTransactionsPrimaryView}
          />
        )}
        {activeScreen === 'goals' && (
          <GoalsScreen
            onOpenMenu={() => setIsMenuOpen(true)}
            onPrimaryViewChange={setIsGoalsPrimaryView}
          />
        )}
        {activeScreen === 'stats' && <StatsScreen onOpenMenu={() => setIsMenuOpen(true)} />}
      </View>

      {shouldShowBottomNav && (
        <View style={[styles.bottomNav, {marginBottom: bottomOffset, paddingBottom: spacing.md + bottomOffset}]}> 
          {bottomTabs.map(tab => {
            const isActive = activeScreen === tab.id;

            return (
              <Pressable
                key={tab.id}
                accessibilityLabel={`Aller a ${tab.label}`}
                accessibilityRole="button"
                onPress={() => setActiveScreen(tab.id)}
                style={({pressed}) => [styles.bottomNavItem, pressed && styles.pressed]}>
                <View style={[styles.bottomNavIconWrap, isActive && styles.bottomNavIconWrapActive]}>
                  <Text style={[styles.bottomNavIcon, isActive && styles.bottomNavIconActive]}>{tab.symbol}</Text>
                </View>
                <Text style={[styles.bottomNavLabel, isActive && styles.bottomNavLabelActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      <Modal
        animationType="fade"
        onRequestClose={closeMenu}
        transparent
        visible={isMenuOpen}>
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={closeMenu} />

          <View style={[styles.menuPanel, {paddingTop: androidTopInset + spacing.xl}]}> 
            <Text style={styles.menuTitle}>Menu</Text>

            <Pressable onPress={() => openScreenFromMenu('dashboard')} style={styles.menuItem}>
              <Text style={styles.menuItemText}>Tableau de bord</Text>
            </Pressable>

            <Pressable onPress={() => openScreenFromMenu('transactions')} style={styles.menuItem}>
              <Text style={styles.menuItemText}>Transactions</Text>
            </Pressable>

            <Pressable onPress={() => openScreenFromMenu('goals')} style={styles.menuItem}>
              <Text style={styles.menuItemText}>Objectifs</Text>
            </Pressable>

            <Pressable onPress={() => openScreenFromMenu('stats')} style={styles.menuItem}>
              <Text style={styles.menuItemText}>Statistiques</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  bottomNav: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.sm,
  },
  bottomNavItem: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.xs,
    justifyContent: 'center',
    minHeight: 64,
  },
  bottomNavIconWrap: {
    alignItems: 'center',
    borderRadius: 12,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  bottomNavIconWrapActive: {
    backgroundColor: colors.primarySoft,
  },
  bottomNavIcon: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '900',
  },
  bottomNavIconActive: {
    color: colors.primary,
  },
  bottomNavLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  bottomNavLabelActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.28)',
    flex: 1,
  },
  backdrop: {
    flex: 1,
  },
  menuPanel: {
    backgroundColor: colors.surface,
    borderRightColor: colors.border,
    borderRightWidth: 1,
    bottom: 0,
    left: 0,
    maxWidth: 320,
    position: 'absolute',
    paddingHorizontal: spacing.lg,
    top: 0,
    width: '78%',
  },
  menuTitle: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '900',
    marginBottom: spacing.lg,
  },
  menuItem: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    paddingVertical: spacing.md,
  },
  menuItemText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  placeholderSafeArea: {
    backgroundColor: colors.background,
    flex: 1,
    padding: spacing.lg,
  },
  placeholderTopBar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
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
  placeholderScreenTitle: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.85,
  },
  placeholderCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    padding: spacing.lg,
  },
  placeholderTitle: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '800',
  },
  placeholderText: {
    color: colors.textMuted,
    fontSize: typography.body,
    marginTop: spacing.sm,
  },
});
