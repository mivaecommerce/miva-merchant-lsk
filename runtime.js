// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2025 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// Runtime AJAX Calls
////////////////////////////////////////////////////

function Runtime_AttributeAndOptionList_Load_Product( product_code, callback )				{ return AJAX_Call( callback, 'runtime', 'Runtime_AttributeAndOptionList_Load_Product',	'Product_Code=' + encodeURIComponent( product_code ) ); }
function Runtime_AttributeList_Load_ProductVariant_Possible( product_code, dependency_resolution,
															 last_selected_attr_id, last_selected_attmpat_id, last_selected_option_id,
															 selected_attr_ids, selected_attmpat_ids, selected_option_ids, selected_attr_types,
															 unselected_attr_ids, unselected_attmpat_ids,
															 callback )						{ return AJAX_Call( callback, 'runtime', 'Runtime_AttributeList_Load_ProductVariant_Possible',
																																													'Product_Code=' + encodeURIComponent( product_code ) +
																																													'&Dependency_Resolution=' + encodeURIComponent( dependency_resolution ) +
																																													'&Last_Selected_Attribute_ID=' + encodeURIComponent( last_selected_attr_id ) + '&Last_Selected_AttributeTemplateAttribute_ID=' + encodeURIComponent( last_selected_attmpat_id ) + '&Last_Selected_Option_ID=' + encodeURIComponent( last_selected_option_id ) +
																																													'&Selected_Attribute_IDs=' + EncodeArray( selected_attr_ids ) +
																																													'&Selected_AttributeTemplateAttribute_IDs=' + EncodeArray( selected_attmpat_ids ) +
																																													'&Selected_Option_IDs=' + EncodeArray( selected_option_ids ) +
																																													'&Selected_Attribute_Types=' + EncodeArray( selected_attr_types ) +
																																													'&Unselected_Attribute_IDs=' + EncodeArray( unselected_attr_ids ) +
																																													'&Unselected_AttributeTemplateAttribute_IDs=' + EncodeArray( unselected_attmpat_ids ) ); }
function Runtime_AttributeList_Load_ProductVariant_Possible_PredictDiscounts( product_code, dependency_resolution,
																			  last_selected_attr_id, last_selected_attmpat_id, last_selected_option_id,
																			  selected_attr_ids, selected_attmpat_ids, selected_option_ids, selected_attr_types,
																			  unselected_attr_ids, unselected_attmpat_ids,
																			  callback )
{
	var data;

	data							= new Object();
	data.product_code				= product_code;
	data.dependency_resolution		= dependency_resolution;
	data.predictdiscounts			= 0;
	data.last_selected_attr_id		= last_selected_attr_id;
	data.last_selected_attmpat_id	= last_selected_attmpat_id;
	data.last_selected_option_id	= last_selected_option_id;
	data.selected_term_id			= 0;
	data.selected_attr_ids			= selected_attr_ids;
	data.selected_attmpat_ids		= selected_attmpat_ids;
	data.selected_option_ids		= selected_option_ids;
	data.selected_attr_types		= selected_attr_types;
	data.unselected_attr_ids		= unselected_attr_ids;
	data.unselected_attmpat_ids		= unselected_attmpat_ids;

	return v96_Runtime_AttributeList_Load_ProductVariant_Possible_PredictDiscounts( data, callback );
}

function v96_Runtime_AttributeList_Load_ProductVariant_Possible_PredictDiscounts( data, callback )	{ return AJAX_Call( callback, 'runtime', 'Runtime_AttributeList_Load_ProductVariant_Possible',
																																													'Product_Code=' + encodeURIComponent( data.product_code ) +
																																													'&Dependency_Resolution=' + encodeURIComponent( data.dependency_resolution ) +
																																													'&Predict_Discounts=' + ( data.predictdiscounts ? '1' : '0' ) + 
																																													'&Calculate_Sale_Price=' + ( data.calculate_sale_price ? '1' : '0' ) + 
																																													'&Last_Selected_Attribute_ID=' + encodeURIComponent( data.last_selected_attr_id ) + '&Last_Selected_AttributeTemplateAttribute_ID=' + encodeURIComponent( data.last_selected_attmpat_id ) + '&Last_Selected_Option_ID=' + encodeURIComponent( data.last_selected_option_id ) +
																																													'&Selected_Term_ID=' + encodeURIComponent( data.selected_term_id ) +
																																													'&Selected_Attribute_IDs=' + EncodeArray( data.selected_attr_ids ) +
																																													'&Selected_AttributeTemplateAttribute_IDs=' + EncodeArray( data.selected_attmpat_ids ) +
																																													'&Selected_Option_IDs=' + EncodeArray( data.selected_option_ids ) +
																																													'&Selected_Attribute_Types=' + EncodeArray( data.selected_attr_types ) +
																																													'&Unselected_Attribute_IDs=' + EncodeArray( data.unselected_attr_ids ) +
																																													'&Unselected_AttributeTemplateAttribute_IDs=' + EncodeArray( data.unselected_attmpat_ids ) ); }
function Runtime_ProductVariant_Load_Attributes( product_code,
												 attr_ids, attmpat_ids, option_ids,
												 callback )									{ return AJAX_Call( callback, 'runtime', 'Runtime_ProductVariant_Load_Attributes',
																																													'Product_Code=' + encodeURIComponent( product_code ) +
																																													'&Attribute_IDs=' + EncodeArray( attr_ids ) +
																																													'&AttributeTemplateAttribute_IDs=' + EncodeArray( attmpat_ids ) +
																																													'&Option_IDs=' + EncodeArray( option_ids ) ); }

function Runtime_ProductImageList_Load_Product_Variant( product_code, variant_id,
														image_sizes, callback )				{ return AJAX_Call( callback, 'runtime', 'Runtime_ProductImageList_Load_Product_Variant',				
																																													'Product_Code=' + encodeURIComponent( product_code ) +
																																													'&Variant_ID=' + encodeURIComponent( variant_id ) +
																																													'&Image_Sizes=' + EncodeArray( image_sizes ) ); }

function Runtime_BasketItem_Insert( data, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'runtime', 'Runtime_BasketItem_Insert',
	{
		Product_ID:				data.product_id ?? undefined,
		Product_Code:			data.product_code ?? undefined,
		Quantity:				data.quantity,
		Subscription_Term_ID:	data.subterm_id,
		Attributes:				data.attributes
	}, delegator );
}

function Runtime_BasketItemList_Insert( products, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'runtime', 'Runtime_BasketItemList_Insert',
	{
		Products: products
	}, delegator );
}

function Runtime_BasketItem_Update( line_id, data, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'runtime', 'Runtime_BasketItem_Update',
	{
		Line_ID:				line_id,
		Quantity:				data.quantity,
		Subscription_Term_ID:	data.subterm_id,
		Attributes:				data.attributes
	}, delegator );
}

function Runtime_BasketGroup_Update( group_id, data, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'runtime', 'Runtime_BasketItem_Update',
	{
		Group_ID:				group_id,
		Quantity:				data.quantity,
		Subscription_Term_ID:	data.subterm_id,
		Attributes:				data.attributes
	}, delegator );
}

function Runtime_BasketItem_Delete( line_id, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'runtime', 'Runtime_BasketItem_Delete',
	{
		Line_ID: line_id
	}, delegator );
}

function Runtime_BasketGroup_Delete( group_id, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'runtime', 'Runtime_BasketItem_Delete',
	{
		Group_ID: group_id
	}, delegator );
}

function Runtime_Customer_Login( data, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'runtime', 'Runtime_Customer_Login',
	{
		Customer_LoginEmail:	data.email,
		Customer_Login:			data.login,
		Customer_Password:		data.password
	}, delegator );
}

function Runtime_WishList_Insert( data, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'runtime', 'Runtime_WishList_Insert',
	{
		WishList_Title:		data.title,
		WishList_Notes:		data.notes,
		WishList_Shared:	data.shared
	}, delegator );
}

function Runtime_WishListItemList_Insert( data, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'runtime', 'Runtime_WishListItemList_Insert',
	{
		WishList_ID:	data.wishlist_id,
		Products:		data.products
	}, delegator );
}

function Runtime_WishListItem_Delete( wish_id, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'runtime', 'Runtime_WishListItem_Delete',
	{
		Wish_ID: wish_id
	}, delegator );
}

function Runtime_BasketItemList_MoveToWishlist( data, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'runtime', 'Runtime_BasketItemList_MoveToWishlist',
	{
		WishList_ID:	data.wishlist_id,
		MoveAll:		data.moveall,
		Line_IDs:		data.line_ids,
		Group_IDs:		data.group_ids
	}, delegator );
}

function Runtime_WishListList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'runtime', 'Runtime_WishListList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function Runtime_WishListItemList_Load_Query( wishlist_id, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'runtime', 'Runtime_WishListItemList_Load_Query',
	{
		WishList_ID:	wishlist_id,
		Filter:			filter,
		Sort:			sort,
		Offset:			offset,
		Count:			count
	}, delegator );
}

function Runtime_ShippingMethodList_Load( callback, delegator )
{
	return AJAX_Call_JSON( callback, 'runtime', 'Runtime_ShippingMethodList_Load', null, delegator );
}

function Runtime_PaymentMethodList_Load( callback, delegator )
{
	return AJAX_Call_JSON( callback, 'runtime', 'Runtime_PaymentMethodList_Load', null, delegator );
}

function Runtime_CalculateCharges( shipping_method, payment_method, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'runtime', 'Runtime_CalculateCharges',
	{
		ShippingMethod:	shipping_method,
		PaymentMethod:	payment_method
	}, delegator );
}

function Runtime_ValidateAddress( data, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'runtime', 'Runtime_ValidateAddress',
	{
		Company:		data.comp,
		Address1:		data.addr1,
		Address2:		data.addr2,
		City:			data.city,
		State:			data.state,
		Zip:			data.zip,
		Country:		data.country,
		Residential:	data.resdntl
	}, delegator );
}

function Runtime_InitiateCheckout( callback, delegator )
{
	return AJAX_Call_JSON( callback, 'runtime', 'Runtime_InitiateCheckout', null, delegator );
}

function Runtime_UpdateShipping( data, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'runtime', 'Runtime_UpdateShipping',
	{
		FirstName:			data.fname,
		LastName:			data.lname,
		Email:				data.email,
		Phone:				data.phone,
		Fax:				data.fax,
		Company:			data.comp,
		Address1:			data.addr1,
		Address2:			data.addr2,
		City:				data.city,
		State:				data.state,
		Zip:				data.zip,
		Country:			data.country,
		Residential:		data.resdntl,
		Update_Customer:	data.update_customer
	}, delegator );
}

function Runtime_UpdateBilling( data, callback, delegator )
{
	return AJAX_Call_JSON( callback, 'runtime', 'Runtime_UpdateBilling',
	{
		FirstName:			data.fname,
		LastName:			data.lname,
		Email:				data.email,
		Phone:				data.phone,
		Fax:				data.fax,
		Company:			data.comp,
		Address1:			data.addr1,
		Address2:			data.addr2,
		City:				data.city,
		State:				data.state,
		Zip:				data.zip,
		Country:			data.country,
		Residential:		data.resdntl,
		Update_Customer:	data.update_customer
	}, delegator );
}
