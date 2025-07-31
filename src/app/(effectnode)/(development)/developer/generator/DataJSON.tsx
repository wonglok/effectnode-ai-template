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
import { useEffect } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { developerSystemPrompt } from "@/ai/prompt/developerSystemPrompt";
import { AutoBottom } from "./AutoBottom";

export function DataJSON() {
    let overallDesc = useVibe((r) => r.overallDesc);
    let databaseSchemaJSON = useVibe((r) => r.databaseSchemaJSON);
    let hydrate = useVibe((r) => r.hydrate);
    let tempSchemaJSON = useVibe((r) => r.tempSchemaJSON);

    useEffect(() => {
        hydrate();
    }, []);

    return (
        <>
            <div className="mb-3 p-3 bg-white rounded-xl">
                <h1 className="text-2xl mb-3">Generate Features</h1>

                <div className="mb-3">
                    <Textarea
                        placeholder="Describe your app in detail..."
                        value={`${overallDesc}`}
                        onInput={(ev) => {
                            //
                            let value = (ev?.target as HTMLTextAreaElement)
                                .value;

                            useVibe.setState({
                                overallDesc: value,
                            });
                            vibeCache.setItem("overallDesc", overallDesc);

                            //
                        }}
                    ></Textarea>
                </div>
                <div className="mb-3">
                    <Button
                        className="mr-4"
                        variant="outline"
                        onClick={() => {
                            //

                            console.log("Generate Database Fields");
                            useVibe.getState().fromSpecToDatabaseSchema();

                            //
                        }}
                    >
                        Generate Database Fields
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => {
                            //

                            let value = useVibe?.getState()?.defaultPrompt;

                            useVibe.setState({
                                overallDesc: value,
                            });

                            vibeCache.setItem("overallDesc", overallDesc);
                            //
                        }}
                    >
                        Reset Default Prompt
                    </Button>
                </div>
            </div>

            {tempSchemaJSON && (
                <div className="mb-3 p-3 bg-white rounded-xl">
                    <div className="mb-3 text-2xl">Temporary Prompt Output</div>

                    <AutoBottom text={tempSchemaJSON}></AutoBottom>
                </div>
            )}

            {/* tempSchemaJSON */}

            {/* 
            <div className="mb-3 p-3 bg-white rounded-xl">
                <div className="mb-3 text-2xl">Database Schema JSON</div>

                <Textarea
                    className="p-3 bg-white w-full whitespace-pre-wrap h-64 rounded-xl"
                    onClick={() => {
                        //databaseSchemaJSON
                    }}
                    onChange={() => {
                        //
                    }}
                    value={JSON.stringify(databaseSchemaJSON, null, "\t")}
                ></Textarea>
            </div> */}

            {databaseSchemaJSON && databaseSchemaJSON?.database && (
                <div className="mb-3 p-3 bg-white rounded-xl">
                    <div className="mb-2 text-3xl">
                        {databaseSchemaJSON.database?.databaseTitle}
                    </div>
                    <div className="mb-3 text-gray-600">
                        {databaseSchemaJSON.database.description}
                    </div>

                    <div className="mb-3">
                        {databaseSchemaJSON.database.tables.map(
                            (table: any) => {
                                return (
                                    <div key={table.tableName}>
                                        <div className="text-2xl">
                                            {table.tableName}
                                        </div>
                                        <div className="text-gray-500">
                                            {table.description}
                                        </div>
                                        <div className="mb-6">
                                            <Table>
                                                {/* <TableCaption></TableCaption> */}
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
                                                    {table.dataAttributes.map(
                                                        (attr: any) => {
                                                            return (
                                                                <TableRow
                                                                    key={
                                                                        attr.name
                                                                    }
                                                                >
                                                                    <TableCell className="text-right">
                                                                        {
                                                                            attr.dataType
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell className="font-medium">
                                                                        {
                                                                            attr.name
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {
                                                                            attr.description
                                                                        }
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        }
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>

                    <div className="mb-3"></div>
                </div>
            )}
        </>
    );
}
