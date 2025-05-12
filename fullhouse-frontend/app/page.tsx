"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from 'axios';
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { generateUSCoordinates } from "@/lib/utils";

// Load map components dynamically to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });

axios.defaults.baseURL = 'http://localhost:8000';

const customIcon = new L.Icon({
  iconUrl: "/map-marker.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, 32],
});

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [listings, setListings] = useState<{ lat: number; lng: number }[]>([]);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("authKey");
      if (!token) return;

      try {
        const response = await axios.get("/api/member_profile/", {
          headers: { Authorization: `Token ${token}` },
        });
        if (response.status === 200) {
          localStorage.setItem("user", JSON.stringify(response.data));
          router.push("/dashboard");
        }
      } catch {
        localStorage.removeItem("authKey");
      }
    };

    checkLoggedIn();
  }, [router]);

  useEffect(() => {
    const coords = generateUSCoordinates(30);
    setListings(coords);
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login_user/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authKey", data.authKey);
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Login failed");
      }
    } catch {
      alert("An error occurred during login.");
    }
  };

  const handleSignupRedirect = () => {
    router.push("/create-account");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="flex flex-1 overflow-hidden">
        {/* Login Form */}
        <div className="w-1/3 flex items-center justify-center bg-white border-r shadow-inner">
          <div className="p-8 w-full max-w-sm">
            <h1 className="text-8xl text-center mb-6">Full House</h1>
            <p className="text-gray-600 text-center mb-6">
              Find and offer student housing, sublets, and roommates for summer and post-graduation living.
            </p>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mb-5"
            />
            <Button className="w-full mb-3" onClick={handleLogin}>
              Login
            </Button>
            <Button className="w-full" variant="outline" onClick={handleSignupRedirect}>
              New here? Create an account!
            </Button>
          </div>
        </div>

        {/* Static Map */}
        <div className="w-2/3">
          <MapContainer
            center={[42.3601, -71.0942]}
            zoom={5}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {listings.map((loc, i) => (
              <Marker key={i} position={[loc.lat, loc.lng]} icon={customIcon} />
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
