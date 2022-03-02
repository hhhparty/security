
//includes polyfill.
if (!String.prototype.includes) {
    String.prototype.includes = function () {
        'use strict';
        return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
}

//Jquery implementation of document ready.
(function (funcName, baseObj) {
    // The public function name defaults to window.docReady
    // but you can pass in your own object and own function name and those will be used
    // if you want to put them in a different namespace
    funcName = funcName || "docReady";
    baseObj = baseObj || window;
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;

    // call this when the document is ready
    // this function protects itself against being called more than once
    function ready() {
        if (!readyFired) {
            // this must be set to true before we start calling callbacks
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                // if a callback here happens to add new ready handlers,
                // the docReady() function will see that it already fired
                // and will schedule the callback to run right after
                // this event loop finishes so all handlers will still execute
                // in order and no new ones will be added to the readyList
                // while we are processing the list
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            // allow any closures held by these functions to free
            readyList = [];
        }
    }

    function readyStateChange() {
        if (document.readyState === "complete") {
            ready();
        }
    }

    // This is the one public interface
    // docReady(fn, context);
    // the context argument is optional - if present, it will be passed
    // as an argument to the callback
    baseObj[funcName] = function (callback, context) {
        if (typeof callback !== "function") {
            throw new TypeError("callback for docReady(fn) must be a function");
        }
        // if ready has already fired, then just schedule the callback
        // to fire asynchronously, but right away
        if (readyFired) {
            setTimeout(function () { callback(context); }, 1);
            return;
        } else {
            // add the function and context to the list
            readyList.push({ fn: callback, ctx: context });
        }
        // if document already ready to go, schedule the ready function to run
        if (document.readyState === "complete") {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            // otherwise if we don't have event handlers installed, install them
            if (document.addEventListener) {
                // first choice is DOMContentLoaded event
                document.addEventListener("DOMContentLoaded", ready, false);
                // backup is window load event
                window.addEventListener("load", ready, false);
            } else {
                // must be IE
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    }
})("cmpl_docReady", window);

function cmpl_AttemptKeys () 
{
    //now, append to the iframe url the current url so that we can access it correctly via share buttons.
    try {
        var elements = document.getElementsByClassName("cmpl_iframe");
        for (var i = 0; i < elements.length; i++) {
            if (!elements[i].hasAttribute("data-cmplhandled")) {
                ////pass along the unique id generated for this iframe by the page.
                ///Set a unique id on the iframe.
                var uid = cmpl_generateUUIDNoDash();
                elements[i].setAttribute("data-uid", uid);

                elements[i].setAttribute("data-cmplhandled", true);
            }
        }

    }
    catch (ex) {
        console.log("CMPL: Error during keying.");
        console.log(ex);
    }
}

cmpl_docReady(function () {

    //Check to make sure we haven't run this already.  This can happen when embed.js is deposited on the page more than once, and we don't want to run it again and again.

    if (document.body.classList.contains('cmpl_embed_complete')) {
        return;
    }

    document.body.className += ' ' + 'cmpl_embed_complete';

    var cmpl_responsiveIframeTest = (document.getElementsByClassName("cmpl_iframe_div")).length > 0 || (document.getElementsByClassName("cmpl_iframe_audio_div")).length;

    if (cmpl_responsiveIframeTest) {
                
        //apply styles for auto sizing.
        var css = '.cmpl_iframe_audio_div.cmpl_no_transcript { min-height:280px; overflow:hidden !important; position:relative !important; width:unset !important; height:unset !important; } .cmpl_iframe_audio_div { min-height:500px; !important; overflow:hidden !important; position:relative !important; width:unset !important; height:unset !important; } .cmpl_iframe_div.cmpl_no_transcript { padding-top: 56.3% !important; min-height:unset !important; } .cmpl_iframe_div { overflow:hidden !important; position:relative !important; width:unset !important; height:unset !important; } .cmpl_iframe_div iframe { position:absolute; left: 0; top: 0; } .cmpl_iframe_audio_div iframe { position:absolute; left: 0; top: 0; } ',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        head.appendChild(style);

        style.type = 'text/css';
        if (style.styleSheet) {
            // This is required for IE8 and below.
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        cmpl_ResponsiveResize(); // resize once
        window.addEventListener("resize", cmpl_ResponsiveResize); //resize if window resizes.
        window.addEventListener("load", cmpl_ResponsiveResize); //resize again incase there is a scroll bar.

    }

    cmpl_AttemptKeys(); //attempt keys for elements already loaded.

    window.addEventListener('scroll', function (e) {
        try {
            cmpl_provideVisicheck();
        }
        catch (ex) {
            //ignore errors.  nothing will be visible.
        }
    });


    window.addEventListener('message', function (e) {
        try {
            if (e.origin !== "https://app.cadmoremedia.com" && e.origin !== "https://cmpldev.azurewebsites.net" && e.origin !== "https://localhost:44323") {
                //bad domain.
                return;
            }

            //Check keys on each request so we can ensure no Iframe has been loaded post document load in the dom which needs to be keyed.
            cmpl_AttemptKeys();

            var obj = JSON.parse(e.data);

            if (obj.method === "visicheck") {
                cmpl_provideVisicheck();
            }
            else if (obj.method === "keyMe") {
                var elements = document.getElementsByClassName("cmpl_iframe");
                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].contentWindow === e.source) {
                        elements[i].contentWindow.postMessage('{"method":"keyed","key":"' + elements[i].dataset.uid + '"}', "*");
                    }
                }
            }
            else if (obj.method === "parametersCheck") {
                //Locate the iframe in question.
                var elements = document.getElementsByClassName("cmpl_iframe");
                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].dataset.uid === obj.key) {

                        var iframeElement = elements[i];
                        var tabColor = iframeElement.dataset.tab;
                        if (typeof tabColor === 'undefined' || tabColor === null) {
                            tabColor = "";
                        }
                        var tabTransparency = iframeElement.dataset.tabtransparency;
                        if (typeof tabTransparency === 'undefined' || tabTransparency === null) {
                            tabTransparency = "";
                        }
                        var controlColor = iframeElement.dataset.controlcolor;
                        if (typeof controlColor === 'undefined' || controlColor === null) {
                            controlColor = "";
                        }
                        var textColor = iframeElement.dataset.text;
                        if (typeof textColor === 'undefined' || textColor === null) {
                            textColor = "";
                        }
                        var branding = iframeElement.dataset.branding;
                        if (typeof branding === 'undefined' || branding === null) {
                            branding = "";
                        }
                        var highlightColor = iframeElement.dataset.highlightcolor;
                        if (typeof highlightColor === 'undefined' || highlightColor === null) {
                            highlightColor = "";
                        }

                        console.log(highlightColor);

                        var parentUrl = window.location.href;
                        var toggleTranscript = iframeElement.dataset.transcripttoggle;
                        if (typeof toggleTranscript === 'undefined' || toggleTranscript === null) {
                            toggleTranscript = "";
                        }
                        var brandingUrl = iframeElement.dataset.brandingurl;
                        if (typeof brandingUrl === 'undefined' || brandingUrl === null) {
                            brandingUrl = "";
                        }
                        var brandingImageUrl = iframeElement.dataset.brandingimageurl;
                        if (typeof brandingImageUrl === 'undefined' || brandingImageUrl === null) {
                            brandingImageUrl = "";
                        }
                        var brandingLocation = iframeElement.dataset.brandinglocation;
                        if (typeof brandingLocation === 'undefined' || brandingLocation === null) {
                            brandingLocation = "";
                        }
                        var brandingWidth = iframeElement.dataset.brandingwidth;
                        if (typeof brandingWidth === 'undefined' || brandingWidth === null) {
                            brandingWidth = "";
                        }
                        var brandingHeight = iframeElement.dataset.brandingheight;
                        if (typeof brandingHeight === 'undefined' || brandingHeight === null) {
                            brandingHeight = "";
                        }
                   
                        //Set the start and end clipping based on the clip id and what is passed in.
                        var currentUrl = elements[i].getAttribute("src");
                        var start = cmpl_GetStart();
                        var end = cmpl_GetEnd();
                        var clipId = cmpl_GetClipId();
                        var cue = cmpl_GetCue();
                        var searchString = cmpl_GetSearchString();

                        if (clipId !== "") {
                            //this grabs the video id out of the iframe url
                            var videoId = cmpl_GetVideoIdFromPath(currentUrl, "id");
                            //This compares it to the passed in clip id.
                            if (videoId.toLowerCase() === clipId.toLowerCase()) {
                                //We are good to pass clipping
                            }
                            else {
                                //set to empty because the clipid could not be determined to be this video.
                                start = "";
                                end = "";
                                cue = "";
                            }
                        }
                        else {
                            //Otherwise, all videos get clipped.
                        }

                       
                        var msg = {
                            method: "parameters",
                            tabColor: tabColor,
                            tabTransparency: tabTransparency,
                            textColor: textColor,
                            controlColor: controlColor,
                            branding: branding,
                            brandingUrl: brandingUrl,
                            brandingImageUrl: brandingImageUrl,
                            highlightColor: highlightColor,
                            parentUrl: parentUrl,
                            start: start,
                            end: end,
                            toggleTranscript: toggleTranscript,
                            cue: cue,
                            searchString: searchString,
                            brandingLocation: brandingLocation,
                            brandingWidth: brandingWidth,
                            brandingHeight: brandingHeight
                        }

                      
                        //iframeElement.contentWindow.postMessage('{"method":"parameters","tabColor":"' + tabColor + '","tabTransparency":"' + tabTransparency + '","textColor":"' + textColor + '","controlColor":"' + controlColor + '","branding":"' + branding + '","brandingUrl":"' + brandingUrl + '","brandingImageUrl:"' + brandingImageUrl + '","highlightColor":"' + highlightColor + '","parentUrl":"' + parentUrl + '","start":"' + start + '","end":"' + end + '","toggleTranscript":"' + toggleTranscript + '","cue":"' + cue + '","searchString":"' + searchString + '"}', "*");
                        try {
                            iframeElement.contentWindow.postMessage(JSON.stringify(msg), "*");
                        }
                        catch (ex) {
                            console.log(ex);
                        }
                       
                    }
                }


            }
            else if (obj.method === "NoTranscript") {
                var elements = document.getElementsByClassName("cmpl_iframe");
                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].dataset.uid === obj.key) {
                        var iframeElement = elements[i];
                        iframeElement.classList.add('cmpl_no_transcript');

                        if (iframeElement.parentElement != null) {
                            iframeElement.parentElement.classList.add('cmpl_no_transcript');
                        }

                    }
                }
            }
            else if (obj.method === "YesTranscript") {
                var elements = document.getElementsByClassName("cmpl_iframe");
                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].dataset.uid === obj.key) {
                        var iframeElement = elements[i];
                        iframeElement.classList.remove('cmpl_no_transcript');
                        if (iframeElement.parentElement != null) {
                            iframeElement.parentElement.classList.remove('cmpl_no_transcript');
                        }
                    }
                }
            }
        }
        catch (ex) {
            //ignore errors.  nothign will be visible.
        }

    });
});

function cmpl_generateUUIDNoDash() {
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

}

function cmpl_GetVideoIdFromPath(url, key) {
    key = key.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + key + '=([^&#]*)');
    var results = regex.exec(url);
    var returnVal = results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));

    if (returnVal === '') {
        //the embed does not contain the key.  Thereby, the id is attached to the domain
        //before the query string.
        var directoryName = url.substring(url.lastIndexOf("/") + 1);
        //now exclude any query string variables
        var querySplit = directoryName.split("?");
        return querySplit[0];
    }
    else {
        return returnVal;
    }
}

function cmpl_getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return '';
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function cmpl_GetStart() {
    var field = 'start';
    var url = window.location.href;
    if (url.indexOf('?' + field + '=') != -1)
        return cmpl_getParameterByName(field, url);
    else if (url.indexOf('&' + field + '=') != -1)
        return cmpl_getParameterByName(field, url);
    else
        return '';
}

function cmpl_GetEnd() {
    var field = 'end';
    var url = window.location.href;
    if (url.indexOf('?' + field + '=') != -1)
        return cmpl_getParameterByName(field, url);
    else if (url.indexOf('&' + field + '=') != -1)
        return cmpl_getParameterByName(field, url);
    else
        return '';

}


function cmpl_GetCue() {
    var field = 'cue';
    var url = window.location.href;
    if (url.indexOf('?' + field + '=') != -1)
        return cmpl_getParameterByName(field, url);
    else if (url.indexOf('&' + field + '=') != -1)
        return cmpl_getParameterByName(field, url);
    else
        return '';
}

function cmpl_GetSearchString() {
    var field = 'cmplsearchstring';
    var url = window.location.href;
    if (url.indexOf('?' + field + '=') != -1)
        return cmpl_getParameterByName(field, url);
    else if (url.indexOf('&' + field + '=') != -1)
        return cmpl_getParameterByName(field, url);
    else
        return '';
}


function cmpl_GetClipId() {
    var field = 'clipId';
    var url = window.location.href;
    if (url.indexOf('?' + field + '=') != -1)
        return cmpl_getParameterByName(field, url);
    else if (url.indexOf('&' + field + '=') != -1)
        return cmpl_getParameterByName(field, url);
    else
        return '';
}

function cmpl_ResponsiveResize() {
    var elements = document.getElementsByClassName("cmpl_iframe_div");
    for (var i = 0; i < elements.length; i++) {
        var divElement = elements[i];

        //Set an appropriate padding based on the width of the div.
        var positionInfo = divElement.getBoundingClientRect();
        var width = positionInfo.width;

        ///This is wide view breakpoint.
        if (width >= 850) {
             divElement.style.paddingTop = "39.4%";
        }
        else {
            //This is the mobile/tablet view breakpoint.
            //calculate correct padding top.
            if (width > 300) {
                var correctPadding = 850 - width;
                correctPadding = 100 + (((correctPadding * 1.1) / 850) * 100);

                //never exceed 165% for small devices.
                if (correctPadding > 165) {
                    correctPadding = 165;
                }

                divElement.style.paddingTop = correctPadding + "%";
            }
            else {
                divElement.style.paddingTop = "56.25%";
            }



        }
    }
}


//we also set a timeout to provide visi check information regularly so we can catch iframes on load.

function cmpl_provideVisicheck() {
    //this function will keep iframes updated to let them know if they are visible or not.
    //this is needed for much functionality on the player such as knowing which video to full screen on orientation shift while on mobile.
    //determine if the iframe is visible.

    //if multiple iframes are visible, the last one in dom order is the winner for visible and orientation shifts.  The rest are considered not visible.
    var visiArray = new Array();

    try {
        var elements = document.getElementsByClassName("cmpl_iframe");
        for (var i = 0; i < elements.length; i++) {
            visiArray.push(cmpl_checkVisible(elements[i]));
        }

        //Mark all as false now except the last one in the array.
        for (var z = 0; z < visiArray.length; z++) {
            if (visiArray[z] === true && z + 1 < visiArray.length && visiArray[z + 1] === true) {
                visiArray[z] = false;
            }
        }

        for (var p = 0; p < elements.length; p++) {
            var uid = elements[p].getAttribute("data-uid");

            try {
                elements[p].contentWindow.postMessage('{"method":"visicheck","visible":"' + visiArray[p] + '"}',"*");
            }
            catch (ex) {
                //do nothing.
            }
        }
    }
    catch (ex) {
        //ignore errors.
    }

}



function cmpl_checkVisible(elm) {

     //If there are multiple iframes visible, we only say that the bottom one is visible in the dom order.
    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
};