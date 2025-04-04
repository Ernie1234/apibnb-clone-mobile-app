import { useMutation, useQuery, QueryClient } from "@tanstack/react-query";
import {
  addFavourite,
  getFavourites,
  removeFavourite,
  type AddFavouriteResponse,
  type GetFavouritesResponse,
} from "@/services/apiServices/favourites-query";
import { useToast } from "./use-toast";

const queryClient = new QueryClient();
const { toast } = useToast();

export const useFavourites = (enabled: boolean = true) => {
  const {
    data: favouritesResponse,
    isLoading,
    isError,
    error,
    refetch, // Add refetch function to manually trigger a refetch
  } = useQuery<GetFavouritesResponse, Error>({
    queryKey: ["getFavourites"],
    queryFn: getFavourites,
    enabled,
  });

  const favourites = favouritesResponse?.data || [];

  const addFavouriteMutation = useMutation<AddFavouriteResponse, Error, string>(
    {
      mutationFn: (listingId) => addFavourite(listingId),
      onSuccess: (data) => {
        // Invalidate and refetch the favourites query
        queryClient.invalidateQueries({ queryKey: ["getFavourites"] });
        refetch(); // Manually trigger a refetch
        toast({
          type: "success",
          title: "Successfully logged in",
          message: data.message,
        });
      },
      onError: (error) => {
        toast({
          type: "error",
          title: "Successfully logged in",
          message: error.message,
        });
      },
    }
  );

  const removeFavouriteMutation = useMutation<
    AddFavouriteResponse,
    Error,
    string
  >({
    mutationFn: (listingId) => removeFavourite(listingId),
    onSuccess: (data) => {
      // Invalidate and refetch the favourites query
      queryClient.invalidateQueries({ queryKey: ["getFavourites"] });
      refetch(); // Manually trigger a refetch
      toast({
        type: "success",
        title: "Successfully logged in",
        message: data.message,
      });
    },
    onError: (error) => {
      toast({
        type: "error",
        title: "Successfully logged in",
        message: error.message,
      });
    },
  });

  return {
    favourites,
    isLoading,
    isError,
    error,
    addFavouriteMutation,
    removeFavouriteMutation,
  };
};
