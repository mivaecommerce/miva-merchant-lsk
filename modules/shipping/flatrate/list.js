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

// Flat Rate List
////////////////////////////////////////////////////

var FlatRateList = class extends MMList
{
	constructor()
	{
		super( 'flatratemethodlist' );

		if ( CanI( 'SHIP', 0, 0, 1, 0 ) )
		{
			this.Feature_Add_Enable( 'Add Shipping Method', 'Save Shipping Method' );
			this.Feature_Edit_Enable( 'Edit Shipping Method(s)', 'Save Shipping Method(s)' );
			this.Feature_Delete_Enable( 'Delete Shipping Method(s)' );
		}

		this.Feature_Controls_SetSearchPlaceholderText( 'Search Methods...' );
		this.SetDefaultSort( 'method', '' );
	}

	onLoad( filter, sort, offset, count, callback, delegator )
	{
		FlatRateMethodList_Load_Query( filter, sort, offset, count, callback, delegator );
	}

	onCreate()
	{
		return { code: '', method: '', cost: 0.00 };
	}

	onInsert( item, callback, delegator )
	{
		FlatRateMethod_Insert( item.record.mmlist_fieldlist, callback, delegator );
	}

	onSave( item, callback, delegator )
	{
		FlatRateMethod_Update( item.record.id, item.record.mmlist_fieldlist, callback, delegator );
	}

	onDelete( item, callback, delegator )
	{
		FlatRateMethod_Delete( item.record.id, callback, delegator );
	}

	onCreateRootColumnList()
	{
		return [
			new MMList_Column_Name( 'Code',			'code',		'Code' ),
			new MMList_Column_Name( 'Method',		'method',	'Method' ),
			new MMList_Column_Currency( 'Amount',	'cost',		'Cost' )
		];
	}
}
