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
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
    let router = useRouter();
    useEffect(() => {
        router?.push("/devtools/dashboard");
    }, [router]);

    //
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
                                <BreadcrumbLink href="/devtools">
                                    Developer Tools
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {/* <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Home</BreadcrumbPage>
                            </BreadcrumbItem> */}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="bg-muted/50 aspect-video rounded-xl p-3">
                        <div className="w-full h-full flex items-center justify-center">
                            <div>Loading...</div>
                        </div>
                    </div>
                    <div className="bg-muted/50 aspect-video rounded-xl p-3">
                        <div className="w-full h-full flex items-center justify-center">
                            <div>Loading...</div>
                        </div>
                    </div>
                    <div className="bg-muted/50 aspect-video rounded-xl p-3">
                        <div className="w-full h-full flex items-center justify-center">
                            <div>Loading...</div>
                        </div>
                    </div>
                </div>
                <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
                    <div className="w-full h-full flex items-center justify-center">
                        <div>Loading...</div>
                    </div>
                </div>
            </div>
        </>
    );
}
