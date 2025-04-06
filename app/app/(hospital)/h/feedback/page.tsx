//--@ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { getUserDataById } from "@/firebaseFunctions";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function FeedbackForm() {
  const { userId, role } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({ role: role || "", loginid: "", title: "", message: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    const lastSubmitted = localStorage.getItem("feedback_last_submitted");
    if (lastSubmitted) {
      const diff = Date.now() - parseInt(lastSubmitted);
      if (diff < 60000) {
        setCooldown(true);
        setTimeout(() => setCooldown(false), 60000 - diff);
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        const data = await getUserDataById(userId, role);
        setProfile(data);
      };
      fetchData();
    }
  }, [userId, role]);

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        role,
        loginid: role === "donor" ? profile?.phone || "" : profile?.email || "",
      }));
    }
  }, [profile, role]);

  const handleChange = (e) => {
    if (e.target.name === "role" || e.target.name === "loginid") return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("Feedback submitted successfully!");
        localStorage.setItem("feedback_last_submitted", Date.now().toString());
        setCooldown(true);
        setTimeout(() => setCooldown(false), 60000);
        setFormData((prev) => ({ ...prev, title: "", message: "" }));
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Client Error:", error);
      setStatus("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentLayout title="Feedback">
      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Submit Feedback</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              name="title"
              placeholder="Feedback Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" disabled={cooldown || loading} className="w-full bg-accent">
            {cooldown ? "You can submit again in 1 minute." : "Submit"}
          </Button>
        </form>
        {status && <p className="mt-4 text-sm text-center text-muted-foreground">{status}</p>}
      </div>

      {/* Fullscreen Loading Spinner */}
      <Dialog open={loading}>
        <DialogContent className="flex flex-col items-center justify-center bg-transparent shadow-none border-none">
          <div className="flex items-center justify-center w-24 h-24">
            <Loader2 className="h-10 w-10 animate-spin text-accent" />
          </div>
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}
