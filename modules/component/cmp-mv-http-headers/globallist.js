// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2023 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// Global HTTP Header List
////////////////////////////////////////////////////

var GlobalHTTPHeaderList = class extends BaseHTTPHeaderList
{
	constructor()
	{
		super( 'mm_globalhttpheaderlist' );

		if ( CanI( 'PAGE', 0, 0, 1, 0 ) )
		{
			this.Feature_Add_Enable( 'Add HTTP Header', 'Save HTTP Header' );
			this.Feature_Edit_Enable( 'Edit HTTP Header(s)', 'Save HTTP Header(s)' );
			this.Feature_Delete_Enable( 'Delete HTTP Header(s)' );
		}
	}

	onLoad( filter, sort, offset, count, callback, delegator )
	{
		GlobalHTTPHeaderList_Load_Query( filter, sort, offset, count, callback, delegator );
	}

	onInsert( item, callback, delegator )
	{
		GlobalHTTPHeader_Insert( item.record.mmlist_fieldlist, callback, delegator );
	}

	onSave( item, callback, delegator )
	{
		GlobalHTTPHeader_Update( item.original_record.name, item.original_record.value, item.record.mmlist_fieldlist, callback, delegator );
	}

	onDelete( item, callback, delegator )
	{
		GlobalHTTPHeader_Delete( item.record.name, item.record.value, callback, delegator );
	}
}