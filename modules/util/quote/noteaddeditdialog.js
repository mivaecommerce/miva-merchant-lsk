// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2020 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// Quote Note Add/Edit Dialog
////////////////////////////////////////////////////

function Quote_NoteAddEditDialog( note, quote )
{
	var self = this;

	this.note	= note;
	this.quote	= quote;

	MMDialog.call( this, 'mm9_note_addedit_dialog', 600, 400 );

	this.content_area	= new MMDialog_Edit_Controller( 'mm9_note_addedit_dialog_content' );

	this.button_cancel	= this.ActionItem_Add( 'Close', function() { self.Hide(); } );
	this.button_save	= this.ActionItem_Add( 'Add / Update', function() { self.Save(); } );

	this.SetTitle( 'Add/Edit Note' );
	this.SetResizeEnabled();
}

DeriveFrom( MMDialog, Quote_NoteAddEditDialog );

Quote_NoteAddEditDialog.prototype.onSetContent = function()
{
	if ( this.note )
	{
		this.content_area.SetValue( this.note.notetext );
		this.button_save.SetText( 'Update' );
		this.SetTitle( 'Edit Note' );
	}
	else
	{
		this.content_area.SetValue( '' );
		this.button_save.SetText( 'Add' );
		this.SetTitle( 'Add Note' );
	}
}

Quote_NoteAddEditDialog.prototype.Save = function()
{
	if ( !this.content_area.Validate_NonEmpty() )	return false;

	if ( this.note ) 	this.Update();
	else				this.Insert();
}

Quote_NoteAddEditDialog.prototype.Insert = function()
{
	var self = this;

	QuoteNote_Insert( this.quote.id, this.content_area.GetValue(), function( response ) { self.Save_Callback( response ); } );
}

Quote_NoteAddEditDialog.prototype.Update = function()
{
	var self = this;

	QuoteNote_Update( this.note.id, this.content_area.GetValue(), function( response ) { self.Save_Callback( response ); } );
}

Quote_NoteAddEditDialog.prototype.Save_Callback = function( response )
{
	if ( !response.success )
	{
		this.onerror( response.error_message );
		return;
	}

	this.onsave();
	this.Hide();
}

Quote_NoteAddEditDialog.prototype.onerror	= function( error ) { Modal_Alert( error ); }
Quote_NoteAddEditDialog.prototype.onsave	= function()		{ ; }
Quote_NoteAddEditDialog.prototype.oncancel	= function()		{ ; }
