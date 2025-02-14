#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import {
  cleanHtml,
  compareTexts,
  convertDocxToPdf,
  convertTextEncoding,
  docxToHtml,
  extractHtmlResources,
  formatHtml,
  formatText,
  htmlToMarkdown,
  htmlToText,
  isDocxToPdfArgs,
  isFileReaderArgs,
  mergePDFs,
  readFile,
  splitPDF,
  splitText,
  tools,
} from "./tools/_index.js";

const server = new Server(
  {
    name: "mcp-server/common_doc_executor",
    version: "0.0.1",
  },
  {
    capabilities: {
      description:
        "A MCP server providing file reading capabilities for various file formats!",
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    if (!args) {
      throw new Error("No arguments provided");
    }

    if (name === "document_reader") {
      if (!isFileReaderArgs(args)) {
        throw new Error("Invalid arguments for document_reader");
      }

      const result = await readFile(args.filePath);
      if (!result.success) {
        return {
          content: [{ type: "text", text: `Error: ${result.error}` }],
          isError: true,
        };
      }
      return {
        content: [{ type: "text", text: result.data }],
        isError: false,
      };
    }

    if (name === "docx_to_pdf") {
      if (!isDocxToPdfArgs(args)) {
        throw new Error("Invalid arguments for docx_to_pdf");
      }

      const result = await convertDocxToPdf(args.inputPath, args.outputPath);
      if (!result.success) {
        return {
          content: [{ type: "text", text: `Error: ${result.error}` }],
          isError: true,
        };
      }
      return {
        content: [{ type: "text", text: fileOperationResponse(result.data) }],
        isError: false,
      };
    }

    if (name === "pdf_merger") {
      const { inputPaths, outputDir } = args as {
        inputPaths: string[];
        outputDir: string;
      };
      const result = await mergePDFs(inputPaths, outputDir);
      if (!result.success) {
        return {
          content: [{ type: "text", text: `Error: ${result.error}` }],
          isError: true,
        };
      }
      return {
        content: [{ type: "text", text: fileOperationResponse(result.data) }],
        isError: false,
      };
    }

    if (name === "pdf_splitter") {
      const { inputPath, outputDir, pageRanges } = args as {
        inputPath: string;
        outputDir: string;
        pageRanges: Array<{ start: number; end: number }>;
      };
      const result = await splitPDF(inputPath, outputDir, pageRanges);
      if (!result.success) {
        return {
          content: [{ type: "text", text: `Error: ${result.error}` }],
          isError: true,
        };
      }
      return {
        content: [{ type: "text", text: fileOperationResponse(result.data) }],
        isError: false,
      };
    }

    if (name === "docx_to_html") {
      const { inputPath, outputDir } = args as {
        inputPath: string;
        outputDir: string;
      };
      const result = await docxToHtml(inputPath, outputDir);
      if (!result.success) {
        return {
          content: [{ type: "text", text: `Error: ${result.error}` }],
          isError: true,
        };
      }
      return {
        content: [{ type: "text", text: fileOperationResponse(result.data) }],
        isError: false,
      };
    }

    if (name === "html_cleaner") {
      const { inputPath, outputDir } = args as {
        inputPath: string;
        outputDir: string;
      };
      const result = await cleanHtml(inputPath, outputDir);
      if (!result.success) {
        return {
          content: [{ type: "text", text: `Error: ${result.error}` }],
          isError: true,
        };
      }
      return {
        content: [{ type: "text", text: fileOperationResponse(result.data) }],
        isError: false,
      };
    }

    if (name === "html_to_text") {
      const { inputPath, outputDir } = args as {
        inputPath: string;
        outputDir: string;
      };
      const result = await htmlToText(inputPath, outputDir);
      if (!result.success) {
        return {
          content: [{ type: "text", text: `Error: ${result.error}` }],
          isError: true,
        };
      }
      return {
        content: [{ type: "text", text: fileOperationResponse(result.data) }],
        isError: false,
      };
    }

    if (name === "html_to_markdown") {
      const { inputPath, outputDir } = args as {
        inputPath: string;
        outputDir: string;
      };
      const result = await htmlToMarkdown(inputPath, outputDir);
      if (!result.success) {
        return {
          content: [{ type: "text", text: `Error: ${result.error}` }],
          isError: true,
        };
      }
      return {
        content: [{ type: "text", text: fileOperationResponse(result.data) }],
        isError: false,
      };
    }

    if (name === "html_extract_resources") {
      const { inputPath, outputDir } = args as {
        inputPath: string;
        outputDir: string;
      };
      const result = await extractHtmlResources(inputPath, outputDir);
      if (!result.success) {
        return {
          content: [{ type: "text", text: `Error: ${result.error}` }],
          isError: true,
        };
      }
      return {
        content: [{ type: "text", text: fileOperationResponse(result.data) }],
        isError: false,
      };
    }

    if (name === "html_formatter") {
      const { inputPath, outputDir } = args as {
        inputPath: string;
        outputDir: string;
      };
      const result = await formatHtml(inputPath, outputDir);
      if (!result.success) {
        return {
          content: [{ type: "text", text: `Error: ${result.error}` }],
          isError: true,
        };
      }
      return {
        content: [{ type: "text", text: fileOperationResponse(result.data) }],
        isError: false,
      };
    }

    if (name === "text_encoding_converter") {
      const { inputPath, outputDir, fromEncoding, toEncoding } = args as {
        inputPath: string;
        outputDir: string;
        fromEncoding: string;
        toEncoding: string;
      };
      const result = await convertTextEncoding(
        inputPath,
        outputDir,
        fromEncoding,
        toEncoding
      );
      if (!result.success) {
        return {
          content: [{ type: "text", text: `Error: ${result.error}` }],
          isError: true,
        };
      }
      return {
        content: [{ type: "text", text: fileOperationResponse(result.data) }],
        isError: false,
      };
    }

    if (name === "text_formatter") {
      const { inputPath, outputDir } = args as {
        inputPath: string;
        outputDir: string;
      };
      const result = await formatText(inputPath, outputDir);
      if (!result.success) {
        return {
          content: [{ type: "text", text: `Error: ${result.error}` }],
          isError: true,
        };
      }
      return {
        content: [{ type: "text", text: fileOperationResponse(result.data) }],
        isError: false,
      };
    }

    if (name === "text_diff") {
      const { file1Path, file2Path, outputDir } = args as {
        file1Path: string;
        file2Path: string;
        outputDir: string;
      };
      const result = await compareTexts(file1Path, file2Path, outputDir);
      if (!result.success) {
        return {
          content: [{ type: "text", text: `Error: ${result.error}` }],
          isError: true,
        };
      }
      return {
        content: [{ type: "text", text: fileOperationResponse(result.data) }],
        isError: false,
      };
    }

    if (name === "text_splitter") {
      const { inputPath, outputDir, splitBy, value } = args as {
        inputPath: string;
        outputDir: string;
        splitBy: "lines" | "delimiter";
        value: string;
      };
      const result = await splitText(inputPath, outputDir, splitBy, value);
      if (!result.success) {
        return {
          content: [{ type: "text", text: `Error: ${result.error}` }],
          isError: true,
        };
      }
      return {
        content: [{ type: "text", text: fileOperationResponse(result.data) }],
        isError: false,
      };
    }

    return {
      content: [{ type: "text", text: `Unknown tool: ${name}` }],
      isError: true,
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
      isError: true,
    };
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("MCP Doc Forge Server is running");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});

function fileOperationResponse(data: any) {
  return `
      Note: This operation has generated a file.
      The file path is in <result>
      Please provide a blank_link download for the file.
      ex: The download link: [file_name](/filepath)
      <result>
        ${data}
      </result>
  `;
}
