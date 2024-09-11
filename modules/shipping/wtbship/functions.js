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

function WeightTableBasedShippingMethodList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'wtbship', 'WeightTableBasedShippingMethodList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function WeightTableBasedShippingMethod_Insert( fieldlist, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'wtbship', 'WeightTableBasedShippingMethod_Insert', null, fieldlist, delegator );
}

function WeightTableBasedShippingMethod_Update( id, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'wtbship', 'WeightTableBasedShippingMethod_Update',
	{
		Method_ID: id
	}, fieldlist, delegator );
}

function WeightTableBasedShippingMethod_Delete( id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'wtbship', 'WeightTableBasedShippingMethod_Delete',
	{
		Method_ID: id
	}, delegator );
}

function WeightTableBasedShippingBreak_Insert( method_id, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'wtbship', 'WeightTableBasedShippingBreak_Insert',
	{
		Method_ID: method_id
	}, fieldlist, delegator );
}

function WeightTableBasedShippingBreak_Update( break_id, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'wtbship', 'WeightTableBasedShippingBreak_Update',
	{
		Break_ID: break_id
	}, fieldlist, delegator );
}

function WeightTableBasedShippingBreak_Delete( break_id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'wtbship', 'WeightTableBasedShippingBreak_Delete',
	{
		Break_ID: break_id
	}, delegator );
}

function WeightTableBasedShippingChargeList_Load_Query( product_id, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'wtbship', 'WeightTableBasedShippingChargeList_Load_Query',
	{
		Product_ID:	product_id,
		Filter:		filter,
		Sort:		sort,
		Offset:		offset,
		Count:		count
	}, delegator );
}

function WeightTableBasedShippingCharge_Update( product_id, method_id, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'wtbship', 'WeightTableBasedShippingCharge_Update',
	{
		Product_ID: product_id,
		Method_ID:	method_id
	}, fieldlist, delegator );
}
