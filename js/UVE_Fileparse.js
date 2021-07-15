var JSON;
var desiredColumns = ["REFERENCE", "AMOUNT", "ITEM TEXT"];

$(window).on('load', function () {
    //File Upload and Read
    var fileSelector = document.getElementById("file-selector");
    fileSelector.addEventListener('change', (event) => {
        $("table").empty();
        $('.tableContent').css("display", "none");
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
        $("table").empty();
        $('.tableContent').css("display", "none");
        var fileList = event.dataTransfer.files;
        readCSV(fileList[0]);
    });

})

function readCSV(file) {
    // Check if the file is CSV format
    if (file.name.slice(file.name.length - 4, file.name.length) != ".XLS") {
        console.log('File is not XLS format.');
    } else {
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function (event) {
            //Read the Excel File data.
            var workbook = XLSX.read(event.target.result, {
                type: 'binary'
            });

            //Fetch the name of First Sheet.
            var firstSheet = workbook.SheetNames[0];

            //Read all rows from First Sheet into an JSON array.
            JSON = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);

            console.log(JSON[3][Object.keys(JSON[0])[4]]);

            var html = '';

            //Table Header
            html += '<thead><tr>\r\n';
            for (var key in Object.keys(JSON[0])) {
                console.log(key);
                if (desiredColumns.includes(JSON[0][Object.keys(JSON[0])[key]])) {
                    if (JSON[0][Object.keys(JSON[0])[key]] == "REFERENCE")
                        html += '<td>' + "INVOICE NUMBER" + '</td>\r\n';
                    else if (JSON[0][Object.keys(JSON[0])[key]] == "ITEM TEXT")
                        html += '<td>' + "VENDOR NAME" + '</td>\r\n';
                    else
                        html += '<td>' + JSON[0][Object.keys(JSON[0])[key]] + '</td>\r\n';
                }
            }
            html += '</tr></thead>\r\n';
            //Table Content
            for (var obj in JSON) {
                html += '<tr>\r\n';
                console.log(JSON[obj]);
                for (var key in Object.keys(JSON[obj])) {
                    if (desiredColumns.includes(JSON[0][Object.keys(JSON[0])[key]]) && obj != 0) {
                        html += '<td>' + JSON[obj][Object.keys(JSON[0])[key]] + '</td>\r\n';
                    }
                }
                html += '</tr>\r\n';

            }
            $('#contents').html(html);
            $('#invoice').css("display", "block");
        };
        reader.onerror = function () { alert('Unable to read ' + file.fileName); };
    }
}