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

// Quote Customer Lookup Dialog 
////////////////////////////////////////////////////

function Quote_CustomerLookupDialog( quote )
{
	var self = this;
	var mmlist;

	mmlist						= new BaseCustomerList_LookupList( 'mm_quotecustomerdialog_list' );
	mmlist.onConstruct			= function() { self.SetList( mmlist ); };
	mmlist.onEnableDisable		= function() { self.MMList_EnableDisable(); };
	mmlist.onRowDoubleClick		= function( item )
	{
		mmlist.ActiveItemList_AppendItem( item );

		self.UseSelectedCustomer();
	};

	MMListDialog.call( this, 'mm_quotecustomerdialog' );

	this.button_cancel				= this.ActionItem_Add( 'Cancel',						function() { self.Hide(); } );

	if ( quote.cust_id )
	{
		this.button_remove			= this.ActionItem_Add( 'Remove Customer From Quote',	function() { self.onremove(); } );
	}

	this.button_ok					= this.ActionItem_Add( 'Use Selected Customer',			function() { self.UseSelectedCustomer(); } );
	this.button_ok.Disable();

	this.SetTitle( 'Customer Lookup' );
	this.SetResizeEnabled();
}

DeriveFrom( MMListDialog, Quote_CustomerLookupDialog );

Quote_CustomerLookupDialog.prototype.UseSelectedCustomer = function()
{
	var item = this.mmlist ? this.mmlist.SelectedItem() : null;

	this.Hide();
	this.onuseselectedcustomer( item ? item.record : null );
}

Quote_CustomerLookupDialog.prototype.MMList_EnableDisable = function()
{
	if ( this.mmlist && this.mmlist.ActiveItemList_Count() )	this.button_ok.Enable();
	else														this.button_ok.Disable();
}

Quote_CustomerLookupDialog.prototype.onuseselectedcustomer	= function( item ) { ; };
Quote_CustomerLookupDialog.prototype.onremove				= function( item ) { ; };
