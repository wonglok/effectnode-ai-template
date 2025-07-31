import { LMStudioClient } from "@lmstudio/sdk";
import { create } from "zustand";
import { z } from "zod";
import localforage from "localforage";
import { developerSystemPrompt } from "@/ai/prompt/developerSystemPrompt";

export const vibeCache = localforage.createInstance({
    name: "vibe-cache",
});
const client = new LMStudioClient();

let defaultPrompt = `Create me a database for the easter egg game in a 3d world with three.js. 
User can place eggs in place [x,y,z] and user can discover egg and claim it. 
We can also have analytics of the user actions. we have multiple 3d worlds. 
People can travel to different places using portals. 
Create a auth database table for users to sign up and login using simple email and password and mark it as verified or not.`;

export const useVibe = create<any>((set, get) => {
    return {
        //
        defaultPrompt: defaultPrompt,

        //

        modelCode: "mistralai/devstral-small-2507",
        overallDesc: defaultPrompt,
        databaseSchemaJSON: null,
        actionJSON: null,
        mongooseCode: null,

        hydrate: async () => {
            let fields = [
                `databaseSchemaJSON`,
                `overallDesc`,
                `actionJSON`,
                `mongooseCode`,
            ];

            for (let field of fields) {
                let value = await vibeCache.getItem(field);
                if (value && value !== null && value !== "loading...") {
                    set({
                        [field]: value,
                    });
                }
            }
        },

        //

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
            const model = await client.llm.model(get().modelCode);
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

            const model = await client.llm.model(get().modelCode);
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
        tempMongooseCode: "",
        convertOverallSchemaToMongooseCodePrompt: (table = {}) => {
            // user original goal:
            // ${get()?.overallDesc}
            return `
${developerSystemPrompt}

here's the mongodb collection info:

${JSON.stringify(table)}

write a mongoose model 

dont use markdown and use js comment to leave explanations
            `;
        },
        convertOverallSchemaToMongooseCode: async () => {
            const model = await client.llm.model(get().modelCode);

            let tables = get().databaseSchemaJSON.database.tables;

            for (let table of tables) {
                // const zodSchema = z.object({
                //     explaination: z
                //         .string()
                //         .describe("explaination of the mongoose models"),

                //     fileName: z.string().describe("mongoose model file name"),
                //     code: z.string().describe("code content"),
                // });

                const query =
                    get().convertOverallSchemaToMongooseCodePrompt(table);

                const prediction = model.respond(query, {
                    // structured: {
                    //     type: "json",
                    //     jsonSchema: z.toJSONSchema(zodSchema),
                    // },
                    maxTokens: 25000, // Recommended to avoid getting stuck
                });

                let chunk = "";
                for await (let item of prediction) {
                    chunk += item.content;
                    set({ tempMongooseCode: chunk });
                }

                let result = await prediction;

                let resultContent = result.content;

                console.log(resultContent);
            }

            // typedObject = zodSchema.parse(typedObject);

            // typedObject.files.forEach((file: any) => {
            //     file.code = file.code.replace(/\\n/g, "\n");
            //     file.code = file.code.replace("[0m", "");
            // });

            // await vibeCache.setItem("mongooseCode", typedObject);

            // set({ mongooseCode: typedObject });
        },
        //
    };
});

// let lmstudio = await createOpenAICompatible({
//     name: "lmstudio",
//     baseURL: `http://localhost:1234/v1`,
// });
// let model = await lmstudio(get().modelCode);
//
//                 {
//                     let output = await ai.streamText({
//                         model: model,
//                         prompt: `
// ${developerSystemPrompt}
// here's the overall schema:
// ${overallDesc}
// we use mongoose database please write code for the overall schema including mongoose model and schema.
//                     `,
//                     });
//                     let chunk = "";
//                     for await (let stuff of output.textStream) {
//                         chunk += stuff;
//                         console.log(chunk);
//                     }
//                     console.log(await output.text);
//                 }
