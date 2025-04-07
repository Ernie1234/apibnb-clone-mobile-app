import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UseMutateFunction } from "@tanstack/react-query";

import type {
  CreateCommentData,
  UpdateCommentData,
  IComment,
} from "@/types/comment";
import {
  commentSchema,
  type CommentFormValues,
} from "@/schemas/comments-schema";
import { Button } from "@/components/ui/button";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type CommentDialogBaseProps = {
  isSubmitting: boolean;
  children?: React.ReactNode;
};

type CreateDialogProps = CommentDialogBaseProps & {
  mode: "create";
  listingId: string;
  onSubmit: UseMutateFunction<IComment, Error, CreateCommentData, unknown>;
};

type EditDialogProps = CommentDialogBaseProps & {
  mode: "edit";
  onSubmit: UseMutateFunction<IComment, Error, UpdateCommentData, unknown>;
  defaultValues: CommentFormValues & { commentId: string };
};

type CommentDialogProps = CreateDialogProps | EditDialogProps;

export const CommentDialog = (props: CommentDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues:
      props.mode === "edit"
        ? props.defaultValues
        : {
            content: "",
            rating: 0,
          },
  });

  const ratingValue = watch("rating");

  const handleFormSubmit = (data: CommentFormValues) => {
    if (props.mode === "create") {
      props.onSubmit({ listingId: props.listingId, ...data });
    } else {
      props.onSubmit({ commentId: props.defaultValues.commentId, ...data });
    }
    setIsOpen(false);
    reset();
  };

  return (
    <>
      <TouchableOpacity onPress={() => setIsOpen(true)}>
        {props.children || (
          <Button variant="primary">
            {props.mode === "edit" ? "Edit" : "Leave a Comment"}
          </Button>
        )}
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {props.mode === "edit" ? "Edit Comment" : "Write a Comment"}
            </Text>

            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setValue("rating", star)}
                >
                  <MaterialCommunityIcons
                    name="star"
                    size={24}
                    color={star <= ratingValue ? "#fbbf24" : "#d1d5db"}
                    fill={star <= ratingValue ? "#fbbf24" : "transparent"}
                  />
                </TouchableOpacity>
              ))}
              <Text style={styles.ratingText}>
                {ratingValue > 0
                  ? `${ratingValue} star${ratingValue !== 1 ? "s" : ""}`
                  : "Rate your experience"}
              </Text>
            </View>
            {errors.rating && (
              <Text style={styles.errorText}>{errors.rating.message}</Text>
            )}

            <TextInput
              style={styles.commentInput}
              placeholder="Share your experience..."
              multiline
              numberOfLines={4}
              onChangeText={(text) => setValue("content", text)}
              defaultValue={
                props.mode === "edit" ? props.defaultValues.content : ""
              }
            />
            {errors.content && (
              <Text style={styles.errorText}>{errors.content.message}</Text>
            )}

            <View style={styles.buttonContainer}>
              <Button
                variant="outline"
                onPress={() => setIsOpen(false)}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onPress={handleSubmit(handleFormSubmit)}
                disabled={props.isSubmitting}
              >
                {props.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 14,
    color: "#6b7280",
  },
  commentInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  cancelButton: {
    marginRight: 8,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginBottom: 8,
  },
});
