# OCHRE SDK API Documentation

## Core Parsers

### Website Parser

#### `parseWebsite(websiteTree: OchreTree, projectName: FakeString, website: FakeString | null): Promise<Website>`

Parses an OCHRE website tree into a structured Website object.

**Parameters:**

- `websiteTree`: The OCHRE tree containing website data
- `projectName`: The name of the project
- `website`: Optional website URL

**Returns:**
A Promise that resolves to a Website object containing:

- `uuid`: Website unique identifier
- `publicationDateTime`: Publication date and time
- `identification`: Website identification information
- `project`: Project information
- `creators`: Array of website creators
- `license`: Website license information
- `pages`: Array of website pages
- `globalElements`: Array of global web elements
- `properties`: Website properties

### Metadata Parser

#### `parseMetadata(metadata: OchreMetadata): Metadata`

Parses OCHRE metadata into a structured Metadata object.

**Parameters:**

- `metadata`: The OCHRE metadata object

**Returns:**
A Metadata object containing:

- `project`: Project information
- `item`: Item metadata
- `dataset`: Dataset information
- `publisher`: Publisher information
- `languages`: Array of language codes
- `identifier`: Unique identifier
- `description`: Metadata description

### Identification Parser

#### `parseIdentification(identification: OchreIdentification): Identification`

Parses OCHRE identification data.

**Parameters:**

- `identification`: The OCHRE identification object

**Returns:**
An Identification object containing:

- `label`: Main label
- `abbreviation`: Abbreviated form

## Types

### Website Types

```typescript
type Website = {
  uuid: string;
  publicationDateTime: Date | null;
  identification: Identification;
  project: {
    name: string;
    website: string | null;
  };
  creators: Array<Person>;
  license: License | null;
  pages: Array<Webpage>;
  globalElements: Array<WebElement>;
  properties: WebsiteProperties;
};
```

### Metadata Types

```typescript
type Metadata = {
  project: {
    identification: Identification & { website: string | null };
  } | null;
  item: {
    identification: Identification;
    category: string;
    type: string;
    maxLength: number | null;
  } | null;
  dataset: string;
  publisher: string;
  languages: Array<string>;
  identifier: string;
  description: string;
};
```

For more types and interfaces, see the TypeScript definition files.
