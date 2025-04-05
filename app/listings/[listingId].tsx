import React, { useLayoutEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  Dimensions,
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  SlideInDown,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";

const IMG_HEIGHT = 300;
const { width } = Dimensions.get("window");

const listing = {
  id: 6,
  name: "Cozy Apartment in the heart of Paris",
  room_type: "Entire apartment",
  smart_location: "Paris, France",
  guests_included: 2,
  bedrooms: 1,
  beds: 1,
  bathrooms: 1,
  review_scores_rating: 95,
  number_of_reviews: 123,
  host_picture_url:
    "https://a0.muscache.com/im/users/123456789/profile_pic/1617447957/original.jpg?im_w=32",
  host_name: "John Doe",
  price: 150,
  host_since: "2015",
  description:
    "This cozy apartment is located in the heart of Paris, just a few steps away from the Eiffel Tower. It features a fully equipped kitchen, a comfortable living room, and a beautiful view of the city. The apartment is located in a quiet neighborhood, close to many restaurants and shops. The metro station is just a 5-minute walk away, making it easy to explore the city. This cozy apartment is located in the heart of Paris, just a few steps away from the Eiffel Tower. It features a fully equipped kitchen, a comfortable living room, and a beautiful view of the city. The apartment is located in a quiet neighborhood, close to many restaurants and shops. The metro station is just a 5-minute walk away, making it easy to explore the city. This cozy apartment is located in the heart of Paris, just a few steps away from the Eiffel Tower. It features a fully equipped kitchen, a comfortable living room, and a beautiful view of the city. The apartment is located in a quiet neighborhood, close to many restaurants and shops. The metro station is just a 5-minute walk away, making it easy to explore the city. This cozy apartment is located in the heart of Paris, just a few steps away from the Eiffel Tower. It features a fully equipped kitchen, a comfortable living room, and a beautiful view of the city. The apartment is located in a quiet neighborhood, close to many restaurants and shops. The metro station is just a 5-minute walk away, making it easy to explore the city.",
  amenities: ["Wifi", "Kitchen", "Private entrance", "Breakfast"],
  neighborhood_overview:
    "The apartment is located in a quiet neighborhood, close to many restaurants and shops. The metro station is just a 5-minute walk away, making it easy to explore the city.",
  transit: "Metro station: 5-minute walk",
  access: "24-hour doors",
  house_rules: "No smoking",
  listing_url: "https://www.airbnb.com/rooms/6",
};
const SingleListingDetails = () => {
  const { listingId } = useLocalSearchParams<{ listingId: string }>();

  const navigation = useNavigation();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const shareListing = async () => {
    try {
      await Share.share({
        title: listing.name,
        url: listing.listing_url,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerTransparent: true,

      headerBackground: () => (
        <Animated.View
          style={[headerAnimatedStyle, styles.header]}
        ></Animated.View>
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
  }, []);

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

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        ref={scrollRef}
        scrollEventThrottle={16}
      >
        <Animated.Image
          source={{
            uri: "https://a0.muscache.com/im/ml/photo_enhancement/pictures/014df369-194e-47b1-9d5e-197a22ea9f40.jpg?im_w=1200",
          }}
          style={[styles.image, imageAnimatedStyle]}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{listing.name}</Text>
          <Text style={styles.location}>
            {listing.room_type} in {listing.smart_location}
          </Text>
          <Text style={styles.rooms}>
            {listing.guests_included} guests · {listing.bedrooms} bedrooms ·{" "}
            {listing.beds} bed · {listing.bathrooms} bathrooms
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
});
