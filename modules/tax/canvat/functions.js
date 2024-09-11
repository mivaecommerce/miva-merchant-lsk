// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2015 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// Shop Tax Server-side AJAX calls
////////////////////////////////////////////////////

function CanVatList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'canvat', 'CanVatList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function CanVat_Insert( data, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'canvat', 'CanVat_Insert',
	{
		CanVat_Province:	data.name,
		CanVat_Type:		data.type,
		CanVat_HST:			data.hst,
		CanVat_PST:			data.pst,
		CanVat_TaxShipping:	data.tax_ship,
		CanVat_TaxGST:		data.tax_gst
	}, delegator );
}

function CanVat_Update( data, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'canvat', 'CanVat_Update',
	{
		CanVat_ID:			data.id,
		CanVat_Province:	data.name,
		CanVat_Type:		data.type,
		CanVat_HST:			data.hst,
		CanVat_PST:			data.pst,
		CanVat_TaxShipping:	data.tax_ship,
		CanVat_TaxGST:		data.tax_gst
	}, delegator );
}

function CanVat_Delete( id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'canvat', 'CanVat_Delete',
	{
		CanVat_ID: id
	}, delegator );
}

function CanVat_Update_TaxShipping( id, checked, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'canvat', 'CanVat_Update_TaxShipping',
	{
		CanVat_ID: id,
		CanVat_TaxShipping: checked
	}, delegator );
}

function CanVat_Update_TaxGST( id, checked, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'canvat', 'CanVat_Update_TaxGST',
	{
		CanVat_ID: id,
		CanVat_TaxGST: checked
	}, delegator );
}
