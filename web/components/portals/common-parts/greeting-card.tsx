// @ts-nocheck
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"; // Adjust import based on your project

const defaultName = "";
const defaultRole = "";

export default function GreetingCard({ name = defaultName, role = defaultRole }) {

  const [greeting, setGreeting] = useState("");
  const [bgClass, setBgClass] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour < 12) {
      setGreeting("☀️ Good Morning");
      setBgClass("bg-gradient-to-r from-yellow-400 to-orange-400");
    } else if (hour < 18) {
      setGreeting("🌤️ Good Afternoon");
      setBgClass("bg-gradient-to-r from-blue-400 to-blue-600");
    } else {
      setGreeting("🌙 Good Evening");
      setBgClass("bg-gradient-to-r from-purple-600 to-indigo-800");
    }
  }, []);

  // Role-based message
  const roleMessages = {
    donor: "Find where you can save lives today.",
    patient: "Healing takes time, and we are here to support you every step of the way!",
    hospital: "Manage blood supply and help those in need.",
    organisation: "Coordinate donations and save more lives.",
  };

  return (
    <div className="pb-10">
      <Card className={`text-foreground ${bgClass} transition-all duration-500 shadow-lg`}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {greeting}, {name}
          </CardTitle>
          <CardDescription className="text-lg text-foreground">
            {roleMessages[role] || "Welcome to the Blood Bank Platform."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="italic text-foreground">Let's make a difference today</p>
        </CardContent>
      </Card>
    </div>
  );
}
