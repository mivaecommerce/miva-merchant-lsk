// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2021 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// Customer Quote List Detail Overlay
////////////////////////////////////////////////////

function Customer_QuoteListDetailOverlay( customer )
{
	QuoteListDetailOverlay.call( this );

	this.overlay_list.OnSearch_GetFilter_AddHook( function() { return [ new MMList_Filter_Search( new MMList_Filter_Search_Value( 'cust_id', 'EQ', customer.id ) ) ]; } );
}

DeriveFrom( QuoteListDetailOverlay, Customer_QuoteListDetailOverlay );