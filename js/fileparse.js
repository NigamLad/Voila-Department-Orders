var JSON;
var meat_PLU_Data;
var seafood_PLU_Data;
var produce_PLU_Data;
var deli_PLU_Data;
var bakery_PLU_Data;
var desiredColumns = ["Description", "Ordered Qty"];
var desiredBakeryColumns = ["Description", "Ordered Qty", "Shipment"];
var desiredEachProduceColumns = ["Description", "Ordered Qty", "Barcodes"];

$(window).on('load', function(){
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

    //Import PLU Data
    $.ajax({
        type: "GET",
        // url: "/Voila-Department-Orders/assets/Voila Meat - Min-Max-Typical.csv",
        url: "/Voila-Department-Orders/assets/AB01 Voila Meat - Min-Max-Typical.csv",
        dataType: "text",
        success: function (data) {
            meat_PLU_Data = $.csv.toObjects(data);
        },
        error: function () {
            $.ajax({
                type: "GET",
                // url: "/assets/Voila Meat - Min-Max-Typical.csv",
                url: "/assets/AB01 Voila Meat - Min-Max-Typical.csv",
                dataType: "text",
                success: function (data) {
                    meat_PLU_Data = $.csv.toObjects(data);
                }
            });
        }
    });
    $.ajax({
        type: "GET",
        // url: "/Voila-Department-Orders/assets/Voila Seafood - Min-Max-Typical.csv",
        url: "/Voila-Department-Orders/assets/AB01 Voila Seafood - Min-Max-Typical.csv",
        dataType: "text",
        success: function (data) {
            seafood_PLU_Data = $.csv.toObjects(data);
        },
        error: function () {
            $.ajax({
                type: "GET",
                // url: "/assets/Voila Seafood - Min-Max-Typical.csv",
                url: "/assets/AB01 Voila Seafood - Min-Max-Typical.csv",
                dataType: "text",
                success: function (data) {
                    seafood_PLU_Data = $.csv.toObjects(data);
                }
            });
        }
    });
    $.ajax({
        type: "GET",
        // url: "/Voila-Department-Orders/assets/Voila Produce - Min-Max-Typical.csv",
        url: "/assets/AB01 Voila Produce - Min-Max-Typical.csv",
        dataType: "text",
        success: function (data) {
            produce_PLU_Data = $.csv.toObjects(data);
        },
        error: function () {
            $.ajax({
                type: "GET",
                // url: "/assets/Voila Produce - Min-Max-Typical.csv",
                url: "assets/AB01 Voila Produce - Min-Max-Typical.csv",
                dataType: "text",
                success: function (data) {
                    produce_PLU_Data = $.csv.toObjects(data);
                }
            });
        }
    });
    $.ajax({
        type: "GET",
        // url: "/Voila-Department-Orders/assets/Voila Deli - Min-Max-Typical.csv",
        url: "/Voila-Department-Orders/assets/AB01 Voila Deli - Min-Max-Typical.csv",
        dataType: "text",
        success: function (data) {
            deli_PLU_Data = $.csv.toObjects(data);
        },
        error: function () {
            $.ajax({
                type: "GET",
                // url: "/assets/Voila Deli - Min-Max-Typical.csv",
                url: "assets/AB01 Voila Deli - Min-Max-Typical.csv",
                dataType: "text",
                success: function (data) {
                    deli_PLU_Data = $.csv.toObjects(data);
                }
            });
        }
    });
    $.ajax({
        type: "GET",
        url: "/Voila-Department-Orders/assets/ISB Breads and Rolls Store Scale Book West.csv",
        dataType: "text",
        success: function (data) {
            bakery_PLU_Data_PLU_Data = $.csv.toObjects(data);
        },
        error: function () {
            $.ajax({
                type: "GET",
                url: "assets/ISB Breads and Rolls Store Scale Book West.csv",
                dataType: "text",
                success: function (data) {
                    bakery_PLU_Data = $.csv.toObjects(data);
                }
            });
        }
    });

})

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
                //Only display 90-C pick orders and Department specific picks
                if (JSON[obj]["Pick location"].slice(0, 4) == "90-C"
                    || JSON[obj]["Pick location"].includes(["65-L-00-00-Instore Bakery Brd and Rolls"])
                    || JSON[obj]["Pick location"].includes(["80-L-00-00-Bento Sushi"])) {
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
            $('#allData').css("display", "block");
            generateMeatReport();
            generateSeafoodReport();
            generateWeightedProduceReport();
            generateEachProduceReport();
            generateDeliReport();
            generateBakeryReport();
            generateSushiReport();
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
    html += '<td>PLU</td>\r\n';
    html += '<td><img src="/Voila-Department-Orders/assets/checkbox-icon.png" width="15" height="15"></td>\r\n';
    html += '</tr></thead>\r\n';
    //Table Content
    for (var obj in JSON) {
        //Only display Meat Department pick orders
        if (JSON[obj]["Pick location"].includes(["90-C"]) &&
            (JSON[obj]["Pick location"].includes("Fresh Pork")
                || JSON[obj]["Pick location"].includes("Fresh Beef")
                || JSON[obj]["Pick location"].includes("Frsh Chicken/Fowl")
                || JSON[obj]["Pick location"].includes("Meat Processed")
                || JSON[obj]["Pick location"].includes("Fresh Turkey")
                || JSON[obj]["Pick location"].includes("Fresh Lamb")
            )
        ) {
            //Get PLU for current item
            var PLU;
            for (var item in meat_PLU_Data) {
                if (meat_PLU_Data[item].Article == JSON[obj]["Product"].slice(0, JSON[obj]["Product"].length - 2)) {
                    PLU = meat_PLU_Data[item].PLU;
                }
            }

            html += '<tr>\r\n';
            for (var item in JSON[obj]) {
                if (desiredColumns.includes(item)) {
                    html += '<td>' + JSON[obj][item] + '</td>\r\n';
                }
            }
            html += '<td>' + PLU + '</td>\r\n';
            html += '<td id = "checkBox"></td>\r\n';
            html += '</tr>\r\n';
            empty = false;
        }
    }

    if (!empty) {
        $('#meatTable').html(html);
        $('#meat').css("display", "block");
    }
}

function generateSeafoodReport() {
    var html = '';
    var empty = true;

    //Table Header
    html += '<thead><tr>\r\n';
    for (var key in Object.keys(JSON[0])) {
        if (desiredColumns.includes(Object.keys(JSON[0])[key])) {
            html += '<td>' + Object.keys(JSON[0])[key] + '</td>\r\n';
        }
    }
    html += '<td>PLU</td>\r\n';
    html += '<td><img src="/Voila-Department-Orders/assets/checkbox-icon.png" width="15" height="15"></td>\r\n';
    html += '</tr></thead>\r\n';
    //Table Content
    for (var obj in JSON) {
        //Only display Meat Department pick orders
        if (JSON[obj]["Pick location"].includes(["90-C"])
            && JSON[obj]["Pick location"].includes("Seafood Fresh")
        ) {
            //Get PLU for current item
            var PLU;
            for (var item in seafood_PLU_Data) {
                if (seafood_PLU_Data[item].Article == JSON[obj]["Product"].slice(0, JSON[obj]["Product"].length - 2)) {
                    PLU = seafood_PLU_Data[item].PLU;
                }
            }

            html += '<tr>\r\n';
            for (var item in JSON[obj]) {
                if (desiredColumns.includes(item)) {
                    html += '<td>' + JSON[obj][item] + '</td>\r\n';
                }
            }
            html += '<td>' + PLU + '</td>\r\n';
            html += '<td id = "checkBox"></td>\r\n';
            html += '</tr>\r\n';
            empty = false;
        }
    }

    if (!empty) {
        $('#seafoodTable').html(html);
        $('#seafood').css("display", "block");
    }
}

function generateWeightedProduceReport() {
    var html = '';
    var empty = true;

    //Table Header
    html += '<thead><tr>\r\n';
    for (var key in Object.keys(JSON[0])) {
        if (desiredColumns.includes(Object.keys(JSON[0])[key])) {
            html += '<td>' + Object.keys(JSON[0])[key] + '</td>\r\n';
        }
    }
    html += '<td>PLU</td>\r\n';
    html += '<td><img src="/Voila-Department-Orders/assets/checkbox-icon.png" width="15" height="15"></td>\r\n';
    html += '</tr></thead>\r\n';
    //Table Content
    for (var obj in JSON) {
        //Only display Produce Department pick orders
        if (JSON[obj]["Pick location"].includes(["90-C"])
            && (JSON[obj]["Pick location"].includes(["Fresh Fruit"])
                || JSON[obj]["Pick location"].includes(["Fresh Vegetables"])
                || JSON[obj]["Pick location"].includes(["Prepared Fruits and Vegetables"])
            )) {
            //Get PLU for current item
            var PLU;
            for (var item in produce_PLU_Data) {
                if (produce_PLU_Data[item].Article == JSON[obj]["Product"].slice(0, JSON[obj]["Product"].length - 2)) {
                    PLU = produce_PLU_Data[item].PLU;
                }
            }

            html += '<tr>\r\n';
            for (var item in JSON[obj]) {
                if (desiredColumns.includes(item)) {
                    html += '<td>' + JSON[obj][item] + '</td>\r\n';
                }
            }

            html += '<td>' + PLU + '</td>\r\n';
            html += '<td id = "checkBox"></td>\r\n';
            html += '</tr>\r\n';
            empty = false;
        }
    }

    if (!empty) {
        $('#weightedProduceTable').html(html);
        $('#weightedProduce').css("display", "block");
    }
}

function generateEachProduceReport() {
    var html = '';
    var empty = true;

    //Table Header
    html += '<thead><tr>\r\n';
    for (var key in Object.keys(JSON[0])) {
        if (desiredEachProduceColumns.includes(Object.keys(JSON[0])[key])) {
            html += '<td>' + Object.keys(JSON[0])[key] + '</td>\r\n';
        }
    }
    html += '<td><img src="/Voila-Department-Orders/assets/checkbox-icon.png" width="15" height="15"></td>\r\n';
    html += '</tr></thead>\r\n';
    //Table Content
    for (var obj in JSON) {
        //Only display Produce Department pick orders
        if ((JSON[obj]["Pick location"].includes(["60-L"]) || JSON[obj]["Pick location"].includes(["00-C"]))
            && (JSON[obj]["Pick location"].includes(["Fresh Fruit"])
                || JSON[obj]["Pick location"].includes(["Fresh Vegetables"])
                || JSON[obj]["Pick location"].includes(["Value Added Prod"])
            )) {

            html += '<tr>\r\n';
            for (var item in JSON[obj]) {
                if (desiredEachProduceColumns.includes(item)) {
                    if(item == 'Barcodes'){
                        var barcodes = JSON[obj][item].split(", ");
                        for(var x = 0; x < barcodes.length; x++){
                            if(barcodes[x].length == 12){
                                html += '<td><svg class="barcode-' + barcodes[x] + '"></svg></td>\r\n';
                                break;
                            }
                        }
                    } else
                        html += '<td>' + JSON[obj][item] + '</td>\r\n';
                }
            }
            
            html += '<td id = "checkBox"></td>\r\n';
            html += '</tr>\r\n';
            empty = false;
        }
    }

    if (!empty) {
        $('#eachProduceTable').html(html);
        $('#eachProduce').css("display", "block");
        for (var obj in JSON) {
            if ((JSON[obj]["Pick location"].includes(["60-L"]) || JSON[obj]["Pick location"].includes(["00-C"]))
            && (JSON[obj]["Pick location"].includes(["Fresh Fruit"])
                || JSON[obj]["Pick location"].includes(["Fresh Vegetables"])
                || JSON[obj]["Pick location"].includes(["Value Added Prod"])
            )) {
                for (var item in JSON[obj]) {
                    if (desiredEachProduceColumns.includes(item)) {
                        if(item == 'Barcodes'){
                            var barcodes = JSON[obj][item].split(", ");
                            for(var x = 0; x < barcodes.length; x++){
                                if(barcodes[x].length == 12){
                                    JsBarcode(".barcode-" + barcodes[x], barcodes[x], {format: "upc"})
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
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
    html += '<td>PLU</td>\r\n';
    html += '<td><img src="/Voila-Department-Orders/assets/checkbox-icon.png" width="15" height="15"></td>\r\n';
    html += '</tr></thead>\r\n';
    //Table Content
    for (var obj in JSON) {
        //Only display Deli Department pick orders
        if ((JSON[obj]["Pick location"].includes(["90-C"]) && (
                JSON[obj]["Pick location"].includes(["Deli"])
            )) || (JSON[obj]["Pick location"].includes(["Chilled Entrees"]))
            ) {
            //Get PLU for current item
            var PLU;
            for (var item in deli_PLU_Data) {
                if (deli_PLU_Data[item].Article == JSON[obj]["Product"].slice(0, JSON[obj]["Product"].length - 2)) {
                    PLU = deli_PLU_Data[item].PLU;
                }
            }

            html += '<tr>\r\n';

            for (var item in JSON[obj]) {
                if (desiredColumns.includes(item)) {
                    html += '<td>' + JSON[obj][item] + '</td>\r\n';
                }
            }
            html += '<td>' + PLU + '</td>\r\n';
            html += '<td id = "checkBox"></td>\r\n';
            html += '</tr>\r\n';

            empty = false;
        }
    }

    if (!empty) {
        $('#deliTable').html(html);
        $('#deli').css("display", "block");
    }
}

function generateBakeryReport() {
    var html = '';
    var empty = true;

    //Table Header
    html += '<thead><tr>\r\n';
    for (var key in Object.keys(JSON[0])) {
        if (desiredBakeryColumns.includes(Object.keys(JSON[0])[key])) {
            html += '<td>' + Object.keys(JSON[0])[key] + '</td>\r\n';
        }
    }
    //html += '<td>PLU</td>\r\n';
    html += '<td><img src="/Voila-Department-Orders/assets/checkbox-icon.png" width="15" height="15"></td>\r\n';
    html += '</tr></thead>\r\n';
    //Table Content
    for (var obj in JSON) {
        //Only display Bakery Department pick orders
        if (JSON[obj]["Pick location"].includes(["65-L-00-00-Instore Bakery Brd and Rolls"])
             || JSON[obj]["Pick location"].includes(["65-L-00-00-Instore Bakery Croissant"])
             || JSON[obj]["Pick location"].includes(["65-L-00-00-Instore Bakery Swt Treats"])
             || JSON[obj]["Pick location"].includes(["00-C-00-00-Instore Bakery Brd and Rolls"])
            ) {
            // //Get PLU for current item
            // var PLU;
            // for (var item in deli_PLU_Data) {
            //     if (deli_PLU_Data[item].Article == JSON[obj]["Product"].slice(0, JSON[obj]["Product"].length - 2)) {
            //         PLU = deli_PLU_Data[item].PLU;
            //     }
            // }

            html += '<tr>\r\n';

            for (var item in JSON[obj]) {
                if (desiredBakeryColumns.includes(item)){
                    if(item == "Shipment")
                        html += '<td>' + JSON[obj][item].slice(0,5) + '</td>\r\n';
                    else
                        html += '<td>' + JSON[obj][item] + '</td>\r\n';
                }
            }
            //html += '<td>' + PLU + '</td>\r\n';
            html += '<td id = "checkBox"></td>\r\n';
            html += '</tr>\r\n';

            empty = false;
        }
    }

    if (!empty) {
        $('#bakeryTable').html(html);
        $('#bakery').css("display", "block");
    }
}

function generateSushiReport() {
    var html = '';
    var empty = true;

    //Table Header
    html += '<thead><tr>\r\n';
    for (var key in Object.keys(JSON[0])) {
        if (desiredColumns.includes(Object.keys(JSON[0])[key])) {
            html += '<td>' + Object.keys(JSON[0])[key] + '</td>\r\n';
        }
    }
    //html += '<td>PLU</td>\r\n';
    html += '<td><img src="/Voila-Department-Orders/assets/checkbox-icon.png" width="15" height="15"></td>\r\n';
    html += '</tr></thead>\r\n';
    //Table Content
    for (var obj in JSON) {
        //Only display Sushi Department pick orders
        if (JSON[obj]["Pick location"].includes(["80-L-00-00-Bento Sushi"])) {
            // //Get PLU for current item
            // var PLU;
            // for (var item in deli_PLU_Data) {
            //     if (deli_PLU_Data[item].Article == JSON[obj]["Product"].slice(0, JSON[obj]["Product"].length - 2)) {
            //         PLU = deli_PLU_Data[item].PLU;
            //     }
            // }

            html += '<tr>\r\n';

            for (var item in JSON[obj]) {
                if (desiredColumns.includes(item)) {
                    html += '<td>' + JSON[obj][item] + '</td>\r\n';
                }
            }
            //html += '<td>' + PLU + '</td>\r\n';
            html += '<td id = "checkBox"></td>\r\n';
            html += '</tr>\r\n';

            empty = false;
        }
    }

    if (!empty) {
        $('#sushiTable').html(html);
        $('#sushi').css("display", "block");
    }
}
