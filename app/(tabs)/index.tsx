import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Colors } from "@/constants/Colors";
import ListingSkeleton from "@/components/ui/SkeletonLoader";
import EmptyListing from "@/components/ui/EmptyListing";
import { getAllListing } from "@/services/apiServices/listing-query";
import ListingCard from "@/components/ui/ListingCard";
import { useSearchStore } from "@/hooks/use-searchStore";
import ListingHeader from "@/components/ui/ListingHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { IListing } from "@/types/listing-types";

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { category, location, setCategory } = useSearchStore();

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["getAllListing", category, location],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getAllListing(category, location, pageParam);
      return {
        listings: response.data.listings,
        total: response.data.total,
        hasMore: response.data.hasMore,
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const allListings = useMemo(() => {
    return data?.pages.flatMap((page) => page?.listings || []) || [];
  }, [data]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCategoryChange = useCallback(
    (category: string) => {
      setSelectedCategory((prev) => {
        if (prev === category) {
          setCategory("");
          return "";
        } else {
          setCategory(category);
          return category;
        }
      });
    },
    [setCategory]
  );

  if (isLoading) {
    return <ListingSkeleton />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading listings</Text>
      </View>
    );
  }

  if (!isLoading && allListings.length === 0) {
    return (
      <EmptyListing
        showReset
        onReset={() => {
          setSelectedCategory("");
          setCategory("");
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ListingHeader onCategoryChanged={handleCategoryChange} />

      <FlatList
        data={allListings}
        keyExtractor={(item: IListing) => item.id}
        renderItem={({ item }) => (
          <View style={styles.singleColumnItem}>
            <ListingCard listing={item} />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <View style={styles.footer}>
            {isFetchingNextPage ? (
              <ActivityIndicator size="large" color={Colors.light.primary} />
            ) : hasNextPage ? (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={loadMore}
                disabled={isFetchingNextPage}
              >
                <Text style={styles.loadMoreText}>Load More</Text>
              </TouchableOpacity>
            ) : (
              allListings.length > 0 && (
                <Text style={styles.endText}>You've reached the end</Text>
              )
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  listContent: {
    padding: 16, // Increased padding for better spacing
  },
  singleColumnItem: {
    marginBottom: 16, // Add space between items
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  loadMoreButton: {
    padding: 12,
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  loadMoreText: {
    color: Colors.light.lightGray,
    fontWeight: "bold",
  },
  endText: {
    color: Colors.light.text,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    color: Colors.light.red,
    fontSize: 16,
  },
});

export default HomeScreen;
