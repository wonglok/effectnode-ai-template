"use client";
import { LMStudioClient } from "@lmstudio/sdk";
import { z } from "zod";

export function ButtonAI() {
    return (
        <button
            className="m-3 p-3 bg-gray-200 cursor-pointer hover:bg-gray-300"
            onClick={async () => {
                //
                const client = new LMStudioClient();

                // A zod schema for a book
                const bookListSchema = z.array(
                    z.object({
                        //
                        title: z.string().describe("title of the book"),

                        //
                        author: z.string().describe("author of the book"),

                        //
                        shortSummary: z
                            .string()
                            .describe("short summary of the book"),

                        //
                        year: z
                            .string()
                            .describe("year of the book is written"),

                        isBible: z.discriminatedUnion("isBible", [
                            z.object({
                                isBible: z.literal("is-bible"),
                                reason: z
                                    .string()
                                    .describe("this book is in bible"),
                            }),
                            z.object({
                                isBible: z.literal("not-bible"),
                                reason: z
                                    .string()
                                    .describe("Not the bible itself"),
                            }),
                        ]),
                    })
                );

                //
                //

                const model = await client.llm.model(
                    "mistralai/devstral-small-2507"
                );

                let action = async ({
                    query = "tell me about ...",
                    inc = 0,
                }) => {
                    try {
                        console.log("loading...");

                        const result = await model.respond(query, {
                            structured: {
                                type: "json",
                                jsonSchema: z.toJSONSchema(bookListSchema),
                            },
                            maxTokens: 4096, // Recommended to avoid getting stuck
                        });

                        let list = bookListSchema.parse(
                            JSON.parse(result.nonReasoningContent)
                        );

                        if (list.length === 0) {
                            inc++;
                            console.log("retry", inc);
                            return action({ query, inc });
                        }

                        return list;
                    } catch (e) {
                        console.error(e);
                        if (inc >= 5) {
                            throw e;
                        }
                        inc++;
                        console.log("retry", inc);
                        return action({ query, inc });
                    }
                };
                let data = await action({
                    query: `tell me 5 books about Jesus `,
                });

                console.log(data);
            }}
        >
            Run AI
        </button>
    );
}
