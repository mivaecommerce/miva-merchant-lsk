// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2022 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// Custom Field List
////////////////////////////////////////////////////

function CustomFieldList()
{
	var action_add;

	MMList.call( this, 'mm_list_customfieldlist' );

	if ( CanI( 'SUTL', 0, 0, 1, 0 ) )
	{
		action_add = this.Feature_Controls_Create_Action( 'New Custom Field', '', this.Add );
		this.Feature_Controls_SetPrimary_Action( action_add );

		this.Feature_EditDialog_Enable( 'Edit Custom Field' );
		this.Feature_Delete_Enable( 'Delete Custom Field(s)' );
	}

	this.Feature_Controls_SetSearchPlaceholderText( 'Search Custom Fields...' );
	this.SetDefaultSort( 'code' );
}

DeriveFrom( MMList, CustomFieldList );

CustomFieldList.prototype.onLoad = CustomFieldList_Load_Query;

CustomFieldList.prototype.Add = function()
{
	var self = this;
	var customfieldadd;

	customfieldadd			= new CustomField_AddEditDialog( null );
	customfieldadd.onsave	= function() { self.Refresh(); }

	customfieldadd.Show();
}

CustomFieldList.prototype.onDelete = function( item, callback, delegator )
{
	CustomField_Delete( item.record.id, item.record.type, callback, delegator );
}

CustomFieldList.prototype.onEdit = function( item )
{
	var self = this;
	var customfieldedit;

	customfieldedit				= new CustomField_AddEditDialog( item.record, true );
	customfieldedit.onsave		= function() { self.Refresh(); }
	customfieldedit.ondelete	= function() { self.Refresh(); }

	customfieldedit.Show();
}

CustomFieldList.prototype.onCreateRootColumnList = function()
{
	var columnlist =
	[
		new MMList_Column_Code( 'Code', 'code' ),
		new MMList_Column_Name( 'Name', 'name' )
			.SetNavigationEnabled( true ),
		new CustomFieldList_Column_Group( 'Group' ),
		new MMList_Column_MappedTextValues( 'Field Type', 'fieldtype', [ 'textfield', 'textarea', 'radio', 'dropdown', 'checkbox', 'imageupload', 'pdfupload', 'multitext' ], [ 'Text Field', 'Text Area', 'Radio', 'Drop-Down List', 'Checkbox', 'Image Upload', 'PDF Upload', 'Multi-Text' ] ),
		new MMList_Column_MappedTextValues( 'Type', 'type', [ 'category', 'customer', 'order', 'page', 'product' ], [ 'Category', 'Customer', 'Order', 'Page', 'Product' ] ),
		new MMList_Column_Name( 'Additional Information', 'info' ),
		new MMList_Column_Text( 'Facet', 'facet' )
			.SetSearchable( false )
			.SetOnDisplayData( function( record ) { return record.type == 'product' ? DrawMMListCheckbox_Data( this.onRetrieveValue( record ) ) : DrawMMListString_Data( 'N/A' ); } ),
		new MMList_Column_Checkbox( 'Public', 'is_public' )
			.SetDefaultActive( false )
	];

	return columnlist;
}

// CustomFieldList_Column_Group
////////////////////////////////////////////////////

function CustomFieldList_Column_Group( header_text )
{
	MMList_Column_Text.call( this, header_text, 'group' );

	this.groups_loaded = false;

	this.SetOnDisplayData( function( record ) { return DrawMMListString_Data( record.formatted_group ); } );
	this.SetOnExportData( function( record ) { return record.formatted_group; } );
}

DeriveFrom( MMList_Column_Text, CustomFieldList_Column_Group );

CustomFieldList_Column_Group.prototype.onAdvancedSearch_Filter_AddOptions = function()
{
	var self = this;

	this.groups_loaded = false;

	this.AdvancedSearch_Filter_Empty();
	this.AdvancedSearch_Filter_Disable();

	this.AdvancedSearch_Filter_AddOption( 'Loading...', '' );

	CustomFieldGroupList_Load_Query( '', 'name', 0, 0, function( response ) { self.CustomFieldGroupList_Load_Callback( response ); } );
}

CustomFieldList_Column_Group.prototype.CustomFieldGroupList_Load_Callback = function( response )
{
	var i, i_len;

	this.groups_loaded = true;

	this.AdvancedSearch_Filter_Empty();
	this.AdvancedSearch_Filter_Enable();

	this.AdvancedSearch_Filter_AddOption( '<Select One>', '' );
	this.AdvancedSearch_Filter_AddOption( '<Default>',	0 );

	if ( response.success )
	{
		for ( i = 0, i_len = response.data.data.length; i < i_len; i++ )
		{
			this.AdvancedSearch_Filter_AddOption( response.data.data[ i ].name,	response.data.data[ i ].id );
		}
	}
}

CustomFieldList_Column_Group.prototype.onAdvancedSearch_ConstructValue = function()
{
	return this.AdvancedSearch_ConstructValue_Empty();
}

CustomFieldList_Column_Group.prototype.onAdvancedSearch_GetFilter = function()
{
	return [ new MMList_Filter_Search_Value( 'group_id', 'EQ', this.AdvancedSearch_Filter_GetValue() ) ];
}

CustomFieldList_Column_Group.prototype.onAdvancedSearch_RestoreInitializing = function()
{
	return !this.groups_loaded;
}
