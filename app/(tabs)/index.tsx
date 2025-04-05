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
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/Colors";
import ListingSkeleton from "@/components/ui/SkeletonLoader";
import EmptyListing from "@/components/ui/EmptyListing";
import { getAllListing } from "@/services/apiServices/listing-query";
import ListingCard from "@/components/ui/ListingCard";
import { useSearchStore } from "@/hooks/use-searchStore";
import ListingHeader from "@/components/ui/ListingHeader";

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
      // Transform the API response to match expected format
      return {
        listings: response.data.listings,
        total: response.data.total,
        hasMore: response.data.hasMore,
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      // Use the hasMore flag from API response
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Safely extract listings
  const allListings = useMemo(() => {
    return data?.pages.flatMap((page) => page?.listings || []) || [];
  }, [data]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Loading state
  if (isLoading) {
    return <ListingSkeleton />;
  }

  // Error state
  if (error)
    return (
      <View style={styles.errorContainer}>
        <Text>Error: {error.message}</Text>
      </View>
    );

  // Empty state
  if (!isLoading && allListings?.length === 0) {
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

  return (
    <SafeAreaView style={styles.container}>
      <ListingHeader onCategoryChanged={handleCategoryChange} />

      <FlatList
        data={allListings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListingCard listing={item} />}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
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
    backgroundColor: "white",
  },
  listContent: {
    padding: 8,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  loadMoreButton: {
    padding: 12,
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
  },
  loadMoreText: {
    color: Colors.light.primary,
    fontWeight: "bold",
  },
  endText: {
    color: Colors.light.text,
  },
  errorContainer: {
    padding: 16,
    alignItems: "center",
  },
});

export default HomeScreen;
