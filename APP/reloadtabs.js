function reloadTabs(tabs) {
  for (let tab of tabs) {
    browser.tabs.reload(tab.id);
  }
}

browser.browserAction.onClicked.addListener(
  function (tab) {
    browser.tabs.query({ windowId: tab.windowId })
      .then(reloadTabs)
      .catch(err => {
        console.log("[Reload All Tabs in Window] error:", err);
      });
  }
);
