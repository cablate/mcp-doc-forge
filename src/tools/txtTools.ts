import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { randomBytes } from "crypto";
import { diffLines } from "diff";
import * as fs from "fs/promises";
import iconv from "iconv-lite";
import * as path from "path";

function generateUniqueId(): string {
  return randomBytes(9).toString("hex");
}

// 文字編碼轉換工具
export const TEXT_ENCODING_CONVERT_TOOL: Tool = {
  name: "text_encoding_converter",
  description: "Convert text between different encodings",
  inputSchema: {
    type: "object",
    properties: {
      inputPath: {
        type: "string",
        description: "Path to the input text file",
      },
      outputDir: {
        type: "string",
        description: "Directory where converted file should be saved",
      },
      fromEncoding: {
        type: "string",
        description: "Source encoding (e.g., 'big5', 'gbk', 'utf8')",
      },
      toEncoding: {
        type: "string",
        description: "Target encoding (e.g., 'utf8', 'big5', 'gbk')",
      },
    },
    required: ["inputPath", "outputDir", "fromEncoding", "toEncoding"],
  },
};

// 文字格式化工具
export const TEXT_FORMAT_TOOL: Tool = {
  name: "text_formatter",
  description: "Format text with proper indentation and line spacing",
  inputSchema: {
    type: "object",
    properties: {
      inputPath: {
        type: "string",
        description: "Path to the input text file",
      },
      outputDir: {
        type: "string",
        description: "Directory where formatted file should be saved",
      },
    },
    required: ["inputPath", "outputDir"],
  },
};

// 文字比較工具
export const TEXT_DIFF_TOOL: Tool = {
  name: "text_diff",
  description: "Compare two text files and show differences",
  inputSchema: {
    type: "object",
    properties: {
      file1Path: {
        type: "string",
        description: "Path to the first text file",
      },
      file2Path: {
        type: "string",
        description: "Path to the second text file",
      },
      outputDir: {
        type: "string",
        description: "Directory where diff result should be saved",
      },
    },
    required: ["file1Path", "file2Path", "outputDir"],
  },
};

// 文字分割工具
export const TEXT_SPLIT_TOOL: Tool = {
  name: "text_splitter",
  description: "Split text file by specified delimiter or line count",
  inputSchema: {
    type: "object",
    properties: {
      inputPath: {
        type: "string",
        description: "Path to the input text file",
      },
      outputDir: {
        type: "string",
        description: "Directory where split files should be saved",
      },
      splitBy: {
        type: "string",
        enum: ["lines", "delimiter"],
        description: "Split method: by line count or delimiter",
      },
      value: {
        type: "string",
        description: "Line count (number) or delimiter string",
      },
    },
    required: ["inputPath", "outputDir", "splitBy", "value"],
  },
};

// 文字編碼轉換實作
export async function convertTextEncoding(
  inputPath: string,
  outputDir: string,
  fromEncoding: string,
  toEncoding: string
) {
  try {
    console.error(`Starting text encoding conversion...`);
    console.error(`Input file: ${inputPath}`);
    console.error(`Output directory: ${outputDir}`);
    console.error(`From encoding: ${fromEncoding}`);
    console.error(`To encoding: ${toEncoding}`);

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
    const content = await fs.readFile(inputPath);
    const text = iconv.decode(content, fromEncoding);
    const converted = iconv.encode(text, toEncoding);

    const outputPath = path.join(outputDir, `converted_${uniqueId}.txt`);
    await fs.writeFile(outputPath, converted);
    console.error(`Written converted text to ${outputPath}`);

    return {
      success: true,
      data: `Successfully converted text encoding: ${outputPath}`,
    };
  } catch (error) {
    console.error(`Error in convertTextEncoding:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// 文字格式化實作
export async function formatText(inputPath: string, outputDir: string) {
  try {
    console.error(`Starting text formatting...`);
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
    const content = await fs.readFile(inputPath, "utf-8");

    // 基本格式化：移除多餘空白行，統一縮排
    const formatted = content
      .split("\n")
      .map((line) => line.trim())
      .filter((line, index, array) => !(line === "" && array[index - 1] === ""))
      .join("\n");

    const outputPath = path.join(outputDir, `formatted_${uniqueId}.txt`);
    await fs.writeFile(outputPath, formatted);
    console.error(`Written formatted text to ${outputPath}`);

    return {
      success: true,
      data: `Successfully formatted text: ${outputPath}`,
    };
  } catch (error) {
    console.error(`Error in formatText:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// 文字比較實作
export async function compareTexts(
  file1Path: string,
  file2Path: string,
  outputDir: string
) {
  try {
    console.error(`Starting text comparison...`);
    console.error(`File 1: ${file1Path}`);
    console.error(`File 2: ${file2Path}`);
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
    const text1 = await fs.readFile(file1Path, "utf-8");
    const text2 = await fs.readFile(file2Path, "utf-8");

    const diff = diffLines(text1, text2);
    const diffResult = diff
      .map((part) => {
        const prefix = part.added ? "+ " : part.removed ? "- " : "  ";
        return prefix + part.value;
      })
      .join("");

    const outputPath = path.join(outputDir, `diff_${uniqueId}.txt`);
    await fs.writeFile(outputPath, diffResult);
    console.error(`Written diff result to ${outputPath}`);

    return {
      success: true,
      data: `Successfully compared texts: ${outputPath}`,
    };
  } catch (error) {
    console.error(`Error in compareTexts:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// 文字分割實作
export async function splitText(
  inputPath: string,
  outputDir: string,
  splitBy: "lines" | "delimiter",
  value: string
) {
  try {
    console.error(`Starting text splitting...`);
    console.error(`Input file: ${inputPath}`);
    console.error(`Output directory: ${outputDir}`);
    console.error(`Split by: ${splitBy}`);
    console.error(`Value: ${value}`);

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
    const content = await fs.readFile(inputPath, "utf-8");
    const parts: string[] = [];

    if (splitBy === "lines") {
      const lineCount = parseInt(value, 10);
      if (isNaN(lineCount) || lineCount <= 0) {
        throw new Error("Invalid line count");
      }

      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i += lineCount) {
        parts.push(lines.slice(i, i + lineCount).join("\n"));
      }
    } else {
      parts.push(...content.split(value));
    }

    const results: string[] = [];
    for (let i = 0; i < parts.length; i++) {
      const outputPath = path.join(outputDir, `part_${uniqueId}_${i + 1}.txt`);
      await fs.writeFile(outputPath, parts[i]);
      results.push(outputPath);
      console.error(`Written part ${i + 1} to ${outputPath}`);
    }

    return {
      success: true,
      data: `Successfully split text into ${parts.length} parts: ${results.join(
        ", "
      )}`,
    };
  } catch (error) {
    console.error(`Error in splitText:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
