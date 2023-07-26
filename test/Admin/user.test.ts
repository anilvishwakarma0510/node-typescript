import { expect } from "chai";
import request from "supertest";
import { after, before} from "mocha";
import app from "../../src/index";
import { Server } from "http";

describe("create user testing", ()=>{
    let server:Server;
    let lastUserId:string;
    let validToken:string;

    let email:string = new Date().getTime()+"@test.com";
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

        validToken = response.body.token
    });

    it("it should return 400 when parameter is missing", async ()=>{
        const response = await request(server)
            .post('/api/admin/add-user')
            .set('Authorization', `Bearer ${validToken}`);
            

        expect(response.status).to.equal(400)
        expect(response.body.status).to.equal(0);
        expect(response.body.message).to.equal("check parameter")
    });

    it("it should return 200 when user created", async ()=>{
        const response = await request(server)
            .post('/api/admin/add-user')
            .set('Authorization', `Bearer ${validToken}`)
            .send({
              first_name:"Anil",
              last_name:"Vishwakarma",
              email:email,
              password:"12345678",
              gender:"male"
            });

        expect(response.status).to.equal(200)
        expect(response.body.status).to.equal(1);
        //console.log("🚀 ~ file: user.test.ts:67 ~ it ~ response:", response)

        lastUserId = response.body.data._id
        
    });

    it("it should return 400 when email already exist", async ()=>{
        const response = await request(server)
            .post('/api/admin/add-user')
            .set('Authorization', `Bearer ${validToken}`)
            .send({
              first_name:"Anil",
              last_name:"Vishwakarma",
              email:email,
              password:"12345678",
              gender:"male"
            });

        expect(response.status).to.equal(400)
        expect(response.body.status).to.equal(0);
        expect(response.body.message).to.equal("Email already exist")
    });

    it("it should return 200 when edit user ", async ()=>{
        const response = await request(server)
            .post('/api/admin/edit-user')
            .set('Authorization', `Bearer ${validToken}`)
            .send({
              first_name:"Anil 2",
              last_name:"Vishwakarma",
              email:email,
              password:"12345678",
              gender:"male",
              id:lastUserId
            });

        expect(response.status).to.equal(200)
        expect(response.body.status).to.equal(1);
    });

    it("it should return 500 when wrong id passed when delete user", async ()=>{
        const response = await request(server)
            .get('/api/admin/delete-user?id=24234234')
            .set('Authorization', `Bearer ${validToken}`);

        expect(response.status).to.equal(500)
        expect(response.body.status).to.equal(0);
    });

    it("it should return 200 when delete user", async ()=>{
        const response = await request(server)
            .get('/api/admin/delete-user?id='+lastUserId)
            .set('Authorization', `Bearer ${validToken}`);

        expect(response.status).to.equal(200)
        expect(response.body.status).to.equal(1);
    });

    it("it should return 200 when get users", async ()=>{
        const response = await request(server)
            .get('/api/admin/get-users')
            .set('Authorization', `Bearer ${validToken}`);

        expect(response.status).to.equal(200)
        expect(response.body.status).to.equal(1);
    });
})