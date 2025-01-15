import type { Property } from "../types/main.d.ts";

type PropertyOptions = {
  searchNestedProperties: boolean;
};

const DEFAULT_OPTIONS: PropertyOptions = {
  searchNestedProperties: false,
};

/**
 * Finds a property in an array of properties by its label
 * @param properties - Array of properties to search through
 * @param label - Label to search for
 * @param options - Search options (default: { searchNestedProperties: false })
 * @returns Matching Property object or null if not found
 */
export function getPropertyByLabel(
  properties: Array<Property>,
  label: string,
  options: PropertyOptions = DEFAULT_OPTIONS,
): Property | null {
  const { searchNestedProperties } = options;
  const property = properties.find((property) => property.label === label);
  if (property) {
    return property;
  }

  if (searchNestedProperties) {
    for (const property of properties) {
      if (property.properties.length > 0) {
        const nestedResult = getPropertyByLabel(property.properties, label, {
          searchNestedProperties,
        });
        if (nestedResult) {
          return nestedResult;
        }
      }
    }
  }

  return null;
}

/**
 * Gets all values from a property matching the given label
 * @param properties - Array of properties to search through
 * @param label - Label to search for
 * @param options - Search options (default: { searchNestedProperties: false })
 * @returns Array of property values as strings, or null if not found
 */
export function getPropertyValuesByLabel(
  properties: Array<Property>,
  label: string,
  options: PropertyOptions = DEFAULT_OPTIONS,
): Array<string> | null {
  const { searchNestedProperties } = options;

  const property = properties.find((property) => property.label === label);
  if (property) {
    return property.values.map((value) => value.content);
  }

  if (searchNestedProperties) {
    for (const property of properties) {
      if (property.properties.length > 0) {
        const nestedResult = getPropertyValuesByLabel(
          property.properties,
          label,
          { searchNestedProperties },
        );
        if (nestedResult) {
          return nestedResult;
        }
      }
    }
  }

  return null;
}

/**
 * Gets the first value from a property matching the given label
 * @param properties - Array of properties to search through
 * @param label - Label to search for
 * @param options - Search options (default: { searchNestedProperties: false })
 * @returns First property value as string, or null if not found
 */
export function getPropertyValueByLabel(
  properties: Array<Property>,
  label: string,
  options: PropertyOptions = DEFAULT_OPTIONS,
): string | null {
  const { searchNestedProperties } = options;
  const values = getPropertyValuesByLabel(properties, label, {
    searchNestedProperties,
  });
  if (values !== null && values.length > 0) {
    return values[0]!;
  }

  if (searchNestedProperties) {
    for (const property of properties) {
      if (property.properties.length > 0) {
        const nestedResult = getPropertyValueByLabel(
          property.properties,
          label,
          { searchNestedProperties },
        );
        if (nestedResult) {
          return nestedResult;
        }
      }
    }
  }

  return null;
}
