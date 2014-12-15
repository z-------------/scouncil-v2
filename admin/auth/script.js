var availableModules = ["member-list", "news-stream", "email-form", "social-links"];

var xhr = function(url,callback) {
    var oReq = new XMLHttpRequest();
    oReq.onload = function(){
        var response = this.responseText;
        callback(response);
    };
    oReq.open("get", url, true);
    oReq.send();
};

var fileList = document.querySelector("#file-list");
var fileListItems = fileList.querySelectorAll("li");

var moduleList = document.querySelector("#module-list");

var editorElem = document.querySelector("#editor");
var saveButton = document.querySelector("#save");
var clearButton = document.querySelector("#clear");

availableModules.forEach(function(moduleName){
    var moduleListItem = document.createElement("li");
    moduleListItem.textContent = moduleName;
    
    moduleListItem.addEventListener("click", function(){
        wysiEditor.focus();
        wysiEditor.composer.commands.exec("insertHTML", "<div class='module " + moduleName + "'></div>");
    });
    
    moduleList.appendChild(moduleListItem);
});

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
});

saveButton.addEventListener("click", function(){
    var value = wysiEditor.getValue();
    if (value) {
        xhrURL = "/py/update_file.py?data=" + encodeURIComponent(value) + "&fname=" + encodeURIComponent(editorElem.dataset.filename);
        xhr(xhrURL, function(response){
            var STATUS_OK = "OK";
            var STATUS_ERROR = "ERROR";

            alert(response);
        });
    }
});

clearButton.addEventListener("click", function(){
    var really = confirm("Are you sure you want to clear this file?");
    if (really) {
        wysiEditor.focus();
        wysiEditor.clear();
    }
});

/* initialise wysihtml editor */
wysihtml5ParserRules.tags.div = {remove: 0};

var wysiEditor = new wysihtml5.Editor("editor", {
    toolbar: "toolbar",
    parserRules:  wysihtml5ParserRules,
    cleanUp: false
});