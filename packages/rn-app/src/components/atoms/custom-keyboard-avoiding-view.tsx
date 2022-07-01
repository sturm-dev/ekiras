import React, {ReactNode} from 'react';
import {KeyboardAvoidingView as NativeKeyboardAvoidingView} from 'react-native';

import {isIOS} from '_utils';

interface KeyboardAvoidingViewProps {
  children: ReactNode;
}

export const CustomKeyboardAvoidingView: React.FC<
  KeyboardAvoidingViewProps
> = ({children}: KeyboardAvoidingViewProps) => {
  return (
    <NativeKeyboardAvoidingView
      style={{flex: 1, paddingHorizontal: 8}}
      behavior={isIOS ? 'padding' : undefined}>
      {children}
    </NativeKeyboardAvoidingView>
  );
};
