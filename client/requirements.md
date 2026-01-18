## Packages
framer-motion | Smooth entry animations and layout transitions
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility for merging Tailwind classes safely

## Notes
The app interacts with /api/analyze (POST) and /api/scans (GET).
Analysis is synchronous but might take a few seconds, so loading states are critical.
Images from analysis might be external URLs; refer to <implementation_notes> for handling mixed content if needed (usually browser handles basic img src fine).
