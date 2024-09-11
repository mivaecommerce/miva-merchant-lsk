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

// Custom Field Group List
////////////////////////////////////////////////////

function CustomFieldGroupList()
{
	MMBatchList.call( this, 'mm9_batchlist_customfieldgrouplist' );

	if ( CanI( 'SUTL', 0, 0, 1, 0 ) )
	{
		this.Feature_Add_Enable( 'Add Group', 'Save Group', '', 'Cancel', '', '', '', '' );
		this.Feature_Edit_Enable( 'Edit Group(s)', 'Save Group(s)' );
		this.Feature_RowDoubleClick_Enable();
		this.Feature_Delete_Enable( 'Delete Group(s)' );
	}

	this.Feature_SearchBar_SetPlaceholderText( 'Search Groups...' );
	this.SetDefaultSort( 'code' );
}

DeriveFrom( MMBatchList, CustomFieldGroupList );

CustomFieldGroupList.prototype.onLoad = CustomFieldGroupList_Load_Query;

CustomFieldGroupList.prototype.onCreate = function()
{
	return { 'code': '', 'name': '' };
}

CustomFieldGroupList.prototype.onInsert = function( item, callback, delegator )
{
	CustomFieldGroup_Insert( item.record.mmbatchlist_fieldlist, callback, delegator );
}

CustomFieldGroupList.prototype.onSave = function( item, callback, delegator )
{
	CustomFieldGroup_Update( item.record.id, item.record.mmbatchlist_fieldlist, callback, delegator );
}

CustomFieldGroupList.prototype.onDelete = function( item, callback, delegator )
{
	CustomFieldGroup_Delete( item.record.id, callback, delegator );
}

CustomFieldGroupList.prototype.onCreateRootColumnList = function()
{
	var columnlist =
	[
		new MMBatchList_Column_Code( 'Code', 'code', 'Code' ),
		new MMBatchList_Column_Name( 'Name', 'name', 'Name')
	];

	return columnlist;
}
