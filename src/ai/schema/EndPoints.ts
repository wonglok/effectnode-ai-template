import { z } from "zod";

const ParameterSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("string"),
        name: z.string(),
        description: z.string(),
        optional: z.boolean().optional(),
    }),
    z.object({
        type: z.literal("number"),
        name: z.string(),
        description: z.string(),
        optional: z.boolean().optional(),
    }),
]);

const EndpointSchema = z.object({
    method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
    route: z.string(),
    title: z.string(),
    parameters: z.array(ParameterSchema),
    description: z.string().optional(),
});

export const APISpecSchema = z.object({
    endpoints: z.array(EndpointSchema),
    version: z.string().optional(),
    baseUrl: z.string().optional(),
});

export type APISpec = z.infer<typeof APISpecSchema>;
export type Endpoint = z.infer<typeof EndpointSchema>;
export type Parameter = z.infer<typeof ParameterSchema>;
