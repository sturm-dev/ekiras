import {useTheme} from '@react-navigation/native';
import React from 'react';
import {TouchableOpacity, View, ViewStyle} from 'react-native';

import Icon_AntDesign from 'react-native-vector-icons/AntDesign';
import Icon_Entypo from 'react-native-vector-icons/Entypo';
import Icon_EvilIcons from 'react-native-vector-icons/EvilIcons';
import Icon_Feather from 'react-native-vector-icons/Feather';
import Icon_FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon_FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon_Fontisto from 'react-native-vector-icons/Fontisto';
import Icon_Foundation from 'react-native-vector-icons/Foundation';
import Icon_Ionicons from 'react-native-vector-icons/Ionicons';
import Icon_MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon_MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon_Octicons from 'react-native-vector-icons/Octicons';
import Icon_SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Icon_Zocial from 'react-native-vector-icons/Zocial';

import {MyThemeInterfaceColors} from '_utils';

export type IconType =
  | 'antdesign'
  | 'entypo'
  | 'evilicon'
  | 'feather'
  | 'font-awesome'
  | 'font-awesome-5'
  | 'fontisto'
  | 'foundation'
  | 'ionicon'
  | 'material'
  | 'material-community'
  | 'octicon'
  | 'simple-line-icon'
  | 'zocial';

interface IconProps {
  /**
   * @default 'material'
   */
  type?: IconType;
  name: string;
  /**
   * @default 24
   */
  size?: number;
  color?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export const CustomIcon: React.FC<IconProps> = (iconProps: IconProps) => {
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;
  const {
    type,
    name,
    size,
    color = colors.text,
    onPress,
    style,
    ...props
  } = iconProps;

  const getIcon = (_type: IconType): typeof Icon_MaterialIcons => {
    if (_type === 'antdesign') return Icon_AntDesign;
    else if (_type === 'entypo') return Icon_Entypo;
    else if (_type === 'evilicon') return Icon_EvilIcons;
    else if (_type === 'feather') return Icon_Feather;
    else if (_type === 'font-awesome') return Icon_FontAwesome;
    else if (_type === 'fontisto') return Icon_Fontisto;
    else if (_type === 'foundation') return Icon_Foundation;
    else if (_type === 'ionicon') return Icon_Ionicons;
    else if (_type === 'material-community') return Icon_MaterialCommunityIcons;
    else if (_type === 'octicon') return Icon_Octicons;
    else if (_type === 'simple-line-icon') return Icon_SimpleLineIcons;
    else if (_type === 'zocial') return Icon_Zocial;
    // return materialIcons by default
    else return Icon_MaterialIcons;
  };

  let FinalIcon;

  if (type === 'font-awesome-5') {
    FinalIcon = (
      <Icon_FontAwesome5 name={name} size={size} color={color} {...props} />
    );
  } else {
    const PmIcon: typeof Icon_MaterialIcons = getIcon(type as IconType);
    FinalIcon = <PmIcon name={name} size={size} color={color} {...props} />;
  }

  if (style) FinalIcon = <View style={style}>{FinalIcon}</View>;
  if (onPress) {
    FinalIcon = (
      <TouchableOpacity
        hitSlop={{top: 15, right: 15, left: 15, bottom: 15}}
        onPress={onPress}>
        {FinalIcon}
      </TouchableOpacity>
    );
  }

  return FinalIcon;
};

CustomIcon.defaultProps = {
  type: 'material',
  size: 24,
  color: undefined,
  onPress: undefined,
  style: {},
};
