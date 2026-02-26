# Firecrawl MCP Server

> Use Firecrawl's API through the Model Context Protocol

A Model Context Protocol (MCP) server implementation that integrates [Firecrawl](https://github.com/mendableai/firecrawl) for web scraping capabilities. Our MCP server is open-source and available on [GitHub](https://github.com/mendableai/firecrawl-mcp-server).

## Features

* Web scraping, crawling, and discovery
* Search and content extraction
* Deep research and batch scraping
* Cloud and self-hosted support
* Streamable HTTP support

## Installation

You can either use our remote hosted URL or run the server locally. Get your API key from [https://firecrawl.dev/app/api-keys](https://www.firecrawl.dev/app/api-keys)

### Remote hosted URL

```bash
https://mcp.firecrawl.dev/{FIRECRAWL_API_KEY}/v2/mcp
```

### Running with npx

```bash
env FIRECRAWL_API_KEY=fc-YOUR_API_KEY npx -y firecrawl-mcp
```

### Manual Installation

```bash
npm install -g firecrawl-mcp
```

### Running on Google Antigravity

Google Antigravity allows you to configure MCP servers directly through its Agent interface.

1. Open the Agent sidebar in the Editor or the Agent Manager view
2. Click the "..." (More Actions) menu and select **MCP Servers**
3. Select **View raw config** to open your local `mcp_config.json` file
4. Add the following configuration:

```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "YOUR_FIRECRAWL_API_KEY"
      }
    }
  }
}
```

5. Save the file and click **Refresh** in the Antigravity MCP interface to see the new tools

Replace `YOUR_FIRECRAWL_API_KEY` with your API key from [https://firecrawl.dev/app/api-keys](https://www.firecrawl.dev/app/api-keys).

## Available Tools

### 1. Scrape Tool (`firecrawl_scrape`)

Scrape content from a single URL with advanced options.

```json
{
  "name": "firecrawl_scrape",
  "arguments": {
    "url": "https://example.com",
    "formats": ["markdown"],
    "onlyMainContent": true,
    "waitFor": 1000,
    "timeout": 30000,
    "mobile": false,
    "includeTags": ["article", "main"],
    "excludeTags": ["nav", "footer"],
    "skipTlsVerification": false
  }
}
```

### 2. Batch Scrape Tool (`firecrawl_batch_scrape`)

Scrape multiple URLs efficiently with built-in rate limiting and parallel processing.

```json
{
  "name": "firecrawl_batch_scrape",
  "arguments": {
    "urls": ["https://example1.com", "https://example2.com"],
    "options": {
      "formats": ["markdown"],
      "onlyMainContent": true
    }
  }
}
```

### 3. Check Batch Status (`firecrawl_check_batch_status`)

Check the status of a batch operation.

### 4. Map Tool (`firecrawl_map`)

Map a website to discover all indexed URLs on the site.

```json
{
  "name": "firecrawl_map",
  "arguments": {
    "url": "https://example.com",
    "search": "blog",
    "sitemap": "include",
    "includeSubdomains": false,
    "limit": 100,
    "ignoreQueryParameters": true
  }
}
```

### 5. Search Tool (`firecrawl_search`)

Search the web and optionally extract content from search results.

```json
{
  "name": "firecrawl_search",
  "arguments": {
    "query": "your search query",
    "limit": 5,
    "lang": "en",
    "country": "us",
    "scrapeOptions": {
      "formats": ["markdown"],
      "onlyMainContent": true
    }
  }
}
```

### 6. Crawl Tool (`firecrawl_crawl`)

Start an asynchronous crawl with advanced options.

```json
{
  "name": "firecrawl_crawl",
  "arguments": {
    "url": "https://example.com",
    "maxDepth": 2,
    "limit": 100,
    "allowExternalLinks": false,
    "deduplicateSimilarURLs": true
  }
}
```

### 7. Check Crawl Status (`firecrawl_check_crawl_status`)

Check the status of a crawl job.

### 8. Extract Tool (`firecrawl_extract`)

Extract structured information from web pages using LLM capabilities.

```json
{
  "name": "firecrawl_extract",
  "arguments": {
    "urls": ["https://example.com/page1", "https://example.com/page2"],
    "prompt": "Extract product information including name, price, and description",
    "systemPrompt": "You are a helpful assistant that extracts product information",
    "schema": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "price": { "type": "number" },
        "description": { "type": "string" }
      },
      "required": ["name", "price"]
    },
    "allowExternalLinks": false,
    "enableWebSearch": false,
    "includeSubdomains": false
  }
}
```
