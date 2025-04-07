import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { Comment } from "./Comment";
import { CommentDialog } from "./CommentDialog";
import {
  getCommentsByListing,
  createComment,
  deleteComment,
  updateComment,
} from "@/services/comments";
import type {
  ICommentApiResponse,
  CreateCommentData,
  IComment,
  UpdateCommentData,
} from "@/types/comment";

export const ListingComments = ({ listingId }: { listingId: string }) => {
  const queryClient = useQueryClient();
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const { data, error, isLoading } = useQuery<ICommentApiResponse>({
    queryKey: ["comments", listingId],
    queryFn: () => getCommentsByListing(listingId),
  });

  const { mutate: createCommentMutation, isPending: isCreating } = useMutation<
    IComment,
    Error,
    CreateCommentData,
    unknown
  >({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", listingId] });
      Toast.show({
        type: "success",
        text1: "Comment added successfully!",
      });
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: error.message,
      });
    },
  });

  const { mutate: updateCommentMutation, isPending: isUpdating } = useMutation<
    IComment,
    Error,
    UpdateCommentData,
    unknown
  >({
    mutationFn: updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", listingId] });
      setEditingCommentId(null);
      Toast.show({
        type: "success",
        text1: "Comment updated successfully!",
      });
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: error.message,
      });
    },
  });

  const { mutate: deleteCommentMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", listingId] });
      Toast.show({
        type: "success",
        text1: "Comment deleted successfully!",
      });
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: error.message,
      });
    },
  });

  if (isLoading) return <Text>Loading comments...</Text>;
  if (error) return <Text>Error: {(error as Error).message}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Comments</Text>
        <CommentDialog
          mode="create"
          listingId={listingId}
          onSubmit={createCommentMutation}
          isSubmitting={isCreating}
        />
      </View>

      {data?.data.comments?.length === 0 ? (
        <Text style={styles.noCommentsText}>
          No reviews yet. Be the first to review!
        </Text>
      ) : (
        <FlatList
          data={data?.data.comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Comment
              id={item.id}
              user={{
                name: item.userId.name,
                imageSrc: item.userId.imageSrc,
                createdAt: new Date(item.userId.createdAt),
                id: item.userId.id,
              }}
              content={item.content}
              createdAt={new Date(item.createdAt)}
              rating={item.rating}
              onDelete={() => deleteCommentMutation(item.id)}
              isDeleting={isDeleting}
              updateCommentMutation={updateCommentMutation}
              isUpdating={isUpdating && editingCommentId === item.id}
            />
          )}
          contentContainerStyle={styles.commentsList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  noCommentsText: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 16,
  },
  commentsList: {
    paddingBottom: 16,
  },
});
