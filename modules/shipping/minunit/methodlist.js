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

// MinUnitMethod List
////////////////////////////////////////////////////

function MinUnitMethod_List()
{
	MMBatchList.call( this, 'mm9_batchlist_minunitmethodlist' );

	if ( CanI( 'SHIP', 0, 0, 1, 0 ) )
	{
		this.Feature_Add_Enable( 'Add Method', 'Save Method', '', 'Cancel', '', '', '', '' );
		this.Feature_Edit_Enable( 'Edit Method(s)', 'Save Method(s)' );
		this.Feature_RowDoubleClick_Enable();
		this.Feature_Delete_Enable( 'Delete Method(s)' );
	}

	this.SetDefaultSort( 'method', '' );
	this.Feature_SearchBar_SetPlaceholderText( 'Search Methods...' );
}

DeriveFrom( MMBatchList, MinUnitMethod_List );

MinUnitMethod_List.prototype.onLoad = MinUnitMethodList_Load_Query;

MinUnitMethod_List.prototype.onCreate = function()
{
	return { id: 0, code: '', method: '', rate: '0.00', minimum: '0.00' };
}

MinUnitMethod_List.prototype.onInsert = function( item, callback, delegator )
{
	MinUnitMethod_Insert( item.record.mmbatchlist_fieldlist, callback, delegator );
}

MinUnitMethod_List.prototype.onSave = function( item, callback, delegator )
{
	MinUnitMethod_Update( item.record.id, item.record.mmbatchlist_fieldlist, callback, delegator );
}

MinUnitMethod_List.prototype.onDelete = function( item, callback, delegator )
{
	MinUnitMethod_Delete( item.record.id, callback, delegator );
}

MinUnitMethod_List.prototype.onCreateRootColumnList = function()
{
	var columnlist =
	[
		new MMBatchList_Column_Name(	'Code',					'code',		'MinUnitMethod_Code' ),
		new MMBatchList_Column_Name(	'Method',				'method',	'MinUnitMethod_Method' ),
		new MMBatchList_Column_Numeric(	'Amount / Weight Unit',	'rate',		'MinUnitMethod_Rate',		2 ),
		new MMBatchList_Column_Numeric(	'Minimum Charge',		'minimum',	'MinUnitMethod_Minimum',	2 )
	];

	return columnlist;
}
