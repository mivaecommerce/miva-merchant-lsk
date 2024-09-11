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

// Flat Rate List
////////////////////////////////////////////////////

function FlatRateList()
{
	MMList.call( this, 'mm_list_flatratemethodlist' );

	if ( CanI( 'SHIP', 0, 0, 1, 0 ) )
	{
		this.Feature_Add_Enable( 'Add Shipping Method', 'Save Shipping Method' );
		this.Feature_Edit_Enable( 'Edit Shipping Method(s)', 'Save Shipping Method(s)' );
		this.Feature_Delete_Enable( 'Delete Shipping Method(s)' );
	}

	this.Feature_Controls_SetSearchPlaceholderText( 'Search Methods...' );
	this.SetDefaultSort( 'method', '' );
}

DeriveFrom( MMList, FlatRateList );

FlatRateList.prototype.onLoad = FlatRateMethodList_Load_Query;

FlatRateList.prototype.onCreate = function()
{
	var record;

	record			= new Object();
	record.code		= '';
	record.method	= '';
	record.cost		= 0.00;

	return record;
}

FlatRateList.prototype.onInsert = function( item, callback, delegator )
{
	FlatRateMethod_Insert( item.record.mmlist_fieldlist, callback, delegator );
}

FlatRateList.prototype.onSave = function( item, callback, delegator )
{
	FlatRateMethod_Update( item.record.id, item.record.mmlist_fieldlist, callback, delegator );
}

FlatRateList.prototype.onDelete = function( item, callback, delegator )
{
	FlatRateMethod_Delete( item.record.id, callback, delegator );
}

FlatRateList.prototype.onCreateRootColumnList = function()
{
	var columnlist =
	[
		new MMList_Column_Name( 'Code',			'code',		'Code' ),
		new MMList_Column_Name( 'Method',		'method',	'Method' ),
		new MMList_Column_Currency( 'Amount',	'cost',		'Cost' )
	];

	return columnlist;
}
