"use client";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import * as ai from "ai";
import { developerSystemPrompt } from "./prompt/developerSystemPrompt";
import { v0Actions } from "./db/v0Actions";
import { v0Data } from "./db/v0Data";
import { overallSchema } from "./prompt/overallSchema";
import { modelPrompt } from "./prompt/modelPrompt";
import { useState } from "react";

export function ButtonCodeAI() {
    return (
        <>
            <button
                className="m-3 p-3 bg-gray-200 cursor-pointer hover:bg-gray-300"
                onClick={async () => {
                    //
                    let lmstudio = await createOpenAICompatible({
                        name: "lmstudio",
                        baseURL: `http://localhost:1234/v1`,
                    });

                    let model = await lmstudio("mistralai/devstral-small-2507");

                    //
                    //                 {
                    //                     let output = await ai.streamText({
                    //                         model: model,
                    //                         prompt: `

                    // ${developerSystemPrompt}

                    // here's the overall schema:
                    // ${overallSchema}

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

                    let writeToDisplay = (vv: string) => {
                        let element = document.getElementById("scrollToBottom");

                        if (element) {
                            element.innerText = vv;
                            element.scrollTop = 999999999;
                        }
                    };

                    for await (let endpoint of v0Actions.endpoints) {
                        let promptStr = `

${developerSystemPrompt}

here's the overall schema:
${overallSchema}

we use mongoose database 
${modelPrompt}

write me the code for the following REST API typescript NextJS AppRouter function:

${JSON.stringify(endpoint, null, "  ")}

`;

                        //

                        writeToDisplay(`Writing code for... ${endpoint.route}`);

                        let output = await ai.streamText({
                            model: model,
                            prompt: promptStr,
                        });

                        console.log(promptStr);

                        let chunk = "";
                        for await (let stuff of output.textStream) {
                            chunk += stuff;
                            // console.log(chunk);

                            writeToDisplay(chunk);
                        }

                        console.log(await output.text);
                    }
                }}
            >
                CodeAI
            </button>
        </>
    );
}

//

//

//

//
