import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { parse } from "csv-parse";
import * as fs from "fs/promises";
import { JSDOM } from "jsdom";
import mammoth from "mammoth";
import * as path from "path";
import { Item, ItemHandler, PdfReader } from "pdfreader";

export const DOCUMENT_READER_TOOL: Tool = {
  name: "document_reader",
  description:
    "Read content from non-image document-files at specified paths, supporting various file formats: .pdf, .docx, .txt, .html, .csv",
  inputSchema: {
    type: "object",
    properties: {
      filePath: {
        type: "string",
        description: "Path to the file to be read",
      },
    },
    required: ["filePath"],
  },
};

export interface FileReaderArgs {
  filePath: string;
}

export function isFileReaderArgs(args: unknown): args is FileReaderArgs {
  return (
    typeof args === "object" &&
    args !== null &&
    "filePath" in args &&
    typeof (args as FileReaderArgs).filePath === "string"
  );
}

async function readTextFile(filePath: string): Promise<string> {
  return await fs.readFile(filePath, "utf-8");
}

async function readPDFFile(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath);

  return new Promise((resolve, reject) => {
    let content = "";
    const reader = new PdfReader();

    reader.parseBuffer(buffer, ((err: null | Error, item: Item | undefined) => {
      if (err) {
        reject(err);
      } else if (!item) {
        resolve(content);
      } else if (item.text) {
        content += item.text + " ";
      }
    }) as ItemHandler);
  });
}

async function readDocxFile(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath);
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

async function readCSVFile(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath, "utf-8");
  return new Promise((resolve, reject) => {
    parse(content, (err, records) => {
      if (err) reject(err);
      resolve(JSON.stringify(records));
    });
  });
}

async function readHTMLFile(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath, "utf-8");
  const dom = new JSDOM(content);
  return dom.window.document.body.textContent || "";
}

export async function readFile(filePath: string) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    let content: string;

    switch (ext) {
      case ".pdf":
        content = await readPDFFile(filePath);
        break;
      case ".docx":
        content = await readDocxFile(filePath);
        break;
      case ".txt":
        content = await readTextFile(filePath);
        break;
      case ".html":
        content = await readHTMLFile(filePath);
        break;
      case ".csv":
        content = await readCSVFile(filePath);
        break;
      default:
        throw new Error(`Unsupported file format: ${ext}`);
    }

    return {
      success: true,
      data: content,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
} 