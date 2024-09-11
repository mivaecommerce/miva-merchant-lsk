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

// Quote Customer Dashboard
////////////////////////////////////////////////////

function Quote_CustomerDashboard( customer, element_container, element_title, element_actions, element_content )
{
	var self = this;

	this.customer									= customer;
	this.element_container							= element_container;
	this.element_title								= element_title;
	this.element_actions							= element_actions;
	this.element_content							= element_content;

	this.element_quotes_content_list_container		= newElement( 'span', { 'class': 'mm10_dashboard_item_list_container' },			null, this.element_content );
	this.element_quotes_content_loading_container	= newElement( 'span', { 'class': 'mm10_dashboard_item_loading_container fixed' },	null, this.element_content );

	this.button_quotes_view_quotes					= new MMButton( this.element_actions );
	this.button_quotes_view_quotes.SetText( 'View All' );
	this.button_quotes_view_quotes.SetAllowMiddleClick( true );
	this.button_quotes_view_quotes.SetClassName( 'mm10_button_style_link small' );
	this.button_quotes_view_quotes.SetOnClickHandler( function( e ) { self.ViewQuotes( e ); } );

	if ( CanI( 'ORDR', 0, 1, 0, 0 ) && CanI( 'ORDR', 0, 0, 1, 0 ) )
	{
		this.button_quotes_new_quote				= new MMButton( this.element_actions );
		this.button_quotes_new_quote.SetText( 'New Quote' );
		this.button_quotes_new_quote.SetAllowMiddleClick( true );
		this.button_quotes_new_quote.SetClassName( 'mm10_button_style_primary_muted small' );
		this.button_quotes_new_quote.SetOnClickHandler( function( e ) { self.NewQuote( e ); } );
	}

	this.QuoteList_Load();
}

Quote_CustomerDashboard.prototype.QuoteList_Load = function( response )
{
	var self = this;

	classNameRemoveIfPresent( this.element_container,							'no_content' );
	classNameRemoveIfPresent( this.element_quotes_content_list_container,		'visible' );
	classNameRemoveIfPresent( this.element_quotes_content_loading_container,	'visible' );

	filter									= [ new MMList_Filter_Search( new MMList_Filter_Search_Value( 'cust_id', 'EQ', this.customer.id ) ) ];

	this.loading_indicator_quotes			= new MMLoadingIndicator( this.element_quotes_content_loading_container );
	this.loading_indicator_quotes.onShow	= function() { classNameAddIfMissing( self.element_quotes_content_loading_container, 'visible' ); };
	this.loading_indicator_quotes.onHide	= function() { classNameRemoveIfPresent( self.element_quotes_content_loading_container, 'visible' ); };
	this.loading_indicator_quotes.SetDimension( 48 );
	this.loading_indicator_quotes.SetLineWidth( 2 );

	this.loading_indicator_quotes.Show();
	EmptyElement_NoResize( this.element_quotes_content_list_container );

	QuoteList_Load_Query( filter, '-id', 0, 6, function( response ) { self.QuoteList_Load_Query_Callback( response ); } );
}

Quote_CustomerDashboard.prototype.QuoteList_Load_Query_Callback = function( response )
{
	var i, i_len, element_title_text, element_title_count;

	this.loading_indicator_quotes.Hide();

	EmptyElement_NoResize( this.element_title );

	element_title_text				= newElement( 'span', { 'class': 'mm10_dashboard_item_title_text' },	null, this.element_title );
	element_title_count				= newElement( 'span', { 'class': 'mm10_dashboard_item_title_count' },	null, this.element_title );

	element_title_text.textContent	= 'Quotes';
	element_title_count.textContent	= ( response.success && response.data.total_count > 0 ? ( '(' + response.data.total_count + ')' ) : '' );

	if ( !response.success || response.data.data.length === 0 )
	{
		this.button_quotes_view_quotes.Hide();

		classNameRemoveIfPresent( this.element_quotes_content_list_container,		'visible' );
		classNameRemoveIfPresent( this.element_quotes_content_loading_container,	'visible' );

		classNameAddIfMissing( this.element_container, 'no_content' );

		return;
	}

	this.button_quotes_view_quotes.Show();
	this.Build_Header();

	for ( i = 0, i_len = response.data.data.length; i < i_len; i++ )
	{
		this.Build_Quote( response.data.data[ i ] );
	}

	classNameAddIfMissing( this.element_quotes_content_list_container,				'visible' );
}

Quote_CustomerDashboard.prototype.Build_Header = function()
{
	var element;

	element									= newElement( 'span', { 'class': 'mm10_dashboard_item_list_row header' },										null, this.element_quotes_content_list_container );
	element.element_quote_id				= newElement( 'span', { 'class': 'mm10_dashboard_item_list_cell mm10_customer_dashboard_quotes_quote_id' },		null, element );
	element.element_status					= newElement( 'span', { 'class': 'mm10_dashboard_item_list_cell mm10_customer_dashboard_quotes_quote_status' },	null, element );
	element.element_date					= newElement( 'span', { 'class': 'mm10_dashboard_item_list_cell mm10_customer_dashboard_quotes_quote_date' },	null, element );
	element.element_total					= newElement( 'span', { 'class': 'mm10_dashboard_item_list_cell mm10_customer_dashboard_quotes_quote_total' },	null, element );

	element.element_quote_id.textContent	= 'Quote No.';
	element.element_status.textContent		= 'Status';
	element.element_date.textContent		= 'Created';
	element.element_total.textContent		= 'Total';

	return element;
}

Quote_CustomerDashboard.prototype.Build_Quote = function( quote )
{
	var self = this;
	var element;

	element								= newElement( 'span', { 'class': 'mm10_dashboard_item_list_row' },												null, this.element_quotes_content_list_container );
	element.element_quote_id			= newElement( 'span', { 'class': 'mm10_dashboard_item_list_cell mm10_customer_dashboard_quotes_quote_id' },		null, element );
	element.element_status				= newElement( 'span', { 'class': 'mm10_dashboard_item_list_cell mm10_customer_dashboard_quotes_quote_status' },	null, element );
	element.element_date				= newElement( 'span', { 'class': 'mm10_dashboard_item_list_cell mm10_customer_dashboard_quotes_quote_date' },	null, element );
	element.element_total				= newElement( 'span', { 'class': 'mm10_dashboard_item_list_cell mm10_customer_dashboard_quotes_quote_total' },	null, element );

	element.button_quote_id				= new MMButton( element.element_quote_id );
	element.button_quote_id.SetText( quote.id );
	element.button_quote_id.SetAllowMiddleClick( true );
	element.button_quote_id.SetClassName( 'mm10_button_style_link small unbold' );
	element.button_quote_id.SetOnClickHandler( function( e ) { return self.ViewQuote( quote.id, ( keySupportsMultiSelect( e ) || mouseClickType( e ) == 'MIDDLE' ) ); } );

	element.element_date.textContent	= ( new Date( quote.created * 1000 ) ).toLocaleString();
	element.element_total.innerHTML		= quote.formatted_total;

	switch ( quote.status )
	{
		case 1	: classNameAddIfMissing( element.element_status, 'mm10_customer_dashboard_quotes_quote_status_sent' );					break;
		case 2	: classNameAddIfMissing( element.element_status, 'mm10_customer_dashboard_quotes_quote_status_modified' );				break;
		case 3	: classNameAddIfMissing( element.element_status, 'mm10_customer_dashboard_quotes_quote_status_accepted' );				break;
		case 4	: classNameAddIfMissing( element.element_status, 'mm10_customer_dashboard_quotes_quote_status_viewed' );				break;
		case 5	: classNameAddIfMissing( element.element_status, 'mm10_customer_dashboard_quotes_quote_status_purchased' );				break;
		case 6	: classNameAddIfMissing( element.element_status, 'mm10_customer_dashboard_quotes_quote_status_expired' );				break;
		case 7	: classNameAddIfMissing( element.element_status, 'mm10_customer_dashboard_quotes_quote_status_response_needed' );		break;
		case 8	: classNameAddIfMissing( element.element_status, 'mm10_customer_dashboard_quotes_quote_status_converted_to_order' );	break;
		default	: classNameAddIfMissing( element.element_status, 'mm10_customer_dashboard_quotes_quote_status_new' );					break;
	}

	return element;
}

Quote_CustomerDashboard.prototype.ViewQuote = function( quote_id, open_in_new_window )
{
	var self = this;
	var overlay;

	if ( open_in_new_window )
	{
		return OpenLinkHandler_NewWindow( adminurl, { Screen: 'SUTL', Tab: 'MNGQ', Store_Code: Store_Code, Module_Code: 'quote', Quote_ID: quote_id } );
	}

	overlay					= new Customer_QuoteListDetailOverlay( this.customer );
	overlay.onDismiss_End	= function() { self.QuoteList_Load(); };

	overlay.Show( quote_id );
}

Quote_CustomerDashboard.prototype.ViewQuotes = function( e )
{
	var self = this;
	var dialog;

	if ( keySupportsMultiSelect( e ) || mouseClickType( e ) == 'MIDDLE' )
	{
		return OpenLinkHandler_NewWindow( adminurl, { Screen: 'SUTL', Tab: 'MNGQ', Store_Code: Store_Code, Module_Code: 'quote' } );
	}

	dialog 			= new Customer_QuoteDialog( this.customer );
	dialog.onHide	= function() { self.QuoteList_Load(); };

	dialog.Show();
}

Quote_CustomerDashboard.prototype.NewQuote = function( e )
{
	var self = this;
	var open_in_new_window;

	if ( keySupportsMultiSelect( e ) || mouseClickType( e ) == 'MIDDLE' )	open_in_new_window = true;
	else																	open_in_new_window = false;

	Quote_Create_Empty( function( response )
	{
		var quote;

		if ( !response.success )
		{
			return self.onError( response.error_message );
		}

		quote			= response.data;
		quote.cust_id	= self.customer.id;

		StandardFields_Load( function( response )
		{
			var standardfields;

			if ( !response.success )
			{
				return self.onError( response.error_message );
			}

			standardfields = response.data;

			if ( standardfields.primaddr == 'shipping' )
			{
				quote.email		= self.customer.ship_email;
				quote.fname		= self.customer.ship_fname;
				quote.lname		= self.customer.ship_lname;
				quote.phone		= self.customer.ship_phone;
				quote.zip		= self.customer.ship_zip;
				quote.country	= self.customer.ship_cntry;
			}
			else
			{
				quote.email		= self.customer.bill_email;
				quote.fname		= self.customer.bill_fname;
				quote.lname		= self.customer.bill_lname;
				quote.phone		= self.customer.bill_phone;
				quote.zip		= self.customer.bill_zip;
				quote.country	= self.customer.bill_cntry;
			}

			Quote_Update_Requester_Information( quote.id, quote, function( customer_response )
			{
				if ( !response.success )
				{
					return self.onError( response.error_message );
				}

				if ( open_in_new_window )
				{
					self.QuoteList_Load();
				}

				self.ViewQuote( quote.id, open_in_new_window );
			} );
		} );
	} );
}

Quote_CustomerDashboard.prototype.onError = function( error_message )
{
	var dialog;

	dialog = new ActionDialog();
	dialog.SetTitle( 'Error' );
	dialog.SetMessage( error_message );
	dialog.Show();
}