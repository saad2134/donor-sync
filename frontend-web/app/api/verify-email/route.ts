import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { user_json_url } = await req.json();

        if (!user_json_url) {
            return NextResponse.json({ error: "Missing user_json_url." }, { status: 400 });
        }

        // Validate the user_json_url to prevent SSRF
        let validatedUrl: URL;
        try {
            validatedUrl = new URL(user_json_url);
        } catch {
            return NextResponse.json({ error: "Invalid user_json_url format." }, { status: 400 });
        }

        // Enforce HTTPS and restrict to known verification host(s)
        const allowedHosts = [
            "api.phone-email-verification.com",
            // Add additional allowed hosts here if needed
        ];

        if (validatedUrl.protocol !== "https:" || !allowedHosts.includes(validatedUrl.hostname)) {
            console.error("Blocked request to disallowed URL (host/protocol):", validatedUrl.toString());
            return NextResponse.json({ error: "user_json_url is not allowed." }, { status: 400 });
        }

        // Further restrict the path to reduce SSRF risk (no traversal, only known prefixes)
        const disallowedPathPatterns = ["..", "%2e%2e", "%2E%2E"];
        const pathname = validatedUrl.pathname || "/";
        const lowerPathname = pathname.toLowerCase();

        if (disallowedPathPatterns.some((pattern) => lowerPathname.includes(pattern))) {
            console.error("Blocked request due to disallowed path traversal sequence:", pathname);
            return NextResponse.json({ error: "user_json_url path is not allowed." }, { status: 400 });
        }

        // Optionally, limit requests to specific path prefixes on the allowed host
        const allowedPathPrefixes = ["/", "/verify", "/api"];
        if (!allowedPathPrefixes.some((prefix) => pathname.startsWith(prefix))) {
            console.error("Blocked request to disallowed path:", pathname);
            return NextResponse.json({ error: "user_json_url path is not allowed." }, { status: 400 });
        }

        // Rebuild a safe URL using the validated origin and sanitized path/search
        const safeUrl = new URL(pathname + validatedUrl.search, validatedUrl.origin);

        // ❌ Do NOT use `NEXT_PUBLIC_` for private API keys (public keys)
        const API_KEY = process.env.PHONE_EMAIL_API_KEY;
        const CLIENT_ID = process.env.PHONE_EMAIL_CLIENT_ID;

        if (!API_KEY) {
            console.error("API Key is missing in environment variables.");
            return NextResponse.json({ error: "Server misconfiguration. Contact support." }, { status: 500 });
        }

        // Fetch user details from the verification API
        const response = await fetch(safeUrl.toString(), {
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