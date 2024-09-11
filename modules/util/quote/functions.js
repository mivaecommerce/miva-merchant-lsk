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

function QuoteEmailList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'QuoteEmailList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function QuoteEmail_Update_Enabled( code, enabled, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'QuoteEmail_Update_Enabled',
	{
		Edit_Email:	code,
		Enabled:	enabled
	}, delegator );
}

function QuoteEmail_Update( code, email, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'QuoteEmail_Update',
	{
		Edit_Email:		code,
		Email_From:		email.from,
		Email_To:		email.to,
		Email_CC:		email.cc,
		Email_Subject:	email.subject,
		Email_Mime:		email.mime
	}, delegator );
}

function QuoteList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'QuoteList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function QuoteIndex_Load_ID( quote_id, filter, sort, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'QuoteIndex_Load_ID',
	{
		Quote_ID:	quote_id,
		Filter:		filter,
		Sort:		sort
	}, delegator );
}

function Quote_Create_Empty( callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'Quote_Create_Empty', null, delegator );
}

function QuoteItemList_Load( quote_id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'QuoteItemList_Load',
	{
		Quote_ID: quote_id
	}, delegator );
}

function QuoteItem_Add( quote_id, data, callback, delegator )
{	
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'QuoteItem_Add',
	{
		Quote_ID:	quote_id,
		Code:		data.code,
		Name:		data.name,
		SKU:		data.sku,
		Quantity:	data.quantity,
		Price:		data.price,
		Weight:		data.weight,
		Taxable:	data.taxable,
		Attributes:	data.attributes
	}, delegator );
}

function QuoteItem_Update( quote_id, line_id, data, callback, delegator )
{	
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'QuoteItem_Update',
	{
		Quote_ID:	quote_id,
		Line_ID:	line_id,
		Code:		data.code,
		Name:		data.name,
		SKU:		data.sku,
		Quantity:	data.quantity,
		Price:		data.price,
		Weight:		data.weight,
		Taxable:	data.taxable,
		Attributes:	data.attributes
	}, delegator );
}

function QuoteItemList_Delete( quote_id, line_ids, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'QuoteItemList_Delete',
	{
		Quote_ID: quote_id,
		Line_IDs: line_ids
	}, delegator );
}

function Quote_Send( quote_id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'Quote_Send',
	{
		Quote_ID: quote_id
	}, delegator );
}

function Quote_Copy( quote_id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'Quote_Copy',
	{
		Quote_ID: quote_id
	}, delegator );
}

function Quote_Convert( quote_id, cust_id, customer_copy, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'Quote_Convert',
	{
		Quote_ID:		quote_id,
		Customer_ID:	cust_id,
		Customer_Copy:	customer_copy
	}, delegator );
}

function Quote_Delete( quote_id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'Quote_Delete',
	{
		Quote_ID: quote_id
	}, delegator );
}

function Quote_RecalculateDiscounts( quote_id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'Quote_RecalculateDiscounts',
	{
		Quote_ID: quote_id
	}, delegator );
}

function Quote_Update_Requester_Information( id, quote, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'Quote_Update_Requester_Information',
	{
		Quote_ID:				id,
		Customer_ID:			( quote.cust_id ? quote.cust_id : undefined ),
		Requester_FirstName:	quote.fname,
		Requester_LastName:		quote.lname,
		Requester_Phone:		quote.phone,
		Requester_Zip:			quote.zip,
		Requester_Country:		quote.country,
		Requester_Email:		quote.email,
		Requester_Comment:		quote.comment,
		Requester_Terms:		quote.terms
	}, delegator );
}

function Quote_Update_Customer_ID( id, cust_id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'Quote_Update_Customer_ID',
	{
		Quote_ID:		id,
		Customer_ID:	cust_id
	}, delegator );
}

function Quote_Update_Expiry( id, expires, callback, delegator ) 
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'Quote_Update_Expiry',
	{
		Quote_ID:		id,
		Quote_Expires:	expires
	}, delegator );
}

function Quote_Update_Shipping( id, data, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'Quote_Update_Shipping',
	{
		Quote_ID:				id,
		Shipping_Module:		data.ship_mod,
		Shipping_Method:		data.ship_meth,
		Shipping_Description:	data.ship_desc,
		Shipping_Amount:		data.ship_amt
	}, delegator );
}

function Quote_Remove_Shipping( id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'Quote_Remove_Shipping',
	{
		Quote_ID: id
	}, delegator );
}

function ShippingMethodList_Load_Quote( id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'ShippingMethodList_Load_Quote',
	{
		Quote_ID: id
	}, delegator );
}

function Quote_Load_ID( quote_id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'Quote_Load_ID',
	{
		Quote_ID: quote_id
	}, delegator );
}

function QuoteCustomFieldList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'QuoteCustomFieldList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function QuoteCustomField_Insert( fields, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'quote', 'QuoteCustomField_Insert', null, fields, delegator );
}

function QuoteCustomField_Update( id, fields, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'quote', 'QuoteCustomField_Update',
	{
		Quote_CustomField_ID: id
	}, fields, delegator );
}

function QuoteCustomField_Delete( id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'QuoteCustomField_Delete',
	{
		Quote_CustomField_ID: id
	}, delegator );
}

function QuoteCustomField_DisplayOrder_Update( fieldlist, callback, delegator )
{
	return AJAX_Call_Module_FieldList( callback, 'admin', 'quote', 'QuoteCustomField_DisplayOrder_Update', '', fieldlist, delegator );
}

function QuoteCustomFieldOption_Insert( field_id, fields, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'quote', 'QuoteCustomFieldOption_Insert',
	{
		Quote_CustomField_ID: field_id
	}, fields, delegator );
}

function QuoteCustomFieldOption_Update( id, fields, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'quote', 'QuoteCustomFieldOption_Update',
	{
		Quote_CustomFieldOption_ID: id
	}, fields, delegator );
}

function QuoteCustomFieldOption_Delete( id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'QuoteCustomFieldOption_Delete',
	{
		Quote_CustomFieldOption_ID: id
	}, delegator );
}

function QuoteCustomFieldOption_Set_Default( id, is_default, callback )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'QuoteCustomFieldOption_Set_Default',
	{
		Quote_CustomFieldOption_ID: id,
		Is_Default:					is_default
	} );
}

function QuoteCustomFieldAndValueList_Load_Quote( quote_id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'QuoteCustomFieldAndValueList_Load_Quote',
	{
		Quote_ID: quote_id
	}, delegator );
}

function QuoteCustomFieldValues_Update_Quote( id, fields, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'QuoteCustomFieldValues_Update_Quote',
	{
		Quote_ID:			id,
		Quote_CustomFields:	fields
	}, delegator );
}

function QuoteNoteList_Load_Query( quote_id, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'QuoteNoteList_Load_Query',
	{
		Quote_ID:	quote_id,
		Filter:		filter,
		Sort:		sort,
		Offset:		offset,
		Count:		count
	}, delegator );
}

function QuoteNote_Insert( quote_id, content, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'QuoteNote_Insert',
	{
		Quote_ID:	quote_id,
		Content:	content
	}, delegator );
}

function QuoteNote_Update( id, content, callback, delegator ) 
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'QuoteNote_Update',
	{
		Note_ID: id,
		Content: content
	}, delegator );
}

function QuoteNoteList_Delete( note_ids, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'QuoteNoteList_Delete',
	{
		Note_IDs: note_ids
	}, delegator );
}

function QuoteNote_Update_Public( id, public, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'quote', 'QuoteNote_Update_Public',
	{
		Note_ID:	id,
		Public:		public
	}, delegator );
}

function Runtime_QuoteNote_Insert( quote_id, cust_id, content, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'runtime', 'quote', 'Runtime_QuoteNote_Insert',
	{
		Quote_ID:	quote_id,
		Content:	content
	}, delegator );
}
