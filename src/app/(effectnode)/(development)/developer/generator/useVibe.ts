import { LMStudioClient } from "@lmstudio/sdk";
import { create } from "zustand";
import { z } from "zod";
import localforage from "localforage";
import { developerSystemPrompt } from "@/ai/prompt/developerSystemPrompt";

export const vibeCache = localforage.createInstance({
    name: "vibe-cache",
});
const client = new LMStudioClient();

let defaultPrompt = `
Create me a database for the easter egg game in a 3d world with threejs.
User can place eggs in place [x,y,z] and user can discover egg and claim it.
We can also have analytics of the user actions. 
We have multiple 3d worlds, poeple can travvel to different places using portals. 
Create a auth database table for users to sign up and login using simple email and password and mark it as verified or not. 
`;

export const useVibe = create<any>((set, get) => {
    return {
        //
        defaultPrompt: defaultPrompt,

        //

        overallDesc: defaultPrompt,
        databaseSchemaJSON: false,
        actionJSON: false,

        hydrate: async () => {
            let fields = [`databaseSchemaJSON`, `overallDesc`, `actionJSON`];

            for (let field of fields) {
                let value = await vibeCache.getItem(field);
                if (value && value !== null && value !== "loading...") {
                    set({
                        [field]: value,
                    });
                }
            }
        },
        tempSchemaJSON: "",
        fromSpecToDatabaseSchema: async () => {
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

                    const prediction = model.respond(query, {
                        structured: {
                            type: "json",
                            jsonSchema: z.toJSONSchema(appSpecificationSchema),
                        },
                        maxTokens: 16192, // Recommended to avoid getting stuck
                    });

                    let chunk = "";
                    for await (let item of prediction) {
                        chunk += item.content;
                        set({ tempSchemaJSON: chunk });
                    }

                    let result = await prediction;
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
            let userIntent = `${get().overallDesc}`;

            let databaseSchemaJSON = await generateSchemaDB({
                query: userIntent,
            });

            console.log(databaseSchemaJSON);

            await vibeCache.setItem("databaseSchemaJSON", databaseSchemaJSON);

            set({
                databaseSchemaJSON: databaseSchemaJSON,
            });

            console.log(JSON.stringify(databaseSchemaJSON, null, "  "));
        },

        tempActionJSON: "",
        fromDataSchemaToActions: async () => {
            const app = z.object({
                endpoints: z.array(
                    z
                        .object({
                            method: z
                                .string()
                                .describe("method of the rest API function"),
                            route: z
                                .string()
                                .describe("api route of the rest API function"),
                            title: z
                                .string()
                                .describe("title of the rest API function"),
                            parameters: z
                                .array(
                                    z
                                        .discriminatedUnion("type", [
                                            z
                                                .object({
                                                    type: z.literal("number"),
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
                                                .describe("number data type"),
                                            z
                                                .object({
                                                    type: z.literal("string"),
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
                                                .describe("string data type"),
                                        ])
                                        .describe("data type")
                                )
                                .describe("parametrs of the rest API function"),
                        })
                        .describe("rest API function")
                ),
            });

            const model = await client.llm.model(
                "mistralai/devstral-small-2507"
            );
            // const model = await client.llm.model("qwen/qwen3-8b");

            let generateJSON = async ({
                query = "tell me about ...",
                inc = 0,
            }) => {
                try {
                    console.log("loading...");

                    const prediction = model.respond(query, {
                        structured: {
                            type: "json",
                            jsonSchema: z.toJSONSchema(app),
                        },
                        maxTokens: 5000, // Recommended to avoid getting stuck
                    });

                    let chunk = "";
                    for await (let item of prediction) {
                        chunk += item.content;
                        set({ tempActionJSON: chunk });
                    }

                    let result = await prediction;
                    let list = app.parse(
                        JSON.parse(result.nonReasoningContent)
                    );

                    if (list.endpoints.length === 0) {
                        inc++;
                        console.log("retry", inc);
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

            let userIntent = `${get().overallDesc}`;

            let query = `
${developerSystemPrompt}

user want to do the following: 
                    
${userIntent}

-----

here's the database schema:

${get().databaseSchemaJSON.database.databaseTitle}
${get().databaseSchemaJSON.database.description}

Database Tables:

${get()
    .databaseSchemaJSON.database.tables.map((table: any) => {
        return `
-----Table <${table.tableName}> ------
name: ${table.tableName}
description: ${table.description}
columns: 

${table.dataAttributes
    .map((attr: any) => {
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

please generate all the required backend REST API endpoint functions
        
        `;

            // ${JSON.stringify(v0Data.database.tables, null, "  ")}

            // console.log(query);

            console.log("generaing info");

            let actionJSON = await generateJSON({
                query: query,
            });

            console.log(actionJSON);

            console.log(JSON.stringify(actionJSON, null, "  "));

            await vibeCache.setItem("actionJSON", actionJSON);

            set({ actionJSON: actionJSON });
        },

        //
    };
});
