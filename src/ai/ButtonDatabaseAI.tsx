"use client";
import { LMStudioClient } from "@lmstudio/sdk";
import { describe } from "node:test";
import { attribute } from "three/tsl";
import { z } from "zod";
const client = new LMStudioClient();

export function ButtonDatabaseAI() {
    return (
        <button
            className="m-3 p-3 px-8 bg-gray-200 cursor-pointer hover:bg-gray-300"
            onClick={async () => {
                //

                // A zod schema for a book

                const database = z.object({
                    //
                    databaseTitle: z.string().describe("title"),

                    description: z.string().describe("description"),

                    tables: z.array(
                        z.object({
                            //
                            tableName: z
                                .string()
                                .describe("name of the table in database"),

                            //
                            description: z
                                //
                                .string()
                                .describe("table description"),

                            //
                            dataAttributes: z.array(
                                z.discriminatedUnion("dataType", [
                                    z
                                        .object({
                                            dataType: z.literal("number"),
                                            name: z
                                                .string()
                                                .describe(
                                                    "name of the data attribute"
                                                ),
                                            description: z
                                                .string()
                                                .describe(
                                                    "short and concise description of the attribute"
                                                ),
                                        })
                                        .describe("number data type"),
                                    z
                                        .object({
                                            dataType: z.literal("string"),
                                            name: z
                                                .string()
                                                .describe(
                                                    "name of the data attribute"
                                                ),
                                            description: z
                                                .string()
                                                .describe(
                                                    "short and concise description of the attribute"
                                                ),
                                            referenceTable: z
                                                .string()
                                                .describe(
                                                    "foreign key table, remove {} symbols"
                                                )
                                                .optional(),
                                        })
                                        .describe("string data type"),
                                ])
                            ),
                        })
                    ),
                });

                const appSpecificationSchema = z
                    .object({
                        //
                        database: database,
                        //
                    })
                    .describe("overall application specification");
                //
                const model = await client.llm.model(
                    "mistralai/devstral-small-2507"
                );
                // const model = await client.llm.model("qwen/qwen3-8b");

                let generateSchemaDB = async ({
                    query = "tell me about ...",
                    inc = 0,
                }) => {
                    try {
                        console.log("loading...");

                        const result = await model.respond(query, {
                            structured: {
                                type: "json",
                                jsonSchema: z.toJSONSchema(
                                    appSpecificationSchema
                                ),
                            },
                            maxTokens: 16192, // Recommended to avoid getting stuck
                        });

                        let list = appSpecificationSchema.parse(
                            JSON.parse(result.nonReasoningContent)
                        );

                        if (list.database.tables.length === 0) {
                            inc++;
                            console.log("retry", inc);
                            return await generateSchemaDB({ query, inc });
                        }

                        return list;
                    } catch (e) {
                        console.error(e);
                        if (inc >= 5) {
                            throw e;
                        }
                        inc++;
                        console.log("retry", inc);
                        return await generateSchemaDB({ query, inc });
                    }
                };
                let userIntent = `create me a database for the easter egg game in a 3d world with threejs, user can place eggs in place [x,y,z] and user can discover egg and claim it, we can also have analytics of the user actions. we have multiple 3d worlds, poeple can travvel to different places using portals. create a auth database table for users to sign up and login using simple email and password and mark it as verified or not. `;

                let databaseSchemaJSON = await generateSchemaDB({
                    query: userIntent,
                });

                console.log(databaseSchemaJSON);

                //

                console.log(JSON.stringify(databaseSchemaJSON, null, "  "));
            }}
        >
            Database AI
        </button>
    );
}
