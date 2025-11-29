#!/usr/bin/env python3
"""
Distant reading analysis of American Transcendentalist texts.
Performs bag-of-words analysis, sentiment analysis, and generates comparative statistics.
"""

import json
import re
from pathlib import Path
from collections import Counter
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from textblob import TextBlob
import numpy as np


# Download required NLTK data
print("Downloading NLTK data...")
nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('averaged_perceptron_tagger', quiet=True)


def tokenize_and_clean(text):
    """Tokenize text and remove stopwords and non-alphabetic tokens."""
    # Tokenize
    tokens = word_tokenize(text.lower())

    # Get English stopwords
    stop_words = set(stopwords.words('english'))

    # Filter: only alphabetic words, no stopwords, length > 2
    cleaned_tokens = [
        token for token in tokens
        if token.isalpha() and token not in stop_words and len(token) > 2
    ]

    return cleaned_tokens


def get_word_frequencies(tokens, top_n=100):
    """Get word frequency distribution."""
    freq_dist = Counter(tokens)
    return dict(freq_dist.most_common(top_n))


def calculate_vocabulary_richness(tokens):
    """Calculate type-token ratio (vocabulary diversity)."""
    if len(tokens) == 0:
        return 0
    unique_words = len(set(tokens))
    total_words = len(tokens)
    return unique_words / total_words


def analyze_sentiment(text):
    """Perform sentiment analysis on text."""
    # Overall sentiment
    blob = TextBlob(text)
    overall_polarity = blob.sentiment.polarity
    overall_subjectivity = blob.sentiment.subjectivity

    # Sentence-level sentiment
    sentences = sent_tokenize(text)
    sentence_polarities = []

    for sentence in sentences[:500]:  # Limit for performance
        sent_blob = TextBlob(sentence)
        sentence_polarities.append(sent_blob.sentiment.polarity)

    # Calculate sentiment distribution
    positive_count = sum(1 for p in sentence_polarities if p > 0.1)
    negative_count = sum(1 for p in sentence_polarities if p < -0.1)
    neutral_count = len(sentence_polarities) - positive_count - negative_count

    return {
        'overall_polarity': round(overall_polarity, 4),
        'overall_subjectivity': round(overall_subjectivity, 4),
        'sentiment_distribution': {
            'positive': positive_count,
            'negative': negative_count,
            'neutral': neutral_count
        },
        'sentiment_arc': [round(p, 3) for p in sentence_polarities[::10]]  # Sample every 10th
    }


def calculate_readability_stats(text, tokens):
    """Calculate basic readability statistics."""
    sentences = sent_tokenize(text)
    words = text.split()

    avg_sentence_length = len(words) / len(sentences) if sentences else 0
    avg_word_length = np.mean([len(word) for word in tokens]) if tokens else 0

    return {
        'avg_sentence_length': round(avg_sentence_length, 2),
        'avg_word_length': round(avg_word_length, 2),
        'total_sentences': len(sentences)
    }


def get_metadata(filename):
    """Extract metadata from filename."""
    metadata_map = {
        'pg205': {'title': 'Walden', 'author': 'Henry David Thoreau', 'year': 1854},
        'pg1322': {'title': 'Leaves of Grass', 'author': 'Walt Whitman', 'year': 1855},
        'pg2701': {'title': 'Moby Dick', 'author': 'Herman Melville', 'year': 1851},
        'pg25344': {'title': 'The Scarlet Letter', 'author': 'Nathaniel Hawthorne', 'year': 1850},
        'pg29433': {'title': 'Nature', 'author': 'Ralph Waldo Emerson', 'year': 1836}
    }

    for key, meta in metadata_map.items():
        if key in filename:
            return meta

    return {'title': 'Unknown', 'author': 'Unknown', 'year': 0}


def analyze_text(filepath):
    """Perform complete analysis on a single text."""
    print(f"\nAnalyzing {filepath.name}...")

    # Read cleaned text
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    # Get metadata
    metadata = get_metadata(filepath.name)

    # Tokenize and clean
    tokens = tokenize_and_clean(text)

    # Word frequencies
    print("  - Calculating word frequencies...")
    word_freq = get_word_frequencies(tokens, top_n=100)

    # Vocabulary richness
    vocab_richness = calculate_vocabulary_richness(tokens)

    # Sentiment analysis
    print("  - Performing sentiment analysis...")
    sentiment = analyze_sentiment(text)

    # Readability stats
    readability = calculate_readability_stats(text, tokens)

    # Compile results
    analysis = {
        'metadata': metadata,
        'statistics': {
            'total_words': len(tokens),
            'unique_words': len(set(tokens)),
            'vocabulary_richness': round(vocab_richness, 4),
            **readability
        },
        'word_frequencies': word_freq,
        'sentiment': sentiment
    }

    print(f"  ✓ {metadata['title']} complete")
    return analysis


def calculate_comparative_stats(all_analyses):
    """Calculate comparative statistics across all texts."""
    print("\nCalculating comparative statistics...")

    # Find shared vocabulary
    all_words = [set(analysis['word_frequencies'].keys()) for analysis in all_analyses.values()]
    shared_words = set.intersection(*all_words) if all_words else set()

    # Find distinctive words for each text
    distinctive = {}
    for key, analysis in all_analyses.items():
        text_words = set(analysis['word_frequencies'].keys())
        other_words = set()
        for other_key, other_analysis in all_analyses.items():
            if other_key != key:
                other_words.update(set(other_analysis['word_frequencies'].keys()))

        distinctive_words = text_words - other_words
        # Get top 20 distinctive words by frequency
        text_freq = analysis['word_frequencies']
        distinctive[key] = sorted(
            [(word, text_freq[word]) for word in distinctive_words],
            key=lambda x: x[1],
            reverse=True
        )[:20]

    return {
        'shared_vocabulary': list(shared_words)[:50],  # Top 50 shared
        'distinctive_words': distinctive
    }


def analyze_corpus():
    """Analyze all texts in the corpus."""
    cleaned_dir = Path('data/cleaned')
    text_files = sorted(cleaned_dir.glob('*_cleaned.txt'))

    if not text_files:
        print("No cleaned text files found. Run preprocess.py first.")
        return

    print(f"Found {len(text_files)} texts to analyze")

    # Analyze each text
    all_analyses = {}
    for filepath in text_files:
        analysis = analyze_text(filepath)
        # Use metadata title as key
        key = analysis['metadata']['title'].lower().replace(' ', '_')
        all_analyses[key] = analysis

    # Calculate comparative stats
    comparative = calculate_comparative_stats(all_analyses)

    # Compile final output
    output = {
        'corpus_summary': {
            'total_texts': len(all_analyses),
            'texts': [a['metadata']['title'] for a in all_analyses.values()]
        },
        'texts': all_analyses,
        'comparative': comparative
    }

    # Save to JSON
    output_dir = Path('data')
    output_dir.mkdir(exist_ok=True)
    output_path = output_dir / 'analysis.json'

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\n✓ Analysis complete! Results saved to {output_path}")
    print(f"  Total texts analyzed: {len(all_analyses)}")

    return output


if __name__ == '__main__':
    results = analyze_corpus()
