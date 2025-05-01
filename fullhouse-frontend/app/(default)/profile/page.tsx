"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Filter as FilterIcon, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const mapStatusToLabel = (status: number) => {
  switch (status) {
    case 0: return "Not looking for housing";
    case 1: return "Looking for housing";
    case 2: return "Have housing plans and looking for roommate(s)";
    default: return "Unknown";
  }
};

const mapGenderToLabel = (gender: number) => {
  switch (gender) {
    case 0: return "Male";
    case 1: return "Female";
    case 2: return "Transmale";
    case 3: return "Transfemale";
    case 4: return "Neutral/Other";
    case 5: return "Prefer not to say";
    default: return "Unknown";
  }
};

const mapYearToLabel = (year: number) => {
  switch (year) {
    case 0: return "Freshman Undergraduate";
    case 1: return "Sophomore Undergraduate";
    case 2: return "Junior Undergraduate";
    case 3: return "Senior Undergraduate";
    case 4: return "Fifth-year Undergraduate";
    case 5: return "Graduate Student";
    default: return "Unknown";
  }
};

const mapCleanlinessToLabel = (value: number) => {
  switch (value) {
    case 0: return "I prefer my living space to be neat and clean all of the time";
    case 1: return "I like my living space to be clean but I can tolerate some clutter";
    case 2: return "Mess/clutter does not bother me";
    default: return "Unknown";
  }
};

const mapTempToLabel = (value: number) => {
  switch (value) {
    case 0: return "I prefer a relatively warm temperature (above 72F/22C)";
    case 1: return "I prefer a relatively cool temperature (below 68F/20C)";
    case 2: return "No preference";
    default: return "Unknown";
  }
};

const mapGuestPolicyToLabel = (value: number) => {
  switch (value) {
    case 0: return "Guests should always be coordinated to make sure everyone is comfortable.";
    case 1: return "Let's talk together about what rules we want to set about guests coming over.";
    case 2: return "Spontaneity is great! Anything (within reason) is fine by me.";
    default: return "Unknown";
  }
};

const mapSleepLightToLabel = (value: number) => {
  switch (value) {
    case 0: return "Lights on";
    case 1: return "Some minimal light";
    case 2: return "Completely dark";
    case 3: return "No preference";
    default: return "Unknown";
  }
};  

type UserProfile = {
  id: number;
  profilePicture: string;
  username: string;
  userClass: string;
  aboutText: string;
  locationText: string;
  activityStatus: boolean;
  email: string;
  preferences: {
    status: string;
    gender: string;
    year: string;
    sleepTime: string;
    wakeTime: string;
    cleanliness: string;
    temperature: string;
    guestPolicy: string;
    sleepLightLevel: string;
  };
};

export default function UserProfileMap() {
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    activeStatus: false,
    gender: "",
    year: "",
    location: "",
    status: "",
  });

  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("authKey");
        const response = await fetch("http://localhost:8000/api/member_profiles/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ only_active: true }),
        });
        const data = await response.json();
  
        const users = data.users.map((u: any) => ({
          id: u.user.username,  // set ID to username
          profilePicture: u.profile_pic || null,
          username: u.user.username,
          userClass: mapYearToLabel(u.year),
          aboutText: u.bio,
          locationText: `${u.city_name}, ${u.state_name}`,
          activityStatus: u.rooming_status !== 0,
          email: u.user.email,
          preferences: {
            status: mapStatusToLabel(u.rooming_status),
            gender: mapGenderToLabel(u.gender),
            year: mapYearToLabel(u.year),
            // sleepTime: mapSleepTime(u.sleep_time_weekday),
            // wakeTime: mapWakeTime(u.wake_time_weekday),
            cleanliness: mapCleanlinessToLabel(u.pref_cleanliness),
            temperature: mapTempToLabel(u.pref_temperature),
            guestPolicy: mapGuestPolicyToLabel(u.pref_day_guests),
            sleepLightLevel: mapSleepLightToLabel(u.pref_sleep_light),
          },
        }));        
  
        setAllUsers(users);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
  
    fetchUsers();
    setIsMounted(true);
  }, []);  

  if (!isMounted) {
    return null;
  }

  const handleUserSelect = (user: UserProfile) => {
    setSelectedUser(user);
  };

  const handleMessageClick = (userId: number) => {
    router.push(`/messages?user=${userId}`);
  };

  const toggleFilterPopup = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch = searchTerm
      ? user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.locationText.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesFilters =
      (!filters.gender || user.preferences.gender === filters.gender) &&
      (!filters.year || user.preferences.year.includes(filters.year)) &&
      (!filters.location || user.locationText.toLowerCase().includes(filters.location)) &&
      (!filters.status || user.preferences.status === filters.status);

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
                placeholder="Search for roommates"
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
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className="flex items-center p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition"
            >
              <Image
                src={user.profilePicture ? `data:image/jpeg;base64,${user.profilePicture}` : "/Default_pfp.jpg"}
                alt="Profile Picture"
                width={50}
                height={50}
                className="rounded-full mr-4 object-cover aspect-square"
              />
              <div>
                <h3 className="text-lg font-bold">{user.username}</h3>
                <p className="text-sm text-muted-foreground">{user.locationText}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/2 p-6 border-r border-border overflow-y-auto" style={{ maxHeight: "100vh" }}>
        {selectedUser ? (
          <div className="flex flex-col items-center">
            <Image
              src={selectedUser.profilePicture ? `data:image/jpeg;base64,${selectedUser.profilePicture}` : "/Default_pfp.jpg"}
              alt="Profile Picture"
              width={250}
              height={250}
              className="rounded-full mb-4 object-cover aspect-square"
            />
            <h2 className="text-xl font-bold">{selectedUser.username}</h2>
            <p className="text-muted-foreground mb-6">{selectedUser.userClass}</p>
            <div className="w-full mb-6">
              <h3 className="text-lg font-semibold">About Me</h3>
              <p className="text-gray-700">{selectedUser.aboutText}</p>
            </div>
            <div className="w-full mb-6">
              <h3 className="text-lg font-semibold">Location</h3>
              <p className="text-gray-700">{selectedUser.locationText}</p>
            </div>
            {/* <div className="w-full flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Actively looking for a roommate</h3>
              <span
                className={`text-sm px-2 py-1 rounded ${
                  selectedUser.activityStatus ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-800"
                }`}
              >
                {selectedUser.activityStatus ? "Yes" : "No"}
              </span>
            </div> */}
            <div className="w-full">
              <h3 className="text-lg font-semibold">Preferences</h3>
              <ul className="list-disc list-inside text-gray-700">
                {Object.entries(selectedUser.preferences).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key.charAt(0).toUpperCase()+key.slice(1).replace(/([A-Z])/g, " $1")}: </strong>
                    {value}
                  </li>
                ))}
              </ul>
            </div>
            {/* <Button
              variant="outline"
              className="mt-2 w-full"
              onClick={() => handleMessageClick(selectedUser.id)}
            >
              Message
            </Button> */}
            <div className="w-full mt-6">
              <h3 className="text-lg font-semibold">Contact</h3>
              <p className="text-gray-700">{selectedUser.email}</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Select a user to view their profile</p>
        )}
      </div>
      {isFilterOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-1/3">
            <h2 className="text-lg font-semibold mb-4">Filter</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="gender" className="block text-sm font-medium">
                  Location
                </label>
                <Input
                  type="text"
                  placeholder="Location"
                  className="mb-4"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })} >
                </Input>
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium">
                  Gender
                </label>
                <select
                  id="gender"
                  value={filters.gender}
                  onChange={(e) => setFilters((prev) => ({ ...prev, gender: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Nonbinary">Nonbinary</option>
                </select>
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium">
                  Year
                </label>
                <select
                  id="year"
                  value={filters.year}
                  onChange={(e) => setFilters((prev) => ({ ...prev, year: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Any</option>
                  <option value="Freshman Undergraduate">Freshman Undergraduate</option>
                  <option value="Sophomore Undergraduate">Sophomore Undergraduate</option>
                  <option value="Junior Undergraduate">Junior Undergraduate</option>
                  <option value="Senior Undergraduate">Senior Undergraduate</option>
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium">
                  Housing Status
                </label>
                <select
                  id="status"
                  value={filters.status}
                  onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Any</option>
                  <option value="Looking for housing">Looking for housing</option>
                  <option value="Not looking for housing">Not looking for housing</option>
                  <option value="Have housing plans and looking for roommate(s)">
                    Have housing plans and looking for roommate(s)
                  </option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({ location: "", status: null, gender: null, year: null });
                  setIsFilterOpen(false);
                }}
              >
                Clear Filters
              </Button>
              <Button
                onClick={() => setIsFilterOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
