// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2015 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// Generic VAT Server-side AJAX calls
////////////////////////////////////////////////////

function GenericVATList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'admin',
							 'vat',
							 'GenericVATList_Load_Query',
							 'Filter='	+ EncodeArray( filter )			+ 
							 '&Sort='	+ encodeURIComponent( sort )	+ 
							 '&Offset='	+ encodeURIComponent( offset )	+ 
							 '&Count='	+ encodeURIComponent( count ),
							 delegator );
}

function GenericVAT_Update( product_id, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'vat',
									   'GenericVAT_Update',
									   'Product_ID=' + encodeURIComponent( product_id ),
									   fieldlist,
									   delegator );
}
