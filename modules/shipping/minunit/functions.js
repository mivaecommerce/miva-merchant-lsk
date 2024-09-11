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

function MinUnitMethodList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'minunit', 'MinUnitMethodList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function MinUnitMethod_Insert( fieldlist, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'minunit', 'MinUnitMethod_Insert', null, fieldlist, delegator );
}

function MinUnitMethod_Update( id, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'minunit', 'MinUnitMethod_Update',
	{
		MinUnitMethod_ID: id
	}, fieldlist, delegator );
}

function MinUnitMethod_Delete( id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'minunit', 'MinUnitMethod_Delete',
	{
		MinUnitMethod_ID: id
	}, delegator );
}
