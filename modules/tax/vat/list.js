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

// Generic VAT List 
////////////////////////////////////////////////////

function GenericVATList()
{
	MMBatchList.call( this, 'mm9_batchlist_genericvatlist' );

	if ( CanI( 'PROD', 1, 0, 0, 0 ) && CanI( 'STAX', 1, 0, 0, 0 ) )
	{
		this.Feature_GoTo_Enable( 'Edit Product' );
	}

	if ( CanI( 'STAX', 0, 0, 1, 0 ) )
	{
		this.Feature_Edit_Enable( 'Edit VAT(s)', 'Save VAT(s)' );
		this.Feature_RowDoubleClick_Enable();
	}

	this.Feature_SearchBar_SetPlaceholderText( 'Search VATs...' );
	this.SetEmptyListMessage_IconAndText( 'VAT rates are configured when editing products', 'catalog' );
}

DeriveFrom( MMBatchList, GenericVATList );

GenericVATList.prototype.onLoad = GenericVATList_Load_Query;

GenericVATList.prototype.onSave = function( item, callback, delegator )
{
	GenericVAT_Update( item.record.product_id, item.record.mmbatchlist_fieldlist, callback, delegator );
}

GenericVATList.prototype.onGoTo = function( item, e )
{
	return OpenLinkHandler( e, adminurl, { 'Screen': 'PROD', 'Store_Code': Store_Code, 'Edit_Product': item.record.product_code, 'Tab': 'GT_PROD', 'Tab_Section': 'VAT' } );
}

GenericVATList.prototype.onCreateRootColumnList = function()
{
	var columnlist =
	[
		new MMBatchList_Column_Code( 'Code', 'product_code', '' )
			.SetOnDisplayEdit( function( record ) { return DrawMMBatchListString_Data( record.product_code ); } ),
		new MMBatchList_Column_Name( 'Name', 'product_name', '' )
			.SetOnDisplayEdit( function( record ) { return DrawMMBatchListString_Data( record.product_name ); } ),
		new MMBatchList_Column_Numeric( 'VAT Rate', 'rate', 'Rate', 3 )
			.SetOnDisplayData( function( record ) { return DrawMMBatchListString_Data( stod( record.rate ).toFixed( 3 ) + '%' ); } )
			.SetSearchable( false )
	];

	return columnlist;
}
