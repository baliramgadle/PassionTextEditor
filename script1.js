//  Script - 1 : File menu, Font-size menu
//=======================================================================================

//toggle tropdown menus
function toggleDropdown(menuId) {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        if (dropdown.id !== menuId) {
            dropdown.style.display = 'none';
            setTimeout(() => {
                dropdown.style.transform = "translate(0%,-1000px)";
                dropdown.style.opacity = 0;
            }, 10);
        }
    });
    const dropdown = document.getElementById(menuId);
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    if (dropdown.style.display === 'block') {
        setTimeout(() => {
            dropdown.style.transform = "translate(0%,130px)";
            dropdown.style.opacity = 1;
        }, 10);
    }
    else {
        dropdown.style.transform = "translate(0%,-1000px)";
        dropdown.style.opacity = 0;
    }

}

//close open dropdowns
document.addEventListener('click', (event) => {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        if (event.target.closest('.menu-item') === null) {
            dropdown.style.display = 'none';
            dropdown.style.transform = "translate(0%,-1000px)";
            dropdown.style.opacity = 0;
        }
    });
});

//create new file
function newFile(type) {
    const defaultContent = type === 'html'
        ? htmlStructure
        : "";
    createTab("untitled", defaultContent);
}

// open existing file
function openFile() {
    document.getElementById('fileInput').click();
    document.getElementById('fileInput').onchange = function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                createTab(file.name, e.target.result);
            };
            reader.readAsText(file);
        }
    };
}

//save files 
let currentFile = null;

// save file option
function saveFile() {
    const content = document.getElementById('code-field').value;
    let firstLine = content.substring(0, 20);
    if (firstLine.trim() === "") {
        firstLine = "untitled";
    }
    const filename = firstLine.trim() + ".txt";
    if (!currentFile) {
        showPrompt("Enter file name (supported formats:.txt, .html, .css, .js, .json, .java, .xml, .docx, etc.):", `${filename}`).then((newFileName) => {

            currentFile = newFileName;
            saveCurrentFile();
        });
    } else {
        saveCurrentFile();
    }
}

// save current file option
function saveCurrentFile() {
    const content = document.getElementById('code-field').value;
    if (!currentFile) return;
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = currentFile;
    link.click();
}

// save file as option
function saveFileAs() {
    const content = document.getElementById('code-field').value;
    let firstLine = content.substring(0, 20);
    if (firstLine.trim() === "") {
        firstLine = "untitled";
    }
    const filename = firstLine.trim() + ".txt";
    showPrompt("Enter file name (supported formats:.txt, .html, .css, .js, .json, .java, .xml, .docx, etc.):", `${filename}`).then((newFileName) => {
        currentFile = newFileName;
        saveCurrentFile();
    });
}


// font-size change
function changeFont(size) {

    document.getElementById('code-field').style.fontSize = size;
    document.getElementById('line-numbers').style.fontSize = size;

    const fonts = document.querySelectorAll(".font");
    fonts.forEach((font) => {
        if (font.innerText === size) {
            font.innerHTML = size + " &check;";
        }
        else {
            font.innerText = font.innerText.substring().slice(0, 4);
        }
    });
}
// Add event listeners for drag functionality to multiple elements
const draggableElements = ['#custom-alert', '#custom-prompt', '#custom-confirm', '#find-replace-dialogue'];
const originalPositions = {};

// Function to make an element draggable
function makeDraggable(elementId) {
    const message = document.getElementById("alert-message");
    const element = document.querySelector(elementId);
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    if (element) {
        originalPositions[elementId] = {
            top: element.offsetTop,
            left: element.offsetLeft
        };
        element.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable || e.target === message || e.target.tagName === 'BUTTON') {
            return;
        }
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Add draggable functionality to each specified element
draggableElements.forEach(makeDraggable);

// Function to reset an element's position to its original location
function resetPosition() {
    draggableElements.forEach(elementId => {
        const element = document.querySelector(elementId);
        const originalPosition = originalPositions[elementId];

        if (element && originalPosition) {
            element.style.top = originalPosition.top + "px";
            element.style.left = originalPosition.left + "px";
        }
    });
}

//resize split mode
const resizer = document.getElementById('resizer');
const splitBody = document.getElementById('body');
const leftContainer = document.getElementById('editor-screen');
const rightContainer = document.getElementById('output-screen');
let isResizing = false;

resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    rightContainer.style.display = "none";
    document.addEventListener('mousemove', resizeContainers);
    document.addEventListener('mouseup', stopResizing);
});

function resizeContainers(e) {
    if (isResizing) {
        const totalWidth = splitBody.offsetWidth;
        const mouseX = e.clientX;

        // Calculate the percentage width based on the cursor's X position
        const leftWidthPercent = (mouseX / totalWidth) * 100;
        const rightWidthPercent = 100 - leftWidthPercent;

        // Apply the new widths
        leftContainer.style.width = `${leftWidthPercent}%`;
        rightContainer.style.width = `${rightWidthPercent}%`;
    }
}

function stopResizing() {
    isResizing = false;
    rightContainer.style.display = "block";
    document.removeEventListener('mousemove', resizeContainers);
    document.removeEventListener('mouseup', stopResizing);
}


//text representator
const represent = document.getElementById("text-represent");
const text = document.getElementById("code-field");
const workspace = document.querySelector(".workspace");
function loadText() {
    represent.innerText = text.value;
}
text.addEventListener("keydown", loadText);

text.addEventListener('select', function () {
    const start = text.selectionStart;
    const end = text.selectionEnd;

    const textContent = text.value;
    const beforeSelection = textContent.slice(0, start);
    const selectedText = textContent.slice(start, end);
    const afterSelection = textContent.slice(end);

    // Highlight the selection in the represent div
    represent.innerHTML = `${escapeHtml(beforeSelection)}<span class="highlight">${escapeHtml(selectedText)}</span>${escapeHtml(afterSelection)}`;

    // Function to escape HTML for safe rendering
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});


represent.addEventListener('click', (e) => {
    const representHeight = represent.clientHeight;
    const clickY = e.clientY - represent.getBoundingClientRect().top;
    const clickPercentage = clickY / representHeight;

    const scrollHeight = workspace.scrollHeight;
    const clientHeight = workspace.clientHeight;
    const maxScrollTop = scrollHeight - clientHeight;

    workspace.scrollTop = maxScrollTop * clickPercentage;
});


// Html boiler plate code
const htmlStructure =
    `<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <style>
        
    </style>
</head>
<body>
    
    
    
    <script>
        
    </script>
</body>
</html>`;
