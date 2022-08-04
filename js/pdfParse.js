var DataArr = [];
PDFJS.workerSrc = '';


function ExtractText(input) {
    var fReader = new FileReader();
    fReader.readAsDataURL(input.files[0]);
    console.log(input.files[0]);
    fReader.onloadend = function (event) {
        convertDataURIToBinary(event.target.result);
    }
}

$(window).on('load', function(){
    //File Upload and Read
    var fileSelector = document.getElementById("file-selector");
    fileSelector.addEventListener('change', (event) => {
        $("table").empty();
        $('.tableContent').css("display", "none");
        var fileList = event.target.files;
        ExtractText(fileList[0]);
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
        $("table").empty();
        $('.tableContent').css("display", "none");
        var fileList = event.dataTransfer.files;
        ExtractText(fileList[0]);
    });

})