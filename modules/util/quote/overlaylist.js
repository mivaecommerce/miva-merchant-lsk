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

// Quote List Detail Overlay List
////////////////////////////////////////////////////

function QuoteListDetailOverlayList( prefix )
{
	OrderListDetailOverlayList.call( this, prefix );
	this.SetDefaultSort( 'id', '-' );
}

DeriveFrom( OrderListDetailOverlayList, QuoteListDetailOverlayList );

QuoteListDetailOverlayList.prototype.onLoad = BaseQuoteList.prototype.onLoad;

QuoteListDetailOverlayList.prototype.onLoadRecordIndex = BaseQuoteList.prototype.onLoadRecordIndex;

QuoteListDetailOverlayList.prototype.onLoadRecordIndex_ID = function( id, callback, delegator )
{
	QuoteIndex_Load_ID( id, this.filter, this.sort_direction + this.sort_field, callback, delegator );
}

QuoteListDetailOverlayList.prototype.onCreateRootColumnList = function()
{
	var self = this;
	var column;

	column = OrderListDetailOverlayList.prototype.onCreateRootColumnList.call( this )[ 0 ]
			 .SetHeaderText( 'Quote #' )
			 .SetOnDisplayData( function( record ) { return self.DisplayData_Quote( record ); } );

	return [ column ];
}

QuoteListDetailOverlayList.prototype.ActiveItemList_True_Empty = function()
{
	this.selected_item		= null;
	this.itemlist_active	= new Array();
}

QuoteListDetailOverlayList.prototype.GoTo_Quote = function( quote_id )
{
	var self = this;
	var item;

	QuoteIndex_Load_ID( quote_id, this.filters, this.sort_direction + this.sort_field, function( response )
	{
		if ( response.data.index >= self.GetCount() )
		{
			return;
		}

		if ( ( item = self.GetListItem( response.data.index ) ) !== null )
		{
			if ( !self.IndexIsFullyVisible( item.index ) )
			{
				self.ScrollToIndex( response.data.index );
			}

			self.ActiveItemList_AppendItem( item );
			self.ReBindVisibleRows( true );

			return;
		}
	} );
}

QuoteListDetailOverlayList.prototype.DisplayData_Quote = function( record )
{
	var container, quote_number_container, quote_id, quote_status, quote_name, quote_total;

	container				= newElement( 'div',	null,													null, null );
	quote_number_container	= newElement( 'div',	{ 'class': 'mm_detailoverlay_order_number_container' },	null, container );
	quote_id				= newElement( 'span',	{ 'class': 'mm_detailoverlay_order_number' },			null, quote_number_container );
	quote_status			= newElement( 'span',	{ 'class': 'mm_detailoverlay_order_status' },			null, quote_number_container );
	quote_name				= newElement( 'div',	{ 'class': 'mm_detailoverlay_order_name' },				null, container );
	quote_total				= newElement( 'div',	{ 'class': 'mm_detailoverlay_order_total' },			null, container );

	switch ( record.status )
	{
		case 0	:
		{
			newTextNode( 'New', quote_status );
			quote_status.className += ' quotelistdetailoverlay_status_new';

			break;
		}
		case 1	:
		{
			newTextNode( 'Sent', quote_status );
			quote_status.className += ' quotelistdetailoverlay_status_sent';

			break;
		}
		case 2	:
		{
			newTextNode( 'Modified', quote_status );
			quote_status.className += ' quotelistdetailoverlay_status_modified';

			break;
		}
		case 3	:
		{
			newTextNode( 'Accepted', quote_status );
			quote_status.className += ' quotelistdetailoverlay_status_accepted';

			break;
		}
		case 4	:
		{
			newTextNode( 'Viewed', quote_status );
			quote_status.className += ' quotelistdetailoverlay_status_viewed';

			break;
		}
		case 5	:
		{
			newTextNode( 'Purchased', quote_status );
			quote_status.className += ' quotelistdetailoverlay_status_purchased';

			break;
		}
		case 6	:
		{
			newTextNode( 'Expired', quote_status );
			quote_status.className += ' quotelistdetailoverlay_status_expired';

			break;
		}
		case 7	:
		{
			newTextNode( 'Response Needed', quote_status );
			quote_status.className += ' quotelistdetailoverlay_status_change';

			break;
		}
		case 8	:
		{
			newTextNode( 'Converted to Order', quote_status );
			quote_status.className += ' quotelistdetailoverlay_status_convertred';

			break;
		}
		default	:
		{
			newTextNode( 'Unknown', quote_status );
			quote_status.className += ' quotelistdetailoverlay_status_unknown';

			break;
		}
	}

	newTextNode( record.formatted_total, quote_total );
	newTextNode( '#' + record.id, quote_id );
	newTextNode( record.fname + ' ' + record.lname, quote_name );

	return container;
}