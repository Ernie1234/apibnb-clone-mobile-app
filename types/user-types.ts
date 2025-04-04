import type { Asset } from "expo-asset"; // For handling local assets
import { IListing } from "./listing-types";

export enum ERole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface IUser {
  // Core identity
  id: string;
  name: string;
  email: string;
  phoneNumber?: string; // Added for mobile
  imageSrc: string | Asset; // Can be URL or local asset

  // Authentication
  password?: string; // Optional for OAuth users
  role: ERole;
  isActive: boolean;
  isVerified: boolean;

  // Security
  lastLogin?: Date;

  // Token fields
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  verificationToken?: string;
  verificationTokenExpiresAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt?: Date;
  // Relationships
  Listings: IListing[];
  Reservations: string[]; // Consider using IReservation[] if you have that type
  favouriteIds: string[];
  token: string;
}

// Additional types for mobile auth flows
export interface AuthResponse {
  user: Omit<IUser, "password">;
  status: boolean;
  message: string;
}
