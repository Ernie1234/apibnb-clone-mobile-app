import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";

interface EmptyListingProps {
  showReset?: boolean;
  onReset?: () => void;
}

const EmptyListing: React.FC<EmptyListingProps> = ({ showReset, onReset }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="home-outline" size={48} color={Colors.light.muted} />
      <Text style={styles.title}>No listings found</Text>
      <Text style={styles.subtitle}>Try adjusting your search or filters</Text>
      {showReset && (
        <TouchableOpacity style={styles.button} onPress={onReset}>
          <Text style={styles.buttonText}>Reset Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.muted,
    marginTop: 8,
    textAlign: "center",
  },
  button: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default EmptyListing;
