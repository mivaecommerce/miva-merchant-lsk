// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2020 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// State Tax Server-side AJAX calls
////////////////////////////////////////////////////

function StateTaxStateList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'statetax', 'StateTaxStateList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function StateTaxState_Insert( fieldlist, callback, delegator )
{
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'statetax',
									   'StateTaxState_Insert',
									   '',
									   fieldlist,
									   delegator );
}

function StateTaxState_Update( id, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'statetax',
									   'StateTaxState_Update',
									   'StateTax_ID=' + encodeURIComponent( id ),
									   fieldlist,
									   delegator );
}

function StateTaxState_Delete( id, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'admin',
							 'statetax',
							 'StateTaxState_Delete',
							 'StateTax_ID=' + encodeURIComponent( id ),
							 delegator );
}

function StateTaxState_Update_TaxShipping( id, checked, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'admin',
							 'statetax',
							 'StateTaxState_Update_TaxShipping',
							 'StateTax_ID=' 	+ encodeURIComponent( id ) +
							 '&Tax_Shipping=' 	+ ( checked ? 1 : 0 ),
							 delegator );
}
