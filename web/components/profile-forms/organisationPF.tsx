// Basic Imports
// --@ts-nocheck
"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";

// User Imports
import { useUser } from "@/context/UserContext";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { updateUserData } from "@/firebaseFunctions";

// Fetch a single organisation by userId
export async function getOrganisationById(userId: string) {
    if (!db) {
        console.error("Firebase Firestore not initialized");
        return null;
    }

    try {
        const docRef = doc(db, "organisations", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Organisation Data:", docSnap.data());
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.log("No such organisation found!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching organisation:", error);
        return null;
    }
}

// Form Component Imports
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LocationSelector from "@/components/ui/location-input";
import { PhoneInput } from "@/components/ui/phone-input";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { UploadClient } from "@uploadcare/upload-client";
const client = new UploadClient({ publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUB_KEY });

const formSchema = z.object({
    email: z.string(),
    o_name: z.string().min(1),
    o_logo_url: z.string().optional(),
    o_regNum: z.string().min(1),
    o_type: z.string(),
    o_website: z.string().min(1).optional(),
    o_region: z.tuple([z.string(), z.string().optional()]).optional(),
    o_city: z.string().min(1),
    o_pincode: z.string(),
    o_phone: z.string(),
    o_admin_name: z.string().min(1),
    o_admin_phone: z.string(),
});

export default function OrganisationProfileForm() {
    const { userId } = useUser();
    const [organisation, setOrganisation] = useState<any>(null);
    const [pIsLoading, setPIsLoading] = useState(true);

    const [countryName, setCountryName] = useState<string>("");
    const [stateName, setStateName] = useState<string>("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            o_name: "",
            o_logo_url: "",
            o_regNum: "",
            o_type: "trust",
            o_website: "",
            o_region: ["", ""],
            o_city: "",
            o_pincode: "",
            o_phone: "",
            o_admin_name: "",
            o_admin_phone: "",
        },
    });

    useEffect(() => {
        if (userId) {
            async function fetchOrganisationData() {
                const data = (await getOrganisationById(userId)) as any;
                setOrganisation(data);
                if (data) {
                    form.reset({
                        email: data.email || "",
                        o_name: data.o_name || "",
                        o_logo_url: data.o_logo_url || "",
                        o_regNum: data.o_regNum || "",
                        o_type: data.o_type || "trust",
                        o_website: data.o_website || "",
                        o_region: data.o_region || ["", ""],
                        o_city: data.o_city || "",
                        o_pincode: data.o_pincode || "",
                        o_phone: data.o_phone || "",
                        o_admin_name: data.o_admin_name || "",
                        o_admin_phone: data.o_admin_phone || "",
                    });
                }
                setPIsLoading(false);
            }
            fetchOrganisationData();
        }
    }, [userId, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setPIsLoading(true);
            const sanitizedData = {
                ...Object.fromEntries(
                    Object.entries(values).filter(([_, value]) => {
                        return (
                            value !== undefined &&
                            typeof value !== "function" &&
                            (typeof value !== "object" || value === null || Array.isArray(value))
                        );
                    })
                ),
            };

            const response = await updateUserData("organisations", userId, sanitizedData);

            if (response.success) {
                console.log("Organisation profile updated successfully:", response.message);
                window.location.reload();
            } else {
                console.error("Error updating organisation profile:", response.message);
                alert("Failed to update. Please try again.");
            }
        } catch (error) {
            console.error("Form submission error", error);
            alert("Failed to submit the form. Please try again.");
        } finally {
            setPIsLoading(false);
        }
    }

    if (pIsLoading) {
        return (
            <div className="space-y-6 max-w-3xl mx-auto py-10 px-10">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        );
    }

    return (
        <div className="px-10 py-5">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto">
                    <h1 className="font-bold border-b-2 border-fg-500 pb-2">Organisation Details</h1>

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>🔒 Email *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Loading..." value={field.value} disabled type="email" />
                                </FormControl>
                                <FormDescription>Institutional Email cannot be changed.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="o_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Organisation Name *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Hope Blood Foundation" type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Logo Upload */}
                    <FormField
                        control={form.control}
                        name="o_logo_url"
                        render={({ field }) => {
                            const [preview, setPreview] = useState<string | null>(field.value ?? null);

                            useEffect(() => {
                                if (field.value) {
                                    setPreview(field.value);
                                }
                            }, [field.value]);

                            const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
                                const fileInput = event.target;
                                const file = fileInput.files?.[0];
                                if (!file) return;

                                if (!file.type.startsWith("image/")) {
                                    alert("Please upload a valid image file.");
                                    fileInput.value = "";
                                    setPreview(null);
                                    return;
                                }

                                if (file.size > 500 * 1024) {
                                    alert("File size must be 500KB or less.");
                                    fileInput.value = "";
                                    setPreview(null);
                                    return;
                                }

                                const imageUrl = URL.createObjectURL(file);
                                setPreview(imageUrl);

                                try {
                                    const uploadedFile = await client.uploadFile(file);
                                    const uploadedUrl = `https://ucarecdn.com/${uploadedFile.uuid}/`;
                                    field.onChange(uploadedUrl);
                                } catch (error) {
                                    alert("Logo upload failed. Please try again.");
                                    fileInput.value = "";
                                    setPreview(null);
                                }
                            };

                            return (
                                <FormItem>
                                    <FormLabel>Organisation Logo</FormLabel>
                                    <FormControl>
                                        <div className="relative flex items-center gap-4">
                                            <div className="flex-1">
                                                <Input type="file" accept="image/*" className="h-24 py-9 text-lg" onChange={handleFileUpload} />
                                            </div>
                                            {preview && (
                                                <Image src={preview} alt="Preview" width={100} height={100} className="w-24 h-24 border-2 border-input rounded-md object-fill shrink-0" />
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    <FormField
                        control={form.control}
                        name="o_regNum"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Registration Number *</FormLabel>
                                <FormControl>
                                    <Input placeholder="REG-12345678" type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="o_type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Organisation Type *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="trust">Charitable Trust</SelectItem>
                                        <SelectItem value="society">Registered Society</SelectItem>
                                        <SelectItem value="foundation">Foundation</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="o_website"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Organisation Website</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://hopebloodfoundation.org" type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="o_region"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select Country *</FormLabel>
                                <FormControl>
                                    <LocationSelector
                                        onCountryChange={(country) => {
                                            setCountryName(country?.name || "");
                                            form.setValue(field.name, [country?.name || "", stateName || ""]);
                                        }}
                                        onStateChange={(state) => {
                                            setStateName(state?.name || "");
                                            form.setValue(field.name, [form.getValues(field.name)[0] || "", state?.name || ""]);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-6">
                            <FormField
                                control={form.control}
                                name="o_city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="New York" type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="col-span-6">
                            <FormField
                                control={form.control}
                                name="o_pincode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pin/Zip Code *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="123456" type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="o_phone"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-start">
                                <FormLabel>Contact Phone *</FormLabel>
                                <FormControl className="w-full">
                                    <PhoneInput {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <h1 className="font-bold border-b-2 border-fg-500 pt-4 pb-2">Admin Details</h1>

                    <FormField
                        control={form.control}
                        name="o_admin_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Admin Full Name *</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="o_admin_phone"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-start">
                                <FormLabel>Admin Phone *</FormLabel>
                                <FormControl className="w-full">
                                    <PhoneInput {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button className="w-full bg-accent pt-6 pb-6 submit-button" type="submit">Save Changes</Button>
                </form>
            </Form>
        </div>
    );
}
