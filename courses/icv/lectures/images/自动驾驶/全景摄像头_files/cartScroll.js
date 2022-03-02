(function($) {
	
	

	var floatCart = {

			options : {
				"$floatSec":"",
				"bottomCollisionId":"",	//optional bottomCollisionId			
				"offset":0//offset for metanav as page container is position relative
			},
			initFloat: function (){
				try{
					var $floatDiv = $(floatCart.options.floatSec);	
					//$floatDiv.addClass("");
					var isOldIEBrowser = false;
					if (navigator.appVersion.indexOf("MSIE") != -1) {
						var appVersion = navigator.appVersion.split("MSIE");
						var version = parseFloat(appVersion[1]);
						if (version <= 6) {
							isOldIEBrowser = true;
						}
					}
					var topPos = ($floatDiv.offset().top);
					if (!isOldIEBrowser) {
						$floatDiv.bind('cartScroll', function(event) {
							var $pageContainer = $("#Body");
							var leftSecHt  = $pageContainer.find("#primary-content").height();

							var rightSecHt = $pageContainer.find(".column-side-right").height();
							//if left section is greater than right sec dont float
							if(leftSecHt<rightSecHt){	
								//console.log('--moving rightSecHt'+rightSecHt);
								//console.log('--moving leftSecHt'+leftSecHt);

								return;
							}

							//if bottom collision id is not provided then stop at the end of the document
							if(typeof floatCart.options.bottomCollisionId!= 'undefined'){
								var botColTop = parseInt($("#"+floatCart.options.bottomCollisionId).offset().top)-floatCart.options.offset;	
							}else{
								var botColTop = $(document).height()-floatCart.options.offset;
							}
							
							var floatHt = $floatDiv.height();
						      var y = $(window).scrollTop();
							  
						      var scrollLeft = $(window).scrollLeft();
						      if((scrollLeft==0) && (y>topPos)){
						    	  if(((parseInt(y+floatHt))>=botColTop)){
									//console.log('--bottom');
						    		  $floatDiv.css("position","absolute");
							    	  $floatDiv.css("top",(botColTop-floatHt) +"px");
						    	  }else{
						    		  $floatDiv.css("position","fixed");
								  	  $floatDiv.css("top",0);
									  //console.log('--moving');
						    	  }		    	
						      }else{
						    	  $floatDiv.css("position","");
						    	  $floatDiv.css("top",topPos +"px");
								  //console.log('--top');
						      }
							      //console.log("botColTop: " + botColTop);
								  //console.log("y: " + y);
								  //console.log("floatHt: " + floatHt);
								  //console.log("topPos: " + topPos);
								  //console.log("topPos: " + topPos);
								  //console.log("leftSecHt: " + leftSecHt + " < " + rightSecHt + " :rightSecHt");
								  //console.log('------------------------');
								  
						});
						$(window).scroll(function (event) {
							$floatDiv.trigger('cartScroll');		     
						});
						$(window).resize(function (event) {
							$floatDiv.trigger('cartScroll');
						});
						$(window).load(function() {
							$floatDiv.trigger('cartScroll');
						});
					} 
				}catch(e){
					//donot do anything let it go
				}
			}
	};

	$.fn.ibpFloatVertical = function(options) {
		$.extend(floatCart.options, options);
		return this.each(function() {
			floatCart.options.floatSec=this;
					floatCart.initFloat();	
		});
	};
	
	

})(jQuery);






 

    


