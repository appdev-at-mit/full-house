"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Mail, Settings, Edit } from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import axios from "axios";

// Fix for missing default icons in Leaflet
const customIcon = new L.Icon({
  iconUrl: "/map-marker.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, 32],
});

// Mock data for map pins
const mapPins = [
  { id: 1, name: "Josie", about: "MIT 2027", lat: 42.3601, lng: -71.0942 } // replace with API call
];

export default function UserProfileMap() {
  const [activityStatus, setActivityStatus] = useState(false);
  const [isEditing, setIsEditing] = useState({ about: false, location: false });
  const [username, setUsername] = useState("Josephine Wang");
  const [userClass, setUserClass] = useState("2027");
  const [aboutText, setAboutText] = useState("Hi I'm josie hihihi");
  const [locationText, setLocationText] = useState("Cambridge, MA");
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // initData();
    setIsMounted(true);
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("sumting");
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return {};
    }
  };

  const initData = async () => {
    const data = await fetchUserData();
    setUsername(data.name);
    setUserClass(data.class);
  };

  const handleMailClick = () => {
    if (isMounted) {
      router.push("/messages");
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

  const handleSaveClick = (section) => {
    setIsEditing((prev) => ({ ...prev, [section]: false }));
  };

  const handleSearchHousemateClick = () => {
    router.push("/profile");
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* User Profile */}
      <div className="w-1/3 p-6 border-r border-border">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Image
                src="/pfp.png"
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
            <Button variant="ghost" onClick={handleMailClick}>
              <Mail className="h-6 w-6" /> {/* Increased size */}
            </Button>
          </div>

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

          {/* Actively looking for a roommate */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Actively looking for a roommate</h3>
            <Switch checked={activityStatus} onCheckedChange={setActivityStatus} />
          </div>

          {/* Search for Housemate Button */}
          <Button variant="outline" className="mb-6" onClick={handleSearchHousemateClick}>
            Search for a housemate
          </Button>

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

          {/* Map pins */}
          {mapPins.map((pin) => (
            <Marker
              key={pin.id}
              position={[pin.lat, pin.lng]}
              icon={customIcon}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
