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

// MOD10 Server-side AJAX calls
////////////////////////////////////////////////////

function MOD10CardList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'admin',
							 'mod10',
							 'MOD10CardList_Load_Query',
							 'Filter='	+ EncodeArray( filter )			+
							 '&Sort='	+ encodeURIComponent( sort )	+
							 '&Offset='	+ encodeURIComponent( offset )	+
							 '&Count='	+ encodeURIComponent( count ),
							 delegator );
}

function MOD10Card_Insert( fieldlist, callback, delegator )
{
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'mod10',
									   'MOD10Card_Insert',
									   '',
									   fieldlist,
									   delegator );
}

function MOD10Card_Update( id, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'mod10',
									   'MOD10Card_Update',
									   'MOD10Card_ID=' + encodeURIComponent( id ),
									   fieldlist,
									   delegator );
}

function MOD10Card_Delete( id, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'admin',
							 'mod10',
							 'MOD10Card_Delete',
							 'MOD10Card_ID=' + encodeURIComponent( id ),
							 delegator );
}
