
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

// Fetch a single patient by userId
export async function getPatientById(userId: string) {
    try {
        const docRef = doc(db, "patients", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Patient Data:", docSnap.data());
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.log("No such Patient found!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching Patient:", error);
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
        return age >= 5 && age <= 65;
    }, { message: "Age must be between 5 and 65 years." });

const formSchema = z.object({
    phone: z.string(),
    email: z.string(),
    p_name: z.string().min(1),
    // p_logo_url: z.string().optional(),
    p_dob: dobSchema,
    p_gender: z.string(),
    p_bloodgroup: z.string(),
    p_weight_kg: z.preprocess(
        (val) => Number(val),
        z.number().min(15, { message: "Your weight must be atleast 15kg, to be eligible." })
    ),
    emergency_contact_name: z.string(),
    emergency_contact_phone: z.string(),
    p_region: z.tuple([z.string(), z.string().optional()]).optional(),
    p_city: z.string().min(1),
    p_pincode: z.string(),

    p_reasonRequirment: z.string(),
    p_urgencyRequirment: z.string(),
    p_quantityRequirment: z.string(),
    p_doctorName: z.string().max(100).optional(),
    p_hospitalName: z.string().max(100).optional(),

    p_isMedicalCondition: z.string(),
    p_specifyMedicalCondition: z.string().max(100).optional(),

    p_isAllergy: z.string(),
    p_specifyAllergy: z.string().max(100).optional(),

    p_isLastTransfusion: z.string(),
    p_dateLastTransfusion: z.string().optional(),

    p_willingFutureDonor: z.string(),

    onboarded: z.string(),
});


export default function OnboardingPat() {

    const { userId, role, device, setUser } = useUser();
    const router = useRouter();
    const [patient, setPatient] = useState<any>(null);

    // Fetch Patient data when the component loads
    useEffect(() => {
        if (userId) {
            async function fetchPatientData() {
                const data = await getPatientById(userId);
                setPatient(data); // Set Patient data (null if not found)
            }
            fetchPatientData();
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

            p_isMedicalCondition: "no",
            p_isAllergy: "no",
            p_isLastTransfusion: "no",
            p_willingFutureDonor: "no",
        },
    })

    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    const isMedicalCondition = form.watch("p_isMedicalCondition") === "yes";
    const isAllergy = form.watch("p_isAllergy") === "yes";
    const isLastTransfustion = form.watch("p_isLastTransfusion") === "yes";


    useEffect(() => {
        if (patient?.phone) {
            form.reset({ phone: patient.phone, onboarded: "yes" });
        }

    }, [patient?.phone, form]);


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

            updateUserData("patients", userId, sanitizedData)
                .then(response => {
                    if (response.success) {
                        console.log("User updated successfully:", response.message);
                    } else {
                        console.error("Error updating user:", response.message);
                        return;
                    }
                });

            // update onboarding in usercontext
            setUser(userId, "patient", "yes");





        } catch (error) {
            setIsLoading(false);
            console.error("Form submission error", error);
            alert("Failed to submit the form. Please try again.");
        }

    }

    useEffect(() => {
        console.log("Errors:", form.formState.errors);
    }, [form.formState.errors]);




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
                            <h1 className="text-[25px] font-bold">🩸 You've logged in as a patient.</h1>
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

                                            value={patient?.phone ?? "Loading..."}
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
                            name="p_name"
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

                        <FormField
                            control={form.control}
                            name="p_dob"
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
                                                        form.trigger("p_dob");
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
                            name="p_gender"
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
                            name="p_bloodgroup"
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
                            name="p_weight_kg"
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

                        {/* Patient Country & State */}
                        <FormField
                            control={form.control}
                            name="p_region"
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

                        {/* Patient City & Pincode */}
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-6">

                                <FormField
                                    control={form.control}
                                    name="p_city"
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
                                    name="p_pincode"
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



                        <h1 className="font-bold border-b-2 border-fg-500 pt-4 pb-2">Medical Details</h1>

                        <FormField
                            control={form.control}
                            name="p_reasonRequirment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reason for Blood Requirment *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Accident, Injury, Surgery, etc"
                                            type="text"
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>Enter why you need blood.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="p_urgencyRequirment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>How Urgent is the Requirement? *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="immediate">Immediate</SelectItem>
                                            <SelectItem value="within_24_hours">Within 24 Hours</SelectItem>
                                            <SelectItem value="within_3_days">Within 3 Days</SelectItem>
                                            <SelectItem value="no_rush">No Rush</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="p_quantityRequirment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estimated Blood Units Required *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="2"
                                            type="text"
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>Enter how much blood you need in blood units. 1 Blood Unit = 450ml Blood. Enter 0 if you're not sure.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="p_isMedicalCondition"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Any Medical Conditions? *</FormLabel>
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

                        {isMedicalCondition && (
                            <FormField
                                control={form.control}
                                name="p_specifyMedicalCondition"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Specify Medical Conditions *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Diabetes, BP, Heart Disease, Cancer, etc"
                                                type="text"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Names of the your medical conditions.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="p_isAllergy"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Any Allergies? *</FormLabel>
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

                        {isAllergy && (
                            <FormField
                                control={form.control}
                                name="p_specifyAllergy"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Specify Allergies *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Peanuts, Tree Buts, Shellfish, Fish, etc"
                                                type="text"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Names of the allergies you have.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}


                        <FormField
                            control={form.control}
                            name="p_isLastTransfusion"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Recent Blood Transfusions? *</FormLabel>
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

                        {isLastTransfustion && (
                            <FormField
                                control={form.control}
                                name="p_dateLastTransfusion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>When was the last blood transfusion? *</FormLabel>
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




                        <h1 className="font-bold border-b-2 border-fg-500 pt-4 pb-2">Preference Details</h1>

                        <FormField
                            control={form.control}
                            name="p_willingFutureDonor"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Are you on willing to be a future blood donor? *</FormLabel>
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
                        <Button
                            className="w-full bg-accent pt-6 pb-6 submit-button"
                            onClick={() => form.handleSubmit(onSubmit)()}
                        >
                            Submit
                        </Button>

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
