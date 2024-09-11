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

// Quote Custom Field List
////////////////////////////////////////////////////

function Quote_CustomFieldList()
{
	this.can_modify = CanI( 'SUTL', 0, 0, 1, 0 );

	MMList.call( this, 'mm_quotecustomfieldlist' );

	this.branch_options = this.AddBranch( this.CreateColumnList_Options(), 'options' );

	if ( this.can_modify )
	{
		this.Feature_DisplayOrder_Enable( 'disp_order', 'CustomField_Order' );
		this.Branch_SetDisplayOrderPrefix( this.branch_options, 'CustomFieldOption_Order' );

		this.Feature_Add_Enable( 'Add Custom Field', 'Save Custom Field', 'Add Custom Field Option', 'Cancel', 'Add Custom Field', '', 'Add Option', '' );
		this.Feature_Edit_Enable( 'Edit Custom Fields(s)', 'Save Custom Fields(s)' );
		this.Feature_Delete_Enable( 'Delete Custom Field(s)' );

		this.Feature_Add_RowSupportsChildren_AddHook( this.RowSupportsChildren_Hook );

		this.Branch_SetCreateFunction( this.branch_options, this.Option_Create );
		this.Branch_SetInsertFunction( this.branch_options, this.Option_Insert );
		this.Branch_SetSaveFunction( this.branch_options, this.Option_Save );
		this.Branch_SetDeleteFunction( this.branch_options, this.Option_Delete );
		this.Branch_SetFindIndex_ParamsFunction( this.branch_options, this.Option_FindIndex_Params );
		this.Branch_SetFindIndex_CompareFunction( this.branch_options, this.Option_FindIndex_Compare );
	}

	this.Feature_Selection_OnChange_AddHook( this.QuoteCustomFieldList_Selection_OnChange );
	this.Feature_Controls_SetSearchPlaceholderText( 'Search Custom Fields...' );
	this.SetDefaultSort( 'disp_order' );
}

DeriveFrom( MMList, Quote_CustomFieldList );

Quote_CustomFieldList.prototype.onLoad = QuoteCustomFieldList_Load_Query;

Quote_CustomFieldList.prototype.onCreate = function()
{
	var record;

	record				= new Object();
	record.code			= '';
	record.prompt		= '';
	record.type			= 'radio';
	record.required		= false;
	record.default_opt	= false;

	return record;
}

Quote_CustomFieldList.prototype.onInsert = function( item, callback, delegator )
{
	QuoteCustomField_Insert( item.record.mmlist_fieldlist, callback, delegator );
}

Quote_CustomFieldList.prototype.onSave = function( item, callback, delegator )
{
	var self = this;
	var original_callback;

	if ( ( item.original_record.type == 'radio' || item.original_record.type == 'select' ) && ( item.record.type != 'radio' && item.record.type != 'select' ) )
	{
		original_callback	= callback;
		callback			= function( response )
		{
			var i, i_len, child_item, removelist;

			if ( response.success )
			{
				removelist = new Array();

				for ( i = 0, i_len = item.child_indices.length; i < i_len; i++ )
				{
					if ( ( child_item = self.GetListItem( item.child_indices[ i ] ) ) !== null )
					{
						removelist.push( child_item );
					}
				}

				for ( i = 0, i_len = removelist.length; i < i_len; i++ )
				{
					self.DeleteListItem( removelist[ i ] );
				}

				item.child_indices = new Array();
			}

			original_callback( response );
		}
	}

	QuoteCustomField_Update( item.record.id, item.record.mmlist_fieldlist, callback, delegator );
}

Quote_CustomFieldList.prototype.onSetDisplayOrder = function( recordlist, start_index )
{
	var i, i_len, j, j_len;

	for ( i = 0, i_len = recordlist.length; i < i_len; i++ )
	{
		this.Feature_DisplayOrder_SetRecordOrder( recordlist[ i ], start_index + i + 1 );

		if ( recordlist[ i ] && recordlist[ i ].options )
		{
			for ( j = 0, j_len = recordlist[ i ].options.length; j < j_len; j++ )
			{
				this.Feature_DisplayOrder_SetRecordOrder( recordlist[ i ].options[ j ], j + 1 );
			}
		}
	}
}

Quote_CustomFieldList.prototype.onDisplayOrderSave = function( fieldlist, callback )
{
	QuoteCustomField_DisplayOrder_Update( fieldlist, callback );
}

Quote_CustomFieldList.prototype.onDelete = function( item, callback, delegator )
{
	QuoteCustomField_Delete( item.record.id, callback, delegator );
}

Quote_CustomFieldList.prototype.onFindIndex_Params = function( item )
{
	return { 'Code': item && item.record ? item.record.code : '' };
}

Quote_CustomFieldList.prototype.onFindIndex_Compare = function( item, params )
{
	if ( item && item.record && item.record.code == params[ 'Code' ] )
	{
		return true;
	}

	return false;
}

Quote_CustomFieldList.prototype.QuoteCustomFieldList_Selection_OnChange = function()
{
	var item;

	if ( this.Feature_Add_GetAction_Child() && this.SingleRecordSelected() )
	{
		if ( ( item = this.ActiveItemList_ItemAtIndex( 0 ) ) !== null && item.record.type != 'radio' && item.record.type != 'select' )
		{
			this.Feature_Add_GetAction_Child().Disable();
		}
	}
}

Quote_CustomFieldList.prototype.RowSupportsChildren_Hook = function( item )
{
	if ( !item || !item.record )
	{
		return false;
	}

	return item.record.type == 'radio' || item.record.type == 'select';
}

Quote_CustomFieldList.prototype.Option_Create = function()
{
	var record;

	record				= new Object();
	record.code			= '';
	record.prompt		= '';
	record.default_opt	= false;

	return record;
}

Quote_CustomFieldList.prototype.Option_Insert = function( item, callback, delegator )
{
	var customfield_record;

	if ( ( customfield_record = this.GetListItemRecord_Parent( item.index ) ) == null )
	{
		return this.onError( 'Custom field record not found' );
	}

	QuoteCustomFieldOption_Insert( customfield_record.id, item.record.mmlist_fieldlist, callback, delegator );
}

Quote_CustomFieldList.prototype.Option_Save = function( item, callback, delegator )
{
	QuoteCustomFieldOption_Update( item.record.id, item.record.mmlist_fieldlist, callback, delegator );
}

Quote_CustomFieldList.prototype.Option_Delete = function( item, callback, delegator )
{
	QuoteCustomFieldOption_Delete( item.record.id, callback, delegator );
}

Quote_CustomFieldList.prototype.Option_FindIndex_Params = function( item )
{
	var customfield_record;

	customfield_record = this.GetListItemRecord_Parent( item.index );

	return { 'CustomField_ID': customfield_record ? customfield_record.id : '' };
}

Quote_CustomFieldList.prototype.Option_FindIndex_Compare = function( item, params )
{
	var customfield_record;

	customfield_record = this.GetListItemRecord_Parent( item.index );

	return item.record && customfield_record && ( customfield_record.id == params[ 'CustomField_ID' ] );
}

Quote_CustomFieldList.prototype.onGetRecordID = function( record )
{
	var id = 'ID:' + ( record ? record.id : 0 );

	if ( record && record.hasOwnProperty( 'field_id' ) )
	{
		id += ':FIELD_ID:' + record.field_id;
	}

	return id;
}

Quote_CustomFieldList.prototype.onRetrieveChildBranch = function( item )
{
	if ( !item || !item.root )
	{
		return null;
	}

	return item.branch.children[ 'options' ];
}

Quote_CustomFieldList.prototype.onProcessLoadedData = function( recordlist, start_index )
{
	var i, j, index, root_index;

	index = start_index;

	for ( i = 0; i < recordlist.length; i++ )
	{
		root_index = index;
		this.ItemList_CreateInsertAtIndex( recordlist[ i ], index++, -1, this.branch_root );

		if ( recordlist[ i ].options )
		{
			for ( j = 0; j < recordlist[ i ].options.length; j++ )
			{
				this.ItemList_CreateInsertAtIndex( recordlist[ i ].options[ j ], index++, root_index, this.branch_options );
			}
		}
	}
}

Quote_CustomFieldList.prototype.ColumnNoDisplay_Data = function( record )
{
	return newElement( 'div', null, null, null );
}

Quote_CustomFieldList.prototype.onCreateRootColumnList = function()
{
	this.rootcolumn_disp_order	= new MMList_Column( 'Display Order', 'disp_order' )
										.SetSortByField( 'disp_order' )
										.SetSearchable( false )
										.SetDisplayInList( false );
	this.rootcolumn_code 		= new MMList_Column_Code( 'Code', 'code', 'Code' )
										.SetAdvancedSearchEnabled( false )
										.SetContentAttributeList( { 'class': 'mm_list_level_col' } );
	this.rootcolumn_prompt		= new MMList_Column_Name( 'Prompt', 'prompt', 'Prompt' )
										.SetAdvancedSearchEnabled( false )
										.SetContentAttributeList( { 'class': 'mm_list_level_col' } );
	this.rootcolumn_type		= new MMList_Column_MappedTextValues( 'Type', 'type', [ 'radio', 'select', 'checkbox', 'text', 'memo' ], [ 'Radio Buttons', 'Drop-down List', 'Checkbox', 'Text Field', 'Text Area' ], 'Type' );
	this.rootcolumn_required	= new MMList_Column_Checkbox( 'Required', 'required', 'Required' )
										.SetHeaderStyleList( { 'text-align': 'center', 'font-weight': 'bold', 'width': '40px', 'minWidth': '35px' } )
										.SetContentAttributeList( { 'class': 'mm_list_data_col_noellipsize' } )
										.SetContentStyleList( { 'text-align': 'center' } );
	this.rootcolumn_default		= new MMList_Column_Checkbox( 'Default', 'default_opt', '' )
										.SetSearchable( false )
										.SetSortByField( '' )
										.SetHeaderStyleList( { 'text-align': 'center', 'font-weight': 'bold', 'width': '40px', 'minWidth': '35px' } )
										.SetContentAttributeList( { 'class': 'mm_list_data_col_noellipsize' } )
										.SetContentStyleList( { 'text-align': 'center' } )
										.SetOnDisplayData( this.ColumnNoDisplay_Data )
										.SetOnDisplayEdit( this.ColumnNoDisplay_Data );

	var columnlist =
	[
		/* Advanced Search Columns */
		new MMList_Column_Code( 'Field Code', 'cf_code' )
				.SetDisplayInList( false ),
		new MMList_Column_Name( 'Field Prompt', 'cf_prompt' )
				.SetDisplayInList( false ),
		new MMList_Column_Code( 'Option Code', 'cf_opt_code' )
				.SetDisplayInList( false ),
		new MMList_Column_Name( 'Option Prompt', 'cf_opt_prompt' )
				.SetDisplayInList( false ),

		/* Normal Columns */
		this.rootcolumn_disp_order,
		this.rootcolumn_code,
		this.rootcolumn_prompt,
		this.rootcolumn_type,
		this.rootcolumn_required,
		this.rootcolumn_default
	];

	return columnlist;
}

Quote_CustomFieldList.prototype.CreateColumnList_Options = function()
{
	const self = this;

	var columnlist =
	[
		new MMList_Column_Code( 'Code', 'code', 'Option_Code' )
			.SetRootColumn( this.rootcolumn_code )
			.SetContentAttributeList( { 'class': 'mm_list_level_col' } ),
		new MMList_Column_Name( 'Prompt', 'prompt', 'Option_Prompt' )
			.SetRootColumn( this.rootcolumn_prompt )
			.SetContentAttributeList( { 'class': 'mm_list_level_col' } ),
		new MMList_Column_Checkbox( 'Default', 'default_opt', 'Option_Default' )
			.SetContentAttributeList( { 'class': 'mm_list_data_col_noellipsize' } )
			.SetContentStyleList( { 'text-align': 'center' } )
			.SetOnDisplayEdit( function( record, item ) { return self.ColumnDefault_Edit( record, item ); } )
			.SetRootColumn( this.rootcolumn_default )
	];

	return columnlist;
}

Quote_CustomFieldList.prototype.ColumnDefault_Edit = function( record, item )
{
	const self = this;
	var div, button;

	if ( !record.id )
	{
		return DrawMMListCheckbox_Edit( record.default_opt, 'default_opt', 'Yes', '' );
	}

	div		= newElement( 'div', null, null, null );
	button	= new MMButton( div );

	button.SetText( record.default_opt ? 'Unset' : 'Set' );
	button.SetClassName( 'mm10_button_style_alternative_1 mm_list_column_textarea_button' );
	button.SetOnClickHandler( function( e )
	{
		var is_default = !item.record.default_opt;

		QuoteCustomFieldOption_Set_Default( item.record.id, is_default, function( response )
		{
			if ( !response.success )
			{
				return Modal_Alert( response.error_message );
			}

			if ( item !== null )
			{
				item.record.default_opt = is_default;
				self.ItemRecord_UpdateOriginalRecord( item, null );
			}

			self.ApplyToSiblings( item, function( sibling_item )
			{
				sibling_item.record.default_opt = false;
				self.ItemRecord_UpdateOriginalRecord( sibling_item, null );
			} );

			self.ReBindVisibleRows();
		} );
	} );

	return div;
}
