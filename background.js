// Initialize the extension
chrome.runtime.onInstalled.addListener(() => {
  // Set default user agent to desktop (empty string)
  chrome.storage.sync.get(['userAgent'], (result) => {
    if (!result.userAgent) {
      chrome.storage.sync.set({ userAgent: '' });
    }
  });
  
  // Initialize rules
  updateRules('');
});
// Listen for changes to the user agent setting
chrome.storage.onChanged.addListener((changes) => {
  if (changes.userAgent) {
    updateRules(changes.userAgent.newValue);
  }
});
// Function to update the declarativeNetRequest rules
function updateRules(userAgent) {
  if (!userAgent) {
    // If empty (desktop), remove any existing rules
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1]
    });
    return;
  }
  // Create a rule to modify the User-Agent header
  const rule = {
    id: 1,
    priority: 1,
    action: {
      type: 'modifyHeaders',
      requestHeaders: [
        {
          header: 'User-Agent',
          operation: 'set',
          value: userAgent
        }
      ]
    },
    condition: {
      urlFilter: '*',
      resourceTypes: ['main_frame', 'sub_frame', 'stylesheet', 'script', 'image', 'font', 'object', 'xmlhttprequest', 'ping', 'csp_report', 'media', 'websocket', 'other']
    }
  };
  // Update the rules
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1],
    addRules: [rule]
  });
}
