// American Transcendentalist Distant Reading Application

let analysisData = null;

// Load and initialize
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/analysis.json');
        analysisData = await response.json();
        initializeApp();
    } catch (error) {
        console.error('Error loading analysis data:', error);
        document.querySelector('main').innerHTML =
            '<div class="card"><p>Error loading analysis data. Please ensure analyze.py has been run.</p></div>';
    }
});

function initializeApp() {
    createNavigation();
    renderOverview();
    createTextSections();
}

function createNavigation() {
    const nav = document.getElementById('text-nav');
    const texts = analysisData.texts;

    // Add buttons for each text
    Object.keys(texts).forEach(key => {
        const text = texts[key];
        const btn = document.createElement('button');
        btn.className = 'nav-btn';
        btn.setAttribute('data-text', key);
        btn.textContent = text.metadata.title;
        btn.addEventListener('click', () => showSection(key));
        nav.appendChild(btn);
    });
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active from all buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected section
    const section = document.getElementById(`${sectionId}-section`);
    if (section) {
        section.classList.add('active');
    }

    // Activate button
    const btn = document.querySelector(`[data-text="${sectionId}"]`);
    if (btn) {
        btn.classList.add('active');
    }
}

function renderOverview() {
    const summary = analysisData.corpus_summary;
    const texts = analysisData.texts;

    // Corpus summary
    const summaryDiv = document.getElementById('corpus-summary');
    summaryDiv.innerHTML = `
        <div class="card">
            <h3>Corpus Statistics</h3>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-label">Total Texts</div>
                    <div class="stat-value">${summary.total_texts}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Total Words Analyzed</div>
                    <div class="stat-value">${formatNumber(getTotalWords())}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Time Period</div>
                    <div class="stat-value">1836-1855</div>
                </div>
            </div>
        </div>
    `;

    // Comparison grid
    renderComparisonGrid();
}

function getTotalWords() {
    return Object.values(analysisData.texts).reduce((sum, text) =>
        sum + text.statistics.total_words, 0);
}

function renderComparisonGrid() {
    const grid = document.getElementById('comparison-grid');
    const texts = analysisData.texts;

    let html = '';

    // Create comparison cards for each text
    Object.keys(texts).forEach(key => {
        const text = texts[key];
        const sentiment = text.sentiment;
        const stats = text.statistics;

        html += `
            <div class="comparison-card">
                <h4>${text.metadata.title}</h4>
                <p><strong>${text.metadata.author}</strong> (${text.metadata.year})</p>
                <div style="margin-top: 1rem;">
                    <div class="stat-item">
                        <div class="stat-label">Words</div>
                        <div class="stat-value">${formatNumber(stats.total_words)}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Vocabulary Richness</div>
                        <div class="stat-value">${(stats.vocabulary_richness * 100).toFixed(1)}%</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Sentiment</div>
                        <div class="stat-value" style="color: ${getSentimentColor(sentiment.overall_polarity)}">
                            ${getSentimentLabel(sentiment.overall_polarity)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;
}

function createTextSections() {
    const container = document.getElementById('text-sections');
    const texts = analysisData.texts;

    Object.keys(texts).forEach(key => {
        const text = texts[key];
        const section = createTextSection(key, text);
        container.appendChild(section);
    });
}

function createTextSection(key, text) {
    const section = document.createElement('section');
    section.id = `${key}-section`;
    section.className = 'content-section';

    section.innerHTML = `
        <h2>${text.metadata.title}</h2>
        ${renderMetadata(text.metadata)}
        ${renderStatistics(text.statistics)}
        ${renderWordCloud(key, text.word_frequencies)}
        ${renderSentiment(text.sentiment)}
        ${renderTopWords(text.word_frequencies)}
    `;

    return section;
}

function renderMetadata(metadata) {
    return `
        <div class="metadata">
            <p><strong>Author:</strong> ${metadata.author}</p>
            <p><strong>Publication Year:</strong> ${metadata.year}</p>
        </div>
    `;
}

function renderStatistics(stats) {
    return `
        <div class="card">
            <h3>Text Statistics</h3>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-label">Total Words</div>
                    <div class="stat-value">${formatNumber(stats.total_words)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Unique Words</div>
                    <div class="stat-value">${formatNumber(stats.unique_words)}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Vocabulary Richness</div>
                    <div class="stat-value">${(stats.vocabulary_richness * 100).toFixed(2)}%</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Avg Sentence Length</div>
                    <div class="stat-value">${stats.avg_sentence_length}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Avg Word Length</div>
                    <div class="stat-value">${stats.avg_word_length}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Total Sentences</div>
                    <div class="stat-value">${formatNumber(stats.total_sentences)}</div>
                </div>
            </div>
        </div>
    `;
}

function renderWordCloud(key, wordFreq) {
    const containerId = `wordcloud-${key}`;

    // Create container
    setTimeout(() => {
        const container = document.getElementById(containerId);
        if (container) {
            drawWordCloud(container, wordFreq);
        }
    }, 100);

    return `
        <div class="card">
            <h3>Word Cloud</h3>
            <div id="${containerId}" style="width: 100%; height: 500px;"></div>
        </div>
    `;
}

function drawWordCloud(container, wordFreq) {
    // Prepare data for word cloud
    const words = Object.entries(wordFreq).map(([text, size]) => ({
        text,
        size
    }));

    const width = container.offsetWidth;
    const height = 500;

    // Clear container
    container.innerHTML = '';

    // Create SVG
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const g = svg.append('g')
        .attr('transform', `translate(${width/2},${height/2})`);

    // Color scale
    const color = d3.scaleOrdinal()
        .range(['#2c3e2e', '#4a6741', '#8ba888', '#d4af37', '#b85042']);

    // Create word cloud layout
    const layout = d3.layout.cloud()
        .size([width, height])
        .words(words)
        .padding(5)
        .rotate(() => (~~(Math.random() * 2) * 90))
        .fontSize(d => Math.sqrt(d.size) * 3)
        .on('end', draw);

    layout.start();

    function draw(words) {
        g.selectAll('text')
            .data(words)
            .enter()
            .append('text')
            .style('font-size', d => `${d.size}px`)
            .style('font-family', 'Georgia, serif')
            .style('fill', (d, i) => color(i))
            .attr('text-anchor', 'middle')
            .attr('transform', d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
            .text(d => d.text)
            .style('opacity', 0)
            .transition()
            .duration(1000)
            .style('opacity', 1);
    }
}

function renderSentiment(sentiment) {
    const dist = sentiment.sentiment_distribution;
    const total = dist.positive + dist.negative + dist.neutral;

    return `
        <div class="card">
            <h3>Sentiment Analysis</h3>
            <div class="sentiment-bar">
                <div class="sentiment-stat">
                    <span class="sentiment-label">Overall Polarity:</span>
                    <span class="sentiment-value" style="color: ${getSentimentColor(sentiment.overall_polarity)}">
                        ${sentiment.overall_polarity.toFixed(3)} (${getSentimentLabel(sentiment.overall_polarity)})
                    </span>
                </div>
                <div class="sentiment-stat">
                    <span class="sentiment-label">Subjectivity:</span>
                    <span class="sentiment-value">${sentiment.overall_subjectivity.toFixed(3)}</span>
                </div>
            </div>

            <h4>Sentiment Distribution</h4>
            <div style="margin: 1rem 0;">
                <div style="margin: 1rem 0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span><strong>Positive</strong></span>
                        <span>${dist.positive} sentences (${((dist.positive/total)*100).toFixed(1)}%)</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill progress-positive" style="width: ${(dist.positive/total)*100}%">
                            ${((dist.positive/total)*100).toFixed(1)}%
                        </div>
                    </div>
                </div>

                <div style="margin: 1rem 0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span><strong>Neutral</strong></span>
                        <span>${dist.neutral} sentences (${((dist.neutral/total)*100).toFixed(1)}%)</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill progress-neutral" style="width: ${(dist.neutral/total)*100}%">
                            ${((dist.neutral/total)*100).toFixed(1)}%
                        </div>
                    </div>
                </div>

                <div style="margin: 1rem 0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span><strong>Negative</strong></span>
                        <span>${dist.negative} sentences (${((dist.negative/total)*100).toFixed(1)}%)</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill progress-negative" style="width: ${(dist.negative/total)*100}%">
                            ${((dist.negative/total)*100).toFixed(1)}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderTopWords(wordFreq) {
    const topWords = Object.entries(wordFreq).slice(0, 30);

    return `
        <div class="card">
            <h3>Top 30 Most Frequent Words</h3>
            <div class="word-list">
                ${topWords.map(([word, freq]) =>
                    `<span class="word-tag" title="Frequency: ${freq}">${word}</span>`
                ).join('')}
            </div>
        </div>
    `;
}

// Utility functions
function formatNumber(num) {
    return num.toLocaleString();
}

function getSentimentColor(polarity) {
    if (polarity > 0.1) return '#4a6741'; // Green
    if (polarity < -0.1) return '#b85042'; // Red
    return '#8a8a8a'; // Gray
}

function getSentimentLabel(polarity) {
    if (polarity > 0.1) return 'Positive';
    if (polarity < -0.1) return 'Negative';
    return 'Neutral';
}
