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

function METANameList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module( 	callback,
								'admin',
								'cmp-mv-prodctgy-meta',
								'METANameList_Load_Query',
								'Filter='	+ EncodeArray( filter ) 		+
								'&Sort=' 	+ encodeURIComponent( sort ) 	+
								'&Offset=' 	+ encodeURIComponent( offset ) 	+
								'&Count=' 	+ encodeURIComponent( count ),
								delegator );
}

function METAName_Insert( fieldlist, callback, delegator ) 
{ 
	return AJAX_Call_Module_FieldList( 	callback,
										'admin',
										'cmp-mv-prodctgy-meta',
										'METAName_Insert',
										'',
										fieldlist,
										delegator );
}

function METAName_Update( id, fieldlist, callback, delegator ) 
{ 
	return AJAX_Call_Module_FieldList(	callback,
										'admin',
										'cmp-mv-prodctgy-meta',
										'METAName_Update',
										'METAName_ID=' + encodeURIComponent( id ),
										fieldlist,
										delegator );
}

function METAName_Delete( id, callback, delegator )
{
	return AJAX_Call_Module( 	callback,
								'admin',
								'cmp-mv-prodctgy-meta',
								'METAName_Delete',
								'METAName_ID=' + encodeURIComponent( id ),
								delegator );
}
