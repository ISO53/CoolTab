<template>
    <svg
        class="feature-art"
        :viewBox="viewBox"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <!-- Productivity Hub: task list + search -->
        <g v-if="type === 'productivity'">
            <rect x="40" y="28" width="200" height="36" rx="6" stroke="currentColor" stroke-opacity="0.45" />
            <circle cx="58" cy="46" r="7" stroke="currentColor" stroke-opacity="0.7" />
            <line x1="63" y1="51" x2="68" y2="56" stroke="currentColor" stroke-opacity="0.7" />
            <line x1="78" y1="46" x2="200" y2="46" stroke="currentColor" stroke-opacity="0.25" />

            <rect x="40" y="84" width="220" height="44" rx="5" stroke="currentColor" stroke-opacity="0.55" />
            <rect x="54" y="98" width="16" height="16" rx="3" stroke="currentColor" stroke-opacity="0.85" />
            <path d="M58 106 L61 109 L68 101" stroke="currentColor" stroke-opacity="0.9" />
            <line x1="84" y1="106" x2="210" y2="106" stroke="currentColor" stroke-opacity="0.5" />

            <rect x="40" y="140" width="220" height="44" rx="5" stroke="currentColor" stroke-opacity="0.4" />
            <rect x="54" y="154" width="16" height="16" rx="3" stroke="currentColor" stroke-opacity="0.5" />
            <line x1="84" y1="162" x2="190" y2="162" stroke="currentColor" stroke-opacity="0.35" />

            <rect x="40" y="196" width="220" height="44" rx="5" stroke="currentColor" stroke-opacity="0.35" />
            <rect x="54" y="210" width="16" height="16" rx="3" stroke="currentColor" stroke-opacity="0.4" />
            <line x1="84" y1="218" x2="175" y2="218" stroke="currentColor" stroke-opacity="0.3" />

            <text x="40" y="270" class="label">TASK QUEUE</text>
        </g>

        <!-- Live Intelligence: chart + weather -->
        <g v-else-if="type === 'live'">
            <polyline
                points="24,150 48,130 72,138 96,92 120,108 144,70 168,88 192,48 216,62 240,40"
                stroke="currentColor"
                stroke-opacity="0.85"
                stroke-width="1.5"
            />
            <polyline
                points="24,150 48,150 72,150 96,150 120,150 144,150 168,150 192,150 216,150 240,150 240,40 24,150"
                fill="currentColor"
                fill-opacity="0.06"
                stroke="none"
            />
            <line x1="24" y1="150" x2="240" y2="150" stroke="currentColor" stroke-opacity="0.2" />
            <text x="24" y="36" class="label">AAPL +0.7%</text>
            <circle cx="192" cy="48" r="3.5" fill="currentColor" />
            <line x1="192" y1="48" x2="220" y2="28" stroke="currentColor" stroke-opacity="0.4" stroke-dasharray="3 3" />
            <text x="224" y="32" class="label">LIVE</text>

            <path d="M48 200 A28 28 0 0 1 104 200" stroke="currentColor" stroke-opacity="0.5" />
            <circle cx="76" cy="200" r="3" fill="currentColor" fill-opacity="0.8" />
            <text x="120" y="204" class="label">26°</text>
        </g>

        <!-- Privacy: shield -->
        <g v-else-if="type === 'privacy'">
            <path
                d="M140 36 L210 58 V120 C210 168 174 204 140 220 C106 204 70 168 70 120 V58 Z"
                stroke="currentColor"
                stroke-opacity="0.75"
                stroke-width="1.5"
                fill="currentColor"
                fill-opacity="0.04"
            />
            <rect x="118" y="118" width="44" height="36" rx="4" stroke="currentColor" stroke-opacity="0.9" />
            <path d="M128 118 V106 C128 94 133 88 140 88 C147 88 152 94 152 106 V118" stroke="currentColor" stroke-opacity="0.9" />
            <circle cx="140" cy="134" r="3.5" fill="currentColor" />
            <circle cx="140" cy="36" r="3" fill="currentColor" class="hot" />
            <text x="70" y="250" class="label">LOCAL ONLY</text>
        </g>

        <!-- Flexibility: rearrangeable grid -->
        <g v-else-if="type === 'flex'">
            <rect x="40" y="40" width="90" height="70" rx="4" stroke="currentColor" stroke-opacity="0.7" />
            <rect x="146" y="40" width="70" height="70" rx="4" stroke="currentColor" stroke-opacity="0.45" stroke-dasharray="4 3" />
            <rect x="40" y="128" width="70" height="90" rx="4" stroke="currentColor" stroke-opacity="0.45" stroke-dasharray="4 3" />
            <rect x="126" y="128" width="110" height="90" rx="4" stroke="currentColor" stroke-opacity="0.75" />
            <!-- drag handle -->
            <circle cx="216" cy="218" r="8" stroke="currentColor" stroke-opacity="0.9" fill="currentColor" fill-opacity="0.08" />
            <line x1="211" y1="218" x2="221" y2="218" stroke="currentColor" stroke-opacity="0.9" />
            <line x1="216" y1="213" x2="216" y2="223" stroke="currentColor" stroke-opacity="0.9" />
            <path d="M216 40 L236 20" stroke="currentColor" stroke-opacity="0.35" stroke-dasharray="3 3" />
            <text x="40" y="250" class="label">DRAG · RESIZE</text>
        </g>

        <!-- Themes: palette / wallpaper frame -->
        <g v-else-if="type === 'theme'">
            <rect x="48" y="40" width="180" height="120" rx="6" stroke="currentColor" stroke-opacity="0.55" />
            <line x1="48" y1="70" x2="228" y2="70" stroke="currentColor" stroke-opacity="0.2" />
            <circle cx="64" cy="55" r="4" stroke="currentColor" stroke-opacity="0.4" />
            <circle cx="78" cy="55" r="4" stroke="currentColor" stroke-opacity="0.4" />
            <circle cx="92" cy="55" r="4" stroke="currentColor" stroke-opacity="0.4" />
            <!-- swatches -->
            <rect x="64" y="100" width="28" height="28" rx="3" stroke="currentColor" stroke-opacity="0.35" fill="currentColor" fill-opacity="0.05" />
            <rect x="100" y="100" width="28" height="28" rx="3" stroke="currentColor" stroke-opacity="0.55" fill="currentColor" fill-opacity="0.12" />
            <rect x="136" y="100" width="28" height="28" rx="3" stroke="currentColor" stroke-opacity="0.9" fill="currentColor" fill-opacity="0.25" />
            <rect x="172" y="100" width="28" height="28" rx="3" stroke="currentColor" stroke-opacity="0.4" fill="currentColor" fill-opacity="0.08" />
            <circle cx="150" cy="114" r="3" fill="currentColor" />
            <text x="48" y="196" class="label">THEME · SWATCH</text>
        </g>

        <!-- Smart Search -->
        <g v-else-if="type === 'search'">
            <rect x="36" y="48" width="220" height="40" rx="8" stroke="currentColor" stroke-opacity="0.7" />
            <circle cx="58" cy="68" r="8" stroke="currentColor" stroke-opacity="0.9" />
            <line x1="64" y1="74" x2="70" y2="80" stroke="currentColor" stroke-opacity="0.9" />
            <line x1="78" y1="68" x2="180" y2="68" stroke="currentColor" stroke-opacity="0.3" />
            <rect x="200" y="58" width="40" height="20" rx="3" stroke="currentColor" stroke-opacity="0.35" />
            <text x="208" y="72" class="label tiny">↵</text>

            <line x1="50" y1="110" x2="220" y2="110" stroke="currentColor" stroke-opacity="0.2" />
            <line x1="50" y1="140" x2="190" y2="140" stroke="currentColor" stroke-opacity="0.35" />
            <line x1="50" y1="170" x2="205" y2="170" stroke="currentColor" stroke-opacity="0.25" />
            <line x1="50" y1="200" x2="160" y2="200" stroke="currentColor" stroke-opacity="0.2" />
            <rect x="40" y="128" width="8" height="8" rx="1" stroke="currentColor" stroke-opacity="0.8" />
            <text x="36" y="240" class="label">QUERY · RESULTS</text>
        </g>
    </svg>
</template>

<script setup>
defineProps({
    type: { type: String, required: true },
    viewBox: { type: String, default: '0 0 280 280' },
});
</script>

<style scoped>
.feature-art {
    width: 100%;
    height: 100%;
    color: #F2F2F0;
    display: block;
}

.label {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.14em;
    fill: #8A8A90;
}

.label.tiny {
    font-size: 11px;
    fill: rgba(242, 242, 240, 0.5);
}
</style>
