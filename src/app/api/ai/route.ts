import { NextRequest, NextResponse } from "next/server";
import {
    createOpenAICompatible,
    OpenAICompatibleChatLanguageModel,
} from "@ai-sdk/openai-compatible";
import { z } from "zod";
import {
    embed,
    embedMany,
    generateObject,
    generateText,
    jsonSchema,
    LanguageModelV1,
    zodSchema,
} from "ai";
import { createOllama } from "ollama-ai-provider";
import zodToJsonSchema from "zod-to-json-schema";

const lmstudio = createOpenAICompatible({
    name: "lmstudio",
    baseURL: "http://localhost:1234/v1",
});

const ollama = createOllama({});

const embeddingModel = lmstudio.textEmbeddingModel(
    "text-embedding-nomic-embed-text-v1.5"
);

const ollamaLLama = ollama("llama3.1");

const textModel = lmstudio(
    //
    "meta-llama-3.1-8b-instruct"
);

const getEmbeddings = async () => {
    // 'embedding' is a single embedding object (number[])
    const { embedding } = await embed({
        model: embeddingModel,
        value: "sunny day at the beach",
    });

    return embedding;
};
const getManyEmbeddings = async () => {
    //
    // 'embeddings' is an array of embedding objects (number[][]).
    // It is sorted in the same order as the input values.
    const { embeddings } = await embedMany({
        model: lmstudio.textEmbeddingModel(
            "text-embedding-nomic-embed-text-v1.5"
        ),
        values: [
            "sunny day at the beach",
            "rainy afternoon in the city",
            "snowy night in the mountains",
        ],
    });

    return embeddings;
};

export async function GET(req: NextRequest) {
    const model: LanguageModelV1 = new OpenAICompatibleChatLanguageModel(
        `meta-llama-3.1-8b-instruct`,
        {},
        {
            provider: `lmstudio.chat`,
            url: ({ path }) => {
                const url = new URL(`http://localhost:1234/v1${path}`);
                return url.toString();
            },
            headers: () => ({}),

            defaultObjectGenerationMode: "json",
            supportsStructuredOutputs: true,
        }
    );

    let prompt = "generate me a list of people";

    let yourSchema = z.array(
        z.object({
            name: z.string(),
        })
    );

    const res = await generateObject({
        model: model,
        system: prompt,
        maxRetries: 1,
        messages: [{ role: "user", content: "generate me a list of people" }],
        schema: yourSchema, // <-- zod/v4 works!
        mode: "json", // <-- doesn't work without this
    });

    return NextResponse.json(res);

    //
    //
    //
}
