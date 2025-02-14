import { DOCUMENT_READER_TOOL } from "./documentReader.js";
import { DOCX_TO_HTML_TOOL, DOCX_TO_PDF_TOOL } from "./docxTools.js";
import {
  HTML_CLEAN_TOOL,
  HTML_EXTRACT_RESOURCES_TOOL,
  HTML_FORMAT_TOOL,
  HTML_TO_MARKDOWN_TOOL,
  HTML_TO_TEXT_TOOL,
} from "./htmlTools.js";
import { PDF_MERGE_TOOL, PDF_SPLIT_TOOL } from "./pdfTools.js";

import {
  TEXT_DIFF_TOOL,
  TEXT_ENCODING_CONVERT_TOOL,
  TEXT_FORMAT_TOOL,
  TEXT_SPLIT_TOOL,
} from "./txtTools.js";

export const tools = [
  DOCUMENT_READER_TOOL,

  PDF_MERGE_TOOL,
  PDF_SPLIT_TOOL,

  DOCX_TO_PDF_TOOL,
  DOCX_TO_HTML_TOOL,

  HTML_CLEAN_TOOL,
  HTML_TO_TEXT_TOOL,
  HTML_TO_MARKDOWN_TOOL,
  HTML_EXTRACT_RESOURCES_TOOL,
  HTML_FORMAT_TOOL,

  TEXT_DIFF_TOOL,
  TEXT_SPLIT_TOOL,
  TEXT_FORMAT_TOOL,
  TEXT_ENCODING_CONVERT_TOOL,
];

export * from "./documentReader.js";
export * from "./docxTools.js";
export * from "./htmlTools.js";
export * from "./pdfTools.js";
export * from "./txtTools.js";
