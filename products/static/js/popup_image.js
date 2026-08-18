function showLargeImagePopup(imageData) {
    let img = new Image();
    img.src = imageData;
    img.style.maxWidth = "90vw";
    img.style.maxHeight = "90vh";
    img.style.display = "block";
    img.style.margin = "auto";
    img.style.borderRadius = "10px";

    let overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.8)";
    overlay.style.zIndex = 10000;
    overlay.onclick = () => document.body.removeChild(overlay);
    overlay.appendChild(img);
    document.body.appendChild(overlay);
}