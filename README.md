# Simple Mobile View Switcher

A Chrome extension that allows you to easily switch between different User-Agent strings to view websites as they would appear on different devices.

## Features

- Switch between Android, iOS, and Desktop user agents
- Add custom user agent strings
- Set website-specific User-Agent settings
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
5. Refresh any open tabs to see the changes

### Website-specific Settings

1. Click on the extension icon in your browser toolbar
2. Scroll down to the "Website-Specific Settings" section
3. Enter a domain name (e.g., "google.com" or "youtube.com")
   - Do not include "http://", "www.", or any paths
4. Select which User-Agent to use for that specific website
5. Click "Add Rule" to save the website-specific setting
6. Refresh any open tabs to see the changes

For example, you can set iOS as your global User-Agent, but specify that youtube.com should use Desktop User-Agent instead.

## Files

- `manifest.json`: Extension configuration
- `options.html`: UI for selecting user agent
- `options.js`: Handles UI interactions and saving settings
- `background.js`: Manages the User-Agent modification
- `rules.json`: Declarative rules for network requests
- `options.css`: Styles for the options page
- `icon.svg`: Extension icon

## Troubleshooting

If website-specific rules aren't working:

1. Make sure you've entered just the domain name (e.g., "google.com") without "http://", "www.", or any paths
2. Check that you've saved the rule by clicking "Add Rule"
3. Refresh the website to apply the new User-Agent
4. Clear browser cache if needed
5. Try opening the browser console (F12 > Console tab) to see debugging information
6. For domains like "google.com", make sure there are no trailing slashes or other characters
7. If still not working, try removing and re-adding the rule

## How It Works

The extension uses Chrome's declarativeNetRequest API to modify the User-Agent header for outgoing requests. For website-specific rules, it creates multiple URL patterns to match different variations of the domain (with and without www, with and without paths).

Website-specific rules have higher priority than the global setting, so they will override the global User-Agent when you visit matching domains.

## Debugging

To see what's happening behind the scenes:

1. Open Chrome DevTools (F12 or right-click > Inspect)
2. Go to the Console tab
3. Look for log messages from the extension showing which rules are being applied
4. You can also check the Network tab to verify the User-Agent being sent with requests

## License

MIT