import { useQuery } from "@tanstack/react-query";

import { getListingById } from "@/services/apiServices/listing-query";

export const useListing = (listingId: string) => {
  return useQuery({
    queryKey: ["getListingById", listingId],
    queryFn: () => getListingById(listingId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};
