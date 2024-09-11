// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2023 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// TemplateOrderEmail List
////////////////////////////////////////////////////

function TemplateOrderEmailList()
{
	var action_add, action_edit;

	this.page_can_view		= CanI( 'PAGE', 1, 0, 0, 0 );
	this.fufl_can_modify	= CanI( 'FUFL', 0, 0, 1, 0 );

	MMList.call( this, 'mm_list_templateorderemaillist' );

	if ( this.fufl_can_modify )
	{
		action_add = this.Feature_Controls_Create_Action( 'New Template Based Email', '', this.Add );

		this.Feature_Controls_SetPrimary_Action( action_add );
		this.Feature_EditDialog_Enable( 'Edit Email' );
	}

	if ( this.page_can_view )
	{
		action_edit = this.Feature_Selection_Create_Action_SingleSelect( 'Edit Template', 'Edit Template', this.EditTemplate );
		action_edit.SetAllowMiddleClick( true );

		this.Feature_Selection_SetSecondary_Action( action_edit );
	}

	if ( this.fufl_can_modify )
	{
		this.Feature_Delete_Enable( 'Delete Template Order Email(s)' );
	}

	this.Feature_Controls_SetSearchPlaceholderText( 'Search Template Order Emails...' );
	this.SetDefaultSort( 'name' );
}

DeriveFrom( MMList, TemplateOrderEmailList );

TemplateOrderEmailList.prototype.onLoad = TemplateOrderEmailList_Load_Query;

TemplateOrderEmailList.prototype.Add = function()
{
	var self = this;
	var templateorderemailadd;

	templateorderemailadd			= new TemplateOrderEmail_AddEditDialog( null, false, false );
	templateorderemailadd.onsave	= function()
	{
		self.Refresh();
	}

	templateorderemailadd.Show();
}

TemplateOrderEmailList.prototype.onDelete = function( item, callback, delegator )
{
	TemplateOrderEmail_Delete( item.record.code, callback, delegator );
}

TemplateOrderEmailList.prototype.EditTemplate = function( item, e )
{
	return OpenLinkHandler( e, adminurl, { 'Screen': 'PAGE', 'Store_Code': Store_Code, 'Edit_Page': item.record.page_code } );
}

TemplateOrderEmailList.prototype.onEdit = function( item )
{
	var self = this;
	var templateorderemailedit;

	templateorderemailedit			= new TemplateOrderEmail_AddEditDialog( item.record );
	templateorderemailedit.onsave	= function()
	{
		self.Refresh();
	}

	templateorderemailedit.ondelete	= function()
	{
		self.Refresh();
	}

	templateorderemailedit.Show();
}

TemplateOrderEmailList.prototype.onCreateRootColumnList = function()
{
	var self = this;
	var enabled_column;

	if ( this.fufl_can_modify ) enabled_column = new MMList_Column_CheckboxSlider(	'Automatic', 'enabled', '', function( item, checked, delegator ) { self.Update_Enabled( item, checked, delegator ); } );
	else						enabled_column = new MMList_Column_Checkbox(		'Automatic', 'enabled', '' ); 

	var columnlist =
	[
		enabled_column,
		new MMList_Column_Name( 'Name', 'name' )
			.SetNavigationEnabled( true ),
		new MMList_Column_Checkbox( 'Order Placed', 'on_ordr' )
			.SetSearchable( false )
			.SetSortByField( '' )
			.SetOnDisplayData( function( record ) { return DrawMMListString_Data( self.Order_Values_Output( record ) ); } )
			.SetOnExportData( function( record ) { return self.Order_Values_Output( record ); } ),
		new MMList_Column_Checkbox( 'Order Backordered', 'on_bord' ),
		new MMList_Column_Checkbox( 'Return Authorized', 'on_retc' ),
		new MMList_Column_Checkbox( 'Return Received', 'on_retr' ),
		new MMList_Column_Checkbox( 'Shipment Created', 'on_shpc' ),
		new MMList_Column_Checkbox( 'Shipment Shipped', 'on_shps' ),
		new MMList_Column_Checkbox( 'Customer Created', 'on_cust' ),
		new MMList_Column_Checkbox( 'Gift Certificate Created', 'on_gftcert' ),
		new MMList_Column_Checkbox( 'Digital Download Created', 'on_digital' ),
		new MMList_Column_Checkbox( 'Subscription Created', 'on_sub_crt' ),
		new MMList_Column_Checkbox( 'Subscription Changed', 'on_sub_chg' ),
		new MMList_Column_Checkbox( 'Subscription Cancelled', 'on_sub_can' ),
		new MMList_Column_Checkbox( 'Subscription Out of Stock', 'on_sub_oos' ),
		new TemplateOrderEmailList_Column_SubscriptionPendingDays(),
		new MMList_Column_Checkbox( 'Payment Card Expired', 'on_pc_exp' ),
		new TemplateOrderEmailList_Column_PaymentCardType(),
		new TemplateOrderEmailList_Column_PaymentCardDays(),
		new MMList_Column_Checkbox( 'Authorization Failure', 'on_athfail' )
			.SetSearchable( false )
			.SetSortByField( '' )
			.SetOnDisplayData( function( record ) { return DrawMMListString_Data( self.AuthFailure_Values_Output( record ) ); } )
			.SetOnExportData( function( record ) { return self.AuthFailure_Values_Output( record ); } )
	];

	return columnlist;
}

TemplateOrderEmailList.prototype.Update_Enabled = function( item, checked, delegator )
{
	var self = this;

	TemplateOrderEmail_Update_Enabled( item.record.code, checked, function( response )
	{
		if ( !response.success )
		{
			self.Record_Update_Error( response, item );
			self.ReBindVisibleRows();

			return;
		}

		item.record.enabled = checked ? 1 : 0;

		self.ItemRecord_UpdateOriginalRecord( item, null );
		self.ReBindVisibleRows();
	}, delegator );
}

TemplateOrderEmailList.prototype.Order_Values_Output = function( record )
{
	var source, values;

	values = new Array();

	for ( source in record.on_ordr )
	{
		switch ( source )
		{
			case 'shopper'				: values.push( 'Shopper' );					break;
			case 'user'					: values.push( 'Admin User' );				break;
			case 'subscription'			: values.push( 'Subscription' );			break;
			case 'shopascustomer'		: values.push( 'Shop As Customer' );		break;
			case 'reviewbaskets'		: values.push( 'Review Baskets' );			break;
			case 'marketplaces_ebay'	: values.push( 'Marketplaces: eBay' );		break;
			case 'marketplaces_etsy'	: values.push( 'Marketplaces: Etsy' );		break;
			case 'marketplaces_amazon'	: values.push( 'Marketplaces: Amazon' );	break;
			case 'quote'				: values.push( 'Manage Quotes' );			break;
			default						:
			{
				if ( source.length > 0 )
				{
					values.push( source );
				}

				break;
			}
		}
	}

	if ( values.length == 0 )
	{
		return 'No';
	}

	return values.join( ', ' );
}

TemplateOrderEmailList.prototype.AuthFailure_Values_Output = function( record )
{
	var source, values;

	values = new Array();

	for ( source in record.on_athfail )
	{
		switch( source )
		{
			case 'shopper'		: values.push( 'Shopper' );			break;
			case 'subscription'	: values.push( 'Subscription' );	break;
			default				:
			{
				if ( source.length > 0 )
				{
					values.push( source );
				}

				break;
			}
		}
	}

	if ( values.length == 0 )
	{
		return 'No';
	}

	return values.join( ', ' );
}

// TemplateOrderEmailList_Column_PaymentCardType 
////////////////////////////////////////////////////

function TemplateOrderEmailList_Column_PaymentCardType()
{
	MMList_Column_MappedTextValues.call( this, 'Payment Card Type', 'pc_type',
											   [ 'A', 			'S' ],
											   [ 'All Cards', 	'Only Cards Linked to a Subscription' ] ); 

	return this; 
}

DeriveFrom( MMList_Column_MappedTextValues, TemplateOrderEmailList_Column_PaymentCardType );

TemplateOrderEmailList_Column_PaymentCardType.prototype.onDisplayData = function( record )
{
	if ( !record.on_pc_exp )
	{
		return DrawMMListString_Data( 'N/A' );
	}

	return MMList_Column_MappedTextValues.prototype.onDisplayData.call( this, record );
}

TemplateOrderEmailList_Column_PaymentCardType.prototype.onAdvancedSearch_GetFilter = function()
{
	return [ new MMList_Filter_Search_Value( 'on_pc_exp', 'EQ', '1' ),
			 new MMList_Filter_Search_Value( this.code, this.AdvancedSearch_Filter_GetValue(), this.AdvancedSearch_Value_GetValue() ) ];
}

// TemplateOrderEmailList_Column_SubscriptionPendingDays 
////////////////////////////////////////////////////

function TemplateOrderEmailList_Column_SubscriptionPendingDays()
{
	MMList_Column_Numeric.call( this, 'Subscription Will Be Processed Within N Days', 'sub_days' ); 

	return this; 
}

DeriveFrom( MMList_Column_Numeric, TemplateOrderEmailList_Column_SubscriptionPendingDays );

TemplateOrderEmailList_Column_SubscriptionPendingDays.prototype.onDisplayData = function( record )
{
	if ( !record.on_sub_pnd )
	{
		return DrawMMListString_Data( 'N/A' );
	}

	return MMList_Column_Numeric.prototype.onDisplayData.call( this, record );
}

TemplateOrderEmailList_Column_SubscriptionPendingDays.prototype.onAdvancedSearch_GetFilter = function()
{
	var value, filter, filterlist, search_filters_or, search_filters_and;

	value		= this.AdvancedSearch_Value_GetValue();
	filter		= this.AdvancedSearch_Filter_GetValue();
	filterlist	= new Array();

	if ( filter == 'EQ'	||
		 filter == 'GT'	||
		 filter == 'GE'	||
		 filter == 'IN'	||
		 filter == 'LIKE' )
	{
		filterlist.push( new MMList_Filter_Search_Value( 'on_sub_pnd', 'EQ', '1' ) );
		filterlist.push( new MMList_Filter_Search_Value( this.code, filter, value ) );
	}
	else
	{
		search_filters_or	= new Array();
		search_filters_and	= new Array();

		search_filters_or.push( new MMList_Filter_Search_Value( 'on_sub_pnd', 'EQ', '1' ) );
		search_filters_or.push( new MMList_Filter_Search_Value( 'sub_days', filter, value ) );

		search_filters_and.push( new MMList_Filter_Search_Value( 'search_OR', 'SUBWHERE', search_filters_or ) );
		search_filters_and.push( new MMList_Filter_Search_Value( 'on_sub_pnd', 'EQ', '0' ) );

		filterlist.push( new MMList_Filter_Search_Value( 'search_AND', 'SUBWHERE', search_filters_and ) );
	}

	return filterlist;
}

// TemplateOrderEmailList_Column_PaymentCardDays 
////////////////////////////////////////////////////

function TemplateOrderEmailList_Column_PaymentCardDays()
{
	MMList_Column_Numeric.call( this, 'Payment Card Expires Within N Days', 'pc_days' ); 

	return this; 
}

DeriveFrom( MMList_Column_Numeric, TemplateOrderEmailList_Column_PaymentCardDays );

TemplateOrderEmailList_Column_PaymentCardDays.prototype.onDisplayData = function( record )
{
	if ( !record.on_pc_exp )
	{
		return DrawMMListString_Data( 'N/A' );
	}

	return MMList_Column_Numeric.prototype.onDisplayData.call( this, record );
}

TemplateOrderEmailList_Column_PaymentCardDays.prototype.onAdvancedSearch_GetFilter = function()
{
	var value, filter, filterlist, search_filters_or, search_filters_and;

	value		= this.AdvancedSearch_Value_GetValue();
	filter		= this.AdvancedSearch_Filter_GetValue();
	filterlist	= new Array();

	if ( filter == 'EQ'	||
		 filter == 'GT'	||
		 filter == 'GE'	||
		 filter == 'IN'	||
		 filter == 'LIKE' )
	{
		filterlist.push( new MMList_Filter_Search_Value( 'on_pc_exp', 'EQ', '1' ) );
		filterlist.push( new MMList_Filter_Search_Value( this.code, filter, value ) );
	}
	else
	{
		search_filters_or	= new Array();
		search_filters_and	= new Array();

		search_filters_or.push( new MMList_Filter_Search_Value( 'on_pc_exp', 'EQ', '1' ) );
		search_filters_or.push( new MMList_Filter_Search_Value( 'pc_days', filter, value ) );

		search_filters_and.push( new MMList_Filter_Search_Value( 'search_OR', 'SUBWHERE', search_filters_or ) );
		search_filters_and.push( new MMList_Filter_Search_Value( 'on_pc_exp', 'EQ', '0' ) );

		filterlist.push( new MMList_Filter_Search_Value( 'search_AND', 'SUBWHERE', search_filters_and ) );
	}

	return filterlist;
}
