"use client";
import { LMStudioClient } from "@lmstudio/sdk";
import { z } from "zod";
import { v0Data } from "./db/v0Data";
import { developerSystemPrompt } from "./prompt/developerSystemPrompt";
const client = new LMStudioClient();

export function ButtonActionsAI() {
    return (
        <button
            className="m-3 p-3 px-8 bg-gray-200 cursor-pointer hover:bg-gray-300"
            onClick={async () => {
                //

                // A zod schema for a book

                const app = z.object({
                    endpoints: z.array(
                        z
                            .object({
                                method: z
                                    .string()
                                    .describe(
                                        "method of the rest API function"
                                    ),
                                route: z
                                    .string()
                                    .describe(
                                        "api route of the rest API function"
                                    ),
                                title: z
                                    .string()
                                    .describe("title of the rest API function"),
                                parameters: z
                                    .array(
                                        z
                                            .discriminatedUnion("type", [
                                                z
                                                    .object({
                                                        type: z.literal(
                                                            "number"
                                                        ),
                                                        name: z
                                                            .string()
                                                            .describe(
                                                                "name of the data type"
                                                            ),
                                                        description: z
                                                            .string()
                                                            .describe(
                                                                "short and concise description of the type"
                                                            ),
                                                    })
                                                    .describe(
                                                        "number data type"
                                                    ),
                                                z
                                                    .object({
                                                        type: z.literal(
                                                            "string"
                                                        ),
                                                        name: z
                                                            .string()
                                                            .describe(
                                                                "name of the data type"
                                                            ),
                                                        description: z
                                                            .string()
                                                            .describe(
                                                                "short and concise description of the type"
                                                            ),
                                                        referenceTable: z
                                                            .string()
                                                            .describe(
                                                                "foreign key table, remove {} symbols"
                                                            )
                                                            .optional(),
                                                    })
                                                    .describe(
                                                        "string data type"
                                                    ),
                                            ])
                                            .describe("data type")
                                    )
                                    .describe(
                                        "parametrs of the rest API function"
                                    ),
                            })
                            .describe("rest API function")
                    ),
                });

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
                                jsonSchema: z.toJSONSchema(app),
                            },
                            maxTokens: 5000, // Recommended to avoid getting stuck
                        });

                        let list = app.parse(
                            JSON.parse(result.nonReasoningContent)
                        );

                        if (list.endpoints.length === 0) {
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

                //

                let userIntent = `create me a database for the easter egg game in a 3d world with threejs, user can place eggs in place [x,y,z] and user can discover egg and claim it, we can also have analytics of the user actions. we have multiple 3d worlds, poeple can travvel to different places using portals`;

                let query = `
${developerSystemPrompt}

user want to do the following: 
                    
${userIntent}

-----

here's the database schema:

${v0Data.database.databaseTitle}
${v0Data.database.description}

Database Tables:
${v0Data.database.tables
    .map((table) => {
        return `
-----Table <${table.tableName}> ------
name: ${table.tableName}
description: ${table.description}
columns: 

${table.dataAttributes
    .map((attr) => {
        return `
    
    name: ${attr.name}
    data type: ${attr.dataType}
    description: ${attr.description}
    
    `;
    })
    .join("\n")}

-----Table <${table.tableName}> ------

`;
    })
    .join("\n")}

----- 

please generate all the backend REST API endpoint functions

                    `;

                // ${JSON.stringify(v0Data.database.tables, null, "  ")}

                console.log(query);
                let resetAPI = await generateSchemaDB({
                    query: query,
                });

                console.log(resetAPI);

                console.log(JSON.stringify(resetAPI, null, "  "));
            }}
        >
            Actions AI
        </button>
    );
}
