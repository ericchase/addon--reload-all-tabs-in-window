// Delay Option
const delayLabel = document.createElement('label');
const delayInput = document.createElement('input');
delayInput.classList.add('option-delay');
delayInput.type = 'text';
delayInput.placeholder = '0';
delayLabel.append(
  document.createTextNode('Delay between each tab reload: '), //
  delayInput,
  document.createTextNode(' ms.'),
);

// Show Page Context Menu Option
const showPageContextMenuItemLabel = document.createElement('label');
const showPageContextMenuItemInput = document.createElement('input');
showPageContextMenuItemInput.type = 'checkbox';
showPageContextMenuItemLabel.append(
  showPageContextMenuItemInput, //
  document.createTextNode(' Show "Reload All Tabs (in Window)" in page context menu.'),
);

// Save Button and Status Indicator
const saveButton = document.createElement('button');
saveButton.textContent = 'Save';
const statusSpan = document.createElement('span');

document.body.append(
  delayLabel, //
  document.createElement('br'),
  document.createElement('br'),
  showPageContextMenuItemLabel,
  document.createElement('br'),
  document.createElement('br'),
  saveButton,
  document.createTextNode(' '),
  statusSpan,
);

const saveOptions = () => {
  if (showPageContextMenuItemInput.checked === true) {
    chrome.contextMenus.create(
      {
        contexts: ['page'],
        id: 'page--reload-all-tabs-in-window',
        title: 'Reload All Tabs (in Window)',
      },
      () => {
        chrome.runtime.lastError; // ignore the errors
      },
    );
  } else {
    chrome.contextMenus.remove('page--reload-all-tabs-in-window', () => {
      chrome.runtime.lastError; // ignore the errors
    });
  }

  chrome.storage.local.set(
    {
      delay: delayInput.value, //
      show_page_context_menu_item: showPageContextMenuItemInput.checked,
    },
    () => {
      statusSpan.textContent = 'Options saved successfully.';
      setTimeout(() => {
        statusSpan.textContent = '';
      }, 1500);
    },
  );
};

const loadOptions = () => {
  chrome.storage.local.get(
    {
      delay: 0, //
      show_page_context_menu_item: true,
    },
    (items) => {
      if (items.delay) {
        delayInput.value = items.delay;
      }
      if (items.show_page_context_menu_item) {
        showPageContextMenuItemInput.checked = items.show_page_context_menu_item;
      }
    },
  );
};

loadOptions();

saveButton.addEventListener('click', saveOptions);
