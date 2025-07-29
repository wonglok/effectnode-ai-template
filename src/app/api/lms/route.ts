// import { LMStudioClient } from "@lmstudio/sdk";
// export async function GET(req: Request) {
//     const client = new LMStudioClient();

//     const model = await client.llm.model("llama-3.2-1b-instruct", {
//         onProgress: (v) => {
//             console.log(v);
//         },
//     });
//     const result = await model.respond("What is the meaning of life?");

//     // console.info(result.content);

//     return Response.json("123");
// }

export async function GET() {
    return Response.json({ yo: 24 });
}
