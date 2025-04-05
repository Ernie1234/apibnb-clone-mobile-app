export type IconSet =
  | "MaterialIcons"
  | "MaterialCommunityIcons"
  | "Ionicons"
  | "FontAwesome"
  | "FontAwesome5"
  | "FontAwesome6"
  | "Feather"
  | "Entypo"
  | "AntDesign"
  | "SimpleLineIcons"
  | "Octicons"
  | "Foundation"
  | "EvilIcons"
  | "Fontisto";

export interface ICategory {
  id: number;
  name: string;
  icon: string;
  iconSet: IconSet;
}

export interface ListingHeaderProps {
  onCategoryChanged: (category: string) => void;
}

export const categories: ICategory[] = [
  { id: 1, name: "New", icon: "burst-new", iconSet: "Foundation" },
  { id: 2, name: "Trending", icon: "fire", iconSet: "FontAwesome5" },
  { id: 3, name: "Cabins", icon: "cabin", iconSet: "MaterialIcons" },
  { id: 4, name: "Tiny homes", icon: "home", iconSet: "Feather" },
  { id: 5, name: "Luxe", icon: "crown", iconSet: "FontAwesome5" },
  {
    id: 6,
    name: "Mountain",
    icon: "image-filter-hdr",
    iconSet: "MaterialCommunityIcons",
  },
  { id: 7, name: "Treehouses", icon: "tree", iconSet: "FontAwesome5" },
  { id: 8, name: "Camping", icon: "campground", iconSet: "FontAwesome5" },
  { id: 9, name: "Castles", icon: "fort-awesome", iconSet: "FontAwesome5" },
  { id: 10, name: "Islands", icon: "island", iconSet: "Fontisto" },
  {
    id: 11,
    name: "Vineyards",
    icon: "wine-glass-alt",
    iconSet: "FontAwesome5",
  },
  {
    id: 16,
    name: "Boat",
    icon: "sait-boat",
    iconSet: "Fontisto",
  },
  { id: 12, name: "Skiing", icon: "skiing", iconSet: "FontAwesome5" },
  { id: 13, name: "Beach", icon: "beach", iconSet: "MaterialCommunityIcons" },
  { id: 14, name: "City", icon: "location-city", iconSet: "MaterialIcons" },
  {
    id: 15,
    name: "Amazing Pool",
    icon: "pool",
    iconSet: "MaterialCommunityIcons",
  },
  {
    id: 17,
    name: "Arctic",
    icon: "snowflake",
    iconSet: "FontAwesome5",
  },
  {
    id: 18,
    name: "Golf",
    icon: "golf-ball-tee",
    iconSet: "FontAwesome6",
  },
] as const;
