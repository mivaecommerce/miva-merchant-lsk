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

// Template Search and Replace Confirmation Notes Dialog
////////////////////////////////////////////////////

function TemplateSearchAndReplace_ConfirmationNotesDialog( find, replace, templates, replace_count )
{
	var self = this;

	MMDialog.call( this, 'templatesearchandreplace_confirmationnotesdialog', 700, 100, 'inner' );

	this.SetTitle( 'Replace ' + replace_count + Plural( replace_count, ' Match', ' Matches' ) + '?' );
	this.SetAutoHeightEnabled();

	this.element_message_find					= document.getElementById( 'templatesearchandreplace_confirmationnotesdialog_message_find' );
	this.element_message_match					= document.getElementById( 'templatesearchandreplace_confirmationnotesdialog_message_match' );
	this.element_message_match_text				= document.getElementById( 'templatesearchandreplace_confirmationnotesdialog_message_match_text' );
	this.element_message_replace				= document.getElementById( 'templatesearchandreplace_confirmationnotesdialog_message_replace' );
	this.element_message_templates				= document.getElementById( 'templatesearchandreplace_confirmationnotesdialog_message_templates' );
	this.element_notes_container				= document.getElementById( 'templatesearchandreplace_confirmationnotesdialog_notes_container' );

	find										= GetNormalizedValue( find );
	replace										= GetNormalizedValue( replace );
	templates									= GetNormalizedValue( templates );

	this.element_message_find.textContent		= find;
	this.element_message_match.textContent		= replace_count;
	this.element_message_match_text.textContent	= Plural( replace_count, 'match', 'matches' );
	this.element_message_replace.textContent	= replace;
	this.element_message_templates.textContent	= templates;

	EmptyElement_NoResize( this.element_notes_container );

	this.textarea_notes							= new MMTextArea( this.element_notes_container, 'Notes', '' );
	this.textarea_notes.SetTitle( 'Notes' );
	this.textarea_notes.AddClassName( [ 'whole_width', 'title_visible' ] );
	this.textarea_notes.SetResizeEnabled( { horizontal: false } );
	this.textarea_notes.SetOnChangeHandler( function( value )
	{
		if ( value.length )	self.button_replace.Enable();
		else				self.button_replace.Disable();
	} );

	this.button_cancel							= this.ActionItem_Add_Secondary( 'Cancel',	function() { self.Hide(); } );
	this.button_replace							= this.ActionItem_Add_Primary( 'Replace',	function() { self.Replace(); } );
}

DeriveFrom( MMDialog, TemplateSearchAndReplace_ConfirmationNotesDialog );

TemplateSearchAndReplace_ConfirmationNotesDialog.prototype.onEnter = function( e )
{
	this.button_replace.SimulateClick();
}

TemplateSearchAndReplace_ConfirmationNotesDialog.prototype.onESC = function( e )
{
	this.button_cancel.SimulateClick();
}

TemplateSearchAndReplace_ConfirmationNotesDialog.prototype.onVisible = function()
{
	var self = this;
	this.textarea_notes.Focus();

	setTimeout( function() { self.Position(); self.Redraw(); }, 0 );
}

TemplateSearchAndReplace_ConfirmationNotesDialog.prototype.onSetContent = function()
{
	this.textarea_notes.SetValue( '' );
	this.button_replace.Disable();
}

TemplateSearchAndReplace_ConfirmationNotesDialog.prototype.Replace = function()
{
	if ( !this.textarea_notes.Validate_NonEmpty() )
	{
		return;
	}

	this.Hide();
	this.onReplace( this.textarea_notes.GetValue() );
}

TemplateSearchAndReplace_ConfirmationNotesDialog.prototype.onReplace = function( notes ) { ; }
