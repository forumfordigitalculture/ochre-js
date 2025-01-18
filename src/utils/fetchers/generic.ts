import type { OchreData } from "../../types/internal.raw.d.ts";
import { z } from "zod";

const uuidSchema = z.string().uuid({ message: "Invalid UUID provided" });

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
