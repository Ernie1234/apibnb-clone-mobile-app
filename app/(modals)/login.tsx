import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "@/hooks/use-auth";
import AppInput from "@/components/ui/AppInput";
import { loginFormSchema, LoginFormValues } from "@/libs/schemas/auth-schema";
import AppButton from "@/components/ui/AppButton";
import { useToast } from "@/hooks/use-toast";
import { Colors } from "@/constants/Colors";

const LoginModal = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: LoginFormValues) => login(data),
    onSuccess: (data) => {
      console.log("Login Data: ", data);
      toast({
        type: "success",
        title: "Successfully logged in",
        message: "Welcome back!",
      });
      router.replace("/(tabs)");
    },
    onError: (error: any) => {
      console.error(error);
      toast({
        type: "error",
        title: "Login failed",
        message: error.message || "An error occurred during login",
      });
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    mutation.mutate(values);
  };

  const onToggle = () => {
    router.push("/(modals)/register");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Login to your account!</Text>
      </View>

      <View style={styles.form}>
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

        <AppButton
          label={mutation.isPending ? "Signing in..." : "Continue"}
          onPress={handleSubmit(onSubmit)}
          disabled={mutation.isPending}
          style={styles.button}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={onToggle}>
            <Text style={styles.footerLink}> Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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
    fontFamily: "space-mono",
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

export default LoginModal;
