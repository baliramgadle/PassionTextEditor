function loadTheme() {
    try {
        if (storageAvailable('localStorage')) {
            const theme1 = localStorage.getItem('theme-1') || getComputedStyle(document.documentElement).getPropertyValue('--theme1').trim();
            const theme2 = localStorage.getItem('theme-2') || getComputedStyle(document.documentElement).getPropertyValue('--theme2').trim();
            const bgColor = localStorage.getItem('bg') || getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
            const txtColor = localStorage.getItem('txt') || getComputedStyle(document.documentElement).getPropertyValue('--txt').trim();

            applyTheme(theme1, theme2, bgColor, txtColor);

        } else {
            applyDefaultTheme();
        }
    } catch (error) {
        applyDefaultTheme();
    }
}

function applyTheme(theme1, theme2, bgColor, txtColor) {
    document.documentElement.style.setProperty('--theme1', theme1);
    document.documentElement.style.setProperty('--theme2', theme2);
    document.documentElement.style.setProperty('--bg', bgColor);
    document.documentElement.style.setProperty('--txt', txtColor);
}

function applyDefaultTheme() {
    const theme1 = getComputedStyle(document.documentElement).getPropertyValue('--theme1').trim();
    const theme2 = getComputedStyle(document.documentElement).getPropertyValue('--theme2').trim();
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
    const txtColor = getComputedStyle(document.documentElement).getPropertyValue('--txt').trim();

    applyTheme(theme1, theme2, bgColor, txtColor);
}

function storageAvailable(type) {
    try {
        const storage = window[type];
        const testKey = '__storage_test__';
        storage.setItem(testKey, testKey);
        storage.removeItem(testKey);
        return true;
    } catch (e) {
        return e instanceof DOMException && (
            e.code === 22 || 
            e.code === 1014 || 
            e.name === 'QuotaExceededError' ||
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            storage.length !== 0;
    }
}

window.onload = function () {
    loadTheme();
};
