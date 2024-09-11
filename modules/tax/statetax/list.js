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

// State Tax State List
////////////////////////////////////////////////////

function StateTaxStateList()
{
	var self = this;

	this.statelist			= new Array();
	this.stat_can_view		= CanI( 'STAT', 1, 0, 0, 0 );
	this.stax_can_add		= CanI( 'STAX', 0, 1, 0, 0 );
	this.stax_can_modify	= CanI( 'STAX', 0, 0, 1, 0 );
	this.stax_can_delete	= CanI( 'STAX', 0, 0, 0, 1 );

	StateList_Load( function( response )
	{
		if ( response.success )
		{
			self.statelist = response.data;
		}

		self.Construct();
		self.onConstruct();
	} );
}

DeriveFrom( MMList, StateTaxStateList );

StateTaxStateList.prototype.Construct = function()
{
	MMList.call( this, 'mm_list_statetaxlist' );

	if ( this.stat_can_view )
	{
		if ( this.stax_can_add )
		{
			this.Feature_Add_Enable( 'Add State Tax Rate' );
		}

		if ( this.stax_can_modify )
		{
			this.Feature_Edit_Enable( 'Edit State Tax Rates(s)', 'Save State Tax Rates(s)' );
		}

		if ( this.stax_can_delete )
		{
			this.Feature_Delete_Enable( 'Delete State Tax Rate(s)' );
		}
	}

	this.Feature_Controls_SetSearchPlaceholderText( 'Search State Tax Rates...' );
	this.SetDefaultSort( 'state', '' );
}

StateTaxStateList.prototype.onConstruct = function() { ; }

StateTaxStateList.prototype.onLoad = StateTaxStateList_Load_Query;

StateTaxStateList.prototype.onCreate = function()
{
	var record;

	record			= new Object();
	record.state	= '';
	record.rate		= 0.00;
	record.tax_ship	= false;

	return record;
}

StateTaxStateList.prototype.onInsert = function( item, callback, delegator )
{
	StateTaxState_Insert( item.record.mmlist_fieldlist, callback, delegator );
}

StateTaxStateList.prototype.onSave = function( item, callback, delegator )
{
	StateTaxState_Update( item.record.id, item.record.mmlist_fieldlist, callback, delegator );
}

StateTaxStateList.prototype.onDelete = function( item, callback, delegator )
{
	StateTaxState_Delete( item.record.id, callback, delegator );
}

StateTaxStateList.prototype.onCreateRootColumnList = function()
{
	var self = this;
	var tax_shipping_column;

	if ( this.stax_can_modify )	tax_shipping_column = new MMList_Column_CheckboxSlider(	'Tax Shipping', 'tax_ship', 'Tax_Shipping', function( item, checked, delegator ) { self.Update_TaxShipping( item, checked, delegator ); } );
	else						tax_shipping_column = new MMList_Column_Checkbox(		'Tax Shipping', 'tax_ship', 'Tax_Shipping' );

	var columnlist =
	[
		new StateTaxState_Column_State()
				.SetStateListRetriever( function() { return self.statelist; } ),
		new MMList_Column_Numeric( 'Rate %', 'rate', 'Rate', 3 ),
		tax_shipping_column
	];

	return columnlist;
}

StateTaxStateList.prototype.Update_TaxShipping = function( item, checked, delegator )
{
	var self = this;

	StateTaxState_Update_TaxShipping( item.record.id, checked, function( response )
	{
		if ( !response.success )
		{
			self.Record_Update_Error( response, item );
			self.ReBindVisibleRows();

			return;
		}

		item.record.tax_ship = checked ? true : false;

		self.ItemRecord_UpdateOriginalRecord( item, null );
		self.ReBindVisibleRows();
	}, delegator );
}

// StateTaxState_Column_State
////////////////////////////////////////////////////

function StateTaxState_Column_State()
{
	MMList_Column_Name.call( this, 'State', 'state', 'State' );

	this.SetOnDisplayData( this.onDisplayData );
	this.SetOnDisplayEdit( this.onDisplayEdit );
 
	return this; 
}

DeriveFrom( MMList_Column_Name, StateTaxState_Column_State);

StateTaxState_Column_State.prototype.onDisplayData = function( record, item )
{
	if ( typeof record.state_name === 'string' && record.state_name.length )
	{
		return DrawMMListString_Data( record.state_name );
	}

	return DrawMMListString_Data( record.state );
}

StateTaxState_Column_State.prototype.onDisplayEdit = function( record, item )
{
	var i, i_len, select, statelist;
	
	select			= newElement( 'select', { 'name': 'state' }, null, null );
	statelist		= this.statelistretriever();

	if ( !statelist || statelist.length == 0 )
	{
		select.options[ select.options.length ] = new Option( 'Loading...', '' );
	}
	else
	{
		select.options[ select.options.length ] = new Option( '<Select One>', '' );

		for ( i = 0, i_len = statelist.length; i < i_len; i++ )
		{
			if ( statelist[ i ].code != '' )
			{
				select.add( new Option( statelist[ i ].name, statelist[ i ].code ) );

				if ( record.state == statelist[ i ].code )
				{
					select.selectedIndex = select.options.length - 1;
				}
			}
		}
	}

	return select;
}

StateTaxState_Column_State.prototype.onParseEditableColumn = function( new_record, element_column )
{
	var i, i_len, elementlist;

	elementlist = element_column.getElementsByTagName( 'select' );

	for ( i = 0, i_len = elementlist.length; i < i_len; i++ )
	{
		if ( elementlist[ i ] && elementlist[ i ].name && elementlist[ i ].name == 'state' )
		{
			this.onSetValue( new_record, elementlist[ i ].options[ elementlist[ i ].selectedIndex ].value );

			new_record.state_name = elementlist[ i ].options[ elementlist[ i ].selectedIndex ].text;
		}
	}
}

StateTaxState_Column_State.prototype.SetStateListRetriever = function( statelistretriever )
{
	this.statelistretriever = statelistretriever;

	return this;
}

StateTaxState_Column_State.prototype.onAdvancedSearch_Filter_AddOptions = function()
{
	this.AdvancedSearch_Filter_AddOption( 'Equal To',		'EQ' );
	this.AdvancedSearch_Filter_AddOption( 'Not Equal To',	'NE' );
}

StateTaxState_Column_State.prototype.onAdvancedSearch_ConstructValue = function()
{
	return this.AdvancedSearch_ConstructValue_Select();
}

StateTaxState_Column_State.prototype.AdvancedSearch_ConstructValue_Select_OnPopulate = function( select )
{
	var i, i_len, statelist;

	statelist = this.statelistretriever();

	select.AddOption( '<Select One>', '' );

	for ( i = 0, i_len = statelist.length; i < i_len; i++ )
	{
		select.AddOption( statelist[ i ].name, statelist[ i ].name );
	}
}

StateTaxState_Column_State.prototype.statelistretriever = function() { return []; }
