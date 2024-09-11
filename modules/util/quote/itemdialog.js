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

// Quote Item Dialog
////////////////////////////////////////////////////

function Quote_ItemDialog( quote, quoteitem )
{
	this.quote						= quote;
	this.quoteitem					= quoteitem;

	Order_ItemDialog.call( this, quote, quoteitem );
}

DeriveFrom( Order_ItemDialog, Quote_ItemDialog );

Quote_ItemDialog.prototype.Add = function( plus )
{
	var self = this;

	if ( !this.Validate() )
	{
		return;
	}

	if ( plus )	this.ActionItem_Processing_Start( this.button_addplus );
	else		this.ActionItem_Processing_Start( this.button_save );

	QuoteItem_Add( this.quote.id, this.BuildItemData(), function( response )
	{
		self.ActionItem_Processing_End();

		if ( !response.success )
		{
			return self.onerror( response.error_message );
		}

		if ( self.quote.total != response.data.total )
		{
			self.quote.total			= response.data.total;
			self.quote.formatted_total	= response.data.formatted_total;
		}

		self.ClearAdd();
		self.Recalculate();

		self.edit_code.focus();

		self.onadd();

		if ( !plus )
		{
			self.Hide();
			self.onclose();
		}
	} );
}

Quote_ItemDialog.prototype.Update = function()
{
	var self = this;

	if ( !this.Validate() )
	{
		return;
	}

	this.ActionItem_Processing_Start( this.button_save );

	QuoteItem_Update( this.quote.id, this.quoteitem.line_id, this.BuildItemData(), function( response )
	{
		self.ActionItem_Processing_End();

		if ( !response.success )
		{
			return self.onerror( response.error_message );
		}

		if ( self.quote.total != response.data.total )
		{
			self.quote.total			= response.data.total;
			self.quote.formatted_total	= response.data.formatted_total;
		}

		self.Hide();
		self.onupdate();
	} );
}
