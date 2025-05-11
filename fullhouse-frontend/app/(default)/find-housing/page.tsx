"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter as FilterIcon, Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import axios from '../../../axios.config';
import { useSearchParams } from "next/navigation";

type Accommodation = {
  id: number;
  poster_name: string;
  housing_image_base64: string;
  pets_allowed: boolean;
  address: string;
  city: string;
  state: string;
  num_roommates_needed: number;
  start_date: string;
  end_date: string;
  rent: number;
  has_ac: boolean;
  has_wifi: boolean;
  contact_info: string;
  num_bedrooms: number;
  num_bathrooms: number;
};

type userData = {
  additional_notes: string,
  age: number,
  bio: string,
  city_coords: [number, number],
  date_of_birth: string,
  dietary_restrictions: string,
  gender: number,
  pref_age_max: number,
  pref_age_min: number,
  pref_day_guests: number,
  pref_night_guests: number,
  pref_same_gender: boolean,
  pref_sleep_light: number,
  pref_smoking: boolean,
  pref_temperature: number,
  school: string,
  sleep_time_weekday: number,
  sleep_time_weekend: number,
  user: {
      email: string,
      username: string,
  }
  verified: boolean,
  wake_time_weekday: number,
  wake_time_weekend: number,
  year: number,
}

export default function AccommodationListings() {
  const [selectedListing, setSelectedListing] = useState<Accommodation | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [listings, setListings] = useState<Accommodation[]>([]);
  const [filters, setFilters] = useState({
    pets_allowed: "",
    bedrooms: "",
    bathrooms: "",
    location: "",
  });
  const [loggedUsername, setLoggedUsername] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("id");

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("authKey");
      if (!token) {
        router.push("/");
        return;
      }
  
      try {
        await axios.get("/api/member_profile/", {
          headers: { Authorization: `Token ${token}` },
        });
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          console.warn("Unauthorized — redirecting to login");
          localStorage.removeItem("authKey");
          router.push("/");
        } else {
          console.error("Unexpected error during auth check", error);
        }
      }
    };
  
    checkLoggedIn();
  }, [router]);  

  useEffect(() => {
    setIsMounted(true);
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/listings/");
        const data: Accommodation[] = await response.json();
        setListings(data);
  
        if (selectedId) {
          const match = data.find((listing) => listing.id === Number(selectedId));
          if (match) setSelectedListing(match);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };
  
    fetchListings();
  }, [selectedId]);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("authKey"); // Example: Fetch user token from localStorage
      const response = await axios.get("api/member_profile/", {
        headers: { 
            Authorization: `Token ${token}`,

        },
      });
      const data = response.data as userData;
      setLoggedUsername(data.user.username);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  if (!isMounted) {
    return null;
  }

  const handleListingSelect = (listing: Accommodation) => {
    setSelectedListing(listing);
  };

  const toggleFilterPopup = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleListingDelete = async (listingId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this listing?");
  
    if (!confirmed) return;
  
    try {
      const response = await fetch(`http://localhost:8000/api/delete_listing/${listingId}/`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Failed to delete listing");
        alert("Failed to delete the listing. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert("An error occurred while deleting the listing.");
    }
  };  

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = searchTerm
      ? listing.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.poster_name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesFilters =
      (!filters.pets_allowed || String(listing.pets_allowed) === filters.pets_allowed) &&
      (!filters.bedrooms || listing.num_bedrooms.toString() === filters.bedrooms) &&
      (!filters.bathrooms || listing.num_bathrooms.toString() === filters.bathrooms) &&
      (!filters.location || listing.address.toLowerCase().includes(filters.location.toLowerCase()) || listing.city.toLowerCase().includes(filters.location.toLowerCase()) || listing.state.toLowerCase().includes(filters.location.toLowerCase()));

    return matchesSearch && matchesFilters;
  });

  return (
    <div className="flex h-screen bg-background">
      <div className="w-1/2 p-6 border-r border-border overflow-y-auto" style={{ maxHeight: "100vh" }}>
        <div className="relative mb-2 flex items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for accommodations"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="ml-4"
            onClick={() => router.push("/dashboard")}
          >
            <Home className="mr-2 h-4 w-4" /> Dashboard
          </Button>
          <Button
            variant="outline"
            className="ml-4"
            onClick={() => router.push("/create-listing")}
          >
            <Plus className="mr-2 h-4 w-4" /> Post Listing
          </Button>
        </div>
        <div className="mb-6">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center justify-start text-base"
            onClick={toggleFilterPopup}
          >
            <FilterIcon className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        <div className="space-y-4">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              onClick={() => handleListingSelect(listing)}
              className="flex items-center p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition"
            >
              <img
                src={
                  listing.housing_image_base64
                    ? `data:image/jpeg;base64,${listing.housing_image_base64}`
                    : "/Default_pfp.jpg"
                }
                alt="Accommodation Picture"
                width={50}
                height={50}
                className="mr-4 rounded object-cover aspect-square"
              />
              <div>
                <h3 className="text-lg font-bold">{listing.address}, {listing.city}, {listing.state}</h3>
                <p className="text-sm text-muted-foreground">Posted by {listing.poster_name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/2 p-6 border-r border-border overflow-y-auto" style={{ maxHeight: "100vh" }}>
        {selectedListing ? (
          <div className="flex flex-col items-center">
            {loggedUsername === selectedListing.poster_name && (
            <div className="self-end mb-2">
              <Button
                variant="destructive"
                onClick={async () => {
                  try {
                    handleListingDelete(selectedListing.id);
                    if (response.ok) {
                      setListings((prev) => prev.filter((l) => l.id !== selectedListing.id));
                      setSelectedListing(null);
                    } else {
                      console.error("Failed to delete listing");
                    }
                  } catch (err) {
                    console.error("Error deleting listing:", err);
                  }
                }}
              >
                Delete
              </Button>
            </div>
          )}
            <img
              src={
                selectedListing.housing_image_base64
                  ? `data:image/jpeg;base64,${selectedListing.housing_image_base64}`
                  : "/Default_pfp.jpg"
              }
              alt="Accommodation Picture"
              width={450}
              height={450}
              className="mb-4 rounded object-cover aspect-square"
            />
            <h2 className="text-xl font-bold">{selectedListing.address}, {selectedListing.city}, {selectedListing.state}</h2>
            <p className="text-muted-foreground mb-6">Posted by {selectedListing.poster_name}</p>
            <div className="w-full mb-6">
              <h3 className="text-lg font-semibold">Details</h3>
              <ul className="list-disc list-inside text-gray-700">
                <li>
                  <strong>Bedrooms:</strong> {selectedListing.num_bedrooms}
                </li>
                <li>
                  <strong>Bathrooms:</strong> {selectedListing.num_bathrooms}
                </li>
                <li>
                  <strong>Pets Allowed:</strong> {selectedListing.pets_allowed ? "Yes" : "No"}
                </li>
                <li>
                  <strong>Roommates Needed:</strong> {selectedListing.num_roommates_needed}
                </li>
                <li>
                  <strong>Available From:</strong> {new Date(selectedListing.start_date).toLocaleDateString()}
                </li>
                <li>
                  <strong>Available Until:</strong> {new Date(selectedListing.end_date).toLocaleDateString()}
                </li>
                <li>
                  <strong>Rent:</strong> ${selectedListing.rent}
                </li>
                <li>
                  <strong>AC:</strong> {selectedListing.has_ac ? "Yes" : "No"}
                </li>
                <li>
                  <strong>WiFi:</strong> {selectedListing.has_wifi ? "Yes" : "No"}
                </li>
              </ul>
            </div>
            <div className="w-full mb-6">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <p className="text-gray-700">{selectedListing.contact_info}</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Select a listing to view details</p>
        )}
      </div>
      {isFilterOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-1/3">
            <h2 className="text-lg font-semibold mb-4">Filter</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Location</label>
                <Input
                  type="text"
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Pets Allowed</label>
                <select
                  value={filters.pets_allowed}
                  onChange={(e) => setFilters({ ...filters, pets_allowed: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Any</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Bedrooms</label>
                <Input
                  type="number"
                  placeholder="Number of bedrooms"
                  value={filters.bedrooms}
                  onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Bathrooms</label>
                <Input
                  type="number"
                  placeholder="Number of bathrooms"
                  value={filters.bathrooms}
                  onChange={(e) => setFilters({ ...filters, bathrooms: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setIsFilterOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({ pets_allowed: "", bedrooms: "", bathrooms: "", location: "" });
                  setIsFilterOpen(false);
                }}
              >
                Clear Filters
              </Button>
              <Button onClick={() => setIsFilterOpen(false)}>Apply Filters</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
