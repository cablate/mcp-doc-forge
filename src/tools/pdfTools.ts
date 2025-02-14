import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { randomBytes } from "crypto";
import * as fs from "fs/promises";
import * as path from "path";
import { PDFDocument } from "pdf-lib";
import { fromPath } from "pdf2pic";

function generateUniqueId(): string {
  return randomBytes(9).toString("hex");
}

// PDF 合併工具
export const PDF_MERGE_TOOL: Tool = {
  name: "pdf_merger",
  description: "Merge multiple PDF files into one",
  inputSchema: {
    type: "object",
    properties: {
      inputPaths: {
        type: "array",
        items: { type: "string" },
        description: "Paths to the input PDF files",
      },
      outputDir: {
        type: "string",
        description: "Directory where merged PDFs should be saved",
      },
    },
    required: ["inputPaths", "outputDir"],
  },
};

// PDF 分割工具
export const PDF_SPLIT_TOOL: Tool = {
  name: "pdf_splitter",
  description: "Split a PDF file into multiple files",
  inputSchema: {
    type: "object",
    properties: {
      inputPath: {
        type: "string",
        description: "Path to the input PDF file",
      },
      outputDir: {
        type: "string",
        description: "Directory where split PDFs should be saved",
      },
      pageRanges: {
        type: "array",
        items: {
          type: "object",
          properties: {
            start: { type: "number" },
            end: { type: "number" },
          },
        },
        description: "Array of page ranges to split",
      },
    },
    required: ["inputPath", "outputDir", "pageRanges"],
  },
};

// 實作函數
export async function mergePDFs(inputPaths: string[], outputDir: string) {
  try {
    console.error(`Starting PDF merge operation...`);
    console.error(`Input files:`, inputPaths);
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
    console.error(`Generated unique ID for this batch: ${uniqueId}`);

    // 修改輸出檔案名稱，加入 uniqueId
    const outputPath = path.join(outputDir, `merged_${uniqueId}.pdf`);
    console.error(`New output path with unique ID: ${outputPath}`);

    const mergedPdf = await PDFDocument.create();

    for (const filePath of inputPaths) {
      console.error(`Processing input file: ${filePath}`);
      const pdfBytes = await fs.readFile(filePath);
      console.error(`Read ${pdfBytes.length} bytes from ${filePath}`);

      const pdf = await PDFDocument.load(pdfBytes);
      const pageCount = pdf.getPageCount();
      console.error(`Loaded PDF with ${pageCount} pages from ${filePath}`);

      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      console.error(`Copied ${copiedPages.length} pages from ${filePath}`);

      copiedPages.forEach((page, index) => {
        mergedPdf.addPage(page);
        console.error(`Added page ${index + 1} from ${filePath}`);
      });
    }

    const mergedPdfBytes = await mergedPdf.save();
    console.error(`Generated merged PDF: ${mergedPdfBytes.length} bytes`);

    await fs.writeFile(outputPath, mergedPdfBytes);
    console.error(`Successfully wrote merged PDF to ${outputPath}`);

    return {
      success: true,
      data: `Successfully merged ${inputPaths.length} PDFs into ${outputPath}`,
    };
  } catch (error) {
    console.error(`Error in mergePDFs:`);
    console.error(error);
    if (error instanceof Error) {
      console.error(`Error name: ${error.name}`);
      console.error(`Error message: ${error.message}`);
      console.error(`Error stack: ${error.stack}`);
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function splitPDF(
  inputPath: string,
  outputDir: string,
  pageRanges: Array<{ start: number; end: number }>
) {
  try {
    console.error(`Starting PDF split operation...`);
    console.error(`Input file: ${inputPath}`);
    console.error(`Output directory: ${outputDir}`);
    console.error(`Page ranges:`, JSON.stringify(pageRanges, null, 2));

    // 確保輸出目錄存在
    try {
      await fs.access(outputDir);
      console.error(`Output directory exists: ${outputDir}`);
    } catch {
      console.error(`Creating output directory: ${outputDir}`);
      await fs.mkdir(outputDir, { recursive: true });
      console.error(`Created output directory: ${outputDir}`);
    }

    const pdfBytes = await fs.readFile(inputPath);
    console.error(
      `Successfully read input PDF, size: ${pdfBytes.length} bytes`
    );

    const pdf = await PDFDocument.load(pdfBytes);
    const totalPages = pdf.getPageCount();
    console.error(`PDF loaded successfully. Total pages: ${totalPages}`);

    const uniqueId = generateUniqueId();
    console.error(`Generated unique ID for this batch: ${uniqueId}`);
    const results: string[] = [];

    for (let i = 0; i < pageRanges.length; i++) {
      const { start, end } = pageRanges[i];
      console.error(`Processing range ${i + 1}: pages ${start} to ${end}`);

      if (start > totalPages || end > totalPages) {
        throw new Error(
          `Invalid page range: ${start}-${end}. PDF only has ${totalPages} pages`
        );
      }

      if (start > end) {
        throw new Error(
          `Invalid page range: start (${start}) is greater than end (${end})`
        );
      }

      const newPdf = await PDFDocument.create();
      const pageIndexes = Array.from(
        { length: end - start + 1 },
        (_, i) => start - 1 + i
      );
      console.error(`Copying pages with indexes:`, pageIndexes);

      const pages = await newPdf.copyPages(pdf, pageIndexes);
      console.error(`Successfully copied ${pages.length} pages`);

      pages.forEach((page, pageIndex) => {
        newPdf.addPage(page);
        console.error(`Added page ${pageIndex + 1} to new PDF`);
      });

      const outputPath = path.join(outputDir, `split_${uniqueId}_${i + 1}.pdf`);
      console.error(`Saving split PDF to: ${outputPath}`);

      const newPdfBytes = await newPdf.save();
      console.error(`Generated PDF bytes: ${newPdfBytes.length}`);

      await fs.writeFile(outputPath, newPdfBytes);
      console.error(`Successfully wrote PDF to ${outputPath}`);

      results.push(outputPath);
    }

    console.error(`Split operation completed successfully`);
    return {
      success: true,
      data: `Successfully split PDF into ${
        results.length
      } files: ${results.join(", ")}`,
    };
  } catch (error) {
    console.error(`Error in splitPDF:`);
    console.error(error);
    if (error instanceof Error) {
      console.error(`Error name: ${error.name}`);
      console.error(`Error message: ${error.message}`);
      console.error(`Error stack: ${error.stack}`);
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function pdfToImages(
  inputPath: string,
  outputDir: string,
  format: "png" | "jpeg" = "png",
  dpi: number = 300
) {
  try {
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
    console.error(`Generated unique ID for this batch: ${uniqueId}`);

    const convert = fromPath(inputPath, {
      density: dpi,
      format: format as string,
      width: 2048,
      height: 2048,
      saveFilename: `page_${uniqueId}`,
      savePath: outputDir,
    });

    const pdfBytes = await fs.readFile(inputPath);
    const pdf = await PDFDocument.load(pdfBytes);
    const pageCount = pdf.getPageCount();

    const results: string[] = [];
    for (let i = 1; i <= pageCount; i++) {
      const result = await convert(i);
      result.path && results.push(result.path);
    }

    return {
      success: true,
      data: `Successfully converted ${pageCount} pages to images in ${outputDir}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
