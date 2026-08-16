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

// Fetch a single patient by userId
export async function getPatientById(userId: string) {
    if (!db) {
        console.error("Firebase Firestore not initialized");
        return null;
    }

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

// Form Component Imports
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { parse, differenceInYears } from "date-fns";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LocationSelector from "@/components/ui/location-input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

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
    p_dob: dobSchema,
    p_gender: z.string(),
    p_bloodgroup: z.string(),
    p_weight_kg: z.preprocess(
        (val) => Number(val),
        z.number().min(15, { message: "Your weight must be atleast 15kg." })
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
});

export default function PatientProfileForm() {
    const { userId } = useUser();
    const [patient, setPatient] = useState<any>(null);
    const [pIsLoading, setPIsLoading] = useState(true);

    const [countryName, setCountryName] = useState<string>("");
    const [stateName, setStateName] = useState<string>("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            phone: "",
            email: "",
            p_name: "",
            p_dob: "",
            p_gender: "",
            p_bloodgroup: "",
            p_weight_kg: 0,
            emergency_contact_name: "",
            emergency_contact_phone: "",
            p_region: ["", ""],
            p_city: "",
            p_pincode: "",
            p_reasonRequirment: "",
            p_urgencyRequirment: "regular",
            p_quantityRequirment: "1",
            p_doctorName: "",
            p_hospitalName: "",
            p_isMedicalCondition: "no",
            p_specifyMedicalCondition: "",
            p_isAllergy: "no",
            p_specifyAllergy: "",
            p_isLastTransfusion: "no",
            p_dateLastTransfusion: "",
            p_willingFutureDonor: "no",
        },
    });

    useEffect(() => {
        if (userId) {
            async function fetchPatientData() {
                const data = (await getPatientById(userId)) as any;
                setPatient(data);
                if (data) {
                    form.reset({
                        phone: data.phone || "",
                        email: data.email || "",
                        p_name: data.p_name || "",
                        p_dob: data.p_dob || "",
                        p_gender: data.p_gender || "",
                        p_bloodgroup: data.p_bloodgroup || "",
                        p_weight_kg: data.p_weight_kg || 0,
                        emergency_contact_name: data.emergency_contact_name || "",
                        emergency_contact_phone: data.emergency_contact_phone || "",
                        p_region: data.p_region || ["", ""],
                        p_city: data.p_city || "",
                        p_pincode: data.p_pincode || "",
                        p_reasonRequirment: data.p_reasonRequirment || "",
                        p_urgencyRequirment: data.p_urgencyRequirment || "regular",
                        p_quantityRequirment: data.p_quantityRequirment || "1",
                        p_doctorName: data.p_doctorName || "",
                        p_hospitalName: data.p_hospitalName || "",
                        p_isMedicalCondition: data.p_isMedicalCondition || "no",
                        p_specifyMedicalCondition: data.p_specifyMedicalCondition || "",
                        p_isAllergy: data.p_isAllergy || "no",
                        p_specifyAllergy: data.p_specifyAllergy || "",
                        p_isLastTransfusion: data.p_isLastTransfusion || "no",
                        p_dateLastTransfusion: data.p_dateLastTransfusion || "",
                        p_willingFutureDonor: data.p_willingFutureDonor || "no",
                    });
                }
                setPIsLoading(false);
            }
            fetchPatientData();
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

            const response = await updateUserData("patients", userId, sanitizedData);

            if (response.success) {
                console.log("Patient profile updated successfully:", response.message);
                window.location.reload();
            } else {
                console.error("Error updating patient profile:", response.message);
                alert("Failed to update. Please try again.");
            }
        } catch (error) {
            console.error("Form submission error", error);
            alert("Failed to submit the form. Please try again.");
        } finally {
            setPIsLoading(false);
        }
    }

    const isMedicalCondition = form.watch("p_isMedicalCondition") === "yes";
    const isAllergy = form.watch("p_isAllergy") === "yes";
    const isLastTransfusion = form.watch("p_isLastTransfusion") === "yes";

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
                    <h1 className="font-bold border-b-2 border-fg-500 pb-2">Personal Details</h1>

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-start">
                                <FormLabel>🔒 Phone *</FormLabel>
                                <FormControl className="w-full">
                                    <PhoneInput value={field.value} disabled {...field} />
                                </FormControl>
                                <FormDescription>Phone number cannot be changed.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                    <Input placeholder="john@example.com" type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="p_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name *</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-6">
                            <FormField
                                control={form.control}
                                name="p_dob"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date of Birth *</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="col-span-6">
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
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-6">
                            <FormField
                                control={form.control}
                                name="p_bloodgroup"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Blood Group *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((bg) => (
                                                    <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="col-span-6">
                            <FormField
                                control={form.control}
                                name="p_weight_kg"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Weight (kg) *</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <h1 className="font-bold border-b-2 border-fg-500 pt-4 pb-2">Emergency Contacts</h1>

                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-6">
                            <FormField
                                control={form.control}
                                name="emergency_contact_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Emergency Contact Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Jane Doe" type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="col-span-6">
                            <FormField
                                control={form.control}
                                name="emergency_contact_phone"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-start">
                                        <FormLabel>Emergency Contact Phone *</FormLabel>
                                        <FormControl className="w-full">
                                            <PhoneInput {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <h1 className="font-bold border-b-2 border-fg-500 pt-4 pb-2">Location details</h1>

                    <FormField
                        control={form.control}
                        name="p_region"
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
                                name="p_city"
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
                                name="p_pincode"
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

                    <h1 className="font-bold border-b-2 border-fg-500 pt-4 pb-2">Medical Questionnaire</h1>

                    <FormField
                        control={form.control}
                        name="p_reasonRequirment"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reason for Requirement *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Accident, Surgery, etc." type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="p_urgencyRequirment"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Urgency *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="regular">Regular</SelectItem>
                                        <SelectItem value="urgent">Urgent</SelectItem>
                                        <SelectItem value="critical">Critical</SelectItem>
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
                                <FormLabel>Quantity Needed (units) *</FormLabel>
                                <FormControl>
                                    <Input placeholder="1" type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-6">
                            <FormField
                                control={form.control}
                                name="p_doctorName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Doctor Name (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Dr. Smith" type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="col-span-6">
                            <FormField
                                control={form.control}
                                name="p_hospitalName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hospital Name (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="City Hospital" type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="p_isMedicalCondition"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Do you have any medical condition? *</FormLabel>
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

                    {isMedicalCondition && (
                        <FormField
                            control={form.control}
                            name="p_specifyMedicalCondition"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Specify Medical Condition *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Diabetes, Hypertension, etc." type="text" {...field} />
                                    </FormControl>
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
                                <FormLabel>Do you have any allergies? *</FormLabel>
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

                    {isAllergy && (
                        <FormField
                            control={form.control}
                            name="p_specifyAllergy"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Specify Allergy *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Peanuts, Penicillin, etc." type="text" {...field} />
                                    </FormControl>
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
                                <FormLabel>Have you had a blood transfusion before? *</FormLabel>
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

                    {isLastTransfusion && (
                        <FormField
                            control={form.control}
                            name="p_dateLastTransfusion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date of Last Transfusion *</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        control={form.control}
                        name="p_willingFutureDonor"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Are you willing to be a future blood donor? *</FormLabel>
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

                    <Button className="w-full bg-accent pt-6 pb-6 submit-button" type="submit">Save Changes</Button>
                </form>
            </Form>
        </div>
    );
}
