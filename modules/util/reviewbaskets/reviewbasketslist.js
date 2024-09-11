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

// Review Baskets List
////////////////////////////////////////////////////

function ReviewBasketsList()
{
	var self = this;
	var button_deleteall;

	MMList.call( this, 'mm_list_reviewbasketslist' );

	this.Feature_Controls_SetSearchPlaceholderText( 'Search Baskets...' );
	this.Feature_EditDialog_Enable( 'View Contents' );
	this.Feature_Delete_Enable( 'Delete Basket(s)' );
	this.OnEnableDisableActions_AddHook( this.ActionBar_EnableDisable );

	if ( CanI( 'RBSK', 0, 0, 0, 1 ) )
	{
		button_deleteall = this.Feature_Controls_Create_Action( 'Delete All Baskets', 'Delete All Baskets', this.Delete_All );
		this.Feature_Controls_SetPrimary_Action( button_deleteall );
	}

	this.filter_basket_show				= 'All';
	this.button_basket_show				= this.Feature_Controls_Create_Action_Dropdown( 'Filters', 'Filter Visible Baskets' );
	this.button_basket_show_all			= this.button_basket_show.Menu_Append_Item_Toggle( 'All Baskets',		( event, data, active ) => { this.Basket_Show( 'All' ); } );
	this.button_basket_show_nonempty	= this.button_basket_show.Menu_Append_Item_Toggle( 'Non-Empty Baskets',	( event, data, active ) => { this.Basket_Show( 'Non-Empty' ); } );

	this.Feature_Controls_SetSecondary_Action( this.button_basket_show );

	if ( CanI( 'SHOP', 1, 0, 0, 0 ) )
	{
		this.button_shopascustomer = this.Feature_Selection_Create_Action( 'Shop As Customer', 'Shop As Customer', this.ShopAsCustomer );
		this.Feature_Selection_SetSecondary_Action( this.button_shopascustomer );
	}

	this.SetEmptyListMessage( 'No Baskets' );
	this.SetDefaultSort( 'lastupdate', '-' );

	// Filter elements

	this.filter_dt_start											= null;
	this.filter_dt_end												= null;
	this.reviewbasketslist_filter_save_state						= null;
	this.reviewbasketslist_last_advancedsearchset					= false;

	this.element_reviewbasketslist_filter_date_range_container		= document.getElementById( 'reviewbasketslist_filter_date_range_container' );
	this.element_reviewbasketslist_filter_date_range_exact			= document.getElementById( 'reviewbasketslist_filter_date_range_exact' );
	this.element_reviewbasketslist_filter_date_range_exact_start	= document.getElementById( 'reviewbasketslist_filter_date_range_exact_start' );
	this.element_reviewbasketslist_filter_date_range_exact_end		= document.getElementById( 'reviewbasketslist_filter_date_range_exact_end' );

	this.select_filter_date_range									= new MMSelect( this.element_reviewbasketslist_filter_date_range_container );
	this.datetime_filter_date_range_exact_start						= new MMDateTimePickerDisplay( this.element_reviewbasketslist_filter_date_range_exact_start,	new Date() );
	this.datetime_filter_date_range_exact_end						= new MMDateTimePickerDisplay( this.element_reviewbasketslist_filter_date_range_exact_end,		new Date() );

	this.select_filter_date_range.AddClassName( 'small' );
	this.datetime_filter_date_range_exact_start.AddClassName( 'small' );
	this.datetime_filter_date_range_exact_end.AddClassName( 'small' );

	this.datetime_filter_date_range_exact_start.SetDateLimit_Future( function() { return self.filter_dt_end; } );
	this.datetime_filter_date_range_exact_start.SetOnChangeHandler( function( date )
	{
		self.filter_dt_start = date;
		self.Search_ReviewBasket_Filter_onChange();
	} );

	this.datetime_filter_date_range_exact_end.SetDateLimit_Past( function() { return self.filter_dt_start; } );
	this.datetime_filter_date_range_exact_end.SetOnChangeHandler( function( date )
	{
		self.filter_dt_end = date;
		self.Search_ReviewBasket_Filter_onChange();
	} );

	this.Basket_Show_SetActive( this.filter_basket_show );
	this.OnSearch_GetFilter_AddHook( this.ReviewBasketsList_onSearch_GetFilter );
	this.OnSearch_SaveFilter_AddHook( this.ReviewBasketsList_onSearch_SaveFilter );
	this.OnSearch_RestoreFilter_AddHook( this.ReviewBasketsList_onSearch_RestoreFilter );
	this.Feature_Persistent_Filters_Enable( 'reviewbasketslist' );
}

DeriveFrom( MMList, ReviewBasketsList );

ReviewBasketsList.prototype.onLoad = ReviewBaskets_BasketList_Load_Query;

ReviewBasketsList.prototype.LoadPreferences = function( preferencelist )
{
	var self = this;
	var savedsearch;

	if ( preferencelist?.filter_basket_show?.length )
	{
		this.Basket_Show_SetValue( preferencelist.filter_basket_show );
		this.Basket_Show_SetActive( preferencelist.filter_basket_show );
	}

	try
	{
		savedsearch								= JSON.parse( preferencelist.default_reviewbasketlist_filter );
	}
	catch ( e )
	{
		savedsearch								= new Object();
		savedsearch.basket_filter_date_range 	= 0;
		savedsearch.basket_filter_date_start 	= -1;
		savedsearch.basket_filter_date_end 		= -1;
	}

	this.ReviewBasketsList_onSearch_RestoreFilter( savedsearch );

	//
	// Initialize filter change events AFTER we restore the 'saved' filter
	// so that we don't trigger another preference save every time we
	// load the list.
	//

	this.select_filter_date_range.onchange		= function( value ) { self.Search_Change_DateRange(); };

	MMList_NoFeatures.prototype.LoadPreferences.call( this, preferencelist );
}

ReviewBasketsList.prototype.onPersistentFiltersSetContent = function()
{
	var self = this;

	this.filter_dt_start	= new Date();
	this.filter_dt_start.setMilliseconds( 0 );
	this.filter_dt_start.setSeconds( 0 );
	this.filter_dt_start.setMinutes( 0 );
	this.filter_dt_start.setHours( 0 );

	this.filter_dt_start.setDate( this.filter_dt_start.getDate() - 1 );

	this.filter_dt_end		= new Date();
	this.filter_dt_end.setMilliseconds( 0 );
	this.filter_dt_end.setSeconds( 0 );
	this.filter_dt_end.setMinutes( 0 );
	this.filter_dt_end.setHours( 0 );

	this.datetime_filter_date_range_exact_start.SetDate( this.filter_dt_start );
	this.datetime_filter_date_range_exact_end.SetDate( this.filter_dt_end );

	this.filter 			= new Array();

	this.select_filter_date_range.AddOption( 'No Time Limit',	0 );
	this.select_filter_date_range.AddOption( 'Last Day',		1 );
	this.select_filter_date_range.AddOption( 'Last 3 Days',		3 );
	this.select_filter_date_range.AddOption( 'Last 7 Days',		7 );
	this.select_filter_date_range.AddOption( 'Last 14 Days',	14 );
	this.select_filter_date_range.AddOption( 'Last 30 Days',	30 );
	this.select_filter_date_range.AddOption( 'Last 90 Days',	90 );
	this.select_filter_date_range.AddOption( 'Last 180 Days',	180 );
	this.select_filter_date_range.AddOption( 'Last 365 Days',	365 );
	this.select_filter_date_range.AddOption( 'Exact Dates',		'exact' );

	this.select_filter_date_range.onchange = function() { self.Search_Change_DateRange(); };
}

ReviewBasketsList.prototype.Search_ReviewBasket_Filter_onChange = function()
{
	var savedsearch = new Object();

	this.ReviewBasketsList_onSearch_SaveFilter( savedsearch );
	this.SavePreferencesAfterRefresh( [ this.key_prefix + '.default_reviewbasketlist_filter' ], [ JSON.stringify( savedsearch ) ] );
	this.onSearch();
}

ReviewBasketsList.prototype.Search_Change_DateRange = function()
{
	var date_range = this.Search_DateRange();

	if ( date_range === 'exact' )	classNameAddIfMissing( this.element_reviewbasketslist_filter_date_range_exact, 'visible' );
	else							classNameRemoveIfPresent( this.element_reviewbasketslist_filter_date_range_exact, 'visible' );

	this.Search_ReviewBasket_Filter_onChange();
}

ReviewBasketsList.prototype.Search_DateRange = function()
{
	return this.select_filter_date_range.GetValue( this.select_filter_date_range.GetValueAtIndex( 0 ) );
}

ReviewBasketsList.prototype.SelectedBasketIDs = function()
{
	var i;
	var list = new Array();

	for ( i = 0; i < this.ActiveItemList_Count(); i++ )
	{
		list.push( this.ActiveItemList_ItemAtIndex( i ).record.basket_id );
	}

	return list;
}

ReviewBasketsList.prototype.ReviewBasketsList_onSearch_GetFilter = function()
{
	var from, date_range, filterlist;

	filterlist	= new Array();
	date_range	= this.Search_DateRange();

	filterlist.push( new MMList_Filter( 'Basket_Show', this.filter_basket_show ) );

	if ( date_range !== 0 )
	{
		if ( date_range === 'exact' )
		{
			filterlist.push( new MMList_Filter_Search( new MMList_Filter_Search_Value( 'lastupdate', 'GE', stoi_def( this.filter_dt_start.getTime() / 1000 ) ) ) );
			filterlist.push( new MMList_Filter_Search( new MMList_Filter_Search_Value( 'lastupdate', 'LE', stoi_def( this.filter_dt_end.getTime() / 1000 ) ) ) );
		}
		else
		{
			from = new Date();
			from.setSeconds( 0 );
			from.setMinutes( 0 );
			from.setHours( 0 );

			from.setDate( from.getDate() - ( stoi( date_range ) - 1 ) );

			filterlist.push( new MMList_Filter_Search( new MMList_Filter_Search_Value( 'lastupdate', 'GE', stoi_def( from.getTime() / 1000 ) ) ) );
		}
	}

	return filterlist;
}

ReviewBasketsList.prototype.ReviewBasketsList_onSearch_SaveFilter = function( savedsearch )
{
	savedsearch.basket_show					= this.filter_basket_show;
	savedsearch.basket_filter_date_range 	= this.Search_DateRange();
	savedsearch.basket_filter_date_start 	= stoi_def( this.filter_dt_start.getTime() / 1000, 0 );
	savedsearch.basket_filter_date_end 		= stoi_def( this.filter_dt_end.getTime() / 1000, 0 );
}

ReviewBasketsList.prototype.ReviewBasketsList_onSearch_RestoreFilter = function( savedsearch )
{
	var date, date_range;

	if ( !savedsearch )
	{
		return;
	}

	if ( savedsearch.basket_show?.length )
	{
		this.Basket_Show_SetValue( savedsearch.basket_show );
		this.Basket_Show_SetActive( savedsearch.basket_show );
	}

	this.select_filter_date_range.SetValue( savedsearch.basket_filter_date_range );

	if ( ( date = stoi_def( savedsearch.basket_filter_date_start, -1 ) ) !== -1 )
	{
		this.filter_dt_start = new Date( date * 1000 );
	}
	else
	{
		this.filter_dt_start = new Date();
		this.filter_dt_start.setMilliseconds( 0 );
		this.filter_dt_start.setSeconds( 0 );
		this.filter_dt_start.setMinutes( 0 );
		this.filter_dt_start.setHours( 0 );
	}

	if ( ( date = stoi_def( savedsearch.basket_filter_date_end, -1 ) ) !== -1 )
	{
		this.filter_dt_end = new Date( date * 1000 );
	}
	else
	{
		this.filter_dt_end = new Date();
		this.filter_dt_end.setMilliseconds( 0 );
		this.filter_dt_end.setSeconds( 0 );
		this.filter_dt_end.setMinutes( 0 );
		this.filter_dt_end.setHours( 0 );
	}

	this.datetime_filter_date_range_exact_start.SetDate( this.filter_dt_start );
	this.datetime_filter_date_range_exact_end.SetDate( this.filter_dt_end );

	date_range 	= this.Search_DateRange();

	if ( date_range === 'exact' )	classNameAddIfMissing( this.element_reviewbasketslist_filter_date_range_exact, 'visible' );
	else							classNameRemoveIfPresent( this.element_reviewbasketslist_filter_date_range_exact, 'visible' );
}

ReviewBasketsList.prototype.Feature_Controls_SetSearchType = function( type )
{
	if ( this.Feature_Check_Enabled( 'persistent_filters' ) )
	{
		if ( type === 'simple' && this.Feature_Controls_GetSearchType() !== 'simple' )
		{
			if ( this.reviewbasketslist_filter_save_state !== null )
			{
				this.ReviewBasketsList_onSearch_RestoreFilter( this.reviewbasketslist_filter_save_state );
				this.reviewbasketslist_filter_save_state	= null;
			}

			this.select_filter_date_range.Enable();
		}
		else if ( type === 'advanced' && this.Feature_Controls_GetSearchType() !== 'advanced' )
		{
			this.reviewbasketslist_filter_save_state		= new Object();
			this.ReviewBasketsList_onSearch_SaveFilter( this.reviewbasketslist_filter_save_state );

			this.select_filter_date_range.Disable();
			this.Filters_Reset();
		}
	}

	MMList_NoFeatures.prototype.Feature_Controls_SetSearchType.call( this, type );
}

ReviewBasketsList.prototype.Filters_Reset = function()
{
	this.select_filter_date_range.SetValue( 0 );

	this.filter_dt_start											= new Date();
	this.filter_dt_start.setSeconds( 0 );
	this.filter_dt_start.setMinutes( 0 );
	this.filter_dt_start.setHours( 0 );

	this.filter_dt_start.setDate( this.filter_dt_start.getDate() - 1 );

	this.filter_dt_end												= new Date();
	this.filter_dt_end.setSeconds( 0 );
	this.filter_dt_end.setMinutes( 0 );
	this.filter_dt_end.setHours( 0 );

	this.datetime_filter_date_range_exact_start.SetDate( this.filter_dt_start );
	this.datetime_filter_date_range_exact_end.SetDate( this.filter_dt_end );
}

ReviewBasketsList.prototype.Delete_All = function()
{
	var self = this;

	if ( !confirm( 'Deleting baskets cannot be undone. Are you sure you wish to delete all baskets?' ) )
	{
		return;
	}

	ReviewBaskets_Delete_All_Baskets( function( response )
	{
		if ( !response.success )
		{
			Modal_Alert( response.error_message );
		}

		self.Refresh();
	}, this.delegator );
}

ReviewBasketsList.prototype.onDeleteList = function( basket_ids, callback, delegator )
{
	ReviewBaskets_BasketList_Delete( basket_ids, callback, delegator );
}

ReviewBasketsList.prototype.onDeleteList_Add = function( item, list )
{
	list.push( item.record.basket_id );
}

ReviewBasketsList.prototype.onGetRecordID = function( record )
{
	return record.basket_id;
}

ReviewBasketsList.prototype.onLoadRecordIndex = function( record, callback, delegator )
{
	ReviewBaskets_BasketIndex_Load_ID( record.basket_id, this.filter, this.sort_direction + this.sort_field, callback, delegator );
}

ReviewBasketsList.prototype.onCreateRootColumnList = function()
{
	var columnlist;

	columnlist =
	[
		new MMList_Column_Numeric( 'Basket ID', 'basket_id', 'Basket_ID' )
			.SetNavigationEnabled( true ),
		new MMList_Column_Currency( 'Basket Subtotal', 'subtotal', 'Basket Subtotal' )
			.SetOnDisplayData( function( record ){ return DrawMMListString_Data_NoEncoding( record.formatted_subtotal ); } )
			.SetSearchable( false )
			.SetSortByField( '' ),
		new MMList_Column_DateTime( 'Last Updated', 'lastupdate', 'Last Updated' )
			.SetSearchable( false ),
		new MMList_Column_Numeric( 'Number of Items', 'quantity', 'Number of Items' )
			.SetSearchable( false )
			.SetSortByField( '' ),
		new MMList_Column_MappedTextValues( 'Status', 'expired', [ 'false', 'true' ], [ 'Valid', 'Expired' ] ),
		new MMList_Column_Text( 'Shipping Residential', 'ship_res', 'Shipping Residential' )
			.SetDefaultActive( false )
			.SetSearchable( false ),
		new ReviewBasketsList_Column_BasketType( 'Type', 'type',
												 [ 'Anonymous', 'Checkout', 'Customer' ],
												 [ 'Anonymous', 'Checkout', 'Customer' ], 'Type' ),
		new MMList_Column_Text( 'Shipping First Name', 'ship_fname', 'Shipping First Name' )
			.SetDefaultActive( false ),
		new MMList_Column_Text( 'Shipping Last Name', 'ship_lname', 'Shipping Last Name' )
			.SetDefaultActive( false ),
		new MMList_Column_Text( 'Shipping Email', 'ship_email', 'Shipping Email' )
			.SetDefaultActive( false ),
		new MMList_Column_Text( 'Shipping Company', 'ship_comp', 'Shipping Comp' )
			.SetDefaultActive( false ),
		new MMList_Column_Text( 'Shipping Phone', 'ship_phone', 'Shipping Phone' )
			.SetDefaultActive( false ),
		new MMList_Column_Text( 'Shipping Fax', 'ship_fax', 'Shipping Fax' )
			.SetDefaultActive( false ),
		new MMList_Column_Text( 'Shipping Address', 'ship_addr1', 'Shipping Address' )
			.SetDefaultActive( false ),
		new MMList_Column_Text( 'Shipping Address 2', 'ship_addr2', 'Shipping Address 2' )
			.SetDefaultActive( false ),
		new MMList_Column_Text( 'Shipping City', 'ship_city', 'Shipping City' )
			.SetDefaultActive( false ),
		new MMList_Column_Text( 'Shipping State', 'ship_state', 'Shipping State' )
			.SetDefaultActive( false ),
		new MMList_Column_Text( 'Shipping Zip', 'ship_zip', 'Shipping Zip' )
			.SetDefaultActive( false ),
		new MMList_Column_Text( 'Shipping Country', 'ship_cntry', 'Shipping Country' )
			.SetDefaultActive( false ),
		new MMList_Column_Text( 'Billing First Name', 'bill_fname', 'Billing First Name' ),
		new MMList_Column_Text( 'Billing Last Name', 'bill_lname', 'Billing Last Name' ),
		new MMList_Column_Text( 'Billing Email', 'bill_email', 'Billing Email' )
			.SetDefaultActive( false ),
		new MMList_Column_Text( 'Billing Company', 'bill_comp', 'Billing Comp' )
			.SetDefaultActive( false ),
		new MMList_Column_Text( 'Billing Phone', 'bill_phone', 'Billing Phone' )
			.SetDefaultActive( false ),
		new MMList_Column_Text( 'Billing Fax', 'bill_fax', 'Billing Fax' )
			.SetDefaultActive( false ),
		new MMList_Column_Text( 'Billing Address', 'bill_addr1', 'Billing Address' )
			.SetDefaultActive( false ),
		new MMList_Column_Text( 'Billing Address 2', 'bill_addr2', 'Billing Address 2' )
			.SetDefaultActive( false ),
		new MMList_Column_Text( 'Billing City', 'bill_city', 'Billing City' )
			.SetDefaultActive( false ),
		new MMList_Column_Text( 'Billing State', 'bill_state', 'Billing State' )
			.SetDefaultActive( false ),
		new MMList_Column_Text( 'Billing Zip', 'bill_zip', 'Billing Zip' )
			.SetDefaultActive( false ),
		new MMList_Column_Text( 'Billing Country', 'bill_cntry', 'Billing Country' )
			.SetDefaultActive( false ),
		new ReviewBasketsList_Column_ProductCode( 'Product Code', 'product_code', 'Product Code' )
			.SetDefaultActive( false ),
		new MMList_Column_Text( 'Order #', 'order_id' )
			.SetDefaultActive( false )
			.SetOnDisplayData( function( record ) { return DrawMMListString_Data( record.order_id == 0 ? '' : record.order_id ); } )
			.SetOnExportData( function( record ) { return record.order_id == 0 ? '' : record.order_id; } ),
		new MMList_Column_Numeric( 'Payment Failures', 'auth_fails' )
			.SetDefaultActive( false )
	];

	if ( CanI( 'CUST', 1, 0, 0, 0 ) )
	{
		columnlist.push( new MMList_Column_Text( 'Customer Login', 'cust_login', 'Customer Login' )
							 .SetDefaultActive( false ),
						 new MMList_Column_Text( 'Customer Password Email', 'cust_pw_email', 'Customer Password Email' )
							 .SetDefaultActive( false ),
						 new MMList_Column_Text( 'Business Account', 'business_title', 'Business Account' )
							 .SetDefaultActive( false ) );
	}

	return columnlist;
}

ReviewBasketsList.prototype.onEdit = function( item )
{
	var self = this;
	var overlay;

	if ( this.overlay_visible )
	{
		return;
	}

	this.overlay_visible 	= true;

	overlay					= new ReviewBasketsListDetailOverlay();
	overlay.onDismiss_End 	= function() { self.overlay_visible = false; };
	overlay.SetParentList( this );
	overlay.Show( item.record.basket_id );
}

ReviewBasketsList.prototype.ActionBar_EnableDisable = function()
{
	var item;

	if ( !this.SingleRecordSelected() )
	{
		if ( this.button_shopascustomer )	this.button_shopascustomer.Hide();
	}
	else
	{
		item = this.ActiveItemList_ItemAtIndex( 0 );

		if ( this.button_shopascustomer )
		{
			if ( item.record.cust_id )	this.button_shopascustomer.Show();
			else						this.button_shopascustomer.Hide();
		}
	}
}

ReviewBasketsList.prototype.ShopAsCustomer = function()
{
	var item, dialog;

	if ( ( item = this.ActiveItemList_ItemAtIndex( 0 ) ) !== null && typeof item.record.cust_login === 'string' && item.record.cust_login.length )
	{
		dialog = new ShopAsCustomer_Dialog( item.record.cust_login );
		dialog.Show();
	}
}

ReviewBasketsList.prototype.Basket_Show = function( value )
{
	this.Basket_Show_SetValue( value );
	this.Basket_Show_SetActive( value );
	this.SavePreferencesAfterRefresh( [ this.key_prefix + '.filter_basket_show' ], [ value ] );
	this.Refresh();
}

ReviewBasketsList.prototype.Basket_Show_SetActive = function( value )
{
	if ( !this.button_basket_show_all ||
		 !this.button_basket_show_nonempty )
	{
		return;
	}

	this.button_basket_show_all.SetActive( false );
	this.button_basket_show_nonempty.SetActive( false );

	switch ( value )
	{
		case 'Non-Empty'	: this.button_basket_show_nonempty.SetActive( true );	break;
		default				: this.button_basket_show_all.SetActive( true );		break;
	}
}

ReviewBasketsList.prototype.Basket_Show_SetValue = function( value )
{
	switch ( value )
	{
		case 'Non-Empty'	: this.filter_basket_show = 'Non-Empty';	break;
		default				: this.filter_basket_show = 'All';			break;
	}
}

// ReviewBasketsList_Column_ProductCode
////////////////////////////////////////////////////

function ReviewBasketsList_Column_ProductCode()
{
	MMList_Column.call( this, 'Product_Code', 'product_code' );

	this.SetDefaultActive( false );
	this.SetHeaderAttributeList( { 'class': 'mm_list_column_header' } );
	this.SetHeaderText( 'Product Code' );

	return this;
}

DeriveFrom( MMList_Column, ReviewBasketsList_Column_ProductCode );

ReviewBasketsList_Column_ProductCode.prototype.onAdvancedSearch_Filter_AddOptions = function()
{
	this.AdvancedSearch_Filter_AddOption( 'Basket Contains Product', 'EQ' );
}

ReviewBasketsList_Column_ProductCode.prototype.onAdvancedSearch_ConstructValue = function()
{
	return this.AdvancedSearch_ConstructValue_InputLookup();
}

ReviewBasketsList_Column_ProductCode.prototype.AdvancedSearch_ConstructValue_InputLookup_OnClick = function( e, input )
{
	this.Lookup( input );
}

ReviewBasketsList_Column_ProductCode.prototype.onAdvancedSearch_GetDisplayedName = function()
{
	return '';
}

ReviewBasketsList_Column_ProductCode.prototype.Lookup = function( input )
{
	var dialog;

	dialog		= new ProductLookup_Dialog();
	dialog.onok = function()
	{
		var record;

		if ( ( record = dialog.SelectedProduct() ) !== null )
		{
			input.SetValue( record.code );
		}
	}

	dialog.Show();
}

// ReviewBasketsList_Column_BasketType
////////////////////////////////////////////////////

function ReviewBasketsList_Column_BasketType( header_text, code, actual_values, display_values, fieldname )
{
	MMList_Column_MappedTextValues.call( this, header_text, code, actual_values, display_values, fieldname );

	this.SetSortByField( '' );
	this.SetOnDisplayData( this.onDisplayData );
	this.SetOnExportData( this.onExportData );
}

DeriveFrom( MMList_Column_MappedTextValues, ReviewBasketsList_Column_BasketType );

ReviewBasketsList_Column_BasketType.prototype.onDisplayData = function( record )
{
	return DrawMMListString_Data( this.Basket_Type_Text( record ) );
}

ReviewBasketsList_Column_BasketType.prototype.onExportData = function( record )
{
	return this.Basket_Type_Text( record );
}

ReviewBasketsList_Column_BasketType.prototype.Basket_Type_Text = function( record )
{
	if ( record.cust_id == 0 && record.order_id == 0 ) 		return 'Anonymous';
	else if ( record.order_id == 0 ) 						return 'Customer';

	return 'Checkout';
}
