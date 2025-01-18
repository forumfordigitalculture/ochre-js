import type { OchreData } from "../../types/internal.raw.d.ts";
import { parseIdentification, parseWebsite } from "../parse.js";

export async function fetchWebsite(abbreviation: string) {
  try {
    const response = await fetch(
      `https://ochre.lib.uchicago.edu/ochre?xquery=for $q in input()/ochre[tree[@type='lesson'][identification/abbreviation='${abbreviation.toLocaleLowerCase("en-US")}']] return $q&format=json`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch website");
    }

    const data = (await response.json()) as {
      result: OchreData | [];
    };

    if (!("ochre" in data.result) || !("tree" in data.result.ochre)) {
      throw new Error("Failed to fetch website");
    }

    const projectIdentification =
      data.result.ochre.metadata.project?.identification ?
        parseIdentification(data.result.ochre.metadata.project.identification)
      : null;

    const website = await parseWebsite(
      data.result.ochre.tree,
      projectIdentification?.label ?? "",
      data.result.ochre.metadata.project?.identification.website ?? null,
    );

    // eslint-disable-next-line no-console
    console.log("Website", website);

    return website;
  } catch (error) {
    console.error(error);
    return null;
  }
}
