import {
  addAnnotation,
  getExpressionAnnotation,
  isAnnotated,
  setNotes,
  deleteAnnotation,
  searchByLabel,
  getAllAnnotations,
  clearAnnotations,
} from "./index";

beforeEach(() => clearAnnotations());

describe("addAnnotation", () => {
  it("stores and returns annotation", () => {
    const ann = addAnnotation("0 6 * * *", "Morning job", ["runs at 6am"], ["daily"]);
    expect(ann.label).toBe("Morning job");
    expect(ann.tags).toEqual(["daily"]);
  });
});

describe("isAnnotated", () => {
  it("returns false before annotation", () => {
    expect(isAnnotated("0 6 * * *")).toBe(false);
  });

  it("returns true after annotation", () => {
    addAnnotation("0 6 * * *", "Morning job");
    expect(isAnnotated("0 6 * * *")).toBe(true);
  });
});

describe("setNotes", () => {
  it("updates notes on annotated expression", () => {
    addAnnotation("*/10 * * * *", "Polling job");
    expect(setNotes("*/10 * * * *", ["polls every 10 minutes"])).toBe(true);
    const ann = getExpressionAnnotation("*/10 * * * *");
    expect(ann?.notes).toEqual(["polls every 10 minutes"]);
  });

  it("returns false for unknown expression", () => {
    expect(setNotes("0 0 0 0 0", ["note"])).toBe(false);
  });
});

describe("deleteAnnotation", () => {
  it("removes annotation and returns true", () => {
    addAnnotation("0 3 * * *", "Nightly");
    expect(deleteAnnotation("0 3 * * *")).toBe(true);
    expect(isAnnotated("0 3 * * *")).toBe(false);
  });
});

describe("searchByLabel", () => {
  it("returns matching annotations", () => {
    addAnnotation("0 9 * * 1", "Team Standup");
    addAnnotation("0 9 * * 3", "Team Sync");
    addAnnotation("0 0 1 * *", "Billing Run");
    expect(searchByLabel("team")).toHaveLength(2);
    expect(searchByLabel("billing")).toHaveLength(1);
  });
});

describe("getAllAnnotations", () => {
  it("returns empty array initially", () => {
    expect(getAllAnnotations()).toEqual([]);
  });

  it("returns all after inserts", () => {
    addAnnotation("0 1 * * *", "A");
    addAnnotation("0 2 * * *", "B");
    expect(getAllAnnotations()).toHaveLength(2);
  });
});
