import React, { useLayoutEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  ActivityIndicator,
  Dimensions,
  ImageStyle,
  ViewStyle,
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  runOnJS,
  SlideInDown,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { useListing } from "@/hooks/use-listing";
import { getSupportedImageUrl } from "@/libs/utils/fn";

const IMG_HEIGHT = 300;
const { width } = Dimensions.get("window");

const SingleListingDetails = () => {
  const { listingId } = useLocalSearchParams<{ listingId: string }>();
  const {
    data: listingData,
    isLoading,
    error,
  } = useListing(listingId as string);
  const listing = listingData?.data;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigation = useNavigation();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const handleNextImage = () => {
    if (listing?.imageSrc && currentImageIndex < listing.imageSrc.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const swipeGesture = Gesture.Pan().onEnd((e) => {
    if (e.translationX < -50) {
      runOnJS(handleNextImage)();
    } else if (e.translationX > 50) {
      runOnJS(handlePrevImage)();
    }
  });

  const shareListing = async () => {
    try {
      if (!listing) return;

      await Share.share({
        title: listing.title,
        url: `${process.env.EXPO_PUBLIC_WEB_APP_BASE_URL}/listings/${listing.id}`,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useLayoutEffect(() => {
    if (!listing) return;

    navigation.setOptions({
      headerTitle: "",
      headerTransparent: true,
      headerBackground: () => (
        <Animated.View style={[headerAnimatedStyle, styles.header]} />
      ),
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
            <Ionicons name="share-outline" size={22} color={"#000"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="heart-outline" size={22} color={"#000"} />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={styles.roundButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={"#000"} />
        </TouchableOpacity>
      ),
    });
  }, [listing]);

  const imageAnimatedStyle = useAnimatedStyle<ImageStyle>(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle<ViewStyle>(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
    };
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning-outline" size={48} color={Colors.light.red} />
        <Text style={styles.errorText}>Failed to load listing details</Text>
        <Text style={styles.errorSubText}>{error.message}</Text>
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="search-outline" size={48} color={Colors.light.gray} />
        <Text style={styles.errorText}>Listing not found</Text>
      </View>
    );
  }

  const imageUrl = getSupportedImageUrl(listing.imageSrc[currentImageIndex]);

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        ref={scrollRef}
        scrollEventThrottle={16}
      >
        <View style={styles.imageContainer}>
          <GestureDetector gesture={swipeGesture}>
            <Animated.Image
              source={{ uri: imageUrl }}
              style={[styles.image, imageAnimatedStyle]}
            />
          </GestureDetector>

          {currentImageIndex > 0 && (
            <TouchableOpacity
              style={[styles.navButton, styles.prevButton]}
              onPress={handlePrevImage}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          )}

          {listing.imageSrc &&
            currentImageIndex < listing.imageSrc.length - 1 && (
              <TouchableOpacity
                style={[styles.navButton, styles.nextButton]}
                onPress={handleNextImage}
              >
                <Ionicons name="chevron-forward" size={24} color="white" />
              </TouchableOpacity>
            )}

          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>
              {currentImageIndex + 1}/{listing.imageSrc.length}
            </Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{listing.title}</Text>
          <Text style={styles.location}>
            {listing.category} in {listing.location}
          </Text>
          <Text style={styles.rooms}>
            {listing.guestCount} guests · {listing.roomCount} bedrooms ·{" "}
            {listing?.bedCount} bed · {listing?.bathroomCount} bathrooms
          </Text>
          <View style={{ flexDirection: "row", gap: 4 }}>
            <Ionicons name="star" size={16} />
            <Text style={styles.ratings}>
              {listing.review_scores_rating / 20} · {listing.number_of_reviews}{" "}
              reviews
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.hostView}>
            <Image
              source={{ uri: listing.host_picture_url }}
              style={styles.host}
            />

            <View>
              <Text style={{ fontWeight: "500", fontSize: 16 }}>
                Hosted by {listing.host_name}
              </Text>
              <Text>Host since {listing.host_since}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.description}>
            {listing.description}
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Accusantium quam nesciunt in, aspernatur perferendis cumque et
            maxime eius qui rem unde laborum voluptatibus fugiat. Alias minima
            molestiae libero esse iure. Delectus consequatur non consequuntur!
            In voluptates, fugit accusamus eum cumque dolore? Rerum dicta
            debitis sunt omnis aspernatur aliquid, illum beatae necessitatibus
            corporis molestiae! Voluptatum dicta nisi optio, mollitia dolores
            quisquam. Ad magni modi similique eaque a. Dolorem blanditiis
            voluptate quis illo a eum obcaecati molestiae, quisquam voluptatum
            enim repellendus quos nihil odio ipsum molestias magnam commodi.
            Similique esse omnis quasi. Numquam aut aliquam enim error maiores
            similique eaque quas vel perferendis architecto asperiores impedit
            itaque magni voluptate totam, rerum nulla soluta veniam odit in sed
            unde iure! Distinctio, suscipit blanditiis. Velit eveniet sunt non
            reprehenderit quae voluptatem, distinctio adipisci tempora
            temporibus sed explicabo hic vitae voluptatum earum dolores
            voluptates? Aliquid ullam cumque velit odit aperiam perferendis eius
            iusto excepturi quaerat. Obcaecati ea illum quos ex doloribus illo,
            rem excepturi. Itaque saepe officiis soluta ducimus consectetur
            reprehenderit repellat, blanditiis, iure sapiente alias non enim
            vitae? Amet, laboriosam! Exercitationem, voluptate amet! Cumque.
            Autem, earum, animi nemo consectetur voluptatem repellendus at
            dolorem blanditiis a obcaecati, maxime atque aliquam laudantium
            maiores. Sint et voluptatum laboriosam temporibus incidunt
            dignissimos sequi expedita, eaque rem iure voluptas. Autem nostrum
            ex voluptatem iure quaerat. Distinctio repudiandae totam,
            perferendis culpa voluptatibus laboriosam nobis natus incidunt ea
            quasi molestias velit eum. Quo eum aliquid temporibus numquam
            dignissimos praesentium molestias suscipit. Et porro quas
            consectetur nihil quisquam ut culpa, molestiae enim, sit provident
            id aliquam nulla ea eum in accusamus atque doloremque veniam.
            Inventore, assumenda. Magni ad a iste nihil harum. Quas, dolor
            labore? Tempore placeat commodi temporibus ratione dignissimos.
            Beatae nam fugit ut rem ab, similique illum, odio sit laudantium
            omnis, assumenda perspiciatis inventore quis architecto quasi unde
            asperiores alias? Sequi consequuntur at laboriosam earum accusantium
            nam, consectetur numquam rerum quod facere magnam officiis
            perferendis obcaecati nesciunt. Aperiam odit ex corporis, vero
            maiores fugit architecto in, sint cumque error enim? Eveniet
            voluptatum ipsum consectetur enim, at, officia, fuga pariatur iusto
            ducimus magnam labore atque nostrum ad in recusandae quas esse
            sapiente vero nobis porro nihil. Laudantium eos id nobis vitae.
            Assumenda iste soluta enim! Illum possimus voluptatibus blanditiis
            illo, repellat tenetur sit ut itaque id sint non? Mollitia
            reprehenderit praesentium natus quo quae, in rem ad vitae
            architecto, ipsam eum! Possimus explicabo doloremque nihil amet
            repellendus excepturi quod provident, ducimus, vitae officia
            laboriosam perferendis debitis magnam. Sapiente quia, ipsam deleniti
            explicabo quidem quam, voluptatibus blanditiis, molestiae pariatur
            voluptates repellat doloremque? Consequatur accusantium debitis
            fugit neque libero voluptas id? Ipsam labore dolor porro illum magni
            numquam ullam perferendis nostrum consequuntur praesentium, unde
            fuga. Unde omnis numquam delectus, molestiae deleniti inventore
            velit. Sequi est, modi eum perspiciatis dolorem aliquam, facilis
            porro dolor quos fugiat minima cum voluptas quam ipsum officiis.
            Ratione aspernatur accusantium a praesentium dicta nobis eaque sed,
            ea rerum similique? Voluptatibus at dignissimos blanditiis quisquam
            quia illum atque molestiae, nulla pariatur culpa iure consectetur id
            eveniet dolorum voluptas est distinctio odit amet corporis sint
            provident. Minus dolore mollitia earum veniam! Distinctio cumque
            alias, incidunt quas delectus, voluptatem atque velit inventore
            nesciunt cum cupiditate, ab voluptas sunt in laudantium quaerat
            eligendi commodi. Laboriosam iure ipsa incidunt autem hic dolore ab
            nisi. Quod corporis soluta autem ipsum tempora saepe eveniet error
            debitis laudantium quas odio aspernatur, sint asperiores omnis vel
            cum repellendus amet nisi, perspiciatis accusantium itaque illum
            cupiditate quaerat animi? Dignissimos! Nam necessitatibus labore
            cupiditate porro rerum mollitia exercitationem qui officia
            praesentium nisi adipisci dolore magnam, odio maiores minus cumque
            et quas ad suscipit. Numquam exercitationem doloribus accusantium
            assumenda natus iste! Minima nesciunt dignissimos maiores, sint
            beatae delectus autem quos dolor, doloremque maxime ipsum aut velit
            voluptatibus deleniti, odit temporibus vero incidunt! Quibusdam
            consequatur ex enim incidunt eum ullam minima tempore. Quo adipisci
            obcaecati quam facere neque sequi ipsa. Facilis asperiores
            reprehenderit, similique accusamus hic ad. Atque magni quas ratione
            praesentium, blanditiis voluptates nulla molestiae facilis
            architecto expedita commodi ullam qui! Autem odit laboriosam
            deleniti non voluptatum nam illo ipsam incidunt architecto mollitia
            quisquam, molestiae fugit eius aperiam aut itaque delectus
            temporibus nesciunt ratione sit magni, recusandae quaerat? Modi,
            facere ab! Ea quo quod eum? Odit nemo quam a animi nobis quaerat
            ipsum modi natus totam necessitatibus unde tempore dolores impedit,
            nesciunt adipisci ex atque at repellat dolor dolorem repudiandae
            labore. Quaerat sint porro libero sequi praesentium sunt. Placeat
            sed neque quibusdam, quod quia consectetur architecto voluptatum
            dignissimos. Totam praesentium amet, tempora debitis atque dicta
            corrupti accusantium rerum dolorem, sed dolore! Nemo saepe debitis
            quis veniam, dignissimos minus quasi vel minima ipsam suscipit
            possimus accusamus neque modi harum maxime pariatur repudiandae
            quidem at fugiat, incidunt consequatur, cumque voluptatem magni
            dicta. Neque! Cum nobis blanditiis beatae quibusdam dolore atque
            facilis vero nesciunt aut enim quas, illo reprehenderit, harum nisi
            placeat voluptate consequatur illum ullam debitis provident. A iste
            velit sequi architecto optio. Nemo, deserunt. Expedita voluptatem
            minima voluptatibus consectetur et perspiciatis possimus, nisi
            recusandae similique a adipisci fuga modi in. Reiciendis eos iusto
            corporis culpa. Fuga laboriosam veniam voluptatem enim ab explicabo?
            Omnis sit mollitia sed doloremque obcaecati officia adipisci
            repellendus numquam ex molestiae quis, iusto autem totam fuga
            voluptates saepe animi, iure, facilis unde aperiam illum expedita
            recusandae? Molestias, nobis voluptates? Laudantium exercitationem
            ipsam soluta! Unde laborum earum tenetur, eum explicabo quod autem
            quisquam, deserunt maiores accusamus vitae! Accusantium deserunt
            voluptatibus ex asperiores magni illo, eum commodi temporibus rerum
            vel. Harum!
          </Text>
        </View>
      </Animated.ScrollView>

      <Animated.View
        style={defaultStyles.footer}
        entering={SlideInDown.delay(200)}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity style={styles.footerText}>
            <Text style={styles.footerPrice}>€{listing.price}</Text>
            <Text>night</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[defaultStyles.btn, { paddingRight: 20, paddingLeft: 20 }]}
          >
            <Text style={defaultStyles.btnText}>Reserve</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default SingleListingDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width,
    height: IMG_HEIGHT,
  },
  infoContainer: {
    padding: 24,
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    fontFamily: "mon-sb",
  },
  location: {
    fontSize: 18,
    marginTop: 10,
    fontFamily: "mon-sb",
  },
  rooms: {
    fontSize: 16,
    color: Colors.light.gray,
    marginVertical: 4,
    fontFamily: "mon",
  },
  ratings: {
    fontSize: 16,
    fontFamily: "mon-sb",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.light.gray,
    marginVertical: 16,
  },
  host: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Colors.light.gray,
  },
  hostView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  footerText: {
    height: "100%",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerPrice: {
    fontSize: 18,
    fontFamily: "mon-sb",
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    color: Colors.light.primary,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  header: {
    backgroundColor: "#fff",
    height: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.light.gray,
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: "mon",
  },
  navButton: {
    position: "absolute",
    top: "50%",
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ translateY: -20 }],
  },
  prevButton: {
    left: 10,
  },
  nextButton: {
    right: 10,
  },
  imageCounter: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  imageCounterText: {
    color: "white",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 12,
  },
  errorText: {
    fontSize: 18,
    fontFamily: "mon-sb",
    color: Colors.light.dark,
    textAlign: "center",
  },
  errorSubText: {
    fontSize: 14,
    fontFamily: "mon",
    color: Colors.light.gray,
    textAlign: "center",
  },
});
