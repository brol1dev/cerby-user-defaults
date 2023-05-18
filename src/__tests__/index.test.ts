import { saveData, getData } from "../index";

describe("saveData", () => {
  it("should save data to the user defaults", async () => {
    const value = "test";
    const secure = false;

    await saveData(value, secure);

    const data = await getData(secure);
    expect(data).toEqual(value);
  });
});
