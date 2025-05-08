"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Settings, Edit } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import axios from '../../../axios.config';

// Fix for missing default icons in Leaflet
const customIcon = new L.Icon({
  iconUrl: "/map-marker.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, 32],
});

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

export default function UserProfileMap() {
  const [isEditing, setIsEditing] = useState({
    about: false,
    location: false,
    preferences: false,
  });
  const [username, setUsername] = useState("");
  const [userClass, setUserClass] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [locationText, setLocationText] = useState("");
  const [statusText, setStatusText] = useState("");
  const [genderText, setGenderText] = useState("");
  const [cleanText, setCleanText] = useState("");
  const [tempText, setTempText] = useState("");
  const [guestDayText, setGuestDayText] = useState("");
  const [guestNightText, setGuestNightText] = useState("");
  const [sleepLightText, setSleepLightText] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const [editableAbout, setEditableAbout] = useState<string>("");
  const [editableCity, setEditableCity] = useState<string>("");
  const [editableState, setEditableState] = useState<string>("");
  const [editableStatus, setEditableStatus] = useState<number | null>(null);
  const [editableGender, setEditableGender] = useState<number | null>(null);
  const [editableClean, setEditableClean] = useState<number | null>(null);
  const [editableTemp, setEditableTemp] = useState<number | null>(null);
  const [editableDayGuests, setEditableDayGuests] = useState<number | null>(null);
  const [editableNightGuests, setEditableNightGuests] = useState<number | null>(null);
  const [editableSleepLight, setEditableSleepLight] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string>("");

  const [listings, setListings] = useState<Accommodation[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

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
      case 2: return "Trans male";
      case 3: return "Trans female";
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
    fetchUserData();
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/listings/");
        const data = await response.json(); // data is an array, not an object
  
        if (!Array.isArray(data) || data.length === 0) {
          console.error("No listings found in response");
          setListings([]);
          return;
        }
  
        const geocoded = await Promise.all(
          data.map(async (listing: any) => {
            const fullAddress = `${listing.address}, ${listing.city}, ${listing.state}`;
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullAddress)}&format=json&limit=1`
              );
              const geo = await response.json();
  
              if (geo.length > 0) {
                return {
                  ...listing,
                  lat: parseFloat(geo[0].lat),
                  lng: parseFloat(geo[0].lon),
                };
              }
            } catch (err) {
              console.error("Geocoding failed for:", fullAddress, err);
            }
  
            return null;
          })
        );
  
        setListings(geocoded.filter(Boolean));
      } catch (err) {
        console.error("Failed to fetch listings:", err);
        setListings([]);
      }
    };
  
    fetchListings();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("authKey");
      const response = await axios.get("api/member_profile/", {
        headers: { 
            Authorization: `Token ${token}`,
        },
      });
      const data = response.data as userData;

      setUsername(`${data.user.username}`);
      setUserClass(mapYearToLabel(data.year));
      setAboutText(data.bio);
      setLocationText(`${data.city_name}, ${data.state_name}`);
      setStatusText(mapStatusToLabel(data.rooming_status));
      setGenderText(mapGenderToLabel(data.gender));
      setCleanText(mapCleanlinessToLabel(data.pref_cleanliness));
      setTempText(mapTempToLabel(data.pref_temperature));
      setGuestDayText(mapGuestPolicyToLabel(data.pref_day_guests));
      setGuestNightText(mapGuestPolicyToLabel(data.pref_night_guests));
      setSleepLightText(mapSleepLightToLabel(data.pref_sleep_light));
      setProfilePic(data.profile_pic ?? null);

      // Editable
      setEditableAbout(data.bio);
      setEditableCity(data.city_name);
      setEditableState(data.state_name);
      setEditableStatus(data.rooming_status);
      setEditableGender(data.gender);
      setEditableClean(data.pref_cleanliness);
      setEditableTemp(data.pref_temperature);
      setEditableDayGuests(data.pref_day_guests);
      setEditableNightGuests(data.pref_night_guests);
      setEditableSleepLight(data.pref_sleep_light);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSettingsClick = () => {
    if (isMounted) {
      router.push("/settings");
    }
  };

  const handleEditClick = (section) => {
    setIsEditing((prev) => ({ ...prev, [section]: true }));
  };

  const handleSaveClick = async (section: string) => {
    setIsEditing((prev) => ({ ...prev, [section]: false }));
  
    const token = localStorage.getItem("authKey");
  
    if (section === "preferences") {
      try {
        await axios.put("api/member_profile/", {
          rooming_status: editableStatus,
          gender: editableGender,
          pref_cleanliness: editableClean,
          pref_temperature: editableTemp,
          pref_day_guests: editableDayGuests,
          pref_night_guests: editableNightGuests,
          pref_sleep_light: editableSleepLight,
        }, {
          headers: { Authorization: `Token ${token}` }
        });
        fetchUserData();
      } catch (error) {
        console.error("Error saving preferences:", error);
      }
    }
  
    if (section === "about") {
      try {
        await axios.put("api/member_profile/", {
          bio: editableAbout,
        }, {
          headers: { Authorization: `Token ${token}` }
        });
        fetchUserData();
      } catch (error) {
        console.error("Error saving bio:", error);
      }
    }
  
    if (section === "location") {
      if (editableState.length !== 2) {
        setLocationError("State must be two letters.");
        setIsEditing((prev) => ({ ...prev, [section]: true }));
        return;
      }
  
      try {
        await axios.put("api/member_profile/", {
          city_name: editableCity,
          state_name: editableState.toUpperCase(),
        }, {
          headers: { Authorization: `Token ${token}` }
        });
        setLocationError("");
        fetchUserData();
      } catch (error) {
        console.error("Error saving location:", error);
      }
    }
  };  

  const handleSearchHousemateClick = () => {
    router.push("/profile");
  };

  const handleSearchHousingClick = () => {
    router.push("/listings");
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* User Profile */}
      <div className="w-1/3 p-6 border-r border-border overflow-y-auto mb-6" style={{ maxHeight: "100vh" }}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Image
                src={profilePic ? `data:image/jpeg;base64,${profilePic}` : "/Default_pfp.jpg"}
                alt="Profile Picture"
                width={64}
                height={64}
                className="rounded-full mr-4 object-cover aspect-square"
              />
              <div>
                <h2 className="text-xl font-bold">{username}</h2>
                <p className="text-muted-foreground">{userClass}</p>
              </div>
            </div>
          </div>

          <Button variant="outline" className="mb-4" onClick={handleSearchHousemateClick}>
            Search for housemate
          </Button>

          <Button variant="outline" className="mb-4" onClick={handleSearchHousingClick}>
            Search for housing
          </Button>

          {/* About Me Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">About Me</h3>
              <Edit
                className="h-4 w-4 text-muted-foreground cursor-pointer ml-2"
                onClick={() => handleEditClick("about")}
              />
            </div>
            {!isEditing.about ? (
              <p className="text-muted-foreground">{aboutText}</p>
            ) : (
              <div>
                <Input
                  value={editableAbout}
                  onChange={(e) => setEditableAbout(e.target.value)}
                  className="mb-2"
                />
                <Button variant="outline" onClick={() => handleSaveClick("about")}>
                  Save
                </Button>
              </div>
            )}
          </div>

          {/* Location Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Location</h3>
              <Edit
                className="h-4 w-4 text-muted-foreground cursor-pointer ml-2"
                onClick={() => handleEditClick("location")}
              />
            </div>
            {!isEditing.location ? (
              <p className="text-muted-foreground">{locationText}</p>
            ) : (
              <div className="space-y-2">
                <Input
                  placeholder="City"
                  value={editableCity}
                  onChange={(e) => setEditableCity(e.target.value)}
                />
                <Input
                  placeholder="State (e.g. MA)"
                  value={editableState}
                  onChange={(e) => setEditableState(e.target.value.toUpperCase())}
                  maxLength={2}
                />
                {locationError && (
                  <p className="text-red-600 text-sm">{locationError}</p>
                )}
                <Button variant="outline" onClick={() => handleSaveClick("location")}>
                  Save
                </Button>
              </div>
            )}
          </div>

          {/* Preferences Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Roommate Preferences</h3>
              <Edit
                className="h-4 w-4 text-muted-foreground cursor-pointer ml-2"
                onClick={() => handleEditClick("preferences")}
              />
            </div>
            {!isEditing.preferences ? (
              <div>
                <p className='mt-2 text-muted-foreground'><strong>Looking for Housing:</strong> {statusText}</p>
                <p className='mt-2 text-muted-foreground'><strong>Gender Preference:</strong> {genderText}</p>
                <p className='mt-2 text-muted-foreground'><strong>Cleanliness Preference:</strong> {cleanText}</p>
                <p className='mt-2 text-muted-foreground'><strong>Temperature Preference:</strong> {tempText}</p>
                <p className='mt-2 text-muted-foreground'><strong>Day Guest Policy:</strong> {guestDayText}</p>
                <p className='mt-2 text-muted-foreground'><strong>Night Guest Policy:</strong> {guestNightText}</p>
                <p className='mt-2 text-muted-foreground'><strong>Sleep Light Level:</strong> {sleepLightText}</p>
                {/* Add other preferences similarly */}
              </div>            
            ) : (
              <div>
                <div>
                  <h4 className="text-sm font-semibold">Looking for Housing</h4>
                  <select className="form-select" value={editableStatus ?? ""} onChange={(e) => setEditableStatus(Number(e.target.value))}>
                    <option value="0">Not looking for housing</option>
                    <option value="1">Looking for housing</option>
                    <option value="2">Have housing plans and looking for roommate(s)</option>
                  </select>
                </div>

                <div>
                  <h4 className="text-sm font-semibold">Gender Preference</h4>
                  <select className="form-select" value={editableGender ?? ""} onChange={(e) => setEditableGender(Number(e.target.value))}>
                    <option value="0">Male</option>
                    <option value="1">Female</option>
                    <option value="2">Trans male</option>
                    <option value="3">Trans female</option>
                    <option value="4">Neutral/Other</option>
                    <option value="5">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <h4 className="text-sm font-semibold">Cleanliness</h4>
                  <select className="form-select" value={editableClean ?? ""} onChange={(e) => setEditableClean(Number(e.target.value))}>
                    <option value="0">I prefer my living space to be neat and clean all of the time</option>
                    <option value="1">I like my living space to be clean but I can tolerate some clutter</option>
                    <option value="2">Mess/clutter does not bother me</option>
                  </select>
                </div>

                <div>
                  <h4 className="text-sm font-semibold">Temperature</h4>
                  <select className="form-select" value={editableTemp ?? ""} onChange={(e) => setEditableTemp(Number(e.target.value))}>
                    <option value="0">I prefer a relatively warm temperature (above 72F/22C)</option>
                    <option value="1">I prefer a relatively cool temperature (below 68F/20C)</option>
                    <option value="2">No preference</option>
                  </select>
                </div>

                <div>
                  <h4 className="text-sm font-semibold">Day Guest Policy</h4>
                  <select className="form-select" value={editableDayGuests ?? ""} onChange={(e) => setEditableDayGuests(Number(e.target.value))}>
                    <option value="0">Guests should always be coordinated to make sure everyone is comfortable.</option>
                    <option value="1">Let's talk together about what rules we want to set about guests coming over.</option>
                    <option value="2">Spontaneity is great! Anything (within reason) is fine by me.</option>
                  </select>
                </div>

                <div>
                  <h4 className="text-sm font-semibold">Night Guest Policy</h4>
                  <select className="form-select" value={editableNightGuests ?? ""} onChange={(e) => setEditableNightGuests(Number(e.target.value))}>
                    <option value="0">Guests should always be coordinated to make sure everyone is comfortable.</option>
                    <option value="1">Let's talk together about what rules we want to set about guests coming over.</option>
                    <option value="2">Spontaneity is great! Anything (within reason) is fine by me.</option>
                  </select>
                </div>

                <div>
                  <h4 className="text-sm font-semibold">Sleep Light Level</h4>
                  <select className="form-select" value={editableSleepLight ?? ""} onChange={(e) => setEditableSleepLight(Number(e.target.value))}>
                    <option value="0">Lights on</option>
                    <option value="1">Some minimal light</option>
                    <option value="2">Completely dark</option>
                    <option value="3">No preference</option>
                  </select>
                </div>
                <Button variant="outline" onClick={() => handleSaveClick("preferences")}>
                  Save
                </Button>
              </div>
            )}
          </div>

          <Button variant="outline" className="mb-auto" onClick={handleSettingsClick}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="w-2/3 p-6 relative">
        <h2 className="text-xl font-bold">Available accommodations</h2>
        <MapContainer
          center={[42.3601, -71.0942]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {listings.map((listing) => (
            <Marker
              key={listing.id}
              position={[listing.lat, listing.lng]}
              icon={customIcon}
              eventHandlers={{
                click: () => router.push(`/listings?id=${listing.id}`)
              }}
            >
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
