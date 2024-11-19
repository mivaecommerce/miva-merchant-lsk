// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2024 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// Quote Item Dialog
////////////////////////////////////////////////////

var Quote_ItemDialog = class extends BaseItemAddEditDialog
{
	#quote;
	#quoteitem;

	constructor( quote, quoteitem )
	{
		super( quoteitem );

		this.#quote		= quote;
		this.#quoteitem	= quoteitem;
	}

	onProcessAdd( data, callback )
	{
		QuoteItem_Add( this.#quote.id, data, ( response ) =>
		{
			if ( response.success && this.#quote.total !== response.data.total )
			{
				this.#quote.total			= response.data.total;
				this.#quote.formatted_total	= response.data.formatted_total;
			}

			callback( response );
		} );
	}

	onProcessUpdate( data, callback )
	{
		QuoteItem_Update( this.#quote.id, this.#quoteitem.line_id, data, ( response ) =>
		{
			if ( response.success && this.#quote.total !== response.data.total )
			{
				this.#quote.total			= response.data.total;
				this.#quote.formatted_total	= response.data.formatted_total;
			}

			callback( response );
		} );
	}

	onProcessDetermineSKU( product_code, attributes, callback )
	{
		OrderItem_DetermineSKU( product_code, attributes, callback );
	}

	onProcessDetermineVariant( product_code, attributes, callback )
	{
		OrderItem_DetermineVariant( product_code, attributes, callback );
	}

	onRetrieveCustomerID()
	{
		return this.#quote.cust_id;
	}
}