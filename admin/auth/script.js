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

var editorElem = document.querySelector("#editor");
var saveButton = document.querySelector("#save");

[].slice.call(fileListItems).forEach(function(fileListItem){
    fileListItem.addEventListener("click", function(){
        var that = this;
        xhr(location.protocol + "//" + location.host + "/admin/content/" + this.textContent, function(response){
            wysiEditor.focus();
            wysiEditor.clear();
            wysiEditor.composer.commands.exec("insertHTML", response);
            
            editorElem.dataset.filename = that.textContent;
        });
    });
    
    saveButton.addEventListener("click", function(){
        var value = wysiEditor.getValue();
        if (value) {
            xhrURL = "/py/update_file.py?data=" + encodeURIComponent(value) + "&fname=" + encodeURIComponent(editorElem.dataset.filename);
            xhr(xhrURL, function(r){
                console.log(r);
            });
        }
    });
});

var wysiEditor = new wysihtml5.Editor("editor", {
    toolbar: "toolbar",
    parserRules:  wysihtml5ParserRules
});