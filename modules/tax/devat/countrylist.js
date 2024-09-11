// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2014 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// European VAT Country List 
////////////////////////////////////////////////////

function EuropeanVATCountryList()
{
	MMBatchList.call( this, 'mm9_batchlist_europeanvatcountrylist' );

	this.countrylist = new Array();

	if ( CanI( 'STAX', 0, 1, 0, 0 ) )
	{
		this.Feature_Add_Enable( 'Add VAT Country' );
	}

	if ( CanI( 'STAX', 0, 0, 0, 1 ) )
	{
		this.Feature_Delete_Enable( 'Delete VAT Country(s)' );
	}

	this.CountryList_Load();
	this.Feature_SearchBar_SetPlaceholderText( 'Search VAT Countries...' );
	this.SetDefaultSort( 'cty_alpha' );
}

DeriveFrom( MMBatchList, EuropeanVATCountryList );

EuropeanVATCountryList.prototype.onLoad = EuropeanVATCountryList_Load_Query;

EuropeanVATCountryList.prototype.onCreate = function()
{
	var record;

	record				= new Object();
	record.cty_alpha	= '';
	record.name			= '';

	return record;
}

EuropeanVATCountryList.prototype.onInsert = function( item, callback, delegator )
{
	EuropeanVATCountry_Insert( item.record.mmbatchlist_fieldlist, callback, delegator );
}

EuropeanVATCountryList.prototype.onDelete = function( item, callback, delegator )
{
	EuropeanVATCountry_Delete( item.record.cty_alpha, callback, delegator );
}

EuropeanVATCountryList.prototype.CountryList_Load = function()
{
	var self = this;

	CountryList_Load( function( response ) { self.CountryList_Load_Callback( response ); } );
}

EuropeanVATCountryList.prototype.CountryList_Load_Callback = function( response )
{
	if ( !response.success )
	{
		return;
	}

	this.countrylist = response.data;
	this.ReBindVisibleRows();
}

EuropeanVATCountryList.prototype.onCreateRootColumnList = function()
{
	var self = this;

	var columnlist =
	[
		new MMBatchList_Column_Text( 'Code', 'cty_alpha', 'Alpha' )
			.SetOnDisplayEdit( function( record ) { return self.Display_CountryList( record ); } ),
		new MMBatchList_Column_Text( 'Name', 'name', '' )
			.SetOnDisplayEdit( function( record ) { return DrawMMBatchListString_Data( '' ); } )
	];

	return columnlist;
}

EuropeanVATCountryList.prototype.Display_CountryList = function( record )
{
	var select, i, i_len;
	
	select = newElement( 'select', { 'name': 'cty_alpha' }, null, null );

	if ( this.countrylist.length == 0 )
	{
		select.options[ select.options.length ] = new Option( 'Loading...' );
	}
	else
	{
		for ( i = 0, i_len = this.countrylist.length; i < i_len; i++ )
		{
			select.options[ select.options.length ] = new Option( this.countrylist[ i ].alpha + ' - ' + this.countrylist[ i ].name, this.countrylist[ i ].alpha );

			if ( this.countrylist[ i ].alpha == record.cty_alpha )
			{
				select.selectedIndex = i;
			}
		}
	}

	return select;
}
