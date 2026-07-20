export function formatEpochTime(epochMs, is12h) {
    if (!epochMs) return "";

    return new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
        hour12: is12h,
    }).format(new Date(epochMs));
};
