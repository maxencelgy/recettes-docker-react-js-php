const request = require('supertest');
const app = require('../app'); // Importez app.js au lieu de server.js

describe('GET /api/test', () => {
    it('should return a success message', async () => {
        const res = await request(app).get('/api/test');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Express API OK');
    });
});
