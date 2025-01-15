import type { Language } from "iso-639-3";

export type FakeString = string | number | boolean;

export type OchreStringItem = {
  string:
    | FakeString
    | {
        rend?: string; // "bold" | "italic" | "underline" (space separated)
        content: FakeString;
      };
  lang?: Language["iso6393"]; // 3 character code (zxx = "abbreviation")
  languages?: string; // 3 character codes, semicolon separated
};

export type OchreStringContent = {
  content: FakeString | OchreStringItem | Array<OchreStringItem>;
};

export type OchreStringDocumentItem =
  | {
      content: FakeString;
      title?: FakeString;
      lang?: Language["iso6393"]; // 3 character code (zxx = "abbreviation")
      whitespace?: string; // "newline" | "trailing" | "leading" (space separated)
      rend?: string; // "bold" | "italic" | "underline" (space separated)
    }
  | {
      whitespace: string; // "newline" | "trailing" | "leading" (space separated)
    }
  | {
      annotation: string; // UUID
      string: FakeString;
      links: OchreLink | Array<OchreLink>;
    };

export type OchreStringDocument = {
  string: OchreStringDocumentItem | Array<OchreStringDocumentItem>;
  lang?: Language["iso6393"]; // 3 character code (zxx = "abbreviation")
};

export type OchreData = {
  ochre: {
    uuidBelongsTo: FakeString;
    metadata: OchreMetadata;
    languages?: string; // 3 character codes, semicolon separated
    publicationDateTime: string; // YYYY-MM-DDThh:mm:ssZ
    belongsTo: FakeString;
    uuid: string;
  } & (
    | { tree: OchreTree }
    | { set: OchreSet }
    | { resource: OchreResource }
    | { spatialUnit: OchreSpatialUnit }
    | { concept: OchreConcept }
  );
};

export type OchreProject = {
  identification: {
    website?: string;
    label: OchreStringContent;
    abbreviation: OchreStringContent;
  };
};

export type OchreMetadata = {
  identifier: OchreStringContent;
  item: {
    identification: OchreIdentification;
    category: string;
    type: string;
    maxLength?: number;
  };
  description: OchreStringContent;
  publisher: OchreStringContent;
  project: OchreProject;
  language: OchreLanguage | Array<OchreLanguage>;
  dataset: OchreStringContent;
};

export type OchreTree = {
  date?: string; // YYYY-MM-DD
  identification: OchreIdentification;
  publicationDateTime: string; // YYYY-MM-DDThh:mm:ssZ
  creators?: { creator: OchreCreator | Array<OchreCreator> };
  availability: OchreLicense;
  type: string;
  uuid: string;
  items:
    | {
        resource:
          | Omit<
              OchreResource,
              | "uuidBelongsTo"
              | "metadata"
              | "publicationDateTime"
              | "context"
              | "availability"
            >
          | Array<
              Omit<
                OchreResource,
                | "uuidBelongsTo"
                | "metadata"
                | "publicationDateTime"
                | "context"
                | "availability"
              >
            >;
      }
    | { spatialUnit: OchreSpatialUnit | Array<OchreSpatialUnit> }
    | { concept: OchreConcept | Array<OchreConcept> };
  n: number;
  properties: { property: OchreProperty | Array<OchreProperty> };
};

export type OchreSet = {
  date?: string; // YYYY-MM-DD
  identification: OchreIdentification;
  publicationDateTime: string; // YYYY-MM-DDThh:mm:ssZ
  availability: OchreLicense;
  creators?: { creator: OchreCreator | Array<OchreCreator> };
  description?: OchreStringContent;
  type: string;
  uuid: string;
  n: number;
  items:
    | { resource: OchreResource | Array<OchreResource> }
    | { spatialUnit: OchreSpatialUnit | Array<OchreSpatialUnit> };
};

export type OchreResource = {
  identification: OchreIdentification;
  availability: OchreLicense;
  copyright?: FakeString;
  image?: OchreImage;
  creators?: { creator: OchreCreator | Array<OchreCreator> };
  notes?: { note: OchreNote | Array<OchreNote> };
  description?: OchreStringContent;
  document?: { content: OchreStringDocument | Array<OchreStringDocument> };
  imagemap?: {
    area: OchreImageMapArea | Array<OchreImageMapArea>;
    width: number;
    height: number;
  };
  format?: string;
  links?: OchreLink | Array<OchreLink>;
  reverseLinks?: OchreLink | Array<OchreLink>;
  type: string;
  uuid: string;
  href?: string;
  properties?: { property: OchreProperty | Array<OchreProperty> };
  context?: OchreContext;
  displayPath: string;
  resource?: OchreResource | Array<OchreResource>;
  n: number;
};

export type OchreSpatialUnit = {
  identification: OchreIdentification;
  publicationDateTime: string; // YYYY-MM-DDThh:mm:ssZ
  availability: OchreLicense;
  context?: OchreContext;
  description?: OchreStringContent;
  coordinates?: OchreCoordinates;
  observations?: { observation: OchreObservation | Array<OchreObservation> };
  events?: { event: OchreEvent | Array<OchreEvent> };
  type: string;
  uuid: string;
  n: number;
};

export type OchreConcept = {
  identification: OchreIdentification;
  publicationDateTime: string; // YYYY-MM-DDThh:mm:ssZ
  context?: OchreContext;
  availability: OchreLicense;
  uuid: string;
  interpretations: {
    interpretation: OchreInterpretation | Array<OchreInterpretation>;
  };
  n: number;
};

export type OchreProperty = {
  label: OchreStringContent & { uuid: string };
  value: OchreStringContent & {
    publicationDateTime?: string; // YYYY-MM-DDThh:mm:ssZ
    category?: string;
    type: string; // string | number | boolean | time | date | IDREF
    uuid: string;
  };
  property?: OchreProperty | Array<OchreProperty>;
};

export type OchreIdentification = {
  label: OchreStringContent;
  abbreviation?: OchreStringContent;
  MIMEType?: string;
  widthPreview?: number;
  heightPreview?: number;
  height?: number;
  width?: number;
};

export type OchreLicense = {
  license: { content: string; target: string } | string;
};

export type OchreLanguage = {
  default?: boolean;
  content: string; // 3 character code
};

export type OchreLink =
  | {
      resource: {
        identification: OchreIdentification;
        publicationDateTime?: string; // YYYY-MM-DDThh:mm:ssZ
        type?: string;
        uuid: string;
        heightPreview?: number;
        widthPreview?: number;
        height?: number;
        width?: number;
      };
    }
  | {
      concept: {
        identification: OchreIdentification;
        publicationDateTime?: string; // YYYY-MM-DDThh:mm:ssZ
        type?: string;
        uuid: string;
      };
    }
  | {
      set: {
        identification: OchreIdentification;
        publicationDateTime?: string; // YYYY-MM-DDThh:mm:ssZ
        type?: string;
        uuid: string;
      };
    };

export type OchreImage = {
  identification: OchreIdentification;
  publicationDateTime: string; // YYYY-MM-DDThh:mm:ssZ
  href: string;
};

export type OchreNote = {
  noteNo: number;
  content: OchreStringContent | Array<OchreStringContent>;
};

export type OchreImageMapArea = {
  shape: string; // rect | polygon
  publicationDateTime?: string; // YYYY-MM-DDThh:mm:ssZ
  title: FakeString;
  type: string;
  uuid: string;
  coords: string; // comma separated list of numbers
};

export type OchreContext = {
  context: {
    tree: OchreContextItem;
    project: OchreContextItem;
    spatialUnit?: OchreContextItem | Array<OchreContextItem>;
    displayPath: string;
  };
  displayPath: string;
};

export type OchreContextItem = {
  publicationDateTime?: string; // YYYY-MM-DDThh:mm:ssZ
  uuid: string;
  n: number; // negative number
  content: FakeString;
};

export type OchreCreator = {
  date: string; // YYYY-MM-DD
  identification: OchreIdentification;
  publicationDateTime?: string; // YYYY-MM-DDThh:mm:ssZ
  type?: string;
  uuid: string;
  content?: FakeString;
};

export type OchreObservation = {
  observationNo: number;
  notes?: { note: OchreNote | Array<OchreNote> };
  links: OchreLink | Array<OchreLink>;
  properties: { property: OchreProperty | Array<OchreProperty> };
};

export type OchreCoordinates = {
  coord?: {
    coordLatitude: number;
    coordLongitude: number;
    coordType: string;
    coordLabel: string;
    arrayString: string;
    uuid: string;
  };
  latitude: number;
  longitude: number;
  coordinatesArray?: string;
};

export type OchreEvent = {
  dateTime?: string; // YYYY-MM-DD
  agent: {
    uuid: string;
    content: FakeString;
  };
  label: OchreStringContent;
};

export type OchreInterpretation = {
  date: string; // YYYY-MM-DD
  interpretationNo: number;
  properties: { property: OchreProperty | Array<OchreProperty> };
};
