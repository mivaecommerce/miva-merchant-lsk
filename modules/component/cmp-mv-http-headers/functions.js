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

// HTTP Headers Server-side AJAX calls
////////////////////////////////////////////////////

function GlobalHTTPHeaderList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'cmp-mv-http-headers', 'GlobalHTTPHeaderList_Load_Query',
	{
		Filter:		filter,
		Sort:		sort,
		Offset:		offset,
		Count:		count
	}, delegator );
}

function GlobalHTTPHeader_Insert( fieldlist, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'cmp-mv-http-headers', 'GlobalHTTPHeader_Insert', null, fieldlist, delegator );
}

function GlobalHTTPHeader_Update( edit_name, edit_value, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'cmp-mv-http-headers', 'GlobalHTTPHeader_Update',
	{
		Edit_Name:	edit_name,
		Edit_Value:	edit_value
	}, fieldlist, delegator );
}

function GlobalHTTPHeader_Delete( name, value, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'cmp-mv-http-headers', 'GlobalHTTPHeader_Delete',
	{
		Edit_Name:	name,
		Edit_Value:	value
	}, delegator );
}

function PageHTTPHeaderList_Load_Query( page_id, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'cmp-mv-http-headers', 'PageHTTPHeaderList_Load_Query',
	{
		Page_ID:	page_id,
		Filter:		filter,
		Sort:		sort,
		Offset:		offset,
		Count:		count
	}, delegator );
}

function PageHTTPHeader_Insert( page_id, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'cmp-mv-http-headers', 'PageHTTPHeader_Insert',
	{
		Page_ID: page_id
	}, fieldlist, delegator );
}

function PageHTTPHeader_Update( page_id, edit_name, edit_value, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'cmp-mv-http-headers', 'PageHTTPHeader_Update',
	{
		Page_ID:	page_id,
		Edit_Name:	edit_name,
		Edit_Value:	edit_value
	}, fieldlist, delegator );
}

function PageHTTPHeader_Delete( page_id, name, value, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'cmp-mv-http-headers', 'PageHTTPHeader_Delete',
	{
		Page_ID:	page_id,
		Edit_Name:	name,
		Edit_Value:	value
	}, delegator );
}