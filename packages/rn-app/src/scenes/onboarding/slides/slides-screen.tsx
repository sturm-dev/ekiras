import React, {useState} from 'react';
import {Image, View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Carousel, {Pagination} from 'react-native-snap-carousel';

import {ScreenSafeArea, TextByScale} from '_atoms';
import {OnboardingStackParamList} from '_navigations';
import {DEVICE_WIDTH, MyThemeInterfaceColors, themedStyleSheet} from '_utils';
import {useNavigationReset} from '_hooks';
import {image_freedomOfSpeech} from 'src/assets/images';

export type Screen_Slides__Params = undefined;

type Screen_Slides__Prop = NativeStackNavigationProp<
  OnboardingStackParamList,
  'Screen_Slides'
>;

const slide_width = DEVICE_WIDTH * 0.8;

export const Screen_Slides: React.FC<{
  route: RouteProp<{
    params: Screen_Slides__Params;
  }>;
}> = ({route}) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const navigation = useNavigation<Screen_Slides__Prop>();
  const {params} = route;

  const [activeSlide, setActiveSlide] = useState(0);

  const {handleResetNavigation} = useNavigationReset();

  React.useEffect(() => {
    // delete all this console.log - is for not showing error of unused vars
    if (!colors) console.log();
    if (!navigation) console.log();
    if (!params) console.log();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = () => {
    handleResetNavigation({
      stack: 'Stack_App',
      screen: 'Screen_Home',
    });
  };

  const data = [
    {
      id: 1,
      image: image_freedomOfSpeech, // https://ar.pinterest.com/pin/488429522065195857/
      text: 'I disapprove of what you say, but I will defend to the death your right to say it. - Voltaire',
    },
    {
      id: 2,
      image: image_freedomOfSpeech,
      text: 'I disapprove of what you say, but I will defend to the death your right to say it. - Voltaire',
    },
    {
      id: 3,
      image: image_freedomOfSpeech,
      text: 'I disapprove of what you say, but I will defend to the death your right to say it. - Voltaire',
    },
  ];

  return (
    <ScreenSafeArea withBottomEdgeToo colorStatusBar={colors.background}>
      <View style={styles.container}>
        <Carousel
          data={data}
          sliderWidth={DEVICE_WIDTH}
          itemWidth={slide_width}
          onSnapToItem={index => setActiveSlide(index)}
          renderItem={({item: {image, text}}) => {
            return (
              <View style={styles.slide}>
                <View style={styles.imageContainer}>
                  <Image
                    source={image}
                    style={{
                      width: 571 * 0.5,
                      height: 792 * 0.5,
                      borderRadius: 12,
                    }}
                  />
                </View>
                <View style={styles.textContainer}>
                  <TextByScale scale="h6">{text}</TextByScale>
                </View>
              </View>
            );
          }}
        />
        <Pagination
          dotsLength={data.length}
          activeDotIndex={activeSlide}
          // containerStyle={styles.paginationContainer}
          // dotColor={'rgba(255, 255, 255, 0.92)'}
          // dotStyle={styles.paginationDot}
          // inactiveDotColor={colors.black}
          // inactiveDotOpacity={0.4}
          // inactiveDotScale={0.6}
          // carouselRef={this._slider1Ref}
          // tappableDots={!!this._slider1Ref}
        />
      </View>
    </ScreenSafeArea>
  );
};

const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: slide_width,
  },
  imageContainer: {},
  textContainer: {
    marginTop: 30,
    width: slide_width,
    padding: 10,
  },
}));
