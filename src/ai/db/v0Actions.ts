export const v0Actions = {
    endpoints: [
        {
            method: "POST",
            route: "/users",
            title: "Create User",
            parameters: [
                {
                    type: "string",
                    name: "username",
                    description: "User's chosen display name",
                },
                {
                    type: "string",
                    name: "email",
                    description: "User's email address",
                },
                {
                    type: "string",
                    name: "passwordHash",
                    description: "Hashed password for authentication",
                },
            ],
        },
        {
            method: "GET",
            route: "/users/:userId",
            title: "Get User",
            parameters: [
                {
                    type: "string",
                    name: "userId",
                    description: "Unique identifier for the user",
                },
            ],
        },
        {
            method: "PUT",
            route: "/users/:userId",
            title: "Update User",
            parameters: [
                {
                    type: "string",
                    name: "userId",
                    description: "Unique identifier for the user",
                },
            ],
        },
        {
            method: "DELETE",
            route: "/users/:userId",
            title: "Delete User",
            parameters: [
                {
                    type: "string",
                    name: "userId",
                    description: "Unique identifier for the user",
                },
            ],
        },
        {
            method: "POST",
            route: "/worlds",
            title: "Create World",
            parameters: [
                {
                    type: "string",
                    name: "worldName",
                    description: "Name of the world",
                },
                {
                    type: "string",
                    name: "description",
                    description: "Description of the world",
                },
            ],
        },
        {
            method: "GET",
            route: "/worlds/:worldId",
            title: "Get World",
            parameters: [
                {
                    type: "string",
                    name: "worldId",
                    description: "Unique identifier for the world",
                },
            ],
        },
        {
            method: "PUT",
            route: "/worlds/:worldId",
            title: "Update World",
            parameters: [
                {
                    type: "string",
                    name: "worldId",
                    description: "Unique identifier for the world",
                },
            ],
        },
        {
            method: "DELETE",
            route: "/worlds/:worldId",
            title: "Delete World",
            parameters: [
                {
                    type: "string",
                    name: "worldId",
                    description: "Unique identifier for the world",
                },
            ],
        },
        {
            method: "POST",
            route: "/eggs",
            title: "Place Egg",
            parameters: [
                {
                    type: "string",
                    name: "worldId",
                    description: "World where egg is placed",
                },
                {
                    type: "string",
                    name: "x",
                    description: "X-coordinate of egg placement",
                },
                {
                    type: "string",
                    name: "y",
                    description: "Y-coordinate of egg placement",
                },
                {
                    type: "string",
                    name: "z",
                    description: "Z-coordinate of egg placement",
                },
            ],
        },
        {
            method: "PATCH",
            route: "/eggs/:eggId/discover",
            title: "Discover Egg",
            parameters: [
                {
                    type: "string",
                    name: "eggId",
                    description: "Unique identifier for the egg",
                },
            ],
        },
        {
            method: "PATCH",
            route: "/eggs/:eggId/claim",
            title: "Claim Egg",
            parameters: [
                {
                    type: "string",
                    name: "eggId",
                    description: "Unique identifier for the egg",
                },
            ],
        },
        {
            method: "GET",
            route: "/eggs/:eggId",
            title: "Get Egg Status",
            parameters: [
                {
                    type: "string",
                    name: "eggId",
                    description: "Unique identifier for the egg",
                },
            ],
        },
        {
            method: "POST",
            route: "/portals",
            title: "Create Portal",
            parameters: [
                {
                    type: "string",
                    name: "sourceWorldId",
                    description: "ID of the source world",
                },
                {
                    type: "string",
                    name: "destinationWorldId",
                    description: "ID of the destination world",
                },
                {
                    type: "string",
                    name: "x",
                    description: "X-coordinate of portal in source world",
                },
                {
                    type: "string",
                    name: "y",
                    description: "Y-coordinate of portal in source world",
                },
                {
                    type: "string",
                    name: "z",
                    description: "Z-coordinate of portal in source world",
                },
            ],
        },
        {
            method: "GET",
            route: "/portals/:portalId",
            title: "Get Portal",
            parameters: [
                {
                    type: "string",
                    name: "portalId",
                    description: "Unique identifier for the portal",
                },
            ],
        },
        {
            method: "DELETE",
            route: "/portals/:portalId",
            title: "Delete Portal",
            parameters: [
                {
                    type: "string",
                    name: "portalId",
                    description: "Unique identifier for the portal",
                },
            ],
        },
        {
            method: "GET",
            route: "/analytics/user/:userId",
            title: "Get User Analytics",
            parameters: [
                {
                    type: "string",
                    name: "userId",
                    description: "ID of the user",
                },
            ],
        },
        {
            method: "GET",
            route: "/analytics/world/:worldId",
            title: "Get World Analytics",
            parameters: [
                {
                    type: "string",
                    name: "worldId",
                    description: "ID of the world",
                },
            ],
        },
        {
            method: "GET",
            route: "/analytics.action/:actionType",
            title: "Get Actions by Type",
            parameters: [
                {
                    type: "string",
                    name: "actionType",
                    description: "Type of action",
                },
            ],
        },
    ],
};
