document.getElementById("drop").ondragover = function (e) {
    document.getElementById("txt").innerText = "Śmiało, puszczaj!"
    e.stopPropagation();
    e.preventDefault();
}

document.getElementById("drop").ondragleave = function (e) {
    document.getElementById("txt").innerText = "Przenieś pliki do obszaru z czerwoną ramką!"
    e.stopPropagation();
    e.preventDefault();
}

document.getElementById("drop").ondrop = function (e) {
    document.getElementById("txt").innerText = "Przenieś pliki do obszaru z czerwoną ramką!"
    e.stopPropagation();
    e.preventDefault();

    var files = e.dataTransfer.files;
    console.log(files)
    let fd = new FormData()
    for (let i = 0; i < files.length; i++) {
        fd.append("file" + i, files[i])
    }
    fetch("/uploadAlbum", {
        method: "POST",
        body: fd
    }).then(console.log("Udało się przesłać"))

}