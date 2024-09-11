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

// Canadian Vat List 
////////////////////////////////////////////////////

function CanVatList()
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

DeriveFrom( MMList, CanVatList );

CanVatList.prototype.Construct = function()
{
	MMList.call( this, 'mm_list_canvatlist' );

	if ( this.stat_can_view )
	{
		if ( this.stax_can_add )
		{
			this.Feature_Add_Enable( 'Add Province', 'Save Province' );
		}

		if ( this.stax_can_modify )
		{
			this.Feature_Edit_Enable( 'Edit Province(s)', 'Save Province(s)' );
		}

		if ( this.stax_can_delete )
		{
			this.Feature_Delete_Enable( 'Delete Province(s)' );
		}
	}

	this.Feature_Controls_SetSearchPlaceholderText( 'Search Provinces...' );
	this.SetDefaultSort( 'name', '' );
}

CanVatList.prototype.onConstruct = function() { ; }

CanVatList.prototype.onLoad = CanVatList_Load_Query;

CanVatList.prototype.onCreate = function()
{
	var record;

	record				= new Object();
	record.name			= '';
	record.state_name	= '';
	record.type			= 'pst';
	record.hst			= 0.000;
	record.pst			= 0.000;
	record.tax_ship		= false;
	record.tax_gst		= false;

	return record;
}

CanVatList.prototype.onInsert = function( item, callback, delegator )
{
	CanVat_Insert( item.record, callback, delegator );
}

CanVatList.prototype.onSave = function( item, callback, delegator )
{
	CanVat_Update( item.record, callback, delegator );
}

CanVatList.prototype.onDelete = function( item, callback, delegator )
{
	CanVat_Delete( item.record.id, callback, delegator );
}

CanVatList.prototype.onCreateRootColumnList = function()
{
	var self = this;
	var tax_shipping_column;

	if ( this.stax_can_modify )	tax_shipping_column = new MMList_Column_CheckboxSlider(	'Tax Shipping', 'tax_ship', 'CanVat_TaxShipping', function( item, checked, delegator ) { self.Update_TaxShipping( item, checked, delegator ); } );
	else						tax_shipping_column = new MMList_Column_Checkbox(		'Tax Shipping', 'tax_ship', 'CanVat_TaxShipping' );

	var columnlist =
	[
		new CanVat_Column_Province()
			.SetStateListRetriever( function() { return self.statelist; } ),
		new MMList_Column_MappedTextValues( 'Type', 'type', [ 'pst', 'hst', 'hst_rebate' ], [ 'PST', 'HST', 'HST with PST Rebate' ], 'CanVat_Type' )
			.SetHeaderStyleList( { 'width': '150px' } )
			.SetOnDisplayEdit( function( record, item, mmlist ) { return self.ColumnEdit_Type( this, record, item, mmlist ); } ),
		new CanVat_Column_Rate(),
		new CanVat_Column_Rebate()
			.SetSearchable( false ),
		tax_shipping_column
			.SetSearchable( false ),
		new CanVat_Column_TaxGST( this.stax_can_modify, function( item, checked, delegator ) { self.Update_TaxGST( item, checked, delegator ); } )
	];

	return columnlist;
}

CanVatList.prototype.ColumnEdit_Type = function( column, record, item, mmlist )
{
	var select;
	var self = this;

	select			= column.onDisplayEdit( record, item, mmlist );
	select.onchange	= function( event )
	{
		var selected = this.options[ this.selectedIndex ].value;

		if ( selected != record.type )
		{
			if ( record.type === 'pst' )
			{
				record.hst = record.pst;
				record.pst = 0.000;
			}
			else if ( selected === 'pst' )
			{
				record.pst = record.hst;
				record.hst = 0.000;
			}
		}

		self.ReBindRow( item );
	};

	return select;
}

CanVatList.prototype.Update_TaxShipping = function( item, checked, delegator )
{
	var self = this;

	CanVat_Update_TaxShipping( item.record.id, checked, function( response )
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

CanVatList.prototype.Update_TaxGST = function( item, checked, delegator )
{
	var self = this;

	CanVat_Update_TaxGST( item.record.id, checked, function( response )
	{
		if ( !response.success )
		{
			self.Record_Update_Error( response, item );
			self.ReBindVisibleRows();

			return;
		}

		item.record.tax_gst = checked ? true : false;

		self.ItemRecord_UpdateOriginalRecord( item, null );
		self.ReBindVisibleRows();
	}, delegator );
}

// CanVat_Column_Province 
////////////////////////////////////////////////////

function CanVat_Column_Province()
{
	MMList_Column_Name.call( this, 'Province', 'name', 'CanVat_Province' );

	this.SetOnDisplayData( this.onDisplayData );
	this.SetOnDisplayEdit( this.onDisplayEdit );

	return this; 
}

DeriveFrom( MMList_Column_Name, CanVat_Column_Province );

CanVat_Column_Province.prototype.onDisplayData = function( record, item )
{
	if ( typeof record.state_name === 'string' && record.state_name.length )
	{
		return DrawMMListString_Data( record.state_name );
	}

	return DrawMMListString_Data( 'Province Not Found' );
}

CanVat_Column_Province.prototype.onDisplayEdit = function( record, item )
{
	var i, i_len, select, statelist;

	select		= newElement( 'select', { 'name': 'name' }, null, null );
	statelist	= this.statelistretriever();

	if ( !statelist || statelist.length == 0 )
	{
		select.options[ select.options.length ] = new Option( 'Loading...' );
	}
	else
	{
		for ( i = 0, i_len = statelist.length; i < i_len; i++ )
		{
			select.add( new Option( statelist[ i ].name, statelist[ i ].code ) );

			if ( record.name == statelist[ i ].code )
			{
				select.selectedIndex = i;
			}
		}
	}

	return select;
}

CanVat_Column_Province.prototype.onParseEditableColumn = function( new_record, element_column )
{
	var i, i_len, elementlist;

	elementlist = element_column.getElementsByTagName( 'select' );

	for ( i = 0, i_len = elementlist.length; i < i_len; i++ )
	{
		if ( elementlist[ i ] && elementlist[ i ].name && elementlist[ i ].name == 'name' )
		{
			this.onSetValue( new_record, elementlist[ i ].options[ elementlist[ i ].selectedIndex ].value );

			new_record.state_name = elementlist[ i ].options[ elementlist[ i ].selectedIndex ].text;
		}
	}
}

CanVat_Column_Province.prototype.SetStateListRetriever = function( statelistretriever )
{
	this.statelistretriever = statelistretriever;

	return this;
}

CanVat_Column_Province.prototype.onAdvancedSearch_Filter_AddOptions = function()
{
	this.AdvancedSearch_Filter_AddOption( 'Equal To',		'EQ' );
	this.AdvancedSearch_Filter_AddOption( 'Not Equal To',	'NE' );
}

CanVat_Column_Province.prototype.onAdvancedSearch_ConstructValue = function()
{
	return this.AdvancedSearch_ConstructValue_Select();
}

CanVat_Column_Province.prototype.AdvancedSearch_ConstructValue_Select_OnPopulate = function( select )
{
	var i, i_len, statelist;

	statelist = this.statelistretriever();

	select.AddOption( '<Select One>', '' );

	for ( i = 0, i_len = statelist.length; i < i_len; i++ )
	{
		select.AddOption( statelist[ i ].name, statelist[ i ].name );
	}
}

CanVat_Column_Province.prototype.statelistretriever = function() { return []; }

// CanVat_Column_Rate
////////////////////////////////////////////////////

function CanVat_Column_Rate()
{
	MMList_Column_Numeric.call( this, 'Rate', 'rate', 'CanVat_Rate', 3 );
	return this;
}

DeriveFrom( MMList_Column_Numeric, CanVat_Column_Rate );

CanVat_Column_Rate.prototype.onRetrieveValue = function( record )
{
	if ( record.type === 'pst' )	return record.pst;
	else							return record.hst;
}

CanVat_Column_Rate.prototype.onSetValue = function( record, value )
{
	if ( record.type === 'pst' )	record.pst = value;
	else							record.hst = value;
}

CanVat_Column_Rate.prototype.onDisplayFieldError = function( item, error_field, error_message, element_message )
{
	if ( ( item.record.type === 'pst' && error_field === 'CanVat_PST' ) || error_field === 'CanVat_HST' )
	{
		MMList_Column_Numeric.prototype.onDisplayFieldError.call( this, item, this.field_name, error_message, element_message  );
	}
}

CanVat_Column_Rate.prototype.onSearch_GetFilter = function( search )
{
	if ( !this.active )
	{
		return null;
	}

	if ( isNaN( search ) || search == Number.POSITIVE_INFINITY || search == Number.NEGATIVE_INFINITY )
	{
		return null;
	}

	return [
		{
			'code':		'search_OR',
			'filter':	'SUBWHERE',
			'value':	PackArray( [ 'type:EQ:pst', 'pst:EQ:' + encodeURIComponent( search ) ] )
		},
		{
			'code':		'search_OR',
			'filter':	'SUBWHERE',
			'value':	PackArray( [ 'type:EQ:hst', 'hst:EQ:' + encodeURIComponent( search ) ] )
		},
		{
			'code':		'search_OR',
			'filter':	'SUBWHERE',
			'value':	PackArray( [ 'type:EQ:hst_rebate', 'hst:EQ:' + encodeURIComponent( search ) ] )
		}
	];
}

CanVat_Column_Rate.prototype.onAdvancedSearch_GetFilter = function()
{
	var value, filter, filterlist, search_filters;

	search_filters	= new Array();
	filterlist		= new Array();
	filter			= this.AdvancedSearch_Filter_GetValue();
	value			= this.AdvancedSearch_Value_GetValue();

	search_filters.push( new MMList_Filter_Search_Value( 'search_OR', 'SUBWHERE', [ new MMList_Filter_Search_Value( 'type', 'EQ', 'pst' ), new MMList_Filter_Search_Value( 'pst', filter, value ) ] ) );
	search_filters.push( new MMList_Filter_Search_Value( 'search_OR', 'SUBWHERE', [ new MMList_Filter_Search_Value( 'type', 'EQ', 'hst' ), new MMList_Filter_Search_Value( 'hst', filter, value ) ] ) );
	search_filters.push( new MMList_Filter_Search_Value( 'search_OR', 'SUBWHERE', [ new MMList_Filter_Search_Value( 'type', 'EQ', 'hst_rebate' ), new MMList_Filter_Search_Value( 'hst', filter, value ) ] ) );
	filterlist.push( new MMList_Filter_Search_Value( 'search_AND', 'SUBWHERE', search_filters ) );

	return filterlist;
}

// CanVat_Column_Rebate
////////////////////////////////////////////////////

function CanVat_Column_Rebate()
{
	MMList_Column_Numeric.call( this, 'Rebate', 'pst', 'CanVat_PSTRebate', 3 );
	return this;
}

DeriveFrom( MMList_Column_Numeric, CanVat_Column_Rebate );

CanVat_Column_Rebate.prototype.onRetrieveValue = function( record )
{
	if ( record.type !== 'hst_rebate' )		return 0.000;
	else									return record.pst;
}

CanVat_Column_Rebate.prototype.onSetValue = function( record, value )
{
	if ( record.type !== 'hst_rebate')		return;

	record.pst = value;
}

CanVat_Column_Rebate.prototype.onDisplayData = function( record, item, mmlist )
{
	if ( record.type !== 'hst_rebate' )
	{
		return document.createTextNode( '' );
	}

	return MMList_Column_Numeric.prototype.onDisplayData.call( this, record, item, mmlist );
}

CanVat_Column_Rebate.prototype.onDisplayEdit = function( record, item, mmlist )
{
	if ( record.type !== 'hst_rebate' )
	{
		return document.createTextNode( '' );
	}

	return MMList_Column_Numeric.prototype.onDisplayEdit.call( this, record, item, mmlist );
}

CanVat_Column_Rebate.prototype.onValidateValue = function( value, error )
{
	if ( typeof value === 'undefined' )	return true;

	return MMList_Column_Numeric.prototype.onValidateValue.call( this, value, error );
}

CanVat_Column_Rebate.prototype.onDisplayFieldError = function( item, error_field, error_message, element_message )
{
	if ( item.record.type === 'hst_rebate' && error_field === 'CanVat_PST' )
	{
		MMList_Column_Numeric.prototype.onDisplayFieldError.call( this, item, this.field_name, error_message, element_message  );
	}
}

// CanVat_Column_TaxGST
////////////////////////////////////////////////////

function CanVat_Column_TaxGST( can_modify, onsavecheckedstate )
{
	MMList_Column_CheckboxSlider.call( this, 'Tax GST', 'tax_gst', 'CanVat_TaxGST', onsavecheckedstate );

	this.can_modify = can_modify;
	this.SetSearchable( false );

	return this;
}

DeriveFrom( MMList_Column_CheckboxSlider, CanVat_Column_TaxGST );

CanVat_Column_TaxGST.prototype.onDisplayData = function( item, checked, mmlist )
{
	if ( item.record.type !== 'pst' )
	{
		return document.createTextNode( '' );
	}
	else if ( !this.can_modify )
	{
		return DrawMMListCheckbox_Data( this.onRetrieveValue( item.record ) );
	}

	return MMList_Column_CheckboxSlider.prototype.onDisplayData.call( this, item, checked, mmlist );
}

CanVat_Column_TaxGST.prototype.onDisplayEdit = function( item, checked, mmlist )
{
	if ( item.record.type !== 'pst' )
	{
		return document.createTextNode( '' );
	}
	else if ( !this.can_modify )
	{
		return DrawMMListCheckbox_Data( this.onRetrieveValue( item.record ) );
	}

	return MMList_Column_CheckboxSlider.prototype.onDisplayEdit.call( this, item, checked, mmlist );
}
