"use client"
import '../globals.css';
import Image from "next/image";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"




import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



export default function RegisterPage() {
  const { setTheme } = useTheme()

  return (<>

    <div className="absolute top-0 right-0 p-4">
      {/* shad theme changer */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>


    <div className="grid items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">


      {/* shad tabs form : for auth */}
      <Tabs defaultValue="patient" className="w-[400px]">

        <h1 className="text-2xl text-left p-1">Register as:</h1>

        {/* tab list */}
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="patient">Patient</TabsTrigger>
          <TabsTrigger value="donor">Donor</TabsTrigger>
          <TabsTrigger value="hospital">Hospital</TabsTrigger>
          <TabsTrigger value="organisation">Organisation</TabsTrigger>
        </TabsList>

        {/* Patient tab */}
        <TabsContent value="patient">
          <Card>
            <CardHeader>
              <CardTitle>Patient</CardTitle>
              <CardDescription>
                Register as a patient.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="johndoe@email.com" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+1 (234) 4567890" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" placeholder="********" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="cpassword">Confirm Password</Label>
                <Input id="cpassword" placeholder="********" />
              </div>
            </CardContent>

            <CardFooter>
              <Button>Register</Button>
            </CardFooter>

          </Card>
        </TabsContent>

        {/* donor tab */}
        <TabsContent value="donor">
          <Card>
            <CardHeader>
              <CardTitle>Donor</CardTitle>
              <CardDescription>
                Register as a blood donor.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* hospital tab */}
        <TabsContent value="hospital">
          <Card>
            <CardHeader>
              <CardTitle>Hospital</CardTitle>
              <CardDescription>
                Register as a hospital.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Pedro Duarte" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="@peduarte" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* organisation tab */}
        <TabsContent value="organisation">
          <Card>
            <CardHeader>
              <CardTitle>Organisation</CardTitle>
              <CardDescription>
                Register as an organisation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Pedro Duarte" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="@peduarte" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

      </Tabs>
    </div>


  </>
  );
}
