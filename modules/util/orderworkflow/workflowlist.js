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

// Order Workflow: Workflow List 
////////////////////////////////////////////////////

function OWFWorkflow_List()
{
	this.can_add	= CanI( 'OWFP', 0, 1, 0, 0 );
	this.can_modify	= CanI( 'OWFP', 0, 0, 1, 0 );
	this.can_delete	= CanI( 'OWFP', 0, 0, 0, 1 );

	MMBatchList.call( this, 'mm9_batchlist_owfworkflowlist' );

	if ( this.can_add )		this.button_workflow_add = this.Feature_Buttons_AddButton_Persistent( '', 'Add Workflow', 'add', this.Add );
	if ( this.can_modify )	this.Feature_EditDialog_Enable( 'Edit Workflow' );
	if ( this.can_delete )	this.Feature_Delete_Enable( 'Delete Workflow(s)' );

	this.Feature_SearchBar_SetPlaceholderText( 'Search Workflows...' );
	this.SetDefaultSort( 'id', '' );
}

DeriveFrom( MMBatchList, OWFWorkflow_List );

OWFWorkflow_List.prototype.onLoad = OWFWorkflowList_Load_Query;

OWFWorkflow_List.prototype.Add = function( e )
{
	var self = this;
	var dialog;

	dialog			= new OWFWorkflow_AddEditDialog( null );
	dialog.onSave	= function() { self.Refresh(); };

	dialog.Show();
}

OWFWorkflow_List.prototype.onEdit = function( item )
{
	var self = this;
	var dialog;

	dialog			= new OWFWorkflow_AddEditDialog( item.record );
	dialog.onSave	= function() { self.Refresh(); };
	dialog.onDelete	= function() { self.Refresh(); };

	dialog.Show();
}

OWFWorkflow_List.prototype.onDeleteList = function( workflow_ids, callback, delegator )
{
	OWFWorkflowList_Delete( workflow_ids, callback, delegator );
}

OWFWorkflow_List.prototype.Update_Enabled = function( item, checked, delegator )
{
	var self = this;

	OWFWorkflow_Update_Enabled( item.record.id, checked, function( response )
	{
		if ( !response.success )
		{
			self.Record_Update_Error( response, item );
			self.ReBindVisibleRows();

			return;
		}

		item.record.enabled = checked ? true : false;

		self.ItemRecord_UpdateOriginalRecord( item, null );
		self.ReBindVisibleRows();
	}, delegator );
}

OWFWorkflow_List.prototype.onCreateRootColumnList = function()
{
	var self = this;
	var columnlist, enabled_column;

	if ( this.can_modify )	enabled_column = new MMBatchList_Column_CheckboxSlider(		'Enabled',	'enabled', 'OWFWorkflow_Enabled',	function( item, checked, delegator ) { self.Update_Enabled( item, checked, delegator ); } );
	else					enabled_column = new MMBatchList_Column_Checkbox(			'Enabled',	'enabled', '' );

	columnlist =
	[
		new MMBatchList_Column_SortOnlyColumn( 'ID', 'id' ),
		enabled_column,
		new MMBatchList_Column_Name( 'Name', 'name' )
	];

	return columnlist;
}
