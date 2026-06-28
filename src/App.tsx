import React from 'react';
import {StatusBar} from 'react-native';

import {MainNavigation} from './navigation/MainNavigation';
import {colors} from './theme/colors';

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <MainNavigation />
    </>
  );
}
