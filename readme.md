# Simple Mobile View Switcher
A Chrome extension that allows you to easily switch between different User-Agent strings to view websites as they would appear on different devices.
## Features
- Switch between Android, iOS, and Desktop user agents
- Add custom user agent strings
- Simple and lightweight interface
- Changes apply immediately to all tabs
## Installation
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the folder containing the extension files
5. The extension icon should appear in your browser toolbar
## Usage
1. Click on the extension icon in your browser toolbar
2. Select the desired device type (Android, iOS, or Desktop)
3. Alternatively, enter a custom User-Agent string
4. Click "Save" to apply the changes
5. Refresh any open tabs to see the changes
## Files
- `manifest.json`: Extension configuration
- `options.html`: UI for selecting user agent
- `options.js`: Handles UI interactions and saving settings
- `background.js`: Manages the User-Agent modification
- `rules.json`: Declarative rules for network requests
## License
MIT
