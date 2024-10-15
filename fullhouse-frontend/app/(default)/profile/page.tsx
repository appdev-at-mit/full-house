"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Mail, Settings, Search, Edit } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet/dist/leaflet.css";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data for map pins
const mapPins = [
  { id: 1, name: "Josie", about: "MIT 2027", lat: 37.7749, lng: -122.4194 } // replace with API call
];

export default function UserProfileMap() {
  const [selectedPin, setSelectedPin] = useState(null);
  const [activityStatus, setActivityStatus] = useState(false);
  const [privacySettings, setPrivacySettings] = useState(false);

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
              <h2 className="text-xl font-bold">User Name</h2>
              <p className="text-muted-foreground">User Class</p>
            </div>
          </div>
          <Button variant="ghost">
            <Mail className="h-4 w-4" />
          </Button>
        </div>
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">About Me</h3>
              <Edit className="h-4 w-4 text-muted-foreground cursor-pointer ml-2" />
            </div>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Location</h3>
              <Edit className="h-4 w-4 text-muted-foreground cursor-pointer ml-2" />
            </div>
            <p className="text-muted-foreground">
              Cambridge, MA
            </p>
          </div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Actively looking for a roommate</h3>
            <Switch checked={activityStatus} onCheckedChange={setActivityStatus} />
          </div>
          <div className="relative mb-6">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search for a housemate" className="pl-8" />
          </div>
          <Button variant="outline" className="mb-auto">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="w-2/3 p-6 relative">
        <MapContainer
          center={[42.3601, -71.0942]} // Default center (San Francisco)
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Map pins */}
          {mapPins.map((pin) => (
            <Marker key={pin.id} position={[pin.lat, pin.lng]}>
              <Popup>
                <h3 className="text-lg font-semibold">{pin.name}</h3>
                <p className="text-muted-foreground">{pin.about}</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
