import { expect, it } from "vitest";
import { fetchWebsite } from "./utils/fetchers/website.js";

it("website", async () => {
  const website = await fetchWebsite("ospama");

  expect(website?.identification.label).toBe(
    "Gender and Politics in Early Modern European Republics (Venice, Genoa XV-XVIII centuries)",
  );
});
