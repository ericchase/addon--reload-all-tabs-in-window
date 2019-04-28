'use strict'

console.log('context-menu.js')

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
//
// menus.ContextType
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/menus/ContextType
// The different contexts a menu item can appear in.
//
browser.menus.create(
  {
    id: 'skip-tab',
    title: 'Toggle tab skipping.',
    contexts: ['browser_action'],
  },
  on_create,
)

browser.menus.onClicked.addListener((info, tab) => {
  if (info.menuItemId == 'skip-tab') {
    console.log('Item ' + info.menuItemId + ' clicked ' + 'in tab ' + tab.id)
  }
})

function on_create() {
  if (browser.runtime.lastError != null) {
    console.log('[context-menu.on_create] error:', browser.runtime.lastError)
  } else {
    console.log('[context-menu.on_create] success')
  }
}

function skip_current_tab() {
  console.log('this does nothing, yet')
}
