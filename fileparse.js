window.onload = function () {

    var testElement = document.getElementById("test");

    //File Upload and Read
    var fileSelector = document.getElementById("file-selector");
    fileSelector.addEventListener('change', (event) => {
        var fileList = event.target.files;
        readCSV(fileList[0]);
    })

    var dropArea = document.getElementById('drop-area');
    // Style the drag-and-drop as a "copy file" operation.
    dropArea.addEventListener('dragover', (event) => {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    });
    //Drag Drop event
    dropArea.addEventListener('drop', (event) => {
        event.stopPropagation();
        event.preventDefault();
        var fileList = event.dataTransfer.files;
        readCSV(fileList[0]);
    });

}




function readCSV(file) {
    console.log(file);

    // Check if the file is CSV format
    if (file.name.slice(file.name.length - 4, file.name.length) != ".csv") {
        console.log('File is not CSV format.');
    } else {
        var read = new FileReader();
        read.addEventListener('load', (event) => {
            file.src = event.target.result;
            console.log(event.target.result);
        });
        read.readAsDataURL(file);
        read.onload = function(event){
            var csv = event.target.result;
            console.log(csv);
        }
    }



}