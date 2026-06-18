<template>
    <Widget>
        <div class="location-widget">
            <!-- Location Info -->
            <div class="location-info">
                <p class="city-info">{{ city }}</p>
		        <p class="latlon">{{ lat }}° {{ lon }}°</p>
                <h1 class="ip-info">IPv4: {{ ip }}</h1>
            </div>

            <!-- Globe -->
            <div class="globe-container" ref="globeWrap">
                <canvas ref="globeCanvas" class="globe-canvas"></canvas>
                <div v-if="lat && lon" class="pulsing-marker"></div>
            </div>
        </div>
    </Widget>
</template>

<script>
import Widget from "./Widget.vue";
import { useSettingsStore } from "@/settings";
import createGlobe from "cobe";

export default {
    name: "Location",
    components: {
        Widget,
    },
    setup() {
        const settingsStore = useSettingsStore();
        return { settingsStore };
    },
    data() {
        return {
            globeInstance: null,
            phi: 0,
            resizeObserver: null,
            animationFrameId: null,
        };
    },
    computed: {
        ip() {
            return this.settingsStore.location?.ip;
        },
        city() {
            return this.settingsStore.location?.city;
        },
        lat() {
            return this.settingsStore.location?.lat;
        },
        lon() {
            return this.settingsStore.location?.lon;
        },
		globeColor() {
			// Parse the theme color into an [r, g, b] array, normalized to 0–1 for cobe
            return this.hexToRgbArray(this.settingsStore.colors.color_secondary_text);
        },
        markerColor() {
            // Marker uses the primary text color
            return this.hexToRgbArray(this.settingsStore.colors.color_primary_text);
        },
    },
    watch: {
        "settingsStore.colors": {
            handler() {
                this.rebuildGlobe();
            },
            deep: true,
        },
    },
    mounted() {
        this.fetchIP().then(() => {
            this.$nextTick(() => {
                this.initGlobe();
                this.setupResizeObserver();
            });
        });
    },
    beforeUnmount() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        if (this.globeInstance) {
            this.globeInstance.destroy();
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    },
    methods: {
        hexToRgbArray(colorStr) {
            if (!colorStr) return [0.5, 0.5, 0.5];
            const str = colorStr.trim().toLowerCase();
            if (str.startsWith("rgb")) {
                const matches = str.match(/\d+/g);
                if (matches && matches.length >= 3) {
                    return [
                        parseInt(matches[0], 10) / 255,
                        parseInt(matches[1], 10) / 255,
                        parseInt(matches[2], 10) / 255
                    ];
                }
            } else {
                // Remove leading # if present
                const hex = str.startsWith("#") ? str.slice(1) : str;
                if (hex.length === 3) {
                    const r = parseInt(hex[0] + hex[0], 16) / 255;
                    const g = parseInt(hex[1] + hex[1], 16) / 255;
                    const b = parseInt(hex[2] + hex[2], 16) / 255;
                    return [r, g, b];
                } else if (hex.length === 6) {
                    const r = parseInt(hex.slice(0, 2), 16) / 255;
                    const g = parseInt(hex.slice(2, 4), 16) / 255;
                    const b = parseInt(hex.slice(4, 6), 16) / 255;
                    return [r, g, b];
                }
            }
            return [0.5, 0.5, 0.5];
        },

        getCanvasSize() {
            const wrap = this.$refs.globeWrap;
            if (!wrap) return 300;
            return Math.min(wrap.offsetWidth, wrap.offsetHeight);
        },

        initGlobe() {
            const canvas = this.$refs.globeCanvas;
            if (!canvas) return;

            const size = this.getCanvasSize();
            if (size <= 0) return;
            const dpr = Math.min(window.devicePixelRatio, 2);

            const c = this.globeColor;
            const mc = this.markerColor;
            const baseColor = c;
            const glowColor = [c[0] * 0.8, c[1] * 0.8, c[2] * 0.8];

            const isDark = this.settingsStore.colorPalette?.theme !== "light";

            const markers = [{ location: [this.lat, this.lon], size: 0.01, id: "marker" }];
            this.calculatePOV();

            this.globeInstance = createGlobe(canvas, {
                devicePixelRatio: dpr,
                width: size,
				height: size,
                scale: 1,
                phi: this.phi,
                theta: this.theta,
                dark: isDark ? 1 : 0,
                diffuse: 1.2,
                mapSamples: 16000,
                mapBrightness: 2,
                baseColor: baseColor,
                markerColor: mc,
                glowColor: glowColor,
				markers: markers,
                markerElevation: 0,
            });

            // Start the manual animation loop
            const updatePhi = () => {
                if (!this.globeInstance) return;
                this.phi += 0.0005;
                this.globeInstance.update({ phi: this.phi });
                this.animationFrameId = requestAnimationFrame(updatePhi);
            };
            this.animationFrameId = requestAnimationFrame(updatePhi);
        },

        calculatePOV() {
            if (this.lat === null || this.lon === null) return;

            // From Latitude/Longitude to 3D (based on docs)
            const latRad = this.lat * Math.PI / 180;
            const lonRad = (this.lon * Math.PI / 180) - Math.PI;

            // -0.5 because only the top-left corner of the globe is visible
            const x = -Math.cos(latRad) * Math.cos(lonRad) - 0.5;
            const y = Math.sin(latRad) - 0.5;
            const z = Math.cos(latRad) * Math.sin(lonRad);

            // Calculate phi and theta to face this 3D point (x, y, z)
            // This makes the point (0, 0, 1) in the rotated coordinate system
            this.phi = Math.atan2(-x, z);
            this.theta = Math.asin(y);
        },

        rebuildGlobe() {
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
            if (this.globeInstance) {
                this.globeInstance.destroy();
                this.globeInstance = null;
            }
            this.$nextTick(() => {
                this.initGlobe();
            });
        },

        setupResizeObserver() {
            const wrap = this.$refs.globeWrap;
            if (!wrap) return;

            this.resizeObserver = new ResizeObserver(() => {
                this.rebuildGlobe();
            });
            this.resizeObserver.observe(wrap);
        },

        async fetchIP() {
            const cacheTime = 12 * 60 * 60 * 1000; // 12 hours
            const now = new Date();
            const lastUpdated = this.settingsStore.location?.lastUpdated;

            if (lastUpdated && now - lastUpdated < cacheTime) {
                return; // Use cached data
            }

            try {
                const res = await fetch("https://cool-tab-api.vercel.app/api/get-location");
                const data = await res.json();
                this.settingsStore.setLocation({
                    ...data,
                    lastUpdated: now
                });
            } catch (e) {
                console.error("Failed to fetch location info:", e);
            }
        },
    },
};
</script>

<style scoped>
.location-widget {
    position: relative;
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
    font-family: Satoshi-Medium;
    overflow: hidden;
    container-type: size;
}

.location-info {
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px;
    z-index: 3;
}

.city-info {
    font-size: 12cqw;
    line-height: 12cqw;
    font-family: Satoshi-Black;
}

.latlon {
    font-size: 8cqw;
    line-height: 8cqw;
    font-family: Satoshi-Medium;
}

.ip-info {
    font-size: 6cqw;
    line-height: 6cqw;
    font-family: Satoshi-Light;
}

.globe-container {
    position: absolute;
    bottom: -80cqw;
    right: -55cqw;
    width: 170cqw;
    height: 170cqw;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.globe-canvas {
    width: 100%;
    height: 100%;
}

.pulsing-marker {
    position: absolute;
    position-anchor: --cobe-marker;
    top: anchor(center);
    left: anchor(center);
    width: 3cqw;
    height: 3cqw;
    background-color: v-bind('settingsStore.colors.color_primary_text');
    border-radius: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 2;
    opacity: var(--cobe-visible-marker, 0);
    transition: opacity 0.3s;
}

.pulsing-marker::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: inherit;
    border-radius: 50%;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 0.8;
    }
    100% {
        transform: scale(3);
        opacity: 0;
    }
}
</style>
