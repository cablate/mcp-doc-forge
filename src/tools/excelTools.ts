import { Tool } from "@modelcontextprotocol/sdk/types.js";
import * as ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";

/**
 * Interface for Excel file processing options
 */
interface ExcelProcessOptions {
  sheetName?: string;
  includeHeaders?: boolean;
}

// Excel 讀取工具
export const EXCEL_READ_TOOL: Tool = {
  name: "excel_read",
  description: "Read Excel file and convert to JSON format while preserving structure",
  inputSchema: {
    type: "object",
    properties: {
      inputPath: {
        type: "string",
        description: "Path to the input Excel file",
      },
      includeHeaders: {
        type: "boolean",
        description: "Whether to include headers in the output",
        default: true,
      },
    },
    required: ["inputPath"],
  },
};

export interface ExcelReadArgs {
  inputPath: string;
  includeHeaders?: boolean;
}

// 類型檢查函數
export function isExcelReadArgs(args: unknown): args is ExcelReadArgs {
  return typeof args === "object" && args !== null && "inputPath" in args && typeof (args as ExcelReadArgs).inputPath === "string" && (typeof (args as ExcelReadArgs).includeHeaders === "undefined" || typeof (args as ExcelReadArgs).includeHeaders === "boolean");
}

/**
 * Class for handling Excel file operations
 */
export class ExcelTools {
  /**
   * Reads an Excel file and returns its content as JSON
   * @param filePath Path to the Excel file
   * @param options Processing options
   * @returns Promise resolving to the parsed Excel data
   */
  public static async readExcelFile(filePath: string, options: ExcelProcessOptions = { includeHeaders: true }): Promise<any> {
    try {
      // Verify file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      // Verify file extension
      const ext = path.extname(filePath).toLowerCase();
      if (ext !== ".xlsx" && ext !== ".xls") {
        throw new Error(`Unsupported file format: ${ext}`);
      }

      console.log(`Reading Excel file: ${filePath}`);
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);

      const result: any = {};

      workbook.worksheets.forEach((worksheet) => {
        const sheetName = worksheet.name;
        const rows: any[] = [];

        worksheet.eachRow((row, rowNumber) => {
          const rowData: any = {};
          row.eachCell((cell, colNumber) => {
            if (options.includeHeaders && rowNumber === 1) {
              // Handle headers
              rows.push(cell.value);
            } else {
              // Handle data rows
              rowData[colNumber] = cell.value;
            }
          });
          if (rowNumber > 1 || !options.includeHeaders) {
            rows.push(rowData);
          }
        });

        result[sheetName] = rows;
      });

      console.log(`Successfully parsed Excel file: ${filePath}`);
      return result;
    } catch (error: any) {
      console.error(`Error processing Excel file: ${error.message}`);
      throw error;
    }
  }
}

// Excel 讀取實作
export async function readExcelFile(inputPath: string, includeHeaders: boolean = true) {
  try {
    // 驗證檔案存在
    if (!fs.existsSync(inputPath)) {
      return {
        success: false,
        error: `File not found: ${inputPath}`,
      };
    }

    // 驗證檔案副檔名
    const ext = path.extname(inputPath).toLowerCase();
    if (ext !== ".xlsx" && ext !== ".xls") {
      return {
        success: false,
        error: `Unsupported file format: ${ext}`,
      };
    }

    console.log(`Reading Excel file: ${inputPath}`);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(inputPath);

    const result: Record<string, any[]> = {};

    workbook.worksheets.forEach((worksheet) => {
      const sheetName = worksheet.name;
      const rows: any[] = [];

      worksheet.eachRow((row, rowNumber) => {
        const rowData: Record<number, any> = {};
        row.eachCell((cell, colNumber) => {
          if (includeHeaders && rowNumber === 1) {
            rows.push(cell.value);
          } else {
            rowData[colNumber] = cell.value;
          }
        });
        if (rowNumber > 1 || !includeHeaders) {
          rows.push(rowData);
        }
      });

      result[sheetName] = rows;
    });

    console.log(`Successfully parsed Excel file: ${inputPath}`);
    return {
      success: true,
      data: result,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error(`Error processing Excel file: ${errorMessage}`);
    return {
      success: false,
      error: errorMessage,
    };
  }
}
