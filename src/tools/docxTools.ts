import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { randomBytes } from "crypto";
import * as fs from "fs/promises";
import mammoth from "mammoth";
import * as path from "path";
// @ts-ignore
import { convert } from "libreoffice-convert";
import { promisify } from "util";

function generateUniqueId(): string {
  return randomBytes(9).toString("hex");
}

// DOCX 轉 HTML 工具
export const DOCX_TO_HTML_TOOL: Tool = {
  name: "docx_to_html",
  description: "Convert DOCX to HTML while preserving formatting",
  inputSchema: {
    type: "object",
    properties: {
      inputPath: {
        type: "string",
        description: "Path to the input DOCX file",
      },
      outputDir: {
        type: "string",
        description: "Directory where HTML should be saved",
      },
    },
    required: ["inputPath", "outputDir"],
  },
};

// DOCX 轉 PDF 工具
export const DOCX_TO_PDF_TOOL: Tool = {
  name: "docx_to_pdf",
  description: "Convert DOCX files to PDF format",
  inputSchema: {
    type: "object",
    properties: {
      inputPath: {
        type: "string",
        description: "Path to the input DOCX file",
      },
      outputPath: {
        type: "string",
        description: "Path where the output PDF file should be saved",
      },
    },
    required: ["inputPath", "outputPath"],
  },
};
export interface DocxToPdfArgs {
  inputPath: string;
  outputPath: string;
}

// DOCX 轉 HTML 實作
export async function docxToHtml(inputPath: string, outputDir: string) {
  try {
    console.error(`Starting DOCX to HTML conversion...`);
    console.error(`Input file: ${inputPath}`);
    console.error(`Output directory: ${outputDir}`);

    // 確保輸出目錄存在
    try {
      await fs.access(outputDir);
      console.error(`Output directory exists: ${outputDir}`);
    } catch {
      console.error(`Creating output directory: ${outputDir}`);
      await fs.mkdir(outputDir, { recursive: true });
      console.error(`Created output directory: ${outputDir}`);
    }

    const uniqueId = generateUniqueId();
    const buffer = await fs.readFile(inputPath);

    const result = await mammoth.convertToHtml({ buffer });
    console.error(
      `Conversion completed with ${result.messages.length} messages`
    );

    const outputPath = path.join(outputDir, `converted_${uniqueId}.html`);
    await fs.writeFile(outputPath, result.value);
    console.error(`Written HTML to ${outputPath}`);

    return {
      success: true,
      data: `Successfully converted DOCX to HTML: ${outputPath}`,
    };
  } catch (error) {
    console.error(`Error in docxToHtml:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// DOCX 轉 PDF 實作
export function isDocxToPdfArgs(args: unknown): args is DocxToPdfArgs {
  return (
    typeof args === "object" &&
    args !== null &&
    "inputPath" in args &&
    "outputPath" in args &&
    typeof (args as DocxToPdfArgs).inputPath === "string" &&
    typeof (args as DocxToPdfArgs).outputPath === "string"
  );
}
const convertAsyncPromise = promisify(convert);
export async function convertDocxToPdf(inputPath: string, outputPath: string) {
  try {
    const ext = path.extname(inputPath).toLowerCase();
    if (ext !== ".docx") {
      throw new Error("Input file must be a .docx file");
    }

    if (path.extname(outputPath).toLowerCase() !== ".pdf") {
      throw new Error("Output file must have .pdf extension");
    }

    const docxBuffer = await fs.readFile(inputPath);
    const pdfBuffer = await convertAsyncPromise(docxBuffer, ".pdf", undefined);
    await fs.writeFile(outputPath, pdfBuffer);

    return {
      success: true,
      data: `Successfully converted ${inputPath} to ${outputPath}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
