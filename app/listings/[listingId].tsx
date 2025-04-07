import React, { useLayoutEffect, useRef, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Animated,
  PanResponder,
  LayoutAnimation,
} from "react-native";
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
  const scrollRef = useRef<ScrollView>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Configure layout animation for image changes
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

  const scrollHandler = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false } // Changed to false as transform animations don't support native driver
  );

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

  // Create pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) {
          handleNextImage();
        } else if (gestureState.dx > 50) {
          handlePrevImage();
        }
      },
    })
  ).current;

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

  // Animated styles
  const imageAnimatedStyle = {
    transform: [
      {
        translateY: scrollY.interpolate({
          inputRange: [-IMG_HEIGHT, 0, IMG_HEIGHT],
          outputRange: [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75],
          extrapolate: "clamp",
        }),
      },
      {
        scale: scrollY.interpolate({
          inputRange: [-IMG_HEIGHT, 0, IMG_HEIGHT],
          outputRange: [2, 1, 1],
          extrapolate: "clamp",
        }),
      },
    ],
  };

  const headerAnimatedStyle = {
    opacity: scrollY.interpolate({
      inputRange: [0, IMG_HEIGHT / 1.5],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
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
      <ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
      >
        <View style={styles.imageContainer} {...panResponder.panHandlers}>
          <Animated.Image
            source={{ uri: imageUrl }}
            style={[styles.image, imageAnimatedStyle]}
          />

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
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Repudiandae eius deleniti necessitatibus veritatis tenetur culpa
            sunt laboriosam quis maxime excepturi, dignissimos eveniet illum
            repellendus tempore, quasi aliquid quod alias iste? Pariatur quos
            doloribus architecto dignissimos nam reiciendis dolore voluptates
            maxime recusandae ipsum aspernatur expedita suscipit repellat cumque
            unde commodi nihil id ducimus facere, sit exercitationem dolorum
            fuga? Atque, reprehenderit voluptates. Molestias omnis nostrum dolor
            minus dolore, in magnam cum dignissimos dolorem aut quis quia
            excepturi blanditiis quaerat facere obcaecati similique asperiores
            fugit qui ad. Blanditiis doloremque consequuntur a quos odit! Illum,
            consequuntur excepturi. Aliquid incidunt quae sequi voluptas facilis
            illo exercitationem minus veniam? Ratione expedita inventore, fuga
            sequi fugiat voluptatibus eligendi in non exercitationem architecto
            corrupti reprehenderit quidem repellendus provident. Consequuntur
            molestias excepturi cupiditate sapiente amet fugit tenetur, tempora
            iste placeat illo dolore est debitis! Labore debitis adipisci sed
            nesciunt nisi obcaecati possimus minus, provident, voluptatum
            blanditiis ea voluptas! Ipsa. Quae earum doloremque quas explicabo
            eaque, delectus architecto, libero sit sed quasi id natus. Sed
            deserunt natus vel, voluptas et perspiciatis in dolorum quae
            exercitationem hic minima perferendis, illum nulla. Enim, molestias
            nesciunt voluptas temporibus, minima consequatur aut laborum a sequi
            tempora magnam dolores sapiente reprehenderit. Explicabo accusamus
            illum velit accusantium alias neque ipsum, impedit architecto
            aliquid vel nesciunt distinctio! Beatae vitae similique, velit
            fugiat nisi soluta expedita maiores quo? Quisquam, maiores quas!
            Autem quis, pariatur blanditiis culpa numquam aliquid aliquam, rem
            distinctio doloremque temporibus quos odit architecto ipsam quas? At
            vitae quo commodi suscipit, consequatur nobis? Commodi similique et
            atque eveniet quaerat quasi praesentium rerum ab veritatis! Facere,
            aliquam. Sunt beatae suscipit odit maiores eos ut perferendis
            consequatur rerum! Culpa modi voluptate non aut, consequatur placeat
            aspernatur! Earum, minima rem sit, sint ratione fuga quo facilis
            debitis, ducimus exercitationem praesentium? Explicabo consequatur
            et suscipit accusantium laborum quaerat fugiat maxime. Asperiores
            error delectus cupiditate, dolorem quas alias reiciendis labore
            veniam consequatur ipsum? Dolorum, fugit commodi. Quo veritatis
            tempora quaerat inventore sit obcaecati tempore, numquam, odit natus
            sint delectus nihil reiciendis! Animi adipisci et omnis voluptates
            labore optio impedit, natus in dolorum fuga obcaecati reprehenderit
            accusamus explicabo perspiciatis nisi inventore! Laborum cum numquam
            adipisci officia ipsam nesciunt error repellat qui? Ipsa. Id, nobis
            atque dolorum sunt quos officia asperiores maiores exercitationem
            aliquid! Vel veritatis praesentium voluptate reprehenderit ab eaque
            dicta eligendi minus quasi rem. Aliquam laborum accusamus quasi
            exercitationem maiores. Sapiente. Id esse qui similique unde
            mollitia consectetur at quia minus, laudantium nisi, omnis beatae
            animi atque, quae voluptas iure explicabo temporibus quaerat
            exercitationem delectus tempore. Architecto voluptatibus tempora
            natus numquam. Ad quam minima quasi. Id reprehenderit placeat fugit
            possimus suscipit, doloribus ipsam minima autem expedita pariatur.
            Veritatis adipisci blanditiis consectetur, delectus autem natus
            reprehenderit deserunt quas quo reiciendis sint quod. Similique
            inventore deleniti ex id ipsa iste totam est perspiciatis autem,
            officia fugit quis! Eos, quis velit perspiciatis quas neque
            officiis, nostrum minima, facere impedit omnis placeat facilis
            corrupti deserunt! Dolorem qui quae, quasi eos et natus! Molestias
            beatae dolor fuga quia magnam, illum, reprehenderit odio dolore
            consequuntur cum alias laboriosam, ea dignissimos blanditiis animi
            incidunt minus culpa. Ullam, dolor! Corporis vel libero vero
            obcaecati eveniet distinctio mollitia iusto reiciendis molestiae
            inventore atque quam quod sunt ut similique quo unde, modi ipsa
            cupiditate quae, veritatis deleniti laboriosam soluta? Labore, ea.
            Labore dolorum cumque quisquam, neque deserunt obcaecati nemo est
            tenetur, libero laboriosam necessitatibus, optio nisi harum! In enim
            aliquam earum, perspiciatis laboriosam repellendus eum
            exercitationem, nam cum autem distinctio asperiores. Quidem numquam
            voluptate nemo quas deserunt praesentium. Error nisi aliquam maiores
            impedit praesentium dolorum ipsum omnis quos? Placeat modi nesciunt,
            eius temporibus possimus ipsum quasi similique excepturi veritatis
            qui hic.
          </Text>
        </View>
      </ScrollView>

      <View style={defaultStyles.footer}>
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
      </View>
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
