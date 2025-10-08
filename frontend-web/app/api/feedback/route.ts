import { NextRequest, NextResponse } from "next/server";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzxm5TmObKpnsht5_AtI4D-9gBbLUahnbiFGHxXjTM-xIRlNeKihnwbFoCHxyiz9rPI/exec"; // your script URL

export async function POST(req: NextRequest) {
  try {
    const { role, loginid, title, message } = await req.json();

    if (!role || !loginid || !title || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ role, loginid, title, message }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const text = await res.text();
    console.log("Google Script response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      return NextResponse.json({ error: "Invalid response from Google Script" }, { status: 502 });
    }

    if (data.status === "success") {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Failed to write to Google Sheets" }, { status: 500 });
    }
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
