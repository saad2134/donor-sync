"use client";

import React from 'react';
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useParams } from "next/navigation";
import Image from "next/image";

import { ScrollArea } from "@/components/ui/scroll-area";
import BusinessNavbar from '@/components/landing-page/BusinessNavbar';
import Footer from '@/components/landing-page/footer';

export default function ProfilePage() {
    const params = useParams();
    const userId = params.userId as string;

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div>
            <ScrollArea className="h-screen">
                <BusinessNavbar />

                {/* <div className="pt-20 pb-4 px-10">
                    <h1>Profile Page for User: {userId}</h1>
                </div> */}

                <div className="flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center space-y-6">
                    <Image
                        src="/not-found.webp"
                        alt="Profile Not Found"
                        width={400}
                        height={400}
                        className="rounded-xl"
                        priority
                    />
                    <h2 className="text-3xl font-bold">Profile Not Found</h2>
                    <p className="text-gray-500 text-lg">
                        This user’s profile either does not exist or is private.
                    </p>
                    <p className="text-gray-500 text-lg">
                        Actually it's coming soon!
                    </p>
                </div>

                <Footer />
            </ScrollArea>
        </div>,
        document.body
    );
}
