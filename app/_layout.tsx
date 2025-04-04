import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DevToolsBubble } from "react-native-react-query-devtools";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";

import { useColorScheme } from "@/hooks/useColorScheme";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { toastConfig } from "@/libs/utils/toastConfig";
import { useAuth } from "@/hooks/use-auth";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const queryClient = new QueryClient();
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    nun: require("../assets/fonts/Nunito-Regular.ttf"),
    "nun-md": require("../assets/fonts/Nunito-Medium.ttf"),
    "nun-sb": require("../assets/fonts/Nunito-SemiBold.ttf"),
    "nun-bd": require("../assets/fonts/Nunito-Bold.ttf"),
    "nun-eb": require("../assets/fonts/Nunito-ExtraBold.ttf"),
  });

  const onCopy = async (text: string) => {
    try {
      await Clipboard.setStringAsync(text);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  const { isLoading, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoading && isLoggedIn) {
      router.push("/(tabs)");
    } else {
      router.push("/(modals)/login");
    }
  }, [isLoading]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={DefaultTheme}>
        <Toast config={toastConfig} />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(modals)/login"
            options={{
              title: "Login or Signup",
              headerTitleStyle: {
                fontFamily: "nun-sb",
              },
              presentation: "modal",
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name="close-outline" size={24} color="black" />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="listings/[listingId]"
            options={{ headerTitle: "" }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
      <DevToolsBubble onCopy={onCopy} />
    </QueryClientProvider>
  );
}
