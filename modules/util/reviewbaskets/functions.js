// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2024 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// Review Baskets Server-side AJAX calls
////////////////////////////////////////////////////

function ReviewBaskets_BasketIndex_Load_ID( basket_id, filter, sort, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'reviewbaskets', 'ReviewBaskets_BasketIndex_Load_ID',
	{
		Basket_ID:	basket_id,
		Filter:		filter,
		Sort:		sort
	}, delegator );
}

function ReviewBaskets_BasketList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'reviewbaskets', 'ReviewBaskets_BasketList_Load_Query',
	{
		Filter: filter,
		Sort: 	sort,
		Offset: offset,
		Count: 	count
	}, delegator );
}

function ReviewBaskets_ItemList_Load( basket_id, callback, delegator )
{ 
	return AJAX_Call_Module_JSON( callback, 'admin', 'reviewbaskets', 'ReviewBaskets_ItemList_Load',
	{
		Basket_ID: basket_id
	}, delegator ); 
}

function ReviewBaskets_ChargeList_Load( basket_id, callback, delegator )
{ 
	return AJAX_Call_Module_JSON( callback, 'admin', 'reviewbaskets', 'ReviewBaskets_ChargeList_Load',
	{
		Basket_ID: basket_id
	}, delegator ); 
}

function ReviewBaskets_BasketList_Delete( basket_ids, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'reviewbaskets', 'ReviewBaskets_BasketList_Delete',
	{
		Basket_IDs: basket_ids
	}, delegator );
}

function ReviewBaskets_Delete_All_Baskets( callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'reviewbaskets', 'ReviewBaskets_Basket_Delete_All', {}, delegator );
}

function ReviewBaskets_BasketItem_Add( basket_id, data, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'reviewbaskets', 'ReviewBaskets_BasketItem_Add',								 
	{
		Basket_ID: 			basket_id,
		Code: 				data.code,
		Name: 				data.name,
		SKU: 				data.sku,
		Quantity: 			data.quantity,
		Weight: 			data.weight,
		Price: 				data.price,
		Taxable: 			data.taxable,
		Attributes: 		data.attributes
	}, delegator );
}

function ReviewBaskets_BasketItem_Update( basket_id, line_id, data, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'reviewbaskets', 'ReviewBaskets_BasketItem_Update',
	{
		Basket_ID: 			basket_id,
		Line_ID: 			line_id,
		Code: 				data.code,
		Name: 				data.name,
		SKU: 				data.sku,
		Quantity: 			data.quantity,
		Weight: 			data.weight,
		Price: 				data.price,
		Taxable: 			data.taxable,
		Attributes: 		data.attributes
	}, delegator );
}

function ReviewBaskets_BasketItemList_Delete( basket_id, line_ids, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'reviewbaskets', 'ReviewBaskets_BasketItemList_Delete',
	{
		Basket_ID: 	basket_id,
		Line_IDs: 	line_ids
	}, delegator );
}

function ReviewBaskets_BasketItem_DetermineSKU( code, attributes, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'reviewbaskets', 'ReviewBaskets_BasketItem_DetermineSKU',
	{
		Code: 				code,
		Attributes: 		attributes
	}, delegator );
}

function ReviewBaskets_BasketItem_DetermineVariant( product_code, attributes, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'reviewbaskets', 'ReviewBaskets_BasketItem_DetermineVariant',
	{
		Product_Code: 	product_code,
		Attributes: 	attributes
	}, delegator );
}

function ReviewBaskets_SubscriptionAndBasketItem_Add( basket_id, data, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'reviewbaskets', 'ReviewBaskets_SubscriptionBasketItem_Add',
	{
		Basket_ID: 					basket_id,
		Product_ID: 				data.product_id,
		ProductSubscriptionTerm_ID: data.subterm_id,
		Quantity: 					data.quantity,
		Attributes: 				data.attributes
	}, delegator );
}

function ReviewBaskets_SubscriptionAndBasketItem_Update( basket_id, line_id, data, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'reviewbaskets', 'ReviewBaskets_SubscriptionBasketItem_Update',
	{
		Basket_ID: 					basket_id,
		Line_ID: 					line_id,
		Product_ID: 				data.product_id,
		ProductSubscriptionTerm_ID: data.subterm_id,
		Quantity: 					data.quantity,
		Attributes: 				data.attributes
	}, delegator );
}

function ReviewBaskets_BasketPriceGroupList_Load_Query( basket_id, assigned, unassigned, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'reviewbaskets', 'ReviewBaskets_BasketPriceGroupList_Load_Query',
	{
		Basket_ID: 	basket_id,
		Assigned: 	assigned,
		Unassigned: unassigned,
		Filter: 	filter,
		Sort: 		sort,
		Offset: 	offset,
		Count: 		count
	}, delegator );
}

function ReviewBaskets_BasketPriceGroup_Update_Assigned( basket_id, pgrp_id, assigned, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'reviewbaskets', 'ReviewBaskets_BasketPriceGroup_Update_Assigned',
	{
		Basket_ID: 		basket_id,
		PriceGroup_ID: 	pgrp_id,
		Assigned: 		assigned
	}, delegator );
}

function ReviewBaskets_BasketCouponList_Load_Query( basket_id, assigned, unassigned, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'reviewbaskets', 'ReviewBaskets_BasketCouponList_Load_Query',
	{
		Basket_ID: 	basket_id,
		Assigned: 	assigned,
		Unassigned: unassigned,
		Filter: 	filter,
		Sort: 		sort,
		Offset: 	offset,
		Count: 		count
	}, delegator );
}

function ReviewBaskets_BasketCoupon_Update_Assigned( basket_id, coupon_id, assigned, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'reviewbaskets', 'ReviewBaskets_BasketCoupon_Update_Assigned',
	{
		Basket_ID: basket_id,
		Coupon_ID: coupon_id,
		Assigned: assigned
	}, delegator );
}

function ReviewBaskets_Update_Charges( basket_id, charges, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'reviewbaskets', 'ReviewBaskets_Update_Charges',
	{
		Basket_ID: 	basket_id,
		Charges: 	charges
	}, delegator );
}

function ReviewBaskets_Order_Create( basket_id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'reviewbaskets', 'ReviewBaskets_Order_Create',
	{
		Basket_ID: basket_id
	}, delegator );
}
