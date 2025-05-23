//Basic Imports
// --@ts-nocheck
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";


//User Imports
import { useUser } from "@/context/UserContext";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { updateUserData } from "@/firebaseFunctions"


// Fetch a single hospital by userId
export async function getOrganisationById(userId: string) {
    try {
        const docRef = doc(db, "organisations", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("organisations Data:", docSnap.data());
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.log("No such organisations found!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching organisations:", error);
        return null;
    }
}


// Theme Changer Imports
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



import HeartLoading from "@/components/custom/HeartLoading"; // <HeartLoading />


// Form Component Imports
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FileUploader } from "@/components/ui/files-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LocationSelector from "@/components/ui/location-input"
import { PhoneInput } from "@/components/ui/phone-input";
import { Switch } from "@/components/ui/switch"
import Image from "next/image";
import { UploadClient } from "@uploadcare/upload-client";
const client = new UploadClient({ publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUB_KEY });





const formSchema = z.object({
    email: z.string(),
    o_name: z.string().min(1),
    o_logo_url: z.string().optional(),
    member_count: z.string().min(1),
    o_type: z.string(),
    o_isCertified: z.string(),
    o_specifyCertification: z.string().optional(),
    o_documents: z
        .array(
            z.object({
                name: z.string(),
                url: z.string().url(),
            })
        )
        .min(0)
        .max(3),
    o_website: z.string().min(1).optional(),
    o_region: z.tuple([z.string(), z.string().optional()]).optional(),
    o_city: z.string().min(1),
    o_pincode: z.string(),
    o_phone: z.string(),
    o_admin_name: z.string().min(1),
    o_admin_phone: z.string(),

    onboarded: z.string(),
});


export default function OnboardingOrg() {

    const { userId, role, device, setUser } = useUser();
    const router = useRouter();
    const [organisation, setOrganisation] = useState<any>(null);

    // Fetch organisation data when the component loads
    useEffect(() => {
        if (userId) {
            async function fetchOrganisationData() {
                const data = await getOrganisationById(userId);
                setOrganisation(data); // Set organisation data (null if not found)
            }
            fetchOrganisationData();
        }
    }, [userId]);


    //Logout Function
    function handleLogout() {
        setUser(null, "guest", "guest");
        router.push("/");
    }

    //Theme
    const { setTheme } = useTheme()

    //loading state
    const [isLoading, setIsLoading] = useState(false);



    const [preview, setPreview] = useState<string | null>(null);

    const [countryName, setCountryName] = useState<string>('')
    const [stateName, setStateName] = useState<string>('')



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            o_documents: [],

            o_isCertified: "no",

            onboarded: "yes",
        },
    })

    const isCertified = form.watch("o_isCertified") === "yes";


    useEffect(() => {
        if (organisation?.email) {
            form.reset({ email: organisation.email, onboarded: "yes" });
        }

    }, [organisation?.email, form]);


    // SUBMIT FORM FUNCTION
    function onSubmit(values: z.infer<typeof formSchema>) {


        try {
            //alert("Submitted!")
            console.log(values);

            // show loading
            setIsLoading(true);

            // Takes values JSON object and update it in database
            const formValues = form.getValues();

            const sanitizedData = {
                ...Object.fromEntries(
                    Object.entries(form.getValues()).filter(([_, value]) => {
                        return (
                            value !== undefined &&
                            typeof value !== "function" &&
                            (typeof value !== "object" || value === null || Array.isArray(value))
                        );
                    })
                )
            };

            updateUserData("organisations", userId, sanitizedData)
                .then(response => {
                    if (response.success) {
                        console.log("User updated successfully:", response.message);
                    } else {
                        console.error("Error updating user:", response.message);
                        return;
                    }
                });

            // update onboarding in usercontext
            setUser(userId, "organisation", "yes");




        } catch (error) {
            setIsLoading(false);
            console.error("Form submission error", error);
            alert("Failed to submit the form. Please try again.");
        }

    }






    return (
        <div className="relative">
            {/* Theme Toggler at top right */}
            <div className="absolute top-0 right-0 p-4">
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


            <div className="pl-10 pr-10 pt-10 pb-20">
                <Form {...form}>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">

                        {/* FORM HEADING */}
                        <div className="flex items-center justify-between space-x-1">
                            <h1 className="text-[25px] font-bold">👥 You've logged in as a Organisation/NGO.</h1>
                            <button
                                type="button"
                                className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                                onClick={handleLogout}
                            >
                                Log Out
                            </button>
                        </div>
                        <h1 className="text-[20px] font-bold text-center">Enter remaining details to finish creating your account!</h1>

                        <h1 className="font-bold border-b-2 border-fg-500 pt-4 pb-2">Organisation Details</h1>

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>🔒 Email *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Loading..."
                                            value={organisation?.email ?? "Loading..."}
                                            disabled
                                            type="email"
                                        />
                                    </FormControl>
                                    <FormDescription>Login with new email if you want to change this right now.</FormDescription>
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
                                        <Input

                                            placeholder="Hope Blood Camps Ltd."

                                            type="text"
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>Enter full legal name of the organisation as it appears on your documents.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* organisation LOGO */}
                        <FormField
                            control={form.control}
                            name="o_logo_url"
                            render={({ field }) => {
                                const [preview, setPreview] = useState<string | null>(field.value ?? null);

                                const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
                                    const fileInput = event.target;
                                    const file = fileInput.files?.[0];

                                    if (!file) return;

                                    // Validate file type
                                    if (!file.type.startsWith("image/")) {
                                        alert("Please upload a valid image file.");
                                        fileInput.value = "";
                                        setPreview(null);
                                        return;
                                    }

                                    // Validate file size (500KB max)
                                    if (file.size > 500 * 1024) {
                                        alert("File size must be 500KB or less.");
                                        fileInput.value = "";
                                        setPreview(null);
                                        return;
                                    }

                                    // Show local preview
                                    const imageUrl = URL.createObjectURL(file);
                                    setPreview(imageUrl);

                                    try {
                                        // Upload to Uploadcare
                                        const uploadedFile = await client.uploadFile(file);
                                        const uploadedUrl = `https://ucarecdn.com/${uploadedFile.uuid}/`;

                                        // Set form value with uploaded URL
                                        field.onChange(uploadedUrl);
                                    } catch (error) {
                                        alert("File upload failed. Please try again.");
                                        fileInput.value = "";
                                        setPreview(null);
                                    }
                                };

                                return (
                                    <FormItem>
                                        <FormLabel>Organisation Logo</FormLabel>
                                        <FormControl>
                                            <div className="relative flex items-center gap-2">
                                                <Input
                                                    id="o_logo"
                                                    type="file"
                                                    accept="image/*"
                                                    className="h-24 py-9 text-lg"
                                                    onChange={handleFileUpload}
                                                />
                                                {preview && (
                                                    <Image
                                                        src={preview}
                                                        alt="Preview"
                                                        width={100}
                                                        height={100}
                                                        className="w-24 h-24 border-2 border-input rounded-md object-fill"
                                                    />
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
                            name="member_count"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Member Count *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="100"

                                            type="text"
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>Enter how many people currently are in your organisation.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* organisation Type */}
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
                                            <SelectItem value="public">Public / Government</SelectItem>
                                            <SelectItem value="private">Private</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>Select the option that matches best.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="o_isCertified"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Is the organisation certified by any autority or agency? *</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center space-x-3">
                                            <Switch checked={field.value === "yes"} onCheckedChange={(checked) => field.onChange(checked ? "yes" : "no")} />
                                            <FormLabel className="font-normal">{field.value === "yes" ? "Yes" : "No"}</FormLabel>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {isCertified && (
                            <FormField
                                control={form.control}
                                name="o_specifyCertification"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name of Certifying Body *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Health Ministy, etc"
                                                type="text"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Name of Govt. Body, Authority, Indepedent Agency, etc
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* organisation Documents */}
                        <FormField
                            control={form.control}
                            name="o_documents"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Upload Organisation Documents (if any)</FormLabel>
                                    <FormControl>
                                        <FileUploader field={field} onFilesChange={(newFiles: any) => field.onChange(newFiles ?? [])} />
                                    </FormControl>
                                    <FormDescription>Accepted documents: Incorporation Certificate, License, Certification, etc.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                        {/* organisation Website */}
                        <FormField
                            control={form.control}
                            name="o_website"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Organisation Website</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="https://hopebloodcamp.com"

                                            type="text"
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>Enter the link to your website.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* organisation Country & State */}
                        <FormField
                            control={form.control}
                            name="o_region"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Select Country *</FormLabel>
                                    <FormControl>
                                        <LocationSelector
                                            onCountryChange={(country) => {
                                                setCountryName(country?.name || '')
                                                form.setValue(field.name, [country?.name || '', stateName || ''])
                                            }}
                                            onStateChange={(state) => {
                                                setStateName(state?.name || '')
                                                form.setValue(field.name, [form.getValues(field.name)[0] || '', state?.name || ''])
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>If your country has states, it will be appear after selecting country.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* organisation City & Pincode */}
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-6">

                                <FormField
                                    control={form.control}
                                    name="o_city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="New York"

                                                    type="text"
                                                    {...field} />
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
                                                <Input
                                                    placeholder="123456"

                                                    type="string"
                                                    {...field} />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                        </div>


                        {/* organisation Phone */}
                        <FormField
                            control={form.control}
                            name="o_phone"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-start">
                                    <FormLabel>Organisation Phone *</FormLabel>
                                    <FormControl className="w-full">
                                        <PhoneInput

                                            {...field}

                                        />
                                    </FormControl>
                                    <FormDescription>Enter a phone number that can be called.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <h1 className="font-bold border-b-2 border-fg-500 pt-4 pb-2">Admin Details (Person managing this.)</h1>

                        <FormField
                            control={form.control}
                            name="o_admin_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Admin Full Name *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="John Doe"

                                            type="text"
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>The name of the person managing this.</FormDescription>
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
                                        <PhoneInput

                                            {...field}

                                        />
                                    </FormControl>
                                    <FormDescription>Phone number of the person managing this, which can be contacted.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <br></br>
                        <Button className="w-full bg-accent pt-6 pb-6 submit-button" type="submit">Submit</Button>

                    </form>

                </Form>
            </div>
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
                    <HeartLoading />
                </div>
            )}
        </div>
    )
}
