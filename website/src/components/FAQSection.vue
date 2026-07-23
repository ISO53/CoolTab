<template>
    <section id="faq" class="faq-section container">
        <div class="faq-grid">
            <div class="section-header">
                <p class="fig-label">FAQ</p>
                <h2 class="title">Frequently Asked Questions</h2>
                <p class="subtitle">Have questions? We have answers. If you can't find what you're looking for, we've compiled the most common inquiries here.</p>
            </div>

            <div class="faq-list">
                <div
                    v-for="(item, index) in faqs"
                    :key="index"
                    class="faq-item"
                    :class="{ active: activeIndex === index }"
                >
                    <button
                        class="faq-question"
                        @click="toggle(index)"
                        :aria-expanded="activeIndex === index"
                    >
                        <span class="question-text">{{ item.question }}</span>
                        <span class="icon-wrapper">
                            <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                stroke="currentColor"
                                stroke-width="1.5"
                                fill="none"
                            >
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </span>
                    </button>

                    <div
                        class="faq-answer-wrapper"
                        ref="answerWrappers"
                        :style="getContentStyle(index)"
                    >
                        <div class="faq-answer">
                            <p>{{ item.answer }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';

const activeIndex = ref(null);
const answerWrappers = ref([]);

const faqs = [
    {
        question: "What is CoolTab and how does it work?",
        answer: "CoolTab is a comprehensive browser extension that transforms your standard new tab page into a highly customizable productivity hub. It features interactive widgets, beautiful themes, and tools designed to streamline your browsing experience while keeping your dashboard minimal and elegant."
    },
    {
        question: "How do I install the extension?",
        answer: "Installation is simple. Click the 'Get CoolTab Now' button or scroll to the installation section on this page. You'll find direct links to the Chrome Web Store and Firefox Add-ons store. Once added to your browser, open a new tab to see CoolTab in action."
    },
    {
        question: "Which browsers are supported?",
        answer: "CoolTab currently supports all Chromium-based browsers including Google Chrome, Microsoft Edge, Brave, and Opera. We also have full support for Mozilla Firefox."
    },
    {
        question: "Is CoolTab free to use?",
        answer: "Yes, CoolTab's core features, including all essential widgets and themes, are completely free to use. Our goal is to provide a premium dashboard experience for everyone."
    },
    {
        question: "Will it affect my browser's performance?",
        answer: "Not at all. CoolTab is engineered for speed. It uses lightweight components and efficient rendering to ensure your new tabs open instantly without impacting your browser's overall performance or memory usage."
    },
    {
        question: "How much can I customize my dashboard?",
        answer: "Extremely. You can add, remove, resize, and re-position widgets using a simple drag-and-drop interface. You can also customize colors, gradients, and wallpapers to match your personal aesthetic perfectly."
    },
    {
        question: "How is my privacy protected?",
        answer: "Your privacy is our priority. CoolTab operates with a 'Privacy First' philosophy: all your data, widget configurations, and preferences are stored locally on your device. We do not track your browsing habits, collect personal information, or sell your data to third parties."
    }
];

const toggle = (index) => {
    activeIndex.value = activeIndex.value === index ? null : index;
};

const getContentStyle = (index) => {
    if (activeIndex.value !== index || !answerWrappers.value[index]) {
        return { height: '0px', opacity: 0 };
    }
    return {
        height: answerWrappers.value[index].scrollHeight + 'px',
        opacity: 1
    };
};
</script>

<style scoped>
.faq-section {
    padding: 120px 24px;
}

.faq-grid {
    display: grid;
    grid-template-columns: 1fr 1.4fr;
    gap: 64px;
    align-items: start;
}

.section-header {
    text-align: left;
    position: sticky;
    top: 120px;
}

.title {
    font-size: clamp(2.25rem, 4vw, 3rem);
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin: 16px 0 20px;
}

.subtitle {
    font-size: 1.05rem;
    color: var(--text-muted);
    line-height: 1.65;
    max-width: 360px;
}

.faq-list {
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--border);
}

.faq-item {
    border-bottom: 1px solid var(--border);
}

.faq-question {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 0;
    background: none;
    border: none;
    color: var(--text-main);
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    transition: color var(--transition);
}

.question-text {
    flex: 1;
    padding-right: 32px;
}

.icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 180ms ease, color var(--transition);
    color: var(--text-muted);
    flex-shrink: 0;
}

.faq-item.active .icon-wrapper {
    transform: rotate(45deg);
    color: var(--text-main);
}

.faq-answer-wrapper {
    overflow: hidden;
    transition: height 180ms ease, opacity 180ms ease;
}

.faq-answer {
    padding: 0 0 24px 0;
    color: var(--text-muted);
    font-size: 1rem;
    line-height: 1.65;
    max-width: 92%;
}

@media (max-width: 1024px) {
    .faq-grid {
        grid-template-columns: 1fr;
        gap: 40px;
    }

    .section-header {
        position: static;
    }

    .subtitle {
        max-width: 100%;
    }
}

@media (max-width: 768px) {
    .faq-section {
        padding: 80px 24px;
    }

    .faq-question {
        font-size: 1.05rem;
        padding: 20px 0;
    }
}
</style>
