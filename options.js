const sensitivityInput = document.querySelector("#sensitivity");

function storeSettings() {
    browser.storage.local.set({
        sensitivity: sensitivityInput.value
    });
}

function onGot(retrieveSettings) {
    sensitivityInput.value = retrieveSettings.sensitivity;
}

function onError(error) {
    console.log(`Error: ${error}`);
}

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(onGot, onError);

sensitivityInput.addEventListener("blur", storeSettings);
