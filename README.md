## Browser Addon

_Reload all open tabs in current window._

Reloads the tabs in the window where the extension icon is clicked.

Features:

- Options:
  - delay between each tab reload (default: 0)
  - show item in page right-click context menu (default: true)
- Advanced Options:
  - delay between each tab reload chosen random from user defined range

Limitations:

- unknown

Please send feedback, feature requests, and ideas to the GitHub page (https://github.com/ericchase/addon--reload-all-tabs-in-window/issues).

This is a Manifest V3 extension (https://developer.chrome.com/docs/extensions/develop/migrate).

### Chrome

https://chromewebstore.google.com/detail/reload-all-tabs-in-window/fobjljihdlfbamijbmadjkkehmlleaoa

### Firefox

https://addons.mozilla.org/en-US/firefox/addon/reloadalltabs-inwindow/

## Developer Notes

~~The `bun` runtime seems to have some issues with an Archiver dependency (readable-stream?). Because of that, I opt to continue using `node` for running the `build` and `bundle` scripts.~~

I took some inspiration from another dev and switched over to using the 7-Zip software instead of the Archiver package.
