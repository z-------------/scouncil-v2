var availableModules = ["member-list", "news-stream", "email-form", "social-links"];
var noEditTags = ["img"];
var hrTags = {
    h1: "Header 1",
    h2: "Header 2",
    h3: "Header 3",
    h4: "Header 4",
    h5: "Header 5",
    h6: "Header 6",
    p: "Paragraph",
    img: "Image",
    ul: "Unordered list",
    ol: "Ordered list",
    div: "HTML block"
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
var newFileBtn = document.querySelector("#new-file");

var really = function(str, callback) {
    var confirmVal = confirm(str);
    callback(confirmVal);
};

var updateCodeBlock = function(elem, html) {
    elem.dataset.html = html;
    elem.querySelector(".content").innerHTML = html;
};

var clearEditor = function() {
    editorElem.innerHTML = "";
}

var writeEditor = function(h, fileName, append) {
    var dom = document.createElement("body");
    dom.innerHTML = h;

    if (append !== true) clearEditor();
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
        listElem.innerHTML = "<div class='tagname'>" + tagNameHr + "</div><div class='attrlist'></div><div class='modulename'></div><p class='content'></p>\
<div class='controls'>\
<button class='control edit'>Edit</button>\
<button class='control remove'>Remove</button>\
</div>\
<div class='dragger'></div>";

        listElem.dataset.html = html;
        listElem.querySelectorAll(".content")[0].textContent = textContent;
        
        var attributes = [].slice.call(elem.attributes).filter(function(attr){return attr.nodeName.toLowerCase() !== "class"});
        var attributesElem = listElem.querySelectorAll(".attrlist")[0];
        attributes.forEach(function(attr){
            var key = attr.nodeName;
            var val = attr.value;
            
            attributesElem.innerHTML += "<div class='attr-container'>\
<span>" + key + "</span>\
<input data-attrname='" + key + "' value='" + val + "'>\
</div>";
        });
        
        if (tagName === "img") {
            listElem.querySelectorAll(".content")[0].innerHTML += "<img src='" + elem.src + "'>";
        }
        
        if (elem.getAttribute("src")) listElem.dataset.src = elem.getAttribute("src");
        
        if (elem.classList.contains("module")) {
            listElem.querySelectorAll(".modulename")[0].textContent = elem.classList.toString();
        }
        
        var editButton = listElem.querySelector(".control.edit");
        var removeButton = listElem.querySelector(".control.remove");
        
        if (elem.classList.contains("module") || noEditTags.indexOf(tagName) !== -1) {
            editButton.style.display = "none";
        } else {
            editButton.addEventListener("click", function(){
                var liElem = this.parentElement.parentElement;
                
                var oldHTML = liElem.dataset.html;
                var newHTML = prompt("Editing '" + liElem.dataset.tagName + "'", liElem.dataset.html);

                if (newHTML !== null) {
                    updateCodeBlock(liElem, newHTML);
                }
            });
        }
        
        removeButton.addEventListener("click", function(){
            var liElem = this.parentElement.parentElement;
            liElem.parentElement.removeChild(liElem);
        });

        editorElem.appendChild(listElem);
    });
}

availableModules.forEach(function(moduleName){
    var moduleListItem = document.createElement("li");
    moduleListItem.textContent = moduleName;
    
    moduleListItem.addEventListener("click", function(){
        if (editorElem.dataset.fileName) {
            writeEditor("<div class='module " + moduleName + "'></div>", null, true);
        }
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
        
        clearEditor();
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
            var attrs = [];
            
            var attrElems = [].slice.call(listElem.querySelectorAll(".attrlist input[data-attrname]"));
            attrElems.forEach(function(attrElem){
                var key = attrElem.dataset.attrname;
                var val = attrElem.value;
                
                attrs.push(key + "='" + val + "'");
            });
            
            if (listElem.querySelectorAll(".modulename")[0].textContent) {
                classes = listElem.querySelectorAll(".modulename")[0].textContent;
            }
            
            value += "<" + tagName + " class='" + classes + "' " + attrs.join(" ") + ">" + html + "</" + tagName + ">";
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
        clearEditor();
    }
});

newFileBtn.addEventListener("click", function(){
    var filename = prompt("File name (anything you want)", "newpage.html");
    if (filename) {
        xhrURL = "/py/new_file.py?fname=" + encodeURIComponent(filename);
        xhr(xhrURL, function(response){
            alert(response);
        });
    } else {
        alert("You need to specify a file name");
    }
});

/*reset.addEventListener("click", function(){
    var really = confirm("Are you sure you want to reset '" + editorElem.dataset.fileName + "' to its previous state?");
    if (really) {
        writeEditor(editorElem.dataset.origHtml, editorElem.dataset.fileName);
    }
});*/

/* initiliase Sortable */
new Sortable(editorElem, {
    animation: 150,
    draggable: "li",
    handle: ".dragger"
});