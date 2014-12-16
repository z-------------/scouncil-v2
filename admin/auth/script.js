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

var really = function(str, callback) {
    var confirmVal = confirm(str);
    callback(confirmVal);
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
        editorElem.innerHTML += "<div class='module " + moduleName + "'></div>";
    });
    
    moduleList.appendChild(moduleListItem);
});

[].slice.call(fileListItems).forEach(function(fileListItem){
    fileListItem.addEventListener("click", function(){
        var that = this;
        
        [].slice.call(fileListItems).forEach(function(listItem){
            listItem.classList.remove("current");
        });
        this.classList.add("current");
        
        xhr(location.protocol + "//" + location.host + "/admin/content/" + this.textContent, function(response){
            editorElem.innerHTML = "";
            editorElem.innerHTML += response;
            
            editorElem.dataset.filename = that.textContent;
        });
    });
});

saveButton.addEventListener("click", function(){
    var fileName = editorElem.dataset.filename;
    var really = confirm("Are you sure you want to overwrite '" + fileName + "'?");
    if (really) {
        var value = editorElem.innerHTML;

        xhrURL = "/py/update_file.py?data=" + encodeURIComponent(value) + "&fname=" + encodeURIComponent(fileName);
        xhr(xhrURL, function(response){
            var STATUS_OK = "OK";
            var STATUS_ERROR = "ERROR";

            alert(response);
        });
    }
});

clearButton.addEventListener("click", function(){
    var really = confirm("Are you sure you want to delete everything from this file?");
    if (really) {
        editorElem.innerHTML = "";
    }
});

/* initiliase Sortable */
new Sortable(fileList, {
    animation: 150, // ms, animation speed moving items when sorting, `0` — without animation
    draggable: "li", // Specifies which items inside the element should be sortable
});