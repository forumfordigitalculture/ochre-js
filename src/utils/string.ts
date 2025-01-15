import { z } from "zod";
import type {
  FakeString,
  OchreStringContent,
  OchreStringItem,
  OchreStringRichTextItem,
  RenderOption,
  WhitespaceOption,
} from "../types/internal.raw.d.ts";
import type { Footnote } from "../types/main.d.ts";

/**
 * Validates if a string is a valid URL
 * @param url - String to validate as URL
 * @returns Boolean indicating if string is valid URL
 */
function isUrlValid(url: string) {
  const pattern = new RegExp(
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\w$&+,:;=-]+@)?[\d.A-Za-z-]+(:\d+)?|(?:www.|[\w$&+,:;=-]+@)[\d.A-Za-z-]+)((?:\/[%+./~\w-_]*)?\??[\w%&+.;=@-]*#?\w*)?)/,
  );

  return !!pattern.test(url);
}

const renderOptionsSchema = z
  .string()
  .transform((str) => str.split(" "))
  .pipe(
    z.array(
      z.enum([
        "bold",
        "italic",
        "underline",
      ] as const satisfies ReadonlyArray<RenderOption>),
    ),
  );
const whitespaceSchema = z
  .string()
  .transform((str) => str.split(" "))
  .pipe(
    z.array(
      z.enum([
        "newline",
        "trailing",
        "leading",
      ] as const satisfies ReadonlyArray<WhitespaceOption>),
    ),
  );
const emailSchema = z.string().email({ message: "Invalid email" });
const urlSchema = z.string().refine((v) => (v ? isUrlValid(v) : false), {
  message: "Invalid URL",
});

/**
 * Gets a string item from an array of items matching the specified language
 * @param content - Array of string items to search
 * @param language - Language code to match
 * @returns Matching string item or null if not found
 */
function getStringItemByLanguage(
  content: Array<OchreStringItem>,
  language: string,
): OchreStringItem | null {
  const stringItemToFind = content.find((item) => item.lang === language);

  if (stringItemToFind) {
    return stringItemToFind;
  } else {
    return null;
  }
}

/**
 * Parses a string and wraps any emails or URLs in ExternalLink components
 * @param string - String to parse
 * @returns String with wrapped email and URL links
 */
export function parseEmailAndUrl(string: string): string {
  const splitString = string.split(" ");
  const returnSplitString: Array<string> = [];

  for (const string of splitString) {
    const cleanString = string
      .replaceAll(/(?<=\s|^)[([{]+|[)\]}]+(?=\s|$)/g, "")
      .replace(/[!),.:;?\]]$/, "");

    const index = string.indexOf(cleanString);

    const before = string.slice(0, index);
    const after = string.slice(index + cleanString.length);

    const isEmail = emailSchema.safeParse(cleanString).success;
    if (isEmail) {
      returnSplitString.push(
        before,
        `${before}<ExternalLink href="mailto:${cleanString}">${cleanString}</ExternalLink>${after}`,
      );
      continue;
    }

    const isUrl = urlSchema.safeParse(cleanString).success;
    if (isUrl) {
      returnSplitString.push(
        `${before}<ExternalLink href="${cleanString}">${cleanString}</ExternalLink>${after}`,
      );
      continue;
    }

    returnSplitString.push(string);
  }

  return returnSplitString.join(" ");
}

/**
 * Applies render options (bold, italic, underline) to a string
 * @param contentString - String to apply rendering to
 * @param renderString - Space-separated string of render options
 * @returns Rendered string with markdown formatting
 */
function parseRenderOptions(
  contentString: string,
  renderString: string,
): string {
  let returnString = contentString;

  const result = renderOptionsSchema.safeParse(renderString);
  if (!result.success) {
    console.warn(`Invalid render options string provided: “${renderString}”`);

    return contentString;
  }

  for (const option of result.data) {
    switch (option) {
      case "bold": {
        returnString = `**${returnString}**`;
        break;
      }
      case "italic": {
        returnString = `*${returnString}*`;
        break;
      }
      case "underline": {
        returnString = `_${returnString}_`;
        break;
      }
    }
  }

  return returnString.replaceAll("&#39;", "'");
}

/**
 * Applies whitespace options (newline, trailing, leading) to a string
 * @param contentString - String to apply whitespace to
 * @param whitespace - Space-separated string of whitespace options
 * @returns String with applied whitespace
 */
function parseWhitespace(contentString: string, whitespace: string): string {
  let returnString = contentString;

  const result = whitespaceSchema.safeParse(whitespace);
  if (!result.success) {
    console.warn(`Invalid whitespace string provided: “${whitespace}”`);

    return contentString;
  }

  for (const option of result.data) {
    switch (option) {
      case "newline": {
        // newline in markdown
        returnString = `${returnString}\n<br />`;
        break;
      }
      case "trailing": {
        returnString = `${returnString} `;
        break;
      }
      case "leading": {
        returnString = ` ${returnString}`;
        break;
      }
    }
  }

  return returnString.replaceAll("&#39;", "'");
}

/**
 * Converts various primitive types to strings
 * @param string - Value to convert (string, number, or boolean)
 * @returns Converted string value
 */
export function parseFakeString(string: FakeString): string {
  let returnString = "";

  if (typeof string === "string") {
    returnString = string;
  } else if (typeof string === "number") {
    returnString = string.toString();
  } else if (typeof string === "boolean") {
    returnString = string ? "Yes" : "No";
  }

  return returnString.replaceAll("&#39;", "'");
}

/**
 * Parses an OCHRE string item into a formatted string
 * @param item - OCHRE string item to parse
 * @returns Parsed and formatted string
 */
export function parseStringItem(item: OchreStringItem): string {
  let returnString = "";

  switch (typeof item.string) {
    case "string": {
      returnString = item.string;
      break;
    }
    case "number":
    case "boolean": {
      returnString = parseFakeString(item.string);
      break;
    }
    case "object": {
      const stringItems =
        Array.isArray(item.string) ? item.string : [item.string];

      for (const stringItem of stringItems) {
        const renderedText =
          stringItem.rend ?
            parseRenderOptions(
              parseFakeString(stringItem.content),
              stringItem.rend,
            )
          : parseFakeString(stringItem.content);

        const whitespacedText =
          stringItem.whitespace ?
            parseWhitespace(renderedText, stringItem.whitespace)
          : renderedText;

        returnString += whitespacedText;
      }
      break;
    }
    default: {
      returnString = "";
      break;
    }
  }

  return returnString.replaceAll("&#39;", "'");
}

/**
 * Parses OCHRE string content into a formatted string
 * @param content - OCHRE string content to parse
 * @param language - Language code to use (defaults to 'eng')
 * @returns Parsed and formatted string
 */
export function parseStringContent(
  content: OchreStringContent,
  language = "eng",
): string {
  switch (typeof content.content) {
    case "string":
    case "number":
    case "boolean": {
      return parseFakeString(content.content);
    }
    case "object": {
      if (Array.isArray(content.content)) {
        const stringItem = getStringItemByLanguage(content.content, language);

        if (stringItem) {
          return parseStringItem(stringItem);
        } else {
          const returnStringItem = content.content[0];
          if (!returnStringItem) {
            throw new Error(
              `No string item found for language “${language}” in the following content:\n${JSON.stringify(
                content.content,
              )}.`,
            );
          }

          return parseStringItem(returnStringItem);
        }
      } else {
        return parseStringItem(content.content);
      }
    }
  }
}

/**
 * Parses an OCHRE rich text item into a formatted string with components
 * @param item - OCHRE rich text item to parse
 * @param footnotes - Optional array to collect footnotes
 * @returns Parsed string with markdown and component formatting
 */
export function parseStringDocumentItem(
  item: OchreStringRichTextItem,
  footnotes?: Array<Footnote>,
): string {
  if (
    typeof item === "string" ||
    typeof item === "number" ||
    typeof item === "boolean"
  ) {
    return parseEmailAndUrl(parseFakeString(item));
  }

  if ("whitespace" in item && !("content" in item) && !("string" in item)) {
    if (item.whitespace === "newline") {
      // newline in markdown
      return "  \n";
    } else {
      return "";
    }
  }

  if ("links" in item) {
    const itemString = parseFakeString(item.string)
      .replaceAll("<", String.raw`\<`)
      .replaceAll("{", String.raw`\{`);

    const itemLinks = Array.isArray(item.links) ? item.links : [item.links];
    for (const link of itemLinks) {
      if ("resource" in link) {
        const linkResource =
          Array.isArray(link.resource) ? link.resource[0]! : link.resource;

        let linkContent: string | null = null;
        if (linkResource.content) {
          linkContent = parseFakeString(linkResource.content)
            .replaceAll("<", String.raw`\<`)
            .replaceAll("{", String.raw`\{`);
        }

        switch (linkResource.type) {
          case "image": {
            if (linkResource.rend === "inline") {
              return `<InlineImage uuid="${linkResource.uuid}" ${
                linkContent ? `content="${linkContent}"` : ""
              } height={${linkResource.height?.toString() ?? "null"}} width={${linkResource.width?.toString() ?? "null"}} />`;
            } else if (linkResource.publicationDateTime) {
              return `<ExternalLink href="https:\\/\\/ochre.lib.uchicago.edu/ochre?uuid=${linkResource.uuid}" type="image"${
                linkContent ? ` content="${linkContent}"` : ""
              }>${itemString}</ExternalLink>`;
            } else {
              return `<TooltipSpan type="image" ${
                linkContent ? `content="${linkContent}"` : ""
              }>${itemString}</TooltipSpan>`;
            }
          }
          case "internalDocument": {
            const isFootnote = linkContent
              ?.toLocaleLowerCase("en-US")
              .includes("footnote");

            if (isFootnote) {
              if (footnotes) {
                footnotes.push({
                  uuid: linkResource.uuid,
                  label: itemString,
                  content: "",
                });
              }

              return ` <Footnote uuid="${linkResource.uuid}"${
                itemString ? ` label="${itemString}"` : ""
              }${linkContent ? ` content="${linkContent}"` : ""} />`;
            } else {
              return `<ExternalLink href="https:\\/\\/ochre.lib.uchicago.edu/ochre?uuid=${linkResource.uuid}" type="internalDocument" ${
                linkContent ? `content="${linkContent}"` : ""
              }>${itemString}</ExternalLink>`;
            }
          }
          case "externalDocument": {
            if (linkResource.publicationDateTime) {
              return `<ExternalLink href="https:\\/\\/ochre.lib.uchicago.edu/ochre?uuid=${linkResource.uuid}" type="externalDocument" ${
                linkContent ? `content="${linkContent}"` : ""
              }>${itemString}</ExternalLink>`;
            } else {
              return `<TooltipSpan type="externalDocument" ${
                linkContent ? `content="${linkContent}"` : ""
              }>${itemString}</TooltipSpan>`;
            }
          }
        }
      } else if ("concept" in link) {
        const linkConcept =
          Array.isArray(link.concept) ? link.concept[0]! : link.concept;

        if (linkConcept.publicationDateTime) {
          return `<ExternalLink href="https:\\/\\/ochre.lib.uchicago.edu/ochre?uuid=${linkConcept.uuid}" type="concept">${itemString}</ExternalLink>`;
        } else {
          return `<TooltipSpan type="concept">${itemString}</TooltipSpan>`;
        }
      } else if ("set" in link) {
        const linkSet = Array.isArray(link.set) ? link.set[0]! : link.set;

        if (linkSet.publicationDateTime) {
          return `<ExternalLink href="https:\\/\\/ochre.lib.uchicago.edu/ochre?uuid=${linkSet.uuid}" type="set">${itemString}</ExternalLink>`;
        } else {
          return `<TooltipSpan type="set">${itemString}</TooltipSpan>`;
        }
      } else if ("person" in link) {
        const linkPerson =
          Array.isArray(link.person) ? link.person[0]! : link.person;

        const linkContent =
          linkPerson.identification ?
            parseStringContent(linkPerson.identification.label)
          : null;

        if (linkPerson.publicationDateTime) {
          return `<ExternalLink href="https:\\/\\/ochre.lib.uchicago.edu/ochre?uuid=${linkPerson.uuid}" type="${linkPerson.type ?? "person"}" ${
            linkContent ? `content="${linkContent}"` : ""
          }>${itemString}</ExternalLink>`;
        } else {
          return `<TooltipSpan type="${linkPerson.type ?? "person"}" ${
            linkContent ? `content="${linkContent}"` : ""
          }>${itemString}</TooltipSpan>`;
        }
      } else if ("bibliography" in link) {
        const linkBibliography =
          Array.isArray(link.bibliography) ?
            link.bibliography[0]!
          : link.bibliography;

        if (linkBibliography.publicationDateTime) {
          return `<ExternalLink href="https:\\/\\/ochre.lib.uchicago.edu/ochre?uuid=${linkBibliography.uuid}" type="${linkBibliography.type || "bibliography"}">${itemString}</ExternalLink>`;
        } else {
          return `<TooltipSpan type="bibliography">${itemString}</TooltipSpan>`;
        }
      }
    }
  }

  let returnString = "";

  if ("string" in item) {
    const stringItems =
      Array.isArray(item.string) ? item.string : [item.string];

    for (const stringItem of stringItems) {
      returnString += parseStringDocumentItem(stringItem, footnotes);
    }

    if ("whitespace" in item && item.whitespace) {
      returnString = parseWhitespace(
        parseEmailAndUrl(returnString),
        item.whitespace,
      );
    }

    return returnString.replaceAll("&#39;", "'");
  } else {
    returnString = parseFakeString(item.content);

    if (item.rend) {
      returnString = parseRenderOptions(
        parseEmailAndUrl(returnString),
        item.rend,
      );
    }

    if (item.whitespace) {
      returnString = parseWhitespace(
        parseEmailAndUrl(returnString),
        item.whitespace,
      );
    }
  }

  return returnString.replaceAll("&#39;", "'");
}
