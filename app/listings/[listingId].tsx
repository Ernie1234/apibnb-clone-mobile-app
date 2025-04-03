import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const SingleListingDetails = () => {
  const { listingId } = useLocalSearchParams<{ listingId: string }>();

  return (
    <View>
      <Text>SingleListingDetails: {listingId}</Text>
    </View>
  );
};

export default SingleListingDetails;

const styles = StyleSheet.create({});
