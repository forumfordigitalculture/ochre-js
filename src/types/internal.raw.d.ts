/**
 * Primitive types that can be treated as strings
 */
export type FakeString = string | number | boolean;

/**
 * Text rendering options
 */
export type RenderOption = "bold" | "italic" | "underline";

/**
 * Whitespace handling options
 */
export type WhitespaceOption = "newline" | "trailing" | "leading";

/**
 * Content item with rendering and whitespace options
 */
export type OchreStringItemContent = {
  rend?: string; // "bold" | "italic" | "underline" (space separated)
  whitespace?: string; // "newline" | "trailing" | "leading" (space separated)
  content: FakeString;
};

/**
 * String item with language information
 */
export type OchreStringItem = {
  string: FakeString | OchreStringItemContent | Array<OchreStringItemContent>;
  lang?: string; // 3 character code (zxx = "a.k.a.")
  languages?: string; // 3 character codes, semicolon separated
};

/**
 * Container for string content
 */
export type OchreStringContent = {
  content: FakeString | OchreStringItem | Array<OchreStringItem>;
};

/**
 * Rich text content item with formatting options
 */
export type OchreStringRichTextItemContent = {
  content: FakeString;
  title?: FakeString;
  lang?: string; // 3 character code (zxx = "a.k.a.")
  whitespace?: string; // "newline" | "trailing" | "leading" (space separated)
  rend?: string; // "bold" | "italic" | "underline"  (space separated)
};

/**
 * Annotation within rich text
 */
export type OchreStringRichTextItemAnnotation = {
  annotation: string; // UUID
  string: FakeString;
  links: OchreLink | Array<OchreLink>;
};

/**
 * Rich text item with various formatting options
 */
export type OchreStringRichTextItem =
  | FakeString
  | OchreStringRichTextItemContent
  | {
      string:
        | OchreStringRichTextItemAnnotation
        | Array<OchreStringRichTextItemAnnotation>;
      whitespace?: string; // "newline" | "trailing" | "leading" (space separated)
    }
  | {
      whitespace: string; // "newline" | "trailing" | "leading" (space separated)
    }
  | OchreStringRichTextItemAnnotation;

/**
 * Rich text with language information
 */
export type OchreStringRichText = {
  string: FakeString | OchreStringRichTextItem | Array<OchreStringRichTextItem>;
  title?: FakeString;
  lang?: string; // 3 character code (zxx = "a.k.a.")
};

/**
 * Raw OCHRE data response
 */
export type OchreData = {
  ochre: {
    uuid: string;
    uuidBelongsTo: string;
    belongsTo: FakeString;
    publicationDateTime: string; // YYYY-MM-DDThh:mm:ssZ
    metadata: OchreMetadata;
    languages?: string; // 3 character codes, semicolon separated
  } & (
    | { tree: OchreTree }
    | { set: OchreSet }
    | { resource: OchreResource }
    | { spatialUnit: OchreSpatialUnit }
    | { concept: OchreConcept }
    | { bibliography: OchreBibliography }
  );
};

/**
 * Raw OCHRE metadata
 */
export type OchreMetadata = {
  identifier: OchreStringContent;
  item?: {
    label?: OchreStringContent; // Faulty, only exists in old items that have not been republished
    abbreviation?: OchreStringContent; // Faulty, only exists in old items that have not been republished
    identification: OchreIdentification;
    category: string;
    type: string;
    maxLength?: number;
  };
  publisher: OchreStringContent;
  dataset: OchreStringContent;
  project?: { identification: OchreIdentification };
  language: OchreLanguage | Array<OchreLanguage>;
  description: OchreStringContent;
};

/**
 * Raw OCHRE tree structure
 */
export type OchreTree = {
  uuid: string;
  publicationDateTime: string; // YYYY-MM-DDThh:mm:ssZ
  type: string;
  n: number;
  availability: OchreLicense;
  identification: OchreIdentification;
  date?: string; // YYYY-MM-DD
  creators?: { creator: OchrePerson | Array<OchrePerson> };
  items:
    | {
        resource: OchreResource | Array<OchreResource>;
      }
    | { spatialUnit: OchreSpatialUnit | Array<OchreSpatialUnit> }
    | { concept: OchreConcept | Array<OchreConcept> };
  properties?: { property: OchreProperty | Array<OchreProperty> };
};

/**
 * Raw OCHRE set
 */
export type OchreSet = {
  uuid: string;
  publicationDateTime: string; // YYYY-MM-DDThh:mm:ssZ
  type: string;
  n: number;
  availability: OchreLicense;
  identification: OchreIdentification;
  date?: string; // YYYY-MM-DD
  suppressBlanks?: boolean;
  description?: OchreStringContent;
  creators?: { creator: OchrePerson | Array<OchrePerson> };
  items:
    | { resource: OchreResource | Array<OchreResource> }
    | { spatialUnit: OchreSpatialUnit | Array<OchreSpatialUnit> }
    | { concept: OchreConcept | Array<OchreConcept> };
};

/**
 * Raw OCHRE resource
 */
export type OchreResource = {
  uuid: string;
  publicationDateTime: string; // YYYY-MM-DDThh:mm:ssZ
  type: string;
  n: number;
  slug?: string;
  format?: string;
  context?: OchreContext;
  availability?: OchreLicense;
  copyright?: FakeString;
  identification: OchreIdentification;
  href?: string;
  description?: OchreStringContent;
  date?: string; // YYYY-MM-DD
  image?: OchreImage;
  creators?: { creator: OchrePerson | Array<OchrePerson> };
  notes?: { note: OchreNote | Array<OchreNote> };
  document?: {
    content: OchreStringRichText | Array<OchreStringRichText>;
  };
  imagemap?: OchreImageMap;
  periods?: { period: OchrePeriod | Array<OchrePeriod> };
  links?: OchreLink | Array<OchreLink>;
  reverseLinks?: OchreLink | Array<OchreLink>;
  properties?: { property: OchreProperty | Array<OchreProperty> };
  citedBibliography?: {
    reference: OchreBibliography | Array<OchreBibliography>;
  };
  resource?: OchreNestedResource | Array<OchreNestedResource>;
};

/**
 * Raw OCHRE nested resource without context and availability
 */
export type OchreNestedResource = Omit<
  OchreResource,
  "context" | "availability" | "copyright"
>;

/**
 * Raw OCHRE spatial unit
 */
export type OchreSpatialUnit = {
  uuid: string;
  publicationDateTime?: string; // YYYY-MM-DDThh:mm:ssZ
  type: string;
  n: number;
  availability?: OchreLicense;
  context?: OchreContext;
  identification: OchreIdentification;
  image?: OchreImage;
  description?: OchreStringContent;
  coordinates?: OchreCoordinates;
  events?: { event: OchreEvent | Array<OchreEvent> };
  observations?: { observation: OchreObservation | Array<OchreObservation> };
  observation?: OchreObservation;
};

/**
 * Raw OCHRE nested spatial unit without context and observations
 */
export type OchreNestedSpatialUnit = Omit<
  OchreSpatialUnit,
  "context" | "availability" | "observations" | "events"
> & {
  properties?: { property: OchreProperty | Array<OchreProperty> };
};

/**
 * Raw OCHRE concept
 */
export type OchreConcept = {
  uuid: string;
  publicationDateTime: string; // YYYY-MM-DDThh:mm:ssZ
  n: number;
  availability?: OchreLicense;
  context?: OchreContext;
  identification: OchreIdentification;
  interpretations: {
    interpretation: OchreInterpretation | Array<OchreInterpretation>;
  };
};

/**
 * Raw OCHRE nested concept without context and availability
 */
export type OchreNestedConcept = Omit<OchreConcept, "context" | "availability">;

/**
 * Raw OCHRE property value
 */
export type OchrePropertyValue = OchreStringContent & {
  uuid?: string;
  publicationDateTime?: string; // YYYY-MM-DDThh:mm:ssZ
  type: string;
  category?: string;
};

/**
 * Raw OCHRE property
 */
export type OchreProperty = {
  label: OchreStringContent & { uuid: string };
  value?: OchrePropertyValue | Array<OchrePropertyValue>;
  comment?: FakeString;
  property?: OchreProperty | Array<OchreProperty>;
};

/**
 * Raw OCHRE identification
 */
export type OchreIdentification = {
  label: OchreStringContent;
  abbreviation?: OchreStringContent;
  MIMEType?: string;
  widthPreview?: number;
  heightPreview?: number;
  height?: number;
  width?: number;
  website?: string;
};

/**
 * Raw OCHRE license
 */
export type OchreLicense = {
  license: { content: string; target: string } | string;
};

/**
 * Raw OCHRE language
 */
export type OchreLanguage = {
  default?: boolean;
  content: string; // 3 character code
};

/**
 * Raw OCHRE link item
 */
export type OchreLinkItem = {
  uuid: string;
  publicationDateTime?: string; // YYYY-MM-DDThh:mm:ssZ
  type?: string;
  identification?: OchreIdentification;
  rend?: "inline";
  content?: FakeString;
  heightPreview?: number;
  widthPreview?: number;
  height?: number;
  width?: number;
};

/**
 * Raw OCHRE link variants
 */
export type OchreLink =
  | { resource: OchreLinkItem | Array<OchreLinkItem> }
  | { concept: OchreLinkItem | Array<OchreLinkItem> }
  | { set: OchreLinkItem | Array<OchreLinkItem> }
  | { person: OchreLinkItem | Array<OchreLinkItem> }
  | { epigraphicUnit: OchreLinkItem | Array<OchreLinkItem> }
  | { bibliography: OchreBibliography | Array<OchreBibliography> };

/**
 * Raw OCHRE image
 */
export type OchreImage = {
  publicationDateTime?: string; // YYYY-MM-DDThh:mm:ssZ
  identification?: OchreIdentification;
  href?: string;
  htmlImgSrcPrefix?: string;
  content?: FakeString;
};

/**
 * Raw OCHRE bibliography
 */
export type OchreBibliography = {
  uuid: string;
  publicationDateTime?: string; // YYYY-MM-DDThh:mm:ssZ
  type: string;
  n: number;
  identification: OchreIdentification;
  project?: { identification: OchreIdentification };
  context?: OchreContext;
  sourceDocument?: {
    uuid: string;
    content: FakeString;
  };
  publicationInfo?: {
    publishers?: { publishers: { person: OchrePerson | Array<OchrePerson> } };
    startDate?: {
      month: number;
      year: number;
      day: number;
    };
  };
  entryInfo?: {
    startIssue: FakeString;
    startVolume: FakeString;
  };
  citationFormatSpan?:
    | {
        span: {
          content: FakeString;
        };
      }
    | {
        "default:span": {
          content: FakeString;
        };
      };
  referenceFormatDiv?:
    | {
        div: {
          div: {
            class: string;
            content: FakeString;
          };
          style: string;
          class: string;
        };
      }
    | {
        "default:div": {
          "default:div": {
            class: string;
            content: FakeString;
          };
          style: string;
          class: string;
        };
      };
  source?: {
    resource: Pick<
      OchreResource,
      "uuid" | "type" | "publicationDateTime" | "identification"
    >;
  };
  authors?: { person: OchrePerson | Array<OchrePerson> };
  properties?: { property: OchreProperty | Array<OchreProperty> };
};

/**
 * Raw OCHRE note
 */
export type OchreNote =
  | string
  | {
      noteNo: number;
      content: OchreStringRichText | Array<OchreStringRichText>;
    };

/**
 * Raw OCHRE period
 */
export type OchrePeriod = {
  uuid: string;
  publicationDateTime?: string; // YYYY-MM-DDThh:mm:ssZ
  type: string;
  identification: OchreIdentification;
};

/**
 * Raw OCHRE image map area
 */
export type OchreImageMapArea = {
  uuid: string;
  publicationDateTime?: string; // YYYY-MM-DDThh:mm:ssZ
  type: string;
  title: FakeString;
  shape: "rect" | "poly";
  coords: string; // comma separated list of numbers
};

/**
 * Raw OCHRE image map
 */
export type OchreImageMap = {
  area: OchreImageMapArea | Array<OchreImageMapArea>;
  width: number;
  height: number;
};

/**
 * Raw OCHRE context
 */
export type OchreContext = {
  context: OchreContextValue | Array<OchreContextValue>;
  displayPath: string;
};

/**
 * Raw OCHRE context value
 */
export type OchreContextValue = {
  tree: OchreContextItem;
  project: OchreContextItem;
  spatialUnit?: OchreContextItem | Array<OchreContextItem>;
  displayPath: string;
};

/**
 * Raw OCHRE context item
 */
export type OchreContextItem = {
  uuid: string;
  publicationDateTime?: string; // YYYY-MM-DDThh:mm:ssZ
  n: number; // negative number
  content: FakeString;
};

/**
 * Raw OCHRE person
 */
export type OchrePerson = {
  uuid: string;
  publicationDateTime?: string; // YYYY-MM-DDThh:mm:ssZ
  type?: string;
  date?: string; // YYYY-MM-DD
  identification?: OchreIdentification;
  content?: FakeString | null;
};

/**
 * Raw OCHRE observation
 */
export type OchreObservation = {
  observationNo: number;
  date?: string; // YYYY-MM-DD
  observers?: FakeString;
  notes?: { note: OchreNote | Array<OchreNote> };
  links?: OchreLink | Array<OchreLink>;
  properties?: { property: OchreProperty | Array<OchreProperty> };
};

/**
 * Raw OCHRE coordinates
 */
export type OchreCoordinates = {
  latitude: number;
  longitude: number;
  coordinatesArray?: string;
  coord?: {
    coordLatitude: number;
    coordLongitude: number;
    coordType: string;
    coordLabel: FakeString;
    arrayString: string;
    uuid: string;
  };
};

/**
 * Raw OCHRE event
 */
export type OchreEvent = {
  dateTime?: string; // YYYY-MM-DD
  agent?: {
    uuid: string;
    content: FakeString;
  };
  label: OchreStringContent;
};

/**
 * Raw OCHRE interpretation
 */
export type OchreInterpretation = {
  date: string; // YYYY-MM-DD
  interpretationNo: number;
  properties?: { property: OchreProperty | Array<OchreProperty> };
};
