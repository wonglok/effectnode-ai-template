"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";

import { useVibe, vibeCache } from "./useVibe";
import { useEffect, useRef } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
// import { developerSystemPrompt } from "@/ai/prompt/developerSystemPrompt";
import { AutoBottom } from "./AutoBottom";
import { developerSystemPrompt } from "@/ai/prompt/developerSystemPrompt";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeHighlight = ({ codeString }: { codeString: string }) => {
    return (
        <SyntaxHighlighter language="typescript" style={dark}>
            {codeString.replace(/\\n/g, "\n")}
        </SyntaxHighlighter>
    );
};

export function MongooseJSON() {
    let overallDesc = useVibe((r) => r.overallDesc);
    let databaseSchemaJSON = useVibe((r) => r.databaseSchemaJSON);
    let mongooseCode = useVibe((r) => r.mongooseCode);
    let hydrate = useVibe((r) => r.hydrate);
    let tempMongooseCode = useVibe((r) => r.tempMongooseCode);
    let convertOverallSchemaToMongooseCodePrompt = useVibe(
        (r) => r.convertOverallSchemaToMongooseCodePrompt
    );
    useEffect(() => {
        hydrate();
    }, []);

    let actionJSON = useVibe((r) => r.actionJSON);

    //

    let query = "";
    query = convertOverallSchemaToMongooseCodePrompt().trim();

    return (
        <>
            <div className="mb-3 p-3 bg-white rounded-xl">
                <div className="mb-3 text-2xl">
                    Prompt for Generating Model Code
                </div>

                <pre className="p-3 bg-white w-full whitespace-pre-wrap h-64 rounded-xl overflow-y-auto border text-xs">
                    {query}
                </pre>
            </div>

            <div className="mb-3">
                <Button
                    className="mr-4"
                    variant="outline"
                    onClick={() => {
                        //

                        console.log("Generate Mongoose JSON");
                        useVibe.getState().convertOverallSchemaToMongooseCode();

                        //
                    }}
                >
                    Generate Mongoose JSON
                </Button>
            </div>

            {tempMongooseCode && (
                <div className="mb-3 p-3 bg-white rounded-xl">
                    <div className="mb-3 text-2xl">Temporary Prompt Output</div>

                    <AutoBottom text={tempMongooseCode}></AutoBottom>
                </div>
            )}

            {mongooseCode && mongooseCode?.files && (
                <div className="mb-3 p-3 bg-white rounded-xl">
                    <div className="mb-2 text-3xl">Mongoose Codes</div>
                    <div className="mb-3 text-gray-600">
                        {mongooseCode.explaination}
                    </div>

                    <div className="mb-3">
                        {mongooseCode.files.map((eFile: any) => {
                            // console.log(eFile);
                            return (
                                <div key={eFile.fileName}>
                                    <div className="text-2xl">
                                        {eFile.fileName}
                                    </div>
                                    {/* <div className="text-gray-500">
                                        {eFile.description}
                                    </div> */}

                                    <div className="mb-6">
                                        <div className=" whitespace-pre-wrap text-sm">
                                            <CodeHighlight
                                                codeString={`${eFile.code}`}
                                            ></CodeHighlight>
                                            {/* {eFile.mongooseModelCodeContent} */}
                                        </div>
                                        {/* <TableCaption></TableCaption> */}

                                        {/* <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[100px] text-right">
                                                        Data Type
                                                    </TableHead>
                                                    <TableHead className="w-[130px]">
                                                        Name
                                                    </TableHead>
                                                    <TableHead>
                                                        Description
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {files.parameters.map(
                                                    (params: any) => {
                                                        return (
                                                            <TableRow
                                                                key={
                                                                    params.name +
                                                                    params.dataType +
                                                                    files.method
                                                                }
                                                            >
                                                                <TableCell className="text-right">
                                                                    {
                                                                        params.dataType
                                                                    }
                                                                </TableCell>
                                                                <TableCell className="font-medium">
                                                                    {
                                                                        params.name
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    {
                                                                        params.description
                                                                    }
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    }
                                                )}
                                            </TableBody>
                                        </Table> */}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mb-3"></div>
                </div>
            )}
        </>
    );
}

/*
[
    {
        "method": "POST",
        "route": "/api/users/register",
        "title": "User Registration",
        "parameters": [
            {
                "type": "string",
                "name": "email",
                "description": "User's email address"
            }
        ]
    },
    {
        "method": "POST",
        "route": "/api/users/login",
        "title": "User Login",
        "parameters": [
            {
                "type": "string",
                "name": "email",
                "description": "User's email address"
            },
            {
                "type": "string",
                "name": "password",
                "description": "User's password"
            }
        ]
    },
    {
        "method": "POST",
        "route": "/api/users/verify-email",
        "title": "Verify User Email",
        "parameters": [
            {
                "type": "string",
                "name": "verification_code",
                "description": "Verification code received via email"
            }
        ]
    },
    {
        "method": "POST",
        "route": "/api/easter-eggs/place",
        "title": "Place Easter Egg",
        "parameters": [
            {
                "type": "string",
                "name": "world_id",
                "description": "World ID where egg is to be placed"
            },
            {
                "type": "number",
                "name": "x_coordinate",
                "description": "X-axis position in the 3D world"
            },
            {
                "type": "number",
                "name": "y_coordinate",
                "description": "Y-axis position in the 3D world"
            },
            {
                "type": "number",
                "name": "z_coordinate",
                "description": "Z-axis position in the 3D world"
            }
        ]
    },
    {
        "method": "POST",
        "route": "/api/easter-eggs/claim",
        "title": "Claim Easter Egg",
        "parameters": [
            {
                "type": "string",
                "name": "egg_id",
                "description": "Unique ID of the Easter egg to claim"
            }
        ]
    },
    {
        "method": "POST",
        "route": "/api/easter-eggs/discover",
        "title": "Discover Easter Egg",
        "parameters": [
            {
                "type": "string",
                "name": "egg_id",
                "description": "Unique ID of the Easter egg discovered"
            }
        ]
    },
    {
        "method": "GET",
        "route": "/api/worlds/:worldId/eggs",
        "title": "Get Eggs in World",
        "parameters": [
            {
                "type": "string",
                "name": "worldId",
                "description": "World ID to fetch Easter eggs from"
            }
        ]
    },
    {
        "method": "POST",
        "route": "/api/portals/travel",
        "title": "Travel Through Portal",
        "parameters": [
            {
                "type": "string",
                "name": "portal_id",
                "description": "Unique ID of the portal to travel through"
            }
        ]
    },
    {
        "method": "GET",
        "route": "/api/users/:userId/analytics",
        "title": "Get User Analytics",
        "parameters": [
            {
                "type": "string",
                "name": "userId",
                "description": "User ID to fetch analytics for"
            }
        ]
    }
]
*/
