import type { Language } from "iso-639-3";

export type Data = {
  uuid: string;
  belongsTo: {
    uuid: string;
    abbreviation: string;
  };
  publicationDateTime: Date;
  metadata: Metadata;
  item: Tree | Set | Resource | SpatialUnit | Concept;
};

export type Identification = {
  label: string;
  abbreviation: string;
};

export type Metadata = {
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
  languages: Array<Language["iso6393"]>;
  identifier: string;
  description: string;
};

export type ContextItem = {
  uuid: string;
  publicationDateTime: Date | null;
  number: number;
  content: string;
};

export type ContextNode = {
  tree: ContextItem;
  project: ContextItem;
  spatialUnit: Array<ContextItem>;
};

export type Context = {
  nodes: Array<ContextNode>;
  displayPath: string;
};

export type License = {
  content: string;
  url: string;
};

export type Person = {
  uuid: string;
  publicationDateTime: Date | null;
  type: string | null;
  date: Date | null;
  identification: Identification | null;
  content: string | null;
};

export type Note = {
  number: number;
  title: string | null;
  content: string;
};

export type Image = {
  publicationDateTime: Date | null;
  identification: Identification | null;
  url: string | null;
  htmlPrefix: string | null;
  content: string | null;
};

export type Link = {
  uuid: string;
  publicationDateTime: Date | null;
  type: string | null;
  variant:
    | "resource"
    | "concept"
    | "set"
    | "tree"
    | "person"
    | "bibliography"
    | "epigraphicUnit"
    | null;
  identification: Identification | null;
  content: string | null;
  image: {
    isInline: boolean;
    heightPreview: number;
    widthPreview: number;
    height: number;
    width: number;
  } | null;
  bibliographies: Array<Bibliography> | null;
};

export type ImageMapArea = {
  uuid: string;
  publicationDateTime: Date | null;
  type: string;
  title: string;
  shape: "rectangle" | "polygon";
  coords: Array<number>;
};

export type ImageMap = {
  area: Array<ImageMapArea>;
  width: number;
  height: number;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
  type: string | null;
  label: string | null;
};

export type Observation = {
  number: number;
  date: Date | null;
  observers: Array<string>;
  notes: Array<Note>;
  links: Array<Link>;
  properties: Array<Property>;
};

export type Event = {
  date: Date | null;
  label: string;
  agent: {
    uuid: string;
    content: string;
  } | null;
};

export type Interpretation = {
  date: Date | null;
  number: number;
  properties: Array<Property>;
};

export type Document = {
  content: string;
  footnotes: Array<Footnote>;
};

export type Footnote = {
  uuid: string;
  label: string;
  content: string;
};

export type Resource = {
  uuid: string;
  variant: "resource";
  publicationDateTime: Date | null;
  type: string;
  number: number;
  context: Context | null;
  license: License | null;
  copyright: string | null;
  identification: Identification;
  date: Date | null;
  image: Image | null;
  creators: Array<Person>;
  notes: Array<Note>;
  description: string;
  document: Document | null;
  href: string | null;
  imageMap: ImageMap | null;
  periods: Array<Period>;
  format: string | null;
  links: Array<Link>;
  reverseLinks: Array<Link>;
  properties: Array<Property>;
  citedBibliographies: Array<Bibliography>;
  resources: Array<NestedResource>;
};

export type NestedResource = Omit<
  Resource,
  "publicationDateTime" | "license" | "copyright"
>;

export type SpatialUnit = {
  uuid: string;
  variant: "spatialUnit";
  publicationDateTime: Date | null;
  type: string;
  number: number;
  context: Context | null;
  license: License | null;
  identification: Identification;
  image: Image | null;
  description: string | null;
  coordinates: Coordinates | null;
  observations: Array<Observation>;
  events: Array<Event>;
};

export type NestedSpatialUnit = Omit<
  SpatialUnit,
  "publicationDateTime" | "license" | "observations" | "events"
> & {
  properties: Array<Property>;
};

export type Concept = {
  uuid: string;
  variant: "concept";
  publicationDateTime: Date | null;
  number: number;
  license: License | null;
  context: Context | null;
  identification: Identification;
  interpretations: Array<Interpretation>;
};

export type NestedConcept = Omit<Concept, "publicationDateTime" | "license">;

export type Set = {
  uuid: string;
  variant: "set";
  publicationDateTime: Date | null;
  type: string;
  number: number;
  date: Date | null;
  license: License | null;
  identification: Identification;
  isSuppressingBlanks: boolean;
  description: string;
  creators: Array<Person>;
  items: {
    resources: Array<NestedResource>;
    spatialUnits: Array<NestedSpatialUnit>;
    concepts: Array<NestedConcept>;
  };
};

export type Bibliography = {
  uuid: string;
  publicationDateTime: Date | null;
  type: string | null;
  number: number | null;
  identification: Identification | null;
  projectIdentification: Identification | null;
  context: Context | null;
  citation: {
    format: string | null;
    short: string | null;
    long: string | null;
  };
  publicationInfo: {
    publishers: Array<Person>;
    startDate: Date | null;
  };
  entryInfo: {
    startIssue: string;
    startVolume: string;
  } | null;
  source: {
    resource: Pick<
      Resource,
      "uuid" | "publicationDateTime" | "type" | "identification"
    > | null;
    documentUrl: string | null;
  };
  authors: Array<Person>;
  properties: Array<Property>;
};

export type Period = {
  uuid: string;
  publicationDateTime: Date | null;
  type: string;
  identification: Identification;
};

export type PropertyValueType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "date"
  | "dateTime"
  | "time"
  | "IDREF";

export type PropertyValue = {
  content: string;
  type: PropertyValueType;
  category: string | null;
  uuid: string | null;
  publicationDateTime: Date | null;
};

export type Property = {
  label: string;
  values: Array<PropertyValue>;
  comment: string | null;
  properties: Array<Property>;
};

export type Tree = {
  uuid: string;
  variant: "tree";
  publicationDateTime: Date | null;
  type: string;
  number: number;
  date: Date | null;
  license: License | null;
  identification: Identification;
  creators: Array<Person>;
  items: {
    resources: Array<Resource>;
    spatialUnits: Array<SpatialUnit>;
    concepts: Array<Concept>;
  };
  properties: Array<Property>;
};

export type Website = {
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
  sidebarElements: Array<WebElement>;
  properties: WebsiteProperties;
};

export type WebsiteProperties = {
  type:
    | "traditional"
    | "digital-collection"
    | "plum"
    | "cedar"
    | "elm"
    | "maple"
    | "oak"
    | "palm";
  privacy: "public" | "password" | "private";
  status: "development" | "preview" | "production";
  isHeaderDisplayed: boolean;
  isFooterDisplayed: boolean;
  isSidebarDisplayed: boolean;
  searchCollectionUuid: string | null;
  logoUrl: string | null;
};

export type Webpage = {
  title: string;
  slug: string;
  properties: WebpageProperties;
  elements: Array<WebElement>;
  webpages: Array<Webpage>;
};

export type WebpageProperties = {
  displayedInHeader: boolean;
  width: "full" | "large" | "default";
  variant: "default" | "no-background";
  backgroundImageUrl: string | null;
  cssStyles: Array<Style>;
  tailwindClasses: Array<string>;
};

export type WebElement = {
  uuid: string;
  title: string;
  cssStyles: Array<Style>;
  tailwindClasses: Array<string>;
} & WebElementComponent;

export type WebElementComponent =
  | {
      component: "annotated-document";
      document: Document;
    }
  | { component: "annotated-image"; imageUuid: string }
  | {
      component: "bibliography";
      bibliographies: Array<Bibliography>;
      layout: "long" | "short";
    }
  | { component: "blog"; blogId: string }
  | { component: "button"; href: string }
  | {
      component: "collection";
      variant: "full" | "highlights";
      layout: "image-top" | "image-bottom" | "image-start" | "image-end";
      collectionId: string;
    }
  | { component: "iiif-viewer"; manifestUrl: string }
  | { component: "image"; image: WebImage }
  | { component: "image-gallery" }
  | { component: "interactive-chapter-table" }
  | { component: "item-gallery" }
  | { component: "menu" }
  | { component: "menu-item" }
  | { component: "n-columns"; columns: Array<WebElement> }
  | { component: "n-rows"; rows: Array<WebElement> }
  | { component: "network-graph" }
  | { component: "table"; headers: Array<string>; tableId: string }
  | {
      component: "text";
      variant: "title" | "block" | "banner";
      content: string;
    }
  | {
      component: "text-image";
      variant: "title" | "block" | "banner";
      layout:
        | "image-top"
        | "image-bottom"
        | "image-start"
        | "image-end"
        | "image-background";
      captionLayout: "top" | "bottom" | "suppress";
      image: WebImage;
      imageOpacity: number | null;
      content: string;
    };

export type WebImage = {
  url: string;
  label: string | null;
  width: number;
  height: number;
};

export type Style = {
  label: string;
  value: string;
};
