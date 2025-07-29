import { NextRequest } from "next/server";
import ollama from "ollama";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const Country = z.object({
    name: z.string(),
    capital: z.string(),
    languages: z.array(z.string()),
});

export async function GET(req: NextRequest) {
    let text = await ollama.generate({
        model: "gemma3:12b",
        prompt: "What color is the sky at different times of the day? Respond using JSON",
        format: "json",
    });

    let data = JSON.parse(text.response);

    return Response.json({
        data,
    });
}

//
