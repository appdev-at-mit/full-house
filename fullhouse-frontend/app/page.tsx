"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000'; // TODO: change this to deployment url


export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
      } catch (error) {
        console.warn("Token invalid or expired, stay on login page");
        localStorage.removeItem("authKey");
      }
    };

    checkLoggedIn();
  }, [router]);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login_user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "username": username, "password": password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authKey", data.authKey);
  
        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred during login.");
    }
    // router.push("/dashboard");
  };
  
  // Redirects to signup form
  const handleSignupRedirect = () => {
    router.push("/signup"); // Assumes you have a signup page at this route
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center w-1/3">
        <h1 className="text-8xl mb-10">Full<br></br>House</h1>
        {/* <div className="flex justify-center mb-4">
          <Image src="/logo.png" alt="Logo" width={150} height={150} />
        </div> */}
        <p className="text-gray-600 mb-6">
          Find your roommate for the summer / post-graduation
        </p>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <Button className="w-full" variant="default" onClick={handleLogin}>
            Login
          </Button>
          <Button className="w-full" variant="outline" onClick={handleSignupRedirect}>
            New here? Create an account!
          </Button>
        </div>
      </div>
    </div>
  );
}
