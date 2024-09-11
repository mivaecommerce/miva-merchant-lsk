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

// Base HTTP Header List
////////////////////////////////////////////////////

var BaseHTTPHeaderList = class extends MMList
{
	constructor( parent_id )
	{
		super( parent_id );

		this.SetEmptyListMessage( 'No HTTP Headers' );
		this.Feature_Controls_SetSearchPlaceholderText( 'Search HTTP Headers...' );
		this.SetDefaultSort( 'header' );
	}

	onCreateRootColumnList()
	{
		const columnlist =
		[
			new MMList_Column_Text( 'Header', 'name', 'Name' ),
			new MMList_Column_Text( 'Value', 'value', 'Value' )
		];

		return columnlist;
	}

	onCreate()
	{
		return {
			name:	'',
			value:	''
		};
	}
}