// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2024 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// Review Baskets List Detail Overlay Details
////////////////////////////////////////////////////

function ReviewBasketsListDetailOverlayDetails( container_id )
{
	MMListDetailOverlayDetails.call( this, container_id );

	// Detail Variables
	this.basket 											= null;
	this.customer											= null;
	this.delegator											= new AJAX_ThreadPool( 6 );
	this.basketitemlist										= new Object();
	this.basketchargelist									= new Object();
	this.processing_counter									= new Array();

	// Detail Controls
	this.title_basket_id									= document.getElementById( 'reviewbasketslist_basketdetail_title_basket_id' );
	this.title_basket_date									= document.getElementById( 'reviewbasketslist_basketdetail_title_basket_date' );
	this.title_basket_customer_container					= document.getElementById( 'reviewbasketslist_basketdetail_title_basket_customer_container' );
	this.title_basket_customer								= document.getElementById( 'reviewbasketslist_basketdetail_title_basket_customer' );
	this.title_basket_customer_businessaccount_container	= document.getElementById( 'reviewbasketslist_basketdetail_title_basket_customer_businessaccount_container' );
	this.title_basket_customer_businessaccount				= document.getElementById( 'reviewbasketslist_basketdetail_title_basket_customer_businessaccount' );
	this.title_basket_customer_shop_as						= document.getElementById( 'reviewbasketslist_basketdetail_title_basket_customer_shop_as' );
	this.refresh											= document.getElementById( 'reviewbasketslist_basketdetail_refresh' );
	this.close												= document.getElementById( 'reviewbasketslist_basketdetail_close' );

	this.ship_name											= document.getElementById( 'reviewbasketslist_basketdetail_ship_name' );
	this.ship_email											= document.getElementById( 'reviewbasketslist_basketdetail_ship_email' );
	this.ship_phone											= document.getElementById( 'reviewbasketslist_basketdetail_ship_phone' );
	this.ship_fax											= document.getElementById( 'reviewbasketslist_basketdetail_ship_fax' );
	this.ship_comp											= document.getElementById( 'reviewbasketslist_basketdetail_ship_comp' );
	this.ship_addr											= document.getElementById( 'reviewbasketslist_basketdetail_ship_addr' );
	this.ship_citystatezip									= document.getElementById( 'reviewbasketslist_basketdetail_ship_citystatezip' );
	this.ship_cntry											= document.getElementById( 'reviewbasketslist_basketdetail_ship_cntry' );
	this.ship_res											= document.getElementById( 'reviewbasketslist_basketdetail_ship_res' );

	this.bill_name											= document.getElementById( 'reviewbasketslist_basketdetail_bill_name' );
	this.bill_email											= document.getElementById( 'reviewbasketslist_basketdetail_bill_email' );
	this.bill_phone											= document.getElementById( 'reviewbasketslist_basketdetail_bill_phone' );
	this.bill_fax											= document.getElementById( 'reviewbasketslist_basketdetail_bill_fax' );
	this.bill_comp											= document.getElementById( 'reviewbasketslist_basketdetail_bill_comp' );
	this.bill_addr											= document.getElementById( 'reviewbasketslist_basketdetail_bill_addr' );
	this.bill_citystatezip									= document.getElementById( 'reviewbasketslist_basketdetail_bill_citystatezip' );
	this.bill_cntry											= document.getElementById( 'reviewbasketslist_basketdetail_bill_cntry' );

	this.items												= document.getElementById( 'reviewbasketslist_basketdetail_items' );
	this.itemlist_selectall									= document.getElementById( 'reviewbasketslist_basketdetail_itemlist_selectall' );

	this.subtotal											= document.getElementById( 'reviewbasketslist_basketdetail_subtotal' );
	this.total											    = document.getElementById( 'reviewbasketslist_basketdetail_total' );
	this.charges											= document.getElementById( 'reviewbasketslist_basketdetail_charges' );
	this.discounts											= document.getElementById( 'reviewbasketslist_basketdetail_discounts' );

	this.element_button_delete_basket						= document.getElementById( 'reviewbasketslist_basketdetail_button_delete_basket' );
	this.element_button_edit_discounts						= document.getElementById( 'reviewbasketslist_basketdetail_button_editdiscounts' );
	this.element_button_edit_coupons						= document.getElementById( 'reviewbasketslist_basketdetail_button_editcoupons' );
	this.element_button_edit_charges						= document.getElementById( 'reviewbasketslist_basketdetail_button_editcharges' );
	this.element_button_create_order						= document.getElementById( 'reviewbasketslist_basketdetail_title_basket_create_order_button' );

	this.element_loading									= document.getElementById( 'reviewbasketslist_basketdetail_loading_container' );
	this.element_basketdetail_container						= document.getElementById( 'reviewbasketslist_basketdetail_container' );

	this.element_itemlist_button_container					= document.getElementById( 'reviewbasketslist_basketdetail_itemlist_button_container' );

	this.can_view_customer  								= CanI( 'CUST', 1, 0, 0, 0 );
	this.can_add_subscription								= CanI( 'SUBS', 0, 1, 0, 0 ) && CanI( 'PROD', 1, 0, 0, 0 ) && CanI( 'CUST', 1, 0, 0, 0 ) && CanI( 'CPCD', 1, 0, 0, 0 ) && CanI( 'ORDR', 1, 0, 0, 0 );
	this.can_modify_subscription							= CanI( 'SUBS', 0, 0, 1, 0 ) && CanI( 'PROD', 1, 0, 0, 0 ) && CanI( 'CUST', 1, 0, 0, 0 ) && CanI( 'CPCD', 1, 0, 0, 0 ) && CanI( 'ORDR', 1, 0, 0, 0 );
	this.can_create_order									= CanI( 'SUBS', 0, 0, 1, 0 ) && CanI( 'ORDR', 0, 0, 1, 0 );
}

DeriveFrom( MMListDetailOverlayDetails, ReviewBasketsListDetailOverlayDetails );

ReviewBasketsListDetailOverlayDetails.prototype.onShow = function()
{
	var self = this;

	this.element_button_delete_basket.innerHTML		= '';
	this.element_button_edit_discounts.innerHTML	= '';
	this.element_button_edit_coupons.innerHTML		= '';
	this.element_button_edit_charges.innerHTML		= '';
	this.element_button_create_order.innerHTML		= '';

	this.button_delete_basket						= new MMButton( this.element_button_delete_basket );
	this.button_edit_discounts						= new MMButton( this.element_button_edit_discounts );
	this.button_edit_coupons						= new MMButton( this.element_button_edit_coupons );
	this.button_edit_charges						= new MMButton( this.element_button_edit_charges );
	
	if ( this.can_create_order )
	{
		this.button_create_order					= new MMButton( this.element_button_create_order );

		this.button_create_order.SetText( 'Create Order' );
		this.button_create_order.SetOnClickHandler( function() { self.Order_Create(); } );
		this.button_create_order.SetClassName( 'reviewbasketslist_basketdetail_button' );
	}

	this.button_delete_basket.SetText( 'Delete This Basket' );
	this.button_delete_basket.SetOnClickHandler( function() { self.Basket_Delete(); } );
	this.button_delete_basket.SetClassName( 'reviewbasketslist_basketdetail_button' );

	this.button_edit_discounts.SetText( 'Apply/Remove Discounts' );
	this.button_edit_discounts.SetOnClickHandler( function() { self.Discounts_Edit(); } );
	this.button_edit_discounts.SetClassName( 'reviewbasketslist_basketdetail_button' );

	this.button_edit_coupons.SetText( 'Apply/Remove Coupons' );
	this.button_edit_coupons.SetOnClickHandler( function() { self.Coupons_Edit(); } );
	this.button_edit_coupons.SetClassName( 'reviewbasketslist_basketdetail_button' );
	
	this.button_edit_charges.SetText( 'Edit Charges' );
	this.button_edit_charges.SetOnClickHandler( function() { self.Charges_Edit(); } );
	this.button_edit_charges.SetClassName( 'reviewbasketslist_basketdetail_button' );

	this.element_itemlist_button_container.innerHTML	= '';

	this.itemlist_button_delete							= new MMButton( this.element_itemlist_button_container );
	this.itemlist_button_add							= new MMButton( this.element_itemlist_button_container );
	
	if ( this.can_add_subscription )
	{
		this.itemlist_button_subscriptions				= new MMButton( this.element_itemlist_button_container );
	}

	this.itemlist_button_delete.SetText( 'Delete Item(s)' );
	this.itemlist_button_delete.SetOnClickHandler( function() { self.ItemList_Delete(); } );
	this.itemlist_button_delete.SetClassName( 'reviewbasketslist_basketdetail_itemlist_button' );

	this.itemlist_button_add.SetText( 'Add Item(s)' );
	this.itemlist_button_add.SetOnClickHandler( function() { self.ItemList_Add(); } );
	this.itemlist_button_add.SetClassName( 'reviewbasketslist_basketdetail_itemlist_button' );

	if ( this.can_add_subscription )
	{
		this.itemlist_button_subscriptions.SetText( 'Add Subscription(s)' );
		this.itemlist_button_subscriptions.SetOnClickHandler( function() { self.Subscription_Add(); } );
		this.itemlist_button_subscriptions.SetClassName( 'reviewbasketslist_basketdetail_itemlist_button' );
	}

	this.title_basket_customer_shop_as.innerHTML		= '';

	this.itemlist_button_shop_as_customer = new MMButton( this.title_basket_customer_shop_as );
	this.itemlist_button_shop_as_customer.SetText( 'Shop As Customer' );
	this.itemlist_button_shop_as_customer.SetOnClickHandler( function() { self.ShopAsCustomer(); } );
	this.itemlist_button_shop_as_customer.SetClassName( 'reviewbasketslist_basketdetail_itemlist_button' );

	// Detail Events
	if ( this.refresh )				this.refresh.onclick			= function() { self.RefreshList(); return false; };
	if ( this.close )				this.close.onclick				= function() { self.onclose(); return false; };
	if ( this.itemlist_selectall )	this.itemlist_selectall.onclick	= function() { self.ItemList_SelectAll( this.checked ); };
}

ReviewBasketsListDetailOverlayDetails.prototype.onUpdateContent = function( basket )
{
	this.basket	= basket;

	newTextNode_EmptyParent( this.basket.basket_id, this.title_basket_id );
	newTextNode_EmptyParent( new Date( this.basket.lastupdate * 1000 ).toLocaleString(), this.title_basket_date );

	this.Refresh( 'basket,customer,items,charges,discounts,addresses,show_loading' );
}

ReviewBasketsListDetailOverlayDetails.prototype.onHideComplete = function()
{
}

ReviewBasketsListDetailOverlayDetails.prototype.Reload_Customer = function()
{
	var self = this;

	this.title_basket_customer_container.style.display 					= 'none';
	this.title_basket_customer_businessaccount_container.style.display 	= 'none';

	if ( this.basket.cust_id == 0 || !this.can_view_customer )
	{
		this.customer = null;

		return this.Title_Update_Customer( null );
	}

	Customer_Load_ID( this.basket.cust_id, function( response ) { self.Customer_Load_Callback( response ); }, this.delegator );
}

ReviewBasketsListDetailOverlayDetails.prototype.Customer_Load_Callback = function( response )
{
	if ( !response.success )
	{
		this.customer = null;
		this.Title_Update_Customer( null );

		return;
	}

	this.customer = response.data;

	this.Title_Update_Customer( this.customer );
}

ReviewBasketsListDetailOverlayDetails.prototype.Title_Update_Customer = function( customer )
{
	var self = this;
	var name;

	this.itemlist_button_shop_as_customer.Hide();

	if ( !this.can_view_customer )
	{
		this.title_basket_customer_container.style.display 					= 'none';
		this.title_basket_customer_businessaccount_container.style.display 	= 'none';

		return;
	}

	if ( !customer || customer.id == 0 )
	{
		this.itemlist_button_shop_as_customer.Hide();

		this.title_basket_customer_businessaccount_container.style.display	= 'none';
		this.title_basket_customer_container.style.display 					= '';

		newTextNode_EmptyParent( 'N/A', this.title_basket_customer );
	}
	else
	{
		this.itemlist_button_shop_as_customer.Show();

		if ( customer.account_id )
		{
			BusinessAccount_Load_ID( customer.account_id, function( response ) { self.ReviewBaskets_BusinessAccount_Load_Callback( response ); }, this.delegator );

			if ( !this.delegator.Running() )
			{
				this.delegator.onStart		= function() { ; };
				this.delegator.onComplete	= function() { ; };

				this.delegator.Run();
			}
		}

		this.title_basket_customer_container.style.display = '';

		if ( customer.bill_fname.length && customer.bill_lname.length )	name = customer.bill_fname + ' ' + customer.bill_lname;
		else if ( customer.bill_fname.length )							name = customer.bill_fname;
		else if ( customer.bill_lname.length )							name = customer.bill_lname;
		else															name = '';

		newTextNode_EmptyParent( customer.login + ( name.length ? ( ' - ' + name ) : '' ), this.title_basket_customer );
	}
}

ReviewBasketsListDetailOverlayDetails.prototype.ReviewBaskets_BusinessAccount_Load_Callback = function( response )
{
	if ( !response.success )
	{
		return this.onerror( response.error_message );
	}

	this.title_basket_customer_businessaccount_container.style.display 	= '';
	newTextNode_EmptyParent( response.data.title, this.title_basket_customer_businessaccount );
}

ReviewBasketsListDetailOverlayDetails.prototype.Basket_Delete = function()
{
	var self = this;

	if ( !confirm( 'Deleting an basket cannot be undone.  Continue?' ) )	return;

	ReviewBaskets_BasketList_Delete( [ this.basket.basket_id ], function( response )
	{
		if ( !response.success )
		{
			return self.onerror( response.error_message );
		}

		self.ondelete();
	} );
}

ReviewBasketsListDetailOverlayDetails.prototype.Reload = function()
{
	this.Refresh( 'basket,customer,items,charges,discounts,addresses,update_overlay,show_loading' );
}

ReviewBasketsListDetailOverlayDetails.prototype.Basket_Load_Callback = function( response )
{
	if ( !response.success )
	{
		return this.onerror( response.error_message );
	}

	this.basket = response.data;
	newTextNode_EmptyParent( this.basket.formatted_subtotal, this.subtotal );
	newTextNode_EmptyParent( this.basket.formatted_total, this.total );
}

ReviewBasketsListDetailOverlayDetails.prototype.BusinessAccount_Load_Callback = function( response )
{
	if ( !response.success )
	{
		return this.onerror( response.error_message );
	}

	this.title_basket_customer_businessaccount_container.style.display 	= '';
	newTextNode_EmptyParent( response.data.title, this.title_basket_customer_businessaccount );
}

ReviewBasketsListDetailOverlayDetails.prototype.Refresh = function( items )
{
	var self = this;
	var reload_basket, reload_charges, refresh_addresses;
	var i, i_len, item_array, item, update_overlay, show_loading;

	if ( this.delegator.Running() )
	{
		if ( this.delegator.show_loading )
		{
			this.SetProcessing_End();
		}

		this.delegator.onStart		= function() { ; };
		this.delegator.onComplete	= function() { ; };

		this.delegator.Cancel();
	}

	reload_basket		= false;
	reload_charges		= false;
	refresh_addresses	= false;

	item_array			= items.split( ',' );

	for ( i = 0, i_len = item_array.length; i < i_len; i++ )
	{
		item			= trim( item_array[ i ] );

		if ( item == 'basket' )							reload_basket		= true;
		else if ( item == 'items' )						this.Reload_Items();
		else if ( item == 'customer' )					this.Reload_Customer();
		else if ( item == 'charges' )					reload_charges		= true;
		else if ( item == 'addresses' )					refresh_addresses	= true;
		else if ( item == 'show_loading' )				show_loading		= true;
		else if ( item == 'update_overlay' )			update_overlay		= true;
	}

	if ( reload_basket || reload_charges )
	{
		this.subtotal.textContent	= 'Loading...';
		this.total.textContent		= 'Loading...';
	}

	if ( reload_charges )			this.Reload_Charges();

	this.delegator.show_loading	= show_loading;
	this.delegator.onStart 		= function()
	{
		if ( show_loading )
		{
			self.SetProcessing_Start();
		}
	};

	this.delegator.onComplete	= function()
	{
		if ( show_loading )
		{
			self.SetProcessing_End();
		}

		self.delegator.show_loading	= false;

		if ( reload_basket || reload_charges )
		{
			self.Refresh_SubTotal(); 
			self.Refresh_Total();
		}

		if ( refresh_addresses )				self.Refresh_Addresses();
		if ( update_overlay )					self.onContentUpdated( self.basket );
	};

	this.delegator.Run();
}

ReviewBasketsListDetailOverlayDetails.prototype.SetProcessing_Start = function()
{
	this.processing_counter.push( true );

	this.element_loading.style.display 						= 'block';
	this.element_basketdetail_container.style.visibility	= 'hidden';
}

ReviewBasketsListDetailOverlayDetails.prototype.SetProcessing_End = function()
{
	this.processing_counter.pop();

	if ( this.processing_counter.length )
	{
		return;
	}

	this.element_loading.style.display 						= 'none';
	this.element_basketdetail_container.style.visibility	= '';
}

ReviewBasketsListDetailOverlayDetails.prototype.Refresh_SubTotal = function()
{
	this.subtotal.innerHTML = this.basket.subtotal.toFixed( 2 );
}

ReviewBasketsListDetailOverlayDetails.prototype.Refresh_Total = function()
{
	this.total.innerHTML = this.basket.formatted_total;
}

ReviewBasketsListDetailOverlayDetails.prototype.Refresh_Addresses = function()
{
	if ( this.ship_name )				this.ship_name.style.display			= 'none';
	if ( this.ship_email )				this.ship_email.style.display			= 'none';
	if ( this.ship_phone )				this.ship_phone.style.display			= 'none';
	if ( this.ship_fax )				this.ship_fax.style.display				= 'none';
	if ( this.ship_comp )				this.ship_comp.style.display			= 'none';
	if ( this.ship_addr )				this.ship_addr.style.display			= 'none';
	if ( this.ship_citystatezip )		this.ship_citystatezip.style.display	= 'none';
	if ( this.ship_cntry )				this.ship_cntry.style.display			= 'none';
	if ( this.ship_res )				this.ship_res.style.display				= 'none';

	if ( this.bill_name )				this.bill_name.style.display			= 'none';
	if ( this.bill_email )				this.bill_email.style.display			= 'none';
	if ( this.bill_phone )				this.bill_phone.style.display			= 'none';
	if ( this.bill_fax )				this.bill_fax.style.display				= 'none';
	if ( this.bill_comp )				this.bill_comp.style.display			= 'none';
	if ( this.bill_addr )				this.bill_addr.style.display			= 'none';
	if ( this.bill_citystatezip )		this.bill_citystatezip.style.display	= 'none';
	if ( this.bill_cntry )				this.bill_cntry.style.display			= 'none';

	// Shipping
	citystatezip									= '';

	if ( this.ship_name && ( this.basket.ship_fname.length || this.basket.ship_lname.length ) )
	{
		this.ship_name.style.display				= '';
		this.ship_name.innerHTML					= '';

		if ( this.basket.ship_fname.length )	newTextNode( this.basket.ship_fname, this.ship_name );
		if ( this.basket.ship_fname.length &&
			 this.basket.ship_lname.length )	newTextNode( ' ', this.ship_name );
		if ( this.basket.ship_lname.length )	newTextNode( this.basket.ship_lname, this.ship_name );
	}

	if ( this.ship_email && this.basket.ship_email.length )
	{
		this.ship_email.style.display				= '';
		this.ship_email.innerHTML					= '';

		newTextNode( this.basket.ship_email, this.ship_email );
	}

	if ( this.ship_phone && this.basket.ship_phone.length )
	{
		this.ship_phone.style.display				= '';
		this.ship_phone.innerHTML					= '';

		newTextNode( this.basket.ship_phone, this.ship_phone );
	}

	if ( this.ship_fax && this.basket.ship_fax.length )
	{
		this.ship_fax.style.display					= '';
		this.ship_fax.innerHTML						= '';

		newTextNode( this.basket.ship_fax, this.ship_fax );
	}

	if ( this.ship_comp && this.basket.ship_comp.length )
	{
		this.ship_comp.style.display				= '';
		this.ship_comp.innerHTML					= '';

		newTextNode( this.basket.ship_comp, this.ship_comp );
	}

	if ( this.ship_addr && ( this.basket.ship_addr1.length || this.basket.ship_addr2.length ) )
	{
		this.ship_addr.style.display				= '';
		this.ship_addr.innerHTML					= '';

		if ( this.basket.ship_addr1.length )		newTextNode( this.basket.ship_addr1, this.ship_addr );
		if ( this.basket.ship_addr1.length &&
			 this.basket.ship_addr2.length )		this.ship_addr.appendChild( document.createElement( 'br' ) );
		if ( this.basket.ship_addr2.length )		newTextNode( this.basket.ship_addr2, this.ship_addr )
	}

	if ( this.ship_citystatezip )
	{
		if ( this.basket.ship_city.length )			citystatezip += this.basket.ship_city;
		if ( this.basket.ship_state.length )		citystatezip += ( citystatezip.length ? ', ' : '' ) + this.basket.ship_state;
		if ( this.basket.ship_zip.length )			citystatezip += ( citystatezip.length ? ' ' : '' ) + this.basket.ship_zip;

		if ( citystatezip.length )
		{
			this.ship_citystatezip.style.display	= '';
			this.ship_citystatezip.innerHTML		= '';

			newTextNode( citystatezip, this.ship_citystatezip );
		}
	}

	if ( this.ship_cntry && this.basket.ship_cntry.length )
	{
		this.ship_cntry.style.display				= '';
		this.ship_cntry.innerHTML					= '';

		newTextNode( this.basket.ship_cntry, this.ship_cntry );
	}

	if ( this.ship_res && this.basket.ship_res &&
		 (
		 	this.basket.ship_fname.length 	||
		 	this.basket.ship_lname.length 	||
		 	this.basket.ship_email.length 	||
		 	this.basket.ship_phone.length 	||
		 	this.basket.ship_fax.length 	||
		 	this.basket.ship_comp.length 	||
		 	this.basket.ship_addr1.length 	||
		 	this.basket.ship_addr2.length 	||
		 	this.basket.ship_city.length 	||
		 	this.basket.ship_state.length 	||
		 	this.basket.ship_zip.length 	||
		 	this.basket.ship_cntry.length
		 ) )
	{
		this.ship_res.style.display			= '';
		this.ship_res.innerHTML				= '';

		newTextNode( 'Residential Address', this.ship_res );
	}

	// Billing
	citystatezip									= '';

	if ( this.bill_name && ( this.basket.bill_fname.length || this.basket.bill_lname.length ) )
	{
		this.bill_name.style.display				= '';
		this.bill_name.innerHTML					= '';

		if ( this.basket.bill_fname.length )		newTextNode( this.basket.bill_fname, this.bill_name );
		if ( this.basket.bill_fname.length &&
			 this.basket.bill_lname.length )		newTextNode( ' ', this.bill_name );
		if ( this.basket.bill_lname.length )		newTextNode( this.basket.bill_lname, this.bill_name );
	}

	if ( this.bill_email && this.basket.bill_email.length )
	{
		this.bill_email.style.display				= '';
		this.bill_email.innerHTML					= '';

		newTextNode( this.basket.bill_email, this.bill_email );
	}

	if ( this.bill_phone && this.basket.bill_phone.length )
	{
		this.bill_phone.style.display				= '';
		this.bill_phone.innerHTML					= '';

		newTextNode( this.basket.bill_phone, this.bill_phone );
	}

	if ( this.bill_fax && this.basket.bill_fax.length )
	{
		this.bill_fax.style.display					= '';
		this.bill_fax.innerHTML						= '';

		newTextNode( this.basket.bill_fax, this.bill_fax );
	}

	if ( this.bill_comp && this.basket.bill_comp.length )
	{
		this.bill_comp.style.display				= '';
		this.bill_comp.innerHTML					= '';

		newTextNode( this.basket.bill_comp, this.bill_comp );
	}

	if ( this.bill_addr && ( this.basket.bill_addr1.length || this.basket.bill_addr2.length ) )
	{
		this.bill_addr.style.display				= '';
		this.bill_addr.innerHTML					= '';

		if ( this.basket.bill_addr1.length )		newTextNode( this.basket.bill_addr1, this.bill_addr );
		if ( this.basket.bill_addr1.length &&
			 this.basket.bill_addr2.length )		this.bill_addr.appendChild( document.createElement( 'br' ) );
		if ( this.basket.bill_addr2.length )		newTextNode( this.basket.bill_addr2, this.bill_addr )
	}

	if ( this.bill_citystatezip )
	{
		if ( this.basket.bill_city.length )			citystatezip += this.basket.bill_city;
		if ( this.basket.bill_state.length )		citystatezip += ( citystatezip.length ? ', ' : '' ) + this.basket.bill_state;
		if ( this.basket.bill_zip.length )			citystatezip += ( citystatezip.length ? ' ' : '' ) + this.basket.bill_zip;

		if ( citystatezip.length )
		{
			this.bill_citystatezip.style.display	= '';
			this.bill_citystatezip.innerHTML		= '';

			newTextNode( citystatezip, this.bill_citystatezip );
		}
	}

	if ( this.bill_cntry && this.basket.bill_cntry.length )
	{
		this.bill_cntry.style.display				= '';
		this.bill_cntry.innerHTML					= '';

		newTextNode( this.basket.bill_cntry, this.bill_cntry );
	}
}

ReviewBasketsListDetailOverlayDetails.prototype.Reload_Items = function()
{
	var self = this;

	TableLoading( this.items );

	ReviewBaskets_ItemList_Load( this.basket.basket_id, function( response ) { self.ItemList_Load_Callback( response ); }, this.delegator );
}

ReviewBasketsListDetailOverlayDetails.prototype.ConstructItemList_Row = function( row_class )
{
	var row;

	row				= new Object();
	row.tr			= newElement( 'tr', { 'class': row_class },													null, this.items );
	row.td_select	= newElement( 'td', { 'class': 'reviewbasketslist_basketdetail_itemlist_col_select' },		null, row.tr );
	row.td_code		= newElement( 'td', { 'class': 'reviewbasketslist_basketdetail_itemlist_col_code' },		null, row.tr );
	row.td_name		= newElement( 'td', { 'class': 'reviewbasketslist_basketdetail_itemlist_col_name' },		null, row.tr );
	row.td_sku		= newElement( 'td', { 'class': 'reviewbasketslist_basketdetail_itemlist_col_sku' },			null, row.tr );
	row.td_quantity	= newElement( 'td', { 'class': 'reviewbasketslist_basketdetail_itemlist_col_quantity' },	null, row.tr );
	row.td_weight	= newElement( 'td', { 'class': 'reviewbasketslist_basketdetail_itemlist_col_weight' },		null, row.tr );
	row.td_price	= newElement( 'td', { 'class': 'reviewbasketslist_basketdetail_itemlist_col_price' },		null, row.tr );
	row.td_total	= newElement( 'td', { 'class': 'reviewbasketslist_basketdetail_itemlist_col_total' },		null, row.tr );

	return row;
}

ReviewBasketsListDetailOverlayDetails.prototype.LayoutPrice = function( base_price, price, td )
{
	var span_base;

	if ( base_price != price )
	{
		span_base	= newElement( 'span', { 'class': 'reviewbasketslist_basketdetail_itemlist_base_price' },	null, td );
		newTextNode( Price_Pad( base_price ), span_base );
	}

	newTextNode( Price_Pad( price ), td );
}

ReviewBasketsListDetailOverlayDetails.prototype.ItemList_SelectAll = function( selected )
{
	Checkbox_CheckAll( 'reviewbasketslist_basketdetail_itemlist_select_', selected );
	this.ItemList_EnableDisableButtons();
}

ReviewBasketsListDetailOverlayDetails.prototype.ItemList_Select_Toggle = function( orderitem )
{
	if ( this.itemlist_selectall )	this.itemlist_selectall.checked = false;

	this.ItemList_EnableDisableButtons();
}

ReviewBasketsListDetailOverlayDetails.prototype.ItemList_EnableDisableButtons = function()
{
	var selected_basketitems = Checkbox_Selected_ItemList( 'reviewbasketslist_basketdetail_itemlist_select_', this.basketitemlist );

	if ( this.itemlist_button_delete )
	{
		if ( selected_basketitems.length == 0 )				this.itemlist_button_delete.Disable();
		else												this.itemlist_button_delete.Enable();
	}

	if ( this.itemlist_button_subscriptions ) 
	{	
		if ( this.basket.cust_id > 0 ) 	this.itemlist_button_subscriptions.Enable();
		else 							this.itemlist_button_subscriptions.Disable();	
	}
}

ReviewBasketsListDetailOverlayDetails.prototype.ItemList_Load_Callback = function( response )
{
	var i, j, k, item_row, basketitem, option_row, item_anchor, discount_row, subscription_row;

	if ( !response.success )
	{
		return this.onerror( response.error_message );
	}

	EmptyElement( this.items );

	this.basketitemlist	= response.data;

	for ( i = 0; i < this.basketitemlist.length; i++ )
	{
		basketitem									= this.basketitemlist[ i ];
		item_row 									= this.ConstructItemList_Row( 'reviewbasketslist_basketdetail_itemlist_item_row' );
		basketitem.element_checkbox					= newElement( 'input', { 'id': 'reviewbasketslist_basketdetail_itemlist_select_' + i, 'type': 'checkbox', 'value': this.basketitemlist[ i ].line_id }, null, item_row.td_select );
		basketitem.element_checkbox.onclick			= function() { this.basketdetail.ItemList_Select_Toggle( this.basketdetail.basketitemlist[ this.offset ] ); return true; };
		basketitem.element_checkbox.basketdetail	= this;
		basketitem.element_checkbox.offset			= i;

		newTextNode( this.basketitemlist[ i ].name,				item_row.td_name );
		newTextNode( this.basketitemlist[ i ].sku,				item_row.td_sku );
		newTextNode( this.basketitemlist[ i ].quantity,			item_row.td_quantity );
		newTextNode( this.basketitemlist[ i ].formatted_weight,	item_row.td_weight );

		item_anchor						= newElement( 'a', { 'href': '#' }, null, item_row.td_code );
		item_anchor.basketdetail		= this;
		item_anchor.offset				= i;

		if ( this.basketitemlist[ i ].subterm_id )	item_anchor.onclick	= function() { this.basketdetail.Subscription_Edit( this.basketdetail.basketitemlist[ this.offset ] ); return false; };
		else 										item_anchor.onclick	= function() { this.basketdetail.ItemList_Edit( this.basketdetail.basketitemlist[ this.offset ] ); return false; };
		
		this.LayoutPrice( this.basketitemlist[ i ].base_price, this.basketitemlist[ i ].price, item_row.td_price );

		newTextNode( Price_Pad( this.basketitemlist[ i ].total ),	item_row.td_total );
		newTextNode( this.basketitemlist[ i ].code, item_anchor );

		if ( this.basketitemlist[ i ].subterm_id && this.basketitemlist[ i ].productsubscriptionterm )
		{
			subscription_row = this.ConstructItemList_Row( 'reviewbasketslist_basketdetail_itemlist_subscription_row' );
				
			newTextNode(  "Subscription: " + this.basketitemlist[ i ].productsubscriptionterm.descrip,	subscription_row.td_name );		
		}

		if ( this.basketitemlist[ i ].discounts )
		{
			for ( j = 0; j < this.basketitemlist[ i ].discounts.length; j++ )
			{
				discount_row = this.ConstructItemList_Row( 'reviewbasketslist_basketdetail_itemlist_discount_row' );
				
				newTextNode( this.basketitemlist[ i ].discounts[ j ].descrip,						discount_row.td_name );
				newTextNode( ( 0 - this.basketitemlist[ i ].discounts[ j ].discount ).toFixed( 2 ),	discount_row.td_price );
			}
		}

		if ( this.basketitemlist[ i ].options )
		{
			for ( j = 0; j < this.basketitemlist[ i ].options.length; j++ )
			{
				option_row = this.ConstructItemList_Row( 'reviewbasketslist_basketdetail_itemlist_option_row' );

				if ( this.basketitemlist[ i ].options[ j ].value.length )	newTextNode( this.basketitemlist[ i ].options[ j ].attribute + ': ' + this.basketitemlist[ i ].options[ j ].value, option_row.td_name );
				else														newTextNode( this.basketitemlist[ i ].options[ j ].attribute, option_row.td_name );

				if ( this.basketitemlist[ i ].options[ j ].weight )			newTextNode( this.basketitemlist[ i ].options[ j ].formatted_weight, option_row.td_weight );

				if ( this.basketitemlist[ i ].options[ j ].base_price || this.basketitemlist[ i ].options[ j ].price )
				{
					this.LayoutPrice( this.basketitemlist[ i ].options[ j ].base_price, this.basketitemlist[ i ].options[ j ].price, option_row.td_price );
				}

				if ( this.basketitemlist[ i ].options[ j ].discounts )
				{
					for ( k = 0; k < this.basketitemlist[ i ].options[ j ].discounts.length; k++ )
					{
						discount_row			= this.ConstructItemList_Row( 'reviewbasketslist_basketdetail_itemlist_discount_row' );
						
						newTextNode( this.basketitemlist[ i ].options[ j ].discounts[ k ].descrip,							discount_row.td_name );
						newTextNode( ( 0 - this.basketitemlist[ i ].options[ j ].discounts[ k ].discount ).toFixed( 2 ),	discount_row.td_price );
					}
				}
			}
		}

		this.ConstructItemList_Row( 'reviewbasketslist_basketdetail_itemlist_spacer_row' );
	}

	this.ItemList_EnableDisableButtons();
	this.onbasketitemlist_load();
}

ReviewBasketsListDetailOverlayDetails.prototype.ShopAsCustomer = function()
{
	var dialog;

	if ( this.customer != null ) 
	{
		dialog = new ShopAsCustomer_Dialog( this.customer.login );
		dialog.Show();
	}
}

ReviewBasketsListDetailOverlayDetails.prototype.ItemList_Add = function()
{
	var self = this;
	var basketitem_dialog;

	basketitem_dialog		= new ReviewBaskets_BasketItemAddEditDialog( this.basket, null );
	basketitem_dialog.onAdd	= function()
	{
		self.Reload();
	}

	basketitem_dialog.Show();
}

ReviewBasketsListDetailOverlayDetails.prototype.ItemList_Edit = function( basketitem )
{
	var self = this;
	var basketitem_dialog;

	basketitem_dialog			= new ReviewBaskets_BasketItemAddEditDialog( this.basket, basketitem );
	basketitem_dialog.onUpdate	= function()
	{
		self.Reload();
	}

	basketitem_dialog.Show();
}

ReviewBasketsListDetailOverlayDetails.prototype.ItemList_Delete = function()
{
	var self = this;
	var i, i_len, line_ids, delegator;

	line_ids				= new Array();
	delegator				= new AJAX_ThreadPool( 3 );
	delegator.onStart		= function() { self.SetProcessing_Start(); };
	delegator.onComplete	= function()
	{
		self.SetProcessing_End();
		self.Reload();
	};

	for ( i = 0, i_len = this.basketitemlist.length; i < i_len; i++ )
	{
		if ( this.basketitemlist[ i ].element_checkbox.checked )
		{
			line_ids.push( this.basketitemlist[ i ].line_id )
		}
	}

	if ( line_ids.length == 0 )
	{
		return;
	}

	if ( !confirm( 'Delete selected item(s)?' ) )
	{
		return;
	}

	this.ItemList_Delete_LowLevel( line_ids, delegator );

	delegator.Run();
}

ReviewBasketsListDetailOverlayDetails.prototype.ItemList_Delete_LowLevel = function( line_ids, delegator )
{
	var self = this;

	ReviewBaskets_BasketItemList_Delete( this.basket.basket_id, line_ids, function( response )
	{
		if ( !response.success )
		{
			return self.onerror( response.error_message );
		}

		if ( self.basket.subtotal != response.data.subtotal )
		{
			self.basket.subtotal			= response.data.subtotal;
			self.basket.formatted_subtotal	= response.data.formatted_subtotal;
		}

		if ( self.basket.total != response.data.total )
		{
			self.basket.total			= response.data.total;
			self.basket.formatted_total	= response.data.formatted_total;
		}		

		self.itemlist_selectall.checked = false;

	}, delegator );
}

ReviewBasketsListDetailOverlayDetails.prototype.Subscription_Add = function()
{
	var self = this;
	var dialog;

	dialog			= new ReviewBaskets_SubscriptionAddEditDialog( this.basket, null );
	dialog.onadd	= function( subscription ) { self.Reload(); };
	dialog.Add		= function( data, callback )
	{
		var wrapped_callback = function( response )
		{
			if ( response.success )
			{
				if ( self.basket.subtotal != response.data.subtotal )
				{
					self.basket.subtotal			= response.data.subtotal;
					self.basket.formatted_subtotal	= response.data.formatted_subtotal;
				}

				if ( self.basket.total != response.data.total )
				{
					self.basket.total			= response.data.total;
					self.basket.formatted_total	= response.data.formatted_total;
				}
			}

			callback( response );
		}

		ReviewBaskets_SubscriptionAndBasketItem_Add( self.basket.basket_id, data, wrapped_callback );
	}

	dialog.Show();
}

ReviewBasketsListDetailOverlayDetails.prototype.Subscription_Edit = function( basketitem )
{
	var self = this;
	var dialog;

	dialog			= new ReviewBaskets_SubscriptionAddEditDialog( this.basket, basketitem );
	dialog.onupdate	= function( subscription ) { self.Reload(); };
	dialog.Update	= function( data, callback )
	{
		var wrapped_callback = function( response )
		{
			if ( response.success )
			{
				if ( self.basket.subtotal != response.data.subtotal )
				{
					self.basket.subtotal			= response.data.subtotal;
					self.basket.formatted_subtotal	= response.data.formatted_subtotal;
				}

				if ( self.basket.total != response.data.total )
				{
					self.basket.total			= response.data.total;
					self.basket.formatted_total	= response.data.formatted_total;
				}
			}

			callback( response );
		}

		ReviewBaskets_SubscriptionAndBasketItem_Update( self.basket.basket_id, basketitem.line_id, data, wrapped_callback );
	}

	dialog.Show();
}

ReviewBasketsListDetailOverlayDetails.prototype.Reload_Charges = function()
{
	var self = this;

	EmptyElement( this.charges );
	ReviewBaskets_ChargeList_Load( this.basket.basket_id, function( response ) { self.ChargeList_Load_Callback( response ); }, this.delegator );
}

ReviewBasketsListDetailOverlayDetails.prototype.ChargeList_Load_Callback = function( response )
{
	var i;
	var charge_tr, label_td, value_td;

	if ( !response.success )
	{
		return this.onerror( response.error_message );
	}

	this.basketchargelist = response.data;

	for ( i = 0; i < this.basketchargelist.length; i++ )
	{
		charge_tr			= document.createElement( 'tr' );
		
		label_td			= document.createElement( 'td' );
		label_td.className	= 'reviewbasketslist_basketdetail_charge_label';
		label_td.innerHTML	= shippingmethod_encodeentities( this.basketchargelist[ i ].descrip ) + ':';
		
		value_td			= document.createElement( 'td' );
		value_td.className	= 'reviewbasketslist_basketdetail_charge_value';
		value_td.innerHTML	= this.basketchargelist[ i ].disp_amt.toFixed( 2 );

		charge_tr.appendChild( label_td );
		charge_tr.appendChild( value_td );

		this.charges.appendChild( charge_tr );
	}
}

ReviewBasketsListDetailOverlayDetails.prototype.RefreshList = function()
{
	var self = this;

	this.SetProcessing_Start();
	this.onrefreshlist( function() { self.SetProcessing_End(); } );
}

ReviewBasketsListDetailOverlayDetails.prototype.Discounts_Edit = function()
{
	var self = this;
	var basketpricegroup_dialog;

	basketpricegroup_dialog						= new ReviewBaskets_PriceGroupDialog( this.basket );
	basketpricegroup_dialog.ondiscountschanged	= function()
	{
		self.Reload();
	}

	basketpricegroup_dialog.Show();
}

ReviewBasketsListDetailOverlayDetails.prototype.Coupons_Edit = function()
{
	var self = this;
	var basketcoupon_dialog;

	basketcoupon_dialog						= new ReviewBaskets_CouponDialog( this.basket );
	basketcoupon_dialog.oncouponschanged	= function()
	{
		self.Reload();
	}

	basketcoupon_dialog.Show();
}

ReviewBasketsListDetailOverlayDetails.prototype.Charges_Edit = function()
{
	var self = this;
	var basketcharge_dialog;

	basketcharge_dialog			= new ReviewBaskets_ChargeDialog( this.basket, this.basketchargelist );
	basketcharge_dialog.onsave	= function()
	{
		self.Reload();
	}

	basketcharge_dialog.Show();
}

ReviewBasketsListDetailOverlayDetails.prototype.Order_Create = function()
{
	var self = this;
	var create_order_dialog;

	create_order_dialog = new ConfirmationDialog();
	create_order_dialog.SetTitle( 'Confirm' );
	create_order_dialog.SetMessage( 'Converting the basket to an order will reset the basket. Continue?' );
	create_order_dialog.onYes = function()
	{
		ReviewBaskets_Order_Create( self.basket.basket_id, function( response ) 
		{
			var view_order_dialog;

			if ( !response.success )
			{
				return self.onerror( response.error_message );
			}

			view_order_dialog = new ConfirmationDialog();
			view_order_dialog.SetTitle( 'Order Created' );
			view_order_dialog.SetMessage( 'Order ' + parseInt( response.data.order_id ) + ' created successfully. Would you like to view the order now?' );
			view_order_dialog.onYes = function()
			{
				return OpenLinkHandler_CurrentWindow( adminurl, { 'Screen': 'MORD', 'Store_Code': Store_Code, 'Order_ID': response.data.order_id } );
			}
			view_order_dialog.Show();
		} );
	};
	create_order_dialog.Show();
}

ReviewBasketsListDetailOverlayDetails.prototype.onrefreshlist			= function( callback ) { if ( typeof callback === 'function' ) callback(); }
ReviewBasketsListDetailOverlayDetails.prototype.onclose					= function() { ; }
ReviewBasketsListDetailOverlayDetails.prototype.onerror					= function( error ) { Modal_Alert( error ); }
ReviewBasketsListDetailOverlayDetails.prototype.ondelete				= function() { ; }
ReviewBasketsListDetailOverlayDetails.prototype.onbasketitemlist_load	= function() { ; }
