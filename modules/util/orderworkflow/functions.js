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

function OWFWorkflowList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback,
								  'admin',
								  'orderworkflow',
								  'OWFWorkflowList_Load_Query',
								  {
								      Filter:	filter,
								      Sort:		sort,
								      Offset:	offset,
								      Count:	count
								  },
								  delegator );
}

function OWFWorkflowList_Delete( workflow_ids, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'admin',
							 'orderworkflow',
							 'OWFWorkflowList_Delete',
							 'Workflow_IDs=' + EncodeArray( workflow_ids ),
							 delegator );
}

function OWFWorkflowTriggerList_Load_Workflow( workflow_id, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'admin',
							 'orderworkflow',
							 'OWFWorkflowTriggerList_Load_Workflow',
							 'Workflow_ID=' + encodeURIComponent( workflow_id ),
							 delegator );
}

function OWFWorkflowActionList_Load_Workflow( workflow_id, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'admin',
							 'orderworkflow',
							 'OWFWorkflowActionList_Load_Workflow',
							 'Workflow_ID=' + encodeURIComponent( workflow_id ),
							 delegator );
}

function OWFWorkflowConditionList_Load_Workflow( workflow_id, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'admin',
							 'orderworkflow',
							 'OWFWorkflowConditionList_Load_Workflow',
							 'Workflow_ID=' + encodeURIComponent( workflow_id ),
							 delegator );
}

function OWFWorkflow_Insert( data, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback,
								  'admin',
								  'orderworkflow',
								  'OWFWorkflow_Insert',
								  {
									Workflow_Name:						data.name,
									Workflow_Enabled:					data.enabled,
									Workflow_WaitUntilTrue:				data.wait_for,
									Workflow_WaitUntilTrue_Interval:	data.wait_int,
									Workflow_WaitUntilTrue_Maximum:		data.wait_max,
									Workflow_Conditions:				data.cond,
									Workflow_Triggers:					data.triggers,
									Workflow_Actions:					data.actions
								  },
								  delegator );
}

function OWFWorkflow_Update( id, data, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback,
								  'admin',
								  'orderworkflow',
								  'OWFWorkflow_Update',
								  {
								  	Workflow_ID: 						id,
									Workflow_Name:						data.name,
									Workflow_Enabled:					data.enabled,
									Workflow_WaitUntilTrue:				data.wait_for,
									Workflow_WaitUntilTrue_Interval:	data.wait_int,
									Workflow_WaitUntilTrue_Maximum:		data.wait_max,
									Workflow_Conditions:				data.cond,
									Workflow_Triggers:					data.triggers,
									Workflow_Actions:					data.actions
								  },
								  delegator );
}

function OWFWorkflow_Update_Enabled( id, checked, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'admin',
							 'orderworkflow',
							 'OWFWorkflow_Update_Enabled',
							 'Workflow_ID='			+ encodeURIComponent( id ) +
							 '&Workflow_Enabled='	+ encodeURIComponent( checked ? '1' : '0' ),
							 delegator );
}

function OWFWorkflow_Delete( id, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'admin',
							 'orderworkflow',
							 'OWFWorkflow_Delete',
							 'Workflow_ID=' + encodeURIComponent( id ),
							 delegator );
}

function OWFQueueList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback,
								  'admin',
								  'orderworkflow',
								  'OWFQueueList_Load_Query',
								  {
								      Filter:	filter,
								      Sort:		sort,
								      Offset:	offset,
								      Count:	count
								  },
								  delegator );
}

function OWFQueueList_Delete( queue_ids, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'admin',
							 'orderworkflow',
							 'OWFQueueList_Delete',
							 'Queue_IDs=' + EncodeArray( queue_ids ),
							 delegator );
}

function OWFQueue_Insert( fieldlist, callback, delegator )
{
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'orderworkflow',
									   'OWFQueue_Insert',
									   '',
									   fieldlist,
									   delegator );
}

function OWFQueue_Update( id, fieldlist, callback, delegator )
{
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'orderworkflow',
									   'OWFQueue_Update',
									   'Queue_ID=' + encodeURIComponent( id ),
									   fieldlist,
									   delegator );
}

function OWFQueue_Delete( id, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'admin',
							 'orderworkflow',
							 'OWFQueue_Delete',
							 'Queue_ID=' + encodeURIComponent( id ),
							 delegator );
}

function OWFAuthenticationCredentialsList_Load_Query( filter, sort, offset, count, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'orderworkflow', 'OWFAuthenticationCredentialsList_Load_Query',
	{
		Filter:	filter,
		Sort:	sort,
		Offset:	offset,
		Count:	count
	}, delegator );
}

function OWFAuthenticationCredentials_Insert( data, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'orderworkflow', 'OWFAuthenticationCredentials_Insert',
	{
		AuthenticationCredentials_Type:			data.auth_type,
		AuthenticationCredentials_Description:	data.descrip,
		AuthenticationCredentials_Data:			data.auth_data
	}, delegator );
}

function OWFAuthenticationCredentials_Update( id, data, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'orderworkflow', 'OWFAuthenticationCredentials_Update',
	{
		AuthenticationCredentials_ID:			id,
		AuthenticationCredentials_Type:			data.auth_type,
		AuthenticationCredentials_Description:	data.descrip,
		AuthenticationCredentials_Data:			data.auth_data
	}, delegator );
}

function OWFAuthenticationCredentials_Delete( id, callback, delegator )
{
	return AJAX_Call_Module_JSON( callback, 'admin', 'orderworkflow', 'OWFAuthenticationCredentials_Delete',
	{
		AuthenticationCredentials_ID: id
	}, delegator );
}