#!/usr/bin/env python3
"""
Preprocess Project Gutenberg texts for distant reading analysis.
Removes headers, footers, and normalizes encoding.
"""

import re
import os
from pathlib import Path


def remove_gutenberg_headers(text):
    """Remove Project Gutenberg header and footer from text."""
    # Find start marker
    start_pattern = r'\*\*\* START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK.*?\*\*\*'
    start_match = re.search(start_pattern, text, re.IGNORECASE)

    if start_match:
        text = text[start_match.end():]

    # Find end marker
    end_pattern = r'\*\*\* END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK.*?\*\*\*'
    end_match = re.search(end_pattern, text, re.IGNORECASE)

    if end_match:
        text = text[:end_match.start()]

    return text


def clean_text(text):
    """Clean and normalize text."""
    # Remove UTF-8 BOM if present
    text = text.replace('\ufeff', '')

    # Remove Project Gutenberg headers/footers
    text = remove_gutenberg_headers(text)

    # Normalize whitespace
    text = re.sub(r'\n\s*\n\s*\n+', '\n\n', text)  # Multiple blank lines to double
    text = re.sub(r'[ \t]+', ' ', text)  # Multiple spaces to single

    # Strip leading/trailing whitespace
    text = text.strip()

    return text


def get_text_metadata(filename):
    """Extract metadata from filename."""
    # Extract PG ID from filename (e.g., 'pg205.txt' -> '205')
    match = re.search(r'pg(\d+)', filename)
    pg_id = match.group(1) if match else 'unknown'

    # Metadata mapping
    metadata = {
        '205': {'title': 'Walden', 'author': 'Henry David Thoreau', 'year': 1854},
        '1322': {'title': 'Leaves of Grass', 'author': 'Walt Whitman', 'year': 1855},
        '2701': {'title': 'Moby Dick', 'author': 'Herman Melville', 'year': 1851},
        '25344': {'title': 'The Scarlet Letter', 'author': 'Nathaniel Hawthorne', 'year': 1850},
        '29433': {'title': 'Nature', 'author': 'Ralph Waldo Emerson', 'year': 1836}
    }

    return metadata.get(pg_id, {'title': 'Unknown', 'author': 'Unknown', 'year': 0})


def preprocess_texts():
    """Preprocess all .txt files in current directory."""
    # Create output directory
    output_dir = Path('data/cleaned')
    output_dir.mkdir(parents=True, exist_ok=True)

    # Process each text file
    text_files = list(Path('.').glob('pg*.txt'))

    print(f"Found {len(text_files)} text files to process")

    processed_files = []

    for filepath in text_files:
        print(f"Processing {filepath.name}...")

        # Read file
        with open(filepath, 'r', encoding='utf-8') as f:
            raw_text = f.read()

        # Clean text
        cleaned_text = clean_text(raw_text)

        # Get metadata
        metadata = get_text_metadata(filepath.name)

        # Generate clean filename
        clean_filename = f"pg{filepath.stem.replace('pg', '').replace(' (1)', '')}_cleaned.txt"
        output_path = output_dir / clean_filename

        # Write cleaned text
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(cleaned_text)

        # Store info
        word_count = len(cleaned_text.split())
        processed_files.append({
            'original': filepath.name,
            'cleaned': clean_filename,
            'metadata': metadata,
            'word_count': word_count
        })

        print(f"  ✓ {metadata['title']} by {metadata['author']}")
        print(f"    Word count: {word_count:,}")

    print(f"\n✓ Preprocessing complete! Cleaned files saved to {output_dir}/")
    return processed_files


if __name__ == '__main__':
    processed = preprocess_texts()
