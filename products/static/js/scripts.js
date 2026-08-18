function goToBuyer() {
    const lang = document.getElementById("language").value;
    window.location.href = `/buyer?lang=${lang}`;
}

function goToSeller() {
    const lang = document.getElementById("language").value;
    window.location.href = `/seller?lang=${lang}`;
}

function goBackToHome() {
    const lang = document.getElementById("language").value;
    window.location.href = `/?lang=${lang}`;
}

function goToStores() {
    const lang = document.getElementById("language").value;
    window.location.href = `/stores?lang=${lang}`;
}

