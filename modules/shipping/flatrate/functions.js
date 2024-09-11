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

// Flat Rate Server-side AJAX calls
////////////////////////////////////////////////////

function FlatRateMethodList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'flatrate', 'FlatRateMethodList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function FlatRateMethod_Insert( fieldlist, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'flatrate', 'FlatRateMethod_Insert', null, fieldlist, delegator );
}

function FlatRateMethod_Update( id, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'flatrate', 'FlatRateMethod_Update',
	{
		Method_ID: id
	}, fieldlist, delegator );
}

function FlatRateMethod_Delete( id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'flatrate', 'FlatRateMethod_Delete',
	{
		Method_ID: id
	}, delegator );
}
