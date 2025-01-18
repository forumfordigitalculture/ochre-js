import type { Data, Tree } from "../../types/main.js";
import { fetchByUuid } from "../fetchers/generic.js";
import { parseMetadata, parseTree } from "../parse.js";
import { parseFakeString } from "../string.js";

export async function fetchTree(uuid: string) {
  try {
    const [error, dataRaw] = await fetchByUuid(uuid);
    if (error !== null) {
      throw new Error(error);
    }

    if (!("tree" in dataRaw.ochre)) {
      throw new Error("Invalid OCHRE data: API response missing 'tree' key");
    }

    const tree = parseTree(dataRaw.ochre.tree);
    if (!tree) {
      throw new Error("Invalid OCHRE data: Could not parse tree");
    }

    const data: Omit<Data, "item"> & { item: Tree } = {
      uuid: parseFakeString(dataRaw.ochre.uuid),
      publicationDateTime: new Date(dataRaw.ochre.publicationDateTime),
      belongsTo: {
        uuid: dataRaw.ochre.uuidBelongsTo,
        abbreviation: parseFakeString(dataRaw.ochre.belongsTo),
      },
      metadata: parseMetadata(dataRaw.ochre.metadata),
      item: tree,
    };

    return { metadata: data.metadata, tree: data.item };
  } catch (error) {
    console.error(error);
    return null;
  }
}
