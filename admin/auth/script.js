var xhr = function(url,callback) {
    var oReq = new XMLHttpRequest();
    oReq.onload = function(){
        var response = this.responseText;
        callback(response);
    };
    oReq.open("get", url, true);
    oReq.send();
};

var fileList = document.querySelector(".file-list");
var fileListItems = document.querySelectorAll(".file-list li");

var codeEditor = document.querySelector("#code-editor");
var saveButton = document.querySelector("#save");

[].slice.call(fileListItems).forEach(function(fileListItem){
    fileListItem.addEventListener("click", function(){
        var that = this;
        xhr(location.protocol + "//" + location.host + "/admin/content/" + this.textContent, function(response){
            codeEditor.value = response;
            codeEditor.dataset.filename = that.textContent;
        });
    });
    
    saveButton.addEventListener("click", function(){
        if (codeEditor.value) {
            xhrURL = "/py/update_file.py?data=" + encodeURIComponent(codeEditor.value) + "&fname=" + encodeURIComponent(codeEditor.dataset.filename);
            xhr(xhrURL, function(r){
                console.log(r);
            });
        }
    });
});