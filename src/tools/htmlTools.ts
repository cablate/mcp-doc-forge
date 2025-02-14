import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { randomBytes } from "crypto";
import * as fs from "fs/promises";
import { JSDOM } from "jsdom";
import * as path from "path";
import TurndownService from "turndown";

function generateUniqueId(): string {
  return randomBytes(9).toString("hex");
}

// HTML 清理工具
export const HTML_CLEAN_TOOL: Tool = {
  name: "html_cleaner",
  description: "Clean HTML by removing unnecessary tags and attributes",
  inputSchema: {
    type: "object",
    properties: {
      inputPath: {
        type: "string",
        description: "Path to the input HTML file",
      },
      outputDir: {
        type: "string",
        description: "Directory where cleaned HTML should be saved",
      },
    },
    required: ["inputPath", "outputDir"],
  },
};

// HTML 轉純文字工具
export const HTML_TO_TEXT_TOOL: Tool = {
  name: "html_to_text",
  description: "Convert HTML to plain text while preserving structure",
  inputSchema: {
    type: "object",
    properties: {
      inputPath: {
        type: "string",
        description: "Path to the input HTML file",
      },
      outputDir: {
        type: "string",
        description: "Directory where text file should be saved",
      },
    },
    required: ["inputPath", "outputDir"],
  },
};

// HTML 轉 Markdown 工具
export const HTML_TO_MARKDOWN_TOOL: Tool = {
  name: "html_to_markdown",
  description: "Convert HTML to Markdown format",
  inputSchema: {
    type: "object",
    properties: {
      inputPath: {
        type: "string",
        description: "Path to the input HTML file",
      },
      outputDir: {
        type: "string",
        description: "Directory where Markdown file should be saved",
      },
    },
    required: ["inputPath", "outputDir"],
  },
};

// HTML 資源提取工具
export const HTML_EXTRACT_RESOURCES_TOOL: Tool = {
  name: "html_extract_resources",
  description: "Extract all resources (images, videos, links) from HTML",
  inputSchema: {
    type: "object",
    properties: {
      inputPath: {
        type: "string",
        description: "Path to the input HTML file",
      },
      outputDir: {
        type: "string",
        description: "Directory where resources should be saved",
      },
    },
    required: ["inputPath", "outputDir"],
  },
};

// HTML 格式化工具
export const HTML_FORMAT_TOOL: Tool = {
  name: "html_formatter",
  description: "Format and beautify HTML code",
  inputSchema: {
    type: "object",
    properties: {
      inputPath: {
        type: "string",
        description: "Path to the input HTML file",
      },
      outputDir: {
        type: "string",
        description: "Directory where formatted HTML should be saved",
      },
    },
    required: ["inputPath", "outputDir"],
  },
};

// HTML 清理實作
export async function cleanHtml(inputPath: string, outputDir: string) {
  try {
    console.error(`Starting HTML cleaning...`);
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
    const htmlContent = await fs.readFile(inputPath, "utf-8");
    const dom = new JSDOM(htmlContent);
    const { document } = dom.window;

    // 移除不必要的標籤和屬性
    const unwantedTags = ["script", "style", "iframe", "noscript"];
    const unwantedAttrs = ["onclick", "onload", "onerror", "style"];

    unwantedTags.forEach((tag) => {
      document.querySelectorAll(tag).forEach((el) => el.remove());
    });

    document.querySelectorAll("*").forEach((el) => {
      unwantedAttrs.forEach((attr) => el.removeAttribute(attr));
    });

    const cleanedHtml = dom.serialize();
    const outputPath = path.join(outputDir, `cleaned_${uniqueId}.html`);
    await fs.writeFile(outputPath, cleanedHtml);
    console.error(`Written cleaned HTML to ${outputPath}`);

    return {
      success: true,
      data: `Successfully cleaned HTML and saved to ${outputPath}`,
    };
  } catch (error) {
    console.error(`Error in cleanHtml:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// HTML 轉純文字實作
export async function htmlToText(inputPath: string, outputDir: string) {
  try {
    console.error(`Starting HTML to text conversion...`);
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
    const htmlContent = await fs.readFile(inputPath, "utf-8");
    const dom = new JSDOM(htmlContent);
    const { document } = dom.window;

    // 保留結構的文字轉換
    const text = document.body.textContent?.trim() || "";
    const outputPath = path.join(outputDir, `text_${uniqueId}.txt`);
    await fs.writeFile(outputPath, text);
    console.error(`Written text to ${outputPath}`);

    return {
      success: true,
      data: `Successfully converted HTML to text: ${outputPath}`,
    };
  } catch (error) {
    console.error(`Error in htmlToText:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// HTML 轉 Markdown 實作
export async function htmlToMarkdown(inputPath: string, outputDir: string) {
  try {
    console.error(`Starting HTML to Markdown conversion...`);
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
    const htmlContent = await fs.readFile(inputPath, "utf-8");
    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(htmlContent);

    const outputPath = path.join(outputDir, `markdown_${uniqueId}.md`);
    await fs.writeFile(outputPath, markdown);
    console.error(`Written Markdown to ${outputPath}`);

    return {
      success: true,
      data: `Successfully converted HTML to Markdown: ${outputPath}`,
    };
  } catch (error) {
    console.error(`Error in htmlToMarkdown:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// HTML 資源提取實作
export async function extractHtmlResources(
  inputPath: string,
  outputDir: string
) {
  try {
    console.error(`Starting resource extraction...`);
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
    const htmlContent = await fs.readFile(inputPath, "utf-8");
    const dom = new JSDOM(htmlContent);
    const { document } = dom.window;

    // 提取資源
    const resources = {
      images: Array.from(document.querySelectorAll("img")).map(
        (img) => (img as HTMLImageElement).src
      ),
      links: Array.from(document.querySelectorAll("a")).map(
        (a) => (a as HTMLAnchorElement).href
      ),
      videos: Array.from(document.querySelectorAll("video source")).map(
        (video) => (video as HTMLSourceElement).src
      ),
    };

    const outputPath = path.join(outputDir, `resources_${uniqueId}.json`);
    await fs.writeFile(outputPath, JSON.stringify(resources, null, 2));
    console.error(`Written resources to ${outputPath}`);

    return {
      success: true,
      data: `Successfully extracted resources: ${outputPath}`,
    };
  } catch (error) {
    console.error(`Error in extractHtmlResources:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// HTML 格式化實作
export async function formatHtml(inputPath: string, outputDir: string) {
  try {
    console.error(`Starting HTML formatting...`);
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
    const htmlContent = await fs.readFile(inputPath, "utf-8");
    const dom = new JSDOM(htmlContent);
    const { document } = dom.window;

    // 格式化 HTML
    const formattedHtml = dom.serialize();
    const outputPath = path.join(outputDir, `formatted_${uniqueId}.html`);
    await fs.writeFile(outputPath, formattedHtml);
    console.error(`Written formatted HTML to ${outputPath}`);

    return {
      success: true,
      data: `Successfully formatted HTML: ${outputPath}`,
    };
  } catch (error) {
    console.error(`Error in formatHtml:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
