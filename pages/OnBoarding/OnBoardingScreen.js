import React, { useRef, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: '1',
    title: "Explore Food Anywhere",
    description: "Explore nearby restaurants or street food with additional information such as restaurant name, featured menu, ratings, and reviews through AR display.",
    image: require('../../assets/OnBoarding/onboarding1.png'),
  },
  {
    id: '2',
    title: "Find the Best Foods",
    description: "Discover the best flavors around you easily and quickly. This app helps you explore a variety of culinary options, from popular restaurants to local hidden gems.",
    image: require('../../assets/OnBoarding/onboarding2.png'),
  },
  {
    id: '3',
    title: "Scan to recognize Food",
    description: "Ravelo uses camera and AR technology to instantly recognize food types. Simply point the camera at a dish, and Ravelo will display information the name of the dish.",
    image: require('../../assets/OnBoarding/onboarding3.png'),
  },
];

const OnboardingScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const handleScroll = (event) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slide);
  };

  const goNext = () => {
    if (currentSlide < slides.length - 1) {
        flatListRef.current.scrollToIndex({ index: currentSlide + 1 });
    } else {
        navigation.replace("Started");
    }
    };

    const skip = () => {
    navigation.replace("Started");
    };

  const renderSlide = ({ item }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.onboardingImage} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/OnBoarding/logo_atas_ravelo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
      />

      <View style={styles.whiteContainer}>
        <View style={styles.headerLine} />

        <Text style={styles.title}>
          {slides[currentSlide].title}
        </Text>

        <Text style={styles.desc}>
          {slides[currentSlide].description}
        </Text>

        <View style={styles.indicatorLayout}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentSlide === index && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonRow}>
            {currentSlide < slides.length - 1 ? (
                <>
                <TouchableOpacity style={styles.skipButton} onPress={skip}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.nextButton} onPress={goNext}>
                    <Text style={styles.nextText}>Next</Text>
                </TouchableOpacity>
                </>
            ) : (
                <TouchableOpacity style={styles.getStartedButton} onPress={() => {
                // Arahkan ke login/home screen di sini
                console.log('Get Started clicked!');
                navigation.replace("Started");
                }}>
                <Text style={styles.getStartedText}>Get Started</Text>
                </TouchableOpacity>
            )}
        </View>
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#911F1B",
  },
  logo: {
    width: width * 0.6,
    height: 50,
    marginTop: 48,
    alignSelf: "center",
  },
  flatList: {
    flexGrow: 0,
    height: height * 0.5,
  },
  slide: {
    width: width,
    height: height * 0.5,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  onboardingImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  whiteContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 10,
    justifyContent: "center",
  },
  headerLine: {
    width: 80,
    height: 8,
    backgroundColor: "#911F1B",
    borderRadius: 100,
    alignSelf: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    color: "#E6020B",
    textAlign: "center",
    marginTop: 10,
    fontFamily: 'PoppinsBold',
  },
  desc: {
    fontSize: 14,
    color: "#391713",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 8,
    lineHeight: 20,
    fontFamily: 'PoppinsRegular',
  },
  indicatorLayout: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },
  dot: {
    width: 20,
    height: 6,
    borderRadius: 4,
    backgroundColor: "#F3E9B5",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#E6020B",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 35,
    justifyContent: "space-between",
  },
  skipButton: {
    flex: 1,
    backgroundColor: "#E6E6E6",
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
    marginRight: 4,
  },
  nextButton: {
    flex: 1,
    backgroundColor: "#E6020B",
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
    marginLeft: 4,
  },
  skipText: {
    color: "#991F1C",
    fontWeight: "600",
    fontFamily: 'PoppinsMedium',
  },
  nextText: {
    color: "#fff",
    fontWeight: "600",
    fontFamily: 'PoppinsMedium',
  },
  getStartedButton: {
    flex: 1,
    backgroundColor: "#E6020B",
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
  },

    getStartedText: {
    color: "#fff",
    fontWeight: "600",
    fontFamily: 'PoppinsMedium',
  },

});