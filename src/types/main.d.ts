/**
 * Core data structure containing metadata and item content
 */
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

/**
 * Basic identification information with label and abbreviation
 */
export type Identification = {
  label: string;
  abbreviation: string;
};

/**
 * Metadata containing project, item, dataset and publication information
 */
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
  languages: Array<string>;
  identifier: string;
  description: string;
};

/**
 * Context item containing reference information
 */
export type ContextItem = {
  uuid: string;
  publicationDateTime: Date | null;
  number: number;
  content: string;
};

/**
 * Node in a context tree structure
 */
export type ContextNode = {
  tree: ContextItem;
  project: ContextItem;
  spatialUnit: Array<ContextItem>;
};

/**
 * Context containing hierarchical nodes and display path
 */
export type Context = {
  nodes: Array<ContextNode>;
  displayPath: string;
};

/**
 * License information with content and URL
 */
export type License = {
  content: string;
  url: string;
};

/**
 * Person information including identification and metadata
 */
export type Person = {
  uuid: string;
  publicationDateTime: Date | null;
  type: string | null;
  date: Date | null;
  identification: Identification | null;
  content: string | null;
};

/**
 * Note with number, title and content
 */
export type Note = {
  number: number;
  title: string | null;
  content: string;
};

/**
 * Image with metadata and source information
 */
export type Image = {
  publicationDateTime: Date | null;
  identification: Identification | null;
  url: string | null;
  htmlPrefix: string | null;
  content: string | null;
};

/**
 * Link to another resource with metadata
 */
export type Link = {
  uuid: string;
  publicationDateTime: Date | null;
  type: string | null;
  variant:
    | "resource"
    | "concept"
    | "set"
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

/**
 * Area within an image map
 */
export type ImageMapArea = {
  uuid: string;
  publicationDateTime: Date | null;
  type: string;
  title: string;
  shape: "rectangle" | "polygon";
  coords: Array<number>;
};

/**
 * Image map containing clickable areas
 */
export type ImageMap = {
  area: Array<ImageMapArea>;
  width: number;
  height: number;
};

/**
 * Geographic coordinates with optional metadata
 */
export type Coordinates = {
  latitude: number;
  longitude: number;
  type: string | null;
  label: string | null;
};

/**
 * Observation record with metadata, notes, links and properties
 */
export type Observation = {
  number: number;
  date: Date | null;
  observers: Array<string>;
  notes: Array<Note>;
  links: Array<Link>;
  properties: Array<Property>;
};

/**
 * Event record with date, label and optional agent
 */
export type Event = {
  date: Date | null;
  label: string;
  agent: {
    uuid: string;
    content: string;
  } | null;
};

/**
 * Interpretation record with date, number and properties
 */
export type Interpretation = {
  date: Date | null;
  number: number;
  properties: Array<Property>;
};

/**
 * Document containing content and footnotes
 */
export type Document = {
  content: string;
  footnotes: Array<Footnote>;
};

/**
 * Footnote with identifier, label and content
 */
export type Footnote = {
  uuid: string;
  label: string;
  content: string;
};

/**
 * Resource record containing metadata and content
 */
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

/**
 * Nested resource without publication and license information
 */
export type NestedResource = Omit<
  Resource,
  "publicationDateTime" | "license" | "copyright"
>;

/**
 * Spatial unit record with location and observation data
 */
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

/**
 * Nested spatial unit without publication and observation data
 */
export type NestedSpatialUnit = Omit<
  SpatialUnit,
  "publicationDateTime" | "license" | "observations" | "events"
> & {
  properties: Array<Property>;
};

/**
 * Concept record with interpretations
 */
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

/**
 * Nested concept without publication and license information
 */
export type NestedConcept = Omit<Concept, "publicationDateTime" | "license">;

/**
 * Set containing collections of resources, spatial units and concepts
 */
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

/**
 * Bibliography record with citation and publication information
 */
export type Bibliography = {
  uuid: string;
  publicationDateTime: Date | null;
  type: string;
  number: number;
  identification: Identification;
  projectIdentification: Identification | null;
  context: Context | null;
  citation: {
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

/**
 * Period record with identification information
 */
export type Period = {
  uuid: string;
  publicationDateTime: Date | null;
  type: string;
  identification: Identification;
};

/**
 * Valid property value types
 */
export type PropertyValueType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "dateTime"
  | "time"
  | "IDREF";

/**
 * Property value with type information
 */
export type PropertyValue = {
  content: string;
  type: PropertyValueType;
  category: string | null;
  uuid: string | null;
  publicationDateTime: Date | null;
};

/**
 * Property with values and nested properties
 */
export type Property = {
  label: string;
  values: Array<PropertyValue>;
  comment: string | null;
  properties: Array<Property>;
};

/**
 * Tree structure containing resources, spatial units and concepts
 */
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

/**
 * Website configuration and content
 */
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
  globalElements: Array<WebElement>;
  properties: WebsiteProperties;
};

/**
 * Website configuration properties
 */
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
  logoUrl: string | null;
};

/**
 * Webpage content and properties
 */
export type Webpage = {
  title: string;
  slug: string;
  properties: WebpageProperties;
  elements: Array<WebElement>;
  webpages: Array<Webpage>;
};

/**
 * Webpage display properties
 */
export type WebpageProperties = {
  displayedInHeader: boolean;
  width: "full" | "large" | "default";
  backgroundImageUrl: string | null;
  cssStyles: Array<Style>;
  tailwindClasses: Array<string>;
};

/**
 * Web element with styling information
 */
export type WebElement = {
  uuid: string;
  title: string;
  cssStyles: Array<Style>;
  tailwindClasses: Array<string>;
} & WebElementComponent;

/**
 * Web element component variants
 */
export type WebElementComponent =
  | {
      component: "annotated-document";
      document: Document;
    }
  | { component: "annotated-image"; imageUrl: string }
  | {
      component: "bibliography";
      bibliographies: Array<Bibliography>;
      layout: "long" | "short";
    }
  | { component: "button"; href: string }
  | { component: "button-group"; layout: "horizontal" | "vertical" }
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
        | "caption-top"
        | "caption-bottom"
        | "image-top"
        | "image-bottom"
        | "image-start"
        | "image-end"
        | "image-background";
      image: WebImage;
      imageOpacity: number | null;
      content: string;
    };

/**
 * Web image with dimensions
 */
export type WebImage = {
  url: string;
  label: string | null;
  width: number;
  height: number;
};

/**
 * CSS style definition
 */
export type Style = {
  label: string;
  value: string;
};
