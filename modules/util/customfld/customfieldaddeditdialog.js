// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2025 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// Custom Field Add/Edit Dialog
////////////////////////////////////////////////////

function CustomField_AddEditDialog( customfield )
{
	var self = this;

	MMDialog.call( this, 'customfield_addeditdialog', 600, 450 );

	// Variables
	this.customfield				= customfield;
	this.optionlist					= new Array();
	this.can_modify					= CanI( 'SUTL', 0, 0, 1, 0 );

	// Elements
	this.tbody_facet				= document.getElementById( 'customfield_addeditdialog_tbody_facet' );
	this.tbody_options_info			= document.getElementById( 'customfield_addeditdialog_tbody_options_info' );
	this.tbody_options				= document.getElementById( 'customfield_addeditdialog_tbody_options' );
	this.span_fieldtype_warning		= document.getElementById( 'customfield_addeditdialog_fieldtype_warning' );
	this.button_option_add			= document.getElementById( 'customfield_addeditparameter_button' );
	this.button_option_add.onclick	= function() { if ( self.can_modify || !self.customfield ) self.AddOption(); };

	// Controllers
	this.edit_type					= new MMDialog_Select_Controller( 'customfield_addeditdialog_type' );
	this.edit_type.SetOnChangeHandler( function( value ) { self.ModifyType( value ); } );

	this.edit_code					= new MMDialog_Edit_Controller( 'customfield_addeditdialog_edit_code' );
	this.edit_name					= new MMDialog_Edit_Controller( 'customfield_addeditdialog_name' );
	this.edit_facet					= new MMDialog_Checkbox_Controller( 'customfield_addeditdialog_facet' );
	this.edit_is_public				= new MMDialog_Checkbox_Controller( 'customfield_addeditdialog_is_public' );

	this.edit_fieldtype				= new MMDialog_Select_Controller( 'customfield_addeditdialog_fieldtype' );
	this.edit_fieldtype.SetOnChangeHandler( function( value ) { self.ModifyFieldOptions( value ); } );

	this.edit_info					= new MMDialog_Edit_Controller( 'customfield_addeditdialog_info' );

	this.edit_group					= new MMDialog_Select_Controller( 'customfield_addeditdialog_group' );
	this.edit_group.SetLoadFunction(		function( params, callback )	{ CustomFieldGroupList_Load_All( callback ); } );
	this.edit_group.SetPopulateFunction(	function( record )				{ this.AddOption( record.name, record.id ); } );

	this.edit_option_value			= new MMDialog_Edit_Controller( 'customfield_addeditparameter_value' );

	// Buttons
	if ( !this.customfield )
	{
		this.button_cancel	= this.ActionItem_Add( 'Cancel',	function() { self.Hide(); } );
		this.button_add		= this.ActionItem_Add( 'Add',		function() { self.Save( false ); } );
		this.button_addplus = this.ActionItem_Add( 'Add +',		function() { self.Save( true ); } );
	}
	else if ( this.can_modify )
	{
		this.button_cancel	= this.ActionItem_Add( 'Cancel',	function() { self.Hide(); } );
		this.button_delete	= this.ActionItem_Add( 'Delete',	function() { self.Delete(); } );
		this.button_add		= this.ActionItem_Add( 'Save',		function() { self.Save( false ); } );
	}
	else
	{
		this.button_cancel	= this.ActionItem_Add( 'Close',		function() { self.Hide(); } );
	}

	this.SetResizeEnabled();
	this.SetAutoHeightEnabled();
}

DeriveFrom( MMDialog, CustomField_AddEditDialog );

CustomField_AddEditDialog.prototype.onEnter = function( e )
{
	if ( this.can_modify )
	{
		if ( this.customfield )	this.button_add.SimulateClick();
		else					this.button_addplus.SimulateClick();
	}
}

CustomField_AddEditDialog.prototype.onVisible = function()
{
	this.edit_code.Focus();
}

CustomField_AddEditDialog.prototype.onSetContent = function()
{
	var i, i_len;

	EmptyElement( this.tbody_options );
	this.span_fieldtype_warning.style.display = 'none';

	if ( !this.customfield )
	{
		this.SetTitle( 'Add Custom Field' );
		this.edit_type.Enable();
		this.edit_type.SetValue( 'product' );
		this.edit_code.SetValue( '' );
		this.edit_name.SetValue( '' );
		this.edit_facet.SetChecked( false );
		this.edit_is_public.SetChecked( false );
		this.edit_fieldtype.SetValue( 'textfield' );
		this.edit_group.SetValue( 0 );
		this.edit_info.SetValue( '' );
		this.edit_option_value.SetValue( '' );
	}
	else
	{
		this.SetTitle( 'Edit Custom Field: ' + this.customfield.name );
		this.edit_type.Disable();
		this.edit_type.SetValue( this.customfield.type );
		this.edit_code.SetValue( this.customfield.code );
		this.edit_name.SetValue( this.customfield.name );
		this.edit_facet.SetChecked( this.customfield.facet );
		this.edit_is_public.SetChecked( this.customfield.is_public );
		this.edit_fieldtype.SetValue( this.customfield.fieldtype );
		this.edit_group.SetValue( this.customfield.group_id );
		this.edit_info.SetValue( this.customfield.info );
		this.edit_option_value.SetValue( '' );

		for ( i = 0, i_len = this.customfield.additional_options.length; i < i_len; i++ )
		{
			new CustomField_Parameter( this, this.customfield.additional_options[ i ].value );
		}
	}

	this.edit_group.Load();
}

CustomField_AddEditDialog.prototype.ModifyType = function( value )
{
	if ( value == 'product' )
	{
		this.tbody_facet.style.display = '';
		this.edit_fieldtype.EnableOption( 'multitext' );
	}
	else
	{
		this.tbody_facet.style.display = 'none';
		this.edit_fieldtype.DisableOption( 'multitext', 'textfield' );
	}
}

CustomField_AddEditDialog.prototype.ModifyFieldOptions = function( value )
{
	if ( this.customfield && this.customfield.type == 'product' && ( ( this.customfield.fieldtype != 'multitext' && value == 'multitext' ) || ( this.customfield.fieldtype == 'multitext' && value != 'multitext' ) ) )
	{
		this.span_fieldtype_warning.style.display = '';
	}
	else
	{
		this.span_fieldtype_warning.style.display = 'none';
	}

	switch ( value )
	{
		case 'radio'	:
		case 'dropdown'	:
		{
			this.tbody_options_info.style.display	= '';
			this.tbody_options.style.display		= '';

			break;
		}
		default			:
		{
			this.tbody_options_info.style.display	= 'none';
			this.tbody_options.style.display		= 'none';

			break;
		}
	}
}

CustomField_AddEditDialog.prototype.AddOption = function()
{
	if ( !this.edit_option_value.Validate_NonEmpty() ) return false;

	new CustomField_Parameter( this, this.edit_option_value.GetValue() );

	this.edit_option_value.SetValue( '' );
}

CustomField_AddEditDialog.prototype.RemoveOption = function( tr, customfield_parameter )
{
	var i, i_len;

	for ( i = 0, i_len = this.optionlist.length; i < i_len; i++ )
	{
		if ( this.optionlist[ i ].classInstance == customfield_parameter )
		{
			this.optionlist.splice( i, 1 );
			break;
		}
	}

	this.tbody_options.removeChild( tr );
}

CustomField_AddEditDialog.prototype.Save = function( plus )
{
	var self = this;
	var data;

	data = new Object();

	if ( !this.Validate( data ) )
	{
		return;
	}

	if ( this.customfield )	CustomField_Update( this.customfield.id, data, function( response ) { self.Save_Callback( plus, response ); } );
	else					CustomField_Insert( data, function( response ) { self.Save_Callback( plus, response ); } );
}

CustomField_AddEditDialog.prototype.Validate = function( data )
{
	var i, i_len;

	if ( !this.edit_code.Validate_NonEmpty() ) return false;
	if ( !this.edit_name.Validate_NonEmpty() ) return false;

	data.type			= this.edit_type.GetValue();
	data.code			= this.edit_code.GetValue();
	data.name			= this.edit_name.GetValue();
	data.facet			= this.edit_facet.GetChecked();
	data.is_public		= this.edit_is_public.GetChecked();
	data.fieldtype		= this.edit_fieldtype.GetValue( '' );
	data.group_id		= this.edit_group.GetValue( 0 );
	data.info			= this.edit_info.GetValue();
	data.option_values	= new Array();

	for ( i = 0, i_len = this.optionlist.length; i < i_len; i++ )
	{
		if ( !this.optionlist[ i ].element.Validate_NonEmpty() ) return false;

		data.option_values.push( this.optionlist[ i ].element.GetValue() );
	}

	return true;
}

CustomField_AddEditDialog.prototype.Save_Callback = function( plus, response )
{
	if ( !response.success )
	{
		if ( !response.validation_error )
		{
			return this.onerror( response.error_message );
		}
		else
		{
			if ( response.error_field.length )			FocusChildInput( this.dialog, response.error_field );

			if ( response.error_field_message.length )	this.onerror( response.error_field_message );
			else										this.onerror( 'One or more fields were improperly filled out' );
		}

		return;
	}

	if ( !plus )
	{
		this.Hide();
	}
	else
	{
		this.ClearAdd();
		this.edit_code.Focus();
	}

	this.onsave();
}

CustomField_AddEditDialog.prototype.ClearAdd = function()
{
	this.edit_code.SetValue( '' );
	this.edit_name.SetValue( '' );
	this.edit_info.SetValue( '' );
	this.edit_option_value.SetValue( '' );
	this.optionlist = new Array();

	EmptyElement( this.tbody_options );
}

CustomField_AddEditDialog.prototype.Delete = function()
{
	const confirm_dialog	= new ConfirmationDialog();
	confirm_dialog.onYes	= () =>
	{
		CustomField_Delete( this.customfield.id, this.customfield.type, ( response ) => { this.Delete_Callback( response ); } );
	}

	confirm_dialog.SetTitle( 'Delete Custom Field?' );
	confirm_dialog.SetMessage( 'Deleting a custom field cannot be undone.<br /><br />Continue?' );
	confirm_dialog.Show();
}

CustomField_AddEditDialog.prototype.Delete_Callback = function( response )
{
	if ( !response.success )
	{
		return this.onerror( response.error_message );
	}

	this.Hide();
	this.ondelete();
}

CustomField_AddEditDialog.prototype.onerror		= function( error )	{ Modal_Alert( error ); }
CustomField_AddEditDialog.prototype.oncancel	= function()		{ ; }
CustomField_AddEditDialog.prototype.onsave		= function()		{ ; }
CustomField_AddEditDialog.prototype.ondelete	= function()		{ ; }

// CustomField Parameter
////////////////////////////////////////////////////

function CustomField_Parameter( dialog, option_value )
{
	var tr, td_prompt, td_value, input, button;

	tr								= newElement( 'tr', null, null, dialog.tbody_options );
	td_prompt						= newElement( 'td', null, null, tr );
	td_prompt.innerHTML				= '&nbsp;';
	td_value						= newElement( 'td', null, null, tr );
	input							= newElement( 'input', { 'type': 'text', 'value': option_value }, null, td_value );
	button							= newElement( 'input', { 'type': 'button', 'value': 'Remove' }, { 'display': ( dialog.can_modify ? 'inline': 'none' ) }, td_value );
	button.tr						= tr;
	button.customfield_parameter	= this;
	button.onclick					= function() { dialog.RemoveOption( this.tr, this.customfield_parameter ); return false; }

	dialog.optionlist.push( { 'classInstance': this, 'element': new MMDialog_Edit_Controller( input ) } );
}
