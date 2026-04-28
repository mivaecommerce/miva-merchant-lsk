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

// MinUnitMethod List
////////////////////////////////////////////////////

var MinUnitMethodList = class extends MMList
{
	constructor()
	{
		super( 'minunitmethodlist' );

		if ( CanI( 'SHIP', 0, 0, 1, 0 ) )
		{
			this.Feature_Add_Enable( 'Add Method', 'Save Method' );
			this.Feature_Edit_Enable( 'Edit Method(s)', 'Save Method(s)' );
			this.Feature_Delete_Enable( 'Delete Method(s)' );
		}

		this.SetDefaultSort( 'method', '' );
		this.Feature_Controls_SetSearchPlaceholderText( 'Search Methods...' );
	}

	onLoad( filter, sort, offset, count, callback, delegator )
	{
		MinUnitMethodList_Load_Query( filter, sort, offset, count, callback, delegator );
	}

	onCreate()
	{
		return { id: 0, code: '', method: '', rate: '0.00', minimum: '0.00' };
	}

	onInsert( item, callback, delegator )
	{
		MinUnitMethod_Insert( item.record.mmlist_fieldlist, callback, delegator );
	}

	onSave( item, callback, delegator )
	{
		MinUnitMethod_Update( item.record.id, item.record.mmlist_fieldlist, callback, delegator );
	}

	onDelete( item, callback, delegator )
	{
		MinUnitMethod_Delete( item.record.id, callback, delegator );
	}

	onCreateRootColumnList()
	{
		return [
			new MMList_Column_Name(		'Code',					'code',		'MinUnitMethod_Code' ),
			new MMList_Column_Name(		'Method',				'method',	'MinUnitMethod_Method' ),
			new MMList_Column_Numeric(	'Amount / Weight Unit',	'rate',		'MinUnitMethod_Rate',		2 ),
			new MMList_Column_Numeric(	'Minimum Charge',		'minimum',	'MinUnitMethod_Minimum',	2 )
		];
	}
}
