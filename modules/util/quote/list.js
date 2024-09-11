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

// Quote List
////////////////////////////////////////////////////

function QuoteList()
{
	var self = this;
	var action;

	BaseQuoteList.call( this, 'mm_quotelist' );

	if ( CanI( 'ORDR', 0, 1, 0, 0 ) )
	{
		action = this.Feature_Controls_Create_Action( 'New Quote', '', this.New_Quote );
		this.Feature_Controls_SetPrimary_Action( action );
	}

	// Filter elements

	this.filter_dt_start									= null;
	this.filter_dt_end										= null;
	this.quotelist_filter_save_state						= null;

	this.element_quotelist_filter_type_container			= document.getElementById( 'quotelist_filter_type_container' );
	this.element_quotelist_filter_date_range_container		= document.getElementById( 'quotelist_filter_date_range_container' );
	this.element_quotelist_filter_date_range_exact			= document.getElementById( 'quotelist_filter_date_range_exact' );
	this.element_quotelist_filter_date_range_exact_start	= document.getElementById( 'quotelist_filter_date_range_exact_start' );
	this.element_quotelist_filter_date_range_exact_end		= document.getElementById( 'quotelist_filter_date_range_exact_end' );

	this.select_filter_type									= new MMSelect( this.element_quotelist_filter_type_container );
	this.select_filter_date_range							= new MMSelect( this.element_quotelist_filter_date_range_container );

	this.datetime_filter_date_range_exact_start				= new MMDateTimePickerDisplay( this.element_quotelist_filter_date_range_exact_start,	new Date() );
	this.datetime_filter_date_range_exact_end				= new MMDateTimePickerDisplay( this.element_quotelist_filter_date_range_exact_end,		new Date() );

	this.select_filter_type.AddClassName( 'small' );
	this.select_filter_date_range.AddClassName( 'small' );
	this.datetime_filter_date_range_exact_start.AddClassName( 'small' );
	this.datetime_filter_date_range_exact_end.AddClassName( 'small' );

	this.datetime_filter_date_range_exact_start.SetDateLimit_Future( function() { return self.filter_dt_end; } );
	this.datetime_filter_date_range_exact_start.SetOnChangeHandler( function( date )
	{
		self.filter_dt_start = date;
		self.Search_Quote_Filter_onChange();
	} );

	this.datetime_filter_date_range_exact_end.SetDateLimit_Past( function() { return self.filter_dt_start; } );
	this.datetime_filter_date_range_exact_end.SetOnChangeHandler( function( date )
	{
		self.filter_dt_end = date;
		self.Search_Quote_Filter_onChange();
	} );

	this.OnSearch_GetFilter_AddHook( this.QuoteList_onSearch_GetFilter );
	this.OnSearch_SaveFilter_AddHook( this.QuoteList_onSearch_SaveFilter );
	this.OnSearch_RestoreFilter_AddHook( this.QuoteList_onSearch_RestoreFilter );
	this.Feature_Persistent_Filters_Enable( 'mm_quotelist' );
}

DeriveFrom( BaseQuoteList, QuoteList );

QuoteList.prototype.LoadPreferences = function( preferencelist )
{
	var self = this;
	var savedsearch;

	try
	{
		savedsearch									= JSON.parse( preferencelist.default_quote_filter );
	}
	catch ( e )
	{
		savedsearch									= new Object();
		savedsearch.quotelist_filter_type 			= 'date_range';
		savedsearch.quotelist_filter_date_range 	= 90;
		savedsearch.quotelist_filter_date_start 	= -1;
		savedsearch.quotelist_filter_date_end 		= -1;
	}

	this.QuoteList_onSearch_RestoreFilter( savedsearch );

	//
	// Initialize filter change events AFTER we restore the 'saved' filter
	// so that we don't trigger another preference save every time we
	// load the list.
	//

	this.select_filter_type.onchange				= function( value ) { self.Search_Change_Type(); };
	this.select_filter_date_range.onchange			= function( value ) { self.Search_Change_DateRange(); };

	MMList_NoFeatures.prototype.LoadPreferences.call( this, preferencelist );
}

QuoteList.prototype.onPersistentFiltersSetContent = function()
{
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

	this.select_filter_type.AddOption( 'None',			'' );
	this.select_filter_type.AddOption( 'Date Range',	'date_range' );

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
}

QuoteList.prototype.Search_Quote_Filter_onChange = function()
{
	var savedsearch = new Object();

	this.QuoteList_onSearch_SaveFilter( savedsearch );
	this.SavePreferencesAfterRefresh( [ this.key_prefix + '.default_quote_filter' ], [ JSON.stringify( savedsearch ) ] );
	this.onSearch();
}

QuoteList.prototype.Search_Change_Type = function()
{
	var type, date_range;

	type		= this.Search_Type();
	date_range	= this.Search_DateRange();

	if ( type === 'date_range' && date_range === 'exact' )	classNameAddIfMissing( this.element_quotelist_filter_date_range_exact, 'visible' );
	else													classNameRemoveIfPresent( this.element_quotelist_filter_date_range_exact, 'visible' );

	if ( type === 'date_range' )							this.select_filter_date_range.Show();
	else													this.select_filter_date_range.Hide();

	this.Search_Quote_Filter_onChange();
}

QuoteList.prototype.Search_Change_DateRange = function()
{
	var type, date_range;

	type		= this.Search_Type();
	date_range	= this.Search_DateRange();

	if ( type === 'date_range' && date_range === 'exact' )	classNameAddIfMissing( this.element_quotelist_filter_date_range_exact, 'visible' );
	else													classNameRemoveIfPresent( this.element_quotelist_filter_date_range_exact, 'visible' );

	this.Search_Quote_Filter_onChange();
}

QuoteList.prototype.Search_Type = function()
{
	return this.select_filter_type.GetValue( this.select_filter_type.GetValueAtIndex( 0 ) );
}

QuoteList.prototype.Search_DateRange = function()
{
	return this.select_filter_date_range.GetValue( this.select_filter_date_range.GetValueAtIndex( 0 ) );
}

QuoteList.prototype.QuoteList_onSearch_GetFilter = function()
{
	var from, filterlist, search_type, search_daterange;

	filterlist			= new Array();
	search_type			= this.Search_Type();
	search_daterange	= this.Search_DateRange();

	if ( search_type === 'date_range' && search_daterange !== 0 )
	{
		if ( search_daterange == 'exact' )
		{
			filterlist.push( new MMList_Filter_Search( new MMList_Filter_Search_Value( 'created', 'GE', stoi( this.filter_dt_start.getTime() / 1000 ) ) ) );
			filterlist.push( new MMList_Filter_Search( new MMList_Filter_Search_Value( 'created', 'LE', stoi( this.filter_dt_end.getTime() / 1000 ) ) ) );
		}
		else
		{
			from = new Date();
			from.setSeconds( 0 );
			from.setMinutes( 0 );
			from.setHours( 0 );

			from.setDate( from.getDate() - ( stoi( search_daterange ) - 1 ) );
			filterlist.push( new MMList_Filter_Search( new MMList_Filter_Search_Value( 'created', 'GE', stoi( from.getTime() / 1000 ) ) ) );
		}
	}

	return filterlist;
}

QuoteList.prototype.QuoteList_onSearch_SaveFilter = function( savedsearch )
{
	savedsearch.quotelist_filter_type 		= this.Search_Type();
	savedsearch.quotelist_filter_date_range = this.Search_DateRange();
	savedsearch.quotelist_filter_date_start = stoi_def( this.filter_dt_start.getTime() / 1000, 0 );
	savedsearch.quotelist_filter_date_end 	= stoi_def( this.filter_dt_end.getTime() / 1000, 0 );
}

QuoteList.prototype.QuoteList_onSearch_RestoreFilter = function( savedsearch )
{
	var date, type, date_range;

	if ( !savedsearch )
	{
		return;
	}

	this.select_filter_type.SetValue( savedsearch.quotelist_filter_type );
	this.select_filter_date_range.SetValue( savedsearch.quotelist_filter_date_range );

	if ( ( date = stoi_def( savedsearch.quotelist_filter_date_start, -1 ) ) !== -1 )
	{
		this.filter_dt_start = new Date( date * 1000 );
	}
	else
	{
		this.filter_dt_start = new Date();
		this.filter_dt_start.setDate( this.filter_dt_start.getDate() - 1 );
		this.filter_dt_start.setMilliseconds( 0 );
		this.filter_dt_start.setSeconds( 0 );
		this.filter_dt_start.setMinutes( 0 );
		this.filter_dt_start.setHours( 0 );
	}

	if ( ( date = stoi_def( savedsearch.quotelist_filter_date_end, -1 ) ) !== -1 )
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

	type 		= this.Search_Type();
	date_range 	= this.Search_DateRange();

	if ( type === 'date_range' && date_range === 'exact' )	classNameAddIfMissing( this.element_quotelist_filter_date_range_exact, 'visible' );
	else													classNameRemoveIfPresent( this.element_quotelist_filter_date_range_exact, 'visible' );

	if ( type === 'date_range' )							this.select_filter_date_range.Show();
	else													this.select_filter_date_range.Hide();
}

QuoteList.prototype.Feature_Controls_SetSearchType = function( type )
{
	if ( this.Feature_Check_Enabled( 'persistent_filters' ) )
	{
		if ( type === 'simple' && this.Feature_Controls_GetSearchType() !== 'simple' )
		{
			if ( this.quotelist_filter_save_state !== null )
			{
				this.QuoteList_onSearch_RestoreFilter( this.quotelist_filter_save_state );
				this.quotelist_filter_save_state = null;
			}

			this.select_filter_type.Enable();
		}
		else if ( type === 'advanced' && this.Feature_Controls_GetSearchType() !== 'advanced' )
		{
			this.quotelist_filter_save_state = new Object();
			this.QuoteList_onSearch_SaveFilter( this.quotelist_filter_save_state );

			this.select_filter_type.Disable();
			this.Filters_Reset();
		}
	}

	MMList_NoFeatures.prototype.Feature_Controls_SetSearchType.call( this, type );
}

QuoteList.prototype.Filters_Reset = function()
{
	this.select_filter_type.SetValue( '' );
	this.select_filter_date_range.SetValue( 0 );

	this.select_filter_date_range.Hide();
	classNameRemoveIfPresent( this.element_quotelist_filter_date_range_exact, 'visible' );

	this.filter_dt_start	= new Date();
	this.filter_dt_start.setSeconds( 0 );
	this.filter_dt_start.setMinutes( 0 );
	this.filter_dt_start.setHours( 0 );

	this.filter_dt_start.setDate( this.filter_dt_start.getDate() - 1 );

	this.filter_dt_end		= new Date();
	this.filter_dt_end.setSeconds( 0 );
	this.filter_dt_end.setMinutes( 0 );
	this.filter_dt_end.setHours( 0 );

	this.datetime_filter_date_range_exact_start.SetDate( this.filter_dt_start );
	this.datetime_filter_date_range_exact_end.SetDate( this.filter_dt_end );
}

QuoteList.prototype.New_Quote = function()
{
	var self = this;
	var filter, search_filters, confirmation_dialog;

	filter = this.onSearch_GetFilter();

	if ( compareObjects( filter, this.filter ) )
	{
		if ( this.filter.length === 0 )
		{
			return this.New_Quote_LowLevel();
		}
		else if ( this.filter.length === 1 )
		{
			search_filters = this.filter.filter( function( filter ) { return filter instanceof MMList_Filter_Search; } );

			if ( search_filters.length === 1												&&
				 Array.isArray( search_filters[ 0 ].value )									&&
				 search_filters[ 0 ].value.length === 1										&&
				 search_filters[ 0 ].value[ 0 ] instanceof MMList_Filter_Search_Value		&&
				 search_filters[ 0 ].value[ 0 ].field === 'created'							&&
				 search_filters[ 0 ].value[ 0 ].operator === 'GE'							&&
				 search_filters[ 0 ].value[ 0 ].value < ( ( new Date() ).getTime() / 1000 ) )
			{
				return this.New_Quote_LowLevel();
			}
		}
	}

	confirmation_dialog			= new ConfirmationDialog();
	confirmation_dialog.onYes	= function()
	{
		self.filter	= new Array();

		if ( self.Feature_Controls_GetSearchType() !== 'simple' )
		{
			self.Feature_Controls_SetSearchType( 'simple' );
		}

		self.Feature_Controls_AdvancedSearch_Reset();
		self.Feature_Controls_SetSearchValue( '' );
		self.Filters_Reset();
		self.Refresh();
		self.New_Quote_LowLevel();
	};

	confirmation_dialog.Show( 'Quote list filtering must be reset before creating a new quote.<br /><br />Clear filters and create quote?' );
}

QuoteList.prototype.New_Quote_LowLevel = function()
{
	var self = this;

	Quote_Create_Empty( function( response )
	{
		if ( !response.success )
		{
			return self.onError( response.error_message );
		}

		self.onEdit( self.CreateListItem( response.data, -1, self.branch_root ) );
	} );
}