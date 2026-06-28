import React from 'react';
import {
  Animated,
  PanResponder,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {Transaction, transactionsData, TransactionTag, TransactionType} from '../mock/transactions';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';

type FilterType = 'all' | TransactionType;
type ViewMode = 'list' | 'form' | 'success';
type KindType = 'expense' | 'income';
type TransactionUseType = 'essential' | 'pleasure';
type PaymentMethod = 'card' | 'cash' | 'transfer';

type TransactionsScreenProps = {
  onOpenMenu?: () => void;
  onNavigateDashboard?: () => void;
  onPrimaryViewChange?: (isPrimaryView: boolean) => void;
};

type CreateTransactionState = {
  kind: KindType;
  amountInput: string;
  dateLabel: string;
  category: string;
  categoryIcon: string;
  categoryBackground: string;
  title: string;
  useType: TransactionUseType;
  project: string;
  paymentMethod: PaymentMethod;
  note: string;
};

type FormState = CreateTransactionState;

const filters: Array<{id: FilterType; label: string}> = [
  {id: 'all', label: 'Toutes'},
  {id: 'expense', label: 'Depenses'},
  {id: 'income', label: 'Revenus'},
];

const categoryChips: Array<{id: string; label: string; icon: string; background: string}> = [
  {id: 'food', label: 'Restauration', icon: 'UT', background: '#F6E7DF'},
  {id: 'grocery', label: 'Courses', icon: 'CO', background: '#E9F1E8'},
  {id: 'transport', label: 'Transport', icon: 'TR', background: '#E6EEF8'},
  {id: 'home', label: 'Logement', icon: 'LG', background: '#EEE6DF'},
  {id: 'other', label: 'Plus', icon: 'PL', background: '#ECECEC'},
];

const SWIPE_OPEN_OFFSET = 140;


function formatAmount(value: number) {
  const prefix = value > 0 ? '+' : '';

  return `${prefix}${new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`;
}

function parseAmountInput(value: string) {
  const normalized = value.replace(',', '.').replace(/[^\d.]/g, '');
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return parsed;
}

function getTagStyle(tag: TransactionTag) {
  if (tag === 'pleasure') {
    return {
      color: '#D67316',
      label: 'Plaisir',
    };
  }

  if (tag === 'income') {
    return {
      color: colors.positive,
      label: 'Revenus',
    };
  }

  return {
    color: colors.positive,
    label: 'Essentiel',
  };
}

function getPaymentMethodLabel(method: PaymentMethod) {
  if (method === 'cash') {
    return 'Especes';
  }

  if (method === 'transfer') {
    return 'Virement';
  }

  return 'Carte bancaire';
}

function getDefaultFormState(): FormState {
  return {
    kind: 'expense',
    amountInput: '18,50',
    category: 'Restauration',
    categoryIcon: 'UT',
    categoryBackground: '#F6E7DF',
    dateLabel: '14 juin 2026',
    title: 'Burger King',
    useType: 'pleasure',
    project: 'Aucun projet',
    paymentMethod: 'card',
    note: '',
  };
}

function getFormStateFromTransaction(transaction: Transaction): FormState {
  return {
    kind: transaction.type,
    amountInput: String(Math.abs(transaction.amount)).replace('.', ','),
    category: transaction.category,
    categoryIcon: transaction.iconLabel,
    categoryBackground: transaction.iconBackground,
    dateLabel: '14 juin 2026',
    title: transaction.title,
    useType: transaction.tag === 'pleasure' ? 'pleasure' : 'essential',
    project: 'Aucun projet',
    paymentMethod: 'card',
    note: '',
  };
}

function getTransactionFromForm(formState: FormState, id: string): Transaction {
  const rawAmount = Math.max(parseAmountInput(formState.amountInput), 0);
  const amount = Math.round(rawAmount * 100) / 100;
  const signedAmount = formState.kind === 'income' ? amount : -amount;
  const tag: TransactionTag =
    formState.kind === 'income' ? 'income' : formState.useType === 'pleasure' ? 'pleasure' : 'essential';

  return {
    id,
    amount: signedAmount,
    category: formState.category,
    iconBackground: formState.categoryBackground,
    iconLabel: formState.categoryIcon,
    tag,
    title: formState.title.trim() || 'Nouvelle transaction',
    type: formState.kind,
  };
}

type SwipeableTransactionRowProps = {
  transaction: Transaction;
  showSeparator: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

function SwipeableTransactionRow({
  transaction,
  showSeparator,
  onEdit,
  onDelete,
}: SwipeableTransactionRowProps) {
  const tagStyle = getTagStyle(transaction.tag);
  const translateX = React.useRef(new Animated.Value(0)).current;
  const startOffsetRef = React.useRef(0);

  const animateTo = React.useCallback(
    (target: number) => {
      Animated.spring(translateX, {
        toValue: target,
        useNativeDriver: true,
        bounciness: 0,
        speed: 18,
      }).start(({finished}) => {
        if (finished) {
          startOffsetRef.current = target;
        }
      });
    },
    [translateX],
  );

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return (
            Math.abs(gestureState.dx) > 10 &&
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
          );
        },
        onPanResponderGrant: () => {
          translateX.stopAnimation(value => {
            startOffsetRef.current = value;
          });
        },
        onPanResponderMove: (_, gestureState) => {
          const next = Math.max(0, Math.min(SWIPE_OPEN_OFFSET, startOffsetRef.current + gestureState.dx));
          translateX.setValue(next);
        },
        onPanResponderRelease: (_, gestureState) => {
          const projected = startOffsetRef.current + gestureState.dx;
          const shouldOpen = projected > SWIPE_OPEN_OFFSET * 0.45 || gestureState.vx > 0.45;

          animateTo(shouldOpen ? SWIPE_OPEN_OFFSET : 0);
        },
        onPanResponderTerminate: () => animateTo(0),
      }),
    [animateTo, translateX],
  );

  return (
    <View style={styles.swipeRowContainer}>
      <View style={styles.swipeActionsLayer}>
        <Pressable
          onPress={onEdit}
          style={[styles.swipeActionButton, styles.editActionButton]}>
          <Text style={styles.swipeActionText}>Modifier</Text>
        </Pressable>
        <Pressable
          onPress={onDelete}
          style={[styles.swipeActionButton, styles.deleteActionButton]}>
          <Text style={styles.swipeActionText}>Supprimer</Text>
        </Pressable>
      </View>

      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.swipeContent, {transform: [{translateX}]}]}>
        <View style={styles.row}>
          <View style={[styles.rowIconWrap, {backgroundColor: transaction.iconBackground}]}>
            <Text style={styles.rowIconText}>{transaction.iconLabel}</Text>
          </View>

          <View style={styles.rowMain}>
            <Text numberOfLines={1} style={styles.rowTitle}>
              {transaction.title}
            </Text>
            <Text numberOfLines={1} style={styles.rowCategory}>
              {transaction.category}
            </Text>
          </View>

          <View style={styles.rowAmountWrap}>
            <Text
              style={[
                styles.rowAmount,
                transaction.type === 'income' && styles.rowAmountIncome,
              ]}>
              {formatAmount(transaction.amount)}
            </Text>
            <Text style={[styles.rowTag, {color: tagStyle.color}]}>{tagStyle.label}</Text>
          </View>
        </View>

        {showSeparator && <View style={styles.rowSeparator} />}
      </Animated.View>
    </View>
  );
}

export function TransactionsScreen({
  onOpenMenu,
  onNavigateDashboard,
  onPrimaryViewChange,
}: TransactionsScreenProps) {
  const [activeFilter, setActiveFilter] = React.useState<FilterType>('all');
  const [viewMode, setViewMode] = React.useState<ViewMode>('list');
  const [sections, setSections] = React.useState(transactionsData.sections);
  const [formState, setFormState] = React.useState<FormState>(getDefaultFormState());
  const [editingTransactionId, setEditingTransactionId] = React.useState<string | null>(null);
  const [createdTransaction, setCreatedTransaction] = React.useState<Transaction | null>(null);

  const androidTopInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;

  React.useEffect(() => {
    onPrimaryViewChange?.(viewMode === 'list');

    return () => {
      onPrimaryViewChange?.(true);
    };
  }, [onPrimaryViewChange, viewMode]);

  const filteredSections = React.useMemo(() => {
    return sections
      .map(section => ({
        ...section,
        transactions: section.transactions.filter(transaction => {
          if (activeFilter === 'all') {
            return true;
          }

          return transaction.type === activeFilter;
        }),
      }))
      .filter(section => section.transactions.length > 0);
  }, [activeFilter, sections]);

  const monthExpenses = sections.reduce((sum, section) => {
    return (
      sum +
      section.transactions.reduce((innerSum, transaction) => {
        if (transaction.amount < 0) {
          return innerSum + Math.abs(transaction.amount);
        }

        return innerSum;
      }, 0)
    );
  }, 0);

  const monthIncome = sections.reduce((sum, section) => {
    return (
      sum +
      section.transactions.reduce((innerSum, transaction) => {
        if (transaction.amount > 0) {
          return innerSum + transaction.amount;
        }

        return innerSum;
      }, 0)
    );
  }, 0);

  const openCreateForm = () => {
    setEditingTransactionId(null);
    setFormState(getDefaultFormState());
    setViewMode('form');
  };

  const openEditForm = (transaction: Transaction) => {
    setEditingTransactionId(transaction.id);
    setFormState(getFormStateFromTransaction(transaction));
    setViewMode('form');
  };

  const handleDelete = (transactionId: string) => {
    setSections(prev =>
      prev
        .map(section => ({
          ...section,
          transactions: section.transactions.filter(item => item.id !== transactionId),
        }))
        .filter(section => section.transactions.length > 0),
    );
  };

  const handleSave = () => {
    const id = editingTransactionId ?? `created-${Date.now()}`;
    const nextTransaction = getTransactionFromForm(formState, id);

    setSections(prev => {
      if (editingTransactionId) {
        return prev.map(section => ({
          ...section,
          transactions: section.transactions.map(item =>
            item.id === editingTransactionId ? nextTransaction : item,
          ),
        }));
      }

      const todayIndex = prev.findIndex(section => section.id === 'today');

      if (todayIndex >= 0) {
        return prev.map((section, index) => {
          if (index !== todayIndex) {
            return section;
          }

          return {
            ...section,
            transactions: [nextTransaction, ...section.transactions],
          };
        });
      }

      return [
        {
          id: 'today',
          label: "Aujourd'hui",
          transactions: [nextTransaction],
        },
        ...prev,
      ];
    });

    setCreatedTransaction(nextTransaction);
    setEditingTransactionId(null);
    setViewMode('success');
  };

  if (viewMode === 'form') {
    const amountValue = Math.max(parseAmountInput(formState.amountInput), 0);
    const amountPrefix = formState.kind === 'income' ? '+' : '-';

    return (
      <SafeAreaView style={[styles.safeArea, {paddingTop: androidTopInset}]}>
        <ScrollView contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
          <View style={styles.topBarWide}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setViewMode('list')}
              style={({pressed}) => [styles.squareButton, pressed && styles.pressed]}>
              <Text style={styles.backIcon}>X</Text>
            </Pressable>
            <Text style={styles.formTitle}>Nouvelle transaction</Text>
            <View style={styles.topBarSpacer} />
          </View>

          <View style={styles.toggleWrap}>
            <Pressable
              onPress={() => setFormState(prev => ({...prev, kind: 'expense'}))}
              style={[styles.toggleButton, formState.kind === 'expense' && styles.toggleButtonActive]}>
              <Text style={[styles.toggleText, formState.kind === 'expense' && styles.toggleTextActive]}>
                Depense
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setFormState(prev => ({...prev, kind: 'income'}))}
              style={[styles.toggleButton, formState.kind === 'income' && styles.toggleButtonActive]}>
              <Text style={[styles.toggleText, formState.kind === 'income' && styles.toggleTextActive]}>
                Revenu
              </Text>
            </Pressable>
          </View>

          <View style={styles.formFieldGroup}>
            <Text style={styles.formLabel}>Montant</Text>
            <View style={styles.amountBox}>
              <Text style={styles.amountPreview}>
                {amountPrefix} {formatAmount(amountValue).replace('+', '')}
              </Text>
            </View>
            <TextInput
              keyboardType="decimal-pad"
              onChangeText={text => setFormState(prev => ({...prev, amountInput: text}))}
              style={styles.textInput}
              value={formState.amountInput}
            />
          </View>

          <View style={styles.formFieldGroup}>
            <Text style={styles.formLabel}>Date</Text>
            <View style={styles.selectRow}>
              <Text style={styles.selectValue}>{formState.dateLabel}</Text>
              <Text style={styles.todayHint}>Aujourd'hui</Text>
            </View>
          </View>

          <View style={styles.formFieldGroup}>
            <Text style={styles.formLabel}>Categorie</Text>
            <View style={styles.selectRow}>
              <View style={styles.inlineRow}>
                <View style={[styles.categoryPillIcon, {backgroundColor: formState.categoryBackground}]}>
                  <Text style={styles.categoryPillIconText}>{formState.categoryIcon}</Text>
                </View>
                <Text style={styles.selectValue}>{formState.category}</Text>
              </View>
              <Text style={styles.chevron}>v</Text>
            </View>

            <View style={styles.categoryChipsRow}>
              {categoryChips.map(chip => {
                const isActive = chip.label === formState.category;

                return (
                  <Pressable
                    key={chip.id}
                    onPress={() =>
                      setFormState(prev => ({
                        ...prev,
                        category: chip.label,
                        categoryIcon: chip.icon,
                        categoryBackground: chip.background,
                      }))
                    }
                    style={[styles.categoryChip, isActive && styles.categoryChipActive]}>
                    <View style={[styles.categoryChipIcon, {backgroundColor: chip.background}]}>
                      <Text style={styles.categoryChipIconText}>{chip.icon}</Text>
                    </View>
                    <Text style={styles.categoryChipLabel}>{chip.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.formFieldGroup}>
            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              maxLength={60}
              onChangeText={text => setFormState(prev => ({...prev, title: text}))}
              placeholder="Description"
              placeholderTextColor={colors.textMuted}
              style={styles.textInput}
              value={formState.title}
            />
            <Text style={styles.counterText}>{formState.title.length}/60</Text>
          </View>

          <View style={styles.formFieldGroup}>
            <Text style={styles.formLabel}>Type</Text>
            <View style={styles.typeToggleRow}>
              <Pressable
                onPress={() => setFormState(prev => ({...prev, useType: 'essential'}))}
                style={[styles.typeToggleButton, formState.useType === 'essential' && styles.typeToggleEssentialActive]}>
                <Text
                  style={[
                    styles.typeToggleText,
                    formState.useType === 'essential' && styles.typeToggleEssentialText,
                  ]}>
                  Essentiel
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setFormState(prev => ({...prev, useType: 'pleasure'}))}
                style={[styles.typeToggleButton, formState.useType === 'pleasure' && styles.typeTogglePleasureActive]}>
                <Text
                  style={[
                    styles.typeToggleText,
                    formState.useType === 'pleasure' && styles.typeTogglePleasureText,
                  ]}>
                  Plaisir
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.formFieldGroup}>
            <Text style={styles.formLabel}>Projet (optionnel)</Text>
            <View style={styles.selectRow}>
              <Text style={styles.selectValue}>{formState.project}</Text>
              <Text style={styles.chevron}>v</Text>
            </View>
            <Text style={styles.helperText}>Associe cette depense a un objectif.</Text>
          </View>

          <View style={styles.formFieldGroup}>
            <Text style={styles.formLabel}>Mode de paiement</Text>
            <Pressable
              onPress={() =>
                setFormState(prev => ({
                  ...prev,
                  paymentMethod:
                    prev.paymentMethod === 'card'
                      ? 'cash'
                      : prev.paymentMethod === 'cash'
                      ? 'transfer'
                      : 'card',
                }))
              }
              style={styles.selectRow}>
              <Text style={styles.selectValue}>{getPaymentMethodLabel(formState.paymentMethod)}</Text>
              <Text style={styles.chevron}>v</Text>
            </Pressable>
          </View>

          <View style={styles.formFieldGroup}>
            <Text style={styles.formLabel}>Notes (optionnel)</Text>
            <TextInput
              maxLength={100}
              multiline
              onChangeText={text => setFormState(prev => ({...prev, note: text}))}
              placeholder="Ajouter une note..."
              placeholderTextColor={colors.textMuted}
              style={[styles.textInput, styles.notesInput]}
              value={formState.note}
            />
            <Text style={styles.counterText}>{formState.note.length}/100</Text>
          </View>

          <Pressable onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Enregistrer la transaction</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (viewMode === 'success' && createdTransaction) {
    const tagStyle = getTagStyle(createdTransaction.tag);

    return (
      <SafeAreaView style={[styles.safeArea, {paddingTop: androidTopInset}]}>
        <ScrollView contentContainerStyle={styles.successContent} showsVerticalScrollIndicator={false}>
          <View style={styles.topBarWide}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setViewMode('list')}
              style={({pressed}) => [styles.squareButton, pressed && styles.pressed]}>
              <Text style={styles.backIcon}>{'<'}</Text>
            </Pressable>
            <View style={styles.topBarSpacer} />
          </View>

          <View style={styles.successHeroCircle}>
            <Text style={styles.successHeroText}>OK</Text>
          </View>
          <Text style={styles.successTitle}>Transaction ajoutee !</Text>
          <Text style={styles.successSubtitle}>Voici le detail de ta transaction.</Text>

          <View style={styles.successCard}>
            <View style={styles.successCardHead}>
              <View style={[styles.rowIconWrap, {backgroundColor: createdTransaction.iconBackground}]}>
                <Text style={styles.rowIconText}>{createdTransaction.iconLabel}</Text>
              </View>
              <View style={styles.successCardMain}>
                <Text style={styles.successCardTitle}>{createdTransaction.title}</Text>
                <Text style={styles.successCardCategory}>{createdTransaction.category}</Text>
              </View>
              <View>
                <Text style={styles.successCardAmount}>{formatAmount(createdTransaction.amount)}</Text>
                <Text style={[styles.successCardTag, {color: tagStyle.color}]}>{tagStyle.label}</Text>
              </View>
            </View>
            <View style={styles.successMetaRow}>
              <Text style={styles.successMetaLabel}>Date</Text>
              <Text style={styles.successMetaValue}>{formState.dateLabel}</Text>
            </View>
            <View style={styles.successMetaRow}>
              <Text style={styles.successMetaLabel}>Paiement</Text>
              <Text style={styles.successMetaValue}>{getPaymentMethodLabel(formState.paymentMethod)}</Text>
            </View>
            <View style={styles.successMetaRow}>
              <Text style={styles.successMetaLabel}>Projet</Text>
              <Text style={styles.successMetaValue}>{formState.project}</Text>
            </View>
            <View style={styles.successMetaRow}>
              <Text style={styles.successMetaLabel}>Notes</Text>
              <Text style={styles.successMetaValue}>{formState.note.trim() || '-'}</Text>
            </View>
          </View>

          <Text style={styles.actionsTitle}>Que veux-tu faire maintenant ?</Text>
          <Pressable onPress={openCreateForm} style={styles.nextActionRow}>
            <Text style={styles.nextActionLabel}>Ajouter une autre transaction</Text>
            <Text style={styles.nextActionChevron}>{'>'}</Text>
          </Pressable>
          <Pressable onPress={() => setViewMode('list')} style={styles.nextActionRow}>
            <Text style={styles.nextActionLabel}>Voir toutes les transactions</Text>
            <Text style={styles.nextActionChevron}>{'>'}</Text>
          </Pressable>
          <Pressable onPress={onNavigateDashboard} style={styles.nextActionRow}>
            <Text style={styles.nextActionLabel}>Retour au tableau de bord</Text>
            <Text style={styles.nextActionChevron}>{'>'}</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.screenTitle}>Transactions</Text>
        </View>

        <View style={styles.filtersRow}>
          {filters.map(filter => {
            const isActive = filter.id === activeFilter;

            return (
              <Pressable
                key={filter.id}
                onPress={() => setActiveFilter(filter.id)}
                style={[styles.filterPill, isActive && styles.filterPillActive]}>
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{filter.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.monthCard}>
          <View style={styles.monthHeader}>
            <View style={styles.walletIconWrap}>
              <Text style={styles.walletIconText}>EU</Text>
            </View>
            <Text style={styles.monthLabel}>{transactionsData.periodLabel}</Text>
          </View>
          <View style={styles.monthStatsRow}>
            <View style={styles.monthStatBlock}>
              <Text style={styles.monthAmount}>{formatAmount(-monthExpenses)}</Text>
              <Text style={styles.monthStatLabel}>Depenses</Text>
            </View>
            <View style={styles.monthDivider} />
            <View style={styles.monthStatBlock}>
              <Text style={[styles.monthAmount, styles.monthIncome]}>{formatAmount(monthIncome)}</Text>
              <Text style={styles.monthStatLabel}>Revenus</Text>
            </View>
          </View>
        </View>

        {filteredSections.map(section => (
          <View key={section.id} style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>{section.label}</Text>
            <View style={styles.listCard}>
              {section.transactions.map((transaction, index) => {
                const showSeparator = index < section.transactions.length - 1;

                return (
                  <SwipeableTransactionRow
                    key={transaction.id}
                    onDelete={() => handleDelete(transaction.id)}
                    onEdit={() => openEditForm(transaction)}
                    showSeparator={showSeparator}
                    transaction={transaction}
                  />
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      <Pressable
        accessibilityLabel="Ajouter une transaction"
        accessibilityRole="button"
        onPress={openCreateForm}
        style={({pressed}) => [styles.fabButton, pressed && styles.pressed]}>
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>
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
    paddingBottom: spacing.xl,
  },
  formContent: {
    gap: spacing.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  successContent: {
    gap: spacing.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  topBarWide: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topBarSpacer: {
    width: 46,
  },
  screenTitle: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '900',
  },
  formTitle: {
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
  backIcon: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '700',
  },
  hamburgerLine: {
    backgroundColor: colors.text,
    borderRadius: 999,
    height: 2,
    marginVertical: 2,
    width: 18,
  },
  pressed: {
    opacity: 0.85,
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
  monthCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  monthHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  walletIconWrap: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  walletIconText: {
    color: colors.primary,
    fontSize: typography.small,
    fontWeight: '900',
  },
  monthLabel: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
  },
  monthStatsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthStatBlock: {
    alignItems: 'center',
    flex: 1,
  },
  monthDivider: {
    backgroundColor: colors.border,
    height: 62,
    width: 1,
  },
  monthAmount: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },
  monthIncome: {
    color: colors.primary,
  },
  monthStatLabel: {
    color: colors.textMuted,
    fontSize: typography.small,
    marginTop: spacing.xs,
  },
  sectionBlock: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    marginLeft: spacing.xs,
  },
  listCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  swipeRowContainer: {
    position: 'relative',
  },
  swipeActionsLayer: {
    bottom: 0,
    flexDirection: 'row',
    left: 0,
    position: 'absolute',
    top: 0,
  },
  swipeActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },
  editActionButton: {
    backgroundColor: '#DCECE8',
  },
  deleteActionButton: {
    backgroundColor: '#E7CFC9',
  },
  swipeActionText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  swipeContent: {
    backgroundColor: colors.surface,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  rowIconWrap: {
    alignItems: 'center',
    borderRadius: 14,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  rowIconText: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '900',
  },
  rowMain: {
    flex: 1,
  },
  rowTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  rowCategory: {
    color: colors.textMuted,
    fontSize: typography.small,
  },
  rowAmountWrap: {
    alignItems: 'flex-end',
    minWidth: 112,
  },
  rowAmount: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  rowAmountIncome: {
    color: colors.primary,
  },
  rowTag: {
    fontSize: typography.small,
    fontWeight: '700',
  },
  rowSeparator: {
    backgroundColor: colors.border,
    height: 1,
    marginLeft: 72,
  },
  fabButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 30,
    bottom: spacing.lg,
    height: 60,
    justifyContent: 'center',
    position: 'absolute',
    right: spacing.lg,
    width: 60,
  },
  fabIcon: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '300',
    marginTop: -2,
  },
  toggleWrap: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    padding: spacing.xs,
  },
  toggleButton: {
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    paddingVertical: spacing.sm,
  },
  toggleButtonActive: {
    backgroundColor: colors.surfaceMuted,
  },
  toggleText: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontWeight: '700',
  },
  toggleTextActive: {
    color: colors.primary,
  },
  formFieldGroup: {
    gap: spacing.sm,
  },
  formLabel: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  amountBox: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 92,
  },
  amountPreview: {
    color: colors.text,
    fontSize: 42,
    fontWeight: '900',
  },
  textInput: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.text,
    fontSize: typography.body,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  selectRow: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 58,
    paddingHorizontal: spacing.md,
  },
  selectValue: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  todayHint: {
    color: colors.primary,
    fontSize: typography.small,
    fontWeight: '700',
  },
  chevron: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontWeight: '700',
  },
  inlineRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  categoryPillIcon: {
    alignItems: 'center',
    borderRadius: 10,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  categoryPillIconText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '900',
  },
  categoryChipsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  categoryChip: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
  },
  categoryChipActive: {
    borderColor: colors.primary,
  },
  categoryChipIcon: {
    alignItems: 'center',
    borderRadius: 10,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  categoryChipIconText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '900',
  },
  categoryChipLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  typeToggleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typeToggleButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    paddingVertical: spacing.md,
  },
  typeToggleText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  typeToggleEssentialActive: {
    borderColor: colors.positive,
    backgroundColor: '#F1F8F3',
  },
  typeTogglePleasureActive: {
    borderColor: '#D67316',
    backgroundColor: '#FDF3E8',
  },
  typeToggleEssentialText: {
    color: colors.positive,
  },
  typeTogglePleasureText: {
    color: '#D67316',
  },
  helperText: {
    color: colors.textMuted,
    fontSize: typography.small,
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  counterText: {
    alignSelf: 'flex-end',
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: spacing.md,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '800',
  },
  successHeroCircle: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#EAF1E9',
    borderRadius: 90,
    height: 180,
    justifyContent: 'center',
    width: 180,
  },
  successHeroText: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '900',
  },
  successTitle: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
  },
  successSubtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    textAlign: 'center',
  },
  successCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  successCardHead: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  successCardMain: {
    flex: 1,
  },
  successCardTitle: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '800',
  },
  successCardCategory: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  successCardAmount: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '900',
    textAlign: 'right',
  },
  successCardTag: {
    fontSize: typography.small,
    fontWeight: '800',
    textAlign: 'right',
  },
  successMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  successMetaLabel: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  successMetaValue: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
    marginLeft: spacing.md,
  },
  actionsTitle: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '900',
    marginTop: spacing.sm,
  },
  nextActionRow: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 62,
    paddingHorizontal: spacing.md,
  },
  nextActionLabel: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  nextActionChevron: {
    color: colors.textMuted,
    fontSize: typography.heading,
    fontWeight: '600',
  },
});
