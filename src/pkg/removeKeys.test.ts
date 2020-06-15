import { outputJson, readJSON } from "fs-extra";

import { removeKeys } from "./removeKeys";

jest.mock("fs-extra");
test.concurrent(
  "should remove uncool keys from package.json file",
  async () => {
    (readJSON as jest.Mock).mockResolvedValueOnce({
      cool: "cool",
      looser: "looser",
      uncool: "uncool",
      winner: "winner",
    });
    (outputJson as jest.Mock).mockResolvedValueOnce({});
    await removeKeys("foo/bar", ["uncool", "looser"]);
    expect(readJSON).toHaveBeenCalledWith("foo/bar/package.json");
    expect(outputJson).toHaveBeenCalledWith("foo/bar/package.json", {
      cool: "cool",
      winner: "winner",
    });
  }
);
