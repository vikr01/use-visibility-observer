import { act } from "@testing-library/react";
import { configMocks, mockIntersectionObserver } from "jsdom-testing-mocks";
import { beforeAll, afterAll, beforeEach, afterEach } from "vitest";

configMocks({
  act,
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
});

mockIntersectionObserver();
