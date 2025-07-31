import type { Ref } from "react";
import { useEffect, useRef } from "react";
import type { RequireAtLeastOne } from "type-fest";

type Options = Readonly<{
  onHide?: () => void;
  onShow?: () => void;
}>;

type AtLeastOneOfOptions = RequireAtLeastOne<Options, "onShow" | "onHide">;

export default function useVisibilityObserverRef<
  T extends HTMLElement = HTMLElement,
>({ onHide, onShow }: AtLeastOneOfOptions): Ref<T | null> {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<T | null>(null);
  const unsubRef = useRef<(() => void) | null>(null);
  const isVisibleRef = useRef<boolean>(false);
  const visibilityChangeListenerRef = useRef<(() => void) | null>(null);

  const onShowRef = useRef<Options["onShow"]>(onShow);
  onShowRef.current = onShow;

  const onHideRef = useRef<Options["onHide"]>(onHide);
  onHideRef.current = onHide;

  if (visibilityChangeListenerRef.current == null) {
    visibilityChangeListenerRef.current = () => {
      if (document.visibilityState === "hidden") {
        if (isVisibleRef.current === true) {
          onHideRef.current?.();
        }
      }

      if (document.visibilityState === "visible") {
        if (isVisibleRef.current === true) {
          onShowRef.current?.();
        }
      }
    };

    window.addEventListener(
      "visibilitychange",
      visibilityChangeListenerRef.current!,
    );
  }

  if (observerRef.current == null) {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onShowRef.current?.();
        } else {
          onHideRef.current?.();
        }
      },
      {
        // if even 5% of the element has entered the viewport, we'll trigger the observer
        threshold: 0.05,
      },
    );
  }
  const observer = observerRef.current;

  useEffect(
    () => () => {
      unsubRef.current?.();
      window.removeEventListener(
        "visibilitychange",
        visibilityChangeListenerRef.current!,
      );

      visibilityChangeListenerRef.current = null;
    },
    [],
  );

  const callbackRefRef = useRef<((el: T | null) => void) | null>(null);

  if (callbackRefRef.current == null) {
    callbackRefRef.current = (el: T | null) => {
      if (elementRef.current === el) {
        return;
      }

      if (elementRef.current != null) {
        unsubRef.current?.();
      }

      if (el != null) {
        observer.observe(el);

        unsubRef.current = () => {
          observer.observe(el);
        };
      }
      elementRef.current = el;
    };
  }

  return callbackRefRef.current!;
}
