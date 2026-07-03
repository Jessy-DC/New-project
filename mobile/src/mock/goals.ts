export type SavingGoal = {
  id: string;
  title: string;
  targetDateLabel: string;
  currentAmount: number;
  targetAmount: number;
  imageLabel: string;
  imageBackground: string;
};

export type GoalsData = {
  totalSaved: number;
  totalTarget: number;
  goals: SavingGoal[];
};

export const goalsData: GoalsData = {
  totalSaved: 2480,
  totalTarget: 4500,
  goals: [
    {
      id: 'japan',
      title: 'Japon',
      targetDateLabel: 'Mai 2027',
      currentAmount: 1380,
      targetAmount: 4500,
      imageLabel: 'JP',
      imageBackground: '#F7E4EE',
    },
    {
      id: 'car',
      title: 'Nouvelle voiture',
      targetDateLabel: 'Decembre 2026',
      currentAmount: 5800,
      targetAmount: 10000,
      imageLabel: 'NV',
      imageBackground: '#DFF2E7',
    },
    {
      id: 'camera',
      title: 'Sony A7 IV',
      targetDateLabel: 'Aout 2026',
      currentAmount: 240,
      targetAmount: 2000,
      imageLabel: 'CA',
      imageBackground: '#F4E9DF',
    },
  ],
};
