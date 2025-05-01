"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Settings, Edit } from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { Switch } from "@/components/ui/switch";
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

// Mock data for map pins
const mapPins = [
  { id: 1, city: "Cambridge, MA", num: 234, lat: 42.3601, lng: -71.0942 },
  { id: 2, city: "New York, NY", num: 500, lat: 40.7128, lng: -74.0060 },
  { id: 3, city: "Los Angeles, CA", num: 320, lat: 34.0522, lng: -118.2437 },
  { id: 4, city: "Chicago, IL", num: 400, lat: 41.8781, lng: -87.6298 },
  { id: 5, city: "Houston, TX", num: 180, lat: 29.7604, lng: -95.3698 },
  { id: 6, city: "Phoenix, AZ", num: 150, lat: 33.4484, lng: -112.0740 },
  { id: 7, city: "Philadelphia, PA", num: 210, lat: 39.9526, lng: -75.1652 },
  { id: 8, city: "San Antonio, TX", num: 275, lat: 29.4241, lng: -98.4936 },
  { id: 9, city: "San Diego, CA", num: 200, lat: 32.7157, lng: -117.1611 },
  { id: 10, city: "Dallas, TX", num: 250, lat: 32.7767, lng: -96.7970 },
  { id: 11, city: "Austin, TX", num: 220, lat: 30.2672, lng: -97.7431 },
  { id: 12, city: "Jacksonville, FL", num: 160, lat: 30.3322, lng: -81.6557 },
  { id: 13, city: "Fort Worth, TX", num: 190, lat: 32.7555, lng: -97.3330 },
  { id: 14, city: "Columbus, OH", num: 130, lat: 39.9612, lng: -82.9988 },
  { id: 15, city: "Indianapolis, IN", num: 145, lat: 39.7684, lng: -86.1580 },
  { id: 16, city: "Charlotte, NC", num: 120, lat: 35.2271, lng: -80.8431 },
  { id: 17, city: "Seattle, WA", num: 160, lat: 47.6062, lng: -122.3321 },
  { id: 18, city: "Denver, CO", num: 140, lat: 39.7392, lng: -104.9903 },
  { id: 19, city: "Washington, D.C.", num: 300, lat: 38.9072, lng: -77.0369 },
  { id: 20, city: "Boston, MA", num: 260, lat: 42.3601, lng: -71.0589 }
];


type userData = {
    username: string,
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

export default function UserProfileMap() {
  const [activityStatus, setActivityStatus] = useState(true);
  const [isEditing, setIsEditing] = useState({
    about: false,
    location: false,
    preferences: false,
  });
  const [username, setUsername] = useState("Josephine Wang");
  const [userClass, setUserClass] = useState("2027");
  const [aboutText, setAboutText] = useState("Hi! I am a sophomore majoring in course 6-3. I like traveling, sightseeing, and trying new cuisines.");
  const [locationText, setLocationText] = useState("Cambridge, MA");
  const [statusText, setStatusText] = useState("Not looking for housing");
  const [genderText, setGenderText] = useState("Female");
  const [cleanText, setCleanText] = useState("I prefer my living space to be neat and clean all of the time");
  const [tempText, setTempText] = useState("I prefer a relatively warm temperature (above 72F/22C)");
  const [guestText, setGuestTest] = useState("Spontaneity is great! Anything (within reason) is fine by me.");
  const [sleepLightText, setSleepLightText] = useState("Completely dark");
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    initData();
    setIsMounted(true);
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("authKey"); // Example: Fetch user token from localStorage
      console.log('token:', token);
      const response = await axios.get("api/member_profile/", {
        headers: { 
            Authorization: `Token ${token}`,

        },
      });
      const data = response.data as userData;
      console.log(data);

      setUsername(data.username);
      setUserClass(data.class);
      setAboutText(data.about);
      setLocationText(data.location);
      setStatusText(data.preferences);
      setGenderText(data.preferences);
      setCleanText(data.preferences);
      setTempText(data.preferences);
      setGuestTest(data.preferences);
      setSleepLightText(data.preferences);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const initData = async () => {
    console.log("init data");
    const data = await fetchUserData();
    console.log("got data");
    setUsername(data.name);
    setUserClass(data.class);
  };

  const handleSettingsClick = () => {
    if (isMounted) {
      router.push("/settings");
    }
  };

  const handleEditClick = (section) => {
    setIsEditing((prev) => ({ ...prev, [section]: true }));
  };

  const handleSaveClick = (section) => {
    // Disable editing mode for the specific section
    setIsEditing((prev) => ({
      ...prev,
      [section]: false,
    }));
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
                src="/portrait1.jpg"
                alt="Profile Picture"
                width={64}
                height={64}
                className="rounded-full mr-4"
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
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
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
              <div>
                <Input
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  className="mb-2"
                />
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
                <p className='mt-2 text-muted-foreground'><strong>Guest Policy:</strong> {guestText}</p>
                <p className='mt-2 text-muted-foreground'><strong>Sleep Light Level:</strong> {sleepLightText}</p>
                {/* Add other preferences similarly */}
              </div>            
            ) : (
              <div>
                <div>
                  <h4 className="text-sm font-semibold">Looking for Housing</h4>
                  <select className="form-select">
                    <option value="0">Not looking for housing</option>
                    <option value="1">Looking for housing</option>
                    <option value="2">Have housing plans and looking for roommate(s)</option>
                  </select>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Gender Preference</h4>
                  <select className="form-select">
                    <option value="0">Male</option>
                    <option value="1">Female</option>
                    <option value="2">Transmale</option>
                    <option value="3">Transfemale</option>
                    <option value="4">Neutral/Other</option>
                    <option value="5">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Cleanliness</h4>
                  <select className="form-select">
                    <option value="0">I prefer my living space to be neat and clean all of the time</option>
                    <option value="1">I like my living space to be clean but I can tolerate some clutter</option>
                    <option value="2">Mess/clutter does not bother me</option>
                  </select>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Temperature</h4>
                  <select className="form-select">
                    <option value="0">I prefer a relatively warm temperature (above 72F/22C)</option>
                    <option value="1">I prefer a relatively cool temperature (below 68F/20C)</option>
                    <option value="2">No preference</option>
                  </select>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Guest Policy</h4>
                  <select className="form-select">
                    <option value="0">Guests should always be coordinated to make sure everyone is comfortable.</option>
                    <option value="1">Let's talk together about what rules we want to set about guests coming over.</option>
                    <option value="2">Spontaneity is great! Anything (within reason) is fine by me.</option>
                  </select>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Sleep Light Level</h4>
                  <select className="form-select">
                    <option value="0">Lights on</option>
                    <option value="1">Some minimal light</option>
                    <option value="2">Completely dark</option>
                    <option value="3">No preference</option>
                  </select>
                </div>
                {/* Add other preferences similarly */}
                <Button variant="outline" onClick={() => handleSaveClick("preferences")}>
                  Save
                </Button>
              </div>
            )}
          </div>

          {/* Actively looking for a roommate */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Actively looking for a roommate</h3>
            <Switch checked={activityStatus} onCheckedChange={setActivityStatus} />
          </div>

          <Button variant="outline" className="mb-auto" onClick={handleSettingsClick}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="w-2/3 p-6 relative">
        <MapContainer
          center={[42.3601, -71.0942]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {mapPins.map((pin) => (
            <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={customIcon}>
              <div>{pin.name}</div>
              <div>{pin.about}</div>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
