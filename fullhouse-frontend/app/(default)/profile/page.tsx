"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Mail, Settings, Search, Edit, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import axios from "axios";

export default function UserProfileMap() {
  const [activityStatus, setActivityStatus] = useState(false);
  const [username, setUsername] = useState("Josephine Wang");
  const [userClass, setUserClass] = useState("2027");
  const [aboutText, setAboutText] = useState("Hi I'm josie hihihi");
  const [locationText, setLocationText] = useState("Cambridge, MA");
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Other Users */}
      <div className="w-1/2 p-6 border-r border-border">
        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search for a housemate" className="pl-8" />
        </div>
      </div>    
      {/* User Profile */}
      <div className="w-1/2 p-6 relative">
        <div className="flex flex-col">
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
          </div>

          {/* About Me Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">About Me</h3>
              <p>{aboutText}</p>
            </div>
          </div>

          {/* Location Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Location</h3>
              <p>{locationText}</p>
            </div>
          </div>

          {/* Actively looking for a roommate */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Actively looking for a roommate</h3>
            <p>{activityStatus.toString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
