import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    // =========================
    // Get Request Data
    // =========================
    const { productName, category } = await req.json();

    // =========================
    // Validation
    // =========================
    if (!productName) {
      return NextResponse.json(
        {
          success: false,
          error: "Product name is required",
        },
        { status: 400 }
      );
    }

    // =========================
    // AI Prompt
    // =========================
    const prompt = `
You are an expert e-commerce copywriter for a premium fashion clothing brand.

Write a professional, engaging, and SEO-friendly product description.

Product Name: ${productName}
Category: ${category}

Requirements:
- Premium fashion tone
- 2 short paragraphs
- Highlight comfort, quality, and style
- SEO friendly
- Attractive for customers
- Plain text only
- No markdown formatting
`;

    // =========================
    // Generate AI Response
    // =========================
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      model: "llama-3.1-8b-instant",

      temperature: 0.7,

      max_tokens: 300,
    });

    // =========================
    // Extract Response Text
    // =========================
    const text =
      completion.choices[0]?.message?.content || "";

    // =========================
    // Success Response
    // =========================
    return NextResponse.json({
      success: true,
      description: text,
    });

  } catch (error) {
    console.error("Groq AI Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate description",
      },
      { status: 500 }
    );
  }
}