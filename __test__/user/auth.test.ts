import request from "supertest";
import app from "../../src/index";
import db from "../../src/utils/db";
import { pool } from "../../src/utils/db";

/*
#############################
  USER AUTH FLOW
##############################
*/
describe("User Auth", () => {
  const name = "demo-user";
  const email = "demouser@gmail.com";
  const password = "1234567";

  // REGISTER
  it("Should register a new user", async () => {
    const res = await request(app).post("/user/auth/register").send({
      name: name,
      email: email,
      password: password,
    }).set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(res.body.success).toBe(true);
  });

  it("ERROR: Password constrain", async () => {
    const res = await request(app).post("/user/auth/register").send({
      name: name,
      email: email,
      password: password,
    }).set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User with this email already exists");
  });

  // // LOGIN
  // it("Should signup a new user", async () => {
  //   const res = await request(app).post("user/auth/login");

  //   // TODO
  //   expect(res.body).toEqual("smth");
  // });


  // // LOGOUT
  // it("Should logout loggedin user", async () => {
  //   const res = await request(app).post("/user/auth/logout");

  //   //TODO
  //   expect(res.body).toEqual("smth");
  // });

  // TODO: CLEAN DB AFTER TEST
  // it("Should remove new registered user", async () => {
  //   const res = await db("DELETE FROM \"users\" WHERE email='demouser@gmail.com' ");
  //   console.log(res);
  //   expect(res.rowCount).toBe(1);
  // });

  afterAll(async () => {
    await db("DELETE FROM \"users\" WHERE email=$1", [email]);
    await pool.end();
  });
});