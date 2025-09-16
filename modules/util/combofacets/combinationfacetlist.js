// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2025 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// Combination Facet List
////////////////////////////////////////////////////

function CombinationFacetList()
{
	this.can_modify		= CanI( 'SUTL', 0, 0, 1, 0 );

	MMBatchList.call( this, 'mm9_batchlist_combinationfacetlist' );

	this.branch_fields	= this.AddBranch( this.CreateColumnList_Fields(),	'fields' );

	this.Branch_SetFindIndex_ParamsFunction( this.branch_fields, this.Field_FindIndex_Params );
	this.Branch_SetFindIndex_CompareFunction( this.branch_fields, this.Field_FindIndex_Compare );

	if ( this.can_modify )
	{
		this.Feature_DisplayOrder_Enable( 'disp_order', 'CombinationFacet_Order' );
		this.Branch_SetDisplayOrderPrefix( this.branch_fields, 'CombinationFacetField_Order' );

		this.Branch_SetCreateFunction( this.branch_fields, this.Field_Create );
		this.Branch_SetInsertFunction( this.branch_fields, this.Field_Insert );
		this.Branch_SetSaveFunction( this.branch_fields, this.Field_Save );
		this.Branch_SetDeleteFunction( this.branch_fields, this.Field_Delete );

		this.Feature_Add_Enable( 'Add Combination Facet', 'Save Combination Facet', 'Add Combination Facet Field', 'Cancel', 'Add Facet', '', 'Add Field', '' );
		this.Feature_Edit_Enable( 'Edit Combination Facet(s)', 'Save Combination Facet(s)' );
		this.Feature_Delete_Enable( 'Delete Combination Facet(s)' );

		this.Feature_RowDoubleClick_Enable();
		this.Feature_Buttons_EnableDisableButtons_AddHook( this.EnableDisableButtons_AddHook );
	}

	this.Feature_SearchBar_SetPlaceholderText( 'Search Combination Facets...' );
	this.SetDefaultSort( 'disp_order', '' );
}

DeriveFrom( MMBatchList, CombinationFacetList );

CombinationFacetList.prototype.onLoad = CombinationFacetAndFieldList_Load_Query;

CombinationFacetList.prototype.onProcessLoadedData = function( recordlist, start_index )
{
	var i, j, index, root_index;

	index = start_index;

	for ( i = 0; i < recordlist.length; i++ )
	{
		root_index = index;
		this.ItemList_CreateInsertAtIndex( recordlist[ i ], index++, -1, this.branch_root );

		if ( !recordlist[ i ].fields )
		{
			continue;
		}

		for ( j = 0; j < recordlist[ i ].fields.length; j++ )
		{
			this.ItemList_CreateInsertAtIndex( recordlist[ i ].fields[ j ], index++, root_index, this.branch_fields );
		}
	}
}

CombinationFacetList.prototype.onSetDisplayOrder = function( recordlist, start_index )
{
	var i, i_len, j, j_len;

	for ( i = 0, i_len = recordlist.length; i < i_len; i++ )
	{
		this.Feature_DisplayOrder_SetRecordOrder( recordlist[ i ], start_index + i + 1 );

		if ( recordlist[ i ] )
		{
			if ( !recordlist[ i ].fields )
			{
				continue;
			}

			for ( j = 0, j_len = recordlist[ i ].fields.length; j < j_len; j++ )
			{
				this.Feature_DisplayOrder_SetRecordOrder( recordlist[ i ].fields[ j ], j + 1 );
			}
		}
	}
}

CombinationFacetList.prototype.onDisplayOrderSave = function( fieldlist, callback )
{
	CombinationFacetList_DisplayOrder_Update( fieldlist, callback );
}

CombinationFacetList.prototype.EnableDisableButtons_AddHook = function()
{
	var item;

	if ( this.button_subrecordinlineadd_add )
	{
		this.button_subrecordinlineadd_add.Disable();

		if ( this.SingleRecordSelected() )
		{
			if ( ( item = this.ActiveItemList_ItemAtIndex( 0 ) ) != null )
			{
				if ( item.branch.level == 1 )
				{
					this.button_subrecordinlineadd_add.Enable();
				}
			}
		}
	}
}

CombinationFacetList.prototype.onRetrieveChildBranch = function( item )
{
	if ( !item || !item.root )
	{
		return null;
	}

	return item.branch.children[ 'fields' ];
}

CombinationFacetList.prototype.onFindIndex_Params = function( item )
{
	return { 'Facet_Code': item && item.record ? item.record.code : '' };
}

CombinationFacetList.prototype.onFindIndex_Compare = function( item, params )
{
	if ( item && item.record && item.record.code == params[ 'Facet_Code' ] )
	{
		return true;
	}

	return false;
}

CombinationFacetList.prototype.onCreate = function()
{
	var record;

	record				= new Object();
	record.id			= 0;
	record.enabled		= true;
	record.code			= '';
	record.name			= '';
	record.fields		= new Array();
	record.inclother	= false;
	record.createfit	= true;
	record.fitlistpub	= false;
	record.variantsrc	= 'master';

	return record;
}

CombinationFacetList.prototype.onInsert = function( item, callback, delegator )
{
	CombinationFacet_Insert( item.record.mmbatchlist_fieldlist, callback, delegator );
}

CombinationFacetList.prototype.onSave = function( item, callback, delegator )
{
	CombinationFacet_Update_FieldList( item.record.id, item.record.mmbatchlist_fieldlist, callback, delegator );
}

CombinationFacetList.prototype.onDelete = function( item, callback, delegator )
{
	CombinationFacet_Delete( item.record.id, callback, delegator );
}

CombinationFacetList.prototype.Facet_Update_Enabled = function( item, checked, delegator )
{
	CombinationFacet_Update( item.record.id, { enabled: checked }, ( response ) =>
	{
		if ( !response.success )
		{
			this.Record_Update_Error( response, item );
			this.ReBindVisibleRows();

			return;
		}

		item.record.enabled = checked;

		this.ItemRecord_UpdateOriginalRecord( item, null );
		this.ReBindVisibleRows();
	}, delegator );
}

CombinationFacetList.prototype.Facet_Update_IncludeOtherProducts = function( item, checked, delegator )
{
	CombinationFacet_Update( item.record.id, { inclother: checked }, ( response ) =>
	{
		if ( !response.success )
		{
			this.Record_Update_Error( response, item );
			this.ReBindVisibleRows();

			return;
		}

		item.record.inclother = checked;

		this.ItemRecord_UpdateOriginalRecord( item, null );
		this.ReBindVisibleRows();
	}, delegator );
}

CombinationFacetList.prototype.Facet_Update_CreateFitmentIndicator = function( item, checked, delegator )
{
	CombinationFacet_Update( item.record.id, { createfit: checked }, ( response ) =>
	{
		if ( !response.success )
		{
			this.Record_Update_Error( response, item );
			this.ReBindVisibleRows();

			return;
		}

		item.record.createfit = checked;

		this.ItemRecord_UpdateOriginalRecord( item, null );
		this.ReBindVisibleRows();
	}, delegator );
}

CombinationFacetList.prototype.Facet_Update_FitmentListPublic = function( item, checked, delegator )
{
	CombinationFacet_Update( item.record.id, { fitlistpub: checked }, ( response ) =>
	{
		if ( !response.success )
		{
			this.Record_Update_Error( response, item );
			this.ReBindVisibleRows();

			return;
		}

		item.record.fitlistpub = checked;

		this.ItemRecord_UpdateOriginalRecord( item, null );
		this.ReBindVisibleRows();
	}, delegator );
}

CombinationFacetList.prototype.Field_FindIndex_Params = function( item )
{
	var method_record = this.GetListItemRecord_Parent( item.index );

	return { 'Field_ID': method_record ? method_record.id : '' };
}

CombinationFacetList.prototype.Field_FindIndex_Compare = function( item, params )
{
	var method_record = this.GetListItemRecord_Parent( item.index );

	if ( item.record && method_record && ( method_record.id == params[ 'Field_ID' ] ) )
	{
		return true;
	}

	return false;
}

CombinationFacetList.prototype.Field_Create = function()
{
	var record;

	record				= new Object();
	record.facet_id		= 0;
	record.code			= '';
	record.name			= '';
	record.sort_desc	= false;
	record.fitlist		= 'visible';

	return record;
}

CombinationFacetList.prototype.Field_Insert = function( item, callback, delegator )
{
	var facet_record, error;
	
	if ( ( facet_record = this.GetListItemRecord_Parent( item.index ) ) == null )
	{
		error							= new Object();
		error.validation_error			= true;
		error.error_field_message		= 'Facet record not found';
		error.error_field				= 'Code';

		return this.FieldError( error, item.row );
	}

	CombinationFacetField_Insert( facet_record.id, item.record.mmbatchlist_fieldlist, callback, delegator );
}

CombinationFacetList.prototype.Field_Save = function( item, callback, delegator )
{
	CombinationFacetField_Update( item.record.id, item.record.mmbatchlist_fieldlist, callback, delegator );
}

CombinationFacetList.prototype.Field_Delete = function( item, callback, delegator )
{
	CombinationFacetField_Delete( item.record.id, callback, delegator );
}

CombinationFacetList.prototype.Field_Update_SortDescending = function( item, checked, delegator )
{
	const self = this;

	CombinationFacetField_Update_SortDescending( item.record.id, checked, function( response )
	{
		if ( !response.success )
		{
			self.Record_Update_Error( response, item );
			self.ReBindVisibleRows();

			return;
		}

		item.record.sort_desc = checked;

		self.ItemRecord_UpdateOriginalRecord( item, null );
		self.ReBindVisibleRows();
	}, delegator );
}

CombinationFacetList.prototype.onCreateRootColumnList = function()
{
	var self = this;

	this.rootcolumn_disp_order	= new MMBatchList_Column( 'Display Order', 'disp_order' )
									.SetFieldName( '' )
									.SetSortByField( 'disp_order' )
									.SetSearchable( false )
									.SetDisplayInList( false )
									.SetColumnIsEditable( false );
	this.rootcolumn_code		= new MMBatchList_Column_Code( 'Code', 'code', 'Code' )
									.SetContentAttributeList( { 'class': 'mm9_batchlist_level_col' } );
	this.rootcolumn_name		= new MMBatchList_Column_Name( 'Name', 'name', 'Name' )
									.SetContentAttributeList( { 'class': 'mm9_batchlist_level_col' } );
	this.rootcolumn_sort_desc	= new MMBatchList_Column_Text( 'Sort Descending', 'sort_desc', 'SortDescending' )
									.SetSortByField( '' )
									.SetFieldName( '' )
									.SetContentAttributeList( { 'class': 'mm9_batchlist_level_col' } );
	this.rootcolumn_fitlist		= new MMBatchList_Column_Text( 'Fitment List', 'fitlist', 'FitmentList' )
									.SetSortByField( '' )
									.SetFieldName( '' )
									.SetContentAttributeList( { 'class': 'mm9_batchlist_level_col' } );
	this.rootcolumn_variantsrc	= new MMBatchList_Column_MappedTextValues( 'Variant Source', 'variantsrc', [ 'master', 'parts' ], [ 'Master Product', 'Part Products' ], 'VariantSource' )
									.SetContentAttributeList( { 'class': 'mm9_batchlist_level_col' } );

	if ( this.can_modify )
	{
		this.rootcolumn_enabled		= new MMBatchList_Column_CheckboxSlider( 'Enabled', 'enabled', 'Enabled', function( item, checked, delegator ) { self.Facet_Update_Enabled( item, checked, delegator ); } );
		this.rootcolumn_inclother	= new MMBatchList_Column_CheckboxSlider( 'Include Other Products', 'inclother', 'IncludeOtherProducts', function( item, checked, delegator ) { self.Facet_Update_IncludeOtherProducts( item, checked, delegator ); } );
		this.rootcolumn_createfit	= new MMBatchList_Column_CheckboxSlider( 'Create Fitment Indicator', 'createfit', 'CreateFitmentIndicator', function( item, checked, delegator ) { self.Facet_Update_CreateFitmentIndicator( item, checked, delegator ); } );
		this.rootcolumn_fitlistpub	= new MMBatchList_Column_CheckboxSlider( 'Fitment List Public', 'fitlistpub', 'FitmentListPublic', function( item, checked, delegator ) { self.Facet_Update_FitmentListPublic( item, checked, delegator ); } );
	}
	else
	{
		this.rootcolumn_enabled		= new MMBatchList_Column_Checkbox( 'Enabled', 'enabled', 'Enabled' );
		this.rootcolumn_inclother	= new MMBatchList_Column_Checkbox( 'Include Other Products', 'inclother', 'IncludeOtherProducts' );
		this.rootcolumn_createfit	= new MMBatchList_Column_Checkbox( 'Create Fitment Indicator', 'createfit', 'CreateFitmentIndicator' );
		this.rootcolumn_fitlistpub	= new MMBatchList_Column_Checkbox( 'Fitment List Public', 'fitlistpub', 'FitmentListPublic' );
	}

	return [
		this.rootcolumn_disp_order,
		this.rootcolumn_enabled,
		this.rootcolumn_code,
		this.rootcolumn_name,
		this.rootcolumn_sort_desc,
		this.rootcolumn_fitlist,
		this.rootcolumn_inclother,
		this.rootcolumn_createfit,
		this.rootcolumn_fitlistpub,
		this.rootcolumn_variantsrc
	];
}

CombinationFacetList.prototype.CreateColumnList_Fields = function()
{
	const self = this;
	var sort_desc_column;

	if ( this.can_modify )	sort_desc_column = new MMBatchList_Column_CheckboxSlider(	'Sort Descending', 'sort_desc', 'SortDescending', function( item, checked, delegator ) { self.Field_Update_SortDescending( item, checked, delegator ); } );
	else					sort_desc_column = new MMBatchList_Column_Checkbox(			'Sort Descending', 'sort_desc', 'SortDescending' );

	this.field_code_column		= new MMBatchList_Column_Code( 'Code', 'code', 'Code' )
									  .SetContentAttributeList( { 'class': 'mm9_batchlist_level_col' } )
									  .SetRootColumn( this.rootcolumn_code );
	this.field_name_column		= new MMBatchList_Column_Name( 'Name', 'name', 'Name' )
									  .SetContentAttributeList( { 'class': 'mm9_batchlist_level_col' } )
									  .SetRootColumn( this.rootcolumn_name );
	this.field_sort_desc_column	= sort_desc_column
									  .SetContentAttributeList( { 'class': 'mm9_batchlist_level_col' } )
									  .SetRootColumn( this.rootcolumn_sort_desc );
	this.field_fitlist_column	= new MMBatchList_Column_MappedTextValues( 'Fitment List', 'fitlist', [ 'visible', 'hidden', 'range' ], [ 'Visible', 'Hidden', 'Range' ], 'FitmentList' )
									  .SetContentAttributeList( { 'class': 'mm9_batchlist_level_col' } )
									  .SetRootColumn( this.rootcolumn_fitlist );

	const columnlist = [
		this.field_code_column,
		this.field_name_column,
		this.field_sort_desc_column,
		this.field_fitlist_column
	];

	return columnlist;
}
