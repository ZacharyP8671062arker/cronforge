import {
  annotateExpression,
  getAnnotation,
  updateNotes,
  removeAnnotation,
  listAnnotations,
  findAnnotationsByLabel,
  clearAnnotations,
} from "./cronAnnotator";

beforeEach(() => clearAnnotations());

describe("annotateExpression", () => {
  it("creates a new annotation", () => {
    const ann = annotateExpression("0 9 * * 1", "Weekly standup", ["every Monday at 9am"]);
    expect(ann.expression).toBe("0 9 * * 1");
    expect(ann.label).toBe("Weekly standup");
    expect(ann.notes).toEqual(["every Monday at 9am"]);
    expect(ann.createdAt).toBeInstanceOf(Date);
  });

  it("preserves createdAt on update", () => {
    const first = annotateExpression("0 9 * * 1", "Old label");
    const second = annotateExpression("0 9 * * 1", "New label");
    expect(second.createdAt).toEqual(first.createdAt);
    expect(second.label).toBe("New label");
  });
});

describe("getAnnotation", () => {
  it("returns undefined for unknown expression", () => {
    expect(getAnnotation("* * * * *")).toBeUndefined();
  });

  it("returns stored annotation", () => {
    annotateExpression("*/5 * * * *", "Every 5 min");
    const ann = getAnnotation("*/5 * * * *");
    expect(ann?.label).toBe("Every 5 min");
  });
});

describe("updateNotes", () => {
  it("returns false when expression not found", () => {
    expect(updateNotes("0 0 * * *", ["midnight"])).toBe(false);
  });

  it("updates notes and updatedAt", () => {
    annotateExpression("0 0 * * *", "Midnight job");
    const result = updateNotes("0 0 * * *", ["runs at midnight UTC"]);
    expect(result).toBe(true);
    const ann = getAnnotation("0 0 * * *");
    expect(ann?.notes).toEqual(["runs at midnight UTC"]);
  });
});

describe("removeAnnotation", () => {
  it("removes an existing annotation", () => {
    annotateExpression("0 12 * * *", "Noon");
    expect(removeAnnotation("0 12 * * *")).toBe(true);
    expect(getAnnotation("0 12 * * *")).toBeUndefined();
  });

  it("returns false for non-existent", () => {
    expect(removeAnnotation("1 2 3 4 5")).toBe(false);
  });
});

describe("listAnnotations", () => {
  it("returns all stored annotations", () => {
    annotateExpression("0 1 * * *", "A");
    annotateExpression("0 2 * * *", "B");
    expect(listAnnotations()).toHaveLength(2);
  });
});

describe("findAnnotationsByLabel", () => {
  it("finds by partial label match (case-insensitive)", () => {
    annotateExpression("0 9 * * 1", "Weekly Standup");
    annotateExpression("0 17 * * 5", "Weekly Review");
    annotateExpression("0 0 1 * *", "Monthly Report");
    const results = findAnnotationsByLabel("weekly");
    expect(results).toHaveLength(2);
  });
});
