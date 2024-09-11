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

// Quote Custom Field Dialog
////////////////////////////////////////////////////

function Quote_CustomFieldDialog( quote )
{
	var self = this;

	this.quote				= quote;
	this.customfields		= null;
	this.controllers		= new Array();
	this.can_modify			= CanI( 'ORDR', 0, 0, 1, 0 );

	MMDialog.call( this, 'quote_customfielddialog', 700, 600 );

	this.customfields_container	= document.getElementById( 'quote_customfielddialog_customfields_container' );

	// Buttons
	this.button_save		= null;
	this.button_cancel		= null;

	// Events
	if ( !this.can_modify )
	{
		this.button_cancel 	= this.ActionItem_Add( 'Close',		function() { self.Hide(); } );
	}
	else
	{
		this.button_cancel 	= this.ActionItem_Add( 'Cancel',	function() { self.Hide(); } );
		this.button_save	= this.ActionItem_Add( 'Save',		function() { self.Save(); } );
	}

	this.SetResizeEnabled();
}

DeriveFrom( MMDialog, Quote_CustomFieldDialog );

Quote_CustomFieldDialog.prototype.onEnter = function()
{
	if ( this.can_modify )
	{
		this.Save();
	}
}

Quote_CustomFieldDialog.prototype.onVisible = function()
{
	var self = this;
	var processing;

	processing = new ProcessingDialog();
	processing.Show( 'Loading Custom Fields' );

	QuoteCustomFieldAndValueList_Load_Quote( this.quote.id, function( response )
	{
		processing.Hide();

		if ( !response.success )
		{
			return self.onerror( response.error_message );
		}

		self.Build_CustomFields( response );
	} );
}

Quote_CustomFieldDialog.prototype.onSetContent = function()
{
	this.SetTitle( 'Quote Custom Fields' );
}

Quote_CustomFieldDialog.prototype.Build_CustomFields = function( response )
{
	var i, j, tr, element, td_value, td_prompt, controller, customfield;

	this.controllers	= new Array();
	this.customfields	= response.data;

	EmptyElement( this.customfields_container );

	for ( i = 0; i < this.customfields.length; i++ )
	{
		tr			= newElement( 'tr', null, null, this.customfields_container );
		td_prompt	= newElement( 'td', { 'nowrap': '', 'valign': 'top' }, null, tr );
		td_value	= newElement( 'td', { 'width': '100%' }, null, tr );
		customfield = this.customfields[ i ];
		controller	= null;

		switch( customfield.type )
		{
			case 'text'		:
			{
				element		= newElement( 'input', { 'type': 'text', 'size': 50 }, null, td_value );
				controller	= new MMDialog_Edit_Controller( element );

				newTextNode( customfield.prompt + ':', td_prompt );
				controller.SetValue( customfield.data );

				break;
			}
			case 'memo'		:
			{
				element		= newElement( 'textarea', { 'cols': 50, 'rows': 10 }, null, td_value );
				controller	= new MMDialog_Edit_Controller( element );

				newTextNode( customfield.prompt + ':', td_prompt );
				controller.SetValue( customfield.data );

				break;
			}
			case 'checkbox'	:
			{
				element		= newElement( 'input', { 'type': 'checkbox' }, null, td_value );
				controller	= new MMDialog_Checkbox_Controller( element );

				newTextNode( '', td_prompt );
				newTextNode( customfield.prompt, td_value );
				controller.SetChecked( customfield.data.length > 0 );

				break;
			}
			case 'radio'	:
			{
				if ( customfield.options.length == 0 )
				{
					break;
				}

				controller = new MMDialog_RadioGroup_Controller();

				for ( j = 0; j < customfield.options.length; j++ )
				{
					element = newElement( 'input', { 'type': 'radio' }, null, td_value );

					newTextNode( customfield.options[ j ].prompt, td_value );
					newElement( 'br', null, null, td_value );
					controller.AddRadio( element ).SetValue( customfield.options[ j ].code );
				}

				newTextNode( customfield.prompt + ':', td_prompt );
				controller.SetValue( customfield.data );

				break;
			}
			case 'select'	:
			{
				if ( customfield.options.length == 0 )
				{
					break;
				}

				element		= newElement( 'select', null, null, td_value );
				controller	= new MMDialog_Select_Controller( element );

				controller.AddOption( '<Select One>', '' );

				for ( j = 0; j < customfield.options.length; j++ )
				{
					controller.AddOption( customfield.options[ j ].prompt, customfield.options[ j ].code );
				}

				newTextNode( customfield.prompt + ':', td_prompt );
				controller.SetValue( customfield.data );

				break;
			}
		}

		if ( controller )
		{
			this.controllers.push( {
				code:			customfield.code,
				type:			customfield.type,
				controller:		controller,
				customfield:	customfield
			} );
		}
	}
}

Quote_CustomFieldDialog.prototype.Save = function()
{
	var self = this;
	var i, i_len, field, fields;

	fields = new Array();

	for ( i = 0, i_len = this.controllers.length; i < i_len; i++ )
	{
		field		= new Object();
		field.code	= this.controllers[ i ].code;

		switch ( this.controllers[ i ].type )
		{
			case 'checkbox'	: field.value = this.controllers[ i ].controller.GetChecked();	break;
			default			: field.value = this.controllers[ i ].controller.GetValue();	break;
		}

		fields.push( field );
	}

	QuoteCustomFieldValues_Update_Quote( this.quote.id, fields, function( response ) { self.Save_Callback( response ); } );
}

Quote_CustomFieldDialog.prototype.Save_Callback = function( response )
{
	if ( !response.success )
	{
		return this.onerror( response.error_message );
	}

	this.Hide();
}

Quote_CustomFieldDialog.prototype.onerror = function( error ) { Modal_Alert( error ); }
