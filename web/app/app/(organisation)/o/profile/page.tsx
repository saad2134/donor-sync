// --@ts-nocheck
"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building, MapPin, Phone, Mail, Globe, ShieldAlert, Award, Globe2, Trash2 } from "lucide-react";
import { getUserDataById, updateUserData, deleteUserById } from "@/firebaseFunctions";
import OrganisationPF from "@/components/profile-forms/organisationPF";
import { useUser } from "@/context/UserContext";

export default function OrganisationProfilePage() {
  const { toast } = useToast();
  const { userId, setUser } = useUser();
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [pIsLoading, setPIsLoading] = useState(true);
  const [openPE, setOpenPE] = useState(false);
  const [openPD, setOpenPD] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      setPIsLoading(true);
      try {
        const data = (await getUserDataById(userId, "organisation")) as any;
        setProfile(data);
        if (data) {
          setIsPublic(data.isPublicProfile === "yes");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setPIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleToggle = async () => {
    setPIsLoading(true);
    try {
      const newVisibility = isPublic ? "no" : "yes";
      const response = await updateUserData("organisations", userId, {
        isPublicProfile: newVisibility,
      });

      if (response.success) {
        setIsPublic(prev => !prev);
        toast({
          title: newVisibility === "yes" ? "🌐 Profile Public" : "🔒 Profile Private",
          description: newVisibility === "yes" ? "Your profile is now public." : "Your profile is now private.",
        });
      } else {
        toast({
          title: "❌ Failed",
          description: "Could not update visibility.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!userId) return;
    const response = (await deleteUserById(userId, "organisation")) as any;
    if (response.success) {
      toast({
        title: "🗑️ Account Deleted",
        description: "Your NGO profile has been permanently removed.",
      });
      setUser(null, "guest", "guest");
      router.push("/");
    } else {
      toast({
        title: "❌ Deletion Failed",
        description: response.message,
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    const words = name.trim().split(" ").filter(Boolean);
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  if (pIsLoading && !profile) {
    return <div className="text-center py-20 text-muted-foreground">Loading profile...</div>;
  }

  return (
    <ContentLayout title="Organisation Profile">
      <div className="space-y-6 px-2 pb-10">
        <Card className="shadow-lg border border-border/50 bg-card/40 backdrop-blur-md rounded-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-500 to-rose-500" />
          <CardHeader className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-border/30">
            <Avatar className="h-20 w-20 border-2 border-red-500/20 shrink-0">
              <AvatarImage src={profile?.o_logo_url} alt={profile?.o_name} />
              <AvatarFallback className="bg-red-500/10 text-red-500 text-2xl font-bold">
                {getInitials(profile?.o_name || "NGO")}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-extrabold text-foreground truncate">{profile?.o_name}</h1>
                <Badge className="bg-green-500 hover:bg-green-600 text-xs flex items-center gap-0.5">
                  <Award className="h-3 w-3" /> NGO Verified
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Reg No: {profile?.o_regNum || "Pending"}</p>
            </div>
            
            <Button className="bg-accent text-white font-bold" onClick={() => setOpenPE(true)}>
              Edit Details
            </Button>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Visibility Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-muted/20 border border-border/40 rounded-xl gap-4">
              <div className="space-y-0.5">
                <p className="text-sm font-bold flex items-center gap-1.5">
                  <Globe2 className="h-4 w-4 text-accent shrink-0" /> Public Profile Visibility
                </p>
                <p className="text-xs text-muted-foreground">
                  Allow hospitals and donors to search and view your organisation public page.
                </p>
              </div>
              <Switch checked={isPublic} onCheckedChange={handleToggle} />
            </div>

            {/* General Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-4">
                <h3 className="text-base font-bold text-foreground border-b border-border/30 pb-2">Organisation Info</h3>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Building className="h-4 w-4 text-red-500 shrink-0" />
                  <span>Type: <strong className="text-foreground capitalize">{profile?.o_type || "Trust"}</strong></span>
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                  <span>City: <strong className="text-foreground">{profile?.o_city || "N/A"}</strong></span>
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                  <span>Address: <strong className="text-foreground">{profile?.o_city}, {profile?.o_region?.[1] || profile?.o_region?.[0]} - {profile?.o_pincode}</strong></span>
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold text-foreground border-b border-border/30 pb-2">Contact &amp; Admin</h3>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 text-red-500 shrink-0" />
                  <span>Phone: <strong className="text-foreground">{profile?.o_phone || "N/A"}</strong></span>
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 text-red-500 shrink-0" />
                  <span>Email: <strong className="text-foreground">{profile?.email || "N/A"}</strong></span>
                </p>
                {profile?.o_website && (
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="h-4 w-4 text-red-500 shrink-0" />
                    <span>Website: <a href={profile.o_website} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{profile.o_website}</a></span>
                  </p>
                )}
                <p className="flex items-center gap-2 text-muted-foreground">
                  <span>Representative: <strong className="text-foreground">{profile?.o_admin_name || "N/A"}</strong></span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="shadow-lg border border-red-500/20 bg-red-500/5 rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2 text-lg">
              <ShieldAlert className="h-5 w-5 shrink-0" /> Account Danger Zone
            </CardTitle>
            <CardDescription>
              Deleting your organisation profile will permanently erase all scheduled camps, central inventory levels, and fundraising history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setOpenPD(true)}
              variant="destructive"
              className="font-bold flex items-center gap-1.5"
            >
              <Trash2 className="h-4 w-4 shrink-0" /> Delete NGO Profile
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={openPE} onOpenChange={setOpenPE}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-3xl">
          <DialogHeader className="flex flex-row items-center justify-between px-10">
            <div className="w-[70%] text-left">
              <DialogTitle className="font-bold text-xl">Edit NGO Details</DialogTitle>
            </div>
            <div className="w-[30%] flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setOpenPE(false)}>
                Close
              </Button>
            </div>
          </DialogHeader>

          <OrganisationPF />

          <DialogFooter />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openPD} onOpenChange={setOpenPD}>
        <DialogContent className="max-w-md text-left">
          <DialogHeader>
            <DialogTitle className="text-red-600 text-lg flex items-center gap-1.5">
              <ShieldAlert className="h-5 w-5 shrink-0 animate-bounce" /> Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-3 text-sm text-muted-foreground">
            <p>This action is irreversible. All of your drives, records, and credentials will be removed from Donor Sync database.</p>
            <p>Please confirm you want to proceed with the deletion.</p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full" onClick={() => setOpenPD(false)}>
              Cancel
            </Button>
            <Button variant="destructive" className="w-full font-bold" onClick={handleDeleteAccount}>
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}
