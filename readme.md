# Simple Mobile View Switcher

A Chrome extension that allows you to easily switch between different User-Agent strings to view websites as they would appear on different devices.

## Features

- Switch between Android, iOS, and Desktop user agents
- Add custom user agent strings
- **Website-specific settings** - Set different User-Agents for specific websites
- Simple and lightweight interface
- Changes apply immediately to all tabs

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the folder containing the extension files
5. The extension icon should appear in your browser toolbar

## Usage

### Global Settings
1. Click on the extension icon in your browser toolbar
2. Select the desired device type (Android, iOS, or Desktop)
3. Alternatively, enter a custom User-Agent string
4. Click "Save Global Setting" to apply the changes

### Website-Specific Settings
1. Scroll down to the "Website-Specific Settings" section
2. Enter a domain (e.g., "youtube.com") without "http://" or "www."
3. Select which User-Agent to use for that specific website
4. For custom User-Agents, select "Custom" and enter your string
5. Click "Add Rule" to save the website rule
6. To remove a rule, click the "Delete" button next to it

For example, you can set iOS as your global User-Agent, but specify that youtube.com should use Desktop User-Agent instead.

## Files

- `manifest.json`: Extension configuration
- `options.html`: UI for selecting user agent
- `options.js`: Handles UI interactions and saving settings
- `background.js`: Manages the User-Agent modification
- `rules.json`: Declarative rules for network requests
- `options.css`: Styles for the options page

## License

MIT
