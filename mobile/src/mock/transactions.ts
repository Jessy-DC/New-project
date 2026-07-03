export type TransactionType = 'expense' | 'income';
export type TransactionTag = 'essential' | 'pleasure' | 'income';

export type Transaction = {
  id: string;
  title: string;
  category: string;
  iconLabel: string;
  iconBackground: string;
  amount: number;
  type: TransactionType;
  tag: TransactionTag;
};

export type TransactionSection = {
  id: string;
  label: string;
  transactions: Transaction[];
};

export type TransactionsData = {
  periodLabel: string;
  monthExpenses: number;
  monthIncome: number;
  sections: TransactionSection[];
};

export const transactionsData: TransactionsData = {
  periodLabel: 'Ce mois',
  monthExpenses: 1570,
  monthIncome: 2850,
  sections: [
    {
      id: 'today',
      label: "Aujourd'hui",
      transactions: [
        {
          id: 'bk',
          title: 'Burger King',
          category: 'Restauration',
          iconLabel: 'BK',
          iconBackground: '#F6E7DF',
          amount: -18.5,
          type: 'expense',
          tag: 'pleasure',
        },
        {
          id: 'te',
          title: 'TotalEnergies',
          category: 'Carburant',
          iconLabel: 'TE',
          iconBackground: '#E6EEF8',
          amount: -54.2,
          type: 'expense',
          tag: 'essential',
        },
        {
          id: 'carrefour',
          title: 'Carrefour',
          category: 'Courses',
          iconLabel: 'CF',
          iconBackground: '#E9F1E8',
          amount: -62.35,
          type: 'expense',
          tag: 'essential',
        },
      ],
    },
    {
      id: 'yesterday',
      label: 'Hier',
      transactions: [
        {
          id: 'sncf',
          title: 'SNCF Connect',
          category: 'Transport',
          iconLabel: 'SC',
          iconBackground: '#ECE8F6',
          amount: -35.8,
          type: 'expense',
          tag: 'essential',
        },
      ],
    },
    {
      id: 'date-2026-06-12',
      label: '12 juin 2026',
      transactions: [
        {
          id: 'zara',
          title: 'Zara',
          category: 'Vetements',
          iconLabel: 'ZA',
          iconBackground: '#F4EEDF',
          amount: -49.99,
          type: 'expense',
          tag: 'pleasure',
        },
        {
          id: 'salary',
          title: 'Salaire',
          category: 'Revenu',
          iconLabel: 'SL',
          iconBackground: '#E6F2E8',
          amount: 2850,
          type: 'income',
          tag: 'income',
        },
      ],
    },
  ],
};
