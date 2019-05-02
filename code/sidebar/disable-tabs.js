'use strict'

console.log( 'loaded: disabled-tabs.js' )

// a reference to the background scripts' context for the extension
let background_script = null

// browser.runtime
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime
// This module provides information about your extension and the environment it's running in.
//
// runtime.getBackgroundPage()
// Retrieves the Window object for the background page running inside the current extension.
//
browser.runtime.getBackgroundPage().then( background => {
  background_script = background
  populate_list()
} )

// browser.windows
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows
// Interact with browser windows. You can use this API to get information about open windows and
// to open, modify, and close windows. You can also listen for window open, close, and activate events.
//
// windows.getCurrent
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/getCurrent
// Gets the current browser window, passing its details into a callback.
//
// Return Value
// A Promise that will be fulfilled with a windows.Window object containing the details of the window.
// If any error occurs, the promise will be rejected with an error message.
//
// getInfo: object
// {
//   populate: boolean -> If true, the windows.Window object will have a tabs property that contains
//                        a list of tabs.Tab objects representing the tabs in the window. The Tab objects
//                        only contain the url, title and favIconUrl properties if the extension's
//                        manifest file includes the "tabs" permission.
// }
function populate_list() {
  browser.windows
    .getCurrent( {populate: true} )
    .then( fill_content )
    .catch( err => console.log( '[disable-tabs.apply_tablist] error:', err ) )
}

// a reference to the base element where all the tab items will be displayed
let gridbox = document.querySelector( '#gridbox' )

// window: windows.Window -> Information about a browser window.
function fill_content( window ) {
  normalize_item_count( window.tabs )
  //
  // childNodes
  // https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes
  // The Node.childNodes read-only property returns a live NodeList of child nodes of the given
  // element where the first child node is assigned index 0.
  //
  update_list( gridbox.childNodes, window.tabs )
}

// tabs: array -> Array of tabs.Tab objects representing the current tabs in the window.
function normalize_item_count( tabs ) {
  //
  // Node.appendChild()
  // Adds the specified childNode argument as the last child to the current node. If the
  // argument referenced an existing node on the DOM tree, the node will be detached from
  // its current position and attached at the new position.
  //
  // Node.removeChild()
  // Removes a child node from the current element, which must be a child of the current node.
  //
  while (gridbox.childNodes.length < tabs.length) {
    gridbox.appendChild( new_list_item() )
  }
  while (gridbox.childNodes.length > tabs.length) {
    gridbox.removeChild( gridbox.childNodes[gridbox.childNodes.length - 1] )
  }
}

function new_list_item() {
  //
  // Document​.create​Element()
  // creates the HTML element specified by tagName
  let item = document.createElement( 'div' )
  
  //
  // Element.classList
  // Returns a DOMTokenList containing the list of class attributes.
  //
  // add( String [, String [, ...]] )
  // Adds the specified class values. If these classes already exist in the element's class
  // attribute they are ignored.
  //
  item.classList.add( 'flexbox' )
  
  //
  // Element.innerHTML
  // Is a DOMString representing the markup of the element's content.
  //
  item.innerHTML = `<div class='checkbox'></div><div class='favicon'><img src='' alt=''/></div><div class='title'></div>`
  
  return item
}

let checkbox_list = []

// list: node -> The DOM node representing the list of tab items.
// tabs: array -> The array of Tab containing information of the tabs of the window.
function update_list( list, tabs ) {
  checkbox_list = []
  for (let i = 0; i < list.length; i++) {
    update_list_item( list[i], tabs[i] )
  }
}

// item: Node -> The DOM node representing an individual tab item.
// tab: Tab -> Information of a Tab of the window.
function update_list_item( item, tab ) {
  item.id = tab.id
  //
  // Element.click
  // The onclick property of the GlobalEventHandlers mixin is the EventHandler for processing
  // click events on a given element.
  item.onclick = handle_item_onclick
  // set up clicks for checkboxes
  checkbox_list.push( item.childNodes[0] )
  item.childNodes[0].onclick = handle_checkbox_onclick // checkbox
  //item.childNodes[1].onclick = handle_item_onclick
  //item.childNodes[1].childNodes[0].onclick = handle_item_onclick
  //item.childNodes[2].onclick = handle_item_onclick
  //
  if (background_script.is_ignored( tab.id )) item.childNodes[0].classList.add( 'checked' )
  //
  if (tab.favIconUrl === undefined) {
    item.childNodes[1].childNodes[0].style = 'display: none'
    item.childNodes[1].childNodes[0].src = ''
  } else {
    item.childNodes[1].childNodes[0].style = ''
    item.childNodes[1].childNodes[0].src = tab.favIconUrl
  }
  //
  // Node.textContent
  // Returns / Sets the textual content of an element and all its descendants.
  //
  item.childNodes[2].textContent = tab.title
}

function handle_item_onclick( event ) {
  event.stopPropagation()
  browser.tabs.update( parseInt( event.currentTarget.id, 10 ), {active: true} )
}

// The parseInt() function parses a string argument and returns an integer of the specified
// radix (the base in mathematical numeral systems).
function handle_checkbox_onclick( event ) {
  event.stopPropagation()
  toggle_checkbox( event.target.classList, parseInt( event.target.parentNode.id, 10 ) )
}

function toggle_checkbox( classList, tabId ) {
  if (classList.toggle( 'checked' )) {
    background_script.ignore_list_add( tabId )
  } else {
    background_script.ignore_list_remove( tabId )
  }
}

// click events for the buttons that apply options to all tab items at once
document.querySelector( '#reset' ).onclick = function () {
  checkbox_list.forEach( checkbox => {
    checkbox.classList.remove( 'checked' )
    background_script.ignore_list_remove( parseInt( checkbox.parentNode.id, 10 ) )
  } )
}

document.querySelector( '#skip-all' ).onclick = function () {
  checkbox_list.forEach( checkbox => {
    checkbox.classList.add( 'checked' )
    background_script.ignore_list_add( parseInt( checkbox.parentNode.id, 10 ) )
  } )
}

// Tab Events
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs#Events
// Refresh the sidebar when tabs change within the window.
browser.tabs.onAttached.addListener( refresh_sidebar )
browser.tabs.onDetached.addListener( refresh_sidebar )
browser.tabs.onCreated.addListener( refresh_sidebar )
browser.tabs.onRemoved.addListener( refresh_sidebar )
browser.tabs.onReplaced.addListener( refresh_sidebar )
browser.tabs.onMoved.addListener( refresh_sidebar )
browser.tabs.onUpdated.addListener( refresh_sidebar )

function refresh_sidebar() {
  populate_list()
}
