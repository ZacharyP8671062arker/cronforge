import {
  tagExpression,
  removeTag,
  getTagsForExpression,
  getExpressionsByTag,
  getAllTags,
  clearTagStore,
  listTaggedExpressions,
} from "./cronTagger";

beforeEach(() => {
  clearTagStore();
});

describe("tagExpression", () => {
  it("should tag a new expression", () => {
    const result = tagExpression("0 * * * *", ["hourly", "monitoring"]);
    expect(result.expression).toBe("0 * * * *");
    expect(result.tags).toContain("hourly");
    expect(result.tags).toContain("monitoring");
  });

  it("should merge tags on re-tagging", () => {
    tagExpression("0 * * * *", ["hourly"]);
    const result = tagExpression("0 * * * *", ["monitoring"]);
    expect(result.tags).toContain("hourly");
    expect(result.tags).toContain("monitoring");
  });

  it("should deduplicate tags", () => {
    tagExpression("0 * * * *", ["hourly"]);
    const result = tagExpression("0 * * * *", ["hourly"]);
    expect(result.tags.filter((t) => t === "hourly").length).toBe(1);
  });

  it("should store a label", () => {
    const result = tagExpression("0 0 * * *", ["daily"], "Midnight reset");
    expect(result.label).toBe("Midnight reset");
  });
});

describe("removeTag", () => {
  it("should remove a tag from an expression", () => {
    tagExpression("0 * * * *", ["hourly", "prod"]);
    removeTag("0 * * * *", "prod");
    expect(getTagsForExpression("0 * * * *")).not.toContain("prod");
  });

  it("should return false for unknown expression", () => {
    expect(removeTag("9 9 9 9 9", "missing")).toBe(false);
  });
});

describe("getExpressionsByTag", () => {
  it("should return all expressions with a given tag", () => {
    tagExpression("0 * * * *", ["hourly"]);
    tagExpression("0 0 * * *", ["daily"]);
    tagExpression("*/5 * * * *", ["hourly"]);
    const results = getExpressionsByTag("hourly");
    expect(results.length).toBe(2);
  });
});

describe("getAllTags", () => {
  it("should return sorted unique tags", () => {
    tagExpression("0 * * * *", ["hourly", "prod"]);
    tagExpression("0 0 * * *", ["daily", "prod"]);
    const tags = getAllTags();
    expect(tags).toEqual(["daily", "hourly", "prod"]);
  });
});

describe("listTaggedExpressions", () => {
  it("should list all stored entries", () => {
    tagExpression("0 * * * *", ["hourly"]);
    tagExpression("0 0 * * *", ["daily"]);
    expect(listTaggedExpressions().length).toBe(2);
  });
});
