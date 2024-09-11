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

// Review Baskets List Detail Overlay 
////////////////////////////////////////////////////

function ReviewBasketsListDetailOverlay()
{
	var self = this;

	this.overlay_list		= new ReviewBasketsListDetailOverlayList( 'mm_detailoverlay_reviewbaskets' );
	this.overlay_details	= new ReviewBasketsListDetailOverlayDetails( 'mm_detailoverlay_reviewbaskets' );

	MMListDetailOverlay.call( this, 'mm_detailoverlay_reviewbaskets', this.overlay_list, this.overlay_details );

	this.overlay_details.ondelete		= function() { self.Dismiss(); };
	this.overlay_details.onclose		= function() { self.Dismiss(); };
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

DeriveFrom( MMListDetailOverlay, ReviewBasketsListDetailOverlay );

ReviewBasketsListDetailOverlay.prototype.onRecordNotFoundError = function( id )
{
	return 'Basket ID ' + id + ' not found';
}
