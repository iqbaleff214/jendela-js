import './jendela.css';
import './theme/jendela-linux.css';
import './theme/jendela-windows.css';

export const themes = {
    classic: "jendela-classic",
    legacy: "jendela-legacy",
    libadwaita: "jendela-libadwaita",
    xp: "jendela-xp",
    win7: "jendela-7",
    win8: "jendela-8",
    win10: "jendela-10",
    win11: "jendela-11",
};

const createWindowHeader = (root, title, minimizeButton, resizeButton, closeButton) => {
    let minimizeListener, maximizeListener, closeListener;

    const animateWindow = (t = 300) => {
        root.style.transition = `height ease ${t}ms, width ease ${t}ms, top ease ${t}ms, left ease ${t}ms, border ease ${t}ms, left ease ${t}ms`;
        setTimeout(() => {
            root.style.transition = "none";
        }, t);
    };

    const maximizeWindow = () => {
        const window = root;
        let classes = window.classList;
        let isMaximized = false;
        let isMinimized = false;
        classes.forEach(className => {
            if (className.includes('maximized')) {
                isMaximized = true;
            }
            if (className.includes('minimized')) {
                isMinimized = true;
            }
        });
        if (isMaximized) {
            window.classList.remove('maximized');
        } else if (isMinimized) {
            window.classList.remove('minimized');
        } else {
            window.classList.add('maximized');
            window.classList.remove('minimized');
        }
        animateWindow(250);
    };

    const closeWindow = () => {
        const window = root;
        window.style.transition = 'transform ease 0.3s, opacity ease 0.2s';
        window.style.transform = 'scale(0.75)';
        window.style.opacity = '0';
        setTimeout(() => {
            if (minimizeListener) {
                windowMinimize.removeEventListener('mouseup', minimizeListener);
                windowMinimize.removeEventListener('ontouchend', minimizeListener);
            }
            if (maximizeListener) {
                windowResize.removeEventListener('mouseup', maximizeListener);
                windowResize.removeEventListener('ontouchend', maximizeListener);
            }
            if (closeListener) {
                windowClose.removeEventListener('mouseup', closeListener);
                windowClose.removeEventListener('ontouchend', closeListener);
            }
            window.remove();
        }, 300);
    };

    const minimizeWindow = () => {
        const window = root;
        window.classList.remove('maximized');
        window.classList.add('minimized');
        animateWindow(250);
    };

    const windowHeader = document.createElement('div');
    windowHeader.className = 'header';

    const windowTitle = document.createElement('div');
    windowTitle.className = 'title';
    windowTitle.innerText = title;
    
    const windowButton = document.createElement('div');
    windowButton.className = 'headerButtonContainer';
    
    if (minimizeButton) {
        const windowMinimize = document.createElement('div');
        windowMinimize.className = 'headerButton headerButtonMinimize';
        windowMinimize.innerHTML = '<div class="icon"></div>'
        minimizeListener = minimizeWindow;
        windowMinimize.addEventListener('mouseup', minimizeListener);
        windowMinimize.addEventListener('ontouchend', minimizeListener);

        windowButton.appendChild(windowMinimize);
    }
    
    if (resizeButton) {
        const windowResize = document.createElement('div');
        windowResize.className = 'headerButton headerButtonResize';
        windowResize.innerHTML = '<div class="icon"></div>'
        maximizeListener = maximizeWindow;
        windowResize.addEventListener('mouseup', maximizeListener);
        windowResize.addEventListener('ontouchend', maximizeListener);

        windowButton.appendChild(windowResize);
    }
    
    if (closeButton) {
        const windowClose = document.createElement('div');
        windowClose.className = 'headerButton headerButtonClose';
        windowClose.innerHTML = '<div class="icon"></div>';
        closeListener = closeWindow;
        windowClose.addEventListener('mouseup', closeListener);
        windowClose.addEventListener('ontouchend', closeListener);

        windowButton.appendChild(windowClose);
    }

    windowHeader.appendChild(windowTitle);
    windowHeader.appendChild(windowButton);

    return windowHeader;
}

let windows = [];
const addValueZIndex = 99;

export const addWindow = (params = {}) => {
    const title = params.title ?? '';
    const body = params.body ?? '';
    const theme = params.theme ?? 'jendela-classic';
    const minimizeButton = params.minimizeButton ?? true;
    const resizeButton = params.resizeButton ?? true;
    const closeButton = params.closeButton ?? true;
    let minWidth = params.minWidth ?? 200;
    let minHeight = params.minHeight ?? 200;
    let width = params.width ?? minWidth;
    let height = params.height ?? minHeight;
    let left = params.left ?? `calc(50% - ${width / 2}px)`;
    let top = params.top ?? `calc(50% - ${height / 2}px)`;
    if (Number.isInteger(width)) { width = `${width}px`; }
    if (Number.isInteger(height)) { height = `${height}px`; }
    if (Number.isInteger(left)) { left = `${left}px`; }
    if (Number.isInteger(top)) { top = `${top}px`; }

    const newWindow = document.createElement('div');
    newWindow.className = `jendela ${theme}`;

    const windowHeader = createWindowHeader(newWindow, title, minimizeButton, resizeButton, closeButton);
    newWindow.appendChild(windowHeader);

    const windowBody = document.createElement('div');
    windowBody.className = 'body';
    windowBody.innerHTML = body;
    newWindow.appendChild(windowBody);
    
    newWindow.setAttribute('tabindex', '0');
    document.body.appendChild(newWindow);
    newWindow.style.width = width;
    newWindow.style.height = height;
    newWindow.style.left = left;
    newWindow.style.top = top;
    newWindow.setAttribute('data-min-width', minWidth);
    newWindow.setAttribute('data-min-height', minHeight);
    newWindow.focus();
    dragElement(newWindow);
    windows.push(newWindow);
    updateWindowZIndices();

    newWindow.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        newWindow.focus();
    });
    newWindow.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        newWindow.focus();
    });
    newWindow.addEventListener('focus', () => {
        handleWindowClick(newWindow);
        newWindow.classList.remove('inactive');
    });

    newWindow.addEventListener('blur', () => {
        newWindow.classList.add('inactive');
    });
};

function updateWindowZIndices() {
    windows.forEach((window, index) => {
        window.style.zIndex = index + addValueZIndex;
    });
}

function handleWindowClick(windowElement) {
    const clickedIndex = windows.indexOf(windowElement);

    if (clickedIndex !== windows.length - 1) {
        const movedWindow = windows.splice(clickedIndex, 1)[0];
        windows.push(movedWindow);
        updateWindowZIndices();
    }
}

const refreshWindows = () => {
    const windows = document.querySelectorAll(".jendela");
    if (windows.length) {
        windows.forEach(window => {
            dragElement(window);
        });
    }
};

refreshWindows();

function addMouseAndTouchListener(element, event, handler) {
    element.addEventListener(event, handler);
    element.addEventListener(`touch${event.slice(5)}`, handler);
}

function dragElement(element) {
    element.insertAdjacentHTML('afterbegin', `
        <div class="topHandle"></div>
        <div class="bottomHandle"></div>
        <div class="startHandle"></div>
        <div class="endHandle"></div>
        <div class="nwHandle cornerHandle"></div>
        <div class="neHandle cornerHandle"></div>
        <div class="swHandle cornerHandle"></div>
        <div class="seHandle cornerHandle"></div>
    `);

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let action = 'idle';
    const minWidth = parseInt(element.getAttribute('data-min-width'));
    const minHeight = parseInt(element.getAttribute('data-min-height'));
    let offsetX = 0, offsetY = 0;

    if (element.querySelector(".header")) {
        const handleBindings = [
            { selector: ".bottomHandle", event: resizeS },
            { selector: ".topHandle", event: resizeN },
            { selector: ".endHandle", event: resizeE },
            { selector: ".startHandle", event: resizeW },
            { selector: ".nwHandle", event: resizeNW },
            { selector: ".neHandle", event: resizeNE },
            { selector: ".swHandle", event: resizeSW },
            { selector: ".seHandle", event: resizeSE },
            { selector: ".header", event: dragMouseDown },
        ];

        handleBindings.forEach(({ selector, event }) => {
            const handle = element.querySelector(selector);
            if (handle) {
                handle.onmousedown = event;
                handle.ontouchstart = event;
            }
        });

        let buttons = element.querySelectorAll(".headerButton");
        buttons.forEach((e) => {
            e.onmousedown = preventDrag;
            e.ontouchstart = preventDrag;
        });
    } else {
        element.onmousedown = dragMouseDown;
        element.ontouchstart = dragMouseDown;
    }

    function resizeS(e) {
        action = 'resize-s';
        dragMouseDown(e);
    }
    function resizeN(e) {
        action = 'resize-n';
        dragMouseDown(e);
    }
    function resizeE(e) {
        action = 'resize-e';
        dragMouseDown(e);
    }
    function resizeW(e) {
        action = 'resize-w';
        dragMouseDown(e);
    }
    function resizeNW(e) {
        action = 'resize-nw';
        dragMouseDown(e);
    }
    function resizeNE(e) {
        action = 'resize-ne';
        dragMouseDown(e);
    }
    function resizeSW(e) {
        action = 'resize-sw';
        dragMouseDown(e);
    }
    function resizeSE(e) {
        action = 'resize-se';
        dragMouseDown(e);
    }
    function preventDrag(e) {
        action = 'dontmove';
        dragMouseDown(e);
    }

    function dragMouseDown(e) {
        if (action == 'idle') {
            action = 'move';
        }
        e = e || window.event;
        e.preventDefault();
        pos3 = (e.type === 'touchstart') ? e.changedTouches[0].clientX : e.clientX;
        pos4 = (e.type === 'touchstart') ? e.changedTouches[0].clientY : e.clientY;
        document.onmouseup = closeDragElement;
        document.ontouchend = closeDragElement;
        document.onmousemove = elementDrag;
        document.ontouchmove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        let positionX = (e.type === 'touchmove') ? e.changedTouches[0].clientX : e.clientX;
        let positionY = (e.type === 'touchmove') ? e.changedTouches[0].clientY : e.clientY;

        pos1 = pos3 - positionX;
        pos2 = pos4 - positionY;
        pos3 = positionX;
        pos4 = positionY;

        if (action !== 'dontmove') {
            if (action !== 'resize-w' && action !== 'resize-e') {
                element.style.top = (element.offsetTop - pos2) + "px";
            }
            if (action !== 'resize-n' && action !== 'resize-s') {
                element.style.left = (element.offsetLeft - pos1) + "px";
            }
        }

        if (action !== 'move') {
            if (action === 'resize-n' || action === 'resize-nw' || action === 'resize-ne') {
                if (element.clientHeight + pos2 >= minHeight && offsetY >= 0) {
                    element.style.height = `${element.clientHeight + pos2}px`;
                } else {
                    element.style.height = `${minHeight}px`;
                    element.style.top = `${element.offsetTop + pos2}px`;
                    offsetY += pos2;
                }
            }
            if (action === 'resize-s' || action === 'resize-sw' || action === 'resize-se') {
                if (element.clientHeight - pos2 >= minHeight && offsetY <= 0) {
                    element.style.top = `${element.offsetTop + pos2}px`;
                    element.style.height = `${element.clientHeight - pos2}px`;
                } else {
                    element.style.height = `${minHeight}px`;
                    element.style.top = `${element.offsetTop + pos2}px`;
                    offsetY += pos2;
                }
            }
            if (action === 'resize-w' || action === 'resize-nw' || action === 'resize-sw') {
                if (element.clientWidth + pos1 >= minWidth && offsetX >= 0) {
                    element.style.width = (element.clientWidth + pos1) + "px";
                } else {
                    element.style.width = `${minWidth}px`;
                    element.style.left = (element.offsetLeft + pos1) + "px";
                    offsetX += pos1;
                }
            }
            if (action === 'resize-e' || action === 'resize-ne' || action === 'resize-se') {
                if (element.clientWidth - pos1 >= minWidth && offsetX <= 0) {
                    element.style.left = (element.offsetLeft + pos1) + "px";
                    element.style.width = (element.clientWidth - pos1) + "px";
                } else {
                    element.style.width = `${minWidth}px`;
                    element.style.left = (element.offsetLeft + pos1) + "px";
                    offsetX += pos1;
                }
            }
        }
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.ontouchup = null;
        document.onmousemove = null;
        document.ontouchmove = null;
        action = 'idle';
        offsetX = 0;
        offsetY = 0;
    }
}
