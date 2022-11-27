import swaggerUi from "swagger-ui-express";
import swaggereJsdoc from "swagger-jsdoc";


const options = {
    swaggerDefinition: {
        info: {
            title: 'Daisy API',
            version: '1.0.0',
            description: 'Test API with express',
        },
        host: 'localhost:3000',
        basePath: '/'
    },
    apis: [
        "./src/*.js",
        "./src/route/*.js"
    ]
};

const specs = swaggereJsdoc(options);

module.exports = {
    swaggerUi,
    specs
};