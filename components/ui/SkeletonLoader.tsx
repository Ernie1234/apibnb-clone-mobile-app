import React from "react";

import { View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { Skeleton } from "moti/skeleton";

const ListingSkeleton = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* {[...Array(6)].map((_, index) => (
        <View key={index} style={styles.card}>
          <Skeleton width="100%" height={150} radius={8} />
          <View style={styles.details}>
            <Skeleton width="70%" height={16} radius={4} />
            <Skeleton width="50%" height={14} radius={4} />
            <Skeleton width="40%" height={14} radius={4} />
          </View>
        </View>
      ))} */}
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#000" }}>
        Loading Listings...
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 8,
  },
  card: {
    width: "48%",
    marginBottom: 16,
  },
  details: {
    marginTop: 8,
    gap: 4,
  },
});

export default ListingSkeleton;
