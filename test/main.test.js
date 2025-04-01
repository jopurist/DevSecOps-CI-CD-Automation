import { expect } from "chai";
import app  from "../server.js";
import {agent as request} from "supertest";
import axios from "axios";
import sinon from "sinon";
import 'dotenv/config';

const port = process.env.PORT || 8080;

let axiosStub;

before(() => {
    axiosStub = sinon.stub(axios, "get");
});

after(() => {
    axiosStub.restore();
});

describe("Root API path test", () => {

    it('should always pass', function () {
        expect(true).to.equal(true);
      });
      
      it("GET /healthz", async () => {
          const res = await request(app).get("/healthz");
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal("OK");
      });

    it("GET /readyz", async () => {
        axiosStub.withArgs(`http://localhost:${port}/healthz`).resolves({ status: 200 });
        const res = await request(app).get("/readyz");
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("Ready");
    });

    it("POST /request type of string", async () => {
        const res = await request(app).post("/request").send({"data": "string data"});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).not.to.be.empty;
        expect(res.body.data).to.be.an("string");
        expect(res.body.error).to.be.undefined;
    });

    it("POST /request type of number", async () => {
        const res = await request(app).post("/request").send({"data": 10});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).not.to.be.null;
        expect(res.body.data).to.be.an("number");
        expect(res.body.error).to.be.undefined;
    });

    it("POST /request type of boolean", async () => {
        const res = await request(app).post("/request").send({"data": true});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).not.to.be.null;
        expect(res.body.data).to.be.an("boolean");
        expect(res.body.error).to.be.undefined;
    });

    it("POST /request type of multiple data", async () => {
        const res = await request(app).post("/request").send({"data": "string data", "count": 10, "status": true});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).not.to.be.empty;
        expect(res.body.error).to.be.undefined;
    });
});

describe("API path test not Allowed method", () => {
    it("POST /healthz", async () => {
        const res = await request(app).post("/healthz");
        expect(res.status).to.equal(405);
    });

    it("POST /readyz", async () => {
        axiosStub.withArgs(`http://localhost:${port}/healthz`).resolves({ status: 405 });
        const res = await request(app).post("/readyz");
        expect(res.status).to.equal(405);
    });

    it("GET /request", async () => {
        const res = await request(app).get("/request").send({"data": "string data"});
        expect(res.status).to.equal(405);
    });
});

