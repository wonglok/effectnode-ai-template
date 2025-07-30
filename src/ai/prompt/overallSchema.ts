import { v0Data } from "../db/v0Data";

export const overallSchema = `
here's the database schema:

${v0Data.database.databaseTitle}
${v0Data.database.description}

Database Tables:
${v0Data.database.tables
    .map((table) => {
        return `
-----Table <${table.tableName}> ------
name: ${table.tableName}
description: ${table.description}
columns: 

${table.dataAttributes
    .map((attr) => {
        return `
    
    name: ${attr.name}
    data type: ${attr.dataType}
    description: ${attr.description}
    
    `;
    })
    .join("\n")}

-----Table <${table.tableName}> ------

`;
    })
    .join("\n")}

----- `;
