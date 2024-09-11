// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2021 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

function MVGA_Tracker( product_link_prefix, category_name, product_code, product_name, mvga_basketitems, mvga_orderitems )
{
	this.category_name			= category_name;
	this.product_link_prefix	= product_link_prefix;
	this.product_code 			= product_code;
	this.product_name 			= product_name;
	this.basketitems			= mvga_basketitems;
	this.orderitems				= mvga_orderitems;

	this.basketitems_lookup		= [];
	this.orderitems_lookup		= [];

	this.product_links			= [];
	this.product_attributes		= [];
	this.upsell_products		= [];

	this.main_product_form		= null;
	
	this.Page_Dispatch();
}

MVGA_Tracker.prototype.Page_Dispatch = function()
{
	if ( Screen == 'BASK' )			this.Process_BASK();
	else if ( Screen == 'PROD' )	this.Process_PROD();
	else if ( Screen == 'OUS1' ) 	this.Process_OUS1(); 
	else if ( Screen == 'OUSM' ) 	this.Process_OUSM(); 
	else if ( Screen == 'OSEL' ) 	this.Process_OSEL(); 

	if ( Screen == 'CTGY' ||
  		 Screen == 'PLST' ||
  		 Screen == 'PROD' ||
		 Screen == 'SRCH' )		
	{
		this.Process_List_Page();
	}
}

MVGA_Tracker.prototype.Process_BASK = function()
{
	var self = this;
	var i, i_len, form_action, page_remove_links, page_remove_forms;

	page_remove_links = document.getElementsByTagName( 'a' );
	page_remove_forms = document.getElementsByTagName( 'form' );

	for ( i = 0, i_len = page_remove_links.length; i < i_len; i++ )
	{
		if ( page_remove_links[ i ].href.indexOf( 'Action=RGRP' ) == -1 && page_remove_links[ i ].href.indexOf( 'Action=RPRD' ) == -1 ) continue;
		
		AddEvent( page_remove_links[ i ], 'click', function( e )
		{
			return self.RemoveFromBasketLinks( e );
		} );
	}

	for ( i = 0, i_len = page_remove_forms.length; i < i_len; i++ )
	{
		form_action = page_remove_forms[ i ].elements[ 'Action' ];

		if ( !form_action ) continue;

		if ( form_action.value == 'RGRP' || form_action.value == 'RPRD' )
		{
			AddEvent( page_remove_forms[ i ], 'submit', function( e )
			{
				return self.RemoveFromBasketForms( e );
			} );
		}
		else if ( form_action.value == 'QNTY' || form_action.value == 'QTYG' )
		{
			AddEvent( page_remove_forms[ i ], 'submit', function( e )
			{
				return self.UpdateBasketQuantity( e );
			} );
		}
	}

	this.Build_BasketAndOrderItem_Lookup();
}

MVGA_Tracker.prototype.RemoveFromBasketForms = function( e )
{
	var remove_form, basketitem_id;

	e 				= e || window.event;
	remove_form 	= e.srcElement || e.target;

	if ( !remove_form || !remove_form.elements ) return true;

	basketitem_id	= remove_form.elements[ 'Basket_Group' ] || remove_form.elements[ 'Basket_Line' ];

	if ( !basketitem_id ) return true;

	ga( 'require', 'ec' );

	ga( 'ec:addProduct', 
	{
		'id'		: this.basketitems_lookup[ basketitem_id.value ].code,
		'name'		: this.basketitems_lookup[ basketitem_id.value ].name,
		'quantity'	: this.basketitems_lookup[ basketitem_id.value ].quantity
	} );

	ga( 'ec:setAction', 'remove' );

	ga( 'send', 'event', 'remove_button', 'click', 'remove from cart', { 'hitCallback': function()
	{
		remove_form.submit();
	} } );

	return eventPreventDefault( e );
}

MVGA_Tracker.prototype.RemoveFromBasketLinks = function( e )
{
	var i, i_len, remove_element, parameters, basketitem_id;

	e 				= e || window.event;
	remove_element 	= e.srcElement || e.target;

	if ( !remove_element.href ) return true;

	parameters = remove_element.href.split( '&' );

	for ( i = 0, i_len = parameters.length; i < i_len; i++ )
	{
		if ( parameters[ i ].indexOf( 'Basket_Group=' ) != -1 )			basketitem_id = parameters[ i ].substring( parameters[ i ].indexOf( 'Basket_Group=' ) + 13 );
		else if ( parameters[ i ].indexOf( 'Basket_Line=' ) != -1 )		basketitem_id = parameters[ i ].substring( parameters[ i ].indexOf( 'Basket_Line=' ) + 12 );
	}

	if ( !basketitem_id ) return true;

	ga( 'require', 'ec' );

	ga( 'ec:addProduct', 
	{
		'id'		: this.basketitems_lookup[ basketitem_id ].code,
		'name'		: this.basketitems_lookup[ basketitem_id ].name,
		'quantity'	: this.basketitems_lookup[ basketitem_id ].quantity
	} );

	ga( 'ec:setAction', 'remove' );

	ga( 'send', 'event', 'remove_button', 'click', 'remove from cart', { 'hitCallback': function()
	{
		document.location.href = remove_element.href;
	} } );

	return eventPreventDefault( e );
}

MVGA_Tracker.prototype.UpdateBasketQuantity = function( e )
{
	var quantity_form, basketitem_id, quantity;

	e 				= e || window.event;
	quantity_form 	= e.srcElement || e.target;

	if ( !quantity_form || !quantity_form.elements ) return true;

	basketitem_id	= quantity_form.elements[ 'Basket_Line' ] || quantity_form.elements[ 'Basket_Group' ];
	quantity		= quantity_form.elements[ 'Quantity' ];

	if ( !basketitem_id || !quantity ) return true;

	ga( 'require', 'ec' );

	if ( quantity.value > this.basketitems_lookup[ basketitem_id.value ].quantity )
	{
		ga( 'ec:addProduct', 
		{
			'id'		: this.basketitems_lookup[ basketitem_id.value ].code,
			'name'		: this.basketitems_lookup[ basketitem_id.value ].name,
			'quantity'	: quantity.value - this.basketitems_lookup[ basketitem_id.value ].quantity
		} );

		ga( 'ec:setAction', 'add' );

		ga( 'send', 'event', 'update_quantity', 'click', 'Update basket quantity', { 'hitCallback': function()
		{
			quantity_form.submit();
		} } );
	}
	else if ( quantity.value < this.basketitems_lookup[ basketitem_id.value ].quantity )
	{
		ga( 'ec:addProduct', 
		{
			'id'		: this.basketitems_lookup[ basketitem_id.value ].code,
			'name'		: this.basketitems_lookup[ basketitem_id.value ].name,
			'quantity'	: this.basketitems_lookup[ basketitem_id.value ].quantity - quantity.value 
		} );

		ga( 'ec:setAction', 'remove' );

		ga( 'send', 'event', 'update_quantity', 'click', 'Update basket quantity', { 'hitCallback': function()
		{
			quantity_form.submit();
		} } );
	}

	return eventPreventDefault( e );
}

MVGA_Tracker.prototype.Process_PROD = function()
{
	this.Find_PROD_ADPR_Forms();
}

MVGA_Tracker.prototype.Find_PROD_Attributes = function()
{
	var i, name, index;

	if ( !this.main_product_form || !this.main_product_form.elements ) return;

	for ( i = 0; i < this.main_product_form.elements.length; i++ )
	{
		if ( typeof this.main_product_form.elements[ i ].type !== 'string' ||
			 typeof this.main_product_form.elements[ i ].name !== 'string' )															continue;
		if ( this.main_product_form.elements[ i ].type.toLowerCase() != 'hidden' )														continue;
		if ( this.main_product_form.elements[ i ].name.indexOf( ']:code' ) != this.main_product_form.elements[ i ].name.length - 6 )	continue;
		if ( this.main_product_form.elements[ i ].name.indexOf( 'Product_Attributes[' ) != 0 )											continue;

		name	= this.main_product_form.elements[ i ].name.replace( /Product_Attributes\[/g, '' );
		name	= name.replace( / /g, '' );
		name	= name.replace( /\]:code/g, '' );

		index	= parseInt( name );

		this.product_attributes[ index ] 		= new Object();
		this.product_attributes[ index ].code	= this.main_product_form.elements[ i ].value; 
		this.product_attributes[ index ].value	= '';
	}

	for ( i = 0; i < this.main_product_form.elements.length; i++ )
	{
		if ( typeof this.main_product_form.elements[ i ].type !== 'string' ||
			 typeof this.main_product_form.elements[ i ].name !== 'string' )															continue;
		if ( this.main_product_form.elements[ i ].name.indexOf( ']:value' ) != this.main_product_form.elements[ i ].name.length - 7 )	continue;
		if ( this.main_product_form.elements[ i ].name.indexOf( 'Product_Attributes[' ) != 0 )											continue;
		if ( this.main_product_form.elements[ i ].disabled )																			continue;

		name	= this.main_product_form.elements[ i ].name.replace( /Product_Attributes\[/g, '' );
		name	= name.replace( / /g, '' );
		name	= name.replace( /\]:value/g, '' );
		name 	= parseInt( name );

		if ( this.main_product_form.elements[ i ].type.toLowerCase() == 'select-one' )
		{
			this.product_attributes[ name ].value = encodeURIComponent( this.main_product_form.elements[ i ].options[ this.main_product_form.elements[ i ].selectedIndex ].value );
		}
		else if ( this.main_product_form.elements[ i ].type.toLowerCase() == 'radio' )
		{
			if ( this.main_product_form.elements[ i ].checked ) this.product_attributes[ name ].value = encodeURIComponent( this.main_product_form.elements[ i ].value );
		}
		else if ( this.main_product_form.elements[ i ].type.toLowerCase() == 'checkbox' )
		{
			if ( this.main_product_form.elements[ i ].checked )	this.product_attributes[ name ].value = encodeURIComponent( this.main_product_form.elements[ i ].value );
		}
		else if ( this.main_product_form.elements[ i ].type == 'text' )
		{
			if ( this.main_product_form.elements[ i ].value.length ) this.product_attributes[ name ].value = 'populated';
		}
		else if ( this.main_product_form.elements[ i ].type == 'textarea' )
		{
			if ( this.main_product_form.elements[ i ].value.length ) this.product_attributes[ name ].value = 'populated';
		}
	}
}

MVGA_Tracker.prototype.Find_PROD_ADPR_Forms = function()
{
	var self = this;
	var i, i_len, action, page_forms, product_code;

	page_forms = document.getElementsByTagName( 'form' );

	for ( i = 0, i_len = page_forms.length; i < i_len; i++ )
	{
		action			= page_forms[ i ].elements[ 'Action' ];
		product_code	= page_forms[ i ].elements[ 'Product_Code' ];

		if ( !action || !product_code ) 			continue;
		if ( action.value != 'ADPR' )				continue;

		if ( product_code.value != Product_Code )	continue;
	
		AddEvent( page_forms[ i ], 'submit', function( e )
		{
			self.Find_PROD_Attributes();
			self.AddToBasketSubmit( e );
		} );

		this.main_product_form = page_forms[ i ];
		break;
	}
}

MVGA_Tracker.prototype.Process_OUS1 = function()
{
	var self = this;
	var i, i_len, action, page_forms, product_code;

	page_forms = document.getElementsByTagName( 'form' );

	for ( i = 0, i_len = page_forms.length; i < i_len; i++ )
	{
		action			= page_forms[ i ].elements[ 'Action' ];
		product_code	= page_forms[ i ].elements[ 'Product_Code' ];

		if ( !action || !product_code )	continue;
		if ( action.value != 'AUPR' )	continue;

		AddEvent( page_forms[ i ], 'submit', function( e )
		{
			return self.UpsellOUS1FormSubmit( e );
		} );
	}
}

MVGA_Tracker.prototype.Process_OUSM = function()
{
	var self = this;
	var i, i_len, action, page_forms;

	page_forms = document.getElementsByTagName( 'form' );

	for ( i = 0, i_len = page_forms.length; i < i_len; i++ )
	{
		action = page_forms[ i ].elements[ 'Action' ];

		if( !action || action.value != 'AUPM' )	continue;

		AddEvent( page_forms[ i ], 'submit', function( e )
		{
			self.Find_OUSM_Selection( e );
			return self.UpsellFormSubmit( e );
		} );

		break;
	}
}

MVGA_Tracker.prototype.UpsellOUS1FormSubmit = function( e )
{
	var upsell_form, product_code;

	e 			= e || window.event;
	upsell_form = e.srcElement || e.target;

	if ( !upsell_form || !upsell_form.elements ) return true;

	product_code	= upsell_form.elements[ 'Product_Code' ];	

	if ( !product_code ) return true;

	ga( 'require', 'ec' );

	ga( 'ec:addProduct', 
	{
		'name'		: product_code.value,
		'quantity'	: 1 
	} );

	ga( 'ec:setAction', 'add' );

	ga( 'send', 'event', 'upsell_add_to_cart', 'click', 'Upsell', { 'hitCallback': function()
	{
		upsell_form.submit();
	} } );

	return eventPreventDefault( e );
}

MVGA_Tracker.prototype.UpsellFormSubmit = function( e )
{
	var i, upsell_form;

	e 			= e || window.event;
	upsell_form = e.srcElement || e.target;

	if ( !upsell_form || !upsell_form.elements ) return true;

	ga( 'require', 'ec' );

	for ( i = 0; i < this.upsell_products.length; i++ )
	{
		if ( !this.upsell_products[ i ] ) continue;

		ga( 'ec:addProduct', 
		{
			'name'		: this.upsell_products[ i ].code,
			'quantity'	: 1 
		} );
	}
	
	ga( 'ec:setAction', 'add' );

	ga( 'send', 'event', 'upsell_add_to_cart', 'click', 'Upsell', { 'hitCallback': function()
	{
		upsell_form.submit();
	} } );

	return eventPreventDefault( e );
}

MVGA_Tracker.prototype.Find_OUSM_Selection = function( e )
{
	var i, name, index, ousm_form;
	
	e 			= e || window.event;
	ousm_form 	= e.srcElement || e.target;

	if ( !ousm_form || !ousm_form.elements ) return;

	for ( i = 0; i < ousm_form.elements.length; i++ )
	{
		if ( typeof ousm_form.elements[ i ].type !== 'string' ||
			 typeof ousm_form.elements[ i ].name !== 'string' )												continue;
		if ( ousm_form.elements[ i ].type.toLowerCase() != 'hidden' )										continue;
		if ( ousm_form.elements[ i ].name.indexOf( ']:code' ) != ousm_form.elements[ i ].name.length - 6 )	continue;
		if ( ousm_form.elements[ i ].name.indexOf( 'Product[' ) != 0 )										continue;

		name	= ousm_form.elements[ i ].name.replace( /Product\[/g, '' );
		name	= name.replace( / /g, '' );
		name	= name.replace( /\]:code/g, '' );

		index	= parseInt( name );

		this.upsell_products[ index ] 		= new Object();
		this.upsell_products[ index ].code	= ousm_form.elements[ i ].value; 
		this.upsell_products[ index ].value	= '';
	}

	for ( i = 0; i < ousm_form.elements.length; i++ )
	{
		if ( typeof ousm_form.elements[ i ].type !== 'string' ||
			 typeof ousm_form.elements[ i ].name !== 'string' )											continue;
		if ( ousm_form.elements[ i ].type.toLowerCase() != 'checkbox' )									continue;
		if ( ousm_form.elements[ i ].name.indexOf( ']' ) != ousm_form.elements[ i ].name.length - 1 )	continue;
		if ( ousm_form.elements[ i ].name.indexOf( 'Upsell_Selected[' ) != 0 )							continue;
		if ( ousm_form.elements[ i ].disabled )															continue;

		name	= ousm_form.elements[ i ].name.replace( /Upsell_Selected\[/g, '' );
		name	= name.replace( / /g, '' );
		name	= name.replace( /\]/g, '' );
		name 	= parseInt( name );

		if ( ousm_form.elements[ i ].checked )
		{
			this.upsell_products[ name ].value = encodeURIComponent( ousm_form.elements[ i ].value );
		}
	}
}

MVGA_Tracker.prototype.Process_OSEL = function()
{
	var self = this;
	var i, page_forms, form_payment, form_shipping;

	page_forms = document.getElementsByTagName( 'form' );

	for ( i = 0; i < page_forms.length; i++ )
	{
		form_shipping 	= page_forms[ i ].elements[ 'ShippingMethod' ];
		form_payment 	= page_forms[ i ].elements[ 'PaymentMethod' ];

		if ( !form_shipping || !form_payment ) continue;

		this.Build_BasketAndOrderItem_Lookup();

		AddEvent( page_forms[ i ], 'submit', function( e )
		{
			return self.OSELFormSubmit( e );
		} );

		break;
	}
}

MVGA_Tracker.prototype.OSELFormSubmit = function( e )
{
	var osel_form, shipping_selector, payment_selector, shipping_selection, payment_selection;

	e 					= e || window.event;
	osel_form			= e.srcElement || e.target; 

	if ( !osel_form || !osel_form.elements ) return true;

	shipping_selector	= osel_form.elements[ 'ShippingMethod' ];
	payment_selector	= osel_form.elements[ 'PaymentMethod' ];

	if ( shipping_selector instanceof HTMLSelectElement )	shipping_selection	= shipping_selector.selectedIndex < 0 ? '' : shipping_selector.options[ shipping_selector.selectedIndex ].value;
	else if ( shipping_selector )							shipping_selection	= shipping_selector.value;
	else													shipping_selection	= '';

	if ( payment_selector instanceof HTMLSelectElement )	payment_selection	= payment_selector.selectedIndex < 0 ? '' : payment_selector.options[ payment_selector.selectedIndex ].value;
	else if ( payment_selector )							payment_selection	= payment_selector.value;
	else													payment_selection	= '';

	ga( 'ec:setAction', 'checkout_option', { 'step': 1, 'option': shipping_selection + ', ' + payment_selection } );

	ga( 'send', 'event', 'Checkout', 'Option', 
	{
		hitCallback: function()
		{
			if ( osel_form ) osel_form.submit();
		}
	} );

	return eventPreventDefault( e );
}

MVGA_Tracker.prototype.AddToBasketSubmit = function( e )
{
	var product_form, product_code, quantity;
	
	e 				= e || window.event;
	product_form 	= e.srcElement || e.target;

	if ( !product_form || !product_form.elements ) return true; 

	product_code	= product_form.elements[ 'Product_Code' ];
	quantity		= product_form.elements[ 'Quantity' ];

	if ( !product_code || !quantity ) return true;

	ga( 'require', 'ec' );

	ga( 'ec:addProduct', 
	{
		'id'		: product_code.value,
		'name'		: product_code.value,
		'quantity'	: quantity ? parseInt( quantity.value ) : 1,
		'variant'	: this.Generate_Variant_Label(),
		'category'	: this.category_name
	} );

	ga( 'ec:setAction', 'add' );

	ga( 'send', 'event', 'detail_add_to_cart', 'click', 'add to cart', { 'hitCallback': function()
	{
		product_form.submit();
	} } );

	return eventPreventDefault( e );
}

MVGA_Tracker.prototype.Generate_Variant_Label = function()
{
	var i, i_len, label;

	label = '';

	for ( i = 0, i_len = this.product_attributes.length; i < i_len; i++ )
	{
		if ( !this.product_attributes[ i ] ) continue;

		if ( this.product_attributes[ i ].value )
		{
			if ( label.length ) label += ', ';
			label += this.product_attributes[ i ].code + ': ' + this.product_attributes[ i ].value;
		}	
	}

	return label;
}

MVGA_Tracker.prototype.List_AddToBasketSubmit = function( e )
{
	var product_form, product_code;

	e 				= e || window.event;
	product_form	= e.srcElement || e.target;
	
	if ( !product_form || !product_form.elements ) return true;

	product_code	= product_form.elements[ 'Product_Code' ];

	if ( !product_code ) return true;

	ga( 'require', 'ec' );

	ga( 'ec:addProduct', 
	{
		'id'		: product_code.value,
		'name'		: product_code.value,
		'quantity'	: 1,
		'category'	: this.category_name
	} );
	
	ga( 'ec:setAction', 'add', { 'list' : this.Get_Listing_Label( Screen ) } );

	ga( 'send', 'event', 'list_add_to_cart', 'click', 'add to cart', { 'hitCallback': function()
	{
		product_form.submit();
	} } );

	return eventPreventDefault( e );
}

MVGA_Tracker.prototype.Find_List_ADPR_Forms = function()
{
	var self = this;
	var i, i_len, action, page_forms, product_code;

	page_forms = document.getElementsByTagName( 'form' );

	for ( i = 0, i_len = page_forms.length; i < i_len; i++ )
	{
		action			= page_forms[ i ].elements[ 'Action' ];
		product_code	= page_forms[ i ].elements[ 'Product_Code' ];

		if ( !action || !product_code ) 			continue;
		if ( product_code.value == Product_Code ) 	continue;
		if ( action.value != 'ADPR' )				continue;
	
		AddEvent( page_forms[ i ], 'submit', function( e )
		{
			return self.List_AddToBasketSubmit( e );
		} );
	}
}

MVGA_Tracker.prototype.Process_List_Page = function()
{
	var self = this;
	var i, i_len, page_links;

	page_links	= document.getElementsByTagName( 'a' );

	for ( i = 0, i_len = page_links.length; i < i_len; i++ )
	{
		if ( page_links[ i ].getAttribute( 'data-mm-linktype' ) === 'product-list-link' )
		{
			AddEvent( page_links[ i ], 'click', function( e )
			{
				return self.ProductLinkClick( e );
			} );
		}
	}

	this.Find_List_ADPR_Forms();
}

MVGA_Tracker.prototype.ProductLinkClick = function( e )
{
	var i, i_len, product, product_code, product_link, element_product;

	e				= e || window.event;
	product			= null;
	element_product	= e.srcElement || e.target;

	if ( !( element_product instanceof HTMLElement ) )
	{
		return true;
	}

	if ( element_product.nodeName == 'IMG' )
	{
		element_product = element_product.parentNode;
	}

	if ( typeof element_product.href !== 'string' || element_product.href.length === 0 )
	{
		return true;
	}

	if ( element_product.hasAttribute( 'data-product-code' ) )
	{
		product_code = element_product.getAttribute( 'data-product-code' );

		for ( i = 0, i_len = mvga_productlist.length; i < i_len; i++ )
		{
			if ( mvga_productlist[ i ].code === product_code )
			{
				product = mvga_productlist[ i ];
				break;
			}
		}
	}

	if ( product === null )
	{
		product_link = element_product.href;

		for ( i = 0, i_len = mvga_productlist.length; i < i_len; i++ )
		{
			if ( mvga_productlist[ i ].link === product_link )
			{
				product = mvga_productlist[ i ];
				break;
			}
		}
	}

	if ( product === null )
	{
		return true;
	}

	ga( 'require', 'ec' );

	ga( 'ec:addProduct', 
	{
		'id'		: product.code,
		'name'		: product.name,
		'category'	: this.category_name,
		'position'	: product.position
	} );

	ga( 'ec:setAction', 'click', { 'list' : this.Get_Listing_Label( Screen ) } );

	ga( 'send', 'event', 'product_list_click', 'click', 'View Product Details', { 'hitCallback': function()
	{ 
		document.location.href = element_product.href;
	} } );

	return eventPreventDefault( e );
}

MVGA_Tracker.prototype.Build_BasketAndOrderItem_Lookup = function()
{
	var i, i_len;

	for ( i = 0, i_len = this.basketitems.length; i < i_len; i++ )
	{
		this.basketitems_lookup[ this.basketitems[ i ].line_id ] 			= new Object();
		this.basketitems_lookup[ this.basketitems[ i ].line_id ].code 		= this.basketitems[ i ].code;
		this.basketitems_lookup[ this.basketitems[ i ].line_id ].name		= this.basketitems[ i ].name;
		this.basketitems_lookup[ this.basketitems[ i ].line_id ].price 		= this.basketitems[ i ].price;
		this.basketitems_lookup[ this.basketitems[ i ].line_id ].quantity 	= this.basketitems[ i ].quantity;
	}

	for ( i = 0, i_len = this.orderitems.length; i < i_len; i++ )
	{
		this.orderitems_lookup[ this.orderitems[ i ].line_id ] 				= new Object();
		this.orderitems_lookup[ this.orderitems[ i ].line_id ].code 		= this.orderitems[ i ].code;
		this.orderitems_lookup[ this.orderitems[ i ].line_id ].name			= this.orderitems[ i ].name;
		this.orderitems_lookup[ this.orderitems[ i ].line_id ].price		= this.orderitems[ i ].price;
		this.orderitems_lookup[ this.orderitems[ i ].line_id ].quantity 	= this.orderitems[ i ].quantity;
	}
}

MVGA_Tracker.prototype.Get_Listing_Label = function( screen )
{
	switch ( screen )
	{
		case 'PROD' :	return 'Related Products';
		case 'CTGY' :	return 'Category Listing';
		case 'PLST' :	return 'All Products';
		case 'SRCH' :	return 'Search Results';
	}
}

function getScopedElementsByClassName( className, scope )
{
    var regex_match, all_elements, results, i;
    
    regex_match     = new RegExp( "(?:^|\\s)" + className + "(?:$|\\s)" );
    all_elements    = scope.getElementsByTagName( '*' );
    results         = [];
    
    for ( i = 0; all_elements[ i ] != null; i++ )
    {
		if ( all_elements[ i ].className && ( all_elements[ i ].className.indexOf( className ) != -1 ) && regex_match.test( all_elements[ i ].className ) )
		{
			results.push( all_elements[ i ] );
		}
    }
    
    return results;
}

function AddEvent( obj, eventType, fn  )
{
	try
	{
		obj.addEventListener( eventType, fn, false );
		return true;
	}
	catch ( e )
	{
		try
		{
			return obj.attachEvent( 'on' + eventType, fn );
		}
		catch ( e )
		{
			return false;
		}
	}
}

function eventPreventDefault( event )
{
	if ( event.preventDefault )
	{
		return event.preventDefault();
	}

	event.returnValue = false;

	return false;
}
