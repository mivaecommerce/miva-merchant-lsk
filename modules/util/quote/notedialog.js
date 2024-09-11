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

// Quote Note Dialog
////////////////////////////////////////////////////

function Quote_NoteDialog( quote )
{
	var self = this;
	var mmlist;

	MMListDialog.call( this, 'mm_quotenotedialog' );

	this.SetTitle( 'Notes for Quote ' + quote.id );
	this.SetResizeEnabled();

	mmlist				= new Quote_NoteList( quote );
	this.SetList( mmlist );

	this.button_close	= this.ActionItem_Add( 'Close', function() { self.Hide(); } );
}

DeriveFrom( MMListDialog, Quote_NoteDialog );