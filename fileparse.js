var JSON;
var desiredColumns = ["Description", "Pick location", "Ordered Qty"];

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
            JSON = $.csv.toObjects(csv);
            console.log(JSON);
            var html = '';

            //Table Header
            html += '<thead><tr>\r\n';
            for (var key in Object.keys(JSON[0])) {
                if (desiredColumns.includes(Object.keys(JSON[0])[key])) {
                    html += '<td>' + Object.keys(JSON[0])[key] + '</td>\r\n';
                }
            }
            html += '</tr></thead>\r\n';
            //Table Content
            for (var obj in JSON) {
                //Only display 90-C pick orders
                if (JSON[obj]["Pick location"].slice(0, 4) == "90-C") {
                    html += '<tr>\r\n';
                    for (var item in JSON[obj]) {
                        if (desiredColumns.includes(item)) {
                            html += '<td>' + JSON[obj][item] + '</td>\r\n';
                        }
                    }
                    html += '</tr>\r\n';
                }
            }
            $('#contents').html(html);
            $('#contents').css("display", "block");
            generateMeatReport();
            generateProduceReport();
            generateDeliReport();
        };
        reader.onerror = function () { alert('Unable to read ' + file.fileName); };
    }
}

function generateMeatReport() {
    var html = '';
    var empty = true;

    //Table Header
    html += '<thead><tr>\r\n';
    for (var key in Object.keys(JSON[0])) {
        if (desiredColumns.includes(Object.keys(JSON[0])[key])) {
            html += '<td>' + Object.keys(JSON[0])[key] + '</td>\r\n';
        }
    }
    html += '</tr></thead>\r\n';
    //Table Content
    for (var obj in JSON) {
        //Only display Meat Department pick orders
        if (JSON[obj]["Pick location"].includes(["90-C"]) && (JSON[obj]["Pick location"].includes("Fresh Pork")
            || JSON[obj]["Pick location"].includes("Fresh Beef")
            || JSON[obj]["Pick location"].includes("Frsh Chicken/Fowl")
            || JSON[obj]["Pick location"].includes("Meat Processed")
            || JSON[obj]["Pick location"].includes("Seafood - Fresh"))
        ) {
            html += '<tr>\r\n';
            for (var item in JSON[obj]) {
                if (desiredColumns.includes(item)) {
                    html += '<td>' + JSON[obj][item] + '</td>\r\n';
                }
            }
            html += '</tr>\r\n';

            empty = false;
        }
    }

    if (!empty) {
        $('#meatTable').html(html);
        $('#meat').css("display", "block");
    }
}

function generateProduceReport() {
    var html = '';
    var empty = true;

    //Table Header
    html += '<thead><tr>\r\n';
    for (var key in Object.keys(JSON[0])) {
        if (desiredColumns.includes(Object.keys(JSON[0])[key])) {
            html += '<td>' + Object.keys(JSON[0])[key] + '</td>\r\n';
        }
    }
    html += '</tr></thead>\r\n';
    //Table Content
    for (var obj in JSON) {
        //Only display Meat Department pick orders
        if (JSON[obj]["Pick location"].includes(["90-C"]) && (JSON[obj]["Pick location"].includes(["Fresh Fruit"])
            || JSON[obj]["Pick location"].includes(["Fresh Vegetables"])
        )) {
            html += '<tr>\r\n';
            for (var item in JSON[obj]) {
                if (desiredColumns.includes(item)) {
                    html += '<td>' + JSON[obj][item] + '</td>\r\n';
                }
            }
            html += '</tr>\r\n';

            empty = false;
        }
    }

    if (!empty) {
        $('#produceTable').html(html);
        $('#produce').css("display", "block");
    }
}

function generateDeliReport() {
    var html = '';
    var empty = true;

    //Table Header
    html += '<thead><tr>\r\n';
    for (var key in Object.keys(JSON[0])) {
        if (desiredColumns.includes(Object.keys(JSON[0])[key])) {
            html += '<td>' + Object.keys(JSON[0])[key] + '</td>\r\n';
        }
    }
    html += '</tr></thead>\r\n';
    //Table Content
    for (var obj in JSON) {
        console.log("Test: " + JSON[obj]);
        //Only display Meat Department pick orders
        if (JSON[obj]["Pick location"].includes(["90-C"]) &&
            (JSON[obj]["Pick location"].includes(["Deli"])
            )) {
            html += '<tr>\r\n';

            for (var item in JSON[obj]) {
                console.log("Item: ");
                if (desiredColumns.includes(item)) {
                    html += '<td>' + JSON[obj][item] + '</td>\r\n';
                }
            }
            html += '</tr>\r\n';

            empty = false;
        }
    }

    if (!empty) {
        $('#deliTable').html(html);
        $('#deli').css("display", "block");
    }




}