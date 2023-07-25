import { expect } from "chai"
import request from "supertest";
import { Server } from "http";
import app from "../src/index";
import { before, after } from "mocha";

describe("Server Test", () => {
    let server: Server; // Explicitly define the type of 'server'
  
    before((done: () => void) => { // Explicitly define the type of 'done'
      server = app.listen(0, () => {
        done();
      });
    });
  
    after((done: () => void) => { // Explicitly define the type of 'done'
      server.close(() => {
        done();
      });
    });
  
    it("should return Hi Anil for the root endpoint", async () => {
      const response = await request(server).get('/');
      expect(response.status).to.equal(200);
      expect(response.text).to.equal('Hi Anil');
    });
  
    it("should return 404 for invalid response", async () => {
      const response = await request(server).get('/invalid');
      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({
        status: 404,
        message: "Not Found",
      });
    });
  });