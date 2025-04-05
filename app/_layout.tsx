import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useCallback } from "react";
import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DevToolsBubble } from "react-native-react-query-devtools";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { toastConfig } from "@/libs/utils/toastConfig";
import { useAuth } from "@/hooks/use-auth";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" />
  </View>
);

export default function RootLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { isLoading, isLoggedIn } = useAuth();
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    nun: require("../assets/fonts/Nunito-Regular.ttf"),
    "nun-md": require("../assets/fonts/Nunito-Medium.ttf"),
    "nun-sb": require("../assets/fonts/Nunito-SemiBold.ttf"),
    "nun-bd": require("../assets/fonts/Nunito-Bold.ttf"),
    "nun-eb": require("../assets/fonts/Nunito-ExtraBold.ttf"),
  });

  const onCopy = useCallback(async (text: string) => {
    try {
      await Clipboard.setStringAsync(text);
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (!fontsLoaded || isLoading) return;

    // Only navigate when we have a definitive auth state
    if (isLoggedIn) {
      router.replace("/(tabs)");
    } else {
      router.replace("/(modals)/login");
    }
  }, [fontsLoaded, isLoading, isLoggedIn]);

  if (!fontsLoaded || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={DefaultTheme}>
        <GestureHandlerRootView>
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
              options={{ headerTitle: "", headerTransparent: true }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="inverted" />
        </GestureHandlerRootView>
      </ThemeProvider>
      <DevToolsBubble onCopy={onCopy} />
    </QueryClientProvider>
  );
}
