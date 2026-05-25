<template>
    <section id="faq" class="faq-section container">
        <div class="faq-grid">
            <div class="section-header">
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
                                width="20" 
                                height="20" 
                                stroke="currentColor" 
                                stroke-width="2" 
                                fill="none" 
                                class="plus-icon"
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
    padding: 120px 20px;
}

.faq-grid {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 80px;
    align-items: start;
}

.section-header {
    text-align: left;
    position: sticky;
    top: 120px;
}

.title {
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 24px;
}

.subtitle {
    font-size: 1.25rem;
    color: var(--text-muted);
    line-height: 1.6;
    max-width: 400px;
}

.faq-list {
    display: flex;
    flex-direction: column;
}

.faq-item {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.faq-question {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32px 0;
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
    transition: all 0.3s ease;
}

.question-text {
    flex: 1;
    padding-right: 40px;
}

.icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    color: var(--text-muted);
}

.faq-item.active .icon-wrapper {
    transform: rotate(135deg);
    color: white;
}

.faq-answer-wrapper {
    overflow: hidden;
    transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease;
}

.faq-answer {
    padding: 0 0 32px 0;
    color: var(--text-muted);
    font-size: 1.1rem;
    line-height: 1.6;
    max-width: 90%;
}

@media (max-width: 1024px) {
    .faq-grid {
        grid-template-columns: 1fr;
        gap: 60px;
    }
    
    .section-header {
        position: static;
        text-align: left;
    }
    
    .subtitle {
        max-width: 100%;
    }
}

@media (max-width: 768px) {
    .title {
        font-size: 2.5rem;
    }
    
    .faq-question {
        font-size: 1.1rem;
        padding: 24px 0;
    }
}
</style>
