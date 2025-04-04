import React from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "@/hooks/use-auth";
import { useFavourites } from "@/hooks/use-favourite";
import { Colors } from "@/constants/Colors";

interface HeartBtnProps {
  listingId: string;
}

const HeartBtn: React.FC<HeartBtnProps> = ({ listingId }) => {
  const { isLoggedIn } = useAuth();
  const { favourites, addFavouriteMutation, removeFavouriteMutation } =
    useFavourites(isLoggedIn ?? undefined);

  const isFavourite = favourites?.some((fav) => fav.id === listingId);
  const isLoading =
    addFavouriteMutation.isPending || removeFavouriteMutation.isPending;

  const handlePress = () => {
    if (!isLoggedIn) {
      // Navigate to login or show login modal
      return;
    }

    if (isFavourite) {
      removeFavouriteMutation.mutate(listingId);
    } else {
      addFavouriteMutation.mutate(listingId);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} disabled={isLoading}>
      {isLoading ? (
        <ActivityIndicator size="small" color={Colors.light.primary} />
      ) : (
        <Ionicons
          name={isFavourite ? "heart" : "heart-outline"}
          size={24}
          color={isFavourite ? Colors.light.primary : "white"}
        />
      )}
    </TouchableOpacity>
  );
};

export default HeartBtn;
