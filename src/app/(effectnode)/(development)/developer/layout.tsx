"use client";

import { AppSidebar, useDeveloperTools } from "@/components/app-sidebar";

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
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function layout({ children }: { children: React.ReactNode }) {
    if (process.env.NODE_ENV !== "development") {
        return (
            <>
                <div className="w-full h-full flex items-center justify-center">
                    Developer Tools are only avaible in development mode.
                </div>
            </>
        );
    }

    // let rotuer = useRouter();
    // let { slug } = useParams();
    // useEffect(() => {
    //     let layoutCode = async () => {
    //         let data = await fetch(`http://localhost:8390/all-data`, {
    //             mode: "cors",
    //         }).then(async (res) => {
    //             return await res.json();
    //         });

    //         useDeveloperTools.setState({
    //             projects: data.projects,
    //         });

    //         if (!data.projects.find((r: any) => r.slug === slug)) {
    //             rotuer.push(`/developer/${data.projects[0]?.slug}`);
    //         }
    //     };
    //     layoutCode();
    // }, [slug]);

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
