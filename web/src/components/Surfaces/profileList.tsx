import useInfiniteQueryUsers from "../../request/useInfiniteQueryUsers";
import ProfileList from "../Layout/ProfileList";
import CustomExploreFilterPopover from "./exploreFilters";

interface props {
  sortByMatchPercentage: boolean;
  genderType: string;
  smokingPreference: string;
  petPreference: string;
}
export default function ProfileListWithFilters({
  sortByMatchPercentage,
  genderType,
  smokingPreference,
  petPreference,
}: props) {
  const { posts, isFetching, isFetchingNextPage } = useInfiniteQueryUsers({
    key: "feed_users",
    searchValue: "",
    sortByMatchPercentage,
    genderType,
    petPreference,
    smokingPreference,
    // recentOnly: feedSortValue === "recent",
    queryOptions: {
      refetchOnMount: "always", // Refetch on mount regardless of staleness (e.g. if the user navigates back to the feed from another route)
      staleTime: Infinity, // Never stale. Prevents unexpected layout shifts when the post order changes while navigating the feed
    },
  });
  return (
    <>
      <ProfileList
        arePostsLoading={isFetching && !isFetchingNextPage}
        areMorePostsLoading={isFetchingNextPage}
        profiles={posts}
        className={"px-4 py-16 md:pb-8 lg:px-8"}
      />
    </>
  );
}
