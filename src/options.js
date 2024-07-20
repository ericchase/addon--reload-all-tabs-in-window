import { loadOptions, options } from './options.lib.js';

async function init() {
  await loadOptions();
  initContextMenus();

  // Delete Children
  document.body.replaceChildren();

  // Delay Option
  const delay_input = newNumberOptionInput(options.delay, 0);
  document.body.append(
    newOptionDiv([
      newOptionLabel([
        document.createTextNode('Delay between each tab reload: '), //
        delay_input,
        document.createTextNode('ms'),
      ]),
    ]),
  );

  // Show Page Context Menu Option
  const show_page_context_menu_item_input = newCheckboxOptionInput(options.show_page_context_menu_item);
  document.body.append(
    document.createElement('br'),
    newOptionDiv([
      newOptionLabel([
        show_page_context_menu_item_input, //
        document.createTextNode(' Show "Reload All Tabs (in Window)" in page right-click context menu.'),
      ]),
    ]),
  );

  // Use Advanced Options Option
  const use_advanced_options_input = newCheckboxOptionInput(options.use_advanced_options);
  document.body.append(
    document.createElement('br'),
    newOptionDiv([
      newOptionLabel([
        use_advanced_options_input, //
        document.createTextNode(' Use advanced options.'),
      ]),
    ]),
  );

  const advancedOptionsContainer = document.createElement('div');
  function updateAdvancedOptionsContainer() {
    console.log('options.use_advanced_options:', options.use_advanced_options);
    if (options.use_advanced_options === true) {
      advancedOptionsContainer.style.removeProperty('display');
    } else {
      advancedOptionsContainer.style.setProperty('display', 'none');
    }
  }
  updateAdvancedOptionsContainer();
  document.body.append(advancedOptionsContainer);

  // Advanced Options //
  //                                                                        //
  advancedOptionsContainer.append(
    document.createElement('br'),
    document.createTextNode('Advanced Options'), //
    document.createElement('br'),
  );

  // Delay Range Option
  const advanced_delay_range_start_input = newNumberOptionInput(options.advanced_delay_range_start, 0);
  const advanced_delay_range_end_input = newNumberOptionInput(options.advanced_delay_range_end, 0);
  advancedOptionsContainer.append(
    document.createElement('br'),
    newOptionDiv([
      newOptionLabel([
        document.createTextNode('Delay between each tab reload, chosen randomly from range: '), //
        document.createTextNode('['),
        advanced_delay_range_start_input,
        document.createTextNode(','),
        advanced_delay_range_end_input,
        document.createTextNode('] ms'),
      ]),
    ]),
  );
  //                                                                        //

  // Save Button and Status Indicator
  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save';
  const statusSpan = document.createElement('span');
  statusSpan.id = 'save-status';

  document.body.append(
    document.createElement('br'),
    saveButton, //
    document.createTextNode(' '),
    statusSpan,
  );

  // Save Options
  const saveOptions = () => {
    options.delay = Number.parseInt(delay_input.value) || 0;
    options.show_page_context_menu_item = show_page_context_menu_item_input.checked;
    // advanced options
    options.use_advanced_options = use_advanced_options_input.checked;
    options.advanced_delay_range_start = toInt(advanced_delay_range_start_input);
    options.advanced_delay_range_end = toInt(advanced_delay_range_end_input);

    chrome.storage.local.set(options, async () => {
      updateAdvancedOptionsContainer();
      if (chrome.runtime.lastError) {
        statusSpan.textContent = 'Error! ' + chrome.runtime.lastError;
      } else {
        statusSpan.textContent = 'Options saved successfully.';
        initContextMenus();
        setTimeout(() => {
          statusSpan.textContent = '';
        }, 1500);
      }
    });
  };

  saveButton.addEventListener('click', saveOptions);
}

function initContextMenus() {
  if (options.show_page_context_menu_item === true) {
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
}

init();

/** @param {Node[]} children */
function newOptionDiv(children) {
  const div = document.createElement('div');
  div.classList.add('option');
  div.append(...children);
  return div;
}
/** @param {Node[]} children */
function newOptionLabel(children) {
  const label = document.createElement('label');
  label.append(...children);
  return label;
}
/**
 * @param {number} value
 * @param {number} default_value
 */
function newNumberOptionInput(value, default_value) {
  const input = document.createElement('input');
  input.classList.add('option-number');
  input.type = 'text';
  input.placeholder = default_value.toString(10);
  if (value !== default_value) {
    input.value = value.toString(10);
  }
  return input;
}
/** @param {boolean} value */
function newCheckboxOptionInput(value) {
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = value;
  return input;
}

/** @param {HTMLInputElement} input */
function toInt(input) {
  return Number.parseInt(input.value) || 0;
}
