// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2019 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// Combination Facet Record List
////////////////////////////////////////////////////

function CombinationFacetRecordList( product, facet )
{
	this.product	= product;
	this.facet		= facet;

	MMBatchList.call( this, 'mm9_batchlist_combinationfacetrecordlist' );

	if ( CanI( 'PROD', 0, 0, 1, 0 ) )
	{
		this.Feature_Add_Enable( 'Add Record', 'Save Record' );
		this.Feature_Edit_Enable( 'Edit Record(s)', 'Save Record(s)' );
		this.Feature_Delete_Enable( 'Delete Record(s)' );

		this.Feature_RowDoubleClick_Enable();
	}

	this.Feature_SearchBar_SetPlaceholderText( 'Search Records...' );
	this.SetDefaultSort( 'record_id', '' );
}

DeriveFrom( MMBatchList, CombinationFacetRecordList );

CombinationFacetRecordList.prototype.onLoad = function( filter, sort, offset, count, callback, delegator )
{
	return CombinationFacetRecordList_Load_Query( this.product.id, this.facet.id, filter, sort, offset, count, callback, delegator ); 
}

CombinationFacetRecordList.prototype.onCreate = function()
{
	var record;
	var i, i_len;

	record				= new Object();
	record.record_id	= 0;

	for ( i = 0, i_len = this.facet.fields.length; i < i_len; i++ )
	{
		record[ 'f' + this.facet.fields[ i ].id + '_value' ]	= '';
	}

	return record;
}

CombinationFacetRecordList.prototype.onInsert = function( item, callback, delegator )
{
	CombinationFacetRecord_Insert( this.product.id, this.facet.id, item.record.mmbatchlist_fieldlist, callback, delegator );
}

CombinationFacetRecordList.prototype.onSave = function( item, callback, delegator )
{
	CombinationFacetRecord_Update( item.record.record_id, item.record.mmbatchlist_fieldlist, callback, delegator );
}

CombinationFacetRecordList.prototype.onDelete = function( item, callback, delegator )
{
	CombinationFacetRecord_Delete( item.record.record_id, callback, delegator );
}

CombinationFacetRecordList.prototype.onCreateRootColumnList = function()
{
	var i, i_len;
	var columns = new Array();

	for ( i = 0, i_len = this.facet.fields.length; i < i_len; i++ )
	{
		columns.push( new MMBatchList_Column_Text( this.facet.fields[ i ].name, 'f' + this.facet.fields[ i ].id + '_value', 'f' + this.facet.fields[ i ].id + '_value' ) );
	}

	return columns;
}
