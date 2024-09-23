import request from "supertest";
import app from "../../src/index";

describe("Demo Test", () => {
  it("Should return hello world", async () => {
    const res = await request(app).get("/demo");
    expect(res.body).toEqual({ "hello": "world" });
  });
});