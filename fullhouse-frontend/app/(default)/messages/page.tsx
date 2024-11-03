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
    name: "Josie",
    lastMessage: "poop",
    time: "10:00 AM",
    pfp: "/pfp.png",
  },
  {
    id: 2,
    name: "Eric",
    lastMessage: "hi",
    time: "9:30 AM",
    pfp: "/pfp.png",
  },
];

const mockMessages = [
  {
    id: 1,
    sender: "Josie",
    text: "Hey, how are you?",
    time: "10:00 AM",
  },
  {
    id: 2,
    sender: "You",
    text: "I’m doing well, thanks! How about you?",
    time: "10:01 AM",
  },
  {
    id: 3,
    sender: "Josie",
    text: "I'm great! Looking forward to the weekend.",
    time: "10:02 AM",
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
                    className={`p-3 rounded-2xl ${
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
