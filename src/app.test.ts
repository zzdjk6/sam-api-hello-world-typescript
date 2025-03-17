import { lambdaHandler } from "./app";

it("should return 200", async () => {
  const result = await lambdaHandler({} as any);
  expect(result).toHaveProperty("statusCode", 200);
});
