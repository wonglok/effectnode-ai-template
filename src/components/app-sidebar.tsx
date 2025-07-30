"use client";

import * as React from "react";
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    CommandIcon,
    Frame,
    GalleryVerticalEnd,
    Map,
    MoreHorizontal,
    PieChart,
    Server,
    Settings2,
    SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import Link from "next/link";

// This is sample data.
const getData = () => {
    return {
        user: {
            name: "wonglok831",
            email: "yellowhappy831@gmail.com",
            avatar: `/effectnode-asset/emoji/star-struck-emoji-icon.svg`,
        },
        teams: [
            {
                name: "Acme Inc",
                logo: GalleryVerticalEnd,
                plan: "Enterprise",
            },
            {
                name: "Acme Corp.",
                logo: AudioWaveform,
                plan: "Startup",
            },
            {
                name: "Yo Corp.",
                logo: Command,
                plan: "Free",
            },
        ],

        dashboard: [
            {
                name: "Dasboard",
                url: "/devtools/dashboard",
                icon: CommandIcon,
            },
        ],
        navMain: [
            {
                title: "Backend",
                url: "/devtools/backend",
                icon: Server,
                isActive:
                    window.location.pathname.startsWith("/devtools/backend"),
                items: [
                    {
                        title: "Feature Spec",
                        url: "/devtools/backend/spec",
                    },
                    {
                        title: "Database",
                        url: "/devtools/backend/db",
                    },
                    {
                        title: "REST API",
                        url: "/devtools/backend/rest-api",
                    },
                ],
            },
            {
                title: "Frontend",
                url: "/devtools/frontend",
                icon: Bot,

                isActive:
                    window.location.pathname.startsWith("/devtools/frontend"),
                items: [
                    {
                        title: "3D Editor",
                        url: "/devtools/frontend/editor",
                    },
                    {
                        title: "Landing Page Editor",
                        url: "/devtools/frontend/landing-page",
                    },
                ],
            },
            {
                title: "Documentation",
                url: "/devtools",
                icon: BookOpen,
                items: [
                    {
                        title: "Introduction",
                        url: "/devtools",
                    },
                    {
                        title: "Get Started",
                        url: "/devtools",
                    },
                    {
                        title: "Tutorials",
                        url: "/devtools",
                    },
                    {
                        title: "Changelog",
                        url: "/devtools",
                    },
                ],
            },
            {
                title: "Settings",
                url: "/devtools",
                icon: Settings2,
                items: [
                    {
                        title: "General",
                        url: "/devtools",
                    },
                    {
                        title: "Team",
                        url: "/devtools",
                    },
                    {
                        title: "Billing",
                        url: "/devtools",
                    },
                    {
                        title: "Limits",
                        url: "/devtools",
                    },
                ],
            },
        ],
        projects: [
            {
                name: "Design Engineering",
                url: "/devtools",
                icon: Frame,
            },
            {
                name: "Sales & Marketing",
                url: "/devtools",
                icon: PieChart,
            },
            {
                name: "Travel",
                url: "/devtools",
                icon: Map,
            },
        ],
    };
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    let [data, setData] = React.useState<any>(
        ((typeof window === "undefined" ? {} : window) as any)?.menuData
    );

    React.useEffect(() => {
        (window as any).menuData = getData();

        setData(getData());
        //
    }, []);
    return (
        <>
            {data ? (
                <>
                    <Sidebar collapsible="icon" {...props}>
                        <SidebarHeader>
                            <TeamSwitcher teams={data.teams} />
                        </SidebarHeader>
                        <SidebarContent>
                            <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                                <SidebarGroupLabel>
                                    Developer Tools
                                </SidebarGroupLabel>
                                <SidebarMenu>
                                    {data.dashboard.map(
                                        (item: {
                                            name: string;
                                            url: string;
                                            icon: any;
                                        }) => (
                                            <SidebarMenuItem key={item.name}>
                                                <SidebarMenuButton asChild>
                                                    <Link href={item.url}>
                                                        <item.icon />
                                                        <span>{item.name}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        )
                                    )}
                                </SidebarMenu>
                            </SidebarGroup>
                            <NavMain items={data.navMain} />
                            <NavProjects projects={data.projects} />
                        </SidebarContent>
                        <SidebarFooter>
                            <NavUser user={data.user} />
                        </SidebarFooter>
                        <SidebarRail />
                    </Sidebar>
                </>
            ) : (
                <>
                    <Sidebar collapsible="icon" {...props}></Sidebar>
                </>
            )}
        </>
    );
}
