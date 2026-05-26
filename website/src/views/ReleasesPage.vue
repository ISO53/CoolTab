<template>
    <div class="releases-page container">
        <header class="page-header">
            <div class="glow-effect"></div>
            <h1 class="animate-title">What's New</h1>
            <p class="animate-subtitle">
                Explore the latest features, enhancements, and bug fixes for CoolTab.
            </p>
        </header>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
            loading...
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state glass-panel">
            <span class="material-icons-outlined error-icon">error_outline</span>
            <h2>Failed to load release history</h2>
            <p>{{ error }}</p>
            <button class="btn-primary" @click="fetchReleases">Try Again</button>
        </div>

        <!-- Content State -->
        <div v-else class="changelog-container">
            <!-- Search & Filters -->
            <div class="filter-bar glass-panel">
                <div class="search-box">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input 
                        type="text" 
                        v-model="searchQuery" 
                        placeholder="Search versions, features, or updates..." 
                        class="search-input"
                    />
                </div>
                <span class="results-count">{{ filteredReleases.length }} versions found</span>
            </div>

            <!-- Empty Results -->
            <div v-if="filteredReleases.length === 0" class="empty-results glass-panel">
                <p>No release updates match your search term.</p>
            </div>

            <!-- Releases List -->
            <div v-else class="releases-list">
                <article 
                    v-for="(release, index) in filteredReleases" 
                    :key="release.tag_name" 
                    class="release-entry"
                >
                    <div class="release-divider" v-if="index > 0"></div>

                    <header class="release-header">
                        <div class="tag-row">
                            <span v-if="index === 0 && !searchQuery" class="tag tag-primary">LATEST</span>
                            <span class="tag">{{ release.tag_name }}</span>
                            <span class="tag">{{ formatDate(release.published_at) }}</span>
                            <a :href="release.html_url" target="_blank" class="tag-github" title="View Release on GitHub">
                                <svg class="github-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                                </svg>
                            </a>
                        </div>
                    </header>

                    <h2 class="release-title">{{ release.name || 'Version ' + release.tag_name }}</h2>
                    
                    <div class="release-body" v-html="parseMarkdown(release.body)"></div>
                </article>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const releases = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');

const fetchReleases = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await fetch('https://cool-tab-api.vercel.app/api/latest-release?history=true');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        releases.value = Array.isArray(data) ? data : [data];
    } catch (err) {
        console.error('Error fetching release history:', err);
        error.value = err.message || 'Could not retrieve release history from API.';
    } finally {
        loading.value = false;
    }
};

const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    try {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
        return dateString;
    }
};

const parseMarkdown = (markdown) => {
    if (!markdown) return "";
    let html = markdown
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Inline Code
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');

    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Raw links (e.g. Full Changelog urls)
    html = html.replace(/(^|\s)(https?:\/\/[^\s<]+)/g, '$1<a href="$2" target="_blank">$2</a>');

    // Lists grouping
    const lines = html.split('\n');
    let inList = false;
    const processedLines = [];

    for (let line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const content = trimmed.substring(2);
            if (!inList) {
                processedLines.push('<ul>');
                inList = true;
            }
            processedLines.push(`<li>${content}</li>`);
        } else {
            if (inList) {
                processedLines.push('</ul>');
                inList = false;
            }
            processedLines.push(line);
        }
    }
    if (inList) {
        processedLines.push('</ul>');
    }

    html = processedLines.join('\n');

    // Paragraph blocks / double line breaks
    html = html.split(/\n{2,}/).map(p => {
        const trimmed = p.trim();
        if (!trimmed) return "";
        if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<li')) {
            return trimmed;
        }
        return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    return html;
};

const filteredReleases = computed(() => {
    if (!searchQuery.value.trim()) return releases.value;
    const query = searchQuery.value.toLowerCase().trim();
    return releases.value.filter(release => {
        const name = (release.name || '').toLowerCase();
        const tag = (release.tag_name || '').toLowerCase();
        const body = (release.body || '').toLowerCase();
        return name.includes(query) || tag.includes(query) || body.includes(query);
    });
});

onMounted(async () => {
    await fetchReleases();
});
</script>

<style scoped>
.releases-page {
    padding-bottom: 100px;
    max-width: 900px !important;
    position: relative;
}

.page-header {
    text-align: center;
    margin: 120px 0 60px;
    position: relative;
}

.glow-effect {
    position: absolute;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
    width: 250px;
    height: 120px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    filter: blur(80px);
    z-index: -1;
    pointer-events: none;
}

.page-header h1 {
    font-size: 3.5rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #ffffff, #a3a3a3);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.page-header p {
    color: var(--text-muted);
    font-size: 1.15rem;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
}

/* Loading States */
.loading-state {
    text-align: center;
    color: var(--text-muted);
    font-size: 1.1rem;
    padding: 40px 0;
}

/* Filter Bar */
.filter-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    margin-bottom: 30px;
    border-radius: 30px;
}

.search-box {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    max-width: 450px;
}

.search-box svg {
    color: var(--text-muted);
}

.search-input {
    background: transparent;
    border: none;
    outline: none;
    color: var(--text-main);
    font-size: 0.95rem;
    width: 100%;
    font-family: inherit;
}

.search-input::placeholder {
    color: var(--text-muted);
}

.results-count {
    font-size: 0.85rem;
    color: var(--text-muted);
}

/* Releases */
.changelog-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.releases-list {
    display: flex;
    flex-direction: column;
}

/* Divider */
.release-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.08);
    margin: 48px 0;
}

/* Entry (no card/panel) */
.release-entry {
    padding: 0;
}

/* Tags row */
.release-header {
    margin-bottom: 20px;
}

.tag-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.tag {
    font-size: 0.8rem;
    font-weight: 600;
    padding: 5px 14px;
    border-radius: 30px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: var(--text-muted);
    letter-spacing: 0.02em;
    white-space: nowrap;
}

.tag-primary {
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(255, 255, 255, 1);
    color: #000000;
    font-weight: 800;
    letter-spacing: 0.04em;
}

.tag-github {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: var(--text-muted);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0;
}

.tag-github:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.25);
    color: var(--text-main);
}

.github-icon {
    display: block;
}

/* Title */
.release-title {
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 20px;
    color: var(--text-main);
}

/* Markdown Rendering Styles */
.release-body {
    overflow-wrap: break-word;
    word-wrap: break-word;
}

.release-body :deep(p) {
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: 16px;
    font-size: 1rem;
}

.release-body :deep(h1),
.release-body :deep(h2),
.release-body :deep(h3) {
    color: var(--text-main);
    font-weight: 700;
    margin-top: 24px;
    margin-bottom: 12px;
    letter-spacing: -0.01em;
}

.release-body :deep(h1) { font-size: 1.5rem; }
.release-body :deep(h2) { font-size: 1.35rem; }
.release-body :deep(h3) { font-size: 1.2rem; }

.release-body :deep(strong) {
    color: #ffffff;
    font-weight: 600;
}

.release-body :deep(ul) {
    margin-bottom: 20px;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.release-body :deep(li) {
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.98rem;
}

.release-body :deep(a) {
    color: var(--text-main);
    text-decoration: underline;
    transition: opacity 0.2s;
    word-break: break-word;
}

.release-body :deep(a:hover) {
    opacity: 0.8;
}

.release-body :deep(code) {
    background: rgba(255, 255, 255, 0.08);
    padding: 3px 6px;
    border-radius: 4px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.88rem;
    color: #ffffff;
    word-break: break-all;
    white-space: pre-wrap;
}

/* Error State */
.error-state {
    text-align: center;
    padding: 60px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    max-width: 500px;
    margin: 40px auto;
}

.error-icon {
    font-size: 3rem;
    color: var(--text-muted);
}

.error-state p {
    color: var(--text-muted);
    margin-bottom: 12px;
}

/* Empty Results */
.empty-results {
    text-align: center;
    padding: 40px;
    color: var(--text-muted);
}

@media (max-width: 600px) {
    .releases-page {
        padding-bottom: 60px;
    }

    .page-header {
        margin: 60px 0 30px;
    }

    .page-header h1 {
        font-size: 2.2rem;
        margin-bottom: 12px;
    }

    .page-header p {
        font-size: 1rem;
    }


    .error-state {
        padding: 40px 20px;
        margin: 20px auto;
    }

    .filter-bar {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
        border-radius: 20px;
        padding: 16px;
        margin-bottom: 24px;
    }

    .search-input {
        font-size: 16px; /* Prevents auto-zoom on iOS */
    }

    .release-divider {
        margin: 32px 0;
    }

    .tag-row {
        gap: 8px;
    }

    .tag {
        font-size: 0.72rem;
        padding: 4px 10px;
    }

    .tag-github {
        width: 26px;
        height: 26px;
    }

    .tag-github svg {
        width: 14px;
        height: 14px;
    }

    .release-title {
        font-size: 1.3rem;
        margin-bottom: 16px;
    }

    .release-body :deep(p) {
        font-size: 0.95rem;
        margin-bottom: 12px;
    }

    .release-body :deep(li) {
        font-size: 0.92rem;
    }
}
</style>
