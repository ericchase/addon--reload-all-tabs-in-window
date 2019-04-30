'use strict'

console.log('loaded: context-menu.js')

// browser.menus
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/menus
// Add items to the browser's menu system.
//
// To use this API you need to have the menus permission. You may also use the contextMenus alias
// instead of menus, but if you do, the APIs must be accessed as browser.contextMenus instead.
//
// Other than menus.getTargetElement(), this API cannot be used from content scripts, but from
// background page.
//
// To create a menu item call the menus.create() method. You pass this method an object containing
// options for the item, including the item ID, item type, and the contexts in which it should be
// shown.
//
// Listen for clicks on your menu item by adding a listener to the menus.onClicked event. This
// listener will be passed a menus.OnClickData object containing the event's details.
//
//
// menus.create
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/menus/create
// Creates a new menu item, given an options object defining properties for the item.
//
// createProperties: object -> Properties for the new menu item.
// {
//   contexts: array -> Array of contexts in which this menu item will appear
//   https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/menus/ContextType
//
//   id: string -> The unique ID to assign to this item. Mandatory for event pages.
//                 Cannot be the same as another ID for this extension.
//
//   title: string -> The text to be displayed in the item. Mandatory unless type is "separator".
// }
browser.menus.create(
  {
    id: 'tab-skip-page',
    title: '"Skip Tabs" Sidebar',
    contexts: ['browser_action'],
  },
  on_create,
)

// browser.runtime
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime
// This module provides information about your extension and the environment it's running in.
//
// It also provides messaging APIs enabling you to:
// - Communicate between different parts of your extension.
// - Communicate with other extensions.
// - Communicate with native applications.
//
// runtime.lastError
// This value is set when an asynchronous function has an error condition that it needs to report
// to its caller. If lastError has not been set, the value is null.
//
function on_create() {
  if (browser.runtime.lastError != null) {
    console.log('[context-menu@on_create] error:', browser.runtime.lastError)
  }
}

// menus.onClicked
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/menus/onClicked
// Fired when a menu item is clicked.
//
// callback: function -> Function that will be called when this event occurs.
// (
//   info: menus.OnClickData -> Information about the item clicked and the context where the
//                              click happened.
//
//   tab: tabs.Tab -> The details of the tab where the click took place. If the click did not
//                    take place in or on a tab, this parameter will be missing.
// )
browser.menus.onClicked.addListener((info, _) => {
  if (info.menuItemId == 'tab-skip-page') {
    //
    // browser.sidebarAction
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/sidebarAction
    // Gets and sets properties of an extension's sidebar.
    //
    // sidebarAction.open()
    // Opens the sidebar.
    browser.sidebarAction.open()
  }
})
