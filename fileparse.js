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
    // Check if the file is CSV format
    if (file.name.slice(file.name.length - 4, file.name.length) != ".csv") {
        console.log('File is not CSV format.');
    } else {
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (event) {
            var csv = event.target.result;
            var JSON = $.csv.toObjects(csv);
            console.log(JSON);
            var html = '';
            
            //Table Header
            html += '<thead><tr>\r\n';
            for(var key in Object.keys(JSON[0])){
                html += '<td>' + Object.keys(JSON[0])[key] + '</td>\r\n';
            }
            html += '</tr></thead>\r\n';
            //Table Content
            for(var obj in JSON){
                html += '<tr>\r\n';
                for (var item in JSON[obj]) {
                    html += '<td>' + JSON[obj][item] + '</td>\r\n';
                }
                html += '</tr>\r\n';
                console.log(JSON[obj]["Pick location"]);
            }
            $('#contents').html(html);
        };
        reader.onerror = function () { alert('Unable to read ' + file.fileName); };
    }
}