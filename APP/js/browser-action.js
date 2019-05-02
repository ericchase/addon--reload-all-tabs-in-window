'use strict'

console.log( 'loaded: browser-action.js' )

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
// callback: Function -> Called when this event occurs.
browser.browserAction.onClicked.addListener(
  //
  // tab: tabs.Tab -> The Tab that was active when the icon was clicked.
  function ( tab ) {
    //
    // tabs.query
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/query
    // Gets all tabs that have the specified properties, or all tabs if no properties are specified.
    //
    // Return value:
    // A Promise that will be fulfilled with an array of tabs.Tab objects, containing
    // information about each matching tab. If any error occurs, the promise will be rejected
    // with an error message.
    //
    // queryInfo: Object -> The properties that a tab must match to be included in the resulting list.
    // {
    //   windowId: integer -> The ID of the parent window, or windows.WINDOW_ID_CURRENT for the current window.
    // }
    browser.tabs
      .query( {windowId: tab.windowId} )
      .then( reload_each_tab_in_list )
      .catch( err => {
        console.log( '[browser-action.js@tabs.query] error:', err )
      } )
  },
)

// tabList: Array
function reload_each_tab_in_list( tabList ) {
  tabList.filter( tabs_to_reload ).forEach( reload )
}

// tabId: integer
let tabs_to_reload = function ( tab ) {
  //
  // tab.id: integer -> The tab's ID. Tab IDs are unique within a browser session.
  return !ignore_list.has( tab.id )
}

// tab: Tab
let reload = function ( tab ) {
  //
  // browser.tabs.reload
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/reload
  // Reload a tab, optionally bypassing the local web cache.
  //
  // tab.id: integer -> The ID of the tab to reload.
  browser.tabs.reload( tab.id )
  console.log( '[browser-action.js] info: reloaded tab', tab.id )
}

// Set of tab ids to be ignored when reloading tabs in window.
let ignore_list = new Set()

// tabId: integer
function ignore_list_add( tabId ) {
  if (!ignore_list.has( tabId )) {
    ignore_list.add( tabId )
    //
    // sessions​.set​TabValue
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/sessions/setTabValue
    // Stores a key/value pair to associate with a given tab. You can subsequently retrieve this
    // value using sessions.getTabValue.
    //
    browser.sessions.setTabValue( tabId, 'ignored', true )
    console.log( '[browser-action.js] info: ignore list: added tab', tabId )
  }
}

// tabId: integer
function ignore_list_remove( tabId ) {
  if (ignore_list.has( tabId )) {
    ignore_list.delete( tabId )
    //
    // sessions​.remove​TabValue
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/sessions/removeTabValue
    // Removes a value previously stored by a call to sessions.setTabValue.
    //
    browser.sessions.removeTabValue( tabId, 'ignored' )
    console.log( '[browser-action.js] info: ignore list: removed tab', tabId )
  }
}

// tabId: integer
function is_ignored( tabId ) {
  return ignore_list.has( tabId )
}

// windows.getAll
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/getAll
// Gets information about all open windows, passing them into a callback.
//
// browser.sessions
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/sessions
// Use the sessions API to list, and restore, tabs and windows that have been closed while the browser has been running.
//
// restore ignored tab ids for the current session
browser.windows.getAll( {populate: true} ).then( windowList => {
  windowList.forEach( window => {
    window.tabs.forEach( tab => {
      //
      // sessions​.get​TabValue
      // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/sessions/getTabValue
      // Retrieves a value previously stored by a call to sessions.setTabValue.
      //
      browser.sessions.getTabValue( tab.id, 'ignored' ).then( value => {
        if (value === true) ignore_list_add( tab.id )
      } )
    } )
  } )
} )
