import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Pencil, Star, Trash2 } from "lucide-react-native";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";
import { CommentDialog } from "./CommentDialog";
import type { UseMutateFunction } from "@tanstack/react-query";
import type { IComment, UpdateCommentData } from "@/types/comment";
import {
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
  format,
} from "date-fns";

interface CommentProps {
  id: string;
  user: {
    name: string;
    imageSrc: string;
    createdAt: Date;
    id: string;
  };
  content: string;
  createdAt: Date;
  rating: number;
  onDelete: () => void;
  isDeleting?: boolean;
  updateCommentMutation: UseMutateFunction<
    IComment,
    Error,
    UpdateCommentData,
    unknown
  >;
  isUpdating?: boolean;
}

export const Comment = ({
  id,
  user,
  content,
  createdAt,
  rating,
  onDelete,
  isDeleting,
  updateCommentMutation,
  isUpdating,
}: CommentProps) => {
  const { user: currentUser } = useAuth();

  const formatMemberSince = (joinDate: Date): string => {
    const now = new Date();
    const years = differenceInYears(now, joinDate);

    if (years > 0) {
      return `${years} year${years !== 1 ? "s" : ""} on Airbnb`;
    }

    const months = differenceInMonths(now, joinDate);
    if (months > 0) {
      return `${months} month${months !== 1 ? "s" : ""} on Airbnb`;
    }

    const weeks = differenceInWeeks(now, joinDate);
    if (weeks > 0) {
      return `${weeks} week${weeks !== 1 ? "s" : ""} on Airbnb`;
    }

    const days = differenceInDays(now, joinDate);
    return `${days} day${days !== 1 ? "s" : ""} on Airbnb`;
  };

  const formatCommentDate = (date: Date): string => {
    return format(date, "MMM d, yyyy");
  };

  const memberSinceText = formatMemberSince(user.createdAt);
  const commentDateText = formatCommentDate(createdAt);

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <Image
          style={styles.userImage}
          source={{
            uri:
              user.imageSrc || `https://robohash.org/${id}?set=set3&size=50x50`,
          }}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.memberSince}>{memberSinceText}</Text>
        </View>
      </View>

      <View style={styles.ratingContainer}>
        <View style={styles.starsContainer}>
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={16}
              color={index < rating ? "#fbbf24" : "#d1d5db"}
              fill={index < rating ? "#fbbf24" : "transparent"}
            />
          ))}
        </View>
        <Text style={styles.commentDate}>{commentDateText}</Text>
      </View>

      <Text style={styles.commentText}>{content}</Text>

      {(user || currentUser) && user?.id === currentUser?.id && (
        <View style={styles.actionsContainer}>
          <CommentDialog
            mode="edit"
            onSubmit={updateCommentMutation}
            isSubmitting={!!isUpdating}
            defaultValues={{
              content,
              rating,
              commentId: id,
            }}
          >
            <Button variant="ghost" size="sm" disabled={isUpdating}>
              {isUpdating ? "Editing..." : <Pencil size={20} color="#4b5563" />}
            </Button>
          </CommentDialog>

          <Button
            variant="ghost"
            size="sm"
            onPress={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : <Trash2 size={20} color="#ef4444" />}
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: "600",
    fontSize: 16,
  },
  memberSince: {
    fontSize: 12,
    color: "#6b7280",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  commentDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  commentText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 12,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
});
