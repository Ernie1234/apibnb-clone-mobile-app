import React, { useLayoutEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  runOnJS,
  SlideInDown,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { useListing } from "@/hooks/use-listing";
import { getSupportedImageUrl } from "@/libs/utils/fn";

const IMG_HEIGHT = 300;
const { width } = Dimensions.get("window");

// const listing = {
//   id: 6,
//   name: "Cozy Apartment in the heart of Paris",
//   category: "Entire apartment",
//   location: "Paris, France",
//   guestCount: 2,
//   bedroomCount: 1,
//   bedCount: 1,
//   bathroomCount: 1,
//   review_scores_rating: 95,
//   number_of_reviews: 123,
//   host_picture_url:
//     "https://a0.muscache.com/im/users/123456789/profile_pic/1617447957/original.jpg?im_w=32",
//   host_name: "John Doe",
//   price: 150,
//   imageSrc: [
//     "https://a0.muscache.com/im/ml/photo_enhancement/pictures/014df369-194e-47b1-9d5e-197a22ea9f40.jpg?im_w=1200",
//     "https://a0.muscache.com/im/ml/photo_enhancement/pictures/de6ad764-8ab1-4318-a808-d667b5c9a423.jpg?im_w=720",
//     "https://a0.muscache.com/im/ml/photo_enhancement/pictures/5f0c26e8-194e-4a62-ad52-051c4843e95f.jpg?im_w=720",
//     "https://a0.muscache.com/im/ml/photo_enhancement/pictures/8a7a7845-351b-4da4-b4fe-9bda597a6648.jpg?im_w=720",
//     "https://a0.muscache.com/im/ml/photo_enhancement/pictures/1ab2058b-de9b-492a-8a99-0b42b7db5b3c.jpg?im_w=720",
//   ],
//   host_since: "2015",
//   description:
//     "This cozy apartment is located in the heart of Paris, just a few steps away from the Eiffel Tower. It features a fully equipped kitchen, a comfortable living room, and a beautiful view of the city. The apartment is located in a quiet neighborhood, close to many restaurants and shops. The metro station is just a 5-minute walk away, making it easy to explore the city. This cozy apartment is located in the heart of Paris, just a few steps away from the Eiffel Tower. It features a fully equipped kitchen, a comfortable living room, and a beautiful view of the city. The apartment is located in a quiet neighborhood, close to many restaurants and shops. The metro station is just a 5-minute walk away, making it easy to explore the city. This cozy apartment is located in the heart of Paris, just a few steps away from the Eiffel Tower. It features a fully equipped kitchen, a comfortable living room, and a beautiful view of the city. The apartment is located in a quiet neighborhood, close to many restaurants and shops. The metro station is just a 5-minute walk away, making it easy to explore the city. This cozy apartment is located in the heart of Paris, just a few steps away from the Eiffel Tower. It features a fully equipped kitchen, a comfortable living room, and a beautiful view of the city. The apartment is located in a quiet neighborhood, close to many restaurants and shops. The metro station is just a 5-minute walk away, making it easy to explore the city.",
//   amenities: ["Wifi", "Kitchen", "Private entrance", "Breakfast"],
//   neighborhood_overview:
//     "The apartment is located in a quiet neighborhood, close to many restaurants and shops. The metro station is just a 5-minute walk away, making it easy to explore the city.",
//   transit: "Metro station: 5-minute walk",
//   access: "24-hour doors",
//   house_rules: "No smoking",
//   listing_url: "https://www.airbnb.com/rooms/6",
// };
const SingleListingDetails = () => {
  const { listingId } = useLocalSearchParams<{ listingId: string }>();
  const {
    data: listingData,
    isLoading,
    error,
  } = useListing(listingId as string);
  const listing = listingData?.data;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigation = useNavigation();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const handleNextImage = () => {
    if (currentImageIndex < listing.imageSrc.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const swipeGesture = Gesture.Pan().onEnd((e) => {
    if (e.translationX < -50) {
      // Swipe left - go to next image
      runOnJS(handleNextImage)();
    } else if (e.translationX > 50) {
      // Swipe right - go to previous image
      runOnJS(handlePrevImage)();
    }
  });

  const shareListing = async () => {
    try {
      if (!listing) return;

      await Share.share({
        title: listing.title,
        url: `${process.env.EXPO_PUBLIC_WEB_APP_BASE_URL}/listings/${listing.id}`,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useLayoutEffect(() => {
    if (!listingData) return;

    navigation.setOptions({
      headerTitle: "",
      headerTransparent: true,
      headerBackground: () => (
        <Animated.View style={[headerAnimatedStyle, styles.header]} />
      ),
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
            <Ionicons name="share-outline" size={22} color={"#000"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="heart-outline" size={22} color={"#000"} />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={styles.roundButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={"#000"} />
        </TouchableOpacity>
      ),
    });
  }, [listing]);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning-outline" size={48} color={Colors.light.red} />
        <Text style={styles.errorText}>Failed to load listing details</Text>
        <Text style={styles.errorSubText}>{error.message}</Text>
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="search-outline" size={48} color={Colors.light.gray} />
        <Text style={styles.errorText}>Listing not found</Text>
      </View>
    );
  }

  const imageUrl = getSupportedImageUrl(listing.imageSrc[currentImageIndex]);

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        ref={scrollRef}
        scrollEventThrottle={16}
      >
        <View style={styles.imageContainer}>
          <GestureDetector gesture={swipeGesture}>
            <Animated.Image
              source={{ uri: imageUrl }}
              style={[styles.image, imageAnimatedStyle]}
            />
          </GestureDetector>

          {/* Navigation Arrows */}
          {currentImageIndex > 0 && (
            <TouchableOpacity
              style={[styles.navButton, styles.prevButton]}
              onPress={handlePrevImage}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          )}

          {currentImageIndex < listing.imageSrc.length - 1 && (
            <TouchableOpacity
              style={[styles.navButton, styles.nextButton]}
              onPress={handleNextImage}
            >
              <Ionicons name="chevron-forward" size={24} color="white" />
            </TouchableOpacity>
          )}

          {/* Image Counter */}
          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>
              {currentImageIndex + 1}/{listing.imageSrc.length}
            </Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{listing.title}</Text>
          <Text style={styles.location}>
            {listing.category} in {listing.location}
          </Text>
          <Text style={styles.rooms}>
            {listing.guestCount} guests · {listing.roomCount} bedrooms ·{" "}
            {listing?.bedCount} bed · {listing?.bathroomCount} bathrooms
          </Text>
          <View style={{ flexDirection: "row", gap: 4 }}>
            <Ionicons name="star" size={16} />
            <Text style={styles.ratings}>
              {listing.review_scores_rating / 20} · {listing.number_of_reviews}{" "}
              reviews
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.hostView}>
            <Image
              source={{ uri: listing.host_picture_url }}
              style={styles.host}
            />

            <View>
              <Text style={{ fontWeight: "500", fontSize: 16 }}>
                Hosted by {listing.host_name}
              </Text>
              <Text>Host since {listing.host_since}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.description}>{listing.description}</Text>
        </View>
      </Animated.ScrollView>

      <Animated.View
        style={defaultStyles.footer}
        entering={SlideInDown.delay(200)}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity style={styles.footerText}>
            <Text style={styles.footerPrice}>€{listing.price}</Text>
            <Text>night</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[defaultStyles.btn, { paddingRight: 20, paddingLeft: 20 }]}
          >
            <Text style={defaultStyles.btnText}>Reserve</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default SingleListingDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width,
    height: IMG_HEIGHT,
  },
  infoContainer: {
    padding: 24,
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    fontFamily: "mon-sb",
  },
  location: {
    fontSize: 18,
    marginTop: 10,
    fontFamily: "mon-sb",
  },
  rooms: {
    fontSize: 16,
    color: Colors.light.gray,
    marginVertical: 4,
    fontFamily: "mon",
  },
  ratings: {
    fontSize: 16,
    fontFamily: "mon-sb",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.light.gray,
    marginVertical: 16,
  },
  host: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Colors.light.gray,
  },
  hostView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  footerText: {
    height: "100%",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerPrice: {
    fontSize: 18,
    fontFamily: "mon-sb",
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    color: Colors.light.primary,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  header: {
    backgroundColor: "#fff",
    height: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.light.gray,
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: "mon",
  },
  navButton: {
    position: "absolute",
    top: "50%",
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ translateY: -20 }],
  },
  prevButton: {
    left: 10,
  },
  nextButton: {
    right: 10,
  },
  imageCounter: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  imageCounterText: {
    color: "white",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 12,
  },
  errorText: {
    fontSize: 18,
    fontFamily: "mon-sb",
    color: Colors.light.dark,
    textAlign: "center",
  },
  errorSubText: {
    fontSize: 14,
    fontFamily: "mon",
    color: Colors.light.gray,
    textAlign: "center",
  },
});
