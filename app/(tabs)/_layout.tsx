import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarLabelStyle: { fontFamily: "nun-sb" },
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              size={28}
              name="magnify"
              color={focused ? color : Colors.light.dark}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: "Wishlists",

          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              size={28}
              name={focused ? "heart" : "heart-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="properties"
        options={{
          title: "Airbnb",

          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={28} name="airbnb" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reservations"
        options={{
          title: "Reservations",

          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              size={28}
              name={focused ? "bookmark" : "bookmark-o"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",

          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="person-circle-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
