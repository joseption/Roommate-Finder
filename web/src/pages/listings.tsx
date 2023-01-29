import { useQuery } from "@tanstack/react-query";
import { GetListings } from "../request/fetch";
import ListingCard from "../components/ListingCard";
import { ListingInfo } from "../types/listings.types";
import Button from "../components/Inputs/Button";
import { useRouter } from "next/router";

//This is a placeholder...
export default function Listings() {
  const { data, isLoading } = useQuery(["listings"], GetListings);
  const router = useRouter();

  return (
    <div className="relative">
      {isLoading || !data ? (
        <div>Loading...</div>
      ) : (
        <div className="align-center flex justify-center">
          <ul className="">
            {data.map((listing: ListingInfo) => {
              return (
                <li key={listing.id} className="h-128 w-128">
                  <ListingCard listing={listing} />
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <Button
        onClick={() => router.push("./createListing")}
        className="absolute top-2 m-10"
      >
        Create Listing
      </Button>
    </div>
  );
}
