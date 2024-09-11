// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2017 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// MOD10 Card List
////////////////////////////////////////////////////

function MOD10CardList()
{
	MMBatchList.call( this, 'mm9_batchlist_mod10cardlist' );

	if ( CanI( 'PMNT', 0, 0, 1, 0 ) )
	{
		this.Feature_Add_Enable( 'Add Credit Card', 'Save Credit Card' );
		this.Feature_Edit_Enable( 'Edit Credit Card(s)', 'Save Credit Card(s)' );
		this.Feature_Delete_Enable( 'Delete Credit Card(s)' );
		this.Feature_RowDoubleClick_Enable();
	}

	this.SetEmptyListMessage( 'No Credit Cards' );
	this.Feature_SearchBar_SetPlaceholderText( 'Search Credit Cards...' );
	this.SetDefaultSort( 'name' );
}

DeriveFrom( MMBatchList, MOD10CardList );

MOD10CardList.prototype.onLoad = MOD10CardList_Load_Query;

MOD10CardList.prototype.onCreate = function()
{
	var record;

	record			= new Object();
	record.name		= '';
	record.prefixes	= '';
	record.lengths	= '';

	return record;
}

MOD10CardList.prototype.onInsert = function( item, callback, delegator )
{
	MOD10Card_Insert( item.record.mmbatchlist_fieldlist, callback, delegator );
}

MOD10CardList.prototype.onSave = function( item, callback, delegator )
{
	MOD10Card_Update( item.record.id, item.record.mmbatchlist_fieldlist, callback, delegator );
}

MOD10CardList.prototype.onDelete = function( item, callback, delegator )
{
	MOD10Card_Delete( item.record.id, callback, delegator );
}

MOD10CardList.prototype.onCreateRootColumnList = function()
{
	var columnlist =
	[
		new MMBatchList_Column_Text( 'Credit Card', 'name', 'Name' ),
		new MMBatchList_Column_Text( 'Allowable Prefixes', 'prefixes', 'Prefixes' ),
		new MMBatchList_Column_Text( 'Allowable Lengths', 'lengths', 'Lengths' )
	];

	return columnlist;
}
