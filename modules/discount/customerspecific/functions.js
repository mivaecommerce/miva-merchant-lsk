// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2019 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

function Product_CustomerPriceList_Load_Query( pgrp_id, product_id, discounted, undiscounted, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'discount_customerspecific', 'Product_CustomerPriceList_Load_Query',
	{
		PriceGroup_ID: 	pgrp_id,
		Product_ID: 	product_id,
		Filter: 		filter,
		Sort: 			sort,
		Offset: 		offset,
		Count: 			count,
		Discounted: 	discounted, 
		Undiscounted: 	undiscounted
	}, delegator );
}

function Customer_ProductPriceList_Load_Query( pgrp_id, customer_id, discounted, undiscounted, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'discount_customerspecific', 'Customer_ProductPriceList_Load_Query',
	{
		PriceGroup_ID: 	pgrp_id,
		Customer_ID: 	customer_id,
		Filter: 		filter,
		Sort: 			sort,
		Offset: 		offset,
		Count: 			count,
		Discounted: 	discounted, 
		Undiscounted: 	undiscounted
	}, delegator );
}

function CustomerSpecificPricing_Update( pgrp_id, customer_id, product_id, price, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'discount_customerspecific', 'CustomerSpecificPricing_Update',
	{
		PriceGroup_ID: 	pgrp_id,
		Customer_ID: 	customer_id,
		Product_ID: 	product_id,
		Price: 			price
	}, delegator );
}

function CustomerSpecificPricing_Delete( pgrp_id, customer_id, product_id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'discount_customerspecific', 'CustomerSpecificPricing_Delete',
	{
		PriceGroup_ID: 	pgrp_id,
		Customer_ID: 	customer_id,
		Product_ID: 	product_id
	}, delegator );
}
