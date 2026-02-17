// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2026 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// Custom Field Functions

function CustomFieldList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module( 	callback,
								'admin',
								'customfields',
								'CustomFieldList_Load_Query',
								'Filter='	+ EncodeArray( filter ) 		+
								'&Sort=' 	+ encodeURIComponent( sort ) 	+
								'&Offset=' 	+ encodeURIComponent( offset ) 	+
								'&Count=' 	+ encodeURIComponent( count ),
								delegator );
} 

function CustomField_Insert( data, callback ) 
{ 
	return AJAX_Call_Module_JSON( callback, 'admin', 'customfields', 'CustomField_Insert',
	{
		Type:			data.type,
		Code:			data.code,
		Name:			data.name,
		Facet:			data.facet,
		Separate:		data.separate,
		Field_Type:		data.fieldtype,
		Info:			data.info,
		Group_ID:		data.group_id,
		Is_Public:		data.is_public,
		Option_Values:	data.option_values
	} );
}

function CustomField_Update( id, data, callback ) 
{ 
	return AJAX_Call_Module_JSON( callback, 'admin', 'customfields', 'CustomField_Update',
	{
		Field_ID:		id,
		Type:			data.type,
		Code:			data.code,
		Name:			data.name,
		Facet:			data.facet,
		Separate:		data.separate,
		Field_Type:		data.fieldtype,
		Info:			data.info,
		Group_ID:		data.group_id,
		Is_Public:		data.is_public,
		Option_Values:	data.option_values
	} );
}

function CustomField_Delete( id, type, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'customfields', 'CustomField_Delete',
	{
		Field_ID:	id,
		Type:		type,
	}, delegator );
}

// Custom Field Group Functions

function CustomFieldGroupList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module( 	callback,
								'admin',
								'customfields',
								'CustomFieldGroupList_Load_Query',
								'Filter='	+ EncodeArray( filter ) 		+
								'&Sort=' 	+ encodeURIComponent( sort ) 	+
								'&Offset=' 	+ encodeURIComponent( offset ) 	+
								'&Count=' 	+ encodeURIComponent( count ),
								delegator );
}

function CustomFieldGroupList_Load_All( callback )
{
	return AJAX_Call_Module( 	callback,
								'admin',
								'customfields',
								'CustomFieldGroupList_Load_All',
								'' );
} 

function CustomFieldGroup_Insert( fieldlist, callback, delegator ) 
{ 
	return AJAX_Call_Module_FieldList( 	callback,
										'admin',
										'customfields',
										'CustomFieldGroup_Insert',
										'',
										fieldlist,
										delegator );
}

function CustomFieldGroup_Update( group_id, fieldlist, callback, delegator ) 
{ 
	return AJAX_Call_Module_FieldList(	callback,
										'admin',
										'customfields',
										'CustomFieldGroup_Update',
										'Group_ID=' + encodeURIComponent( group_id ),
										fieldlist,
										delegator );
}

function CustomFieldGroup_Delete( group_id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'customfields', 'CustomFieldGroup_Delete',
	{
		Group_ID: group_id
	}, delegator );
}
