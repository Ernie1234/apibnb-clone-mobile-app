// src/components/IconRenderer.tsx
import React from "react";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome,
  FontAwesome5,
  Feather,
  Entypo,
  AntDesign,
  SimpleLineIcons,
  Octicons,
  Foundation,
  EvilIcons,
  Fontisto,
  FontAwesome6,
} from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { IconSet } from "@/types/category-types";

interface IconRendererProps {
  iconSet: IconSet;
  iconName: string;
  size?: number;
  color?: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({
  iconSet,
  iconName,
  size = 24,
  color = Colors.light.gray,
}) => {
  const iconProps = { name: iconName as any, size, color };

  switch (iconSet) {
    case "MaterialCommunityIcons":
      return <MaterialCommunityIcons {...iconProps} />;
    case "Ionicons":
      return <Ionicons {...iconProps} />;
    case "FontAwesome":
      return <FontAwesome {...iconProps} />;
    case "FontAwesome5":
      return <FontAwesome5 {...iconProps} />;
    case "FontAwesome6":
      return <FontAwesome6 {...iconProps} />;
    case "Feather":
      return <Feather {...iconProps} />;
    case "Entypo":
      return <Entypo {...iconProps} />;
    case "AntDesign":
      return <AntDesign {...iconProps} />;
    case "SimpleLineIcons":
      return <SimpleLineIcons {...iconProps} />;
    case "Octicons":
      return <Octicons {...iconProps} />;
    case "Foundation":
      return <Foundation {...iconProps} />;
    case "EvilIcons":
      return <EvilIcons {...iconProps} />;
    case "Fontisto":
      return <Fontisto {...iconProps} />;
    default:
      return <MaterialIcons {...iconProps} />;
  }
};
