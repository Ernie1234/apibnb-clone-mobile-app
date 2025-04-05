import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import HeartBtn from "./HeartBtn";
import { Colors } from "@/constants/Colors";
import { IListing } from "@/types/listing-types";
import { formatPrice, getSupportedImageUrl, timeAgo } from "@/libs/utils/fn";

interface ListingCardProps {
  listing: IListing;
}

const { width } = Dimensions.get("window");
const CARD_PADDING = 6; // Added padding constant
const CARD_WIDTH = width - CARD_PADDING * 2; // Calculate width minus padding

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

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
    console.log("Listing ID: ", listing.id);
  };

  const imageUrl = getSupportedImageUrl(listing.imageSrc[currentImageIndex]);

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity style={styles.container} onPress={navigateToListing}>
        <View style={styles.imageContainer}>
          {!imageError ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={[styles.image, styles.fallbackImage]}>
              <Ionicons
                name="image-outline"
                size={50}
                color={Colors.light.muted}
              />
            </View>
          )}
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
          <View style={styles.priceWrapper}>
            <Text style={styles.price}>${formatPrice(listing.price)} </Text>
            <Text style={styles.nightText}>night</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: CARD_PADDING, // Added horizontal padding
    marginBottom: 16, // Increased bottom margin for better spacing
  },
  container: {
    width: "100%", // Takes full width of parent (minus padding)
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
    fontFamily: "nun-sb",
    fontSize: 20, // Slightly larger for better readability
    fontWeight: "600",
    color: Colors.light.text,
  },
  time: {
    fontFamily: "nun",
    fontSize: 16,
    color: Colors.light.muted,
  },
  category: {
    fontFamily: "nun",
    fontSize: 16,
    color: Colors.light.muted,
  },
  priceWrapper: {
    marginTop: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  price: {
    fontFamily: "nun-sb",
    fontSize: 18, // Slightly larger
    fontWeight: "600",
    color: Colors.light.text,
  },
  nightText: {
    fontFamily: "nun",
    fontSize: 16,
    fontWeight: "normal",
    color: Colors.light.muted,
  },
  fallbackImage: {
    backgroundColor: Colors.light.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ListingCard;
