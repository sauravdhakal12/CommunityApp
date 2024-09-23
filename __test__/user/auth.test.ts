import request from "supertest";
import app from "../../src/index";
import db from "../../src/utils/db";

/*
#############################
  USER AUTH FLOW
##############################
*/
describe("User Auth", () => {

  // REGISTER
  it("Should register a new user", async () => {
    const res = await request(app).post("user/auth/register");

    // TODO
    expect(res.body).toEqual("smth");
  });


  // LOGIN
  it("Should signup a new user", async () => {
    const res = await request(app).post("user/auth/login");

    // TODO
    expect(res.body).toEqual("smth");
  });


  // LOGOUT
  it("Should logout loggedin user", async () => {
    const res = await request(app).post("/user/auth/logout");

    //TODO
    expect(res.body).toEqual("smth");
  });

  // TODO: CLEAN DB AFTER TEST
  it("Should remove new registered user", async () => {
    const res = db("DELETE FROM \"users\" WHERE email='smth' ");
  });
});