import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { marked } from "marked";
import * as xml2js from "xml2js";

/**
 * Supported format types for conversion
 */
export enum FormatType {
  MARKDOWN = "markdown",
  HTML = "html",
  XML = "xml",
  JSON = "json",
}

/**
 * Format converter tool
 */
export const FORMAT_CONVERTER_TOOL: Tool = {
  name: "format_convert",
  description: "Convert between different document formats (Markdown, HTML, XML, JSON)",
  inputSchema: {
    type: "object",
    properties: {
      input: {
        type: "string",
        description: "Input content to convert",
      },
      fromFormat: {
        type: "string",
        enum: Object.values(FormatType),
        description: "Source format",
      },
      toFormat: {
        type: "string",
        enum: Object.values(FormatType),
        description: "Target format",
      },
    },
    required: ["input", "fromFormat", "toFormat"],
  },
};

export interface FormatConverterArgs {
  input: string;
  fromFormat: FormatType;
  toFormat: FormatType;
}

/**
 * Type check function
 */
export function isFormatConverterArgs(args: unknown): args is FormatConverterArgs {
  return typeof args === "object" && args !== null && "input" in args && "fromFormat" in args && "toFormat" in args && typeof (args as FormatConverterArgs).input === "string" && Object.values(FormatType).includes((args as FormatConverterArgs).fromFormat) && Object.values(FormatType).includes((args as FormatConverterArgs).toFormat);
}

// XML 解析器和建構器
const xmlParser = new xml2js.Parser();
const xmlBuilder = new xml2js.Builder();

/**
 * Converts Markdown to HTML
 */
async function markdownToHtml(input: string): Promise<string> {
  return marked(input);
}

/**
 * Converts XML to JSON
 */
async function xmlToJson(input: string): Promise<string> {
  try {
    const result = await xmlParser.parseStringPromise(input);
    return JSON.stringify(result, null, 2);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(`Failed to parse XML: ${errorMessage}`);
  }
}

/**
 * Converts JSON to XML
 */
function jsonToXml(input: string): string {
  try {
    const obj = JSON.parse(input);
    return xmlBuilder.buildObject(obj);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(`Failed to parse JSON: ${errorMessage}`);
  }
}

/**
 * Converts content from one format to another
 * @param input Input content to convert
 * @param fromFormat Source format
 * @param toFormat Target format
 * @returns Promise resolving to the converted content
 */
export async function convertFormat(input: string, fromFormat: FormatType, toFormat: FormatType) {
  try {
    console.log(`Converting from ${fromFormat} to ${toFormat}`);

    // Validate formats
    if (!Object.values(FormatType).includes(fromFormat)) {
      return {
        success: false,
        error: `Unsupported source format: ${fromFormat}`,
      };
    }
    if (!Object.values(FormatType).includes(toFormat)) {
      return {
        success: false,
        error: `Unsupported target format: ${toFormat}`,
      };
    }

    // Handle different conversion paths
    let result: string;
    switch (`${fromFormat}-${toFormat}`) {
      case `${FormatType.MARKDOWN}-${FormatType.HTML}`:
        result = await markdownToHtml(input);
        break;
      case `${FormatType.HTML}-${FormatType.MARKDOWN}`:
        return {
          success: false,
          error: "HTML to Markdown conversion is not supported yet",
        };
      case `${FormatType.XML}-${FormatType.JSON}`:
        result = await xmlToJson(input);
        break;
      case `${FormatType.JSON}-${FormatType.XML}`:
        result = jsonToXml(input);
        break;
      default:
        return {
          success: false,
          error: `Unsupported conversion path: ${fromFormat} to ${toFormat}`,
        };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error(`Error converting format: ${errorMessage}`);
    return {
      success: false,
      error: errorMessage,
    };
  }
}
