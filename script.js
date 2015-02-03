var xhr = function(url, callback) {
    var oReq = new XMLHttpRequest();
    oReq.onload = function(){
        var response = this.responseText;
        callback(response);
    };
    oReq.open("get", url, true);
    oReq.send();
};

var LinkshimAsyncLink = {
    swap: function(){}
};

var removeBRs = function(html){
    var dom = document.createElement("body");
    dom.innerHTML = html;
    var brElems = [].slice.call(dom.querySelectorAll("br"));
    
    brElems.forEach(function(brElem, i){
        if (i === 0) {
            dom.removeChild(brElem);
        }
    });
    
    return dom.innerHTML;
};

var removeEmptyLinks = function(html){
    var dom = document.createElement("body");
    dom.innerHTML = html;
    var aElems = [].slice.call(dom.querySelectorAll("a"));
    
    aElems.forEach(function(aElem, i, a){
        if (aElem.textContent.length === 0) {
            dom.removeChild(aElem);
        }
    });
    
    return dom.innerHTML;
};

document.addEventListener("DOMContentLoaded", function(){
    var memberULs = document.querySelectorAll(".module.member-list");
    
    var members = <?php include("admin/content/members.json"); ?>.members;

    members.forEach(function(member){
        var listItem = document.createElement("li");
        
        var apprenticeString = "";
        if (member.cabinet == "apprentice") {
            apprenticeString = "Apprentice ";
        }
        
        listItem.innerHTML = "<div class='snippet'></div><div class='detail-arrow'></div><div class='detail'><h3></h3><h4></h4><p></p></div>";
        
        listItem.querySelector(".detail h3").textContent = member.name;
        listItem.querySelector(".detail h4").textContent = apprenticeString + member.role;
        listItem.querySelector(".detail p").textContent = member.bio;
        
        listItem.classList.add(member.cabinet);
        
        [].slice.call(memberULs).forEach(function(memberUL){
            var clonedLI = listItem.cloneNode(true);
            var snippetElem = clonedLI.querySelector(".snippet");

            snippetElem.style.backgroundImage = "url(" + member.photo + ")";
            snippetElem.addEventListener("click", function(){
                var liElem = this.parentElement;
                if (liElem.classList.contains("expanded")) {
                    liElem.classList.remove("expanded");
                } else {
                    var expandedElems = document.querySelectorAll(".module.member-list li.expanded");
                    for (var i = 0; i < expandedElems.length; i++) {
                        expandedElems[i].classList.remove("expanded");
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
            
            memberUL.appendChild(clonedLI);
        });
    });

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
        var classes = ["blue", "yellow", "red", "green"];
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
    var streamElems = document.querySelectorAll(".module.news-stream");
    streamElems[0].innerHTML = "<li class='loading'></li>";
    
    var fbMsnry;

    xhr(fbURL, function(r){
        r = JSON.parse(r);
        var entries = r.entries;
        
        streamElems[0].innerHTML = "";

        entries.forEach(function(entry){
            var entryElem = document.createElement("li");
            
            var date = new Date(entry.pubDate).toDateString();
            var content = entry.description.replace(/<img[^>]+\>/ig, "");
            entryElem.innerHTML = "<div class='entry-container'><p>" + removeBRs(removeEmptyLinks(content)).autoLink({target: "_blank"}) + "</p><a target='_blank' href='" + entry.link + "'></div><div class='entryinfo'>" + date + "</div></a>";
            
            entryElem.addEventListener("click", function(){
                streamElems[0].classList.toggle("dimmed");
                this.classList.toggle("expanded");
            });
            
            streamElems[0].appendChild(entryElem);
            
            var entryContainer = entryElem.querySelector(".entry-container");
            if (entryContainer.offsetHeight > entryElem.offsetHeight - 50) entryElem.classList.add("overflow");
        });
        
        fbMsnry = new Masonry(streamElems[0], {
            itemSelector: "li",
            gutter: 20,
            transitionDuration: "0",
            columnWidth: 449
        });
    });
    
    for (var j = 1; j < streamElems.length; j++) {
        streamElems[j].textContent = "You can only have <strong>1</strong> news stream. Because reasons. Sorry.";
    }
    
    /* insert modules */
    var moduleHTML = {
        "social-links": "<a href='//www.facebook.com/stcstudentcouncil' class='fb' target='_blank'>Facebook</a>\
<a href='//twitter.com/SC_Council' class='tw' target='_blank'>Twitter</a>\
<a href='//sc.lg.esf.edu.hk/mod/questionnaire/view.php?id=57758' class='sug' target='_blank'>Suggestion box</a>",
        "email-form": "<form method='get' action='mailto:studentcouncil@stconline.edu.hk'>\
<input type='text' name='subject' placeholder='Subject'>\
<textarea name='body' placeholder='Message' required></textarea>\
<button title='Pressing this will launch your default email client'>Send</button>\
</form>"
    };
    var moduleNames = Object.keys(moduleHTML);
    
    moduleNames.forEach(function(moduleName){
        var html = moduleHTML[moduleName];
        var targetElems = document.querySelectorAll(".module." + moduleName);
        [].slice.call(targetElems).forEach(function(targetElem){
            targetElem.innerHTML = html;
        });
    });
});