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

// CSSUI Message List 
////////////////////////////////////////////////////

function CSSUIMessageList()
{
	MMList.call( this, 'mm_list_cssuimessagelist' );

	this.restoredefault_errors	= false;

	if ( CanI( 'PAGE', 0, 0, 1, 0 ) )
	{
		this.Feature_Add_Enable( 'Add Message', 'Save Message' );
		this.Feature_Edit_Enable( 'Edit Message(s)', 'Save Message(s)' );
		this.Feature_Delete_Enable( 'Delete Message(s)' );

		this.button_restoredefault			= this.Feature_Selection_Create_Action( 'Restore', 'Restore to Default Message', this.onRestoreDefault );
		this.button_restoredefault_cancel	= this.Feature_Selection_Create_Action( 'Cancel', '', this.onRestoreDefaultCancel );

		this.Feature_Selection_SetPrimary_Action( this.button_restoredefault );
	}

	this.OnEnableDisableActions_AddHook( this.ActionBar_EnableDisable );
	this.Feature_Controls_SetSearchPlaceholderText( 'Search Messages...' );
	this.SetDefaultSort( 'method', '' );
}

DeriveFrom( MMList, CSSUIMessageList );

CSSUIMessageList.prototype.ActionBar_EnableDisable = function()
{
	var i, active_count, item, visible;

	if ( this.restoredefault_errors )
	{
		this.button_restoredefault.Hide();
		this.button_restoredefault_cancel.Show();

		if ( this.Feature_Edit_GetAction_Edit() )	this.Feature_Edit_GetAction_Edit().Hide();
		if ( this.Feature_Delete_GetAction() )		this.Feature_Delete_GetAction().Hide();

		return;
	}

	active_count	= this.ActiveItemList_Count();

	if ( this.Feature_Edit_GetAction_Edit() )
	{
		if ( active_count )							this.Feature_Edit_GetAction_Edit().Show();
		else										this.Feature_Edit_GetAction_Edit().Hide();
	}

	if ( this.Feature_Delete_GetAction() )
	{
		if ( active_count )							this.Feature_Delete_GetAction().Show();
		else										this.Feature_Delete_GetAction().Hide();
	}

	if ( this.button_restoredefault_cancel )		this.button_restoredefault_cancel.Hide();

	if ( this.button_restoredefault )
	{
		visible		= active_count > 0 ? true : false;

		for ( i = 0; i < active_count; i++ )
		{
			item	= this.ActiveItemList_ItemAtIndex( i );

			if ( item.record.templ_id == 0 )
			{
				visible	= false;
				break;
			}
		}

		if ( visible )	this.button_restoredefault.Show();
		else			this.button_restoredefault.Hide();
	}
}

CSSUIMessageList.prototype.onLoad = CSSUIMessageList_Load_Query;

CSSUIMessageList.prototype.onCreate = function()
{
	var record;

	record					= new Object();
	record.type				= 'E';
	record.message			= '';
	record.template_source	= '';

	return record;
}

CSSUIMessageList.prototype.onInsert = function( item, callback, delegator )
{
	CSSUIMessage_Insert( item.record.mmlist_fieldlist, callback, delegator );
}

CSSUIMessageList.prototype.onSave = function( item, callback, delegator )
{
	CSSUIMessage_Update( item.record.id, item.record.mmlist_fieldlist,
						 function( response )
						 {
							 if ( response.success )
							 {
								 item.record.templ_id = response.data.templ_id;
							 }

							 callback( response );
						 },
						 delegator );
}

CSSUIMessageList.prototype.onDelete = function( item, callback, delegator )
{
	CSSUIMessage_Delete( item.record.id, callback, delegator );
}

CSSUIMessageList.prototype.onDeleteConfirmationMessage = function()
{
	return 'Messages are shared across all branches. Deleting will remove the selected Message(s) from all branches, including production.\n\nAre you sure you wish to delete ' + ( this.ActiveItemList_Count() > 1 ? ( this.ActiveItemList_Count() + ' records?' ) : '1 record?' );
}

CSSUIMessageList.prototype.onRestoreDefault = function()
{
	var self = this;
	var i, item, delegator;

	this.processing_dialog.SetCancel_Disabled();
	this.processing_dialog.Show( null, 'Restoring' );

	delegator				= new AJAX_ThreadPool( 3 );
	delegator.onComplete	= function()
	{
		self.processing_dialog.Hide();

		item						= self.ErrorItemList_ItemAtIndex( 0 );
		self.restoredefault_errors	= item == null ? false : true;

		self.Resize();
		self.ReBindVisibleRows();

		if ( item !== null && !self.IndexIsFullyVisible( item.index ) )
		{
			self.ScrollToIndex( item.index );
		}
	};

	for ( i = 0; i < this.ActiveItemList_Count(); i++ )
	{
		item	= this.ActiveItemList_ItemAtIndex( i );
		if ( item.record.templ_id )
		{
			this.Restore_Default( this.ActiveItemList_ItemAtIndex( i ), delegator );
		}
	}

	setTimeout( function() { delegator.Run(); }, 0 );
}

CSSUIMessageList.prototype.onRestoreDefaultCancel = function()
{
	this.restoredefault_errors	= false;

	RemoveModified();
	this.ErrorItemList_Empty();
	this.Refresh();
}

CSSUIMessageList.prototype.Restore_Default = function( item, delegator )
{
	var self = this;

	CSSUIMessage_Restore_Default( item.record.id, function( response )
	{
		if ( !response.success )
		{
			return self.Record_Update_Error( response, item );
		}

		item.record.templ_id		= 0;
		item.record.template_source	= '';

		self.ItemRecord_UpdateOriginalRecord( item, null );
	}, delegator );
}

CSSUIMessageList.prototype.onCreateRootColumnList = function()
{
	var columnlist =
	[
		new CSSUIMessageList_Column_Type( 'Type',	'type',				'Type' ),
		new MMList_Column_Name( 'Message',			'message',			'Message' ),
		new MMList_Column_Name( 'Replacement',		'template_source',	'Template_Source' )
	];

	return columnlist;
}

// CSSUI Message Type Column
////////////////////////////////////////////////////

function CSSUIMessageList_Column_Type( header_text, code, fieldname )
{
	var self = this;

	MMList_Column_Text.call( this, header_text, code, fieldname );

	this.SetOnDisplayData( function( record ) { return self.Display_Data( record ); } );
	this.SetOnDisplayEdit( function( record ) { return self.Display_Edit( record ); } );
}

DeriveFrom( MMList_Column_Text, CSSUIMessageList_Column_Type );

CSSUIMessageList_Column_Type.prototype.Display_Data = function( record )
{
	switch ( record.type )
	{
		case 'E' : return DrawMMListString_Data( 'Error' );
		case 'I' : return DrawMMListString_Data( 'Information' );
	}

	return DrawMMListString_Data( record.type );
}

CSSUIMessageList_Column_Type.prototype.Display_Edit = function( record )
{
	var select;
	
	select				= newElement( 'select', { 'name': 'type' }, null, null );
	select.options[ 0 ]	= new Option( 'Error',			'E' );
	select.options[ 1 ]	= new Option( 'Information',	'I' );

	switch ( record.type )
	{
		case 'E' : select.selectedIndex	= 0;	break;
		case 'I' : select.selectedIndex = 1;	break;
	}

	return select;
}

CSSUIMessageList_Column_Type.prototype.onAdvancedSearch_Filter_AddOptions = function()
{
	this.AdvancedSearch_Filter_AddOption( 'Equal To',		'EQ' );
	this.AdvancedSearch_Filter_AddOption( 'Not Equal To',	'NE' );
}

CSSUIMessageList_Column_Type.prototype.onAdvancedSearch_ConstructValue = function()
{
	return this.AdvancedSearch_ConstructValue_Select();
}

CSSUIMessageList_Column_Type.prototype.AdvancedSearch_ConstructValue_Select_OnPopulate = function( select )
{
	select.AddOption( 'Error',			'E' );
	select.AddOption( 'Information',	'I' );
}
