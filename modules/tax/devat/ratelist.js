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

// European VAT Rate List 
////////////////////////////////////////////////////

function EuropeanVATRateList()
{
	MMBatchList.call( this, 'mm9_batchlist_europeanvatratelist' );

	if ( CanI( 'STAX', 0, 1, 0, 0 ) )
	{
		this.Feature_Add_Enable( 'Add VAT Rate' );
	}

	if ( CanI( 'STAX', 0, 0, 1, 0 ) )
	{
		this.Feature_Edit_Enable( 'Edit VAT Rate(s)', 'Save VAT Rate(s)' );		
		this.Feature_RowDoubleClick_Enable();
	}

	if ( CanI( 'STAX', 0, 0, 0, 1 ) )
	{
		this.Feature_Delete_Enable( 'Delete VAT Rate(s)' );
	}

	this.SetDefaultSort( 'id' );
	this.Feature_SearchBar_SetPlaceholderText( 'Search VAT Rates...' );
}

DeriveFrom( MMBatchList, EuropeanVATRateList );

EuropeanVATRateList.prototype.onLoad = EuropeanVATRateList_Load_Query;

EuropeanVATRateList.prototype.onCreate = function()
{
	var record;

	record			= new Object();
	record.descrip	= '';
	record.rate		= 0.00;

	return record;
}

EuropeanVATRateList.prototype.onInsert = function( item, callback, delegator )
{
	EuropeanVATRate_Insert( item.record.mmbatchlist_fieldlist, callback, delegator );
}

EuropeanVATRateList.prototype.onSave = function( item, callback, delegator )
{
	EuropeanVATRate_Update( item.record.id, item.record.mmbatchlist_fieldlist, callback, delegator );
}

EuropeanVATRateList.prototype.onDelete = function( item, callback, delegator )
{
	EuropeanVATRate_Delete( item.record.id, callback, delegator );
}

EuropeanVATRateList.prototype.onCreateRootColumnList = function()
{
	var columnlist =
	[
		new MMBatchList_Column_Text( 'Description', 'descrip', 'Description' ),
		new MMBatchList_Column_Numeric( 'Rate', 'rate', 'Rate', 2 )
			.SetOnDisplayData( function( record ) { return DrawMMBatchListString_Data( stod( record.rate ).toFixed( 2 ) + '%' ); } )
	];

	return columnlist;
}
