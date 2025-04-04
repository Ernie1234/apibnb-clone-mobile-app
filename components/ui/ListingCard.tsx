import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import HeartBtn from "./HeartBtn";
import { Colors } from "@/constants/Colors";
import { IListing } from "@/types/listing-types";
import { formatPrice, timeAgo } from "@/libs/utils/fn";

interface ListingCardProps {
  listing: IListing;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 32) / 2 - 8;

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const navigation = useNavigation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === listing.imageSrc.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? listing.imageSrc.length - 1 : prevIndex - 1
    );
  };

  const navigateToListing = () => {
    // navigation.navigate("ListingDetails", { listingId: listing.id });
    // navigation.navigate("ListingDetails", { listing });
    console.log("Listing ID: ", listing.id);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={navigateToListing}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: listing.imageSrc[currentImageIndex] }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.heartContainer}>
          <HeartBtn listingId={listing.id} />
        </View>

        {listing.imageSrc.length > 1 && (
          <>
            <TouchableOpacity
              style={[styles.navButton, styles.prevButton]}
              onPress={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              disabled={currentImageIndex === 0}
            >
              <Ionicons name="chevron-back" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navButton, styles.nextButton]}
              onPress={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              disabled={currentImageIndex === listing.imageSrc.length - 1}
            >
              <Ionicons name="chevron-forward" size={20} color="white" />
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1}>
          {listing.title}
        </Text>
        <Text style={styles.time}>Added {timeAgo(listing.createdAt)}</Text>
        <Text style={styles.category}>{listing.category}</Text>
        <Text style={styles.price}>
          ${formatPrice(listing.price)}{" "}
          <Text style={styles.nightText}>night</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: 8,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: Colors.light.gray,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  heartContainer: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  navButton: {
    position: "absolute",
    top: "50%",
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ translateY: -15 }],
  },
  prevButton: {
    left: 8,
  },
  nextButton: {
    right: 8,
  },
  details: {
    paddingTop: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
  },
  time: {
    fontSize: 12,
    color: Colors.light.muted,
    marginTop: 2,
  },
  category: {
    fontSize: 12,
    color: Colors.light.muted,
    marginTop: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    marginTop: 4,
  },
  nightText: {
    fontSize: 12,
    fontWeight: "normal",
    color: Colors.light.muted,
  },
});

export default ListingCard;
