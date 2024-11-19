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

function Volume_Discount_Enable_ProgressiveMode( enabled )
{
	var progmode;

	progmode			= document.getElementById( 'volume_discount_progressivemode' );
	progmode.disabled	= !enabled;
}

function Volume_Discount_Override_More( pgrp_id )
{
	var i;
	var data, count;
	var tr, td_quantity, td_type, select_type, td_amount, td_remove, span_remove;

	data		= document.getElementById( 'volume_discount_override_data_' + pgrp_id );
	count		= document.getElementById( 'volume_discount_override_count_' + pgrp_id );

	for ( i = 0; i < 5; i++ )
	{
		count.value++;

		tr			= newElement( 'tr', { 'class': 'volume_discount_override_row' }, null, null );
		td_quantity	= newElement( 'td', null, null, tr );
		td_type		= newElement( 'td', null, null, tr );
		td_amount	= newElement( 'td', null, null, tr );
		td_remove	= newElement( 'td', null, null, tr );

		newElement( 'input',	{ 'name':	'Volume_Discount_Overrides[' + pgrp_id + '][' + count.value + ']:quantity',	'type':	'text', 'size':	5,	'value': '' },		null, td_quantity );
		newElement( 'input',	{ 'name':	'Volume_Discount_Overrides[' + pgrp_id + '][' + count.value + ']:amount',	'type':	'text',	'size':	10,	'value': '0.00' },	null, td_amount );

		select_type					= newElement( 'select',		{ 'name': 'Volume_Discount_Overrides[' + pgrp_id + '][' + count.value + ']:type' }, null, td_type );
		select_type.options[ 0 ]	= new Option( 'Percent',	'P' );
		select_type.options[ 1 ]	= new Option( 'Fixed',		'F' );
		select_type.options[ 2 ]	= new Option( 'Absolute',	'A' );

		span_remove					= newElement( 'span', null, null, td_remove );
		span_remove.innerHTML		= 'X';
		span_remove.onclick			= function() { this.parentNode.parentNode.parentNode.removeChild( this.parentNode.parentNode ); };

		data.appendChild( tr );
	}
}

function Volume_Discount_More()
{
	var i;
	var data, count;
	var tr, td_quantity, td_type, select_type, td_amount, td_remove, span_remove;

	data		= document.getElementById( 'volume_discount_data' );
	count		= document.getElementById( 'volume_discount_count' );

	for ( i = 0; i < 5; i++ )
	{
		count.value++;

		tr			= newElement( 'tr', { 'class': 'volume_discount_row' }, null, null );
		td_quantity	= newElement( 'td', null, null, tr );
		td_type		= newElement( 'td', null, null, tr );
		td_amount	= newElement( 'td', null, null, tr );
		td_remove	= newElement( 'td', null, null, tr );

		newElement( 'input',	{ 'name':	'Volume_Discounts[' + count.value + ']:quantity',	'type':	'text', 'size':	5,	'value': '' },		null, td_quantity );
		newElement( 'input',	{ 'name':	'Volume_Discounts[' + count.value + ']:amount',		'type':	'text',	'size':	10,	'value': '0.00' },	null, td_amount );

		select_type					= newElement( 'select',		{ 'name': 'Volume_Discounts[' + count.value + ']:type' }, null, td_type );
		select_type.options[ 0 ]	= new Option( 'Percent',	'P' );
		select_type.options[ 1 ]	= new Option( 'Fixed',		'F' );

		span_remove					= newElement( 'span', null, null, td_remove );
		span_remove.innerHTML		= 'X';
		span_remove.onclick			= function() { this.parentNode.parentNode.parentNode.removeChild( this.parentNode.parentNode ); };

		data.appendChild( tr );
	}
}
