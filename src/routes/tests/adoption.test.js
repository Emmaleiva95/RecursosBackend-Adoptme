import { expect } from "chai";
import supertest from "supertest";
import sinon from "sinon";
import express from "express";
import { adoptionsService, petsService, usersService } from "../../services/index.js"


import router from "../adoption.router.js";

describe("mock router tests", () => {
  const app = express();
  app.use("/api/adoptions", router);
  const requester = supertest(app);

  afterEach(() => {
    sinon.restore();
  });

  describe("Adoption router test", () => {
    describe("get adoption tests", () => {
      it("should respond with 200 if adoption is found", async () => {
        const mockAdoption = 
          {
            _id: "1234",
            first_name: "userName1",
            last_name: "userLastName1",
            email: "email1@example.com",
            age: 30,
            role: "user",
            pets: [{
              name: "ayudante de santa",
              specie: "dog",
              adopted: true,
            }]
          }
        
        const expectedResponse = {
          status: 'success',
          payload: mockAdoption
        }
        sinon.stub(adoptionsService, "getBy").resolves(mockAdoption);
        const res = await requester.get("/api/adoptions/adoption-id");
        expect(res.body).to.deep.equal(expectedResponse);
        expect(res.status).to.equal(200);

      });
  
      it("should respond with 404 if adoption isn't found", async () => {
        const mockAdoption = null;
        sinon.stub(adoptionsService, "getBy").resolves(mockAdoption);
        const expectedResponse = {status:"error",error:"Adoption not found"}
        const res = await requester.get("/api/adoptions/invalid-adoption-id");
    
        expect(res.body).to.deep.equal(expectedResponse);
        expect(res.status).to.equal(404);
      });
    })

    describe("create adoption tests", () => {
      it("should respond with 404 if user doesn't exist", async () => {
        const mockUser = null;
        const expectedResponse = {status:"error", error:"user Not found"}
        sinon.stub(usersService, "getUserById").resolves(mockUser);
        const res = await requester.post("/api/adoptions/invalid-user-id/any-pet-id");
    
        expect(res.body).to.deep.equal(expectedResponse);
        expect(res.status).to.equal(404);
      });

      it("should respond with 404 if the user exists but the pet doesn't", async () => {
        const mockUser = {
          _id: "1234",
          first_name: "userName1",
          last_name: "userLastName1",
          email: "email1@example.com",
          age: 30,
          role: "user",
          pets: []
        };
        const mockPet = null
        const expectedResponse = {status:"error",error:"Pet not found"}
        sinon.stub(usersService, "getUserById").resolves(mockUser);
        sinon.stub(petsService, "getBy").resolves(mockPet);
        const res = await requester.post("/api/adoptions/any-user-id/invalid-pet-id");
    
        expect(res.body).to.deep.equal(expectedResponse);
        expect(res.status).to.equal(404);
      });

      it("should respond with 400 if user and pet exist but it is already adopted", async () => {
        const mockUser = {
          _id: "1234",
          first_name: "userName1",
          last_name: "userLastName1",
          email: "email1@example.com",
          age: 30,
          role: "user",
          pets: []
        };
        const mockPet = {
          name: "ayudante de santa",
          specie: "dog",
          adopted: true,
        }
        const expectedResponse = {status:"error",error:"Pet is already adopted"}
        sinon.stub(usersService, "getUserById").resolves(mockUser);
        sinon.stub(petsService, "getBy").resolves(mockPet);
        const res = await requester.post("/api/adoptions/any-user-id/adopted-pet-id");
    
        expect(res.body).to.deep.equal(expectedResponse);
        expect(res.status).to.equal(400);
      });

      it("should respond with 200 if pet and user exist and pet has not been adopted yet", async () => {
        const mockUser = {
          _id: "1234",
          first_name: "userName1",
          last_name: "userLastName1",
          email: "email1@example.com",
          age: 30,
          role: "user",
          pets: []
        };
        const mockPet = {
          name: "ayudante de santa",
          specie: "dog",
          adopted: false,
        }
        const expectedResponse = {status:"success",message:"Pet adopted"}
        sinon.stub(usersService, "getUserById").resolves(mockUser);
        sinon.stub(petsService, "getBy").resolves(mockPet);
        sinon.stub(usersService, "update").resolves({});
        sinon.stub(petsService, "update").resolves({});
        sinon.stub(adoptionsService, "create").resolves({});
        const res = await requester.post("/api/adoptions/any-user-id/adopted-pet-id");
        
        expect(res.body).to.deep.equal(expectedResponse);
        expect(res.status).to.equal(200);
        
      });
    })
  });  
});