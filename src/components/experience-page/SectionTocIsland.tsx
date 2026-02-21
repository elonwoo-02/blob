import { useEffect } from "preact/hooks";

const ACTIVE_LINK_CLASSES = [
  "border-slate-900",
  "text-slate-900",
  "font-semibold",
  "bg-white/60",
];

const INACTIVE_LINK_CLASSES = [
  "border-transparent",
  "text-slate-500",
  "font-normal",
  "bg-transparent",
];

const SectionTocIsland = () => {
  useEffect(() => {
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>("[data-toc-link][data-target-id]"),
    );

    if (!links.length) return;

    const sectionEntries = links
      .map((link) => {
        const id = link.dataset.targetId;
        if (!id) return null;
        const section = document.getElementById(id);
        if (!section) return null;
        return { id, link, section };
      })
      .filter((entry): entry is { id: string; link: HTMLAnchorElement; section: HTMLElement } => !!entry);

    if (!sectionEntries.length) return;

    let activeId = "";
    const visibilityById = new Map<string, number>();

    const paintActive = (id: string) => {
      if (activeId === id) return;
      activeId = id;

      sectionEntries.forEach((entry) => {
        const isActive = entry.id === activeId;
        entry.link.classList.remove(...(isActive ? INACTIVE_LINK_CLASSES : ACTIVE_LINK_CLASSES));
        entry.link.classList.add(...(isActive ? ACTIVE_LINK_CLASSES : INACTIVE_LINK_CLASSES));
        if (isActive) {
          entry.link.setAttribute("aria-current", "true");
        } else {
          entry.link.removeAttribute("aria-current");
        }
      });
    };

    // Initial paint.
    paintActive(sectionEntries[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          const id = target.id;
          if (!id) return;
          visibilityById.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        let nextId = activeId;
        let bestRatio = -1;

        sectionEntries.forEach((entry) => {
          const ratio = visibilityById.get(entry.id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            nextId = entry.id;
          }
        });

        if (bestRatio <= 0) {
          const fromTop = sectionEntries.find((entry) => entry.section.getBoundingClientRect().top >= 120);
          nextId = fromTop?.id ?? sectionEntries[sectionEntries.length - 1].id;
        }

        paintActive(nextId);
      },
      {
        root: null,
        threshold: [0.15, 0.3, 0.5, 0.75],
        rootMargin: "-15% 0px -55% 0px",
      },
    );

    sectionEntries.forEach((entry) => observer.observe(entry.section));

    return () => observer.disconnect();
  }, []);

  return null;
};

export default SectionTocIsland;
