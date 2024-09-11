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

function QuantityBasedShippingMethodList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'qship', 'QuantityBasedShippingMethodList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function QuantityBasedShippingMethod_Insert( fieldlist, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'qship', 'QuantityBasedShippingMethod_Insert', null, fieldlist, delegator );
}

function QuantityBasedShippingMethod_Update( id, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'qship', 'QuantityBasedShippingMethod_Update',
	{
		Method_ID: id
	}, fieldlist, delegator );
}

function QuantityBasedShippingMethod_Delete( id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'qship', 'QuantityBasedShippingMethod_Delete',
	{
		Method_ID: id
	}, delegator );
}

function QuantityBasedShippingQuantity_Insert( method_id, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'qship', 'QuantityBasedShippingQuantity_Insert',
	{
		Method_ID: method_id
	}, fieldlist, delegator );
}

function QuantityBasedShippingQuantity_Update( id, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'qship', 'QuantityBasedShippingQuantity_Update',
	{
		Quantity_ID: id
	}, fieldlist, delegator );
}

function QuantityBasedShippingQuantity_Delete( id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'qship', 'QuantityBasedShippingQuantity_Delete',
	{
		Quantity_ID: id
	}, delegator );
}
