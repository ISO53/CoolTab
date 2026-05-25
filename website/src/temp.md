# Initial Load Test
> Test Command: performance.timing.loadEventEnd - performance.timing.navigationStart
- Brave Default New Tab: 178.5 ms
- Chrome Default New Tab: 292.1 ms 
- Firefox Default New Tab: 212.4 ms
- CoolTab Default New Tab: 144.1 ms

# Memory Test
> Test Command: Memory tab on dev tools > Memory Snapshot
- Brave Default New Tab: 9421 kb
- Chrome Default New Tab: 11450 kb
- Firefox Default New Tab: 10050 kb
- CoolTab Default New Tab: 5550 kb

# Largest Contentful Paint
> Test Command: performance.getEntriesByName('first-contentful-paint')[0]?.startTime;
- Brave Default New Tab: 324.4 ms
- Chrome Default New Tab: 310.4 ms
- Firefox Default New Tab: 236.8 ms
- CoolTab Default New Tab: 170 ms
