import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { user_json_url } = await req.json();

        if (!user_json_url) {
            return NextResponse.json({ error: "Missing user_json_url." }, { status: 400 });
        }

        // ❌ Do NOT use `NEXT_PUBLIC_` for private API keys (public keys)
        const API_KEY = process.env.PHONE_EMAIL_API_KEY;
        const CLIENT_ID = process.env.PHONE_EMAIL_CLIENT_ID;

        if (!API_KEY) {
            console.error("API Key is missing in environment variables.");
            return NextResponse.json({ error: "Server misconfiguration. Contact support." }, { status: 500 });
        }

        // Fetch user details from the verification API
        const response = await fetch(user_json_url, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error(`Failed to fetch user data. Status: ${response.status}`);
            return NextResponse.json({ error: "Failed to fetch user data from provider." }, { status: response.status });
        }

        // ✅ Handle potential empty response
        const text = await response.text();
        if (!text) {
            console.error("Received an empty response from verification API.");
            return NextResponse.json({ error: "Verification service returned no data." }, { status: 502 });
        }

        // ✅ Manually parse JSON to prevent `Unexpected end of JSON input`
        let userData;
        try {
            userData = JSON.parse(text);
        } catch (jsonError) {
            console.error("Failed to parse JSON response:", jsonError);
            return NextResponse.json({ error: "Invalid response from verification service." }, { status: 502 });
        }

        // ✅ Ensure required fields exist
        if (!userData.user_email_id) {
            console.error("Response is missing 'user_email_id':", userData);
            return NextResponse.json({ error: "User email not found in verification response." }, { status: 502 });
        }

        return NextResponse.json({ user_email_id: userData.user_email_id });

    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
    }
}

export const dynamic = "force-dynamic";