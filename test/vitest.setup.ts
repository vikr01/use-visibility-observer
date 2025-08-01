import { configMocks, mockIntersectionObserver } from "jsdom-testing-mocks";
import { beforeAll, afterAll, beforeEach, afterEach } from "vitest";

configMocks({
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
});

mockIntersectionObserver();
