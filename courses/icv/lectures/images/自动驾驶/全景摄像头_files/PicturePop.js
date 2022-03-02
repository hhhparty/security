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

function cmpl_picturepop_isElement(o) {
    return (
        typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
            o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
    );
}

var cmpl_mutation_observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
            // element added to DOM
            var hasClass = [].some.call(mutation.addedNodes, function (el) {
                if (el != null && cmpl_picturepop_isElement(el)) {
                    var pageTest = el.querySelector('.cmpl_picture_pop');

                    if (pageTest != null) {
                        return pageTest.classList.contains('cmpl_picture_pop') && !pageTest.classList.contains('cmpl-ready');
                    }
                    else {
                        return false;
                    }

                }
                else {
                    return false;
                }
            });
            if (hasClass) {
                setTimeout(function () { cmpl_LoadPicturePops(); }, 100);
            }
        }
    });
});

var cmpl_mutation_config = {
    attributes: false,
    childList: true,
    subtree: true,
    characterData: false
};


function cmpl_LoadPicturePops() {
    //find the last highlight color if there is one specified.
    var accentColor = "";
    var foundPicturePop = false;

    var colorElements = document.getElementsByClassName("cmpl_picture_pop");
    for (var i = 0; i < colorElements.length; i++) {
        foundPicturePop = true;
        var colorContainer = colorElements[i];

        if (colorContainer.hasAttribute("data-highlightcolor") && !colorContainer.classList.contains("cmpl-ready")) {
            accentColor = colorContainer.dataset.highlightcolor;
        }
    }

    //Apply picture pop styles to the page.
    if (foundPicturePop) {
        cmpl_PicturePop_Styles(accentColor);
    }

    var elements = document.getElementsByClassName("cmpl_picture_pop");
    for (var i = 0; i < elements.length; i++) {
        //Find the containing div for the clickable image
        var image_container = elements[i];

        if (!image_container.classList.contains("cmpl-ready")) {
            image_container.classList.add("cmpl-ready");

            //Handles optional video url instead of video id.
            var videoUrl = image_container.dataset.videourl;
            var videoId = image_container.dataset.videoid;
            var accessCode = image_container.dataset.accesscode;

            function picturepop_cmpl_GetVideoIdFromPath(url, key) {
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

          
            if (typeof videoUrl !== 'undefined' && videoUrl !== null) {
                //Then set the video id to the one specified in the url.
                videoId = picturepop_cmpl_GetVideoIdFromPath(videoUrl, "id");
            }

            if ((typeof accessCode === 'undefined' || accessCode === null) && typeof videoUrl !== 'undefined' && videoUrl !== null) {
                accessCode = picturepop_cmpl_GetVideoIdFromPath(videoUrl, "accesscode");
            }
            else if (typeof accessCode !== 'undefined' && accessCode != null) {
                accessCode = encodeURIComponent(accessCode);
            }

            if (typeof accessCode === 'undefined' || accessCode === null) {
                accessCode = "";
            }
            
            //Grab the playbutton url if it exists, otherwise use the default.
            var play_url = '';
            if (!image_container.hasAttribute("data-playimageurl") || image_container.dataset.playimageurl.trim() == "") {
                play_url = 'https://app.cadmoremedia.com/images/svgicons/play_small.svg';
            }
            else {
                play_url = image_container.dataset.playimageurl;
            }


            //Determine if an image is specified as a data attribute for the container or if we are downloading a video thumbnail.
            var image_url = "";
            //We cannot proceed with this if we do not have a video id, so silently fail to display.  But log.
            if (typeof videoId !== 'undefined' && videoId !== null && videoId !== "") {
                if (!image_container.hasAttribute("data-imageurl") || image_container.dataset.imageurl.trim() == "") {
                    // image attribute doesn't exist
                    cmpl_Create_PicturePop_Image('', videoId + '_' + i, image_container, play_url);
                    //next, we need to create the modal.
                    cmpl_Create_Modal('MODAL_' + videoId + '_' + i, image_container, videoId, videoUrl, accessCode);
                    //Set up jsonp script tag to get the url of the image embed.
                    var script = document.createElement('script');
                    script.src = 'https://app.cadmoremedia.com/VideoPlayer/GetThumbnailUrl?videoid=' + videoId + '&index=' + i;
                    //script.src = 'https://localhost:44323/VideoPlayer/GetThumbnailUrl?videoid=' + videoId + '&index=' + i;
                    document.querySelector('head').appendChild(script);

                }
                else {
                    //image attribute does exist.
                    image_url = image_container.dataset.imageurl;
                    //Add image to dom.
                    cmpl_Create_PicturePop_Image(image_url, videoId + '_' + i, image_container, play_url, accessCode);
                    //next, we need to create the modal.
                    cmpl_Create_Modal('MODAL_' + videoId + '_' + i, image_container, videoId, videoUrl);
                }

            }
            else {
                console.log("CMPL Picture Pop: Failed to locate a valid video id to process.  Are you missing the data-videoid attribute or specified a data-videourl that is incorrect?");
            }

        }
    }

}

cmpl_docReady(function () {
    cmpl_LoadPicturePops();
});

cmpl_docReady(function () {
   
    try {
        cmpl_mutation_observer.observe(document, cmpl_mutation_config);
    }
    catch (ex) {
        console.log("CMPL PP: Error Setting observer");
        console.log(ex);
    }

});

function cmpl_isLoadedScript(lib) {
    return document.querySelectorAll('[src="' + lib + '"]').length > 0
}

//add embed.js
//var cmpl_EmbedJSScriptLocation = 'https://localhost:44323/Scripts/Embed.js';
//var cmpl_EmbedJSScriptLocation = 'https://cmpldev.azurewebsites.net/Scripts/Embed.js';
var cmpl_EmbedJSScriptLocation = 'https://app.cadmoremedia.com/Scripts/Embed.js';
if (!cmpl_isLoadedScript(cmpl_EmbedJSScriptLocation)) {
    var embedjs = document.createElement('script');
    embedjs.src = cmpl_EmbedJSScriptLocation;
    document.querySelector('head').appendChild(embedjs);
}

function processJsonPResponse(url, id, index) {

    document.getElementById(id.toUpperCase() + '_' + index).src = url;

}

function cmpl_Create_Modal(id, imagecontainer, videoid, videourl, accessCode) {
    var modal = document.createElement('div');
    modal.className = 'cmpl-modal';
    modal.id = id.toUpperCase();
    modal.style.display = 'none';
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-label", "Video");

    //Create iframe
    var iframe = document.createElement('iframe');
    var iframeurl = "https://app.cadmoremedia.com/VideoPlayer/Video?id=" + videoid;
    //var iframeurl = "https://localhost:44323/VideoPlayer/Video?id=" + videoid;

    if (accessCode !== "") {
        iframeurl = iframeurl + "&accesscode=" + encodeURIComponent(accessCode);
    }

    //var iframeurl = "https://cmpldev.azurewebsites.net/VideoPlayer/Video?id=" + videoid;

    if (imagecontainer.hasAttribute("data-start") && imagecontainer.dataset.start.trim() != "") {
        iframeurl = iframeurl + "&start=" + imagecontainer.dataset.start.trim();
    }
    if (imagecontainer.hasAttribute("data-end") && imagecontainer.dataset.end.trim() != "") {
        iframeurl = iframeurl + "&end=" + imagecontainer.dataset.end.trim();
    }

    if (imagecontainer.hasAttribute("data-branding") && imagecontainer.dataset.branding.trim() === "true") {
        //iframe.setAttribute("data-branding", "true");
        iframeurl = iframeurl + "&branding=true";
    }

    if (imagecontainer.hasAttribute("data-brandinglocation")) {
        //iframe.setAttribute("data-branding", "true");
        iframeurl = iframeurl + "&brandingLocation=" + imagecontainer.dataset.brandinglocation.trim();
    }

    if (imagecontainer.hasAttribute("data-brandingimageurl")) {
        //iframe.setAttribute("data-branding", "true");
        iframeurl = iframeurl + "&brandingImageUrl=" + encodeURIComponent(imagecontainer.dataset.brandingimageurl.trim());
    }

    if (imagecontainer.hasAttribute("data-brandingurl")) {
        //iframe.setAttribute("data-branding", "true");
        iframeurl = iframeurl + "&brandingUrl=" + encodeURIComponent(imagecontainer.dataset.brandingurl.trim());
    }

    if (imagecontainer.hasAttribute("data-brandingheight")) {
        //iframe.setAttribute("data-branding", "true");
        iframeurl = iframeurl + "&brandingHeight=" + imagecontainer.dataset.brandingheight.trim();
    }

    if (imagecontainer.hasAttribute("data-brandingwidth")) {
        //iframe.setAttribute("data-branding", "true");
        iframeurl = iframeurl + "&brandingWidth=" + imagecontainer.dataset.brandingwidth.trim();
    }

    if (imagecontainer.hasAttribute("data-transcripttoggle")) {
        //iframe.setAttribute("data-branding", "true");
        iframeurl = iframeurl + "&toggleTranscript=" + imagecontainer.dataset.transcripttoggle.trim();
    }
    

    if (imagecontainer.hasAttribute("data-tab")) {
        //iframe.setAttribute("data-tab", imagecontainer.dataset.tab.trim());
        iframeurl = iframeurl + "&tabcolor=" + encodeURIComponent(imagecontainer.dataset.tab.trim());
    }

    if (imagecontainer.hasAttribute("data-tabtransparency")) {
        //iframe.setAttribute("data-tab", imagecontainer.dataset.tab.trim());
        iframeurl = iframeurl + "&tabTransparency=" + imagecontainer.dataset.tabtransparency.trim();
    }

    if (imagecontainer.hasAttribute("data-text")) {
        //iframe.setAttribute("data-text", imagecontainer.dataset.text.trim());
        iframeurl = iframeurl + "&textcolor=" + encodeURIComponent(imagecontainer.dataset.text.trim());
    }

    if (imagecontainer.hasAttribute("data-highlightcolor")) {
        //iframe.setAttribute("data-highlightcolor", imagecontainer.dataset.highlightcolor.trim());
        iframeurl = iframeurl + "&highlightColor=" + encodeURIComponent(imagecontainer.dataset.highlightcolor.trim());
    }

    var parentUrl = window.location.href;
    iframeurl = iframeurl + "&parent=" + encodeURIComponent(parentUrl);


    iframe.src = iframeurl;
    iframe.className = "cmpl_iframe";
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allow", "encrypted-media");
    iframe.setAttribute("class", "cmpl_iframe");
    iframe.setAttribute("allowfullscreen", "true");

   

    iframe.id = 'IFRAME_' + id.toUpperCase();

    //Create closer button.
    var closer = document.createElement('div');
    closer.className = "cmpl-popup-closer";
    closer.innerHTML = "<span>X</span>";
    closer.setAttribute("role", "button");
    closer.setAttribute("aria-label", "Close video dialog");
    closer.tabIndex = "0";
    closer.id = "CLOSER_" + id.toUpperCase();

    closer.addEventListener("click", function (e) {
        document.getElementById(id.toUpperCase()).style.display = 'none';
        document.getElementById("SHADOW_" + id.toUpperCase()).setAttribute("aria-expanded", "false");
        document.getElementById("SHADOW_" + id.toUpperCase()).focus();
        iframe.contentWindow.postMessage('{"method":"stop"}',"*");
        cmpl_closeDialog();
        e.preventDefault();
        e.stopPropagation();
    });

    closer.addEventListener('keydown', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            e.stopPropagation();
            this.dispatchEvent(new Event("click"));
        }
    });

    modal.appendChild(closer);

    //Iframes are now wrapped in a div to allow for transcriptless view.
    var iframeContainerDiv = document.createElement('div');
    iframeContainerDiv.className = "cmpl-iframe-container-div";
    iframeContainerDiv.append(iframe);

    modal.appendChild(iframeContainerDiv);

    modal.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    //Append to body to avoid transforms.
    document.body.appendChild(modal);

}

function cmpl_showDialog() {
    const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
    const body = document.body;
    body.style.position = 'fixed';
    //body.style.top = `-${scrollY}`;
    var negative = -1 * scrollY;
    body.style.top = negative + 'px';
};

function cmpl_closeDialog() {
    const body = document.body;
    const scrollY = body.style.top;
    body.style.position = '';
    body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
};

window.addEventListener('scroll', function() {
    document.documentElement.style.setProperty('--scroll-y', window.scrollY);
});

function cmpl_Create_PicturePop_Image(url, id, imagecontainer, play_url) {

   
    //create the image.
    var branding_position_div = document.createElement('div');
    branding_position_div.className = "cmpl-branding-position";
    var image = document.createElement('img');
    image.id = id.toUpperCase();
    image.src = url;

    console.log(image.src);
    image.className = 'cmpl-picture-pop-image';

    //Add image to dom.
    branding_position_div.appendChild(image);
    

    //Grab the play button image which will sit on top of the image, centered.
    var playImage = document.createElement('img');
    playImage.src = play_url;
    playImage.className = "cmpl-picture-pop-play";
    //Create the shadow div to sit on top of the image.
    var play_shadow_div = document.createElement("div");
    play_shadow_div.className = "cmpl-shadow-div";
    play_shadow_div.appendChild(playImage);
    play_shadow_div.tabIndex = "0";
    play_shadow_div.setAttribute("role", "button");
    play_shadow_div.setAttribute("aria-label", "open video dialog to watch video");
    play_shadow_div.setAttribute("aria-expanded", "false");
    play_shadow_div.id = "SHADOW_MODAL_" + id.toUpperCase();

    imagecontainer.appendChild(play_shadow_div);

    //Lastly, wire up click event for the play shadow div so that when clicked it will bring up the modal.
    play_shadow_div.addEventListener('click', function (e) {
        document.getElementById('MODAL_' + id.toUpperCase()).style.display = 'block';
        document.getElementById('CLOSER_MODAL_' + id.toUpperCase()).focus();
        play_shadow_div.setAttribute("aria-expanded", "true");
        cmpl_showDialog();
        e.preventDefault();
        e.stopPropagation();
        //try {
            //document.getElementById('IFRAME_MODAL_' + id.toUpperCase()).contentWindow.postMessage(['pplaycall'],'*');
        //}
        //catch (ex)
        //{
            //console.log(ex);
        //}
    });

    play_shadow_div.addEventListener('keydown', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            e.stopPropagation();
            this.dispatchEvent(new Event("click"));
        }
    });

    //Add branding if specified.

    if (imagecontainer.hasAttribute("data-branding") && imagecontainer.dataset.branding.trim() === "true") {

        //Determine branding specifics.
        if (imagecontainer.hasAttribute("data-brandinglocation")) {
            //Deal with brandin glocation.
        }
        var brandingAnchor = document.createElement('a');
        var branding_div = document.createElement('div');
        branding_div.className = 'cmpl-branding';
        brandingAnchor.className = 'cmpl-branding-a';

        if (imagecontainer.hasAttribute("data-brandingimageurl")) {
            brandingAnchor.style.backgroundImage = 'url(' + imagecontainer.dataset.brandingimageurl.trim() + ')';

        }
        else {
            brandingAnchor.style.backgroundImage = 'url(https://app.cadmoremedia.com/images/Cadmore-Media-Logo-white.png)';
        }

        if (imagecontainer.hasAttribute("data-brandingurl")) {
            brandingAnchor.href = imagecontainer.dataset.brandingurl.trim();
        }
        else {
            brandingAnchor.href = "https://www.cadmore.media";
        }

        var staticBrandingLocation = "br";
        if (imagecontainer.hasAttribute("data-brandinglocation")) {
            staticBrandingLocation = imagecontainer.dataset.brandinglocation.trim();
        }
        if (staticBrandingLocation == "br") {
            branding_div.style.bottom = "0";
            branding_div.style.right = "0";
        }
        else if (staticBrandingLocation == "tr") {
            branding_div.style.top = "0";
            branding_div.style.right = "0";
        }
        else if (staticBrandingLocation == "tl") {
            branding_div.style.top = "0";
            branding_div.style.left = "0";
        }
        else if (staticBrandingLocation == "bl") {
            branding_div.style.bottom = "0";
            branding_div.style.left = "0";
        }

        var staticBrandingHeight = 3.6;
        var staticBrandingWidth = 18;

        if (imagecontainer.hasAttribute("data-brandingheight")) {
            staticBrandingHeight = imagecontainer.dataset.brandingheight.trim();
        }

        if (imagecontainer.hasAttribute("data-brandingwidth")) {
            staticBrandingWidth = imagecontainer.dataset.brandingwidth.trim();
        }

        branding_div.style.width = staticBrandingWidth + "%";
        branding_div.style.height = staticBrandingHeight + "%";


        brandingAnchor.target = "_blank";

        branding_position_div.appendChild(branding_div);
        branding_div.appendChild(brandingAnchor);
        
   }
    imagecontainer.appendChild(branding_position_div);

}

function cmpl_PicturePop_Styles(accentColor) {
    //Apply picture pop styling to the page.

    if (document.body.classList.contains('cmpl_picturepop_complete')) {
        return;
    }

  
    document.body.className += ' ' + 'cmpl_picturepop_complete';

    if (accentColor === "") {
        accentColor = '#107d8b';
    }

    var css = '.cmpl-branding-position { margin-left:auto; margin-right:auto; position:relative; display:inline-block; } .cmpl-branding { position:absolute; background-color: rgba(51,51,51,0.75); border-radius:3px; z-index:101; padding:3px; margin:2px; } .cmpl-branding-a { width: 100%; display: block; height: 100%; background-position: 50% 50%; background-repeat: no-repeat; background-size: cover; } .cmpl_picture_pop { text-align:center; position:relative; } .picturepop_image { width:100%;  } .cmpl-modal > .cmpl-iframe-container-div > .cmpl_iframe.cmpl_no_transcript { max-height:calc(100vh - 81px); margin-left:auto; margin-right:auto; }.cmpl-modal > .cmpl-iframe-container-div > .cmpl_iframe { position:absolute; top: 0; left: 0; width:100%; height:100%; } .cmpl-modal > .cmpl-iframe-container-div { overflow: hidden; border:0; margin:0; position:fixed; left:0; top:51px; height:calc(100% - 76px); width:100%; } .cmpl-modal > .cmpl-iframe-container-div.cmpl_no_transcript { height:unset; padding-top:56.25%; } .cmpl-modal {  height: 100%; width: 100%; position: fixed; z-index: 99999; left: 0;  top: 0; background-color: rgba(0, 0, 0, 0.85); overflow: hidden; transition: 0.5s; } .cmpl-popup-closer:focus { background-color:' + accentColor + '; outline:none; padding:3px; border-radius:5px; } .cmpl-popup-closer { font-family: Arial; padding:3px; } .cmpl-popup-closer:hover { padding:3px; background-color:' + accentColor + '; outline:none; border-radius:5px; } .cmpl-popup-closer { position:fixed; top:10px; right: 20px; color: white; font-size:20pt; cursor:pointer; z-index:999999; } .cmpl-picture-pop-image { max-width:100%; } .cmpl-picture-pop-play { max-width:90%; max-height:90%; position: relative; top: 50%; transform: translateY(-50%); } .cmpl-shadow-div:focus { background-color: ' + accentColor + '; outline:none; } .cmpl-shadow-div:hover { background-color: ' + accentColor + '; outline:none; } .cmpl-shadow-div { background-color: rgba(0, 0, 0, 0.75); cursor:pointer; z-index:10; text-align:center; position:absolute;  top: 50%; left: 50%; border-radius:5px; width: 80px; height: 60px; transform: translate(-50%, -50%); }';
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

}
