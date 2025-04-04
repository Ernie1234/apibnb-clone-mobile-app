import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Toast, {
  ToastConfig,
  ToastConfigParams,
} from "react-native-toast-message";

interface ToastProps {
  text1?: string;
  text2?: string;
}

const styles = StyleSheet.create({
  successContainer: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 20,
    width: "90%",
  },
  errorContainer: {
    backgroundColor: "#F44336",
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 20,
    width: "90%",
  },
  text1: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  text2: {
    color: "white",
    fontSize: 14,
    marginTop: 4,
  },
});

const SuccessToast = ({ text1, text2 }: ToastProps) => (
  <View style={styles.successContainer}>
    <Text style={styles.text1}>{text1}</Text>
    {text2 && <Text style={styles.text2}>{text2}</Text>}
  </View>
);

const ErrorToast = ({ text1, text2 }: ToastProps) => (
  <View style={styles.errorContainer}>
    <Text style={styles.text1}>{text1}</Text>
    {text2 && <Text style={styles.text2}>{text2}</Text>}
  </View>
);

export const toastConfig: ToastConfig = {
  success: (params: ToastConfigParams<ToastProps>) => (
    <SuccessToast text1={params.text1} text2={params.text2} />
  ),
  error: (params: ToastConfigParams<ToastProps>) => (
    <ErrorToast text1={params.text1} text2={params.text2} />
  ),
};
