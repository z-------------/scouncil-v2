var xhr = function(url, callback) {
    var oReq = new XMLHttpRequest();
    oReq.onload = function(){
        var response = this.responseText;
        callback(response);
    };
    oReq.open("get", url, true);
    oReq.send();
};

document.addEventListener("DOMContentLoaded", function(){
    var memberUL = document.querySelector("#member-list");

    var members = [{
        name: "Dennis Lui",
        role: "Chairperson",
        cabinet: "general",
        photo: "img/members/dennis.jpg"
    }, {
        name: "Cedric Li",
        role: "Vice Chairperson",
        cabinet: "general",
        photo: "img/members/cedric.jpg"
    }, {
        name: "Christy Tsang",
        role: "Vice Chairperson",
        cabinet: "general",
        photo: "img/members/christy.jpg"
    }, {
        name: "Helen Wong",
        role: "Secretary",
        cabinet: "general",
        photo: "img/members/helen.jpg"
    }, {
        name: "Laurel Lee",
        role: "Treasurer",
        cabinet: "general",
        photo: "img/members/laurel.jpg"
    }, {
        name: "Henry Lui",
        role: "Chief of Communications",
        cabinet: "general",
        photo: "img/members/henry.jpg"
    }, {
        name: "Lorem Ipsum",
        role: "Chairperson",
        cabinet: "apprentice",
        photo: "//placehold.it/150x150"
    }, {
        name: "Lorem Ipsum",
        role: "Vice Chairperson",
        cabinet: "apprentice",
        photo: "//placehold.it/150x150"
    }, {
        name: "Lorem Ipsum",
        role: "Vice Chairperson",
        cabinet: "apprentice",
        photo: "//placehold.it/150x150"
    }, {
        name: "Lorem Ipsum",
        role: "Secretary",
        cabinet: "apprentice",
        photo: "//placehold.it/150x150"
    }, {
        name: "Lorem Ipsum",
        role: "Treasurer",
        cabinet: "apprentice",
        photo: "//placehold.it/150x150"
    }, {
        name: "Lorem Ipsum",
        role: "Chief of Communications",
        cabinet: "apprentice",
        photo: "//placehold.it/150x150"
    }];

    for (i=0; i<members.length; i++) {
        var listItem = document.createElement("li");
        
        var apprenticeString = "";
        if (members[i].cabinet == "apprentice") {
            apprenticeString = "Apprentice ";
        }
        
        listItem.innerHTML = "<div class='snippet'></div><div class='detail-arrow'></div><div class='detail'><h3></h3><h4></h4><p></p></div>";
        
        var snippetElem = listItem.querySelector(".snippet");
        
        snippetElem.style.backgroundImage = "url(" + members[i].photo + ")";
        snippetElem.addEventListener("click", function(){
            var liElem = this.parentElement;
            if (liElem.classList.contains("expanded")) {
                liElem.classList.remove("expanded");
            } else {
                var expandedElems = document.querySelectorAll("#member-list li.expanded");
                for (var expandedElem of [].slice.call(expandedElems)) {
                    expandedElem.classList.remove("expanded");
                }
                
                var detailElem = liElem.querySelector(".detail");
                var arrowElem = liElem.querySelector(".detail-arrow");
                
                var delay = 0;
                if (expandedElems.length !== 0) delay = 300;
                
                var that = this;
                
                setTimeout(function(){
                    detailElem.style.top = that.offsetTop + that.offsetHeight + "px";
                    
                    arrowElem.style.top = that.offsetTop + that.offsetHeight + "px";
                    
                    liElem.style.height = liElem.offsetHeight + detailElem.offsetHeight + 20 + "px";
                    liElem.classList.add("expanded");
                }, delay);
            }
        });
        
        listItem.querySelector(".detail h3").textContent = members[i].name;
        listItem.querySelector(".detail h4").textContent = apprenticeString + members[i].role;
        listItem.querySelector(".detail p").textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue.";
        
        listItem.classList.add(members[i].cabinet);

        memberUL.appendChild(listItem);
    }

    function switchSection(hash) {
        var i;

        var links = document.querySelectorAll("header nav > a");
        var sections = document.querySelectorAll("section");

        var origLink = document.querySelector("header nav > a[href='" + hash + "']");
        var target = document.querySelector(hash);

        if (origLink && target) {
            for (i=0; i<sections.length; i++) {
                links[i].classList.remove("current");
                sections[i].classList.remove("visible");
            }
            
            origLink.classList.add("current");
            target.classList.add("visible");
            target.scrollTop = 0;
        }
    }

    function changeColors() {
        var classes = ["blue", "yellow", "red"];
        var index = [].slice.call(document.querySelector("header nav").children).indexOf(document.querySelector("[href='" + location.hash + "']")) % classes.length;
        
        document.body.removeAttribute("class")
        if (classes[index]) {
            document.body.classList.add(classes[index]);
        }
    }

    window.addEventListener("hashchange", function(){
        switchSection(location.hash);
        document.querySelector("header nav").classList.remove("expanded");
        changeColors();
    });

    if (location.hash) {
        switchSection(location.hash);
        changeColors();
    } else {
        switchSection("#" + document.querySelectorAll("section")[0].getAttribute("id"));
    }

    document.querySelector("header img").addEventListener("click", function(){
        history.pushState("", document.title, location.pathname + location.search);
        switchSection("#" + document.querySelectorAll("section")[0].getAttribute("id"));
        changeColors();
    });
    
    document.querySelector("header nav .burger").addEventListener("click", function(){
        document.querySelector("header nav").classList.toggle("expanded");
    });
    
    /* konami code easter egg stuff */
    function arraysEqual(a, b) { // adapted from enyo's answer on stackoverflow
        var i;
        if (a === b) {
            return true;
        }
        if (a == null || b == null) {
            return false;
        }
        if (a.length != b.length) {
            return false;
        }

        for (i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }

    var keyList = [];
    var konamiSeq = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 13];

    var konamiTimeout;

    window.addEventListener("keydown", function(e){
        clearTimeout(konamiTimeout);

        keyList.push(e.which);

        konamiTimeout = setTimeout(function(){
            keyList = [];
        }, 3000);

        if (arraysEqual(keyList, konamiSeq)) {
            keyList = [];
            document.body.classList.remove("roll");
            setTimeout(function(){
                document.body.classList.add("roll");
            }, 10);
        }
    });
    

    /* facebook feed stuff */
    var fbURL = "py/fb.py";
    var streamElem = document.getElementById("stream");
    
    var fbMsnry;

    xhr(fbURL, function(r){
        r = JSON.parse(r);
        var entries = r.entries;

        for (var i = 0; i < 10; i++) {
            var entryElem = document.createElement("li");
            
            var date = new Date(entries[i].updated).toDateString();
            
            var content = (function(str){
                var div = document.createElement("div");
                div.innerHTML = str;
                return div.textContent;
            })(entries[i].content);
            
            entryElem.innerHTML = "<p>" + content.autoLink({target: "_blank"}) + "</p><a target='_blank' href='" + entries[i].alternate + "'><div class='entryinfo'>" + date + "</div></a>";

            streamElem.appendChild(entryElem);
        }
        
        fbMsnry = new Masonry(streamElem, {
            itemSelector: "li",
            gutter: 40,
            transitionDuration: "0"
        })
    });
});