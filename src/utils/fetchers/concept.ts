import type { Concept, Data } from "../../types/main.js";
import { fetchByUuid } from "../fetchers/generic.js";
import { parseConcept, parseMetadata } from "../parse.js";
import { parseFakeString } from "../string.js";

export async function fetchConcept(uuid: string) {
  try {
    const [error, dataRaw] = await fetchByUuid(uuid);
    if (error !== null) {
      throw new Error(error);
    }

    if (!("concept" in dataRaw.ochre)) {
      throw new Error("Invalid OCHRE data: API response missing 'concept' key");
    }

    const conceptItem = parseConcept(dataRaw.ochre.concept);

    const data: Omit<Data, "item"> & { item: Concept } = {
      uuid: parseFakeString(dataRaw.ochre.uuid),
      publicationDateTime: new Date(dataRaw.ochre.publicationDateTime),
      belongsTo: {
        uuid: dataRaw.ochre.uuidBelongsTo,
        abbreviation: parseFakeString(dataRaw.ochre.belongsTo),
      },
      metadata: parseMetadata(dataRaw.ochre.metadata),
      item: conceptItem as Concept,
    };

    return { metadata: data.metadata, concept: data.item };
  } catch (error) {
    console.error(error);
    return null;
  }
}
