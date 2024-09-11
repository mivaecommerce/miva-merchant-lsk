// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2014 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

function Import_Coupon_Delimiter_PriceGroup_Changed( select_delimiter )
{
	var edit_delimiter_other;

	edit_delimiter_other					= document.getElementById( 'import_coupon_delim_pricegroup_other' );

	if ( ( select_delimiter.selectedIndex >= 0 ) &&
		 ( select_delimiter.options[ select_delimiter.selectedIndex ].value == '0' ) )
	{
		edit_delimiter_other.style.display	= 'inline';
	}
	else
	{
		edit_delimiter_other.style.display	= 'none';
	}

	Modal_Resize();
}

function Import_Coupon_Delimiter_Customer_Changed( select_delimiter )
{
	var edit_delimiter_other;

	edit_delimiter_other					= document.getElementById( 'import_coupon_delim_customer_other' );

	if ( ( select_delimiter.selectedIndex >= 0 ) &&
		 ( select_delimiter.options[ select_delimiter.selectedIndex ].value == '0' ) )
	{
		edit_delimiter_other.style.display	= 'inline';
	}
	else
	{
		edit_delimiter_other.style.display	= 'none';
	}

	Modal_Resize();
}
