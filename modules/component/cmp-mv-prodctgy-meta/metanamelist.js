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

// METAName List
////////////////////////////////////////////////////

function METAName_List()
{
	MMList.call( this, 'mm_list_metanamelist' );

	if ( CanI( 'PAGE', 0, 0, 1, 0 ) )
	{
		this.Feature_Add_Enable( 'Add META Name', 'Save META Name', '', 'Cancel', '', '', '', '' );
		this.Feature_Edit_Enable( 'Edit META Name(s)', 'Save META Name(s)' );
		this.Feature_Delete_Enable( 'Delete META Name(s)' );
	}

	this.Feature_Controls_SetSearchPlaceholderText( 'Search META Names...' );
	this.SetDefaultSort( 'name' );
}

DeriveFrom( MMList, METAName_List );

METAName_List.prototype.onLoad = METANameList_Load_Query;

METAName_List.prototype.onCreate = function()
{
	return { 'name': '', 'prompt': '', 'type': 'text' };
}

METAName_List.prototype.onInsert = function( item, callback, delegator )
{
	this.SetDelegatorCallback( delegator );
	METAName_Insert( item.record.mmlist_fieldlist, callback, delegator );
}

METAName_List.prototype.onSave = function( item, callback, delegator )
{
	this.SetDelegatorCallback( delegator );
	METAName_Update( item.record.id, item.record.mmlist_fieldlist, callback, delegator );
}

METAName_List.prototype.onDelete = function( item, callback, delegator )
{
	this.SetDelegatorCallback( delegator );
	METAName_Delete( item.record.id, callback, delegator );
}

METAName_List.prototype.onDeleteConfirmationMessage = function()
{
	return 'META Tag Settings are shared across all branches. Deleting will remove the selected META Tag Setting(s) from all branches, including production.\n\nAre you sure you wish to delete ' + ( this.ActiveItemList_Count() > 1 ? ( this.ActiveItemList_Count() + ' records?' ) : '1 record?' );
}

METAName_List.prototype.SetDelegatorCallback = function( delegator )
{
	if ( delegator && !delegator.original_oncomplete )
	{
		delegator.original_oncomplete	= delegator.onComplete;
		delegator.onComplete			= function()
		{
			if ( typeof delegator.original_oncomplete === 'function' )
			{
				delegator.original_oncomplete();
			}

			SetForceResetNextLoad();
		}
	}
}

METAName_List.prototype.onCreateRootColumnList = function()
{
	var columnlist =
	[
		new MMList_Column_Name(			'META "name"',	'name',		'METAName_Name' ),
		new MMList_Column_Name(			'Prompt',		'prompt',	'METAName_Prompt' ),
		new METANameList_Column_Type(	'Type',			'type',		'METAName_Type' )
	];

	return columnlist;
}

// METAName Type Column 
////////////////////////////////////////////////////

function METANameList_Column_Type( header_text, code, fieldname )
{
	var self = this;

	MMList_Column_Text.call( this, header_text, code, fieldname );

	this.SetOnDisplayData( function( record ) { return self.Display_Data( record ); } );
	this.SetOnDisplayEdit( function( record ) { return self.Display_Edit( record ); } );
}

DeriveFrom( MMList_Column_Text, METANameList_Column_Type );

METANameList_Column_Type.prototype.Display_Data = function( record )
{
	switch ( record.type )
	{
		case 'textarea'	: return DrawMMListString_Data( 'Text Area' );
		case 'text'		: return DrawMMListString_Data( 'Text Field' );
	}

	return DrawMMListString_Data( record.type );
}

METANameList_Column_Type.prototype.Display_Edit = function( record )
{
	var select;
	
	select				= newElement( 'select', { 'name': 'type' }, null, null );
	select.options[ 0 ]	= new Option( 'Text Field',	'text' );
	select.options[ 1 ]	= new Option( 'Text Area',	'textarea' );

	switch ( record.type )
	{
		case 'text'		: select.selectedIndex = 0;	break;
		case 'textarea'	: select.selectedIndex = 1;	break;
	}

	return select;
}

METANameList_Column_Type.prototype.onAdvancedSearch_Filter_AddOptions = function()
{
	this.AdvancedSearch_Filter_AddOption( 'Equal To',		'EQ' );
	this.AdvancedSearch_Filter_AddOption( 'Not Equal To',	'NE' );
}

METANameList_Column_Type.prototype.onAdvancedSearch_ConstructValue = function()
{
	return this.AdvancedSearch_ConstructValue_Select();
}

METANameList_Column_Type.prototype.AdvancedSearch_ConstructValue_Select_OnPopulate = function( select )
{
	select.AddOption( 'Text Field',	'text' );
	select.AddOption( 'Text Area',	'textarea' );
}
