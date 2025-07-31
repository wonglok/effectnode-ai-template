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
import { ActionJSON } from "./ActionJSON";
import { DataJSON } from "./DataJSON";
import { MongooseJSON } from "./MongooseJSON";

export default function Page() {
    let overallDesc = useVibe((r) => r.overallDesc);
    let databaseSchemaJSON = useVibe((r) => r.databaseSchemaJSON);
    let hydrate = useVibe((r) => r.hydrate);
    useEffect(() => {
        hydrate();
    }, []);

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="/developer">
                                    Developer Tools
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="/developer/generator">
                                    Generator
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Features</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            {/*  */}
            {/*  */}
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-3 max-w-[800px]">
                    <div className="w-full h-full flex">
                        <div className=" shrink-0 max-w-[800px] mr-4">
                            <div className="bg-blue-200 p-3 rounded-xl mb-3">
                                <DataJSON></DataJSON>
                            </div>
                        </div>
                        {/* <div className=" shrink-0 max-w-[800px] mr-4">
                            {databaseSchemaJSON && (
                                <div className="bg-purple-200 p-3 rounded-xl mb-3">
                                    <ActionJSON></ActionJSON>
                                </div>
                            )}
                        </div> */}
                        <div className=" shrink-0 max-w-[800px] mr-4">
                            {
                                <div className="bg-green-200 p-3 rounded-xl mb-3">
                                    <MongooseJSON></MongooseJSON>
                                </div>
                            }
                        </div>
                        {/*  */}
                    </div>
                </div>

                {/*  */}
                {/*  */}
                {/*  */}
                {/*  */}
                {/*  */}
            </div>
        </>
    );
}
