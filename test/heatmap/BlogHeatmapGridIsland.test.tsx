import { fireEvent, render, screen } from "@testing-library/preact";
import BlogHeatmapGridIsland from "../../src/components/blog-page/sidebar/BlogHeatmapGridIsland";
import type { HeatmapMatrix } from "../../src/components/blog-page/sidebar/heatmap/types";

const createMatrix = (): HeatmapMatrix => [
  [
    { date: "2026-02-16", count: 0, level: 0, items: [] },
    { date: "2026-02-17", count: 1, level: 1, items: [{ type: "note", id: "n1", title: "N1", date: "2026-02-17" }] },
    { date: "2026-02-18", count: 0, level: 0, items: [] },
    { date: "2026-02-19", count: 0, level: 0, items: [] },
    { date: "2026-02-20", count: 2, level: 1, items: [{ type: "article", id: "a1", title: "A1", date: "2026-02-20", url: "/posts/a1/" }, { type: "moment", id: "m1", title: "M1", date: "2026-02-20" }] },
    { date: "2026-02-21", count: 0, level: 0, items: [] },
    { date: "2026-02-22", count: 0, level: 0, items: [] },
  ],
];

describe("BlogHeatmapGridIsland", () => {
  it("uses white class for zero-activity cells", () => {
    const heatmap = createMatrix();
    render(<BlogHeatmapGridIsland heatmap={heatmap} initialSelectedDate="2026-02-22" />);

    const zeroCell = screen.getByLabelText("2026-02-16 0 activities");
    expect(zeroCell.className).toContain("hm-level-0");
    expect(zeroCell.className).not.toContain("hm-level-1");
  });

  it("renders heatmap cells and dispatches selected event on click", () => {
    const heatmap = createMatrix();
    const listener = vi.fn();
    window.addEventListener("heatmap-day-selected", listener as EventListener);

    render(<BlogHeatmapGridIsland heatmap={heatmap} initialSelectedDate="2026-02-22" />);
    const cell = screen.getByLabelText("2026-02-20 1 activity");
    fireEvent.click(cell);

    expect(listener).toHaveBeenCalledTimes(1);
    const event = listener.mock.calls[0][0] as CustomEvent<{ date: string }>;
    expect(event.detail.date).toBe("2026-02-20");

    window.removeEventListener("heatmap-day-selected", listener as EventListener);
  });
});
