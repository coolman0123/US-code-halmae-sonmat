const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API 문서',
      version: '1.0.0',
      description: 'Express + Swagger 예제',
    },
    servers: [
    { url: 'https://us-code-halmae-sonmat.onrender.com', description: 'Production' },
    { url: 'http://localhost:5001',                         description: 'Local'      }
    ],
  },
  apis: ['./routes/*.js'],
  apis: [ './domains/**/routes/*.js'],
};

const specs = swaggerJSDoc(options);

module.exports = specs;
