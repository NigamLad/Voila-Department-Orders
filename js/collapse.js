$(window).on('load', function () {
    //$("#dataPreview").bind("DOMSubtreeModified", function () {
        var coll = document.getElementsByClassName("collapsible");
        for (var x = 0; x < coll.length; x++) {
            for (i = 0; i < coll.length; i++) {
                coll[i].addEventListener("click", function () {
                    this.classList.toggle("active");
                    var content = this.nextElementSibling;
                    if (content.style.display === "block") {
                        content.style.display = "none";
                    } else {
                        content.style.display = "block";
                    }
                });
            }
        }
    //})
})