// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2023 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// Quote Email Edit Dialog
////////////////////////////////////////////////////

function Quote_EmailEditDialog( email )
{
	var self = this;

	MMDialog.call( this, 'quote_emaileditdialog', 550, 300 );

	this.email				= email;
	this.can_modify			= CanI( 'SUTL', 0, 0, 1, 0 );

	//Fields
	this.email_name			= document.getElementById( 'quote_emaileditdialog_name' );

	// Input fields
	this.email_from			= new MMDialog_Edit_Controller( 'quote_emaileditdialog_from' );
	this.email_to			= new MMDialog_Edit_Controller( 'quote_emaileditdialog_to');
	this.email_cc			= new MMDialog_Edit_Controller( 'quote_emaileditdialog_cc' );
	this.email_subject		= new MMDialog_Edit_Controller( 'quote_emaileditdialog_subject' );
	this.email_mime			= new MMDialog_Edit_Controller( 'quote_emaileditdialog_mime' );

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

DeriveFrom( MMDialog, Quote_EmailEditDialog );

Quote_EmailEditDialog.prototype.onEnter = function()
{
	if ( this.can_modify )
	{
		this.Save();
	}
}

Quote_EmailEditDialog.prototype.onVisible = function()
{
	this.email_from.Focus();
}

Quote_EmailEditDialog.prototype.onSetContent = function()
{
	this.SetTitle( 'Edit Email' );
	this.email_name.innerHTML = encodeentities( this.email.name );
	this.email_from.SetValue( this.email.email_from );
	this.email_to.SetValue( this.email.email_to );
	this.email_cc.SetValue( this.email.email_cc );
	this.email_subject.SetValue( this.email.email_subj );
	this.email_mime.SetValue( this.email.mime_type );
}

Quote_EmailEditDialog.prototype.Save = function()
{
	var self = this;

	if ( !this.Validate_Fields() )
	{
		return;
	}

	QuoteEmail_Update( this.email.code, this.Email_Object(), function( response ) { self.Save_Callback( response ); } );
}

Quote_EmailEditDialog.prototype.Save_Callback = function( response )
{
	if ( !response.success )
	{
		if ( !response.validation_error )
		{
			return this.onerror( response.error_message );
		}
		else
		{
			FocusChildInput( this.dialog, response.error_field );
			this.onerror( response.error_field_message );
			return;
		}
	}

	this.Hide();
	this.onsave();
}

Quote_EmailEditDialog.prototype.Validate_Fields = function()
{
	if ( !this.email_from.Validate_NonEmpty() )		return false;
	if ( !this.email_to.Validate_NonEmpty() )		return false;
	if ( !this.email_subject.Validate_NonEmpty() )	return false;
	if ( !this.email_mime.Validate_NonEmpty() )		return false;

	return true;
}

Quote_EmailEditDialog.prototype.Email_Object = function()
{
	var data;

	data			= new Object();
	data.from		= this.email_from.GetValue();
	data.to			= this.email_to.GetValue();
	data.cc			= this.email_cc.GetValue();
	data.subject	= this.email_subject.GetValue();
	data.mime		= this.email_mime.GetValue();

	return data;
}

Quote_EmailEditDialog.prototype.onerror	= function( error ) { Modal_Alert( error ); }
Quote_EmailEditDialog.prototype.onsave	= function() 		{ ; }
