// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2026 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// Order Workflow: Queue List 
////////////////////////////////////////////////////

var OWFQueueList = class extends MMList
{
	constructor()
	{
		super( 'owfqueuelist' );

		if ( CanI( 'OWFP', 0, 1, 0, 0 ) )
		{
			this.Feature_Add_Enable( 'Add Queue', 'Save Queue' );
		}

		if ( CanI( 'OWFP', 0, 0, 1, 0 ) )
		{
			this.Feature_Edit_Enable( 'Edit Queue(s)', 'Save Queue(s)' );
		}

		if ( CanI( 'OWFP', 0, 0, 0, 1 ) )
		{
			this.Feature_Delete_Enable( 'Delete Queue(s)' );
		}

		this.Feature_Controls_SetSearchPlaceholderText( 'Search Queues...' );
		this.SetDefaultSort( 'id', '' );
	}

	onLoad( filter, sort, offset, count, callback, delegator )
	{
		OWFQueueList_Load_Query( filter, sort, offset, count, callback, delegator );
	}

	onCreate()
	{
		return { code: '', name: '' };
	}

	onInsert( item, callback, delegator )
	{
		OWFQueue_Insert( item.record.mmlist_fieldlist, callback, delegator );
	}

	onSave( item, callback, delegator )
	{
		OWFQueue_Update( item.record.id, item.record.mmlist_fieldlist, callback, delegator );
	}

	onDeleteList( queue_ids, callback, delegator )
	{
		OWFQueueList_Delete( queue_ids, callback, delegator );
	}

	onCreateRootColumnList()
	{
		return [
			new MMList_Column_SortOnlyColumn( 'ID', 'id' ),
			new MMList_Column_Code( 'Code', 'code', 'Queue_Code' ),
			new MMList_Column_Name( 'Name', 'name', 'Queue_Name' )
		];
	}
}
