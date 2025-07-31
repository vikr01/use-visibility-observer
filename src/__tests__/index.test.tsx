import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, it, expect, vi } from "vitest";
import { useMergeRefs } from "use-callback-ref";

import useVisibilityObserverRef from "..";
import type { RefObject } from "react";

describe("useVisibilityObserverRef", () => {
  afterEach(() => {
    cleanup();
  });

  const onShow = vi.fn(() => {});
  const onHide = vi.fn(() => {});

  const constStyle = { height: 100, width: 100 };

  const containerRef: RefObject<HTMLDivElement | null> = { current: null };
  const bufferRef: RefObject<HTMLDivElement | null> = { current: null };
  const targetRef: RefObject<HTMLDivElement | null> = { current: null };

  function TestComponent() {
    const visRef = useVisibilityObserverRef<HTMLDivElement>({ onShow, onHide });
    const mergeRef = useMergeRefs([visRef, targetRef]);

    return (
      <div style={{ ...constStyle, overflow: "scroll" }} ref={containerRef}>
        <div style={constStyle} ref={bufferRef} />
        <div style={constStyle} ref={mergeRef} />
      </div>
    );
  }

  render(<TestComponent />);

  it("does not invoke onShow/onHide on the initial render", () => {
    expect(containerRef.current).not.toBeNull();
    expect(bufferRef.current).not.toBeNull();
    expect(targetRef.current).not.toBeNull();

    expect(onShow).not.toHaveBeenCalled();
    expect(onHide).not.toHaveBeenCalled();
  });
});
