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

function CombinationFacetAndFieldList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'combofacets', 'CombinationFacetAndFieldList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function CombinationFacet_Insert( fieldlist, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'combofacets', 'CombinationFacet_Insert',
											null,
											fieldlist,
											delegator );
}

function CombinationFacet_Update( facet_id, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_JSON_FieldList( callback, 'admin', 'combofacets', 'CombinationFacet_Update',
	{
		CombinationFacet_ID: facet_id
	}, fieldlist, delegator );
}

function CombinationFacet_Update_Enabled( facet_id, enabled, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'admin',
							 'combofacets',
							 'CombinationFacet_Update_Enabled',
							 'CombinationFacet_ID='	+ encodeURIComponent( facet_id ) +
							 '&Enabled='			+ ( enabled ? 1 : 0 ),
							 delegator );
}

function CombinationFacet_Update_IncludeOtherProducts( facet_id, inclother, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'admin',
							 'combofacets',
							 'CombinationFacet_Update_IncludeOtherProducts',
							 'CombinationFacet_ID='		+ encodeURIComponent( facet_id ) +
							 '&IncludeOtherProducts='	+ ( inclother ? 1 : 0 ),
							 delegator );
}

function CombinationFacet_Update_CreateFitmentIndicator( facet_id, createfit, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'combofacets', 'CombinationFacet_Update_CreateFitmentIndicator',
	{
		CombinationFacet_ID:	facet_id,
		CreateFitmentIndicator:	createfit
	}, delegator );
}

function CombinationFacet_Delete( facet_id, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'admin',
							 'combofacets',
							 'CombinationFacet_Delete',
						     'CombinationFacet_ID=' + encodeURIComponent( facet_id ),
							 delegator );
}

function CombinationFacetList_DisplayOrder_Update( fieldlist, callback, delegator )
{
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'combofacets',
									   'CombinationFacetList_DisplayOrder_Update',
									   '',
									   fieldlist,
									   delegator );
}
		
function CombinationFacetField_Insert( facet_id, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'combofacets',
									   'CombinationFacetField_Insert',
									   'CombinationFacet_ID=' + encodeURIComponent( facet_id ),
									   fieldlist,
									   delegator );
}

function CombinationFacetField_Update( field_id, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'combofacets',
									   'CombinationFacetField_Update',
									   'CombinationFacetField_ID=' + encodeURIComponent( field_id ),
									   fieldlist,
									   delegator );
}

function CombinationFacetField_Delete( field_id, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'admin',
							 'combofacets',
							 'CombinationFacetField_Delete',
							 'CombinationFacetField_ID=' + encodeURIComponent( field_id ),
							 delegator );
}

function CombinationFacetRecordList_Load_Query( product_id, facet_id, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'admin',
							 'combofacets',
							 'CombinationFacetRecordList_Load_Query',
							 'Product_ID='				+ encodeURIComponent( product_id )	+
							 '&CombinationFacet_ID='	+ encodeURIComponent( facet_id )	+
							 '&Filter='					+ EncodeArray( filter )				+
							 '&Sort='					+ encodeURIComponent( sort )		+
							 '&Offset='					+ encodeURIComponent( offset )		+
							 '&Count='					+ encodeURIComponent( count ),
							 delegator );
} 

function CombinationFacetRecord_Insert( product_id, facet_id, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'combofacets',
									   'CombinationFacetRecord_Insert',
									   'Product_ID='			+ encodeURIComponent( product_id ) +
									   '&CombinationFacet_ID='	+ encodeURIComponent( facet_id ),
									   fieldlist,
									   delegator );
}

function CombinationFacetRecord_Update( record_id, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'combofacets',
									   'CombinationFacetRecord_Update',
									   'CombinationFacetRecord_ID=' + encodeURIComponent( record_id ),
									   fieldlist,
									   delegator );
}

function CombinationFacetRecord_Delete( record_id, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'admin',
							 'combofacets',
							 'CombinationFacetRecord_Delete',
							 'CombinationFacetRecord_ID=' + encodeURIComponent( record_id ),
							 delegator );
}

function CombinationFacetApplicationList_Load_Query( facet_id, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'combofacets', 'CombinationFacetApplicationList_Load_Query',
	{
		CombinationFacet_ID:	facet_id,
		Filter: 				filter,
		Sort: 					sort,
		Offset: 				offset,
		Count: 					count
	}, delegator );
}

function CombinationFacetCustomerApplicationList_Load_Query( cust_id, facet_id, filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'combofacets', 'CombinationFacetCustomerApplicationList_Load_Query',
	{
		Customer_ID:			cust_id,
		CombinationFacet_ID:	facet_id,
		Filter: 				filter,
		Sort: 					sort,
		Offset: 				offset,
		Count: 					count
	}, delegator );
}