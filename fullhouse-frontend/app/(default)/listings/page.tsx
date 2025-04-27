"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter as FilterIcon, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import axiosInstance from "../settings/[username]/axiosInstance";

type Accommodation = {
  id: number;
  posterUsername: string;
  profilePicture: string;
  num_bedrooms: number;
  num_bathrooms: number;
  pets_allowed: boolean;
  address: string;
  roommates: number;
  availableFrom: string;
  aboutText: string;
};

const mockAccommodations: Accommodation[] = [
  {
    id: 1,
    posterUsername: "Josephine Wang",
    profilePicture: "/house1.jpg",
    num_bedrooms: 3,
    num_bathrooms: 2,
    pets_allowed: true,
    address: "123 Main St, Cambridge, MA",
    roommates: 2,
    availableFrom: "June 1, 2024",
    aboutText: "A spacious 3-bedroom apartment near Harvard Square. Pet-friendly and has a beautiful balcony.",
  },
  {
    id: 2,
    posterUsername: "Chris Liem",
    profilePicture: "/house2.jpg",
    num_bedrooms: 2,
    num_bathrooms: 1,
    pets_allowed: false,
    address: "456 Park Ave, Boston, MA",
    roommates: 1,
    availableFrom: "July 15, 2024",
    aboutText: "Cozy 2-bedroom unit with a shared kitchen and living room. Walking distance to downtown.",
  },
  {
    id: 3,
    posterUsername: "Hailey Pan",
    profilePicture: "/house3.jpg",
    num_bedrooms: 4,
    num_bathrooms: 3,
    pets_allowed: true,
    address: "789 Elm St, Somerville, MA",
    roommates: 3,
    availableFrom: "May 1, 2024",
    aboutText: "Modern house with a spacious backyard. Ideal for families or groups of students.",
  },
];

export default function AccommodationListings() {
  const [selectedListing, setSelectedListing] = useState<Accommodation | null>(null);
  const [accommodations, setAcommodations] = useState<Accommodation[] | null>(mockAccommodations);
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    pets_allowed: "",
    num_bedrooms: "",
    num_bathrooms: "",
    location: "",
  });
  const router = useRouter();

  useEffect(() => {
      async function fetchData() {
        axiosInstance
          .get("http://127.0.0.1:8000/api/listings/")
          .then(response => {
            console.log("response", response.data);
            setAcommodations(response.data);
            setIsMounted(true);
            // Handle success (e.g., redirect or show success message)
          })
          .catch(error => {
            console.error('Error getting listings:', error);
            // Handle error (e.g., member not found)
          });
      }
      
      fetchData();
    }, []);

  if (!isMounted) {
    return null;
  }

  const handleListingSelect = (listing: Accommodation) => {
    setSelectedListing(listing);
  };

  const toggleFilterPopup = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const filteredListings = accommodations?.filter((listing) => {
    const matchesSearch = searchTerm
      ? listing.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.posterUsername.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesFilters =
      (!filters.pets_allowed || String(listing.pets_allowed) === filters.pets_allowed) &&
      (!filters.num_bedrooms || listing.num_bedrooms.toString() === filters.num_bedrooms) &&
      (!filters.num_bathrooms || listing.num_bathrooms.toString() === filters.num_bathrooms) &&
      (!filters.location || listing.address.toLowerCase().includes(filters.location.toLowerCase()));

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
          {filteredListings?.map((listing) => (
            <div
              key={listing.id}
              onClick={() => handleListingSelect(listing)}
              className="flex items-center p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition"
            >
              <img
                src={listing.profilePicture}
                alt="Profile Picture"
                width={50}
                height={50}
                className="mr-4"
              />
              <div>
                <h3 className="text-lg font-bold">{listing.address}</h3>
                <p className="text-sm text-muted-foreground">Posted by {listing.posterUsername}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/2 p-6 border-r border-border overflow-y-auto" style={{ maxHeight: "100vh" }}>
        {selectedListing ? (
          <div className="flex flex-col items-center">
            <img
              src={selectedListing.profilePicture}
              alt="Profile Picture"
              width={450}
              height={450}
              className="mb-4"
            />
            <h2 className="text-xl font-bold">{selectedListing.address}</h2>
            <p className="text-muted-foreground mb-6">Posted by {selectedListing.posterUsername}</p>
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
                  <strong>Roommates:</strong> {selectedListing.roommates}
                </li>
                <li>
                  <strong>Available From:</strong> {selectedListing.availableFrom}
                </li>
              </ul>
            </div>
            <div className="w-full mb-6">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-gray-700">{selectedListing.aboutText}</p>
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
                  value={filters.num_bedrooms}
                  onChange={(e) => setFilters({ ...filters, num_bedrooms: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Bathrooms</label>
                <Input
                  type="number"
                  placeholder="Number of bathrooms"
                  value={filters.num_bathrooms}
                  onChange={(e) => setFilters({ ...filters, num_bathrooms: e.target.value })}
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
                  setFilters({ pets_allowed: "", num_bedrooms: "", num_bathrooms: "", location: "" });
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
