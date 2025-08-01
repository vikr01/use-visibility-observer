import { act, cleanup, render, waitFor } from "@testing-library/react";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  it,
  expect,
  vi,
} from "vitest";
import { mockIntersectionObserver } from "jsdom-testing-mocks";
import { useMergeRefs } from "use-callback-ref";
import { hideWindow, restoreWindow } from "./helpers";

import useVisibilityObserverRef from "..";
import type { RefObject } from "react";

const onShow = vi.fn();
const onHide = vi.fn();

describe("useVisibilityObserverRef", () => {
  beforeAll(async () => {
    render(<TestComponent />);

    await waitFor(() => {
      if (
        containerRef.current == null ||
        targetRef.current == null ||
        bufferRef.current == null
      ) {
        throw new Error("refs not ready");
      }
    });
  });

  afterEach(async () => {
    await restoreWindow();

    vi.resetAllMocks();
  });

  afterAll(() => {
    cleanup();
  });

  it("does not invoke onShow/onHide on the initial render", () => {
    expect(containerRef.current).not.toBeNull();
    expect(bufferRef.current).not.toBeNull();
    expect(targetRef.current).not.toBeNull();

    expect(onShow).not.toHaveBeenCalled();
    expect(onHide).not.toHaveBeenCalled();
  });

  it("triggers onShow when it is scrolled into view", async () => {
    await scrollIntoView();

    expect(onShow).toHaveBeenCalledTimes(1);
    expect(onHide).not.toHaveBeenCalled();
  });

  it("triggers onHide when it is scrolled out of view", async () => {
    await scrollOutOfView();

    expect(onHide).toHaveBeenCalledTimes(1);
    expect(onShow).not.toHaveBeenCalled();
  });

  it("triggers onHide if the window is hidden when the element was in the viewport", async () => {
    await scrollIntoView();
    vi.resetAllMocks();

    await hideWindow();

    expect(onHide).toHaveBeenCalledTimes(1);
    expect(onShow).not.toHaveBeenCalled();
  });
});

const io = mockIntersectionObserver();

const BOX_SIZE = 100;
const constStyle = { height: BOX_SIZE, width: BOX_SIZE };

const containerRef: RefObject<HTMLDivElement | null> = { current: null };
const bufferRef: RefObject<HTMLDivElement | null> = { current: null };
const targetRef: RefObject<HTMLDivElement | null> = { current: null };

async function scrollIntoView() {
  if (targetRef.current == null) {
    throw new Error("Target element is not rendered.");
  }

  const target = targetRef.current;

  await act<void>(() => {
    io.enterNode(target);
  });
}

async function scrollOutOfView() {
  if (targetRef.current == null) {
    throw new Error("Target element is not rendered.");
  }

  const target = targetRef.current;

  await act<void>(() => {
    io.leaveNode(target);
  });
}

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
