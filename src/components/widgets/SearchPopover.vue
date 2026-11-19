<template>
	<Teleport to="body">
		<Transition name="popover">
			<div v-if="open" ref="panel" class="search-popover"
				:class="{ glass: surface.isGlass, compact: !settingsStore.searchSuggestions }" :style="surface.style"
				@click.stop>
				<div class="popover-input-row">
					<Svg :class_name="'material-icons-outlined'" :name="'search'" class="popover-search-icon"></Svg>

					<div class="input-wrap">
						<input ref="input" type="text" v-model="searchQuery" placeholder="Search..."
							class="popover-input" @keydown="onKeydown" @input="onInput"
							@compositionstart="isComposing = true" @compositionend="onCompositionEnd"
							@click="updateGhost" @keyup="updateGhost" />
						<div v-if="ghostRemainder" ref="ghost" class="ghost" aria-hidden="true">
							<span class="ghost-typed">{{ searchQuery }}</span><span class="ghost-rest">{{ ghostRemainder
								}}</span>
						</div>
					</div>

					<Svg :class_name="'material-icons-outlined'" :name="'close'" v-if="searchQuery" @click="clearQuery"
						class="popover-clear-button"></Svg>
					<!-- placeholder keeps the row width identical when the X is hidden -->
					<span v-else class="clear-button-placeholder"></span>
				</div>

				<div class="popover-results">
					<div class="popover-suggestions">
						<div v-for="(row, index) in suggestionRows" :key="row.id" class="suggestion-row"
							:class="{ highlighted: index === highlightedIndex, action: row.kind === 'action' }"
							:data-index="index" @mousedown.prevent @mouseenter="highlightedIndex = index"
							@click="executeRow(row)">
							<img v-if="rowFavicon(row)" :src="rowFavicon(row)" alt="" class="row-icon" />
							<i v-else class="material-icons-outlined row-icon">{{ rowIcon(row) }}</i>

							<span v-if="row.kind === 'action'" class="row-primary row-action-text">
								{{ actionLabel(row) }} {{ row.action === "open" ? row.text : `'${row.text}'` }}
							</span>
							<span v-else class="row-primary" v-html="highlightedHtml(primaryText(row))"></span>

							<span v-if="secondaryText(row)" class="row-secondary">{{ secondaryText(row) }}</span>

							<i v-if="row.kind === 'history'" class="material-icons-outlined row-delete"
								title="Remove from history" @click.stop="removeEntry(row)">close</i>
						</div>
					</div>
				</div>

				<div v-if="settingsStore.searchSuggestions" class="popover-footer">
					<span v-if="highlightedHistory" class="footer-hint">
						<span>Delete</span>
						<span class="kbd">Del</span>
					</span>
					<span v-else></span>
					<span class="footer-hint">
						<span>Open link</span>
						<span class="kbd">↵</span>
					</span>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script>
import { useSettingsStore } from "@/settings";
import { SEARCH_ENGINES, isUrl, toNavigableUrl, toDisplayUrl, normalizeUrl, frecencyRank, getTopSites, getFaviconUrl } from "@/utils/omnibox";

// Content suggestions shown before the terminal search/open row
const MAX_SUGGESTIONS = 8;

export default {
	name: "SearchPopover",
	setup() {
		const settingsStore = useSettingsStore();
		return { settingsStore };
	},
	props: {
		open: {
			type: Boolean,
			default: false,
		},
		// The launcher element; clicks on it must not count as "outside"
		launcher: {
			type: HTMLElement,
			default: null,
		},
	},
	emits: ["close"],
	data() {
		return {
			searchQuery: "",
			highlightedIndex: -1,
			topSites: [],
			topSitesLoaded: false,
			ghostRemainder: "",
			ghostSuppressed: false,
			isComposing: false,
			favicons: {},
		};
	},
	computed: {
		surface() {
			const colors = this.settingsStore.colors;
			const dark = this.settingsStore.colorPalette.theme === "Dark";

			switch (this.settingsStore.widgetBackground) {
				case "Blur":
					return {
						isGlass: false,
						style: {
							background: dark
								? `color-mix(in srgb, var(--color-secondary-background), transparent 80%)`
								: `color-mix(in srgb, var(--color-secondary-background), transparent 40%)`,
							backdropFilter: "blur(30px)",
							webkitBackdropFilter: "blur(30px)",
						},
					};
				case "Glass":
					return {
						isGlass: true,
						style: {
							background: `linear-gradient(
                                165deg,
                                color-mix(in srgb, var(--color-secondary-background), transparent 88%) 0%,
                                color-mix(in srgb, var(--color-secondary-background), transparent 94%) 50%,
                                color-mix(in srgb, var(--color-secondary-background), transparent 90%) 100%
                            )`,
							backdropFilter: "blur(18px) saturate(1.4) brightness(1.05)",
							webkitBackdropFilter: "blur(18px) saturate(1.4) brightness(1.05)",
							boxShadow: `
                                0 16px 48px rgba(0, 0, 0, 0.45),
                                inset 0 1px 0 rgba(255, 255, 255, 0.15),
                                inset 0 -1px 0 rgba(0, 0, 0, 0.08)
                            `,
						},
					};
				default: // Color (and Transparent fallback)
					return {
						isGlass: false,
						style: {
							background: colors.color_secondary_background,
						},
					};
			}
			},
			// The highlighted row when it is a removable history entry
			highlightedHistory() {
				const row = this.suggestionRows[this.highlightedIndex];
				return row && row.kind === "history" ? row : null;
			},
			suggestionRows() {
			if (!this.settingsStore.searchSuggestions) return [];

			const q = this.searchQuery.trim().toLowerCase();
			const rows = [];
			const seen = new Set();
			const pushRow = (row) => {
				const key =
					row.type === "url" && row.url ? "u:" + normalizeUrl(row.url) : "s:" + row.text.toLowerCase();
				if (seen.has(key)) return;
				seen.add(key);
				rows.push(row);
			};

			// History first, frecency-ranked; prefix matches beat substring matches
			const history = [...this.settingsStore.searchHistory].sort(
				(a, b) => frecencyRank(b) - frecencyRank(a)
			);
			for (const prefixOnly of q ? [true, false] : [false]) {
				for (const entry of history) {
					if (rows.length >= MAX_SUGGESTIONS) break;
					if (q) {
						const text = (entry.text || "").toLowerCase();
						const haystacks = entry.url ? [text, entry.url.toLowerCase()] : [text];
						const hit = prefixOnly
							? haystacks.some((h) => h.startsWith(q))
							: haystacks.some((h) => h.includes(q));
						if (!hit) continue;
					}
					pushRow({ id: `history-${rows.length}`, kind: "history", ...entry });
				}
			}

			// Top sites fill the remaining slots
			if (rows.length < MAX_SUGGESTIONS) {
				for (const site of this.topSites) {
					if (rows.length >= MAX_SUGGESTIONS) break;
					const text = toDisplayUrl(site.url);
					const title = site.title?.trim() || null;
					if (q) {
						const hit =
							text.toLowerCase().includes(q) || (title || "").toLowerCase().includes(q);
						if (!hit) continue;
					}
					pushRow({ id: `topsite-${rows.length}`, kind: "topsite", type: "url", text, url: site.url, title });
				}
			}

			// Terminal rows: what Enter does when nothing is highlighted
			const raw = this.searchQuery.trim();
			if (raw) {
				if (isUrl(raw)) {
					rows.push({ id: "action-open", kind: "action", action: "open", type: "url", text: raw });
					rows.push({ id: "action-search", kind: "action", action: "search", type: "search", text: raw });
				} else {
					rows.push({ id: "action-search", kind: "action", action: "search", type: "search", text: raw });
				}
			}

			return rows;
		},
	},
	watch: {
		open(value) {
			if (value) {
				this.highlightedIndex = -1;
				this.loadTopSites();
				this.$nextTick(() => {
					this.$refs.input?.focus();
					this.updateGhost();
				});
			} else {
				this.ghostRemainder = "";
			}
		},
		suggestionRows: {
			handler() {
				this.loadFavicons();
			},
			immediate: true,
		},
		highlightedIndex() {
			this.scrollHighlightedIntoView();
		},
	},
	mounted() {
		document.addEventListener("click", this.onDocumentClick);
	},
	beforeUnmount() {
		document.removeEventListener("click", this.onDocumentClick);
	},
	methods: {
		// Public: let the launcher hand focus back to the input on a re-open click
		focusInput() {
			this.$refs.input?.focus();
		},
		async loadTopSites() {
			if (this.topSitesLoaded) return;
			this.topSitesLoaded = true;
			this.topSites = await getTopSites();
		},
		onDocumentClick(event) {
			if (!this.open) return;
			const clickedInside = this.$refs.panel?.contains(event.target);
			const clickedLauncher = this.launcher?.contains(event.target);
			if (!clickedInside && !clickedLauncher) {
				this.$emit("close");
			}
		},
		onKeydown(e) {
			if (e.isComposing || e.keyCode === 229) return;

			if (e.key === "Backspace") {
				this.ghostSuppressed = true;
			} else if (e.key.length === 1) {
				this.ghostSuppressed = false;
			}

			if (e.key === "ArrowDown" && this.suggestionRows.length) {
				e.preventDefault();
				this.highlightedIndex = (this.highlightedIndex + 1) % this.suggestionRows.length;
			} else if (e.key === "ArrowUp" && this.suggestionRows.length) {
				e.preventDefault();
				this.highlightedIndex =
					this.highlightedIndex <= 0 ? this.suggestionRows.length - 1 : this.highlightedIndex - 1;
			} else if (e.key === "ArrowRight" && this.ghostRemainder) {
				// Caret at the end with ghost text showing: -> accepts the
				// completion (types it out), like the browser address bar
				const input = this.$refs.input;
				const caretAtEnd =
					input && input.selectionStart === input.value.length && input.selectionEnd === input.value.length;
				if (caretAtEnd) {
					e.preventDefault();
					this.acceptGhost();
				}
			} else if (e.key === "Delete") {
				// Delete removes the highlighted history entry; the highlight
				// stays at the same index so entries can be deleted in a run.
				// With a text selection, let the input edit normally instead.
				const input = this.$refs.input;
				const noSelection = !input || input.selectionStart === input.selectionEnd;
				if (this.highlightedHistory && noSelection) {
					e.preventDefault();
					this.removeHighlightedEntry();
				}
			} else if (e.key === "Escape") {
				this.$emit("close");
			} else if (e.key === "Tab") {
				if (this.ghostRemainder) {
					e.preventDefault();
					this.acceptGhost();
				}
			} else if (e.key === "Enter") {
				if (this.highlightedIndex >= 0) {
					this.executeRow(this.suggestionRows[this.highlightedIndex]);
				} else if (this.ghostRemainder) {
					// Ghost text is showing: Enter commits the completion and
					// opens the entry it came from, instead of searching the
					// raw prefix ("you" -> open youtube.com..., not search)
					this.executeRow(this.firstContentRow());
				} else {
					this.submitDefault();
				}
			}
		},
		onInput() {
			this.highlightedIndex = -1;
			this.updateGhost();
		},
		onCompositionEnd() {
			this.isComposing = false;
			this.updateGhost();
		},
		// Ghost text: the typed query completed inline by the top-ranked
		// prefix match, like the browser bar's grayed-out remainder.
		updateGhost() {
			const input = this.$refs.input;
			this.$nextTick(() => this.syncGhostScroll());

			if (
				!this.settingsStore.searchSuggestions ||
				this.ghostSuppressed ||
				this.isComposing ||
				!input ||
				input.selectionStart !== input.value.length ||
				input.selectionEnd !== input.value.length
			) {
				this.ghostRemainder = "";
				return;
			}

			const q = input.value;
			const first = this.firstContentRow();
			if (!q || !first) {
				this.ghostRemainder = "";
				return;
			}

			const text = first.text || "";
			if (text.length > q.length && text.toLowerCase().startsWith(q.toLowerCase())) {
				this.ghostRemainder = text.slice(q.length);
			} else {
				this.ghostRemainder = "";
			}
		},
		// Top-ranked content row (history/top site) — the ghost text source
		firstContentRow() {
			return this.suggestionRows.find((row) => row.kind !== "action");
		},
		syncGhostScroll() {
			const input = this.$refs.input;
			const ghost = this.$refs.ghost;
			if (input && ghost) {
				ghost.scrollLeft = input.scrollLeft;
			}
		},
		acceptGhost() {
			this.searchQuery += this.ghostRemainder;
			this.ghostRemainder = "";
			this.ghostSuppressed = true;
			this.highlightedIndex = -1;
			this.$nextTick(() => {
				const input = this.$refs.input;
				input.setSelectionRange(input.value.length, input.value.length);
			});
		},
		clearQuery() {
			this.searchQuery = "";
			this.highlightedIndex = -1;
			this.ghostSuppressed = false;
			this.ghostRemainder = "";
		},
		removeEntry(row) {
			this.settingsStore.removeSearchHistoryEntry(row);
			this.highlightedIndex = -1; // indices shift after removal
		},
		removeHighlightedEntry() {
			if (!this.highlightedHistory) return;
			const index = this.highlightedIndex;
			this.settingsStore.removeSearchHistoryEntry(this.highlightedHistory);
			const count = this.suggestionRows.length;
			this.highlightedIndex = count ? Math.min(index, count - 1) : -1;
			this.updateGhost();
		},
		submitDefault() {
			const raw = this.searchQuery.trim();
			if (!raw) return;

			if (isUrl(raw)) {
				this.settingsStore.recordSearchPick({ type: "url", text: toDisplayUrl(raw), url: toNavigableUrl(raw) });
				this.navigate(toNavigableUrl(raw));
			} else {
				this.settingsStore.recordSearchPick({ type: "search", text: raw });
				this.navigate(this.searchUrl(raw));
			}
		},
		executeRow(row) {
			if (row.kind === "action") {
				if (row.action === "open") {
					this.settingsStore.recordSearchPick({ type: "url", text: toDisplayUrl(row.text), url: toNavigableUrl(row.text) });
					this.navigate(toNavigableUrl(row.text));
				} else {
					this.settingsStore.recordSearchPick({ type: "search", text: row.text });
					this.navigate(this.searchUrl(row.text));
				}
				return;
			}
			if (row.type === "url") {
				this.settingsStore.recordSearchPick({ type: "url", text: row.text, url: row.url });
				this.navigate(row.url);
			} else {
				this.settingsStore.recordSearchPick({ type: "search", text: row.text });
				this.navigate(this.searchUrl(row.text));
			}
		},
		searchUrl(query) {
			return SEARCH_ENGINES.get(this.settingsStore.searchEngine) + encodeURIComponent(query);
		},
		navigate(url) {
			this.$emit("close");
			if (this.settingsStore.openSearchResultIn === "New Tab") {
				window.open(url, "_blank");
			} else {
				window.location.href = url; // Current Tab
			}
		},
		async loadFavicons() {
			for (const row of this.suggestionRows) {
				if (row.type !== "url" || !row.url) continue;
				let hostname;
				try {
					hostname = new URL(row.url).hostname;
				} catch {
					continue;
				}
				if (!(hostname in this.favicons)) {
					// Placeholder while fetching; null means "no favicon"
					this.favicons[hostname] = null;
					this.favicons[hostname] = await getFaviconUrl(hostname);
				}
			}
		},
		rowFavicon(row) {
			if (row.type !== "url" || !row.url) return null;
			try {
				return this.favicons[new URL(row.url).hostname] || null;
			} catch {
				return null;
			}
		},
		rowIcon(row) {
			if (row.kind === "action") {
				return row.action === "open" ? "language" : "search";
			}
			return row.type === "url" ? "language" : "search";
		},
		actionLabel(row) {
			return row.action === "open" ? "Open" : `Search ${this.settingsStore.searchEngine} for`;
		},
		primaryText(row) {
			return row.title || row.text;
		},
		secondaryText(row) {
			// Only top sites carry a secondary label (their hostname under the title);
			// history rows are self-explanatory
			if (row.kind === "topsite") return row.title ? row.text : null;
			return null;
		},
		// Query occurrence bolded; content is escaped, user input is never raw HTML
		highlightedHtml(text) {
			const q = this.searchQuery.trim();
			if (!text) return "";
			const escaped = escapeHtml(text);
			if (!q) return escaped;
			const index = text.toLowerCase().indexOf(q.toLowerCase());
			if (index === -1) return escaped;
			return (
				escapeHtml(text.slice(0, index)) +
				`<span class="match">${escapeHtml(text.slice(index, index + q.length))}</span>` +
				escapeHtml(text.slice(index + q.length))
			);
		},
		scrollHighlightedIntoView() {
			if (!this.open || this.highlightedIndex < 0) return;
			this.$nextTick(() => {
				this.$refs.panel
					?.querySelector(`.suggestion-row[data-index="${this.highlightedIndex}"]`)
					?.scrollIntoView({ block: "nearest" });
			});
		},
	},
};

function escapeHtml(s) {
	return s
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}
</script>

<style scoped>
.search-popover {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: min(640px, 86vw);
	height: min(380px, 80vh);
	display: flex;
	flex-direction: column;
	border-radius: 10px;
	overflow: hidden;
	isolation: isolate;
	user-select: none;
	font-family: Satoshi-Regular;
	color: var(--color-secondary-text);
	z-index: 10000;
	box-shadow: 0 16px 48px rgba(0, 0, 0, 0.45);
}

/* Suggestions off: just the input row, no reserved empty space */
.search-popover.compact {
	height: auto;
}

.search-popover.compact .popover-results {
	display: none;
}

.popover-input-row {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 14px 16px;
	flex-shrink: 0;
}

.popover-search-icon {
	color: var(--color-tertiary-text);
	font-size: 22px;
}

.input-wrap {
	position: relative;
	flex: 1;
	display: flex;
	align-items: stretch;
	min-width: 0;
}

.popover-input {
	width: 100%;
	border: none;
	padding: 0;
	background-color: transparent;
	color: var(--color-primary-text);
	font-family: Satoshi-Regular;
	font-size: 1.05rem;
	height: 26px;
}

.popover-input::placeholder {
	color: var(--color-tertiary-text);
}

.popover-input:focus {
	outline: none;
}

.ghost {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	font-size: 1.05rem;
	font-family: Satoshi-Regular;
	white-space: nowrap;
	overflow: hidden;
	pointer-events: none;
	color: var(--color-tertiary-text);
}

/* Takes exactly the typed text's width so the remainder lands after the caret */
.ghost-typed {
	visibility: hidden;
}

.popover-clear-button {
	font-size: 20px;
	cursor: pointer;
	color: var(--color-tertiary-text);
	transition: color 200ms ease;
	flex-shrink: 0;
}

.popover-clear-button:hover {
	color: var(--color-primary-text);
}

.clear-button-placeholder {
	width: 20px;
	flex-shrink: 0;
}

/* Inset shell that gives the darker results card its side margins */
.popover-results {
	flex: 1 1 auto;
	min-height: 0;
	display: flex;
	flex-direction: column;
	padding: 0 10px;
}

.popover-suggestions {
	flex: 1 1 auto;
	min-height: 0;
	/* lets the flex child actually shrink and scroll */
	overflow-y: auto;
	padding: 5px;
	border-radius: 8px;
	background: color-mix(in srgb, var(--color-primary-background), transparent 75%);
	scrollbar-width: none;
	/* arrow keys navigate; no scrollbar */
}

.popover-suggestions::-webkit-scrollbar {
	display: none;
}

.popover-footer {
	flex-shrink: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 8px 14px 10px;
	color: var(--color-tertiary-text);
	font-size: 0.8rem;
	user-select: none;
}

.footer-hint {
	display: flex;
	align-items: center;
	gap: 6px;
}

.kbd {
	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 1.8em;
	height: 1.4em;
	padding: 0 7px;
	font-size: 0.7rem;
	color: var(--color-tertiary-text);
	border: 1px solid currentColor;
	border-radius: 6px;
}

/* The key's base: an outline extending below the face, line-art style.
   No top border so the face's bottom edge doubles as the joint line. */
.kbd::after {
	content: "";
	position: absolute;
	left: 0;
	right: 0;
	bottom: -3px;
	height: 5px;
	border: 1px solid currentColor;
	border-top: none;
	border-radius: 0 0 6px 6px;
}

.suggestion-row {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 8px 10px;
	border-radius: 6px;
	cursor: pointer;
	color: var(--color-primary-text);
	min-height: 36px;
}

.suggestion-row.highlighted {
	background-color: color-mix(in srgb, var(--color-tertiary-background), transparent 55%);
}

.row-icon {
	font-size: 18px;
	width: 18px;
	height: 18px;
	flex-shrink: 0;
	color: var(--color-tertiary-text);
}

.suggestion-row.action .row-icon {
	color: var(--color-secondary-text);
}

.row-primary {
	flex: 1;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.row-primary :deep(.match) {
	font-family: Satoshi-Bold;
	color: var(--color-primary-text);
}

.row-action-text {
	color: var(--color-secondary-text);
}

.row-secondary {
	flex-shrink: 1;
	max-width: 40%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 0.8rem;
	color: var(--color-tertiary-text);
}

/* Per-entry delete, revealed on row hover; no transition, matching the rows */
.row-delete {
	flex-shrink: 0;
	font-size: 16px;
	padding: 4px;
	cursor: pointer;
	color: var(--color-tertiary-text);
	opacity: 0;
}

.suggestion-row:hover .row-delete {
	opacity: 1;
}

.row-delete:hover {
	color: var(--color-primary-text);
}

.popover-enter-active,
.popover-leave-active {
	transition: opacity 150ms ease, transform 150ms ease;
}

.popover-enter-from,
.popover-leave-to {
	opacity: 0;
	transform: translate(-50%, -50%) scale(0.97);
}
</style>
