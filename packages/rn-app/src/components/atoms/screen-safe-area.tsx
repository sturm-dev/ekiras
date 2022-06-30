/* eslint-disable react-native/no-inline-styles */
import React, {ReactNode} from 'react';
import {StatusBar} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {SafeAreaView, SafeAreaViewProps} from 'react-native-safe-area-context';

import {MyThemeInterfaceColors, parseStyle} from '_utils';

interface ScreenSafeAreaProps extends SafeAreaViewProps {
  children: ReactNode;
  colorStatusBar?: string;
}

export const ScreenSafeArea: React.FC<ScreenSafeAreaProps> = ({
  children,
  colorStatusBar: colorStatusBarFromProps,
  ...props
}: ScreenSafeAreaProps) => {
  const colors = useTheme().colors as MyThemeInterfaceColors;
  const colorStatusBar = colorStatusBarFromProps || colors.background;

  return (
    <>
      <StatusBar backgroundColor={colorStatusBar} barStyle="light-content" />
      <SafeAreaView
        edges={['right', 'top', 'left']}
        {...props}
        style={{
          flex: 1,
          backgroundColor: colorStatusBar,
          ...(parseStyle(props.style) as object),
        }}>
        {children}
      </SafeAreaView>
    </>
  );
};

ScreenSafeArea.defaultProps = {
  colorStatusBar: undefined, // set default color inside of component
};
