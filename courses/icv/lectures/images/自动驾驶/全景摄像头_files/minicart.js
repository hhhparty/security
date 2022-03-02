function showSignIn(){

	javascript: Modal.show('/xpl/mwMemberSignIn.jsp');


}
function p_refreshPage() {
	location.reload();
}

function doPurchaseFromPartner() {
	var formId = '#'+j$(this).closest('form').attr('id');
	var formCheckBoxCountCount = j$(formId+ " input:checked").length;
	if (formCheckBoxCountCount <= 0) {
		alert('No item selected.  Please select an item.');
		return false;
	}else{		
		window.location.href = j$(formId).attr('action');
		return false;
	}
}

function addItemsToCart(){
	try{
		var formId = '#'+j$(this).closest('form').attr('id');
		var count = j$(formId+ " input:checked").length;
		if (count <= 0) {
			alert('Please select an item to add to Cart');
			return false;
		}
		else if (isFunction("isPartNumberExists")== false || isFunction('mc_addItems')== false )
		{
			alert("The ecommerce service is not available at this time.  Please try again .");
			return false;
		}
		var items='[';
	
		j$(formId+ " input:checked").each(function(index) {
		    var item_to_add = '{"partNum":"'+j$(formId+ " input:checked").val()+'","quantity":"1","membershipType":"","country":""}';
		    items=items+item_to_add;
		    if(index < (count-1))
		    	items=items+','+"'+'";  
		  });
		items=items+']';
		j$("#add-to-cart-button").attr("disabled", "disabled");
		mc_addItems(items,addToCartSuccess,addToCartFailure);
	}catch(err){
		alert(err);
		alert("The ecommerce service is not available at this time.  Please try again later.");
		return false;
	}
	return false;

}
function hideFlyout(){
	if( j$('#full-txt-menu-wrap').is(':visible') ) {
		j$('#full-txt-menu-wrap').hide();
	}	
	j$('#article-page-hdr').removeClass('menu-open');
	
}
function addToCartFailure(err){
	j$("#add-to-cart-button").removeAttr("disabled");
	hideFlyout();
}
function mc_removeItem_success(){
	if( typeof myVarible !== "undefined"){
		if(isPartNumberExists(partNumber) == false){
			j$("#addedToCartSpan").hide();
			j$("#addedToCartSpanBundle").hide();
			j$("#addToCartSpan").show();
			j$("#addToCartSpan").find('#add-to-cart-button').attr({
	        src: ASSETS_RELATIVE_PATH +'/img/btn.add-to-cart.png?cv=' + ASSETS_VERSION
			});
		}	
	}
	j$("#add-to-cart-button").removeAttr("disabled");
	setCurrentCartCount();
	var minicartWrapper=j$("#mc_ieee-mini-cart-include_wrapper");
	if(minicartWrapper){
		var cartCount=getCartCount();
		if(cartCount<1){
			j$("#global-header-cart-count").removeClass('show-cart');
			minicartWrapper.hide();
		}
	}
}
function getCartCount(){
	var cartCount=0;
	if(j$ !=null && j$.cookie !=null)
	{
		cartCookie=j$.cookie('ieeeUserInfoCookie');
		if(cartCookie)
		{
			var cartCookieObj=j$.parseJSON(cartCookie);
			if(cartCookieObj.cartItemQty)
			{
				cartCount=cartCookieObj.cartItemQty;
			}
		}
	 }	
	return cartCount;
}

function addToCartSuccess(){
	toggleAddToCart();
	hideFlyout();
}
function errorInitMiniCart()
{
	alert("Error Initializing Mini Cart");
}
function closeCart(e){
	e.stopPropagation(); // Stops bubbling up the DOM and hitting the `li` click event to show cart
	j$("#mc_ieee-mini-cart-include_wrapper").hide();
	j$("#global-header-cart-count").removeClass('show-cart');
}
function toggleAddToCart(){
	setCurrentCartCount();
	//check if mini cart javascript functions are avaiable and if not show button (When the user clicks on button, they will be prompted that the add to cart is currently not available)
	//if mini cart javascript functions are available continue with logic
	if (isFunction("isPartNumberExists")== false || isFunction('mc_addItems')== false ) {
		j$("#addToCartSpan").show();
		j$("#addedToCartSpan").hide();
		return;
	}
	cartBoxCheck();
	j$("#purchase-options input[type=radio]").each(function () {
		productType = j$(this).next('label').text().trim();
		partNumber=j$(this).val();
		if(partNumber){
			if( isPartNumberExists(partNumber) == true){
				addedToCartText(productType);
				return;
			}
		}else{
			j$("#addToCartSpan").show();
			j$("#addedToCartSpanBundle").hide();
		}
	});
	j$("#purchase-options input[type=checkbox]").each(function () {
		partNumber=j$(this).val();
		//alert( "isPartNumberExists(partNumber)" +isPartNumberExists(partNumber));
		if(partNumber){
			if( isPartNumberExists(partNumber) == true){
			j$("#addToCartSpan").hide();
			j$("#addedToCartSpan").show();
			j$("#addedToCartSpan").css('display', 'inline-block');
			}
		}else{
			j$("#addToCartSpan").show();
			j$("#addedToCartSpan").hide();
		}
	});
	repaintWrapper();

}
function initMiniCartSignInLink(){
	var attr = j$('#mc-signin-link').attr('href');
	if (typeof attr !== typeof undefined && attr !== false) {
		j$('#mc-signin-link').removeAttr('href').unbind('click');	
		j$('#mc_ieee-mini-cart-include_wrapper').delegate('#mc-signin-link','click',showSignIn);
	}
	
}

function purchasePDF() {
  j$("#purchaseOther").attr('class', '');
  j$("#purchasePDF").attr('class', 'active');
  j$("#ftm-purchase-other").hide();
  j$("#ftm-purchase-pdf").show();
}

function purchaseOther() {
  j$("#purchasePDF").attr('class', '');
  j$("#purchaseOther").attr('class', 'active');
  j$("#ftm-purchase-pdf").hide();
  j$("#ftm-purchase-other").show();
}
j$(document).ready(function() {
	  if (isFunction("mc_initMiniCart"))
	  {
		 mc_initMiniCart(toggleAddToCart,errorInitMiniCart);
	  
	  }
	  j$("#global-header-cart-count").on("click", function(event){
		  var minicartWrapper=j$("#mc_ieee-mini-cart-include_wrapper");
		  if(minicartWrapper){
			event.preventDefault();
			var cartCount=getCartCount();
			if(cartCount>0){
				j$("#global-header-cart-count").addClass('show-cart');
				initMiniCartSignInLink();
				minicartWrapper.show();
			}
		  }
		  j$('#global-header-cart-count a.title').unbind().click(function (e) {
			  window.open(e.currentTarget.href, '_self');
		  });
		  j$('#global-header-cart-count .confirmation-msg a').unbind().click(function (e) {
			  window.open(e.currentTarget.href, '_self');
		  });
	  } );
	  
	  
});
