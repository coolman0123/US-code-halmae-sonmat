const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'US-code-halmae-sonmat API 문서',
      version: '1.0.0',
      description: '할매의 손맛 프로젝트 API 문서',
    },
    servers: [

    { url: 'http://localhost:5001',                         description: 'Local'      }
    ],
  },
  apis: [
    './routes/*.js',
    './domains/**/routes/*.js'
  ],
};

const specs = swaggerJSDoc(options);

module.exports = specs;
