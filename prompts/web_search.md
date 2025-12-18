# Web Search Tool

Use this tool to search the web and fetch page content using a local SearXNG instance.

## Actions

### `search` - Search the web
Search for information using keywords. Returns a list of results with titles, URLs, and snippets.

**Parameters:**
- `action`: `"search"`
- `query`: Your search query (required)
- `categories`: Optional list of categories like `["general"]`, `["news"]`, `["images"]`
- `num_results`: Optional number of results to return (default: 10)
- `language`: Optional language code (default: "en")
- `safesearch`: Optional safe search level (0=off, 1=moderate, 2=strict, default: 0)

**Example:**
```json
{
  "action": "search",
  "query": "python async programming best practices",
  "categories": ["general"],
  "num_results": 5,
  "language": "en",
  "safesearch": 0
}
```

### `fetch` - Get page content
Fetch a URL and extract its content as markdown/text.

**Parameters:**
- `action`: `"fetch"`
- `url`: The URL to fetch (required)

**Example:**
```json
{
  "action": "fetch",
  "url": "https://docs.python.org/3/library/asyncio.html"
}
```

## Workflow

1. First use `action: "search"` with keywords to find relevant pages
2. Review the results and select the most relevant URL(s)
3. Use `action: "fetch"` to retrieve the full content of selected pages

## Notes

- The search uses a local SearXNG instance (default: http://localhost:8888)
- Page content is automatically converted to markdown when possible
- Large pages are truncated to prevent overwhelming responses
- For best results, use specific search queries
- Make sure your SearXNG instance is running and accessible at the configured URL
