"use client";

import { AppSidebar } from "@/components/app-sidebar";
// import {
//     Breadcrumb,
//     BreadcrumbItem,
//     BreadcrumbLink,
//     BreadcrumbList,
//     BreadcrumbPage,
//     BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    //
} from "@/components/ui/sidebar";

export default function layout({ children }: { children: React.ReactNode }) {
    if (process.env.NODE_ENV !== "development") {
        return (
            <>
                <div className="w-full h-full flex items-center justify-center">
                    Developer Tools is only avaible in development mode.
                </div>
            </>
        );
    }

    //

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
    );
}

//

//

//
