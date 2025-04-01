// Load saved user agent when options page opens
document.addEventListener('DOMContentLoaded', () => {
  // Get the radio buttons and custom textarea
  const androidRadio = document.getElementById('android');
  const iosRadio = document.getElementById('ios');
  const desktopRadio = document.getElementById('desktop');
  const customRadio = document.getElementById('custom');
  const customUaTextarea = document.getElementById('custom_ua');
  const saveButton = document.getElementById('save');
  // Load the saved user agent
  chrome.storage.sync.get(['userAgent', 'customUserAgent'], (result) => {
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
  });
  // Save button click handler
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
      // Show a brief "Saved" message
      const status = document.createElement('div');
      status.textContent = 'Settings saved!';
      status.style.color = 'green';
      status.style.marginTop = '10px';
      document.body.appendChild(status);
      
      // Remove the message after 2 seconds
      setTimeout(() => {
        document.body.removeChild(status);
      }, 2000);
    });
  });
  // Custom radio selection when textarea is focused
  customUaTextarea.addEventListener('focus', () => {
    customRadio.checked = true;
  });
});
