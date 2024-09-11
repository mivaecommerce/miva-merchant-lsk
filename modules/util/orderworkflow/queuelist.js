// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2019 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// Order Workflow: Queue List 
////////////////////////////////////////////////////

function OWFQueue_List()
{
	MMBatchList.call( this, 'mm_batchlist_owfqueuelist' );

	if ( CanI( 'OWFP', 0, 1, 0, 0 ) )
	{
		this.Feature_Add_Enable( 'Add Queue', 'Save Queue' );
	}

	if ( CanI( 'OWFP', 0, 0, 1, 0 ) )
	{
		this.Feature_Edit_Enable( 'Edit Queue(s)', 'Save Queue(s)' );
		this.Feature_RowDoubleClick_Enable();
	}

	if ( CanI( 'OWFP', 0, 0, 0, 1 ) )
	{
		this.Feature_Delete_Enable( 'Delete Queue(s)' );
	}

	this.Feature_SearchBar_SetPlaceholderText( 'Search Queues...' );
	this.SetDefaultSort( 'id', '' );
}

DeriveFrom( MMBatchList, OWFQueue_List );

OWFQueue_List.prototype.onLoad = OWFQueueList_Load_Query;

OWFQueue_List.prototype.onCreate = function()
{
	var record;

	record			= new Object();
	record.code		= '';
	record.name		= '';

	return record;
}

OWFQueue_List.prototype.onInsert = function( item, callback, delegator )
{
	OWFQueue_Insert( item.record.mmbatchlist_fieldlist, callback, delegator );
}

OWFQueue_List.prototype.onSave = function( item, callback, delegator )
{
	OWFQueue_Update( item.record.id, item.record.mmbatchlist_fieldlist, callback, delegator );
}

OWFQueue_List.prototype.onDeleteList = function( queue_ids, callback, delegator )
{
	OWFQueueList_Delete( queue_ids, callback, delegator );
}

OWFQueue_List.prototype.onCreateRootColumnList = function()
{
	var columnlist =
	[
		new MMBatchList_Column_SortOnlyColumn( 'ID', 'id' ),
		new MMBatchList_Column_Code( 'Code', 'code', 'Queue_Code' ),
		new MMBatchList_Column_Name( 'Name', 'name', 'Queue_Name' )
	];

	return columnlist;
}
