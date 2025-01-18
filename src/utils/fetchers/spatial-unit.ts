import type { Data, SpatialUnit } from "../../types/main.js";
import { fetchByUuid } from "../fetchers/generic.js";
import { parseMetadata, parseSpatialUnit } from "../parse.js";
import { parseFakeString } from "../string.js";

export async function fetchSpatialUnit(uuid: string) {
  try {
    const [error, dataRaw] = await fetchByUuid(uuid);
    if (error !== null) {
      throw new Error(error);
    }

    if (!("spatialUnit" in dataRaw.ochre)) {
      throw new Error(
        "Invalid OCHRE data: API response missing 'spatialUnit' key",
      );
    }

    const spatialUnitItem = parseSpatialUnit(dataRaw.ochre.spatialUnit);

    const data: Omit<Data, "item"> & { item: SpatialUnit } = {
      uuid: parseFakeString(dataRaw.ochre.uuid),
      publicationDateTime: new Date(dataRaw.ochre.publicationDateTime),
      belongsTo: {
        uuid: dataRaw.ochre.uuidBelongsTo,
        abbreviation: parseFakeString(dataRaw.ochre.belongsTo),
      },
      metadata: parseMetadata(dataRaw.ochre.metadata),
      item: spatialUnitItem as SpatialUnit,
    };

    return { metadata: data.metadata, spatialUnit: data.item };
  } catch (error) {
    console.error(error);
    return null;
  }
}
