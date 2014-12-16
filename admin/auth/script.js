var availableModules = ["member-list", "news-stream", "email-form", "social-links"];

var hrTags = {
    h1: "Header 1",
    h2: "Header 2",
    h3: "Header 3",
    h4: "Header 4",
    h5: "Header 5",
    h6: "Header 6",
    p: "Paragraph",
    img: "Image",
    ul: "Bullet list",
    ol: "Numbered list"
};

var xhr = function(url,callback) {
    var oReq = new XMLHttpRequest();
    oReq.onload = function(){
        var response = this.responseText;
        callback(response);
    };
    oReq.open("get", url, true);
    oReq.send();
};

var toArray = function(fakeArray) {
    return [].slice.call(fakeArray);
};

var fileList = document.querySelector("#file-list");
var fileListItems = fileList.querySelectorAll("li");

var moduleList = document.querySelector("#module-list");

var editorElem = document.querySelector("#editor");
var saveButton = document.querySelector("#save");
var clearButton = document.querySelector("#clear");

var really = function(str, callback) {
    var confirmVal = confirm(str);
    callback(confirmVal);
};

var writeEditor = function(h, fileName, append) {
    var dom = document.createElement("body");
    dom.innerHTML = h;

    if (append !== true) editorElem.innerHTML = "";
    if (fileName) editorElem.dataset.fileName = fileName;
    
    editorElem.dataset.origHtml = h;

    toArray(dom.children).forEach(function(elem){
        var tagName = elem.tagName.toLowerCase();
        var tagNameHr = tagName;
        var html = elem.innerHTML;
        var textContent = elem.textContent;

        if (tagName in hrTags) {
            tagNameHr = hrTags[tagName];
        }
        
        var listElem = document.createElement("li");
        listElem.dataset.tagName = tagName;
        listElem.innerHTML = "<h2>" + tagNameHr + "</h2><h3></h3><p></p>";

        listElem.dataset.html = html;
        listElem.querySelectorAll("p")[0].textContent = textContent;
        
        if (tagName === "img") {
            listElem.innerHTML += "<img src='" + elem.src + "'>";
        }
        
        if (elem.getAttribute("src")) listElem.dataset.src = elem.getAttribute("src");
        
        if (elem.classList.contains("module")) {
            listElem.querySelectorAll("h3")[0].textContent = elem.classList.toString();
        }

        listElem.addEventListener("click", function(){
            var oldHTML = this.dataset.html;
            var newHTML = prompt("Editing '" + this.dataset.tagName + "'", this.dataset.html);

            if (newHTML !== null) {
                this.dataset.html = newHTML;
                this.querySelector("p").innerHTML = newHTML;
            }
        });

        editorElem.appendChild(listElem);
    });
}

availableModules.forEach(function(moduleName){
    var moduleListItem = document.createElement("li");
    moduleListItem.textContent = moduleName;
    
    moduleListItem.addEventListener("click", function(){
        writeEditor("<div class='module " + moduleName + "'></div>", null, true);
    });
    
    moduleList.appendChild(moduleListItem);
});

toArray(fileListItems).forEach(function(fileListItem){
    fileListItem.addEventListener("click", function(){
        var that = this;
        
        toArray(fileListItems).forEach(function(listItem){
            listItem.classList.remove("current");
        });
        this.classList.add("current");
        
        xhr(location.protocol + "//" + location.host + "/admin/content/" + this.textContent, function(response){
            writeEditor(response, that.textContent);
        });
    });
});

saveButton.addEventListener("click", function(){
    var fileName = editorElem.dataset.fileName;
    var really = confirm("Are you sure you want to overwrite '" + fileName + "'?");
    if (really) {
        var value = "";
        
        var listElems = document.querySelectorAll("#editor li");
        toArray(listElems).forEach(function(listElem){
            var tagName = listElem.dataset.tagName;
            var html = listElem.dataset.html;
            
            var classes = "";
            if (listElem.getAttribute("class")) classes = listElem.getAttribute("class");
            
            var src = "";
            if (listElem.dataset.src) src = " src='" + listElem.dataset.src + "'";
            
            value += "<" + tagName + " class='" + classes + "'" + src + ">" + html + "</" + tagName + ">";
        });

        xhrURL = "/py/update_file.py?data=" + encodeURIComponent(value) + "&fname=" + encodeURIComponent(fileName);
        xhr(xhrURL, function(response){
            alert(response);
        });
    }
});

clearButton.addEventListener("click", function(){
    var really = confirm("Are you sure you want to delete everything from '" + editorElem.dataset.fileName + "'?");
    if (really) {
        editorElem.innerHTML = "";
    }
});

reset.addEventListener("click", function(){
    var really = confirm("Are you sure you want to reset '" + editorElem.dataset.fileName + "' to its previous state?");
    if (really) {
        writeEditor(editorElem.dataset.origHtml, editorElem.dataset.fileName);
    }
});

/* initiliase Sortable */
new Sortable(editorElem, {
    animation: 150,
    draggable: "li",
});