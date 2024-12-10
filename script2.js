//  Script - 2: More Menu, Clear, Run, Dialogue boxes
//=======================================================================================

function resetTheme() {
    showConfirm("Are you sure you want to reset the theme to default?").then((confirmed) => {
        if (confirmed) {
            try {
                if (storageAvailable('localStorage')) {
                    // Remove stored theme data from localStorage
                    localStorage.removeItem('theme-1');
                    localStorage.removeItem('theme-2');
                    localStorage.removeItem('bg');
                    localStorage.removeItem('txt');
                }

                // Explicit default theme values (you can replace these with your own)
                const defaultTheme1 = '#880000';
                const defaultTheme2 = '#e8e8e8';
                const defaultBgColor = '#cccccc';
                const defaultTxtColor = '#000000';

                // Apply the default theme instantly by setting these values directly to the document's root CSS
                document.documentElement.style.setProperty('--theme1', defaultTheme1);
                document.documentElement.style.setProperty('--theme2', defaultTheme2);
                document.documentElement.style.setProperty('--bg', defaultBgColor);
                document.documentElement.style.setProperty('--txt', defaultTxtColor);

                // Update the input fields to reflect the default values
                document.getElementById('theme-1').value = defaultTheme1.toLowerCase();
                document.getElementById('theme-2').value = defaultTheme2.toLowerCase();
                document.getElementById('bgcolor').value = defaultBgColor.toLowerCase();
                document.getElementById('color').value = defaultTxtColor.toLowerCase();

            } catch (error) {
                // Fallback to applying the default theme if any error occurs
                applyDefaultTheme();
            }
        } else {
            return;
        }

    });
}



// Function to load the theme from localStorage or fallback to CSS defaults
function loadTheme() {
    try {

        if (storageAvailable('localStorage')) {
            const theme1 = localStorage.getItem('theme-1') || getComputedStyle(document.documentElement).getPropertyValue('--theme1').trim();
            const theme2 = localStorage.getItem('theme-2') || getComputedStyle(document.documentElement).getPropertyValue('--theme2').trim();
            const bgColor = localStorage.getItem('bg') || getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
            const txtColor = localStorage.getItem('txt') || getComputedStyle(document.documentElement).getPropertyValue('--txt').trim();

            document.documentElement.style.setProperty('--theme1', theme1);
            document.documentElement.style.setProperty('--theme2', theme2);
            document.documentElement.style.setProperty('--bg', bgColor);
            document.documentElement.style.setProperty('--txt', txtColor);

            document.getElementById('theme-1').value = theme1.toLowerCase();
            document.getElementById('theme-2').value = theme2.toLowerCase();
            document.getElementById('bgcolor').value = bgColor.toLowerCase();
            document.getElementById('color').value = txtColor.toLowerCase();
        } else {
            applyDefaultTheme();
        }
    } catch (error) {
        applyDefaultTheme();
    }
}

// apply default theme if stored not available
function applyDefaultTheme() {
    const theme1 = getComputedStyle(document.documentElement).getPropertyValue('--theme1').trim();
    const theme2 = getComputedStyle(document.documentElement).getPropertyValue('--theme2').trim();
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
    const txtColor = getComputedStyle(document.documentElement).getPropertyValue('--txt').trim();

    document.documentElement.style.setProperty('--theme1', theme1);
    document.documentElement.style.setProperty('--theme2', theme2);
    document.documentElement.style.setProperty('--bg', bgColor);
    document.documentElement.style.setProperty('--txt', txtColor);


    document.getElementById('theme-1').value = theme1.toLowerCase();
    document.getElementById('theme-2').value = theme2.toLowerCase();
    document.getElementById('bgcolor').value = bgColor.toLowerCase();
    document.getElementById('color').value = txtColor.toLowerCase();
}

// Function to handle color change and store the new theme to localStorage
function handleColorChange() {
    try {
        const theme1 = document.getElementById('theme-1').value;
        const theme2 = document.getElementById('theme-2').value;
        const bgColor = document.getElementById('bgcolor').value;
        const txtColor = document.getElementById('color').value;

        document.documentElement.style.setProperty('--theme1', theme1);
        document.documentElement.style.setProperty('--theme2', theme2);
        document.documentElement.style.setProperty('--bg', bgColor);
        document.documentElement.style.setProperty('--txt', txtColor);

        if (storageAvailable('localStorage')) {
            localStorage.setItem('theme-1', theme1);
            localStorage.setItem('theme-2', theme2);
            localStorage.setItem('bg', bgColor);
            localStorage.setItem('txt', txtColor);
        }
    } catch (error) {

    }
}

// Function to check if localStorage is supported
function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return e instanceof DOMException && (
            e.code === 22 || e.code === 1014 ||
            e.name === 'QuotaExceededError' ||
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            storage.length !== 0;
    }
}

// Add event listeners to the color inputs
function setupEventListeners() {
    const theme1Input = document.getElementById('theme-1');
    const theme2Input = document.getElementById('theme-2');
    const bgColorInput = document.getElementById('bgcolor');
    const txtColorInput = document.getElementById('color');

    if (theme1Input && theme2Input && bgColorInput && txtColorInput) {
        theme1Input.addEventListener('input', handleColorChange);
        theme2Input.addEventListener('input', handleColorChange);
        bgColorInput.addEventListener('input', handleColorChange);
        txtColorInput.addEventListener('input', handleColorChange);
    } else {

    }
}

let isSpellCheckEnabled = false;
//spell checker Function
function spellChecker() {
    const codeField = document.getElementById('code-field');
    const spellCheckButton = document.getElementById('spell-checker');

    if (!isSpellCheckEnabled) {
        codeField.setAttribute('spellcheck', 'true');
        spellCheckButton.innerHTML = 'Spell Check &check;';
        isSpellCheckEnabled = true;
    } else {
        codeField.setAttribute('spellcheck', 'false');
        spellCheckButton.innerHTML = 'Spell Check';
        isSpellCheckEnabled = false;
    }
    storeSpellChecker();
}

//store spell check
function storeSpellChecker() {
    if (storageAvailable('localStorage')) {
        localStorage.setItem('isSpellChecker', isSpellCheckEnabled);
    }
}

// restore spell check
function restoreSpellChecker() {
    if (storageAvailable('localStorage')) {
        const isChecked = localStorage.getItem('isSpellChecker');
        if (isChecked === 'true') {
            spellChecker();
        }
    }
}
// Html live server split mode toggle
let splitMode = false;
function toggleSplitMode() {
    closeFindReplaceDialogue();
    resetPosition();

    const editor = document.getElementById("editor-screen");
    const output = document.getElementById("output-screen");
    const button = document.getElementById("split-button");
    const rb = document.getElementById("run");
    const edit = document.getElementById("edit");
    const body = document.getElementById("body");
    const resizer = document.getElementById("resizer");

    if (!splitMode) {
        if (window.innerWidth < 550) {
            showAlert("Split View not supported with this width.");
            return;
        }
        editor.classList.add("split-container1");
        output.classList.add("split-container2");
        button.innerHTML = 'Split View &check;';
        resizer.style.display = "block";
        rb.style.display = "none";
        edit.style.display = "none";
        body.style.flexDirection = "row";
        represent.style.display = "none";
        splitMode = true;
        run();
    }
    else {
        editor.classList.remove("split-container1");
        output.classList.remove("split-container2");
        editor.style.width = "100%";
        output.style.width = "100%";
        resizer.style.display = "none";
        button.innerText = "Split View";
        rb.style.display = "block";
        edit.style.display = "block";
        body.style.flexDirection = "column";
        if(window.innerWidth > 500)
            represent.style.display = "block";
        splitMode = false;
    }
    saveSplitMode();
}

// live run
document.getElementById("code-field").addEventListener('input', function () {
    if (splitMode === true)
        run();
});

//save splitmode
function saveSplitMode() {
    if (storageAvailable('localStorage')) {
        localStorage.setItem('isSplitMode', splitMode);
    }
}

//restore splitMode
function loadSplitMode() {
    if (storageAvailable('localStorage')) {
        const isSplitMode = localStorage.getItem('isSplitMode');
        if (isSplitMode === 'true') {
            toggleSplitMode();
        }
    }
}

// find-replace toggle function
function findReplaceDialogue() {
    closeFindReplaceDialogue();
    const dialogue = document.getElementById('find-replace-dialogue');
    dialogue.style.display = 'block';
    setTimeout(() => {
        dialogue.style.transform = "translate(-50%,100%)";
    }, 10);
}

// Find Function
function find() {
    let editor = document.getElementById('code-field');
    let findText = document.getElementById('find-text').value.trim();

    if (findText === '') {
        showAlert('Please enter text to find.');
        return;
    }

    let editorContent = editor.value;
    let regex = new RegExp(findText, 'gi');
    let lines = editorContent.split('\n');

    let occurrences = 0;
    let lineNumbers = [];

    lines.forEach((line, index) => {
        if (line.match(regex)) {
            occurrences += (line.match(regex) || []).length;
            lineNumbers.push(index + 1);
        }
    });

    if (occurrences === 0) {
        showAlert('No occurences found.');
    } else {
        showAlert(`Found ${occurrences} occurrence(s) at line(s): ${lineNumbers.join(', ')}.`);
    }
}

// Replace Function
function replace() {
    let editor = document.getElementById('code-field');
    let findText = document.getElementById('find-text').value.trim();
    let replaceText = document.getElementById('replace-text').value.trim();

    if (findText === '') {
        showAlert('Please enter text to find.');
        return;
    }

    if (replaceText === '') {
        showAlert('Please enter replacement text.');
        return;
    }

    let editorContent = editor.value;
    let regex = new RegExp(findText, 'i');
    let lines = editorContent.split('\n');

    let replacedLine = null;

    lines.forEach((line, index) => {
        if (line.match(regex) && replacedLine === null) {
            lines[index] = line.replace(regex, replaceText);
            replacedLine = index + 1;
        }
    });

    if (replacedLine === null) {
        showAlert('No occurences found.');
    } else {
        editor.value = lines.join('\n');
        showAlert(`First occurrence replaced at line: ${replacedLine}.`);
    }
}

// Replace All Function
function replaceAll() {
    let editor = document.getElementById('code-field');
    let findText = document.getElementById('find-text').value.trim();
    let replaceText = document.getElementById('replace-text').value.trim();

    if (findText === '') {
        showAlert('Please enter text to find.');
        return;
    }

    if (replaceText === '') {
        showAlert('Please enter replacement text.');
        return;
    }

    let editorContent = editor.value;
    let regex = new RegExp(findText, 'gi');
    let lines = editorContent.split('\n');

    let replacedLines = [];

    lines.forEach((line, index) => {
        if (line.match(regex)) {
            lines[index] = line.replace(regex, replaceText);
            replacedLines.push(index + 1);
        }
    });

    if (replacedLines.length === 0) {
        showAlert('No occurences found.');
    } else {
        editor.value = lines.join('\n');
        showAlert(`Replaced occurrences at line(s): ${replacedLines.join(', ')}.`);
    }
}

// close find-replace function
function closeFindReplaceDialogue() {
    resetPosition();
    document.getElementById("find-replace-dialogue").style.display = "none";
    document.getElementById("find-replace-dialogue").style.transform = "translate(-50%,0%)";
    document.getElementById("custom-alert").style.display = "none";
    document.getElementById("custom-alert").style.transform = "translate(-50%,0%)";
    document.getElementById("custom-prompt").style.display = "none";
    document.getElementById("custom-prompt").style.transform = "translate(-50%,0%)";
    document.getElementById("custom-confirm").style.display = "none";
    document.getElementById("custom-confirm").style.transform = "translate(-50%,0%)";
}

// words, chars, nums, etc count
function wordCount() {
    closeFindReplaceDialogue();
    const text = document.getElementById("code-field").value;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const lettersWithSpaces = text.length;
    const lettersWithoutSpaces = text.replace(/\s+/g, '').length;
    const specialChars = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
    const alphabets = (text.match(/[a-zA-Z]/g) || []).length;
    const numbers = (text.match(/\d/g) || []).length;
    const lines = text.split(/\n/).length;

    const message = `
        Words: ${words}
        Letters (with spaces): ${lettersWithSpaces}
        Letters (without spaces): ${lettersWithoutSpaces}
        Special characters: ${specialChars}
        Alphabets: ${alphabets}
        Numbers: ${numbers}
        Lines: ${lines}
    `;

    showAlert(message);
}

// showPrompt Function
function showPrompt(message, value) {
    closeFindReplaceDialogue();
    const dialogue = document.getElementById("custom-prompt");
    const messageElement = document.getElementById("prompt-message");
    const valueField = document.getElementById("prompt-value");
    const okButton = document.getElementById("ok-prompt");
    const noButton = document.getElementById("no-prompt");

    messageElement.textContent = message;
    dialogue.style.display = "block";
    valueField.value = value;
    setTimeout(() => {
        dialogue.style.transform = "translate(-50%,100%)";
    }, 10);

    return new Promise((resolve) => {
        okButton.addEventListener("click", () => {
            if (valueField.value === "") {
                showAlert("Enter File Title");
                dialogue.style.transform = "translate(-50%,0%)";
            }
            else {
                dialogue.style.display = "none";
                resolve(valueField.value);
            }
        });

        noButton.addEventListener("click", () => {
            dialogue.style.display = "none";
            dialogue.style.transform = "translate(-50%,0%)";
            resolve(false);
        });
    });
}

// showAlert Function
function showAlert(message) {
    const dialogue = document.getElementById("custom-alert");
    const messageElement = document.getElementById("alert-message");
    const okButton = document.getElementById("ok-alert");

    messageElement.textContent = message;
    dialogue.style.display = "block";
    setTimeout(() => {
        dialogue.style.transform = "translate(-50%,100%)";
    }, 10);

    okButton.addEventListener("click", () => {
        dialogue.style.display = "none";
        dialogue.style.transform = "translate(-50%,0%)";
        resetPosition();
    });
}

// showConfirm Function
function showConfirm(message) {
    closeFindReplaceDialogue();
    const dialogue = document.getElementById("custom-confirm");
    const messageElement = document.getElementById("confirm-message");
    const okButton = document.getElementById("ok-confirm");
    const noButton = document.getElementById("no-confirm");

    messageElement.textContent = message;
    dialogue.style.display = "block";
    setTimeout(() => {
        dialogue.style.transform = "translate(-50%,100%)";
    }, 10);

    return new Promise((resolve) => {
        okButton.addEventListener("click", () => {
            dialogue.style.display = "none";
            dialogue.style.transform = "translate(-50%,0%)";
            resolve(true);
        });

        noButton.addEventListener("click", () => {
            dialogue.style.display = "none";
            dialogue.style.transform = "translate(-50%,0%)";
            resolve(false);
        });
    });
}

// Clear Text Function
function clearCode() {
    closeFindReplaceDialogue();
    showConfirm("Are you sure you want to clear the text?").then((confirmed) => {
        if (confirmed) {
            document.getElementById("code-field").value = "";
            updateLineNumbers();
            tabs[currentTabIndex].content = "";
            updateTabTitle(currentTabIndex);
            if(splitMode)
                run();
        } else {
            return;
        }
    });
}

// Run Function
function run() {

    console.clear();
    represent.style.display = "none";
    const output = document.getElementById("output-screen");
    output.style.display = "block";
    closeFindReplaceDialogue();
    var code = document.getElementById("code-field").value;


    document.getElementById("title").innerText = getTitle(code);


    var iframeContainer = document.getElementById("iframe-container");
    iframeContainer.innerHTML = '';
    var iframe = document.createElement("iframe");
    iframe.id = "output-frame";
    iframeContainer.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(code);
    iframeDoc.close();
}

function getTitle(code) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(code, 'text/html');
    let title = doc.querySelector('title') ? doc.querySelector('title').innerText : 'Untitled';
    if(title.trim() === "")
        title = "Untitled";
    return title;
}
