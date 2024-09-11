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

// Price Table Based Shipping Charge List
////////////////////////////////////////////////////

function PriceTableBasedShippingChargeList( product_id )
{
	MMBatchList.call( this, 'mm9_batchlist_pricetablebasedshippingchargelist' );

	this.product_id = product_id;

	if ( CanI( 'PROD', 0, 0, 1, 0 ) )
	{
		this.Feature_Edit_Enable( 'Edit Shipping Charge(s)', 'Save Shipping Charge(s)' );
		this.Feature_RowDoubleClick_Enable();
	}

	this.Feature_SearchBar_SetPlaceholderText( 'Search Shipping Charges...' );
	this.SetDefaultSort( 'method' );
}

DeriveFrom( MMBatchList, PriceTableBasedShippingChargeList );

PriceTableBasedShippingChargeList.prototype.onLoad = function( filter, sort, offset, count, callback, delegator )
{
	PriceTableBasedShippingChargeList_Load_Query( this.product_id, filter, sort, offset, count, callback, delegator );
}

PriceTableBasedShippingChargeList.prototype.onSave = function( item, callback, delegator )
{
	PriceTableBasedShippingCharge_Update( this.product_id, item.record.method_id, item.record.mmbatchlist_fieldlist, callback, delegator );
}

PriceTableBasedShippingChargeList.prototype.onCreateRootColumnList = function()
{
	var columnlist =
	[
		new MMBatchList_Column_Text( 'Code', 'code', '' )
			.SetOnDisplayEdit( function( record ) { return DrawMMBatchListString_Data( record.code ); } ),
		new MMBatchList_Column_Text( 'Method', 'method', '' )
			.SetOnDisplayEdit( function( record ) { return DrawMMBatchListString_Data( record.method ); } ),
		new MMBatchList_Column_Numeric( 'Charge', 'rate', 'Rate', 2 )
			.SetSearchable( false )
	];

	return columnlist;
}
