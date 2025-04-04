import Toast from "react-native-toast-message";
import { toastConfig } from "@/libs/utils/toastConfig";

interface ToastParams {
  type: "success" | "error" | "info";
  title: string;
  message: string;
}

export const useToast = () => {
  const toast = ({ type, title, message }: ToastParams) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
    });
  };

  return { toast };
};
