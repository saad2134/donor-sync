"use client";
import { useState } from "react"
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useSettings } from "@/context/SettingsContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { LanguagesIcon } from "lucide-react"

export default function SettingsPage() {
  const {
    notificationsEnabled,
    setNotificationsEnabled,
    accessibility,
    updateAccessibility
  } = useSettings();

  const [language, setLanguage] = useState("English")

  const languages = [
    { label: "English", value: "en" },
    /* { label: "Español", value: "es" },
    { label: "Français", value: "fr" },
    { label: "Deutsch", value: "de" },
    { label: "العربية", value: "ar" }, */
  ]


  return (
    <ContentLayout title="App Settings">
      <div className="container   space-y-6">
        {/* Notifications Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🔔 Notifications</CardTitle>
            <CardDescription>
              Configure how you want to receive notifications from the application
            </CardDescription>
          </CardHeader>
          <Separator />
          <br></br>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications" className="flex flex-col gap-1">
                  <span>Push Notifications</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Receive notifications even when you're not using the app
                  </span>
                </Label>
                <Switch
                  id="push-notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Localization Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🌐 Localization</CardTitle>
            <CardDescription>
              Change the app into your local style.
            </CardDescription>
          </CardHeader>
          <Separator />
          <br></br>
          <CardContent>
            <div className="space-y-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <LanguagesIcon className="w-4 h-4" />
                    {language}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.value}
                      onClick={() => setLanguage(lang.label)}
                      className="cursor-pointer"
                    >
                      {lang.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">♿ Accessibility</CardTitle>
            <CardDescription>
              Customize your experience to make the application more accessible
            </CardDescription>
          </CardHeader>
          <Separator />
          <br></br>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast" className="flex flex-col gap-1">
                  <span>High Contrast</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Increase contrast for better visibility
                  </span>
                </Label>
                <Switch
                  id="high-contrast"
                  checked={accessibility.highContrast}
                  onCheckedChange={(value) => updateAccessibility('highContrast', value)}
                />
              </div>



              <div className="flex items-center justify-between">
                <Label htmlFor="reduced-motion" className="flex flex-col gap-1">
                  <span>Reduced Motion</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Minimize animations throughout the interface
                  </span>
                </Label>
                <Switch
                  id="reduced-motion"
                  checked={accessibility.reducedMotion}
                  onCheckedChange={(value) => updateAccessibility('reducedMotion', value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}