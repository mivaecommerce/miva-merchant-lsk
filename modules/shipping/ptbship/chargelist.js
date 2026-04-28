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

// Price Table Based Shipping Charge List
////////////////////////////////////////////////////

var PriceTableBasedShippingChargeList = class extends MMList
{
	#product_id;

	constructor( product_id )
	{
		super( 'pricetablebasedshippingchargelist' );

		this.#product_id = product_id;

		if ( CanI( 'PROD', 0, 0, 1, 0 ) )
		{
			this.Feature_Edit_Enable( 'Edit Shipping Charge(s)', 'Save Shipping Charge(s)' );
		}

		this.Feature_Controls_SetSearchPlaceholderText( 'Search Shipping Charges...' );
		this.SetDefaultSort( 'method' );
	}

	onLoad( filter, sort, offset, count, callback, delegator )
	{
		PriceTableBasedShippingChargeList_Load_Query( this.#product_id, filter, sort, offset, count, callback, delegator );
	}

	onSave( item, callback, delegator )
	{
		PriceTableBasedShippingCharge_Update( this.#product_id, item.record.method_id, item.record.mmlist_fieldlist, callback, delegator );
	}

	onCreateRootColumnList()
	{
		return [
			new MMList_Column_Text( 'Code', 'code', '' )
				.SetOnDisplayEdit( ( record ) => DrawMMListString_Data( record.code ) ),
			new MMList_Column_Text( 'Method', 'method', '' )
				.SetOnDisplayEdit( ( record ) => DrawMMListString_Data( record.method ) ),
			new MMList_Column_Numeric( 'Charge', 'rate', 'Rate', 2 )
				.SetSearchable( false )
		];
	}
}
