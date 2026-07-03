import React from 'react';
import {
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

import {ProgressBar} from '../components/dashboard/ProgressBar';
import {goalsData, SavingGoal} from '../mock/goals';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';
import {formatCurrency} from '../utils/formatCurrency';

type GoalsScreenProps = {
  onOpenMenu?: () => void;
  onPrimaryViewChange?: (isPrimaryView: boolean) => void;
};

type ViewMode = 'list' | 'create' | 'edit' | 'editForm';
type GoalCategory = 'Voyage' | 'Achat' | 'Projet' | 'Autre';

type GoalFormState = {
  imageLabel: string;
  imageBackground: string;
  name: string;
  targetAmount: string;
  targetDateLabel: string;
  initialAmount: string;
  category: GoalCategory;
  notes: string;
};

const imageOptions: Array<{label: string; background: string}> = [
  {label: 'JP', background: '#F7E4EE'},
  {label: 'NV', background: '#DFF2E7'},
  {label: 'CA', background: '#F4E9DF'},
  {label: 'AV', background: '#EAE7FA'},
  {label: 'OT', background: '#ECEFF2'},
];

const categoryOptions: GoalCategory[] = ['Voyage', 'Achat', 'Projet', 'Autre'];
const defaultGoalNotesById: Record<string, string> = {
  japan: 'Mon reve depuis longtemps !',
  car: 'Objectif pour fin 2026.',
  camera: 'Upgrade materiel photo.',
};

const goalEvolutionById: Record<string, Array<{id: string; month: string; amount: number}>> = {
  japan: [
    {id: 'jun-2026', month: 'Juin 2026', amount: 200},
    {id: 'may-2026', month: 'Mai 2026', amount: 150},
    {id: 'apr-2026', month: 'Avril 2026', amount: 320},
    {id: 'mar-2026', month: 'Mars 2026', amount: 180},
    {id: 'feb-2026', month: 'Fevrier 2026', amount: 120},
    {id: 'jan-2026', month: 'Janvier 2026', amount: 410},
  ],
  car: [
    {id: 'car-jun-2026', month: 'Juin 2026', amount: 300},
    {id: 'car-may-2026', month: 'Mai 2026', amount: 220},
    {id: 'car-apr-2026', month: 'Avril 2026', amount: 280},
  ],
  camera: [
    {id: 'cam-jun-2026', month: 'Juin 2026', amount: 90},
    {id: 'cam-may-2026', month: 'Mai 2026', amount: 70},
    {id: 'cam-apr-2026', month: 'Avril 2026', amount: 80},
  ],
};

function parseNumberInput(value: string) {
  const normalized = value.replace(',', '.').replace(/[^\d.]/g, '');
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return parsed;
}

function formatAmountInput(value: number) {
  if (value <= 0) {
    return '0';
  }

  return String(Math.round(value));
}

function getDefaultFormState(): GoalFormState {
  return {
    imageLabel: imageOptions[0].label,
    imageBackground: imageOptions[0].background,
    name: '',
    targetAmount: '0',
    targetDateLabel: '',
    initialAmount: '0',
    category: 'Autre',
    notes: '',
  };
}

function getFormStateFromGoal(goal: SavingGoal): GoalFormState {
  return {
    imageLabel: goal.imageLabel,
    imageBackground: goal.imageBackground,
    name: goal.title,
    targetAmount: formatAmountInput(goal.targetAmount),
    targetDateLabel: goal.targetDateLabel,
    initialAmount: formatAmountInput(goal.currentAmount),
    category: 'Autre',
    notes: defaultGoalNotesById[goal.id] ?? '',
  };
}

type GoalCardItemProps = {
  goal: SavingGoal;
  onOpenDetails: (goal: SavingGoal) => void;
};

function GoalCardItem({goal, onOpenDetails}: GoalCardItemProps) {
  const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100);
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onOpenDetails(goal)}
      style={({pressed}) => [styles.goalCard, pressed && styles.pressed]}>
      <View style={styles.goalTopRow}>
        <View style={[styles.goalImageWrap, {backgroundColor: goal.imageBackground}]}>
          <Text style={styles.goalImageText}>{goal.imageLabel}</Text>
        </View>

        <View style={styles.goalMain}>
          <View style={styles.goalTitleRow}>
            <View style={styles.goalTitleWrap}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text style={styles.goalDate}>{goal.targetDateLabel}</Text>
            </View>
            <Text style={styles.goalPercent}>{progress} %</Text>
          </View>

          <ProgressBar value={progress} />

          <View style={styles.goalAmountsRow}>
            <Text style={styles.goalAmountsText}>
              {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
            </Text>
            <View style={styles.goalAmountsRight}>
              <Text style={styles.goalRemainingText}>Encore {formatCurrency(remaining)}</Text>
              <Text style={styles.goalChevron}>{'>'}</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export function GoalsScreen({onOpenMenu, onPrimaryViewChange}: GoalsScreenProps) {
  const [viewMode, setViewMode] = React.useState<ViewMode>('list');
  const [goals, setGoals] = React.useState<SavingGoal[]>(goalsData.goals);
  const [editingGoalId, setEditingGoalId] = React.useState<string | null>(null);
  const [formState, setFormState] = React.useState<GoalFormState>(getDefaultFormState());
  const androidTopInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const globalProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;
  const editingGoal = editingGoalId ? goals.find(goal => goal.id === editingGoalId) : undefined;

  React.useEffect(() => {
    onPrimaryViewChange?.(viewMode === 'list');

    return () => {
      onPrimaryViewChange?.(true);
    };
  }, [onPrimaryViewChange, viewMode]);

  const openCreateForm = () => {
    setEditingGoalId(null);
    setFormState(getDefaultFormState());
    setViewMode('create');
  };

  const openEditForm = (goal: SavingGoal) => {
    setEditingGoalId(goal.id);
    setFormState(getFormStateFromGoal(goal));
    setViewMode('edit');
  };

  const closeForm = () => {
    setViewMode('list');
    setEditingGoalId(null);
  };

  const cycleCategory = () => {
    const currentIndex = categoryOptions.indexOf(formState.category);
    const nextIndex = (currentIndex + 1) % categoryOptions.length;

    setFormState(prev => ({...prev, category: categoryOptions[nextIndex]}));
  };

  const handleSaveGoal = () => {
    const targetAmount = Math.max(parseNumberInput(formState.targetAmount), 0);
    const currentAmount = Math.max(parseNumberInput(formState.initialAmount), 0);
    const title = formState.name.trim() || 'Nouvel objectif';
    const targetDateLabel = formState.targetDateLabel.trim() || 'Sans date';

    if (targetAmount <= 0) {
      return;
    }

    if (viewMode === 'editForm' && editingGoalId) {
      setGoals(prev =>
        prev.map(goal => {
          if (goal.id !== editingGoalId) {
            return goal;
          }

          return {
            ...goal,
            title,
            targetAmount,
            currentAmount,
            targetDateLabel,
            imageLabel: formState.imageLabel,
            imageBackground: formState.imageBackground,
          };
        }),
      );
      setViewMode('edit');
      return;
    }

    const createdGoal: SavingGoal = {
      id: `goal-${Date.now()}`,
      title,
      targetDateLabel,
      currentAmount,
      targetAmount,
      imageLabel: formState.imageLabel,
      imageBackground: formState.imageBackground,
    };

    setGoals(prev => [createdGoal, ...prev]);
    closeForm();
  };

  const handleDeleteGoal = () => {
    if (!editingGoalId) {
      return;
    }

    setGoals(prev => prev.filter(goal => goal.id !== editingGoalId));
    closeForm();
  };

  if (viewMode === 'create' || viewMode === 'editForm') {
    const isEditingForm = viewMode === 'editForm';

    return (
      <SafeAreaView style={[styles.safeArea, {paddingTop: androidTopInset}]}> 
        <ScrollView contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formHeaderRow}>
            <Pressable
              accessibilityLabel="Fermer le formulaire"
              accessibilityRole="button"
              onPress={closeForm}
              style={({pressed}) => [styles.squareButton, pressed && styles.pressed]}>
              <Text style={styles.formBackIcon}>{isEditingForm ? '<' : 'X'}</Text>
            </Pressable>

            <Text style={styles.formTitle}>{isEditingForm ? 'Modifier objectif' : 'Nouvel objectif'}</Text>
          </View>

          {!isEditingForm && (
            <Text style={styles.formIntro}>Cree un objectif pour suivre ta progression mois apres mois.</Text>
          )}

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Image de l objectif</Text>
            <View style={styles.imageRow}>
              {imageOptions.map(option => {
                const isSelected =
                  formState.imageLabel === option.label && formState.imageBackground === option.background;

                return (
                  <Pressable
                    key={`${option.label}-${option.background}`}
                    onPress={() =>
                      setFormState(prev => ({
                        ...prev,
                        imageLabel: option.label,
                        imageBackground: option.background,
                      }))
                    }
                    style={[
                      styles.imageOption,
                      {backgroundColor: option.background},
                      isSelected && styles.imageOptionSelected,
                    ]}>
                    <Text style={styles.imageOptionText}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Nom de l objectif</Text>
            <TextInput
              maxLength={40}
              onChangeText={text => setFormState(prev => ({...prev, name: text}))}
              placeholder="Ex : Voyage au Japon"
              placeholderTextColor="#8A8F96"
              style={styles.input}
              value={formState.name}
            />
            <Text style={styles.fieldHint}>{formState.name.length}/40</Text>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Montant cible</Text>
            <View style={styles.currencyInputWrap}>
              <TextInput
                keyboardType="numeric"
                onChangeText={text => setFormState(prev => ({...prev, targetAmount: text}))}
                placeholder="0"
                placeholderTextColor="#8A8F96"
                style={styles.currencyInput}
                value={formState.targetAmount}
              />
              <Text style={styles.currencySuffix}>EUR</Text>
            </View>
            <Text style={styles.fieldHint}>Combien souhaites-tu epargner ?</Text>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Date cible (facultatif)</Text>
            <TextInput
              onChangeText={text => setFormState(prev => ({...prev, targetDateLabel: text}))}
              placeholder="Ex : Mai 2027"
              placeholderTextColor="#8A8F96"
              style={styles.input}
              value={formState.targetDateLabel}
            />
            <Text style={styles.fieldHint}>Quand aimerais-tu atteindre ton objectif ?</Text>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Montant initial (facultatif)</Text>
            <View style={styles.currencyInputWrap}>
              <TextInput
                keyboardType="numeric"
                onChangeText={text => setFormState(prev => ({...prev, initialAmount: text}))}
                placeholder="0"
                placeholderTextColor="#8A8F96"
                style={styles.currencyInput}
                value={formState.initialAmount}
              />
              <Text style={styles.currencySuffix}>EUR</Text>
            </View>
            <Text style={styles.fieldHint}>Montant deja epargne pour cet objectif.</Text>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Categorie</Text>
            <Pressable onPress={cycleCategory} style={({pressed}) => [styles.selectInput, pressed && styles.pressed]}>
              <Text style={styles.selectValue}>{formState.category}</Text>
              <Text style={styles.selectArrow}>v</Text>
            </Pressable>
            <Text style={styles.fieldHint}>Appuie pour changer la categorie.</Text>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Notes (facultatif)</Text>
            <TextInput
              multiline
              onChangeText={text => setFormState(prev => ({...prev, notes: text}))}
              placeholder="Ex : Mon reve depuis longtemps !"
              placeholderTextColor="#8A8F96"
              style={styles.textArea}
              textAlignVertical="top"
              value={formState.notes}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={handleSaveGoal}
            style={({pressed}) => [styles.submitButton, pressed && styles.pressed]}>
            <Text style={styles.submitButtonText}>
              {isEditingForm ? 'Enregistrer les modifications' : 'Creer l objectif'}
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (viewMode === 'edit' && editingGoal) {
    const progress = Math.round((editingGoal.currentAmount / editingGoal.targetAmount) * 100);
    const remaining = Math.max(editingGoal.targetAmount - editingGoal.currentAmount, 0);
    const evolution = goalEvolutionById[editingGoal.id] ?? [];

    return (
      <SafeAreaView style={[styles.safeArea, {paddingTop: androidTopInset}]}> 
        <ScrollView contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
          <View style={styles.editTopBar}>
            <Pressable
              accessibilityLabel="Fermer le formulaire"
              accessibilityRole="button"
              onPress={closeForm}
              style={({pressed}) => [styles.squareButton, pressed && styles.pressed]}>
              <Text style={styles.formBackIcon}>{'<'}</Text>
            </Pressable>
          </View>

          <View style={styles.editHeroBlock}>
            <View style={[styles.editHeroImageWrap, {backgroundColor: editingGoal.imageBackground}]}>
              <Text style={styles.editHeroImageText}>{editingGoal.imageLabel}</Text>
            </View>
            <Text style={styles.editHeroTitle}>{editingGoal.title}</Text>
            <Text style={styles.editHeroAmountLine}>
              <Text style={styles.editHeroAmountPrimary}>{formatCurrency(editingGoal.currentAmount)}</Text>
              {' / '}
              <Text style={styles.editHeroAmountSecondary}>{formatCurrency(editingGoal.targetAmount)}</Text>
            </Text>
            <ProgressBar value={progress} />
            <Text style={styles.editHeroPercent}>{progress} %</Text>
            <Text style={styles.editHeroRemaining}>Encore {formatCurrency(remaining)}</Text>
          </View>

          <View style={styles.editInfoCard}>
            <Text style={styles.editInfoLabel}>Date cible</Text>
            <Text style={styles.editInfoValue}>{editingGoal.targetDateLabel}</Text>
          </View>

          <View style={styles.editEvolutionCard}>
            <Text style={styles.editEvolutionTitle}>Evolution</Text>
            {evolution.map((entry, index) => {
              const showSeparator = index < evolution.length - 1;

              return (
                <View key={entry.id}>
                  <View style={styles.editEvolutionRow}>
                    <Text style={styles.editEvolutionMonth}>{entry.month}</Text>
                    <Text style={styles.editEvolutionAmount}>+ {formatCurrency(entry.amount)}</Text>
                  </View>
                  {showSeparator && <View style={styles.editSeparator} />}
                </View>
              );
            })}
          </View>

          <View style={styles.editInfoCard}>
            <Text style={styles.editInfoLabel}>Notes</Text>
            <Text style={styles.editInfoValue}>{formState.notes || 'Aucune note'}</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={handleDeleteGoal}
            style={({pressed}) => [styles.deleteButton, pressed && styles.pressed]}>
            <Text style={styles.deleteButtonText}>Supprimer l objectif</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => setViewMode('editForm')}
            style={({pressed}) => [styles.submitButton, pressed && styles.pressed]}>
            <Text style={styles.submitButtonText}>Modifier l objectif</Text>
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

          <Text style={styles.screenTitle}>Objectifs</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryIconWrap}>
              <Text style={styles.summaryIconText}>OB</Text>
            </View>
            <View style={styles.summaryMain}>
              <Text style={styles.summaryLabel}>Epargne totale</Text>
              <Text style={styles.summaryAmount}>{formatCurrency(totalSaved)}</Text>
              <Text style={styles.summarySubtext}>{globalProgress} % de mes objectifs atteints</Text>
            </View>
          </View>
          <ProgressBar value={globalProgress} />
        </View>

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Mes objectifs</Text>
        </View>

        {goals.map(goal => (
          <GoalCardItem key={goal.id} goal={goal} onOpenDetails={openEditForm} />
        ))}

        <Pressable onPress={openCreateForm} style={({pressed}) => [styles.createGoalCard, pressed && styles.pressed]}>
          <Text style={styles.createGoalPlus}>+</Text>
          <View>
            <Text style={styles.createGoalTitle}>Creer un objectif</Text>
            <Text style={styles.createGoalHint}>Voyage, achat, projet...</Text>
          </View>
        </Pressable>
      </ScrollView>

      <Pressable
        accessibilityLabel="Ajouter un objectif"
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
    paddingBottom: 120,
  },
  formContent: {
    gap: spacing.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  formHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  editTopBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  formBackIcon: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  formTitle: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '900',
  },
  formIntro: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 24,
  },
  fieldBlock: {
    gap: spacing.sm,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  fieldHint: {
    color: colors.textMuted,
    fontSize: typography.small,
  },
  imageRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  imageOption: {
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: 999,
    borderWidth: 2,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  imageOptionSelected: {
    borderColor: colors.primary,
  },
  imageOptionText: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '800',
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.text,
    fontSize: typography.body,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  currencyInputWrap: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  currencyInput: {
    color: colors.text,
    flex: 1,
    fontSize: typography.body,
    paddingVertical: spacing.md,
  },
  currencySuffix: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  selectInput: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  selectValue: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  selectArrow: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontWeight: '800',
  },
  textArea: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.text,
    fontSize: typography.body,
    minHeight: 112,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '900',
  },
  deleteButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: '#E6D2CF',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: spacing.md,
  },
  deleteButtonText: {
    color: '#C44B42',
    fontSize: typography.body,
    fontWeight: '900',
  },
  editHeroBlock: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  editHeroImageWrap: {
    alignItems: 'center',
    borderRadius: 999,
    height: 148,
    justifyContent: 'center',
    width: 148,
  },
  editHeroImageText: {
    color: colors.text,
    fontSize: 40,
    fontWeight: '900',
  },
  editHeroTitle: {
    color: colors.text,
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  editHeroAmountLine: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  editHeroAmountPrimary: {
    color: colors.primary,
    fontWeight: '900',
  },
  editHeroAmountSecondary: {
    color: '#656A74',
    fontWeight: '800',
  },
  editHeroPercent: {
    color: colors.primary,
    fontSize: 44,
    fontWeight: '900',
    marginTop: spacing.sm,
  },
  editHeroRemaining: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontWeight: '600',
  },
  editInfoCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.lg,
  },
  editInfoLabel: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  editInfoValue: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '700',
  },
  editEvolutionCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  editEvolutionTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '900',
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  editEvolutionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  editEvolutionMonth: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '600',
  },
  editEvolutionAmount: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '900',
  },
  editSeparator: {
    backgroundColor: colors.border,
    height: 1,
    marginLeft: spacing.lg,
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
  summaryCard: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  summaryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  summaryIconWrap: {
    alignItems: 'center',
    backgroundColor: '#EFF4F2',
    borderRadius: 999,
    height: 88,
    justifyContent: 'center',
    width: 88,
  },
  summaryIconText: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '900',
  },
  summaryMain: {
    flex: 1,
    gap: spacing.xs,
  },
  summaryLabel: {
    color: '#4F535A',
    fontSize: typography.body,
    fontWeight: '700',
  },
  summaryAmount: {
    color: colors.primary,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.6,
    lineHeight: 40,
  },
  summarySubtext: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '600',
  },
  sectionHead: {
    paddingTop: spacing.xs,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  goalCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    padding: spacing.lg,
  },
  goalTopRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  goalImageWrap: {
    alignItems: 'center',
    borderRadius: 999,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  goalImageText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '900',
  },
  goalMain: {
    flex: 1,
    gap: spacing.md,
  },
  goalTitleWrap: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  goalTitleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  goalDate: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  goalPercent: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginLeft: spacing.sm,
    marginTop: 2,
  },
  goalAmountsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalAmountsRight: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  goalAmountsText: {
    color: colors.text,
    flexShrink: 1,
    fontSize: typography.body,
    fontWeight: '700',
  },
  goalRemainingText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  goalChevron: {
    color: '#9AA0A7',
    fontSize: typography.body,
    fontWeight: '800',
    marginTop: -1,
  },
  createGoalCard: {
    alignItems: 'center',
    backgroundColor: '#F3F7F5',
    borderColor: '#BFD8CF',
    borderRadius: 18,
    borderStyle: 'dashed',
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  createGoalPlus: {
    color: colors.primary,
    fontSize: 42,
    fontWeight: '300',
    marginTop: -2,
  },
  createGoalTitle: {
    color: colors.primary,
    fontSize: typography.heading,
    fontWeight: '900',
  },
  createGoalHint: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontWeight: '600',
    marginTop: spacing.xs,
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
  pressed: {
    opacity: 0.85,
  },
});
