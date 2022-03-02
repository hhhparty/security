var utag_data = {
	"browse_content_type": "",
	"browse_topic": "",
	"content_type": "",
	"course_category_name": "",
	"course_sub_category": "",
	"document_id": "",
	"document_isAbstract": "",
	"document_isDHTML": "",
	"document_isHTML": "",
	"document_pub_id": "",
	"event_name": "",
	"filter_type": "",
	"filter_value": "",
	"link_category": "",
	"link_name": "",
	"publisher": "",
	"search_collection": "",		// browse
	"search_keyword": "",			// SERP, browse
	"search_refinements": "",		// SERP, browse
	"search_search_within": "",		// SERP (including SERP Author Search), browse
//	"search_selected_value": "",	// browse - TODO unCommentMe when business wants it. Used in Browse pages for things like when user clicks on K in By title, or range like 1400-1499 in By Number, or selects a topic in By Topic
	"search_results_count": "",
	"search_type": "",
	"sheet_name": "",				
	"sheet_type": "",				
	"site_section": "",
	"site_section_tab": "",
	"user_id": TEALIUM_userId,							
	"user_institution_id": TEALIUM_userInstitutionId,	
	"user_product": TEALIUM_products,					
	"user_third_party": TEALIUM_user_third_party,		
	"user_type": TEALIUM_userType						
};

var tealiumConfig = {
	enabled: TEALIUM_CONFIG_TAGGING_ENABLED,
	tealium_cdn_url: TEALIUM_CONFIG_CDN_URL,
    account_profile_environment: TEALIUM_CONFIG_ACCOUNT_PROFILE_ENV,
    suppress_first_view: true			// TODO testMe, this is really for angular, should we set it here too ?
};


/*******************************************************************************
 * /* tealiumAnalytics /
 ******************************************************************************/
var tealiumAnalytics = {
	    config: {
	        defaults: {
	            tagOptions: {
	                allTags: {},
	                pageTagsOnly: {},
	                eventAndLinkTagsOnly: {}
	            }
	        }
	    },
	    data: {
	        data4eventTags: [],
	        data4pageTags: []
	    },
	    
	    initData: function (tealiumTagsData) {
	        'use strict';
	        if (tealiumTagsData && typeof tealiumTagsData === "object") {
	            this.config = tealiumTagsData.config;
	            this.data = tealiumTagsData.data;
	        }
	        
	        this.config.defaults.tagOptions.pageTagsOnly.func2getTealiumUtagData = this.getTealiumUtagData;
	        this.config.defaults.tagOptions.pageTagsOnly.func2setTealiumUtagData = this.setTealiumUtagData;
	    },
	    
		init : function() {
			// load config and data(externalized event tag data)
			this.initData(tealiumTagsData);
			
			// set page tag values extracted from elements(div) with marker class
			this.setTealiumPageTagsValues(jQuery, this.config.defaults.tagOptions.baseAndPageTagsOnly);
			
			// add onclick,... events to dom elements specified by events tag data load to fire utag.link  
			this.setTealiumEventTagsValues(this.data.data4eventTags, jQuery, this.config.defaults.tagOptions.eventAndLinkTagsOnly);
		},

		// #### `setTealiumPageTagsValues`
		// Searches current dom for entry whose class has tagOptions.classMarker and picks up data json object passed in its tagOptions.dataAttributeName to set utag_data with
		// By default it only sets page tags values in utag_data(i.e. utag.data)
		//
		// Example jsp fragments that uses below function are;
		//	<div class="stats-tag-marker-page" data-tealium_utag_data='{"sheet_name": "Homepage - landing.jsp - via data attrib", "sheet_type": "home - legacy- via data attrib"}' />
		//	<div class="stats-tag-marker-page" data-tealium_utag_data='{"sheet_name": "Create Account Page - mwRegistrationIntro.jsp - via data attrib", "sheet_type": "modal - create account - legacy- via data attrib"}' data-tealium_utag_action= "view"></div>
		setTealiumPageTagsValues: function (j$, tagOptions) {
			var tagOptionsDefault = {
				useExistingUtagValuesAsBase: true,		// if true will use existing Xplore utag_data values as base and overwrite them. If false will ignore(wipe out) existing Xplore utag_data values
	            dataAttributeName: 'tealium_utag_data',
	            actionAttributeName: 'tealium_utag_action',
	            setBaseTags: true,
	            setPageTags: true,
	            setUserTags: false,
	            setEventAndLinkTags: false,
	            jqSelector: '.stats-tag-marker-page',
	            func2getTealiumUtagData: tealiumAnalytics.getTealiumUtagData,
	            func2setTealiumUtagData: tealiumAnalytics.setTealiumUtagData				
			};
			tagOptions = j$.extend(tagOptionsDefault, tagOptions);

			// if tealium is disabled or there are no elements of interest (matches jQuery selector), then nothing to do
			if (!tealiumConfig.enabled || j$(tagOptions.jqSelector).length === 0) {
				return; 
			}

			// add setTealiumUtagData function to jQuery
			this.addSetTealiumUtagData2jQuery(j$);

//			<div class="stats-tag-marker-page" data-tealium_utag_data='{"sheet_name": "Homepage - landing.jsp - via data attrib", "sheet_type": "home - legacy- via data attrib"}' />
			j$(tagOptions.jqSelector).last().setTealiumUtagData(tagOptions);
		},

		// #### `addSetTealiumUtagData2jQuery`
		// Adds setTealiumUtagData function to jQuery
		addSetTealiumUtagData2jQuery: function (j$) {
			j$.fn.setTealiumUtagData = function(tagOptions, data) {
				var tagOptionsDefault = {
					useExistingUtagValuesAsBase: true,		// if true will use existing Xplore utag_data values as base and overwrite them. If false will ignore(wipe out) existing Xplore utag_data values
					dataAttributeName: 'tealium_utag_data',
					actionAttributeName: 'tealium_utag_action',
					setBaseTags: true,
					setPageTags: true, 
					setUserTags: true,
					setEventAndLinkTags: true,
					func2getTealiumUtagData: tealiumAnalytics.getTealiumUtagData,
					func2setTealiumUtagData: tealiumAnalytics.setTealiumUtagData
				};
				tagOptions = j$.extend(tagOptionsDefault, tagOptions);
				
				if (tagOptions.useExistingUtagValuesAsBase && typeof tagOptions.useExistingUtagValuesAsBase === "boolean") {
					var dataFromUtagData = tagOptions.func2getTealiumUtagData(j$, tagOptions);
					data = j$.extend(dataFromUtagData, data);
				}

				var dataFromDataAttribute = j$(this).data(tagOptions.dataAttributeName);
				data = j$.extend(data, dataFromDataAttribute);
				
				// set utag_data
				tagOptions.func2setTealiumUtagData(data, j$, tagOptions);
				
				// if action is specified via its data attribute, perform it
				var actionFromDataAttribute = j$(this).data(tagOptions.actionAttributeName);
				switch (actionFromDataAttribute) {
					case 'view':
						utag.view(data);
						break;
					case 'link':
						utag.link(data);
						break;
					default:
						break;
				}
			};
		},

		// #### `setTealiumEventTagsValues`
		// Loops through data4eventTags array passed in, searching current dom for entry(ies) found with jQuery selector data4eventTag.jqSelector
		// then dynamically adds event handler (like onclick for 'click' event, onmousedown for 'mousedown' event ) and passes the data specified in data4eventTag.data
		// It will also see if data is directly specified by the element, then it will make use of it.
		// Finally, when element's event occur, like click event or mousedown event, utag.link will be called with data
		//
		// Example jsp fragments that help using below function are;
		//	<li class="Menu-item stats-extLink stats-Unav_exit_aaa"><a href="http://www.ieee.org/"  id="u-home" class="ieeeorg">IEEE.org</a></li>
		//	<li class="Menu-item stats-mnEvLinks"><a class="sign-in stats-Unav_P_SignIn" href="#" title="Sign In">Personal Sign In</a>
		setTealiumEventTagsValues: function (data4eventTags, j$, tagOptions) {
			var tagOptionsDefault = {
				useExistingUtagValuesAsBase: true,		// if true will use existing Xplore utag_data values as base and overwrite them. If false will ignore(wipe out) existing Xplore utag_data values
	            dataAttributeName: 'tealium_utag_data',
	            actionAttributeName: 'tealium_utag_action',
	            setBaseTags: false,
	            setPageTags: true,
	            setUserTags: false,
	            setEventAndLinkTags: false,
	            events: 'click',
	            func2getTealiumUtagData: tealiumAnalytics.getTealiumUtagData,
	            func2setTealiumUtagData: tealiumAnalytics.setTealiumUtagData				
			};
			tagOptions = j$.extend(tagOptionsDefault, tagOptions);
			
			j$ = j$ || jQuery;

			// if tealium is disabled or data4eventTags is undefined or empty, then nothing to do
			if (!tealiumConfig.enabled) {
				return;
			} else if (!data4eventTags || data4eventTags.length === 0){
				console.log('Tealium Event tags from tealiumTagData will not be fired from JSP pages - UnExpected value for data4eventTags:', data4eventTags);	// TODO changeMe to error if we want to use tealiumTagsData.js for events
				return; 
			}
			
			// add setTealiumUtagDataOnEvent function to jQuery
			this.addSetTealiumUtagDataOnEvent2jQuery(j$);

			// loop over each externalized event tag data 
			data4eventTags.forEach(function(data4eventTag, index) {
				try {
					if (j$(data4eventTag.jqSelector).length === 0) {
						return;		// no match, continue looping rest of them
					} else {
						j$(data4eventTag.jqSelector).setTealiumUtagDataOnEvent(data4eventTag, tagOptions);
					}
				} catch (e) {
					console.error('Will skip an event tag data entry, check its jqSelector value, could not process data4eventTag:', data4eventTag, '. Got error:', e);
				}
			});
		},

		// #### `addSetTealiumUtagDataOnEvent2jQuery`
		// Adds setTealiumUtagDataOnEvent function to jQuery
		addSetTealiumUtagDataOnEvent2jQuery: function (j$) {
			j$.fn.setTealiumUtagDataOnEvent = function(data4eventTag, tagOptions) {
				var tagOptionsDefault = {
					useExistingUtagValuesAsBase: true,		// if true will use existing Xplore utag_data values as base and overwrite them. If false will ignore(wipe out) existing Xplore utag_data values
					dataAttributeName: 'tealium_utag_data',
					actionAttributeName: 'tealium_utag_action',
					setBaseTags: true,
					setPageTags: true, 
					setUserTags: true,
					setEventAndLinkTags: true,
					events: 'click',
					func2getTealiumUtagData: tealiumAnalytics.getTealiumUtagData,
					func2setTealiumUtagData: tealiumAnalytics.setTealiumUtagData
				};
				tagOptions = j$.extend(tagOptionsDefault, tagOptions);
				
				if (!data4eventTag) {
					return;
				}
				
				var data = data4eventTag.data;
				
				if (tagOptions.useExistingUtagValuesAsBase && typeof tagOptions.useExistingUtagValuesAsBase === "boolean") {
					var dataFromUtagData = tagOptions.func2getTealiumUtagData(j$, tagOptions);
					data = j$.extend(dataFromUtagData, data);
				}
				
				var dataFromDataAttribute = j$(this).data(tagOptions.dataAttributeName);
				data = j$.extend(data, dataFromDataAttribute);
				
				if (!data) {
					console.warn('Tealium event tagging failure due to unExpected value for data:', data);
					return;
				}
				
				if (!data.link_name) {
					data.link_name = j$(this).text();
				}
				
				if (!data4eventTag.events) {
					data4eventTag.events = tagOptions.events;
				}
				
				if ((!data4eventTag.func || typeof data4eventTag.func !== 'function') && !data4eventTag.eventFuncMap) {
					data4eventTag.func = function() {
						tealiumAnalytics.link(data);
					};
				}
				
				return this.on(data4eventTag.events, data4eventTag.childSelector, data, data4eventTag.func, data4eventTag.eventFuncMap);
			};
		},
		
	    // #### `setTealiumUtagData`
	    // Sets Xplore tags in Tealium's utag_data
		// Returns true upon success. False otherwise
	    // Example usage;
	    //  setTealiumUtagData(data, jQuery)
	    //  setTealiumUtagData(data, jQuery, {setBaseTags: false, setPageTags: true, setUserTags:false})
	    setTealiumUtagData: function (data, j$, tagOptions) {
	        'use strict';
	        j$ = j$ || jQuery;
	        var tagOptionsDefault = {
	            setBaseTags: true,
	            setPageTags: true,
	            setUserTags: true,
	            setEventAndLinkTags: true
	        };
	        tagOptions = j$.extend(tagOptionsDefault, tagOptions);

	        var retVal = false;
	        if (utag_data && typeof utag_data === "object" && data && typeof data === "object") {
	            retVal = true;
	            if (tagOptions.setBaseTags && typeof tagOptions.setBaseTags === "boolean") {
	                utag_data.browse_content_type = data.browse_content_type;
	                utag_data.browse_topic = data.browse_topic;
	                utag_data.content_type = data.content_type;
	                utag_data.course_category_name = data.course_category_name;
	                utag_data.course_sub_category = data.course_sub_category;
	                utag_data.document_id = data.document_id;
	                utag_data.document_isAbstract = data.document_isAbstract;
	                utag_data.document_isDHTML = data.document_isDHTML;
	                utag_data.document_isHTML = data.document_isHTML;
	                utag_data.document_pub_id = data.document_pub_id;
	                utag_data.filter_type = data.filter_type;
	                utag_data.filter_value = data.filter_value;
	                retVal = true;
	            }
	            if (tagOptions.setEventAndLinkTags && typeof tagOptions.setEventAndLinkTags === "boolean") {
	                utag_data.event_name = data.event_name;
	                utag_data.link_category = data.link_category;
	                utag_data.link_name = data.link_name;
	                retVal = true;
	            }
	            if (tagOptions.setPageTags && typeof tagOptions.setPageTags === "boolean") {
	                utag_data.sheet_name = data.sheet_name;
	                utag_data.sheet_type = data.sheet_type;
	                retVal = true;
	            }
	            if (tagOptions.setBaseTags && typeof tagOptions.setBaseTags === "boolean") {
	                utag_data.publisher = data.publisher;
	                utag_data.search_keyword = data.search_keyword;
	                utag_data.search_results_count = data.search_results_count;
	                utag_data.search_type = data.search_type;
	                utag_data.site_section = data.site_section;
	                utag_data.site_section_tab = data.site_section_tab;
	            }
	            if (tagOptions.setUserTags && typeof tagOptions.setUserTags === "boolean") {
	                utag_data.user_id = data.user_id;
	                utag_data.user_institution_id = data.user_institution_id;
	                utag_data.user_product = data.user_product;
	                utag_data.user_third_party = data.user_third_party;
	                utag_data.user_type = data.user_type;
	                retVal = true;
	            }
	        }

	        return retVal;
	    },
		
		// #### `getTealiumUtagData`
		// Returns data object containing Xplore tags in Tealium's utag_data
		// Example usage;
		//  getTealiumUtagData(jQuery)
		//  getTealiumUtagData(jQuery, {setBaseTags: false, setPageTags: true, setUserTags:false})
		getTealiumUtagData: function (j$, tagOptions) {
			j$ = j$ || jQuery;
			var tagOptionsDefault = {
				setBaseTags: true,
				setPageTags: true,
				setUserTags: true
			};
			tagOptions = j$.extend(tagOptionsDefault, tagOptions);
					
			var data = undefined;
			if ( utag_data && typeof utag_data === "object") {
				data = {};
				if (tagOptions.setBaseTags && typeof tagOptions.setBaseTags === "boolean") {
					data.browse_content_type = utag_data.browse_content_type;
					data.browse_topic = utag_data.browse_topic;
					data.content_type = utag_data.content_type;
					data.course_category_name= utag_data.course_category_name;
					data.course_sub_category = utag_data.course_sub_category;
					data.document_id = utag_data.document_id;
					data.document_isAbstract = utag_data.document_isAbstract;
					data.document_isDHTML = utag_data.document_isDHTML;
					data.document_isHTML = utag_data.document_isHTML;
					data.document_pub_id = utag_data.document_pub_id;
					data.event_name = utag_data.event_name;
					data.filter_type = utag_data.filter_type;
					data.filter_value = utag_data.filter_value;
					data.link_category = utag_data.link_category;
					data.link_name = utag_data.link_name;
				}
				if (tagOptions.setPageTags && typeof tagOptions.setPageTags === "boolean") {
					data.sheet_name = utag_data.sheet_name;
					data.sheet_type = utag_data.sheet_type;
				}
				if (tagOptions.setBaseTags && typeof tagOptions.setBaseTags === "boolean") {
					data.publisher = utag_data.publisher;
					data.search_keyword = utag_data.search_keyword;
					data.search_results_count = utag_data.search_results_count;
					data.search_type = utag_data.search_type;
					data.site_section = utag_data.site_section;
					data.site_section_tab = utag_data.site_section_tab;
				}
				if (tagOptions.setUserTags && typeof tagOptions.setUserTags === "boolean") {
					data.user_id = utag_data.user_id;
					data.user_institution_id = utag_data.user_institution_id;
					data.user_product = utag_data.user_product;
					data.user_third_party = utag_data.user_third_party;
					data.user_type = utag_data.user_type;
				}
			}
			
			return data;
		},
						
		view : function(data) {
			utag.view(data);
		},
	
		// #### `link`
		// Wrapper to tealium's utag.link to track user events in JSP pages
		// Returns true, for cases where it is used in onclick of <a> element, to it proceed to href after onclick.
		// Example usage;
		//  in search.jsp Search button
		//		<button type="submit" class="js-search Search-submit Button btn-search telium-searchJsp-search-submit-button" onclick="tealiumAnalytics.link({event_name:'search from home page'})">
		//  in mwRegistrationIntro.jsp after onclick link to tealium, proceeds with href
        //		<li><a href="javascript:Modal.refresh('/xpl/mwForgotUserPasswordIntro.jsp')"  onclick="return tealiumAnalytics.link({event_name:'CreateAcct_Forgot_UP'});">Forgot username or password</a></li>
		link : function(data) {
			utag.link(data);
			return true;	// to let <a>'s href to proceed after onclick has executed
		}
};


jQuery(function() {
	tealiumAnalytics.init();
}); // doc ready
