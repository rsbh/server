import Server from "../src/server";
import supertest from "supertest";

it("should get response from server", async (done) => {
  const server = new Server();
  const request = supertest(server.app);
  server.router.use({
    path: "/",
    method: "GET",
    handler: async (req, res) => {
      res.send("Test");
    },
  });
  const response = await request.get("/");
  expect(response.status).toBe(200);
  expect(response.text).toBe("Test");
  done();
});

it("should get 404 error response from server", async (done) => {
  const server = new Server();
  const request = supertest(server.app);
  server.router.use({
    path: "/",
    method: "GET",
    handler: async (req, res) => {
      res.send("Test");
    },
  });
  const response = await request.get("/test");
  expect(response.status).toBe(404);
  expect(response.body.message).toBe("Route GET:/test not found");
  done();
});
