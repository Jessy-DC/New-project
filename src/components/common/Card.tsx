import React, {PropsWithChildren} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';

import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

type CardProps = PropsWithChildren<{
  style?: ViewStyle;
}>;

export function Card({children, style}: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing.lg,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
});
