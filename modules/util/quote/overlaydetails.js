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

// Quote List Detail Overlay Details
////////////////////////////////////////////////////

function QuoteListDetailOverlayDetails( container_id )
{
	MMListDetailOverlayDetails.call( this, container_id );

	this.can_modify								= CanI( 'ORDR', 0, 0, 1, 0 );
	this.can_delete								= CanI( 'ORDR', 0, 0, 0, 1 );
	this.can_view_customer						= CanI( 'CUST', 1, 0, 0, 0 );

	// Detail Variables
	this.quote	 								= null;
	this.delegator								= new AJAX_ThreadPool( 6 );
	this.quoteitemlist							= new Array();
	this.processing_counter						= new Array();
	this.standardfields							= null;

	// Detail Controls
	this.customfield_tab						= document.getElementById( 'quotelist_quotedetail_tab_customfields' );
	this.quotenotes_tab							= document.getElementById( 'quotelist_quotedetail_tab_notes' );
	this.title_quote_id							= document.getElementById( 'quotelist_quotedetail_title_quote_id' );
	this.title_quote_date						= document.getElementById( 'quotelist_quotedetail_title_quote_date' );
	this.title_quote_customer_container			= document.getElementById( 'quotelist_quotedetail_title_quote_customer_container' );
	this.title_quote_customer					= document.getElementById( 'quotelist_quotedetail_title_quote_customer' );
	this.title_quote_customer_edit				= document.getElementById( 'quotelist_quotedetail_title_quote_customer_edit' );
	this.refresh								= document.getElementById( 'quotelist_quotedetail_refresh' );
	this.close									= document.getElementById( 'quotelist_quotedetail_close' );

	this.ship_name								= document.getElementById( 'quotelist_quotedetail_ship_name' );
	this.ship_email								= document.getElementById( 'quotelist_quotedetail_ship_email' );
	this.ship_phone								= document.getElementById( 'quotelist_quotedetail_ship_phone' );
	this.ship_zip								= document.getElementById( 'quotelist_quotedetail_ship_zip' );
	this.ship_cntry								= document.getElementById( 'quotelist_quotedetail_ship_cntry' );

	this.items									= document.getElementById( 'quotelist_quotedetail_items' );
	this.itemlist_selectall						= document.getElementById( 'quotelist_quotedetail_itemlist_selectall' );

	this.subtotal								= document.getElementById( 'quotelist_quotedetail_subtotal' );
	this.charges								= document.getElementById( 'quotelist_quotedetail_charges' );
	this.total									= document.getElementById( 'quotelist_quotedetail_total' );

	this.element_ship_edit_container			= document.getElementById( 'quotelist_quotedetail_ship_edit_container' );
	this.element_itemlist_button_container		= document.getElementById( 'quotelist_quotedetail_itemlist_button_container' );
	this.element_button_delete_quote			= document.getElementById( 'quotelist_quotedetail_button_delete_quote' );
	this.element_button_recalculate_discounts	= document.getElementById( 'quotelist_quotedetail_button_recalculate_discounts' );
	this.element_button_quote_shipping			= document.getElementById( 'quotelist_quotedetail_button_quote_shipping' );

	this.element_loading						= document.getElementById( 'quotelist_quotedetail_loading_container' );
	this.element_quotedetail_container			= document.getElementById( 'quotelist_quotedetail_container' );

	this.radio_date								= new MMDialog_RadioGroup_Controller();
	this.radio_date_defined						= this.radio_date.AddRadio( 'quotelist_quotedetail_date_expires_defined' );
	this.radio_date_never						= this.radio_date.AddRadio( 'quotelist_quotedetail_date_expires_never' );

	this.date_exact								= null;
	this.edit_date_exact						= new MMDialog_DateTimePicker_Controller( 'quotelist_quotedetail_date_exact' );

	// Buttons
	this.ship_button_edit						= null;
	this.button_delete_quote					= null;
	this.itemlist_button_delete					= null;
	this.itemlist_button_add					= null;
	this.itemlist_button_send					= null;
	this.itemlist_button_copy					= null;
	this.itemlist_button_convert				= null;
}

DeriveFrom( MMListDetailOverlayDetails, QuoteListDetailOverlayDetails );

QuoteListDetailOverlayDetails.prototype.Edit_Requester = function()
{
	var self = this;
	var dialog;

	dialog			= new Quote_RequesterEditDialog( this.quote );
	dialog.onsave	= function()
	{
		self.Reload();
	}

	dialog.Show();
}

QuoteListDetailOverlayDetails.prototype.CustomField_Edit = function()
{
	var dialog;

	dialog = new Quote_CustomFieldDialog( this.quote );
	dialog.Show();
}

QuoteListDetailOverlayDetails.prototype.NotesDialog = function()
{
	var dialog;

	dialog = new Quote_NoteDialog( this.quote );
	dialog.Show();
}

QuoteListDetailOverlayDetails.prototype.onShow = function()
{
	var self = this;

	this.element_loading.style.display 					= 'block';
	this.element_quotedetail_container.style.visibility	= 'hidden';

	this.title_quote_customer_edit.innerHTML			= '';

	this.element_button_delete_quote.innerHTML			= '';
	this.element_button_recalculate_discounts.innerHTML	= '';
	this.element_button_quote_shipping.innerHTML		= '';
	this.element_ship_edit_container.innerHTML			= '';
	this.element_itemlist_button_container.innerHTML	= '';

	this.date_exact = new Date();

	// Detail Events
	if ( this.refresh )				this.refresh.onclick			= function() { self.Reload(); return false; };
	if ( this.close )				this.close.onclick				= function() { self.onclose(); return false; };
	if ( this.customfield_tab )		this.customfield_tab.onclick	= function() { self.CustomField_Edit(); return false; };
	if ( this.quotenotes_tab )		this.quotenotes_tab.onclick		= function() { self.NotesDialog(); return false; };
	if ( this.itemlist_selectall )	this.itemlist_selectall.onclick = function() { self.ItemList_SelectAll( this.checked ); };

	if ( this.can_modify )
	{
		this.customer_edit = new MMButton( this.title_quote_customer_edit );
		this.customer_edit.SetText( 'Assign' );
		this.customer_edit.SetClassName( 'quotelist_quotedetail_button' );
		this.customer_edit.SetOnClickHandler( function() { self.Customer_Assign(); } );

		this.ship_button_edit = new MMButton( this.element_ship_edit_container );
		this.ship_button_edit.SetText( 'Edit' );
		this.ship_button_edit.SetOnClickHandler( function() { self.Edit_Requester(); } );
		this.ship_button_edit.SetClassName( 'quotelist_quotedetail_button' );

		this.itemlist_button_delete = new MMButton( this.element_itemlist_button_container );
		this.itemlist_button_delete.SetText( 'Delete' );
		this.itemlist_button_delete.SetOnClickHandler( function() { self.ItemList_Delete(); } );
		this.itemlist_button_delete.SetClassName( 'quotelist_quotedetail_button' );

		this.itemlist_button_add = new MMButton( this.element_itemlist_button_container );
		this.itemlist_button_add.SetText( 'Add Item(s)' );
		this.itemlist_button_add.SetOnClickHandler( function() { self.ItemList_Add(); } );
		this.itemlist_button_add.SetClassName( 'quotelist_quotedetail_button' );

		this.itemlist_button_send = new MMButton( this.element_itemlist_button_container );
		this.itemlist_button_send.SetText( 'Send Quote' );
		this.itemlist_button_send.SetOnClickHandler( function() { self.Send_Quote(); } );
		this.itemlist_button_send.SetClassName( 'quotelist_quotedetail_button' );

		this.itemlist_button_copy = new MMButton( this.element_itemlist_button_container );
		this.itemlist_button_copy.SetText( 'Copy Quote' );
		this.itemlist_button_copy.SetOnClickHandler( function() { self.Copy_Quote(); } );
		this.itemlist_button_copy.SetClassName( 'quotelist_quotedetail_button' );

		this.itemlist_button_convert = new MMButton( this.element_itemlist_button_container );
		this.itemlist_button_convert.SetText( 'Convert Quote' );
		this.itemlist_button_convert.SetOnClickHandler( function() { self.Convert_Quote(); } );
		this.itemlist_button_convert.SetClassName( 'quotelist_quotedetail_button' );

		this.edit_date_exact.SetValue( this.date_exact );
		this.edit_date_exact.onRetrieveInitialDate	= function() { return self.date_exact; };

		this.radio_date_defined.SetOnClickHandler( function() { self.Date_Method_Changed( 'defined' ); } );
		this.radio_date_never.SetOnClickHandler( function() { self.Date_Method_Changed( 'never' ); } );
	}

	if ( this.can_delete )
	{
		this.button_delete_quote = new MMButton( this.element_button_delete_quote );
		this.button_delete_quote.SetText( 'Delete This Quote' );
		this.button_delete_quote.SetOnClickHandler( function() { self.Quote_Delete(); } );
		this.button_delete_quote.SetClassName( 'quotelist_quotedetail_button' );
	}

	if ( this.can_modify )
	{
		this.button_recalculate_discounts = new MMButton( this.element_button_recalculate_discounts );

		this.button_recalculate_discounts.SetText( 'Recalculate Discounts' );
		this.button_recalculate_discounts.SetOnClickHandler( function() { self.Recalculate_Discounts(); } );
		this.button_recalculate_discounts.SetClassName( 'quotelist_quotedetail_button' );
	}

	if ( this.can_modify && CanI( 'SHIP', 1, 0, 0, 0 ) )
	{
		this.button_quote_shipping = new MMButton( this.element_button_quote_shipping );

		this.button_quote_shipping.SetText( 'Calculate Shipping' );
		this.button_quote_shipping.SetOnClickHandler( function() { self.Quote_Shipping(); } );
		this.button_quote_shipping.SetClassName( 'quotelist_quotedetail_button' );
	}
}

QuoteListDetailOverlayDetails.prototype.ItemList_Add = function()
{
	var self = this;
	var quoteitem_dialog;

	quoteitem_dialog		= new Quote_ItemDialog( this.quote, null );
	quoteitem_dialog.onAdd	= function()
	{
		self.Reload();
	}

	quoteitem_dialog.Show();
}

QuoteListDetailOverlayDetails.prototype.ItemList_Edit = function( item )
{
	var self = this;
	var quoteitem_dialog;

	quoteitem_dialog			= new Quote_ItemDialog( this.quote, item );
	quoteitem_dialog.onUpdate	= function()
	{
		self.Reload();
	}

	quoteitem_dialog.Show();
}

QuoteListDetailOverlayDetails.prototype.Copy_Quote = function()
{
	var self = this;
	var processing;

	processing = new ProcessingDialog();
	processing.Show( 'Copying Quote' );

	Quote_Copy( this.quote.id, function( response )
	{
		var dialog;

		processing.Hide();

		if ( !response.success )
		{
			return self.onerror( response.error_message );
		}

		dialog = new AlertDialog();
		dialog.SetTitle( 'Quote Copied' );
		dialog.SetMessage( 'You are now editing the new quote.' );
		dialog.Show();

		self.oncopy( response.data.id );
	} );
}

QuoteListDetailOverlayDetails.prototype.Convert_Quote = function()
{
	var self = this;
	var customer_copy_confirm;

	if ( !this.quote.cust_id ) 
	{
		self.Convert_Quote_LowLevel( false );
	}
	else
	{
		customer_copy_confirm		= new ConfirmationDialog();
		customer_copy_confirm.onNo	= function() { self.Convert_Quote_LowLevel( false ); };
		customer_copy_confirm.onYes	= function() { self.Convert_Quote_LowLevel( true ); };

		customer_copy_confirm.Show( 'Copy the customer account information to new order?' );
	}
}

QuoteListDetailOverlayDetails.prototype.Convert_Quote_LowLevel = function( customer_copy )
{
	var self = this;
	var processing, confirmation;

	processing = new ProcessingDialog();
	processing.Show( 'Converting Quote' );

	Quote_Convert( this.quote.id, this.quote.cust_id, customer_copy, function( response )
	{
		processing.Hide();

		if ( !response.success )
		{
			return self.onerror( response.error_message );
		}

		self.onconvert( response.data.order_id );

		confirmation		= new ConfirmationDialog();
		confirmation.onYes	= function( e )
		{
			window.location.href = adminurl + 'Screen=MORD&Order_ID=' + encodeURIComponent( response.data.order_id ) + '&Store_Code=' + encodeURIComponent( Store_Code );
		};
		confirmation.Show( 'Quote Converted to Order #' + encodeentities( response.data.order_id ) + '.<br /><br />Would you like to view that order now?' );
	} );
}

QuoteListDetailOverlayDetails.prototype.Send_Quote = function()
{
	var self = this;
	var branch, dialog;

	branch = top.mm9_screen.GetWorkingBranch();

	dialog = new ConfirmationDialog();
	dialog.SetTitle( 'Send Quote' );
	dialog.onYes = function()
	{
		var processing;

		processing = new ProcessingDialog();
		processing.Show( 'Sending Quote' );

		Quote_Send( self.quote.id, function( response )
		{
			processing.Hide();

			if ( !response.success )
			{
				return self.onerror( response.error_message );
			}

			self.Refresh( 'quote,update_overlay' );
		} );
	};

	if ( branch.is_primary )	dialog.SetMessage( `Are you sure you want to send this quote to '${encodeentities( this.quote.email )}' now?` );
	else						dialog.SetMessage( `The current working branch is <span class="quotelist_nonprimary_branch_warning_branch_color" style="background-color: ${encodeentities( branch.color )}"></span> <b>${encodeentities( branch.name )}</b>, which is not the primary branch.<br /><br />The email will be sent using the content and configuration from the working branch.<br /><br />Are you sure you want to send this quote to '${encodeentities( this.quote.email )}' now?` );

	dialog.Show();
}

QuoteListDetailOverlayDetails.prototype.onUpdateContent = function( quote )
{
	this.quote = quote;

	this.Refresh_Quote();
	this.Refresh( 'customer,total,items,charges,show_loading,addresses,standardfields' );
}

QuoteListDetailOverlayDetails.prototype.ItemList_Delete = function()
{
	var self = this;
	var i, i_len, line_ids, dialog, button_cancel, button_delete;

	line_ids		= new Array();

	for ( i = 0, i_len = this.quoteitemlist.length; i < i_len; i++ )
	{
		if ( this.quoteitemlist[ i ].element_checkbox.checked )
		{
			line_ids.push( this.quoteitemlist[ i ].line_id )
		}
	}

	if ( line_ids.length == 0 )
	{
		return;
	}

	dialog 			= new ActionDialog();
	dialog.onESC	= function( e ) { button_cancel.SimulateClick(); };

	button_cancel	= dialog.Button_Add_Right_Secondary( 'Cancel',			'', function() { ; } );
	button_delete	= dialog.Button_Add_Right_Negative_Primary( 'Delete',	'', function() { self.ItemList_Delete_LowLevel( line_ids ); } );

	dialog.SetTitle( 'Delete Items?' );
	dialog.SetMessage( 'This action cannot be undone.' );
	dialog.Show();
}

QuoteListDetailOverlayDetails.prototype.ItemList_Delete_LowLevel = function( line_ids )
{
	var self = this;
	var delegator;

	delegator				= new AJAX_ThreadPool( 3 );
	delegator.onStart		= function() { self.SetProcessing_Start(); };
	delegator.onComplete	= function()
	{
		self.SetProcessing_End();
		self.Reload();
	};

	QuoteItemList_Delete( this.quote.id, line_ids, function( response )
	{
		if ( !response.success )
		{
			return self.onerror( response.error_message );
		}
	}, delegator );

	delegator.Run();
}

QuoteListDetailOverlayDetails.prototype.Quote_Delete = function()
{
	const self = this;
	var confirmation_dialog;

	confirmation_dialog = new ConfirmationDialog();
	confirmation_dialog.SetTitle( 'Confirm' );
	confirmation_dialog.SetMessage( 'Deleting a quote cannot be undone.  Continue?' );
	confirmation_dialog.onYes = function()
	{
		Quote_Delete( self.quote.id, function( response )
		{
			if ( !response.success )
			{
				return self.onerror( response.error_message );
			}

			self.ondelete();
		} );
	};

	confirmation_dialog.Show();
}

QuoteListDetailOverlayDetails.prototype.Recalculate_Discounts = function()
{
	var self = this;
	var processing_dialog;

	processing_dialog = new ProcessingDialog();
	processing_dialog.Show( 'Recalculating Discounts' );

	Quote_RecalculateDiscounts( this.quote.id, function( response )
	{
		processing_dialog.Hide();

		if ( !response.success )
		{
			return self.onerror( response.error_message );
		}

		self.Reload();
	} );
}

QuoteListDetailOverlayDetails.prototype.Quote_Shipping = function()
{
	var self = this;
	var dialog;

	dialog			= new Quote_ShippingMethodDialog( this.quote );
	dialog.onsave	= function() { self.Reload(); }

	dialog.Show();
}

QuoteListDetailOverlayDetails.prototype.Quote_Update_Expiry = function( date )
{
	var self = this;
	var expires;

	if ( date instanceof Date )	expires = stoi_def( date.getTime() / 1000, 0 );
	else						expires = 0;

	Quote_Update_Expiry( this.quote.id, expires, function ( response )
	{
		if ( !response.success ) 
		{
			return self.onerror( response.error_message );
		}

		self.quote.expires = expires;
		self.onupdate( self.quote.id );
	} );
}

QuoteListDetailOverlayDetails.prototype.Date_Method_Changed = function( method )
{
	var self = this;

	this.radio_date_defined.SetChecked( method == 'defined' ? true : false );
	this.radio_date_never.SetChecked( method == 'never' ? true : false );

	if ( method == 'defined' )	
	{
		this.edit_date_exact.Enable();

		self.Quote_Update_Expiry( this.date_exact );
	}
	else
	{
		this.edit_date_exact.Disable();

		self.Quote_Update_Expiry( null );
	}
}

QuoteListDetailOverlayDetails.prototype.Reload = function()
{
	this.Refresh( 'quote,customer,total,items,charges,addresses,update_overlay,show_loading' );
}

QuoteListDetailOverlayDetails.prototype.Refresh = function( items )
{
	var self = this;
	var i, i_len, item_array, item, update_overlay, show_loading;
	var reload_quote, refresh_total, refresh_charges, refresh_addresses;

	if ( this.delegator.Running() )
	{
		if ( this.delegator.show_loading )
		{
			this.SetProcessing_End();
		}

		this.delegator.onStart		= function() { ; };
		this.delegator.onComplete	= function() { ; };

		this.delegator.Cancel();
	}

	reload_quote		= false;
	refresh_total		= false;
	refresh_charges		= false;
	refresh_addresses	= false;

	item_array			= items.split( ',' );

	for ( i = 0, i_len = item_array.length; i < i_len; i++ )
	{
		item			= trim( item_array[ i ] );

		if ( item == 'quote' )					reload_quote		= true;
		else if ( item == 'total' )				refresh_total		= true;
		else if ( item == 'customer' )			this.Reload_Customer();
		else if ( item == 'show_loading' )		show_loading		= true;
		else if ( item == 'addresses' )			refresh_addresses	= true;
		else if ( item == 'update_overlay' )	update_overlay		= true;
		else if ( item == 'items' )				this.Reload_Items();
		else if ( item == 'charges' )			refresh_charges		= true;
		else if ( item == 'standardfields' )	this.Reload_StandardFields();
	}

	if ( reload_quote || refresh_total )
	{
		this.subtotal.innerHTML	= 'Loading...';
	}

	if ( refresh_charges )
	{
		EmptyElement_NoResize( this.charges );
	}

	if ( reload_quote )
	{
		this.Reload_Quote();
	}

	this.delegator.show_loading	= show_loading;
	this.delegator.onStart 		= function()
	{
		if ( show_loading )
		{
			self.SetProcessing_Start();
		}
	};

	this.delegator.onComplete	= function()
	{
		if ( show_loading )
		{
			self.SetProcessing_End();
		}

		self.delegator.show_loading	= false;

		if ( reload_quote || refresh_total )	self.Refresh_Total();
		if ( refresh_charges )					self.Refresh_Charges();
		if ( refresh_addresses )				self.Refresh_Addresses();
		if ( update_overlay )					self.onContentUpdated( self.quote );
	};

	this.delegator.Run();
}

QuoteListDetailOverlayDetails.prototype.Reload_Quote = function()
{
	var self = this;

	Quote_Load_ID( this.quote.id, function( response ) { self.Quote_Load_Callback( response ); }, this.delegator );
}

QuoteListDetailOverlayDetails.prototype.Quote_Load_Callback = function( response )
{
	if ( !response.success )
	{
		return this.onerror( response.error_message );
	}

	this.quote				= response.data;
	this.total.innerHTML	= this.quote.formatted_total;

	this.Refresh_Quote();
}

QuoteListDetailOverlayDetails.prototype.Reload_Customer = function()
{
	var self = this;

	this.title_quote_customer_container.style.display = 'none';

	if ( this.quote.cust_id == 0 || !this.can_view_customer )
	{
		this.customer = null;

		return this.Title_Update_Customer( null );
	}

	Customer_Load_ID( this.quote.cust_id, function( response ) { self.Customer_Load_Callback( response ); }, this.delegator );
}

QuoteListDetailOverlayDetails.prototype.Customer_Load_Callback = function( response )
{
	if ( !response.success )
	{
		this.customer = null;
		this.Title_Update_Customer( null );

		return;
	}

	this.customer = response.data;

	this.Title_Update_Customer( this.customer );
}

QuoteListDetailOverlayDetails.prototype.Title_Update_Customer = function( customer )
{
	var name;

	if ( !this.can_view_customer )
	{
		this.title_quote_customer_container.style.display = 'none';

		return;
	}

	if ( !customer || customer.id == 0 )
	{
		this.title_quote_customer_container.style.display = '';

		if ( this.customer_edit ) this.customer_edit.SetText( 'Assign' );

		newTextNode_EmptyParent( 'N/A', this.title_quote_customer );
	}
	else
	{
		this.title_quote_customer_container.style.display = '';

		if ( this.customer_edit ) this.customer_edit.SetText( 'Edit' );

		if ( customer.bill_fname.length && customer.bill_lname.length )	name = customer.bill_fname + ' ' + customer.bill_lname;
		else if ( customer.bill_fname.length )							name = customer.bill_fname;
		else if ( customer.bill_lname.length )							name = customer.bill_lname;
		else															name = '';

		newTextNode_EmptyParent( customer.login + ( name.length ? ( ' - ' + name ) : '' ), this.title_quote_customer );
	}
}

QuoteListDetailOverlayDetails.prototype.SetProcessing_Start = function()
{
	this.processing_counter.push( true );

	this.element_loading.style.display 					= 'block';
	this.element_quotedetail_container.style.visibility	= 'hidden';
}

QuoteListDetailOverlayDetails.prototype.SetProcessing_End = function()
{
	this.processing_counter.pop();

	if ( this.processing_counter.length )
	{
		return;
	}

	this.element_loading.style.display 					= 'none';
	this.element_quotedetail_container.style.visibility	= '';
}

QuoteListDetailOverlayDetails.prototype.Refresh_Quote = function()
{
	var self = this;

	newTextNode_EmptyParent( this.quote.id, this.title_quote_id );
	newTextNode_EmptyParent( new Date( this.quote.created * 1000 ).toLocaleString(), this.title_quote_date );

	if ( this.quote.expires == 0 )	
	{
		this.radio_date_defined.SetChecked( false );
		this.radio_date_never.SetChecked( true );
		this.edit_date_exact.Disable();

		this.date_exact = new Date();
	}
	else
	{
		this.radio_date_never.SetChecked( false );
		this.radio_date_defined.SetChecked( true );
		this.edit_date_exact.Enable();

		this.date_exact = new Date( this.quote.expires * 1000 );
	}

	// We remove the update portion to make sure we aren't changing the value every time we load
	this.edit_date_exact.onDateChanged = function( date ) { ; };
	this.edit_date_exact.SetValue( this.date_exact );
	this.edit_date_exact.onDateChanged = function( date ) { self.date_exact = date; self.Quote_Update_Expiry( self.date_exact ); };
}

QuoteListDetailOverlayDetails.prototype.Refresh_Total = function()
{
	this.subtotal.innerHTML	= ieee754_normalize( 2, ( this.quote.total - this.quote.ship_amt) ).toFixed( 2 );
	this.total.innerHTML	= this.quote.formatted_total;
}

QuoteListDetailOverlayDetails.prototype.Refresh_Charges = function()
{
	var label_td, value_td, charge_tr;

	EmptyElement_NoResize( this.charges );

	if ( this.quote.ship_mod.length === 0 || this.quote.ship_meth.length === 0 )
	{
		return;
	}

	charge_tr				= newElement( 'tr', null,												null, this.charges );
	label_td				= newElement( 'td', { 'class': 'quotelist_quotedetail_charge_label' },	null, charge_tr );
	value_td				= newElement( 'td', { 'class': 'quotelist_quotedetail_charge_value' },	null, charge_tr );

	label_td.innerHTML		= 'Shipping: ' + shippingmethod_encodeentities( this.quote.ship_desc.length ? this.quote.ship_desc : this.quote.module_ship_desc ) + ':';
	value_td.textContent	= this.quote.ship_amt.toFixed( 2 );
}

QuoteListDetailOverlayDetails.prototype.Refresh_Addresses = function()
{
	this.ship_name.style.display	= 'none';
	this.ship_email.style.display	= 'none';
	this.ship_phone.style.display	= 'none';
	this.ship_zip.style.display		= 'none';
	this.ship_cntry.style.display	= 'none';

	if ( this.quote.fname.length || this.quote.lname.length )
	{
		this.ship_name.style.display = '';
		newTextNode_EmptyParent( this.quote.fname + ' ' + this.quote.lname, this.ship_name );
	}

	if ( this.quote.email.length )
	{
		this.ship_email.style.display = '';
		newTextNode_EmptyParent( this.quote.email, this.ship_email );
	}

	if ( this.quote.phone.length )
	{
		this.ship_phone.style.display = '';
		newTextNode_EmptyParent( this.quote.phone, this.ship_phone );
	}

	if ( this.quote.zip.length )
	{
		this.ship_zip.style.display = '';
		newTextNode_EmptyParent( this.quote.zip, this.ship_zip );
	}

	if ( this.quote.country.length )
	{
		this.ship_cntry.style.display = '';
		newTextNode_EmptyParent( this.quote.country, this.ship_cntry );
	}
}

QuoteListDetailOverlayDetails.prototype.Reload_StandardFields = function()
{
	var self = this;

	StandardFields_Load( function( response )
	{
		if ( !response.success )
		{
			return self.onerror( response.error_message );
		}

		self.standardfields = response.data;
	}, this.delegator );
}

QuoteListDetailOverlayDetails.prototype.Reload_Items = function()
{
	var self = this;

	if ( this.itemlist_selectall ) this.itemlist_selectall.checked = false;

	TableLoading( this.items );

	QuoteItemList_Load( this.quote.id, function( response ) { self.ItemList_Load_Callback( response ); }, this.delegator );
}

QuoteListDetailOverlayDetails.prototype.ConstructItemList_Row = function( row_class )
{
	var row;

	row				= new Object();
	row.tr			= newElement( 'tr', { 'class': row_class },										null, this.items );
	row.td_select	= newElement( 'td', { 'class': 'quotelist_quotedetail_itemlist_col_select' },	null, row.tr );
	row.td_code		= newElement( 'td', { 'class': 'quotelist_quotedetail_itemlist_col_code' },		null, row.tr );
	row.td_name		= newElement( 'td', { 'class': 'quotelist_quotedetail_itemlist_col_name' },		null, row.tr );
	row.td_sku		= newElement( 'td', { 'class': 'quotelist_quotedetail_itemlist_col_sku' },		null, row.tr );
	row.td_quantity	= newElement( 'td', { 'class': 'quotelist_quotedetail_itemlist_col_quantity' },	null, row.tr );
	row.td_weight	= newElement( 'td', { 'class': 'quotelist_quotedetail_itemlist_col_weight' },	null, row.tr );
	row.td_price	= newElement( 'td', { 'class': 'quotelist_quotedetail_itemlist_col_price' },	null, row.tr );
	row.td_total	= newElement( 'td', { 'class': 'quotelist_quotedetail_itemlist_col_total' },	null, row.tr );

	return row;
}

QuoteListDetailOverlayDetails.prototype.ItemList_Load_Callback = function( response )
{
	var i, j, k, item_row, option_row, discount_row, quoteitem, item_anchor;

	if ( !response.success )
	{
		return this.onerror( response.error_message );
	}

	EmptyElement( this.items );

	this.quoteitemlist	= response.data;

	for ( i = 0; i < this.quoteitemlist.length; i++ )
	{
		item_row 								= this.ConstructItemList_Row( 'quotelist_quotedetail_itemlist_item_row' );
		quoteitem								= this.quoteitemlist[ i ];
		quoteitem.element_checkbox				= newElement( 'input', { 'id': 'quotelist_quotedetail_itemlist_select_' + i, 'type': 'checkbox', 'value': this.quoteitemlist[ i ].line_id }, null, item_row.td_select );
		quoteitem.element_checkbox.onclick		= function() { this.quotedetail.ItemList_Select_Toggle(); return true; };
		quoteitem.element_checkbox.quotedetail	= this;

		newTextNode( this.quoteitemlist[ i ].name,					item_row.td_name );
		newTextNode( this.quoteitemlist[ i ].sku,					item_row.td_sku );
		newTextNode( this.quoteitemlist[ i ].quantity,				item_row.td_quantity );
		newTextNode( this.quoteitemlist[ i ].formatted_weight,		item_row.td_weight );
		newTextNode( this.quoteitemlist[ i ].price.toFixed( 2 ),	item_row.td_price );
		newTextNode( this.quoteitemlist[ i ].total.toFixed( 2 ),	item_row.td_total );

		switch( this.quote.status )
		{
			case 3	: // Accepted
			case 5	: // Purchased
			{
				newTextNode( this.quoteitemlist[ i ].code,			item_row.td_code );
				break;
			}
			default	:
			{
				if ( !this.can_modify )
				{
					newTextNode( this.quoteitemlist[ i ].code,		item_row.td_code );
				}
				else
				{
					item_anchor				= newElement( 'a', { 'href': '#' }, null, item_row.td_code );
					item_anchor.quotedetail	= this;
					item_anchor.offset		= i;
					item_anchor.onclick		= function() { this.quotedetail.ItemList_Edit( this.quotedetail.quoteitemlist[ this.offset ] ); return false; };

					newTextNode( this.quoteitemlist[ i ].code, item_anchor );
				}

				break;
			}
		}

		if ( this.quoteitemlist[ i ].discounts )
		{
			for ( j = 0; j < this.quoteitemlist[ i ].discounts.length; j++ )
			{
				discount_row					= this.ConstructItemList_Row( 'quotelist_quotedetail_itemlist_discount_row' );
				
				newTextNode( this.quoteitemlist[ i ].discounts[ j ].descrip,						discount_row.td_name );
				newTextNode( ( 0 - this.quoteitemlist[ i ].discounts[ j ].discount ).toFixed( 2 ),	discount_row.td_price );
			}
		}

		if ( this.quoteitemlist[ i ].options )
		{
			for ( j = 0; j < this.quoteitemlist[ i ].options.length; j++ )
			{
				option_row = this.ConstructItemList_Row( 'quotelist_quotedetail_itemlist_option_row' );

				if ( this.quoteitemlist[ i ].options[ j ].value.length )	newTextNode( this.quoteitemlist[ i ].options[ j ].attribute + ': ' + this.quoteitemlist[ i ].options[ j ].value, option_row.td_name );
				else														newTextNode( this.quoteitemlist[ i ].options[ j ].attribute, option_row.td_name );

				if ( this.quoteitemlist[ i ].options[ j ].weight )			newTextNode( this.quoteitemlist[ i ].options[ j ].formatted_weight,		option_row.td_weight );
				if ( this.quoteitemlist[ i ].options[ j ].price )			newTextNode( this.quoteitemlist[ i ].options[ j ].price.toFixed( 2 ),	option_row.td_price );

				if ( this.quoteitemlist[ i ].options[ j ].discounts )
				{
					for ( k = 0; k < this.quoteitemlist[ i ].options[ j ].discounts.length; k++ )
					{
						discount_row			= this.ConstructItemList_Row( 'quotelist_quotedetail_itemlist_discount_row' );
						
						newTextNode( this.quoteitemlist[ i ].options[ j ].discounts[ k ].descrip,						discount_row.td_name );
						newTextNode( ( 0 - this.quoteitemlist[ i ].options[ j ].discounts[ k ].discount ).toFixed( 2 ),	discount_row.td_price );
					}
				}
			}
		}

		this.ConstructItemList_Row( 'quotelist_quotedetail_itemlist_spacer_row' );
	}

	this.ItemList_EnableDisableButtons();
	this.onquoteitemlist_load();
}

QuoteListDetailOverlayDetails.prototype.ItemList_SelectAll = function( selected )
{
	Checkbox_CheckAll( 'quotelist_quotedetail_itemlist_select_', selected );

	this.ItemList_EnableDisableButtons();
}

QuoteListDetailOverlayDetails.prototype.ItemList_Select_Toggle = function()
{
	this.itemlist_selectall.checked = false;

	this.ItemList_EnableDisableButtons();
}

QuoteListDetailOverlayDetails.prototype.ItemList_EnableDisableButtons = function()
{
	if ( !this.can_modify )
	{
		return this.ItemList_EnableElements( false, false, false, false, false, false );
	}

	switch ( this.quote.status )
	{
		case 0	: // New
		case 1	: // Sent
		case 2	: // Modified
		case 4	: // Viewed
		case 7	: // Response Needed
		case 8	: // Converted to Order
		{
			return this.ItemList_EnableElements( true, true, true, true, true, true );
		}
		case 3	: // Accepted
		case 5	: // Purchased
		{
			return this.ItemList_EnableElements( false, false, true, true, false, false );
		}
		case 6	: // Expired
		{
			return this.ItemList_EnableElements( true, true, false, true, true, true );
		}
		default :
		{
			return this.ItemList_EnableElements( false, false, false, false, false, false );
		}
	}
}

QuoteListDetailOverlayDetails.prototype.ItemList_EnableElements = function( delete_items, add_items, send_quote, copy_quote, selectall_items_checkbox, item_checkboxes )
{
	var i, element, selected_quoteitems;

	if ( this.itemlist_button_delete )
	{
		selected_quoteitems = Checkbox_Selected_ItemList( 'quotelist_quotedetail_itemlist_select_', this.quoteitemlist );

		if ( selected_quoteitems.length == 0 || !delete_items )	this.itemlist_button_delete.Disable();
		else													this.itemlist_button_delete.Enable();
	}

	if ( this.itemlist_button_add )
	{
		if ( add_items )	this.itemlist_button_add.Enable();
		else				this.itemlist_button_add.Disable();
	}

	if ( this.itemlist_button_send )
	{
		if ( send_quote && this.quote.email )	this.itemlist_button_send.Enable();
		else									this.itemlist_button_send.Disable();
	}

	if ( this.itemlist_button_copy )
	{
		if ( copy_quote )	this.itemlist_button_copy.Enable();
		else				this.itemlist_button_copy.Disable();
	}

	if ( this.quoteitemlist.length )
	{
		this.itemlist_selectall.disabled	= !selectall_items_checkbox;
	}
	else
	{
		if ( this.itemlist_button_send ) this.itemlist_button_send.Disable();

		this.itemlist_selectall.checked		= false;
		this.itemlist_selectall.disabled	= true;
	}

	i = 0;

	while ( ( element = document.getElementById( 'quotelist_quotedetail_itemlist_select_' + i ) ) != null )
	{
		element.disabled = !item_checkboxes;
		i++;
	}
}

QuoteListDetailOverlayDetails.prototype.RefreshList = function()
{
	var self = this;

	this.SetProcessing_Start();
	this.onrefreshlist( function() { self.SetProcessing_End(); } );
}

QuoteListDetailOverlayDetails.prototype.Customer_Assign = function()
{
	var self = this;
	var customer_dialog;

	customer_dialog							= new Quote_CustomerLookupDialog( this.quote );
	customer_dialog.onremove				= function() { self.RemoveCustomerFromQuote( self.quote.id, customer_dialog ); }
	customer_dialog.onuseselectedcustomer	= function( customer )
	{
		if ( !customer )
		{
			return;
		}

		Quote_Update_Customer_ID( self.quote.id, customer.id, function( response )
		{
			var confirmation_dialog;

			if ( !response.success )
			{
				return self.onerror( response.error_message );
			}

			self.quote.cust_id = customer.id;

			if ( self.RequesterEmpty( self.quote ) ) 
			{
				return self.Customer_Assign_LowLevel( customer );
			}

			confirmation_dialog			= new ConfirmationDialog();
			confirmation_dialog.onNo	= function() { self.Reload(); }
			confirmation_dialog.onYes	= function() { self.Customer_Assign_LowLevel( customer ); }

			confirmation_dialog.Show( 'Would you like to override the current requester information with the assigned customer information?' );
		} );
	};

	customer_dialog.Show();
}

QuoteListDetailOverlayDetails.prototype.Customer_Assign_LowLevel = function( customer )
{
	var self = this;

	this.Copy_Customer_To_Quote( customer );

	Quote_Update_Requester_Information( this.quote.id, this.quote, function( response )
	{
		if ( !response.success )
		{
			return self.onerror( response.error_message );
		}

		self.Refresh_Addresses();
		self.Reload();
	} );
}

QuoteListDetailOverlayDetails.prototype.Copy_Customer_To_Quote = function( customer )
{
	if ( this.standardfields.primaddr == 'shipping' )
	{
		this.quote.email	= customer.ship_email;
		this.quote.fname	= customer.ship_fname;
		this.quote.lname	= customer.ship_lname;
		this.quote.phone	= customer.ship_phone;
		this.quote.zip		= customer.ship_zip;
		this.quote.country	= customer.ship_cntry;
	}
	else
	{
		this.quote.email	= customer.bill_email;
		this.quote.fname	= customer.bill_fname;
		this.quote.lname	= customer.bill_lname;
		this.quote.phone	= customer.bill_phone;
		this.quote.zip		= customer.bill_zip;
		this.quote.country	= customer.bill_cntry;
	}
}

QuoteListDetailOverlayDetails.prototype.RemoveCustomerFromQuote = function( quote_id, dialog )
{
	var self = this;

	Quote_Update_Customer_ID( quote_id, 0, function( response ) 
	{
		dialog.Hide();
		
		if ( !response.success )
		{
			return self.onerror( response.error_message );
		}

		self.quote.cust_id = 0;

		self.Refresh( 'customer' );
	} );
}

QuoteListDetailOverlayDetails.prototype.RequesterEmpty = function( quote )
{
	if ( quote.email )			return false;
	else if ( quote.fname )		return false;
	else if ( quote.lname )		return false;
	else if ( quote.phone )		return false;
	else if ( quote.zip )		return false;
	else if ( quote.country )	return false;
	else if ( quote.comment )	return false;
	else if ( quote.terms )		return false;
	else						return true;
}

QuoteListDetailOverlayDetails.prototype.onrefreshlist			= function( callback ) { if ( typeof callback === 'function' ) callback(); }
QuoteListDetailOverlayDetails.prototype.onclose					= function() { ; }
QuoteListDetailOverlayDetails.prototype.onerror					= function( error ) { Modal_Alert( error ); }
QuoteListDetailOverlayDetails.prototype.ondelete				= function() { ; }
QuoteListDetailOverlayDetails.prototype.onupdate				= function() { ; }
QuoteListDetailOverlayDetails.prototype.onquoteitemlist_load	= function() { ; }
QuoteListDetailOverlayDetails.prototype.oncopy					= function( quote_id ) { ; }
QuoteListDetailOverlayDetails.prototype.onconvert				= function( order_id ) { ; }
