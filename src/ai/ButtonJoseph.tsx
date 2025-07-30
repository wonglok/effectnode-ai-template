"use client";
import { LMStudioClient } from "@lmstudio/sdk";
import { z } from "zod";
const client = new LMStudioClient();

export function ButtonJoseph() {
    return (
        <button
            className="m-3 p-3 bg-gray-200 cursor-pointer hover:bg-gray-300"
            onClick={async () => {
                //

                // A zod schema for a book
                const bookListSchema = z.array(
                    z.object({
                        quote: z
                            .string()
                            .describe("bible verse number and book"),

                        scripture: z.string().describe("bible scripture"),
                    })
                );

                //
                //

                const model = await client.llm.model(
                    "christian-bible-expert-v2.0-12b"
                );

                let generateJSON = async ({
                    query = "tell me about ...",
                    inc = 0,
                }) => {
                    try {
                        console.log("loading...");

                        const prediction = model.respond(query, {
                            structured: {
                                type: "json",
                                jsonSchema: z.toJSONSchema(bookListSchema),
                            },
                            maxTokens: 5000, // Recommended to avoid getting stuck
                        });

                        let chunk = "";
                        for await (const { content } of prediction) {
                            chunk += content;
                            console.log(chunk);
                        }

                        const result = await prediction.result();
                        let list = bookListSchema.parse(
                            JSON.parse(result.nonReasoningContent)
                        );

                        if (inc >= 20) {
                            return null;
                        }

                        if (list.length === 0) {
                            inc++;
                            console.log("retry-not-found", inc);
                            return await generateJSON({ query, inc });
                        }

                        return list;
                    } catch (e) {
                        console.error(e);
                        if (inc >= 5) {
                            throw e;
                        }
                        inc++;
                        console.log("retry", inc);
                        return await generateJSON({ query, inc });
                    }
                };

                //

                let data = await generateJSON({
                    query: `quote me 20 new testament bible scriptures of Joseph in old testament`,
                });

                console.log(data);
            }}
        >
            Bible
        </button>
    );
}
