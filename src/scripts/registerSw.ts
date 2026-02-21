let registered = false;

export const registerAppServiceWorker = async () => {
  if (registered || typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  if (!window.isSecureContext && window.location.hostname !== "localhost") return;

  registered = true;
  try {
    await navigator.serviceWorker.register("/sw.js");
  } catch (error) {
    console.warn("[sw] failed to register", error);
  }
};

