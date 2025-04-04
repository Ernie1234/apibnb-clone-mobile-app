import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "@/hooks/use-auth";
import AppInput from "@/components/ui/AppInput";
import AppButton from "@/components/ui/AppButton";
import { useToast } from "@/hooks/use-toast";
import { Colors } from "@/constants/Colors";
import {
  registerFormSchema,
  RegisterFormValues,
} from "@/libs/schemas/auth-schema";

const RegisterModal = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { register } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: RegisterFormValues) => register(data),
    onSuccess: (data) => {
      console.log("Registration Data: ", data);
      toast({
        type: "success",
        title: "Account created successfully",
        message: "Welcome! Please check your email to verify your account",
      });
      router.replace("/(modals)/login");
    },
    onError: (error: any) => {
      console.error(error);
      toast({
        type: "error",
        title: "Registration failed",
        message: error.message || "An error occurred during registration",
      });
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    mutation.mutate(values);
  };

  const onToggle = () => {
    router.push("/(modals)/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create an account</Text>
        <Text style={styles.subtitle}>Join us today!</Text>
      </View>

      <View style={styles.form}>
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="First Name"
              placeholder="Enter your first name"
              autoCapitalize="words"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.firstName?.message}
              disabled={mutation.isPending}
            />
          )}
        />

        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Last Name"
              placeholder="Enter your last name"
              autoCapitalize="words"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.lastName?.message}
              disabled={mutation.isPending}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              disabled={mutation.isPending}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
              disabled={mutation.isPending}
              rightIcon={<Ionicons name="eye" size={20} color="#64748b" />}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Confirm Password"
              placeholder="Confirm your password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.confirmPassword?.message}
              disabled={mutation.isPending}
              rightIcon={<Ionicons name="eye" size={20} color="#64748b" />}
            />
          )}
        />

        <AppButton
          label={mutation.isPending ? "Creating account..." : "Continue"}
          onPress={handleSubmit(onSubmit)}
          disabled={mutation.isPending}
          style={styles.button}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={onToggle}>
            <Text style={styles.footerLink}> Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Reuse the same styles from LoginModal for consistency
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "white",
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "nun-bd",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    fontFamily: "nun-md",
  },
  form: {
    gap: 16,
  },
  button: {
    marginTop: 16,
    backgroundColor: Colors.light.primary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#64748b",
    fontFamily: "nun",
  },
  footerLink: {
    color: "#3b82f6",
    fontFamily: "nun-sb",
  },
});

export default RegisterModal;
