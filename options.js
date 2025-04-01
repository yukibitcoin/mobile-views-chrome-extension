// Load saved user agent when options page opens
document.addEventListener('DOMContentLoaded', () => {
  // Get the radio buttons and custom textarea
  const androidRadio = document.getElementById('android');
  const iosRadio = document.getElementById('ios');
  const desktopRadio = document.getElementById('desktop');
  const customRadio = document.getElementById('custom');
  const customUaTextarea = document.getElementById('custom_ua');
  const saveButton = document.getElementById('save');
  
  // Website-specific elements
  const websiteRulesContainer = document.getElementById('website-rules');
  const websiteUrlInput = document.getElementById('website-url');
  const websiteUaSelect = document.getElementById('website-ua-select');
  const websiteCustomUaContainer = document.getElementById('website-custom-ua-container');
  const websiteCustomUaTextarea = document.getElementById('website-custom-ua');
  const addWebsiteRuleButton = document.getElementById('add-website-rule');
  
  // User agent values
  const userAgentValues = {
    android: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    desktop: ''
  };

  // Load the saved user agent and website rules
  loadSettings();

  // Save button click handler for global setting
  saveButton.addEventListener('click', () => {
    let selectedUserAgent = '';
    
    // Determine which radio is selected
    if (androidRadio.checked) {
      selectedUserAgent = androidRadio.value;
    } else if (iosRadio.checked) {
      selectedUserAgent = iosRadio.value;
    } else if (desktopRadio.checked) {
      selectedUserAgent = '';
    } else if (customRadio.checked) {
      selectedUserAgent = customUaTextarea.value;
      // Save the custom user agent separately
      chrome.storage.sync.set({ customUserAgent: customUaTextarea.value });
    }
    
    // Save the selected user agent
    chrome.storage.sync.set({ userAgent: selectedUserAgent }, () => {
      showStatusMessage('Global settings saved!');
    });
  });

  // Custom radio selection when textarea is focused
  customUaTextarea.addEventListener('focus', () => {
    customRadio.checked = true;
  });

  // Show/hide custom UA textarea based on select value
  websiteUaSelect.addEventListener('change', () => {
    websiteCustomUaContainer.style.display = 
      websiteUaSelect.value === 'custom' ? 'block' : 'none';
  });

  // Add website rule button click handler
  addWebsiteRuleButton.addEventListener('click', () => {
    let domain = websiteUrlInput.value.trim().toLowerCase();
    
    // Validate domain
    if (!domain) {
      showStatusMessage('Please enter a valid domain', true);
      return;
    }
    
    // Clean the domain (remove http://, https://, www.)
    domain = cleanDomain(domain);
    
    // Validate domain after cleaning
    if (!domain) {
      showStatusMessage('Please enter a valid domain', true);
      return;
    }
    
    // Get the selected user agent type
    const uaType = websiteUaSelect.value;
    let userAgent;
    
    if (uaType === 'custom') {
      userAgent = websiteCustomUaTextarea.value.trim();
      if (!userAgent) {
        showStatusMessage('Please enter a custom user agent', true);
        return;
      }
    } else {
      userAgent = userAgentValues[uaType];
    }
    
    // Save the new rule
    chrome.storage.sync.get(['websiteRules'], (result) => {
      const websiteRules = result.websiteRules || {};
      
      // Add or update the rule
      websiteRules[domain] = {
        type: uaType,
        userAgent: userAgent
      };
      
      // Save the updated rules
      chrome.storage.sync.set({ websiteRules }, () => {
        // Clear the inputs
        websiteUrlInput.value = '';
        websiteUaSelect.value = 'android';
        websiteCustomUaTextarea.value = '';
        websiteCustomUaContainer.style.display = 'none';
        
        // Reload the rules display
        loadWebsiteRules();
        
        // Log the updated rules for debugging
        console.log('Website rules updated:', websiteRules);
        
        showStatusMessage('Website rule added!');
        
        // Trigger rule update
        updateRules();
      });
    });
  });

  // Function to load all settings
  function loadSettings() {
    chrome.storage.sync.get(['userAgent', 'customUserAgent', 'websiteRules'], (result) => {
      const userAgent = result.userAgent || '';
      const customUserAgent = result.customUserAgent || '';
      
      // Set the custom user agent textarea
      customUaTextarea.value = customUserAgent;
      
      // Check the appropriate radio button
      if (userAgent === androidRadio.value) {
        androidRadio.checked = true;
      } else if (userAgent === iosRadio.value) {
        iosRadio.checked = true;
      } else if (userAgent === '') {
        desktopRadio.checked = true;
      } else if (userAgent === customUserAgent) {
        customRadio.checked = true;
      }
      
      // Load website rules
      loadWebsiteRules();
    });
  }

  // Function to load and display website rules
  function loadWebsiteRules() {
    chrome.storage.sync.get(['websiteRules'], (result) => {
      const websiteRules = result.websiteRules || {};
      
      // Clear the container
      websiteRulesContainer.innerHTML = '';
      
      // If no rules, show a message
      if (Object.keys(websiteRules).length === 0) {
        websiteRulesContainer.innerHTML = '<p>No website-specific rules added yet.</p>';
        return;
      }
      
      // Add each rule to the container
      for (const domain in websiteRules) {
        const rule = websiteRules[domain];
        const ruleElement = document.createElement('div');
        ruleElement.className = 'website-rule';
        
        // Create rule content
        const ruleContent = document.createElement('div');
        
        const ruleDomain = document.createElement('div');
        ruleDomain.className = 'website-rule-domain';
        ruleDomain.textContent = domain;
        ruleContent.appendChild(ruleDomain);
        
        const ruleUa = document.createElement('div');
        ruleUa.className = 'website-rule-ua';
        ruleUa.textContent = rule.type === 'custom' ? 'Custom: ' + truncateString(rule.userAgent, 50) : rule.type.charAt(0).toUpperCase() + rule.type.slice(1);
        ruleContent.appendChild(ruleUa);
        
        ruleElement.appendChild(ruleContent);
        
        // Create rule actions
        const ruleActions = document.createElement('div');
        ruleActions.className = 'website-rule-actions';
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
          deleteWebsiteRule(domain);
        });
        ruleActions.appendChild(deleteButton);
        
        ruleElement.appendChild(ruleActions);
        
        websiteRulesContainer.appendChild(ruleElement);
      }
    });
  }

  // Function to delete a website rule
  function deleteWebsiteRule(domain) {
    chrome.storage.sync.get(['websiteRules'], (result) => {
      const websiteRules = result.websiteRules || {};
      
      // Delete the rule
      delete websiteRules[domain];
      
      // Save the updated rules
      chrome.storage.sync.set({ websiteRules }, () => {
        // Reload the rules display
        loadWebsiteRules();
        
        // Log the updated rules for debugging
        console.log('Website rule deleted. Updated rules:', websiteRules);
        
        showStatusMessage('Website rule deleted!');
        
        // Trigger rule update
        updateRules();
      });
    });
  }

  // Helper function to clean domain
  function cleanDomain(domain) {
    // Remove protocol (http://, https://)
    domain = domain.replace(/^(https?:\/\/)/i, '');
    
    // Remove www.
    domain = domain.replace(/^www\./i, '');
    
    // Remove any paths or query parameters
    domain = domain.split('/')[0].split('?')[0].split('#')[0];
    
    // Remove trailing dots
    domain = domain.replace(/\.$/, '');
    
    // Trim whitespace
    domain = domain.trim();
    
    console.log(`Cleaned domain: "${domain}"`);
    
    return domain;
  }

  // Helper function to show status message
  function showStatusMessage(message, isError = false) {
    const status = document.createElement('div');
    status.textContent = message;
    status.style.color = isError ? 'red' : 'green';
    status.style.marginTop = '10px';
    document.body.appendChild(status);
    
    // Remove the message after 2 seconds
    setTimeout(() => {
      document.body.removeChild(status);
    }, 2000);
  }

  // Helper function to truncate long strings
  function truncateString(str, maxLength) {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + '...';
  }
  
  // Helper function to trigger rule update in background script
  function updateRules() {
    // This will trigger the storage.onChanged listener in the background script
    chrome.runtime.sendMessage({ action: 'updateRules' });
  }
});
