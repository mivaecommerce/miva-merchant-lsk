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

// Quote Requester Edit Dialog
////////////////////////////////////////////////////

function Quote_RequesterEditDialog( quote )
{
	var self = this;

	this.quote				= quote;

	MMDialog.call( this, 'quote_requestereditdialog', 700, 600 );

	this.can_modify			= CanI( 'ORDR', 0, 0, 1, 0 );

	//Fields
	this.requester_fname	 = new MMDialog_Edit_Controller( 'quote_requesterdialog_fname' );
	this.requester_lname	 = new MMDialog_Edit_Controller( 'quote_requesterdialog_lname' );
	this.requester_email	 = new MMDialog_Edit_Controller( 'quote_requesterdialog_email' );
	this.requester_phone	 = new MMDialog_Edit_Controller( 'quote_requesterdialog_phone' );
	this.requester_zip		 = new MMDialog_Edit_Controller( 'quote_requesterdialog_zip' );
	this.requester_comment	 = new MMDialog_Edit_Controller( 'quote_requesterdialog_comment' );
	this.requester_terms	 = new MMDialog_Edit_Controller( 'quote_requesterdialog_terms' );
	
	this.requester_country	 = new MMDialog_Select_Controller( 'quote_requesterdialog_country' );
	this.requester_country.SetSelectOne( true, '<Select One>', '' );
	this.requester_country.SetLoadFunction(	function( params, callback ) { CountryList_Load( callback ); } );
	this.requester_country.SetPopulateFunction(	function( record ) { this.AddOption( record.name, record.alpha ); } );

	// Input fields

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

DeriveFrom( MMDialog, Quote_RequesterEditDialog );

Quote_RequesterEditDialog.prototype.onEnter = function()
{
	if ( this.can_modify )
	{
		this.Save();
	}
}

Quote_RequesterEditDialog.prototype.onVisible = function()
{
	this.requester_fname.Focus();
}

Quote_RequesterEditDialog.prototype.onSetContent = function()
{
	this.SetTitle( 'Quote Requester Details' );

	this.requester_fname.SetValue( this.quote.fname );
	this.requester_lname.SetValue( this.quote.lname );
	this.requester_email.SetValue( this.quote.email );
	this.requester_phone.SetValue( this.quote.phone );
	this.requester_zip.SetValue( this.quote.zip );
	this.requester_country.SetValue( this.quote.country );
	this.requester_comment.SetValue( this.quote.comment );
	this.requester_terms.SetValue( this.quote.terms );

	this.requester_country.Load();
}

Quote_RequesterEditDialog.prototype.Save = function()
{
	var self = this;

	Quote_Update_Requester_Information( this.quote.id, this.Requester_Object(), function( response ) { self.Save_Callback( response ); } );
}

Quote_RequesterEditDialog.prototype.Save_Callback = function( response )
{
	if ( !response.success )
	{
		return this.onerror( response.error_message );
	}

	this.Update_Quote_Object();
	this.Hide();
	this.onsave();
}

Quote_RequesterEditDialog.prototype.Update_Quote_Object = function()
{
	var data;

	data				= this.Requester_Object();

	/* Update the quote values so that the caller has the updated data */
	this.quote.fname	= data.fname;
	this.quote.lname	= data.lname;
	this.quote.email	= data.email;
	this.quote.phone	= data.phone;
	this.quote.zip		= data.zip;
	this.quote.country	= data.country;
	this.quote.comment	= data.comment;
	this.quote.terms	= data.terms;
}

Quote_RequesterEditDialog.prototype.Requester_Object = function()
{
	var data;

	data			= new Object();
	data.cust_id	= this.quote.cust_id;
	data.fname		= this.requester_fname.GetValue();
	data.lname		= this.requester_lname.GetValue();
	data.email		= this.requester_email.GetValue();
	data.phone		= this.requester_phone.GetValue();
	data.zip		= this.requester_zip.GetValue();
	data.country	= this.requester_country.GetValue();
	data.comment	= this.requester_comment.GetValue();
	data.terms		= this.requester_terms.GetValue();

	return data;
}

Quote_RequesterEditDialog.prototype.onerror	= function( error ) { Modal_Alert( error ); }
Quote_RequesterEditDialog.prototype.onsave	= function() 		{ ; }
