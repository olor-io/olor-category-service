// Use process.env as the only channel of input which
// can be given to the server application

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 80;

// This is used in URLs
process.env.API_VERSION = 'v1';
