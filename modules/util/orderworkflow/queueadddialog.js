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

// Order Workflow: Queue Add Dialog
////////////////////////////////////////////////////

function OWFQueue_AddDialog()
{
	var self = this;

	MMDialog.call( this, 'queue_adddialog', 500, 325 );

	this.SetTitle( 'Add Queue' );
	this.SetAutoHeightEnabled();
	this.SetResizeEnabled();

	this.element_code_container				= document.getElementById( 'queue_adddialog_code_container' );
	this.element_name_container				= document.getElementById( 'queue_adddialog_name_container' );

	this.element_code_container.innerHTML	= '';
	this.input_code							= new MMInput( this.element_code_container, '', '' );
	this.input_code.SetTitle( 'Queue Code' );
	this.input_code.SetClassName( 'mm_input_common whole_width title_visible' );
	this.input_code.SetOnEnterHandler( function() { self.onEnter(); } );

	this.element_name_container.innerHTML	= '';
	this.input_name							= new MMInput( this.element_name_container, '', '' );
	this.input_name.SetTitle( 'Queue Name' );
	this.input_name.SetClassName( 'mm_input_common whole_width title_visible' );
	this.input_name.SetOnEnterHandler( function() { self.onEnter(); } );

	this.button_cancel						= this.ActionItem_Add( 'Cancel',	function() { self.Hide(); } );
	this.button_add							= this.ActionItem_Add( 'Add',		function() { self.Save(); } );
}

DeriveFrom( MMDialog, OWFQueue_AddDialog );

OWFQueue_AddDialog.prototype.onEnter = function()
{
	if ( this.button_add )
	{
		this.button_add.SimulateClick();
	}
}

OWFQueue_AddDialog.prototype.onESC = function()
{
	this.button_cancel.SimulateClick();
}

OWFQueue_AddDialog.prototype.onSetContent = function()
{
	this.input_code.SetValue( '' );
	this.input_name.SetValue( '' );
}

OWFQueue_AddDialog.prototype.onVisible = function()
{
	this.input_code.Focus();
}

OWFQueue_AddDialog.prototype.Validate = function( fields )
{
	var field;

	if ( !this.input_code.Validate_String_NonEmpty_WithMaxLength( 50 ) ||
		 !this.input_name.Validate_String_NonEmpty_WithMaxLength( 254 ) )
	{
		return;
	}

	field			= new Object();
	field.name		= 'Queue_Code';
	field.value		= this.input_code.GetValue();

	fields.push( field );

	field			= new Object();
	field.name		= 'Queue_Name';
	field.value		= this.input_name.GetValue();

	fields.push( field );

	return true;
}

OWFQueue_AddDialog.prototype.Save = function()
{
	var self = this;
	var fields = new Array();

	if ( !this.Validate( fields ) )
	{
		return;
	}

	this.input_code.Disable();
	this.input_name.Disable();

	OWFQueue_Insert( fields, function( response ) { self.Save_Callback( response ); } );
}

OWFQueue_AddDialog.prototype.Save_Callback = function( response )
{
	var i, i_len;

	this.input_code.Enable();
	this.input_name.Enable();

	if ( !response.success )
	{
		if ( !response.validation_error )
		{
			this.onError( response.error_message );
		}
		else
		{
			if ( response.input_errors )
			{
				for ( i = 0, i_len = response.error_fields.length; i < i_len; i++ )
				{
					this.Process_Response_Errors( response.error_fields[ i ].error_field, response.error_fields[ i ].error_message );
				}
			}
			else if ( response.error_field.length )
			{
				this.Process_Response_Errors( response.error_field, response.error_field_message );
			}

			if ( response.error_field_message.length )	this.onError( response.error_field_message );
			else										this.onError( 'One or more fields were improperly filled out' );
		}

		return;
	}

	this.onSave( this.input_code.GetValue() );
	this.Hide();
}

OWFQueue_AddDialog.prototype.Process_Response_Errors = function( error_field, error_message )
{
	if ( error_field === 'Queue_Code' )			this.input_code.SetInvalid( error_message );
	else if ( error_field === 'Queue_Name' )	this.input_name.SetInvalid( error_message );
}

OWFQueue_AddDialog.prototype.onError = function( error_message )
{
	var dialog;

	dialog = new AlertDialog();
	dialog.SetTitle( 'Error' );
	dialog.Show( error_message );
}

OWFQueue_AddDialog.prototype.onSave = function( queue_code ) { ; }
