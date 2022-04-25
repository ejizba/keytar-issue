const http = require('http');
const identity = require("@azure/identity");
const arm = require("@azure/arm-resources");

/**
 * This code will use environment variables to log in and return a response listing out your resource groups
 * 
 * It uses a service principal to log in, so you have to add these settings based on your service principal
 * 
 * AZURE_SUBSCRIPTION_ID
 * AZURE_TENANT_ID
 * AZURE_CLIENT_ID
 * AZURE_CLIENT_SECRET
 */

const server = http.createServer(async (request, response) => {
    try {
        const cred = new identity.EnvironmentCredential();
        const client = new arm.ResourceManagementClient(cred, process.env.AZURE_SUBSCRIPTION_ID);
        const data = await client.resourceGroups.list().byPage().next();
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.end(`data: ${JSON.stringify(data.value.map(d => d.name))}`);
    } catch (error) {
        response.writeHead(406, { "Content-Type": "text/plain" });
        response.end(`error: ${error.message}`);
    }
});

const port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
