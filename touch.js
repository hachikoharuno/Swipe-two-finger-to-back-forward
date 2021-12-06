let lastSwipe = 0;
let sensitivity = 0;
let gettingItems = chrome.storage.local.get();
gettingItems.then(onGot, onError);

function onGot(retrieveSettings) {
    sensitivity = retrieveSettings.sensitivity;
    continueCode();
}

function onError(error) {
    console.log(`Error: ${error}`);
}

function continueCode() {
    window.addEventListener("wheel", event => {
        if (Date.now() - lastSwipe > 1000 && (event.deltaX < -sensitivity || event.deltaX > sensitivity)) {
            if (event.deltaX < 0)   { setTransform(0, true)
                window.history.back();
            }
            if (event.deltaX > 0) {
                window.history.forward();
            }
            lastSwipe = Date.now();
        }
    });
}

async function main() {
  let lastContainer = null;
  let lastContainerPosition = 0;
  const containerMoved = element => {
    const scroller = getScrollableParent(element);
    const toReturn = (lastContainer === scroller) && (lastContainerPosition !== scroller.scrollLeft);

    lastContainer = scroller;
    lastContainerPosition = scroller.scrollLeft;
    return toReturn;
  };

  let acc = 0;
  let dir = 0;
  let timeout = null;
  window.addEventListener('wheel', async e => {
    if (e.deltaY || !e.deltaX) {
      acc = -100;
      return;
    };

    if (containerMoved(e.target)) {
      acc = -100;
      return;
    }

    acc += Math.abs(e.deltaX);
    const thisDir = Math.sign(e.deltaX);
    if (dir != thisDir) {
      acc = 0;
      setTransform(0, true)
      dir = thisDir;
    }

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      acc = 0
      setTransform(0, true)
    }, 250);

    let thresholdMove = 100;

    if (acc >= thresholdMove) {
      setTransform((acc - thresholdMove) / (window.innerWidth - thresholdMove) * 100 * -dir)
    }
  });
}

main();

function continueCode() {
    window.addEventListener("wheel", event => {
        if (Date.now() - lastSwipe > 1000 && (event.deltaX < -sensitivity || event.deltaX > sensitivity)) {
            if (event.deltaX < 0) {
                window.history.back();
            }
            if (event.deltaX > 0) {
                window.history.forward();
            }
            lastSwipe = Date.now();
        }
    });
}


function setTransform(value, slow = false) {
  if (slow) {
    document.documentElement.style.transition = 'transform 0.5s'
  } else {
    document.documentElement.style.transition = ''
  }
  document.documentElement.style.transform = `translateX(${value}%)`
  document.documentElement.style.overflowX = 'hidden';
}

function isScrollable(element) {
  const hasScrollableContent = element.scrollWidth > element.clientWidth;

  const overflowX = window.getComputedStyle(element).overflowX;
  const isScrollable = overflowX !== 'visible' && overflowX !== 'hidden';

  return hasScrollableContent && isScrollable && element.clientHeight !== 0;
};
function getScrollableParent(element) {
  if (!element || element === document.documentElement || isScrollable(element)) {
    return element;
  } else {
    return getScrollableParent(element.parentNode);
  }
};
