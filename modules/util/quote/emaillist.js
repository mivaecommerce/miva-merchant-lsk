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

// Quote Email List
////////////////////////////////////////////////////

function Quote_EmailList()
{
	var action;

	this.can_modify = CanI( 'SUTL', 0, 0, 1, 0 );

	MMList.call( this, 'mm_quoteemaillist' );

	this.Feature_EditDialog_Enable( 'Edit Quote Email' );

	if ( CanI( 'PAGE', 1, 0, 0, 0 ) )
	{
		action = this.Feature_Selection_Create_Action_SingleSelect( 'Edit Template', 'Edit Template', this.EditTemplate );
		this.Feature_Selection_SetPrimary_Action( action );
	}

	this.Feature_Controls_SetSearchPlaceholderText( 'Search Quote Emails...' );
	this.SetDefaultSort( 'name' );
}

DeriveFrom( MMList, Quote_EmailList );

Quote_EmailList.prototype.onLoad = QuoteEmailList_Load_Query;

Quote_EmailList.prototype.onEdit = function( item )
{
	var self = this;
	var dialog;

	dialog 			= new Quote_EmailEditDialog( item.record );
	dialog.onsave	= function() { self.Refresh(); };
	dialog.Show();
}

Quote_EmailList.prototype.onCreateRootColumnList = function()
{
	var self = this;
	var enabled_column;

	if ( this.can_modify )	enabled_column = new MMList_Column_CheckboxSlider(	'Enabled', 'enabled', '', function( item, checked, delegator ) { self.Update_Enabled( item, checked, delegator ); } );
	else					enabled_column = new MMList_Column_Checkbox(		'Enabled', 'enabled', '' );

	var columnlist =
	[
		enabled_column
			.SetSortByField( '' )
			.SetSearchable( false ),
		new MMList_Column_Name( 'Name', 'name', '' )
			.SetNavigationEnabled( true )
	];

	return columnlist;
}

Quote_EmailList.prototype.EditTemplate = function( item, e )
{
	return OpenLinkHandler( e, adminurl, { 'Screen': 'PAGE', 'Store_Code': Store_Code, 'Edit_Page': item.record.page_code } );
}

Quote_EmailList.prototype.Update_Enabled = function( item, checked, delegator )
{
	var self = this;

	QuoteEmail_Update_Enabled( item.record.code, checked, function( response )
	{
		if ( !response.success )
		{
			self.Record_Update_Error( response, item );
			self.ReBindVisibleRows();

			return;
		}

		item.record.enabled = checked;

		self.ItemRecord_UpdateOriginalRecord( item, null );
		self.ReBindVisibleRows();
	}, delegator );
}
