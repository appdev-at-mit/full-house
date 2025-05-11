"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Search, Home } from "lucide-react";
import { useRouter } from "next/navigation";

const mockConversations = [
  {
    id: 1,
    name: "Alex Tang",
    lastMessage: "See you!",
    time: "10:00 AM",
    pfp: "/pfp.png",
  },
  {
    id: 2,
    name: "Eric Zhan",
    lastMessage: "I'll be staying in Boston over summer!",
    time: "9:30 AM",
    pfp: "/pfp.png",
  },
];

const mockMessages = [
  {
    id: 1,
    sender: "Alex",
    text: "Hi! I saw your post about looking for a roommate this summer. Is the room still available?",
    time: "9:15 AM",
  },
  {
    id: 2,
    sender: "You",
    text: "Hi Alex! Yes, the room is still available. Are you looking to move in for the entire summer?",
    time: "9:17 AM",
  },
  {
    id: 3,
    sender: "Alex",
    text: "Yes, I’d need it from June to August. Is that timeframe okay for you?",
    time: "9:18 AM",
  },
  {
    id: 4,
    sender: "You",
    text: "That works perfectly! The rent is $800/month, including utilities. Does that fit your budget?",
    time: "9:20 AM",
  },
  {
    id: 5,
    sender: "Alex",
    text: "Yeah, that’s within my budget. Could you tell me more about the apartment and the neighborhood?",
    time: "9:22 AM",
  },
  {
    id: 6,
    sender: "You",
    text: "Sure! It’s a two-bedroom place with a shared living room and kitchen. It’s a quiet area, close to a park, and there are a few grocery stores within walking distance.",
    time: "9:25 AM",
  },
  {
    id: 7,
    sender: "Alex",
    text: "That sounds great! How about cleanliness and noise? I prefer a pretty tidy and quiet space.",
    time: "9:27 AM",
  },
  {
    id: 8,
    sender: "You",
    text: "I’m the same way! I like to keep things clean and avoid loud parties. I think we’d be a good fit.",
    time: "9:29 AM",
  },
  {
    id: 9,
    sender: "Alex",
    text: "That’s awesome. I also have a small dog. Would that be okay with you?",
    time: "9:30 AM",
  },
  {
    id: 10,
    sender: "You",
    text: "I love dogs, so that’s totally fine! Does your dog get along well with people?",
    time: "9:32 AM",
  },
  {
    id: 11,
    sender: "Alex",
    text: "He’s very friendly, I promise! Would it be possible to visit the place sometime this week to check it out?",
    time: "9:33 AM",
  },
  {
    id: 12,
    sender: "You",
    text: "Of course! I’m available Thursday or Friday evening. What works better for you?",
    time: "9:35 AM",
  },
  {
    id: 13,
    sender: "Alex",
    text: "Friday evening works for me. Thank you so much! I’m excited to meet and see the place.",
    time: "9:37 AM",
  },
  {
    id: 14,
    sender: "You",
    text: "Great, I’ll see you Friday at 6 PM! Let me know if you have any other questions before then.",
    time: "9:38 AM",
  },
  {
    id: 15,
    sender: "Alex",
    text: "See you!",
    time: "10:00 AM",
  },
];


export default function MessagingPage() {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (selectedConversation) {
      // Here you would typically fetch messages for the selected conversation
      // setMessages(fetchedMessages);
    }
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const message = {
      id: messages.length + 1,
      sender: "You",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-border p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Messages</h2>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            <Home className="mr-2 h-4 w-4" /> Dashboard
          </Button>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`flex items-center p-2 cursor-pointer rounded-lg hover:bg-muted ${
                selectedConversation?.id === conversation.id ? "bg-muted" : ""
              }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <Image
                src={conversation.pfp}
                alt={`${conversation.name}'s pfp`}
                width={40}
                height={40}
                className="rounded-full mr-2"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{conversation.name}</h3>
                <p className="text-sm text-muted-foreground">{conversation.lastMessage}</p>
              </div>
              <span className="text-xs text-gray-400">{conversation.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Message View */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <h2 className="text-xl font-bold mb-4 p-4">{selectedConversation.name}</h2>
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`p-3 rounded-2xl mb-4 ${
                      message.sender === "You" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                    }`}
                  >
                    <p>{message.text}</p>
                    <span className="text-xs text-gray-400">{message.time}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Send Message Bar */}
            <div className="flex p-4">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 mr-2"
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </>
        ) : (
          <p className="mt-8 text-center text-gray-500">Select a conversation to start messaging.</p>
        )}
      </div>
    </div>
  );
}
