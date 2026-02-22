import {
  buildHeatmapMatrix,
  calcLevel,
  collectActivityRecords,
  toDateKey,
} from "../../src/components/blog-page/sidebar/heatmap/buildHeatmapData";
import type { ActivityRecord } from "../../src/components/blog-page/sidebar/heatmap/types";

describe("buildHeatmapData", () => {
  it("calculates level by count thresholds", () => {
    expect(calcLevel(0)).toBe(0);
    expect(calcLevel(1)).toBe(1);
    expect(calcLevel(2)).toBe(2);
    expect(calcLevel(3)).toBe(3);
    expect(calcLevel(4)).toBe(4);
    expect(calcLevel(5)).toBe(4);
    expect(calcLevel(9)).toBe(4);
  });

  it("collects records from article, note and moment", () => {
    const records = collectActivityRecords({
      posts: [
        {
          id: "post-1",
          data: { title: "Post 1", pubDate: new Date("2026-02-20T08:00:00") },
        },
      ],
      notes: [{ id: "note-1", title: "Note 1", date: new Date("2026-02-20T09:00:00") }],
      moments: [
        {
          id: "m-1",
          name: "Elon",
          text: "Moment text",
          createdAt: "2026-02-20T10:00:00+08:00",
        },
      ],
    });

    expect(records).toHaveLength(3);
    expect(records.map((item) => item.type).sort()).toEqual(["article", "moment", "note"]);
  });

  it("builds 12x7 matrix and maps date activity correctly", () => {
    const now = new Date("2026-02-22T00:00:00");
    const targetDate = "2026-02-20";
    const records: ActivityRecord[] = [
      { type: "article", id: "a1", title: "A1", date: targetDate, url: "/posts/a1/" },
      { type: "note", id: "n1", title: "N1", date: targetDate },
      { type: "moment", id: "m1", title: "M1", date: targetDate },
    ];

    const matrix = buildHeatmapMatrix(records, now, 12);
    expect(matrix).toHaveLength(12);
    matrix.forEach((week) => expect(week).toHaveLength(7));

    const flattened = matrix.flat();
    expect(flattened).toHaveLength(84);
    expect(flattened[0].date).toBe(toDateKey(new Date("2025-12-01T00:00:00")));
    expect(flattened[83].date).toBe("2026-02-22");

    const day = flattened.find((item) => item.date === targetDate);
    expect(day).toBeDefined();
    expect(day?.count).toBe(3);
    expect(day?.level).toBe(3);
    expect(day?.items).toHaveLength(3);
  });
});
