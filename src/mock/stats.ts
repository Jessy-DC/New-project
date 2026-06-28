export type PeriodFilter = 'month' | 'quarter' | 'year';

export type ExpenseCategorySplit = {
  id: string;
  label: string;
  percent: number;
  amount: number;
  color: string;
  iconBackground: string;
  iconLabel: string;
};

export type CategoryTrend = {
  id: string;
  label: string;
  deltaPercent: number;
  deltaAmount: number;
  iconBackground: string;
  iconLabel: string;
};

export type StatsData = {
  savedDeltaAmount: number;
  expenseSplit: ExpenseCategorySplit[];
  essentialsPercent: number;
  essentialsAmount: number;
  pleasurePercent: number;
  pleasureAmount: number;
  trends: CategoryTrend[];
  bestCategory: {
    title: string;
    description: string;
    deltaPercent: number;
  };
};

export const statsData: StatsData = {
  savedDeltaAmount: 148,
  expenseSplit: [
    {
      id: 'restaurant',
      label: 'Restaurant',
      percent: 22,
      amount: 346,
      color: '#0F8065',
      iconBackground: '#F8E6DB',
      iconLabel: 'R',
    },
    {
      id: 'groceries',
      label: 'Courses',
      percent: 34,
      amount: 534,
      color: '#9FD78E',
      iconBackground: '#E6F2E7',
      iconLabel: 'C',
    },
    {
      id: 'transport',
      label: 'Transport',
      percent: 18,
      amount: 283,
      color: '#4F9EDB',
      iconBackground: '#E2EEF8',
      iconLabel: 'T',
    },
    {
      id: 'leisure',
      label: 'Loisirs',
      percent: 8,
      amount: 126,
      color: '#8F84E7',
      iconBackground: '#EAE7FA',
      iconLabel: 'L',
    },
    {
      id: 'housing',
      label: 'Logement',
      percent: 18,
      amount: 281,
      color: '#E4DDD7',
      iconBackground: '#F6E7E2',
      iconLabel: 'H',
    },
  ],
  essentialsPercent: 78,
  essentialsAmount: 1226,
  pleasurePercent: 22,
  pleasureAmount: 344,
  trends: [
    {
      id: 'trend-restaurants',
      label: 'Restaurant',
      deltaPercent: -18,
      deltaAmount: -76,
      iconBackground: '#F8E6DB',
      iconLabel: 'R',
    },
    {
      id: 'trend-shopping',
      label: 'Shopping',
      deltaPercent: -8,
      deltaAmount: -28,
      iconBackground: '#FCE8EE',
      iconLabel: 'S',
    },
    {
      id: 'trend-transport',
      label: 'Transport',
      deltaPercent: 6,
      deltaAmount: 16,
      iconBackground: '#E2EEF8',
      iconLabel: 'T',
    },
    {
      id: 'trend-leisure',
      label: 'Loisirs',
      deltaPercent: -12,
      deltaAmount: -17,
      iconBackground: '#EAE7FA',
      iconLabel: 'L',
    },
  ],
  bestCategory: {
    title: 'Restaurants',
    description: 'Tu depenses moins qu en avril. Bravo !',
    deltaPercent: 23,
  },
};
