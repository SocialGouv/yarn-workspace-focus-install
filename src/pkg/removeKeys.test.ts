import { outputJson, readJSON } from "fs-extra";
import { join } from "path";

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
    const file = join("foo/bar/package.json");

    await removeKeys("foo/bar", ["uncool", "looser"]);

    expect(readJSON).toHaveBeenCalledWith(file);
    expect(outputJson).toHaveBeenCalledWith(file, {
      cool: "cool",
      winner: "winner",
    });
  }
);
