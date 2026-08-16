// --@ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { getUserDataById } from "@/firebaseFunctions";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquareHeart, Star, HelpCircle, AlertTriangle, Heart } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function FeedbackForm() {
  const { toast } = useToast();
  const { userId, role } = useUser();
  const [profile, setProfile] = useState<any>(null);
  
  const [formData, setFormData] = useState({ role: role || "", loginid: "", title: "", message: "" });
  const [category, setCategory] = useState("suggestion");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
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
    setLoading(true);

    const fullMessage = `[Category: ${category.toUpperCase()}] [Rating: ${rating}/5 stars]\n\n${formData.message}`;

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: formData.role,
          loginid: formData.loginid,
          title: formData.title,
          message: fullMessage,
        }),
      });

      if (res.ok) {
        toast({
          title: "🎉 Feedback Submitted",
          description: "Thank you for helping us improve Donor Sync!",
        });
        localStorage.setItem("feedback_last_submitted", Date.now().toString());
        setCooldown(true);
        setTimeout(() => setCooldown(false), 60000);
        setFormData((prev) => ({ ...prev, title: "", message: "" }));
        setRating(5);
        setCategory("suggestion");
      } else {
        toast({
          title: "❌ Submission Failed",
          description: "Could not submit feedback. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Client Error:", error);
      toast({
        title: "❌ Submission Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentLayout title="Feedback">
      <div className="p-4 max-w-2xl mx-auto pb-12">
        
        {/* Header Block */}
        <div className="flex flex-col items-center text-center space-y-2 mb-8">
          <div className="bg-red-500/10 p-3.5 rounded-full border border-red-500/20">
            <MessageSquareHeart className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Share Your Feedback</h2>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            Your insights help us shape a better coordination network for blood donation drives.
          </p>
        </div>

        {/* Feedback Card */}
        <Card className="shadow-xl border border-border/50 bg-card/50 backdrop-blur-md rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-500 to-rose-500" />
          
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1.5 pb-4">
              <CardTitle className="text-lg font-bold">Feedback Details</CardTitle>
              <CardDescription>Tell us about your experience using the app</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-5">
              
              {/* Category Selector */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Category</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "suggestion", label: "Idea", icon: HelpCircle },
                    { id: "bug", label: "Bug Report", icon: AlertTriangle },
                    { id: "compliment", label: "Compliment", icon: Heart }
                  ].map((cat) => {
                    const CatIcon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition ${
                          isSelected 
                            ? "bg-red-500/10 border-red-500 text-red-500" 
                            : "border-border/60 hover:bg-muted/40"
                        }`}
                      >
                        <CatIcon className="h-4 w-4" />
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Star Rating Selector */}
              <div className="space-y-2 text-center py-2 bg-muted/20 border border-border/30 rounded-xl">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Rate Your Experience</Label>
                <div className="flex justify-center items-center gap-1.5 mt-1.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = hoverRating !== null ? star <= hoverRating : star <= rating;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="transition-transform active:scale-95"
                      >
                        <Star className={`h-8 w-8 transition ${active ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/45"}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Topic / Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="E.g. Search filters on donor page"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="rounded-xl"
                />
              </div>

              {/* Feedback Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description *</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Describe your feedback or bug report in detail..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="min-h-32 rounded-xl"
                />
              </div>
            </CardContent>

            <CardFooter className="pt-2">
              <Button type="submit" disabled={cooldown || loading} className="w-full bg-accent font-bold">
                {cooldown ? "You can submit again in 1 minute." : "Submit Feedback"}
              </Button>
            </CardFooter>
          </form>
        </Card>
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
