import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { Link } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { IconRenderer } from "./IconRenderer";
import { categories } from "@/types/category-types";

interface Props {
  onCategoryChanged: (category: string) => void;
}

const ListingHeader = ({ onCategoryChanged }: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<
    Array<React.ElementRef<typeof TouchableOpacity> | null>
  >([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectCategory = (index: number) => {
    const seleted = itemsRef.current[index];
    setActiveIndex(index);

    seleted?.measure((x) => {
      scrollRef.current?.scrollTo({
        x: x - 16,
        animated: true,
      });
    });

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryChanged(categories[index].name);
  };

  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
    <View style={styles.container}>
      <View style={styles.actionRow}>
        <Link href="/(modals)/booking" asChild>
          <TouchableOpacity style={styles.searchBtn}>
            <Ionicons name="search" size={24} />
            <View>
              <Text style={{ fontFamily: "nun-sb" }}>Where to?</Text>
              <Text style={{ fontFamily: "nun", color: Colors.light.gray }}>
                Anywhere . Any week . Add guests
              </Text>
            </View>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity
          onPress={() => console.log("ListingHeader")}
          style={styles.filterBtn}
        >
          <Ionicons name="filter" size={24} color={Colors.light.text} />
        </TouchableOpacity>
      </View>
      <ScrollView
        ref={scrollRef}
        horizontal
        contentContainerStyle={styles.scrollView}
        showsHorizontalScrollIndicator={false}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={category.id}
            ref={(ref) => (itemsRef.current[index] = ref)}
            style={
              activeIndex === index
                ? styles.categoryBtnActive
                : styles.categoryBtn
            }
            onPress={() => selectCategory(index)}
          >
            {/* <MaterialIcons
              name={category.icon as any}
              size={24}
              color={
                activeIndex === index ? Colors.light.text : Colors.light.gray
              }
            /> */}
            <IconRenderer
              iconSet={category.iconSet}
              iconName={category.icon}
              color={
                activeIndex === index ? Colors.light.text : Colors.light.gray
              }
            />
            <Text
              style={
                activeIndex === index
                  ? styles.categoryTextActive
                  : styles.categoryText
              }
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
    // </SafeAreaView>
  );
};

export default ListingHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    paddingTop: 5,
    paddingBottom: 16,
    height: 160,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.light.tertiary,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 16,
  },

  searchBtn: {
    backgroundColor: "#fff",
    flexDirection: "row",
    gap: 10,
    padding: 14,
    alignItems: "center",
    width: 280,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#c2c2c2",
    borderRadius: 50,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  filterBtn: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#A2A0A2",
    backgroundColor: "#fff",
    borderRadius: 24,
  },
  scrollView: {
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 16,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: "mon-sb",
    color: Colors.light.gray,
  },
  categoryTextActive: {
    fontSize: 14,
    fontFamily: "mon-sb",
    color: "#000",
  },
  categoryBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 8,
  },
  categoryBtnActive: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: "#000",
    borderBottomWidth: 2,
    paddingBottom: 8,
  },
});
