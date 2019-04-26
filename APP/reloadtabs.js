// Background Script: 'reloadtabs.js'

// browser.browser​Action
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/browserAction
// A browser action is a button in the browser's toolbar.
//
// You can associate a popup with the button. The popup is specified using HTML, CSS and JavaScript,
// just like a normal web page. JavaScript running in the popup gets access to all the same
// WebExtension APIs as your background scripts, but its global context is the popup, not the current
// page displayed in the browser. To affect web pages you need to communicate with them via messages.
//
// If you specify a popup, it will be shown — and the content will be loaded — when the user clicks
// the icon. If you do not specify a popup, then when the user clicks the icon an event is dispatched
// to your extension.
//
// With the browserAction API, you can:
// - use browserAction.onClicked to listen for clicks on the icon.
// - get and set the icon's properties — icon, title, popup, and so on. You can get and set these
//   globally across all tabs, or for a specific tab by passing the tab ID as an additional argument.
//
//
// browserAction.onClicked
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/browserAction/onClicked
// Fired when a browser action icon is clicked.
// This event will not fire if the browser action has a popup.
//
//
// onClicked.addListener(callback)
// Adds a listener to the onClicked event.
//
browser.browserAction.onClicked.addListener(
  //
  // callback
  // Function that will be called when this event occurs.
  //
  // The function will be passed the following arguments:
  //  tab: The tab that was active when the icon was clicked.
  //
  function(tab) {
    //
    // tabs.query
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/query
    // Gets all tabs that have the specified properties, or all tabs if no properties are specified.
    //
    // Return value:
    // A Promise that will be fulfilled with an array of tabs.Tab objects, containing
    // infomation about each matching tab. If any error occurs, the promise will be rejected
    // with an error message.
    //
    // windowId
    // The ID of the parent window, or windows.WINDOW_ID_CURRENT for the current window.
    //
    browser.tabs
      .query({ windowId: tab.windowId })
      .then(handle_browser_action)
      .catch(err => {
        console.log('[Reload All Tabs in Window] error:', err)
      })
  },
)

function handle_browser_action(tab_list) {
  // filter any disabled tabs
  reload_each_tab_in_list(tab_list)
}

function reload_each_tab_in_list(tab_list) {
  for (let tab of tab_list) {
    browser.tabs.reload(tab.id)
  }
}
