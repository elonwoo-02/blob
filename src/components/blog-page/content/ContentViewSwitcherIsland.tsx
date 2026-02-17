import { useEffect } from "preact/hooks";

type ViewName = "article" | "moment" | "note";

interface Props {
  defaultView?: ViewName;
}

const VIEW_IDS: Record<ViewName, string> = {
  article: "article-view",
  moment: "moment-view",
  note: "note-view",
};

const ALL_VIEWS: ViewName[] = ["article", "moment", "note"];

const ContentViewSwitcherIsland = ({ defaultView = "article" }: Props) => {
  useEffect(() => {
    const applyView = (view: ViewName) => {
      ALL_VIEWS.forEach((name) => {
        const section = document.getElementById(VIEW_IDS[name]);
        if (!section) return;
        section.classList.toggle("hidden", name !== view);
      });
    };

    applyView(defaultView);

    const onViewChanged = (event: Event) => {
      const custom = event as CustomEvent<{ view?: string }>;
      const next = custom.detail?.view;
      if (!next || !ALL_VIEWS.includes(next as ViewName)) return;
      applyView(next as ViewName);
    };

    window.addEventListener("view-changed", onViewChanged as EventListener);
    return () => {
      window.removeEventListener(
        "view-changed",
        onViewChanged as EventListener,
      );
    };
  }, [defaultView]);

  return null;
};

export default ContentViewSwitcherIsland;
