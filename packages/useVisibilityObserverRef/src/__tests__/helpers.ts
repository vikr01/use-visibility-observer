async function triggerWindowEvent(
  event: Parameters<typeof window.addEventListener>[0],
) {
  const promise = new Promise<void>((resolve) => {
    const fn = () => {
      resolve();
      window.removeEventListener(event, fn);
    };

    window.addEventListener(event, fn);
  });

  window.dispatchEvent(new Event(event));

  await promise;
}

export async function hideWindow() {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    get: () => "hidden" as DocumentVisibilityState,
  });

  await triggerWindowEvent("visibilitychange");
}

export async function restoreWindow() {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    get: () => "visible" as DocumentVisibilityState,
  });

  await triggerWindowEvent("visibilitychange");
}
