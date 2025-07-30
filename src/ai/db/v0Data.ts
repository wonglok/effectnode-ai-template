export const v0Data = {
    database: {
        databaseTitle: "Easter Egg Adventure",
        description:
            "A 3D Easter egg hunting game using Three.js with user placement, discovery, claiming, and analytics across multiple worlds connected by portals.",
        tables: [
            {
                tableName: "Users",
                description: "Stores user information",
                dataAttributes: [
                    {
                        dataType: "string",
                        name: "userId",
                        description: "Unique identifier for each user",
                    },
                    {
                        dataType: "string",
                        name: "username",
                        description: "User's chosen display name",
                    },
                    {
                        dataType: "string",
                        name: "email",
                        description: "User's email address",
                    },
                    {
                        dataType: "string",
                        name: "passwordHash",
                        description: "Hashed password for authentication",
                    },
                ],
            },
            {
                tableName: "Worlds",
                description: "Stores information about different 3D worlds",
                dataAttributes: [
                    {
                        dataType: "string",
                        name: "worldId",
                        description: "Unique identifier for each world",
                    },
                    {
                        dataType: "string",
                        name: "worldName",
                        description: "Name of the world",
                    },
                    {
                        dataType: "string",
                        name: "description",
                        description: "Description of the world",
                    },
                    {
                        dataType: "string",
                        name: "createdBy",
                        description: "User ID of creator",
                    },
                    {
                        dataType: "string",
                        name: "createdAt",
                        description: "Timestamp when world was created",
                    },
                ],
            },
            {
                tableName: "Eggs",
                description: "Stores information about placed Easter eggs",
                dataAttributes: [
                    {
                        dataType: "string",
                        name: "eggId",
                        description: "Unique identifier for each egg",
                    },
                    {
                        dataType: "string",
                        name: "worldId",
                        description: "World where egg is placed",
                    },
                    {
                        dataType: "string",
                        name: "placedBy",
                        description: "User ID who placed the egg",
                    },
                    {
                        dataType: "string",
                        name: "x",
                        description: "X-coordinate of egg placement",
                    },
                    {
                        dataType: "string",
                        name: "y",
                        description: "Y-coordinate of egg placement",
                    },
                    {
                        dataType: "string",
                        name: "z",
                        description: "Z-coordinate of egg placement",
                    },
                    {
                        dataType: "string",
                        name: "status",
                        description:
                            "Current status (placed, discovered, claimed)",
                    },
                    {
                        dataType: "string",
                        name: "placedAt",
                        description: "Timestamp when egg was placed",
                    },
                    {
                        dataType: "string",
                        name: "discoveredAt",
                        description:
                            "Timestamp when egg was discovered (null if not yet discovered)",
                    },
                    {
                        dataType: "string",
                        name: "claimedAt",
                        description:
                            "Timestamp when egg was claimed (null if not yet claimed)",
                    },
                    {
                        dataType: "string",
                        name: "claimedBy",
                        description:
                            "User ID who claimed the egg (null if not yet claimed)",
                    },
                ],
            },
            {
                tableName: "Portals",
                description: "Stores information about portals between worlds",
                dataAttributes: [
                    {
                        dataType: "string",
                        name: "portalId",
                        description: "Unique identifier for each portal",
                    },
                    {
                        dataType: "string",
                        name: "sourceWorldId",
                        description: "ID of the source world",
                    },
                    {
                        dataType: "string",
                        name: "destinationWorldId",
                        description: "ID of the destination world",
                    },
                    {
                        dataType: "string",
                        name: "x",
                        description: "X-coordinate of portal in source world",
                    },
                    {
                        dataType: "string",
                        name: "y",
                        description: "Y-coordinate of portal in source world",
                    },
                    {
                        dataType: "string",
                        name: "z",
                        description: "Z-coordinate of portal in source world",
                    },
                    {
                        dataType: "string",
                        name: "createdBy",
                        description: "User ID who created the portal",
                    },
                ],
            },
            {
                tableName: "Analytics",
                description: "Stores user actions for analytics purposes",
                dataAttributes: [
                    {
                        dataType: "string",
                        name: "actionId",
                        description: "Unique identifier for each action",
                    },
                    {
                        dataType: "string",
                        name: "userId",
                        description: "ID of user performing the action",
                    },
                    {
                        dataType: "string",
                        name: "worldId",
                        description: "World where action occurred",
                    },
                    {
                        dataType: "string",
                        name: "actionType",
                        description:
                            "Type of action (egg_placed, egg_discovered, egg_claimed, portal_created, world_created)",
                    },
                    {
                        dataType: "string",
                        name: "targetId",
                        description: "ID of target (eggId or portalId)",
                    },
                    {
                        dataType: "string",
                        name: "timestamp",
                        description: "When the action occurred",
                    },
                    {
                        dataType: "string",
                        name: "details",
                        description: "Additional details about the action",
                    },
                ],
            },
        ],
    },
};
