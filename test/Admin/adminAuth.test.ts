import { expect } from "chai";
import request from "supertest";
import { Server } from "http";
import app from "../../src/index";
import { after, before } from "mocha";
   
    describe("admin login testing", () => {
    let server:Server;
     
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

    it("should return token with status 200 when admin login",async () => {
        const response = await request(server)
            .post("/api/admin/login")
            .send({ 
                email:"admin@gmail.com",
                password:"123456"
            });

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal(1);
        expect(response.body.token).to.not.be.empty;
    });

    it("should return status 401 with message Invalid Credential and body status 0",async ()=>{
        const response = await request(server)
            .post("/api/admin/login")
            .send({
                email:"wrong@wrong.com",
                password:"wrong"
            })

        expect(response.status).to.equal(401);
        expect(response.body.status).to.equal(0);
    });

    it("should return status 400 with message when parameter missing",async ()=>{
        const response = await request(server)
            .post("/api/admin/login")
            .send({
                password:"wrong"
            })

        expect(response.status).to.equal(400);
        expect(response.body.status).to.equal(0);
    });
});
