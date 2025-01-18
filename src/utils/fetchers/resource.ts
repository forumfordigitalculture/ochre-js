import type { Data, Resource } from "../../types/main.js";
import { fetchByUuid } from "../fetchers/generic.js";
import { parseMetadata, parseResource } from "../parse.js";
import { parseFakeString } from "../string.js";

export async function fetchResource(uuid: string) {
  try {
    const [error, dataRaw] = await fetchByUuid(uuid);
    if (error !== null) {
      throw new Error(error);
    }

    if (!("resource" in dataRaw.ochre)) {
      throw new Error(
        "Invalid OCHRE data: API response missing 'resource' key",
      );
    }

    const resourceItem = parseResource(dataRaw.ochre.resource);

    const data: Omit<Data, "item"> & { item: Resource } = {
      uuid: parseFakeString(dataRaw.ochre.uuid),
      publicationDateTime: new Date(dataRaw.ochre.publicationDateTime),
      belongsTo: {
        uuid: dataRaw.ochre.uuidBelongsTo,
        abbreviation: parseFakeString(dataRaw.ochre.belongsTo),
      },
      metadata: parseMetadata(dataRaw.ochre.metadata),
      item: resourceItem as Resource,
    };

    return { metadata: data.metadata, resource: data.item };
  } catch (error) {
    console.error(error);
    return null;
  }
}
