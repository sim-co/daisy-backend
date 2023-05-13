import swaggereJsdoc from "swagger-jsdoc";

const options = {
    swaggerDefinition: {
        openapi: "3.0.3",
        info: {
            title: 'Daisy API',
            version: '1.0.1',
            description: 'Dasiy API with node.js express',
        },
        host: 'localhost:3000',
        basePath: '/'
    },
    apis: [
        "./src/**/*.js",
        "./src/route/**/*.js"
    ]
};

export const specs = swaggereJsdoc(options);