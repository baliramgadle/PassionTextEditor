//  Script - 4: events, validation, shortcuts.
//=======================================================================================

const htmlAttributes = [
    "accept", "accept-charset", "accesskey", "action", "align", "alt", "async", "autocapitalize", "autocomplete",
    "autofocus", "autoplay", "charset", "checked", "cite", "class", "cols", "colspan", "content", "contenteditable",
    "controls", "coords", "data-*", "datetime", "default", "defer", "dir", "dirname", "disabled", "download",
    "draggable", "enctype", "for", "form", "formaction", "headers", "height", "hidden", "high", "href", "hreflang",
    "http-equiv", "id", "ismap", "kind", "label", "lang", "list", "loop", "low", "max", "maxlength", "media",
    "method", "min", "multiple", "muted", "name", "novalidate", "onabort", "onblur", "onchange", "onclick",
    "oncontextmenu", "ondblclick", "ondrag", "ondragend", "ondragenter", "ondragleave", "ondragover", "ondragstart",
    "ondrop", "onerror", "onfocus", "oninput", "onkeydown", "onkeypress", "onkeyup", "onload", "onmousedown",
    "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onreset", "onscroll", "onsearch", "onselect", "onsubmit",
    "onunload", "open", "optimum", "pattern", "placeholder", "poster", "preload", "readonly", "rel", "required", "reversed",
    "rows", "rowspan", "sandbox", "scope", "selected", "shape", "size", "sizes", "span", "spellcheck", "src", "srcdoc",
    "srclang", "srcset", "start", "step", "style", "tabindex", "target", "title", "translate", "type", "usemap", "value",
    "width", "wrap"
  ];
  
// Tab char handling
document.getElementById('code-field').addEventListener('keydown', function (e) {
    const editor = e.target;
    const tabSpaces = '    ';

    if (e.key === 'Tab') {
        if (editor.selectionStart !== editor.selectionEnd) {
            return;
        }
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const content = editor.value;
        editor.value = content.slice(0, start) + tabSpaces + content.slice(end);
        editor.selectionStart = editor.selectionEnd = start + tabSpaces.length;
    } else if (e.key === 'Backspace') {
        const start = editor.selectionStart;
        const content = editor.value;

        if (editor.selectionStart !== editor.selectionEnd) {
            return;
        }

        if (start >= 4 && content.substring(start - 4, start) === tabSpaces) {
            e.preventDefault();
            editor.value = content.slice(0, start - 4) + content.slice(start);
            editor.selectionStart = editor.selectionEnd = start - 4;
        }

    }
});

//insert char behavior
function insertTextAtCursor(textarea, text) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);

    textarea.value = before + text + after;
    textarea.selectionStart = textarea.selectionEnd = start + text.length;
}

//event listener for auto close tags 
const selfClosingTags = ['meta', 'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'source', 'track', 'wbr'];
let tagStack = [];

document.getElementById('code-field').addEventListener("keydown", function (event) {
    const textarea = event.target;
    const value = textarea.value;
    const cursorPosition = textarea.selectionStart;

    if (event.key === ">") {
        const match = value.substring(0, cursorPosition).match(/<([a-zA-Z0-9]+)(\s*[^>]*)?$/);

        if (match) {
            const tagName = match[1];

            if (selfClosingTags.includes(tagName)) {
                const beforeCursor = value.substring(0, cursorPosition);
                const afterCursor = value.substring(cursorPosition);

                event.preventDefault();

                textarea.value = beforeCursor + `/>` + afterCursor;
                textarea.selectionStart = textarea.selectionEnd = cursorPosition + 2;
            } else {
                const closingTag = `</${tagName}>`;

                event.preventDefault();

                const beforeCursor = value.substring(0, cursorPosition);
                const afterCursor = value.substring(cursorPosition);
                textarea.value = beforeCursor + `>` + closingTag + afterCursor;
                textarea.selectionStart = textarea.selectionEnd = cursorPosition + 1;
            }
        }
    }
});

// self open pairs for closing chars
document.getElementById('code-field').addEventListener("keydown", function (event) {
    const textarea = event.target;
    const value = textarea.value;
    const cursorPosition = textarea.selectionStart;
    const beforeCursor = value.substring(0, cursorPosition);
    const afterCursor = value.substring(cursorPosition);
    const last = beforeCursor.substring(cursorPosition - 1, cursorPosition);
    const words = beforeCursor.trim().split(/\s+/);
    const lastWord = words[words.length-1];


    const openClosePairs = {
        '{': '}',
        '[': ']',
        '(': ')',
        '"': '"',
        "'": "'",
        '`': '`'
    };

    const charset = ['{', '}', '[', ']', '(', "'", '"', '`', ' ', '\n','$'];
    const charset2 = ['{', '}', '[', ']', '(', "'", '"', '`', ' ', '\n', '=', '!', '%', "*", "+", '/', '-', '>', '<'];

    if (last === '=' && isalPhabetic(event.key)) {
        event.preventDefault();
        textarea.value = beforeCursor + " " + event.key + afterCursor;
        textarea.selectionStart = textarea.selectionEnd = cursorPosition + 2;
    }

    if(htmlAttributes.includes(lastWord) && event.key === '='){
        event.preventDefault();
        textarea.value = beforeCursor + '="' + '"' + afterCursor;
        textarea.selectionStart = textarea.selectionEnd = cursorPosition + 2;
    }
    else if (event.key === '=' && !charset2.includes(last) && cursorPosition !== 0) {
        event.preventDefault();
        textarea.value = beforeCursor + " " + event.key + afterCursor;
        textarea.selectionStart = textarea.selectionEnd = cursorPosition + 2;
    }

    if (openClosePairs[event.key]) {
        event.preventDefault();

        if (event.key === '{' && !charset.includes(last) && cursorPosition !== 0) {
            textarea.value = beforeCursor + " " + event.key + openClosePairs[event.key] + afterCursor;
            textarea.selectionStart = textarea.selectionEnd = cursorPosition + 2;
        } else {
            textarea.value = beforeCursor + event.key + openClosePairs[event.key] + afterCursor;
            textarea.selectionStart = textarea.selectionEnd = cursorPosition + 1;
        }
    }
});

//check for alphabet/numbers or not
function isalPhabetic(key) {
    return /^[A-Za-z0-9]$/.test(key);

}
// auto delete closing char pairs on backspace
document.getElementById("code-field").addEventListener("keydown", function (event) {
    const textarea = event.target;
    const value = textarea.value;
    const cursorPosition = textarea.selectionStart;
    const beforeCursor = value.substring(0, cursorPosition - 1);
    const afterCursor = value.substring(cursorPosition + 1);
    const charBeforeCursor = value[cursorPosition - 1];
    const charAfterCursor = value[cursorPosition];
    const last = beforeCursor.substring(cursorPosition - 2, cursorPosition);
    const words = value.substring(0 , cursorPosition).trim().split(/\s+/);
    const lastWord = words[words.length-1];

    const pairs = {
        '{': '}',
        '[': ']',
        '(': ')',
        '"': '"',
        "'": "'",
        '`': '`'
    };

    if (event.key === "Backspace" && cursorPosition > 0) {

        if (pairs[charBeforeCursor] === charAfterCursor) {
            event.preventDefault();
            textarea.value = beforeCursor + afterCursor;
            textarea.selectionStart = textarea.selectionEnd = cursorPosition - 1;
        }
    }
    if (event.key === "Backspace") {
        loadText();
        if (splitMode) run();
        tabs[currentTabIndex].content = this.value;
        updateTabTitle(currentTabIndex);
        saveTabsToLocalStorage();
    }

    if (event.key === ':') {
        if (lastWord !== 'input' && !lastWord.includes('.') && !lastWord.includes('#')) {
            event.preventDefault();
            if (!last.includes(':'))
                insertTextAtCursor(textarea, ': ');
            else {
                textarea.value = value.slice(0, cursorPosition - 1) + ': ' + afterCursor;
            }
        }
    }
});

// !hmtl template, class-id shorthands, indentation
const editor = document.getElementById('code-field');
editor.addEventListener('keydown', function (event) {
    if (event.key === "Enter") {

        event.preventDefault();
        const cursorPosition = editor.selectionStart;
        const inputText = getCurrentLine();
        const newHTML = processInput(inputText);
        const content = editor.value.trim();

        if (content === '!' && content.charAt(content.length - 1) === '!') {
            console.log(content, content.charAt(content.length - 1));
            editor.value = htmlStructure;
        }
        else if (newHTML) {
            replaceCurrentLine(newHTML, cursorPosition);
        }
        else {
            const textarea = event.target;
            const value = textarea.value;
            const cursorPosition = textarea.selectionStart;

            const beforeCursor = value.substring(0, cursorPosition);
            const afterCursor = value.substring(cursorPosition);

            const openTagMatch = beforeCursor.match(/<([a-zA-Z0-9]+)(\s[^>]*)?>$/);
            const closeTagMatch = afterCursor.match(/^<\/([a-zA-Z0-9]+)>/);

            const openBraceMatch = beforeCursor.match(/\{$/);
            const closeBraceMatch = afterCursor.match(/^\}/);

            if ((openTagMatch && closeTagMatch && openTagMatch[1] === closeTagMatch[1]) || (openBraceMatch && closeBraceMatch)) {
                const indentation = getIndentation(beforeCursor);
                const newLineIndent = `\n${indentation}    \n${indentation}`;

                textarea.value = beforeCursor + newLineIndent + afterCursor;
                textarea.selectionStart = textarea.selectionEnd = cursorPosition + indentation.length + 5;
            } else {
                const indentation = getIndentation(beforeCursor);
                textarea.value = beforeCursor + `\n${indentation}` + afterCursor;
                textarea.selectionStart = textarea.selectionEnd = cursorPosition + indentation.length + 1;
            }
        }
    }
});

// for indentation and above 
function getCurrentLine() {
    const text = editor.value;
    const cursorPosition = editor.selectionStart;
    const lines = text.substring(0, cursorPosition).split("\n");
    return lines[lines.length - 1].trim();
}

// process input for raw id, class, tag pattern
function processInput(input) {
    const tagRegex = /^([a-z1-6]+)?(?::(\w+))?(?:\.([\w-]+))?(?:#([\w-]+))?$/;
    const match = input.match(tagRegex);

    if (match) {
        const tag = match[1];
        const type = match[2];
        const id = match[4] ? ` id="${match[4]}"` : '';
        const className = match[3] ? ` class="${match[3]}"` : '';

        const selfClosingTags = ['img', 'input', 'br', 'hr', 'meta', 'link'];

        if (id || className || (tag && tag.length > 0)) {
            if (selfClosingTags.includes(tag)) {
                if (tag === "input") {
                    return `<${tag} type="${type || 'text'}"${className}${id} />`;
                }
                return `<${tag}${className}${id} />`;
            }

            if (tag && (id || className)) {
                return `<${tag}${className}${id}></${tag}>`;
            }
        }

        if (!tag && (className || id)) {
            return `<div${className}${id}></div>`;
        }
    }

    return null;
}

// replace currentline with formatted class id shorthand 
function replaceCurrentLine(newHTML, cursorPosition) {
    const text = editor.value;
    const lines = text.substring(0, cursorPosition).split("\n");
    const indentation = getIndentation(text.substring(0, cursorPosition));

    lines[lines.length - 1] = indentation + newHTML;
    const updatedText = lines.join("\n") + text.substring(cursorPosition);
    editor.value = updatedText;
    const ln = lines.length;
    const line = lines[ln - 1];
    const char = line.indexOf('>');
    const index = findCharIndex(text, ln, char);

    const selfClosingTags = ['img', 'input', 'br', 'hr', 'meta', 'link'];
    const tagRegex = /<([a-z]+)[^>]*>(.*?)<\/\1>|<([a-z]+)[^>]*\/>/;

    const match = newHTML.match(tagRegex);

    if (match) {
        if (selfClosingTags.includes(match[1] || match[3])) {
            editor.selectionStart = editor.selectionEnd = index + 2;
        } else {
            editor.selectionStart = editor.selectionEnd = index + 2;
        }
    }
}

//find the open tag close char index
function findCharIndex(text, lineNumber, charIndex) {
    const lines = text.split("\n");

    let startIndex = 0;
    for (let i = 0; i < lineNumber - 1; i++) {
        startIndex += lines[i].length + 1;
    }
    return startIndex + charIndex - 1;
}

// return the indentation of lastline cursor line
function getIndentation(text) {
    const lines = text.split('\n');
    const lastLine = lines[lines.length - 1];
    const match = lastLine.match(/^(\s*)/);
    return match ? match[1] : '';
}

//reload to fix pushed to top
function reload() {
    const represent = document.getElementById("text-represent");
    loadText();
    if (!splitMode) {
        document.getElementById("output-screen").style.display = "none";
        if(window.innerWidth > 500)
            represent.style.display = "block";
    }
    const field = document.getElementById("code-field");
    const editor = document.getElementById("editor-screen");
    const start = field.cursorPosition;

    const anchor = document.createElement("a");
    anchor.href = "#editor-screen";
    anchor.style.display = "none";
    editor.appendChild(anchor);
    anchor.click();
    editor.removeChild(anchor);

    field.focus();
    field.cursorPosition = start;

}

//reload output
function reloadRun() {
    const anchor = document.createElement("a");
    anchor.href = "#output-screen";
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

// click reload
document.getElementById("code-field").addEventListener("click", reload);
document.getElementById("line-numbers").addEventListener("click", reload);

//input event listners
document.getElementById("code-field").addEventListener("input", function () {
    tabs[currentTabIndex].content = this.value;
    updateTabTitle(currentTabIndex);
});

// Initialize the theme and event listeners on page load
window.onload = function () {
    loadTheme();
    setupEventListeners();
    loadTabsFromLocalStorage();
    loadLastActiveTab();
    updateLineNumbers();
    loadText();
    loadSplitMode();
    restoreSpellChecker();
};

window.onbeforeunload = () => {
    if (tabs[currentTabIndex]) {
        tabs[currentTabIndex].content = document.getElementById('code-field').value;
    }
    createTab();
    saveTabsToLocalStorage();
};
