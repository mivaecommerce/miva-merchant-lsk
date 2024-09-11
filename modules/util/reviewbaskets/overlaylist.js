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

// Review Baskets List Detail Overlay List
////////////////////////////////////////////////////

function ReviewBasketsListDetailOverlayList( prefix )
{
	MMListDetailOverlayList.call( this, prefix );
	this.SetDefaultSort( 'lastupdate', '-' );
}

DeriveFrom( MMListDetailOverlayList, ReviewBasketsListDetailOverlayList );

ReviewBasketsListDetailOverlayList.prototype.onLoad = ReviewBasketsList.prototype.onLoad;

ReviewBasketsListDetailOverlayList.prototype.onLoadRecordIndex = ReviewBasketsList.prototype.onLoadRecordIndex;

ReviewBasketsListDetailOverlayList.prototype.onLoadRecordIndex_ID = function( basket_id, callback, delegator )
{
	ReviewBaskets_BasketIndex_Load_ID( basket_id, this.filter, this.sort_direction + this.sort_field, callback, delegator );
}

ReviewBasketsListDetailOverlayList.prototype.onGetRecordID = function( record )
{
	return record.basket_id;
}

ReviewBasketsListDetailOverlayList.prototype.onCreateRootColumnList = function()
{
	var self = this;

	var columnlist =
	[
		new MMList_Column( 'Basket #', 'basket_id' )
			.SetDefaultActive( true )
			.SetHeaderAttributeList( { 'class': 'mm_list_column_header' } )
			.SetHeaderStyleList( { 'width': '210px', 'paddingLeft': '15px' } )
			.SetContentStyleList( { 'paddingLeft': '15px', 'paddingTop': '10px' } )
			.SetOnDisplayData( function( record ) { return self.DisplayData_Basket( record ); } )
	];

	return columnlist;
}

ReviewBasketsListDetailOverlayList.prototype.DisplayData_Basket = function( record )
{
	var container, basket_number, basket_total, basket_number_container;

	container				= newElement( 'div',	null,																null, null );
	basket_number_container	= newElement( 'div',	{ 'class': 'mm_detailoverlay_reviewbaskets_number_container' },		null, container );
	basket_number			= newElement( 'span',	{ 'class': 'mm_detailoverlay_reviewbaskets_number' },				null, basket_number_container );
	basket_total			= newElement( 'div',	{ 'class': 'mm_detailoverlay_reviewbaskets_total' },				null, container );
	basket_total.innerHTML	= record.formatted_subtotal;

	newTextNode( '#' + record.basket_id, basket_number );

	return container;
}
