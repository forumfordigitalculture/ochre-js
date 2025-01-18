import type { Data, Set } from "../../types/main.js";
import { fetchByUuid } from "../fetchers/generic.js";
import { parseMetadata, parseSet } from "../parse.js";
import { parseFakeString } from "../string.js";

export async function fetchSet(uuid: string) {
  try {
    const [error, dataRaw] = await fetchByUuid(uuid);
    if (error !== null) {
      throw new Error(error);
    }

    if (!("set" in dataRaw.ochre)) {
      throw new Error("Invalid OCHRE data: API response missing 'set' key");
    }

    const setItem = parseSet(dataRaw.ochre.set);

    const data: Omit<Data, "item"> & { item: Set } = {
      uuid: parseFakeString(dataRaw.ochre.uuid),
      publicationDateTime: new Date(dataRaw.ochre.publicationDateTime),
      belongsTo: {
        uuid: dataRaw.ochre.uuidBelongsTo,
        abbreviation: parseFakeString(dataRaw.ochre.belongsTo),
      },
      metadata: parseMetadata(dataRaw.ochre.metadata),
      item: setItem,
    };

    return { metadata: data.metadata, set: data.item };
  } catch (error) {
    console.error(error);
    return null;
  }
}
