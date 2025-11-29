# American Transcendentalist Literature - Distant Reading

A computational text analysis project examining five canonical works of 19th century American Transcendentalist and Romantic literature.

## Corpus

This project analyzes five major works from Project Gutenberg:

1. **Nature** by Ralph Waldo Emerson (1836)
2. **The Scarlet Letter** by Nathaniel Hawthorne (1850)
3. **Moby Dick** by Herman Melville (1851)
4. **Walden** by Henry David Thoreau (1854)
5. **Leaves of Grass** by Walt Whitman (1855)

## Features

- **Text Preprocessing**: Automatic removal of Project Gutenberg headers/footers
- **Bag-of-Words Analysis**: Word frequency analysis with stopword removal
- **Sentiment Analysis**: Polarity and subjectivity scoring using TextBlob
- **Comparative Statistics**: Vocabulary richness, distinctive words, shared vocabulary
- **Interactive Visualization**: Web-based interface with word clouds and comparative analysis

## Installation

### Requirements

- Python 3.8+
- Modern web browser (for viewing results)

### Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Step 1: Preprocess Texts

Clean the raw Project Gutenberg texts by removing headers and footers:

```bash
python3 preprocess.py
```

This creates cleaned text files in `data/cleaned/`.

### Step 2: Run Analysis

Perform distant reading analysis on all texts:

```bash
python3 analyze.py
```

This generates:
- Word frequency distributions
- Sentiment analysis
- Comparative statistics
- JSON output file: `data/analysis.json`

### Step 3: View Results

Open `index.html` in a web browser to explore the interactive visualization:

```bash
# On Linux/Mac
open index.html

# On Windows
start index.html

# Or use a simple HTTP server
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## Project Structure

```
.
├── pg*.txt                 # Original Project Gutenberg texts
├── preprocess.py           # Text cleaning script
├── analyze.py              # Distant reading analysis script
├── requirements.txt        # Python dependencies
├── index.html              # Web interface
├── styles.css              # Styling
├── app.js                  # Visualization logic
├── data/
│   ├── cleaned/           # Preprocessed texts
│   └── analysis.json      # Analysis results
├── CLAUDE.md              # Claude Code guidance
└── README.md              # This file
```

## Analysis Methods

### Bag-of-Words
- Tokenization using NLTK
- Stopword removal (English)
- Word frequency distribution
- Top 100 most frequent words per text

### Sentiment Analysis
- Overall polarity (-1 to +1, negative to positive)
- Overall subjectivity (0 to 1, objective to subjective)
- Sentence-level sentiment distribution
- Sentiment arc visualization

### Comparative Statistics
- Vocabulary richness (type-token ratio)
- Average sentence length
- Average word length
- Shared vocabulary across texts
- Distinctive words per text

## Web Interface Features

- **Overview**: Comparative analysis across all five texts
- **Individual Text Views**: Detailed analysis for each work
  - Metadata and statistics
  - Interactive word clouds
  - Sentiment visualizations
  - Top frequent words
- **Responsive Design**: Works on desktop and mobile devices
- **19th Century Aesthetic**: Color scheme inspired by the era

## Data Format

The analysis results are exported to `data/analysis.json` with the following structure:

```json
{
  "corpus_summary": { ... },
  "texts": {
    "text_key": {
      "metadata": { "title", "author", "year" },
      "statistics": { "total_words", "unique_words", "vocabulary_richness", ... },
      "word_frequencies": { "word": count, ... },
      "sentiment": { "overall_polarity", "sentiment_distribution", ... }
    }
  },
  "comparative": {
    "shared_vocabulary": [...],
    "distinctive_words": { ... }
  }
}
```

## License

The source texts are from Project Gutenberg and are in the public domain in the United States.

## Acknowledgments

- Texts sourced from [Project Gutenberg](https://www.gutenberg.org)
- Analysis powered by NLTK and TextBlob
- Visualizations built with D3.js
