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

// MOD10 Card List
////////////////////////////////////////////////////

var MOD10CardList = class extends MMList
{
	constructor()
	{
		super( 'mod10cardlist' );

		if ( CanI( 'PMNT', 0, 0, 1, 0 ) )
		{
			this.Feature_Add_Enable( 'Add Credit Card', 'Save Credit Card' );
			this.Feature_Edit_Enable( 'Edit Credit Card(s)', 'Save Credit Card(s)' );
			this.Feature_Delete_Enable( 'Delete Credit Card(s)' );
		}

		this.SetEmptyListMessage( 'No Credit Cards' );
		this.Feature_Controls_SetSearchPlaceholderText( 'Search Credit Cards...' );
		this.SetDefaultSort( 'name' );
	}

	onLoad( filter, sort, offset, count, callback, delegator )
	{
		MOD10CardList_Load_Query( filter, sort, offset, count, callback, delegator );
	}

	DisplayNoEncryptionWarning()
	{
		this.Feature_Persistent_Filters_Enable( 'mod10cardlist' );
	}

	onCreate()
	{
		return { name: '', prefixes: '', lengths: '' };
	}

	onInsert( item, callback, delegator )
	{
		MOD10Card_Insert( item.record.mmlist_fieldlist, callback, delegator );
	}

	onSave( item, callback, delegator )
	{
		MOD10Card_Update( item.record.id, item.record.mmlist_fieldlist, callback, delegator );
	}

	onDelete( item, callback, delegator )
	{
		MOD10Card_Delete( item.record.id, callback, delegator );
	}

	onCreateRootColumnList()
	{
		return [
			new MMList_Column_Text( 'Credit Card', 'name', 'Name' ),
			new MMList_Column_Text( 'Allowable Prefixes', 'prefixes', 'Prefixes' ),
			new MMList_Column_Text( 'Allowable Lengths', 'lengths', 'Lengths' )
		];
	}
}
