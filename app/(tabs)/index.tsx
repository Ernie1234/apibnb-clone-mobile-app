import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";

const HomeScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <StatusBar
        backgroundColor={Colors.light.tertiary}
        style={"inverted"}
        animated={true}
      />
      <View>
        <Text style={styles.text}>HomeScreen</Text>
        <Text>Hello world</Text>
        <Link href={`/listings/[listingId]`}>Single Listing Details </Link>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: Colors.light.text,
    fontFamily: "nun",
  },
});
