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

// European VAT Server-side AJAX calls
////////////////////////////////////////////////////

function EuropeanVATRateList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'admin',
							 'devat',
							 'EuropeanVATRateList_Load_Query',
							 'Filter='	+ EncodeArray( filter )			+ 
							 '&Sort='	+ encodeURIComponent( sort )	+ 
							 '&Offset='	+ encodeURIComponent( offset )	+ 
							 '&Count='	+ encodeURIComponent( count ),
							 delegator );
}

function EuropeanVATRate_Insert( fieldlist, callback, delegator )
{
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'devat',
									   'EuropeanVATRate_Insert',
									   '',
									   fieldlist,
									   delegator );
}

function EuropeanVATRate_Update( id, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'devat',
									   'EuropeanVATRate_Update',
									   'Rate_ID=' + encodeURIComponent( id ),
									   fieldlist,
									   delegator );
}

function EuropeanVATRate_Delete( id, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'admin',
							 'devat',
							 'EuropeanVATRate_Delete',
							 'Rate_ID=' + encodeURIComponent( id ),
							 delegator );
}

function EuropeanVATCountryList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'admin',
							 'devat',
							 'EuropeanVATCountryList_Load_Query',
							 'Filter='	+ EncodeArray( filter )			+ 
							 '&Sort='	+ encodeURIComponent( sort )	+ 
							 '&Offset='	+ encodeURIComponent( offset )	+ 
							 '&Count='	+ encodeURIComponent( count ),
							 delegator );
}

function EuropeanVATCountry_Insert( fieldlist, callback, delegator )
{
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'devat',
									   'EuropeanVATCountry_Insert',
									   '',
									   fieldlist,
									   delegator );
}

function EuropeanVATCountry_Delete( alpha, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'admin',
							 'devat',
							 'EuropeanVATCountry_Delete',
							 'Alpha=' + encodeURIComponent( alpha ),
							 delegator );
}
