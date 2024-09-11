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

function Customer_ProductPriceList( pgrp_id, customer_id )
{
	this.pgrp_id 		= pgrp_id;
	this.customer_id 	= customer_id;

	BaseProductList.call( this, 'mm10_customer_productpricelist' );
}

DeriveFrom( BaseProductList, Customer_ProductPriceList );

Customer_ProductPriceList.prototype.onDeleteList 				= MMList.prototype.onDeleteList;
Customer_ProductPriceList.prototype.onDeleteConfirmationMessage = MMList.prototype.onDeleteConfirmationMessage;

Customer_ProductPriceList.prototype.Construct = function()
{
	var self = this;

	this.load_discounted 					= true;
	this.load_undiscounted					= true;

	MMList.call( this, this.parent_id );

	this.button_product_show				= this.Feature_Controls_Create_Action_Dropdown( 'Filters', 'Filter Visible Products' );
	this.button_product_show_all			= this.button_product_show.Menu_Append_Item_Toggle( 'All',				function( event, data, active ) { self.ProductList_Show( true, true ); },	null );
	this.button_product_show_discounted		= this.button_product_show.Menu_Append_Item_Toggle( 'Discounted',		function( event, data, active ) { self.ProductList_Show( true, false ); },	null );
	this.button_product_show_undiscounted	= this.button_product_show.Menu_Append_Item_Toggle( 'Undiscounted',		function( event, data, active ) { self.ProductList_Show( false, true ); },	null );

	this.Feature_Controls_SetSecondary_Action( this.button_product_show );

	this.Feature_OnDemandColumns_Enable();
	this.ProductList_Show_SetActive( this.load_discounted, this.load_undiscounted );
	this.onFeatureSetEnable();

	this.Feature_Controls_SetSearchPlaceholderText( 'Search Products...' );
	this.SetEmptyListMessage( 'No Discounts' );
	this.SetDefaultSort( 'disp_order', '' );

	if ( CanI( 'PGRP', 0, 0, 1, 0 ) )
	{
		this.Feature_Edit_Enable( 'Edit Discount(s)', 'Save Discount(s)' );
		this.Feature_Delete_Enable( 'Delete Discount(s)' );
	}
}

Customer_ProductPriceList.prototype.onLoad = function( filter, sort, offset, count, callback, delegator )
{
	Customer_ProductPriceList_Load_Query( this.pgrp_id, this.customer_id, this.load_discounted, this.load_undiscounted, filter, sort, offset, count, callback, delegator );
}

Customer_ProductPriceList.prototype.onSave = function( item, callback, delegator )
{
	CustomerSpecificPricing_Update( this.pgrp_id, this.customer_id, item.record.id, item.record.discounted_price, callback, delegator );
}

Customer_ProductPriceList.prototype.onDelete = function( item, callback, delegator )
{
	CustomerSpecificPricing_Delete( this.pgrp_id, this.customer_id, item.record.id, callback, delegator );
}

Customer_ProductPriceList.prototype.LoadPreferences = function( preferencelist )
{
	if ( preferencelist && preferencelist.filter_load_discounted )		this.ProductList_LoadDiscounted_SetValue( preferencelist.filter_load_discounted == '1' );
	if ( preferencelist && preferencelist.filter_load_undiscounted )	this.ProductList_LoadUndiscounted_SetValue( preferencelist.filter_load_undiscounted == '1' );

	this.ProductList_Show_SetActive( this.load_discounted, this.load_undiscounted );

	MMList_NoFeatures.prototype.LoadPreferences.call( this, preferencelist );
}

Customer_ProductPriceList.prototype.ProductList_Show = function( discounted, undiscounted )
{
	this.ProductList_LoadDiscounted_SetValue( discounted );
	this.ProductList_LoadUndiscounted_SetValue( undiscounted );
	this.ProductList_Show_SetActive( discounted, undiscounted );
	this.SavePreferencesAfterRefresh( [ this.key_prefix + '.filter_load_discounted', this.key_prefix + '.filter_load_undiscounted' ], [ discounted ? '1' : '0', undiscounted ? '1' : '0' ] );
	this.Refresh();
}

Customer_ProductPriceList.prototype.ProductList_Show_SetActive = function( discounted, undiscounted )
{
	this.button_product_show_all.SetActive( false );
	this.button_product_show_discounted.SetActive( false );
	this.button_product_show_undiscounted.SetActive( false );

	if ( discounted && undiscounted )	this.button_product_show_all.SetActive( true );
	else if ( discounted )				this.button_product_show_discounted.SetActive( true );
	else if ( undiscounted )			this.button_product_show_undiscounted.SetActive( true );
}

Customer_ProductPriceList.prototype.ProductList_LoadDiscounted_SetValue = function( value )
{
	if ( value )	this.load_discounted = true;
	else			this.load_discounted = false;
}

Customer_ProductPriceList.prototype.ProductList_LoadUndiscounted_SetValue = function( value )
{
	if ( value )	this.load_undiscounted = true;
	else			this.load_undiscounted = false;
}

Customer_ProductPriceList.prototype.onCreateRootColumnList = function()
{
	var i, i_len, columnlist, base_active, first_imagetype_column;

	base_active 			= [ 'code', 'name' ];
	columnlist 				= BaseProductList.prototype.onCreateRootColumnList.call( this );
	first_imagetype_column	= arrayFind( columnlist, function( find_column ) { return find_column instanceof MMList_Column_ImageType_Preview_Image; } );

	for ( i = 0, i_len = columnlist.length; i < i_len; i++ )
	{
		columnlist[ i ].SetColumnIsEditable( false );

		if ( first_imagetype_column === columnlist[ i ] )					columnlist[ i ].SetDefaultActive( true );
		else if ( base_active.indexOf( columnlist[ i ].GetCode() ) !== -1 )	columnlist[ i ].SetDefaultActive( true );
		else																columnlist[ i ].SetDefaultActive( false );
	}

	columnlist.push( new MMList_Column_Currency_Default( 'Discounted Price', 'discounted_price', 'discounted_price', 'N/A' ) );

	return columnlist;
}
