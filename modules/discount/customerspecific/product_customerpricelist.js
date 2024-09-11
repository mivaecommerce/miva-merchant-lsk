// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2022 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

function Product_CustomerPriceList( pgrp_id, product_id )
{
	this.pgrp_id 	= pgrp_id;
	this.product_id = product_id;

	BaseCustomerList.call( this, 'customerspecific_product_customerpricelist' );
}

DeriveFrom( BaseCustomerList, Product_CustomerPriceList );

Product_CustomerPriceList.prototype.onDeleteList 				= MMList.prototype.onDeleteList;
Product_CustomerPriceList.prototype.onDeleteConfirmationMessage = MMList.prototype.onDeleteConfirmationMessage;

Product_CustomerPriceList.prototype.Construct = function()
{
	var self = this;

	MMList.call( this, this.parent_id );

	this.countrylist						= new Array();
	this.load_discounted 					= true;
	this.load_undiscounted					= true;

	this.button_customer_show				= this.Feature_Controls_Create_Action_Dropdown( 'Show Customers', '' );
	this.button_customer_show_all			= this.button_customer_show.Menu_Append_Item_Toggle( 'All',				function( event, data, active ) { self.CustomerList_Show( true, true ); },	null );
	this.button_customer_show_discounted	= this.button_customer_show.Menu_Append_Item_Toggle( 'Discounted',		function( event, data, active ) { self.CustomerList_Show( true, false ); },	null );
	this.button_customer_show_undiscounted	= this.button_customer_show.Menu_Append_Item_Toggle( 'Undiscounted',	function( event, data, active ) { self.CustomerList_Show( false, true ); },	null );

	this.Feature_Controls_SetSecondary_Action( this.button_customer_show );
	this.Feature_GoTo_Enable( 'View Customer' );

	if ( CanI( 'PGRP', 0, 0, 1, 0 ) )
	{
		this.Feature_Edit_Enable( 'Edit Discount(s)', 'Save Discount(s)' );
		this.Feature_Delete_Enable( 'Delete Discount(s)' );
	}

	if ( CanI( 'NOTE', 1, 0, 0, 0 ) )
	{
		this.button_customernotes = this.Feature_Selection_Create_Action_SingleSelect( 'Notes', 'View Customer Notes', this.CustomerNotes );
	}

	if ( CanI( 'SHOP', 1, 0, 0, 0 ) )
	{
		this.button_shopascustomer = this.Feature_Selection_Create_Action_SingleSelect( 'Shop As Customer', 'Shop As Customer', this.ShopAsCustomer );
		this.Feature_Selection_SetPrimary_Action( this.button_shopascustomer );
	}

	this.Feature_OnDemandColumns_Enable();
	this.Feature_Controls_SetSearchPlaceholderText( 'Search Customers...' );
	this.SetDefaultSort( 'login', '' );
	this.CountryList_Load();

	this.SetEmptyListMessage( 'No Discounts' );
}

Product_CustomerPriceList.prototype.onLoad = function( filter, sort, offset, count, callback, delegator )
{
	Product_CustomerPriceList_Load_Query( this.pgrp_id, this.product_id, this.load_discounted, this.load_undiscounted, filter, sort, offset, count, callback, delegator );
}

Product_CustomerPriceList.prototype.onSave = function( item, callback, delegator )
{
	CustomerSpecificPricing_Update( this.pgrp_id, item.record.id, this.product_id, item.record.discounted_price, callback, delegator );
}

Product_CustomerPriceList.prototype.onDelete = function( item, callback, delegator )
{
	CustomerSpecificPricing_Delete( this.pgrp_id, item.record.id, this.product_id, callback, delegator );
}

Product_CustomerPriceList.prototype.LoadPreferences = function( preferencelist )
{
	if ( preferencelist && preferencelist.filter_load_discounted )		this.CustomerList_LoadDiscounted_SetValue( preferencelist.filter_load_discounted == '1' );
	if ( preferencelist && preferencelist.filter_load_undiscounted )	this.CustomerList_LoadUndiscounted_SetValue( preferencelist.filter_load_undiscounted == '1' );

	this.CustomerList_Show_SetActive( this.load_discounted, this.load_undiscounted );

	MMList_NoFeatures.prototype.LoadPreferences.call( this, preferencelist );
}

Product_CustomerPriceList.prototype.CustomerList_Show = function( discounted, undiscounted )
{
	this.CustomerList_LoadDiscounted_SetValue( discounted );
	this.CustomerList_LoadUndiscounted_SetValue( undiscounted );
	this.CustomerList_Show_SetActive( discounted, undiscounted );
	this.SavePreferencesAfterRefresh( [ this.key_prefix + '.filter_load_discounted', this.key_prefix + '.filter_load_undiscounted' ], [ discounted ? '1' : '0', undiscounted ? '1' : '0' ] );
	this.Refresh();
}

Product_CustomerPriceList.prototype.CustomerList_Show_SetActive = function( discounted, undiscounted )
{
	this.button_customer_show_all.SetActive( false );
	this.button_customer_show_discounted.SetActive( false );
	this.button_customer_show_undiscounted.SetActive( false );

	if ( discounted && undiscounted )	this.button_customer_show_all.SetActive( true );
	else if ( discounted )				this.button_customer_show_discounted.SetActive( true );
	else if ( undiscounted )			this.button_customer_show_undiscounted.SetActive( true );
}

Product_CustomerPriceList.prototype.CustomerList_LoadDiscounted_SetValue = function( value )
{
	if ( value )	this.load_discounted = true;
	else			this.load_discounted = false;
}

Product_CustomerPriceList.prototype.CustomerList_LoadUndiscounted_SetValue = function( value )
{
	if ( value )	this.load_undiscounted = true;
	else			this.load_undiscounted = false;
}

Product_CustomerPriceList.prototype.onCreateRootColumnList = function()
{
	var i;
	var i_len;

	var base_active = [ 'login', 'bill_fname', 'bill_lname' ];
	var columnlist 	= BaseCustomerList.prototype.onCreateRootColumnList.call( this );
	
	for ( i = 0, i_len = columnlist.length; i < i_len; i++ )
	{
		columnlist[ i ].SetColumnIsEditable( false );
		columnlist[ i ].SetDefaultActive( arrayIndexOf( base_active, columnlist[ i ].GetCode() ) >= 0 );
	}

	columnlist.push( new MMList_Column_Currency_Default( 'Discounted Price', 'discounted_price', 'discounted_price', 'N/A' ) );

	return columnlist;
}
