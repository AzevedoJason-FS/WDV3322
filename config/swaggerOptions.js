const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Node JS Post API',
      version: '1.6.1',
      description: 'A user API with JSON Web Token Security'
    },
    servers: [
        {
            url: 'http://localhost:3001',
        },
    ],
    components:{
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security:[
        {
            bearerAuth: [],
        }
    ],
  },
  apis: ['api/routes/*.js'], // files containing annotations as above
};

module.exports = options;