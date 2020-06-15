import { removeAllDependencies } from "./removeAllDependencies";
import { removeKeys } from "./removeKeys";

jest.mock("./removeKeys");

test.concurrent(
  "calls remove keys with dependencies and devDependencies",
  async () => {
    await removeAllDependencies("foo/bar");

    expect(removeKeys).toHaveBeenCalledWith("foo/bar", [
      "dependencies",
      "devDependencies",
    ]);
  }
);
