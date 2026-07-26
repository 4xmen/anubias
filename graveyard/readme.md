# Graveyard Directory Documentation

## Overview

The **`graveyard`** folder serves as an archive for experimental, tested, or deprecated code that has been intentionally excluded from active use in the project. Rather than permanent deletion, this directory preserves code that may have value for reference, learning, or future extraction.

---

## Purpose

### Why Code Enters the Graveyard

- **Tested but Rejected**: Approaches or implementations that were evaluated and deemed less effective than alternatives, but may contain valuable patterns or insights.
- **Architectural Decisions**: Code that lost out to better design choices during refactoring, yet documents the reasoning behind those decisions.
- **Incomplete Refactoring**: Segments that became obsolete mid-refactor and were never fully completed, but might contain reusable logic or utilities.
- **Exploratory Work**: Experimental implementations kept as reference material for understanding project evolution and design trade-offs.

### Why Not Delete Completely

- **Knowledge Preservation**: Maintains a record of attempted solutions and why they were abandoned.
- **Code Extraction**: Allows selective reuse of isolated functions, patterns, or utilities discovered during refactoring work.
- **Project History**: Documents the development journey and architectural evolution without cluttering the active codebase.
- **Inspiration & Learning**: Serves as a resource for understanding what worked, what didn't, and why certain approaches were chosen.

---

## Structure

Code is organized by technology or language:

- **`rust/`** — Abandoned Rust implementations or modules
- **`js/`** — Discarded JavaScript utilities and logic
- **`vue/`** — Deprecated Vue components or patterns
---

## Guidelines for Use

- **Do not import or execute** code from this directory in production or active development.
- **Reference only** for understanding previous design decisions or extracting isolated, well-tested utilities.
- **Clean up periodically** by removing truly obsolete code, keeping only items with potential future value.
- **Document reasons** when adding new entries (comments or commit messages explaining why code was archived).