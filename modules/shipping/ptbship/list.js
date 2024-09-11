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

// Price Table Based Shipping List
////////////////////////////////////////////////////

function PriceTableBasedShippingList()
{
	MMBatchList.call( this, 'mm9_batchlist_pricetablebasedshippinglist' );

	this.branch_breaks 	= this.AddBranch( this.CreateColumnList_Breaks(), 'breaks' );

	if ( CanI( 'SHIP', 0, 0, 1, 0 ) )
	{
		this.Feature_Add_Enable( 'Add Shipping Method', 'Save Shipping Method', 'Add Range', 'Cancel', 'Add Shipping Method', 'Save Shipping Method', 'Add Range', '' );
		this.Feature_Edit_Enable( 'Edit Shipping Method(s)', 'Save Shipping Method(s)' );
		this.Feature_Delete_Enable( 'Delete Shipping Method(s)' );
		this.Feature_RowDoubleClick_Enable();

		this.Branch_SetCreateFunction( this.branch_breaks, this.Break_Create );
		this.Branch_SetInsertFunction( this.branch_breaks, this.Break_Insert );
		this.Branch_SetSaveFunction( this.branch_breaks, this.Break_Save );
		this.Branch_SetDeleteFunction( this.branch_breaks, this.Break_Delete );
		this.Branch_SetFindIndex_ParamsFunction( this.branch_breaks, this.Break_FindIndex_Params );
		this.Branch_SetFindIndex_CompareFunction( this.branch_breaks, this.Break_FindIndex_Compare );

		this.button_inlineadd_add.SetImage( '' );
	}

	this.Feature_Buttons_EnableDisableButtons_AddHook( this.EnableDisableButtons_AddHook );
	this.Feature_SearchBar_SetPlaceholderText( 'Search Methods...' );
	this.SetDefaultSort( 'method' );
}

DeriveFrom( MMBatchList, PriceTableBasedShippingList );

PriceTableBasedShippingList.prototype.onLoad = PriceTableBasedShippingMethodList_Load_Query;

PriceTableBasedShippingList.prototype.onCreate = function()
{
	var record;

	record			= new Object();
	record.code		= '';
	record.method	= '';
	record.handling	= 0.00;

	return record;
}

PriceTableBasedShippingList.prototype.onInsert = function( item, callback, delegator )
{
	PriceTableBasedShippingMethod_Insert( item.record.mmbatchlist_fieldlist, callback, delegator );
}

PriceTableBasedShippingList.prototype.onSave = function( item, callback, delegator )
{
	PriceTableBasedShippingMethod_Update( item.record.id, item.record.mmbatchlist_fieldlist, callback, delegator );
}

PriceTableBasedShippingList.prototype.onDelete = function( item, callback, delegator )
{
	PriceTableBasedShippingMethod_Delete( item.record.id, callback, delegator );
}

PriceTableBasedShippingList.prototype.onProcessLoadedData = function( recordlist, start_index )
{
	var i, j, index, root_index;

	index = start_index;

	for ( i = 0; i < recordlist.length; i++ )
	{
		root_index = index;
		this.ItemList_CreateInsertAtIndex( recordlist[ i ], index++, -1, this.branch_root );

		if ( recordlist[ i ].breaks )
		{
			for ( j = 0; j < recordlist[ i ].breaks.length; j++ )
			{
				this.ItemList_CreateInsertAtIndex( recordlist[ i ].breaks[ j ], index++, root_index, this.branch_breaks );
			}
		}
	}
}

PriceTableBasedShippingList.prototype.onRetrieveChildBranch = function( item )
{
	if ( !item || !item.root )
	{
		return null;
	}

	return item.branch.children[ 'breaks' ];
}

PriceTableBasedShippingList.prototype.onFindIndex_Params = function( item )
{
	return { 'Code': item && item.record ? item.record.code : '' };
}

PriceTableBasedShippingList.prototype.onFindIndex_Compare = function( item, params )
{
	if ( item && item.record && item.record.code == params[ 'Code' ] )
	{
		return true;
	}

	return false;
}

PriceTableBasedShippingList.prototype.EnableDisableButtons_AddHook = function()
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

PriceTableBasedShippingList.prototype.Break_Create = function()
{
	var record;

	record 			= new Object();
	record.ceiling 	= 0.00;
	record.rate		= 0.00;
	record.percent	= false;

	return record;
}

PriceTableBasedShippingList.prototype.Break_Insert = function( item, callback, delegator )
{
	var method_record, error;

	if ( ( method_record = this.GetListItemRecord_Parent( item.index ) ) == null )
	{
		error						= new Object();
		error.validation_error		= true;
		error.error_field_message	= 'Shipping break record not found';
		error.error_field			= 'Ceiling';

		return this.FieldError( error, item.row );
	}

	PriceTableBasedShippingBreak_Insert( method_record.id, item.record.mmbatchlist_fieldlist, callback, delegator );
}

PriceTableBasedShippingList.prototype.Break_Save = function( item, callback, delegator )
{
	PriceTableBasedShippingBreak_Update( item.record.id, item.record.mmbatchlist_fieldlist, callback, delegator );
}

PriceTableBasedShippingList.prototype.Break_Delete = function( item, callback, delegator )
{
	PriceTableBasedShippingBreak_Delete( item.record.id, callback, delegator );
}

PriceTableBasedShippingList.prototype.Break_FindIndex_Params = function( item )
{
	var method_record = this.GetListItemRecord_Parent( item.index );

	return { 'Method_ID': method_record ? method_record.id : '' };
}

PriceTableBasedShippingList.prototype.Break_FindIndex_Compare = function( item, params )
{
	var method_record = this.GetListItemRecord_Parent( item.index );

	if ( item.record && method_record && ( method_record.id == params[ 'Method_ID' ] ) )
	{
		return true;
	}

	return false;
}

PriceTableBasedShippingList.prototype.onCreateRootColumnList = function()
{
	this.rootcolumn_code 		= new MMBatchList_Column_Text( 'Code', 'code', 'Code' );
	this.rootcolumn_method 		= new MMBatchList_Column_Text( 'Method', 'method', 'Method' );
	this.rootcolumn_handling	= new MMBatchList_Column_Currency( 'Handling', 'handling', 'Handling' );
	this.rootcolumn_ceiling		= new MMBatchList_Column_Numeric_Or_Plus( 'Ceiling', 'ceiling', 'Ceiling', 2 )
									  .SetOnDisplayData( this.DisplayData_NoData )
									  .SetOnDisplayEdit( this.DisplayData_NoData )
									  .SetOnRetrieveValue( function( record ) { return 0.00; } )
									  .SetSortByField( '' );
	this.rootcolumn_charge		= new MMBatchList_Column_Numeric( 'Charge', 'rate', 'Rate', 2 )
									  .SetOnDisplayData( this.DisplayData_NoData )
									  .SetOnDisplayEdit( this.DisplayData_NoData )
									  .SetOnRetrieveValue( function( record ) { return 0.00; } )
									  .SetSortByField( '' );
	this.rootcolumn_percentage	= new MMBatchList_Column_Checkbox( '%', 'percent', 'Percent' )
									  .SetOnDisplayData( this.DisplayData_NoData )
									  .SetOnDisplayEdit( this.DisplayData_NoData )
									  .SetSortByField( '' );

	var columnlist =
	[
		this.rootcolumn_code,
		this.rootcolumn_method,
		this.rootcolumn_handling,
		this.rootcolumn_ceiling,
		this.rootcolumn_charge,
		this.rootcolumn_percentage
	];

	return columnlist;
}

PriceTableBasedShippingList.prototype.CreateColumnList_Breaks = function()
{
	var columnlist =
	[
		new MMBatchList_Column_Numeric_Or_Plus( 'Ceiling', 'ceiling', 'Ceiling', 2 )
			.SetRootColumn( this.rootcolumn_ceiling ),
		new MMBatchList_Column_Numeric( 'Charge', 'rate', 'Rate', 2 )
			.SetRootColumn( this.rootcolumn_charge ),
		new MMBatchList_Column_Checkbox( '%', 'percent', 'Percent' )
			.SetRootColumn( this.rootcolumn_percentage )
	];

	return columnlist;
}

PriceTableBasedShippingList.prototype.DisplayData_NoData = function()
{
	return DrawMMBatchListString_Data( '' );
}
