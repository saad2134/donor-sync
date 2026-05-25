import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { fuzzy } from "fast-fuzzy";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Load Excel data from the public folder, convert it to JSON,
 * and return an object mapping lowercased questions to answers.
 *
 * The key change: we build the XLSX URL based on the request URL.
 */
async function loadSheetData(): Promise<{ [key: string]: string }> {
  try {
    const SHEET_ID = "1oqQDe7LU4FVpWzUEC9txHFAl7Dz6b-IkH3xwEEd8Jl4"; // Your Google Sheet ID
    const GID = "1846653281"; // Your Sheet's GID
    const TSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=tsv&gid=${GID}`;

    const response = await fetch(TSV_URL);
    if (!response.ok) {
      console.error("Error fetching Google Sheets data:", response.statusText);
      return {};
    }

    const text = await response.text();
    const rows = text
      .trim()
      .split("\n")
      .map((row) => row.replace(/\r/g, "").split("\t")); // Remove any hidden carriage returns and split by tab

    if (rows.length < 2) {
      console.error("Error: Sheet data is empty or incorrectly formatted.");
      return {};
    }

    // Ensure headers are correctly detected (handling hidden BOM or extra spaces)
    const headers = rows[0].map((h) => h.trim().toLowerCase());
    const questionIndex = headers.indexOf("question");
    const answerIndex = headers.indexOf("answer");

    if (questionIndex === -1 || answerIndex === -1) {
      console.error("Error: Missing 'Question' or 'Answer' column in the sheet.");
      console.error("Detected headers:", headers);
      return {};
    }

    // Convert to question-answer mapping
    return rows.slice(1).reduce((acc, row) => {
      const question = row[questionIndex]?.trim();
      const answer = row[answerIndex]?.trim();
      if (question && answer) {
        acc[question.toLowerCase()] = answer;
      }
      return acc;
    }, {} as { [key: string]: string });

  } catch (error) {
    console.error("Error loading Google Sheets data:", error);
    return {};
  }
}


/**
 * Get the chatbot's response.
 * If a fuzzy match of 75% or more is found in the FAQ data, return that answer.
 * Otherwise, call the Gemini API.
 */
async function chatbotResponse(userInput: string, req: NextRequest): Promise<string> {
  userInput = userInput.toLowerCase().trim();
  const faqData = await loadSheetData();
  const questions = Object.keys(faqData);

  // Use fuzzy matching to find the best candidate
  let bestScore = 0;
  let bestMatch = "";
  for (const question of questions) {
    const score = fuzzy(userInput, question);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = question;
    }
  }

  // If the best match is 75% or higher, return the corresponding answer.
  if (bestScore >= 0.75) {
    return faqData[bestMatch];
  }

  // Otherwise, call Gemini API.
  return await getGeminiResponse(userInput);
}

/**
 * Get a response from Gemini by using the official SDK.
 * This calls the model with your user prompt.
 */
async function getGeminiResponse(userInput: string): Promise<string> {
  try {
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([userInput]);
    return result.response.text() || "I'm sorry, I don't understand that.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error communicating with Gemini API.";
  }
}

/**
 * API Route Handler: Accepts a POST request with a JSON body containing { message: string }.
 * Note: We pass the request object into chatbotResponse so it can build the XLSX URL.
 */
export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }
    const reply = await chatbotResponse(message, req);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
