// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2016 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// Shop Tax Rate List 
////////////////////////////////////////////////////

function ShopTaxRateList()
{
	this.can_add	= CanI( 'STAX', 0, 1, 0, 0 );
	this.can_modify	= CanI( 'STAX', 0, 0, 1, 0 );
	this.can_delete = CanI( 'STAX', 0, 0, 0, 1 )

	MMBatchList.call( this, 'mm9_batchlist_shoptaxratelist' );

	if ( this.can_add )
	{
		this.Feature_Add_Enable( 'Add Tax Rate', 'Save Tax Rate' );
	}

	if ( this.can_modify )
	{
		this.Feature_Edit_Enable( 'Edit Tax Rate(s)', 'Save Tax Rate(s)' );
		this.Feature_RowDoubleClick_Enable();
	}

	if ( this.can_delete )
	{
		this.Feature_Delete_Enable( 'Delete Tax Rate(s)' );
	}

	this.Feature_SearchBar_SetPlaceholderText( 'Search Tax Rates...' );
	this.SetDefaultSort( 'prompt', '' );
}

DeriveFrom( MMBatchList, ShopTaxRateList );

ShopTaxRateList.prototype.onLoad = ShopTaxRateList_Load_Query;

ShopTaxRateList.prototype.onCreate = function()
{
	var record;

	record				= new Object();
	record.prompt		= '';
	record.rate			= 0.000;
	record.tax_ship		= false;

	return record;
}

ShopTaxRateList.prototype.onInsert = function( item, callback, delegator )
{
	ShopTaxRate_Insert( item.record.mmbatchlist_fieldlist, callback, delegator );
}

ShopTaxRateList.prototype.onSave = function( item, callback, delegator )
{
	ShopTaxRate_Update( item.record.id, item.record.mmbatchlist_fieldlist, callback, delegator );
}

ShopTaxRateList.prototype.onDelete = function( item, callback, delegator )
{
	ShopTaxRate_Delete( item.record.id, callback, delegator );
}

ShopTaxRateList.prototype.onCreateRootColumnList = function()
{
	var self = this;
	var tax_shipping_column;

	if ( this.can_modify )	tax_shipping_column = new MMBatchList_Column_CheckboxSlider(	'Tax Shipping', 'tax_ship', 'Rate_TaxShipping', function( item, checked, delegator ) { self.Update_TaxShipping( item, checked, delegator ); } );
	else					tax_shipping_column = new MMBatchList_Column_Checkbox(			'Tax Shipping', 'tax_ship', 'Rate_TaxShipping' );

	var columnlist =
	[
		new MMBatchList_Column_Name( 'Option', 'prompt', 'Rate_Prompt' ),
		new MMBatchList_Column_Numeric( 'Rate', 'rate', 'Rate_Rate', 3 ),
		tax_shipping_column
			.SetSortByField( '' )
			.SetSearchable( false )
	];

	return columnlist;
}

ShopTaxRateList.prototype.Update_TaxShipping = function( item, checked, delegator )
{
	var self = this;

	ShopTaxRate_Update_TaxShipping( item.record.id, checked, function( response )
	{
		if ( !response.success )
		{
			self.Record_Update_Error( response, item );
			self.ReBindVisibleRows();

			return;
		}

		item.record.tax_ship = checked ? true : false;

		self.ItemRecord_UpdateOriginalRecord( item, null );
		self.ReBindVisibleRows();
	}, delegator );
}
