// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2024 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// Quote Note List
////////////////////////////////////////////////////

function Quote_NoteList( quote )
{
	var action;

	MMList.call( this, 'mm_quotenotedialog_list' );

	this.quote = quote;

	if ( CanI( 'ORDR', 0, 0, 1, 0 ) )
	{
		action = this.Feature_Controls_Create_Action( 'Add Note', '', this.Add );
		this.Feature_Controls_SetPrimary_Action( action );

		this.Feature_EditDialog_Enable( 'Edit Note' );
		this.Feature_Delete_Enable( 'Delete Note' );
	}
}

DeriveFrom( MMList, Quote_NoteList );

Quote_NoteList.prototype.onLoad = function( filter, sort, offset, count, callback, delegator )
{
	QuoteNoteList_Load_Query( this.quote.id, filter, sort, offset, count, callback, delegator );
}

Quote_NoteList.prototype.Add = function()
{
	var self = this;
	var dialog;

	dialog			= new Quote_NoteAddEditDialog( null, this.quote );
	dialog.onsave	= function() { self.Refresh(); };

	dialog.Show();
}

Quote_NoteList.prototype.onEdit = function( item )
{
	var self = this;
	var dialog;

	dialog			= new Quote_NoteAddEditDialog( item.record, this.quote );
	dialog.onsave	= function() { self.Refresh(); };
	dialog.ondelete	= function() { self.Refresh(); };

	dialog.Show();
}

Quote_NoteList.prototype.onDeleteList = function( note_ids, callback, delegator )
{
	QuoteNoteList_Delete( note_ids, callback, delegator );
}

Quote_NoteList.prototype.Update_Public = function( item, checked, delegator )
{
	var self = this;

	QuoteNote_Update_Public( item.record.id, checked, function( response )
	{
		if ( !response.success )
		{
			self.Record_Update_Error( response, item );
			self.ReBindVisibleRows();

			return;
		}

		item.record.pub = checked;

		self.ItemRecord_UpdateOriginalRecord( item, null );
		self.ReBindVisibleRows();
	}, delegator );
}

Quote_NoteList.prototype.onCreateRootColumnList = function()
{
	var self = this;
	var pub;

	if ( CanI( 'ORDR', 0, 0, 1, 0 ) )	pub = new MMList_Column_CheckboxSlider(	'Public', 'pub', 'QuoteNote_Public', function( item, checked, delegator ) { self.Update_Public( item, checked, delegator ); } );
	else								pub = new MMList_Column_Checkbox(		'Public', 'pub', 'QuoteNote_Public' );

	var columnlist =
	[
		pub,
		new MMList_Column_Numeric( 'Note #', 'id' )
			.SetNavigationEnabled( true ),
		new MMList_Column_Numeric( 'Quote #', 'quote_id' ),
		new MMList_Column_ViewableTextArea( 'Notes', 'Notes', 'notetext', 'Notes', false ),
		new MMList_Column_MappedTextValues( 'Source', 'source', [ 'A', 'C' ], [ 'Administrator', 'Customer' ], '' ),
		new MMList_Column_Name( 'User', 'user' ),
		new MMList_Column_DateTime( 'Date', 'dtstamp' )
	];

	return columnlist;
}
