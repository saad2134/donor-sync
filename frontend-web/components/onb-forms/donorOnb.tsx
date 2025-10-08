//Basic Imports
// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";

//User Imports
import { useUser } from "@/context/UserContext";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { updateUserData } from "@/firebaseFunctions"

// Fetch a single donor by userId
export async function getDonorById(userId: string) {
    try {
        const docRef = doc(db, "donors", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Donor Data:", docSnap.data());
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.log("No such donor found!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching Donor:", error);
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
import { parse, differenceInYears } from "date-fns";
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LocationSelector from "@/components/ui/location-input"
import { PhoneInput } from "@/components/ui/phone-input";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarFull } from "@/components/ui/calendar-full";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { UploadClient } from "@uploadcare/upload-client";
const client = new UploadClient({ publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUB_KEY });


const dobSchema = z
    .string()
    .refine((dateString) => {
        const date = parse(dateString, "yyyy-MM-dd", new Date());
        const age = differenceInYears(new Date(), date);
        return age >= 18 && age <= 65;
    }, { message: "Age must be between 18 and 65 years." });

const formSchema = z.object({
    phone: z.string(),
    email: z.string(),
    d_name: z.string().min(1),
    d_logo_url: z.string().optional(),
    d_dob: dobSchema,
    d_gender: z.string(),
    d_bloodgroup: z.string(),
    d_weight_kg: z.preprocess(
        (val) => Number(val),
        z.number().min(50, { message: "Your weight must be atleast 50kg, to be eligible." })
    ),
    emergency_contact_name: z.string(),
    emergency_contact_phone: z.string(),
    d_region: z.tuple([z.string(), z.string().optional()]).optional(),
    d_city: z.string().min(1),
    d_pincode: z.string(),

    d_isLastDonation: z.string(),
    d_dateLastDonation: z.string().optional(),
    d_isMedication: z.string(),
    d_specifyMedication: z.string().max(100).optional(),
    d_isSmoker: z.string(),
    d_isAlcoholic: z.string(),

    d_willingRegular: z.string(),
    d_availableEmergency: z.string(),

    onboarded: z.string(),
    totalDonations: z.number()
});


export default function OnboardingDon() {

    const { userId, role, device, setUser } = useUser();
    const router = useRouter();
    const [donor, setDonor] = useState<any>(null);

    // Fetch Donor data when the component loads
    useEffect(() => {
        if (userId) {
            async function fetchDonorData() {
                const data = await getDonorById(userId);
                setDonor(data); // Set Donor data (null if not found)
            }
            fetchDonorData();
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
            phone: "",
            onboarded: "yes",


            d_isLastDonation: "no",
            d_isMedication: "no",
            d_isSmoker: "no",
            d_isAlcoholic: "no",

            d_willingRegular: "no",
            d_availableEmergency: "no",

            totalDonations: 0
        },
    })

    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    const isOnMedication = form.watch("d_isMedication") === "yes";
    const isLastDonation = form.watch("d_isLastDonation") === "yes";



    useEffect(() => {
        if (donor?.phone) {
            form.reset({ phone: donor.phone, onboarded: "yes", totalDonations: 0 });
        }

    }, [donor?.phone, form]);


    // SUBMIT FORM FUNCTION
    function onSubmit(values: z.infer<typeof formSchema>) {


        try {
            //alert("Submitted!");
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

            updateUserData("donors", userId, sanitizedData)
                .then(response => {
                    if (response.success) {
                        console.log("User updated successfully:", response.message);
                    } else {
                        alert("Error updating user:", response.message);
                        return;
                    }
                });

            // update onboarding in usercontext
            setUser(userId, "donor", "yes");

            



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
                            <h1 className="text-[25px] font-bold">❤️ You've logged in as a donor.</h1>
                            <button
                                type="button"
                                className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                                onClick={handleLogout}
                            >
                                Log Out
                            </button>
                        </div>
                        <h1 className="text-[20px] font-bold text-center">Enter remaining details to finish creating your account!</h1>

                        <h1 className="font-bold border-b-2 border-fg-500 pt-4 pb-2">Personal Details</h1>
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (


                                <FormItem className="flex flex-col items-start">
                                    <FormLabel>🔒 Phone *</FormLabel>
                                    <FormControl className="w-full">
                                        <PhoneInput

                                            value={donor?.phone ?? "Loading..."}
                                            disabled

                                            {...field}

                                        />
                                    </FormControl>
                                    <FormDescription>Login with new phone if you want to change this right now.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Email *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="john@example.com"
                                            type="email"
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>We will send updates here.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="d_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Name *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="John Doe"
                                            type="text"
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>Enter your full legal name as it appears on your documents.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Profile Pic */}
                        <FormField
                            control={form.control}
                            name="d_logo_url"
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
                                        <FormLabel>Profile Picture</FormLabel>
                                        <FormControl>
                                            <div className="relative flex items-center gap-2">
                                                <Input
                                                    id="d_logo"
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
                            name="d_dob"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date of Birth (YYYY-MM-DD) *</FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-start">
                                                    {field.value ? format(new Date(field.value), "yyyy-MM-dd") : "Select"}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent align="start" className="w-auto p-0">
                                                <div className="flex justify-between px-2 py-1">
                                                    <Select onValueChange={(val) => setMonth(Number(val))} defaultValue={month.toString()}>
                                                        <SelectTrigger className="w-24">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Array.from({ length: 12 }, (_, i) => (
                                                                <SelectItem key={i} value={i.toString()}>{format(new Date(2000, i), "MMMM")}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <Select onValueChange={(val) => setYear(Number(val))} defaultValue={year.toString()}>
                                                        <SelectTrigger className="w-24">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Array.from({ length: 100 }, (_, i) => (
                                                                <SelectItem key={i} value={(year - i).toString()}>{year - i}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <CalendarFull
                                                    mode="single"
                                                    selected={field.value ? new Date(field.value) : undefined}
                                                    onSelect={(date) => {
                                                        const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
                                                        field.onChange(formattedDate);
                                                        form.trigger("d_dob");
                                                    }}
                                                    month={new Date(year, month)}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    {/* <FormDescription>Must be between 18 to 65 to be eligible.</FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                        <FormField
                            control={form.control}
                            name="d_gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gender *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="d_bloodgroup"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Blood Group *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="o+">O+ (O Positive)</SelectItem>
                                            <SelectItem value="o-">O- (O Negative)</SelectItem>
                                            <SelectItem value="a+">A+ (A Positive)</SelectItem>
                                            <SelectItem value="a-">A- (A Negative)</SelectItem>
                                            <SelectItem value="b+">B+ (B Positive)</SelectItem>
                                            <SelectItem value="b-">B- (B Negative)</SelectItem>
                                            <SelectItem value="ab+">AB+ (AB Positive)</SelectItem>
                                            <SelectItem value="ab-">AB- (AB Negative)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="d_weight_kg"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Weight (kg) *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="70"
                                            type="text"
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>Enter your bodyweight in kg (Kilograms).</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="emergency_contact_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Emergency Contact Name *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Jane Doe"
                                            type="text"
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>Enter full legal name of the person to be contacted in case of an emergency.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="emergency_contact_phone"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-start">
                                    <FormLabel>Emergency Contact Phone *</FormLabel>
                                    <FormControl className="w-full">
                                        <PhoneInput
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>Enter their phone that can be called in case on an emergency.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Donor Country & State */}
                        <FormField
                            control={form.control}
                            name="d_region"
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

                        {/* Donor City & Pincode */}
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-6">

                                <FormField
                                    control={form.control}
                                    name="d_city"
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
                                    name="d_pincode"
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



                        <h1 className="font-bold border-b-2 border-fg-500 pt-4 pb-2">Medical History</h1>

                        <FormField
                            control={form.control}
                            name="d_isLastDonation"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Have you donated blood recently? *</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center space-x-3">
                                            <Switch
                                                checked={field.value === "yes"}
                                                onCheckedChange={(checked) => field.onChange(checked ? "yes" : "no")}
                                            />
                                            <FormLabel className="font-normal">
                                                {field.value === "yes" ? "Yes" : "No"}
                                            </FormLabel>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {isLastDonation && (
                            <FormField
                                control={form.control}
                                name="d_dateLastDonation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>When was the last time you donated blood? *</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="w-full justify-start">
                                                        {field.value ? format(new Date(field.value), "yyyy-MM-dd") : "Select"}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent align="start" className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value ? new Date(field.value) : undefined}
                                                        onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}


                        < FormField
                            control={form.control}
                            name="d_isMedication"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Are you on any medications? *</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center space-x-3">
                                            <Switch
                                                checked={field.value === "yes"}
                                                onCheckedChange={(checked) => field.onChange(checked ? "yes" : "no")}
                                            />
                                            <FormLabel className="font-normal">
                                                {field.value === "yes" ? "Yes" : "No"}
                                            </FormLabel>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {isOnMedication && (
                            <FormField
                                control={form.control}
                                name="d_specifyMedication"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Specify Medications *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Aspirin, Atenolol, etc"
                                                type="text"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Names of the medications you are currently taking.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="d_isSmoker"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Do you smoke ciagrette, etc regularly? *</FormLabel>
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

                        <FormField
                            control={form.control}
                            name="d_isAlcoholic"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Do you drink alcohol regularly? *</FormLabel>
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

                        <h1 className="font-bold border-b-2 border-fg-500 pt-4 pb-2">Preference Details</h1>

                        <FormField
                            control={form.control}
                            name="d_willingRegular"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Are you on willing to be a regular donor? *</FormLabel>
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

                        <FormField
                            control={form.control}
                            name="d_availableEmergency"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Will you be available in case of emergencies? *</FormLabel>
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
