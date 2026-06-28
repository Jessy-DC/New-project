export type MonthlySummary = {
  income: number;
  expenses: number;
  savings: number;
};

export type MainGoal = {
  title: string;
  currentAmount: number;
  targetAmount: number;
};

export type DashboardData = {
  userFirstName: string;
  periodLabel: string;
  availableAmount: number;
  availableDelta: number;
  summary: MonthlySummary;
  mainGoal: MainGoal;
  insight: {
    highlight: string;
    description: string;
  };
};

export const dashboardData: DashboardData = {
  userFirstName: 'Jessy',
  periodLabel: 'Juin 2026',
  availableAmount: 1280,
  availableDelta: 120,
  summary: {
    income: 2850,
    expenses: 1570,
    savings: 1280,
  },
  mainGoal: {
    title: 'Japon',
    currentAmount: 1380,
    targetAmount: 4500,
  },
  insight: {
    highlight: '18 % de moins',
    description: "qu'en mai.",
  },
};
