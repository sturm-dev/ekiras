import React, {useState} from 'react';
import {Image, View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import AnimatedLottieView from 'lottie-react-native';

import {ScreenSafeArea, TextByScale} from '_atoms';
import {OnboardingStackParamList} from '_navigations';
import {DEVICE_WIDTH, MyThemeInterfaceColors, themedStyleSheet} from '_utils';
import {useNavigationReset} from '_hooks';
import {Button} from '_molecules';
import {saveLocalData} from '_db';

import {
  image_censored,
  image_cuneiform,
  image_ekiras,
  image_freedomOfSpeech,
  image_polygonAndEthereum,
} from 'src/assets/images';
import {
  animation_blockchain,
  animation_megaphone,
  animation_rocket,
} from 'src/assets/animations';
import {CUSTOM_FONT} from 'src/config/constants';

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

  const onFinish = async () => {
    await saveLocalData('slidesAlreadySeen', 'true');

    handleResetNavigation({
      stack: 'Stack_App',
      screen: 'Screen_Home',
    });
  };

  const data = [
    {
      id: 1,
      image: image_ekiras,
      squareImage: true,
      squareImageWithCustomSize: 0.7,
      title: 'Ekiras',
      text2: 'Using blockchain technology to take back power to individuals',
    },
    {
      id: 2,
      image: image_freedomOfSpeech,
      portraitImage: true,
      text: 'I disapprove of what you say, but I will defend to the death your right to say it.',
      text2: '- Voltaire',
    },
    {
      id: 3,
      image: image_censored,
      portraitImage: true,
      subTitle: 'Censored not allowed',
      text: `In today's internet if we post something that generates controversy or makes someone in power uncomfortable in any way we can be censored and our post deleted, and thus the rest of the people never get to see it.`,
    },
    {
      id: 4,
      animation: animation_megaphone,
      animationCustomSize: '110%',
      portraitImage: true,
      subTitle: `It's your time to say it`,
      text: 'This app is a tool to express opinions and thoughts freely about anything, without anyone having the power to censor or delete what is published thanks to the power of blockchain technology.',
    },
    {
      id: 5,
      image: image_cuneiform,
      portraitImage: true,
      subTitle: 'Why Ekiras?',
      text: `The idea is that what you publish with this app "will be written in stone" that's why the name of this app, which in hungarian means cuneiform, the first type of writing in stone that we know of.`,
    },
    {
      id: 6,
      image: image_polygonAndEthereum,
      subTitle: `Where is the data stored?`,
      text: `All the dynamic information from this app will be stored publicly on the Polygon network and in a some way in the Ethereum network as well.`,
    },
    {
      id: 7,
      animation: animation_blockchain,
      subTitle: `Exchange of value`,
      text: `In most of the apps if they are "free" is that we pay with our information, to use this app you will have to moderate the publications of other users or if you do not want to do this you can buy US$ 0.99 in crypto from this app which will give you many interactions.`,
    },
    {
      id: 8,
      animation: animation_rocket,
      animationCustomSize: '120%',
      lastSlide: true,
      text: `This is one of the first apps that gives the power of blockchain to the average user, it's your time to be part of this revolution!`,
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
          renderItem={({
            item: {
              image,
              title,
              subTitle,
              text,
              text2,
              portraitImage,
              squareImage,
              squareImageWithCustomSize,
              lastSlide,
              animation,
              animationCustomSize,
            },
          }) => {
            return (
              <View style={styles.slide}>
                {!animation ? (
                  <View style={styles.imageContainer}>
                    <Image
                      source={image}
                      style={{
                        width: portraitImage
                          ? 571 * 0.48
                          : squareImage
                          ? DEVICE_WIDTH *
                            (squareImageWithCustomSize
                              ? squareImageWithCustomSize
                              : 0.7)
                          : 2282 * 0.127,
                        height: portraitImage
                          ? 792 * 0.48
                          : squareImage
                          ? DEVICE_WIDTH *
                            (squareImageWithCustomSize
                              ? squareImageWithCustomSize
                              : 0.7)
                          : 1704 * 0.127,
                        borderRadius: 12,
                      }}
                    />
                  </View>
                ) : (
                  <View style={styles.animationContainer}>
                    <AnimatedLottieView
                      source={animation}
                      autoPlay
                      loop
                      style={{
                        width: animationCustomSize
                          ? animationCustomSize
                          : '90%',
                        ...(lastSlide ? {marginBottom: -70} : {}),
                      }}
                    />
                  </View>
                )}
                <View style={styles.textContainer}>
                  {title ? (
                    <TextByScale
                      scale="h1"
                      center
                      style={{
                        fontFamily: CUSTOM_FONT.BOLD,
                        letterSpacing: 1.5,
                      }}>
                      {title}
                    </TextByScale>
                  ) : null}
                  {subTitle ? (
                    <TextByScale
                      scale="h4"
                      center
                      style={{
                        marginTop: -25,
                        marginBottom: 10,
                        fontFamily: CUSTOM_FONT.BOLD,
                        letterSpacing: 1,
                      }}>
                      {subTitle}
                    </TextByScale>
                  ) : null}
                  {text ? (
                    <TextByScale scale="body2" center>
                      {text}
                    </TextByScale>
                  ) : null}
                  {text2 ? (
                    <TextByScale
                      scale="body2"
                      color={colors.text2}
                      center
                      style={{marginTop: 5}}>
                      {text2}
                    </TextByScale>
                  ) : null}
                </View>

                {lastSlide ? (
                  <Button
                    text="I am ready to go!"
                    onPress={onFinish}
                    style={{marginTop: 30}}
                  />
                ) : null}
              </View>
            );
          }}
        />
        <Pagination
          dotsLength={data.length}
          activeDotIndex={activeSlide}
          dotStyle={styles.paginationDot}
        />
      </View>
    </ScreenSafeArea>
  );
};

const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 25,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: slide_width,
  },
  imageContainer: {},
  animationContainer: {},
  textContainer: {
    width: slide_width,
    marginTop: 30,
    padding: 20,
    alignItems: 'center',
  },
  paginationDot: {
    backgroundColor: colors.text,
  },
}));
