# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a distant reading project focused on American Transcendentalist and Romantic literature from the mid-19th century. The repository currently contains a text corpus from Project Gutenberg with no analysis code yet.

**Distant Reading**: A computational text analysis approach that examines patterns across large collections of texts, as opposed to traditional close reading of individual works.

## Text Corpus

The repository contains five Project Gutenberg texts, all canonical works of American literature from the 1830s-1850s:

| File | Title | Author | Year | PG ID |
|------|-------|--------|------|-------|
| pg205.txt | Walden, and On The Duty Of Civil Disobedience | Henry David Thoreau | 1854 | 205 |
| pg1322.txt | Leaves of Grass | Walt Whitman | 1855 | 1322 |
| pg2701.txt | Moby Dick; Or, The Whale | Herman Melville | 1851 | 2701 |
| pg25344 (1).txt | The Scarlet Letter | Nathaniel Hawthorne | 1850 | 25344 |
| pg29433.txt | Nature | Ralph Waldo Emerson | 1836 | 29433 |

**Thematic focus**: Transcendentalism, nature, individualism, American identity, and Romantic philosophy.

## Text Preprocessing

Project Gutenberg texts include standardized headers and footers that should be removed before analysis:

- **Header**: Remove everything before `*** START OF THE PROJECT GUTENBERG EBOOK [TITLE] ***`
- **Footer**: Remove everything after `*** END OF THE PROJECT GUTENBERG EBOOK [TITLE] ***`
- **Encoding**: Files are UTF-8 with BOM (﻿) at the start

When developing preprocessing code, ensure it handles:
- Variations in header/footer formatting across different PG editions
- Metadata sections (title pages, tables of contents)
- Special characters and formatting from the digitization process

## File Naming Convention

Files follow the pattern `pg[ID].txt` where `[ID]` is the Project Gutenberg text identifier. This ID can be used to:
- Look up the text at `https://www.gutenberg.org/ebooks/[ID]`
- Verify metadata and find additional formats
- Download updated versions if needed

## Potential Analysis Approaches

Common distant reading analyses for this corpus might include:

- **Stylometric analysis**: Authorship attribution, stylistic fingerprinting
- **Topic modeling**: LDA, NMF to identify thematic patterns
- **Sentiment analysis**: Tracking emotional arcs and tones
- **Word frequency and collocations**: Identifying characteristic vocabulary
- **Network analysis**: Character relationships, semantic networks
- **Comparative analysis**: Cross-text pattern identification

## Development Environment

This repository does not yet have:
- Analysis scripts (Python, R, or other)
- Dependencies file (requirements.txt, package.json, etc.)
- Test suite
- Build/run commands

When creating analysis code, consider standard text analysis libraries:
- **Python**: NLTK, spaCy, Gensim, scikit-learn, pandas
- **R**: tidytext, quanteda, tm
- **Visualization**: matplotlib, seaborn, ggplot2, D3.js
