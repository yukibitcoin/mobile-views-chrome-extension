// Initialize the extension
chrome.runtime.onInstalled.addListener(() => {
  // Set default user agent to desktop (empty string)
  chrome.storage.sync.get(['userAgent'], (result) => {
    if (!result.userAgent) {
      chrome.storage.sync.set({ userAgent: '' });
    }
  });
  
  // Initialize rules
  updateRules();
});

// Listen for changes to the user agent setting
chrome.storage.onChanged.addListener((changes) => {
  if (changes.userAgent || changes.websiteRules) {
    updateRules();
  }
});

// Function to update the declarativeNetRequest rules
function updateRules() {
  chrome.storage.sync.get(['userAgent', 'websiteRules'], (result) => {
    const globalUserAgent = result.userAgent || '';
    const websiteRules = result.websiteRules || {};
    
    // Start with an empty array of rules
    const rules = [];
    let ruleId = 1;
    
    // Add website-specific rules first (higher priority)
    for (const domain in websiteRules) {
      const rule = websiteRules[domain];
      const userAgent = rule.userAgent;
      
      if (userAgent) {
        rules.push({
          id: ruleId++,
          priority: 100, // Higher priority than global rule
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
            urlFilter: `*://*.${domain}/*`,
            resourceTypes: ['main_frame', 'sub_frame', 'stylesheet', 'script', 'image', 'font', 'object', 'xmlhttprequest', 'ping', 'csp_report', 'media', 'websocket', 'other']
          }
        });
        
        // Also match the domain without subdomain
        rules.push({
          id: ruleId++,
          priority: 100,
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
            urlFilter: `*://${domain}/*`,
            resourceTypes: ['main_frame', 'sub_frame', 'stylesheet', 'script', 'image', 'font', 'object', 'xmlhttprequest', 'ping', 'csp_report', 'media', 'websocket', 'other']
          }
        });
      }
    }
    
    // Add global rule if set (lower priority)
    if (globalUserAgent) {
      rules.push({
        id: ruleId++,
        priority: 1, // Lower priority than website-specific rules
        action: {
          type: 'modifyHeaders',
          requestHeaders: [
            {
              header: 'User-Agent',
              operation: 'set',
              value: globalUserAgent
            }
          ]
        },
        condition: {
          urlFilter: '*',
          resourceTypes: ['main_frame', 'sub_frame', 'stylesheet', 'script', 'image', 'font', 'object', 'xmlhttprequest', 'ping', 'csp_report', 'media', 'websocket', 'other']
        }
      });
    }
    
    // Get all existing rule IDs to remove them
    chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
      const existingRuleIds = existingRules.map(rule => rule.id);
      
      // Update the rules
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: existingRuleIds,
        addRules: rules
      }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error updating rules:', chrome.runtime.lastError);
        } else {
          console.log('Rules updated successfully:', rules);
        }
      });
    });
  });
}
