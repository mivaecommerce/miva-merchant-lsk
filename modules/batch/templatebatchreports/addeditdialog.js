// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2014 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// TemplateBatchReport Add/Edit Dialog 
////////////////////////////////////////////////////

function TemplateBatchReport_AddEditDialog( report )
{
	var self = this;

	// Variables
	this.report				= report;
	this.can_modify			= CanI( 'SUTL', 0, 0, 1, 0 );
	this.can_delete			= CanI( 'SUTL', 0, 0, 1, 0 );

	// Controls
	this.dialog				= document.getElementById( 'templatebatchreport_addeditdialog' );
	this.title				= document.getElementById( 'templatebatchreport_addeditdialog_title' );

	this.text_type			= document.getElementById( 'templatebatchreport_addeditdialog_type' );
	this.select_type		= document.getElementById( 'templatebatchreport_addeditdialog_select_type' );
	this.text_code			= document.getElementById( 'templatebatchreport_addeditdialog_code' );
	this.edit_code			= document.getElementById( 'templatebatchreport_addeditdialog_edit_code' );
	this.edit_name			= document.getElementById( 'templatebatchreport_addeditdialog_name' );

	this.button_cancel		= document.getElementById( 'templatebatchreport_addeditdialog_button_cancel' );
	this.button_delete		= document.getElementById( 'templatebatchreport_addeditdialog_button_delete' );
	this.button_save		= document.getElementById( 'templatebatchreport_addeditdialog_button_save' );

	// Events
	if ( this.button_cancel )	this.button_cancel.onclick		= function() { self.Cancel(); }
	if ( this.button_save )		this.button_save.onclick		= function() { if ( self.can_modify || !self.report ) self.Save(); }
	if ( this.button_delete )	this.button_delete.onclick		= function() { if ( self.can_delete ) self.Delete(); }
}

TemplateBatchReport_AddEditDialog.prototype.Show = function()
{
	if ( this.report )	this.ShowEdit();
	else				this.ShowAdd();
}

TemplateBatchReport_AddEditDialog.prototype.ShowEdit = function()
{
	this.title.innerHTML				= 'Edit Batch Report';

	if ( this.report.type == 'order' )			this.text_type.innerHTML = 'Order';
	else if ( this.report.type == 'shipment' )	this.text_type.innerHTML = 'Shipment';
	else										this.text_type.innerHTML = encodeentities( this.report.type );

	this.text_type.style.display		= 'inline';
	this.select_type.style.display		= 'none';

	this.text_code.innerHTML			= encodeentities( this.report.code );
	this.text_code.style.display		= 'inline';
	this.edit_code.style.display		= 'none';

	this.edit_name.value				= this.report.name;

	this.button_save.value				= 'Save';
	this.button_save.style.display		= this.can_modify ? 'inline' : 'none';
	this.button_delete.style.display	= this.can_delete ? 'inline' : 'none';

	Modal_Show( this.dialog, this.button_save.onclick, this.button_cancel.onclick );

	this.edit_name.focus();
}

TemplateBatchReport_AddEditDialog.prototype.ShowAdd = function()
{
	this.title.innerHTML				= 'Add Batch Report';

	this.select_type.selectedIndex		= 0;
	this.select_type.style.display		= 'block';
	this.text_type.style.display		= 'none';
	this.edit_code.value				= '';
	this.text_code.style.display		= 'none';
	this.edit_code.style.display		= 'block';
	this.edit_name.value				= '';

	this.button_save.value				= 'Add';
	this.button_save.style.display		= 'inline';
	this.button_delete.style.display	= 'none';

	Modal_Show( this.dialog, this.button_save.onclick, this.button_cancel.onclick );

	this.edit_code.focus();
}

TemplateBatchReport_AddEditDialog.prototype.Hide = function()
{
	Modal_Hide();
}

TemplateBatchReport_AddEditDialog.prototype.Cancel = function()
{
	this.Hide();
	this.oncancel();
}

TemplateBatchReport_AddEditDialog.prototype.Save = function()
{
	var type;
	var self = this;

	if ( this.report == null )
	{
		if ( this.select_type.selectedIndex >= 0 )
		{
			type = this.select_type.options[ this.select_type.selectedIndex ].value;
		}
		else
		{
			Modal_Alert( 'Please enter a report code.' );
			this.edit_code.focus();

			return false;
		}

		if ( this.edit_code.value.length == 0 )
		{
			Modal_Alert( 'Please enter a report code.' );
			this.edit_code.focus();

			return false;
		}
	}

	if ( this.edit_name.value.length == 0 )
	{
		Modal_Alert( 'Please enter a report name.' );
		this.edit_name.focus();

		return false;
	}

	if ( this.report )	TemplateBatchReport_Update( this.report.type, this.report.code, this.edit_name.value, function( response ) { self.Save_Callback( response ); } );
	else				TemplateBatchReport_Insert( type, this.edit_code.value, this.edit_name.value, function( response ) { self.Save_Callback( response ); } );
}

TemplateBatchReport_AddEditDialog.prototype.Save_Callback = function( response )
{
	this.button_save.value		= this.report ? "Save" : "Add";
	this.button_save.disabled	= false;

	if ( !response.success )
	{
		this.onerror( response.error_message );

		if ( response.error_code == 'invalid_code' )
		{
			this.edit_code.focus();
		}

		return;
	}

	this.Hide();
	this.onsave();
}

TemplateBatchReport_AddEditDialog.prototype.Delete = function()
{
	var self = this;

	if ( !confirm( 'Deleting a batch report cannot be undone.  Continue?' ) )
	{
		return;
	}

	TemplateBatchReport_Delete( this.report.type, this.report.code, function( response ) { self.Delete_Callback( response ); } );
}

TemplateBatchReport_AddEditDialog.prototype.Delete_Callback = function( response )
{
	if ( !response.success )
	{
		return this.onerror( response.error_message );
	}

	this.Hide();
	this.ondelete();
}

TemplateBatchReport_AddEditDialog.prototype.onerror		= function( error )	{ Modal_Alert( error ); }
TemplateBatchReport_AddEditDialog.prototype.oncancel	= function()		{ ; }
TemplateBatchReport_AddEditDialog.prototype.onsave		= function()		{ ; }
TemplateBatchReport_AddEditDialog.prototype.ondelete	= function()		{ ; }
