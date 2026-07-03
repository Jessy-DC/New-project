import React from 'react';
import {StyleSheet, View} from 'react-native';

import {colors} from '../../theme/colors';

type ProgressBarProps = {
  value: number;
};

export function ProgressBar({value}: ProgressBarProps) {
  const normalizedValue = Math.max(0, Math.min(value, 100));

  return (
    <View style={styles.track} accessibilityRole="progressbar">
      <View style={[styles.fill, {width: `${normalizedValue}%`}]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.progressTrack,
    borderRadius: 999,
    height: 10,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: '100%',
  },
});
