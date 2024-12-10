//  Script - 3: Tabs section
//=======================================================================================

// array to store tabs and content
let tabs = [];
let currentTabIndex = 0;

// save tabs to storage
function saveTabsToLocalStorage() {
    localStorage.setItem('tabs', JSON.stringify(tabs));
    localStorage.setItem('currentTabIndex', currentTabIndex);
}

// load stored tabs to editor
function loadTabsFromLocalStorage() {
    const savedTabs = JSON.parse(localStorage.getItem('tabs'));
    const savedCurrentTabIndex = localStorage.getItem('currentTabIndex');

    if (savedTabs && Array.isArray(savedTabs) && savedTabs.length > 0) {
        tabs = savedTabs;
        currentTabIndex = savedCurrentTabIndex ? parseInt(savedCurrentTabIndex, 10) : 0;
        currentTabIndex = Math.min(currentTabIndex, tabs.length - 1);

        const tabContainer = document.getElementById('tabs');
        tabContainer.innerHTML = '';

        tabs.forEach((tabData, index) => {
            createTabElement(tabData.name, index);
            updateTabTitle(index);
        });
        switchTab(currentTabIndex);
    } else {
        createTab("untitled", "");
    }
}

// create new tab
function createTab(name = "untitled", content = "", index = tabs.length) {
    tabs.push({ name, content });
    createTabElement(name, index);
    switchTab(index);
    saveTabsToLocalStorage();
}

//create tab element
function createTabElement(name, index) {
    const tabContainer = document.getElementById('tabs');

    const tab = document.createElement('div');
    tab.className = 'tab';
    tab.textContent = name;
    tab.dataset.index = index;
    tab.onclick = () => switchTab(index);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'x';
    closeButton.title = 'close';
    closeButton.onclick = (e) => {
        e.stopPropagation();
        closeTab(index);
    };

    tab.appendChild(closeButton);
    tabContainer.appendChild(tab);
}

// scroll tabs with mouse wheel
const tabsContainer = document.getElementById('tabs');
tabsContainer.addEventListener('wheel', function (event) {
    event.preventDefault();
    tabsContainer.scrollLeft += event.deltaY;
});

//load last active tab and content on window load
function loadLastActiveTab() {
    if (tabs.length > 1) {
        const index = tabs.length - 1;
        const tabToRemove = document.querySelector(`.tab[data-index="${index}"]`);
        if (tabToRemove) {
            tabs.splice(index, 1);
            tabToRemove.parentNode.removeChild(tabToRemove);
        }

        currentTabIndex = tabs.length - 1;
        updateTabs();
        saveTabsToLocalStorage();
        document.getElementById("code-field").value = tabs[currentTabIndex].content;
    }
}

// switch tabs
function switchTab(index) {

    if (tabs[currentTabIndex]) {
        tabs[currentTabIndex].content = document.getElementById('code-field').value;
        updateTabTitle(currentTabIndex);
    }

    currentTabIndex = index;
    document.getElementById('code-field').value = tabs[index].content;
    updateTabs();
    updateLineNumbers();
    closeFindReplaceDialogue();
    loadText();
    resetHistory();
    if(splitMode){
        run();        
    }

}

// update tabs
function updateTabs() {
    const tabElements = document.querySelectorAll('.tab');
    tabElements.forEach((tab, index) => {
        tab.classList.toggle('active', index === currentTabIndex);
    });
}

function closeTab(index) {
    tabs[currentTabIndex].content = document.getElementById('code-field').value;

    if (tabs.length <= 1) {
        showAlert("The last tab cannot be deleted.");
        return;
    }

    showConfirm("Do you want to close this tab?").then((confirmed) => {
        if (confirmed) {
            const tabToRemove = document.querySelector(`.tab[data-index="${index}"]`);

            if (tabToRemove) {
                tabs.splice(index, 1);
                tabToRemove.parentNode.removeChild(tabToRemove);

                if (index === currentTabIndex) {
                    currentTabIndex = index >= tabs.length ? tabs.length - 1 : index;
                } else if (index < currentTabIndex) {
                    currentTabIndex--;
                }

                if (tabs[currentTabIndex]) {
                    document.getElementById('code-field').value = tabs[currentTabIndex].content || '';
                }

                switchTab(currentTabIndex);
                saveTabsToLocalStorage();
            }
            loadTabsFromLocalStorage();
        }
    });
}




// close all tabs 
function clearTabs() {
    closeFindReplaceDialogue();
    showConfirm("Do you want to close all tabs and content?").then((confirmed) => {
        if (confirmed) {
            tabs = [];
            const tabElements = document.querySelectorAll('.tab');
            tabElements.forEach(tab => {
                tab.parentNode.removeChild(tab);
            });
            createTab();
        } else {
            return;
        }
    });
}

// update tab titles
function updateTabTitle(index) {
    let firstLine = tabs[index].content.trim().substring(0, 15);
    if (firstLine.length === 0)
        firstLine = "untitled";
    tabs[index].name = firstLine || "untitled";

    const tabElement = document.querySelector(`.tab[data-index="${index}"]`);
    if (tabElement) {
        tabElement.childNodes[0].textContent = firstLine || "untitled";
    }
}

//Update line numbers Function
function updateLineNumbers() {
    updateTabTitle(currentTabIndex);
    const code = document.getElementById("code-field");
    const lineNumbers = document.getElementById("line-numbers");

    const lines = code.value.split("\n").length;
    let lineNumberHTML = '';
    for (let i = 1; i <= lines; i++) {
        lineNumberHTML += `${i}<br/>`;
    }
    lineNumbers.innerHTML = lineNumberHTML;
}

const textarea = document.getElementById('code-field');

let history = [];
let cursorPositions = [];
let historyIndex = -1;
let activeTabIndex = 0;

const saveToHistory = () => {
    const currentValue = textarea.value;
    const currentCursorPos = textarea.selectionStart;

    if (historyIndex === -1 || history[historyIndex] !== currentValue) {
        history = history.slice(0, historyIndex + 1);
        history.push(currentValue);
        cursorPositions = cursorPositions.slice(0, historyIndex + 1);
        cursorPositions.push(currentCursorPos);
        historyIndex++;
        
        localStorage.setItem('textareaHistory', JSON.stringify(history));
        localStorage.setItem('cursorPositions', JSON.stringify(cursorPositions));
    }
};

const undo = () => {
    if (historyIndex > 0) {
        historyIndex--;
        textarea.value = history[historyIndex];
        textarea.setSelectionRange(cursorPositions[historyIndex], cursorPositions[historyIndex]);
    }
};

const redo = () => {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        textarea.value = history[historyIndex];
        textarea.setSelectionRange(cursorPositions[historyIndex], cursorPositions[historyIndex]);
    }
};

const resetHistory = () => {
    history = [];
    cursorPositions = [];
    historyIndex = -1;
    localStorage.removeItem('textareaHistory');
    localStorage.removeItem('cursorPositions');
};

textarea.addEventListener('input', saveToHistory);

textarea.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        undo();
    } else if (event.ctrlKey && event.key === 'y') {
        event.preventDefault();
        redo();
    }
});
