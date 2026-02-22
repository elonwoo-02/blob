import { act, render, screen } from "@testing-library/preact";
import BlogHeatmapDetailsIsland from "../../src/components/blog-page/sidebar/BlogHeatmapDetailsIsland";
import type { HeatmapMatrix } from "../../src/components/blog-page/sidebar/heatmap/types";

const matrix: HeatmapMatrix = [
  [
    {
      date: "2026-02-21",
      count: 0,
      level: 0,
      items: [],
    },
    {
      date: "2026-02-22",
      count: 2,
      level: 1,
      items: [
        { type: "article", id: "a1", title: "Post A", date: "2026-02-22", url: "/posts/a1/" },
        { type: "note", id: "n1", title: "Note A", date: "2026-02-22" },
      ],
    },
    { date: "2026-02-23", count: 0, level: 0, items: [] },
    { date: "2026-02-24", count: 0, level: 0, items: [] },
    { date: "2026-02-25", count: 0, level: 0, items: [] },
    { date: "2026-02-26", count: 0, level: 0, items: [] },
    { date: "2026-02-27", count: 0, level: 0, items: [] },
  ],
];

describe("BlogHeatmapDetailsIsland", () => {
  it("shows selected day details and updates on custom event", () => {
    render(<BlogHeatmapDetailsIsland heatmap={matrix} initialSelectedDate="2026-02-21" />);

    expect(screen.getByText("2026-02-21")).toBeInTheDocument();
    expect(screen.getByText("No activity on this day.")).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(
        new CustomEvent("heatmap-day-selected", {
          detail: { date: "2026-02-22" },
        }),
      );
    });

    expect(screen.getByText("2026-02-22")).toBeInTheDocument();
    expect(screen.getByText("2 activities")).toBeInTheDocument();
    expect(screen.getByText("Post A")).toBeInTheDocument();
    expect(screen.getByText("Note A")).toBeInTheDocument();
  });
});

