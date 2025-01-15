import { z } from "zod";
import type {
  Bibliography,
  Concept,
  Data,
  Resource,
  Set,
  SpatialUnit,
  Tree,
  Website,
} from "../types/main.d.ts";
import type { OchreData } from "../types/raw.js";
import {
  parseBibliography,
  parseConcept,
  parseMetadata,
  parseResource,
  parseSet,
  parseSpatialUnit,
  parseTree,
  parseWebsite,
} from "./parsers.js";
import { parseFakeString, parseStringContent } from "./string.js";

const uuidSchema = z.string().uuid({ message: "Invalid UUID provided" });

/**
 * Fetches raw OCHRE data by UUID
 * @param uuid - UUID of the OCHRE item to fetch
 * @returns Promise resolving to tuple of [error string | null, OCHRE data | null]
 */
export async function fetchByUuid(
  uuid: string,
): Promise<[null, OchreData] | [string, null]> {
  try {
    const result = uuidSchema.safeParse(uuid);
    if (!result.success) {
      throw new Error(result.error.issues[0]?.message);
    }

    const response = await fetch(
      `https://ochre.lib.uchicago.edu/ochre?uuid=${uuid}&format=json&lang="*"`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch OCHRE data");
    }
    const dataRaw = (await response.json()) as OchreData;
    if (!("ochre" in dataRaw)) {
      throw new Error("Invalid OCHRE data: API response missing 'ochre' key");
    }

    return [null, dataRaw];
  } catch (error) {
    return [error instanceof Error ? error.message : "Unknown error", null];
  }
}

/**
 * Fetches and parses an OCHRE tree by UUID
 * @param uuid - UUID of the tree to fetch
 * @returns Promise resolving to tuple of [error string | null, parsed Tree data | null]
 */
export async function fetchTree(
  uuid: string,
): Promise<[null, Omit<Data, "item"> & { item: Tree }] | [string, null]> {
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

    const returnData: Omit<Data, "item"> & { item: Tree } = {
      uuid: parseFakeString(dataRaw.ochre.uuid),
      publicationDateTime: new Date(dataRaw.ochre.publicationDateTime),
      belongsTo: {
        uuid: dataRaw.ochre.uuidBelongsTo,
        abbreviation: parseFakeString(dataRaw.ochre.belongsTo),
      },
      metadata: parseMetadata(dataRaw.ochre.metadata),
      item: tree,
    };

    return [null, returnData];
  } catch (error) {
    return [error instanceof Error ? error.message : "Unknown error", null];
  }
}

/**
 * Fetches and parses an OCHRE resource by UUID
 * @param uuid - UUID of the resource to fetch
 * @returns Promise resolving to tuple of [error string | null, parsed Resource data | null]
 */
export async function fetchResource(
  uuid: string,
): Promise<[null, Omit<Data, "item"> & { item: Resource }] | [string, null]> {
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

    const resource = parseResource(dataRaw.ochre.resource);

    const returnData: Omit<Data, "item"> & { item: Resource } = {
      uuid: parseFakeString(dataRaw.ochre.uuid),
      publicationDateTime: new Date(dataRaw.ochre.publicationDateTime),
      belongsTo: {
        uuid: dataRaw.ochre.uuidBelongsTo,
        abbreviation: parseFakeString(dataRaw.ochre.belongsTo),
      },
      metadata: parseMetadata(dataRaw.ochre.metadata),
      item: resource as Resource,
    };

    return [null, returnData];
  } catch (error) {
    return [error instanceof Error ? error.message : "Unknown error", null];
  }
}

/**
 * Fetches and parses an OCHRE set by UUID
 * @param uuid - UUID of the set to fetch
 * @returns Promise resolving to tuple of [error string | null, parsed Set data | null]
 */
export async function fetchSet(
  uuid: string,
): Promise<[null, Omit<Data, "item"> & { item: Set }] | [string, null]> {
  try {
    const [error, dataRaw] = await fetchByUuid(uuid);
    if (error !== null) {
      throw new Error(error);
    }

    if (!("set" in dataRaw.ochre)) {
      throw new Error("Invalid OCHRE data: API response missing 'set' key");
    }

    const set = parseSet(dataRaw.ochre.set);

    const returnData: Omit<Data, "item"> & { item: Set } = {
      uuid: parseFakeString(dataRaw.ochre.uuid),
      publicationDateTime: new Date(dataRaw.ochre.publicationDateTime),
      belongsTo: {
        uuid: dataRaw.ochre.uuidBelongsTo,
        abbreviation: parseFakeString(dataRaw.ochre.belongsTo),
      },
      metadata: parseMetadata(dataRaw.ochre.metadata),
      item: set,
    };

    return [null, returnData];
  } catch (error) {
    return [error instanceof Error ? error.message : "Unknown error", null];
  }
}

/**
 * Fetches and parses an OCHRE concept by UUID
 * @param uuid - UUID of the concept to fetch
 * @returns Promise resolving to tuple of [error string | null, parsed Concept data | null]
 */
export async function fetchConcept(
  uuid: string,
): Promise<[null, Omit<Data, "item"> & { item: Concept }] | [string, null]> {
  try {
    const [error, dataRaw] = await fetchByUuid(uuid);
    if (error !== null) {
      throw new Error(error);
    }

    if (!("concept" in dataRaw.ochre)) {
      throw new Error("Invalid OCHRE data: API response missing 'concept' key");
    }

    const concept = parseConcept(dataRaw.ochre.concept);

    const returnData: Omit<Data, "item"> & { item: Concept } = {
      uuid: parseFakeString(dataRaw.ochre.uuid),
      publicationDateTime: new Date(dataRaw.ochre.publicationDateTime),
      belongsTo: {
        uuid: dataRaw.ochre.uuidBelongsTo,
        abbreviation: parseFakeString(dataRaw.ochre.belongsTo),
      },
      metadata: parseMetadata(dataRaw.ochre.metadata),
      item: concept as Concept,
    };

    return [null, returnData];
  } catch (error) {
    return [error instanceof Error ? error.message : "Unknown error", null];
  }
}

/**
 * Fetches and parses an OCHRE spatial unit by UUID
 * @param uuid - UUID of the spatial unit to fetch
 * @returns Promise resolving to tuple of [error string | null, parsed SpatialUnit data | null]
 */
export async function fetchSpatialUnit(
  uuid: string,
): Promise<
  [null, Omit<Data, "item"> & { item: SpatialUnit }] | [string, null]
> {
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

    const spatialUnit = parseSpatialUnit(dataRaw.ochre.spatialUnit);

    const returnData: Omit<Data, "item"> & { item: SpatialUnit } = {
      uuid: parseFakeString(dataRaw.ochre.uuid),
      publicationDateTime: new Date(dataRaw.ochre.publicationDateTime),
      belongsTo: {
        uuid: dataRaw.ochre.uuidBelongsTo,
        abbreviation: parseFakeString(dataRaw.ochre.belongsTo),
      },
      metadata: parseMetadata(dataRaw.ochre.metadata),
      item: spatialUnit as SpatialUnit,
    };

    return [null, returnData];
  } catch (error) {
    return [error instanceof Error ? error.message : "Unknown error", null];
  }
}

/**
 * Fetches and parses an OCHRE bibliography by UUID
 * @param uuid - UUID of the bibliography to fetch
 * @returns Promise resolving to tuple of [error string | null, parsed Bibliography | null]
 */
export async function fetchBibliography(
  uuid: string,
): Promise<[null, Bibliography] | [string, null]> {
  try {
    const [error, dataRaw] = await fetchByUuid(uuid);
    if (error !== null) {
      throw new Error(error);
    }

    if (!("bibliography" in dataRaw.ochre)) {
      throw new Error(
        "Invalid OCHRE data: API response missing 'bibliography' key",
      );
    }

    const bibliography = parseBibliography(dataRaw.ochre.bibliography);

    return [null, bibliography];
  } catch (error) {
    return [error instanceof Error ? error.message : "Unknown error", null];
  }
}

/**
 * Fetches and parses an OCHRE website by UUID
 * @param uuid - UUID of the website to fetch
 * @returns Promise resolving to tuple of [error string | null, parsed Website | null]
 */
export async function fetchWebsite(
  uuid: string,
): Promise<[null, Website] | [string, null]> {
  try {
    const [error, dataRaw] = await fetchByUuid(uuid);
    if (error !== null) {
      throw new Error(error);
    }

    if (!("tree" in dataRaw.ochre)) {
      throw new Error("Invalid OCHRE data: API response missing 'tree' key");
    }

    if (!dataRaw.ochre.metadata.project?.identification) {
      throw new Error(
        "Invalid OCHRE data: API response missing 'metadata.project.identification' key",
      );
    }

    const website = await parseWebsite(
      dataRaw.ochre.tree,
      parseStringContent(dataRaw.ochre.metadata.project.identification.label),
      dataRaw.ochre.metadata.project.identification.website ?? null,
    );

    return [null, website];
  } catch (error) {
    return [error instanceof Error ? error.message : "Unknown error", null];
  }
}
