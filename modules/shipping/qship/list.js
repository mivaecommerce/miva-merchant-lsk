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

// Quantity Based Shipping List
////////////////////////////////////////////////////

function QuantityBasedShippingList()
{
	MMBatchList.call( this, 'mm9_batchlist_quantitybasedshippinglist' );

	this.branch_quantities 	= this.AddBranch( this.CreateColumnList_Quantities(), 'quantities' );

	if ( CanI( 'SHIP', 0, 0, 1, 0 ) )
	{
		this.Feature_Add_Enable( 'Add Shipping Method', 'Save Shipping Method', 'Add Range', 'Cancel', 'Add Shipping Method', 'Save Shipping Method', 'Add Range', '' );
		this.Feature_Edit_Enable( 'Edit Shipping Method(s)', 'Save Shipping Method(s)' );
		this.Feature_Delete_Enable( 'Delete Shipping Method(s)' );
		this.Feature_RowDoubleClick_Enable();

		this.Branch_SetCreateFunction( this.branch_quantities, this.Quantity_Create );
		this.Branch_SetInsertFunction( this.branch_quantities, this.Quantity_Insert );
		this.Branch_SetSaveFunction( this.branch_quantities, this.Quantity_Save );
		this.Branch_SetDeleteFunction( this.branch_quantities, this.Quantity_Delete );
		this.Branch_SetFindIndex_ParamsFunction( this.branch_quantities, this.Quantity_FindIndex_Params );
		this.Branch_SetFindIndex_CompareFunction( this.branch_quantities, this.Quantity_FindIndex_Compare );

		this.button_inlineadd_add.SetImage( '' );
	}

	this.Feature_Buttons_EnableDisableButtons_AddHook( this.EnableDisableButtons_AddHook );
	this.Feature_SearchBar_SetPlaceholderText( 'Search Methods...' );
	this.SetDefaultSort( 'method' );
}

DeriveFrom( MMBatchList, QuantityBasedShippingList );

QuantityBasedShippingList.prototype.onLoad = QuantityBasedShippingMethodList_Load_Query;

QuantityBasedShippingList.prototype.onCreate = function()
{
	var record;

	record			= new Object();
	record.code		= '';
	record.method	= '';
	record.prog		= false;

	return record;
}

QuantityBasedShippingList.prototype.onInsert = function( item, callback, delegator )
{
	QuantityBasedShippingMethod_Insert( item.record.mmbatchlist_fieldlist, callback, delegator );
}

QuantityBasedShippingList.prototype.onSave = function( item, callback, delegator )
{
	QuantityBasedShippingMethod_Update( item.record.id, item.record.mmbatchlist_fieldlist, callback, delegator );
}

QuantityBasedShippingList.prototype.onDelete = function( item, callback, delegator )
{
	QuantityBasedShippingMethod_Delete( item.record.id, callback, delegator );
}

QuantityBasedShippingList.prototype.onProcessLoadedData = function( recordlist, start_index )
{
	var i, j, index, root_index;

	index = start_index;

	for ( i = 0; i < recordlist.length; i++ )
	{
		root_index = index;
		this.ItemList_CreateInsertAtIndex( recordlist[ i ], index++, -1, this.branch_root );

		if ( recordlist[ i ].quantities )
		{
			for ( j = 0; j < recordlist[ i ].quantities.length; j++ )
			{
				this.ItemList_CreateInsertAtIndex( recordlist[ i ].quantities[ j ], index++, root_index, this.branch_quantities );
			}
		}
	}
}

QuantityBasedShippingList.prototype.onRetrieveChildBranch = function( item )
{
	if ( !item || !item.root )
	{
		return null;
	}

	return item.branch.children[ 'quantities' ];
}

QuantityBasedShippingList.prototype.onFindIndex_Params = function( item )
{
	return { 'Code': item && item.record ? item.record.code : '' };
}

QuantityBasedShippingList.prototype.onFindIndex_Compare = function( item, params )
{
	if ( item && item.record && item.record.code == params[ 'Code' ] )
	{
		return true;
	}

	return false;
}

QuantityBasedShippingList.prototype.EnableDisableButtons_AddHook = function()
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

QuantityBasedShippingList.prototype.Quantity_Create = function()
{
	var record;

	record 				= new Object();
	record.floor 		= 0;
	record.ceiling 		= 0;
	record.unit_rate	= 0.00;

	return record;
}

QuantityBasedShippingList.prototype.Quantity_Insert = function( item, callback, delegator )
{
	var method_record, error;

	if ( ( method_record = this.GetListItemRecord_Parent( item.index ) ) == null )
	{
		error						= new Object();
		error.validation_error		= true;
		error.error_field_message	= 'Shipping quantity record not found';
		error.error_field			= 'Ceiling';

		return this.FieldError( error, item.row );
	}

	QuantityBasedShippingQuantity_Insert( method_record.id, item.record.mmbatchlist_fieldlist, callback, delegator );
}

QuantityBasedShippingList.prototype.Quantity_Save = function( item, callback, delegator )
{
	QuantityBasedShippingQuantity_Update( item.record.id, item.record.mmbatchlist_fieldlist, callback, delegator );
}

QuantityBasedShippingList.prototype.Quantity_Delete = function( item, callback, delegator )
{
	QuantityBasedShippingQuantity_Delete( item.record.id, callback, delegator );
}

QuantityBasedShippingList.prototype.Quantity_FindIndex_Params = function( item )
{
	var method_record = this.GetListItemRecord_Parent( item.index );

	return { 'Method_ID': method_record ? method_record.id : '' };
}

QuantityBasedShippingList.prototype.Quantity_FindIndex_Compare = function( item, params )
{
	var method_record = this.GetListItemRecord_Parent( item.index );

	if ( item.record && method_record && ( method_record.id == params[ 'Method_ID' ] ) )
	{
		return true;
	}

	return false;
}

QuantityBasedShippingList.prototype.onCreateRootColumnList = function()
{
	this.rootcolumn_code 		= new MMBatchList_Column_Text( 'Code', 'code', 'Code' );
	this.rootcolumn_method 		= new MMBatchList_Column_Text( 'Method', 'method', 'Method' );
	this.rootcolumn_progressive	= new MMBatchList_Column_Checkbox( 'Progressive', 'prog', 'Progressive' );
	this.rootcolumn_floor		= new MMBatchList_Column_Numeric( 'Floor', 'floor', 'Floor' )
									  .SetOnDisplayData( this.DisplayData_NoData )
									  .SetOnDisplayEdit( this.DisplayData_NoData )
									  .SetOnRetrieveValue( function( record ) { return 0; } )
									  .SetSortByField( '' );
	this.rootcolumn_ceiling		= new MMBatchList_Column_Numeric_Or_Plus( 'Ceiling', 'ceiling', 'Ceiling' )
									  .SetOnDisplayData( this.DisplayData_NoData )
									  .SetOnDisplayEdit( this.DisplayData_NoData )
									  .SetOnRetrieveValue( function( record ) { return 0; } )
									  .SetSortByField( '' );
	this.rootcolumn_amount		= new MMBatchList_Column_Numeric( 'Amount/Unit', 'unit_rate', 'Unit_Rate', 2 )
									  .SetOnDisplayData( this.DisplayData_NoData )
									  .SetOnDisplayEdit( this.DisplayData_NoData )
									  .SetOnRetrieveValue( function( record ) { return 0.00; } )
									  .SetSortByField( '' );

	var columnlist =
	[
		this.rootcolumn_code,
		this.rootcolumn_method,
		this.rootcolumn_progressive,
		this.rootcolumn_floor,
		this.rootcolumn_ceiling,
		this.rootcolumn_amount
	];

	return columnlist;
}

QuantityBasedShippingList.prototype.CreateColumnList_Quantities = function()
{
	var columnlist =
	[
		new MMBatchList_Column_Numeric( 'Floor', 'floor', 'Floor' )
			.SetRootColumn( this.rootcolumn_floor ),
		new MMBatchList_Column_Numeric_Or_Plus( 'Ceiling', 'ceiling', 'Ceiling' )
			.SetRootColumn( this.rootcolumn_ceiling ),
		new MMBatchList_Column_Numeric( 'Amount/Unit', 'unit_rate', 'Unit_Rate', 2 )
			.SetRootColumn( this.rootcolumn_amount )
	];

	return columnlist;
}

QuantityBasedShippingList.prototype.DisplayData_NoData = function()
{
	return DrawMMBatchListString_Data( '' );
}
