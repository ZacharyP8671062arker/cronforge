import {
  addTag,
  dropTag,
  getTagsOf,
  findByTag,
  listAllTags,
  hasTag,
  listTaggedExpressions,
  clearTagStore,
} from "./index";

beforeEach(() => {
  clearTagStore();
});

describe("addTag", () => {
  it("should accept a single tag string", () => {
    const result = addTag("0 * * * *", "hourly");
    expect(result.tags).toContain("hourly");
  });

  it("should accept an array of tags", () => {
    const result = addTag("0 * * * *", ["hourly", "prod"]);
    expect(result.tags).toContain("hourly");
    expect(result.tags).toContain("prod");
  });

  it("should attach a label", () => {
    const result = addTag("0 0 * * *", "daily", "Daily cleanup");
    expect(result.label).toBe("Daily cleanup");
  });
});

describe("dropTag", () => {
  it("should remove a specific tag", () => {
    addTag("0 * * * *", ["hourly", "dev"]);
    dropTag("0 * * * *", "dev");
    expect(getTagsOf("0 * * * *")).not.toContain("dev");
  });
});

describe("hasTag", () => {
  it("should return true when tag is present", () => {
    addTag("0 * * * *", "hourly");
    expect(hasTag("0 * * * *", "hourly")).toBe(true);
  });

  it("should return false when tag is absent", () => {
    addTag("0 * * * *", "hourly");
    expect(hasTag("0 * * * *", "daily")).toBe(false);
  });
});

describe("findByTag", () => {
  it("should find expressions by tag", () => {
    addTag("0 * * * *", "hourly");
    addTag("*/5 * * * *", "hourly");
    addTag("0 0 * * *", "daily");
    expect(findByTag("hourly").length).toBe(2);
  });
});

describe("listAllTags", () => {
  it("should return all unique tags across expressions", () => {
    addTag("0 * * * *", ["hourly", "prod"]);
    addTag("0 0 * * *", ["daily"]);
    const tags = listAllTags();
    expect(tags).toContain("hourly");
    expect(tags).toContain("daily");
    expect(tags).toContain("prod");
  });
});
