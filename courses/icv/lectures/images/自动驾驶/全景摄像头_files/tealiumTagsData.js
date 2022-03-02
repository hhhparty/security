/*global tealiumAnalytics, console */
var tealiumTagsData = {

    config: {
        defaults: {
            tagOptions: {
            	// NOTE currently not used
                allTags: {
                    useExistingUtagValuesAsBase: true,		// if true will use existing Xplore utag_data values as base and overwrite them. If false will ignore(wipe out) existing Xplore utag_data values
                    dataAttributeName: 'tealium_utag_data',
                    actionAttributeName: 'tealium_utag_action',
                    setBaseTags: true,
                    setPageTags: true,
                    setUserTags: true,
                    setEventAndLinkTags: true,
                    jqSelector: '.stats-tag-marker-all',
                    events: 'click'
                },
                baseAndPageTagsOnly: {
                    useExistingUtagValuesAsBase: true,		// if true will use existing Xplore utag_data values as base and overwrite them. If false will ignore(wipe out) existing Xplore utag_data values
                    dataAttributeName: 'tealium_utag_data',
                    actionAttributeName: 'tealium_utag_action',
                    setBaseTags: true,
                    setPageTags: true,
                    setUserTags: false,
                    setEventAndLinkTags: false,
                    jqSelector: '.stats-tag-marker-page'
                },
                pageTagsOnly: {
                    useExistingUtagValuesAsBase: true,		// if true will use existing Xplore utag_data values as base and overwrite them. If false will ignore(wipe out) existing Xplore utag_data values
                    dataAttributeName: 'tealium_utag_data',
                    actionAttributeName: 'tealium_utag_action',
                    setBaseTags: false,
                    setPageTags: true,
                    setUserTags: false,
                    setEventAndLinkTags: false,
                    jqSelector: '.stats-tag-marker-page'
                },
                eventAndLinkTagsOnly: {
                    useExistingUtagValuesAsBase: true,		// if true will use existing Xplore utag_data values as base and overwrite them. If false will ignore(wipe out) existing Xplore utag_data values
                    dataAttributeName: 'tealium_utag_data',
                    actionAttributeName: 'tealium_utag_action',
                    setBaseTags: false,
                    setPageTags: false,
                    setUserTags: false,
                    setEventAndLinkTags: true,
                    jqSelector: '.stats-tag-marker-event-link',
                    events: 'click'
                }
            }
        }
    },

    data : {
    	data4angular: {
    		// page related data to pass to tealium via utag.view call upon page/state transition in Angular pages of Xplore
    		pageTags: {
    			// SERP pages
    			serp: {
    				sheet_name: "Search Results",
    				sheet_type: "Search"
    			},
    			// courses pages
    			courses_home: {
    				sheet_name: "Courses Home",
    				sheet_type: "Courses"
    			}, 
    			courses_category: {
    				sheet_name: "Courses Category",
    				sheet_type: "Courses"
    			},
    			courses_course_detail: {
    				sheet_name: "Courses Detail",
    				sheet_type: "Courses"
    			},
    			courses_myCourses: {
    				sheet_name: "My Courses",
    				sheet_type: "Courses"
                },
                // virtual journal pages
                virtual_journal_home: {
                    sheet_name: "Virtual Journal Home",
                    sheet_type: "Virtual Journal"
                },
                virtual_journal_issue: {
                    sheet_name: "Virtual Journal Issue",
                    sheet_type: "Virtual Journal"
                },
                virtual_journal_past_issue: {
                    sheet_name: "Virtual Journal Past Issue",
                    sheet_type: "Virtual Journal"
                },
                virtual_journal_full_issue: {
                    sheet_name: "Virtual Journal Full Issue View",
                    sheet_type: "Virtual Journal"
                },
                virtual_journal_topics: {
                    sheet_name: "Virtual Journal Topics",
                    sheet_type: "Virtual Journal"
                },
                virtual_journal_about_aims_scope: {
                    sheet_name: "Virtual Journal About - Aims And Scope",
                    sheet_type: "Virtual Journal"
                },
                virtual_journal_about_editorial_board: {
                    sheet_name: "Virtual Journal About - Editorial Board",
                    sheet_type: "Virtual Journal"
                },
                virtual_journal_about_sponsoring_societies: {
                    sheet_name: "Virtual Journal About - Sponsporing Societies",
                    sheet_type: "Virtual Journal"
                }
     		}
    	},
    	
        data4pageTags: [],

        // Events in JSP pages are handled via below array
        data4eventTags: [

        ]
    }
};