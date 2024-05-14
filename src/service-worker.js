// chrome.action.onClicked
// https://developer.chrome.com/docs/extensions/reference/api/action
// Use the chrome.action API to control the extension's icon in the Google
// Chrome toolbar.
//
// The action icons are displayed in the browser toolbar next to the omnibox.
// After installation, these appear in the extensions menu (the puzzle piece
// icon). Users can pin your extension icon to the toolbar.
chrome.action.onClicked.addListener(async (currentTab) => {
  // chrome.tabs.query
  // https://developer.chrome.com/docs/extensions/reference/api/tabs#method-query
  // Gets all tabs that have the specified properties, or all tabs if no
  // properties are specified.
  try {
    for (const tab of await chrome.tabs.query({ windowId: currentTab.windowId })) {
      reloadTab(tab);
    }
  } catch (err) {
    console.log('[chrome.action.onClicked] error:', err);
  }
});

/** @param {chrome.tabs.Tab} tab */
function reloadTab(tab) {
  try {
    if (tab.id !== undefined) {
      chrome.tabs.reload(tab.id);
    }
  } catch (err) {
    console.log('[reloadTab] error:', err);
  }
}
