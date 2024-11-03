"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const router = useRouter();
  const [bio, setBio] = useState("Hi, I'm Josephine!");
  const [location, setLocation] = useState("Cambridge, MA");
  const [activityStatus, setActivityStatus] = useState(false);
  const [privacy, setPrivacy] = useState("Public");
  const [profilePicture, setProfilePicture] = useState(null);

  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logged out");
  };

  const handleDeleteAccount = () => {
    // Handle account deletion logic here
    console.log("Account deleted");
  };

  const handleSaveChanges = () => {
    // Handle saving changes logic here
    console.log("Changes saved");
  };

  const handleBack = () => {
    router.push("/dashboard"); // Navigate back to the dashboard
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-screen p-6 bg-background items-center">
      <div className="flex mb-4">
        <button onClick={handleBack} className="mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500 hover:text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-bold">Settings</h2>
      </div>

      <div className="flex flex-col items-center w-full max-w-md mb-4">
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Profile Picture</label>
          <div className="relative mb-2">
            <img
              src={profilePicture || "/pfp.png"} // Use a default image if none is selected
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <label className="block text-sm font-semibold mb-1">Bio</label>
        <Input
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Edit your bio..."
          className="mb-4 w-full"
        />
        
        <label className="block text-sm font-semibold mb-1">Location</label>
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Edit your location..."
          className="mb-4 w-full"
        />
        
        <label className="block text-sm font-semibold mb-1">Actively looking for roommate</label>
        <select
          value={privacy}
          className="w-full mb-4 bg-white border border-gray-300 rounded-md p-2"
        >
          <option value="True">Yes</option>
          <option value="False">No</option>
        </select>
        
        <label className="block text-sm font-semibold mb-1">Privacy</label>
        <select
          value={privacy}
          onChange={(e) => setPrivacy(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-md p-2"
        >
          <option value="Public">Public</option>
          <option value="Private">Partial (hide location)</option>
          <option value="Private">Private</option>
        </select>
        <p className="mb-4 text-xs text-gray-500">Public: Anyone can see your profile and location <br></br>
        Partial: Anyone can see your profile but your location is hidden <br></br>
        Private: Your profile and location are hidden</p>

        <Button onClick={handleSaveChanges} className="mb-4 w-full">Save Changes</Button>
      </div>

      <div className="flex flex-col w-full max-w-md">
        <Button onClick={handleLogout} className="mb-2 w-full">Logout</Button>
        <Button onClick={handleDeleteAccount} className="bg-red-500 text-white w-full">Delete Account</Button>
      </div>
    </div>
  );
}
