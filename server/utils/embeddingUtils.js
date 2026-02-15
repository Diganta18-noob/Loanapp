/**
 * Embedding Utilities for Chatbot
 * Implements hybrid similarity matching: embedding + text similarity
 * Weighted scoring: 0.6 embedding + 0.4 text
 */

/**
 * Generate a simple text embedding (TF-IDF style vector)
 * This is a lightweight local implementation. For production,
 * you can replace this with Google Gemini API embeddings.
 */
function generateEmbedding(text) {
    const words = text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 1);

    // Create a vocabulary-based hash vector (dimension 128)
    const dim = 128;
    const vector = new Array(dim).fill(0);

    words.forEach((word, idx) => {
        // Simple hash-based embedding
        let hash = 0;
        for (let i = 0; i < word.length; i++) {
            hash = ((hash << 5) - hash) + word.charCodeAt(i);
            hash |= 0;
        }
        const position = Math.abs(hash) % dim;
        vector[position] += 1;
    });

    // Normalize the vector
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
        for (let i = 0; i < dim; i++) {
            vector[i] /= magnitude;
        }
    }

    return vector;
}

/**
 * Compute cosine similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;

    const minLen = Math.min(vecA.length, vecB.length);
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < minLen; i++) {
        dotProduct += vecA[i] * vecB[i];
        magnitudeA += vecA[i] * vecA[i];
        magnitudeB += vecB[i] * vecB[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) return 0;

    return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Compute text similarity using Jaccard + word overlap
 */
function textSimilarity(text1, text2) {
    const tokenize = (text) => {
        return new Set(
            text.toLowerCase()
                .replace(/[^\w\s]/g, '')
                .split(/\s+/)
                .filter(w => w.length > 1)
        );
    };

    const set1 = tokenize(text1);
    const set2 = tokenize(text2);

    if (set1.size === 0 || set2.size === 0) return 0;

    let intersection = 0;
    set1.forEach(word => {
        if (set2.has(word)) intersection++;
    });

    const union = new Set([...set1, ...set2]).size;

    return union > 0 ? intersection / union : 0;
}

/**
 * Hybrid similarity: 0.6 * embedding + 0.4 * text
 * Returns ranked results with confidence levels
 */
function hybridSimilarity(queryText, queryEmbedding, faqs) {
    const EMBEDDING_WEIGHT = 0.6;
    const TEXT_WEIGHT = 0.4;

    const scored = faqs.map(faq => {
        const embScore = cosineSimilarity(queryEmbedding, faq.embedding || []);
        const txtScore = textSimilarity(queryText, faq.question);
        const hybridScore = (EMBEDDING_WEIGHT * embScore) + (TEXT_WEIGHT * txtScore);

        return {
            faq,
            embeddingScore: embScore,
            textScore: txtScore,
            hybridScore,
            confidence: getConfidenceLevel(hybridScore)
        };
    });

    // Sort by hybrid score descending, return top 5
    scored.sort((a, b) => b.hybridScore - a.hybridScore);
    return scored.slice(0, 5);
}

/**
 * Determine confidence level based on hybrid score
 */
function getConfidenceLevel(score) {
    if (score >= 0.5) return 'high';
    if (score >= 0.25) return 'medium';
    return 'low';
}

module.exports = {
    generateEmbedding,
    cosineSimilarity,
    textSimilarity,
    hybridSimilarity,
    getConfidenceLevel
};
