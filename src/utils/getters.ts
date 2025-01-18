import type { Property } from "../types/main.js";

type PropertyOptions = {
  searchNestedProperties: boolean;
};

const DEFAULT_OPTIONS: PropertyOptions = {
  searchNestedProperties: false,
};

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
        if (nestedResult !== null) {
          return nestedResult;
        }
      }
    }
  }

  return null;
}
