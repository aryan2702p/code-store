chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension Installed");
  
    chrome.storage.local.get(["snippetsByLanguage"], (result) => {
      if (!result.snippetsByLanguage) {
        chrome.storage.local.set({ snippetsByLanguage: {} });
      }
    });
  });
  