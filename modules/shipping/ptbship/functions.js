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

function PriceTableBasedShippingMethodList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'ptbship', 'PriceTableBasedShippingMethodList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function PriceTableBasedShippingMethod_Insert( fieldlist, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'ptbship', 'PriceTableBasedShippingMethod_Insert', null, fieldlist, delegator );
}

function PriceTableBasedShippingMethod_Update( id, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'ptbship', 'PriceTableBasedShippingMethod_Update',
	{
		Method_ID: id
	}, fieldlist, delegator );
}

function PriceTableBasedShippingMethod_Delete( id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'ptbship', 'PriceTableBasedShippingMethod_Delete',
	{
		Method_ID: id
	}, delegator );
}

function PriceTableBasedShippingBreak_Insert( method_id, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'ptbship', 'PriceTableBasedShippingBreak_Insert',
	{
		Method_ID: method_id
	}, fieldlist, delegator );
}

function PriceTableBasedShippingBreak_Update( break_id, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'ptbship', 'PriceTableBasedShippingBreak_Update',
	{
		Break_ID: break_id
	}, fieldlist, delegator );
}

function PriceTableBasedShippingBreak_Delete( break_id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'ptbship', 'PriceTableBasedShippingBreak_Delete',
	{
		Break_ID: break_id
	}, delegator );
}

function PriceTableBasedShippingChargeList_Load_Query( product_id, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'ptbship', 'PriceTableBasedShippingChargeList_Load_Query',
	{
		Product_ID:	product_id,
		Filter:		filter,
		Sort:		sort,
		Offset:		offset,
		Count:		count
	}, delegator );
}

function PriceTableBasedShippingCharge_Update( product_id, method_id, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'ptbship', 'PriceTableBasedShippingCharge_Update',
	{
		Product_ID: product_id,
		Method_ID:	method_id
	}, fieldlist, delegator );
}
