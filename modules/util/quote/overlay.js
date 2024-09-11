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

// Quote List Detail Overlay
////////////////////////////////////////////////////

function QuoteListDetailOverlay()
{
	var self = this;

	this.overlay_list		= new QuoteListDetailOverlayList( 'mm_detailoverlay_quote' );
	this.overlay_details	= new QuoteListDetailOverlayDetails( 'mm_detailoverlay_quote' );

	MMListDetailOverlay.call( this, 'mm_detailoverlay_quote', this.overlay_list, this.overlay_details );

	this.overlay_details.ondelete		= function() { self.Dismiss(); };
	this.overlay_details.onclose		= function() { self.Dismiss(); };
	this.overlay_details.oncopy			= function( new_quote_id )
	{
		self.overlay_list.ActiveItemList_True_Empty();

		self.overlay_list.OnLoadSingleUse_AddHook( function( start_index )
		{
			self.overlay_list.GoTo_Quote( new_quote_id );
		} );

		self.overlay_list.Refresh();
	};
	this.overlay_details.onrefreshlist	= function( callback )
	{
		self.overlay_list.OnLoadSingleUse_AddHook( function( start_index )
		{
			if ( typeof callback === 'function' )
			{
				callback();
			}
		} );

		self.overlay_list.Refresh( true );
	};
}

DeriveFrom( MMListDetailOverlay, QuoteListDetailOverlay );

QuoteListDetailOverlay.prototype.onRecordNotFoundError = function( id )
{
	return 'Quote #' + id + ' not found';
}
