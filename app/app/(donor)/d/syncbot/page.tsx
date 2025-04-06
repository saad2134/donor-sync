"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Loader2 } from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

import { useUser } from "@/context/UserContext";

export default function UrgentDonationsPage() {
  const { userId, role, device } = useUser();

  if (!device) {
    return (
      <ContentLayout title="Chat with Syncbot">
        <div className="flex h-full items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      </ContentLayout>
    );
  }

  const [messages, setMessages] = useState([
    { sender: "bot", text: "Greetings! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("/api/chatbot", { message: input });
      setMessages([...newMessages, { sender: "bot", text: response.data.reply }]);
    } catch (error) {
      setMessages([...newMessages, { sender: "bot", text: "Error fetching response." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <ContentLayout title="Chat with Syncbot">
      <div className="flex flex-col h-full p-4 bg-background text-foreground rounded-md">
        <ScrollArea className="flex-1 border rounded-md p-4 overflow-auto bg-muted dark:bg-muted/50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 my-2 rounded-lg text-sm shadow-md ${msg.sender === "user"
                  ? "ml-auto bg-accent text-white mr-2 text-left" // user messages aligned to left with gap on right
                  : "mr-auto bg-gray-100 dark:bg-muted text-gray-800 dark:text-gray-200 ml-2 text-left" // bot messages aligned to right with gap on left
                } ${device === "desktop" ? "max-w-[30%]" : "max-w-[80%]"}`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          ))}
          {loading && (
            <div className="p-3 my-3 rounded-lg bg-gray-100 dark:bg-muted text-gray-800 dark:text-gray-200 max-w-xs">
              <Loader2 className="animate-spin inline-block mr-2" /> Thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>
        <CardContent className="mt-4 flex gap-2 pt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-background text-foreground"
          />
          <Button onClick={sendMessage} disabled={loading} className="shrink-0 bg-accent">
            {loading ? <Loader2 className="animate-spin" /> : "Send"}
          </Button>
        </CardContent>
      </div>
    </ContentLayout>
  );
}
