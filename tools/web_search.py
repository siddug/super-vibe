"""Web search tool using local SearXNG instance."""

from __future__ import annotations

import asyncio
from typing import ClassVar, Literal
from urllib.parse import urljoin, urlparse

import httpx
from pydantic import BaseModel, Field

from vibe.core.tools.base import (
    BaseTool,
    BaseToolConfig,
    BaseToolState,
    ToolError,
    ToolPermission,
)


class WebSearchToolConfig(BaseToolConfig):
    """Configuration for the Web Search tool."""

    permission: ToolPermission = ToolPermission.ALWAYS
    searxng_url: str = Field(
        default="http://localhost:8888",
        description="Base URL of the SearXNG instance.",
    )
    default_timeout: int = Field(
        default=30,
        description="Default timeout for HTTP requests in seconds.",
    )
    max_results: int = Field(
        default=10,
        description="Maximum number of search results to return.",
    )
    max_content_length: int = Field(
        default=50000,
        description="Maximum content length to return when fetching pages.",
    )


class SearchResult(BaseModel):
    """A single search result."""

    title: str
    url: str
    snippet: str = ""
    engine: str = ""


class WebSearchArgs(BaseModel):
    """Arguments for web search."""

    action: Literal["search", "fetch"] = Field(
        description="Action to perform: 'search' for keyword search, 'fetch' to get page content."
    )
    query: str | None = Field(
        default=None,
        description="Search query (required for 'search' action).",
    )
    url: str | None = Field(
        default=None,
        description="URL to fetch (required for 'fetch' action).",
    )
    categories: list[str] | None = Field(
        default=None,
        description="Search categories to use (e.g., ['general', 'news', 'images']). Default is general.",
    )
    num_results: int | None = Field(
        default=None,
        description="Number of results to return (overrides config default).",
    )
    language: str | None = Field(
        default=None,
        description="Language code for search results (e.g., 'en', 'fr'). Default is 'en'.",
    )
    safesearch: int | None = Field(
        default=None,
        description="Safe search level (0=off, 1=moderate, 2=strict). Default is 0 (off).",
    )


class WebSearchResult(BaseModel):
    """Result of web search or page fetch."""

    action: str
    success: bool
    results: list[SearchResult] | None = None
    content: str | None = None
    url: str | None = None
    error: str | None = None


class WebSearch(BaseTool[WebSearchArgs, WebSearchResult, WebSearchToolConfig, BaseToolState]):
    """Tool for web search using SearXNG and fetching web page content."""

    description: ClassVar[str] = (
        "Search the web using SearXNG or fetch and extract content from web pages. "
        "Use action='search' with a query to find relevant URLs. "
        "Use action='fetch' with a URL to retrieve and convert the page content to markdown. "
        "Supports parameters like language, safesearch, and categories for refined searches."
    )

    async def run(self, args: WebSearchArgs) -> WebSearchResult:
        """Execute the web search or fetch action."""
        if args.action == "search":
            return await self._search(args)
        elif args.action == "fetch":
            return await self._fetch(args)
        else:
            raise ToolError(f"Unknown action: {args.action}")

    async def _search(self, args: WebSearchArgs) -> WebSearchResult:
        """Perform a web search using SearXNG."""
        if not args.query:
            raise ToolError("Query is required for search action.")

        num_results = args.num_results or self.config.max_results
        categories = ",".join(args.categories) if args.categories else "general"

        params = {
            "q": args.query,
            "format": "json",
            "categories": categories,
            "pageno": 1,  # Start with first page
            "language": args.language or "en",  # Use provided language or default to English
            "safesearch": args.safesearch if args.safesearch is not None else 0,  # Use provided safesearch or default to 0
        }

        search_url = urljoin(self.config.searxng_url.rstrip("/") + "/", "search")

        try:
            async with httpx.AsyncClient(timeout=self.config.default_timeout) as client:
                response = await client.get(search_url, params=params)
                response.raise_for_status()
                data = response.json()
        except httpx.TimeoutException:
            raise ToolError(f"Search request timed out after {self.config.default_timeout}s")
        except httpx.HTTPStatusError as e:
            raise ToolError(f"Search request failed: HTTP {e.response.status_code}")
        except httpx.RequestError as e:
            raise ToolError(f"Search request failed: {e}")
        except Exception as e:
            raise ToolError(f"Failed to parse search results: {e}")

        results: list[SearchResult] = []
        for item in data.get("results", [])[:num_results]:
            results.append(
                SearchResult(
                    title=item.get("title", ""),
                    url=item.get("url", ""),
                    snippet=item.get("content", ""),
                    engine=item.get("engine", ""),
                )
            )

        return WebSearchResult(
            action="search",
            success=True,
            results=results,
        )

    async def _fetch(self, args: WebSearchArgs) -> WebSearchResult:
        """Fetch a web page and convert to markdown."""
        if not args.url:
            raise ToolError("URL is required for fetch action.")

        # Validate URL
        parsed = urlparse(args.url)
        if not parsed.scheme or not parsed.netloc:
            raise ToolError(f"Invalid URL: {args.url}")

        try:
            async with httpx.AsyncClient(
                timeout=self.config.default_timeout,
                follow_redirects=True,
                headers={
                    "User-Agent": "Mozilla/5.0 (compatible; VibeCLI/1.0; +https://github.com/mistralai/mistral-vibe)"
                },
            ) as client:
                response = await client.get(args.url)
                response.raise_for_status()
                content_type = response.headers.get("content-type", "")

                if "text/html" in content_type:
                    html_content = response.text
                    markdown = self._html_to_markdown(html_content, args.url)
                elif "application/json" in content_type:
                    markdown = f"```json\n{response.text[:self.config.max_content_length]}\n```"
                elif content_type.startswith("text/"):
                    markdown = response.text[:self.config.max_content_length]
                else:
                    markdown = f"[Binary content: {content_type}]"

        except httpx.TimeoutException:
            raise ToolError(f"Fetch request timed out after {self.config.default_timeout}s")
        except httpx.HTTPStatusError as e:
            raise ToolError(f"Fetch request failed: HTTP {e.response.status_code}")
        except httpx.RequestError as e:
            raise ToolError(f"Fetch request failed: {e}")

        # Truncate if too long
        if len(markdown) > self.config.max_content_length:
            markdown = markdown[: self.config.max_content_length] + "\n\n[Content truncated...]"

        return WebSearchResult(
            action="fetch",
            success=True,
            content=markdown,
            url=args.url,
        )

    def _html_to_markdown(self, html: str, base_url: str) -> str:
        """Convert HTML to markdown-like text.

        Attempts to use markdownify if available, otherwise falls back to basic extraction.
        """
        try:
            from markdownify import markdownify as md
            return md(html, heading_style="ATX", strip=["script", "style", "nav", "footer", "header"])
        except ImportError:
            pass

        # Fallback: basic HTML to text extraction
        try:
            from bs4 import BeautifulSoup

            soup = BeautifulSoup(html, "html.parser")

            # Remove unwanted elements
            for tag in soup(["script", "style", "nav", "footer", "header", "aside", "noscript"]):
                tag.decompose()

            # Get text
            text = soup.get_text(separator="\n", strip=True)

            # Clean up multiple newlines
            import re
            text = re.sub(r"\n{3,}", "\n\n", text)

            return text

        except ImportError:
            # Ultra-fallback: basic regex extraction
            import re

            # Remove script and style tags
            text = re.sub(r"<script[^>]*>.*?</script>", "", html, flags=re.DOTALL | re.IGNORECASE)
            text = re.sub(r"<style[^>]*>.*?</style>", "", html, flags=re.DOTALL | re.IGNORECASE)

            # Remove HTML tags
            text = re.sub(r"<[^>]+>", " ", text)

            # Decode entities
            import html as html_module
            text = html_module.unescape(text)

            # Clean up whitespace
            text = re.sub(r"[ \t]+", " ", text)
            text = re.sub(r"\n{3,}", "\n\n", text)

            return text.strip()
