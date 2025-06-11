const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API 문서',
      version: '1.0.0',
      description: 'Express + Swagger 예제',
    },
    servers: [{ url: 'http://localhost:5000' }],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJSDoc(options);

module.exports = specs;
