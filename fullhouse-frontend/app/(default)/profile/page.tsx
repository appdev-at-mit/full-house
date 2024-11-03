"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

type UserProfile = {
  id: number;
  profilePicture: string;
  username: string;
  userClass: string;
  aboutText: string;
  locationText: string;
  activityStatus: boolean;
};

const mockUsers: UserProfile[] = [
  {
    id: 1,
    profilePicture: "/pfp.png",
    username: "Josephine Wang",
    userClass: "2027",
    aboutText: "Hi, I'm Josie. I'm cool.",
    locationText: "Cambridge, MA",
    activityStatus: true,
  },
  {
    id: 2,
    profilePicture: "/pfp.png",
    username: "Hailey Pan",
    userClass: "2026",
    aboutText: "I'm really cool. I'm even cooler than Josie.",
    locationText: "Boston, MA",
    activityStatus: false,
  },
  {
    id: 3,
    profilePicture: "/pfp.png",
    username: "Chris Liem",
    userClass: "2025",
    aboutText: "I like food.",
    locationText: "Boston, MA",
    activityStatus: true,
  },
];

export default function UserProfileMap() {
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
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

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.locationText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Other Users - Left Side */}
      <div className="w-1/2 p-6 border-r border-border">
        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for a housemate"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* User Profile List */}
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className="flex items-center p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition"
            >
              <Image
                src={user.profilePicture}
                alt="Profile Picture"
                width={50}
                height={50}
                className="rounded-full mr-4"
              />
              <div>
                <h3 className="text-lg font-bold">{user.username}</h3>
                <p className="text-sm text-muted-foreground">{user.locationText}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected User Profile - Right Side */}
      <div className="w-1/2 p-6 relative">
        {selectedUser ? (
          <div className="flex flex-col items-center">
            <Image
              src={selectedUser.profilePicture}
              alt="Profile Picture"
              width={250}
              height={250}
              className="rounded-full mb-4"
            />
            <h2 className="text-xl font-bold">{selectedUser.username}</h2>
            <p className="text-muted-foreground mb-6">{selectedUser.userClass}</p>

            {/* About Me Section */}
            <div className="w-full mb-6">
              <h3 className="text-lg font-semibold">About Me</h3>
              <p className="text-gray-700">{selectedUser.aboutText}</p>
            </div>

            {/* Location Section */}
            <div className="w-full mb-6">
              <h3 className="text-lg font-semibold">Location</h3>
              <p className="text-gray-700">{selectedUser.locationText}</p>
            </div>

            {/* Actively looking for a roommate */}
            <div className="w-full flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Actively looking for a roommate</h3>
              <span
                className={`text-sm px-2 py-1 rounded ${
                  selectedUser.activityStatus ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-800"
                }`}
              >
                {selectedUser.activityStatus ? "Yes" : "No"}
              </span>
            </div>

            <Button
              variant="outline"
              className="mt-2 w-full"
              onClick={() => handleMessageClick(selectedUser.id)}
            >
              Message
            </Button>
          </div>
        ) : (
          <p className="text-center text-gray-500">Select a user to view their profile</p>
        )}
      </div>
    </div>
  );
}
