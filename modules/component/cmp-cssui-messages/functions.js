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

// CSSUI Messages Server-side AJAX calls
////////////////////////////////////////////////////

function CSSUIMessageList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback,
								  'admin',
								  'cmp-cssui-messages',
								  'CSSUIMessageList_Load_Query',
								  {
								      Filter:	filter,
								      Sort:		sort,
								      Offset:	offset,
								      Count:	count
								  },
								  delegator );
}

function CSSUIMessage_Insert( fieldlist, callback, delegator )
{
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'cmp-cssui-messages',
									   'CSSUIMessage_Insert',
									   '',
									   fieldlist,
									   delegator );
}

function CSSUIMessage_Update( id, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'cmp-cssui-messages',
									   'CSSUIMessage_Update',
									   'Message_ID=' + encodeURIComponent( id ),
									   fieldlist,
									   delegator );
}

function CSSUIMessage_Delete( id, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'admin',
							 'cmp-cssui-messages',
							 'CSSUIMessage_Delete',
							 'Message_ID=' + encodeURIComponent( id ),
							 delegator );
}

function CSSUIMessage_Restore_Default( id, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'admin',
							 'cmp-cssui-messages',
							 'CSSUIMessage_Restore_Default',
							 'Message_ID=' + encodeURIComponent( id ),
							 delegator );
}
