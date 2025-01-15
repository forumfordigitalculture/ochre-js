# OCHRE SDK

A TypeScript SDK for working with OCHRE (Online Cultural and Historical Research Environment) data.

## Installation

```bash
pnpm add ochre-sdk
or
npm install ochre-sdk
```

## Features

- Type-safe parsing of OCHRE data structures
- Comprehensive TypeScript types for OCHRE entities
- Utilities for handling OCHRE websites, resources, and metadata
- Support for parsing rich text, documents, and multilingual content

## Usage

```typescript
import { parseWebsite, parseMetadata, parseIdentification } from "ochre-sdk";
// Parse OCHRE website data
const website = await parseWebsite(websiteTree, projectName, websiteUrl);
// Parse metadata
const metadata = parseMetadata(ochreMetadata);
// Parse identification
const identification = parseIdentification(ochreIdentification);
```

## API Reference

### Core Functions

#### `parseWebsite(websiteTree: OchreTree, projectName: FakeString, website: FakeString | null): Promise<Website>`

Parses an OCHRE website tree into a structured Website object.

```typescript
const website = await parseWebsite(
  websiteTree,
  "My Project",
  "https://example.com",
);
```

#### `parseMetadata(metadata: OchreMetadata): Metadata`

Parses OCHRE metadata into a structured Metadata object.

```typescript
const metadata = parseMetadata(ochreMetadata);
```

### Types

The SDK provides comprehensive TypeScript types for OCHRE data structures. Key types include:

- `Website` - Represents an OCHRE website
- `Metadata` - Represents OCHRE metadata
- `Resource` - Represents an OCHRE resource
- `Document` - Represents an OCHRE document
- `WebElement` - Represents a web element in an OCHRE website
- And many more...

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)
