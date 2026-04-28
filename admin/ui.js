// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2026 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

function Order_Status( order )
{
	if ( order.status == 100 )		return 'Processing';
	else if ( order.status == 200 )	return 'Shipped';
	else if ( order.status == 201 )	return 'Partially Shipped';
	else if ( order.status == 300 )	return 'Cancelled';
	else if ( order.status == 400 )	return 'Backordered';
	else if ( order.status == 500 )	return 'RMA Issued';
	else if ( order.status == 600 )	return 'Returned';

	return 'Pending';
}

function Order_Payment_Status( order )
{
	if ( order.pay_status == 100 )		return 'Authorized';
	else if ( order.pay_status == 200 )	return 'Captured';
	else if ( order.pay_status == 201 )	return 'Partially Captured';

	return 'Pending';
}

function Order_Stock_Status( order )
{
	if ( order.stk_status == 100 )		return 'Yes';
	else if ( order.stk_status == 200 )	return 'No';
	else if ( order.stk_status == 201 )	return 'Partial';

	return 'Pending';
}

function OrderPayment_Type( orderpayment )
{
	if ( orderpayment.type == 0 )		return 'Declined';
	else if ( orderpayment.type == 1 )	return 'Legacy Authorization';
	else if ( orderpayment.type == 2 )	return 'Legacy Capture';
	else if ( orderpayment.type == 3 )	return 'Authorization';
	else if ( orderpayment.type == 4 )	return 'Capture';
	else if ( orderpayment.type == 5 )	return 'Authorization + Capture';
	else if ( orderpayment.type == 6 )	return 'Refund';
	else if ( orderpayment.type == 7 )	return 'VOID';

	return 'Unknown';
}

function OrderItem_Status( orderitem )
{
	if ( orderitem.status == 100 )
	{
		if ( orderitem.shipment == null ||
			 orderitem.shipment.code.length == 0 )		return 'Picking';
		else											return 'Picking: ' + encodeentities( orderitem.shipment.code );
	}
	else if ( orderitem.status == 200 )
	{
		if ( orderitem.shipment == null ||
			 orderitem.shipment.tracknum.length == 0 )	return 'Shipped';
		else											return 'Shipped: ' + encodeentities( orderitem.shipment.tracknum );
	}
	else if ( orderitem.status == 210 )					return 'Gift Certificate: Not Redeemed';
	else if ( orderitem.status == 211 )					return 'Gift Certificate: Redeemed';
	else if ( orderitem.status == 220 )					return 'Digital: Not Downloaded';
	else if ( orderitem.status == 221 )					return 'Digital: Downloaded';
	else if ( orderitem.status == 300 )					return 'Cancelled';
	else if ( orderitem.status == 400 )
	{
		if ( orderitem.dt_instock == '' ||
			 orderitem.dt_instock == 0 )				return 'Backordered';
		else											return 'Backordered: ' + Date_Format( orderitem.dt_instock );
	}
	else if ( orderitem.status == 500 )
	{
		if ( orderitem.rma_code == '' )					return 'RMA Issued';
		else											return 'RMA Issued: ' + encodeentities( orderitem.rma_code );
	}
	else if ( orderitem.status == 600 )
	{
		if ( orderitem.rma_dt_recvd == 0 )				return 'Returned';
		else											return 'Returned: ' + Date_Format( orderitem.rma_dt_recvd );
	}
	else if ( orderitem.status == 999 )					return 'Adjustment';

	return 'Pending';
}

function OrderShipment_Status( ordershipment )
{
	if ( ordershipment.status == 100 )		return 'Picking';
	else if ( ordershipment.status == 200 )	return 'Shipped';

	return 'Pending';
}

function OrderReturn_Status( orderreturn )
{
	if ( orderreturn.status == 600 )
	{
		if ( orderreturn.dt_recvd == 0 )	return 'Received';
		else								return 'Received: ' + Date_Format( orderreturn.dt_recvd );
	}

	return 'RMA Issued';
}

// Misc HTML/JavaScript functions
////////////////////////////////////////////////////

function Date_Format( time_t )
{
	var date;

	if ( time_t == '' )			return '';

	date = new Date();
	date.setTime( parseInt( time_t ) * 1000.0 );

	return ( date.getMonth() + 1 ) + '-' + date.getDate() + '-' + date.getFullYear();
}

function Time_Format( time_t )
{
	var date;

	if ( time_t == '' )			return '';

	date = new Date();
	date.setTime( parseInt( time_t ) * 1000.0 );

	return ( date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours() ) + ':' +
		   ( date.getMinutes() < 10 ? '0' + date.getMinutes().toString() : date.getMinutes() ) + ':' +
		   ( date.getSeconds() < 10 ? '0' + date.getSeconds().toString() : date.getSeconds() );
}

function DateTime_Format( time_t )
{
	var date;

	if ( time_t == '' )			return '';

	date = new Date();
	date.setTime( parseInt( time_t ) * 1000.0 );

	return date.toString();
}

function Date_Parse( value )
{
	var matches, dd, mm, yyyy, date;

	matches = /^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/.exec( value );

	if ( matches == null ) return 0;

	dd		= matches[ 2 ];
	mm		= matches[ 1 ] - 1;
	yyyy	= matches[ 3 ];
	date	= new Date( yyyy, mm, dd );

	if ( date.getDate()		== dd &&
		 date.getMonth()	== mm &&
		 date.getFullYear() == yyyy )	return date / 1000;
	else								return 0;
}

function MMServerDateFromDate( date )
{
	return {
		year:	date.getFullYear(),
		month:	date.getMonth() + 1,
		day:	date.getDate(),
		hour:	date.getHours(),
		minute:	date.getMinutes(),
		second:	date.getSeconds()
	}
}

function DateFromMMServerDate( server_date )
{
	return new Date( server_date.year, server_date.month - 1, server_date.day, server_date.hour, server_date.minute, server_date.second );
}

function MMServerTimezoneOffsetDisplay( server_timezone )
{
	var fixed_timezone;

	if ( stod( server_timezone ) === ( 0 - ( ( new Date().getTimezoneOffset() ) / 60 ) ) )
	{
		return '';
	}

	server_timezone = stod( server_timezone );

	if ( server_timezone === 0 )
	{
		return '(UTC)';
	}

	fixed_timezone = Math.abs( server_timezone ).toFixed( 2 );

	return '(UTC' + ( ( server_timezone > 0 ) ? '+' : '-' ) + padl( fixed_timezone.split( '.' )[ 0 ], 2, '0' ) + ':' + padl( Math.floor( ( fixed_timezone.split( '.' )[ 1 ] * 60 ) / 100 ), 2, '0' ) + ')';
}

function OrdinalNumber( n )
{
	if ( ( n | 0 ) != n )
	{
		return n;
	}

	switch ( n )
	{
		case 11	:
		case 12	:
		case 13	: return n + 'th';
		default	:
		{
			switch ( n % 10 )
			{
				case 1	: return n + 'st';
				case 2	: return n + 'nd';
				case 3	: return n + 'rd';
				default	: return n + 'th';
			}
		}
	}
}

function Plural( count, singular, plural )
{
	return count == 1 ? singular : ( ( ( typeof plural === 'string' ) && plural.length ) ? plural : singular + 's' );
}

function Checkbox_Selected_List( field_base )
{
	var i;
	var element;
	var list;

	i		= 0;
	list	= new Array();

	while ( ( element = document.getElementById( field_base + i ) ) != null )
	{
		if ( element.checked )
		{
			list.push( element.value );
		}

		i++;
	}

	return list;
}

function Checkbox_Selected_ItemList( field_base, item_list )
{
	var i;
	var element;
	var list;

	i		= 0;
	list	= new Array();

	while ( ( element = document.getElementById( field_base + i ) ) != null )
	{
		if ( element.checked )
		{
			list.push( item_list[ i ] );
		}

		i++;
	}

	return list;
}

function Input_List_Values( field_base )
{
	var i;
	var element;
	var list;

	i		= 0;
	list	= new Array();

	while ( ( element = document.getElementById( field_base + i ) ) != null )
	{
		list.push( element.value );
		i++;
	}

	return list;
}

function Select_List_Values( field_base )
{
	var i;
	var element;
	var list;

	i		= 0;
	list	= new Array();

	while ( ( element = document.getElementById( field_base + i ) ) != null )
	{
		if ( element.selectedIndex >= 0 && element.options[ element.selectedIndex ] )	list.push( element.options[ element.selectedIndex ].value );
		else																			list.push( '' );

		i++;
	}

	return list;
}

function Checkbox_CheckAll( field_base, checked )
{
	var i;
	var element;

	i = 0;
	while ( ( element = document.getElementById( field_base + i ) ) != null )
	{
		if ( !element.disabled )	element.checked = checked;
		i++;
	}

	return i;
}

function getStyleByClass( selector )
{
	var i, j;
	var rules;

	for ( i = 0; i < document.styleSheets.length; i++ )
	{
		if ( document.styleSheets[ i ].rules )			rules = document.styleSheets[ i ].rules;
		else if ( document.styleSheets[ i ].cssRules )	rules = document.styleSheets[ i ].cssRules;
		else											return null;

		for ( j = 0; j < rules.length; j++ )
		{
			if ( rules[ j ].selectorText == selector )
			{
				return rules[ j ].style;
			}
		}
	}

	return null;
}

function tableRowColumns( tr )
{
	var i;
	var columns = 0;

	for ( i = 0; i < tr.cells.length; i++ )
	{
		columns += tr.cells[ i ].colSpan;
	}

	return columns;
}

function tableFirstRow( table )
{
	var tr, cont, el;

	if ( table.nodeName != 'TABLE' && table.parentNode && table.parentNode.nodeName == 'TABLE' )
	{
		for ( cont = table.parentNode.firstChild; cont; cont = cont.nextSibling )
		{
			if ( cont.nodeName == 'THEAD' || cont.nodeName == 'TBODY' || cont.nodeName == 'TFOOT' )
			{
				for ( tr = cont.firstChild; tr; tr = tr.nextSibling )
				{
					if( tr.nodeName == 'TR' )
					{
						return tr;
					}
				}
			}
		}
	}

	for ( el = table.firstChild; el; el = el.nextSibling )
	{
		if ( el.nodeName == 'THEAD' || el.nodeName == 'TBODY' || el.nodeName == 'TFOOT' )
		{
			for ( tr = el.firstChild; tr; tr = el.nextSibling )
			{
				if( tr.nodeName == 'TR' )
				{
					return tr;
				}
			}
		}
		else if ( el.nodeName == 'TR' )
		{
			return el;
		}
	}

	return null;
}

function EmptyElement( e )
{
	while ( e.firstChild )
	{
		e.removeChild( e.firstChild );
	}

	if ( window.Modal_Resize ) Modal_Resize();
}

function EmptyElement_NoResize( e )
{
	while ( e.firstChild )
	{
		e.removeChild( e.firstChild );
	}
}

function TableLoading( table )
{
	var colspan = 1;
	var loading_tr, loading_td;
	var tr;

	if ( ( tr = tableFirstRow( table ) ) != null )
	{
		colspan = tableRowColumns( tr );
	}

	EmptyElement( table );

	loading_tr				= document.createElement( 'tr' );
	loading_td				= document.createElement( 'td' );
	loading_td.colSpan		= colspan;
	loading_td.innerHTML	= 'Loading...';

	loading_tr.appendChild( loading_td );
	table.appendChild( loading_tr );
}

function MatchTableColumnWidths( master, slave, padding )
{
	var i;
	var master_tr, slave_tr;

	if ( master.nodeName == 'TR' )								master_tr = master;
	else if ( ( master_tr = tableFirstRow( master ) ) == null )	return;

	for ( slave_tr = slave.firstChild; slave_tr; slave_tr = slave_tr.nextSibling )
	{
		if ( slave_tr.nodeName == 'TR' )
		{
			for ( i = 0; i < master_tr.cells.length; i++ )
			{
				if ( master_tr.cells[ i ].offsetWidth < padding )	slave_tr.cells[ i ].style.width = '0px';
				else												slave_tr.cells[ i ].style.width = ( master_tr.cells[ i ].offsetWidth - padding ) + 'px';
			}
		}
	}

	if ( window.Modal_Resize ) Modal_Resize();
}

function decimalToHex( x )
{
	var hex = stoi_def( x, 0 ).toString( 16 );
	return hex.length == 1 ? '0' + hex : hex;
}

function rgb2hex( rgb )
{
	var rgb_match = rgb.match( /^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*(\d*(?:\.\d+)?))?\)$/i );

	if ( rgb_match )
	{
		return '#' + decimalToHex( rgb_match[ 1 ] ) + decimalToHex( rgb_match[ 2 ] ) + decimalToHex( rgb_match[ 3 ] );
	}

	return '';
}

function hex2rgb( hex )
{
	var result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex.replace( new RegExp( '^#' ), '' ) );

	return { 'r': parseInt( result[ 1 ], 16 ), 'g': parseInt( result[ 2 ], 16 ), 'b': parseInt( result[ 3 ], 16 ) };
}

function slugify( value )
{
	if ( typeof value !== 'string' )
	{
		return '';
	}

	return value.toLowerCase()						// Lowercase
				.trim()								// Remove surrounding whitespace
				.normalize( 'NFD' )					// Normalize accent characters
				.replace( /[\u0300-\u036f]/g, '' )	// Remove diacritics
				.replace( /[^a-z0-9\s-_]/g, '' )	// Strip non-alphanumeric characters
				.replace( /\s+/g, '-' )				// Replace space with hyphen
				.replace( /-+/g, '-' )				// Replace two or more hyphens with single hyphen
				.replace( /^-+|-+$/g, '' )			// Remove leading / trailing hyphen
}

function FunctionExists( func )
{
	if ( ( typeof func === 'function' ) ||
		 ( typeof func === 'object' && func.toString().substr( 0, 8 ) === 'function' ) )
	{
		return true;
	}

	return false;
}

function ValidationFailure( options, message )
{
	if ( options )
	{
		options.message = message;
	}

	return false;
}

function ValidateWholeNumber( value, options )
{
	var i;
	var num_digits = 0;
	var trimmed = trim( value );

	if ( typeof trimmed !== 'string' )
	{
		trimmed = new String( value );
	}

	for ( i = 0; i < trimmed.length; i++ )
	{
		switch ( trimmed.charAt( i ) )
		{
			default		: return ValidationFailure( options, 'Please enter a whole number' );
			case '0'	:
			case '1'	:
			case '2'	:
			case '3'	:
			case '4'	:
			case '5'	:
			case '6'	:
			case '7'	:
			case '8'	:
			case '9'	:
			{
				if ( ++num_digits > 10 )
				{
					return ValidationFailure( options, 'Please specify a number of 10 digits or less' );
				}

				break;
			}
			case '-'	:
			{
				if ( i != 0 )										return ValidationFailure( options, 'Please enter a whole number' );
				else if ( options && options.disallow_negative )	return ValidationFailure( options, 'Please enter a non-negative number' );

				break;
			}
		}
	}

	if ( num_digits == 0 )
	{
		return ValidationFailure( options, 'Please enter a whole number' );
	}

	return true;
}

function ValidateWholeNumberField( field )
{
	var validate_options = new Object;

	if ( ValidateWholeNumber( field.value, validate_options ) )
	{
		return true;
	}

	Modal_Alert( validate_options.message );

	field.select();
	field.focus();

	return false;
}

function ValidateWholeNumberField_NonNegative( field )
{
	var validate_options = { disallow_negative: true };

	if ( ValidateWholeNumber( field.value, validate_options ) )
	{
		return true;
	}

	Modal_Alert( validate_options.message );

	field.select();
	field.focus();

	return false;
}

function ValidateFloatingPointNumber( value, options )
{
	var i;
	var left_digits = 0, right_digits = 0;
	var have_decimal = false;
	var trimmed = trim( value );

	if ( typeof trimmed !== 'string' )
	{
		trimmed = new String( value );
	}

	for ( i = 0; i < trimmed.length; i++ )
	{
		switch ( trimmed.charAt( i ) )
		{
			default		: return ValidationFailure( options, 'Please enter a number' );
			case '0'	:
			case '1'	:
			case '2'	:
			case '3'	:
			case '4'	:
			case '5'	:
			case '6'	:
			case '7'	:
			case '8'	:
			case '9'	:
			{
				if ( have_decimal )
				{
					right_digits++;
					if ( options && ( options.max_right_digits != null ) && ( right_digits > options.max_right_digits ) )
					{
						if ( options.max_right_digits == 1 )		return ValidationFailure( options, 'Please specify a number with 1 digit or less to the right of the decimal point' );
						else										return ValidationFailure( options, 'Please specify a number with ' + options.max_right_digits + ' digits or less to the right of the decimal point' );
					}
				}
				else
				{
					left_digits++;
					if ( options && ( options.max_left_digits != null ) && ( left_digits > options.max_left_digits ) )
					{
						if ( options.max_left_digits == 1 )			return ValidationFailure( options, 'Please specify a number with 1 digit or less to the left of the decimal point' );
						else										return ValidationFailure( options, 'Please specify a number with ' + options.max_left_digits + ' digits or less to the left of the decimal point' );
					}
				}

				break;
			}
			case '-'	:
			{
				if ( i != 0 )										return ValidationFailure( options, 'Please enter a number' );
				else if ( options && options.disallow_negative )	return ValidationFailure( options, 'Please enter a positive number' );

				break;
			}
			case '.'	:
			{
				if ( have_decimal )									return ValidationFailure( options, 'Please enter a number' );

				have_decimal = true;
				break;
			}
		}
	}

	if ( left_digits + right_digits == 0 )
	{
		return ValidationFailure( options, 'Please enter a number' );
	}

	return true;
}

function ValidateFloatingPointNumberField( field )
{
	var validate_options = { max_left_digits: 8, max_right_digits: 2 };

	if ( ValidateFloatingPointNumber( field.value, validate_options ) )
	{
		return true;
	}

	Modal_Alert( validate_options.message );

	field.select();
	field.focus();

	return false;
}

function ValidateFloatingPointNumberField_NonNegative( field )
{
	var validate_options = { max_left_digits: 8, max_right_digits: 2, disallow_negative: true };

	if ( ValidateFloatingPointNumber( field.value, validate_options ) )
	{
		return true;
	}

	Modal_Alert( validate_options.message );

	field.select();
	field.focus();
		
	return false;
}

function ValidatePriceField( field )
{
	const validate_options = { max_left_digits: 8, max_right_digits: 8 };

	if ( ValidateFloatingPointNumber( field.value, validate_options ) )
	{
		return true;
	}

	Modal_Alert( validate_options.message );

	field.select();
	field.focus();

	return false;
}

function ValidateCode( value, options )
{
	var regex, temp_value;

	if ( typeof value === 'undefined' || value.toString().length == 0 )
	{
		return ValidationFailure( options, 'Please specify a code' );
	}

	if ( value.toString().length > 50 )
	{
		return ValidationFailure( options, 'Code must be 50 characters long or shorter' );
	}

	if ( options && options.strict_code_validation )
	{
		temp_value					= value.toString().replace( /-/g, '' ).replace( /_/g, '' );
		regex						= /^[a-z0-9]*$/i; /* Matches alphanumeric values only */

		if ( !temp_value.match( regex ) )
		{
			return ValidationFailure( options, 'Codes may only contain letters, numbers, underscores (_) and dashes (-)' );
		}
	}
	else
	{
		if ( value.toString().indexOf( '%' ) != -1 )
		{
			return ValidationFailure( options, 'Code may not contain a percent sign' );
		}

		if ( value.toString().indexOf( '\\' ) != -1 )
		{
			return ValidationFailure( options, 'Code may not contain a backslash (\\)' );
		}
	}

	return true;
}

function ItemsPerPage( input )
{
	var intval;

	if ( isNaN( intval = stoi( input.value ) ) )	intval = 1;
	else if ( intval < 1 )							intval = 1;

	input.value	= intval;
	return intval;
}

function shippingmethod_encodeentities( input )
{
	var result;

	result	= new String( input );
	result	= result.replace(	/&reg;/g,	'®' );
	result	= result.replace(	/&trade;/g,	'™' );
	result	= result.replace(	/&/g,		'&amp;' );
	result	= result.replace(	/"/g,		'&quot;' );
	result	= result.replace(	/</g,		'&lt;' );
	result	= result.replace(	/>/g,		'&gt;' );
	result	= result.replace(	/\(/g,		'&#40;' );
	result	= result.replace(	/\)/g,		'&#41;' );
	result	= result.replace(	/®/g,		'&reg;' );
	result	= result.replace(	/™/g,		'&trade;' );

	return result;
}

function ReplaceHTMLEntities( value )
{
	//
	// This function is intended to be used with text nodes (textContent). It is
	// unsafe to use with innerHTML.
	//
	// Note: DOMParser will strip any leading / trailing whitespace from the parsed
	// string. If the value is only whitespace, return the value directly. Otherwise,
	// find the whitespace, parse the content between, then return the parsed content
	// wrapped in the original whitespace.
	//

	const match = value.match( /^(\s*)(.*?)(\s*)$/ );

	if ( !match || !match[ 2 ]?.length )
	{
		return value;
	}

	const content = new DOMParser().parseFromString( match[ 2 ], 'text/html' )?.body?.textContent;

	if ( typeof content === 'undefined' )
	{
		return value;
	}

	return `${match[ 1 ]}${content}${match[ 3 ]}`;
}

/*
 * This function creates an Option that interprets HTML.  Use with care.
 */

function newHTMLOption( text, value )
{
	var span, option;

	span			= document.createElement( 'span' );
	span.innerHTML	= text;
	option			= new Option( span.innerHTML, value );

	return option;
}

function KeyUpEnterCallback( event, callback )
{
	if ( event.keyCode == 13 )
	{
		return callback();
	}

	return true;
}

function GatherInputElements( parent_element, output_array )
{
	var i, j, elements, field, type;

	elements	= parent_element.getElementsByTagName( "input" );
	for ( i = 0; i < elements.length; i++ )
	{
		type	= elements[ i ].type.toLowerCase();

		if ( ( type == 'text' ) || ( type == 'number' ) || ( type == 'tel' ) || ( type == 'hidden' ) )
		{
			field		= new Object();
			field.name	= elements[ i ].name;
			field.value	= elements[ i ].value;

			output_array.push( field );
		}
		else if ( ( type == 'checkbox' ) || ( type == 'radio' ) )
		{
			if ( elements[ i ].checked )
			{
				field		= new Object();
				field.name	= elements[ i ].name;
				field.value	= elements[ i ].value;

				output_array.push( field );
			}
		}
	}

	elements = parent_element.getElementsByTagName( "textarea" );
	for ( i = 0; i < elements.length; i++ )
	{
		field		= new Object();
		field.name	= elements[ i ].name;
		field.value	= elements[ i ].value;

		output_array.push( field );
	}

	elements = parent_element.getElementsByTagName( "select" );
	for ( i = 0; i < elements.length; i++ )
	{
		if ( elements[ i ].selectedIndex >= 0 && elements[ i ].options[ elements[ i ].selectedIndex ] )
		{
			if ( !elements[ i ].multiple )
			{
				field		= new Object();
				field.name	= elements[ i ].name;
				field.value	= elements[ i ].options[ elements[ i ].selectedIndex ].value;

				output_array.push( field );
			}
			else
			{
				for ( j = 0; j < elements[ i ].options.length; j++ )
				{
					if ( !elements[ i ].options[ j ].selected )	continue;

					field		= new Object();
					field.name	= elements[ i ].name;
					field.value = elements[ i ].options[ j ].value;

					output_array.push( field );
				}
			}
		}
	}
}

function ParseFormData( list )
{
	var i, j, i_len, j_len, node, type, fieldlist;

	fieldlist = new Array();

	for ( i = 0, i_len = list.length; i < i_len; i++ )
	{
		if ( typeof list[ i ].name === 'undefined' )
		{
			continue;
		}

		node = list[ i ].nodeName.toLowerCase();

		if ( node == 'textarea' )
		{
			fieldlist.push(
			{
				'name':				list[ i ].name,
				'value':			list[ i ].value
			} );
		}
		else if ( node == 'select' )
		{
			for ( j = 0, j_len = list[ i ].options.length; j < j_len; j++ )
			{
				if ( list[ i ].options[ j ].selected )
				{
					fieldlist.push(
					{
						'name':		list[ i ].name,
						'value':	list[ i ].options[ j ].value
					} );
				}
			}
		}
		else if ( node == 'input' )
		{
			type = list[ i ].type.toLowerCase();

			if ( type == 'text' || type == 'hidden' )
			{
				fieldlist.push(
				{
					'name':			list[ i ].name,
					'value':		list[ i ].value
				} );
			}
			else if ( type == 'radio' && list[ i ].checked )
			{
				fieldlist.push(
				{
					'name':			list[ i ].name,
					'value':		list[ i ].value
				} );
			}
			else if ( type == 'checkbox' )
			{
				fieldlist.push(
				{
					'name':			list[ i ].name,
					'value':		list[ i ].checked ? 1 : 0
				} );
			}
		}
		else if ( node === 'mm-input' || node === 'mm-textarea' || node === 'mm-texteditor' )
		{
			fieldlist.push(
			{
				'name':			list[ i ].name,
				'value':		list[ i ].value
			} );
		}
		else if ( node == 'mm-select' )
		{
			for ( j = 0, j_len = list[ i ].options.length; j < j_len; j++ )
			{
				if ( list[ i ].options[ j ].selected )
				{
					fieldlist.push(
					{
						'name':		list[ i ].name,
						'value':	list[ i ].options[ j ].value
					} );
				}
			}
		}
		else if ( node == 'mm-checkbox' )
		{
			fieldlist.push(
			{
				'name':			list[ i ].name,
				'value':		list[ i ].checked ? list[ i ].value : undefined
			} );
		}
		else if ( ( node == 'mm-radio' || node == 'mm-radio-card' ) && list[ i ].checked )
		{
			fieldlist.push(
			{
				'name':			list[ i ].name,
				'value':		list[ i ].value
			} );
		}
	}

	return fieldlist;
}

// IPValidator
//////////////////////////////////////////////

function IPValidator()
{
	this.error_message		= '';
	this.ipv4_default_route	= '0.0.0.0';
	this.ipv6_default_route	= '0000:0000:0000:0000:0000:0000:0000:0000';
}

IPValidator.prototype.error = function()
{
	return this.error_message;
}

IPValidator.prototype.Error = function( error_message )
{
	this.error_message = error_message;

	return false;
}

IPValidator.prototype.ParseIPAddress = function( ip )
{
	if ( ip.indexOf( ':' ) >= 0 )		return this.ParseIPv6Address( ip );
	else if ( ip.indexOf( '.' ) >= 0 )	return this.ParseIPv4Address( ip );
	else								throw new Error( 'Invalid IP address' );
}

IPValidator.prototype.ParseIPv4Address = function( ip )
{
	var i, components, sections, prefix, regex, octet, octets, address;

	components = ip.split( '/' );

	if ( components.length > 2 )
	{
		throw new Error( 'Invalid IPv4 format' );
	}

	ip		= components[ 0 ];
	prefix	= components.length === 1 ? 32 : stoi( components[ 1 ] );

	if ( isNaN( prefix ) || prefix < 0 || prefix > 32 )
	{
		throw new Error( 'Routing prefix must be between 0 and 32' );
	}

	sections	= new Array();
	regex		= new RegExp( '^[0-9]{1,3}$' );
	octets		= ip.split( '.' );

	if ( octets.length !== 4 )
	{
		throw new Error( 'Invalid IPv4 format' );
	}

	for ( i = 0; i < 4; i++ )
	{
		if ( !regex.test( octets[ i ] ) )
		{
			throw new Error( 'Invalid IPv4 format' );
		}

		octet = stoi( octets[ i ] ); // remove leading zeros

		if ( octet < 0 || octet > 255 )
		{
			throw new Error( 'Octet values must be between 0 and 255' );
		}

		sections.push( octet );
	}

	address			= new Object();
	address.version	= 4;
	address.ip		= sections.join( '.' );
	address.prefix	= prefix;

	return address;
}

IPValidator.prototype.ParseIPv6Address = function( ip )
{
	var i, j, components, sections, prefix, regex, double_hextets, double_colon_count, left_partial, right_partial, address;

	sections			= new Array();
	components			= ip.split( '/' );

	if ( components.length > 2 )
	{
		throw new Error( 'Invalid IPv6 format' );
	}

	ip					= components[ 0 ].toLowerCase();
	prefix				= components.length === 1 ? 128 : stoi( components[ 1 ] );

	if ( isNaN( prefix ) || prefix < 0 || prefix > 128 )
	{
		throw new Error( 'Routing prefix must be between 0 and 128' );
	}

	regex				= new RegExp( '^[a-f0-9]{1,4}$' );
	double_hextets		= ip.split( '::' );
	double_colon_count	= double_hextets.length;

	if ( double_colon_count > 2 )
	{
		throw new Error( 'Invalid IPv6 format' );
	}

	if ( double_colon_count === 1 )
	{
		sections = ip.split( ':' );

		if ( sections.length != 8 )
		{
			throw new Error( 'Invalid IPv6 format' );
		}
	}
	else
	{
		left_partial	= double_hextets[ 0 ].split( ':' );
		right_partial	= double_hextets[ 1 ].split( ':' );

		if ( left_partial.length + right_partial.length >= 8 )
		{
			throw new Error( 'Invalid IPv6 format' );
		}

		// fill the array with all known hextets to the left of the double colon
		for ( i = 0; i < left_partial.length; i++ )
		{
			sections[ i ] = left_partial[ i ];
		}

		// fill the array with all empty hextets
		for ( i = left_partial.length; i < 8 - right_partial.length; i++ )
		{
			sections[ i ] = '0000';
		}

		// fill the array with all known hextets to the right of the double colon
		for ( i = 8 - right_partial.length, j = 0; i < 8; i++, j++ )
		{
			sections[ i ] = right_partial[ j ];
		}
	}

	for ( i = 0; i < 8; i++ )
	{
		sections[ i ] = padl( sections[ i ], 4, '0' );

		if ( !regex.test( sections[ i ] ) )
		{
			throw new Error( 'Invalid IPv6 format' );
		}
	}

	address			= new Object();
	address.version	= 6;
	address.ip		= sections.join( ':' );
	address.prefix	= prefix;

	return address;
}

IPValidator.prototype.IsIPv4AddressInRange = function( remote_address, cidr_address )
{
	var mask, ip_to_int;

	/*
	 * Convert the IPv4 addresses to 32-bit integers and then use the
	 * bit mask to see if the addresses match
	 */

	mask		= ~( Math.pow( 2, 32 - cidr_address.prefix ) - 1 ) >>> 0;
	ip_to_int	= function( ip )
	{
		var octets;

		octets = ip.split( '.' );

		return ( stoi( octets[ 0 ] ) << 24 ) + ( stoi( octets[ 1 ] ) << 16 ) + ( stoi( octets[ 2 ] ) << 8 ) + ( stoi( octets[ 3 ] ) ) >>> 0;
	};

	return ( ip_to_int( remote_address.ip ) & mask ) === ( ip_to_int( cidr_address.ip ) & mask );
}

IPValidator.prototype.IsIPv6AddressInRange = function( remote_address, cidr_address )
{
	var i, mask, prefix, ip_to_int, remote_ip_representation, cidr_ip_representation;

	/*
	 * Convert the IPv6 addresses to 4 32-bit integers and then use the
	 * bit mask to see each integer in the array matches
	 */

	prefix						= cidr_address.prefix;
	ip_to_int					= function( ip )
	{
		/*
		 * Create an array containing 4 32-bit integers that represents the IPv6 address
		 */

		var hextets, integers;

		hextets		= ip.split( ':' );
		integers	= new Array();

		for ( i = 0; i < 8; i = i + 2 )
		{
			integers.push( ( ( parseInt( hextets[ i ], 16 ) << 16 ) + ( parseInt( hextets[ i + 1 ], 16 ) ) ) >>> 0 );
		}

		return integers;
	};

	remote_ip_representation	= ip_to_int( remote_address.ip );
	cidr_ip_representation		= ip_to_int( cidr_address.ip );

	/*
	 * Process each integer and compare up to 32-bits at a time
	 */

	for ( i = 0; i < 4; i++ )
	{
		/*
		 * If the prefix is less than the entire 32-bits create the mask and compare
		 * the integers
		 */

		if ( prefix < 32 )
		{
			mask = ~( Math.pow( 2, 32 - prefix ) - 1 ) >>> 0;

			return ( remote_ip_representation[ i ] & mask ) === ( cidr_ip_representation[ i ] & mask );
		}
		else
		{
			/*
			 * Since the prefix is 32-bits or more, we can compare the entire integer directly
			 */

			if ( remote_ip_representation[ i ] !== cidr_ip_representation[ i ] )
			{
				return false;
			}

			prefix -= 32;
		}
	}

	return true;
}

IPValidator.prototype.IsIPAddressInRange = function( remote_ip, cidrs )
{
	var i, i_len, entries, remote_address, cidr_address;

	try
	{
		remote_address = this.ParseIPAddress( remote_ip );
	}
	catch ( e )
	{
		return false;
	}

	entries = cidrs.split( ',' );

	for ( i = 0, i_len = entries.length; i < i_len; i++ )
	{
		try
		{
			cidr_address = this.ParseIPAddress( entries[ i ].trim() );
		}
		catch ( e )
		{
			continue;
		}

		if ( remote_address.version === cidr_address.version )
		{
			if ( remote_address.version === 4 && this.IsIPv4AddressInRange( remote_address, cidr_address ) )		return true;
			else if ( remote_address.version === 6 && this.IsIPv6AddressInRange( remote_address, cidr_address ) )	return true;
		}
	}

	return false;
}

IPValidator.prototype.IsDefaultRouteInCIDRList = function( cidrs )
{
	var i, i_len, entry, entries, address;

	entries = cidrs.split( ',' );

	for ( i = 0, i_len = entries.length; i < i_len; i++ )
	{
		entry = entries[ i ].trim();

		try
		{
			address = this.ParseIPAddress( entry )
		}
		catch ( e )
		{
			continue;
		}

		if ( ( address.ip === this.ipv4_default_route || address.ip === this.ipv6_default_route ) && address.prefix === 0 )
		{
			return true;
		}
	}

	return false;
}

IPValidator.prototype.Validate_CIDR_List = function( cidrs )
{
	var i, i_len, entry, entries;

	entries = cidrs.split( ',' );

	for ( i = 0, i_len = entries.length; i < i_len; i++ )
	{
		entry = entries[ i ].trim();

		if ( entry.length > 0 && !this.Validate_CIDR( entry ) )
		{
			return this.Error( entry + ': ' + this.error() );
		}
	}

	return true;
}

IPValidator.prototype.Validate_CIDR = function( cidr )
{
	var address;

	try
	{
		address = this.ParseIPAddress( cidr );
	}
	catch ( e )
	{
		return this.Error( e );
	}

	if ( address.ip != this.ipv4_default_route && address.ip != this.ipv6_default_route && address.prefix == 0 )
	{
		return this.Error( 'Routing prefix /0 is only valid with the default routes 0.0.0.0 and ::0' );
	}

	return true;
}

// MMLoadingIndicator
//////////////////////////////////////////////

var MMLoadingIndicator = class
{
	#visible;
	#element_indicator;

	constructor( element_parent )
	{
		this.#visible			= false;
		this.#element_indicator	= newElement( 'span', { 'class': 'mm_loading_indicator' }, null, element_parent );
	}

	SetDimension( dimension )
	{
		this.#element_indicator.style.setProperty( '--mm-loading-indicator-dimension', `${stoi_def_nonneg( dimension, 48 )}px` );
		return this;
	}
	
	SetLineWidth( line_width )
	{
		this.#element_indicator.style.setProperty( '--mm-loading-indicator-line-width', `${stoi_def_nonneg( line_width, 2 )}px` );
		return this;
	}
	
	SetForegroundColor( foreground_color )
	{
		this.#element_indicator.style.setProperty( '--mm-loading-indicator-foreground-color', `${foreground_color}` );
		return this;
	}
	
	SetLoopDuration( loop_duration )
	{
		this.#element_indicator.style.setProperty( '--mm-loading-indicator-animation-duration', `${stoi_def_nonneg( loop_duration, 2000 )}ms` );
		return this;
	}
	
	SetTimeSync( time_sync )
	{
		/* This function has been deprecated */
		return this;
	}
	
	Show()
	{
		if ( this.#visible )
		{
			return;
		}
	
		this.#visible = true;
		this.#element_indicator.classList.add( 'visible' );
	
		this.onShow();
	}
	
	Hide()
	{
		if ( !this.#visible )
		{
			return;
		}
	
		this.#visible = false;
		this.#element_indicator.classList.remove( 'visible' );
	
		this.onHide();
	}
	
	onShow() { ; }
	onHide() { ; }
}

// Progress Bar
//////////////////////////////////////////////

function ProgressBar( parent )
{
	// Elements
	this.parent								= parent;
	this.container							= newElement( 'span', { 'class': 'mm9_progressbar' },									null, this.parent );

	this.progress							= newElement( 'span', { 'class': 'mm9_progressbar_progress' },							null, this.container );
	this.progress_cancel					= newElement( 'span', { 'class': 'mm9_progressbar_progress_cancel mm9_mivaicon' },		null, this.progress );
	this.progress_container					= newElement( 'span', { 'class': 'mm9_progressbar_progress_container' },				null, this.progress );
	this.progress_title						= newElement( 'span', { 'class': 'mm9_progressbar_progress_title' },					null, this.progress_container );
	this.progress_error						= newElement( 'span', { 'class': 'mm9_progressbar_progress_error' },					null, this.progress_container );
	this.progress_background				= newElement( 'span', { 'class': 'mm9_progressbar_progress_background' },				null, this.progress_container );
	this.progress_visual					= newElement( 'span', { 'class': 'mm9_progressbar_progress_visual' },					null, this.progress_background );
	this.progress_percent_container			= newElement( 'span', { 'class': 'mm9_progressbar_progress_percent_container' },		null, this.progress_container );
	this.progress_percent_spacer			= newElement( 'span', { 'class': 'mm9_progressbar_progress_percent_spacer' },			null, this.progress_percent_container );
	this.progress_percent_bubble			= newElement( 'span', { 'class': 'mm9_progressbar_progress_percent_bubble' },			null, this.progress_percent_spacer );
	this.progress_percent					= newElement( 'span', { 'class': 'mm9_progressbar_progress_percent' },					null, this.progress_percent_bubble );
	this.progress_percent_tail				= newElement( 'span', { 'class': 'mm9_progressbar_progress_percent_tail' },				null, this.progress_percent_bubble );

	// Element Values
	this.progress_error.innerHTML			= 'Error (<span style="text-decoration: underline;">details</span>)';
	this.progress_cancel.innerHTML			= MivaIconMap( 'cancel' );

	// Variables
	this.progressbar_is_indeterminate		= true;

	this.SetIndeterminate( true );
}

ProgressBar.prototype.SetTitle = function( text )
{
	this.progress_title.innerHTML		= '';
	classNameRemoveIfPresent( this.container, 'mm9_progressbar_show_title' );

	if ( text )
	{
		this.progress_title.title		= text;
		this.progress_title.textContent	= text;

		classNameAddIfMissing( this.container, 'mm9_progressbar_show_title' );
	}
}

ProgressBar.prototype.SetError = function( error_message )
{
	var self = this;

	this.progress_error.title			= error_message;
	this.progress_error.onclick			= function( event ) { self.onError( error_message ); };

	classNameAddIfMissing( this.container, 'mm9_progressbar_error' );
}

ProgressBar.prototype.SetStatus_Enabled = function()
{
	classNameAddIfMissing( this.progress, 'mm9_progressbar_progress_show_percent' );

	return this;
}

ProgressBar.prototype.SetStatus_Disabled = function()
{
	classNameRemoveIfPresent( this.progress, 'mm9_progressbar_progress_show_percent' );

	return this;
}

ProgressBar.prototype.SetCancel_Enabled = function( oncancel )
{
	this.container.className				= classNameAdd( this.container, 'mm9_progressbar_cancel' );

	this.progress_cancel.onclick			= function( event ) { oncancel( event ); };

	return this;
}

ProgressBar.prototype.SetCancel_Disabled = function()
{
	this.container.className				= classNameRemove( this.container, 'mm9_progressbar_cancel' );

	this.progressbar_cancel.onclick			= function( event ) { ; };

	return this;
}

ProgressBar.prototype.SetIndeterminate = function( indeterminate )
{
	this.progressbar_is_indeterminate		= indeterminate;

	if ( indeterminate )	classNameAddIfMissing( this.container, 'indeterminate' );
	else					classNameRemoveIfPresent( this.container, 'indeterminate' );

	return this;
}

ProgressBar.prototype.Show = function( display )
{
	this.container.style.display = display == null ? 'block' : display;

	return this;
}

ProgressBar.prototype.Hide = function()
{
	this.container.style.display = 'none';

	return this;
}

ProgressBar.prototype.Percent = function( percent )
{
	if ( this.progressbar_is_indeterminate )
	{
		return;
	}

	this.progress_visual.style.transform			= 'translateX(' + ( percent - 100 ) + '%)';
	this.progress_percent_container.style.transform	= 'translateX(' + percent + '%)';
	this.progress_percent.textContent				= percent + '%';
}

ProgressBar.prototype.Delete = function()
{
	if ( this.container.parentNode )
	{
		this.container.parentNode.removeChild( this.container );
	}
}

ProgressBar.prototype.onError = function( error_message )
{
	Modal_Alert( error_message );
}

function ClearFileInputValue( file_input )
{
	var temp_form = document.createElement( 'form' );
	var container = file_input.parentNode;

	temp_form.appendChild( file_input );
	temp_form.reset();
	container.appendChild( file_input );
}

/*** PR9 Specific JavaScript ***/

function captureTouchPositionList( e )
{
	if ( e.originalEvent &&
		 e.originalEvent.touches &&
		 e.originalEvent.touches.length )				return e.originalEvent.touches;
	else if ( e.originalEvent &&
			  e.originalEvent.changedTouches &&
			  e.originalEvent.changedTouches.length )	return e.originalEvent.changedTouches;
	else if ( e.touches &&
			  e.touches.length )						return e.touches;
	else if ( e.changedTouches &&
			  e.changedTouches.length )					return e.changedTouches;

	return null;
}

function isContentEditable( element )
{
	while ( element && ( typeof element.getAttribute === 'function' ) )
	{
		if ( element.getAttribute( 'contentEditable' ) === 'true' )
		{
			return true;
		}

		element = element.parentNode;
	}

	return false;
}

function getFocusElement( doc /* optional */ )
{
	if ( !doc )
	{
		doc = document;
	}

	if ( doc.activeElement )	return doc.activeElement;
	else if ( doc.focusNode )	return doc.focusNode;
	else						return null;
}

function frameDocument( frame )
{
	if ( frame.contentDocument	)				return frame.contentDocument;
	else if ( frame.contentWindow.document )	return frame.contentWindow.document;
	else if ( frame.document )					return frame.document;

	return null;
}

function setFrameSource( frame, url )
{
	if ( frame !== null )
	{
		if ( frame.src )										frame.src = url;
		else if( ( frame.contentWindow !== null ) &&
				 ( frame.contentWindow.location !== null ) )	frame.contentWindow.location = url;
		else													frame.setAttribute( 'src', url );
	}
}

function windowDimensions()
{
	var winW, winH;

	if ( window.innerWidth && window.innerHeight )
	{
		winW = window.innerWidth;
		winH = window.innerHeight;
	}
	else if ( document.compatMode == 'CSS1Compat'	&&
			  document.documentElement				&&
			  document.documentElement.offsetWidth )
	{
		winW = document.documentElement.offsetWidth;
		winH = document.documentElement.offsetHeight;
	}
	else if ( document.body && document.body.offsetWidth )
	{
		winW = document.body.offsetWidth;
		winH = document.body.offsetHeight;
	}

	return { x : winW, y : winH }
}

function dispatchNewEvent_WithOptions( target, type, options )
{
	const e = new MouseEvent( type, Object.assign( { bubbles: true, cancelable: true, view: window }, options ) );
	target.dispatchEvent( e );
}

function dispatchNewEvent( target, type, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget )
{
	const options =
	{
		screenX: screenX ?? 0,
		screenY: screenY ?? 0,
		clientX: clientX ?? 0,
		clientY: clientY ?? 0,
		ctrlKey: ctrlKey ?? false,
		altKey: altKey ?? false,
		shiftKey: shiftKey ?? false,
		metaKey: metaKey ?? false,
		button: button ?? 0,
		relatedTarget: relatedTarget ?? null
	};

	return dispatchNewEvent_WithOptions( target, type, options );
}

function elementCanFocus( element )
{
	if ( !element || element.disabled || ( element.offsetWidth === 0 && element.offsetHeight === 0 ) || !elementIsVisible( element ) )
	{
		return false;
	}

	if ( element.nodeName === 'INPUT' && element.type.toUpperCase() === 'HIDDEN' )
	{
		return false;
	}

	if ( element.nodeName === 'A'						||
		 element.nodeName === 'AREA'					||
		 element.nodeName === 'OBJECT'					||
		 element.nodeName === 'BUTTON'					||
		 element.nodeName === 'INPUT'					||
		 element.nodeName === 'SELECT'					||
		 element.nodeName === 'IFRAME'					||
		 element.nodeName === 'TEXTAREA'				||
		 element instanceof MMInputCustomElement		||
		 element instanceof MMTextAreaCustomElement		||
		 element instanceof MMTextEditorCustomElement	||
		 element instanceof MMSelectCustomElement		||
		 element instanceof MMCheckBoxCustomElement		||
		 element instanceof MMRadioCustomElement		||
		 element instanceof MMButtonCustomElement )
	{
		return true;
	}

	if ( element.hasAttribute( 'tabIndex' ) )
	{
		return true;
	}

	if ( element.isContentEditable )
	{
		return true;
	}

	return false;
}

function elementIsVisible( element )
{
	var node = element;

	while ( node && node !== document.documentElement )
	{
		if ( computedStyleValue( node, 'display' ) === 'none'		||
			 computedStyleValue( node, 'visibility' ) === 'hidden'	||
			 stoi_def( computedStyleValue( node, 'opacity' ), 1 ) === 0 )
		{
			return false;
		}

		node = node.parentNode;
	}

	return true;
}

function FocusChildInput( parent, name )
{
	var i, elements;

	elements	= parent.getElementsByTagName( "input" );
	for ( i = 0; i < elements.length; i++ )
	{
		if ( ( elements[ i ].name == name ) && elementCanFocus( elements[ i ] ) )
		{
			if ( elements[ i ].focus )	elements[ i ].focus();
			return;
		}
	}

	elements	= parent.getElementsByTagName( "textarea" );
	for ( i = 0; i < elements.length; i++ )
	{
		if ( ( elements[ i ].name == name ) && elementCanFocus( elements[ i ] ) )
		{
			if ( elements[ i ].focus )	elements[ i ].focus();
			return;
		}
	}
}

function timezone( date )
{
	var datestring, tz;

	if ( !date )
	{
		date	= new Date();
	}

	datestring	= date + "";
	tz			= datestring.match( /\(([^\)]+)\)/ );

	if ( !tz )
	{
		tz		= datestring.match( /([A-Z]+) [0-9]{4}$/ );	// IE
	}

	return tz[ 1 ].match( /[A-Z]+/ ).join();
}

function mouseClickType( e )
{
	if ( e?.button == 1 )		return 'MIDDLE';
	else if ( e?.button == 2 )	return 'RIGHT';
	else						return 'LEFT';
}

function base64_encode( string )
{
	var encoded_string = base64_encode_lowlevel( string, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/' );

	return padr( encoded_string, encoded_string.length + ( ( 4 - encoded_string.length % 4 ) % 4 ), '=' );
}

function base64url_encode( string )
{
	return base64_encode_lowlevel( string, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_' );
}

function base64_encode_lowlevel( string, base64_encode_chars )
{
	var i, c;
	var is_unicode;
	var byte_array, output;

	output		= '';
	is_unicode	= isUnicode();
	byte_array	= new Array();

	// Convert the internal UTF-16 string into an array of bytes
	for ( i = 0; i < string.length; i++ )
	{
		c = string.charCodeAt( i );

		if ( !is_unicode && c <= 255 )		// Attempt to detect and preserve non-unicode characters, when possible
		{
			byte_array.push( c );
		}
		else if ( c < 128 )					// Single byte
		{
			byte_array.push( c );
		}
		else if ( c < 0x800 )				// Two bytes
		{
			byte_array.push( 192 + ( c >>> 6 ) );
			byte_array.push( 128 + ( c & 63 ) );
		}
		else if ( c < 0x10000 )				// Three bytes
		{
			byte_array.push( 224 + ( c >>> 12 ) );
			byte_array.push( 128 + ( ( c >>> 6 ) & 63 ) );
			byte_array.push( 128 + ( c & 63 ) );
		}
		else if ( c < 0x200000 )			// Four bytes
		{
			byte_array.push( 240 + ( c >>> 18 ) );
			byte_array.push( 128 + ( ( c >>> 12 ) & 63 ) );
			byte_array.push( 128 + ( ( c >>> 6 ) & 63 ) );
			byte_array.push( 128 + ( c & 63 ) );
		}
		else if ( c < 0x4000000 )			// Five bytes
		{
			byte_array.push( 248 + ( c >>> 24 ) );
			byte_array.push( 128 + ( ( c >>> 18 ) & 63 ) );
			byte_array.push( 128 + ( ( c >>> 12 ) & 63 ) );
			byte_array.push( 128 + ( ( c >>> 6 ) & 63 ) );
			byte_array.push( 128 + ( c & 63 ) );
		}
		else								// Six bytes
		{
			byte_array.push( 252 + ( c / 1073741824 ) );
			byte_array.push( 128 + ( ( c >>> 24 ) & 63 ) );
			byte_array.push( 128 + ( ( c >>> 18 ) & 63 ) );
			byte_array.push( 128 + ( ( c >>> 12 ) & 63 ) );
			byte_array.push( 128 + ( ( c >>> 6 ) & 63 ) );
			byte_array.push( 128 + ( c & 63 ) );
		}
	}

	// Perform base64 encoding
	for ( i = 0; ( i + 3 ) <= byte_array.length; i += 3 )
	{
		output		+= base64_encode_chars.charAt( byte_array[ i ] >>> 2 );
		output		+= base64_encode_chars.charAt( ( ( byte_array[ i ] << 4 ) | ( byte_array[ i + 1 ] >>> 4 ) ) & 63 );
		output		+= base64_encode_chars.charAt( ( ( byte_array[ i + 1 ] << 2 ) | ( byte_array[ i + 2 ] >>> 6 ) ) & 63 );
		output		+= base64_encode_chars.charAt( byte_array[ i + 2 ] & 63 );
	}

	switch ( byte_array.length - i )
	{
		case 2 :
		{
			output	+= base64_encode_chars.charAt( byte_array[ i ] >>> 2 );
			output	+= base64_encode_chars.charAt( ( ( byte_array[ i ] << 4 ) | ( byte_array[ i + 1 ] >> 4 ) ) & 63 );
			output	+= base64_encode_chars.charAt( ( byte_array[ i + 1 ] & 15 ) << 2 );

			break;
		}
		case 1 :
		{
			output	+= base64_encode_chars.charAt( byte_array[ i ] >>> 2 );
			output	+= base64_encode_chars.charAt( ( byte_array[ i ] & 3 ) << 4 );

			break;
		}
	}

	return output;
}

function ieee754_normalize( significant_digits, value )
{
	if ( significant_digits == 2 )
	{
		high_significant	= 0.001;
		low_significant		= -0.001;
	}
	else
	{
		high_significant	= 1 / Math.pow( 10, significant_digits + 1 );
		low_significant		= 0 - high_significant;
	}

	return value <= low_significant || value >= high_significant ? value : 0;
}

function elementHasInheritedStyle( element, property, value )
{
	var style;

	while ( element && element !== document )
	{
		style = computedStyleValue( element, property );

		if ( style.indexOf( value ) != -1 )
		{
			return true;
		}

		element = element.parentNode;
	}

	return false;
}

function elementUnderCursor()
{
	var node = window.getSelection().anchorNode;

	return ( !node ? null : ( node.nodeType == 3 ? node.parentNode : node ) );
}

function selectedElementUnderCursor()
{
	var range = getWindowSelectionRange();

	if ( !range )
	{
		return null;
	}

	if ( range.startContainer.nodeType === Node.ELEMENT_NODE && range.startContainer.childNodes[ range.startOffset ] )
	{
		return range.startContainer.childNodes[ range.startOffset ].nodeType === Node.TEXT_NODE ? range.startContainer.childNodes[ range.startOffset ].parentNode : range.startContainer.childNodes[ range.startOffset ];
	}

	return range.startContainer.nodeType === Node.TEXT_NODE ? range.startContainer.parentNode : range.startContainer;
}

function getWindowSelectionRange()
{
	return window.getSelection && window.getSelection().rangeCount ? window.getSelection().getRangeAt( 0 ) : null;
}

function isJavaScriptWordChar( c )
{
	var c_code = c.charCodeAt( 0 );

	if ( ( c_code >= 65 && c_code <= 90 ) ||
		 ( c_code >= 97 && c_code <= 122 ) ||
		 ( c_code >= 48 && c_code <= 57 ) ||
		 ( c_code == 95 ) )
	{
		return true;
	}

	return false;
}

function calculateScrollBarDimensions( { doc = document } = {} )
{
	var dimensions, element_scrollbar;

	if ( doc.hasOwnProperty( 'mm_cached_scrollbar_dimensions' ) )
	{
		return doc.mm_cached_scrollbar_dimensions;
	}

	element_scrollbar	= newElement( 'div', { 'class': 'mm10_scrollbar_dimension_calculator' }, null, doc.body );
	dimensions			= new Object();
	dimensions.width	= element_scrollbar.offsetWidth - element_scrollbar.clientWidth;
	dimensions.height	= element_scrollbar.offsetHeight - element_scrollbar.clientHeight;

	element_scrollbar.parentNode.removeChild( element_scrollbar );

	doc.mm_cached_scrollbar_dimensions = dimensions;

	return dimensions;
}

function generateKeyPrefix()
{
	if ( window === top )
	{
		return 'MMScreen';
	}
	else if ( typeof window.Screen === 'string' && window.Screen.length && typeof window.Tab === 'string' && window.Tab.length )
	{
		return window.Screen + '.' + window.Tab;
	}
	else if ( typeof window.Screen === 'string' && window.Screen.length )
	{
		return window.Screen + '.' + window.Screen;
	}

	return 'Unknown';
}

function InvalidParameterException( class_name, parameter, message )
{
	this.class_name	= class_name;
	this.parameter	= parameter;
	this.message	= message;
	this.toString	= function()
	{
		return this.class_name + ': ' + this.parameter + ': ' + this.message;
	}
}

function MMScreen_RefreshNavigation()
{
	try
	{
		if ( top.mm9_screen )
		{
			top.mm9_screen.RefreshNavigation();
		}
	}
	catch ( e )
	{
		;
	}
}

function MMScreen_LoadFinished( fn1 )
{
	try
	{
		if ( top.mm9_screen )
		{
			top.mm9_screen.LoadFinishedHandler_AddHook( fn1 );
		}
	}
	catch ( e )
	{
		;
	}
}

function MMScreen_GetUpdateAction()
{
	try
	{
		if ( top.mm9_screen )
		{
			return top.mm9_screen.GetUpdateAction();
		}
	}
	catch ( e )
	{
		;
	}

	return null;
}

function InstanceOf_MMFormField( field )
{
	if ( window.MMInput && field instanceof MMInput )										return true;
	else if ( window.MMSelect && field instanceof MMSelect )								return true;
	else if ( window.MMButton && field instanceof MMButton )								return true;
	else if ( window.MMCheckBox && field instanceof MMCheckBox )							return true;
	else if ( window.MMDateTimePickerDisplay && field instanceof MMDateTimePickerDisplay )	return true;

	return false;
}

if ( !window.hasOwnProperty( 'mm10_onrender_hooks' ) )		window.mm10_onrender_hooks		= new Array();
if ( !window.hasOwnProperty( 'mm10_onrender_render_id' ) )	window.mm10_onrender_render_id	= null;
if ( !window.hasOwnProperty( 'mm10_onrender_render' ) )
{
	window.mm10_onrender_render = function()
	{
		try
		{
			MMRender();
		}
		catch ( e )
		{
			throw e;
		}
		finally
		{
			mm10_onrender_render_id = requestAnimationFrame( mm10_onrender_render );
		}
	};
}

function MMRender()
{
	var data = new Object();

	MMRender_onRender_Read_Handler( data );
	MMRender_onRender_Write_Handler( data );
}

function MMRender_MMScreen_Read( data )
{
	MMRender_onRender_Read_Handler( data );
}

function MMRender_MMScreen_Write( data )
{
	MMRender_onRender_Write_Handler( data );
}

function MMRender_onRender_AddHook( read_callback, write_callback )
{
	var hook;

	hook				= new Object();
	hook.identifier		= GenerateUniqueID();
	hook.read_callback	= read_callback;
	hook.write_callback	= write_callback;

	mm10_onrender_hooks.push( hook );
}

function MMRender_onRender_RemoveHook( read_callback, write_callback )
{
	var i, i_len;

	for ( i = 0, i_len = mm10_onrender_hooks.length; i < i_len; i++ )
	{
		if ( mm10_onrender_hooks[ i ].read_callback === read_callback &&
			 mm10_onrender_hooks[ i ].write_callback === write_callback )
		{
			mm10_onrender_hooks[ i ].read_callback	= null;
			mm10_onrender_hooks[ i ].write_callback	= null;

			mm10_onrender_hooks.splice( i, 1 );
			break;
		}
	}
}

function MMRender_onRender_Read_Handler( data )
{
	var tmp_hooks = mm10_onrender_hooks.slice();
	MMRender_onRender_Read_Handler_LowLevel( tmp_hooks, data );
}

function MMRender_onRender_Read_Handler_LowLevel( hooks, data )
{
	var hook;

	if ( hooks.length === 0 )
	{
		return;
	}

	hook = hooks.shift();

	try
	{
		if ( typeof hook.read_callback === 'function' )
		{
			data[ hook.identifier ] = new Object();
			hook.read_callback( data[ hook.identifier ] );
		}
	}
	catch ( e )
	{
		throw e;
	}
	finally
	{
		MMRender_onRender_Read_Handler_LowLevel( hooks, data );
	}
}

function MMRender_onRender_Write_Handler( data )
{
	var tmp_hooks = mm10_onrender_hooks.slice();
	MMRender_onRender_Write_Handler_LowLevel( tmp_hooks, data );
}

function MMRender_onRender_Write_Handler_LowLevel( hooks, data )
{
	var hook;

	if ( hooks.length === 0 )
	{
		return;
	}

	hook = hooks.shift();

	if ( typeof hook.write_callback !== 'function' )
	{
		return MMRender_onRender_Write_Handler_LowLevel( hooks, data );
	}

	if ( !data.hasOwnProperty( hook.identifier ) )
	{
		if (  typeof hook.read_callback === 'function' )
		{
			//
			// Ignore write call if we have a read_callback but no data
			// object was associated to ensure that we do not get JS
			// errors due to a "render" hook being added mid-cycle
			//

			return MMRender_onRender_Write_Handler_LowLevel( hooks, data );
		}

		data[ hook.identifier ] = new Object();
	}

	try
	{
		hook.write_callback( data[ hook.identifier ] );
	}
	catch ( e )
	{
		throw e;
	}
	finally
	{
		MMRender_onRender_Write_Handler_LowLevel( hooks, data );
	}
}

AddEvent( document, 'DOMContentLoaded', function( event )
{
	try
	{
		//
		// Sync read/write with MMScreen's Read/Write rendering
		//

		top.mm9_screen.onRender_Frame_Read_AddHook( MMRender_MMScreen_Read );
		top.mm9_screen.onRender_Frame_Write_AddHook( MMRender_MMScreen_Write );
	}
	catch ( e )
	{
		//
		// Generate private request
		//

		mm10_onrender_render_id = requestAnimationFrame( mm10_onrender_render );
	}
} );

(() =>
{
	var counter = 0;

	window.GenerateUniqueID = () =>
	{
		try
		{
			//
			// We must wrap this in a try-catch so that if the window doesn't have
			// access (cross-origin) to the top window, we can still generate a unique id
			//

			if ( window !== top && typeof top.GenerateUniqueID === 'function' )
			{
				return top.GenerateUniqueID();
			}
		}
		catch ( e )
		{
			;
		}

		return `mm_unique_id_${counter++}`;
	}
})();

function RandomIntegerRange( min, max )
{
	return Math.floor( Math.random() * ( max - min + 1 ) + min );
}

// MMNotification
////////////////////////////////////////////////////

var mm_notification_queue							= new Array();
var mm_notification_activelist						= new Array();
var mm_notification_activelist_persistent			= new Array();
var mm_notification_activelist_element_container	= newElement( 'span', { 'class': 'mm_notification_message_container' }, null, null );

function MMNotification( message, seconds, flags, onclose, action_text, onaction )
{
	var notification;

	if ( window !== top && typeof top.MMNotification === 'function' )
	{
		return top.MMNotification( message, seconds, flags, onclose, action_text, onaction );
	}

	notification						= new Object();
	notification.flag_error				= false;
	notification.flag_persistent		= false;
	notification.flag_persist_pageload	= false;
	notification.flag_primary			= false;
	notification.message				= message;
	notification.milliseconds			= seconds ? ( seconds * 1000 ) : 4000;
	notification.animation_id			= GenerateUniqueID();
	notification.onclose				= onclose;

	if ( Array.isArray( flags ) )
	{
		if ( flags.indexOf( 'error' ) !== -1 )				notification.flag_error				= true;
		if ( flags.indexOf( 'primary' ) !== -1 )			notification.flag_primary			= true;
		if ( flags.indexOf( 'persistent' ) !== -1 )			notification.flag_persistent		= true;
		if ( flags.indexOf( 'persist_pageload' ) !== -1 )	notification.flag_persist_pageload	= true;
	}

	if ( ( typeof arrayFind( mm_notification_queue, function( search_notification ) { return ( search_notification.message === notification.message && search_notification.flag_persistent === notification.flag_persistent && search_notification.flag_error === notification.flag_error && search_notification.flag_persist_pageload === notification.flag_persist_pageload ); } ) !== 'undefined' ) ||
		 ( typeof arrayFind( mm_notification_activelist, function( search_notification ) { return ( search_notification.message === notification.message && search_notification.flag_persistent === notification.flag_persistent && search_notification.flag_error === notification.flag_error && search_notification.flag_persist_pageload === notification.flag_persist_pageload ); } ) !== 'undefined' ) ||
		 ( typeof arrayFind( mm_notification_activelist_persistent, function( search_notification ) { return ( search_notification.message === notification.message && search_notification.flag_persistent === notification.flag_persistent && search_notification.flag_error === notification.flag_error && search_notification.flag_persist_pageload === notification.flag_persist_pageload ); } ) !== 'undefined' ) )
	{
		//
		// Message already queued, don't display again
		//

		return;
	}

	notification.element								= newElement( 'span',	{ 'class': 'mm_notification_message' },									null, null );
	notification.element.element_text					= newElement( 'span',	{ 'class': 'mm_notification_message_text' },							null, notification.element );

	if ( !ValueIsEmpty( action_text ) && typeof onaction === 'function' )
	{
		notification.element.element_action				= newElement( 'a',		{ 'class': 'mm_notification_message_action', 'href': '#' },				null, notification.element );
		notification.element.element_action.onclick		= function( event ) { onaction( event ); return false; };
		notification.element.element_action.textContent	= action_text;
	}

	notification.element.element_close					= newElement( 'span',	{ 'class': 'mm_notification_message_close mm9_mivaicon icon-cancel' },	null, notification.element );

	notification.element.element_text.textContent		= message;
	notification.element.element_close.onclick			= function( event ) { MMNotification_Clear( notification ); return false; };

	if ( notification.flag_primary )	classNameAddIfMissing( notification.element, 'primary' );
	if ( notification.flag_error )		classNameAddIfMissing( notification.element, 'error' );

	mm_notification_queue.push( notification );
	MMNotification_Run();

	return notification;
}

function MMNotification_Run()
{
	var i, i_len, position, notification, available_notification_count, available_persistent_notification_count;

	if ( window !== top && typeof top.MMNotification_Run === 'function' )
	{
		return top.MMNotification_Run();
	}

	if ( mm_notification_queue.length === 0 )
	{
		return;
	}

	available_notification_count			= 2;
	available_persistent_notification_count	= 2;

	for ( i = 0, i_len = mm_notification_activelist.length; i < i_len; i++ )
	{
		if ( mm_notification_activelist[ i ].flag_persistent )	available_persistent_notification_count--;
		else													available_notification_count--;
	}

	position = 0;

	while ( mm_notification_queue.length && position < mm_notification_queue.length && ( available_notification_count > 0 || available_persistent_notification_count > 0 ) )
	{
		if ( ( !mm_notification_queue[ position ].flag_persistent && available_notification_count <= 0 ) ||
			 ( mm_notification_queue[ position ].flag_persistent && available_persistent_notification_count <= 0 ) )
		{
			position++;
			continue;
		}

		notification = mm_notification_queue.splice( position, 1 )[ 0 ];
		MMNotification_Notify( notification );

		if ( notification.flag_persistent )	available_persistent_notification_count--;
		else								available_notification_count--;
	}
}

function MMNotification_Notify( notification )
{
	var animationlist = new Array();

	if ( mm_notification_activelist.length === 0 )
	{
		document.body.appendChild( mm_notification_activelist_element_container );
	}

	animationlist.push( createAnimation(
	{
		delay:		0,
		duration:	200,
		delta:		animationLinear,
		onstart:	function()
		{
			mm_notification_activelist_element_container.insertBefore( notification.element, mm_notification_activelist_element_container.firstChild );

			notification.element.style.opacity		= 0;
			notification.element.style.transform	= 'scale(0)';
		},
		step:		function( delta )
		{
			notification.element.style.opacity		= delta;
			notification.element.style.transform	= 'scale(' + delta + ')';
		},
		oncomplete:	function()
		{
			notification.element.style.transform	= '';
		}
	} ) );

	if ( !notification.flag_persistent )
	{
		animationlist.push( createAnimation(
		{
			delay:		notification.milliseconds - 200,
			duration:	0,
			delta:		animationLinear,
			step:		function( delta ) { ; },
			oncomplete:	function() { MMNotification_Clear( notification ); }
		} ) );
	}

	mm_notification_activelist.push( notification );
	cancelAnimationFrame( window[ notification.animation_id ] );
	beginAnimations( animationlist, notification.animation_id );
}

function MMNotification_Clear( notification )
{
	var animationlist;

	if ( window !== top && typeof top.MMNotification_Clear === 'function' )
	{
		return top.MMNotification_Clear( notification );
	}

	if ( !notification || mm_notification_activelist.length === 0 )
	{
		return;
	}

	animationlist = new Array();
	animationlist.push( createAnimation(
	{
		delay:		0,
		duration:	200,
		delta:		animationLinear,
		step:		function( delta )
		{
			notification.element.style.transform	= 'scale(' + ( 1 - delta ) + ')';
			notification.element.style.opacity		= 1 - delta;
		},
		oncomplete:	function()
		{
			var index;

			if ( notification.element.parentNode )
			{
				notification.element.parentNode.removeChild( notification.element );
			}

			if ( ( index = mm_notification_activelist.indexOf( notification ) ) !== -1 )
			{
				mm_notification_activelist.splice( index, 1 );
			}

			if ( mm_notification_activelist.length === 0 && mm_notification_activelist_element_container.parentNode )
			{
				mm_notification_activelist_element_container.parentNode.removeChild( mm_notification_activelist_element_container );
			}

			if ( typeof notification.onclose === 'function' )
			{
				notification.onclose();
			}

			setTimeout( MMNotification_Run, 30 );
		}
	} ) );

	cancelAnimationFrame( window[ notification.animation_id ] );
	beginAnimations( animationlist, notification.animation_id );
}

function MMNotification_ClearAll( force_clear )
{
	var i;

	if ( window !== top && typeof top.MMNotification_ClearAll === 'function' )
	{
		return top.MMNotification_ClearAll( force_clear );
	}

	for ( i = mm_notification_queue.length - 1; i >= 0; i-- )
	{
		if ( force_clear || ( !mm_notification_queue[ i ].flag_persist_pageload && !mm_notification_queue[ i ].flag_persistent ) )
		{
			mm_notification_queue.splice( i, 1 );
		}
	}

	for ( i = mm_notification_activelist.length - 1; i >= 0; i-- )
	{
		if ( force_clear || ( !mm_notification_activelist[ i ].flag_persist_pageload && !mm_notification_activelist[ i ].flag_persistent ) )
		{
			MMNotification_Clear( mm_notification_activelist[ i ] );
			mm_notification_activelist.splice( i, 1 );
		}
	}
}

// MMButton
////////////////////////////////////////////////////

function MMButton( parent )
{
	var self = this;

	this.visible							= true;
	this.text_visible						= false;
	this.icon_visible						= false;
	this.custom_visible						= false;
	this.allow_right						= false;
	this.allow_middle						= false;
	this.tab_index							= 0;
	this.event_returnfalse					= function() { return false; };
	this.event_mousedown					= function( event ) { return self.OnMouseDown( event ? event : window.event ) };
	this.event_mouseup						= function( event ) { return self.OnMouseUp( event ? event : window.event ) };
	this.button_click_evt					= null;
	this.button_processing_state			= null;

	this.button								= this.CreateTopLevelElement( parent );
	this.button.tabIndex					= this.tab_index;
	this.button.onfocus						= function( event ) { return self.Event_Focus( event ? event : window.event ); };
	this.button.onblur						= function( event ) { return self.Event_Blur( event ? event : window.event ); };
	this.button.GetClass					= function() { return self; };
	this.button.titleElement				= newElement( 'span', { 'class': 'mm9_button_title' },		 		null, this.button );
	this.button.titleTextElement			= newElement( 'span', { 'class': 'mm9_button_title_text' },		 	null, this.button.titleElement );
	this.button.tooltipElement				= newElement( 'span', { 'class': 'mm9_button_title_tooltip' },		null, this.button.titleElement );
	this.button.imageElement				= newElement( 'span', { 'class': 'mm9_button_image mm9_mivaicon' }, null, this.button );
	this.button.spanElement					= newElement( 'span', { 'class': 'mm9_button_text' },				null, this.button );
	this.button.customElement				= newElement( 'span', { 'class': 'mm9_button_custom' },				null, this.button );
	this.button.errorIconElement			= newElement( 'span', { 'class': 'mm9_button_error_icon' },	 		null, this.button );
	this.button.errorIconElement.innerHTML	= MivaSVGIconMap( 'field-warning-icon' );
	this.button.disabled					= false;
	this.button.processing_value			= 'Processing...';
	this.button.processing_icon_name		= 'loading';
	this.button.icon_name					= '';

	this.HideImage();
	this.HideText();
	this.HideCustomContent();

	AddEvent( this.button, 'mousedown', this.event_mousedown );
}

MMButton.prototype.CreateTopLevelElement = function( parent )
{
	return newElement( 'a', { 'class': 'mm_button_style_secondary', 'data-mm-button': '' }, null, parent ? parent : null );
}

MMButton.prototype.CreateToolTipMenuButton = function()
{
	if ( this.tooltip )
	{
		return;
	}

	this.tooltip = newElement( 'mm-tooltip', null, null, this.button.tooltipElement );
}

MMButton.prototype.ContainedElement = function()
{
	return this.button;
}

MMButton.prototype.ContainedElementTitle = function()
{
	return this.button.titleElement;
}

MMButton.prototype.ContainedElementImage = function()
{
	return this.button.imageElement;
}

MMButton.prototype.ContainedElementText = function()
{
	return this.button.spanElement;
}

MMButton.prototype.ContainedElementCustom = function()
{
	return this.button.customElement;
}

MMButton.prototype.AddToParent = function( element_parent )
{
	this.ForceRemoveFocus();
	element_parent.appendChild( this.button );
}

MMButton.prototype.RemoveFromParent = function()
{
	this.ForceRemoveFocus();

	if ( this.button.parentNode )
	{
		this.button.parentNode.removeChild( this.button );
	}
}

MMButton.prototype.Enable = function()
{
	this.button.disabled	= false;
	this.button.className	= classNameRemove( this.button, 'disabled' );
	this.button.tabIndex	= this.tab_index;

	return this;
}

MMButton.prototype.Disable = function()
{
	this.button.disabled	= true;
	this.button.className	= classNameAdd( this.button, 'disabled' );
	this.button.tabIndex	= -1;

	return this;
}

MMButton.prototype.SetAllowMiddleClick = function( allow )
{
	this.allow_middle = allow ? true : false;
}

MMButton.prototype.SetAllowRightClick = function( allow )
{
	this.allow_right = allow ? true : false;
}

MMButton.prototype.SetTabIndex = function( index )
{
	this.tab_index			= index;
	this.button.tabIndex	= index;
}

MMButton.prototype.GetTabIndex = function()
{
	return this.tab_index;
}

MMButton.prototype.SetProcessing_Start = function()
{
	if ( this.button_processing_state )
	{
		return;
	}

	this.button_processing_state = new Object();

	if ( this.button )
	{
		if ( this.custom_visible )
		{
			this.button_processing_state.custom_visible		= this.button.spanElement.cloneNode( true );
			this.button_processing_state.custom				= this.button.customElement.cloneNode( true );

			this.SetText( this.GetProcessingText() );
		}
		else
		{
			if ( this.text_visible )
			{
				this.button_processing_state.text_visible	= true;
				this.button_processing_state.text			= this.button.spanElement.cloneNode( true );

				this.SetText( this.GetProcessingText() );
			}

			if ( this.icon_visible )
			{
				this.button_processing_state.icon_visible	= this.button.imageElement.cloneNode( true );
				this.button_processing_state.icon			= this.button.imageElement.cloneNode( true );

				classNameAddIfMissing( this.button.imageElement, 'mm9_mivaicon_spin' );
				this.SetImage( this.GetProcessingImage() );
			}
		}
	}

	this.Disable();
}

MMButton.prototype.SetProcessing_End = function()
{
	if ( this.button_processing_state )
	{
		if ( this.button_processing_state.custom_visible )
		{
			EmptyElement_NoResize( this.button.customElement );

			while ( this.button_processing_state.custom.childNodes.length )
			{
				this.button.customElement.appendChild( this.button_processing_state.custom.childNodes[ 0 ] );
			}

			this.ShowCustomContent();
		}
		else
		{
			if ( this.button_processing_state.text_visible )
			{
				EmptyElement_NoResize( this.button.spanElement );

				while ( this.button_processing_state.text.childNodes.length )
				{
					this.button.spanElement.appendChild( this.button_processing_state.text.childNodes[ 0 ] );
				}

				this.ShowText();
			}

			if ( this.button_processing_state.icon_visible )
			{
				classNameRemoveIfPresent( this.button.imageElement, 'mm9_mivaicon_spin' );
				EmptyElement_NoResize( this.button.imageElement );

				while ( this.button_processing_state.icon.childNodes.length )
				{
					this.button.imageElement.appendChild( this.button_processing_state.icon.childNodes[ 0 ] );
				}

				this.ShowImage();
			}
		}
	}

	this.Enable();
	this.button_processing_state = null;
}

MMButton.prototype.Show = function()
{
	this.visible				= true;
	this.button.style.display	= '';
	return this;
}

MMButton.prototype.Hide = function()
{
	this.visible				= false;
	this.button.style.display	= 'none';
	return this;
}

MMButton.prototype.ShowImage = function()
{
	this.icon_visible = true;

	if ( this.text_visible )	this.button.spanElement.style.paddingLeft = '5px';
	else						this.button.spanElement.style.paddingLeft = '';

	this.button.imageElement.style.display = 'inline-block';

	this.HideCustomContent();
}

MMButton.prototype.HideImage = function()
{
	this.icon_visible							= false;

	this.button.imageElement.style.display		= 'none';
	this.button.spanElement.style.paddingLeft	= '';
}

MMButton.prototype.TextVisible = function()
{
	return this.text_visible;
}

MMButton.prototype.ShowText = function()
{
	this.text_visible = true;

	if ( this.icon_visible )	this.button.spanElement.style.paddingLeft = '5px';
	else						this.button.spanElement.style.paddingLeft = '';

	this.button.spanElement.style.display = 'inline-block';

	this.HideCustomContent();
}

MMButton.prototype.HideText = function()
{
	this.text_visible							= false;

	this.button.spanElement.style.display		= 'none';
	this.button.spanElement.style.paddingLeft	= '';
}

MMButton.prototype.CustomContentVisible = function()
{
	return this.custom_visible;
}

MMButton.prototype.ShowCustomContent = function()
{
	this.custom_visible							= true;
	this.button.customElement.style.display		= '';

	this.HideText();
	this.HideImage();
}

MMButton.prototype.HideCustomContent = function()
{
	this.custom_visible							= false;
	this.button.customElement.style.display		= 'none';
}

MMButton.prototype.SetTitle = function( text )
{
	this.button.titleTextElement.textContent = text;

	return this;
}

MMButton.prototype.SetToolTip = function( node_or_text )
{
	this.CreateToolTipMenuButton();

	if ( typeof node_or_text !== 'string' )	this.tooltip.tooltip_custom	= node_or_text;
	else									this.tooltip.tooltip		= node_or_text;

	return this;
}

MMButton.prototype.ClearText = function()
{
	this.button.spanElement.innerHTML = '';
	this.HideText();
}

MMButton.prototype.SetText = function( text )
{
	this.button.spanElement.innerHTML = '';

	try
	{
		this.button.spanElement.appendChild( text );
		this.ShowText();
	}
	catch ( e )
	{
		this.button.spanElement.textContent	= text;

		if ( ValueIsEmpty( text ) )	this.HideText();
		else						this.ShowText();
	}

	return this;
}

MMButton.prototype.GetText = function()
{
	return this.button.spanElement.textContent;
}

MMButton.prototype.ClonedText = function()
{
	let node, fragment;

	fragment = document.createDocumentFragment();

	for ( node of this.button.spanElement.childNodes )
	{
		fragment.appendChild( node.cloneNode( true ) );
	}

	return fragment;
}

MMButton.prototype.SetHoverText = function( text )
{
	this.button.title = ( typeof text === 'undefined' ) ? '' : text;

	return this;
}

MMButton.prototype.GetHoverText = function()
{
	return this.button.title;
}

MMButton.prototype.SetProcessingText = function( text )
{
	this.button.processing_value = text;

	return this;
}

MMButton.prototype.GetProcessingText = function()
{
	return this.button.processing_value;
}

MMButton.prototype.SetProcessingImage = function( name )
{
	this.button.processing_icon_name = name;

	return this;
}

MMButton.prototype.GetProcessingImage = function()
{
	return this.button.processing_icon_name;
}

MMButton.prototype.SetImage = function( name )
{
	this.button.icon_name							= name;
	this.button.imageElement.innerHTML				= MivaIconMap( name );

	this.ShowImage();

	return this;
}

MMButton.prototype.GetImage = function()
{
	return this.button.icon_name;
}

MMButton.prototype.SetCustomContent = function( element )
{
	// If a custom image is desired (not in the MivaIcons font),
	// you must use this function to set a custom image

	this.button.customElement.innerHTML			= '';
	this.button.customElement.appendChild( element );

	this.ShowCustomContent();
}

MMButton.prototype.SetClassName = function( value )
{
	this.button.className = value;
	return this;
}

MMButton.prototype.AddClassName = function( classname )
{
	classNameAddIfMissing( this.button, classname );
}

MMButton.prototype.RemoveClassName = function( classname, allow_regex_in_classname )
{
	classNameRemoveIfPresent( this.button, classname, allow_regex_in_classname );
}

MMButton.prototype.ReplaceClassName = function( classname, replacement_classname, allow_regex_in_classname )
{
	classNameReplaceIfAltered( this.button, classname, replacement_classname, allow_regex_in_classname );
}

MMButton.prototype.GetClassName = function()
{
	return this.button.className;
}

MMButton.prototype.ClassNameContains = function( classname, allow_regex_in_classname )
{
	return classNameContains( this.button, classname, allow_regex_in_classname );
}

MMButton.prototype.SetWidth = function( width )
{
	this.button.style.width = width + 'px';
	return this;
}

MMButton.prototype.IsEnabled = function()
{
	return this.button.disabled ? false : true;
}

MMButton.prototype.Visible = function()
{
	return this.visible;
}

MMButton.prototype.SetOnClickHandler = function( func )
{
	var self = this;

	this.button_click_evt = function( e ) { func.call( self, e ); };
	return this;
}

MMButton.prototype.SimulateClick = function( options )
{
	dispatchNewEvent_WithOptions( this.button, 'mousedown', options );
	dispatchNewEvent_WithOptions( this.button, 'mouseup', options );
}

MMButton.prototype.SetOnFocusHandler = function( fn1 )
{
	this.onFocus = fn1;

	return this;
}

MMButton.prototype.SetOnBlurHandler = function( fn1 )
{
	this.onBlur = fn1;

	return this;
}

MMButton.prototype.SetFocus = function()
{
	this.button.focus();
}

MMButton.prototype.RemoveFocus = function()
{
	this.button.blur();
}

MMButton.prototype.ForceRemoveFocus = function()
{
	if ( this.button.parentNode )
	{
		this.button.blur();
	}

	this.Event_Blur_LowLevel();
}

MMButton.prototype.RemoveKeyStackEntry = function()
{
	var keystackentry;

	if ( this.keystackentry )
	{
		keystackentry		= this.keystackentry;
		this.keystackentry	= null;

		KeyDownHandlerStack_Remove( keystackentry );
		this.onRemoveKeyStackEntry( keystackentry );
	}
}

MMButton.prototype.AddKeyStackEntry = function()
{
	var self = this;

	this.RemoveKeyStackEntry();

	this.keystackentry = KeyDownHandlerStack_Add();

	KeyDownHandlerStackEntry_BubbleKeyCode( this.keystackentry, 9 );
	KeyDownHandlerStackEntry_AddKeyCode( this.keystackentry, 13, function( e ) { return self.OnClick( e ); } );
	KeyDownHandlerStackEntry_AddKeyCode( this.keystackentry, 32, function( e ) { return self.OnClick( e ); } );

	this.onAddKeyStackEntry( this.keystackentry );
}

MMButton.prototype.Event_Focus = function( e )
{
	this.AddKeyStackEntry();

	this.button.classList.add( 'focus' );

	return this.onFocus( e );
}

MMButton.prototype.Event_Blur = function( e )
{
	this.Event_Blur_LowLevel();

	return this.onBlur( e );
}

MMButton.prototype.Event_Blur_LowLevel = function()
{
	this.RemoveKeyStackEntry();
	this.button.classList.remove( 'focus', 'click-focus' );
}

MMButton.prototype.OnClick = function( e )
{
	var self = this;

	if ( this.button.disabled || ( typeof this.button_click_evt !== 'function' ) )
	{
		return true;
	}

	this.SetFocus();

	this.button.className = classNameAdd( this.button, 'active' );
	this.button_click_evt( e );

	setTimeout( function() { self.button.className = classNameRemove( self.button, 'active' ); }, 100 );

	return eventPreventDefault( e );
}

MMButton.prototype.OnMouseDown = function( e )
{
	var doc, win, target;

	target = e.target || e.srcElement;

	if ( target === this.button.tooltipElement || containsChild( this.button.tooltipElement, target ) )
	{
		return true;
	}

	if ( !this.allow_middle && mouseClickType( e ) == 'MIDDLE' )
	{
		return eventPreventDefault( e );
	}
	else if ( !this.allow_right && mouseClickType( e ) == 'RIGHT' )
	{
		return eventPreventDefault( e );
	}
	else if ( this.button.disabled )
	{
		return eventPreventDefault( e );
	}

	if ( this.button.ownerDocument && this.button.ownerDocument.defaultView )
	{
		doc = this.button.ownerDocument;
		win = this.button.ownerDocument.defaultView;
	}
	else
	{
		return eventPreventDefault( e );
	}

	AddEvent( doc,	'mouseup',	this.event_mouseup );
	AddEvent( win,	'blur',		this.event_mouseup );

	this.button.classList.add( 'active', 'focus', 'click-focus' );

	this.target						= e.target ? e.target : e.srcElement;

	this.button.focus();
	doc.body.unselectable			= 'on';
	doc.onselectstart				= this.event_returnfalse;
	this.target.ondragstart			= this.event_returnfalse;

	if ( this.target.setCapture )
	{
		this.target.setCapture();
	}

	return eventPreventDefault( e );
}

MMButton.prototype.OnMouseUp = function( e )
{
	var doc, win, target, focus_element;

	if ( this.button.ownerDocument && this.button.ownerDocument.defaultView )
	{
		doc = this.button.ownerDocument;
		win = this.button.ownerDocument.defaultView;
	}
	else
	{
		return eventPreventDefault( e );
	}

	RemoveEvent( doc,	'mouseup',	this.event_mouseup );
	RemoveEvent( win,	'blur',		this.event_mouseup );

	target							= e.target ? e.target : e.srcElement;
	focus_element					= getFocusElement( doc );

	this.button.classList.remove( 'active' );

	if ( this.target != target || focus_element != this.button )
	{
		if ( focus_element === this.button )
		{
			this.button.blur();
		}

		this.button.classList.remove( 'focus', 'click-focus' );
	}

	doc.body.unselectable			= null;
	doc.onselectstart				= null;
	this.target.ondragstart			= null;

	if ( this.target.releaseCapture )
	{
		this.target.releaseCapture();
	}

	if ( e.composedPath().indexOf( this.target ) === -1 )
	{
		return;
	}

	if ( !this.allow_middle && mouseClickType( e ) == 'MIDDLE' )
	{
		return true;
	}

	if ( !this.allow_right && mouseClickType( e ) == 'RIGHT' )
	{
		return true;
	}

	if ( this.button.disabled )
	{
		return true;
	}

	return this.OnClick( e );
}

MMButton.prototype.onFocus					= function( e ) { return true; };
MMButton.prototype.onBlur					= function( e ) { return true; };
MMButton.prototype.onAddKeyStackEntry		= function( keystackentry ) { ; };
MMButton.prototype.onRemoveKeyStackEntry	= function( keystackentry ) { ; };

// MMCheckBox
////////////////////////////////////////////////////

function MMCheckBox( checked, element_parent )
{
	var self = this;

	this.element_container				= newElement( 'span', { 'class': 'mm_checkbox' },				null, element_parent );
	this.element_checkbox				= newElement( 'span', { 'class': 'mm_checkbox_container' },		null, this.element_container );
	this.element_checkbox_background	= newElement( 'span', { 'class': 'mm_checkbox_background' },	null, this.element_checkbox );
	this.element_checkbox_foreground_1	= newElement( 'span', { 'class': 'mm_checkbox_foreground_1' },	null, this.element_checkbox );
	this.element_checkbox_foreground_2	= newElement( 'span', { 'class': 'mm_checkbox_foreground_2' },	null, this.element_checkbox );
	this.element_checkbox_custom		= newElement( 'span', { 'class': 'mm_checkbox_custom' },		null, null );
	this.element_checkbox_text			= newElement( 'span', { 'class': 'mm_checkbox_text' },			null, this.element_container );

	this.visible						= true;
	this.checked						= checked ? true : false;
	this.tab_index						= 0;
	this.animation_id					= GenerateUniqueID();

	this.event_touchstart 				= function( event ) { self.Event_TouchStart( event ? event : window.event ); };
	this.event_touchend 				= function( event ) { self.Event_TouchEnd( event ? event : window.event ); };
	this.event_mousedown 				= function( event ) { self.Event_MouseDown( event ? event : window.event ); };
	this.event_mouseup 					= function( event ) { self.Event_MouseUp( event ? event : window.event ); };
	this.event_focus 					= function( event ) { self.Event_Focus( event ? event : window.event ); };
	this.event_blur 					= function( event ) { self.Event_Blur( event ? event : window.event ); };

	AddEvent( this.element_container,	'mousedown',	this.event_mousedown );
	AddEvent( this.element_container,	'touchstart',	this.event_touchstart );
	AddEvent( this.element_checkbox,	'focus',		this.event_focus );
	AddEvent( this.element_checkbox,	'blur',			this.event_blur );

	this.element_checkbox.className		= classNameReplace( this.element_checkbox, 'active', this.checked ? 'active' : '' );
	this.element_checkbox.tabIndex		= this.tab_index;
	this.element_checkbox.GetClass		= function() { return self; };

	this.keystackentry					= KeyDownHandlerStack_GenerateEntry();

	KeyDownHandlerStackEntry_BubbleKeyCode( this.keystackentry, 9 );
	KeyDownHandlerStackEntry_BubbleKeyCode( this.keystackentry, 13 );
	KeyDownHandlerStackEntry_AddKeyCode( this.keystackentry, 32, function( e ) { return self.Event_Toggle( e ); } );
}

MMCheckBox.prototype.GetContainedElement = function()
{
	return this.element_container;
}

MMCheckBox.prototype.GetContainedTextElement = function()
{
	return this.element_checkbox_text;
}

MMCheckBox.prototype.AddToParent = function( element_parent )
{
	element_parent.appendChild( this.element_container );
}

MMCheckBox.prototype.SetText = function( text )
{
	if ( !( text instanceof Node ) )
	{
		this.element_checkbox_text.textContent = text;
	}
	else
	{
		this.element_checkbox_text.innerHTML = '';
		this.element_checkbox_text.appendChild( text );
	}

	return this;
}

MMCheckBox.prototype.SetCustomContent = function( element )
{
	if ( this.element_checkbox_background.parentNode )		this.element_checkbox_background.parentNode.removeChild( this.element_checkbox_background );
	if ( this.element_checkbox_foreground_1.parentNode )	this.element_checkbox_foreground_1.parentNode.removeChild( this.element_checkbox_foreground_1 );
	if ( this.element_checkbox_foreground_2.parentNode )	this.element_checkbox_foreground_2.parentNode.removeChild( this.element_checkbox_foreground_2 );

	this.element_checkbox_custom.innerHTML = '';
	this.element_checkbox_custom.appendChild( element );
	this.element_checkbox.appendChild( this.element_checkbox_custom );

	return this;
}

MMCheckBox.prototype.RevertCustomContent = function()
{
	if ( this.element_checkbox_custom.parentNode )		this.element_checkbox_custom.parentNode.removeChild( this.element_checkbox_custom );

	this.element_checkbox.appendChild( this.element_checkbox_background );
	this.element_checkbox.appendChild( this.element_checkbox_foreground_1 );
	this.element_checkbox.appendChild( this.element_checkbox_foreground_2 );

	return this;
}

MMCheckBox.prototype.SetHoverText = function( text )
{
	this.element_checkbox.title = text;
	return this;
}

MMCheckBox.prototype.SetOnClickHandler = function( func )
{
	this.onclick = func;
	return this;
}

MMCheckBox.prototype.SetOnChangeHandler = function( func )
{
	this.onchange = func;
	return this;
}

MMCheckBox.prototype.SetOnFocusHandler = function( fn1 )
{
	this.onfocus = fn1;

	return this;
}

MMCheckBox.prototype.SetOnBlurHandler = function( fn1 )
{
	this.onblur = fn1;

	return this;
}

MMCheckBox.prototype.SetClassName = function( classname )
{
	this.element_container.className = classname;
	return this;
}

MMCheckBox.prototype.AddClassName = function( classname )
{
	this.element_container.className = classNameAdd( this.element_container, classname, false );

	return this;
}

MMCheckBox.prototype.RemoveClassName = function( classname )
{
	this.element_container.className = classNameRemove( this.element_container, classname, false );

	return this;
}

MMCheckBox.prototype.ReplaceClassName = function( classname, replacement_classname, allow_regex_in_classname )
{
	classNameReplaceIfAltered( this.element_container, classname, replacement_classname, allow_regex_in_classname );
}

MMCheckBox.prototype.GetClassName = function()
{
	return this.element_container.className;
}

MMCheckBox.prototype.SimulateClick = function( options )
{
	dispatchNewEvent_WithOptions( this.element_checkbox, 'mousedown', options );
	dispatchNewEvent_WithOptions( this.element_checkbox, 'mouseup', options );
}

MMCheckBox.prototype.SetFocus = function()
{
	this.element_checkbox.focus();
}

MMCheckBox.prototype.RemoveFocus = function()
{
	this.element_checkbox.blur();
}

MMCheckBox.prototype.ForceRemoveFocus = function()
{
	this.element_checkbox.blur();
	this.Event_Blur_LowLevel();
}

MMCheckBox.prototype.Show = function()
{
	this.visible							= true;
	this.element_container.style.display	= '';

	return this;
}

MMCheckBox.prototype.Hide = function()
{
	this.visible							= false;
	this.element_container.style.display	= 'none';

	return this;
}

MMCheckBox.prototype.Visible = function()
{
	return this.visible;
}

MMCheckBox.prototype.Enable = function()
{
	this.disabled						= false;
	this.element_checkbox.tabIndex		= this.tab_index;
	this.element_container.className	= classNameRemove( this.element_container, 'disabled' );

	this.onenable();
}

MMCheckBox.prototype.Disable = function()
{
	this.disabled						= true;
	this.element_checkbox.tabIndex		= -1;
	this.element_container.className	= classNameAdd( this.element_container, 'disabled' );

	this.ondisable();
}

MMCheckBox.prototype.Disabled = function()
{
	return this.disabled;
}

MMCheckBox.prototype.SetReadOnly = function( readonly )
{
	this.readonly = readonly ? true : false;

	if ( this.readonly )	classNameAddIfMissing( this.element_container, 'readonly' );
	else					classNameRemoveIfPresent( this.element_container, 'readonly' );
}

MMCheckBox.prototype.SetTabIndex = function( index )
{
	this.tab_index					= index;
	this.element_checkbox.tabIndex	= index;
}

MMCheckBox.prototype.GetTabIndex = function()
{
	return this.tab_index;
}

MMCheckBox.prototype.GetChecked = function()
{
	return this.checked;
}

MMCheckBox.prototype.Toggle = function()
{
	if ( !this.checked )	this.Check();
	else					this.Uncheck();
}

MMCheckBox.prototype.SetChecked = function( checked )
{
	var original_checked = this.checked;

	if ( !original_checked && checked )			this.Check();
	else if ( original_checked && !checked )	this.Uncheck();
}

MMCheckBox.prototype.Check = function()
{
	var original_checked;

	original_checked				= this.checked;
	this.checked					= true;
	this.element_checkbox.className	= classNameAdd( this.element_checkbox, 'active' );

	if ( original_checked !== this.checked )
	{
		this.onchange( true );
	}
}

MMCheckBox.prototype.Uncheck = function()
{
	var original_checked;

	original_checked				= this.checked;
	this.checked					= false;
	this.element_checkbox.className	= classNameRemove( this.element_checkbox, 'active' );

	if ( original_checked !== this.checked )
	{
		this.onchange( false );
	}
}

MMCheckBox.prototype.Event_Toggle = function( e )
{
	if ( this.disabled || this.readonly )
	{
		return true;
	}

	this.Toggle();

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

MMCheckBox.prototype.Event_TouchStart = function( e )
{
	if ( this.disabled || this.readonly )
	{
		return true;
	}

	this.touchstart_target 	= e.target || e.srcElement;

	AddEvent( document, 'touchend', this.event_touchend );

	this.SetFocus();

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

MMCheckBox.prototype.Event_TouchEnd = function( e )
{
	var target = e.target || e.srcElement;

	if ( this.touchstart_target === target && !this.disabled && !this.readonly )
	{
		this.OnClick();
	}

	RemoveEvent( document, 'touchend', this.event_touchend );

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

MMCheckBox.prototype.Event_MouseDown = function( e )
{
	var rightclick;

	if ( 'which' in e )			rightclick = ( e.which == 3 );
	else if ( 'button' in e )	rightclick = ( e.button == 2 );
	else						rightclick = false;

	if ( rightclick || this.disabled || this.readonly )
	{
		return true;
	}

	this.mousedown_target	= e.target || e.srcElement;

	AddEvent( document, 'mouseup', this.event_mouseup );

	this.SetFocus();
	this.element_checkbox.classList.add( 'click-focus' );

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

MMCheckBox.prototype.Event_MouseUp = function( e )
{
	var target = e.target || e.srcElement;

	if ( this.mousedown_target === target && !this.disabled && !this.readonly )
	{
		this.OnClick();
	}

	RemoveEvent( document, 'mouseup', this.event_mouseup );

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

MMCheckBox.prototype.Event_Focus = function( e )
{
	if ( this.disabled || this.readonly )
	{
		return this.RemoveFocus();
	}

	KeyDownHandlerStack_Remove( this.keystackentry );
	KeyDownHandlerStack_AppendEntry( this.keystackentry );

	this.element_checkbox.classList.add( 'focus' );

	return this.onfocus( e );
}

MMCheckBox.prototype.Event_Blur = function( e )
{
	this.Event_Blur_LowLevel();

	return this.onblur( e );
}

MMCheckBox.prototype.Event_Blur_LowLevel = function()
{
	KeyDownHandlerStack_Remove( this.keystackentry );

	this.element_checkbox.classList.remove( 'focus', 'click-focus' );
}

MMCheckBox.prototype.OnClick = function()
{
	if ( this.disabled || this.readonly )
	{
		return;
	}

	this.Toggle();

	if ( typeof this.onclick === 'function' )
	{
		this.onclick();
	}
}

MMCheckBox.prototype.onchange	= function( checked ) { ; };
MMCheckBox.prototype.onclick	= function() { ; };
MMCheckBox.prototype.onenable	= function() { ; };
MMCheckBox.prototype.ondisable	= function() { ; };
MMCheckBox.prototype.onfocus	= function( e ) { return true; }
MMCheckBox.prototype.onblur		= function( e ) { return true; }

// MMCheckBoxSlider
////////////////////////////////////////////////////

function MMCheckBoxSlider( checked, element_parent )
{
	MMCheckBox.call( this, checked, element_parent );

	this.SetClassName( 'mm_checkboxslider' );
}

DeriveFrom( MMCheckBox, MMCheckBoxSlider );

// MMRadioGroup
////////////////////////////////////////////////////

function MMRadioGroup()
{
	this.radio_list	= new Array();
	this.last_value	= null;
	this.onchange	= null;
}

MMRadioGroup.prototype.SetOnChangeHandler = function( func )
{
	this.onchange = func;
	return this;
}

MMRadioGroup.prototype.AddRadio = function( value, text, element_parent )
{
	var self = this;
	var radio;

	radio	= new MMRadioOption( false, element_parent );
	radio.SetText( text );
	radio.SetValue( value );
	radio.SetOnClickHandler( function() { self.OnRadioClicked( radio ); } );

	this.radio_list.push( radio );

	return radio;
}

MMRadioGroup.prototype.GetValue = function( default_value )
{
	var i, i_len;

	for ( i = 0, i_len = this.radio_list.length; i < i_len; i++ )
	{
		if ( this.radio_list[ i ].GetChecked() )
		{
			return this.radio_list[ i ].GetValue();
		}
	}

	return default_value;
}

MMRadioGroup.prototype.SetValue = function( value )
{
	var i, i_len;

	for ( i = 0, i_len = this.radio_list.length; i < i_len; i++ )
	{
		this.radio_list[ i ].SetChecked( this.radio_list[ i ].GetValue() == value ? true : false );
	}

	if ( this.last_value !== value )
	{
		this.last_value = value;

		if ( typeof this.onchange == 'function' )
		{
			this.onchange( value );
		}
	}
}

MMRadioGroup.prototype.OnRadioClicked = function( radio )
{
	this.SetValue( radio.GetValue() );
}

MMRadioGroup.prototype.RadioList_Count = function()
{
	return this.radio_list.length;
}

MMRadioGroup.prototype.RadioList_Insert = function( radio, index )
{
	index = stoi_max( stoi_def_nonneg( index, this.radio_list.length ), this.radio_list.length );
	this.radio_list.splice( index, 0, radio );
}

MMRadioGroup.prototype.RadioList_Delete = function( radio )
{
	let index = this.radio_list.indexOf( radio );

	if ( index !== -1 )
	{
		this.radio_list.splice( index, 1 );
	}
}

// MMRadioOption
////////////////////////////////////////////////////

function MMRadioOption( checked, element_parent )
{
	var self = this;

	this.value = null;

	MMCheckBox.call( this, checked, element_parent );

	KeyDownHandlerStackEntry_BubbleKeyCode( this.keystackentry, 9 );
	KeyDownHandlerStackEntry_BubbleKeyCode( this.keystackentry, 13 );
	KeyDownHandlerStackEntry_AddKeyCode( this.keystackentry, 32, function( e ) { self.OnClick(); eventStopPropagation( e ); return eventPreventDefault( e ); } );

	this.SetClassName( 'mm_radio' );
}

DeriveFrom( MMCheckBox, MMRadioOption );

MMRadioOption.prototype.SetValue = function( value )
{
	this.value = value;
	return this;
}

MMRadioOption.prototype.GetValue = function()
{
	return this.value;
}

MMRadioOption.prototype.OnClick = function()
{
	if ( this.disabled )
	{
		return;
	}

	this.Check();

	if ( typeof this.onclick === 'function' )
	{
		this.onclick();
	}
}

// MMSelect
////////////////////////////////////////////////////

function MMSelect( parent )
{
	var self = this;

	this.selectedIndex							= -1;
	this.options								= new Array();

	this.menusearch_timeout						= null;
	this.menusearch_value						= '';
	this.menusearch_cycle_enabled				= true;
	this.menusearch_cycle_char					= '';
	this.menusearch_cycle_index					= -1;

	this.loaded									= false;
	this.loading								= false;
	this.deferred_selection						= null;

	this.func_load								= null;
	this.func_populate							= null;
	this.func_onloadcomplete					= null;

	this.flag_selectone							= false;
	this.text_selectone							= '<Select One>';
	this.value_selectone						= 0;
	this.element_selectone						= null;

	this.menubutton								= new MMMenuButton( '', typeof parent === 'string' ? document.getElementById( parent ) : parent );
	this.menubutton.onSetInvalid				= function() { self.onSetInvalid(); };
	this.menubutton.onClearInvalid				= function() { self.onClearInvalid(); };
	this.menubutton.onaftermenushow				= function() { self.ScrollToSelection(); };
	this.menubutton.SetAnimateMenu( true );
	this.menubutton.SetMenuAsRootMenu( true );
	this.menubutton.SetMenuAsRootMenu_MatchButtonWidth( true, true );
	this.menubutton.SetClassName( 'mm_select_common' );
	this.menubutton.SetMenuClassName( 'mm_select_common_menu root' );
	this.menubutton.SetButtonClassName( 'mm_select_common_button' );

	this.menubutton.onButtonAddKeyStackEntry	= function( keystackentry )
	{
		KeyDownHandlerStackEntry_BubbleKeyCode( keystackentry, 13 );
		KeyDownHandlerStackEntry_AddKeyCode( keystackentry, 32,		function( e ) { return self.Event_OnKeyDown_Select( e ); } );
		KeyDownHandlerStackEntry_AddKeyCode( keystackentry, '*',	function( e ) { return self.Event_OnKeyDown_Select( e ); } );
	}

	this.menubutton.onAddKeyStackEntry			= function( keystackentry )
	{
		KeyDownHandlerStackEntry_AddKeyCode( keystackentry, 32,		function( e ) { return self.Event_OnKeyDown_Select( e ); } );
		KeyDownHandlerStackEntry_AddKeyCode( keystackentry, '*',	function( e ) { return self.Event_OnKeyDown_Select( e ); } );
	};
}

MMSelect.prototype.Container = function()
{
	return this.menubutton.Container();
}

MMSelect.prototype.ContainedMenuButton = function()
{
	return this.menubutton;
}

MMSelect.prototype.ContainedButton = function()
{
	return this.menubutton.ContainedButton();
}

MMSelect.prototype.SetTitle = function( text )
{
	this.menubutton.SetTitle( text );
	return this;
}

MMSelect.prototype.SetToolTip = function( node_or_text )
{
	this.menubutton.SetToolTip( node_or_text );
	return this;
}

MMSelect.prototype.SetClassName = function( classname )
{
	this.menubutton.SetClassName( classname );
	return this;
}

MMSelect.prototype.AddClassName = function( classname )
{
	this.menubutton.AddClassName( classname );
	return this;
}

MMSelect.prototype.RemoveClassName = function( classname, allow_regex_in_classname )
{
	this.menubutton.RemoveClassName( classname, allow_regex_in_classname );
	return this;
}

MMSelect.prototype.GetClassName = function()
{
	return this.menubutton.GetClassName();
}

MMSelect.prototype.SetMenuClassName = function( classname )
{
	this.menubutton.SetMenuClassName( classname );
	return this;
}

MMSelect.prototype.AddMenuClassName = function( classname )
{
	this.menubutton.AddMenuClassName( classname );
	return this;
}

MMSelect.prototype.RemoveMenuClassName = function( classname, allow_regex_in_classname )
{
	this.menubutton.RemoveMenuClassName( classname, allow_regex_in_classname );
	return this;
}

MMSelect.prototype.GetMenuClassName = function()
{
	return this.menubutton.GetMenuClassName();
}

MMSelect.prototype.SetErrorClassName = function( classname )
{
	this.menubutton.SetErrorClassName( classname );
	return this;
}

MMSelect.prototype.AddErrorClassName = function( classname )
{
	this.menubutton.AddErrorClassName( classname );
	return this;
}

MMSelect.prototype.RemoveErrorClassName = function( classname, allow_regex_in_classname )
{
	this.menubutton.RemoveErrorClassName( classname, allow_regex_in_classname );
	return this;
}

MMSelect.prototype.GetErrorClassName = function()
{
	return this.menubutton.GetErrorClassName();
}

MMSelect.prototype.SetButtonClassName = function( classname )
{
	this.menubutton.SetButtonClassName( classname );
	return this;
}

MMSelect.prototype.AddButtonClassName = function( classname )
{
	this.menubutton.AddButtonClassName( classname );
	return this;
}

MMSelect.prototype.RemoveButtonClassName = function( classname, allow_regex_in_classname )
{
	this.menubutton.RemoveButtonClassName( classname, allow_regex_in_classname );
	return this;
}

MMSelect.prototype.GetButtonClassName = function()
{
	return this.menubutton.GetButtonClassName();
}

MMSelect.prototype.ButtonClassNameContains = function( classname, allow_regex_in_classname )
{
	return this.menubutton.ButtonClassNameContains( classname, allow_regex_in_classname );
}

MMSelect.prototype.SetHoverText = function( hover_text )
{
	this.menubutton.ContainedButton().SetHoverText( hover_text );
	return this;
}

MMSelect.prototype.SetTabIndex = function( index )
{
	this.menubutton.SetTabIndex( index );
}

MMSelect.prototype.GetTabIndex = function()
{
	return this.tab_index;
}

MMSelect.prototype.SetLoadFunction = function( func )
{
	this.func_load = func;
	return this;
}

MMSelect.prototype.SetOnLoadCompleteHandler = function( func )
{
	this.func_onloadcomplete = func;
	return this;
}

MMSelect.prototype.SetPopulateFunction = function( func )
{
	this.func_populate = func;
	return this;
}

MMSelect.prototype.SetOnChangeHandler = function( func )
{
	this.onchange = func;
	return this;
}

MMSelect.prototype.SetSelectOne = function( flag, text, value, element )
{
	if ( !stob( flag ) )	this.flag_selectone = false;
	else					this.InsertOptionLowLevel( text, value, -1, { selectone: true, element } );

	return this;
}

MMSelect.prototype.Feature_Dropdown_Enable = function( padding_right )
{
	this.menubutton.Feature_Dropdown_Enable( padding_right );

	return this;
}

MMSelect.prototype.SetMenuAsRootMenu = function( enabled, match_width, grow_menu_left )
{
	this.menubutton.SetMenuAsRootMenu( enabled, match_width, grow_menu_left );

	return this;
}

MMSelect.prototype.SetMenuAsRootMenu_MatchButtonWidth = function( enabled, match_as_min_width )
{
	this.menubutton.SetMenuAsRootMenu_MatchButtonWidth( enabled, match_as_min_width );

	return this;
}

MMSelect.prototype.SetMenuAsRootMenu_AutosizesFromRight = function( enabled )
{
	this.menubutton.SetMenuAsRootMenu_AutosizesFromRight( enabled );

	return this;
}

MMSelect.prototype.SetMenuAsRootMenu_MenuDrawsAsSideMenu = function( enabled, /* optional parameters */ margin_top, margin_right, margin_bottom, margin_left )
{
	this.menubutton.SetMenuAsRootMenu_MenuDrawsAsSideMenu( enabled, /* optional parameters */ margin_top, margin_right, margin_bottom, margin_left );

	return this;
}

MMSelect.prototype.SetCustomDropdown = function( element )
{
	this.menubutton.SetCustomDropdown( element );

	return this;
}

MMSelect.prototype.Focus = function()
{
	this.menubutton.Focus();
}

MMSelect.prototype.Blur = function()
{
	this.menubutton.ContainedButton().RemoveFocus();
}

MMSelect.prototype.Enable = function()
{
	this.menubutton.ContainedButton().Enable();
}

MMSelect.prototype.Disable = function()
{
	this.menubutton.ContainedButton().Disable();
}

MMSelect.prototype.IsEnabled = function()
{
	this.menubutton.IsEnabled();
}

MMSelect.prototype.Hide = function()
{
	this.menubutton.Hide();
}

MMSelect.prototype.Show = function()
{
	this.menubutton.Show();
}

MMSelect.prototype.SetInvalid = function( error_message )
{
	this.menubutton.SetInvalid( error_message );
}

MMSelect.prototype.ClearInvalid = function()
{
	this.menubutton.ClearInvalid();
}

MMSelect.prototype.GetInvalid = function()
{
	return this.menubutton.GetInvalid();
}

MMSelect.prototype.GetInvalid_Message = function()
{
	return this.menubutton.GetInvalid_Message();
}

MMSelect.prototype.Empty = function()
{
	this.options = new Array();
	this.menubutton.Menu_Empty();
	this.SetSelectedIndex( -1 );
}

MMSelect.prototype.AddOption = function( text, value, options )
{
	//
	// The original parameters of this function were "text, value, option_display_element".
	// In order to simplify this and to support the addition of new optional configuration parameters,
	// the parameters have been altered to "text, value, options". We must still support the original
	// parameters to avoid breaking existing code. Since JavaScript does not support function
	// overloading, we must conditionally check the argument type to determine whether someone is
	// using legacy parameters or our new object-based version.
	//
	// Do not remove the legacy code path mapping.
	//

	if ( arguments[ 2 ] instanceof Node )	return this.InsertOptionLowLevel( text, value, -1, { element: arguments[ 2 ] } ); // Legacy
	else									return this.InsertOptionLowLevel( text, value, -1, options );
}

MMSelect.prototype.InsertOption = function( text, value, index, options )
{
	//
	// The original parameters of this function were "text, value, option_display_element, index".
	// In order to simplify this and to support the addition of new optional configuration parameters,
	// the parameters have been altered to "text, value, index, options". We must still support the
	// original parameters to avoid breaking existing code. Since JavaScript does not support function
	// overloading, we must conditionally check the argument type to determine whether someone is
	// using legacy parameters or our new object-based version.
	//
	// Do not remove the legacy code path mapping.
	//

	if ( ( arguments[ 2 ] instanceof Node ) || ( typeof arguments[ 3 ] === 'number' ) )	return this.InsertOptionLowLevel( text, value, arguments[ 3 ], { element: arguments[ 2 ] } ); // Legacy
	else																				return this.InsertOptionLowLevel( text, value, index, options );
}

MMSelect.prototype.InsertOptionLowLevel = function( text, value, index, { element = null, selected = false, selectone = false, prevent_selection = false, callback = ( event, option ) => { this.SetValue( value ); } } = {} )
{
	var option;

	index						= stoi_max( stoi_def_nonneg( index, this.options.length ), this.options.length );

	if ( selectone )
	{
		this.flag_selectone	= true;
		
		if ( typeof text !== 'undefined' )	this.text_selectone		= text;
		else								text					= this.text_selectone;

		if ( typeof value !== 'undefined' )	this.value_selectone	= value;
		else								value					= this.value_selectone;

		this.element_selectone	= element;
	}

	option						= new Object();
	option.text					= text;
	option.value				= value;
	option.element				= element;
	option.prevent_selection	= prevent_selection; // Allows the option to be clicked, but the option cannot be set as the selected option (ie, it will never be set as the selectedIndex)
	option.menu_option			= new MMMenuButton_Item( null, element ? element : option.text, callback, option.value );

	this.menubutton.MenuItem_Insert( option.menu_option, index );
	this.options.splice( index, 0, option );

	if ( this.selectedIndex >= index && index !== this.options.length - 1 )
	{
		this.selectedIndex++;
	}
	else if ( this.selectedIndex === index && index === this.options.length - 1 && !prevent_selection )
	{
		this.SetSelectedIndex( index );
	}
	else if ( this.selectedIndex === -1 && !prevent_selection && ( ( typeof this.func_load !== 'function' ) || ( ( typeof this.func_load === 'function' ) && this.loaded ) ) )
	{
		this.SetSelectedIndex( index );
	}

	if ( !prevent_selection && selected )
	{
		this.SetSelectedIndex( index );
	}

	return option;
}

MMSelect.prototype.RemoveOption = function( value_or_option, value_if_selected )
{
	var i, i_len;

	for ( i = 0, i_len = this.options.length; i < i_len; i++ )
	{
		if ( this.options[ i ] === value_or_option || this.options[ i ].value === value_or_option )
		{
			this.menubutton.MenuItem_Delete( this.options[ i ].menu_option );
			this.options.splice( i, 1 );

			if ( this.selectedIndex === i )
			{
				if ( typeof value_if_selected !== 'undefined' && value_if_selected !== null )	this.SetValue( value_if_selected );
				else																			this.SetSelectedIndex( 0 );
			}
			else if ( this.selectedIndex > i )
			{
				this.selectedIndex--;
			}

			break;
		}
	}
}

MMSelect.prototype.DisableOption = function( value, value_if_selected )
{
	var i, i_len;

	for ( i = 0, i_len = this.options.length; i < i_len; i++ )
	{
		if ( this.options[ i ].value === value )
		{
			if ( this.selectedIndex === i )
			{
				this.SetValue( value_if_selected );
			}

			this.options[ i ].menu_option.Disable();
		}
	}
}

MMSelect.prototype.DisableOptionAtIndex = function( index, value_if_selected )
{
	if ( this.options.length > index && this.options[ index ] )
	{
		if ( this.selectedIndex === index )
		{
			this.SetValue( value_if_selected );
		}

		this.options[ index ].menu_option.Disable();
	}
}

MMSelect.prototype.EnableOption = function( value )
{
	var i, i_len;

	for ( i = 0, i_len = this.options.length; i < i_len; i++ )
	{
		if ( this.options[ i ].value === value )
		{
			this.options[ i ].menu_option.Enable();
		}
	}
}

MMSelect.prototype.EnableOptionAtIndex = function( index )
{
	if ( this.options.length > index && this.options[ index ] )
	{
		this.options[ index ].menu_option.Enable();
	}
}

MMSelect.prototype.SetLoading = function()
{
	this.Empty();
	this.AddOption( 'Loading...', 0 );
	this.SetSelectedIndex( 0 );
	this.Disable();
}

MMSelect.prototype.Load = function( params )
{
	var self = this;

	if ( typeof this.func_load !== 'function' )
	{
		return;
	}

	this.loaded		= false;
	this.loading	= true;

	if ( ( this.deferred_selection === null ) && this.selectedIndex >= 0 && ( option = this.GetOptionAtIndex( this.selectedIndex ) ) !== null )
	{
		this.deferred_selection	= option.value;
	}

	this.SetLoading();
	this.func_load( params, function( response ) { self.Load_Callback( response ); } );
}

MMSelect.prototype.Load_Callback = function( response )
{
	var i, i_len, original_index;

	this.Empty();

	if ( !response.success )
	{
		this.loaded		= true;
		this.loading	= false;

		this.AddOption( response.error_code + ': ' + response.error_message, 0 );

		return;
	}

	original_index = this.selectedIndex;

	this.Enable();

	if ( this.flag_selectone )
	{
		this.AddOption( this.text_selectone, this.value_selectone, { element: this.element_selectone } );
	}

	if ( response.data && ( typeof this.func_populate == 'function' ) )
	{
		if ( response.data instanceof Array )
		{
			for ( i = 0, i_len = response.data.length; i < i_len; i++ )
			{
				this.func_populate( response.data[ i ] );
			}
		}
		else if ( response.data.data && response.data.data instanceof Array )
		{
			for ( i = 0, i_len = response.data.data.length; i < i_len; i++ )
			{
				this.func_populate( response.data.data[ i ] );
			}
		}
		else
		{
			this.func_populate( response.data );
		}
	}

	this.loaded		= true;
	this.loading	= false;

	if ( this.deferred_selection !== null )
	{
		this.SetValue( this.deferred_selection );
		this.deferred_selection	= null;
	}
	else
	{
		if ( this.selectedIndex === -1 )
		{
			const first_selectable_index = this.options.findIndex( option => !option.prevent_selection && !option.menu_option.Disabled() );

			if ( first_selectable_index !== -1 )
			{
				this.SetSelectedIndex( first_selectable_index );
			}
		}

		if ( original_index !== this.selectedIndex )
		{
			this.Change( this.GetValue( null ) );
		}
	}

	if ( typeof this.func_onloadcomplete === 'function' )
	{
		//
		// onloadcomplete function has access to response in case we want to determine whether
		// there was an error, or if we need to know if any results were actually returned.
		//

		this.func_onloadcomplete( response );
	}
}

MMSelect.prototype.SetValue = function( value )
{
	var i, i_len, original_index;

	if ( ( typeof this.func_load === 'function' ) && !this.loaded )
	{
		this.deferred_selection = value;
		return;
	}

	original_index = this.selectedIndex;

	this.SetSelectedIndex( -1 );

	for ( i = 0, i_len = this.options.length; i < i_len; i++ )
	{
		if ( this.options[ i ].prevent_selection )
		{
			continue;
		}
		else if ( this.options[ i ].value === value )
		{
			this.SetSelectedIndex( i );
			break;
		}
		else if ( ( typeof value === 'string' && typeof this.options[ i ].value === 'number' ) ||
				  ( typeof value === 'number' && typeof this.options[ i ].value === 'string' ) )
		{
			if ( this.options[ i ].value.toString() === value.toString() )
			{
				this.SetSelectedIndex( i );
				break;
			}
		}
	}

	if ( original_index !== this.selectedIndex )
	{
		this.Change( this.GetValue( null ) );
	}
}

MMSelect.prototype.GetValue = function( default_value )
{
	var option;

	if ( this.loading || this.selectedIndex === -1 || ( option = this.GetOptionAtIndex( this.selectedIndex ) ) === null || option.prevent_selection )
	{
		return default_value;
	}

	return option.value;
}

MMSelect.prototype.GetOption = function()
{
	var option;

	if ( this.loading || this.selectedIndex === -1 || ( option = this.GetOptionAtIndex( this.selectedIndex ) ) === null || option.prevent_selection )
	{
		return null;
	}

	return option;
}

MMSelect.prototype.GetText = function( default_text )
{
	var option;

	if ( this.loading || this.selectedIndex === -1 || ( option = this.GetOptionAtIndex( this.selectedIndex ) ) === null || option.prevent_selection )
	{
		return default_value;
	}

	return option.text;
}

MMSelect.prototype.GetSelectedIndex = function()
{
	return this.selectedIndex;
}

MMSelect.prototype.SetSelectedIndex = function( index )
{
	var option;

	if ( this.selectedIndex !== -1 && ( option = this.GetOptionAtIndex( this.selectedIndex ) ) !== null )
	{
		option.menu_option.RemoveClassName( 'selected_option' );
	}

	if ( ( ( option = this.GetOptionAtIndex( index ) ) !== null ) && !option.prevent_selection )
	{
		this.selectedIndex = index;

		if ( option.element )	this.menubutton.ContainedButton().SetText( option.element.cloneNode( true ) );
		else					this.menubutton.ContainedButton().SetText( option.text );

		if ( !this.flag_selectone || ( option.value !== this.value_selectone ) )
		{
			option.menu_option.AddClassName( 'selected_option' );
		}
	}
	else
	{
		this.selectedIndex = -1;
		this.menubutton.ContainedButton().SetText( '' );
	}
}

MMSelect.prototype.GetOptionCount = function()
{
	return this.options.length;
}

MMSelect.prototype.GetOptionWithValue = function( value )
{
	var i, i_len;

	for ( i = 0, i_len = this.options.length; i < i_len; i++ )
	{
		if ( this.options[ i ].value == value )
		{
			return this.options[ i ];
		}
	}

	return null;
}

MMSelect.prototype.GetOptionAtIndex = function( index )
{
	if ( this.options.length > index && this.options[ index ] )
	{
		return this.options[ index ];
	}

	return null;
}

MMSelect.prototype.GetValueAtIndex = function( index )
{
	if ( this.options.length > index && this.options[ index ] )
	{
		return this.options[ index ].value;
	}

	return null;
}

MMSelect.prototype.OptionList_Map = function( callback )
{
	this.menubutton.MenuItemList_Map( callback )
}

MMSelect.prototype.ScrollToSelection = function()
{
	var rect, option, element, rect_parent, element_parent;

	if ( this.loading || this.selectedIndex === -1 || ( option = this.GetOptionAtIndex( this.selectedIndex ) ) === null )
	{
		return;
	}

	element							= option.menu_option.ContainedElement();
	element_parent					= element.parentNode;

	rect							= element.getBoundingClientRect();
	rect_parent						= element_parent.getBoundingClientRect();

	if ( rect.top < rect_parent.top || rect.bottom > rect_parent.bottom )
	{
		element_parent.scrollTop	= ( element.offsetTop - ( rect_parent.height / 2 ) ) + ( rect.height / 2 );
	}
}

MMSelect.prototype.Event_OnKeyDown_Select = function( e )
{
	var self = this;
	var i, i_len, keycode, character, match_found, search_option, original_index, search_options;

	keycode			= e.keyCode || e.which;
	character		= e.key.toLowerCase();
	match_found		= false;
	original_index	= this.selectedIndex;

	if ( keycode === 27 )
	{
		if ( this.menubutton.menu_visible )	this.menubutton.Menu_Hide();
		else								this.menubutton.ContainedButton().RemoveFocus();

		eventStopPropagation( e );
		return eventPreventDefault( e );
	}

	if ( character.length !== 1 )
	{
		return true;
	}

	if ( keycode === 32 && this.menusearch_value.length === 0 )
	{
		this.menubutton.Menu_Toggle();

		eventStopPropagation( e );
		return eventPreventDefault( e );
	}

	if ( this.menusearch_cycle_enabled )
	{
		if ( this.menusearch_cycle_char === '' )
		{
			this.menusearch_cycle_index	= -1;
			this.menusearch_cycle_char	= character;
		}
		else if ( character !== this.menusearch_cycle_char )
		{
			this.menusearch_cycle_enabled = false;
		}
	}

	this.menusearch_value 	+= character;
	search_options			= new Array();

	for ( i = 0, i_len = this.options.length; i < i_len; i++ )
	{
		if ( !this.options[ i ].menu_option.Selectable() ||
			 !this.options[ i ].menu_option.Visible() ||
			 this.options[ i ].prevent_selection )
		{
			continue;
		}

		search_option		= new Object();
		search_option.index	= i;
		search_option.text	= this.options[ i ].text;

		search_options.push( search_option );
	}

	if ( this.menusearch_value.length > 1 )
	{
		for ( i = 0, i_len = search_options.length; i < i_len; i++ )
		{
			if ( search_options[ i ].text.toLowerCase().indexOf( this.menusearch_value ) === 0 )
			{
				match_found = true;
				this.menusearch_cycle_index = i;
				this.SetSelectedIndex( search_options[ i ].index );
				this.menubutton.Select_Item( search_options[ i ].index, true );

				break;
			}
		}
	}

	if ( !match_found && this.menusearch_cycle_enabled )
	{
		for ( i = this.menusearch_cycle_index + 1, i_len = search_options.length; i < i_len; i++ )
		{
			if ( search_options[ i ].text.toLowerCase().indexOf( this.menusearch_cycle_char ) === 0 )
			{
				match_found = true;
				this.menusearch_cycle_index = i;
				this.SetSelectedIndex( search_options[ i ].index );
				this.menubutton.Select_Item( search_options[ i ].index, true );

				break;
			}
		}

		if ( !match_found )
		{
			this.menusearch_cycle_index = -1;

			for ( i = this.menusearch_cycle_index + 1, i_len = search_options.length; i < i_len; i++ )
			{
				if ( search_options[ i ].text.toLowerCase().indexOf( this.menusearch_cycle_char ) === 0 )
				{
					match_found = true;
					this.menusearch_cycle_index = i;
					this.SetSelectedIndex( search_options[ i ].index );
					this.menubutton.Select_Item( search_options[ i ].index, true );

					break;
				}
			}
		}
	}

	if ( this.menusearch_timeout )
	{
		clearTimeout( this.menusearch_timeout );
		this.menusearch_timeout = null;
	}

	this.menusearch_timeout = setTimeout( function()
	{
		self.menusearch_value			= '';
		self.menusearch_cycle_enabled	= true;
		self.menusearch_cycle_char		= '';
		self.menusearch_cycle_index		= -1;
	}, 1000 );

	if ( original_index !== this.selectedIndex )
	{
		this.Change( this.GetValue( null ) );
	}

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

MMSelect.prototype.Validate_ValueSelected = function()
{
	var error = new Object();

	if ( !this.Validate_ValueSelected_Silent( error ) )
	{
		this.SetInvalid( error.error_message );
		this.Focus();

		return false;
	}

	return true;
}

MMSelect.prototype.Validate_ValueSelected_Silent = function( error /* optional */ )
{
	var value = this.GetValue( null );

	if ( this.loading || value === null || ( this.flag_selectone && value === this.value_selectone ) )
	{
		if ( getVariableType( error ) === 'object' )
		{
			error.error_message = 'Please select a value';
		}

		return false;
	}

	return true;
}

MMSelect.prototype.Change = function( value )
{
	this.ClearInvalid();
	this.onchange( value );
}

MMSelect.prototype.onchange			= function( value ) { ; };
MMSelect.prototype.onSetInvalid		= function() { ; };
MMSelect.prototype.onClearInvalid	= function() { ; };

// MMInput
////////////////////////////////////////////////////

function MMInput( parent, name, value )
{
	this.visible								= true;
	this.disabled								= false;
	this.readonly								= false;
	this.select_on_focus						= false;
	this.autosize_enabled						= false;
	this.invalid								= false;
	this.invalid_error_message					= '';
	this.error_visible							= false;
	this.error_match_container_width			= false;
	this.focused								= false;
	this.keystackentry							= null;
	this.value									= typeof value === 'string' ? value : '';
	this.last_validated_value					= this.value;
	this.last_container_top						= null;
	this.last_container_left					= null;
	this.last_window_y							= null;
	this.last_window_x							= null;
	this.tab_index								= 0;

	this.element_parent							= typeof parent === 'string' ? document.getElementById( parent ) : parent;
	this.element_container						= newElement( 'span', 	{ 'class': 'mm_input_common', 'data-mm-input': '' }, 		null, this.element_parent );
	this.element_title							= newElement( 'span', 	{ 'class': 'mm_input_title' },		 						null, this.element_container );
	this.element_title_text						= newElement( 'span', 	{ 'class': 'mm_input_title_text' },							null, this.element_title );
	this.element_title_tooltip					= newElement( 'span', 	{ 'class': 'mm_input_title_tooltip' }, 						null, this.element_title );
	this.element_prefix							= newElement( 'span', 	{ 'class': 'mm_input_prefix' },		 						null, this.element_container );
	this.element_input							= this.Create_Input( name, this.element_container );
	this.element_label							= newElement( 'span', 	{ 'class': 'mm_input_label' },		 						null, this.element_container );
	this.element_error_icon						= newElement( 'span', 	{ 'class': 'mm_input_error_icon' },	 						null, this.element_container );
	this.element_error_container				= newElement( 'span',	{ 'class': 'mm_input_error_container', 'popover': '' },		null, this.element_container );
	this.element_error_message					= newElement( 'span',	{ 'class': 'mm_input_error_message' },						null, this.element_error_container );
	this.element_error_tail						= newElement( 'span',	{ 'class': 'mm_input_error_tail' },							null, this.element_error_container );

	this.element_error_icon.innerHTML			= MivaSVGIconMap( 'field-warning-icon' );
	this.element_input.tabIndex					= this.tab_index;

	this.event_render_autosize					= () => { this.Render_AutoSize(); this.render_autosize_id = requestAnimationFrame( this.event_render_autosize ); };
	this.event_render_error						= () => { this.Render_Error(); this.render_error_id = requestAnimationFrame( this.event_render_error ); };
	this.event_mouseover_container				= () => { this.Show_Error(); }
	this.event_mouseout_container				= () => { this.Hide_Error(); }

	this.element_container.addEventListener( 		'mousedown',	( e ) => { this.Event_OnMouseDown_Container( e ? e : window.e ); } );
	this.element_input.addEventListener( 			'focus',		( e ) => { this.Event_OnFocus_Input( e ? e : window.e ); } );
	this.element_input.addEventListener( 			'blur',			( e ) => { this.Event_OnBlur_Input( e ? e : window.e ); } );
	this.element_input.addEventListener( 			'change',		( e ) => { this.Event_OnChange_Input( e ? e : window.e ); } );
	this.element_input.addEventListener(			'input',		( e ) => { this.Event_OnInput_Input( e ? e : window.e ); } );
	this.element_input.addEventListener( 			'keydown',		( e ) => { this.Event_OnKeyDown_Input( e ? e : window.e ); } );
	this.element_input.addEventListener( 			'keyup',		( e ) => { this.Event_OnKeyUp_Input( e ? e : window.e ); } );
	this.element_input.addEventListener( 			'cut',			( e ) => { this.Event_OnCut_Input( e ? e : window.e ); } );
	this.element_input.addEventListener( 			'paste',		( e ) => { this.Event_OnPaste_Input( e ? e : window.e ); } );
	this.element_error_container.addEventListener(  'toggle',		( e ) => { this.Event_OnToggle_ErrorContainer( e ? e : window.e ); } );

	this.SetValue( this.value );
}

MMInput.prototype.Create_Input = function( name, parent )
{
	return newElement( 'input',	{ 'class': 'mm_input', 'name': name, 'type': 'text' }, null, parent );
}

MMInput.prototype.CreateToolTipMenuButton = function()
{
	if ( this.tooltip )
	{
		return;
	}

	this.tooltip = newElement( 'mm-tooltip', null, null, this.element_title_tooltip );
}

MMInput.prototype.AddToParent = function( element_parent )
{
	this.element_parent = element_parent;
	this.element_parent.appendChild( this.element_container );
}

MMInput.prototype.SetAutoComplete = function( value )
{
	if ( typeof value === 'boolean' || typeof value === 'numeric' )		this.element_input.setAttribute( 'autocomplete', value ? 'on' : 'off' );
	else if ( typeof value === 'string' )								this.element_input.setAttribute( 'autocomplete', value );
	else																this.element_input.removeAttribute( 'autocomplete' );
}

MMInput.prototype.SetAutoSize = function( enabled, min_width, max_width, extra_padding )
{
	this.autosize_enabled					= stob( enabled );

	if ( !this.autosize_enabled )
	{
		cancelAnimationFrame( window[ this.render_autosize_id ] );
		this.autosize_observer?.disconnect?.();
	}
	else
	{
		this.autosize_min_width				= stoi_min( min_width, 20 );
		this.autosize_max_width				= stoi_def_nonneg( max_width, 0 );
		this.autosize_extra_padding			= stoi_def_nonneg( extra_padding, 0 );
		this.element_container.style.width	= 'auto';
		this.render_autosize_id				= requestAnimationFrame( this.event_render_autosize );

		this.autosize_observer				= new IntersectionObserver( ( entries, observer ) => {
			entries.forEach( entry =>
			{
				if ( entry.isIntersecting )
				{
					this.CalculateAutoSize();
				}
			} );
		} );

		this.autosize_observer.observe( this.element_container );
		this.CalculateAutoSize();
	}
}

MMInput.prototype.SetTitle = function( text )
{
	this.element_title_text.textContent = text;

	return this;
}

MMInput.prototype.SetToolTip = function( node_or_text )
{
	this.CreateToolTipMenuButton();

	if ( typeof node_or_text !== 'string' )	this.tooltip.tooltip_custom	= node_or_text;
	else									this.tooltip.tooltip		= node_or_text;

	return this;
}

MMInput.prototype.SetPrefix = function( prefix )
{
	this.element_prefix.textContent = prefix;

	return this;
}

MMInput.prototype.SetLabel = function( label )
{
	this.element_label.textContent = label;

	return this;
}

MMInput.prototype.SetName = function( name )
{
	this.element_input.name = name;
}

MMInput.prototype.SetType = function( type )
{
	this.element_input.type = type;

	if ( type === 'number' && !this.element_input.hasAttribute( 'step' ) )
	{
		this.element_input.setAttribute( 'step', 'any' );
	}
}

MMInput.prototype.SetPlaceholderText = function( text )
{
	this.element_input.setAttribute( 'placeholder', text );

	return this;
}

MMInput.prototype.SetClassName = function( classname )
{
	this.element_container.className = classname;

	return this;
}

MMInput.prototype.AddClassName = function( classname )
{
	classNameAddIfMissing( this.element_container, classname );

	return this;
}

MMInput.prototype.RemoveClassName = function( classname, allow_regex_in_classname )
{
	classNameRemoveIfPresent( this.element_container, classname, allow_regex_in_classname );

	return this;
}

MMInput.prototype.ReplaceClassName = function( classname, replacement_classname, allow_regex_in_classname )
{
	classNameReplaceIfAltered( this.element_container, classname, replacement_classname, allow_regex_in_classname );
}

MMInput.prototype.ClassNameContains = function( classname, allow_regex_in_classname )
{
	return classNameContains( this.element_container, classname, allow_regex_in_classname );
}

MMInput.prototype.GetClassName = function()
{
	return this.element_container.className;
}

MMInput.prototype.SetErrorMessageMatchContainerWidth = function( match_width )
{
	this.error_match_container_width = match_width;

	return this;
}

MMInput.prototype.SetErrorClassName = function( classname )
{
	this.element_error_container.className = classname;

	return this;
}

MMInput.prototype.GetErrorClassName = function()
{
	return this.element_error_container.className;
}

MMInput.prototype.SetOnFocusHandler = function( fn1 )
{
	this.onFocus = fn1;

	return this;
}

MMInput.prototype.SetOnBlurHandler = function( fn1 )
{
	this.onBlur = fn1;

	return this;
}

MMInput.prototype.SetOnChangeHandler = function( fn1 )
{
	this.onChange = fn1;

	return this;
}

MMInput.prototype.SetOnValidateHandler = function( fn1 )
{
	this.onValidate = fn1;

	return this;
}

MMInput.prototype.SetOnEnterHandler = function( fn1 )
{
	this.onEnter = fn1;

	return this;
}

MMInput.prototype.SetOnEscapeHandler = function( fn1 )
{
	this.onEsc = fn1;

	return this;
}

MMInput.prototype.SetMaxLength = function( length )
{
	this.element_input.setAttribute( 'maxlength', length );
	return this;
}

MMInput.prototype.Enable = function()
{
	this.disabled						= false;
	this.element_container.className	= classNameRemove( this.element_container, 'disabled' );
	this.element_input.tabIndex			= this.tab_index;
}

MMInput.prototype.Disable = function()
{
	var focus_element = getFocusElement();

	this.disabled						= true;
	this.element_container.className	= classNameAdd( this.element_container, 'disabled' );
	this.element_input.tabIndex			= -1;

	if ( focus_element === this.element_container || containsChild( this.element_container, focus_element ) )
	{
		focus_element.blur();
	}

	this.ClearInvalid();
}

MMInput.prototype.IsEnabled = function()
{
	return !this.disabled;
}

MMInput.prototype.SetReadOnly = function( readonly )
{
	this.readonly = readonly ? true : false;

	if ( this.readonly )
	{
		this.element_input.setAttribute( 'readonly', true );
		classNameAddIfMissing( this.element_container, 'readonly' );
	}
	else
	{
		this.element_input.removeAttribute( 'readonly' );
		classNameRemoveIfPresent( this.element_container, 'readonly' );
	}
}

MMInput.prototype.GetReadOnly = function()
{
	return this.readonly;
}

MMInput.prototype.SetTabIndex = function( index )
{
	this.tab_index				= index;
	this.element_input.tabIndex	= index;
}

MMInput.prototype.GetTabIndex = function()
{
	return this.tab_index;
}

MMInput.prototype.SetSelectOnFocus = function( select_on_focus )
{
	this.select_on_focus = select_on_focus ? true : false;
}

MMInput.prototype.Show = function()
{
	this.visible							= true;
	this.element_container.style.display	= '';
}

MMInput.prototype.Hide = function()
{
	this.visible							= false;
	this.element_container.style.display	= 'none';
}

MMInput.prototype.Focus = function()
{
	if ( this.disabled )
	{
		return;
	}

	this.element_input.focus();
}

MMInput.prototype.Blur = function()
{
	var focus_element;

	if ( this.element_input.ownerDocument )
	{
		focus_element = getFocusElement( this.element_input.ownerDocument );

		if ( focus_element === this.element_input )
		{
			this.element_input.blur();
		}
	}
}

MMInput.prototype.HasFocus = function()
{
	return !this.disabled && this.focused;
}

MMInput.prototype.Select = function()
{
	this.element_input.focus();
	this.element_input.select();
}

MMInput.prototype.SetInvalid = function( error_message )
{
	this.invalid_error_message = error_message;
	
	this.element_container.removeEventListener( 'mouseover',	this.event_mouseover_container, false );
	this.element_container.removeEventListener( 'mouseout',		this.event_mouseout_container, false );

	if ( this.invalid )
	{
		if ( typeof error_message === 'string' && error_message.length && error_message !== this.element_error_message.textContent )
		{
			this.element_error_message.textContent = error_message;

			this.element_container.addEventListener( 'mouseover',		this.event_mouseover_container, false );
			this.element_container.addEventListener( 'mouseout',		this.event_mouseout_container, false );
		}

		return;
	}

	this.invalid = true;
	this.element_container.classList.add( 'invalid' );

	if ( typeof error_message === 'string' && error_message.length )
	{
		this.element_error_message.textContent = error_message;

		this.element_container.addEventListener( 'mouseover',		this.event_mouseover_container, false );
		this.element_container.addEventListener( 'mouseout',		this.event_mouseout_container, false );
	}

	this.onSetInvalid();
}

MMInput.prototype.ClearInvalid = function()
{
	if ( !this.invalid )
	{
		return;
	}

	if ( this.error_visible )
	{
		this.element_error_container.hidePopover?.();
	}

	this.invalid							= false;
	this.invalid_error_message				= '';
	this.element_error_message.textContent	= '';

	this.element_container.classList.remove( 'invalid' );

	this.element_container.removeEventListener( 'mouseover',	this.event_invalid_mouseover_container, false );
	this.element_container.removeEventListener( 'mouseout',		this.event_invalid_mouseout_container, false );

	this.Hide_Error();
	this.onClearInvalid();
}

MMInput.prototype.GetInvalid = function()
{
	return this.invalid;
}

MMInput.prototype.GetInvalid_Message = function()
{
	return this.invalid_error_message;
}

MMInput.prototype.Show_Error = function()
{
	if ( this.error_visible || !this.invalid || !this.element_error_message.textContent.length )
	{
		return;
	}

	this.element_error_container.showPopover?.();

	this.error_visible		= true;
	this.render_error_id	= requestAnimationFrame( this.event_render_error );

	this.Redraw_Error();
}

MMInput.prototype.Hide_Error = function()
{
	if ( !this.error_visible )
	{
		return;
	}

	this.element_error_container.hidePopover?.();
	
	this.error_visible = false;
	cancelAnimationFrame( window[ this.render_error_id ] );
}

MMInput.prototype.Event_OnToggle_ErrorContainer = function( e )
{
	if ( e.newState === 'open' ) 	this.Show_Error();
	else							this.Hide_Error();
}

MMInput.prototype.Redraw_Error = function()
{
	var node;

	if ( !this.error_visible )
	{
		return;
	}

	const dimensions			= windowDimensions();
	const rect_container		= this.element_container.getBoundingClientRect();
	const scrollY				= window.scrollY || window.pageYOffset;

	//
	// Detect if container is scrolled off-page
	//

	if ( rect_container.bottom < 0 || rect_container.top > dimensions.y || rect_container.right < 0 || rect_container.left > dimensions.x )
	{
		this.element_error_container.style.visibility = 'hidden';
		return;
	}

	//
	// Detect if container is hidden within a parent
	//

	node = this.element_container;

	while ( ( node = node.parentNode ) && node !== document.documentElement )
	{
		overflow_x = computedStyleValue( node, 'overflow-x' );
		overflow_y = computedStyleValue( node, 'overflow-y' );

		if ( ( overflow_y === 'hidden' ) ||
			 ( overflow_x === 'hidden' ) ||
			 ( ( overflow_y === 'scroll' || overflow_y === 'auto' ) && node.scrollHeight > node.clientHeight ) ||
			 ( ( overflow_x === 'scroll' || overflow_x === 'auto' ) && node.scrollWidth > node.clientWidth ) )
		{
			const rect_node = node.getBoundingClientRect();

			if ( rect_container.bottom < rect_node.top || rect_container.top > rect_node.bottom || rect_container.right < rect_node.left || rect_container.left > rect_node.right )
			{
				this.element_error_container.style.visibility = 'hidden';
				return;
			}
		}
	}

	//
	// Position error container (above or below, depending on available space)
	//

	this.element_error_container.style.width		= '';
	this.element_error_container.style.left			= '0px';
	
	const rect_error_container_pre					= this.element_error_container.getBoundingClientRect();

	if ( ( rect_error_container_pre.width < ( rect_container.width ) + 20 ) || rect_container.width > 300 )		this.element_error_container.style.width = `${rect_container.width + 20}px`;
	else if ( rect_error_container_pre.width > 300 )															this.element_error_container.style.width = '300px';
	else																										this.element_error_container.style.width = `${rect_error_container_pre.width}px`;

	const rect_error_container						= this.element_error_container.getBoundingClientRect();

	this.element_error_container.style.left			= `${(rect_container.left - 10) - ( ( ( rect_error_container.width - 20) - rect_container.width ) / 2 )}px`;

	if ( ( rect_container.bottom + rect_error_container.height ) > dimensions.y )
	{
		this.element_error_container.style.top 		= `${rect_container.top - rect_error_container.height + scrollY}px`;
		this.element_error_container.classList.add( 'above' );
	}
	else
	{
		this.element_error_container.style.top 		= `${rect_container.bottom + scrollY}px`;
		this.element_error_container.classList.remove( 'above' );
	}

	this.element_error_container.style.visibility	= '';
}

MMInput.prototype.SetValue = function( value )
{
	this.element_input.value	= value;
	this.last_validated_value	= value;

	if ( this.autosize_enabled )
	{
		this.CalculateAutoSize();
	}
}

MMInput.prototype.GetValue = function()
{
	return this.element_input.value;
}

MMInput.prototype.Container = function()
{
	return this.element_container;
}

MMInput.prototype.ContainedInput = function()
{
	return this.element_input;
}

MMInput.prototype.ContainedElementTitle = function()
{
	return this.element_title;
}

MMInput.prototype.ContainedElementPrefix = function()
{
	return this.element_prefix;
}

MMInput.prototype.ContainedElementLabel = function()
{
	return this.element_label;
}

MMInput.prototype.ContainedElementErrorIcon = function()
{
	return this.element_error_icon;
}

MMInput.prototype.NotifyChange = function()
{
	if ( this.last_validated_value !== this.element_input.value )
	{
		if ( this.autosize_enabled )
		{
			this.CalculateAutoSize();
		}

		this.last_validated_value = this.element_input.value;
		this.onChange( this.element_input.value );
		this.Validate();
	}
}

MMInput.prototype.Validate = function()
{
	this.ClearInvalid();

	if ( !this.onValidate( this.element_input.value ) )
	{
		if ( !this.GetInvalid() )
		{
			this.SetInvalid( '' );
		}

		return false;
	}

	return true;
}

MMInput.prototype.Clear = function()
{
	this.element_input.value = '';
}

MMInput.prototype.RemoveKeyStackEntry = function()
{
	var keystackentry;

	if ( this.keystackentry )
	{
		keystackentry		= this.keystackentry;
		this.keystackentry	= null;

		KeyDownHandlerStack_Remove( keystackentry );
		this.onRemoveKeyStackEntry( keystackentry );
	}
}

MMInput.prototype.AddKeyStackEntry = function()
{
	var self = this;

	this.RemoveKeyStackEntry();

	this.keystackentry = KeyDownHandlerStack_Add();
	KeyDownHandlerStackEntry_AddKeyCode( this.keystackentry, 13, function( e ) { return self.Event_OnEnter_Input( e ); } );
	KeyDownHandlerStackEntry_AddKeyCode( this.keystackentry, 27, function( e ) { return self.Event_OnEsc_Input( e ); } );
	KeyDownHandlerStackEntry_AddKeyCode( this.keystackentry, 85, function( e )
	{
		if ( self.disabled || self.readonly )
		{
			return eventPreventDefault( e );
		}

		if ( e.ctrlKey )
		{
			self.Clear();
			return eventPreventDefault( e );
		}

		return true;
	} );

	this.onAddKeyStackEntry( this.keystackentry );
}

MMInput.prototype.GetKeyStackEntry = function()
{
	return this.keystackentry;
}

MMInput.prototype.CalculateAutoSize = function()
{
	var width, max_width, min_width, rect_input, rect_container;

	if ( !this.visible )
	{
		return;
	}

	this.element_input.style.width	= '0px';
	width							= this.element_input.scrollWidth + this.autosize_extra_padding;

	if ( this.autosize_min_width || this.autosize_max_width )
	{
		rect_container	= this.element_container.getBoundingClientRect();
		rect_input		= this.element_input.getBoundingClientRect();

		if ( this.autosize_min_width )
		{
			min_width = this.autosize_min_width - ( rect_container.width - rect_input.width );

			if ( width < min_width )
			{
				width = min_width;
			}
		}

		if ( this.autosize_max_width )
		{
			max_width = this.autosize_max_width - ( rect_container.width - rect_input.width );

			if ( width > max_width )
			{
				width = max_width;
			}
		}
	}

	this.element_input.style.width	= width + 'px';
}

MMInput.prototype.Render_Error = function()
{
	if ( this.error_visible )
	{
		const dimensions		= windowDimensions();
		const rect_container	= this.element_container.getBoundingClientRect();

		if ( rect_container.top !== this.last_container_top ||
			 rect_container.left !== this.last_container_left ||
			 dimensions.y !== this.last_window_y ||
			 dimensions.x !== this.last_window_x )
		{
			this.last_container_top		= rect_container.top;
			this.last_container_left	= rect_container.left;
			this.last_window_y			= dimensions.y;
			this.last_window_x			= dimensions.x;

			this.Redraw_Error();
		}
	}
}

MMInput.prototype.Render_AutoSize = function()
{
	if ( this.element_input.scrollWidth > this.element_input.clientWidth && ( !this.autosize_max_width || this.element_input.clientWidth < this.autosize_max_width ) )
	{
		this.CalculateAutoSize();
	}
}

MMInput.prototype.Event_OnMouseOver_Container = function( e )
{
	if ( this.invalid )
	{
		this.Show_Error();
	}

	return true;
}

MMInput.prototype.Event_OnMouseOut_Container = function( e )
{
	if ( this.invalid )
	{
		this.Hide_Error();
	}

	return true;
}

MMInput.prototype.Event_OnMouseDown_Container = function( e )
{
	var target = e.target || e.srcElement;

	if ( target === this.element_input || target === this.element_title_tooltip || containsChild( this.element_title_tooltip, target ) )
	{
		return true;
	}

	this.Focus();

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

MMInput.prototype.Event_OnFocus_Input = function( e )
{
	var self = this;

	if ( this.disabled )
	{
		this.element_input.blur();
		return true;
	}

	if ( this.focused )
	{
		return true;
	}

	this.focused						= true;
	this.element_container.className	= classNameAdd( this.element_container, 'focus' );

	this.AddKeyStackEntry();

	if ( this.select_on_focus )
	{
		requestAnimationFrame( function() { self.element_input.select(); } );
	}

	return this.onFocus( e );
}

MMInput.prototype.Event_OnBlur_Input = function( e )
{
	if ( !this.focused )
	{
		return true;
	}

	this.focused						= false;
	this.element_container.className	= classNameRemove( this.element_container, 'focus' );

	this.RemoveKeyStackEntry();

	return this.onBlur( e );
}

MMInput.prototype.Event_OnChange_Input = function( e )
{
	if ( this.disabled )
	{
		return true;
	}

	this.NotifyChange();
	return true;
}

MMInput.prototype.Event_OnInput_Input = function( e )
{
	if ( this.disabled )
	{
		return true;
	}

	this.NotifyChange();
	return true;
}

MMInput.prototype.Event_OnCut_Input = function( e )
{
	var self = this;

	if ( this.disabled || this.readonly )
	{
		eventStopPropagation( e );
		return eventPreventDefault( e );
	}

	setTimeout( function() { self.NotifyChange(); }, 0 );
	return true;
}

MMInput.prototype.Event_OnPaste_Input = function( e )
{
	var self = this;

	if ( this.disabled || this.readonly )
	{
		eventStopPropagation( e );
		return eventPreventDefault( e );
	}

	setTimeout( function() { self.NotifyChange(); }, 0 );
	return true;
}

MMInput.prototype.Event_OnKeyDown_Input = function( e )
{
	if ( this.disabled )
	{
		eventStopPropagation( e );
		return eventPreventDefault( e );
	}

	return true;
}

MMInput.prototype.Event_OnKeyUp_Input = function( e )
{
	if ( this.disabled )
	{
		eventStopPropagation( e );
		return eventPreventDefault( e );
	}

	this.NotifyChange();
	return true;
}

MMInput.prototype.Event_OnEnter_Input = function( e )
{
	if ( this.disabled )
	{
		eventStopPropagation( e );
		return eventPreventDefault( e );
	}

	return this.onEnter( e );
}

MMInput.prototype.Event_OnEsc_Input = function( e )
{
	if ( this.disabled )
	{
		eventStopPropagation( e );
		return eventPreventDefault( e );
	}

	return this.onEsc( e );
}

MMInput.prototype.Validate_NonEmpty = function()
{
	var error = new Object();

	if ( !this.Validate_NonEmpty_Silent( error ) )
	{
		this.SetInvalid( error.error_message );
		this.Select();

		return false;
	}

	return true;
}

MMInput.prototype.Validate_NonEmpty_Silent = function( error /* optional */ )
{
	if ( this.element_input.value.length )
	{
		return true;
	}

	if ( getVariableType( error ) === 'object' )
	{
		error.error_message = 'Please enter a value';
	}

	return false;
}

MMInput.prototype.Validate_String_NonEmpty_WithMaxLength = function( max_length )
{
	var error = new Object();

	if ( !this.Validate_String_NonEmpty_WithMaxLength_Silent( max_length, error ) )
	{
		this.SetInvalid( error.error_message );
		this.Select();

		return false;
	}

	return true;
}

MMInput.prototype.Validate_String_NonEmpty_WithMaxLength_Silent = function( max_length, error /* optional */ )
{
	if ( !this.element_input.value.length )
	{
		if ( getVariableType( error ) === 'object' )
		{
			error.error_message = 'Please enter a value';
		}

		return false;
	}
	else if ( this.element_input.value.length > max_length )
	{
		if ( getVariableType( error ) === 'object' )
		{
			error.error_message = `Value must be ${max_length} characters or less`;
		}

		return false;
	}

	return true;
}

MMInput.prototype.Validate_String_Optional_WithMaxLength = function( max_length )
{
	var error = new Object();

	if ( !this.Validate_String_Optional_WithMaxLength_Silent( max_length, error ) )
	{
		this.SetInvalid( error.error_message );
		this.Select();

		return false;
	}

	return true;
}

MMInput.prototype.Validate_String_Optional_WithMaxLength_Silent = function( max_length, error /* optional */ )
{
	if ( this.element_input.value.length > max_length )
	{
		if ( getVariableType( error ) === 'object' )
		{
			error.error_message = 'Value must be less than ' + max_length + ' characters';
		}

		return false;
	}

	return true;
}

MMInput.prototype.Validate_WholeNumber = function()
{
	var error = new Object();

	if ( !this.Validate_WholeNumber_Silent( error ) )
	{
		this.SetInvalid( error.error_message );
		this.Select();

		return false;
	}

	return true;
}

MMInput.prototype.Validate_WholeNumber_Silent = function( error /* optional */ )
{
	var validate_options = new Object;

	if ( this.element_input.value.length === 0 )
	{
		if ( getVariableType( error ) === 'object' )
		{
			error.error_message = 'Please enter a whole number';
		}

		return false;
	}
	else if ( ValidateWholeNumber( this.element_input.value, validate_options ) )
	{
		return true;
	}

	if ( getVariableType( error ) === 'object' )
	{
		error.error_message = validate_options.message;
	}

	return false;
}

MMInput.prototype.Validate_WholeNumber_GreaterThan = function( value )
{
	var error = new Object();

	if ( !this.Validate_WholeNumber_GreaterThan_Silent( value, error ) )
	{
		this.SetInvalid( error.error_message );
		this.Select();

		return false;
	}

	return true;
}

MMInput.prototype.Validate_WholeNumber_GreaterThan_Silent = function( value, error /* optional */ )
{
	if ( !this.Validate_WholeNumber_Silent( error ) )
	{
		return false;
	}

	if ( this.element_input.value <= value )
	{
		if ( getVariableType( error ) === 'object' )
		{
			error.error_message = 'Please enter a value greater than ' + value;
		}

		return false;
	}

	return true;
}

MMInput.prototype.Validate_WholeNumber_Range = function( min, max )
{
	var error = new Object();

	if ( !this.Validate_WholeNumber_Range_Silent( min, max, error ) )
	{
		this.SetInvalid( error.error_message );
		this.Select();

		return false;
	}

	return true;
}

MMInput.prototype.Validate_WholeNumber_Range_Silent = function( min, max, error /* optional */ )
{
	if ( !this.Validate_WholeNumber_Silent( error ) )
	{
		return false;
	}

	if ( this.element_input.value < min || this.element_input.value > max )
	{
		if ( getVariableType( error ) === 'object' )
		{
			error.error_message = 'Please enter a value between ' + min + ' and ' + max;
		}

		return false;
	}

	return true;
}

MMInput.prototype.Validate_WholeNumber_NonNegative = function()
{
	var error = new Object();

	if ( !this.Validate_WholeNumber_NonNegative_Silent( error ) )
	{
		this.SetInvalid( error.error_message );
		this.Select();

		return false;
	}

	return true;
}

MMInput.prototype.Validate_WholeNumber_NonNegative_Silent = function( error /* optional */ )
{
	var validate_options = { disallow_negative: true };

	if ( ValidateWholeNumber( this.element_input.value, validate_options ) )
	{
		return true;
	}

	if ( getVariableType( error ) === 'object' )
	{
		error.error_message = validate_options.message;
	}

	return false;
}

MMInput.prototype.Validate_FloatingPointNumber = function( options /* optional */ )
{
	var error = new Object();

	if ( !this.Validate_FloatingPointNumber_Silent( error, options ) )
	{
		this.SetInvalid( error.error_message );
		this.Select();

		return false;
	}

	return true;
}

MMInput.prototype.Validate_FloatingPointNumber_Silent = function( error /* optional */, options /* optional */ )
{
	var validate_options = { max_left_digits: 8, max_right_digits: 2 };

	if ( getVariableType( options ) === 'object' )
	{
		validate_options.max_left_digits	= options.max_left_digits  ?? validate_options.max_left_digits;
		validate_options.max_right_digits	= options.max_right_digits ?? validate_options.max_right_digits;
	}

	if ( ValidateFloatingPointNumber( this.element_input.value, validate_options ) )
	{
		return true;
	}

	if ( getVariableType( error ) === 'object' )
	{
		error.error_message = validate_options.message;
	}

	return false;
}

MMInput.prototype.Validate_FloatingPointNumber_NonNegative = function()
{
	var error = new Object();

	if ( !this.Validate_FloatingPointNumber_NonNegative_Silent( error ) )
	{
		this.SetInvalid( error.error_message );
		this.Select();

		return false;
	}

	return true;
}

MMInput.prototype.Validate_FloatingPointNumber_NonNegative_Silent = function( error /* optional */ )
{
	var validate_options = { max_left_digits: 8, max_right_digits: 2, disallow_negative: true };

	if ( ValidateFloatingPointNumber( this.element_input.value, validate_options ) )
	{
		return true;
	}

	if ( getVariableType( error ) === 'object' )
	{
		error.error_message = validate_options.message;
	}

	return false;
}

MMInput.prototype.Validate_FloatingPointNumber_Range = function( min, max, options /* optional */ )
{
	var error = new Object();

	if ( !this.Validate_FloatingPointNumber_Range_Silent( min, max, error, options ) )
	{
		this.SetInvalid( error.error_message );
		this.Select();

		return false;
	}

	return true;
}

MMInput.prototype.Validate_FloatingPointNumber_Range_Silent = function( min, max, error /* optional */, options /* optional */ )
{
	if ( !this.Validate_FloatingPointNumber_Silent( error, options ) )
	{
		return false;
	}

	if ( this.element_input.value < min || this.element_input.value > max )
	{
		if ( getVariableType( error ) === 'object' )
		{
			error.error_message = 'Please enter a value between ' + min + ' and ' + max;
		}

		return false;
	}

	return true;
}

MMInput.prototype.Validate_Price_NonNegative = function()
{
	const error = new Object();

	if ( !this.Validate_Price_NonNegative_Silent( error ) )
	{
		this.SetInvalid( error.error_message );
		this.Select();

		return false;
	}

	return true;
}

MMInput.prototype.Validate_Price_NonNegative_Silent = function( error /* optional */ )
{
	const validate_options = { max_left_digits: 8, max_right_digits: 8, disallow_negative: true };

	if ( ValidateFloatingPointNumber( this.element_input.value, validate_options ) )
	{
		return true;
	}

	if ( getVariableType( error ) === 'object' )
	{
		error.error_message = validate_options.message;
	}

	return false;
}

MMInput.prototype.Validate_Price = function()
{
	const error = new Object();

	if ( !this.Validate_Price_Silent( error ) )
	{
		this.SetInvalid( error.error_message );
		this.Select();

		return false;
	}

	return true;
}

MMInput.prototype.Validate_Price_Silent = function( error /* optional */ )
{
	const validate_options = { max_left_digits: 8, max_right_digits: 8 };

	if ( ValidateFloatingPointNumber( this.element_input.value, validate_options ) )
	{
		return true;
	}

	if ( getVariableType( error ) === 'object' )
	{
		error.error_message = validate_options.message;
	}

	return false;
}

MMInput.prototype.onRetrieveErrorParent	= function() { return document.body; };
MMInput.prototype.onValidate			= function( value ) { return true; };
MMInput.prototype.onEnter				= function( e ) { return KeyDownHandlerStackEntry_ManualBubbleKeyCode( e, this.GetKeyStackEntry(), 13 ); };
MMInput.prototype.onEsc					= function( e ) { this.element_input.blur(); };
MMInput.prototype.onFocus				= function( e ) { return true; };
MMInput.prototype.onBlur				= function( e ) { return true; };
MMInput.prototype.onChange				= function( value ) { ; };
MMInput.prototype.onSetInvalid			= function() { ; };
MMInput.prototype.onClearInvalid		= function() { ; };
MMInput.prototype.onAddKeyStackEntry	= function( keystackentry ) { ; };
MMInput.prototype.onRemoveKeyStackEntry	= function( keystackentry ) { ; };

// MMInput_Password
////////////////////////////////////////////////////

function MMInput_Password( parent, name, value )
{
	MMInput.call( this, parent, name, value );
}

DeriveFrom( MMInput, MMInput_Password );

MMInput_Password.prototype.Create_Input = function( name, parent )
{
	return newElement( 'input',	{ 'class': 'mm_input', 'name': name, 'type': 'password' }, null, parent );
}

MMInput_Password.prototype.ShowPassword = function()
{
	this.element_input.setAttribute( 'type', 'text' );
}

MMInput_Password.prototype.HidePassword = function()
{
	this.element_input.setAttribute( 'type', 'password' );
}

// MMWeightInput
////////////////////////////////////////////////////

var MMWeightInput = class
{
	#name;
	#type;
	#value;
	#input;
	#focused;
	#invalid;
	#disabled;
	#readonly;
	#input_low;
	#input_high;
	#weight_unit;
	#mixed_units;
	#current_unit;
	#display_unit;
	#smaller_units;
	#min_precision;
	#element_input;
	#original_value;
	#menubutton_units;
	#element_container;
	#invalid_error_message;

	constructor( parent, name, value, weight_unit, mixed_units, smaller_units, min_precision, display_unit )
	{
		weight_unit = weight_unit?.toLowerCase?.() ?? Store_Weight_Unit?.toLowerCase?.() ?? '';

		if ( [ 'lb', 'oz', 'kg', 'g' ].indexOf( weight_unit ) === -1 )
		{
			throw new Error( 'MMWeightInput requires a weight unit of: lb, oz, kg, or g' );
		}

		this.#name				= name ?? '';
		this.#type				= 'text';
		this.#value				= value ?? '';
		this.#original_value	= value ?? '';
		this.#weight_unit		= weight_unit;
		this.#current_unit		= this.#weight_unit;
		this.#mixed_units		= stob( mixed_units ?? Store_Weight_DisplayMixedUnits );
		this.#smaller_units		= stob( smaller_units ?? Store_Weight_DisplaySmallerUnits ) && !this.#mixed_units;
		this.#min_precision		= stoi_range( min_precision ?? Store_Weight_MinimumPrecision, 0, 8, 2 );
		this.#display_unit		= display_unit ?? Store_Weight_DisplayUnit;

		this.#element_container	= newElement( 'span', { 'class': 'mm_weight_input_container' }, null, parent );

		this.#redrawDisplay();
	}

	//
	// Public Functions
	//

	SetValue( value )
	{

		this.#original_value		= value;
		this.#value					= value;
		this.#element_input.value	= value;

		this.#setDisplayValue( value );
	}

	GetValue()
	{
		return this.#value;
	}

	GetFormattedValue()
	{
		var unit_low, unit_high, display_unit;

		if ( this.#mixed_units )
		{
			const { value_high, value_low } = this.#valueInMixedUnits( this.#getConvertedValue() );

			unit_high	= this.#unitIsMetric( this.#weight_unit ) ? 'kg' : 'lb';
			unit_low	= this.#unitIsMetric( this.#weight_unit ) ? 'g' : 'oz';

			if ( this.#weight_unit === 'kg' || this.#weight_unit === 'lb' )		unit_high	= this.#display_unit;
			else																unit_low	= this.#display_unit;

			if ( stoi( value_high ) <= 0 )
			{
				return `${Decimal_Pad( value_low, this.#min_precision )} ${unit_low}`;
			}

			return `${value_high} ${unit_high}, ${Decimal_Pad( value_low, this.#min_precision )} ${unit_low}`;
		}
		else if ( this.#smaller_units )
		{
			const { unit, value } = this.#valueInSmallerUnits( this.#getConvertedValue(), false );

			if ( unit === this.#weight_unit )	display_unit = this.#display_unit;
			else								display_unit = unit;

			return `${Decimal_Pad( value, this.#min_precision )} ${display_unit}`;
		}
		else
		{
			const { value } = this.#valueInDefault( this.#getConvertedValue() );

			return `${Decimal_Pad( value, this.#min_precision )} ${this.#display_unit}`;
		}
	}

	Modified()
	{
		return this.#original_value === this.#value;
	}

	SetAutoSize( enabled, min_width, max_width, extra_padding )
	{
		if ( enabled )	this.#element_container.classList.add( 'auto_width' );
		else			this.#element_container.classList.remove( 'auto_width' );

		if ( this.#mixed_units )
		{
			this.#input_high.SetAutoSize( enabled, min_width, max_width, extra_padding );
			this.#input_low.SetAutoSize( enabled, min_width, max_width, extra_padding );
		}
		else if ( this.#smaller_units )
		{
			this.#input.SetAutoSize( enabled, min_width, max_width, extra_padding );
		}
		else
		{
			this.#input.SetAutoSize( enabled, min_width, max_width, extra_padding );
		}
	}

	SetTitle( text )
	{
		if ( this.#mixed_units )		this.#input_high.SetTitle( text );
		else if ( this.#smaller_units )	this.#input.SetTitle( text );
		else							this.#input.SetTitle( text );
	}

	SetToolTip( node_or_text )
	{
		if ( this.#mixed_units )		this.#input_high.SetToolTip( node_or_text );
		else if ( this.#smaller_units )	this.#input.SetToolTip( node_or_text );
		else							this.#input.SetToolTip( node_or_text );
	}

	SetName( name )
	{
		this.#element_input.name = name;
	}

	SetType( type )
	{
		this.#type = type;
		this.#setTypeLowLevel();
	}

	SetMaxLength( length )
	{
		if ( this.#mixed_units )
		{
			this.#input_high.SetMaxLength( length );
			this.#input_low.SetMaxLength( length );
		}
		else if ( this.#smaller_units )
		{
			this.#input.SetMaxLength( length );
		}
		else
		{
			this.#input.SetMaxLength( length );
		}
	}

	SetDisplayInMixedUnits( mixed_units )
	{
		this.#mixed_units = mixed_units;

		if ( this.#mixed_units )
		{
			this.#smaller_units = false;
		}

		this.#redrawDisplay();
	}

	GetDisplayInMixedUnits()
	{
		return this.#mixed_units;
	}

	SetDisplayInSmallerUnits( smaller_units )
	{
		this.#smaller_units = smaller_units;

		if ( this.#smaller_units )
		{
			this.#mixed_units = false;
		}

		this.#redrawDisplay();
	}

	GetDisplayInSmallerUnits()
	{
		return this.#smaller_units;
	}

	SetDisplayInSmallerUnitsCurrentUnit( unit )
	{
		this.#setCurrentUnit( unit );
	}

	GetDisplayInSmallerUnitsCurrentUnit()
	{
		return this.#current_unit;
	}

	SetMinimumPrecision( min_precision )
	{
		this.#min_precision = min_precision;
		this.#redrawDisplay();
	}

	SetSelectOnFocus( select_on_focus )
	{
		if ( this.#mixed_units )
		{
			this.#input_high.SetSelectOnFocus( select_on_focus );
			this.#input_low.SetSelectOnFocus( select_on_focus );
		}
		else if ( this.#smaller_units )
		{
			this.#input.SetSelectOnFocus( select_on_focus );
		}
		else
		{
			this.#input.SetSelectOnFocus( select_on_focus );
		}
	}

	SetClassName( classname )
	{
		this.#element_container.className = classname;
	}

	AddClassName( classname )
	{
		classNameAddIfMissing( this.#element_container, classname );
	}

	RemoveClassName( classname, allow_regex_in_classname )
	{
		classNameRemoveIfPresent( this.#element_container, classname, allow_regex_in_classname );
	}

	GetClassName()
	{
		return this.#element_container.className;
	}

	SetInputClassName( classname )
	{
		if ( this.#mixed_units )
		{
			this.#input_high.SetClassName( classname );
			this.#input_low.SetClassName( classname );

			this.#input_high.AddClassName( 'mm_weight_input_mixed_units_input' );
			this.#input_low.AddClassName( 'mm_weight_input_mixed_units_input' );
		}
		else if ( this.#smaller_units )
		{
			this.#input.SetClassName( classname );
			this.#input.AddClassName( 'mm_weight_input_smaller_units_input' );
		}
		else
		{
			this.#input.SetClassName( classname );
		}
	}

	AddInputClassName( classname )
	{
		if ( this.#mixed_units )
		{
			this.#input_high.AddClassName( classname );
			this.#input_low.AddClassName( classname );
		}
		else if ( this.#smaller_units )
		{
			this.#input.AddClassName( classname );
		}
		else
		{
			this.#input.AddClassName( classname );
		}
	}

	RemoveInputClassName( classname, allow_regex_in_classname )
	{
		if ( this.#mixed_units )
		{
			this.#input_high.RemoveClassName( classname, allow_regex_in_classname );
			this.#input_low.RemoveClassName( classname, allow_regex_in_classname );
		}
		else if ( this.#smaller_units )
		{
			this.#input.RemoveClassName( classname, allow_regex_in_classname );
		}
		else
		{
			this.#input.RemoveClassName( classname, allow_regex_in_classname );
		}
	}

	SetErrorMessageMatchContainerWidth( match_width )
	{
		if ( this.#mixed_units )
		{
			this.#input_high.SetErrorMessageMatchContainerWidth( match_width );
			this.#input_low.SetErrorMessageMatchContainerWidth( match_width );
		}
		else if ( this.#smaller_units )
		{
			this.#input.SetErrorMessageMatchContainerWidth( match_width );
		}
		else
		{
			this.#input.SetErrorMessageMatchContainerWidth( match_width );
		}
	}

	SetErrorClassName( classname )
	{
		if ( this.#mixed_units )
		{
			this.#input_high.SetErrorClassName( classname );
			this.#input_low.SetErrorClassName( classname );
		}
		else if ( this.#smaller_units )
		{
			this.#input.SetErrorClassName( classname );
		}
		else
		{
			this.#input.SetErrorClassName( classname );
		}
	}

	GetErrorClassName()
	{
		if ( this.#mixed_units )		return this.#input_high.GetErrorClassName();
		else if ( this.#smaller_units )	return this.#input.GetErrorClassName();
		else							return this.#input.GetErrorClassName();
	}

	SetOnFocusHandler( fn1 )
	{
		this.onFocus = fn1;
	}

	SetOnBlurHandler( fn1 )
	{
		this.onBlur = fn1;
	}

	SetOnChangeHandler( fn1 )
	{
		this.onChange = fn1;
	}

	SetOnValidateHandler( fn1 )
	{
		this.onValidate = fn1;
	}

	SetOnEnterHandler( fn1 )
	{
		this.onEnter = fn1;
	}

	SetOnEscapeHandler( fn1 )
	{
		this.onEsc = fn1;
	}

	Enable()
	{
		if ( !this.#disabled )
		{
			return;
		}

		this.#disabled = false;
		this.#element_container.classList.remove( 'disabled' );
		this.#element_input.removeAttribute( 'disabled' );

		if ( this.#mixed_units )
		{
			this.#input_high.Enable();
			this.#input_low.Enable();
		}
		else if ( this.#smaller_units )
		{
			this.#input.Enable();
			this.#menubutton_units.Enable();
		}
		else
		{
			this.#input.Enable();
		}
	}

	Disable()
	{
		if ( this.#disabled )
		{
			return;
		}

		this.#disabled = true;
		this.#element_container.classList.add( 'disabled' );
		this.#element_input.setAttribute( 'disabled', '' );

		if ( this.#mixed_units )
		{
			this.#input_high.Disable();
			this.#input_low.Disable();
		}
		else if ( this.#smaller_units )
		{
			this.#input.Disable();
			this.#menubutton_units.Disable();
		}
		else
		{
			this.#input.Disable();
		}
	}

	IsEnabled()
	{
		return !this.#disabled;
	}

	SetReadOnly( readonly )
	{
		this.#readonly = readonly ? true : false;

		if ( this.#readonly )	classNameAddIfMissing( this.#element_container, 'readonly' );
		else					classNameRemoveIfPresent( this.#element_container, 'readonly' );

		if ( this.#mixed_units )
		{
			this.#input_high.SetReadOnly( this.#readonly );
			this.#input_low.SetReadOnly( this.#readonly );
		}
		else if ( this.#smaller_units )
		{
			this.#input.SetReadOnly( this.#readonly );
		}
		else
		{
			this.#input.SetReadOnly( this.#readonly );
		}
	}

	GetReadOnly()
	{
		return this.#readonly;
	}

	SetTabIndex( index )
	{
		if ( this.#mixed_units )
		{
			this.#input_high.SetTabIndex( index );
			this.#input_low.SetTabIndex( index );
		}
		else if ( this.#smaller_units )
		{
			this.#input.SetTabIndex( index );
		}
		else
		{
			this.#input.SetTabIndex( index );
		}
	}

	Show()
	{
		this.#element_container.classList.remove( 'hidden' );

		if ( this.#mixed_units )
		{
			this.#input_high.Show();
			this.#input_low.Show();
		}
		else if ( this.#smaller_units )
		{
			this.#input.Show();
			this.#menubutton_units.Show();
		}
		else
		{
			this.#input.Show();
		}
	}

	Hide()
	{
		this.#element_container.classList.add( 'hidden' );

		if ( this.#mixed_units )
		{
			this.#input_high.Hide();
			this.#input_low.Hide();
		}
		else if ( this.#smaller_units )
		{
			this.#input.Hide();
			this.#menubutton_units.Hide();
		}
		else
		{
			this.#input.Hide();
		}
	}

	Select()
	{
		if ( this.#disabled )
		{
			return;
		}

		if ( this.#mixed_units )		this.#input_high.Select();
		else if ( this.#smaller_units )	this.#input.Select();
		else							this.#input.Select();
	}

	Focus()
	{
		if ( this.#disabled )
		{
			return;
		}

		if ( this.#mixed_units )		this.#input_high.Focus();
		else if ( this.#smaller_units )	this.#input.Focus();
		else							this.#input.Focus();
	}

	Blur()
	{

		if ( this.#mixed_units )		this.#input_high.Blur();
		else if ( this.#smaller_units )	this.#input.Blur();
		else							this.#input.Blur();
	}

	SetInvalid( error_message )
	{
		if ( this.#mixed_units )
		{
			this.#input_high.SetInvalid( error_message );
			this.#input_low.SetInvalid( error_message );
		}
		else if ( this.#smaller_units )
		{
			this.#input.SetInvalid( error_message );
			this.#menubutton_units.SetInvalid( error_message );
		}
		else
		{
			this.#input.SetInvalid( error_message );
		}

		this.onSetInvalid();
	}

	ClearInvalid()
	{
		if ( this.#mixed_units )
		{
			this.#input_high.ClearInvalid();
			this.#input_low.ClearInvalid();
		}
		else if ( this.#smaller_units )
		{
			this.#input.ClearInvalid();
			this.#menubutton_units.ClearInvalid();
		}
		else
		{
			this.#input.ClearInvalid();
		}

		this.onClearInvalid();
	}

	GetInvalid()
	{
		if ( this.#mixed_units )		return this.#input_high.GetInvalid() || this.#input_low.GetInvalid();
		else if ( this.#smaller_units )	return this.#input.GetInvalid();
		else							return this.#input.GetInvalid();
	}

	GetInvalid_Message()
	{
		if ( this.#mixed_units )		return this.#input_high.GetInvalid() ? this.#input_high.GetInvalid_Message() : this.#input_low.GetInvalid_Message();
		else if ( this.#smaller_units )	return this.#input.GetInvalid_Message();
		else							return this.#input.GetInvalid_Message();
	}

	Container()
	{
		return this.#element_container;
	}

	ContainedInputs()
	{
		const inputs = new Array();

		if ( this.#mixed_units )
		{
			inputs.push( this.#input_high );
			inputs.push( this.#input_low );
		}
		else if ( this.#smaller_units )
		{
			inputs.push( this.#input );
		}
		else
		{
			inputs.push( this.#input );
		}

		return inputs;
	}

	AddToParent( element_parent )
	{
		element_parent.appendChild( this.#element_container );
	}

	Validate()
	{
		if ( this.#mixed_units )		return this.#validateMixedUnits();
		else if ( this.#smaller_units )	return this.#input.Validate();
		else							return this.#input.Validate();
	}

	Validate_Weight()
	{
		const error = new Object();

		if ( !this.Validate_Weight_Silent( error ) )
		{
			this.SetInvalid( error.error_message );
			this.Select();

			return false;
		}

		return true;
	}

	Validate_Weight_Silent( error /* optional */ )
	{
		const validate_options = { max_left_digits: 8, max_right_digits: 8, disallow_negative: true };

		if ( ValidateFloatingPointNumber( this.#value, validate_options ) )
		{
			return true;
		}

		if ( getVariableType( error ) === 'object' )
		{
			error.error_message = validate_options.message;
		}

		return false;
	}

	//
	// Events
	//

	#onFocus( e )
	{
		if ( this.#focused )
		{
			return;
		}

		this.#focused = true;
		this.onFocus( e );
	}

	#onBlur( e )
	{
		if ( !this.#focused )
		{
			return;
		}

		this.#focused = false;
		this.onBlur( e );
	}

	#onBlurMixedUnitHigh( e )
	{
		const input_high_value	= this.#input_high.GetValue();
		const input_low_value	= this.#input_low.GetValue();

		if ( !ValueIsEmpty( input_high_value ) && !isNaN( input_high_value ) && !ValueIsEmpty( input_low_value ) && !isNaN( input_low_value ) && String( input_high_value ).indexOf( '.' ) !== -1 )
		{
			this.#setDisplayValueMixedUnits( input_high_value );
		}

		return this.#onBlur( e );
	}

	#onBlurMixedUnitLow( e )
	{
		const input_high_value	= this.#input_high.GetValue();
		const input_low_value	= this.#input_low.GetValue();

		if ( !ValueIsEmpty( input_high_value ) && !isNaN( input_high_value ) && !ValueIsEmpty( input_low_value ) && !isNaN( input_low_value ) )
		{
			this.#setDisplayValueMixedUnits( this.#getConvertedValue() );
		}

		return this.#onBlur( e );
	}

	#onBlurSmallerUnits( e )
	{
		const input_value = this.#input.GetValue();

		if ( this.#current_unit !== this.#weight_unit && !ValueIsEmpty( input_value ) && !isNaN( input_value ) )
		{
			this.#setDisplayValueSmallerUnits( this.#getConvertedValue(), true );
		}

		return this.#onBlur( e );
	}

	#onChange()
	{
		const value = this.#getConvertedValue();

		if ( this.#value !== value )
		{
			this.#value					= value;
			this.#element_input.value	= value;

			this.onChange( value );
		}
	}

	#validateMixedUnits()
	{
		this.#input_high.ClearInvalid();
		this.#input_low.ClearInvalid();

		if ( !this.#onValidateMixedUnits() )
		{
			return false;
		}

		return true;
	}

	#onValidateMixedUnits()
	{
		var valid, value, validate_options;

		this.#input_high.ClearInvalid();
		this.#input_low.ClearInvalid();

		valid				= true;
		validate_options	= {};

		if ( !ValidateFloatingPointNumber( this.#input_high.GetValue(), validate_options ) )
		{
			this.#input_high.SetInvalid( validate_options.message );
			valid = false;
		}

		if ( !ValidateFloatingPointNumber( this.#input_low.GetValue(), validate_options ) )
		{
			this.#input_low.SetInvalid( validate_options.message );
			valid = false;
		}

		if ( !valid )
		{
			return false;
		}

		value = this.#getConvertedValue();

		if ( isNaN( value ) )
		{
			this.#input_high.SetInvalid( `Weight '${value}' in ${this.#weight_unit} is not a number` );
			this.#input_low.SetInvalid( `Weight '${value}' in ${this.#weight_unit} is not a number` );

			return false;
		}

		const { integer, integer_length, decimal, decimal_length } = this.#splitNumber( value );

		if ( integer_length > 8 )
		{
			this.#input_high.SetInvalid( `Weight '${value}' in ${this.#weight_unit} must be 8 digits or less to the left of the decimal point` );
			this.#input_low.SetInvalid( `Weight '${value}' in ${this.#weight_unit} must be 8 digits or less to the left of the decimal point` );

			return false;
		}
		else if ( decimal_length > 8 )
		{
			this.#input_high.SetInvalid( `Weight '${value}' in ${this.#weight_unit} must be 8 digits or less to the right of the decimal point` );
			this.#input_low.SetInvalid( `Weight '${value}' in ${this.#weight_unit} must be 8 digits or less to the right of the decimal point` );

			return false;
		}

		return this.#onValidateLowLevel( value );
	}

	#onValidateSmallerUnits()
	{
		const value = this.#getConvertedValue();

		if ( ValueIsEmpty( value ) || isNaN( value ) )
		{
			this.#input.SetInvalid( `Please enter a number` );
			return false;
		}

		const { integer, integer_length, decimal, decimal_length } = this.#splitNumber( value );

		if ( integer_length > 8 )
		{
			this.#input.SetInvalid( `Weight '${value}' in ${this.#weight_unit} must be 8 digits or less to the left of the decimal point` );
			return false;
		}
		else if ( decimal_length > 8 )
		{
			this.#input.SetInvalid( `Weight '${value}' in ${this.#weight_unit} must be 8 digits or less to the right of the decimal point` );
			return false;
		}

		return this.#onValidateLowLevel( value );
	}

	#onValidateDefault()
	{
		const value				= this.#getConvertedValue();
		const validate_options	= { disallow_negative: true, max_left_digits: 8, max_right_digits: 8 };

		if ( !ValidateFloatingPointNumber( value, validate_options ) )
		{
			this.#input.SetInvalid( validate_options.message );
			return false;
		}

		return this.#onValidateLowLevel( value );
	}

	#onValidateLowLevel( value )
	{
		this.ClearInvalid();

		if ( !this.onValidate( this.#value ) )
		{
			if ( !this.GetInvalid() )
			{
				this.SetInvalid( '' );
			}

			return false;
		}

		return true;
	}

	//
	// Helper Functions
	//

	#setDisplayValue( value )
	{
		if ( this.#mixed_units )		this.#setDisplayValueMixedUnits( value );
		else if ( this.#smaller_units )	this.#setDisplayValueSmallerUnits( value );
		else							this.#setDisplayValueDefault( value );
	}

	#setDisplayValueMixedUnits( raw_value )
	{
		const { value_high, value_low } = this.#valueInMixedUnits( raw_value );

		this.#input_high.SetValue( value_high );
		this.#input_low.SetValue( value_low );
	}

	#setDisplayValueSmallerUnits( raw_value, ignore_unit_shift )
	{
		const { unit, value } = this.#valueInSmallerUnits( raw_value, ignore_unit_shift );

		this.#input.SetValue( value );

		if ( !ignore_unit_shift && unit !== this.#current_unit )
		{
			this.#current_unit = unit;

			this.#menubutton_units.SetText( this.#current_unit );
			this.#menubutton_units.MenuItemList_Map( ( item, data ) =>
			{
				if ( data === this.#current_unit )	item.AddClassName( 'mm10_menubutton_menu_item_persistent_selected' );
				else								item.RemoveClassName( 'mm10_menubutton_menu_item_persistent_selected' );
			} );
		}
	}

	#setDisplayValueDefault( raw_value )
	{
		const { value } = this.#valueInDefault( raw_value );

		this.#input.SetValue( value );
	}

	#setTypeLowLevel()
	{
		if ( this.#mixed_units )
		{
			this.#input_high.SetType( this.#type );
			this.#input_low.SetType( this.#type );
		}
		else if ( this.#smaller_units )
		{
			this.#input.SetType( this.#type );
		}
		else
		{
			this.#input.SetType( this.#type );
		}
	}

	#redrawDisplay()
	{
		EmptyElement_NoResize( this.#element_container );

		this.#element_input = newElement( 'input', { type: 'hidden', name: this.#name, value: this.#value }, null, this.#element_container );

		if ( this.#mixed_units )		return this.#redrawDisplayMixedUnits();
		else if ( this.#smaller_units )	return this.#redrawDisplaySmallerUnits();
		else							return this.#redrawDisplayDefault();
	}

	#redrawDisplayMixedUnits()
	{
		this.#input_high						= new MMInput( this.#element_container, '', '' );
		this.#input_high.Validate				= () => { return this.#validateMixedUnits(); };
		this.#input_high.onAddKeyStackEntry		= ( keystackentry ) => { return this.onAddKeyStackEntry( keystackentry, this.#input_high ); };
		this.#input_high.onRemoveKeyStackEntry	= ( keystackentry ) => { return this.onRemoveKeyStackEntry( keystackentry, this.#input_high ); };
		this.#input_high.onRetrieveErrorParent	= () => { return this.onRetrieveErrorParent(); };
		this.#input_high.SetClassName( 'mm_weight_input mm_weight_input_mixed_units_input' );
		this.#input_high.SetOnFocusHandler( ( e ) => { return this.#onFocus( e ); } );
		this.#input_high.SetOnBlurHandler( ( e ) => { return this.#onBlurMixedUnitHigh( e ); } );
		this.#input_high.SetOnEnterHandler( ( e ) => { return this.onEnter( e, this.#input_high ); } );
		this.#input_high.SetOnEscapeHandler( ( e ) => { return this.onEsc( e, this.#input_high ); } );
		this.#input_high.SetOnChangeHandler( ( value ) => { return this.#onChange(); } );
		this.#input_high.SetOnValidateHandler( ( value ) => { return this.#onValidateMixedUnits(); } );

		if ( this.#unitIsMetric( this.#weight_unit ) )	this.#input_high.SetLabel( 'kg' );
		else											this.#input_high.SetLabel( 'lb' );

		this.#input_low							= new MMInput( this.#element_container, '', '' );
		this.#input_low.Validate				= () => { return this.#validateMixedUnits(); };
		this.#input_low.onAddKeyStackEntry		= ( keystackentry ) => { return this.onAddKeyStackEntry( keystackentry, this.#input_low ); };
		this.#input_low.onRemoveKeyStackEntry	= ( keystackentry ) => { return this.onRemoveKeyStackEntry( keystackentry, this.#input_low ); };
		this.#input_low.onRetrieveErrorParent	= () => { return this.onRetrieveErrorParent(); };
		this.#input_low.SetClassName( 'mm_weight_input mm_weight_input_mixed_units_input' );
		this.#input_low.SetOnFocusHandler( ( e ) => { return this.#onFocus( e ); } );
		this.#input_low.SetOnBlurHandler( ( e ) => { return this.#onBlurMixedUnitLow( e ); } );
		this.#input_low.SetOnEnterHandler( ( e ) => { return this.onEnter( e, this.#input_low ); } );
		this.#input_low.SetOnEscapeHandler( ( e ) => { return this.onEsc( e, this.#input_low ); } );
		this.#input_low.SetOnChangeHandler( ( value ) => { return this.#onChange(); } );
		this.#input_low.SetOnValidateHandler( ( value ) => { return this.#onValidateMixedUnits(); } );

		if ( this.#unitIsMetric( this.#weight_unit ) )	this.#input_low.SetLabel( 'g' );
		else											this.#input_low.SetLabel( 'oz' );

		this.SetValue( this.#value );
		this.SetType( this.#type );
	}

	#redrawDisplaySmallerUnits()
	{
		this.#input											= new MMInput( this.#element_container, '', '' );
		this.#input.onAddKeyStackEntry						= ( keystackentry ) => { return this.onAddKeyStackEntry( keystackentry, this.#input ); };
		this.#input.onRemoveKeyStackEntry					= ( keystackentry ) => { return this.onRemoveKeyStackEntry( keystackentry, this.#input ); };
		this.#input.onRetrieveErrorParent					= () => { return this.onRetrieveErrorParent(); };
		this.#input.SetClassName( 'mm_weight_input mm_weight_input_smaller_units_input' );
		this.#input.SetOnFocusHandler( ( e ) => { return this.#onFocus( e ); } );
		this.#input.SetOnBlurHandler( ( e ) => { return this.#onBlurSmallerUnits( e ); } );
		this.#input.SetOnEnterHandler( ( e ) => { return this.onEnter( e, this.#input ); } );
		this.#input.SetOnEscapeHandler( ( e ) => { return this.onEsc( e, this.#input ); } );
		this.#input.SetOnChangeHandler( ( value ) => { return this.#onChange(); } );
		this.#input.SetOnValidateHandler( ( value ) => { return this.#onValidateSmallerUnits(); } );

		this.#input.Event_OnMouseDown_Container = ( e ) =>
		{
			if ( e.target === this.#menubutton_units.Container() || containsChild( this.#menubutton_units.Container(), e.target ) )
			{
				return true;
			}

			return MMInput.prototype.Event_OnMouseDown_Container.call( this.#input, e );
		}

		this.#menubutton_units								= new MMMenuButton( this.#weight_unit, this.#input.Container() );
		this.#menubutton_units.ContainedButton().onFocus	= ( e ) => { this.#input.AddClassName( 'focus' ); return this.#onFocus( e ); };
		this.#menubutton_units.ContainedButton().onBlur		= ( e ) => { this.#input.RemoveClassName( 'focus' ); return this.#onBlur( e ); };
		this.#menubutton_units.SetClassName( 'mm_weight_input_units' );
		this.#menubutton_units.SetMenuClassName( 'mm_weight_input_units_menu mm10_menubutton_container_style_common_menu' );
		this.#menubutton_units.SetButtonClassName( 'mm_weight_input_units_button' );
		this.#menubutton_units.SetAnimateMenu( true );
		this.#menubutton_units.SetMenuAsRootMenu( true );
		this.#menubutton_units.SetMenuAsRootMenu_AutosizesConditionally( true );

		if ( this.#unitIsMetric( this.#weight_unit ) )
		{
			this.#menubutton_units.Menu_Append_Item( 'kg', ( e, data ) => { this.#setCurrentUnit( data ); }, 'kg' );
			this.#menubutton_units.Menu_Append_Item( 'g', ( e, data ) => { this.#setCurrentUnit( data ); }, 'g' );
		}
		else
		{
			this.#menubutton_units.Menu_Append_Item( 'lb', ( e, data ) => { this.#setCurrentUnit( data ); }, 'lb' );
			this.#menubutton_units.Menu_Append_Item( 'oz', ( e, data ) => { this.#setCurrentUnit( data ); }, 'oz' );
		}

		this.#menubutton_units.MenuItemList_Map( ( item, data ) =>
		{
			if ( data === this.#current_unit )	item.AddClassName( 'mm10_menubutton_menu_item_persistent_selected' );
			else								item.RemoveClassName( 'mm10_menubutton_menu_item_persistent_selected' );
		} );

		this.SetValue( this.#value );
		this.SetType( this.#type );
	}

	#redrawDisplayDefault()
	{
		this.#input							= new MMInput( this.#element_container, this.#name, this.#value );
		this.#input.onAddKeyStackEntry		= ( keystackentry ) => { return this.onAddKeyStackEntry( keystackentry, this.#input ); };
		this.#input.onRemoveKeyStackEntry	= ( keystackentry ) => { return this.onRemoveKeyStackEntry( keystackentry, this.#input ); };
		this.#input.onRetrieveErrorParent	= () => { return this.onRetrieveErrorParent(); };
		this.#input.SetClassName( 'mm_weight_input' );
		this.#input.SetOnFocusHandler( ( e ) => { return this.#onFocus( e ); } );
		this.#input.SetOnBlurHandler( ( e ) => { return this.#onBlur( e ); } );
		this.#input.SetOnEnterHandler( ( e ) => { return this.onEnter( e, this.#input ); } );
		this.#input.SetOnEscapeHandler( ( e ) => { return this.onEsc( e, this.#input ); } );
		this.#input.SetOnChangeHandler( ( value ) => { return this.#onChange(); } );
		this.#input.SetOnValidateHandler( ( value ) => { return this.#onValidateDefault(); } );

		this.SetValue( this.#value );
		this.SetType( this.#type );
	}

	#setCurrentUnit( unit )
	{
		if ( this.#mixed_units || !this.#smaller_units )									return;
		else if ( this.#current_unit === unit )												return;
		else if ( this.#unitIsMetric( this.#current_unit ) !== this.#unitIsMetric( unit ) )	return;

		const value = this.#getConvertedValue( true );

		this.#menubutton_units.SetText( unit );
		this.#menubutton_units.MenuItemList_Map( ( item, data ) =>
		{
			if ( data === unit )	item.AddClassName( 'mm10_menubutton_menu_item_persistent_selected' );
			else					item.RemoveClassName( 'mm10_menubutton_menu_item_persistent_selected' );
		} );

		this.#current_unit = unit;

		if ( !ValueIsEmpty( value ) && !isNaN( value ) )
		{
			this.#input.ClearInvalid();
			this.#setDisplayValueSmallerUnits( value, true );
			this.Validate();
		}
	}

	#unitIsMetric( unit )
	{
		return ( unit === 'kg' || unit === 'g' );
	}

	#valueInMixedUnits( raw_value )
	{
		var value_low, value_high;

		if ( ValueIsEmpty( raw_value ) )
		{
			value_high	= '';
			value_low	= '';
		}
		else if ( isNaN( raw_value ) )
		{
			value_high	= raw_value;
			value_low	= '';
		}
		else if ( this.#weight_unit === 'lb' )
		{
			const { integer, decimal } = this.#splitNumber( raw_value );

			value_high	= integer;
			value_low	= decimal * 16;
		}
		else if ( this.#weight_unit === 'oz' )
		{
			const converted_value		= raw_value / 16;
			const { integer, decimal }	= this.#splitNumber( converted_value );

			value_high	= integer;
			value_low	= decimal * 16;
		}
		else if ( this.#weight_unit === 'kg' )
		{
			const { integer, decimal } = this.#splitNumber( raw_value );

			value_high	= integer;
			value_low	= decimal * 1000;
		}
		else if ( this.#weight_unit === 'g' )
		{
			const converted_value		= raw_value / 1000;
			const { integer, decimal }	= this.#splitNumber( converted_value );

			value_high	= integer;
			value_low	= decimal * 1000;
		}

		return {
			value_high:	value_high,
			value_low:	value_low
		};
	}

	#valueInSmallerUnits( raw_value, ignore_unit_shift )
	{
		var unit, value;

		unit = this.#current_unit;

		if ( ValueIsEmpty( raw_value ) || isNaN( raw_value ) )
		{
			value = raw_value;
		}
		else
		{
			if ( !ignore_unit_shift )
			{
				if ( raw_value >= 1 )
				{
					unit = this.#weight_unit;
				}
				else
				{
					if ( this.#weight_unit === 'lb' )
					{
						unit = 'oz';
					}
					else if ( this.#weight_unit === 'kg' )
					{
						unit = 'g';
					}
					else
					{
						//
						// Do nothing. Weight is already in the smallest unit
						//
					}
				}
			}

			value = raw_value;

			//
			// Standard
			//

			if ( unit === 'lb' && this.#weight_unit === 'lb' )		value = raw_value;
			else if ( unit === 'lb' && this.#weight_unit === 'oz' )	value = raw_value / 16;
			else if ( unit === 'oz' && this.#weight_unit === 'lb' )	value = raw_value * 16;
			else if ( unit === 'oz' && this.#weight_unit === 'oz' )	value = raw_value;

			//
			// Metric
			//

			else if ( unit === 'kg' && this.#weight_unit === 'kg' )	value = raw_value;
			else if ( unit === 'kg' && this.#weight_unit === 'g' )	value = raw_value / 1000;
			else if ( unit === 'g' && this.#weight_unit === 'kg' )	value = raw_value * 1000;
			else if ( unit === 'g' && this.#weight_unit === 'g' )	value = raw_value;

			const { integer, decimal, decimal_length } = this.#splitNumber( value );
			value = decimal_length < this.#min_precision ? stod( value ).toFixed( this.#min_precision ) : value;
		}

		return {
			unit:	unit,
			value:	value
		};
	}

	#valueInDefault( raw_value )
	{
		var value;

		if ( ValueIsEmpty( raw_value ) || isNaN( raw_value ) )
		{
			value = raw_value;
		}
		else
		{
			const { integer, decimal, decimal_length } = this.#splitNumber( raw_value );
			value = decimal_length < this.#min_precision ? stod( raw_value ).toFixed( this.#min_precision ) : raw_value;
		}

		return {
			value: value
		};
	}

	#getConvertedValue( force_truncate )
	{
		var value, value_low, value_high, input_value;

		if ( this.#mixed_units )
		{
			value_high	= this.#input_high.GetValue();
			value_low	= this.#input_low.GetValue();

			if ( ValueIsEmpty( value_high ) && ValueIsEmpty( value_low ) )
			{
				return '';
			}

			if ( ( !ValueIsEmpty( value_high ) && isNaN( value_high ) ) || ( !ValueIsEmpty( value_low ) && isNaN( value_low ) ) )
			{
				return `${value_high}${value_low}`; // Allow validation of non-numeric values
			}

			if ( this.#weight_unit === 'lb' )					value = stod_def( value_high, 0 ) + ( stod_def( value_low, 0 ) / 16 );
			else if ( this.#weight_unit === 'oz' )				value = ( stod_def( value_high, 0 ) * 16 ) + stod_def( value_low, 0 );
			else if ( this.#weight_unit === 'kg' )				value = stod_def( value_high, 0 ) + ( stod_def( value_low, 0 ) / 1000 );
			else if ( this.#weight_unit === 'g' )				value = ( stod_def( value_high, 0 ) * 1000 ) + stod_def( value_low, 0 );

			//
			// Always truncate to 8 decimal places since this is always a converted value
			//

			value = this.#getTruncatedValue( value );
		}
		else if ( this.#smaller_units )
		{
			input_value	= this.#input.GetValue();

			//
			// Non-Numeric Value
			//

			if ( ValueIsEmpty( input_value ) || isNaN( input_value ) )
			{
				return input_value;
			}

			//
			// Standard
			//

			else if ( this.#current_unit === 'lb' && this.#weight_unit === 'lb' )	value = stod_def( input_value, 0 );
			else if ( this.#current_unit === 'lb' && this.#weight_unit === 'oz' )	value = stod_def( input_value, 0 ) * 16;
			else if ( this.#current_unit === 'oz' && this.#weight_unit === 'lb' )	value = stod_def( input_value, 0 ) / 16;
			else if ( this.#current_unit === 'oz' && this.#weight_unit === 'oz' )	value = stod_def( input_value, 0 );

			//
			// Metric
			//

			else if ( this.#current_unit === 'kg' && this.#weight_unit === 'kg' )	value = stod_def( input_value, 0 );
			else if ( this.#current_unit === 'kg' && this.#weight_unit === 'g' )	value = stod_def( input_value, 0 ) * 1000;
			else if ( this.#current_unit === 'g' && this.#weight_unit === 'kg' )	value = stod_def( input_value, 0 ) / 1000;
			else if ( this.#current_unit === 'g' && this.#weight_unit === 'g' )		value = stod_def( input_value, 0 );

			//
			// Truncate value to 8 decimal places if the current unit is not the same as
			// the weight unit. Otherwise, allow longer decimal values to be returned
			// and validated.
			//

			if ( force_truncate || this.#current_unit !== this.#weight_unit )
			{
				value = this.#getTruncatedValue( value );
			}
		}
		else
		{
			input_value	= this.#input.GetValue();

			if ( ValueIsEmpty( input_value ) || isNaN( input_value ) )
			{
				return input_value;
			}

			value = stod( input_value );

			if ( force_truncate )
			{
				value = this.#getTruncatedValue( value );
			}
		}

		return value;
	}

	#getTruncatedValue( value )
	{
		if ( ValueIsEmpty( value ) || isNaN( value ) )
		{
			return value;
		}

		const value_split	= value.toString().split( '.' );
		const integer		= value_split[ 0 ] ?? '0';
		const decimal		= value_split[ 1 ] ?? '';

		if ( decimal.length === 0 )
		{
			return stoi( integer );
		}

		return stod( `${integer}.${decimal.substring( 0, 8 )}` );
	}

	#splitNumber( value )
	{
		const integer			= Math.floor( value );
		const decimal_length	= value.toString().split( '.' )?.[ 1 ]?.length ?? 0;
		const decimal			= ( value - integer ).toFixed( decimal_length );

		return {
			integer:		integer,
			integer_length:	integer.toString().length,
			decimal:		decimal,
			decimal_length:	decimal_length
		}
	}

	//
	// Public Override Functions
	//

	onRetrieveErrorParent() { return document.body; }
	onValidate( value ) { return !isNaN( value ); }
	onEnter( e, input ) { return KeyDownHandlerStackEntry_ManualBubbleKeyCode( e, input.GetKeyStackEntry(), 13 ); }
	onEsc( e, input ) { input.Blur(); }
	onFocus( e ) { return true; }
	onBlur( e ) { return true; }
	onChange( value ) { ; }
	onSetInvalid() { ; }
	onClearInvalid() { ; }
	onAddKeyStackEntry( keystackentry, input ) { ; }
	onRemoveKeyStackEntry( keystackentry, input ) { ; }
}

// MMMultiLineInput
////////////////////////////////////////////////////

function MMMultiLineInput( parent, name, value, editor_text )
{
	var self = this;

	this.visible								= true;
	this.disabled								= false;
	this.invalid								= false;
	this.invalid_error_message					= '';
	this.error_visible							= false;
	this.name									= name;
	this.value									= value;
	this.editor_text							= editor_text;
	this.last_value								= value;
	this.last_container_top						= null;
	this.last_container_left					= null;
	this.last_window_y							= null;
	this.last_window_x							= null;

	this.element_parent							= typeof parent === 'string' ? document.getElementById( parent ) : parent;
	this.element_container						= newElement( 'span', { 'class': 'mm_multilineinput_container' }, 				null, this.element_parent );
	this.element_title							= newElement( 'span', { 'class': 'mm_multilineinput_title' },					null, this.element_container );
	this.element_content						= newElement( 'span', { 'class': 'mm_multilineinput_content' },					null, this.element_container );
	this.element_button_container				= newElement( 'span', { 'class': 'mm_multilineinput_button_container' },		null, this.element_container );

	this.element_error_container				= newElement( 'span', { 'class': 'mm_multilineinput_error_container' },			null, null );
	this.element_error_message					= newElement( 'span', { 'class': 'mm_multilineinput_error_message' },			null, this.element_error_container );
	this.element_error_tail						= newElement( 'span', { 'class': 'mm_multilineinput_error_tail' },				null, this.element_error_container );

	this.button_edit							= new MMButton( this.element_button_container );
	this.button_edit.SetText( 'Edit' );
	this.button_edit.SetClassName( 'mm_multilineinput_button' );
	this.button_edit.SetOnClickHandler( function( e ) { return self.Event_OnClick_Button( e ); } );

	this.event_render_error						= function() { self.Render_Error(); self.render_error_id = requestAnimationFrame( self.event_render_error ); };
	this.event_mouseover_container				= function( event ) { return self.Event_OnMouseOver_Container( event ? event : window.event ); }
	this.event_mouseout_container				= function( event ) { return self.Event_OnMouseOut_Container( event ? event : window.event ); }
}

MMMultiLineInput.prototype.SetTitle = function( text )
{
	this.element_title.textContent = text;

	return this;
}

MMMultiLineInput.prototype.SetClassName = function( classname )
{
	this.element_container.className = classname;

	return this;
}

MMMultiLineInput.prototype.GetClassName = function()
{
	return this.element_container.className;
}

MMMultiLineInput.prototype.SetErrorClassName = function( classname )
{
	this.element_error_container.className = classname;

	return this;
}

MMMultiLineInput.prototype.GetErrorClassName = function()
{
	return this.element_error_container.className;
}

MMMultiLineInput.prototype.SetOnChangeHandler = function( fn1 )
{
	this.onChange = fn1;

	return this;
}

MMMultiLineInput.prototype.SetOnValidateHandler = function( fn1 )
{
	this.onValidate = fn1;

	return this;
}

MMMultiLineInput.prototype.Enable = function()
{
	this.disabled						= false;
	this.element_container.className	= classNameRemove( this.element_container, 'disabled' );
	this.button_edit.Enable();
}

MMMultiLineInput.prototype.Disable = function()
{
	this.disabled						= true;
	this.element_container.className	= classNameAdd( this.element_container, 'disabled' );
	this.button_edit.Disable();
}

MMMultiLineInput.prototype.Show = function()
{
	this.visible							= true;
	this.element_container.style.display	= '';
}

MMMultiLineInput.prototype.Hide = function()
{
	this.visible							= false;
	this.element_container.style.display	= 'none';
}

MMMultiLineInput.prototype.SetInvalid = function( error_message )
{
	this.invalid_error_message = error_message;

	if ( this.invalid )
	{
		if ( typeof error_message === 'string' && error_message.length && error_message !== this.element_error_message.textContent )
		{
			this.element_error_message.textContent = error_message;

			RemoveEvent( this.element_container, 'mouseover',	this.event_mouseover_container );
			RemoveEvent( this.element_container, 'mouseout',	this.event_mouseout_container );

			AddEvent( this.element_container, 'mouseover',	this.event_mouseover_container );
			AddEvent( this.element_container, 'mouseout',	this.event_mouseout_container );
		}

		return;
	}

	this.invalid							= true;
	this.element_container.className		= classNameAdd( this.element_container, 'invalid' );

	if ( typeof error_message === 'string' && error_message.length )
	{
		this.element_error_message.textContent = error_message;

		AddEvent( this.element_container, 'mouseover',	this.event_mouseover_container );
		AddEvent( this.element_container, 'mouseout',	this.event_mouseout_container );
	}

	this.onSetInvalid();
}

MMMultiLineInput.prototype.ClearInvalid = function()
{
	if ( !this.invalid )
	{
		return;
	}

	this.invalid							= false;
	this.invalid_error_message				= '';
	this.element_error_message.textContent	= '';
	this.element_container.className		= classNameRemove( this.element_container, 'invalid' );

	RemoveEvent( this.element_container, 'mouseover',	this.event_mouseover_container );
	RemoveEvent( this.element_container, 'mouseout',	this.event_mouseout_container );

	this.Hide_Error();
	this.onClearInvalid();
}

MMMultiLineInput.prototype.GetInvalid = function()
{
	return this.invalid;
}

MMMultiLineInput.prototype.GetInvalid_Message = function()
{
	return this.invalid_error_message;
}

MMMultiLineInput.prototype.Show_Error = function()
{
	if ( this.error_visible )
	{
		return;
	}

	this.error_visible		= true;
	this.render_error_id	= requestAnimationFrame( this.event_render_error );

	document.body.appendChild( this.element_error_container );
	this.Redraw_Error();
}

MMMultiLineInput.prototype.Hide_Error = function()
{
	if ( !this.error_visible )
	{
		return;
	}

	this.error_visible = false;
	this.element_error_container.parentNode.removeChild( this.element_error_container );
	cancelAnimationFrame( window[ this.render_error_id ] );
}

MMMultiLineInput.prototype.Redraw_Error = function()
{
	var node, rect_node, dimensions, overflow_x, overflow_y, rect_container, rect_error_container, rect_container_parent, rect_error_container_parent;

	if ( !this.error_visible )
	{
		return;
	}

	dimensions					= windowDimensions();
	rect_container				= this.element_container.getBoundingClientRect();
	rect_container_parent		= this.element_container.parentNode.getBoundingClientRect();
	rect_error_container		= this.element_error_container.getBoundingClientRect();
	rect_error_container_parent	= this.element_error_container.parentNode.getBoundingClientRect();

	if ( rect_container.bottom < 0 || rect_container.top > dimensions.y || rect_container.right < 0 || rect_container.left > dimensions.x )
	{
		this.element_error_container.style.visibility = 'hidden';
		return;
	}

	node = this.element_container;

	while ( node = node.parentNode )
	{
		overflow_x = computedStyleValue( node, 'overflow-x' );
		overflow_y = computedStyleValue( node, 'overflow-y' );

		if ( ( overflow_y === 'hidden' ) ||
			 ( overflow_x === 'hidden' ) ||
			 ( ( overflow_y === 'scroll' || overflow_y === 'auto' ) && node.scrollHeight > node.clientHeight ) ||
			 ( ( overflow_x === 'scroll' || overflow_x === 'auto' ) && node.scrollWidth > node.clientWidth ) )
		{
			rect_node = node.getBoundingClientRect();

			if ( rect_container.bottom < rect_node.top || rect_container.top > rect_node.bottom || rect_container.right < rect_node.left || rect_container.left > rect_node.right )
			{
				this.element_error_container.style.visibility = 'hidden';
				return;
			}
		}
	}

	this.element_error_container.style.visibility	= '';

	if ( ( rect_container.bottom + rect_error_container.height ) > dimensions.y )
	{
		this.element_error_container.style.top		= ( rect_container.top - rect_error_container.height - rect_error_container_parent.top ) + 'px';
		this.element_error_container.className		= classNameAdd( this.element_error_container, 'above' );
	}
	else
	{
		this.element_error_container.style.top		= ( rect_container.bottom - rect_error_container_parent.top ) + 'px';
		this.element_error_container.className		= classNameRemove( this.element_error_container, 'above' );
	}

	this.element_error_container.style.left			= stoi_range( rect_container.left - rect_error_container_parent.left, 0 - rect_error_container_parent.left, dimensions.x - rect_error_container_parent.left ) + 'px';
}

MMMultiLineInput.prototype.SetValue = function( value )
{
	this.value							= value;
	this.last_value						= value;
	this.element_content.textContent	= value
}

MMMultiLineInput.prototype.GetValue = function()
{
	return this.value;
}

MMMultiLineInput.prototype.Container = function()
{
	return this.element_container;
}

MMMultiLineInput.prototype.Validate = function()
{
	this.ClearInvalid();

	if ( !this.onValidate( this.value ) )
	{
		if ( !this.GetInvalid() )
		{
			this.SetInvalid( '' );
		}

		return false;
	}

	return true;
}

MMMultiLineInput.prototype.Clear = function()
{
	this.value							= '';
	this.element_content.textContent	= '';
}

MMMultiLineInput.prototype.Render_Error = function()
{
	var dimensions, rect_container;

	if ( this.error_visible )
	{
		dimensions		= windowDimensions();
		rect_container	= this.element_container.getBoundingClientRect();

		if ( rect_container.top !== this.last_container_top ||
			 rect_container.left !== this.last_container_left ||
			 dimensions.y !== this.last_window_y ||
			 dimensions.x !== this.last_window_x )
		{
			this.last_container_top		= rect_container.top;
			this.last_container_left	= rect_container.left;
			this.last_window_y			= dimensions.y;
			this.last_window_x			= dimensions.x;

			this.Redraw_Error();
		}
	}
}

MMMultiLineInput.prototype.Event_OnMouseOver_Container = function( e )
{
	if ( this.invalid )
	{
		this.Show_Error();
	}

	return true;
}

MMMultiLineInput.prototype.Event_OnMouseOut_Container = function( e )
{
	if ( this.invalid )
	{
		this.Hide_Error();
	}

	return true;
}

MMMultiLineInput.prototype.Event_OnClick_Button = function( e )
{
	var self = this;
	var dialog;

	if ( this.disabled )
	{
		return;
	}

	dialog			= new MMTextEditorDialog( this.editor_text, this.name, this.value, false );
	dialog.onDone 	= function( value )
	{
		self.value							= value;
		self.element_content.textContent	= value;

		if ( self.last_value !== self.value )
		{
			self.last_value	= self.value;

			self.Validate();
			self.onChange( self.value );
		}
	};

	dialog.Show();
}

MMMultiLineInput.prototype.Validate_NonEmpty = function()
{
	var error = new Object();

	if ( !this.Validate_NonEmpty_Silent( error ) )
	{
		this.SetInvalid( error.error_message );

		return false;
	}

	return true;
}

MMMultiLineInput.prototype.Validate_NonEmpty_Silent = function( error /* optional */ )
{
	if ( this.value.length )
	{
		return true;
	}

	if ( getVariableType( error ) === 'object' )
	{
		error.error_message = 'Please enter a value';
	}

	return false;
}

MMMultiLineInput.prototype.onRetrieveErrorParent	= function() { return document.body; }
MMMultiLineInput.prototype.onValidate				= function( value ) { return true; };
MMMultiLineInput.prototype.onChange					= function( value ) { ; };
MMMultiLineInput.prototype.onSetInvalid				= function() { ; };
MMMultiLineInput.prototype.onClearInvalid			= function() { ; };

// MMAutoCompleteInput
////////////////////////////////////////////////////

function MMAutoCompleteInput( parent, name, value )
{
	var self = this;

	MMInput.call( this, parent, name, value );

	this.element_wrapper							= newElement( 'span', { 'class': 'mm_autocompleteinput_wrapper' },	null, null );
	this.element_autocomplete						= newElement( 'span', { 'class': 'mm_autocompleteinput_menu' },		null, this.element_wrapper );

	this.element_container.parentNode.insertBefore( this.element_wrapper, this.element_container );
	this.element_wrapper.insertBefore( this.element_container, this.element_autocomplete );

	this.entrylist									= new Array();
	this.render_id									= null;
	this.load_delegator								= null;
	this.search_timeout								= null;
	this.selected_index								= -1;
	this.menu_as_root_menu							= false;
	this.menu_as_root_menu_match_width				= false;
	this.menu_as_root_menu_match_width_as_min_width	= false;
	this.autocomplete_visible						= false;
	this.search_timeout_ms							= 200;

	this.animation_id								= GenerateUniqueID();
	this.animation_duration							= 150;
	this.animation_delta							= animationLinear;
	this.animation_item_delay						= 20;
	this.animation_item_duration					= 50;
	this.animation_item_delta						= animationLinear;

	this.menu_animating								= false;
	this.menu_animating_height						= 0;

	this.event_render								= function() { self.Render(); self.render_id = requestAnimationFrame( self.event_render ); };
	this.event_mousedown							= function( event ) { return self.Event_MouseDown_Document( event ? event : window.event ); };

	this.element_input.setAttribute( 'autocomplete', 'off' ); /* required to turn off Chrome's input suggestions dropdown */
}

DeriveFrom( MMInput, MMAutoCompleteInput );

MMAutoCompleteInput.prototype.SetAutoCompleteClassName = function( classname )
{
	this.element_autocomplete.className = classname;

	return this;
}

MMAutoCompleteInput.prototype.GetAutoCompleteClassName = function()
{
	return this.element_autocomplete.className;
}

MMAutoCompleteInput.prototype.SetMenuAsRootMenu = function( enabled, match_width )
{
	enabled		= enabled ? true : false;
	match_width	= match_width ? true : false;

	if ( this.menu_as_root_menu && !enabled )
	{
		this.element_wrapper.appendChild( this.element_autocomplete );
		cancelAnimationFrame( window[ this.render_id ] );
	}
	else if ( !this.menu_as_root_menu && enabled )
	{
		document.body.appendChild( this.element_autocomplete );
		this.render_id = requestAnimationFrame( this.event_render );
	}

	this.menu_as_root_menu				= enabled;
	this.menu_as_root_menu_match_width	= match_width;

	return this;
}

MMAutoCompleteInput.prototype.SetMenuAsRootMenu_MatchWidth = function( enabled, match_as_min_width /* optional */ )
{
	this.menu_as_root_menu_match_width				= enabled ? true : false;
	this.menu_as_root_menu_match_width_as_min_width	= match_as_min_width ? true : false;

	return this;
}

MMAutoCompleteInput.prototype.SetSearchTimeout = function( milliseconds /* 0 for no timeout */ )
{
	this.search_timeout_ms = milliseconds;

	return this;
}

MMAutoCompleteInput.prototype.SetOnSearchHandler = function( fn1 )
{
	this.onSearch = fn1;

	return this;
}

MMAutoCompleteInput.prototype.SetOnPopulateEntryHandler = function( fn1 )
{
	this.onPopulateEntry = fn1;

	return this;
}

MMAutoCompleteInput.prototype.SetOnEntrySelectedHandler = function( fn1 )
{
	this.onEntrySelected = fn1;

	return this;
}

MMAutoCompleteInput.prototype.Clear = function()
{
	this.element_input.value = '';
}

MMAutoCompleteInput.prototype.AutoComplete_Show = function()
{
	var self = this;
	var i, delay, i_len, max_height, padding_top, animationlist, padding_bottom, visible_item_count, first_visible_item, onstart, oncomplete;

	if ( this.autocomplete_visible )
	{
		return;
	}

	this.autocomplete_visible						= true;
	this.menu_animating								= true;

	this.element_autocomplete.style.display			= 'block';
	this.element_autocomplete.style.maxHeight		= '';
	this.element_autocomplete.style.paddingTop		= '';
	this.element_autocomplete.style.paddingBottom	= '';

	this.Redraw_AutoComplete_Position();

	delay				= ( this.animation_duration / 2 );
	animationlist		= new Array();

	max_height			= stoi_def( computedStyleValue( this.element_autocomplete, 'max-height' ), 300 );
	padding_top			= stoi_def( computedStyleValue( this.element_autocomplete, 'padding-top' ), 15 );
	padding_bottom		= stoi_def( computedStyleValue( this.element_autocomplete, 'padding-bottom' ), 15 );

	if ( this.entrylist.length )
	{
		for ( i = 0, i_len = this.entrylist.length; i < i_len; i++ )
		{
			this.entrylist[ i ].style.opacity		= '';
			this.entrylist[ i ].style.transform		= '';
		}

		visible_item_count	= Math.ceil( Math.min( this.element_autocomplete.offsetHeight, max_height ) / this.entrylist[ 0 ].offsetHeight );
		first_visible_item	= stoi_def_nonneg( Math.floor( this.element_autocomplete.scrollTop / this.entrylist[ 0 ].offsetHeight ), 0 );

		for ( i = first_visible_item, i_len = Math.min( this.entrylist.length, first_visible_item + visible_item_count ); i < i_len; i++ )
		{
			delay = this.AutoComplete_Show_AnimateMenuItem( animationlist, delay, this.entrylist[ i ] );
		}
	}

	onstart = function()
	{
		self.menu_animating							= true;
		self.menu_animating_height					= Math.min( self.element_autocomplete.offsetHeight, max_height );
		self.element_autocomplete.style.display		= 'block';
		self.element_autocomplete.style.overflow	= 'hidden';
	}

	oncomplete = function()
	{
		var i, i_len;

		self.element_autocomplete.style.overflow	= '';
		self.menu_animating_height					= 0;
		self.menu_animating							= false;

		for ( i = 0, i_len = self.entrylist.length; i < i_len; i++ )
		{
			self.entrylist[ i ].style.opacity		= '';
			self.entrylist[ i ].style.transform		= '';
		}

		self.Redraw_AutoComplete_Position();

		if ( self.wait_set_index !== null )
		{
			self.Select_Item( self.wait_set_index, self.wait_set_scroll_to_node );
		}

		AddEvent( document, 'mousedown', self.event_mousedown );
	}

	animationlist.push( createAnimation(
	{
		delay: 0,
		duration: this.animation_duration,
		delta: this.animation_delta,
		step: function( delta )
		{
			self.element_autocomplete.style.maxHeight		= ( delta * self.menu_animating_height ) + 'px';
			self.element_autocomplete.style.paddingTop		= ( delta * padding_top ) + 'px';
			self.element_autocomplete.style.paddingBottom	= ( delta * padding_bottom ) + 'px';
		}
	} ) );

	cancelAnimationFrame( window[ this.animation_id ] );
	beginAnimations( animationlist, this.animation_id, onstart, oncomplete );
}

MMAutoCompleteInput.prototype.AutoComplete_Show_AnimateMenuItem = function( animationlist, delay, element_item )
{
	element_item.style.opacity		= 0;
	element_item.style.transform	= 'translateX(-20px)';

	animationlist.push( createAnimation(
	{
		delay: delay,
		duration: this.animation_item_duration,
		delta: this.animation_item_delta,
		step: function( delta )
		{
			element_item.style.opacity		= delta;
			element_item.style.transform	= 'translateX(' + ( ( 1 - delta ) * -20 ) + 'px)';
		},
		oncomplete: function()
		{
			element_item.style.opacity		= '';
			element_item.style.transform	= '';
		}
	} ) );

	return delay + this.animation_item_delay;
}

MMAutoCompleteInput.prototype.AutoComplete_Hide = function()
{
	var self = this;
	var i, delay, max_height, padding_top, animationlist, padding_bottom, last_visible_item, visible_item_count, onstart, oncomplete;

	//
	// Always cancel the delegator and clear the search timeout,
	// regardless of whether or not the autocomplete menu is visible
	//

	if ( this.load_delegator )
	{
		this.load_delegator.Cancel();
		this.load_delegator = null;
	}

	if ( this.search_timeout )
	{
		clearTimeout( this.search_timeout );
		this.search_timeout = null;
	}

	if ( !this.autocomplete_visible )
	{
		return;
	}

	this.autocomplete_visible	= false;

	RemoveEvent( document, 'mousedown', this.event_mousedown );

	delay						= 0;
	animationlist				= new Array();

	max_height					= stoi_def( computedStyleValue( this.element_autocomplete, 'max-height' ), 300 );
	padding_top					= stoi_def( computedStyleValue( this.element_autocomplete, 'padding-top' ), 15 );
	padding_bottom				= stoi_def( computedStyleValue( this.element_autocomplete, 'padding-bottom' ), 15 );

	if ( this.entrylist.length )
	{
		visible_item_count		= Math.ceil( Math.min( this.element_autocomplete.offsetHeight, max_height ) / this.entrylist[ 0 ].offsetHeight );
		last_visible_item		= visible_item_count + Math.ceil( this.element_autocomplete.scrollTop / this.entrylist[ 0 ].offsetHeight );

		for ( i = Math.min( this.entrylist.length - 1, last_visible_item ); i >= 0; i-- )
		{
			delay				= this.AutoComplete_Hide_AnimateMenuItem( animationlist, delay, this.entrylist[ i ] );
		}
	}

	onstart = function()
	{
		var i, i_len;

		self.menu_animating							= true;
		self.element_autocomplete.style.display		= 'block';
		self.element_autocomplete.style.overflow	= 'hidden';
		self.menu_animating_height					= Math.min( self.element_autocomplete.offsetHeight, max_height );

		for ( i = 0, i_len = self.entrylist.length; i < i_len; i++ )
		{
			self.entrylist[ i ].style.opacity		= '';
			self.entrylist[ i ].style.transform		= '';
		}
	}

	oncomplete = function()
	{
		self.element_autocomplete.style.display		= 'none';
		self.element_autocomplete.style.overflow	= '';
		self.menu_animating_height					= 0;
		self.menu_animating							= false;
	}

	animationlist.push( createAnimation(
	{
		delay: stod_max( ( this.animation_item_duration * this.entrylist.length ) / 2, this.animation_duration ),
		duration: this.animation_duration,
		delta: this.animation_delta,
		step: function( delta )
		{
			self.element_autocomplete.style.maxHeight		= ( self.menu_animating_height - ( delta * self.menu_animating_height ) ) + 'px';
			self.element_autocomplete.style.paddingTop		= ( padding_top - ( delta * padding_top ) ) + 'px';
			self.element_autocomplete.style.paddingBottom	= ( padding_bottom - ( delta * padding_bottom ) ) + 'px';
		}
	} ) );

	cancelAnimationFrame( window[ this.animation_id ] );
	beginAnimations( animationlist, this.animation_id, onstart, oncomplete );
}

MMAutoCompleteInput.prototype.AutoComplete_Hide_AnimateMenuItem = function( animationlist, delay, element_item )
{
	element_item.style.opacity		= 1;
	element_item.style.transform	= 'translateX(0)';

	animationlist.push( createAnimation(
	{
		delay: delay,
		duration: this.animation_item_duration,
		delta: this.animation_item_delta,
		step: function( delta )
		{
			element_item.style.opacity		= ( 1 - delta );
			element_item.style.transform	= 'translateX(' + ( delta * -20 ) + 'px)';
		},
		oncomplete: function()
		{
			element_item.style.opacity		= '0';
			element_item.style.transform	= '';
		}
	} ) );

	return delay + 30;
}

MMAutoCompleteInput.prototype.AutoComplete_RecalculateMenuHeight = function()
{
	this.element_autocomplete.style.maxHeight = '';

	if ( this.menu_animating )	this.menu_animating_height					= stoi_def( computedStyleValue( this.element_autocomplete, 'max-height' ), 300 );
	else						this.element_autocomplete.style.maxHeight	= stoi_def( computedStyleValue( this.element_autocomplete, 'max-height' ), 300 );
}

MMAutoCompleteInput.prototype.Empty = function()
{
	this.entrylist						= new Array();
	this.selected_index					= -1;
	this.element_autocomplete.innerHTML	= '';
}

MMAutoCompleteInput.prototype.Search = function()
{
	var self = this;

	if ( this.load_delegator )
	{
		this.load_delegator.Cancel();
		this.load_delegator = null;
	}

	this.load_delegator				= new AJAX_ThreadPool( 1 );
	this.load_delegator.onComplete	= function() { self.load_delegator = null; };

	this.onSearch( this.element_input.value, function( datalist ) { self.Search_Callback( datalist ); }, this.load_delegator );

	if ( this.load_delegator && this.load_delegator.Queue_Count() )
	{
		//
		// Verify we've actually added to the load delegator before calling Run. If
		// load delegator is not used and we immediately trigger Search_Callback,
		// this.load_delegator might not exist, or will have an empty queue
		//

		this.load_delegator.Run();
	}
}

MMAutoCompleteInput.prototype.Search_Callback = function( datalist )
{
	var i, i_len;

	this.Empty();

	if ( !datalist || datalist.length == 0 )
	{
		return this.AutoComplete_Hide();
	}

	for ( i = 0, i_len = datalist.length; i < i_len; i++ )
	{
		this.CreateEntry( datalist[ i ] );
	}

	this.Select_Next();

	if ( !this.autocomplete_visible )	this.AutoComplete_Show();
	else								this.AutoComplete_RecalculateMenuHeight();
}

MMAutoCompleteInput.prototype.CreateEntry = function( data )
{
	var self = this;
	var index, entry;

	entry					= newElement( 'span', { 'class': 'mm_autocompleteinput_entry' }, null, this.element_autocomplete );
	entry.onclick			= function( event ) { return self.Event_OnClick_Entry( event ? event : window.event, entry, data ); }

	index					= this.entrylist.length;
	this.entrylist[ index ] = entry;

	this.onPopulateEntry( entry, data );
	AddEvent( entry, 'mousemove', function( event ) { return self.Select_Item( index, true ); } );

	return entry;
}

MMAutoCompleteInput.prototype.Select_Item = function( index, scroll_to_node )
{
	var selected_offset, selected_height;

	if ( !this.autocomplete_visible || this.menu_animating )
	{
		this.wait_set_index				= index;
		this.wait_set_scroll_to_node	= scroll_to_node;

		return;
	}

	this.wait_set_index					= null;
	this.wait_set_scroll_to_node		= null;

	if ( this.selected_index != -1 )
	{
		this.entrylist[ this.selected_index ].className	= classNameRemove( this.entrylist[ this.selected_index ], 'selected' );
	}

	if ( index < 0 || index > this.entrylist.length )
	{
		this.selected_index				= -1;
		return;
	}

	this.selected_index					= index;
	this.entrylist[ index ].className	= classNameAdd( this.entrylist[ index ], 'selected' );

	if ( scroll_to_node )
	{
		selected_offset					= this.entrylist[ index ].offsetTop;
		selected_height					= this.entrylist[ index ].offsetHeight;

		if ( selected_offset < this.element_autocomplete.scrollTop )
		{
			this.element_autocomplete.scrollTop	= selected_offset;
		}
		else if ( selected_offset > ( this.element_autocomplete.offsetHeight + this.element_autocomplete.scrollTop - selected_height ) )
		{
			this.element_autocomplete.scrollTop	= selected_offset + selected_height - this.element_autocomplete.offsetHeight;
		}
	}
}

MMAutoCompleteInput.prototype.Select_Previous = function()
{
	var index = this.selected_index;

	if ( index <= 0 )
	{
		index = this.entrylist.length - 1;
	}
	else
	{
		index = index - 1;
	}

	this.Select_Item( index, true );
}

MMAutoCompleteInput.prototype.Select_Next = function()
{
	var index = this.selected_index;

	if ( ( index < 0 ) ||
		 ( index >= ( this.entrylist.length - 1 ) ) )
	{
		index = 0;
	}
	else
	{
		index = index + 1;
	}

	this.Select_Item( index, true );
}

MMAutoCompleteInput.prototype.Render = function()
{
	if ( this.autocomplete_visible )
	{
		this.Redraw_AutoComplete_Position();
	}
}

MMAutoCompleteInput.prototype.Redraw_AutoComplete_Position = function()
{
	var node, height, rect_menu, rect_node, dimensions, overflow_x, overflow_y, rect_container, scrollfromtop, scrollfromleft, rect_menu_parent;

	rect_menu			= this.element_autocomplete.getBoundingClientRect();
	rect_container		= this.element_container.getBoundingClientRect();
	rect_menu_parent	= this.element_autocomplete.parentNode.getBoundingClientRect();

	if ( !this.menu_as_root_menu )
	{
		if ( rect_menu.top !== rect_container.bottom || rect_menu.left !== rect_container.left )
		{
			this.element_autocomplete.style.top		= ( rect_container.bottom - rect_menu_parent.top ) + 'px';
			this.element_autocomplete.style.left	= ( rect_container.left - rect_menu_parent.left ) + 'px';
		}
	}
	else
	{
		node				= this.element_container;
		dimensions			= windowDimensions();

		while ( ( node = node.parentNode ) && node !== document.documentElement )
		{
			overflow_x		= computedStyleValue( node, 'overflow-x' );
			overflow_y		= computedStyleValue( node, 'overflow-y' );

			if ( ( overflow_y === 'hidden' ) ||
				 ( overflow_x === 'hidden' ) ||
				 ( ( overflow_y === 'scroll' || overflow_y === 'auto' ) && node.scrollHeight > node.clientHeight ) ||
				 ( ( overflow_x === 'scroll' || overflow_x === 'auto' ) && node.scrollWidth > node.clientWidth ) )
			{
				rect_node	= node.getBoundingClientRect();

				if ( rect_container.bottom < rect_node.top || rect_container.top > rect_node.bottom || rect_container.right < rect_node.left || rect_container.left > rect_node.right )
				{
					this.element_autocomplete.style.visibility = 'hidden';
					return;
				}
			}
		}

		overflow_x		= computedStyleValue( this.element_autocomplete.parentNode, 'overflow-x' );
		overflow_y		= computedStyleValue( this.element_autocomplete.parentNode, 'overflow-y' );
		scrollfromtop	= ( ( overflow_y === 'scroll' || overflow_y === 'auto' ) ? this.element_autocomplete.parentNode.scrollTop : 0 );
		scrollfromleft	= ( ( overflow_x === 'scroll' || overflow_x === 'auto' ) ? this.element_autocomplete.parentNode.scrollLeft : 0 );

		height			= stod_max( ( this.menu_animating ? this.menu_animating_height : rect_menu.height ), ( dimensions.y / 2 ) - rect_container.height );

		if ( this.menu_animating )					this.menu_animating_height = height;
		else if ( rect_menu.height !== height )		this.element_autocomplete.style.maxHeight = height + 'px';

		if ( ( rect_container.bottom + height ) > dimensions.y )
		{
			if ( rect_menu.bottom !== rect_container.top )
			{
				this.element_autocomplete.style.top			= 'auto';
				this.element_autocomplete.style.bottom		= ( rect_menu_parent.bottom - rect_container.top + scrollfromtop ) + 'px';
				this.element_autocomplete.className			= classNameAdd( this.element_autocomplete, 'above' );
			}
		}
		else
		{
			if ( rect_menu.top !== rect_container.bottom )
			{
				this.element_autocomplete.style.top			= ( rect_container.bottom - rect_menu_parent.top + scrollfromtop ) + 'px';
				this.element_autocomplete.style.bottom		= 'auto';
				this.element_autocomplete.className			= classNameRemove( this.element_autocomplete, 'above' );
			}
		}

		if ( rect_menu.left !== rect_container.left )
		{
			this.element_autocomplete.style.left			= ( rect_container.left - rect_menu_parent.left ) + 'px';
		}

		this.element_autocomplete.style.visibility			= '';
	}

	if ( this.menu_as_root_menu_match_width && this.menu_as_root_menu_match_width_as_min_width && rect_menu.width < rect_container.width )
	{
		this.element_autocomplete.style.minWidth		= rect_container.width + 'px';
	}
	else if ( this.menu_as_root_menu_match_width && !this.menu_as_root_menu_match_width_as_min_width && rect_menu.width !== rect_container.width )
	{
		this.element_autocomplete.style.minWidth		= rect_container.width + 'px';
		this.element_autocomplete.style.maxWidth		= rect_container.width + 'px';
	}
}

MMAutoCompleteInput.prototype.AddKeyStackEntry = function()
{
	var self = this;

	MMInput.prototype.AddKeyStackEntry.call( this );

	KeyDownHandlerStackEntry_AddKeyCode( this.keystackentry, 9,		function( e ) { return self.Event_OnTab_Input( e ); } );
	KeyDownHandlerStackEntry_AddKeyCode( this.keystackentry, 38,	function( e ) { return self.Event_OnArrowUp_Input( e ); } );
	KeyDownHandlerStackEntry_AddKeyCode( this.keystackentry, 40,	function( e ) { return self.Event_OnArrowDown_Input( e ); } );
}

MMAutoCompleteInput.prototype.Event_OnBlur_Input = function( e )
{
	if ( this.autocomplete_visible )
	{
		this.AutoComplete_Hide();
	}

	return MMInput.prototype.Event_OnBlur_Input.call( this, e );
}

MMAutoCompleteInput.prototype.Event_OnKeyUp_Input = function( e )
{
	var self = this;
	var keycode = e.keyCode || e.which;

	if ( this.disabled )
	{
		return true;
	}

	if ( this.last_validated_value !== this.element_input.value )
	{
		this.last_validated_value = this.element_input.value;

		if ( !this.Validate() )
		{
			return true;
		}
	}

	if ( keycode == 9 || keycode == 13 || keycode == 27 )
	{
		return;
	}
	else if ( keycode !== 40 && keycode !== 38 && this.element_input.value.length == 0 )
	{
		this.last_value = '';

		return this.AutoComplete_Hide();
	}
	else if ( this.autocomplete_visible && this.last_value == this.element_input.value )
	{
		return;
	}

	this.last_value = this.element_input.value;

	if ( this.search_timeout )
	{
		clearTimeout( this.search_timeout );
		this.search_timeout = null;
	}

	if ( ( keycode == 38 /* Up Arrow */ ) || ( keycode == 40 /* Down Arrow */ ) )
	{
		return this.Search();
	}

	if ( this.search_timeout_ms === 0 )	this.Search();
	else								this.search_timeout = setTimeout( function() { self.Search(); }, this.search_timeout_ms );
}

MMAutoCompleteInput.prototype.Event_OnEnter_Input = function( e )
{
	if ( this.disabled )
	{
		eventStopPropagation( e );
		return eventPreventDefault( e );
	}

	if ( this.autocomplete_visible && this.selected_index != -1 && this.entrylist[ this.selected_index ] )
	{
		dispatchNewEvent( this.entrylist[ this.selected_index ], 'click' );
		this.AutoComplete_Hide();

		eventStopPropagation( e );
		return eventPreventDefault( e );
	}

	return MMInput.prototype.Event_OnEnter_Input.call( this, e );
}

MMAutoCompleteInput.prototype.Event_OnEsc_Input = function( e )
{
	if ( this.disabled )
	{
		eventStopPropagation( e );
		return eventPreventDefault( e );
	}

	if ( this.autocomplete_visible )
	{
		this.AutoComplete_Hide();

		eventStopPropagation( e );
		return eventPreventDefault( e );
	}

	return MMInput.prototype.Event_OnEsc_Input.call( this, e );
}

MMAutoCompleteInput.prototype.Event_OnTab_Input = function( e )
{
	this.AutoComplete_Hide();
}

MMAutoCompleteInput.prototype.Event_OnArrowUp_Input = function( e )
{
	if ( this.disabled || !this.autocomplete_visible )
	{
		return true;
	}

	this.Select_Previous();

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

MMAutoCompleteInput.prototype.Event_OnArrowDown_Input = function( e )
{
	if ( this.disabled || !this.autocomplete_visible )
	{
		return true;
	}

	this.Select_Next();

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

MMAutoCompleteInput.prototype.Event_MouseDown_Document = function( e )
{
	var target = e.target || e.srcElement;

	if ( !this.autocomplete_visible )
	{
		return;
	}

	if ( this.element_input == target ||
		 this.element_autocomplete == target ||
		 containsChild( this.element_autocomplete, target ) )
	{
		return eventPreventDefault( e );
	}

	this.AutoComplete_Hide();
}

MMAutoCompleteInput.prototype.Event_OnClick_Entry = function( e, entry, data )
{
	if ( entry !== null )
	{
		this.onEntrySelected( entry, data );
	}

	this.AutoComplete_Hide();

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

MMAutoCompleteInput.prototype.onSearch			= function( value, callback, delegator ) { callback( null ); }
MMAutoCompleteInput.prototype.onPopulateEntry	= function( entry, data ) { ; }
MMAutoCompleteInput.prototype.onEntrySelected	= function( entry, data ) { ; }

// MMTextArea
////////////////////////////////////////////////////

function MMTextArea( parent, name, value )
{
	value									= GetNormalizedValue( value );

	this.visible							= true;
	this.disabled							= false;
	this.readonly							= false;
	this.resize_enabled						= false;
	this.resize_vertical					= false;
	this.resize_horizontal					= false;
	this.select_on_focus					= false;
	this.force_render_resize				= false;
	this.invalid							= false;
	this.invalid_error_message				= '';
	this.error_visible						= false;
	this.error_match_container_width		= false;
	this.trigger_onenter_without_modifier	= false;
	this.focused							= false;
	this.keystackentry						= null;
	this.value								= value;
	this.scrollbar_dimensions				= calculateScrollBarDimensions();
	this.last_validated_value				= this.value;
	this.last_container_top					= null;
	this.last_container_left				= null;
	this.last_window_y						= null;
	this.last_window_x						= null;
	this.autoheight_enabled					= false;
	this.autoheight_start_height			= 44;
	this.autoheight_max_height				= 0;
	this.tab_index							= 0;

	this.element_parent						= typeof parent === 'string' ? document.getElementById( parent ) : parent;
	this.element_container					= newElement( 'span',		{ 'class': 'mm_textarea' }, 								null, this.element_parent );
	this.element_title						= newElement( 'span',		{ 'class': 'mm_textarea_title' },		 					null, this.element_container );
	this.element_title_text					= newElement( 'span',		{ 'class': 'mm_textarea_title_text' },		 				null, this.element_title );
	this.element_title_tooltip				= newElement( 'span',		{ 'class': 'mm_textarea_title_tooltip' },		 			null, this.element_title );
	this.element_textarea_container			= newElement( 'span',		{ 'class': 'mm_textarea_container' }, 						null, this.element_container );
	this.element_textarea_scroller			= newElement( 'span',		{ 'class': 'mm_textarea_scroller' },						null, this.element_textarea_container );
	this.element_textarea_calculator 		= newElement( 'textarea',	{ 'class': 'mm_textarea_editor mm_textarea_calculator' },	null, this.element_textarea_scroller );
	this.element_textarea					= newElement( 'textarea',	{ 'class': 'mm_textarea_editor', 'name': name },			null, this.element_textarea_scroller );
	this.element_resizer					= newElement( 'span',		{ 'class': 'mm_textarea_resizer' },							null, this.element_textarea_container );
	this.element_error_icon					= newElement( 'span', 		{ 'class': 'mm_textarea_error_icon' },	 					null, this.element_textarea_container );
	this.element_error_container			= newElement( 'span',		{ 'class': 'mm_textarea_error_container', 'popover': '' },	null, this.element_container );
	this.element_error_message				= newElement( 'span',		{ 'class': 'mm_textarea_error_message' },					null, this.element_error_container );
	this.element_error_tail					= newElement( 'span',		{ 'class': 'mm_textarea_error_tail' },						null, this.element_error_container );

	this.element_error_icon.innerHTML		= MivaSVGIconMap( 'field-warning-icon' );

	this.event_render_read					= ( data ) => { this.Render_Read( data ); };
	this.event_render_write					= ( data ) => { this.Render_Write( data ); };
	this.event_resizer_mousedown			= ( e ) => { this.Event_ResizerMouseDown( e ); };
	this.event_resizer_mousemove			= ( e ) => { this.Event_ResizerMouseMove( e ); };
	this.event_resizer_mouseup				= ( e ) => { this.Event_ResizerMouseUp( e ); };
	this.event_mouseover_textarea_container	= () => { this.Show_Error(); };
	this.event_mouseout_textarea_container	= () => { this.Hide_Error(); };

	this.element_textarea_container.addEventListener( 	'mousedown',	( e ) => { this.Event_OnMouseDown_TextArea_Container( e ); } );
	this.element_textarea.addEventListener( 			'focus',		( e ) => { this.Event_OnFocus_Input( e ); } );
	this.element_textarea.addEventListener( 			'blur',			( e ) => { this.Event_OnBlur_Input( e ); } );
	this.element_textarea.addEventListener( 			'input',		( e ) => { this.Event_OnInput_Input( e ); } );
	this.element_textarea.addEventListener( 			'change',		( e ) => { this.Event_OnChange_Input( e ); } );
	this.element_textarea.addEventListener( 			'keydown',		( e ) => { this.Event_OnKeyDown_Input( e ); } );
	this.element_textarea.addEventListener( 			'keyup',		( e ) => { this.Event_OnKeyUp_Input( e ); } );
	this.element_textarea.addEventListener( 			'cut',			( e ) => { this.Event_OnCut_Input( e ); } );
	this.element_textarea.addEventListener( 			'paste',		( e ) => { this.Event_OnPaste_Input( e ); } );
	this.element_title_text.addEventListener( 			'click',		( e ) => { this.Event_OnClick_Title( e ); } );
	this.element_error_container.addEventListener(		'toggle',		( e ) => { this.Event_OnToggle_ErrorContainer( e ); } );

	MMRender_onRender_AddHook( this.event_render_read, this.event_render_write );

	this.SetValue( this.value );
	this.SetResizeEnabled();
}

MMTextArea.prototype.CreateToolTipMenuButton = function()
{
	if ( this.tooltip )
	{
		return;
	}

	this.tooltip = newElement( 'mm-tooltip', null, null, this.element_title_tooltip );
}

MMTextArea.prototype.AddToParent = function( element_parent )
{
	this.element_parent = element_parent;
	this.element_parent.appendChild( this.element_container );
}

MMTextArea.prototype.SetAutoComplete = function( enabled )
{
	this.element_textarea.autocomplete = enabled ? 'on' : 'off';
}

MMTextArea.prototype.SetTitle = function( text )
{
	this.element_title_text.textContent = text;

	return this;
}

MMTextArea.prototype.SetName = function( name )
{
	this.element_textarea.name = name;
}

MMTextArea.prototype.SetToolTip = function( node_or_text )
{
	this.CreateToolTipMenuButton();

	if ( typeof node_or_text !== 'string' )	this.tooltip.tooltip_custom	= node_or_text;
	else									this.tooltip.tooltip		= node_or_text;

	return this;
}

MMTextArea.prototype.SetTabIndex = function( index )
{
	this.tab_index					= index;
	this.element_textarea.tabIndex	= index;
}

MMTextArea.prototype.GetTabIndex = function()
{
	return this.tab_index;
}

MMTextArea.prototype.SetPlaceholderText = function( text )
{
	this.element_textarea.setAttribute( 'placeholder', text );

	return this;
}

MMTextArea.prototype.SetClassName = function( classname )
{
	this.element_container.className = classname;

	return this;
}

MMTextArea.prototype.AddClassName = function( classname )
{
	classNameAddIfMissing( this.element_container, classname );

	return this;
}

MMTextArea.prototype.RemoveClassName = function( classname, allow_regex_in_classname )
{
	classNameRemoveIfPresent( this.element_container, classname, allow_regex_in_classname );

	return this;
}

MMTextArea.prototype.ReplaceClassName = function( classname, replacement_classname, allow_regex_in_classname )
{
	classNameReplaceIfAltered( this.element_container, classname, replacement_classname, allow_regex_in_classname );
}

MMTextArea.prototype.ClassNameContains = function( classname, allow_regex_in_classname )
{
	return classNameContains( this.element_container, classname, allow_regex_in_classname );
}

MMTextArea.prototype.GetClassName = function()
{
	return this.element_container.className;
}

MMTextArea.prototype.SetErrorMessageMatchContainerWidth = function( match_width )
{
	this.error_match_container_width = match_width;

	return this;
}

MMTextArea.prototype.SetErrorClassName = function( classname )
{
	this.element_error_container.className = classname;

	return this;
}

MMTextArea.prototype.GetErrorClassName = function()
{
	return this.element_error_container.className;
}

MMTextArea.prototype.SetOnFocusHandler = function( fn1 )
{
	this.onFocus = fn1;

	return this;
}

MMTextArea.prototype.SetOnBlurHandler = function( fn1 )
{
	this.onBlur = fn1;

	return this;
}

MMTextArea.prototype.SetOnChangeHandler = function( fn1 )
{
	this.onChange = fn1;

	return this;
}

MMTextArea.prototype.SetOnValidateHandler = function( fn1 )
{
	this.onValidate = fn1;

	return this;
}

MMTextArea.prototype.SetOnEnterHandler = function( fn1 )
{
	this.onEnter = fn1;

	return this;
}

MMTextArea.prototype.SetTriggerOnEnterWithoutModifier = function( enabled )
{
	this.trigger_onenter_without_modifier = enabled;

	return this;
}

MMTextArea.prototype.SetOnEscapeHandler = function( fn1 )
{
	this.onEsc = fn1;

	return this;
}

MMTextArea.prototype.SetMaxLength = function( length )
{
	this.element_textarea.setAttribute( 'maxlength', length );
	return this;
}

MMTextArea.prototype.SetAutoHeightEnabled = function( start_height, optional_max_height )
{
	this.SetResizeDisabled();

	this.autoheight_enabled			= true;
	this.autoheight_start_height	= stoi_def_nonneg( start_height, 44 );
	this.autoheight_max_height		= stoi_def_nonneg( optional_max_height, 0 );

	this.resize_horizontal			= false;
	this.resize_vertical			= true;
	this.force_render_resize		= true;

	return this;
}

MMTextArea.prototype.SetAutoHeightEnabled_StartHeight = function( start_height )
{
	this.autoheight_start_height	= stoi_def_nonneg( start_height, 44 );
	this.force_render_resize		= true;

	return this;
}

MMTextArea.prototype.SetAutoHeightEnabled_MaxHeight = function( max_height )
{
	this.autoheight_max_height	= stoi_def_nonneg( max_height, 0 );
	this.force_render_resize	= true;

	return this;
}

MMTextArea.prototype.SetAutoHeightDisabled = function()
{
	this.autoheight_enabled		= false;
	this.force_render_resize	= true;

	return this;
}

MMTextArea.prototype.Enable = function()
{
	this.disabled					= false;
	this.element_textarea.tabIndex	= this.tab_index;

	classNameRemoveIfPresent( this.element_container, 'disabled' );
}

MMTextArea.prototype.Disable = function()
{
	var focus_element = getFocusElement();

	this.disabled					= true;
	this.element_textarea.tabIndex	= -1;

	classNameAddIfMissing( this.element_container, 'disabled' );

	if ( focus_element === this.element_container || containsChild( this.element_container, focus_element ) )
	{
		focus_element.blur();
	}
}

MMTextArea.prototype.IsEnabled = function()
{
	return !this.disabled;
}

MMTextArea.prototype.SetReadOnly = function( readonly )
{
	this.readonly = readonly ? true : false;

	if ( this.readonly )
	{
		this.element_textarea.setAttribute( 'readonly', true );
		classNameAddIfMissing( this.element_container, 'readonly' );
	}
	else
	{
		this.element_textarea.removeAttribute( 'readonly' );
		classNameRemoveIfPresent( this.element_container, 'readonly' );
	}
}

MMTextArea.prototype.GetReadOnly = function()
{
	return this.readonly;
}

MMTextArea.prototype.SetSelectOnFocus = function( select_on_focus )
{
	this.select_on_focus = select_on_focus ? true : false;
}

MMTextArea.prototype.SetResizeEnabled = function( options )
{
	this.resize_enabled		= true;
	this.resize_vertical	= true;
	this.resize_horizontal	= true;

	if ( options )
	{
		if ( options.hasOwnProperty( 'vertical' ) )		this.resize_vertical	= options.vertical;
		if ( options.hasOwnProperty( 'horizontal' ) )	this.resize_horizontal	= options.horizontal;
	}

	if ( this.resize_vertical )		classNameAddIfMissing( this.element_resizer, 'vertical' );
	else							classNameRemoveIfPresent( this.element_resizer, 'vertical' );

	if ( this.resize_horizontal )	classNameAddIfMissing( this.element_resizer, 'horizontal' );
	else							classNameRemoveIfPresent( this.element_resizer, 'horizontal' );

	classNameAddIfMissing( this.element_resizer, 'enabled' );
	AddEvent( this.element_resizer, 'mousedown', this.event_resizer_mousedown );

	this.SetAutoHeightDisabled();
}

MMTextArea.prototype.SetResizeDisabled = function()
{
	this.resize_enabled = false;

	classNameRemoveIfPresent( this.element_resizer, 'vertical' );
	classNameRemoveIfPresent( this.element_resizer, 'horizontal' );
	classNameRemoveIfPresent( this.element_resizer, 'enabled' );
	RemoveEvent( this.element_resizer, 'mousedown', this.event_resizer_mousedown );
}

MMTextArea.prototype.Show = function()
{
	this.visible = true;
	classNameRemoveIfPresent( this.element_container, 'hidden' );
}

MMTextArea.prototype.Hide = function()
{
	this.visible = false;
	classNameAddIfMissing( this.element_container, 'hidden' );
}

MMTextArea.prototype.Focus = function()
{
	if ( this.disabled )
	{
		return;
	}

	this.element_textarea.focus();
}

MMTextArea.prototype.Blur = function()
{
	var focus_element;

	if ( this.element_textarea.ownerDocument )
	{
		focus_element = getFocusElement( this.element_textarea.ownerDocument );

		if ( focus_element === this.element_textarea )
		{
			this.element_textarea.blur();
		}
	}
}

MMTextArea.prototype.HasFocus = function()
{
	return !this.disabled && this.focused;
}

MMTextArea.prototype.Select = function()
{
	if ( this.disabled )
	{
		return;
	}

	this.element_textarea.focus();
	this.element_textarea.select();
}

MMTextArea.prototype.SetInvalid = function( error_message )
{
	this.invalid_error_message = error_message;

	this.element_container.removeEventListener( 'mouseover', this.event_mouseover_container, false );
	this.element_container.removeEventListener( 'mouseout',	 this.event_mouseout_container, false );

	if ( this.invalid )
	{
		if ( typeof error_message === 'string' && error_message.length && error_message !== this.element_error_message.textContent )
		{
			this.element_error_message.textContent = error_message;

			this.element_container.addEventListener( 'mouseover', this.event_mouseover_textarea_container, false );
			this.element_container.addEventListener( 'mouseout',  this.event_mouseout_textarea_container, false );
		}

		return;
	}

	this.invalid = true;
	this.element_container.classList.add( 'invalid' );

	if ( typeof error_message === 'string' && error_message.length )
	{
		this.element_error_message.textContent = error_message;

		this.element_container.addEventListener( 'mouseover', this.event_mouseover_textarea_container, false );
		this.element_container.addEventListener( 'mouseout',  this.event_mouseout_textarea_container, false );
	}

	this.onSetInvalid();
}

MMTextArea.prototype.ClearInvalid = function()
{
	if ( !this.invalid )
	{
		return;
	}

	if ( this.error_visible )
	{
		this.element_error_container.hidePopover?.();
	}

	this.invalid							= false;
	this.invalid_error_message				= '';
	this.element_error_message.textContent	= '';

	this.element_container.classList.remove( 'invalid' );

	this.element_container.removeEventListener( 'mouseover', this.element_container, false );
	this.element_container.removeEventListener( 'mouseout',	 this.element_container, false );

	this.Hide_Error();
	this.onClearInvalid();
}

MMTextArea.prototype.GetInvalid = function()
{
	return this.invalid;
}

MMTextArea.prototype.GetInvalid_Message = function()
{
	return this.invalid_error_message;
}

MMTextArea.prototype.Show_Error = function()
{
	if ( this.error_visible || !this.invalid || !this.element_error_message.textContent.length )
	{
		return;
	}

	this.element_error_container.showPopover?.();

	this.error_visible = true;

	this.Redraw_Error();
}

MMTextArea.prototype.Hide_Error = function()
{
	if ( !this.error_visible )
	{
		return;
	}

	this.element_error_container.hidePopover?.();
	this.error_visible = false;
}

MMTextArea.prototype.Event_OnToggle_ErrorContainer = function( e )
{
	if ( e.newState === 'open' ) 	this.Show_Error();
	else							this.Hide_Error();
}

MMTextArea.prototype.Redraw_Error = function()
{
	var node;

	if ( !this.error_visible )
	{
		return;
	}

	const dimensions		= windowDimensions();
	const rect_container	= this.element_container.getBoundingClientRect();
	const scrollY			= window.scrollY || window.pageYOffset;

	//
	// Detect if container is scrolled off-page
	//

	if ( rect_container.bottom < 0 || rect_container.top > dimensions.y || rect_container.right < 0 || rect_container.left > dimensions.x )
	{
		this.element_error_container.style.visibility = 'hidden';
		return;
	}

	//
	// Detect if container is hidden within a parent
	//

	node = this.element_textarea_container;

	while ( ( node = node.parentNode ) && node !== document.documentElement )
	{
		overflow_x = computedStyleValue( node, 'overflow-x' );
		overflow_y = computedStyleValue( node, 'overflow-y' );

		if ( ( overflow_y === 'hidden' ) ||
			 ( overflow_x === 'hidden' ) ||
			 ( ( overflow_y === 'scroll' || overflow_y === 'auto' ) && node.scrollHeight > node.clientHeight ) ||
			 ( ( overflow_x === 'scroll' || overflow_x === 'auto' ) && node.scrollWidth > node.clientWidth ) )
		{
			rect_node = node.getBoundingClientRect();

			if ( rect_container.bottom < rect_node.top || rect_container.top > rect_node.bottom || rect_container.right < rect_node.left || rect_container.left > rect_node.right )
			{
				this.element_error_container.style.visibility = 'hidden';
				return;
			}
		}
	}

	//
	// Position error container (above or below, depending on available space)
	//

	this.element_error_container.style.width		= '';
	this.element_error_container.style.left			= '0px';
	
	const rect_error_container_pre					= this.element_error_container.getBoundingClientRect();

	if ( ( rect_error_container_pre.width < ( rect_container.width ) + 20 ) || rect_container.width > 300 )		this.element_error_container.style.width = `${rect_container.width + 20}px`;
	else if ( rect_error_container_pre.width > 300 )															this.element_error_container.style.width = '300px';
	else																										this.element_error_container.style.width = `${rect_error_container_pre.width}px`;

	const rect_error_container	= this.element_error_container.getBoundingClientRect();

	this.element_error_container.style.left			= `${(rect_container.left - 10) - ( ( ( rect_error_container.width - 20) - rect_container.width ) / 2 )}px`;

	if ( ( rect_container.bottom + rect_error_container.height ) > dimensions.y )
	{
		this.element_error_container.style.top 		= `${rect_container.top - rect_error_container.height + scrollY}px`;
		this.element_error_container.classList.add( 'above' );
	}
	else
	{
		this.element_error_container.style.top 		= `${rect_container.bottom + scrollY}px`;
		this.element_error_container.classList.remove( 'above' );
	}

	this.element_error_container.style.visibility	= '';
}

MMTextArea.prototype.Resize_SetDimensions = function( width, height )
{
	var min_width, margin_top, min_height, line_height, padding_top, title_height, padding_bottom, border_top_width, border_bottom_width;

	title_height		= this.element_title.offsetHeight;
	margin_top			= stoi_def( computedStyleValue( this.element_textarea_container,	'margin-top' ),				10 );
	padding_top			= stoi_def( computedStyleValue( this.element_textarea_scroller,		'padding-top' ),			10 );
	padding_bottom		= stoi_def( computedStyleValue( this.element_textarea_scroller,		'padding-bottom' ),			10 );
	line_height			= stoi_def( computedStyleValue( this.element_textarea,				'line-height' ),			18 );

	border_top_width	= stoi_def( computedStyleValue( this.element_textarea_container,	'border-top-width' ),		1 );
	border_bottom_width	= stoi_def( computedStyleValue( this.element_textarea_container,	'border-bottom-width' ),	1 );

	min_width			= 100;

	if ( this.autoheight_enabled )	min_height = this.autoheight_start_height;
	else							min_height = border_top_width + padding_top + line_height + padding_bottom + border_bottom_width + 2;

	if ( this.resize_horizontal )	this.element_container.style.width	= stoi_min( width, min_width ) + 'px';
	if ( this.resize_vertical )		this.element_container.style.height	= ( title_height + margin_top + stoi_min( height, min_height ) ) + 'px';
}

MMTextArea.prototype.SetValue = function( value )
{
	this.element_textarea.value	= value;
	this.last_validated_value	= this.GetValue();
}

MMTextArea.prototype.GetValue = function()
{
	return GetNormalizedValue( this.element_textarea.value );
}

MMTextArea.prototype.GetValue_Raw = function()
{
	return this.element_textarea.value;
}

MMTextArea.prototype.Container = function()
{
	return this.element_container;
}

MMTextArea.prototype.ContainedTextArea = function()
{
	return this.element_textarea;
}

MMTextArea.prototype.ContainedTextAreaScroller = function()
{
	return this.element_textarea_scroller;
}

MMTextArea.prototype.NotifyChange = function()
{
	var value = this.GetValue();

	if ( this.last_validated_value !== value )
	{
		this.last_validated_value = value;

		this.onChange( value );
		this.Validate();
	}
}

MMTextArea.prototype.Validate = function()
{
	var value = this.GetValue();

	this.ClearInvalid();

	if ( !this.onValidate( value ) )
	{
		if ( !this.GetInvalid() )
		{
			this.SetInvalid( '' );
		}

		return false;
	}

	return true;
}

MMTextArea.prototype.Clear = function()
{
	this.element_textarea.value = '';
}

MMTextArea.prototype.InsertTab = function()
{
	var tab, data, source, caret_pos, scroll_top, clientrects, scroll_left;

	tab													= '\x09';
	source												= this.GetValue_Raw();
	caret_pos											= this.element_textarea.selectionStart + tab.length;
	scroll_top											= this.element_textarea_scroller.scrollTop;
	scroll_left											= this.element_textarea_scroller.scrollLeft;

	this.SetValue( source.substring( 0, this.element_textarea.selectionStart ) + tab + source.substring( this.element_textarea.selectionEnd, source.length ) );
	this.element_textarea.setSelectionRange( caret_pos, caret_pos );

	data												= new Object();
	this.element_textarea_scroller.scrollTop			= scroll_top;
	this.element_textarea_scroller.scrollLeft			= scroll_left;

	this.ClonedEditor_Start( data );

	if ( ( clientrects = this.CalculateSelectionClientRects( data.range_element, caret_pos, caret_pos ) ) && clientrects.length )
	{
		if ( ( clientrects[ 0 ].top - ( data.textarea_rect.top - data.padding_top - data.scroll_top ) ) < scroll_top || ( clientrects[ 0 ].top - ( data.textarea_rect.top - data.padding_top - data.scroll_top ) ) > ( scroll_top + this.element_textarea_scroller.clientHeight ) )
		{
			this.element_textarea_scroller.scrollTop	= ( clientrects[ 0 ].top - ( data.textarea_rect.top - data.padding_top - data.scroll_top ) ) - ( this.element_textarea_scroller.clientHeight / 2 );
		}

		if ( ( clientrects[ 0 ].left - ( data.textarea_rect.left - data.padding_left - data.scroll_left ) ) < scroll_left || ( clientrects[ 0 ].left - ( data.textarea_rect.left - data.padding_left - data.scroll_left ) ) > ( scroll_left + this.element_textarea_scroller.clientWidth ) )
		{
			this.element_textarea_scroller.scrollLeft	= ( clientrects[ 0 ].left - ( data.textarea_rect.left - data.padding_left - data.scroll_left ) ) - ( this.element_textarea_scroller.clientWidth / 2 );
		}
	}

	this.ClonedEditor_End( data );
}

MMTextArea.prototype.InsertString = function( string )
{
	var data, source, caret_pos, scroll_top, clientrects, scroll_left;

	source		= this.GetValue_Raw();
	caret_pos	= this.element_textarea.selectionStart + string.length;
	scroll_top	= this.element_textarea_scroller.scrollTop;
	scroll_left	= this.element_textarea_scroller.scrollLeft;

	this.SetValue( source.substring( 0, this.element_textarea.selectionStart ) + string + source.substring( this.element_textarea.selectionEnd, source.length ) );
	this.element_textarea.setSelectionRange( caret_pos, caret_pos );

	data												= new Object();
	this.element_textarea_scroller.scrollTop			= scroll_top;
	this.element_textarea_scroller.scrollLeft			= scroll_left;

	this.ClonedEditor_Start( data );

	if ( ( clientrects = this.CalculateSelectionClientRects( data.range_element, caret_pos, caret_pos ) ) && clientrects.length )
	{
		if ( ( clientrects[ 0 ].top - ( data.textarea_rect.top - data.padding_top - data.scroll_top ) ) < scroll_top || ( clientrects[ 0 ].top - ( data.textarea_rect.top - data.padding_top - data.scroll_top ) ) > ( scroll_top + this.element_textarea_scroller.clientHeight ) )
		{
			this.element_textarea_scroller.scrollTop	= ( clientrects[ 0 ].top - ( data.textarea_rect.top - data.padding_top - data.scroll_top ) ) - ( this.element_textarea_scroller.clientHeight / 2 );
		}

		if ( ( clientrects[ 0 ].left - ( data.textarea_rect.left - data.padding_left - data.scroll_left ) ) < scroll_left || ( clientrects[ 0 ].left - ( data.textarea_rect.left - data.padding_left - data.scroll_left ) ) > ( scroll_left + this.element_textarea_scroller.clientWidth ) )
		{
			this.element_textarea_scroller.scrollLeft	= ( clientrects[ 0 ].left - ( data.textarea_rect.left - data.padding_left - data.scroll_left ) ) - ( this.element_textarea_scroller.clientWidth / 2 );
		}
	}

	this.ClonedEditor_End( data );
}

MMTextArea.prototype.RemoveKeyStackEntry = function()
{
	var keystackentry;

	if ( this.keystackentry )
	{
		keystackentry		= this.keystackentry;
		this.keystackentry	= null;

		KeyDownHandlerStack_Remove( keystackentry );
		this.onRemoveKeyStackEntry( keystackentry );
	}
}

MMTextArea.prototype.AddKeyStackEntry = function()
{
	var self = this;

	this.RemoveKeyStackEntry();

	this.keystackentry = KeyDownHandlerStack_Add();
	KeyDownHandlerStackEntry_BubbleUnsetKeyCodes( this.keystackentry );
	KeyDownHandlerStackEntry_AddKeyCode( this.keystackentry, 27, function( e ) { return self.Event_OnEsc_Input( e ); } );
	KeyDownHandlerStackEntry_AddKeyCode( this.keystackentry, 85, function( e )
	{
		if ( self.disabled || self.readonly )
		{
			return eventPreventDefault( e );
		}

		if ( e.ctrlKey )
		{
			self.Clear();
			return eventPreventDefault( e );
		}

		return true;
	} );

	this.onAddKeyStackEntry( this.keystackentry );
}

MMTextArea.prototype.GetKeyStackEntry = function()
{
	return this.keystackentry;
}

MMTextArea.prototype.ClonedEditor_Start = function( data )
{
	this.ClonedEditor_Start_LowLevel( this.GetValue_Raw(), data );
}

MMTextArea.prototype.ClonedEditor_Start_LowLevel = function( value, data )
{
	var i, top, left, width, i_len, height, styles, textarea_styles;

	data.value					= value;
	data.normalized_value		= GetNormalizedValue( data.value );
	data.textarea_rect			= this.element_textarea.getBoundingClientRect();
	data.parent_rect			= this.element_textarea.parentNode.getBoundingClientRect();
	data.padding_top			= stoi_def( computedStyleValue( this.element_textarea_scroller, 'padding-top' ), 10 );
	data.padding_left			= stoi_def( computedStyleValue( this.element_textarea_scroller, 'padding-left' ), 10 );
	data.scroll_top				= this.element_textarea_scroller.scrollTop;
	data.scroll_left			= this.element_textarea_scroller.scrollLeft;

	top							= data.textarea_rect.top - data.parent_rect.top;
	left						= data.textarea_rect.left - data.parent_rect.left;
	width						= data.textarea_rect.right - data.textarea_rect.left;
	height						= data.textarea_rect.bottom - data.textarea_rect.top;

	textarea_styles				= window.getComputedStyle( this.element_textarea, null );
	styles						= new Array();

	for ( i = 0, i_len = textarea_styles.length; i < i_len; i++ )
	{
		styles.push( textarea_styles[ i ] + ':' + textarea_styles.getPropertyValue( textarea_styles[ i ] ) );
	}

	data.div					= newElement( 'div', null, null, null );
	data.div.style.cssText		= styles.join( ';' );
	data.div.style.position		= 'absolute';
	data.div.style.top			= top + 'px';
	data.div.style.left			= left + 'px';
	data.div.style.width		= width + 'px';
	data.div.style.height		= height + 'px';
	data.div.style.overflow		= 'auto';
	data.div.style.wordWrap		= 'normal';
	data.div.style.whiteSpace	= this.setting_wrap ? 'pre-wrap' : 'pre';

	newTextNode( data.value, data.div );
	this.element_textarea.parentNode.insertBefore( data.div, this.element_textarea );

	data.range_element			= data.div.firstChild;

	for ( i = 0, i_len = data.div.childNodes.length; i < i_len; i++ )
	{
		if ( data.div.childNodes[ i ].nodeType === Node.TEXT_NODE && GetNormalizedValue( data.div.childNodes[ i ].nodeValue ) == data.normalized_value )
		{
			data.range_element	= data.div.childNodes[ i ];
			break;
		}
	}
}

MMTextArea.prototype.ClonedEditor_End = function( data )
{
	data.div.parentNode.removeChild( data.div );
}

MMTextArea.prototype.CalculateSelectionClientRects = function( range_element, selection_start, selection_end )
{
	var range, clientrects;

	try
	{
		range = document.createRange();
		range.setStart( range_element, selection_start );
		range.setEnd( range_element, selection_end );

		clientrects = range.getClientRects();
	}
	catch ( e )
	{
		clientrects = new Array();
	}

	return clientrects;
}

// Rendering

MMTextArea.prototype.Render_Read = function( data )
{
	var rect, dimensions, rect_container;

	this.dimensions_calculated_in_cycle = false;

	data.value							= this.GetValue_Raw();
	data.scroll_width					= this.element_textarea.scrollWidth;
	data.scroll_height					= this.element_textarea.scrollHeight;
	data.scroller_offset_width			= this.element_textarea_scroller.offsetWidth;
	data.scroller_offset_height			= this.element_textarea_scroller.offsetHeight;

	data.update_last_recalculated		= ( data.scroller_offset_width !== this.last_recalculated_offset_width ) || ( data.scroller_offset_height !== this.last_recalculated_offset_height );
	data.update_last_value				= this.last_render_value !== data.value;

	if ( this.resize_enabled && this.resizer_running )
	{
		rect					= this.element_textarea_container.getBoundingClientRect();

		data.resize_editor		= true;
		data.resizer_width		= stoi( ( this.resizer_mousepos_x + this.resizer_container_offset_x ) - rect.left );
		data.resizer_height		= stoi( ( this.resizer_mousepos_y + this.resizer_container_offset_y ) - rect.top );
	}

	if ( this.force_render_resize || this.resizer_running || data.update_last_value || data.update_last_recalculated || ( data.scroll_width > this.element_textarea.clientWidth ) || ( data.scroll_height > this.element_textarea.clientHeight ) )
	{
		data.update_dimensions			= true;

		data.client_width				= this.element_textarea_scroller.clientHeight;
		data.client_height				= this.element_textarea_scroller.clientWidth;
		data.original_scroll_top		= this.element_textarea_scroller.scrollTop;
		data.scroller_padding_top		= stoi_def( computedStyleValue( this.element_textarea_scroller,		'padding-top' ),			15 );
		data.scroller_padding_right		= stoi_def( computedStyleValue( this.element_textarea_scroller,		'padding-right' ),			15 );
		data.scroller_padding_bottom	= stoi_def( computedStyleValue( this.element_textarea_scroller,		'padding-bottom' ),			15 );
		data.scroller_padding_left		= stoi_def( computedStyleValue( this.element_textarea_scroller,		'padding-left' ),			15 );
		data.border_top_width			= stoi_def( computedStyleValue( this.element_textarea_container,	'border-top-width' ),		1 );
		data.border_right_width			= stoi_def( computedStyleValue( this.element_textarea_container,	'border-right-width' ),		1 );
		data.border_bottom_width		= stoi_def( computedStyleValue( this.element_textarea_container,	'border-bottom-width' ),	1 );
		data.border_left_width			= stoi_def( computedStyleValue( this.element_textarea_container,	'border-left-width' ),		1 );
		data.fallback_width				= this.element_textarea_scroller.offsetWidth - ( data.scroller_padding_right + data.scroller_padding_left ) - 1 - this.scrollbar_dimensions.width;
		data.fallback_height			= this.element_textarea_scroller.offsetHeight - ( data.scroller_padding_top + data.scroller_padding_bottom ) - 1 - this.scrollbar_dimensions.height;
	}

	if ( this.error_visible )
	{
		dimensions		= windowDimensions();
		rect_container	= this.element_container.getBoundingClientRect();

		if ( rect_container.top !== this.last_container_top ||
			 rect_container.left !== this.last_container_left ||
			 dimensions.y !== this.last_window_y ||
			 dimensions.x !== this.last_window_x )
		{
			data.redraw_error			= true;

			this.last_container_top		= rect_container.top;
			this.last_container_left	= rect_container.left;
			this.last_window_y			= dimensions.y;
			this.last_window_x			= dimensions.x;
		}
	}
}

MMTextArea.prototype.Render_Write = function( data )
{
	var calculated_width, calculated_height;

	if ( data.resize_editor )
	{
		this.Resize_SetDimensions( data.resizer_width, data.resizer_height );
	}

	if ( data.update_dimensions )
	{
		this.force_render_resize						= false;
		this.element_textarea_calculator.value			= this.element_textarea.value;
		this.element_textarea_calculator.style.width	= data.fallback_width + 'px';

		calculated_width								= this.element_textarea_calculator.scrollWidth;
		calculated_height								= this.element_textarea_calculator.scrollHeight;

		this.element_textarea.style.width				= Math.max( calculated_width, data.fallback_width ) + 'px';
		this.element_textarea.style.height				= Math.max( calculated_height, data.fallback_height ) + 'px';

		if ( this.element_textarea.scrollWidth > this.element_textarea.clientWidth )
		{
			this.element_textarea.style.width			= this.element_textarea.scrollWidth + 'px';
		}

		if ( this.element_textarea.scrollHeight > this.element_textarea.clientHeight )
		{
			this.element_textarea.style.height			= this.element_textarea.scrollHeight + 'px';
		}

		this.element_textarea_scroller.scrollTop		= data.original_scroll_top;

		if ( this.autoheight_enabled )
		{
			if ( this.autoheight_max_height )	height = stoi_max( calculated_height + 2, this.autoheight_max_height );
			else								height = calculated_height + 2;

			this.Resize_SetDimensions( null, data.border_top_width + data.scroller_padding_top + height + data.scroller_padding_bottom + data.border_bottom_width );
		}
	}

	if ( data.update_last_recalculated )
	{
		this.last_recalculated_offset_width				= data.scroller_offset_width;
		this.last_recalculated_offset_height			= data.scroller_offset_height;
	}

	if ( data.update_last_value )
	{
		this.last_render_value							= data.value;
	}

	if ( data.redraw_error )
	{
		this.Redraw_Error();
	}
}

MMTextArea.prototype.Event_ResizerMouseDown = function( e )
{
	var rect, mousepos, rightclick;

	if ( 'which' in e )			rightclick = ( e.which == 3 );
	else if ( 'button' in e )	rightclick = ( e.button == 2 );
	else						rightclick = false;

	if ( rightclick )			return;

	rect								= this.element_textarea_container.getBoundingClientRect();
	mousepos							= captureMousePosition( e );

	this.resizer_running				= true;
	this.resizer_mousepos_x				= mousepos.x - getScrollLeft();
	this.resizer_mousepos_y				= mousepos.y - getScrollTop();
	this.resizer_mousepos_start_x		= this.resizer_mousepos_x;
	this.resizer_mousepos_start_y		= this.resizer_mousepos_y;
	this.resizer_container_offset_x		= rect.right - this.resizer_mousepos_start_x;
	this.resizer_container_offset_y		= rect.bottom - this.resizer_mousepos_start_y;
	this.mouse_target					= e.target ? e.target : e.srcElement;

	classNameAddIfMissing( this.element_resizer, 'active' );

	clearTextSelection();
	document.body.focus();

	document.body.unselectable			= 'on';
	document.onselectstart				= this.event_returnfalse;
	this.mouse_target.ondragstart		= this.event_returnfalse;

	if ( this.mouse_target.setCapture )
	{
		this.mouse_target.setCapture();
	}

	AddEvent( document, 'mousemove',	this.event_resizer_mousemove );
	AddEvent( document, 'mouseup',		this.event_resizer_mouseup );
}

MMTextArea.prototype.Event_ResizerMouseMove = function( e )
{
	var mousepos;

	mousepos				= captureMousePosition( e );

	this.resizer_mousepos_x	= mousepos.x - getScrollLeft();
	this.resizer_mousepos_y	= mousepos.y - getScrollTop();

	clearTextSelection();

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

MMTextArea.prototype.Event_ResizerMouseUp = function( e )
{
	var rect, width, height, mousepos;

	mousepos						= captureMousePosition( e );

	this.resizer_running			= false;
	this.resizer_mousepos_x			= mousepos.x - getScrollLeft();
	this.resizer_mousepos_y			= mousepos.y - getScrollTop();
	document.body.unselectable		= null;
	document.onselectstart			= null;
	this.mouse_target.ondragstart	= null;

	classNameRemoveIfPresent( this.element_resizer, 'active' );

	if ( this.mouse_target.releaseCapture )
	{
		this.mouse_target.releaseCapture();
	}

	RemoveEvent( document, 'mousemove',	this.event_resizer_mousemove );
	RemoveEvent( document, 'mouseup',	this.event_resizer_mouseup );

	rect							= this.element_textarea_container.getBoundingClientRect();
	width							= stoi( ( this.resizer_mousepos_x + this.resizer_container_offset_x ) - rect.left );
	height							= stoi( ( this.resizer_mousepos_y + this.resizer_container_offset_y ) - rect.top );

	this.Resize_SetDimensions( width, height );

	clearTextSelection();

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

MMTextArea.prototype.Event_OnClick_Title = function( e )
{
	var rightclick;

	if ( 'which' in e )			rightclick = ( e.which == 3 );
	else if ( 'button' in e )	rightclick = ( e.button == 2 );
	else						rightclick = false;

	if ( rightclick )			return true;

	this.Focus();

	return true;
}

MMTextArea.prototype.Event_OnMouseOver_TextArea_Container = function( e )
{
	if ( this.invalid )
	{
		this.Show_Error();
	}

	return true;
}

MMTextArea.prototype.Event_OnMouseOut_TextArea_Container = function( e )
{
	if ( this.invalid )
	{
		this.Hide_Error();
	}

	return true;
}

MMTextArea.prototype.Event_OnMouseDown_TextArea_Container = function( e )
{
	var i, data, lines, i_len, target, mousepos, bound_top, bound_left, bound_right, padding_top, line_height, bound_bottom, current_line, textarea_rect;
	var scrollfromtop, scrollfromleft, selection_start, textarea_scroller_rect, textarea_container_rect, scrollbar_vertical_left, scrollbar_horizontal_top;

	target = e.target || e.srcElement;

	if ( target === this.element_textarea || target === this.element_title_tooltip || containsChild( this.element_title_tooltip, target ) )
	{
		return true;
	}

	mousepos 					= captureMousePosition( e );
	scrollfromtop				= getScrollTop();
	scrollfromleft				= getScrollLeft();

	textarea_rect				= this.element_textarea.getBoundingClientRect();
	textarea_scroller_rect		= this.element_textarea_scroller.getBoundingClientRect();
	textarea_container_rect		= this.element_textarea_container.getBoundingClientRect();

	bound_top					= ( scrollfromtop + textarea_container_rect.top + Math.max( textarea_scroller_rect.top - textarea_container_rect.top, textarea_rect.top - textarea_container_rect.top ) );
	bound_right					= ( scrollfromleft + textarea_container_rect.right - Math.max( textarea_container_rect.right - textarea_scroller_rect.right + 1, textarea_container_rect.right - textarea_rect.right + 1 ) );
	bound_bottom				= ( scrollfromtop + textarea_container_rect.bottom - Math.max( textarea_container_rect.bottom - textarea_scroller_rect.bottom + 1, textarea_container_rect.bottom - textarea_rect.bottom + 1 ) );
	bound_left					= ( scrollfromleft + textarea_container_rect.left + Math.max( textarea_scroller_rect.left - textarea_container_rect.left, textarea_rect.left - textarea_container_rect.left ) );

	scrollbar_vertical_left		= scrollfromleft + textarea_scroller_rect.right - ( this.element_textarea_scroller.offsetWidth - this.element_textarea_scroller.clientWidth );
	scrollbar_horizontal_top	= scrollfromtop + textarea_scroller_rect.bottom - ( this.element_textarea_scroller.offsetHeight - this.element_textarea_scroller.clientHeight );

	if ( mousepos.y >= bound_top		&&
		 mousepos.y <= bound_bottom		&&
		 mousepos.x >= bound_left		&&
		 mousepos.x <= bound_right )
	{
		return true;
	}
	else if ( ( mousepos.x >= scrollbar_vertical_left && mousepos.x <= scrollbar_vertical_left + this.scrollbar_width ) ||
			  ( mousepos.y >= scrollbar_horizontal_top && mousepos.y <= scrollbar_horizontal_top + this.scrollbar_height ) )
	{
		return true;
	}

	if ( mousepos.y <= bound_top )			this.element_textarea.setSelectionRange( 0, 0 );
	else if ( mousepos.y >= bound_bottom )	this.element_textarea.setSelectionRange( this.element_textarea.value.length, this.element_textarea.value.length );
	else
	{
		data					= new Object();

		this.ClonedEditor_Start( data );

		padding_top				= stoi_def( computedStyleValue( this.element_textarea_scroller, 'padding-top' ), 10 );
		line_height				= stoi_def( computedStyleValue( this.element_textarea, 'line-height' ), 18 );
		current_line			= Math.floor( ( ( ( ( mousepos.y - ( scrollfromtop + textarea_container_rect.top ) ) + this.element_textarea_scroller.scrollTop ) - padding_top ) / line_height ) );
		lines					= this.GetValue().split( '\n' );
		selection_start 		= 0;

		for ( i = 0, i_len = lines.length; i < i_len && i < current_line; i++ )
		{
			selection_start		+= lines[ i ].length /* Account for '\n' Character */;
		}

		if ( i < i_len && i === current_line && ( mousepos.x >= bound_right ) )
		{
			selection_start		+= lines[ i ].length - 1;
		}

		this.element_textarea.setSelectionRange( selection_start, selection_start );
		this.ClonedEditor_End( data );
	}

	this.Focus();

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

MMTextArea.prototype.Event_OnFocus_Input = function( e )
{
	var self = this;

	if ( this.disabled )
	{
		this.element_textarea.blur();
		return true;
	}

	if ( this.focused )
	{
		return true;
	}

	this.focused = true;

	classNameAddIfMissing( this.element_container, 'focus' );
	this.AddKeyStackEntry();

	if ( this.select_on_focus )
	{
		requestAnimationFrame( function() { self.element_textarea.select(); } );
	}

	return this.onFocus( e );
}

MMTextArea.prototype.Event_OnBlur_Input = function( e )
{
	if ( !this.focused )
	{
		return true;
	}

	this.focused = false;

	classNameRemoveIfPresent( this.element_container, 'focus' );
	this.RemoveKeyStackEntry();

	return this.onBlur( e );
}

MMTextArea.prototype.Event_OnChange_Input = function( e )
{
	if ( this.disabled || this.readonly )
	{
		return true;
	}

	this.NotifyChange();
	return true;
}

MMTextArea.prototype.Event_OnInput_Input = function( e )
{
	if ( this.disabled || this.readonly )
	{
		return true;
	}

	this.NotifyChange();
	return true;
}

MMTextArea.prototype.Event_OnCut_Input = function( e )
{
	var self = this;

	if ( this.disabled || this.readonly )
	{
		eventStopPropagation( e );
		return eventPreventDefault( e );
	}

	setTimeout( function() { self.NotifyChange(); }, 0 );
	return true;
}

MMTextArea.prototype.Event_OnPaste_Input = function( e )
{
	var self = this;

	if ( this.disabled || this.readonly )
	{
		eventStopPropagation( e );
		return eventPreventDefault( e );
	}

	setTimeout( function() { self.NotifyChange(); }, 0 );
	return true;
}

MMTextArea.prototype.Event_OnKeyDown_Input = function( e )
{
	var keycode;

	if ( this.disabled )
	{
		eventStopPropagation( e );
		return eventPreventDefault( e );
	}

	keycode = e.keyCode || e.which;

	if ( keycode === 9 )
	{
		this.InsertTab();

		eventStopPropagation( e );
		return eventPreventDefault( e );
	}
	else if ( keycode === 13 )
	{
		if ( !this.trigger_onenter_without_modifier && keySupportsMultiSelect( e ) )		return this.onEnter( e );
		else if ( this.trigger_onenter_without_modifier && !keySupportsMultiSelect( e ) )	return this.onEnter( e );
		else if ( this.trigger_onenter_without_modifier && keySupportsMultiSelect( e ) )
		{
			this.InsertString( '\n' );

			eventStopPropagation( e );
			return eventPreventDefault( e );
		}
	}

	return true;
}

MMTextArea.prototype.Event_OnKeyUp_Input = function( e )
{
	if ( this.disabled )
	{
		eventStopPropagation( e );
		return eventPreventDefault( e );
	}

	this.NotifyChange();
	return true;
}

MMTextArea.prototype.Event_OnEsc_Input = function( e )
{
	if ( this.disabled )
	{
		eventStopPropagation( e );
		return eventPreventDefault( e );
	}

	return this.onEsc( e );
}

MMTextArea.prototype.Validate_NonEmpty = function()
{
	var error = new Object();

	if ( !this.Validate_NonEmpty_Silent( error ) )
	{
		this.SetInvalid( error.error_message );
		this.Select();

		return false;
	}

	return true;
}

MMTextArea.prototype.Validate_NonEmpty_Silent = function( error /* optional */ )
{
	var value = this.GetValue();

	if ( value.length )
	{
		return true;
	}

	if ( getVariableType( error ) === 'object' )
	{
		error.error_message = 'Please enter a value';
	}

	return false;
}

MMTextArea.prototype.Validate_String_NonEmpty_WithMaxLength = function( max_length )
{
	var error = new Object();

	if ( !this.Validate_String_NonEmpty_WithMaxLength_Silent( max_length, error ) )
	{
		this.SetInvalid( error.error_message );
		this.Select();

		return false;
	}

	return true;
}

MMTextArea.prototype.Validate_String_NonEmpty_WithMaxLength_Silent = function( max_length, error /* optional */ )
{
	var value = this.GetValue();

	if ( !value.length )
	{
		if ( getVariableType( error ) === 'object' )
		{
			error.error_message = 'Please enter a value';
		}

		return false;
	}
	else if ( value.length > max_length )
	{
		if ( getVariableType( error ) === 'object' )
		{
			error.error_message = `Value must be ${max_length} characters or less`;
		}

		return false;
	}

	return true;
}

MMTextArea.prototype.onRetrieveErrorParent	= function() { return document.body; };
MMTextArea.prototype.onValidate				= function( value ) { return true; };
MMTextArea.prototype.onEsc					= function( e ) { this.element_textarea.blur(); return true };
MMTextArea.prototype.onEnter				= function( e ) { return true; };
MMTextArea.prototype.onFocus				= function( e ) { return true; };
MMTextArea.prototype.onBlur					= function( e ) { return true; };
MMTextArea.prototype.onChange				= function( value ) { ; };
MMTextArea.prototype.onSetInvalid			= function() { ; };
MMTextArea.prototype.onClearInvalid			= function() { ; };
MMTextArea.prototype.onAddKeyStackEntry		= function( keystackentry ) { ; };
MMTextArea.prototype.onRemoveKeyStackEntry	= function( keystackentry ) { ; };

function OpenLinkHandler( e, url, parameters )
{
	if ( keySupportsMultiSelect( e ) || mouseClickType( e ) == 'MIDDLE' )	OpenLinkHandler_NewWindow( url, parameters );
	else																	OpenLinkHandler_CurrentWindow( url, parameters );

	return eventPreventDefault( e );
}

function OpenLinkHandler_NewWindow( url, parameters )
{
	var form, input, name;

	form				= document.createElement( 'form' );
	form.target			= '_blank';
	form.method			= 'POST';

	if ( url.indexOf( adminurl_nosep ) == 0 )
	{
		url				= adminurl_nosep;

		input			= document.createElement( 'input' );
		input.type		= 'hidden';
		input.name		= 'MMScreen_Intercept';
		input.value		= '1';
		form.appendChild( input );
	}

	for ( name in parameters )
	{
		if ( !parameters.hasOwnProperty( name ) )
		{
			continue;
		}

		input			= document.createElement( 'input' );
		input.type		= 'hidden';
		input.name		= name;
		input.value		= parameters[ name ];
		form.appendChild( input );
	}

	form.action			= url;

	document.body.appendChild( form );
	form.submit();
	form.parentNode.removeChild( form );
}

function OpenLinkHandler_CurrentWindow( url, parameters )
{
	var name, params_array;

	params_array = new Array();

	for ( name in parameters )
	{
		if ( parameters.hasOwnProperty( name ) )
		{
			params_array.push( CharsetEncodeAttribute( name ) + '=' + CharsetEncodeAttribute( parameters[ name ] ) );
		}
	}

	window.location.href = url + params_array.join( '&' );
}

function OpenLinkInNewWindow( e, url, parameters )
{
	OpenLinkHandler_NewWindow( url, parameters );

	return eventPreventDefault( e );
}

function MivaIconMap( name )
{
	switch ( name )
	{
		case 'add'									: return String.fromCharCode( parseInt( 'e002', 16 ) );
		case 'assign'								: return String.fromCharCode( parseInt( 'e003', 16 ) );
		case 'bookmark'								: return String.fromCharCode( parseInt( 'e004', 16 ) );
		case 'cancel'								: return String.fromCharCode( parseInt( 'e005', 16 ) );
		case 'catalog'								: return String.fromCharCode( parseInt( 'e006', 16 ) );
		case 'changesort'							: return String.fromCharCode( parseInt( 'e007', 16 ) );
		case 'checkmark'							: return String.fromCharCode( parseInt( 'e008', 16 ) );
		case 'columnresize'							: return String.fromCharCode( parseInt( 'e00b', 16 ) );
		case 'customers'							: return String.fromCharCode( parseInt( 'e00c', 16 ) );
		case 'datamanagement'						: return String.fromCharCode( parseInt( 'e00d', 16 ) );
		case 'delete'								: return String.fromCharCode( parseInt( 'e00e', 16 ) );
		case 'notification'							: return String.fromCharCode( parseInt( 'e00f', 16 ) );
		case 'disp_order'							: return String.fromCharCode( parseInt( 'e010', 16 ) );
		case 'domainsettings'						: return String.fromCharCode( parseInt( 'e011', 16 ) );
		case 'download'								: return String.fromCharCode( parseInt( 'e012', 16 ) );
		case 'dropdown'								: return String.fromCharCode( parseInt( 'e013', 16 ) );
		case 'edit'									: return String.fromCharCode( parseInt( 'e014', 16 ) );
		case 'exclamation'							: return String.fromCharCode( parseInt( 'e015', 16 ) );
		case 'export'								: return String.fromCharCode( parseInt( 'e016', 16 ) );
		case 'goto'									: return String.fromCharCode( parseInt( 'e017', 16 ) );
		case 'history'								: return String.fromCharCode( parseInt( 'e018', 16 ) );
		case 'home'									: return String.fromCharCode( parseInt( 'e019', 16 ) );
		case 'import'								: return String.fromCharCode( parseInt( 'e01a', 16 ) );
		case 'logging'								: return String.fromCharCode( parseInt( 'e01b', 16 ) );
		case 'logout'								: return String.fromCharCode( parseInt( 'e01c', 16 ) );
		case 'lookup'								: return String.fromCharCode( parseInt( 'e01d', 16 ) );
		case 'manageshipments'						: return String.fromCharCode( parseInt( 'e01e', 16 ) );
		case 'marketing'							: return String.fromCharCode( parseInt( 'e01f', 16 ) );
		case 'menu'									: return String.fromCharCode( parseInt( 'e020', 16 ) );
		case 'modules'								: return String.fromCharCode( parseInt( 'e021', 16 ) );
		case 'more'									: return String.fromCharCode( parseInt( 'e022', 16 ) );
		case 'orderfulfillment'						: return String.fromCharCode( parseInt( 'e023', 16 ) );
		case 'orderprocessing'						: return String.fromCharCode( parseInt( 'e024', 16 ) );
		case 'payment'								: return String.fromCharCode( parseInt( 'e025', 16 ) );
		case 'refresh'								: return String.fromCharCode( parseInt( 'e026', 16 ) );
		case 'reports'								: return String.fromCharCode( parseInt( 'e027', 16 ) );
		case 'requestsupport'						: return String.fromCharCode( parseInt( 'e028', 16 ) );
		case 'reset'								: return String.fromCharCode( parseInt( 'e029', 16 ) );
		case 'save'									: return String.fromCharCode( parseInt( 'e02a', 16 ) );
		case 'show'									: return String.fromCharCode( parseInt( 'e02b', 16 ) );
		case 'list'									: return String.fromCharCode( parseInt( 'e02c', 16 ) );
		case 'sort'									: return String.fromCharCode( parseInt( 'e02d', 16 ) );
		case 'sort_asc'								: return String.fromCharCode( parseInt( 'e02e', 16 ) );
		case 'sort_desc'							: return String.fromCharCode( parseInt( 'e02f', 16 ) );
		case 'storesettings'						: return String.fromCharCode( parseInt( 'e030', 16 ) );
		case 'systemextensions'						: return String.fromCharCode( parseInt( 'e031', 16 ) );
		case 'folder'								: return String.fromCharCode( parseInt( 'e032', 16 ) );
		case 'template_add'							: return String.fromCharCode( parseInt( 'e033', 16 ) );
		case 'unassign'								: return String.fromCharCode( parseInt( 'e034', 16 ) );
		case 'update_available'						: return String.fromCharCode( parseInt( 'e035', 16 ) );
		case 'upload'								: return String.fromCharCode( parseInt( 'e036', 16 ) );
		case 'userinterface'						: return String.fromCharCode( parseInt( 'e037', 16 ) );
		case 'users'								: return String.fromCharCode( parseInt( 'e038', 16 ) );
		case 'utilities'							: return String.fromCharCode( parseInt( 'e039', 16 ) );
		case 'viewstore'							: return String.fromCharCode( parseInt( 'e03a', 16 ) );
		case 'columnmenu'							: return String.fromCharCode( parseInt( 'e03b', 16 ) );
		case 'first'								: return String.fromCharCode( parseInt( 'e03c', 16 ) );
		case 'prev'									: return String.fromCharCode( parseInt( 'e03d', 16 ) );
		case 'next'									: return String.fromCharCode( parseInt( 'e03e', 16 ) );
		case 'last'									: return String.fromCharCode( parseInt( 'e03f', 16 ) );
		case 'search'								: return String.fromCharCode( parseInt( 'e040', 16 ) );
		case 'loading'								: return String.fromCharCode( parseInt( 'e041', 16 ) );
		case 'dismiss'								: return String.fromCharCode( parseInt( 'e042', 16 ) );
		case 'bseparator'							: return String.fromCharCode( parseInt( 'e043', 16 ) );
		case 'fielderror'							: return String.fromCharCode( parseInt( 'e044', 16 ) );
		case 'circle'								: return String.fromCharCode( parseInt( 'e045', 16 ) );
		case 'here'									: return String.fromCharCode( parseInt( 'e046', 16 ) );
		case 'settings'								: return String.fromCharCode( parseInt( 'e047', 16 ) );
		case 'urimanagement'						: return String.fromCharCode( parseInt( 'e048', 16 ) );
		case 'marketplaces'							: return String.fromCharCode( parseInt( 'e049', 16 ) );
		case 'advancedsearch'						: return String.fromCharCode( parseInt( 'e04a', 16 ) );
		case 'findinlist'							: return String.fromCharCode( parseInt( 'e04b', 16 ) );
		case 'readytheme'							: return String.fromCharCode( parseInt( 'e04c', 16 ) );
		case 'arrowup'								: return String.fromCharCode( parseInt( 'e04d', 16 ) );
		case 'arrowdown'							: return String.fromCharCode( parseInt( 'e04e', 16 ) );
		case 'font'									: return String.fromCharCode( parseInt( 'e04f', 16 ) );
		case 'bold'									: return String.fromCharCode( parseInt( 'e050', 16 ) );
		case 'italic'								: return String.fromCharCode( parseInt( 'e051', 16 ) );
		case 'underline'							: return String.fromCharCode( parseInt( 'e052', 16 ) );
		case 'strike'								: return String.fromCharCode( parseInt( 'e053', 16 ) );
		case 'align_left'							: return String.fromCharCode( parseInt( 'e054', 16 ) );
		case 'align_center'							: return String.fromCharCode( parseInt( 'e055', 16 ) );
		case 'align_right'							: return String.fromCharCode( parseInt( 'e056', 16 ) );
		case 'align_justify'						: return String.fromCharCode( parseInt( 'e057', 16 ) );
		case 'indent'								: return String.fromCharCode( parseInt( 'e058', 16 ) );
		case 'outdent'								: return String.fromCharCode( parseInt( 'e059', 16 ) );
		case 'picture'								: return String.fromCharCode( parseInt( 'e05a', 16 ) );
		case 'link'									: return String.fromCharCode( parseInt( 'e05b', 16 ) );
		case 'link_ext_alt'							: return String.fromCharCode( parseInt( 'e05c', 16 ) );
		case 'code'									: return String.fromCharCode( parseInt( 'e05d', 16 ) );
		case 'undo'									: return String.fromCharCode( parseInt( 'e05e', 16 ) );
		case 'redo'									: return String.fromCharCode( parseInt( 'e05f', 16 ) );
		case 'paint'								: return String.fromCharCode( parseInt( 'e060', 16 ) );
		case 'numberedlist'							: return String.fromCharCode( parseInt( 'e061', 16 ) );
		case 'bulletlist'							: return String.fromCharCode( parseInt( 'e062', 16 ) );
		case 'superscript'							: return String.fromCharCode( parseInt( 'e063', 16 ) );
		case 'subscript'							: return String.fromCharCode( parseInt( 'e064', 16 ) );
		case 'resize'								: return String.fromCharCode( parseInt( 'e065', 16 ) );
		case 'lock'									: return String.fromCharCode( parseInt( 'e066', 16 ) );
		case 'unlock'								: return String.fromCharCode( parseInt( 'e067', 16 ) );
		case 'linenumbers'							: return String.fromCharCode( parseInt( 'e068', 16 ) );
		case 'wrap'									: return String.fromCharCode( parseInt( 'e069', 16 ) );
		case 'textarea'								: return String.fromCharCode( parseInt( 'e06a', 16 ) );
		case 'colorpicker'							: return String.fromCharCode( parseInt( 'e06b', 16 ) );
		case 'paragraph'							: return String.fromCharCode( parseInt( 'e06c', 16 ) );
		case 'table'								: return String.fromCharCode( parseInt( 'e06d', 16 ) );
		case 'fontsize'								: return String.fromCharCode( parseInt( 'e06e', 16 ) );
		case 'fontface'								: return String.fromCharCode( parseInt( 'e06f', 16 ) );
		case 'verticalalign'						: return String.fromCharCode( parseInt( 'e070', 16 ) );
		case 'horizontalalign'						: return String.fromCharCode( parseInt( 'e071', 16 ) );
		case 'columns'								: return String.fromCharCode( parseInt( 'e072', 16 ) );
		case 'rows'									: return String.fromCharCode( parseInt( 'e073', 16 ) );
		case 'border'								: return String.fromCharCode( parseInt( 'e074', 16 ) );
		case 'cell'									: return String.fromCharCode( parseInt( 'e075', 16 ) );
		case 'richtext'								: return String.fromCharCode( parseInt( 'e076', 16 ) );
		case 'fullscreen_start'						: return String.fromCharCode( parseInt( 'e077', 16 ) );
		case 'fullscreen_end'						: return String.fromCharCode( parseInt( 'e078', 16 ) );
		case 'foregroundcolor'						: return String.fromCharCode( parseInt( 'e079', 16 ) );
		case 'backgroundcolor'						: return String.fromCharCode( parseInt( 'e07a', 16 ) );
		case 'find_and_replace'						: return String.fromCharCode( parseInt( 'e07b', 16 ) );
		case 'help'									: return String.fromCharCode( parseInt( 'e07c', 16 ) );
		case 'line_stacked'							: return String.fromCharCode( parseInt( 'e07d', 16 ) );
		case 'bar_stacked'							: return String.fromCharCode( parseInt( 'e07e', 16 ) );
		case 'bar_sbs'								: return String.fromCharCode( parseInt( 'e07f', 16 ) );
		case 'group'								: return String.fromCharCode( parseInt( 'e080', 16 ) );
		case 'ungroup'								: return String.fromCharCode( parseInt( 'e081', 16 ) );
		case 'triggers'								: return String.fromCharCode( parseInt( 'e082', 16 ) );
		case 'conditions'							: return String.fromCharCode( parseInt( 'e083', 16 ) );
		case 'actions'								: return String.fromCharCode( parseInt( 'e084', 16 ) );
		case 'workflow'								: return String.fromCharCode( parseInt( 'e085', 16 ) );
		case 'details'								: return String.fromCharCode( parseInt( 'e086', 16 ) );
		case 'zoom_out'								: return String.fromCharCode( parseInt( 'e087', 16 ) );
		case 'zoom_in'								: return String.fromCharCode( parseInt( 'e088', 16 ) );
		case 'linked'								: return String.fromCharCode( parseInt( 'e089', 16 ) );
		case 'gear_1'								: return String.fromCharCode( parseInt( 'e08a', 16 ) );
		case 'branches'								: return String.fromCharCode( parseInt( 'e08b', 16 ) );
		case 'createnew'							: return String.fromCharCode( parseInt( 'e08c', 16 ) );
		case 'tags'									: return String.fromCharCode( parseInt( 'e08d', 16 ) );
		case 'position_bottom_left'					: return String.fromCharCode( parseInt( 'e08e', 16 ) );
		case 'position_bottom_right'				: return String.fromCharCode( parseInt( 'e08f', 16 ) );
		case 'position_top_right'					: return String.fromCharCode( parseInt( 'e090', 16 ) );
		case 'position_top_left'					: return String.fromCharCode( parseInt( 'e091', 16 ) );
		case 'shopascustomer'						: return String.fromCharCode( parseInt( 'e092', 16 ) );
		case 'email'								: return String.fromCharCode( parseInt( 'e093', 16 ) );
		case 'login'								: return String.fromCharCode( parseInt( 'e094', 16 ) );
		case 'miva_m'								: return String.fromCharCode( parseInt( 'e095', 16 ) );
		case 'copy'									: return String.fromCharCode( parseInt( 'e096', 16 ) );
		case 'circle_cancel'						: return String.fromCharCode( parseInt( 'e097', 16 ) );
		case 'circle_checkmark'						: return String.fromCharCode( parseInt( 'e098', 16 ) );
		case 'circle_information'					: return String.fromCharCode( parseInt( 'e099', 16 ) );
		case 'filter'								: return String.fromCharCode( parseInt( 'e09a', 16 ) );
		case 'circle_add'							: return String.fromCharCode( parseInt( 'e09b', 16 ) );
		case 'star'									: return String.fromCharCode( parseInt( 'e09c', 16 ) );
		case 'date'									: return String.fromCharCode( parseInt( 'e09d', 16 ) );
		case 'time'									: return String.fromCharCode( parseInt( 'e09e', 16 ) );
		case 'revision'								: return String.fromCharCode( parseInt( 'e09f', 16 ) );
		case 'password'								: return String.fromCharCode( parseInt( 'e100', 16 ) );
		case 'businessaccount'						: return String.fromCharCode( parseInt( 'e101', 16 ) );
		case 'addressbook'							: return String.fromCharCode( parseInt( 'e102', 16 ) );
		case 'customer_dashboard_login'				: return String.fromCharCode( parseInt( 'e103', 16 ) );
		case 'customer_dashboard_businessaccount'	: return String.fromCharCode( parseInt( 'e104', 16 ) );
		case 'customer_dashboard_email'				: return String.fromCharCode( parseInt( 'e105', 16 ) );
		case 'customer_dashboard_password'			: return String.fromCharCode( parseInt( 'e106', 16 ) );
		case 'customer_dashboard_address'			: return String.fromCharCode( parseInt( 'e107', 16 ) );
		case 'customer_dashboard_phone'				: return String.fromCharCode( parseInt( 'e108', 16 ) );
		default										: return '';
	}
}

(() =>
{
	const lookup = new Object();

	window.MivaSVGIconMap_Extend = ( icon, svg ) =>
	{
		lookup[ icon ] = svg;
	}

	window.MivaSVGIconMap_Extensions = ( icon ) =>
	{
		return lookup[ icon ] ?? '';
	}
})();

function MivaSVGIconMap( icon )
{
	switch ( icon )
	{
		case 'component-add':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13">
				<path class="mm10_svg_icon_color" d="M10.005,0H4A4,4,0,0,0,0,4V9.005A4,4,0,0,0,4,13h6.009A4,4,0,0,0,14,9.005V4a4,4,0,0,0-3.995-4M9.428,7.091H7.619V8.886a.353.353,0,0,1,0,.046.6.6,0,0,1-1.191-.046V7.091H4.573A.591.591,0,1,1,4.62,5.91H6.428V4.068a.6.6,0,0,1,1.191.047v1.8H9.428a.591.591,0,0,1,0,1.181" />
			</svg>`;
		}
		case 'component-image':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" viewBox="0 0 16 13">
				<path class="mm10_svg_icon_color" d="M2494.256,20835.994a2.389,2.389,0,0,1-2.259-2.395,2.563,2.563,0,0,1,.863-1.846s1.846-2.082,2.808-3.111a1.789,1.789,0,0,1,2.949.324,15.966,15.966,0,0,0,2.191,2.447,1.569,1.569,0,0,0,1.846-.324c.69-.633,2.222-2.129,3.6-.461.612.742,1.166,1.4,1.166,1.4a2.432,2.432,0,0,1,.581,1.568,2.381,2.381,0,0,1-2.317,2.4Zm7.133-11a2,2,0,1,1,2,2A2,2,0,0,1,2501.389,20825Z" transform="translate(-2491.998 -20823)" />
			</svg>`;
		}
		case 'component-image-slider':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
				<path class="mm10_svg_icon_color" d="M2502,20838a1,1,0,1,1,1,1A1,1,0,0,1,2502,20838Zm-3,0a1,1,0,1,1,1,1A1,1,0,0,1,2499,20838Zm-3,0a1,1,0,1,1,1,1A.995.995,0,0,1,2496,20838Zm-1.747-2.014a2.382,2.382,0,0,1-2.254-2.395,2.575,2.575,0,0,1,.863-1.842s1.841-2.076,2.808-3.111a1.785,1.785,0,0,1,2.945.324,15.962,15.962,0,0,0,2.191,2.447,1.569,1.569,0,0,0,1.846-.324c.69-.633,2.223-2.129,3.6-.459.612.742,1.166,1.4,1.166,1.4a2.421,2.421,0,0,1,.581,1.564,2.38,2.38,0,0,1-2.317,2.4Zm7.134-10.988a2,2,0,1,1,2,2A2,2,0,0,1,2501.388,20825Z" transform="translate(-2492 -20823.002)" />
			</svg>`;
		}
		case 'component-image-across':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15">
				<path class="mm10_svg_icon_color" d="M2493.64,20837.83l-1.443-1.439a.56.56,0,0,1,0-.777l1.443-1.439a.545.545,0,0,1,.779,0,.553.553,0,0,1,0,.779l-.309.3h11.809l-.3-.293-.021-.02a.551.551,0,1,1,.8-.758l1.438,1.438a.552.552,0,0,1,0,.779l-1.438,1.438a.551.551,0,0,1-.779-.779l.309-.309h-11.809l.3.3.016.021a.548.548,0,0,1-.016.779.562.562,0,0,1-.38.15A.552.552,0,0,1,2493.64,20837.83Zm11.809-5.137v-.02c.162-.053.4-.225.4-.811v-8.033c0-.586-.235-.754-.4-.8V20823h1.475a1.042,1.042,0,0,1,1.035,1.041v7.615a1.038,1.038,0,0,1-1.035,1.039Zm-2.264-.422s-.434-.52-.915-1.1c-1.083-1.314-2.285-.137-2.829.359a1.226,1.226,0,0,1-1.449.258,12.458,12.458,0,0,1-1.726-1.926,1.4,1.4,0,0,0-2.312-.256c-.56.6-1.48,1.627-1.935,2.139a.48.48,0,0,1-.021-.084v-7.619a1.043,1.043,0,0,1,1.041-1.041h9.528a1.043,1.043,0,0,1,1.041,1.041v7.619a1.03,1.03,0,0,1-.324.748C2503.247,20832.359,2503.221,20832.313,2503.184,20832.271Zm-4.738-5.539a1.572,1.572,0,1,0,1.574-1.574A1.573,1.573,0,0,0,2498.446,20826.732Z" transform="translate(-2491.998 -20822.998)" />
			</svg>`;
		}
		case 'component-featured-product':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12">
				<path class="mm10_svg_icon_color" d="M2502.749,20835a.75.75,0,0,1,0-1.5h2.5a.75.75,0,1,1,0,1.5Zm-9.537,0a1.213,1.213,0,0,1-1.213-1.213v-9.574a1.215,1.215,0,0,1,1.213-1.213h5.292a1.5,1.5,0,0,1,1.5,1.5v9.291a1.209,1.209,0,0,1-1.208,1.213Zm9.537-3.5a.75.75,0,0,1,0-1.5h4.5a.75.75,0,0,1,0,1.5Zm0-3.5a.751.751,0,0,1,0-1.5h4.5a.751.751,0,0,1,0,1.5Zm1.752-4.252a.75.75,0,1,1,.748.754A.747.747,0,0,1,2504.5,20823.748Zm-2.5,0a.75.75,0,1,1,.748.754A.747.747,0,0,1,2502,20823.748Z" transform="translate(-2491.998 -20823)" />
			</svg>`;
		}
		case 'component-product-carousel':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
				<path class="mm10_svg_icon_color" d="M2501.749,20839a.751.751,0,0,1,0-1.5h2.5a.751.751,0,1,1,0,1.5Zm-9,0a.751.751,0,0,1,0-1.5h2.5a.751.751,0,1,1,0,1.5Zm9-3.5a.75.75,0,0,1,0-1.5h5.5a.75.75,0,0,1,0,1.5Zm-9,0a.75.75,0,0,1,0-1.5h5.5a.75.75,0,0,1,0,1.5Zm9.461-3.5a1.21,1.21,0,0,1-1.208-1.213v-6.58a1.208,1.208,0,0,1,1.208-1.207h4.294a1.494,1.494,0,0,1,1.5,1.494v6.293a1.21,1.21,0,0,1-1.208,1.213Zm-9,0a1.214,1.214,0,0,1-1.208-1.213v-6.58a1.211,1.211,0,0,1,1.208-1.207h4.294a1.494,1.494,0,0,1,1.5,1.494v6.293a1.21,1.21,0,0,1-1.208,1.213Z" transform="translate(-2492 -20823.002)" />
			</svg>`;
		}
		case 'component-category-carousel':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
				<path class="mm10_svg_icon_color" d="M2501.749,20839a.751.751,0,0,1,0-1.5h2.5a.751.751,0,1,1,0,1.5Zm-9,0a.751.751,0,0,1,0-1.5h2.5a.751.751,0,1,1,0,1.5Zm9-3.5a.75.75,0,0,1,0-1.5h5.5a.75.75,0,0,1,0,1.5Zm-9,0a.75.75,0,0,1,0-1.5h5.5a.75.75,0,0,1,0,1.5Zm9.461-3.5a1.21,1.21,0,0,1-1.208-1.213v-6.58a1.208,1.208,0,0,1,1.208-1.207h4.294a1.494,1.494,0,0,1,1.5,1.494v6.293a1.21,1.21,0,0,1-1.208,1.213Zm-9,0a1.214,1.214,0,0,1-1.208-1.213v-6.58a1.211,1.211,0,0,1,1.208-1.207h4.294a1.494,1.494,0,0,1,1.5,1.494v6.293a1.21,1.21,0,0,1-1.208,1.213Z" transform="translate(-2492 -20823.002)" />
			</svg>`;
		}
		case 'component-text-area':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14">
				<path class="mm10_svg_icon_color" d="M2493,20837a1,1,0,0,1,0-2h14a1,1,0,0,1,0,2Zm0-4a1,1,0,0,1,0-2h14a1,1,0,0,1,0,2Zm8-4a1,1,0,1,1,0-2h6a1,1,0,0,1,0,2Zm-7-1v-3h-1a1,1,0,0,1,0-2h4a1,1,0,0,1,0,2h-1v3a1,1,0,0,1-2,0Zm9-3a1,1,0,0,1,0-2h4a1,1,0,0,1,0,2Z" transform="translate(-2492.002 -20823.002)" />
			</svg>`;
		}
		case 'component-text-banner':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15">
				<path class="mm10_svg_icon_color" d="M2502.414,20836.5h-4.832a2.989,2.989,0,1,1-4.079-4.084v-3.828a2.99,2.99,0,1,1,4.079-4.084h4.832a2.991,2.991,0,1,1,4.084,4.084v3.828a2.992,2.992,0,1,1-4.084,4.084Zm1.088-1.5a1.492,1.492,0,0,0,1.339,1.484,1.4,1.4,0,0,0,.162.016,1.5,1.5,0,1,0-1.5-1.5Zm-9.983-.156a.775.775,0,0,0-.016.156,1.5,1.5,0,0,0,1.5,1.5,1.4,1.4,0,0,0,.162-.016,1.494,1.494,0,1,0-1.642-1.641ZM2495,20829v3a3,3,0,0,1,3,3h4a3,3,0,0,1,3-3v-3a3,3,0,0,1-3-3h-4A3,3,0,0,1,2495,20829Zm9.842-4.482a1.494,1.494,0,1,0,1.642,1.643,1.545,1.545,0,0,0,.016-.162,1.5,1.5,0,0,0-1.5-1.5A.867.867,0,0,0,2504.84,20824.518ZM2493.5,20826a.819.819,0,0,0,.016.162,1.494,1.494,0,1,0,1.642-1.643.869.869,0,0,0-.162-.016A1.5,1.5,0,0,0,2493.5,20826Zm5.951,6.014v-2.479h-.91a.544.544,0,1,1,0-1.088h2.913a.544.544,0,1,1,0,1.088h-.915v2.479a.544.544,0,1,1-1.088,0Z" transform="translate(-2492.001 -20823.002)" />
			</svg>`;
		}
		case 'component-image-text':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
				<path class="mm10_svg_icon_color" d="M2499.343,20839c-.01-.006-.021-.006-.026-.012a22.182,22.182,0,0,1-3.059-3.41c-1.083-1.484-2.751-1.887-4.1-.449-.047.053-.1.109-.157.168v-11.088a1.211,1.211,0,0,1,1.208-1.207h7.291a1.5,1.5,0,0,1,1.5,1.5v13.289a1.214,1.214,0,0,1-1.213,1.209Zm-3.154-10.994a2,2,0,1,0,2-2A2,2,0,0,0,2496.19,20828.006Zm8,3.494a.751.751,0,0,1,0-1.5h3.065a.751.751,0,0,1,0,1.5Zm0-3.5a.75.75,0,0,1,0-1.5h1.062a.75.75,0,1,1,0,1.5Zm0-3.5a.75.75,0,0,1,0-1.5h3.065a.75.75,0,0,1,0,1.5Z" transform="translate(-2492 -20823.002)" />
			</svg>`;
		}
		case 'component-quick-order':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
				<path class="mm10_svg_icon_color" d="M1,16a1,1,0,0,1-1-1V13a1,1,0,0,1,1-1H3a1,1,0,0,1,1,1v2a1,1,0,0,1-1,1Zm7-1a1,1,0,0,1,0-2h7a1,1,0,0,1,0,2ZM1,10A1,1,0,0,1,0,9V7A1,1,0,0,1,1,6H3A1,1,0,0,1,4,7V9a1,1,0,0,1-1,1ZM8,9A1,1,0,0,1,8,7h7a1,1,0,0,1,0,2ZM1,4A1,1,0,0,1,0,3V1A1,1,0,0,1,1,0H3A1,1,0,0,1,4,1V3A1,1,0,0,1,3,4ZM8,3A1,1,0,0,1,8,1h7a1,1,0,0,1,0,2Z" />
			</svg>`;
		}
		case 'component-combination-facet':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
				<path class="mm10_svg_icon_color" d="M-192.34-319A1.66,1.66,0,0,1-194-320.66v-12.681A1.661,1.661,0,0,1-192.34-335h12.68a1.659,1.659,0,0,1,1.66,1.659v12.681a1.66,1.66,0,0,1-1.66,1.66Zm-.16-6.987v5.221a.265.265,0,0,0,.264.266h12.472a.266.266,0,0,0,.265-.266v-5.221a.266.266,0,0,0-.265-.265h-12.472A.265.265,0,0,0-192.5-325.986Zm0-7.25v5.221a.263.263,0,0,0,.264.264h12.472a.264.264,0,0,0,.265-.264v-5.221a.265.265,0,0,0-.265-.265h-12.472A.264.264,0,0,0-192.5-333.236Zm9.842,10.769-1.389-1.372a.312.312,0,0,1-.072-.338.31.31,0,0,1,.285-.2h2.731a.317.317,0,0,1,.286.193.319.319,0,0,1-.058.341l-1.342,1.372a.312.312,0,0,1-.221.092A.312.312,0,0,1-182.658-322.466Zm-7.88-.157a.753.753,0,0,1-.676-.75.754.754,0,0,1,.676-.751h4.033a.756.756,0,0,1,.669.751.755.755,0,0,1-.669.75Zm7.88-7.095-1.389-1.373a.311.311,0,0,1-.072-.338.31.31,0,0,1,.285-.2h2.731a.32.32,0,0,1,.286.193.319.319,0,0,1-.058.341l-1.342,1.373a.313.313,0,0,1-.221.091A.313.313,0,0,1-182.658-329.718Zm-7.88-.158a.715.715,0,0,1-.673-.75.715.715,0,0,1,.673-.75h4.033a.714.714,0,0,1,.672.75.714.714,0,0,1-.672.75Z" transform="translate(194 335)" />
			</svg>`;
		}
		case 'component-accordion':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15">
				<path class="mm10_svg_icon_color" d="M15.63,0h-3.24c-.2,0-.37.17-.37.37,0,.1.04.19.11.26l1.65,1.63c.15.15.38.15.53,0l1.59-1.63c.14-.15.13-.39-.03-.54-.07-.06-.15-.1-.25-.1M15.63,6h-3.24c-.2,0-.37.17-.37.37,0,.1.04.19.11.26l1.65,1.63c.15.15.38.15.53,0l1.6-1.63c.14-.15.13-.39-.03-.54-.07-.06-.16-.1-.25-.1M15.63,12h-3.24c-.2,0-.37.17-.37.37,0,.1.04.19.11.26l1.65,1.63c.15.15.38.15.53,0l1.6-1.63c.14-.15.13-.39-.03-.54-.07-.06-.16-.1-.25-.1M8,12.19H1c-.55,0-1,.45-1,1s.45,1,1,1h7c.55,0,1-.45,1-1s-.45-1-1-1M1,8.19h7c.55,0,1-.45,1-1s-.45-1-1-1H1c-.55,0-1,.45-1,1s.45,1,1,1M1,2.19h7c.55,0,1-.45,1-1s-.45-1-1-1H1C.45.19,0,.63,0,1.19s.45,1,1,1" />
			</svg>`;
		}
		case 'component-product-list':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
				<path class="mm10_svg_icon_color" d="M5.5,0H1.21C.54,0,0,.54,0,1.21h0v4.59c0,.67.54,1.21,1.21,1.21h4.58c.67,0,1.21-.54,1.21-1.21V1.5c0-.83-.67-1.5-1.5-1.5M14.5,0h-4.29c-.67,0-1.21.54-1.21,1.21v4.59c0,.67.54,1.21,1.21,1.21h4.58c.67,0,1.21-.54,1.21-1.21V1.5c0-.83-.67-1.5-1.5-1.5M5.5,8.99H1.21c-.67,0-1.21.54-1.21,1.21v4.59c0,.67.54,1.21,1.21,1.21,0,0,0,0,0,0h4.58c.67,0,1.21-.54,1.21-1.21h0v-4.3c0-.83-.67-1.5-1.5-1.5M14.5,8.99h-4.29c-.67,0-1.21.54-1.21,1.21v4.59c0,.67.54,1.21,1.21,1.21,0,0,0,0,0,0h4.58c.67,0,1.21-.54,1.21-1.21h0v-4.3c0-.83-.67-1.5-1.5-1.5" />
			</svg>`;
		}
		case 'component-product-display':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
				<path class="mm10_svg_icon_color" d="M6.5,6.5H1.5V1.5h5v5ZM6.8,0H1.2C.5,0,0,.6,0,1.2v5.6c0,.7.5,1.2,1.2,1.2h5.6c.7,0,1.2-.5,1.2-1.2V1.2C8,.6,7.5,0,6.8,0M15.2,10.5H.8c-.4,0-.8.3-.8.8s.3.8.8.8h14.5c.4,0,.8-.3.8-.8s-.3-.8-.8-.8M15.2,14.5H.8c-.4,0-.8.3-.8.8s.3.8.8.8h14.5c.4,0,.8-.3.8-.8s-.3-.8-.8-.8M10.8,1.5h4.5c.4,0,.8-.3.8-.8s-.3-.8-.8-.8h-4.5c-.4,0-.8.3-.8.8s.3.8.8.8M10.8,5h4.5c.4,0,.8-.3.8-.8s-.3-.8-.8-.8h-4.5c-.4,0-.8.3-.8.8s.3.8.8.8M10.8,8.6h1.5c.4,0,.8-.3.8-.8s-.3-.8-.8-.8h-1.5c-.4,0-.8.3-.8.8s.3.8.8.8" />
			</svg>`;
		}
		case 'component-product-fitment-list':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15.5" viewBox="0 0 16 15.5">
				<path class="mm10_svg_icon_color" d="M.8,1.5h14.5c.4,0,.8-.3.8-.8s-.3-.8-.8-.8H.8c-.4,0-.8.3-.8.8s.3.8.8.8M.8,5h2.5c.4,0,.8-.3.8-.8s-.3-.8-.8-.8H.8c-.4,0-.8.3-.8.8s.3.8.8.8M6.8,3.5c-.4,0-.8.3-.8.8s.3.8.8.8h2.5c.4,0,.8-.3.8-.8s-.3-.8-.8-.8h-2.5ZM15.2,3.5h-2.5c-.4,0-.8.3-.8.8s.3.8.8.8h2.5c.4,0,.8-.3.8-.8s-.3-.8-.8-.8M15.2,7H.8c-.4,0-.8.3-.8.8s.3.8.8.8h14.5c.4,0,.8-.3.8-.8s-.3-.8-.8-.8M15.2,14H.8c-.4,0-.8.3-.8.8s.3.8.8.8h14.5c.4,0,.8-.3.8-.8s-.3-.8-.8-.8M.8,12h2.5c.4,0,.8-.3.8-.8s-.3-.8-.8-.8H.8c-.4,0-.8.3-.8.8s.3.8.8.8M9.2,12c.4,0,.8-.3.8-.8s-.3-.8-.8-.8h-2.5c-.4,0-.8.3-.8.8s.3.8.8.8h2.5ZM15.2,10.5h-2.5c-.4,0-.8.3-.8.8s.3.8.8.8h2.5c.4,0,.8-.3.8-.8s-.3-.8-.8-.8" />
			</svg>`;
		}
		case 'component-contact-form':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
				<path class="mm10_svg_icon_color" d="M15.37.63c-.54-.55-1.34-.76-2.08-.56L1.6,3.21C.45,3.52-.23,4.7.08,5.84c.17.62.6,1.14,1.19,1.4l4.47,2.03c.44.2.79.55.99.99l2.03,4.47c.34.77,1.11,1.26,1.95,1.26.06,0,.12,0,.19,0,.91-.07,1.67-.71,1.9-1.59l3.14-11.69c.2-.74,0-1.54-.56-2.08M2.01,5.6c-.17-.08-.25-.28-.17-.45.04-.09.12-.16.22-.19l10.52-2.82-5.72,5.72c-.12-.08-.25-.15-.39-.22l-4.47-2.03ZM11.04,13.94c-.05.18-.24.29-.42.24-.1-.03-.18-.1-.22-.19l-2.03-4.47c-.07-.13-.14-.26-.22-.39l5.72-5.72-2.82,10.52Z" />
			</svg>`;
		}
		case 'component-video':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13">
				<path class="mm10_svg_icon_color" d="M10.005,0H4A4,4,0,0,0,0,3.995v5.01A4,4,0,0,0,4,13h6.009A4,4,0,0,0,14,9.005V3.995A4,4,0,0,0,10.005,0M9.229,6.965,6.291,8.682a.53.53,0,0,1-.79-.474V4.785a.521.521,0,0,1,.067-.261.53.53,0,0,1,.723-.206L9.229,6.033a.535.535,0,0,1,0,.932" />
			</svg>`;
		}
		case 'component-text-utility':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13">
				<path class="mm10_svg_icon_color" d="M10,0H3.995A4,4,0,0,0,0,3.995V9a4,4,0,0,0,3.995,4H10a4,4,0,0,0,4-4V3.995A4,4,0,0,0,10,0M4.8,7.125a.525.525,0,0,1,.155.718.466.466,0,0,1-.4.253.661.661,0,0,1-.3-.082l-1.51-.969a.529.529,0,0,1-.155-.154.522.522,0,0,1,.155-.721l1.489-.963L4.235,5.2a.525.525,0,0,1,.724.169v0a.522.522,0,0,1-.17.712L3.984,6.6ZM8.825,4.071,6.091,9.359a.468.468,0,0,1-.833-.429h0L7.991,3.641a.469.469,0,1,1,.834.43m2.437,2.973-1.489.963a.74.74,0,0,1-.309.078.455.455,0,0,1-.418-.251.531.531,0,0,1,.161-.7l.814-.525-.809-.522a.528.528,0,0,1-.236-.347.521.521,0,0,1,.8-.529l1.486.956h0a.531.531,0,0,1,.153.153.521.521,0,0,1-.153.722" />
			</svg>`;
		}
		case 'component-text-editor':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
				<path class="mm10_svg_icon_color" d="M329,2608.77a.18.18,0,0,1,.005-.044H329l.524-1.731a.553.553,0,0,1,.154-.293l5.534-5.534a.572.572,0,0,1,.807,0l.81.811a.569.569,0,0,1,0,.806h0l-5.532,5.534a.6.6,0,0,1-.293.156l-1.733.52a.183.183,0,0,1-.044.005A.228.228,0,0,1,329,2608.77Zm-7-1.77a1,1,0,0,1,0-2h4a1,1,0,0,1,0,2Zm0-4a1,1,0,1,1,0-2h7a1,1,0,1,1,0,2Zm0-4a1,1,0,0,1,0-2h14a1,1,0,0,1,0,2Zm0-4a1,1,0,1,1,0-2h14a1,1,0,1,1,0,2Z" transform="translate(-321 -2593)" />
			</svg>`;
		}
		case 'component-non-element':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
				<path class="mm10_svg_icon_color" d="M4444,20467v-4.74l2.774-2.773,1.238,1.238-2.265,2.264v2.262h2.265l2.26-2.262,1.238,1.238-2.774,2.773Zm12.168-.641-11.645-11.656a.857.857,0,0,1,.005-1.207.84.84,0,0,1,1.2.012l11.645,11.648a.852.852,0,0,1-.606,1.453A.827.827,0,0,1,4456.17,20466.359Zm-2.183-7.084,1.793-1.793a1.6,1.6,0,0,0-2.266-2.26l-1.792,1.793-1.238-1.238,1.792-1.793a3.351,3.351,0,1,1,4.741,4.736l-1.793,1.793Z" transform="translate(-4444.002 -20452.998)" />
			</svg>`;
		}
		case 'component-enabled':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" viewBox="0 0 18 12">
				<path class="mm10_svg_icon_color" d="M-8887.9,20829.371a.762.762,0,0,1,0-.748c.137-.225,3.284-5.621,8.9-5.621s8.764,5.4,8.9,5.621a.738.738,0,0,1,0,.748c-.137.225-3.284,5.627-8.9,5.627S-8887.764,20829.6-8887.9,20829.371Zm1.548-.371c.748,1.135,3.4,4.5,7.352,4.5s6.584-3.361,7.357-4.5c-.753-1.141-3.4-4.5-7.357-4.5S-8885.584,20827.859-8886.353,20829Zm3.6,0a3.75,3.75,0,0,1,3.749-3.75,3.75,3.75,0,0,1,3.75,3.75,3.76,3.76,0,0,1-1.1,2.65,3.759,3.759,0,0,1-2.651,1.094A3.745,3.745,0,0,1-8882.75,20829Zm1.5,0a2.252,2.252,0,0,0,2.248,2.248,2.249,2.249,0,0,0,2.249-2.248,2.245,2.245,0,0,0-2.249-2.248A2.248,2.248,0,0,0-8881.249,20829Z" transform="translate(8887.998 -20823.002)" />
			</svg>`;
		}
		case 'component-disabled':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12">
				<path class="mm10_svg_icon_color" d="M4525.037,20834.811l-1.323-1.234-.382-.361-.382-.355-.079-.072-.381-.361-.387-.361-.617-.574-3.8-3.557-.9-.846-.371-.352-.371-.344-.073-.068-.371-.346-.366-.35-1.553-1.455a.677.677,0,1,1,.926-.988l1.8,1.689.382.361.387.361.073.066.392.367.392.365.6.561,3.744,3.508.952.895.371.346.372.344.073.068.366.346.372.344,1.082,1.016a.677.677,0,0,1,.209.475.686.686,0,0,1-.183.486.653.653,0,0,1-.471.215.218.218,0,0,1-.036,0A.633.633,0,0,1,4525.037,20834.811Zm-12.837-4.936a1.037,1.037,0,0,1,0-1.225,14.72,14.72,0,0,1,2.688-2.756l.366.34.366.346.073.068.366.34.371.35a13.7,13.7,0,0,0-2.081,1.924c.941,1.072,3.2,3.311,5.652,3.311a4.687,4.687,0,0,0,1.668-.33l.4.377.387.365.084.08.387.359.387.367a7.341,7.341,0,0,1-3.315.852C4515.787,20834.643,4512.556,20830.365,4512.2,20829.875Zm12.654,2.326-.366-.346-.073-.068-.366-.34-.366-.344a13.686,13.686,0,0,0,1.966-1.842c-.941-1.076-3.2-3.309-5.647-3.309a4.724,4.724,0,0,0-1.527.271l-.4-.377-.4-.371-.083-.078-.393-.367-.387-.359a7.2,7.2,0,0,1,3.189-.795c4.209,0,7.446,4.281,7.8,4.768a1.064,1.064,0,0,1,0,1.23,15,15,0,0,1-2.583,2.666Zm-7.514-2.939a2.8,2.8,0,0,1,.162-.92l3.6,3.367a2.559,2.559,0,0,1-1.1.246A2.678,2.678,0,0,1,4517.34,20829.262Zm1.7-2.51a2.581,2.581,0,0,1,.962-.182,2.673,2.673,0,0,1,2.656,2.691,2.723,2.723,0,0,1-.115.775Z" transform="translate(-4512 -20822.998)" />
			</svg>`;
		}
		case 'pagebuilderui-property-link-product':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="13.676" height="13.674" viewBox="0 0 13.676 13.674">
				<path class="mm10_svg_icon_color" d="M-11053.21,20202.082l-4.2-4.229a2.081,2.081,0,0,1,0-2.91l5.44-5.41a1.627,1.627,0,0,1,1.242-.531h4.624a1.776,1.776,0,0,1,1.775,1.773v4.625a1.769,1.769,0,0,1-.533,1.242l-5.44,5.439a2.073,2.073,0,0,1-1.455.594A2.076,2.076,0,0,1-11053.21,20202.082Zm2.15-11.615-5.44,5.445c0,.006-.016.01-.021.02a.7.7,0,0,0-.208.482.752.752,0,0,0,.229.563l4.229,4.2a.708.708,0,0,0,.507.229.792.792,0,0,0,.558-.229l5.44-5.471a.478.478,0,0,0,.142-.34v-4.562a.477.477,0,0,0-.477-.482h-4.618A.5.5,0,0,0-11051.06,20190.467Zm2.124,2.291a.86.86,0,0,1,.857-.861h.03a.844.844,0,0,1,.826.861.859.859,0,0,1-.856.857A.859.859,0,0,1-11048.936,20192.758Z" transform="translate(11058.002 -20189.002)" />
			</svg>`;
		}
		case 'pagebuilderui-property-link-category':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
				<path class="mm10_svg_icon_color" d="M-10882.564,20582.932a2.712,2.712,0,0,1-2.618-2.8h1.307a1.363,1.363,0,0,0,1.312,1.4h7.853a1.359,1.359,0,0,0,1.312-1.4v-8.4a1.362,1.362,0,0,0-1.312-1.4h-7.853a1.366,1.366,0,0,0-1.312,1.4h-1.307a2.7,2.7,0,0,1,2.618-2.795h7.857a2.71,2.71,0,0,1,2.613,2.795v8.4a2.715,2.715,0,0,1-2.618,2.8Zm-1.844-3.8h-.774a.779.779,0,0,1-.78-.779.78.78,0,0,1,.78-.781h2.329a.78.78,0,0,1,.78.781.78.78,0,0,1-.78.779Zm-.774-2.422v-1.555h1.555v1.555Zm5.072-.141a.623.623,0,0,1-.625-.625.624.624,0,0,1,.625-.625h4.4a.624.624,0,0,1,.625.625.622.622,0,0,1-.625.625Zm-5.2-2.277a.782.782,0,0,1-.779-.779.783.783,0,0,1,.779-.781h2.335a.577.577,0,0,1,.124.031.75.75,0,0,1,.646.641.763.763,0,0,1-.646.863c-.041.01-.083.016-.124.025Zm5.2-.5a.624.624,0,0,1-.625-.625.624.624,0,0,1,.625-.625h4.4a.627.627,0,0,1,.625.625.627.627,0,0,1-.625.625Z" transform="translate(10886.092 -20568.932)" />
			</svg>`;
		}
		case 'pagebuilderui-property-link-page':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="13.22" height="14" viewBox="0 0 13.22 14">
				<path class="mm10_svg_icon_color" d="M171.915,217.362a1.607,1.607,0,0,0-.47-1.136l-.918-.918-1.392-1.392h0l-.967-.967a1.442,1.442,0,0,0-1.019-.422h-5.674a2.727,2.727,0,0,0-2.727,2.727L158.7,223.8a2.727,2.727,0,0,0,2.727,2.727h7.713a2.727,2.727,0,0,0,2.727-2.727Zm-1.7-.4-2.738.022-.023-2.782Zm.309,1.386-.054,5.45a1.338,1.338,0,0,1-1.339,1.338h-7.713a1.338,1.338,0,0,1-1.339-1.338l.054-8.546a1.338,1.338,0,0,1,1.339-1.339h4.616v3.07a1.366,1.366,0,0,0,1.364,1.365Z" transform="translate(-158.695 -212.527)" />
			</svg>`;
		}
		case 'pagebuilderui-property-link-screen':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
				<path class="mm10_svg_icon_color" d="M20058.461,16680h-.07a1.636,1.636,0,0,1-1.383-1.754v-10.574a1.6,1.6,0,0,1,1.453-1.672h11.074a1.6,1.6,0,0,1,1.471,1.758v10.574a1.614,1.614,0,0,1-1.471,1.668Zm-.213-1.754a.156.156,0,0,0,.143.156h11.217a.155.155,0,0,0,.143-.156v-6.465h-11.5Zm0-10.574v2.68h11.5v-2.68a.168.168,0,0,0-.143-.16h-11.217A.169.169,0,0,0,20058.248,16667.672Zm8.506,1.27a.687.687,0,0,1,.627-.758.762.762,0,0,1,0,1.5A.682.682,0,0,1,20066.754,16668.941Zm-2.369,0a.63.63,0,1,1,.613.742A.688.688,0,0,1,20064.385,16668.941Z" transform="translate(-20057.008 -16666)" />
			</svg>`;
		}
		case 'pagebuilderui-property-link-url':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="12.676" height="12.676" viewBox="0 0 12.676 12.676">
				<path class="mm10_svg_icon_color" d="M11.893,9.719a.769.769,0,0,1-1.087-1.088l2.175-2.175a3.076,3.076,0,0,1,4.349,4.35l-2.175,2.174a.769.769,0,1,1-1.087-1.087l2.175-2.175a1.538,1.538,0,1,0-2.175-2.174Zm0,4.349a.769.769,0,1,1,1.088,1.087L10.806,17.33a3.076,3.076,0,0,1-4.35-4.349l2.175-2.175a.769.769,0,1,1,1.087,1.087L7.544,14.068a1.538,1.538,0,1,0,2.174,2.175Zm2.175-4.35a.77.77,0,0,1,0,1.088l-3.262,3.262A.769.769,0,0,1,9.719,12.98l3.262-3.262A.769.769,0,0,1,14.068,9.718Z" transform="translate(-5.556 -5.556)" />
			</svg>`;
		}
		case 'pagebuilderui-property-text-icon':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
				<path class="mm10_svg_icon_color" d="M-11938.1,20549.406h-1.315a.594.594,0,0,1-.588-.6v-.006a.6.6,0,0,1,.608-.6h1.295a2.163,2.163,0,0,1,1.516-1.518,2.161,2.161,0,0,1,2.651,1.518h7.35a.59.59,0,0,1,.583.6.6.6,0,0,1-.608.6h-7.324a2.153,2.153,0,0,1-1.517,1.516,2.141,2.141,0,0,1-.571.078A2.157,2.157,0,0,1-11938.1,20549.406Zm1.1-.6a.988.988,0,0,0,.984.984,1,1,0,0,0,.985-.984.989.989,0,0,0-.985-.986A.988.988,0,0,0-11937,20548.8Zm4.981-4.193h-7.375a.61.61,0,0,1-.608-.609.606.606,0,0,1,.608-.6h7.375a2.239,2.239,0,0,1,2.1-1.594,2.181,2.181,0,0,1,2.078,1.594h1.285a.584.584,0,0,1,.557.6v.006a.612.612,0,0,1-.608.6h-1.248a2.153,2.153,0,0,1-1.512,1.512,2.22,2.22,0,0,1-.571.076A2.158,2.158,0,0,1-11932.019,20544.609Zm1.114-.609a.986.986,0,0,0,.985.986.986.986,0,0,0,.985-.986v-.035a.975.975,0,0,0-.985-.949h-.031A.971.971,0,0,0-11930.9,20544Zm-7.194-4.2h-1.295a.029.029,0,0,1-.025,0,.59.59,0,0,1-.578-.6v-.006a.6.6,0,0,1,.6-.6h1.295a2.16,2.16,0,0,1,1.516-1.516,2.155,2.155,0,0,1,2.646,1.516h7.354a.6.6,0,0,1,.583.609v0a.6.6,0,0,1-.608.6h-7.329a2.148,2.148,0,0,1-1.512,1.516,2.117,2.117,0,0,1-.568.076A2.162,2.162,0,0,1-11938.1,20539.8Zm1.1-.6a.983.983,0,0,0,.984.979h.036a.961.961,0,0,0,.949-.979.986.986,0,0,0-.985-.986A1.016,1.016,0,0,0-11937,20539.2Z" transform="translate(11940.002 -20536.998)" />
			</svg>`;
		}
		case 'pagebuilderui-element-list-add':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
				<path class="mm10_svg_icon_color" d="M47.128,43.128H44.716V40.716a.794.794,0,1,0-1.588,0v2.412H40.716a.794.794,0,1,0,0,1.588h2.412v2.412a.794.794,0,0,0,1.588,0V44.716h2.412a.794.794,0,1,0,0-1.588Z" transform="translate(-39.922 -39.922)" />
			</svg>`;
		}
		case 'pagebuilderui-markdown-unavailable':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="14.279" viewBox="0 0 16 14.279">
				<path class="mm10_svg_icon_color" d="M23495.234,19837.281h-9.176a3.385,3.385,0,0,1-2.217-.809,3.4,3.4,0,0,1-.691-4.377l4.6-7.477a3.406,3.406,0,0,1,5.8,0l4.588,7.477h.006a3.4,3.4,0,0,1-2.883,5.186Zm-6.25-11.9-4.6,7.473a1.952,1.952,0,0,0,1.658,2.967h9.188a1.947,1.947,0,0,0,1.658-2.967.118.118,0,0,1-.023-.047l-4.564-7.426a1.951,1.951,0,0,0-3.32,0Zm.783,8.174a.873.873,0,0,1,1.746,0,.873.873,0,0,1-1.746,0Zm.383-2.033a.678.678,0,0,1-.205-.49v-3.668a.7.7,0,0,1,1.391,0v3.668a.678.678,0,0,1-.205.49.688.688,0,0,1-.98,0Z" transform="translate(-23482.645 -19823.002)" />
			</svg>`;
		}
		case 'pagebuilderui-markdown-bold':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="10" viewBox="0 0 8 10">
				<path class="mm10_svg_icon_color" d="M25,18.75h3.8a9.764,9.764,0,0,1,1.331.092,3.69,3.69,0,0,1,1.2.367,2.29,2.29,0,0,1,.864.77,2.326,2.326,0,0,1,.331,1.314,2.072,2.072,0,0,1-.482,1.4,2.655,2.655,0,0,1-1.273.8,4.022,4.022,0,0,1,.914.3,2.449,2.449,0,0,1,.7.522,2.228,2.228,0,0,1,.453.742,2.559,2.559,0,0,1,.158.9,2.366,2.366,0,0,1-.346,1.321,2.687,2.687,0,0,1-.892.854,3.952,3.952,0,0,1-1.23.466,6.688,6.688,0,0,1-1.36.141H25Zm2.244,4H28.87a2.337,2.337,0,0,0,.511-.056,1.416,1.416,0,0,0,.453-.184.956.956,0,0,0,.324-.339,1,1,0,0,0,.122-.509.907.907,0,0,0-.137-.515.947.947,0,0,0-.352-.318,1.714,1.714,0,0,0-.489-.162,2.966,2.966,0,0,0-.532-.049H27.244Zm0,4.139h2.014a2.536,2.536,0,0,0,.526-.056,1.407,1.407,0,0,0,.482-.2,1.131,1.131,0,0,0,.352-.367,1.045,1.045,0,0,0,.137-.551.873.873,0,0,0-.18-.572,1.136,1.136,0,0,0-.453-.332,2.373,2.373,0,0,0-.59-.156,4.48,4.48,0,0,0-.59-.042h-1.7Z" transform="translate(-25 -18.75)" />
			</svg>`;
		}
		case 'pagebuilderui-markdown-italic':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="5.631" height="10.206" viewBox="0 0 5.631 10.206">
				<path class="mm10_svg_icon_color" d="M39.631,22.408V21H35.408v1.408h1.336L35.459,29.8H34v1.408h4.223V29.8H36.888l1.285-7.391Z" transform="translate(-34 -21)" />
			</svg>`;
		}
		case 'pagebuilderui-markdown-link':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="12.163" height="12.066" viewBox="0 0 12.163 12.066">
				<path class="mm10_svg_icon_color" d="M15404.673,20202.693a3.369,3.369,0,0,1-2.438-1.105,3.494,3.494,0,0,1-.888-2.338,3.419,3.419,0,0,1,1.02-2.469l1.374-1.373a.588.588,0,0,1,.426-.178.606.606,0,0,1,.431,1.029l-1.374,1.373a2.241,2.241,0,0,0-.664,1.613,2.275,2.275,0,0,0,.578,1.531,2.155,2.155,0,0,0,1.571.705,2.575,2.575,0,0,0,1.851-.736l1.263-1.262a.606.606,0,1,1,.856.857l-1.262,1.262a3.746,3.746,0,0,1-2.649,1.092Zm.051-3.33a.623.623,0,0,1-.173-.432.6.6,0,0,1,.173-.426l4.548-4.549a.612.612,0,0,1,.426-.178.624.624,0,0,1,.431.178.613.613,0,0,1,0,.857l-4.548,4.549a.635.635,0,0,1-.856,0Zm5.531-1.451a.6.6,0,0,1,0-.857l1.374-1.373a2.266,2.266,0,0,0,.669-1.607,2.306,2.306,0,0,0-.577-1.531,2.176,2.176,0,0,0-1.577-.705h-.071a2.546,2.546,0,0,0-1.79.74l-1.257,1.252a.6.6,0,0,1-.852,0,.6.6,0,0,1,0-.855l1.252-1.254a3.768,3.768,0,0,1,2.748-1.09,3.361,3.361,0,0,1,2.444,1.105,3.495,3.495,0,0,1-.132,4.8l-1.374,1.373a.613.613,0,0,1-.431.176A.6.6,0,0,1,15410.255,20197.912Z" transform="translate(-15401.347 -20190.629)" />
			</svg>`;
		}
		case 'pagebuilderui-markdown-numberedlist':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="13.885" height="12.236" viewBox="0 0 13.885 12.236">
				<path class="mm10_svg_icon_color" d="M15832,20212.846l.289-.223a.537.537,0,0,0,.487.254c.273,0,.426-.137.426-.34s-.162-.34-.416-.34h-.253v-.311h.253c.233,0,.376-.127.376-.314s-.138-.314-.386-.314a.5.5,0,0,0-.446.229l-.279-.223a.871.871,0,0,1,.735-.33c.5,0,.792.258.792.6a.5.5,0,0,1-.346.482v.01a.542.542,0,0,1,.391.527c0,.371-.309.645-.837.645A.89.89,0,0,1,15832,20212.846Zm3.886.32a1,1,0,1,1,0-2h9a1,1,0,0,1,0,2Zm0-5a1,1,0,1,1,0-2h9a1,1,0,1,1,0,2Zm-3.814,0v-.283l.776-.766a.8.8,0,0,0,.309-.533c0-.193-.121-.324-.365-.324a.533.533,0,0,0-.456.258l-.279-.213a.875.875,0,0,1,.761-.375c.478,0,.756.264.756.635a.957.957,0,0,1-.365.7l-.583.568v.006h.989v.328Zm3.814-5a1,1,0,1,1,0-2h9a1,1,0,1,1,0,2Zm-3.7,0v-.328h.522v-1.441a1.985,1.985,0,0,1-.522.223v-.344a1.664,1.664,0,0,0,.608-.311h.33v1.873h.513v.328Z" transform="translate(-15832.002 -20200.965)" />
			</svg>`;
		}
		case 'pagebuilderui-markdown-bulletedlist':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="12.002" viewBox="0 0 14 12.002">
				<path class="mm10_svg_icon_color" d="M15839,20213a1,1,0,1,1,0-2h9a1,1,0,1,1,0,2Zm-3,0a1,1,0,1,1,0-2h.051a1,1,0,1,1,0,2Zm3-5a1,1,0,1,1,0-2h9a1,1,0,1,1,0,2Zm-3,0a1,1,0,1,1,0-2h.051a1,1,0,1,1,0,2Zm3-5a1,1,0,0,1,0-2h9a1,1,0,0,1,0,2Zm-3,0a1,1,0,0,1,0-2h.051a1,1,0,1,1,0,2Z" transform="translate(-15835.001 -20200.998)" />
			</svg>`;
		}
		case 'pagebuilderui-markdown-more':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="3.504" viewBox="0 0 16 3.504">
				<path class="mm10_svg_icon_color" d="M15476.5,20193.117a1.751,1.751,0,1,1,1.748,1.75A1.751,1.751,0,0,1,15476.5,20193.117Zm-6.244,0a1.751,1.751,0,1,1,1.748,1.75A1.751,1.751,0,0,1,15470.254,20193.117Zm-6.254,0a1.751,1.751,0,1,1,1.753,1.75A1.755,1.755,0,0,1,15464,20193.117Z" transform="translate(-15464 -20191.363)" />
			</svg>`;
		}
		case 'pagebuilderui-markdown-headings':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="11.38" height="9.809" viewBox="0 0 11.38 9.809">
				<path class="mm10_svg_icon_color" d="M15396.5,19067.811v-3.531h-1.177v-1.57h1.962a.771.771,0,0,1,.556.23.78.78,0,0,1,.229.555v4.316Zm-4.312,0v-4.316h-3.929v4.316h-1.569V19058h1.569v3.924h3.929V19058h1.565v9.809Z" transform="translate(-15386.688 -19058.002)" />
			</svg>`;
		}
		case 'pagebuilderui-markdown-blockquote':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="11.002" height="11.477" viewBox="0 0 11.002 11.477">
				<path class="mm10_svg_icon_color" d="M15381.548,19024.207v-1.623a.2.2,0,0,1,.2-.2,1.032,1.032,0,0,0,.363-.066c.015-.01.015-.01.01-.01h.01a.172.172,0,0,0,.033-.02.532.532,0,0,0,.081-.043.679.679,0,0,0,.086-.053l.01-.014h0a.061.061,0,0,1,.023-.02.991.991,0,0,0,.315-.516c0-.029.014-.066.019-.1,0,.027,0-.049,0-.053v-.621h-1.757a.655.655,0,0,1-.645-.645v-3.109a.655.655,0,0,1,.654-.662h3.117a.651.651,0,0,1,.6.42,1.169,1.169,0,0,1,.043.43v4a3.915,3.915,0,0,1-.043.631,2.917,2.917,0,0,1-.524,1.236,3.007,3.007,0,0,1-2.407,1.227A.2.2,0,0,1,15381.548,19024.207ZM15382.9,19020.875Zm-5.893-.006h-2.645a.657.657,0,0,1-.6-.42,1.169,1.169,0,0,1-.043-.43v-4a3.52,3.52,0,0,1,.048-.631,2.869,2.869,0,0,1,.521-1.236,3.018,3.018,0,0,1,2.406-1.227.2.2,0,0,1,.2.2v1.623a.2.2,0,0,1-.2.2.887.887,0,0,0-.358.072l-.018,0h0a.182.182,0,0,0-.039.02c-.028.014-.052.029-.081.043l-.081.057c-.023.016,0,0-.019.016a.207.207,0,0,0-.024.02.917.917,0,0,0-.311.51.892.892,0,0,0-.019.1c0-.027,0,.049,0,.053v.627h1.423c.109,0,.22-.006.329,0a.646.646,0,0,1,.642.59.17.17,0,0,1,.008.049v3.113a.659.659,0,0,1-.659.658Z" transform="translate(-15373.717 -19012.926)" />
			</svg>`;
		}
		case 'pagebuilderui-markdown-enable':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="14.001" height="9.334" viewBox="0 0 14.001 9.334">
				<path class="mm10_svg_icon_color" d="M13342.665,20191a4.667,4.667,0,1,1,0-9.334h4.667a4.667,4.667,0,1,1,0,9.334Zm-3.517-4.662a3.518,3.518,0,0,0,3.517,3.512h4.667a3.517,3.517,0,1,0,0-7.033h-4.667A3.522,3.522,0,0,0,13339.148,20186.338Zm1.1,0a2.691,2.691,0,1,1,2.7,2.686A2.694,2.694,0,0,1,13340.248,20186.338Z" transform="translate(-13337.998 -20181.666)" fill="#6a6e79"/>
			</svg>`;
		}
		case 'pagebuilderui-markdown-disable':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="14.001" height="9.334" viewBox="0 0 14.001 9.334">
				<path class="mm10_svg_icon_color" d="M13342.665,20191a4.667,4.667,0,1,1,0-9.334h4.667a4.667,4.667,0,1,1,0,9.334Zm-3.517-4.662a3.518,3.518,0,0,0,3.517,3.512h4.667a3.517,3.517,0,1,0,0-7.033h-4.667A3.522,3.522,0,0,0,13339.148,20186.338Zm1.1,0a2.691,2.691,0,1,1,2.7,2.686A2.694,2.694,0,0,1,13340.248,20186.338Z" transform="translate(-13337.998 -20181.666)" fill="#6a6e79"/>
			</svg>`;
		}
		case 'pagebuilderui-markdown-help':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="11.999" height="11.998" viewBox="0 0 11.999 11.998">
				<path class="mm10_svg_icon_color" d="M15367.756,18941.242A6,6,0,1,1,15372,18943,6,6,0,0,1,15367.756,18941.242Zm.766-7.721a4.922,4.922,0,1,0,3.48-1.441A4.917,4.917,0,0,0,15368.521,18933.521Zm3.043,6.484a.6.6,0,0,1,.423-1.027.615.615,0,0,1,.423.176.6.6,0,0,1-.194.979.569.569,0,0,1-.23.049A.6.6,0,0,1,15371.564,18940.006Zm.827-1.721h-.423v-.01h-.442a.123.123,0,0,1-.1-.039.125.125,0,0,1-.043-.1,4.469,4.469,0,0,1,.09-1.127,1.008,1.008,0,0,1,.267-.475c.124-.129.252-.242.38-.361s.285-.252.433-.371a.5.5,0,0,0-.109-.855.84.84,0,0,0-1.174.414,1.645,1.645,0,0,0-.071.223c-.028.105-.076.143-.186.129l-.855-.1a.171.171,0,0,1-.114-.062.14.14,0,0,1-.028-.123,1.776,1.776,0,0,1,.466-1.018,1.718,1.718,0,0,1,.988-.527,2.45,2.45,0,0,1,1.508.137,1.627,1.627,0,0,1,.922.961,1.268,1.268,0,0,1-.2,1.264,4.249,4.249,0,0,1-.694.676c-.081.072-.157.146-.238.215a.543.543,0,0,0-.2.438c0,.184-.01.365-.015.551a.155.155,0,0,1-.042.119.145.145,0,0,1-.1.043Z" transform="translate(-15366.002 -18931.002)" />
			</svg>`;
		}
		case 'pagebuilderui-markdown-subitem':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="5" height="5" viewBox="0 0 5 5">
				<path class="mm10_svg_icon_color" d="M2.5,1A1.5,1.5,0,1,0,4,2.5,1.5,1.5,0,0,0,2.5,1m0-1A2.5,2.5,0,1,1,0,2.5,2.5,2.5,0,0,1,2.5,0Z" />
			</svg>`;
		}
		case 'pagebuilderui-screensizes-additional':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
				<path class="mm10_svg_icon_color" d="M15950.564,20839a3.566,3.566,0,0,1-3.562-3.562v-8.875a3.561,3.561,0,0,1,3.562-3.561h8.875a3.562,3.562,0,0,1,3.562,3.561v8.875a3.567,3.567,0,0,1-3.562,3.563Zm-2.191-12.437v8.875a2.194,2.194,0,0,0,2.191,2.191h8.875a2.194,2.194,0,0,0,2.191-2.191v-8.875a2.195,2.195,0,0,0-2.191-2.191h-8.875A2.195,2.195,0,0,0,15948.373,20826.563Zm3.148,7-1.443-2.166a.238.238,0,0,1-.042-.068.578.578,0,0,1-.053-.125.673.673,0,0,1-.031-.2.641.641,0,0,1,.031-.2.479.479,0,0,1,.053-.121.292.292,0,0,1,.042-.072l1.443-2.166a.684.684,0,1,1,1.14.758l-.742,1.115h6.166l-.748-1.119a.685.685,0,1,1,1.14-.76l1.444,2.166a.471.471,0,0,1,.063.1.725.725,0,0,1,.063.289v.02a.7.7,0,0,1-.142.408l-1.428,2.135a.676.676,0,0,1-.569.3.739.739,0,0,1-.382-.109.688.688,0,0,1-.188-.951l.742-1.115h-6.16l.742,1.115a.688.688,0,0,1-.188.951.683.683,0,0,1-.951-.193Z" transform="translate(-15947.003 -20823.002)" />
			</svg>`;
		}
		case 'pagebuilderui-screensizes-default':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="15.998" height="15.998" viewBox="0 0 15.998 15.998">
				<path class="mm10_svg_icon_color" d="M15951,20839a.751.751,0,0,1,0-1.5h8a.751.751,0,0,1,0,1.5Zm-1.255-2.662a2.745,2.745,0,0,1-2.74-2.746v-7.85a2.742,2.742,0,0,1,2.74-2.74h10.512a2.747,2.747,0,0,1,2.746,2.74v7.85a2.75,2.75,0,0,1-2.746,2.746Zm-1.245-2.746a1.252,1.252,0,0,0,1.245,1.25h10.512a1.252,1.252,0,0,0,1.245-1.25v-.842h-13Zm0-7.85v5.512h13v-5.512a1.244,1.244,0,0,0-1.245-1.24h-10.512A1.244,1.244,0,0,0,15948.5,20825.742Z" transform="translate(-15947.003 -20823.002)" />
			</svg>`;
		}
		case 'cancel-icon-small':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="5.973" height="5.939" viewBox="0 0 5.973 5.939">
				<path class="mm10_svg_icon_color" d="M35.692,35.476l2.13-2.113a.494.494,0,0,0-.7-.7l-2.13,2.113-2.146-2.13a.494.494,0,0,0-.7.7l2.13,2.113-2.13,2.13a.482.482,0,0,0,0,.7.506.506,0,0,0,.35.149.481.481,0,0,0,.35-.149l2.146-2.113,2.13,2.113a.506.506,0,0,0,.35.149.5.5,0,0,0,.35-.848Z" transform="translate(-31.999 -32.498)" />
			</svg>`;
		}
		case 'cancel-icon':
		{
			return `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M12.2196 0.21967C12.5125 -0.0732232 12.9873 -0.0732232 13.2802 0.21967C13.5731 0.512563 13.5731 0.987323 13.2802 1.28022L7.80948 6.74994L13.2792 12.2197C13.5721 12.5126 13.5721 12.9873 13.2792 13.2802C12.9863 13.573 12.5115 13.5731 12.2187 13.2802L6.74894 7.81049L1.28116 13.2792C0.988269 13.5721 0.513509 13.5721 0.220615 13.2792C-0.072272 12.9863 -0.0722757 12.5116 0.220615 12.2187L5.68839 6.74994L0.219639 1.28119C-0.0732343 0.988321 -0.0731917 0.513545 0.219639 0.220646C0.512532 -0.0722476 0.987292 -0.0722464 1.28019 0.220646L6.74894 5.6894L12.2196 0.21967Z" />
			</svg>`;
		}
		case 'search-plus':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
				<path class="mm10_svg_icon_color" d="M14.677,15.771l-3.3-3.309a7.019,7.019,0,1,1,1.091-1.092l3.31,3.3a.776.776,0,0,1,0,1.1.764.764,0,0,1-.546.227A.776.776,0,0,1,14.677,15.771ZM3.144,3.143a5.452,5.452,0,1,0,7.71,7.711h0A5.454,5.454,0,0,0,3.144,3.143ZM6.227,9.676v-1.9h-1.9a.774.774,0,1,1,0-1.549h1.9v-1.9a.775.775,0,0,1,1.549,0v1.9h1.9a.774.774,0,1,1,0,1.549h-1.9v1.9a.775.775,0,1,1-1.549,0Z" />
			</svg>`;
		}
		case 'image-picker':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
				<path class="mm10_svg_icon_color" d="M-10906.743,20837a1.263,1.263,0,0,1-1.255-1.26v-11.484a1.258,1.258,0,0,1,1.255-1.254h11.468a1.27,1.27,0,0,1,1.276,1.254v11.484a1.268,1.268,0,0,1-1.261,1.26Zm5.063-4.131,3.048,3.043h3.357a.184.184,0,0,0,.188-.172v-1.924l-3.771-3.771Zm-5.251,2.359v.5a.187.187,0,0,0,.188.188h6.595l-3.734-3.732Zm0-10.988v9.471l2.688-2.672a.541.541,0,0,1,.753,0l1.051,1.051,3.206-3.2a.544.544,0,0,1,.758,0l3.389,3.373v-8.023a.171.171,0,0,0-.173-.172h-11.483A.185.185,0,0,0-10906.932,20824.24Zm1.961,3.217a2.2,2.2,0,0,1,2.207-2.2,2.2,2.2,0,0,1,2.2,2.2,2.221,2.221,0,0,1-2.2,2.207A2.212,2.212,0,0,1-10904.971,20827.457Zm.968,0a1.257,1.257,0,0,0,1.239,1.244,1.26,1.26,0,0,0,1.239-1.244,1.249,1.249,0,0,0-1.239-1.24A1.246,1.246,0,0,0-10904,20827.457Z" transform="translate(10907.998 -20823.002)" />
			</svg>`;
		}
		case 'clock':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
				<path class="mm10_svg_icon_color" d="M23,17a6,6,0,1,0,6,6A6.008,6.008,0,0,0,23,17Zm0,1.091A4.909,4.909,0,1,1,18.091,23,4.9,4.9,0,0,1,23,18.091Zm0,1.091a.546.546,0,0,0-.545.545V23a.545.545,0,0,0,.273.472l2.517,1.455a.545.545,0,1,0,.545-.943l-2.244-1.3v-2.96A.546.546,0,0,0,23,19.182Z" transform="translate(-17 -17)" />
			</svg>`;
		}
		case 'content-management':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="15" viewBox="0 0 18 15">
				<path class="mm10_svg_icon_color" d="M8779.513,20760.947c-.025-.01-.057,0-.083-.02a.466.466,0,0,1-.177-.23l-.517-1.406-1.709-4.684a.461.461,0,0,1-.016-.25.365.365,0,0,1,.031-.068.376.376,0,0,1,.136-.193.371.371,0,0,1,.125-.072.564.564,0,0,1,.089-.021.442.442,0,0,1,.214.006l4.782,1.621,1.3.438a.463.463,0,0,1,.313.432.448.448,0,0,1-.073.256.431.431,0,0,1-.224.182l-1.313.5-1.187.449a.425.425,0,0,0-.172.115.473.473,0,0,0-.1.176l-.359,1.115-.448,1.387,0,.01a.437.437,0,0,1-.167.229.285.285,0,0,1-.1.031.446.446,0,0,1-.162.053A.421.421,0,0,1,8779.513,20760.947Zm-9.628.053h-2.09a1.89,1.89,0,0,1-1.8-1.887V20747.8a1.882,1.882,0,0,1,1.887-1.8h14.234a1.842,1.842,0,0,1,1.881,1.8v6.6l-1.61-.541v-2.637h-9.18v8.07h3.746l.62,1.709Zm-2.282-1.9a.182.182,0,0,0,.172.184s.01.01.016.01h3.813v-8.07h-4Zm0-11.289v1.8h14.786v-1.814a.2.2,0,0,0-.052-.113c-.021-.027-.047-.031-.078-.043-.016-.01-.026-.025-.047-.025h0c-.006,0-.006-.006-.011-.006h-14.4A.2.2,0,0,0,8767.6,20747.809Z" transform="translate(-8765.997 -20746)" />
			</svg>`;
		}
		case 'lock':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="12.904" height="16.002" viewBox="0 0 12.904 16.002">
				<path class="mm10_svg_icon_color" d="M15651.808,18671a1.81,1.81,0,0,1-1.809-1.809v-6.2a1.806,1.806,0,0,1,1.809-1.8h.773v-2.324a3.871,3.871,0,0,1,7.741,0v2.324h.772a1.807,1.807,0,0,1,1.809,1.8v6.2a1.81,1.81,0,0,1-1.809,1.809Zm-.258-8v6.2a.257.257,0,0,0,.258.258h9.287a.259.259,0,0,0,.183-.076.248.248,0,0,0,.08-.182v-6.2a.263.263,0,0,0-.263-.258h-9.287A.257.257,0,0,0,15651.55,18663Zm2.577-4.129v2.324h4.648v-2.324a2.324,2.324,0,0,0-4.648,0Zm1.552,7.227a.773.773,0,1,1,1.546,0,.773.773,0,1,1-1.546,0Z" transform="translate(-15649.999 -18655.002)" />
			</svg>`;
		}
		case 'unlock':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="13.902" height="17.998" viewBox="0 0 13.902 17.998">
				<path class="mm10_svg_icon_color" d="M17092.807,18451a1.806,1.806,0,0,1-1.807-1.807v-6.2a1.8,1.8,0,0,1,1.807-1.8h.773v-3.324h0a3.871,3.871,0,0,1,7.742,0v1.338h-1.555v-1.338a.408.408,0,0,0,0-.1,2.323,2.323,0,1,0-4.645.1v3.324h6.973a1.808,1.808,0,0,1,1.8,1.8v6.2a1.809,1.809,0,0,1-1.8,1.807Zm-.26-8v6.2a.263.263,0,0,0,.26.26h9.289a.258.258,0,0,0,.26-.26v-6.2a.254.254,0,0,0-.256-.254h-9.293A.262.262,0,0,0,17092.547,18442.994Zm4.131,3.1a.773.773,0,1,1,.773.773A.776.776,0,0,1,17096.678,18446.1Z" transform="translate(-17090.5 -18433.498)" fill="#2f75ff" stroke="rgba(0,0,0,0)" stroke-miterlimit="10" stroke-width="1"/>
			</svg>`;
		}
		case 'collection':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="19.999" height="17.42" viewBox="0 0 19.999 17.42">
				<path class="mm10_svg_icon_color" d="M14516.564,20774.42a5.573,5.573,0,0,1-5.562-5.568v-3.008a2.68,2.68,0,0,1,2.408-2.664v-.418a2.682,2.682,0,0,1,2.409-2.664v-.422a2.677,2.677,0,0,1,2.674-2.676h5.011a2.677,2.677,0,0,1,2.675,2.676v.422a2.686,2.686,0,0,1,2.414,2.664v.418a2.68,2.68,0,0,1,2.408,2.664v3.008a5.574,5.574,0,0,1-5.568,5.568Zm-3.686-8.576v3.008a3.688,3.688,0,0,0,3.686,3.686h8.868a3.692,3.692,0,0,0,3.687-3.686v-3.008a.8.8,0,0,0-.793-.793h-14.65A.8.8,0,0,0,14512.879,20765.844Zm2.408-3.082v.406h11.423v-.406a.8.8,0,0,0-.792-.8h-9.833A.8.8,0,0,0,14515.287,20762.762Zm2.414-3.086v.406h6.6v-.406a.8.8,0,0,0-.8-.8h-5.011A.8.8,0,0,0,14517.7,20759.676Zm.756,8.994a.96.96,0,0,1-.678-1.639.945.945,0,0,1,.678-.281h5.089a.96.96,0,0,1,0,1.92Z" transform="translate(-14511.002 -20757)" />
			</svg>`;
		}
		case 'ai':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="12.001" height="12.002" viewBox="0 0 12.001 12.002">
				<path class="mm10_svg_icon_color" d="M15295.463,20203.363l-.984-2.287a2.434,2.434,0,0,0-1.252-1.262l-2.373-1.051a.228.228,0,0,1,0-.416l2.332-1.014a2.459,2.459,0,0,0,1.258-1.262l1.015-2.328a.226.226,0,0,1,.415,0l1.015,2.328a2.461,2.461,0,0,0,1.257,1.262l2.328,1.014a.227.227,0,0,1,0,.416l-2.328,1.016a2.429,2.429,0,0,0-1.257,1.256l-1.015,2.328a.222.222,0,0,1-.41,0Zm5.06-7.7-.42-.975a1.035,1.035,0,0,0-.533-.543l-1.009-.445a.1.1,0,0,1,0-.178l.994-.436a1.015,1.015,0,0,0,.532-.533l.436-.994a.1.1,0,0,1,.178,0l.432.994a1.024,1.024,0,0,0,.537.533l.994.436a.1.1,0,0,1,0,.178l-.994.43a1.074,1.074,0,0,0-.537.539l-.432.994a.1.1,0,0,1-.089.057A.1.1,0,0,1,15300.522,20195.662Z" transform="translate(-15290.719 -20191.498)" />
			</svg>`;
		}
		case 'ai-send':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="19.175" height="19.694" viewBox="0 0 19.175 19.694">
				<path class="mm10_svg_icon_color" d="M-4851.114,1065.83-4860,1062.9l19.175-8.1-6.742,19.694Zm3.463,5.817,4.758-13.9-7.262,7.787Zm-9.508-8.866,6.273,2.071,7.262-7.787Z" transform="translate(4860.001 -1054.797)" />
			</svg>`;
		}
		case 'favorites':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="20" viewBox="0 0 15 20">
				<path class="mm10_svg_icon_color" d="M-11754.4,2628.773l-7.6,5.228v-20h15v20Zm-6.1,2.373,5.246-3.607a1.5,1.5,0,0,1,1.715.009l5.039,3.557v-15.6h-12Zm6-6.674-2.78,1.529.522-3.256-2.243-2.308,3.105-.481,1.4-2.955,1.394,2.955,3.105.481-2.243,2.308.525,3.256Zm1.468-.337-.277-1.727,1.242-1.278-1.715-.269-.718-1.517-.717,1.517-1.718.269,1.245,1.278-.277,1.727,1.467-.806Z" transform="translate(11762 -2613.999)" />
			</svg>`;
		}
		case 'tooltip':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
				<path class="mm10_svg_icon_color" d="M28296,2506a6,6,0,1,1,6,6A6.017,6.017,0,0,1,28296,2506Zm2.551-3.524-.078.078a4.932,4.932,0,1,0,7.049,6.9,5.043,5.043,0,0,0,0-7.048,4.955,4.955,0,0,0-6.971.071Zm2.771,6.153v-2.778a.675.675,0,1,1,1.35,0v2.778a.675.675,0,1,1-1.35,0Zm-.15-5.1a.824.824,0,1,1,.824.824A.834.834,0,0,1,28301.174,2503.524Z" transform="translate(-28296.002 -2500.001)" />
			</svg>`;
		}
		case 'inline-help':
		{
			return `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M7.41699 0C11.5128 0.000176261 14.8328 3.32116 14.833 7.41699C14.8328 11.5128 11.5128 14.8328 7.41699 14.833C3.32099 14.833 0.000176263 11.513 0 7.41699C0.000197928 3.32105 3.321 0 7.41699 0ZM7.41699 1.5C4.14943 1.5 1.5002 4.14948 1.5 7.41699C1.50018 10.6845 4.14942 13.333 7.41699 13.333C10.6844 13.3328 13.3328 10.6844 13.333 7.41699C13.3328 4.14958 10.6844 1.50018 7.41699 1.5ZM7.42285 9.84961C7.91971 9.8497 8.32207 10.2532 8.32227 10.75C8.32227 11.247 7.91983 11.6503 7.42285 11.6504H7.41602C6.91896 11.6504 6.51562 11.2471 6.51562 10.75C6.51582 10.2531 6.91908 9.84961 7.41602 9.84961H7.42285ZM7.41699 3.33398C8.75152 3.33416 9.83301 4.4164 9.83301 5.75098C9.83273 6.75253 9.22361 7.61018 8.3584 7.97656C8.2712 8.0135 8.2078 8.06154 8.17578 8.09766C8.1722 8.10172 8.16917 8.10559 8.16699 8.1084V8.41699C8.16679 8.83093 7.83093 9.16682 7.41699 9.16699C7.0029 9.16699 6.66719 8.83104 6.66699 8.41699V8.08398C6.66699 7.26566 7.32648 6.78497 7.77344 6.5957L7.89258 6.53418C8.15749 6.37287 8.33276 6.08168 8.33301 5.75098C8.33301 5.24483 7.9231 4.83416 7.41699 4.83398C6.91074 4.83398 6.5 5.24472 6.5 5.75098C6.49963 6.16487 6.16398 6.50098 5.75 6.50098C5.33602 6.50098 5.00037 6.16487 5 5.75098C5 4.41629 6.08231 3.33398 7.41699 3.33398Z" />
			</svg>`;
		}
		case 'pagebuilder-theme-reset':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="14.498" height="11.416" viewBox="0 0 14.498 11.416">
				<path class="mm10_svg_icon_color" d="M16613.137,21021.418h-9.475a.662.662,0,1,1,0-1.324h9.459a3.132,3.132,0,0,0,0-6.262h-7.855l1.377,1.377a.661.661,0,0,1,0,.938.655.655,0,0,1-.934,0l-2.516-2.516c-.027-.031-.053-.059-.08-.1l-.047-.062v-.031c0-.006-.006-.016-.006-.021l-.021-.047v-.037a.077.077,0,0,0-.01-.027v-.016a.715.715,0,0,1,0-.258v-.021a.039.039,0,0,0,.01-.027v-.031l.021-.047c0-.01.006-.016.006-.021v-.031l.047-.059a.428.428,0,0,1,.08-.1l2.516-2.506a.661.661,0,0,1,.465-.189.641.641,0,0,1,.469.2.657.657,0,0,1,0,.934l-1.371,1.371h8.088v.01a4.459,4.459,0,0,1-.217,8.906Z" transform="translate(-16602.998 -21010.002)" />
			</svg>`;
		}
		case 'theme-field-cornerradius-common':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
				<path class="mm10_svg_icon_color" d="M3,1.3A1.7,1.7,0,0,0,1.3,3V13A1.7,1.7,0,0,0,3,14.7H13A1.7,1.7,0,0,0,14.7,13V3A1.7,1.7,0,0,0,13,1.3H3M3,0H13a3,3,0,0,1,3,3V13a3,3,0,0,1-3,3H3a3,3,0,0,1-3-3V3A3,3,0,0,1,3,0Z" />
			</svg>`;
		}
		case 'theme-field-cornerradius-individual':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
				<path class="mm10_svg_icon_color" d="M10299,20773v-1.25h3a1.749,1.749,0,0,0,1.747-1.752v-3H10305v3c0,.01,0,.02,0,.031a2.99,2.99,0,0,1-2.722,2.945c-.094,0-.177.025-.271.025Zm-7,0c-.094,0-.178-.021-.271-.025a2.989,2.989,0,0,1-2.721-2.945c0-.012-.006-.021-.006-.031v-3h1.252v3a1.748,1.748,0,0,0,1.746,1.752h3v1.25Zm11.751-10v-3a1.746,1.746,0,0,0-1.747-1.746h-3V20757h3a3,3,0,0,1,3,3v3Zm-14.749,0v-3a3,3,0,0,1,3-3h3v1.252h-3a1.745,1.745,0,0,0-1.746,1.746v3Z" transform="translate(-10289 -20757)" />
			</svg>`;
		}
		case 'theme-field-cornerradius-top-left':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
				<path class="mm10_svg_icon_color" d="M0,3V8H1.25V3A1.752,1.752,0,0,1,3,1.25H8V0H3A3,3,0,0,0,0,3" />
			</svg>`;
		}
		case 'theme-field-cornerradius-top-right':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
				<path class="mm10_svg_icon_color" d="M5,0H0V1.25H5A1.752,1.752,0,0,1,6.75,3V8H8V3A3,3,0,0,0,5,0" />
			</svg>`;
		}
		case 'theme-field-cornerradius-bottom-right':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
				<path class="mm10_svg_icon_color" d="M6.75,5A1.752,1.752,0,0,1,5,6.75H0V8H5a2.713,2.713,0,0,0,.273-.028A2.991,2.991,0,0,0,8,5.028C8,5.018,8,5.009,8,5V0H6.75Z" />
			</svg>`;
		}
		case 'theme-field-cornerradius-bottom-left':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
				<path class="mm10_svg_icon_color" d="M1.25,5V0H0V5c0,.009,0,.018,0,.028A2.991,2.991,0,0,0,2.727,7.972,2.713,2.713,0,0,0,3,8H8V6.75H3A1.752,1.752,0,0,1,1.25,5" />
			</svg>`;
		}
		case 'theme-field-padding-none':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
				<path class="mm10_svg_icon_color" d="M34,31.643V24.357A2.357,2.357,0,0,0,31.643,22H24.357A2.357,2.357,0,0,0,22,24.357v7.286A2.357,2.357,0,0,0,24.357,34h7.286A2.357,2.357,0,0,0,34,31.643ZM23.286,24.357a1.071,1.071,0,0,1,1.071-1.071h7.286a1.111,1.111,0,0,1,.148.015l-8.49,8.49a1.111,1.111,0,0,1-.015-.148Zm.923,8.342,8.49-8.49a1.111,1.111,0,0,1,.015.148v7.286a1.072,1.072,0,0,1-1.071,1.071H24.357a1.111,1.111,0,0,1-.148-.015Z" transform="translate(-22 -22)" />
			</svg>`;
		}
		case 'theme-field-padding-custom':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="17.997" height="4.002" viewBox="0 0 17.997 4.002">
				<path class="mm10_svg_icon_color" d="M10683.059,20759a1.97,1.97,0,1,1,1.97,2A1.985,1.985,0,0,1,10683.059,20759Zm-7.023,0a1.969,1.969,0,1,1,1.97,2A1.985,1.985,0,0,1,10676.035,20759Zm-7.034,0a1.97,1.97,0,1,1,1.97,2A1.985,1.985,0,0,1,10669,20759Z" transform="translate(-10669.001 -20756.998)" />
			</svg>`;
		}
		case 'theme-field-padding-top':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="12.002" height="12.002" viewBox="0 0 12.002 12.002">
				<path class="mm10_svg_icon_color" d="M10237.5,20622a.5.5,0,0,1-.5-.5v-5a.5.5,0,0,1,.5-.5h5a.5.5,0,0,1,.5.5v5a.5.5,0,0,1-.5.5Zm.75-1.252h3.5v-3.5h-3.5Zm-3.747-8.746a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h11a.506.506,0,0,1,.5.5v1a.506.506,0,0,1-.5.5Z" transform="translate(-10234 -20609.998)" />
			</svg>`;
		}
		case 'theme-field-padding-right':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="12.002" height="12" viewBox="0 0 12.002 12">
				<path class="mm10_svg_icon_color" d="M20634.5,40392a.5.5,0,0,1-.5-.5v-11a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5v11a.5.5,0,0,1-.5.5Zm6-3a.5.5,0,0,1-.5-.5v-5.008a.5.5,0,0,1,.5-.5h5a.505.505,0,0,1,.506.5v5.008a.505.505,0,0,1-.506.5Zm.75-1.246h3.5v-3.508h-3.5Z" transform="translate(20646.004 40392) rotate(180)" />
			</svg>`;
		}
		case 'theme-field-padding-bottom':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12.002" viewBox="0 0 12 12.002">
				<path class="mm10_svg_icon_color" d="M20634.5,40392a.5.5,0,0,1-.5-.5v-11a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5v11a.5.5,0,0,1-.5.5Zm6-3a.5.5,0,0,1-.5-.5v-5.008a.5.5,0,0,1,.5-.5h5a.505.505,0,0,1,.506.5v5.008a.505.505,0,0,1-.506.5Zm.75-1.246h3.5v-3.508h-3.5Z" transform="translate(-40380 20646.004) rotate(-90)" />
			</svg>`;
		}
		case 'theme-field-padding-left':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="11.998" height="11.998" viewBox="0 0 11.998 11.998">
				<path class="mm10_svg_icon_color" d="M10371.5,20625a.5.5,0,0,1-.5-.5v-11a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5v11a.5.5,0,0,1-.5.5Zm6-3a.5.5,0,0,1-.5-.5v-5a.5.5,0,0,1,.5-.5h5a.5.5,0,0,1,.5.5v5a.5.5,0,0,1-.5.5Zm.75-1.246h3.5v-3.5h-3.5Z" transform="translate(-10371.002 -20613.002)" />
			</svg>`;
		}
		case 'theme-field-drop-shadow-x':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="7.452" height="8.928" viewBox="0 0 7.452 8.928">
				<path class="mm10_svg_icon_color" d="M.276,0H1.668L3.132-2.328c.372-.576.876-1.488.876-1.488h.024s.468.912.816,1.488L6.264,0H7.728l-3-4.572L7.62-8.928H6.276L4.932-6.78c-.36.564-.84,1.464-.84,1.464H4.068s-.468-.9-.816-1.464L1.92-8.928H.5L3.348-4.584Z" transform="translate(-0.276 8.928)" />
			</svg>`;
		}
		case 'theme-field-drop-shadow-y':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="7.692" height="8.928" viewBox="0 0 7.692 8.928">
				<path class="mm10_svg_icon_color" d="M3.432,0H4.656V-3.684L7.908-8.928H6.6L4.98-6.24c-.372.636-.888,1.668-.888,1.668H4.068S3.564-5.6,3.192-6.24L1.584-8.928H.216L3.432-3.744Z" transform="translate(-0.216 8.928)" />
			</svg>`;
		}
		case 'theme-field-border-thickness-common':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="16.001" height="16.002" viewBox="0 0 16.001 16.002">
				<path class="mm10_svg_icon_color" d="M10799,20687a1,1,0,0,1-1-1v-14a1,1,0,0,1,1-1h14a1,1,0,0,1,1,1v14a1,1,0,0,1-1,1Zm.249-1.252h13.5v-13.5h-13.5Zm2.752-1.75a1,1,0,0,1-1-1v-8a1,1,0,0,1,1-1h8a1,1,0,0,1,1,1v8a1,1,0,0,1-1,1Zm.249-1.246h7.5v-7.5h-7.5Z" transform="translate(-10798.001 -20670.998)" />
			</svg>`;
		}
		case 'theme-field-border-thickness-individual':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="16.001" height="16.002" viewBox="0 0 16.001 16.002">
				<path class="mm10_svg_icon_color" d="M10812,20686.35a.652.652,0,1,1,.654.65A.651.651,0,0,1,10812,20686.35Zm-2,0a.649.649,0,1,1,.648.65A.649.649,0,0,1,10810,20686.35Zm-2,0a.649.649,0,1,1,.648.65A.649.649,0,0,1,10808,20686.35Zm-2,0a.649.649,0,1,1,.648.65A.649.649,0,0,1,10806,20686.35Zm-2,0a.651.651,0,1,1,.654.65A.651.651,0,0,1,10804,20686.35Zm-2,0a.651.651,0,1,1,.649.65A.65.65,0,0,1,10802,20686.35Zm-3,.65a1,1,0,0,1-1-1v-14a1,1,0,0,1,1-1h1a1,1,0,0,1,1,1v14a1,1,0,0,1-1,1Zm13.7-1.953a.651.651,0,1,1,.649.654A.65.65,0,0,1,10812.7,20685.047Zm0-2a.651.651,0,1,1,.649.648A.648.648,0,0,1,10812.7,20683.049Zm0-2a.651.651,0,1,1,.649.65A.65.65,0,0,1,10812.7,20681.049Zm0-2a.651.651,0,1,1,.649.648A.651.651,0,0,1,10812.7,20679.051Zm0-2a.651.651,0,1,1,.649.654A.65.65,0,0,1,10812.7,20677.047Zm0-2a.651.651,0,1,1,.649.648A.65.65,0,0,1,10812.7,20675.049Zm0-2a.651.651,0,1,1,.649.648A.65.65,0,0,1,10812.7,20673.049Zm-.7-1.4a.652.652,0,1,1,.654.648A.652.652,0,0,1,10812,20671.652Zm-2,0a.649.649,0,1,1,.648.648A.65.65,0,0,1,10810,20671.652Zm-2,0a.649.649,0,1,1,.648.648A.65.65,0,0,1,10808,20671.652Zm-2,0a.649.649,0,1,1,.648.648A.651.651,0,0,1,10806,20671.652Zm-2,0a.651.651,0,1,1,.654.648A.652.652,0,0,1,10804,20671.652Zm-2,0a.651.651,0,1,1,.649.648A.651.651,0,0,1,10802,20671.652Z" transform="translate(-10798.001 -20670.998)" />
			</svg>`;
		}
		case 'theme-field-border-thickness-left':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="10.002" height="10.002" viewBox="0 0 10.002 10.002">
				<path class="mm10_svg_icon_color" d="M10298,20766.5a.5.5,0,1,1,.5.5A.5.5,0,0,1,10298,20766.5Zm-1.8,0a.5.5,0,1,1,.5.5A.5.5,0,0,1,10296.2,20766.5Zm-1.8,0a.5.5,0,1,1,.5.5A.5.5,0,0,1,10294.4,20766.5Zm-1.8,0a.5.5,0,1,1,.5.5A.5.5,0,0,1,10292.6,20766.5Zm-3.1.5a.5.5,0,0,1-.5-.5v-9a.5.5,0,0,1,.5-.5h2a.5.5,0,0,1,.5.5v9a.5.5,0,0,1-.5.5Zm8.5-2.3a.5.5,0,1,1,.5.5A.5.5,0,0,1,10298,20764.7Zm0-1.8a.5.5,0,1,1,.5.5A.5.5,0,0,1,10298,20762.9Zm0-1.8a.5.5,0,1,1,.5.5A.5.5,0,0,1,10298,20761.1Zm0-1.8a.5.5,0,1,1,.5.5A.5.5,0,0,1,10298,20759.3Zm0-1.8a.5.5,0,1,1,.5.5A.5.5,0,0,1,10298,20757.5Zm-1.8,0a.5.5,0,1,1,.5.5A.5.5,0,0,1,10296.2,20757.5Zm-1.8,0a.5.5,0,1,1,.5.5A.5.5,0,0,1,10294.4,20757.5Zm-1.8,0a.5.5,0,1,1,.5.5A.5.5,0,0,1,10292.6,20757.5Z" transform="translate(-10288.999 -20756.998)" />
			</svg>`;
		}
		case 'theme-field-border-thickness-top':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="10.002" height="10.002" viewBox="0 0 10.002 10.002">
				<path class="mm10_svg_icon_color" d="M10298,20766.5a.5.5,0,1,1,.5.5A.5.5,0,0,1,10298,20766.5Zm-1.8,0a.5.5,0,1,1,.5.5A.5.5,0,0,1,10296.2,20766.5Zm-1.8,0a.5.5,0,1,1,.5.5A.5.5,0,0,1,10294.4,20766.5Zm-1.8,0a.5.5,0,1,1,.5.5A.5.5,0,0,1,10292.6,20766.5Zm-3.1.5a.5.5,0,0,1-.5-.5v-9a.5.5,0,0,1,.5-.5h2a.5.5,0,0,1,.5.5v9a.5.5,0,0,1-.5.5Zm8.5-2.3a.5.5,0,1,1,.5.5A.5.5,0,0,1,10298,20764.7Zm0-1.8a.5.5,0,1,1,.5.5A.5.5,0,0,1,10298,20762.9Zm0-1.8a.5.5,0,1,1,.5.5A.5.5,0,0,1,10298,20761.1Zm0-1.8a.5.5,0,1,1,.5.5A.5.5,0,0,1,10298,20759.3Zm0-1.8a.5.5,0,1,1,.5.5A.5.5,0,0,1,10298,20757.5Zm-1.8,0a.5.5,0,1,1,.5.5A.5.5,0,0,1,10296.2,20757.5Zm-1.8,0a.5.5,0,1,1,.5.5A.5.5,0,0,1,10294.4,20757.5Zm-1.8,0a.5.5,0,1,1,.5.5A.5.5,0,0,1,10292.6,20757.5Z" transform="translate(20767 -10288.999) rotate(90)" />
			</svg>`;
		}
		case 'theme-field-border-thickness-right':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="10.002" height="10.002" viewBox="0 0 10.002 10.002">
				<path class="mm10_svg_icon_color" d="M10298,20766.5a.5.5,0,1,1,.5.5A.5.5,0,0,1,10298,20766.5Zm-1.8,0a.5.5,0,1,1,.5.5A.5.5,0,0,1,10296.2,20766.5Zm-1.8,0a.5.5,0,1,1,.5.5A.5.5,0,0,1,10294.4,20766.5Zm-1.8,0a.5.5,0,1,1,.5.5A.5.5,0,0,1,10292.6,20766.5Zm-3.1.5a.5.5,0,0,1-.5-.5v-9a.5.5,0,0,1,.5-.5h2a.5.5,0,0,1,.5.5v9a.5.5,0,0,1-.5.5Zm8.5-2.3a.5.5,0,1,1,.5.5A.5.5,0,0,1,10298,20764.7Zm0-1.8a.5.5,0,1,1,.5.5A.5.5,0,0,1,10298,20762.9Zm0-1.8a.5.5,0,1,1,.5.5A.5.5,0,0,1,10298,20761.1Zm0-1.8a.5.5,0,1,1,.5.5A.5.5,0,0,1,10298,20759.3Zm0-1.8a.5.5,0,1,1,.5.5A.5.5,0,0,1,10298,20757.5Zm-1.8,0a.5.5,0,1,1,.5.5A.5.5,0,0,1,10296.2,20757.5Zm-1.8,0a.5.5,0,1,1,.5.5A.5.5,0,0,1,10294.4,20757.5Zm-1.8,0a.5.5,0,1,1,.5.5A.5.5,0,0,1,10292.6,20757.5Z" transform="translate(10299.001 20767) rotate(180)" />
			</svg>`;
		}
		case 'theme-field-border-thickness-bottom':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="10.002" height="10.002" viewBox="0 0 10.002 10.002">
				<path class="mm10_svg_icon_color" d="M10298,20766.5a.5.5,0,1,1,.5.5A.5.5,0,0,1,10298,20766.5Zm-1.8,0a.5.5,0,1,1,.5.5A.5.5,0,0,1,10296.2,20766.5Zm-1.8,0a.5.5,0,1,1,.5.5A.5.5,0,0,1,10294.4,20766.5Zm-1.8,0a.5.5,0,1,1,.5.5A.5.5,0,0,1,10292.6,20766.5Zm-3.1.5a.5.5,0,0,1-.5-.5v-9a.5.5,0,0,1,.5-.5h2a.5.5,0,0,1,.5.5v9a.5.5,0,0,1-.5.5Zm8.5-2.3a.5.5,0,1,1,.5.5A.5.5,0,0,1,10298,20764.7Zm0-1.8a.5.5,0,1,1,.5.5A.5.5,0,0,1,10298,20762.9Zm0-1.8a.5.5,0,1,1,.5.5A.5.5,0,0,1,10298,20761.1Zm0-1.8a.5.5,0,1,1,.5.5A.5.5,0,0,1,10298,20759.3Zm0-1.8a.5.5,0,1,1,.5.5A.5.5,0,0,1,10298,20757.5Zm-1.8,0a.5.5,0,1,1,.5.5A.5.5,0,0,1,10296.2,20757.5Zm-1.8,0a.5.5,0,1,1,.5.5A.5.5,0,0,1,10294.4,20757.5Zm-1.8,0a.5.5,0,1,1,.5.5A.5.5,0,0,1,10292.6,20757.5Z" transform="translate(-20756.998 10299.001) rotate(-90)" />
			</svg>`;
		}
		case 'theme-editor-section-arrow':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="15.998" height="11.98" viewBox="0 0 15.998 11.98">
				<path class="mm10_svg_icon_color" d="M32096.006,38467.785l3.844-3.844h-12.6v-1.785h12.607l-3.852-3.844,1.256-1.254,5.986,5.984-5.986,6Z" transform="translate(-32087.25 -38457.059)" />
			</svg>`;
		}
		case 'dropdown-arrow-one':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="7.43" height="3.998" viewBox="0 0 7.43 3.998">
				<path class="mm10_svg_icon_color" d="M3.648,4a.711.711,0,0,1-.4-.169L.266,1.266A.711.711,0,1,1,1.191.186L3.715,2.351,6.239.186a.711.711,0,1,1,.924,1.08L4.177,3.826A.711.711,0,0,1,3.648,4Z" />
			</svg>`;
		}
		case 'merchandising':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
				<path class="mm10_svg_icon_color" d="M16.489,5.766H13.914v-.84a4.915,4.915,0,1,0-9.829,0v.84H1.51A1.5,1.5,0,0,0,0,7.279v6.478A4.243,4.243,0,0,0,4.234,18h9.531A4.244,4.244,0,0,0,18,13.757V7.279a1.514,1.514,0,0,0-1.511-1.513M5.744,4.96a3.256,3.256,0,1,1,6.511,0V5.8H5.744Zm10.6,8.8a2.55,2.55,0,0,1-2.575,2.58H4.234a2.55,2.55,0,0,1-2.575-2.58V7.429H4.085v2.638a.83.83,0,1,0,1.659,0V7.429h6.511v2.638a.83.83,0,1,0,1.659,0V7.429H16.34Z" />
			</svg>`;
		}
		case 'merchandising-prompt-submit':
		{
			return `<svg xmlns="http://www.w3.org/2000/svg" width="12.25" height="14" viewBox="0 0 12.25 14">
				<path class="mm10_svg_icon_color" d="M6.125,14a.875.875,0,0,1-.875-.875V2.987L1.494,6.744A.875.875,0,0,1,.256,5.506L5.506.256A.87.87,0,0,1,6.122,0h.005a.87.87,0,0,1,.616.256l5.25,5.25a.875.875,0,0,1-1.237,1.237L7,2.987V13.125A.875.875,0,0,1,6.125,14" />
			</svg>`;
		}
		case 'field-warning-icon':
		{
			return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M9.99922 1.04321C5.05089 1.04321 1.04297 5.05113 1.04297 9.99946C1.04297 14.9478 5.05089 18.9557 9.99922 18.9557C14.9475 18.9557 18.9555 14.9478 18.9555 9.99946C18.9555 5.05113 14.9475 1.04321 9.99922 1.04321ZM9.12598 5.83481C9.12598 5.29743 9.47304 4.96157 9.99922 4.96157C10.5254 4.96157 10.8725 5.30863 10.8725 5.83481V10.4137C10.8725 10.9511 10.5254 11.2869 9.99922 11.2869C9.47304 11.2869 9.12598 10.9399 9.12598 10.4137V5.83481ZM9.99922 15.0374C9.3163 15.0374 8.72295 14.444 8.72295 13.7611C8.72295 13.0782 9.3163 12.4848 9.99922 12.4848C10.6821 12.4848 11.2755 13.0782 11.2755 13.7611C11.2755 14.444 10.6821 15.0374 9.99922 15.0374Z" />
			</svg>`;
		}
		case 'select-selected-icon':
		{
			return `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M10.75 0C16.687 0 21.5 4.81293 21.5 10.75C21.5 16.687 16.687 21.5 10.75 21.5C4.81293 21.5 0 16.687 0 10.75C0 4.81294 4.81294 0 10.75 0ZM10.75 1.5C5.64136 1.5 1.5 5.64136 1.5 10.75C1.5 15.8586 5.64137 20 10.75 20C15.8586 20 20 15.8586 20 10.75C20 5.64137 15.8586 1.5 10.75 1.5ZM14.1738 7.26953C14.439 6.95157 14.9124 6.90873 15.2305 7.17383C15.5485 7.43901 15.5912 7.91233 15.3262 8.23047L10.3262 14.2305C10.1913 14.3922 9.9945 14.4894 9.78418 14.499C9.57368 14.5086 9.36873 14.4293 9.21973 14.2803L6.21973 11.2803C5.92684 10.9874 5.92684 10.5126 6.21973 10.2197C6.51262 9.92691 6.9874 9.92687 7.28027 10.2197L9.69922 12.6387L14.1738 7.26953Z" />
			</svg>`;
		}
		case 'dialog-top-button-icon-close':
		{
			return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M19.4696 11.4697C19.7625 11.1768 20.2373 11.1768 20.5302 11.4697C20.8231 11.7626 20.8231 12.2373 20.5302 12.5302L17.0605 15.9999L20.5302 19.4697C20.8227 19.7625 20.8227 20.2374 20.5302 20.5302C20.2373 20.8231 19.7616 20.8231 19.4687 20.5302L15.9989 17.0605L12.5312 20.5302C12.2383 20.8231 11.7625 20.8231 11.4696 20.5302C11.1768 20.2373 11.1768 19.7616 11.4696 19.4687L14.9384 15.9999L11.4696 12.5312C11.1768 12.2384 11.177 11.7636 11.4696 11.4706C11.7625 11.1778 12.2373 11.1778 12.5302 11.4706L15.9989 14.9394L19.4696 11.4697Z" />
			</svg>`;
		}
		case 'dialog-top-button-icon-pin':
		{
			return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M19.1094 9.26941L19.4746 9.31628C20.312 9.45711 21.0482 9.82152 21.6133 10.3866C22.259 11.0325 22.6432 11.9017 22.7305 12.8905C22.7794 13.4465 22.4749 13.9227 22.0615 14.1708L19.5049 15.704L19.6816 16.5858C19.971 18.0335 19.5709 19.5343 18.5986 20.6454L18.0332 21.2909V21.2919C17.4937 21.9078 16.5453 21.9389 15.9658 21.3602L13.833 19.2274L10.5303 22.5302C10.2374 22.8228 9.76258 22.8228 9.46973 22.5302C9.17694 22.2373 9.17701 21.7625 9.46973 21.4696L12.7725 18.1669L10.6396 16.0341C10.0605 15.4548 10.0918 14.5064 10.708 13.9667L11.3516 13.4032C12.4628 12.4299 13.9635 12.0288 15.4121 12.3182L16.2949 12.494L17.8291 9.93835L17.9326 9.78894C18.1787 9.4782 18.5627 9.25981 19.0059 9.26453L19.1094 9.26941ZM17.5508 13.3173C17.2428 13.83 16.6452 14.0944 16.0586 13.9774L15.1182 13.7889C14.1271 13.5909 13.1001 13.8653 12.3398 14.5311L11.7627 15.036L16.9629 20.2362L17.4697 19.6571C18.1348 18.8969 18.4089 17.8701 18.2109 16.8798L18.0234 15.9413C17.906 15.3541 18.1704 14.7571 18.6836 14.4491L21.2236 12.9237C21.1489 12.2945 20.9049 11.7996 20.5527 11.4471C20.2002 11.0946 19.705 10.8499 19.0752 10.7753L17.5508 13.3173Z" />
			</svg>`;
		}
		case 'dialog-top-button-icon-unpin':
		{
			return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M8.80371 8.80298C9.09662 8.51022 9.57141 8.51013 9.86426 8.80298L23.1973 22.136C23.4901 22.4288 23.49 22.9036 23.1973 23.1965C22.9044 23.4894 22.4296 23.4894 22.1367 23.1965L19.0205 20.0803C18.8944 20.277 18.7547 20.4664 18.5986 20.6448L18.0342 21.2903L18.0332 21.2913C17.4935 21.9073 16.5452 21.9389 15.9658 21.3596L13.833 19.2268L10.5303 22.5305C10.2374 22.8231 9.76256 22.8231 9.46973 22.5305C9.17686 22.2376 9.17684 21.7619 9.46973 21.469L12.7725 18.1663L10.6396 16.0334C10.0607 15.4542 10.0919 14.5058 10.708 13.9661L11.3516 13.4026C11.5307 13.2457 11.7203 13.1043 11.918 12.9778L8.80371 9.86353C8.51082 9.57063 8.51082 9.09587 8.80371 8.80298ZM13.0166 14.0764C12.7755 14.1979 12.5473 14.3488 12.3398 14.5305L11.7627 15.0354L16.9629 20.2356L17.4697 19.6565C17.6506 19.4497 17.8013 19.2226 17.9229 18.9827L13.0166 14.0764ZM19.1094 9.2688L19.4746 9.31567C20.3122 9.4564 21.0481 9.82088 21.6133 10.386C22.2592 11.0319 22.6432 11.901 22.7305 12.8899C22.7796 13.4459 22.4758 13.922 22.0625 14.1702L19.5049 15.7034L19.6689 16.5198C19.7499 16.9257 19.486 17.3203 19.0801 17.4016C18.6741 17.4826 18.2796 17.2196 18.1982 16.8137L18.0234 15.9407C17.9062 15.3536 18.1705 14.7565 18.6836 14.4485L21.2236 12.9231C21.1489 12.2938 20.9051 11.7989 20.5527 11.4465C20.2 11.094 19.7052 10.8491 19.0752 10.7747L17.5518 13.3167C17.2439 13.8296 16.6463 14.0938 16.0596 13.9768L15.1865 13.802C14.7805 13.7209 14.5168 13.3262 14.5977 12.9202C14.6789 12.5141 15.0744 12.2502 15.4805 12.3313L16.2959 12.4934L17.8291 9.93774C18.0619 9.54992 18.4954 9.25825 19.0068 9.26392L19.1094 9.2688Z" />
			</svg>`;
		}
		case 'dialog-top-button-icon-fullscreen-start':
		{
			return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M14.1367 16.8027C14.4296 16.5103 14.9045 16.5101 15.1973 16.8027C15.4899 17.0955 15.4897 17.5704 15.1973 17.8633L11.8105 21.25H13.333C13.7471 21.25 14.0828 21.5859 14.083 22C14.0828 22.414 13.7471 22.75 13.333 22.75H10C9.95464 22.75 9.91033 22.745 9.86719 22.7373C9.86165 22.7363 9.8561 22.7355 9.85059 22.7344C9.8426 22.7328 9.83504 22.7294 9.82715 22.7275C9.69632 22.6966 9.57176 22.6322 9.46973 22.5303C9.41327 22.4738 9.37061 22.4092 9.33594 22.3418C9.32634 22.3232 9.31469 22.3056 9.30664 22.2861C9.28569 22.2352 9.27099 22.1825 9.26172 22.1289C9.25443 22.087 9.25002 22.044 9.25 22V18.667C9.25 18.2528 9.58579 17.917 10 17.917C10.4142 17.917 10.75 18.2528 10.75 18.667V20.1895L14.1367 16.8027ZM22.0029 9.25C22.0456 9.25022 22.0873 9.25467 22.1279 9.26172C22.1807 9.27075 22.233 9.28432 22.2832 9.30469L22.291 9.30859C22.2982 9.31165 22.3044 9.31704 22.3115 9.32031C22.3907 9.35647 22.4661 9.40459 22.5312 9.46973C22.6516 9.59016 22.7199 9.74177 22.7412 9.89844C22.7438 9.91744 22.745 9.93663 22.7461 9.95605C22.7474 9.97759 22.7496 9.99895 22.749 10.0205V13.333C22.749 13.7472 22.4132 14.083 21.999 14.083C21.585 14.0828 21.249 13.7471 21.249 13.333V11.8125L17.8643 15.1973C17.5714 15.4899 17.0966 15.4899 16.8037 15.1973C16.5109 14.9044 16.511 14.4296 16.8037 14.1367L20.1904 10.75H18.666C18.2518 10.75 17.916 10.4142 17.916 10C17.916 9.58579 18.2518 9.25 18.666 9.25H22.0029Z" />
			</svg>`;
		}
		case 'dialog-top-button-icon-fullscreen-end':
		{
			return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M14.667 16.5833C14.711 16.5833 14.754 16.5877 14.7959 16.595C14.848 16.604 14.8996 16.6178 14.9492 16.6379L14.959 16.6428C14.9634 16.6447 14.9673 16.6477 14.9717 16.6497C15.0532 16.686 15.1304 16.7362 15.1973 16.803C15.3104 16.9162 15.3787 17.0568 15.4043 17.2034C15.4117 17.2458 15.417 17.2897 15.417 17.3342V20.6672C15.4167 21.0811 15.0809 21.4171 14.667 21.4172C14.2529 21.4172 13.9172 21.0812 13.917 20.6672V19.1438L10.5303 22.5305C10.2374 22.8232 9.76257 22.8232 9.46973 22.5305C9.17706 22.2377 9.17708 21.7628 9.46973 21.47L12.8555 18.0842H11.334C10.92 18.0842 10.5844 17.7481 10.584 17.3342C10.584 16.92 10.9198 16.5842 11.334 16.5842L14.667 16.5833ZM21.4707 9.46899C21.7635 9.17664 22.2385 9.17654 22.5312 9.46899C22.824 9.76174 22.8237 10.2366 22.5312 10.5295L19.1445 13.9163H20.6689C21.0829 13.9164 21.4187 14.2523 21.4189 14.6663C21.4189 15.0804 21.083 15.4161 20.6689 15.4163H17.3359L17.334 15.4153H17.3311C17.2836 15.415 17.2373 15.4113 17.1924 15.4026C17.1914 15.4024 17.1905 15.4018 17.1895 15.4016C17.1721 15.3982 17.1556 15.3916 17.1387 15.387C17.0163 15.3539 16.8998 15.2926 16.8037 15.1965C16.6846 15.0772 16.6158 14.9278 16.5938 14.7727C16.5908 14.7518 16.5891 14.7307 16.5879 14.7092C16.5867 14.688 16.5853 14.667 16.5859 14.6458V11.3333C16.5861 10.9192 16.9219 10.5833 17.3359 10.5833C17.7497 10.5836 18.0857 10.9194 18.0859 11.3333V12.8538L21.4707 9.46899Z" />
			</svg>`;
		}
		case 'mmscreen-miva-logo':
		{
			return `<svg width="65" height="16" viewBox="0 0 65 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M56.1543 0.0302734C58.1621 0.0302734 59.8789 0.818777 60.6367 2.08691L60.8174 2.3877V1.4209L60.8115 1.42383C60.8115 0.844612 61.2889 0.37207 61.874 0.37207H64.998V15.4678H60.8174L60.8867 13.2988L60.6982 13.5947C59.7497 15.0771 57.6675 15.7764 56.0283 15.8096C53.7215 15.8172 51.7493 15.1 50.3369 13.7119C48.9066 12.306 48.1514 10.2749 48.1514 7.91992C48.1514 5.56482 48.92 3.57238 50.3711 2.15625C51.7783 0.783548 53.7779 0.0303457 56.0176 0.0302734H56.1543ZM34.9141 0.37207C35.5143 0.372197 36.0426 0.72943 36.2617 1.28027L38.0967 5.90918L40.002 11.2061L41.9033 5.91211L43.7393 1.28027C43.9585 0.729412 44.4866 0.37207 45.0869 0.37207H48.9502L42.4062 15.5645H37.5947L31.0479 0.37207H34.9141ZM5.97656 0C7.99468 0 9.92591 0.752453 11.4131 2.12012L11.4824 2.18359L11.5469 2.11719C12.8794 0.752215 14.6635 0 16.5732 0L16.5703 0.00195312C20.4234 0.00199001 23.5603 3.10742 23.5605 6.92188V15.4727H19.2227V6.92188C19.2225 5.99835 18.7322 5.16127 17.9102 4.68164C17.083 4.19967 16.0987 4.18201 15.2793 4.63086C14.6994 4.94979 14.2558 5.48569 14.0625 6.10059C14.0341 6.18989 14.0079 6.28736 13.9873 6.39453C13.8689 6.99098 13.9307 11.4086 13.9668 14.0488C13.9771 14.6969 13.9854 15.2047 13.9854 15.4727H9.58301V7.8916C9.58285 5.90913 7.96366 4.29688 5.97656 4.29688H4.33789V15.4697H0V1.05078C0.000130863 0.471798 0.4767 0.000201303 1.06152 0H5.97656ZM30.0273 15.4697H25.7178V1.39062C25.7178 0.811452 26.1943 0.338938 26.7793 0.338867H30.0273V15.4697ZM56.626 3.77148C54.1776 3.77158 52.4658 5.49599 52.4658 7.91992C52.4658 10.3439 54.175 12.038 56.626 12.0381V12.041C59.2498 12.041 60.8174 10.0246 60.8174 8.0752C60.8172 6.00341 59.5048 3.77148 56.626 3.77148Z" />
			</svg>`;
		}
		case 'mmscreen-miva-logo-collapsed':
		{
			return `<svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M16.5728 0C14.663 0 12.8794 0.752726 11.5468 2.11784L11.4824 2.18418L11.4128 2.12039C9.92565 0.752725 7.99516 0 5.97704 0H1.0619C0.476823 0 0 0.472048 0 1.05126V15.4704H4.3378V4.29691H5.97704C7.96423 4.29691 9.58285 5.90953 9.58285 7.89214V15.473H13.9851C13.9851 15.2051 13.9774 14.6973 13.967 14.0492C13.931 11.4083 13.8691 6.98887 13.9877 6.39434C14.0083 6.28717 14.0341 6.19021 14.0624 6.1009C14.2557 5.48597 14.699 4.95013 15.279 4.63118C16.0986 4.18209 17.0832 4.19995 17.9105 4.68221C18.7327 5.16191 19.2224 5.99884 19.2224 6.92252V15.473H23.5602V6.92252C23.5602 3.10786 20.4235 0.00255167 16.5702 0.00255167L16.5728 0Z" />
			</svg>`;
		}
		case 'mmscreen-left-navigation-collapse':
		{
			return `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M11.417 0C12.9356 0.000307681 14.167 1.23142 14.167 2.75V11.417C14.1666 12.9353 12.9353 14.1667 11.417 14.167H2.75C1.23144 14.167 0.000350955 12.9355 0 11.417V2.75C0 1.23122 1.23122 0 2.75 0H11.417ZM5.83301 12.667H11.417C12.1069 12.6667 12.6666 12.1069 12.667 11.417V2.75C12.667 2.05983 12.1071 1.50031 11.417 1.5H5.83301V12.667ZM2.75 1.5C2.05965 1.5 1.5 2.05965 1.5 2.75V11.417C1.50035 12.1071 2.05986 12.667 2.75 12.667H4.33301V1.5H2.75Z" />
			</svg>`;
		}
		case 'mm-screen-left-navigation-link-home':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M9 1.125C9.40788 1.125 9.80487 1.25903 10.1289 1.50684L15.6172 5.7041C16.1736 6.12978 16.5 6.79053 16.5 7.49121V14.625C16.5 15.8677 15.4927 16.875 14.25 16.875H3.75C2.50737 16.875 1.5 15.8677 1.5 14.625V7.49121C1.50001 6.79056 1.82634 6.12981 2.38281 5.7041L7.87109 1.50684C8.19513 1.25903 8.59212 1.125 9 1.125ZM9 2.625C8.92143 2.625 8.84459 2.65055 8.78223 2.69824L3.29395 6.89551C3.10857 7.03742 3.00001 7.25776 3 7.49121V14.625C3 15.0392 3.33578 15.375 3.75 15.375H14.25C14.6642 15.375 15 15.0392 15 14.625V7.49121C15 7.25779 14.8914 7.03743 14.7061 6.89551L9.21777 2.69824C9.15541 2.65055 9.07857 2.625 9 2.625ZM12 12C12.4142 12 12.75 12.3358 12.75 12.75C12.75 13.1642 12.4142 13.5 12 13.5H6C5.58579 13.5 5.25 13.1642 5.25 12.75C5.25 12.3358 5.58579 12 6 12H12Z" />
			</svg>`;
		}
		case 'mm-screen-left-navigation-link-home--active':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M9 1.3125C9.36667 1.3125 9.72307 1.43328 10.0144 1.65601L15.5032 5.85278L15.5962 5.92823C16.0496 6.31865 16.3125 6.88894 16.3125 7.49121V14.625C16.3125 15.7641 15.3891 16.6875 14.25 16.6875H3.75C2.61092 16.6875 1.6875 15.7641 1.6875 14.625V7.49121C1.68751 6.84888 1.98662 6.24301 2.49682 5.85278L7.98563 1.65601L8.09767 1.57691C8.36602 1.40464 8.67915 1.3125 9 1.3125ZM6 12C5.58579 12 5.25 12.3358 5.25 12.75C5.25 13.1642 5.58579 13.5 6 13.5H12C12.4142 13.5 12.75 13.1642 12.75 12.75C12.75 12.3358 12.4142 12 12 12H6Z" />
			</svg>`;
		}
		case 'mm-screen-left-navigation-link-catalog':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M16.1287 1C16.5428 1.00012 16.8787 1.33586 16.8787 1.75V8.62891C16.8787 9.22554 16.6415 9.7978 16.2196 10.2197L10.2196 16.2197C9.34099 17.0983 7.91658 17.0982 7.03792 16.2197L1.65901 10.8408C0.780338 9.96218 0.780319 8.53783 1.65901 7.65918L7.65901 1.65918C8.08098 1.23724 8.65311 1 9.24983 1H16.1287ZM9.24983 2.5C9.05097 2.5 8.86025 2.57906 8.71956 2.71973L2.71956 8.71973C2.42669 9.01258 2.42669 9.48742 2.71956 9.78027L8.09847 15.1592C8.39134 15.4518 8.86623 15.452 9.15901 15.1592L15.159 9.15918C15.2996 9.01855 15.3787 8.82771 15.3787 8.62891V2.5H9.24983ZM5.08284 9.4873C5.37574 9.19445 5.85051 9.19443 6.14339 9.4873L8.39339 11.7373C8.68617 12.0302 8.68621 12.505 8.39339 12.7979C8.10053 13.0907 7.62574 13.0906 7.33284 12.7979L5.08284 10.5479C4.78995 10.255 4.78995 9.7802 5.08284 9.4873ZM12.3768 3.625C13.4123 3.625 14.2518 4.46445 14.2518 5.5C14.2518 6.53555 13.4123 7.375 12.3768 7.375C11.3414 7.37491 10.5018 6.53549 10.5018 5.5C10.5018 4.46451 11.3414 3.62509 12.3768 3.625ZM12.3768 5.125C12.1698 5.12509 12.0018 5.29295 12.0018 5.5C12.0018 5.70705 12.1698 5.87491 12.3768 5.875C12.5839 5.875 12.7518 5.7071 12.7518 5.5C12.7518 5.2929 12.5839 5.125 12.3768 5.125Z" />
			</svg>`;
		}
		case 'mm-screen-left-navigation-link-catalog--active':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M7.60412 1.60409C7.9909 1.2173 8.51552 1 9.0625 1H15.9412C16.2518 1 16.5037 1.25184 16.5037 1.5625V8.4412C16.5037 8.98818 16.2863 9.5128 15.8996 9.89958L9.89957 15.8996C9.09415 16.7051 7.78825 16.7051 6.98277 15.8996L1.60409 10.5209C0.798639 9.71545 0.798632 8.40955 1.60409 7.60413L7.60412 1.60409ZM11.032 5.3125C11.032 4.67297 11.5504 4.15454 12.1899 4.15454C12.8294 4.15454 13.3479 4.67297 13.3479 5.3125C13.3479 5.95203 12.8294 6.47046 12.1899 6.47046C11.5504 6.47046 11.032 5.95203 11.032 5.3125ZM5.95635 9.29973C5.66346 9.00685 5.18858 9.00685 4.89569 9.29973C4.6028 9.59268 4.6028 10.0675 4.89569 10.3604L7.14572 12.6104C7.4386 12.9033 7.91342 12.9033 8.20637 12.6104C8.49925 12.3175 8.49925 11.8427 8.20637 11.5497L5.95635 9.29973Z" />
			</svg>`;
		}
		case 'mm-screen-left-navigation-link-orders':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M10.875 0.750977C11.6438 0.750977 12.3034 1.21389 12.5928 1.87598H13.5C14.7426 1.87598 15.75 2.88332 15.75 4.12598V15C15.7497 16.2423 14.7424 17.25 13.5 17.25H4.5C3.25756 17.25 2.25035 16.2423 2.25 15V4.12598C2.25 2.88334 3.25736 1.87598 4.5 1.87598H5.40723C5.69661 1.21389 6.35622 0.750977 7.125 0.750977H10.875ZM4.5 3.37598C4.08579 3.37598 3.75 3.71176 3.75 4.12598V15C3.75035 15.4139 4.08602 15.75 4.5 15.75H13.5C13.9139 15.75 14.2497 15.4139 14.25 15V4.12598C14.25 3.71178 13.9142 3.37598 13.5 3.37598H12.5928C12.3033 4.03785 11.6436 4.50098 10.875 4.50098H7.125C6.35638 4.50098 5.69671 4.03784 5.40723 3.37598H4.5ZM8.57129 10.501C8.9855 10.501 9.32129 10.8368 9.32129 11.251C9.32116 11.6651 8.98542 12.001 8.57129 12.001H6C5.58587 12.001 5.25013 11.6651 5.25 11.251C5.25 10.8368 5.58579 10.501 6 10.501H8.57129ZM12 7.50098C12.4142 7.50098 12.75 7.83676 12.75 8.25098C12.7499 8.66508 12.4141 9.00098 12 9.00098H6C5.58587 9.00098 5.25013 8.66508 5.25 8.25098C5.25 7.83676 5.58579 7.50098 6 7.50098H12ZM7.125 2.25098C6.91789 2.25098 6.75 2.41887 6.75 2.62598C6.75013 2.83297 6.91797 3.00098 7.125 3.00098H10.875C11.082 3.00098 11.2499 2.83296 11.25 2.62598C11.25 2.41888 11.0821 2.25098 10.875 2.25098H7.125Z" />
			</svg>`;
		}
		case 'mm-screen-left-navigation-link-orders--active':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M4.87793 2.36621C4.93815 3.55507 5.92117 4.50098 7.125 4.50098H10.875C12.1176 4.50098 13.1249 3.4935 13.125 2.25098H13.5C14.6391 2.25098 15.5625 3.17438 15.5625 4.31348V14.999C15.5624 16.138 14.639 17.0615 13.5 17.0615H4.5C3.36097 17.0615 2.43758 16.138 2.4375 14.999V4.31348C2.4375 3.17438 3.36092 2.25098 4.5 2.25098H4.875L4.87793 2.36621ZM6 10.6885C5.68934 10.6885 5.4375 10.9403 5.4375 11.251C5.43762 11.5615 5.68942 11.8135 6 11.8135H8.57129L8.62891 11.8105C8.91253 11.7817 9.13367 11.5421 9.13379 11.251C9.13379 10.9597 8.91259 10.7202 8.62891 10.6914L8.57129 10.6885H6ZM6 7.68848C5.68934 7.68848 5.4375 7.94033 5.4375 8.25098C5.43762 8.56152 5.68942 8.81348 6 8.81348H12C12.3106 8.81348 12.5624 8.56152 12.5625 8.25098C12.5625 7.94033 12.3107 7.68848 12 7.68848H6ZM10.875 0.938477C11.5999 0.938477 12.1875 1.5261 12.1875 2.25098C12.1874 2.97573 11.5998 3.56348 10.875 3.56348H7.125C6.40021 3.56348 5.81263 2.97574 5.8125 2.25098C5.8125 1.5261 6.40013 0.938477 7.125 0.938477H10.875Z" />
			</svg>`;
		}
		case 'mm-screen-left-navigation-link-customers':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M9 1.875C11.4853 1.875 13.5 3.88972 13.5 6.375C13.5 7.86209 12.7779 9.17969 11.666 9.99902C13.6419 10.9808 15 13.019 15 15.375C15 15.7892 14.6642 16.125 14.25 16.125C13.8358 16.125 13.5 15.7892 13.5 15.375C13.5 12.8897 11.4853 10.875 9 10.875C6.51472 10.875 4.5 12.8897 4.5 15.375C4.5 15.7892 4.16421 16.125 3.75 16.125C3.33579 16.125 3 15.7892 3 15.375C3 13.0193 4.3576 10.9809 6.33301 9.99902C5.22149 9.17966 4.5 7.86181 4.5 6.375C4.5 3.88972 6.51472 1.875 9 1.875ZM9 3.375C7.34315 3.375 6 4.71815 6 6.375C6 8.03184 7.34315 9.375 9 9.375C10.6568 9.375 12 8.03184 12 6.375C12 4.71815 10.6568 3.375 9 3.375Z" />
			</svg>`;
		}
		case 'mm-screen-left-navigation-link-customers--active':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M9 2.0625C11.1746 2.0625 12.9375 3.82538 12.9375 6C12.9375 7.71488 11.8405 9.17173 10.3105 9.71191C12.8894 10.3063 14.8125 12.6156 14.8125 15.375C14.8125 15.6857 14.5607 15.9375 14.25 15.9375H3.75C3.43934 15.9375 3.1875 15.6857 3.1875 15.375C3.1875 12.6159 5.11006 10.3066 7.68848 9.71191C6.15896 9.17149 5.0625 7.71456 5.0625 6C5.0625 3.82538 6.82538 2.0625 9 2.0625Z" />
			</svg>`;
		}
		case 'mm-screen-left-navigation-link-merchandising':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M6.75 9.75C7.57843 9.75 8.25 10.4216 8.25 11.25V15C8.25 15.8284 7.57843 16.5 6.75 16.5H3C2.17159 16.5 1.5 15.8284 1.5 15V11.25C1.5 10.4216 2.17159 9.75 3 9.75H6.75ZM15 9.75C15.8284 9.75 16.5 10.4216 16.5 11.25V15C16.5 15.8284 15.8284 16.5 15 16.5H11.25C10.4216 16.5 9.75 15.8284 9.75 15V11.25C9.75 10.4216 10.4216 9.75 11.25 9.75H15ZM3 15H6.75V11.25H3V15ZM11.25 15H15V11.25H11.25V15ZM6.75 1.5C7.57844 1.5 8.25 2.17158 8.25 3V6.75C8.25 7.57842 7.57844 8.25 6.75 8.25H3C2.17158 8.25 1.5 7.57842 1.5 6.75V3C1.5 2.17158 2.17158 1.5 3 1.5H6.75ZM15 1.5C15.8284 1.5 16.5 2.17159 16.5 3V6.75C16.5 7.57841 15.8284 8.25 15 8.25H11.25C10.4216 8.25 9.75 7.57841 9.75 6.75V3C9.75 2.17159 10.4216 1.5 11.25 1.5H15ZM3 6.75H6.75V3H3V6.75ZM11.25 6.75H15V3H11.25V6.75Z" />
			</svg>`;
		}
		case 'mm-screen-left-navigation-link-merchandising--active':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M6.75 9.9375C7.47487 9.9375 8.0625 10.5251 8.0625 11.25V15C8.0625 15.7249 7.47487 16.3125 6.75 16.3125H3C2.27513 16.3125 1.6875 15.7249 1.6875 15V11.25C1.6875 10.5251 2.27513 9.9375 3 9.9375H6.75ZM15 9.9375C15.7249 9.9375 16.3125 10.5251 16.3125 11.25V15C16.3125 15.7249 15.7249 16.3125 15 16.3125H11.25C10.5251 16.3125 9.9375 15.7249 9.9375 15V11.25C9.9375 10.5251 10.5251 9.9375 11.25 9.9375H15ZM6.75 1.6875C7.47487 1.6875 8.0625 2.27513 8.0625 3V6.75C8.0625 7.47487 7.47487 8.0625 6.75 8.0625H3C2.27513 8.0625 1.6875 7.47487 1.6875 6.75V3C1.6875 2.27513 2.27513 1.6875 3 1.6875H6.75ZM15 1.6875C15.7249 1.6875 16.3125 2.27513 16.3125 3V6.75C16.3125 7.47487 15.7249 8.0625 15 8.0625H11.25C10.5251 8.0625 9.9375 7.47487 9.9375 6.75V3C9.9375 2.27513 10.5251 1.6875 11.25 1.6875H15Z" />
			</svg>`;
		}
		case 'mm-screen-left-navigation-link-marketing':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M15 2.25C15.8284 2.25 16.5 2.92159 16.5 3.75V14.25C16.5 15.0784 15.8284 15.75 15 15.75H14.5605C14.1627 15.75 13.7812 15.5918 13.5 15.3105L12.7549 14.5654C12.4917 14.3022 12.167 14.108 11.8105 14.001L10.1494 13.502L9.30957 14.7637C8.89867 15.3801 8.20645 15.7499 7.46582 15.75C6.24216 15.75 5.25 14.7579 5.25 13.5342V12.0332L5.13867 12H3.75C2.50737 12 1.5 10.9927 1.5 9.75V8.25C1.5 7.00736 2.50736 6 3.75 6H5.13867L11.8096 3.99902L11.9424 3.95508C12.247 3.8427 12.5245 3.66496 12.7549 3.43457L13.5 2.68945C13.7813 2.40811 14.1628 2.25003 14.5605 2.25H15ZM6.75 13.5342C6.75 13.9294 7.0706 14.25 7.46582 14.25C7.70487 14.2499 7.92788 14.1304 8.06055 13.9316H8.06152L8.64648 13.0518L6.75 12.4824V13.5342ZM13.8154 4.49512C13.3766 4.93389 12.8355 5.25721 12.2412 5.43555L6 7.30762V10.6914L12.2412 12.5645C12.8356 12.7428 13.3766 13.0661 13.8154 13.5049L14.5605 14.25H15V3.75H14.5605L13.8154 4.49512ZM3.75 7.5C3.33579 7.5 3 7.83579 3 8.25V9.75C3 10.1642 3.33578 10.5 3.75 10.5H4.5V7.5H3.75Z" />
			</svg>`;
		}
		case 'mm-screen-left-navigation-link-marketing--active':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M15 2.4375C15.7249 2.4375 16.3125 3.02513 16.3125 3.75V14.25C16.3125 14.9749 15.7249 15.5625 15 15.5625H14.5605C14.2125 15.5625 13.8789 15.4239 13.6328 15.1777L12.8867 14.4326C12.6016 14.1475 12.2505 13.9372 11.8643 13.8213L10.6953 13.4707L9.90332 14.6592C9.52715 15.2234 8.89383 15.5624 8.21582 15.5625C7.0957 15.5625 6.1875 14.6543 6.1875 13.5342V12.1182L5.8125 12.0059V5.99414L11.8643 4.17871C12.2505 4.06281 12.6016 3.85245 12.8867 3.56738L13.6328 2.82227C13.8789 2.57615 14.2125 2.43753 14.5605 2.4375H15ZM7.3125 13.5342C7.3125 14.033 7.717 14.4375 8.21582 14.4375C8.51771 14.4374 8.79935 14.2864 8.9668 14.0352L9.56836 13.1328L7.3125 12.4561V13.5342ZM4.6875 11.8125H3.75C2.61091 11.8125 1.6875 10.8891 1.6875 9.75V8.25C1.6875 7.11091 2.61091 6.1875 3.75 6.1875H4.6875V11.8125Z" />
			</svg>`;
		}
		case 'mm-screen-left-navigation-link-analytics':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M4.125 10.5C4.95341 10.5 5.625 11.1716 5.625 12V15C5.625 15.8284 4.95341 16.5 4.125 16.5H3.375C2.54659 16.5 1.875 15.8284 1.875 15V12C1.875 11.1716 2.54659 10.5 3.375 10.5H4.125ZM9.375 8.625C10.2034 8.625 10.875 9.29656 10.875 10.125V15C10.875 15.8284 10.2034 16.5 9.375 16.5H8.625C7.79656 16.5 7.125 15.8284 7.125 15V10.125C7.125 9.29656 7.79656 8.625 8.625 8.625H9.375ZM14.625 6C15.4534 6 16.125 6.67159 16.125 7.5V15C16.125 15.8284 15.4534 16.5 14.625 16.5H13.875C13.0466 16.5 12.375 15.8284 12.375 15V7.5C12.375 6.67159 13.0466 6 13.875 6H14.625ZM3.375 15H4.125V12H3.375V15ZM8.625 15H9.375V10.125H8.625V15ZM13.875 15H14.625V7.5H13.875V15ZM14.625 1.5C15.0392 1.5 15.375 1.83579 15.375 2.25V4.5C15.375 4.91421 15.0392 5.25 14.625 5.25C14.2108 5.25 13.875 4.91421 13.875 4.5V4.07617C13.4635 4.45333 12.9131 4.91901 12.208 5.43359C10.4134 6.74319 7.6256 8.37415 3.6123 9.71191C3.2194 9.84282 2.79408 9.63019 2.66309 9.2373C2.53211 8.84438 2.74481 8.41911 3.1377 8.28809C6.99897 7.00099 9.64912 5.44425 11.3232 4.22266C11.9632 3.75564 12.461 3.33631 12.8301 3H12.375C11.9608 3 11.625 2.66421 11.625 2.25C11.625 1.83579 11.9608 1.5 12.375 1.5H14.625Z" />
			</svg>`;
		}
		case 'mm-screen-left-navigation-link-analytics--active':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M4.125 11.0625C4.84987 11.0625 5.4375 11.6501 5.4375 12.375V15.375C5.4375 16.0999 4.84987 16.6875 4.125 16.6875H3.375C2.65013 16.6875 2.0625 16.0999 2.0625 15.375V12.375C2.0625 11.6501 2.65013 11.0625 3.375 11.0625H4.125ZM9.375 9.1875C10.0999 9.1875 10.6875 9.77513 10.6875 10.5V15.375C10.6875 16.0999 10.0999 16.6875 9.375 16.6875H8.625C7.90013 16.6875 7.3125 16.0999 7.3125 15.375V10.5C7.3125 9.77513 7.90013 9.1875 8.625 9.1875H9.375ZM14.625 6.5625C15.3499 6.5625 15.9375 7.15013 15.9375 7.875V15.375C15.9375 16.0999 15.3499 16.6875 14.625 16.6875H13.875C13.1501 16.6875 12.5625 16.0999 12.5625 15.375V7.875C12.5625 7.15013 13.1501 6.5625 13.875 6.5625H14.625ZM14.4375 1.3125C14.8517 1.3125 15.1875 1.64829 15.1875 2.0625V4.3125C15.1875 4.72671 14.8517 5.0625 14.4375 5.0625C14.0234 5.06238 13.6875 4.72664 13.6875 4.3125V3.89062C13.276 4.26767 12.7252 4.7319 12.0205 5.24609C10.2259 6.55571 7.43817 8.18664 3.4248 9.52441C3.03198 9.65521 2.60763 9.44258 2.47656 9.0498C2.3456 8.65694 2.55736 8.23168 2.9502 8.10059C6.81145 6.81352 9.46164 5.25674 11.1357 4.03516C11.776 3.56793 12.2745 3.14877 12.6436 2.8125H12.1875C11.7734 2.81238 11.4375 2.47664 11.4375 2.0625C11.4375 1.64836 11.7734 1.31262 12.1875 1.3125H14.4375Z" />
			</svg>`;
		}
		case 'mm-screen-left-navigation-link-marketplaces':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M9.3252 0.88208C9.52843 0.742415 9.78722 0.712019 10.0176 0.800049L16.0176 3.09595C16.3078 3.20703 16.4999 3.48543 16.5 3.79614V15.7415L16.5762 15.7454C16.9544 15.7836 17.2498 16.1031 17.25 16.4915C17.2499 16.9054 16.914 17.2412 16.5 17.2415H15.8555C15.821 17.2463 15.7859 17.2502 15.75 17.2502C15.7141 17.2502 15.679 17.2463 15.6445 17.2415L12.8438 17.2434C12.813 17.2472 12.7818 17.2502 12.75 17.2502C12.7179 17.2502 12.6863 17.2473 12.6553 17.2434L6.05176 17.2473C6.03464 17.2485 6.01742 17.2502 6 17.2502C5.98258 17.2502 5.96536 17.2485 5.94824 17.2473L1.5 17.2502C1.08607 17.2502 0.750376 16.9142 0.75 16.5002C0.749988 16.1119 1.04552 15.7925 1.42383 15.7542L1.5 15.7502V9.74536C1.50013 8.91715 2.17162 8.24536 3 8.24536H5.25V6.75024C5.25 5.92182 5.92158 5.25024 6.75 5.25024H9V1.50024C9 1.25342 9.12188 1.02203 9.3252 0.88208ZM3 15.7493L5.25 15.7473V9.74536H3V15.7493ZM6.75 15.7463L12 15.7434V6.75024H6.75V15.7463ZM10.5 5.25024H12C12.8284 5.25024 13.5 5.92183 13.5 6.75024V15.7424L15 15.7415V4.31079L10.5 2.58911V5.25024ZM10.124 12.7502C10.5382 12.7499 10.8746 13.0851 10.875 13.4993C10.8753 13.9133 10.54 14.2497 10.126 14.2502L8.62598 14.2512C8.21186 14.2516 7.87554 13.9163 7.875 13.5022C7.87463 13.0881 8.20995 12.7518 8.62402 12.7512L10.124 12.7502ZM10.125 10.5002C10.5391 10.5002 10.8748 10.8362 10.875 11.2502C10.875 11.6645 10.5392 12.0002 10.125 12.0002H8.625C8.21079 12.0002 7.875 11.6645 7.875 11.2502C7.87516 10.8362 8.21089 10.5002 8.625 10.5002H10.125ZM10.125 8.25122C10.5392 8.25122 10.875 8.58701 10.875 9.00122C10.875 9.41543 10.5392 9.75122 10.125 9.75122H8.625C8.21079 9.75122 7.875 9.41543 7.875 9.00122C7.875 8.58701 8.21079 8.25122 8.625 8.25122H10.125Z" />
			</svg>`;
		}
		case 'mm-screen-left-navigation-link-marketplaces--active':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M9.3252 1.88208C9.52832 1.74239 9.78725 1.71114 10.0176 1.79907L16.0176 4.09595C16.3078 4.20702 16.5 4.48535 16.5 4.79614V15.7415L16.5771 15.7454C16.9552 15.7837 17.2508 16.1033 17.251 16.4915C17.251 16.9055 16.915 17.2411 16.501 17.2415L12.1221 17.2434C12.0818 17.2467 12.0411 17.2502 12 17.2502H6.75C6.72969 17.2502 6.70957 17.2471 6.68945 17.2463L1.50098 17.2502C1.08677 17.2505 0.751217 16.9145 0.750977 16.5002C0.750964 16.1119 1.04558 15.7925 1.42383 15.7542L1.5 15.7502V9.74536C1.50013 8.9171 2.17165 8.24536 3 8.24536H5.25V6.75024C5.25 5.92182 5.92157 5.25024 6.75 5.25024H9V2.50024C9 2.25337 9.1218 2.02202 9.3252 1.88208ZM3 15.7493L5.25 15.7473V9.74536H3V15.7493ZM10.5 5.25024H12C12.8284 5.25024 13.5 5.92182 13.5 6.75024V15.7424L15 15.7415V5.31177L10.5 3.59009V5.25024ZM8.62402 12.9387C8.31358 12.9392 8.0622 13.1917 8.0625 13.5022C8.06302 13.8127 8.31538 14.0639 8.62598 14.0637L10.126 14.0627C10.4364 14.0623 10.6878 13.8098 10.6875 13.4993C10.687 13.1887 10.4347 12.9375 10.124 12.9377L8.62402 12.9387ZM8.625 10.6877C8.31449 10.6877 8.06273 10.9398 8.0625 11.2502C8.0625 11.5609 8.31435 11.8127 8.625 11.8127H10.125C10.4357 11.8127 10.6875 11.5609 10.6875 11.2502C10.6873 10.9398 10.4355 10.6877 10.125 10.6877H8.625ZM8.625 8.43872C8.31439 8.43872 8.06257 8.69063 8.0625 9.00122C8.0625 9.31187 8.31435 9.56372 8.625 9.56372H10.125C10.4357 9.56372 10.6875 9.31187 10.6875 9.00122C10.6874 8.69063 10.4356 8.43872 10.125 8.43872H8.625Z" />
			</svg>`;
		}
		case 'mm-screen-left-navigation-link-userinterface':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M13.875 1.125C15.5319 1.125 16.875 2.46816 16.875 4.125V13.875C16.875 15.5319 15.5319 16.875 13.875 16.875H4.125C2.46816 16.875 1.125 15.5319 1.125 13.875V4.125C1.125 2.46815 2.46815 1.125 4.125 1.125H13.875ZM6.75 7.5V15.375H13.875C14.7035 15.375 15.375 14.7035 15.375 13.875V7.5H6.75ZM2.625 13.875C2.625 14.7035 3.29657 15.375 4.125 15.375H5.25V7.5H2.625V13.875ZM4.125 2.625C3.29658 2.625 2.625 3.29658 2.625 4.125V6H15.375V4.125C15.375 3.29657 14.7035 2.625 13.875 2.625H4.125Z" />
			</svg>`;
		}
		case 'mm-screen-left-navigation-link-userinterface--active':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M5.22168 16.873L5.97266 16.875H4.125C2.46814 16.875 1.125 15.5318 1.125 13.875V7.5H5.24805L5.22168 16.873ZM16.875 13.875C16.875 15.5318 15.5318 16.875 13.875 16.875H6.72168L6.74805 7.5H16.875V13.875ZM13.875 1.125C15.5318 1.125 16.875 2.46814 16.875 4.125V6H1.125V4.125C1.125 2.46814 2.46814 1.125 4.125 1.125H13.875Z" />
			</svg>`;
		}
		case 'mm-screen-left-navigation-link-settings':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M9.96021 0.75C10.6056 0.750273 11.1789 1.16318 11.3831 1.77539L11.8772 3.25879L12.55 3.68457L14.1545 3.28809C14.7961 3.12961 15.4662 3.40955 15.804 3.97754L16.8469 5.73145C17.1761 6.28528 17.1129 6.98333 16.7024 7.46777L16.6155 7.56152L15.4807 8.69043V9.30957L16.6145 10.4385H16.6155C17.1021 10.9233 17.197 11.6779 16.8459 12.2686L15.804 14.0225C15.4662 14.5906 14.7953 14.8706 14.1536 14.7119L12.5266 14.3086L11.9465 14.6348L11.5032 16.167C11.3175 16.8083 10.7303 17.2498 10.0627 17.25H7.93872C7.271 17.2499 6.68401 16.8083 6.49829 16.167L6.05396 14.6357L5.4729 14.3086L3.84692 14.7119C3.20531 14.8706 2.53533 14.5903 2.19751 14.0225L1.17407 12.3008C0.805363 11.6805 0.930403 10.8851 1.47192 10.4082L2.55981 9.4502V8.54883L1.47192 7.5918C0.930193 7.11491 0.805341 6.31959 1.17407 5.69922L2.19653 3.97754C2.5344 3.40937 3.20524 3.12933 3.84692 3.28809L5.45044 3.68457L6.12329 3.25879L6.61841 1.77539C6.82271 1.16312 7.39573 0.75 8.04126 0.75H9.96021ZM7.46216 3.9873C7.40751 4.15121 7.29756 4.29134 7.15161 4.38379L5.98169 5.12402C5.80906 5.23321 5.59893 5.26672 5.40063 5.21777L3.48657 4.74414L2.46313 6.46582L3.80591 7.64746C3.96753 7.78984 4.05981 7.99554 4.05981 8.21094V9.78906C4.05981 10.0044 3.96748 10.2102 3.80591 10.3525L2.46411 11.5342L3.48657 13.2559L5.40063 12.7822L5.54126 12.7607C5.68201 12.7533 5.82388 12.7856 5.94849 12.8555L7.05591 13.4775L7.17603 13.5615C7.28659 13.656 7.36835 13.7812 7.40942 13.9229L7.93872 15.75H10.0627L10.592 13.9229L10.6458 13.7871C10.7126 13.6578 10.8168 13.5498 10.9456 13.4775L12.053 12.8564L12.1829 12.7988C12.3166 12.7543 12.4612 12.7479 12.5999 12.7822L14.5139 13.2559L15.5569 11.502L14.2024 10.1533C14.061 10.0125 13.9806 9.82069 13.9807 9.62109L13.9817 8.37793C13.9818 8.17864 14.0612 7.98729 14.2024 7.84668L15.5569 6.49805L14.5149 4.74414L12.6008 5.21777C12.4026 5.26681 12.1924 5.23299 12.0198 5.12402L10.8499 4.38379C10.7038 4.29139 10.594 4.15126 10.5393 3.9873L9.96021 2.25H8.04126L7.46216 3.9873ZM9.00024 5.625C10.8641 5.62509 12.3752 7.13609 12.3752 9C12.3752 10.8639 10.8641 12.3749 9.00024 12.375C7.13628 12.375 5.62524 10.864 5.62524 9C5.62524 7.13604 7.13628 5.625 9.00024 5.625ZM9.00024 7.125C7.96471 7.125 7.12524 7.96446 7.12524 9C7.12524 10.0355 7.96471 10.875 9.00024 10.875C10.0357 10.8749 10.8752 10.0355 10.8752 9C10.8752 7.96452 10.0357 7.12509 9.00024 7.125Z" />
			</svg>`;
		}
		case 'mm-screen-left-navigation-link-settings--active':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M8.0418 0.9375C7.47687 0.9375 6.97531 1.299 6.79666 1.83495L6.28104 3.38182L5.4835 3.88625L3.80231 3.47026C3.24074 3.33131 2.65441 3.57643 2.35882 4.07372L1.33568 5.79504C1.01302 6.33788 1.12267 7.03354 1.59667 7.45081L2.74845 8.46472V9.53528L1.59702 10.5492C1.12314 10.9665 1.01356 11.662 1.33618 12.2049L2.35937 13.9263C2.65495 14.4236 3.24128 14.6686 3.80286 14.5297L5.50093 14.1096L6.21398 14.5094L6.67888 16.115C6.84139 16.6762 7.35532 17.0625 7.93957 17.0625H10.0634C10.6477 17.0625 11.1616 16.6762 11.3242 16.115L11.7891 14.5093L12.5016 14.1096L14.1996 14.5297C14.7612 14.6686 15.3475 14.4236 15.6431 13.9263L16.6856 12.1723C16.9928 11.6554 16.9096 10.9959 16.4834 10.5716L15.2945 9.3879L15.2948 8.61232L16.4839 7.42835C16.9101 7.00409 16.9934 6.34452 16.6861 5.82764L15.6436 4.07372C15.3481 3.57643 14.7617 3.33131 14.2002 3.47026L12.519 3.88625L11.7214 3.38182L11.2058 1.83495C11.0272 1.299 10.5256 0.9375 9.96067 0.9375H8.0418ZM9 11.625C10.4497 11.625 11.625 10.4497 11.625 9C11.625 7.55025 10.4497 6.375 9 6.375C7.55025 6.375 6.375 7.55025 6.375 9C6.375 10.4497 7.55025 11.625 9 11.625Z" />
			</svg>`;
		}
		case 'mm-screen-left-navigation-link-flyout':
		{
			return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M11.25 10C11.25 10.2472 11.1767 10.4889 11.0393 10.6945C10.902 10.9 10.7068 11.0602 10.4784 11.1548C10.2499 11.2495 9.99861 11.2742 9.75614 11.226C9.51366 11.1777 9.29093 11.0587 9.11612 10.8839C8.9413 10.7091 8.82225 10.4863 8.77402 10.2439C8.72579 10.0014 8.75054 9.75005 8.84515 9.52165C8.93976 9.29324 9.09998 9.09801 9.30554 8.96066C9.5111 8.82331 9.75277 8.75 10 8.75C10.3315 8.75 10.6495 8.8817 10.8839 9.11612C11.1183 9.35054 11.25 9.66848 11.25 10ZM4.6875 8.75C4.44027 8.75 4.1986 8.82331 3.99304 8.96066C3.78748 9.09801 3.62726 9.29324 3.53265 9.52165C3.43804 9.75005 3.41329 10.0014 3.46152 10.2439C3.50975 10.4863 3.6288 10.7091 3.80362 10.8839C3.97843 11.0587 4.20116 11.1777 4.44364 11.226C4.68611 11.2742 4.93745 11.2495 5.16585 11.1548C5.39426 11.0602 5.58949 10.9 5.72684 10.6945C5.86419 10.4889 5.9375 10.2472 5.9375 10C5.9375 9.66848 5.8058 9.35054 5.57138 9.11612C5.33696 8.8817 5.01902 8.75 4.6875 8.75ZM15.3125 8.75C15.0653 8.75 14.8236 8.82331 14.618 8.96066C14.4125 9.09801 14.2523 9.29324 14.1577 9.52165C14.063 9.75005 14.0383 10.0014 14.0865 10.2439C14.1348 10.4863 14.2538 10.7091 14.4286 10.8839C14.6034 11.0587 14.8262 11.1777 15.0686 11.226C15.3111 11.2742 15.5624 11.2495 15.7909 11.1548C16.0193 11.0602 16.2145 10.9 16.3518 10.6945C16.4892 10.4889 16.5625 10.2472 16.5625 10C16.5625 9.66848 16.4308 9.35054 16.1964 9.11612C15.962 8.8817 15.644 8.75 15.3125 8.75Z" />
			</svg>`;
		}
		case 'mm-screen-left-navigation-store-button-maintenance-mode':
		{
			return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M18.7292 7.43677C18.7012 7.38001 18.6587 7.33761 18.6025 7.3101C18.5739 7.31013 18.5601 7.29636 18.532 7.29584C18.532 7.29584 18.5176 7.31019 18.5033 7.29587L18.4471 7.29593L18.4327 7.31028C18.4184 7.32463 18.3903 7.32411 18.3759 7.33846L16.1716 9.5428L14.9161 9.13506L14.5084 7.87961L16.6989 5.68912C16.7132 5.67477 16.727 5.66097 16.7271 5.6323L16.7414 5.61795C16.7558 5.6036 16.7414 5.58929 16.7415 5.56172L16.7415 5.53305C16.7415 5.50438 16.7278 5.49062 16.7272 5.4625L16.7129 5.44818C16.6849 5.39143 16.6425 5.34902 16.5863 5.32151C15.1898 4.77279 13.5946 5.09926 12.5349 6.15893C11.5034 7.19043 11.1634 8.71455 11.6415 10.0692L6.34325 15.3674C5.70747 16.0032 5.70639 17.0198 6.34083 17.6543C6.97527 18.2887 7.9919 18.2876 8.62768 17.6519L13.9403 12.3392C15.2949 12.8174 16.8191 12.4773 17.8506 11.4458C18.9526 10.4285 19.2923 8.84759 18.7292 7.43677Z" />
			</svg>`;
		}
		case 'mm-screen-left-navigation-store-menu-dropdown':
		{
			return `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M8.64795 7.85199C8.70039 7.90424 8.742 7.96634 8.77039 8.03471C8.79878 8.10309 8.81339 8.17639 8.81339 8.25042C8.81339 8.32446 8.79878 8.39776 8.77039 8.46613C8.742 8.53451 8.70039 8.5966 8.64795 8.64886L6.39795 10.8989C6.34569 10.9513 6.28359 10.9929 6.21522 11.0213C6.14685 11.0497 6.07354 11.0643 5.99951 11.0643C5.92548 11.0643 5.85217 11.0497 5.7838 11.0213C5.71543 10.9929 5.65333 10.9513 5.60107 10.8989L3.35107 8.64886C3.2454 8.54319 3.18604 8.39987 3.18604 8.25042C3.18604 8.10098 3.2454 7.95766 3.35107 7.85199C3.45675 7.74631 3.60007 7.68695 3.74951 7.68695C3.89895 7.68695 4.04228 7.74631 4.14795 7.85199L5.99998 9.70308L7.85201 7.85058C7.90434 7.79837 7.96646 7.75699 8.03479 7.72881C8.10313 7.70062 8.17635 7.68618 8.25027 7.68631C8.32419 7.68644 8.39736 7.70114 8.4656 7.72957C8.53384 7.75799 8.5958 7.79959 8.64795 7.85199ZM4.14795 4.14886L5.99998 2.29683L7.85201 4.14933C7.95768 4.255 8.10101 4.31437 8.25045 4.31437C8.39989 4.31437 8.54321 4.255 8.64889 4.14933C8.75456 4.04366 8.81392 3.90034 8.81392 3.75089C8.81392 3.60145 8.75456 3.45813 8.64889 3.35245L6.39889 1.10246C6.34663 1.05002 6.28453 1.00841 6.21616 0.980016C6.14779 0.951626 6.07448 0.937012 6.00045 0.937012C5.92642 0.937012 5.85311 0.951626 5.78474 0.980016C5.71637 1.00841 5.65427 1.05002 5.60201 1.10246L3.35201 3.35245C3.24634 3.45813 3.18697 3.60145 3.18697 3.75089C3.18697 3.90034 3.24634 4.04366 3.35201 4.14933C3.45768 4.255 3.60101 4.31437 3.75045 4.31437C3.89989 4.31437 4.04321 4.255 4.14889 4.14933L4.14795 4.14886Z" />
			</svg>`;
		}
		case 'mm-screen-left-navigation-store-menu-add-store':
		{
			return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M11.2498 16.3336V12.7496H7.66675C7.25253 12.7496 6.91675 12.4138 6.91675 11.9996C6.91692 11.5856 7.25264 11.2496 7.66675 11.2496H11.2498V7.66663C11.2498 7.25252 11.5857 6.9168 11.9998 6.91663C12.414 6.91663 12.7498 7.25241 12.7498 7.66663V11.2496H16.3337C16.7477 11.2498 17.0836 11.5857 17.0837 11.9996C17.0837 12.4137 16.7478 12.7495 16.3337 12.7496H12.7498V16.3336C12.7496 16.7477 12.4139 17.0836 11.9998 17.0836C11.5858 17.0834 11.2499 16.7476 11.2498 16.3336Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-branch-menu-refresh':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M2.10547 6.71191C2.44848 6.74992 2.69613 7.0593 2.6582 7.40234C2.63654 7.59834 2.625 7.79774 2.625 8C2.625 10.9686 5.03147 13.375 8 13.375C9.40179 13.375 10.6782 12.838 11.6357 11.958H10.667C10.3218 11.958 10.042 11.6782 10.042 11.333C10.0421 10.9879 10.3219 10.708 10.667 10.708H13.334C13.6788 10.7083 13.9589 10.9881 13.959 11.333V14C13.9588 14.3448 13.6788 14.6247 13.334 14.625C12.9889 14.625 12.7092 14.345 12.709 14V12.6562C11.5086 13.8701 9.84323 14.625 8 14.625C4.34112 14.625 1.375 11.6589 1.375 8C1.375 7.7517 1.38832 7.50628 1.41504 7.26465C1.45297 6.92156 1.76238 6.67398 2.10547 6.71191ZM8 1.375C11.6589 1.375 14.625 4.34112 14.625 8C14.625 8.24826 14.6117 8.49368 14.585 8.73535C14.547 9.07844 14.2376 9.32602 13.8945 9.28809C13.5515 9.25007 13.3039 8.94069 13.3418 8.59766C13.3635 8.40169 13.375 8.2023 13.375 8C13.375 5.03147 10.9686 2.625 8 2.625C6.59821 2.625 5.32179 3.16204 4.36426 4.04199H5.33398C5.6789 4.0423 5.95898 4.322 5.95898 4.66699C5.95881 5.01183 5.67879 5.29168 5.33398 5.29199H2.66699C2.32192 5.29199 2.04217 5.01202 2.04199 4.66699V2C2.04199 1.65482 2.32181 1.375 2.66699 1.375C3.01206 1.37513 3.29199 1.6549 3.29199 2V3.34082C4.49218 2.12812 6.15777 1.375 8 1.375Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-branch-menu-merge':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M4.125 1C5.29861 1 6.25 1.95139 6.25 3.125C6.25 3.89708 5.8366 4.57026 5.2207 4.94238L7.35645 7.43262C7.41567 7.50161 7.49886 7.54671 7.58887 7.55957L10.1211 7.9209C10.4118 7.09362 11.1984 6.5 12.125 6.5C13.2986 6.5 14.25 7.45139 14.25 8.625C14.25 9.79861 13.2986 10.75 12.125 10.75C11.1428 10.75 10.3187 10.083 10.0752 9.17773L7.41113 8.79688V8.7959C7.02123 8.74005 6.66472 8.54501 6.4082 8.24609L4.75 6.31348V10.0938C5.61853 10.3607 6.25 11.1689 6.25 12.125C6.25 13.2986 5.29861 14.25 4.125 14.25C2.95139 14.25 2 13.2986 2 12.125C2 11.1689 2.63147 10.3607 3.5 10.0938V5.15527C2.63161 4.88826 2 4.08095 2 3.125C2 1.95139 2.95139 1 4.125 1ZM4.125 11.25C3.64175 11.25 3.25 11.6418 3.25 12.125C3.25 12.6082 3.64175 13 4.125 13C4.60825 13 5 12.6082 5 12.125C5 11.6418 4.60825 11.25 4.125 11.25ZM12.125 7.75C11.6418 7.75 11.25 8.14175 11.25 8.625C11.25 9.10825 11.6418 9.5 12.125 9.5C12.6082 9.5 13 9.10825 13 8.625C13 8.14175 12.6082 7.75 12.125 7.75ZM4.125 2.25C3.64175 2.25 3.25 2.64175 3.25 3.125C3.25 3.60825 3.64175 4 4.125 4C4.60825 4 5 3.60825 5 3.125C5 2.64175 4.60825 2.25 4.125 2.25Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-branch-menu-copy':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M10.001 0.713867C11.0819 0.714621 11.9579 1.59193 11.958 2.67285V5.37891L13.335 5.37988C14.4158 5.38078 15.292 6.25791 15.292 7.33887V13.333C15.292 14.4146 14.4146 15.292 13.333 15.292H7.33301C6.25161 15.2918 5.375 14.4145 5.375 13.333V11.958H2.66602C1.58482 11.9577 0.70816 11.0813 0.708008 10V2.66699C0.708316 1.58524 1.58618 0.708363 2.66797 0.708984L10.001 0.713867ZM7.33398 6.62598C6.9427 6.6257 6.62517 6.94274 6.625 7.33398V13.333C6.625 13.7241 6.94195 14.0418 7.33301 14.042H13.333C13.7242 14.042 14.042 13.7242 14.042 13.333V7.33887C14.042 6.94789 13.7249 6.63024 13.334 6.62988L7.33398 6.62598ZM2.66699 1.95898C2.27589 1.95884 1.95832 2.27594 1.95801 2.66699V10C1.95816 10.3909 2.27516 10.7077 2.66602 10.708H5.375V7.33398C5.37517 6.25204 6.25298 5.37521 7.33496 5.37598L10.708 5.37793V2.67285C10.7079 2.28196 10.3909 1.96414 10 1.96387L2.66699 1.95898Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-branch-menu-history':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M11 8.04199C13.002 8.04199 14.625 9.66495 14.625 11.667C14.6249 13.6689 13.002 15.292 11 15.292C8.99804 15.292 7.37513 13.6689 7.375 11.667C7.375 9.66495 8.99796 8.04199 11 8.04199ZM11.333 0.708008C12.4144 0.708008 13.2917 1.58473 13.292 2.66602V7C13.2918 7.34492 13.0119 7.62482 12.667 7.625C12.3219 7.625 12.0422 7.34503 12.042 7V2.66602C12.0417 2.27507 11.724 1.95801 11.333 1.95801H3.33301C2.94219 1.95823 2.62531 2.27522 2.625 2.66602V13.333C2.625 13.7241 2.94194 14.0408 3.33301 14.041H7C7.34499 14.041 7.62469 14.3211 7.625 14.666C7.625 15.0112 7.34518 15.291 7 15.291H3.33301C2.2516 15.2908 1.37499 14.4145 1.375 13.333V2.66602C1.37531 1.58486 2.25184 0.708234 3.33301 0.708008H11.333ZM11 9.29199C9.68831 9.29199 8.625 10.3553 8.625 11.667C8.62513 12.9786 9.68839 14.042 11 14.042C12.3116 14.042 13.3749 12.9786 13.375 11.667C13.375 10.3553 12.3117 9.29199 11 9.29199ZM11 9.70898C11.3452 9.70898 11.625 9.98881 11.625 10.334V11.5303L12.2148 11.7471C12.5389 11.8659 12.7057 12.2248 12.5869 12.5488C12.4681 12.8726 12.109 13.0393 11.7852 12.9209L10.7852 12.5537C10.5391 12.4635 10.3751 12.2289 10.375 11.9668V10.334C10.375 9.98881 10.6548 9.70898 11 9.70898ZM7.33398 6.70898C7.6789 6.70929 7.95898 6.989 7.95898 7.33398C7.95868 7.67871 7.67871 7.95868 7.33398 7.95898H4.66699C4.322 7.95898 4.0423 7.6789 4.04199 7.33398C4.04199 6.98881 4.32181 6.70898 4.66699 6.70898H7.33398ZM10 4.04199C10.3451 4.04212 10.625 4.3219 10.625 4.66699C10.6249 5.01198 10.345 5.29186 10 5.29199H4.66699C4.3219 5.29199 4.04212 5.01206 4.04199 4.66699C4.04199 4.32181 4.32181 4.04199 4.66699 4.04199H10Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-branch-menu-flush-cache':
		{
			return ``;
		}
		case 'mm-screen-top-navigation-branch-menu-manage-branches':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M11 8.04199C11.345 8.04217 11.625 8.32192 11.625 8.66699V8.87988C12.0406 8.98223 12.4173 9.18386 12.7256 9.45898L12.9922 9.28613C13.2811 9.09782 13.6688 9.17895 13.8574 9.46777C14.0458 9.7566 13.9643 10.1442 13.6758 10.333L13.4229 10.4971C13.5162 10.7592 13.5693 11.0408 13.5693 11.334C13.5693 11.6269 13.517 11.9081 13.4238 12.1699L13.6748 12.334C13.9635 12.5228 14.0451 12.9103 13.8564 13.1992C13.6677 13.488 13.2801 13.5693 12.9912 13.3809L12.7256 13.207C12.4172 13.4825 12.0409 13.6847 11.625 13.7871V14C11.6249 14.345 11.3449 14.6248 11 14.625C10.6551 14.6248 10.3751 14.345 10.375 14V13.7871C9.95897 13.6846 9.58189 13.4826 9.27344 13.207L9.00879 13.3809C8.71991 13.5694 8.33233 13.4879 8.14355 13.1992C7.95499 12.9103 8.03636 12.5227 8.3252 12.334L8.57715 12.1699C8.48391 11.9081 8.43073 11.6269 8.43066 11.334C8.43066 11.0408 8.48381 10.7592 8.57715 10.4971L8.3252 10.333C8.03628 10.1442 7.95485 9.75674 8.14355 9.46777C8.3323 9.17896 8.71986 9.09757 9.00879 9.28613L9.27344 9.45898C9.58183 9.18353 9.95912 8.98235 10.375 8.87988V8.66699C10.375 8.32192 10.655 8.04217 11 8.04199ZM11 10.0537C10.5371 10.0538 10.1335 10.2841 9.89844 10.6289C9.76035 10.8314 9.68066 11.0734 9.68066 11.334C9.68078 11.5942 9.7605 11.8357 9.89844 12.0381C10.1336 12.3827 10.5372 12.6132 11 12.6133C11.4629 12.6132 11.8664 12.3828 12.1016 12.0381C12.2396 11.8356 12.3192 11.5943 12.3193 11.334C12.3193 11.0735 12.2395 10.8313 12.1016 10.6289C11.8664 10.2843 11.4628 10.0538 11 10.0537ZM6 9.375C6.34507 9.37513 6.625 9.6549 6.625 10C6.625 10.3451 6.34507 10.6249 6 10.625H2.66699C2.32181 10.625 2.04199 10.3452 2.04199 10C2.04199 9.65482 2.32181 9.375 2.66699 9.375H6ZM13.334 5.375C13.6789 5.37531 13.959 5.65501 13.959 6C13.959 6.34499 13.6789 6.62469 13.334 6.625H2.66699C2.32181 6.625 2.04199 6.34518 2.04199 6C2.04199 5.65482 2.32181 5.375 2.66699 5.375H13.334ZM13.334 1.375C13.6789 1.37531 13.959 1.65501 13.959 2C13.959 2.34499 13.6789 2.62469 13.334 2.625H2.66699C2.32181 2.625 2.04199 2.34518 2.04199 2C2.04199 1.65482 2.32181 1.375 2.66699 1.375H13.334Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-branch-menu-add':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M8 0.708008C12.0268 0.708184 15.2909 3.97314 15.291 8C15.2908 12.0268 12.0268 15.2908 8 15.291C3.97314 15.2909 0.708184 12.0268 0.708008 8C0.70814 3.97312 3.97312 0.70814 8 0.708008ZM8 1.95801C4.66347 1.95814 1.95814 4.66347 1.95801 8C1.95818 11.3365 4.6635 14.0409 8 14.041C11.3364 14.0408 14.0408 11.3364 14.041 8C14.0409 4.6635 11.3365 1.95818 8 1.95801ZM8 4.70801C8.34495 4.70818 8.62487 4.98805 8.625 5.33301V7.375H10.666C11.0111 7.375 11.2909 7.65493 11.291 8C11.2908 8.34503 11.0111 8.625 10.666 8.625H8.625V10.666C8.625 11.0111 8.34503 11.2908 8 11.291C7.65493 11.2909 7.375 11.0111 7.375 10.666V8.625H5.33301C4.98805 8.62487 4.70818 8.34495 4.70801 8C4.70814 7.65502 4.98802 7.37513 5.33301 7.375H7.375V5.33301C7.37513 4.98802 7.65502 4.70814 8 4.70801Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-button-dropdown':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M11.4697 5.46967C11.7625 5.17678 12.2373 5.17678 12.5302 5.46967C12.8231 5.76256 12.8231 6.23732 12.5302 6.53021L8.53021 10.5302C8.23731 10.8231 7.76255 10.8231 7.46966 10.5302L3.46966 6.53021C3.17678 6.23732 3.17678 5.76255 3.46966 5.46967C3.76255 5.17679 4.23732 5.17679 4.53021 5.46967L7.99993 8.93939L11.4697 5.46967Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-tags':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M16.005 1C16.3498 1.00038 16.63 1.28006 16.63 1.625V8.50391C16.6299 9.06728 16.4053 9.6074 16.0069 10.0059L10.0069 16.0059C9.17718 16.8356 7.83189 16.8354 7.00204 16.0059L1.62313 10.6279C0.793273 9.79811 0.793257 8.4519 1.62313 7.62207L7.62313 1.62207C8.02164 1.22372 8.56261 1 9.12606 1H16.005ZM9.12606 2.25C8.89416 2.25 8.67103 2.3419 8.50692 2.50586L2.50692 8.50586C2.16524 8.84752 2.16523 9.40247 2.50692 9.74414L7.88583 15.1221C8.22752 15.4635 8.78154 15.4637 9.12313 15.1221L15.1231 9.12207C15.287 8.95803 15.3799 8.73575 15.38 8.50391V2.25H9.12606ZM12.253 3.625C13.2193 3.62517 14.003 4.4086 14.003 5.375C14.003 6.3414 13.2193 7.12483 12.253 7.125C11.2865 7.125 10.503 6.34151 10.503 5.375C10.503 4.40849 11.2865 3.625 12.253 3.625ZM12.253 4.875C11.9769 4.875 11.753 5.09886 11.753 5.375C11.753 5.65114 11.9769 5.875 12.253 5.875C12.529 5.87483 12.753 5.65103 12.753 5.375C12.753 5.09897 12.529 4.87517 12.253 4.875Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-updatesavailable':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M8 0.916016C10.9915 0.916016 13.417 3.34244 13.417 6.33398V8.68848L14.1846 9.45703C14.5461 9.81878 14.75 10.3097 14.75 10.8213C14.7496 11.8864 13.8856 12.75 12.8203 12.75H10.9922C10.6571 14.0904 9.44421 15.083 8 15.083C6.55594 15.0829 5.34375 14.0902 5.00879 12.75H3.17969C2.11441 12.75 1.25039 11.8864 1.25 10.8213C1.25 10.3097 1.45385 9.81882 1.81543 9.45703L2.58301 8.68848V6.33398C2.58301 3.34244 5.00846 0.916016 8 0.916016ZM6.60645 12.75C6.87381 13.2457 7.39722 13.5829 8 13.583C8.60295 13.583 9.12693 13.2458 9.39453 12.75H6.60645ZM8 2.41699C5.83689 2.41699 4.08301 4.17087 4.08301 6.33398V8.99902C4.08288 9.19776 4.00382 9.38876 3.86328 9.5293L2.87598 10.5176C2.79555 10.5981 2.75 10.7076 2.75 10.8213C2.75039 11.058 2.94288 11.25 3.17969 11.25H12.8203C13.0571 11.25 13.2496 11.058 13.25 10.8213C13.25 10.7077 13.2045 10.5982 13.124 10.5176L12.1367 9.5293C11.9962 9.38876 11.9171 9.19776 11.917 8.99902V6.33398C11.917 4.17086 10.1631 2.41699 8 2.41699Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-shopascustomer':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M8 1.58301C10.2549 1.58314 12.0838 3.41206 12.084 5.66699C12.0838 6.96841 11.4731 8.12621 10.5244 8.87402C12.244 9.78182 13.416 11.5873 13.416 13.667C13.4158 14.0811 13.0801 14.417 12.666 14.417C12.2522 14.4167 11.9162 14.0809 11.916 13.667C11.916 11.5101 10.1731 9.76004 8.01855 9.75C8.01237 9.75003 8.00619 9.75098 8 9.75098C7.99357 9.75098 7.98689 9.75003 7.98047 9.75C5.82645 9.76065 4.08301 11.5105 4.08301 13.667C4.08283 14.0811 3.74711 14.417 3.33301 14.417C2.91902 14.4169 2.58318 14.081 2.58301 13.667C2.58301 11.5876 3.75529 9.78195 5.47461 8.87402C4.52647 8.12619 3.91714 6.96811 3.91699 5.66699C3.91717 3.41209 5.7451 1.58318 8 1.58301ZM8 3.08398C6.57352 3.08416 5.41717 4.24052 5.41699 5.66699C5.41726 7.0889 6.56609 8.24259 7.98633 8.25H8.0127C9.4333 8.24303 10.5837 7.08917 10.584 5.66699C10.5838 4.24049 9.4265 3.08412 8 3.08398Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-shopascustomer-menu-item-customer':
		{
			return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M10 0.916016C15.0162 0.916279 19.0838 4.98372 19.084 10C19.0837 15.0162 15.0162 19.0837 10 19.084C4.98372 19.0838 0.916279 15.0162 0.916016 10C0.916191 4.98367 4.98367 0.916191 10 0.916016ZM10 12.417C7.779 12.417 5.95623 14.1202 5.7666 16.292C6.97558 17.1071 8.43232 17.5839 10 17.584C11.5675 17.5839 13.0234 17.1069 14.2324 16.292C14.0428 14.1202 12.221 12.417 10 12.417ZM10 2.41699C5.8121 2.41717 2.41717 5.8121 2.41699 10C2.41712 11.9956 3.18895 13.81 4.44922 15.1641C4.89094 13.5281 6.03558 12.1809 7.54004 11.4678C6.79949 10.7971 6.33422 9.82869 6.33398 8.75098C6.33398 6.72593 7.97593 5.08398 10.001 5.08398C12.0256 5.08442 13.667 6.7262 13.667 8.75098C13.6668 9.82879 13.2005 10.7971 12.46 11.4678C13.9643 12.1809 15.108 13.5283 15.5498 15.1641C16.8104 13.8099 17.5839 11.9957 17.584 10C17.5838 5.81215 14.1878 2.41726 10 2.41699ZM10.001 6.58398C8.80436 6.58398 7.83398 7.55436 7.83398 8.75098C7.83442 9.94722 8.80463 10.917 10.001 10.917C11.197 10.9166 12.1666 9.94695 12.167 8.75098C12.167 7.55463 11.1972 6.58442 10.001 6.58398Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-shopascustomer-menu-item-email':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M13.334 1.91602C14.4843 1.91628 15.4168 2.84973 15.417 4V12C15.4167 13.1502 14.4842 14.0837 13.334 14.084H2.66699C1.51672 14.0838 0.583272 13.1503 0.583008 12V4C0.583184 2.84966 1.51666 1.91619 2.66699 1.91602H13.334ZM2.08398 12C2.08425 12.3218 2.34513 12.5838 2.66699 12.584H13.334C13.6558 12.5837 13.9167 12.3218 13.917 12V5.88086L8.93262 8.37305C8.34643 8.66614 7.65562 8.66584 7.06934 8.37305L2.08398 5.87988V12ZM2.66699 3.41699C2.34508 3.41717 2.08416 3.67809 2.08398 4V4.20312L7.74023 7.03125C7.90423 7.1129 8.09783 7.1132 8.26172 7.03125L13.917 4.20312V4C13.9168 3.67814 13.6558 3.41726 13.334 3.41699H2.66699Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-shopascustomer-menu-item-login':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M8 1.58301C10.2548 1.58327 12.0838 3.41214 12.084 5.66699C12.0838 6.96862 11.4724 8.12622 10.5234 8.87402C12.2435 9.78165 13.417 11.5869 13.417 13.667C13.4168 14.0809 13.0809 14.4167 12.667 14.417C12.253 14.4168 11.9172 14.0809 11.917 13.667C11.917 11.51 10.1732 9.75991 8.01855 9.75C8.01237 9.75003 8.00619 9.75098 8 9.75098C7.99397 9.75098 7.98747 9.75003 7.98145 9.75C5.82709 9.76026 4.08398 11.5102 4.08398 13.667C4.08381 14.0809 3.74786 14.4167 3.33398 14.417C2.91988 14.417 2.58318 14.0811 2.58301 13.667C2.58301 11.5875 3.75618 9.7829 5.47559 8.875C4.52674 8.1272 3.91714 6.96867 3.91699 5.66699C3.91717 3.41209 5.7451 1.58318 8 1.58301ZM8 3.08398C6.57352 3.08416 5.41717 4.24052 5.41699 5.66699C5.41726 7.08931 6.5665 8.24325 7.9873 8.25H8.0127C9.43319 8.2429 10.5837 7.08909 10.584 5.66699C10.5838 4.24057 9.42639 3.08425 8 3.08398Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-shopascustomer-menu-item-end':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M8.00098 0.583008C12.0967 0.583448 15.417 3.90513 15.417 8.00098C15.4166 12.0964 12.0964 15.4166 8.00098 15.417C3.90513 15.417 0.583448 12.0967 0.583008 8.00098C0.583008 3.90486 3.90486 0.583008 8.00098 0.583008ZM8.00098 2.08398C4.73329 2.08398 2.08398 4.73329 2.08398 8.00098C2.08442 11.2683 4.73356 13.917 8.00098 13.917C11.268 13.9166 13.9166 11.268 13.917 8.00098C13.917 4.73356 11.2683 2.08442 8.00098 2.08398ZM9.46973 5.46973C9.76261 5.17685 10.2374 5.17686 10.5303 5.46973C10.8231 5.76261 10.8231 6.2374 10.5303 6.53027L9.06055 8L10.5303 9.46973C10.8228 9.76258 10.8229 10.2375 10.5303 10.5303C10.2375 10.8231 9.76263 10.8229 9.46973 10.5303L8 9.06055L6.53125 10.5303C6.2384 10.8232 5.76264 10.8231 5.46973 10.5303C5.17712 10.2374 5.17711 9.76257 5.46973 9.46973L6.93945 8L5.46973 6.53027C5.17686 6.23737 5.17685 5.76261 5.46973 5.46973C5.76263 5.17686 6.23739 5.17685 6.53027 5.46973L8 6.93945L9.46973 5.46973Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-history':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M1.29077 6.15161C2.75285 2.29344 6.97597 0.0615952 11.0662 1.15356C15.4198 2.31636 18.0113 6.7697 16.8455 11.1057C15.6798 15.4409 11.2025 18.0061 6.84937 16.844C3.6155 15.9804 1.35444 13.3021 0.881592 10.2063C0.829609 9.86536 1.06423 9.54681 1.40503 9.49438C1.7462 9.44228 2.06573 9.67669 2.11792 10.0178C2.51809 12.6369 4.43147 14.9042 7.17163 15.636C10.8648 16.622 14.6534 14.4446 15.6384 10.7815C16.6232 7.11906 14.4355 3.34655 10.7429 2.3606C7.59049 1.51918 4.34097 3.01262 2.84937 5.74829H3.74976C4.09483 5.74829 4.37459 6.02825 4.37476 6.37329C4.37476 6.71847 4.09493 6.99829 3.74976 6.99829H1.87476C1.6695 6.9982 1.47674 6.89767 1.36011 6.72876C1.24358 6.55981 1.21805 6.34355 1.29077 6.15161ZM8.99976 5.37427C9.34493 5.37427 9.62476 5.65409 9.62476 5.99927V8.7395L10.9421 10.0569C11.1862 10.301 11.1862 10.6976 10.9421 10.9417C10.698 11.1853 10.3013 11.1855 10.0574 10.9417L8.55737 9.44165C8.44027 9.32455 8.37487 9.16487 8.37476 8.99927V5.99927C8.37476 5.65421 8.65474 5.37446 8.99976 5.37427Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-history-menu-item-manager':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M11.333 0.708008C12.4145 0.708008 13.2918 1.58559 13.292 2.66699V7.00098C13.2916 7.34567 13.0117 7.6258 12.667 7.62598C12.3221 7.62598 12.0424 7.34578 12.042 7.00098V2.66699C12.0418 2.27593 11.7241 1.95898 11.333 1.95898H3.33301C2.94211 1.95921 2.62518 2.27608 2.625 2.66699V13.334C2.62526 13.7249 2.9421 14.0418 3.33301 14.042H7C7.34507 14.042 7.62482 14.322 7.625 14.667C7.62474 15.0119 7.34502 15.292 7 15.292H3.33301C2.25177 15.2918 1.37526 14.4152 1.375 13.334V2.66699C1.37518 1.58572 2.25175 0.708234 3.33301 0.708008H11.333ZM11 8.04199C13.002 8.04199 14.625 9.66495 14.625 11.667C14.6247 13.6688 13.0019 15.292 11 15.292C8.99812 15.292 7.37526 13.6688 7.375 11.667C7.375 9.66495 8.99796 8.04199 11 8.04199ZM11 9.29199C9.68831 9.29199 8.625 10.3553 8.625 11.667C8.62526 12.9785 9.68847 14.042 11 14.042C12.3115 14.042 13.3747 12.9785 13.375 11.667C13.375 10.3553 12.3117 9.29199 11 9.29199ZM11 9.70898C11.3452 9.70898 11.625 9.98881 11.625 10.334V11.5303L12.2148 11.7471C12.5388 11.866 12.7057 12.2248 12.5869 12.5488C12.468 12.8724 12.1089 13.0393 11.7852 12.9209L10.7852 12.5537C10.5391 12.4635 10.3752 12.2288 10.375 11.9668V10.334C10.375 9.98881 10.6548 9.70898 11 9.70898ZM7.33398 6.70898C7.67879 6.70942 7.95898 6.98908 7.95898 7.33398C7.95855 7.67852 7.67852 7.95855 7.33398 7.95898H4.66699C4.32209 7.95898 4.04243 7.67879 4.04199 7.33398C4.04199 6.98881 4.32181 6.70898 4.66699 6.70898H7.33398ZM10 4.04199C10.345 4.04226 10.625 4.32198 10.625 4.66699C10.6247 5.01178 10.3448 5.29173 10 5.29199H4.66699C4.32198 5.29199 4.04226 5.01195 4.04199 4.66699C4.04199 4.32181 4.32181 4.04199 4.66699 4.04199H10Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-history-menu-item-entry':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M8.66699 0.708008C8.83258 0.708136 8.99228 0.774506 9.10938 0.891602L13.7754 5.55859C13.8923 5.67576 13.959 5.83545 13.959 6.00098V13.334C13.9587 14.4152 13.0812 15.2917 12 15.292H4C2.91876 15.2918 2.04128 14.4152 2.04102 13.334V2.66699C2.04119 1.58569 2.9187 0.708184 4 0.708008H8.66699ZM4 1.95898C3.60906 1.95916 3.29217 2.27605 3.29199 2.66699V13.334C3.29226 13.7249 3.6091 14.0418 4 14.042H12C12.3908 14.0417 12.7087 13.7248 12.709 13.334V6.62598H10C8.91873 6.6258 8.04226 5.74821 8.04199 4.66699V1.95898H4ZM10.667 10.709C11.0119 10.7092 11.292 10.989 11.292 11.334C11.2917 11.6788 11.0118 11.9587 10.667 11.959H5.33398C4.98897 11.959 4.70925 11.6789 4.70898 11.334C4.70898 10.9888 4.98881 10.709 5.33398 10.709H10.667ZM8.00098 8.04199C8.34578 8.04243 8.62598 8.32209 8.62598 8.66699C8.62571 9.01167 8.34562 9.29155 8.00098 9.29199H5.33398C4.98897 9.29199 4.70925 9.01195 4.70898 8.66699C4.70898 8.32181 4.98881 8.04199 5.33398 8.04199H8.00098ZM9.29199 4.66699C9.29226 5.05787 9.6091 5.3758 10 5.37598H11.8252L9.29199 2.84277V4.66699Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-bookmarks':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M13.125 1.25C14.2986 1.25 15.25 2.2014 15.25 3.375V16.125C15.25 16.3445 15.1345 16.5482 14.9463 16.6611C14.7582 16.7739 14.5246 16.7799 14.3311 16.6768L9 13.833L3.66895 16.6768C3.47538 16.7799 3.24183 16.7739 3.05371 16.6611C2.86546 16.5482 2.75 16.3445 2.75 16.125V3.375C2.75 2.20139 3.70139 1.25 4.875 1.25H13.125ZM4 6.25V15.083L8.70605 12.5732L8.77637 12.541C8.94414 12.4767 9.13318 12.4876 9.29395 12.5732L14 15.083V6.25H4ZM4.875 2.5C4.39175 2.5 4 2.89175 4 3.375V5H14V3.375C14 2.89174 13.6083 2.5 13.125 2.5H4.875Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-bookmarks-menu-item-bookmark':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M11.667 1.04102C12.7483 1.04119 13.6248 1.91871 13.625 3V14.334C13.6247 14.5532 13.5093 14.7563 13.3213 14.8691C13.1331 14.9819 12.8997 14.9879 12.7061 14.8848L8 12.375L3.29395 14.8848C3.10035 14.9879 2.86686 14.9819 2.67871 14.8691C2.49069 14.7563 2.37528 14.5532 2.375 14.334V3C2.37518 1.9187 3.25171 1.04119 4.33301 1.04102H11.667ZM3.625 5.625V13.292L7.70605 11.1152L7.77637 11.083C7.94414 11.0187 8.13318 11.0296 8.29395 11.1152L12.375 13.292V5.625H3.625ZM4.33301 2.29199C3.94206 2.29217 3.62518 2.60906 3.625 3V4.375H12.375V3C12.3748 2.60905 12.058 2.29217 11.667 2.29199H4.33301Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-bookmarks-menu-item-manage':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M10.667 3.04199C11.3802 3.04226 11.959 3.62079 11.959 4.33398V14.334C11.9587 14.5599 11.8359 14.7685 11.6387 14.8789C11.4412 14.9892 11.1986 14.9845 11.0059 14.8662L7 12.4004L2.99414 14.8662C2.80156 14.9845 2.55971 14.9889 2.3623 14.8789C2.16488 14.7686 2.04131 14.5601 2.04102 14.334V4.33398C2.04102 3.62062 2.62062 3.04199 3.33398 3.04199H10.667ZM3.33398 4.29199C3.31098 4.29199 3.29199 4.31098 3.29199 4.33398V13.2148L6.67285 11.1348L6.75 11.0938C6.9358 11.0127 7.15238 11.0266 7.32812 11.1348L10.709 13.2148V4.33398C10.709 4.31113 10.6898 4.29226 10.667 4.29199H3.33398ZM12.001 1.04102C13.0821 1.04145 13.9588 1.91887 13.959 3V12.334C13.9585 12.6786 13.6787 12.9587 13.334 12.959C12.9891 12.959 12.7094 12.6788 12.709 12.334V3C12.7088 2.60921 12.3917 2.29243 12.001 2.29199H5.33398C4.98897 2.29199 4.70925 2.01195 4.70898 1.66699C4.70898 1.32181 4.98881 1.04102 5.33398 1.04102H12.001Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-bookmarks-menu-item-entry':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M8.66699 0.708008C8.83258 0.708136 8.99228 0.774506 9.10938 0.891602L13.7754 5.55859C13.8923 5.67576 13.959 5.83545 13.959 6.00098V13.334C13.9587 14.4152 13.0812 15.2917 12 15.292H4C2.91876 15.2918 2.04128 14.4152 2.04102 13.334V2.66699C2.04119 1.58569 2.9187 0.708184 4 0.708008H8.66699ZM4 1.95898C3.60906 1.95916 3.29217 2.27605 3.29199 2.66699V13.334C3.29226 13.7249 3.6091 14.0418 4 14.042H12C12.3908 14.0417 12.7087 13.7248 12.709 13.334V6.62598H10C8.91873 6.6258 8.04226 5.74821 8.04199 4.66699V1.95898H4ZM10.667 10.709C11.0119 10.7092 11.292 10.989 11.292 11.334C11.2917 11.6788 11.0118 11.9587 10.667 11.959H5.33398C4.98897 11.959 4.70925 11.6789 4.70898 11.334C4.70898 10.9888 4.98881 10.709 5.33398 10.709H10.667ZM8.00098 8.04199C8.34578 8.04243 8.62598 8.32209 8.62598 8.66699C8.62571 9.01167 8.34562 9.29155 8.00098 9.29199H5.33398C4.98897 9.29199 4.70925 9.01195 4.70898 8.66699C4.70898 8.32181 4.98881 8.04199 5.33398 8.04199H8.00098ZM9.29199 4.66699C9.29226 5.05787 9.6091 5.3758 10 5.37598H11.8252L9.29199 2.84277V4.66699Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-viewstore':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M13.1252 10.25C14.4128 10.2501 15.5027 11.0532 16.2112 11.7383C16.5777 12.0927 16.8726 12.445 17.0754 12.708C17.1772 12.84 17.2567 12.9512 17.3118 13.0303C17.3393 13.0698 17.3612 13.1015 17.3762 13.124C17.3837 13.1353 17.3895 13.1448 17.3938 13.1514C17.3958 13.1545 17.3974 13.1572 17.3987 13.1592L17.4016 13.1621V13.1631L17.4446 13.2432C17.5182 13.4064 17.5182 13.5936 17.4446 13.7568L17.4016 13.8369V13.8379L17.3987 13.8408C17.3974 13.8428 17.3958 13.8455 17.3938 13.8486C17.3895 13.8552 17.3837 13.8647 17.3762 13.876C17.3612 13.8985 17.3393 13.9302 17.3118 13.9697C17.2567 14.0488 17.1772 14.16 17.0754 14.292C16.8726 14.555 16.5777 14.9073 16.2112 15.2617C15.5027 15.9468 14.4128 16.7499 13.1252 16.75C11.8377 16.75 10.7478 15.9468 10.0393 15.2617C9.67277 14.9073 9.37787 14.555 9.17505 14.292C9.07331 14.16 8.99378 14.0488 8.93872 13.9697C8.9112 13.9302 8.88931 13.8986 8.87427 13.876C8.86678 13.8647 8.86097 13.8552 8.85669 13.8486C8.85466 13.8455 8.85308 13.8428 8.85181 13.8408L8.84888 13.8379V13.8369C8.71756 13.6316 8.71756 13.3684 8.84888 13.1631V13.1621L8.85181 13.1592C8.85308 13.1572 8.85466 13.1545 8.85669 13.1514C8.86097 13.1448 8.86678 13.1353 8.87427 13.124C8.88931 13.1014 8.9112 13.0698 8.93872 13.0303C8.99378 12.9512 9.07331 12.84 9.17505 12.708C9.37787 12.445 9.67277 12.0927 10.0393 11.7383C10.7478 11.0532 11.8377 10.25 13.1252 10.25ZM13.4895 1.62598C14.167 1.6263 14.8044 1.95021 15.2043 2.49707L16.3938 4.12402L16.4016 4.13477C16.6833 4.53786 16.9644 5.04718 17.0754 5.58398C17.1902 6.13911 17.1281 6.77638 16.6418 7.29785C16.4574 7.49558 16.24 7.66243 16.0002 7.79492V9.5C16.0002 9.84509 15.7203 10.1249 15.3752 10.125C15.0301 10.125 14.7502 9.84518 14.7502 9.5V8.12402C14.7389 8.12417 14.7275 8.12597 14.7161 8.12598C13.9448 8.12598 13.2397 7.7949 12.76 7.26367C12.3017 7.7903 11.6281 8.12491 10.8752 8.125C10.1273 8.125 9.45839 7.79403 9.00024 7.27344C8.54215 7.79405 7.87318 8.12491 7.12524 8.125C6.3718 8.125 5.69785 7.7899 5.2395 7.2627C4.75991 7.79351 4.05523 8.12491 3.28442 8.125C3.27311 8.125 3.26153 8.12319 3.25024 8.12305V14.25C3.25024 14.7333 3.64199 15.125 4.12524 15.125H7.12524C7.4703 15.1251 7.75024 15.4049 7.75024 15.75C7.75024 16.0951 7.4703 16.3749 7.12524 16.375H4.12524C2.95164 16.375 2.00024 15.4236 2.00024 14.25V7.79492C1.75985 7.66235 1.54239 7.49493 1.35767 7.29688C0.871624 6.77552 0.81035 6.13803 0.925049 5.58301C1.03611 5.04612 1.31713 4.53592 1.59888 4.13281L1.60669 4.12207L2.79614 2.49512C3.19638 1.9481 3.83415 1.62492 4.51196 1.625L13.4895 1.62598ZM13.1252 11.5C12.342 11.5 11.5571 12.0095 10.9084 12.6367C10.5965 12.9383 10.342 13.2426 10.1653 13.4717C10.158 13.4812 10.1508 13.4908 10.1438 13.5C10.1508 13.5092 10.158 13.5188 10.1653 13.5283C10.342 13.7574 10.5965 14.0617 10.9084 14.3633C11.5571 14.9905 12.342 15.5 13.1252 15.5C13.9085 15.4999 14.6934 14.9905 15.342 14.3633C15.6539 14.0617 15.9085 13.7574 16.0852 13.5283C16.0924 13.519 16.0988 13.5091 16.1057 13.5C16.0988 13.4909 16.0924 13.481 16.0852 13.4717C15.9085 13.2426 15.6539 12.9383 15.342 12.6367C14.6934 12.0095 13.9085 11.5001 13.1252 11.5ZM13.1321 12.75C13.5461 12.7502 13.8821 13.0859 13.8821 13.5C13.8821 13.9141 13.5461 14.2498 13.1321 14.25H13.1252C12.711 14.25 12.3752 13.9142 12.3752 13.5C12.3752 13.0858 12.711 12.75 13.1252 12.75H13.1321ZM4.51196 2.875C4.23284 2.87497 3.96973 3.00816 3.80493 3.2334L2.62329 4.84961L2.45923 5.10254C2.30745 5.35653 2.19653 5.60938 2.14966 5.83594C2.091 6.1196 2.14004 6.30208 2.27271 6.44434C2.51598 6.70501 2.8757 6.87498 3.28442 6.875C4.05288 6.87485 4.62519 6.28772 4.62524 5.625C4.62524 5.27982 4.90507 5 5.25024 5C5.59528 5.00017 5.87524 5.27992 5.87524 5.625C5.8753 6.31531 6.43492 6.875 7.12524 6.875C7.81542 6.87483 8.37519 6.31521 8.37524 5.625C8.37524 5.27982 8.65507 5 9.00024 5C9.34528 5.00016 9.62524 5.27992 9.62524 5.625C9.6253 6.31531 10.1849 6.875 10.8752 6.875C11.5636 6.87484 12.1223 6.31761 12.1252 5.62988C12.1269 5.28593 12.4063 5.00781 12.7502 5.00781C13.0943 5.00808 13.374 5.28674 13.3752 5.63086C13.3777 6.29174 13.9492 6.87598 14.7161 6.87598C15.1248 6.87587 15.4845 6.70615 15.7278 6.44531C15.8603 6.30308 15.9095 6.12047 15.8508 5.83691C15.7883 5.53503 15.612 5.1865 15.3772 4.85059H15.3762L14.1956 3.23438C14.0308 3.00915 13.7675 2.87611 13.4885 2.87598L4.51196 2.875Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-ai':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M7.5 4.625C7.76153 4.625 7.99518 4.78793 8.08594 5.0332L8.47266 6.07812C8.99987 7.50269 9.20915 8.02939 9.58984 8.41016L9.74121 8.5459C10.1165 8.84802 10.6749 9.06619 11.9209 9.52734L12.9668 9.91406C13.2121 10.0048 13.375 10.2385 13.375 10.5C13.375 10.7615 13.2121 10.9952 12.9668 11.0859L11.9209 11.4727C10.6749 11.9338 10.1165 12.152 9.74121 12.4541L9.58984 12.5898C9.20918 12.9706 8.99979 13.4966 8.47266 14.9209L8.08594 15.9668C7.99518 16.2121 7.76153 16.375 7.5 16.375C7.23847 16.375 7.00482 16.2121 6.91406 15.9668L6.52734 14.9209C6.06625 13.6749 5.84804 13.1165 5.5459 12.7412L5.41016 12.5898C5.02946 12.2092 4.50349 11.9998 3.0791 11.4727L2.0332 11.0859C1.78792 10.9952 1.625 10.7615 1.625 10.5C1.625 10.2385 1.78792 10.0048 2.0332 9.91406L3.0791 9.52734C4.50349 9.00021 5.02946 8.79082 5.41016 8.41016L5.5459 8.25879C5.84804 7.88355 6.06626 7.32515 6.52734 6.0791L6.91406 5.0332L6.9541 4.94531C7.06321 4.7497 7.27107 4.625 7.5 4.625ZM7.5 7.04492C7.11897 8.06444 6.82543 8.76243 6.29395 9.29395C5.76246 9.82539 5.06446 10.1189 4.04492 10.5C5.06446 10.8811 5.76246 11.1746 6.29395 11.7061C6.82528 12.2374 7.11912 12.9351 7.5 13.9541C7.88092 12.9351 8.17477 12.2374 8.70605 11.7061C9.23742 11.1748 9.93506 10.8809 10.9541 10.5C9.93506 10.1191 9.23742 9.82523 8.70605 9.29395C8.17462 8.76243 7.88107 8.06444 7.5 7.04492ZM13.5 1.625C13.7615 1.625 13.9952 1.78794 14.0859 2.0332L14.252 2.48145C14.4892 3.12252 14.5535 3.25665 14.6484 3.35156C14.7433 3.44648 14.8775 3.51084 15.5186 3.74805L15.9668 3.91406C16.2121 4.00482 16.375 4.23847 16.375 4.5C16.375 4.76153 16.2121 4.99518 15.9668 5.08594L15.5186 5.25195C14.8775 5.48916 14.7433 5.55352 14.6484 5.64844C14.5535 5.74336 14.4892 5.87749 14.252 6.51855L14.0859 6.9668C13.9952 7.21206 13.7615 7.375 13.5 7.375C13.2385 7.375 13.0048 7.21206 12.9141 6.9668L12.748 6.51855C12.5108 5.87748 12.4465 5.74335 12.3516 5.64844C12.2567 5.55352 12.1225 5.48916 11.4814 5.25195L11.0332 5.08594C10.7879 4.99518 10.625 4.76153 10.625 4.5C10.625 4.23847 10.7879 4.00482 11.0332 3.91406L11.4814 3.74805C12.1225 3.51084 12.2567 3.44648 12.3516 3.35156C12.4465 3.25665 12.5108 3.12252 12.748 2.48145L12.9141 2.0332L12.9541 1.94531C13.0632 1.7497 13.2711 1.625 13.5 1.625ZM13.5 3.88965C13.4243 4.01546 13.3392 4.13151 13.2354 4.23535C13.1315 4.3392 13.0155 4.42431 12.8896 4.5C13.0155 4.57569 13.1315 4.6608 13.2354 4.76465C13.339 4.86829 13.4244 4.98384 13.5 5.10938C13.5756 4.98384 13.661 4.86829 13.7646 4.76465C13.8683 4.661 13.9838 4.57559 14.1094 4.5C13.9838 4.42441 13.8683 4.339 13.7646 4.23535C13.6608 4.13151 13.5757 4.01546 13.5 3.88965Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-menubutton-dropdown':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M11.4697 5.46973C11.7626 5.17684 12.2374 5.17684 12.5303 5.46973C12.823 5.76263 12.8231 6.23742 12.5303 6.53027L8.53027 10.5303C8.23742 10.8231 7.76263 10.823 7.46973 10.5303L3.46973 6.53027C3.17685 6.23738 3.17684 5.76262 3.46973 5.46973C3.76262 5.17686 4.23739 5.17686 4.53027 5.46973L8 8.93945L11.4697 5.46973Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-user-menu-item-updatesavailable':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M8 0.916016C10.9915 0.916016 13.417 3.34244 13.417 6.33398V8.68848L14.1846 9.45703C14.5461 9.81878 14.75 10.3097 14.75 10.8213C14.7496 11.8864 13.8856 12.75 12.8203 12.75H10.9922C10.6571 14.0904 9.44421 15.083 8 15.083C6.55594 15.0829 5.34375 14.0902 5.00879 12.75H3.17969C2.11441 12.75 1.25039 11.8864 1.25 10.8213C1.25 10.3097 1.45385 9.81882 1.81543 9.45703L2.58301 8.68848V6.33398C2.58301 3.34244 5.00846 0.916016 8 0.916016ZM6.60645 12.75C6.87381 13.2457 7.39722 13.5829 8 13.583C8.60295 13.583 9.12693 13.2458 9.39453 12.75H6.60645ZM8 2.41699C5.83689 2.41699 4.08301 4.17087 4.08301 6.33398V8.99902C4.08288 9.19776 4.00382 9.38876 3.86328 9.5293L2.87598 10.5176C2.79555 10.5981 2.75 10.7076 2.75 10.8213C2.75039 11.058 2.94288 11.25 3.17969 11.25H12.8203C13.0571 11.25 13.2496 11.058 13.25 10.8213C13.25 10.7077 13.2045 10.5982 13.124 10.5176L12.1367 9.5293C11.9962 9.38876 11.9171 9.19776 11.917 8.99902V6.33398C11.917 4.17086 10.1631 2.41699 8 2.41699Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-user-menu-item-profile':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M11.8662 8.92285C12.2174 8.63628 12.7248 8.63659 13.0762 8.92285L13.1494 8.98828L14.0107 9.85059C14.385 10.2248 14.3852 10.8318 14.0107 11.2061L11.1084 14.1084C11.0212 14.1955 10.9099 14.2551 10.7891 14.2793L9.12305 14.6123C8.91825 14.6531 8.70529 14.5891 8.55762 14.4414C8.41025 14.2937 8.34579 14.0816 8.38672 13.877L8.7207 12.21C8.74495 12.0892 8.80456 11.9777 8.8916 11.8906L11.7939 8.98828L11.8662 8.92285ZM7 1.375C9.186 1.375 10.9588 3.14703 10.959 5.33301C10.959 6.66642 10.2987 7.8451 9.28809 8.5625C9.40963 8.6209 9.52932 8.68281 9.64551 8.75C9.94413 8.9229 10.0468 9.30578 9.87402 9.60449C9.70112 9.90274 9.31906 10.0044 9.02051 9.83203C8.42676 9.48856 7.73707 9.29205 7 9.29199C4.76785 9.29199 2.95801 11.1018 2.95801 13.334C2.95757 13.6788 2.67791 13.959 2.33301 13.959C1.9881 13.959 1.70845 13.6788 1.70801 13.334C1.70801 11.2313 2.93439 9.41419 4.71094 8.56055C3.7016 7.84301 3.04199 6.66557 3.04199 5.33301C3.04217 3.14714 4.81413 1.37518 7 1.375ZM9.90918 12.6406L9.79688 13.2021L10.3584 13.0898L12.9209 10.5273L12.4707 10.0781L9.90918 12.6406ZM7 2.625C5.50449 2.62518 4.29217 3.8375 4.29199 5.33301C4.29199 6.82866 5.50438 8.04182 7 8.04199C8.49576 8.04199 9.70898 6.82876 9.70898 5.33301C9.70881 3.83739 8.49565 2.625 7 2.625Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-user-menu-item-about':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M8 0.708984C12.0269 0.709161 15.291 3.97401 15.291 8.00098C15.2906 12.0276 12.0267 15.2918 8 15.292C3.9732 15.292 0.708448 12.0277 0.708008 8.00098C0.708008 3.9739 3.97292 0.708984 8 0.708984ZM8 1.95898C4.66328 1.95898 1.95801 4.66426 1.95801 8.00098C1.95845 11.3373 4.66355 14.042 8 14.042C11.3363 14.0418 14.0406 11.3372 14.041 8.00098C14.041 4.66437 11.3366 1.95916 8 1.95898ZM8 7.04199C8.34518 7.04199 8.625 7.32181 8.625 7.66699V10.667C8.62474 11.0119 8.34502 11.292 8 11.292C7.65498 11.292 7.37526 11.0119 7.375 10.667V7.66699C7.375 7.32181 7.65482 7.04199 8 7.04199ZM8 4.58496C8.41421 4.58496 8.75 4.92075 8.75 5.33496V5.3418C8.74964 5.75571 8.41399 6.0918 8 6.0918C7.58601 6.0918 7.25036 5.75571 7.25 5.3418V5.33496C7.25 4.92075 7.58579 4.58496 8 4.58496Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-user-menu-item-logout':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M1.04199 4.00098C1.04199 2.3524 2.54418 1.11153 4.16309 1.42285L8.8291 2.32031C10.0651 2.558 10.959 3.63984 10.959 4.89844V5.24609C10.9589 5.5911 10.679 5.87092 10.334 5.87109C9.98885 5.87109 9.70906 5.59121 9.70898 5.24609V4.89844C9.70898 4.23932 9.24097 3.67253 8.59375 3.54785L3.92676 2.65039C3.07875 2.48731 2.29199 3.13744 2.29199 4.00098V12C2.29205 12.8635 3.07879 13.5136 3.92676 13.3506L8.59375 12.4531C9.24097 12.3285 9.70895 11.7617 9.70898 11.1025V10.7549C9.70898 10.4097 9.98881 10.1299 10.334 10.1299C10.679 10.1301 10.959 10.4098 10.959 10.7549V11.1025C10.9589 12.3611 10.0651 13.443 8.8291 13.6807L4.16309 14.5781C2.54423 14.8894 1.04205 13.6485 1.04199 12V4.00098ZM11.8916 5.55762C12.1356 5.31381 12.5313 5.31392 12.7754 5.55762L14.7754 7.55762C14.8926 7.67482 14.959 7.83426 14.959 8C14.959 8.16572 14.8926 8.3252 14.7754 8.44238L12.7754 10.4424C12.5314 10.686 12.1356 10.6861 11.8916 10.4424C11.6475 10.1983 11.6476 9.8017 11.8916 9.55762L12.8242 8.625H5.66699C5.32185 8.625 5.04205 8.34513 5.04199 8C5.04199 7.65482 5.32181 7.375 5.66699 7.375H12.8242L11.8916 6.44238C11.6475 6.19832 11.6476 5.8017 11.8916 5.55762Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-search':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M7.33301 1.375C10.6236 1.375 13.2918 4.04246 13.292 7.33301C13.292 8.75294 12.7931 10.0553 11.9639 11.0791L14.4414 13.5576C14.6855 13.8017 14.6855 14.1973 14.4414 14.4414C14.1973 14.6855 13.8017 14.6855 13.5576 14.4414L11.0791 11.9639C10.0553 12.7931 8.75294 13.292 7.33301 13.292C4.04246 13.2918 1.375 10.6236 1.375 7.33301C1.37518 4.04257 4.04257 1.37518 7.33301 1.375ZM7.33301 2.625C4.73292 2.62518 2.62518 4.73292 2.625 7.33301C2.625 9.93325 4.73281 12.0418 7.33301 12.042C9.93336 12.042 12.042 9.93336 12.042 7.33301C12.0418 4.73281 9.93325 2.625 7.33301 2.625Z" />
			</svg>`;
		}
		case 'mm-screen-top-navigation-tag-remove':
		{
			return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M19.4697 11.4697C19.7626 11.1769 20.2374 11.1768 20.5303 11.4697C20.823 11.7626 20.8231 12.2374 20.5303 12.5303L17.0605 16L20.5303 19.4697C20.8227 19.7626 20.8227 20.2375 20.5303 20.5303C20.2374 20.8231 19.7617 20.823 19.4688 20.5303L15.999 17.0605L12.5312 20.5303C12.2384 20.8231 11.7626 20.823 11.4697 20.5303C11.1769 20.2374 11.1769 19.7616 11.4697 19.4688L14.9385 16L11.4697 12.5312C11.1769 12.2384 11.177 11.7636 11.4697 11.4707C11.7626 11.1778 12.2374 11.1778 12.5303 11.4707L15.999 14.9395L19.4697 11.4697Z" />
			</svg>`;
		}
		case 'mm-screen-header-secondary-control-previous':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M10.5302 11.4697C10.823 11.7626 10.823 12.2374 10.5302 12.5303C10.2373 12.8231 9.76247 12.8231 9.4696 12.5303L5.4696 8.53027C5.17675 8.23741 5.1768 7.76262 5.4696 7.46973L9.4696 3.46973C9.7625 3.17685 10.2373 3.17684 10.5302 3.46973C10.823 3.76262 10.823 4.2374 10.5302 4.53027L7.06042 8L10.5302 11.4697Z" />
			</svg>`;
		}
		case 'mm-screen-header-secondary-control-next':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M5.46985 4.53027C5.17701 4.23738 5.17698 3.7626 5.46985 3.46973C5.76273 3.17693 6.23753 3.17691 6.5304 3.46973L10.5304 7.46973C10.8232 7.76259 10.8232 8.23738 10.5304 8.53027L6.5304 12.5303C6.2375 12.8231 5.76274 12.8232 5.46985 12.5303C5.17703 12.2374 5.17699 11.7626 5.46985 11.4697L8.93958 8L5.46985 4.53027Z" />
			</svg>`;
		}
		case 'mm-screen-header-breadcrumb-separator':
		{
			return `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M4.14648 2.64644C4.34174 2.45118 4.65825 2.45119 4.85351 2.64644L7.85351 5.64644C8.04877 5.8417 8.04877 6.15821 7.85351 6.35347L4.85351 9.35347C4.65825 9.54873 4.34174 9.54873 4.14648 9.35347C3.95121 9.15821 3.95121 8.8417 4.14648 8.64644L6.79296 5.99996L4.14648 3.35347C3.95123 3.15821 3.95123 2.8417 4.14648 2.64644Z" />
			</svg>`;
		}
		case 'mm-screen-tertiary-button-icon':
		{
			return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M6.00879 10.5C6.8371 10.5001 7.50879 11.1717 7.50879 12C7.50879 12.8283 6.8371 13.4999 6.00879 13.5H6C5.17157 13.5 4.5 12.8284 4.5 12C4.5 11.1716 5.17157 10.5 6 10.5H6.00879ZM12.001 10.5C12.8294 10.5 13.501 11.1716 13.501 12C13.501 12.8284 12.8294 13.5 12.001 13.5H11.9922C11.1638 13.5 10.4922 12.8284 10.4922 12C10.4922 11.1716 11.1638 10.5 11.9922 10.5H12.001ZM18.001 10.5C18.8293 10.5001 19.501 11.1717 19.501 12C19.501 12.8283 18.8293 13.4999 18.001 13.5H17.9922C17.1638 13.5 16.4922 12.8284 16.4922 12C16.4922 11.1716 17.1638 10.5 17.9922 10.5H18.001Z" />
			</svg>`;
		}
		case 'mm-universalsearch-search':
		{
			return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M9.16699 1.75C13.263 1.75018 16.583 5.07099 16.583 9.16699C16.5829 10.9445 15.9567 12.5752 14.9141 13.8525L18.0303 16.9688C18.323 17.2615 18.3228 17.7364 18.0303 18.0293C17.7374 18.3222 17.2626 18.3222 16.9697 18.0293L13.8535 14.9131C12.576 15.9563 10.945 16.5829 9.16699 16.583C5.07099 16.583 1.75018 13.263 1.75 9.16699C1.75 5.07088 5.07088 1.75 9.16699 1.75ZM9.16699 3.25C5.89931 3.25 3.25 5.89931 3.25 9.16699C3.25018 12.4345 5.89941 15.083 9.16699 15.083C12.4344 15.0828 15.0828 12.4344 15.083 9.16699C15.083 5.89941 12.4345 3.25018 9.16699 3.25Z" />
			</svg>`;
		}
		case 'mm-universalsearch-top-button-icon-settings':
		{
			return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M10.0088 14.5C10.8372 14.5 11.5088 15.1716 11.5088 16C11.5088 16.8284 10.8372 17.5 10.0088 17.5H10C9.17157 17.5 8.5 16.8284 8.5 16C8.5 15.1716 9.17157 14.5 10 14.5H10.0088ZM16.001 14.5C16.8294 14.5 17.501 15.1716 17.501 16C17.501 16.8284 16.8294 17.5 16.001 17.5H15.9922C15.1638 17.5 14.4922 16.8284 14.4922 16C14.4922 15.1716 15.1638 14.5 15.9922 14.5H16.001ZM22.001 14.5C22.8294 14.5 23.501 15.1716 23.501 16C23.501 16.8284 22.8294 17.5 22.001 17.5H21.9922C21.1638 17.5 20.4922 16.8284 20.4922 16C20.4922 15.1716 21.1638 14.5 21.9922 14.5H22.001Z" />
			</svg>`;
		}
		case 'mm-universalsearch-empty-list':
		{
			return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M12.5 6.33398C15.2152 6.33416 17.416 8.53571 17.416 11.251C17.4158 12.3377 17.062 13.3415 16.4648 14.1553L18.4463 16.1367C18.7391 16.4296 18.7392 16.9044 18.4463 17.1973C18.1534 17.4897 17.6785 17.4899 17.3857 17.1973L15.4043 15.2158C14.5904 15.8129 13.5867 16.1669 12.5 16.167C9.78503 16.1668 7.58345 13.9659 7.58301 11.251C7.58301 8.5357 9.78476 6.33415 12.5 6.33398ZM12.5 7.83398C10.6132 7.83415 9.08301 9.36413 9.08301 11.251C9.08345 13.1375 10.6135 14.6668 12.5 14.667C14.3865 14.6668 15.9156 13.1374 15.916 11.251C15.916 9.36413 14.3868 7.83416 12.5 7.83398ZM5.41602 10.917C5.83023 10.917 6.16602 11.2528 6.16602 11.667C6.16575 12.081 5.83007 12.417 5.41602 12.417H2.08301C1.6691 12.4168 1.33327 12.0809 1.33301 11.667C1.33301 11.2529 1.66893 10.9172 2.08301 10.917H5.41602ZM5.41602 6.75C5.83023 6.75 6.16602 7.08579 6.16602 7.5C6.16602 7.91421 5.83023 8.25 5.41602 8.25H2.08301C1.66893 8.24984 1.33301 7.91411 1.33301 7.5C1.33301 7.08589 1.66893 6.75016 2.08301 6.75H5.41602ZM15.416 2.58301C15.8302 2.58301 16.166 2.91977 16.166 3.33398C16.1658 3.74797 15.8301 4.08398 15.416 4.08398H2.08301C1.6691 4.08382 1.33327 3.74787 1.33301 3.33398C1.33301 2.91987 1.66893 2.58317 2.08301 2.58301H15.416Z" />
			</svg>`;
		}
		case 'mm-ai-insights-submit':
		{
			return `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M11.4015 6.5895C11.3406 6.65068 11.2681 6.69923 11.1883 6.73235C11.1086 6.76547 11.0231 6.78252 10.9367 6.78252C10.8503 6.78252 10.7648 6.76547 10.685 6.73235C10.6053 6.69923 10.5328 6.65068 10.4718 6.5895L7.65598 3.77364V11.8127C7.65598 11.9868 7.58684 12.1537 7.46377 12.2767C7.3407 12.3998 7.17378 12.469 6.99973 12.469C6.82568 12.469 6.65876 12.3998 6.53569 12.2767C6.41262 12.1537 6.34348 11.9868 6.34348 11.8127V3.77364L3.52653 6.5895C3.40324 6.71279 3.23604 6.78205 3.06169 6.78205C2.88734 6.78205 2.72013 6.71279 2.59684 6.5895C2.47356 6.46622 2.4043 6.29901 2.4043 6.12466C2.4043 5.95031 2.47356 5.7831 2.59684 5.65981L6.53434 1.72231C6.59531 1.66113 6.66775 1.61259 6.74752 1.57947C6.82729 1.54635 6.91281 1.5293 6.99919 1.5293C7.08556 1.5293 7.17108 1.54635 7.25085 1.57947C7.33062 1.61259 7.40306 1.66113 7.46403 1.72231L11.4015 5.65981C11.4627 5.72078 11.5113 5.79323 11.5444 5.873C11.5775 5.95277 11.5945 6.03829 11.5945 6.12466C11.5945 6.21103 11.5775 6.29655 11.5444 6.37632C11.5113 6.45609 11.4627 6.52853 11.4015 6.5895Z" />
			</svg>`;
		}
		case 'mm-ai-insights-new':
		{
			return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M15.0312 9.84473C15.4454 9.84475 15.7812 10.1805 15.7812 10.5947C15.7812 11.0089 15.4454 11.3447 15.0312 11.3447H10.9062C10.492 11.3447 10.1562 11.6805 10.1562 12.0947V21.0947L10.1602 21.1719C10.1988 21.5498 10.5181 21.8447 10.9062 21.8447H19.9062C20.3204 21.8447 20.6562 21.5089 20.6562 21.0947V16.9697C20.6563 16.5555 20.992 16.2197 21.4062 16.2197C21.8204 16.2197 22.1562 16.5555 22.1562 16.9697V21.0947C22.1562 22.3373 21.1489 23.3447 19.9062 23.3447H10.9062C9.74146 23.3447 8.78344 22.4595 8.66797 21.3252L8.65625 21.0947V12.0947C8.65625 10.8521 9.66361 9.84473 10.9062 9.84473H15.0312ZM19.5957 9.09473C20.1815 8.50895 21.131 8.50893 21.7168 9.09473L22.9062 10.2842C23.4918 10.87 23.4919 11.8196 22.9062 12.4053L16.9805 18.3311C16.6922 18.6191 16.331 18.8239 15.9355 18.9229L13.3379 19.5723C13.0825 19.636 12.8122 19.5611 12.626 19.375C12.4398 19.1888 12.3651 18.9185 12.4287 18.6631L13.0781 16.0654C13.177 15.6701 13.3817 15.3088 13.6699 15.0205L19.5957 9.09473ZM14.7305 16.0811C14.6344 16.1771 14.5662 16.2979 14.5332 16.4297L14.1865 17.8135L15.5713 17.4678L15.668 17.4365C15.7619 17.399 15.8478 17.3426 15.9199 17.2705L19.9707 13.2197L18.7812 12.0303L14.7305 16.0811ZM19.8418 10.9697L21.0312 12.1592L21.8457 11.3447L20.6562 10.1553L19.8418 10.9697Z" />
			</svg>`;
		}
		case 'mm-ai-insights-expand':
		{
			return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M14.1367 16.8027C14.4296 16.5102 14.9045 16.5101 15.1973 16.8027C15.4899 17.0955 15.4898 17.5704 15.1973 17.8633L11.8105 21.25H13.333C13.7471 21.25 14.0828 21.5859 14.083 22C14.0827 22.414 13.7471 22.75 13.333 22.75H10C9.95465 22.75 9.91032 22.745 9.86719 22.7373C9.86165 22.7363 9.8561 22.7355 9.85059 22.7344C9.8426 22.7328 9.83504 22.7294 9.82715 22.7275C9.69637 22.6966 9.57173 22.6322 9.46973 22.5303C9.41634 22.4769 9.3757 22.4159 9.3418 22.3525C9.3301 22.3308 9.31618 22.3101 9.30664 22.2871C9.28551 22.236 9.27104 22.1828 9.26172 22.1289C9.25442 22.087 9.25003 22.044 9.25 22V18.667C9.25 18.2528 9.58579 17.917 10 17.917C10.4142 17.917 10.75 18.2528 10.75 18.667V20.1895L14.1367 16.8027ZM22.0029 9.25C22.0456 9.25022 22.0873 9.25467 22.1279 9.26172C22.2756 9.28695 22.4173 9.35577 22.5312 9.46973C22.6516 9.59014 22.7198 9.74179 22.7412 9.89844C22.7438 9.91744 22.745 9.93663 22.7461 9.95605C22.7474 9.97759 22.7496 9.99894 22.749 10.0205V13.333C22.749 13.7472 22.4132 14.083 21.999 14.083C21.585 14.0828 21.249 13.7471 21.249 13.333V11.8125L17.8643 15.1973C17.5714 15.4899 17.0966 15.4899 16.8037 15.1973C16.5109 14.9044 16.511 14.4296 16.8037 14.1367L20.1904 10.75H18.666C18.2518 10.75 17.916 10.4142 17.916 10C17.916 9.58579 18.2518 9.25 18.666 9.25H22.0029Z" />
			</svg>`;
		}
		case 'mm-ai-insights-collapse':
		{
			return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M14.7959 16.5955C14.8014 16.5964 14.807 16.5973 14.8125 16.5984C14.8251 16.6009 14.8372 16.606 14.8496 16.6091C14.8838 16.6178 14.9182 16.6268 14.9512 16.6404C14.9747 16.6501 14.9963 16.6636 15.0186 16.6755C15.0813 16.7093 15.1423 16.7495 15.1953 16.8025C15.249 16.8562 15.2892 16.9184 15.3232 16.9822C15.3343 17.0029 15.3473 17.0228 15.3564 17.0447C15.3776 17.0956 15.3929 17.1483 15.4023 17.2019C15.4099 17.2447 15.415 17.2887 15.415 17.3337V20.6667C15.415 21.0808 15.079 21.4165 14.665 21.4167C14.2508 21.4167 13.9151 21.0809 13.915 20.6667V19.1433L10.5283 22.53C10.2354 22.8227 9.76062 22.8228 9.46777 22.53C9.17518 22.2372 9.17512 21.7623 9.46777 21.4695L12.8535 18.0837H11.332C10.9179 18.0837 10.5822 17.7478 10.582 17.3337C10.5821 16.9196 10.9178 16.5837 11.332 16.5837H14.665C14.7096 16.5838 14.7534 16.588 14.7959 16.5955ZM21.4688 9.46948C21.7616 9.17692 22.2365 9.17684 22.5293 9.46948C22.8219 9.7623 22.8219 10.2372 22.5293 10.53L19.1426 13.9167H20.667C21.081 13.917 21.417 14.2527 21.417 14.6667C21.4169 15.0808 21.081 15.4165 20.667 15.4167H17.334L17.332 15.4158H17.3291C17.2865 15.4155 17.2448 15.4111 17.2041 15.4041C17.0569 15.3787 16.9155 15.3106 16.8018 15.197C16.6824 15.0776 16.6138 14.9275 16.5918 14.7722C16.5889 14.752 16.5871 14.7314 16.5859 14.7107C16.5847 14.6892 16.5834 14.6678 16.584 14.6462V11.3337C16.584 10.9195 16.9198 10.5837 17.334 10.5837C17.7478 10.5842 18.084 10.9198 18.084 11.3337V12.8542L21.4688 9.46948Z" />
			</svg>`;
		}
		case 'mm-ai-insights-close':
		{
			return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M19.4698 11.4697C19.7627 11.1768 20.2375 11.1768 20.5304 11.4697C20.8232 11.7626 20.8232 12.2374 20.5304 12.5303L17.0606 16L20.5304 19.4697C20.8228 19.7626 20.8229 20.2375 20.5304 20.5303C20.2375 20.8231 19.7617 20.8231 19.4688 20.5303L15.9991 17.0605L12.5313 20.5303C12.2385 20.8231 11.7627 20.823 11.4698 20.5303C11.1769 20.2374 11.177 19.7616 11.4698 19.4688L14.9386 16L11.4698 12.5312C11.177 12.2384 11.1771 11.7636 11.4698 11.4707C11.7627 11.1778 12.2375 11.1778 12.5304 11.4707L15.9991 14.9395L19.4698 11.4697Z" />
			</svg>`;
		}
		case 'mm-ai-insights-conversation-menubutton-dropdown':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M11.4697 5.46973C11.7626 5.17684 12.2374 5.17684 12.5303 5.46973C12.823 5.76263 12.8231 6.23742 12.5303 6.53027L8.53027 10.5303C8.23742 10.8231 7.76263 10.823 7.46973 10.5303L3.46973 6.53027C3.17685 6.23738 3.17684 5.76262 3.46973 5.46973C3.76262 5.17686 4.23739 5.17686 4.53027 5.46973L8 8.93945L11.4697 5.46973Z" />
			</svg>`;
		}
		case 'mm-ai-insights-conversation-menu-item-icon':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M8 1.04199C11.8428 1.04212 14.9588 4.15725 14.959 8C14.9589 11.8428 11.8428 14.9589 8 14.959C6.82338 14.9589 5.71325 14.6653 4.74023 14.1484C3.59436 13.6553 2.4723 13.8903 1.72168 13.9561C1.48892 13.9764 1.26369 13.8653 1.13867 13.668C1.01376 13.4704 1.00972 13.2192 1.12793 13.0176C1.24003 12.8265 1.40555 12.388 1.48926 11.8359C1.57203 11.2896 1.56389 10.7009 1.39648 10.1973C1.16659 9.50592 1.04202 8.76658 1.04199 8C1.04217 4.15727 4.15727 1.04217 8 1.04199ZM8 2.29199C4.84763 2.29217 2.29217 4.84763 2.29199 8C2.29202 8.63075 2.39396 9.23706 2.58203 9.80273C2.8316 10.5534 2.82572 11.3549 2.72461 12.0225C2.69385 12.2255 2.65214 12.4229 2.60449 12.6094C3.3321 12.562 4.29522 12.5917 5.24902 13.0059C5.26507 13.0128 5.28148 13.021 5.29688 13.0293C6.10079 13.4624 7.02091 13.7089 8 13.709C11.1524 13.7089 13.7089 11.1524 13.709 8C13.7088 4.8476 11.1524 2.29212 8 2.29199ZM5.3457 7.2002C5.78731 7.20046 6.14551 7.55833 6.14551 8C6.14551 8.44167 5.78731 8.79954 5.3457 8.7998H5.33984C4.89802 8.7998 4.54004 8.44183 4.54004 8C4.54004 7.55817 4.89802 7.2002 5.33984 7.2002H5.3457ZM8.00977 7.2002C8.45125 7.2006 8.80957 7.55842 8.80957 8C8.80957 8.44158 8.45125 8.7994 8.00977 8.7998H8.00391C7.56208 8.7998 7.20312 8.44183 7.20312 8C7.20312 7.55817 7.56208 7.2002 8.00391 7.2002H8.00977ZM10.6729 7.2002C11.1145 7.20046 11.4736 7.55833 11.4736 8C11.4736 8.44167 11.1145 8.79954 10.6729 8.7998H10.667C10.2252 8.7997 9.86719 8.44177 9.86719 8C9.86719 7.55823 10.2252 7.2003 10.667 7.2002H10.6729Z" />
			</svg>`;
		}
		case 'mm-ai-insights-feedback-positive-icon':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M8.55469 1.94751C9.09113 1.56857 9.8466 1.64379 10.292 2.14771L10.291 2.14868C10.349 2.21441 10.4053 2.29582 10.4512 2.36255C10.5371 2.48746 10.5947 2.57064 10.6455 2.65454L10.7236 2.79126C11.0726 3.43743 11.1873 4.18124 11.0479 4.90063L11.0146 5.05396C10.9912 5.14924 10.9606 5.24514 10.916 5.38892L10.7393 5.96216C10.6629 6.20879 10.6186 6.35239 10.5967 6.45728C10.5938 6.47102 10.5924 6.48286 10.5908 6.49243C10.6046 6.49474 10.6243 6.49979 10.6514 6.5022C10.7645 6.51226 10.9221 6.51294 11.1865 6.51294H11.4561C12.294 6.51294 12.9861 6.51124 13.5156 6.5813C13.9831 6.64323 14.4365 6.77319 14.7793 7.10181L14.9189 7.25513L15.0156 7.38794C15.0458 7.43325 15.0743 7.47988 15.1006 7.52759C15.3778 8.0315 15.3141 8.56822 15.1582 9.07837C15.0045 9.58135 14.7157 10.1995 14.3701 10.9436C14.0507 11.6315 13.7916 12.19 13.5342 12.6243C13.3027 13.0147 13.0526 13.3394 12.7236 13.5989L12.5781 13.7063L12.3564 13.845C11.9342 14.087 11.4817 14.1932 10.96 14.2434C10.4507 14.2924 9.82505 14.2913 9.05078 14.2913H8.70996C7.77441 14.2913 7.0113 14.2932 6.41113 14.2151C5.79506 14.1348 5.25635 13.9607 4.82422 13.5422C4.76615 13.486 4.71254 13.4275 4.66309 13.3674C4.18171 13.9321 3.46705 14.2921 2.66699 14.2922C1.58569 14.2921 0.708174 13.4146 0.708008 12.3333V8.33325C0.708184 7.25193 1.5857 6.37542 2.66699 6.37524C3.27379 6.37535 3.83087 6.58312 4.27539 6.92896C4.50369 6.37348 4.92604 5.9181 5.53711 5.24146L8.26465 2.22095C8.31941 2.16029 8.38516 2.08593 8.45117 2.02856L8.55469 1.94751ZM2.66699 7.62524C2.27604 7.62542 1.95916 7.94229 1.95898 8.33325V12.3333C1.95915 12.7242 2.27604 13.0421 2.66699 13.0422C3.42595 13.042 4.04165 12.4262 4.04199 11.6672V9.00024C4.04199 8.24099 3.42616 7.62551 2.66699 7.62524ZM9.29004 2.96118L9.27148 2.97192C9.26967 2.97381 9.26762 2.97658 9.26465 2.97974C9.24906 2.99633 9.22799 3.01941 9.19238 3.05884L6.46484 6.07935C5.77384 6.84451 5.54278 7.11454 5.42188 7.42603C5.30171 7.73591 5.29199 8.08261 5.29199 9.09985V9.74927C5.29199 10.6908 5.29369 11.3323 5.36035 11.8127C5.42424 12.273 5.53722 12.4916 5.69434 12.6438C5.85417 12.7986 6.08805 12.9117 6.57227 12.9749C7.07292 13.04 7.74018 13.0413 8.70996 13.0413H9.05078C9.84909 13.0413 10.4051 13.0412 10.8408 12.9993C11.2637 12.9585 11.523 12.8817 11.7354 12.76C11.7822 12.7332 11.8284 12.7045 11.873 12.6741C12.0725 12.5379 12.2482 12.3421 12.459 11.9866C12.677 11.6188 12.9064 11.1276 13.2363 10.4172C13.5982 9.63812 13.8406 9.11328 13.9629 8.71313C14.0531 8.41794 14.0511 8.27187 14.0303 8.19165L14.0059 8.13013C13.9874 8.09672 13.9655 8.06459 13.9414 8.03442C13.8904 7.97071 13.774 7.87653 13.3516 7.82056C12.9235 7.76393 12.3304 7.76294 11.4561 7.76294H11.1865C10.9452 7.76294 10.7217 7.76348 10.54 7.74731C10.3551 7.73081 10.1337 7.69176 9.92676 7.56177C9.66638 7.39804 9.47063 7.14546 9.38086 6.8479C9.30872 6.6083 9.33534 6.38195 9.37305 6.20142C9.40988 6.02514 9.47591 5.81591 9.54492 5.59302L9.72266 5.0188C9.7714 4.86154 9.78825 4.80609 9.80078 4.75513C9.90663 4.32401 9.8588 3.87193 9.66699 3.47095L9.57617 3.302C9.54842 3.25624 9.5149 3.20816 9.4209 3.07153C9.3909 3.02792 9.37353 3.00202 9.36035 2.98364C9.34742 2.96562 9.34798 2.96737 9.35547 2.97583H9.35449C9.34766 2.96809 9.33504 2.95961 9.31543 2.95825C9.30598 2.95771 9.29718 2.9589 9.29004 2.96118Z" />
			</svg>`;
		}
		case 'mm-ai-insights-feedback-positive-active-icon':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M8.53223 2.12329C9.01943 1.69928 9.768 1.74502 10.1973 2.23071C10.2728 2.32529 10.447 2.55475 10.5381 2.71899C10.9578 3.41247 11.0854 4.23889 10.8926 5.02368C10.871 5.11141 10.844 5.20075 10.8018 5.33716L10.6191 5.92505C10.5435 6.16944 10.498 6.31984 10.4746 6.43188C10.4573 6.49375 10.4658 6.61846 10.6396 6.62622C10.7597 6.63693 11.2307 6.63794 11.4932 6.63794C12.3178 6.63793 12.9873 6.63761 13.499 6.70532C14.0223 6.77459 14.4978 6.92772 14.8213 7.33325C14.885 7.41321 14.942 7.49861 14.9912 7.58813C15.2441 8.04778 15.1904 8.54291 15.0381 9.04126C14.8899 9.52632 14.6123 10.124 14.2725 10.8557C13.9571 11.5348 13.6774 12.1381 13.4268 12.5608C13.1675 12.998 12.8898 13.3414 12.5068 13.6028C12.0582 13.909 11.4603 14.0691 10.9482 14.1184C10.4516 14.1662 9.84127 14.1663 9.07617 14.1663C8.15344 14.1663 7.00955 14.1669 6.42676 14.0911C5.82387 14.0125 5.31603 13.8445 4.91113 13.4524C4.81498 13.3592 4.73234 13.2592 4.66016 13.1545C4.20789 13.7684 3.49528 14.1663 2.69043 14.1663C1.66493 14.1661 0.833125 13.3086 0.833008 12.2502V8.41626C0.833231 7.35799 1.665 6.50036 2.69043 6.50024C3.31999 6.50024 3.89316 6.7444 4.33008 7.1438C4.3436 7.10224 4.35717 7.06072 4.37305 7.01978C4.57904 6.48862 4.96699 6.05794 5.56445 5.39673L8.37109 2.28931C8.42404 2.23053 8.47842 2.17014 8.53223 2.12329ZM2.69043 7.77759C2.34878 7.7777 2.07151 8.06373 2.07129 8.41626V12.2502C2.07141 12.6029 2.34871 12.8888 2.69043 12.8889C3.37408 12.8889 3.92849 12.317 3.92871 11.6116V9.05591C3.92871 8.35017 3.37422 7.77759 2.69043 7.77759Z" />
			</svg>`;
		}
		case 'mm-ai-insights-feedback-negative-icon':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M6.94922 1.70801C6.17491 1.70801 5.54935 1.70784 5.04004 1.75684C4.51834 1.80708 4.06578 1.91236 3.64355 2.1543C3.56817 2.19751 3.49462 2.24494 3.42285 2.29395C3.01965 2.5692 2.73033 2.92889 2.46582 3.375C2.20834 3.80933 1.9494 4.36771 1.62988 5.05566C1.28416 5.80006 0.995554 6.41876 0.841797 6.92188C0.685997 7.43188 0.622349 7.96791 0.899414 8.47168C0.952036 8.56727 1.01297 8.65871 1.08105 8.74414C1.43476 9.18747 1.95017 9.3472 2.48438 9.41797C3.01387 9.48804 3.706 9.48731 4.54395 9.4873H4.81348C5.07791 9.4873 5.23546 9.48799 5.34863 9.49805C5.37546 9.50044 5.39543 9.5036 5.40918 9.50586C5.40757 9.51574 5.40634 9.52846 5.40332 9.54297C5.3814 9.64782 5.33703 9.79069 5.26074 10.0371L5.08398 10.6104C5.03944 10.7541 5.00879 10.8501 4.98535 10.9453C4.78447 11.7624 4.91797 12.6232 5.35449 13.3447C5.40532 13.4286 5.46303 13.512 5.54883 13.6367C5.5949 13.7037 5.65001 13.7868 5.70801 13.8525C6.15341 14.3564 6.90894 14.4315 7.44531 14.0527L7.54883 13.9707C7.61484 13.9133 7.68034 13.8393 7.73535 13.7783L10.4629 10.7578C11.0745 10.0806 11.4965 9.62543 11.7246 9.06934C12.1693 9.41564 12.7258 9.62489 13.333 9.625C14.4144 9.62482 15.292 8.74749 15.292 7.66602V3.66602C15.2917 2.58483 14.4142 1.70818 13.333 1.70801C12.5331 1.70815 11.8183 2.06749 11.3369 2.63184C11.2876 2.57205 11.2336 2.51404 11.1758 2.45801C10.7436 2.03949 10.205 1.86542 9.58887 1.78516C8.98869 1.70702 8.22559 1.70801 7.29004 1.70801H6.94922ZM7.29004 2.95801C8.25979 2.95801 8.92709 2.95925 9.42773 3.02441C9.91164 3.08749 10.1458 3.20087 10.3057 3.35547C10.4628 3.50768 10.5758 3.7273 10.6396 4.1875C10.7062 4.66781 10.708 5.30904 10.708 6.25V6.89941C10.708 7.91676 10.6983 8.26336 10.5781 8.57324C10.4573 8.88491 10.2265 9.15444 9.53516 9.91992L6.80762 12.9404L6.73535 13.0195C6.73256 13.0225 6.7303 13.0255 6.72852 13.0273C6.71892 13.0356 6.70416 13.0421 6.68457 13.041C6.66525 13.0397 6.65238 13.032 6.64551 13.0244C6.64404 13.0224 6.64185 13.0197 6.63965 13.0166C6.62648 12.9982 6.609 12.9722 6.5791 12.9287C6.48507 12.792 6.45155 12.743 6.42383 12.6973C6.15777 12.2572 6.07809 11.7369 6.19922 11.2441L6.27734 10.9805L6.45508 10.4072C6.52414 10.1842 6.59012 9.97423 6.62695 9.79785C6.66462 9.61732 6.69133 9.39088 6.61914 9.15137L6.58008 9.04199C6.47898 8.79245 6.30084 8.58167 6.07324 8.43848L5.91602 8.35645C5.75798 8.28999 5.59857 8.26531 5.45996 8.25293C5.27828 8.23676 5.05476 8.2373 4.81348 8.2373H4.54395C3.66953 8.2373 3.07646 8.23534 2.64844 8.17871C2.22563 8.12268 2.10949 8.02856 2.05859 7.96484C2.03455 7.93466 2.01254 7.90256 1.99414 7.86914L1.96973 7.80762C1.94902 7.72728 1.9472 7.58145 2.03711 7.28711C2.15943 6.88687 2.40167 6.36147 2.76367 5.58203C3.09365 4.87155 3.32298 4.3805 3.54102 4.0127C3.75179 3.65719 3.92751 3.46235 4.12695 3.32617V3.3252C4.1714 3.29485 4.2176 3.26624 4.26465 3.23926C4.47697 3.11755 4.73632 3.04173 5.15918 3.00098C5.59493 2.95904 6.15091 2.95801 6.94922 2.95801H7.29004ZM13.333 2.95801C13.7239 2.95818 14.0407 3.27518 14.041 3.66602V7.66602C14.041 8.05712 13.7241 8.37482 13.333 8.375C12.5739 8.37474 11.9582 7.7591 11.958 7V4.33301C11.9581 3.57389 12.5739 2.95827 13.333 2.95801Z" />
			</svg>`;
		}
		case 'mm-ai-insights-feedback-negative-active-icon':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M6.92383 1.83301C6.15873 1.833 5.54841 1.83306 5.05176 1.88086C4.53983 1.93017 3.94177 2.09042 3.49316 2.39648C3.1101 2.65794 2.83251 3.00213 2.57324 3.43945C2.32266 3.86222 2.04291 4.46543 1.72754 5.14453C1.38779 5.87603 1.11011 6.47309 0.961914 6.95801C0.809514 7.45654 0.755723 7.95231 1.00879 8.41211C1.05808 8.50163 1.11491 8.58699 1.17871 8.66699C1.50224 9.07246 1.97771 9.22566 2.50098 9.29492C3.01269 9.36264 3.68225 9.3623 4.50684 9.3623C4.7693 9.3623 5.24028 9.36238 5.36035 9.37305C5.53452 9.38082 5.54285 9.50659 5.52539 9.56836C5.50199 9.68039 5.45648 9.83003 5.38086 10.0742L5.19824 10.6631C5.15611 10.7993 5.129 10.888 5.10742 10.9756C4.91451 11.7605 5.0422 12.5867 5.46191 13.2803C5.55298 13.4446 5.7272 13.6749 5.80273 13.7695C6.23201 14.2551 6.98061 14.301 7.46777 13.877C7.52164 13.8301 7.57591 13.7698 7.62891 13.7109L10.4355 10.6025C11.0328 9.94159 11.421 9.51147 11.627 8.98047C11.643 8.93904 11.6563 8.89655 11.6699 8.85449C12.1069 9.25434 12.6796 9.5 13.3096 9.5C14.3351 9.49988 15.167 8.64147 15.167 7.58301V3.75C15.167 2.69152 14.3351 1.83312 13.3096 1.83301C12.5052 1.83301 11.7922 2.23053 11.3398 2.84375C11.2678 2.73952 11.1847 2.6407 11.0889 2.54785C10.6839 2.15564 10.1762 1.98774 9.57324 1.90918C8.99045 1.83325 7.84656 1.83299 6.92383 1.83301ZM13.3096 3.11133C13.6514 3.11144 13.9287 3.39722 13.9287 3.75V7.58301C13.9287 7.9358 13.6514 8.22156 13.3096 8.22168C12.6258 8.22168 12.0713 7.65 12.0713 6.94434V4.38867C12.0714 3.68304 12.6258 3.11133 13.3096 3.11133Z" />
			</svg>`;
		}
		case 'mm-list-search-settings-icon':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M10 8.70801C10.3021 8.70801 10.5603 8.70721 10.7725 8.72168C10.9901 8.73654 11.2048 8.77 11.416 8.85742C11.8957 9.05615 12.2768 9.43735 12.4756 9.91699C12.563 10.1281 12.5965 10.343 12.6113 10.5605C12.6145 10.6073 12.6143 10.6568 12.6162 10.708H14C14.3451 10.708 14.6248 10.988 14.625 11.333C14.625 11.6782 14.3452 11.958 14 11.958H12.6162C12.6143 12.0094 12.6145 12.0586 12.6113 12.1055C12.5965 12.323 12.563 12.5379 12.4756 12.749C12.2768 13.2288 11.8957 13.6098 11.416 13.8086C11.2048 13.896 10.9901 13.9295 10.7725 13.9443C10.5603 13.9588 10.3021 13.958 10 13.958C9.69792 13.958 9.43968 13.9588 9.22754 13.9443C9.00991 13.9295 8.7952 13.896 8.58398 13.8086C8.10427 13.6098 7.72316 13.2288 7.52441 12.749C7.43704 12.5379 7.40353 12.323 7.38867 12.1055C7.38542 12.0577 7.3847 12.0075 7.38281 11.9551H2C1.65485 11.9551 1.37505 11.6752 1.375 11.3301C1.375 10.9849 1.65482 10.7051 2 10.7051H7.38379C7.38565 10.6549 7.38554 10.6064 7.38867 10.5605C7.40355 10.343 7.437 10.1281 7.52441 9.91699C7.72321 9.43735 8.10431 9.05615 8.58398 8.85742C8.79518 8.77 9.00993 8.73654 9.22754 8.72168C9.43968 8.70721 9.69793 8.70801 10 8.70801ZM10 9.95801C9.68113 9.95801 9.47315 9.95886 9.31348 9.96973C9.16008 9.98019 9.09634 9.99778 9.0625 10.0117C8.88904 10.0836 8.75064 10.2221 8.67871 10.3955C8.66478 10.4293 8.6472 10.4932 8.63672 10.6465C8.62586 10.8061 8.625 11.0143 8.625 11.333C8.625 11.6517 8.62587 11.8599 8.63672 12.0195C8.64716 12.1727 8.66479 12.2366 8.67871 12.2705C8.75059 12.444 8.889 12.5824 9.0625 12.6543C9.09631 12.6682 9.15994 12.6858 9.31348 12.6963C9.47316 12.7072 9.68112 12.708 10 12.708C10.3189 12.708 10.5268 12.7072 10.6865 12.6963C10.8401 12.6858 10.9037 12.6682 10.9375 12.6543C11.111 12.5824 11.2494 12.444 11.3213 12.2705C11.3352 12.2366 11.3528 12.1727 11.3633 12.0195C11.3741 11.8599 11.375 11.6517 11.375 11.333C11.375 11.0143 11.3741 10.8061 11.3633 10.6465C11.3528 10.4932 11.3352 10.4293 11.3213 10.3955C11.2494 10.2221 11.111 10.0836 10.9375 10.0117C10.9037 9.99778 10.8399 9.98019 10.6865 9.96973C10.5268 9.95886 10.3189 9.95801 10 9.95801ZM6 2.04199C6.30208 2.04199 6.56031 2.04119 6.77246 2.05566C6.99011 2.07053 7.20477 2.10392 7.41602 2.19141C7.89571 2.39016 8.27682 2.77119 8.47559 3.25098C8.56297 3.46212 8.59647 3.67699 8.61133 3.89453C8.61458 3.94231 8.6153 3.99249 8.61719 4.04492H14C14.3451 4.04492 14.6249 4.32479 14.625 4.66992C14.625 5.0151 14.3452 5.29492 14 5.29492H8.61621C8.61435 5.3451 8.61446 5.39356 8.61133 5.43945C8.59645 5.65698 8.56301 5.87188 8.47559 6.08301C8.27677 6.5627 7.89567 6.94387 7.41602 7.14258C7.20481 7.23003 6.99007 7.26345 6.77246 7.27832C6.56032 7.29279 6.30206 7.29199 6 7.29199C5.69793 7.29199 5.43969 7.29279 5.22754 7.27832C5.00993 7.26345 4.7952 7.23005 4.58398 7.14258C4.10428 6.94386 3.7232 6.56268 3.52441 6.08301C3.43696 5.87186 3.40355 5.65699 3.38867 5.43945C3.38548 5.39267 3.38567 5.34323 3.38379 5.29199H2C1.65493 5.29199 1.37518 5.01202 1.375 4.66699C1.375 4.32181 1.65482 4.04199 2 4.04199H3.38379C3.38567 3.99064 3.38548 3.94141 3.38867 3.89453C3.40353 3.67698 3.437 3.46214 3.52441 3.25098C3.72316 2.77122 4.10425 2.39018 4.58398 2.19141C4.79523 2.10391 5.0099 2.07053 5.22754 2.05566C5.43969 2.04119 5.69793 2.04199 6 2.04199ZM6 3.29199C5.68112 3.29199 5.47315 3.29284 5.31348 3.30371C5.1598 3.3142 5.09624 3.33177 5.0625 3.3457C4.88899 3.41761 4.75059 3.55597 4.67871 3.72949C4.6648 3.7633 4.64718 3.82719 4.63672 3.98047C4.62587 4.1401 4.625 4.34832 4.625 4.66699C4.625 4.9857 4.62585 5.19389 4.63672 5.35352C4.64721 5.50698 4.66479 5.57078 4.67871 5.60449C4.75064 5.77793 4.88903 5.91643 5.0625 5.98828C5.09627 6.00221 5.15994 6.0198 5.31348 6.03027C5.47315 6.04114 5.68113 6.04199 6 6.04199C6.31887 6.04199 6.52685 6.04114 6.68652 6.03027C6.83996 6.0198 6.90368 6.00221 6.9375 5.98828C7.11097 5.91642 7.24937 5.77791 7.32129 5.60449C7.33521 5.57075 7.3528 5.50692 7.36328 5.35352C7.37414 5.19389 7.375 4.98569 7.375 4.66699C7.375 4.34833 7.37413 4.14011 7.36328 3.98047C7.35283 3.82724 7.3352 3.76333 7.32129 3.72949C7.24941 3.55598 7.11102 3.41762 6.9375 3.3457C6.90372 3.33176 6.84013 3.31419 6.68652 3.30371C6.52685 3.29284 6.31889 3.29199 6 3.29199Z" />
			</svg>`;
		}
		case 'mm-list-column-edit-icon':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M10.4199 2.69623C10.9243 2.19185 11.7426 2.19196 12.2471 2.69623L13.3037 3.75385C13.8073 4.25817 13.8084 5.07578 13.3047 5.58002L6.03711 12.8476C5.81761 13.0671 5.54888 13.2309 5.25488 13.3261L5.12695 13.3632L2.81836 13.9404C2.60565 13.9935 2.37977 13.9302 2.22461 13.7753C2.06985 13.6203 2.00764 13.3951 2.06055 13.1826L2.6377 10.874C2.72378 10.5297 2.90234 10.2148 3.15332 9.96381L10.4199 2.69623ZM11.667 12.7079C12.0118 12.7082 12.2918 12.9881 12.292 13.3329C12.292 13.678 12.012 13.9577 11.667 13.9579H7.66699C7.32181 13.9579 7.04199 13.6781 7.04199 13.3329C7.04221 12.988 7.32195 12.7079 7.66699 12.7079H11.667ZM4.03711 10.8476C3.94645 10.9383 3.88176 11.0523 3.85059 11.1767L3.52539 12.4745L4.82324 12.1503C4.94782 12.1191 5.06265 12.0545 5.15332 11.9638L10.4492 6.66693L9.33301 5.55072L4.03711 10.8476ZM11.3047 3.58002L10.2168 4.66693L11.333 5.78314L12.4199 4.69623C12.436 4.68009 12.4358 4.65393 12.4199 4.63763L11.3633 3.58099C11.3472 3.56504 11.3209 3.56428 11.3047 3.58002Z" />
			</svg>`;
		}
		case 'mm-list-sort-drag-icon':
		{
			return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M6.67188 13.75C7.36206 13.7502 7.92188 14.3098 7.92188 15C7.92188 15.6902 7.36206 16.2498 6.67188 16.25H6.66699C5.97664 16.25 5.41699 15.6904 5.41699 15C5.41699 14.3096 5.97664 13.75 6.66699 13.75H6.67188ZM13.334 13.75C14.024 13.7504 14.584 14.3099 14.584 15C14.584 15.6901 14.024 16.2496 13.334 16.25H13.3281C12.6379 16.2498 12.0781 15.6903 12.0781 15C12.0781 14.3097 12.6379 13.7502 13.3281 13.75H13.334ZM6.67188 8.75C7.36206 8.7502 7.92188 9.30977 7.92188 10C7.92188 10.6902 7.36206 11.2498 6.67188 11.25H6.66699C5.97664 11.25 5.41699 10.6904 5.41699 10C5.41699 9.30964 5.97664 8.75 6.66699 8.75H6.67188ZM13.334 8.75C14.024 8.75037 14.584 9.30987 14.584 10C14.584 10.6901 14.024 11.2496 13.334 11.25H13.3281C12.6379 11.2498 12.0781 10.6903 12.0781 10C12.0781 9.30974 12.6379 8.75015 13.3281 8.75H13.334ZM6.67188 3.75C7.36206 3.7502 7.92188 4.30977 7.92188 5C7.92188 5.69023 7.36206 6.2498 6.67188 6.25H6.66699C5.97664 6.25 5.41699 5.69036 5.41699 5C5.41699 4.30964 5.97664 3.75 6.66699 3.75H6.67188ZM13.334 3.75C14.024 3.75037 14.584 4.30987 14.584 5C14.584 5.69013 14.024 6.24963 13.334 6.25H13.3281C12.6379 6.24985 12.0781 5.69026 12.0781 5C12.0781 4.30974 12.6379 3.75015 13.3281 3.75H13.334Z" />
			</svg>`;
		}
		case 'mm-list-sort-position-icon':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M8 0.708008C11.6589 0.708008 14.625 3.6751 14.625 7.33398C14.6248 9.94669 12.9495 11.9395 11.4004 13.2305C10.6155 13.8845 9.83328 14.3843 9.24902 14.7197C8.95624 14.8878 8.71048 15.0159 8.53711 15.1025C8.45051 15.1458 8.38115 15.1795 8.33301 15.2021C8.30949 15.2132 8.29058 15.2215 8.27734 15.2275C8.27073 15.2306 8.26458 15.2336 8.26074 15.2354L8.25488 15.2383H8.25391C8.13286 15.292 7.99856 15.3061 7.87109 15.2793L7.74609 15.2383H7.74512L7.73926 15.2354C7.73542 15.2336 7.72927 15.2306 7.72266 15.2275C7.70942 15.2215 7.69052 15.2132 7.66699 15.2021C7.61885 15.1795 7.54949 15.1458 7.46289 15.1025C7.28952 15.0159 7.04376 14.8878 6.75098 14.7197C6.16672 14.3843 5.38454 13.8845 4.59961 13.2305C3.05055 11.9395 1.37521 9.94669 1.375 7.33398C1.375 3.6751 4.34112 0.708008 8 0.708008ZM8 1.95898C5.03147 1.95898 2.625 4.36546 2.625 7.33398C2.62521 9.3873 3.94975 11.0616 5.40039 12.2705C6.11512 12.8661 6.83347 13.3254 7.37402 13.6357C7.63083 13.7832 7.84652 13.8955 8 13.9727C8.15348 13.8955 8.36917 13.7832 8.62598 13.6357C9.16653 13.3254 9.88488 12.8661 10.5996 12.2705C12.0502 11.0616 13.3748 9.3873 13.375 7.33398C13.375 4.36545 10.9686 1.95898 8 1.95898ZM8 4.375C9.63374 4.375 10.9588 5.69931 10.959 7.33301C10.959 8.96685 9.63384 10.292 8 10.292C6.3663 10.2918 5.04199 8.96674 5.04199 7.33301C5.04217 5.69942 6.36641 4.37518 8 4.375ZM8 5.625C7.05677 5.62518 6.29217 6.38978 6.29199 7.33301C6.29199 8.27639 7.05666 9.04182 8 9.04199C8.94349 9.04199 9.70898 8.2765 9.70898 7.33301C9.70881 6.38967 8.94338 5.625 8 5.625Z" />
			</svg>`;
		}
		case 'mm-list-sort-position-hover-icon':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M8 0.708008C11.6589 0.708008 14.625 3.6751 14.625 7.33398C14.6248 9.94669 12.9495 11.9395 11.4004 13.2305C10.6155 13.8845 9.83328 14.3843 9.24902 14.7197C8.95624 14.8878 8.71048 15.0159 8.53711 15.1025C8.45051 15.1458 8.38115 15.1795 8.33301 15.2021C8.30949 15.2132 8.29058 15.2215 8.27734 15.2275C8.27073 15.2306 8.26458 15.2336 8.26074 15.2354L8.25488 15.2383H8.25391C8.13286 15.292 7.99856 15.3061 7.87109 15.2793L7.74609 15.2383H7.74512L7.73926 15.2354C7.73542 15.2336 7.72927 15.2306 7.72266 15.2275C7.70942 15.2215 7.69052 15.2132 7.66699 15.2021C7.61885 15.1795 7.54949 15.1458 7.46289 15.1025C7.28952 15.0159 7.04376 14.8878 6.75098 14.7197C6.16672 14.3843 5.38454 13.8845 4.59961 13.2305C3.05055 11.9395 1.37521 9.94669 1.375 7.33398C1.375 3.6751 4.34112 0.708008 8 0.708008ZM8 1.95898C5.03147 1.95898 2.625 4.36546 2.625 7.33398C2.62521 9.3873 3.94975 11.0616 5.40039 12.2705C6.11512 12.8661 6.83347 13.3254 7.37402 13.6357C7.63083 13.7832 7.84652 13.8955 8 13.9727C8.15348 13.8955 8.36917 13.7832 8.62598 13.6357C9.16653 13.3254 9.88488 12.8661 10.5996 12.2705C12.0502 11.0616 13.3748 9.3873 13.375 7.33398C13.375 4.36545 10.9686 1.95898 8 1.95898ZM9.85254 4.93359C10.0734 4.66869 10.4673 4.63294 10.7324 4.85352C10.9975 5.07451 11.0335 5.46923 10.8125 5.73438L7.47949 9.73438C7.36709 9.86897 7.20255 9.95006 7.02734 9.95801C6.85231 9.9658 6.68162 9.90013 6.55762 9.77637L5.22363 8.44238C4.98004 8.19844 4.98013 7.8026 5.22363 7.55859C5.46771 7.31452 5.86432 7.31452 6.1084 7.55859L6.95703 8.40723L9.85254 4.93359Z" />
			</svg>`;
		}
		case 'mm-list-find-previous-icon':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M7.52637 5.41785C7.82095 5.17764 8.25571 5.19504 8.53027 5.4696L12.5303 9.4696C12.8231 9.76246 12.8231 10.2373 12.5303 10.5302C12.2374 10.823 11.7626 10.823 11.4697 10.5302L8 7.06042L4.53027 10.5302C4.23738 10.823 3.76262 10.823 3.46973 10.5302C3.17683 10.2373 3.17683 9.7625 3.46973 9.4696L7.46973 5.4696L7.52637 5.41785Z" />
			</svg>`;
		}
		case 'mm-list-find-next-icon':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M11.4697 5.46985C11.7626 5.17701 12.2374 5.17698 12.5303 5.46985C12.8231 5.76273 12.8231 6.23753 12.5303 6.5304L8.53027 10.5304C8.23741 10.8233 7.76262 10.8232 7.46973 10.5304L3.46973 6.5304C3.17685 6.2375 3.17684 5.76274 3.46973 5.46985C3.76262 5.17703 4.2374 5.17699 4.53027 5.46985L8 8.93958L11.4697 5.46985Z" />
			</svg>`;
		}
		case 'mm-list-close-icon':
		{
			return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M19.4697 11.4698C19.7626 11.177 20.2374 11.177 20.5303 11.4698C20.823 11.7627 20.8231 12.2375 20.5303 12.5304L17.0605 16.0001L20.5303 19.4698C20.8227 19.7627 20.8227 20.2376 20.5303 20.5304C20.2374 20.8232 19.7617 20.8231 19.4688 20.5304L15.999 17.0607L12.5312 20.5304C12.2384 20.8232 11.7626 20.8231 11.4697 20.5304C11.1769 20.2375 11.1769 19.7618 11.4697 19.4689L14.9385 16.0001L11.4697 12.5314C11.1769 12.2385 11.177 11.7637 11.4697 11.4708C11.7626 11.178 12.2374 11.1779 12.5303 11.4708L15.999 14.9396L19.4697 11.4698Z" />
			</svg>`;
		}
		case 'mm-list-advanced-search-display-filter-close-icon':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M10.9578 4.55743C11.2017 4.31373 11.5975 4.31389 11.8416 4.55743C12.0856 4.8015 12.0856 5.19812 11.8416 5.4422L9.08374 8.20001L11.8416 10.9578C12.0854 11.2018 12.0854 11.5976 11.8416 11.8416C11.5975 12.0857 11.2019 12.0856 10.9578 11.8416L8.19897 9.0838L5.44214 11.8416C5.19811 12.0855 4.8024 12.0855 4.55835 11.8416C4.31449 11.5976 4.31447 11.2019 4.55835 10.9578L7.31519 8.20001L4.55737 5.4422C4.31378 5.19818 4.31369 4.80238 4.55737 4.55841C4.80139 4.31441 5.19805 4.31451 5.44214 4.55841L8.19897 7.31525L10.9578 4.55743Z" />
			</svg>`;
		}
		case 'mm-list-advanced-search-display-filter-more-dropdown-icon':
		{
			return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M14.5571 10.0571C14.8011 9.81318 15.1978 9.81344 15.4419 10.0571C15.686 10.3012 15.686 10.6978 15.4419 10.9419L12.4419 13.9419C12.1978 14.186 11.8012 14.186 11.5571 13.9419L8.55713 10.9419C8.31345 10.6978 8.31319 10.3011 8.55713 10.0571C8.80108 9.8132 9.19779 9.81345 9.44189 10.0571L11.9995 12.6147L14.5571 10.0571Z" />
			</svg>`;
		}
		case 'mm-list-search-cancel-icon':
		{
			return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M10 1.04102C14.9475 1.0411 18.958 5.0525 18.958 10C18.9579 14.9475 14.9475 18.9579 10 18.958C5.0525 18.958 1.0411 14.9475 1.04102 10C1.04102 5.05245 5.05245 1.04102 10 1.04102ZM13.0889 6.91113C12.7838 6.60607 12.301 6.58657 11.9736 6.85352L11.9111 6.91113L10 8.82129L8.08887 6.91113L8.02539 6.85352C7.69809 6.58672 7.21618 6.60612 6.91113 6.91113C6.6062 7.21618 6.58673 7.69812 6.85352 8.02539L6.91113 8.08887L8.82129 10L6.91113 11.9111C6.58629 12.2365 6.58607 12.7636 6.91113 13.0889C7.23657 13.414 7.76449 13.4142 8.08984 13.0889L10 11.1787L11.9102 13.0889L11.9736 13.1465C12.3008 13.413 12.7828 13.3935 13.0879 13.0889C13.3929 12.784 13.4132 12.301 13.1465 11.9736L13.0879 11.9111L11.1777 10L13.0889 8.08887L13.1465 8.02539C13.4131 7.69818 13.3936 7.21614 13.0889 6.91113Z" />
			</svg>`;
		}
		case 'mm-list-column-visibility-sort-icon':
		{
			return `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M3.53027 8.03015C3.23738 8.32304 2.76262 8.32304 2.46973 8.03015C2.17696 7.73725 2.17688 7.26246 2.46973 6.96961L5.46973 3.96961C5.76258 3.67676 6.23737 3.67684 6.53027 3.96961L9.53027 6.96961C9.82315 7.2625 9.82316 7.73726 9.53027 8.03015C9.23738 8.32302 8.76262 8.32303 8.46973 8.03015L6 5.56043L3.53027 8.03015Z" />
			</svg>`;
		}
		case 'mm-list-column-preview-image-fallback-icon':
		{
			return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M16.251 1.33301C17.5855 1.33318 18.667 2.4164 18.667 3.75098V16.251C18.6666 17.5852 17.5853 18.6668 16.251 18.667H3.75098C2.41657 18.667 1.33442 17.5853 1.33398 16.251V3.75098C1.33398 2.41629 2.41629 1.33301 3.75098 1.33301H16.251ZM13.5781 11.7598C13.2296 11.5275 12.7684 11.5607 12.457 11.8408L6.53906 17.167H16.251C16.7568 17.1668 17.1666 16.7568 17.167 16.251V14.1523L13.5781 11.7598ZM3.75098 2.83398C3.24472 2.83398 2.83398 3.24472 2.83398 3.75098V16.251C2.83442 16.7569 3.24498 17.167 3.75098 17.167H4.2959L11.4531 10.7256C12.274 9.98678 13.4912 9.89914 14.4102 10.5117L17.167 12.3496V3.75098C17.167 3.24482 16.7571 2.83416 16.251 2.83398H3.75098ZM6.66602 4.66699C7.77059 4.66699 8.66602 5.56242 8.66602 6.66699C8.66575 7.77134 7.77042 8.66699 6.66602 8.66699C5.56161 8.66699 4.66628 7.77134 4.66602 6.66699C4.66602 5.56242 5.56145 4.66699 6.66602 4.66699ZM6.66602 6.16699C6.38987 6.16699 6.16602 6.39085 6.16602 6.66699C6.16628 6.94291 6.39004 7.16699 6.66602 7.16699C6.942 7.16699 7.16575 6.94291 7.16602 6.66699C7.16602 6.39085 6.94216 6.16699 6.66602 6.16699Z" />
			</svg>`;
		}
		case 'mm-list-column-popup-button-icon':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M14 10.7087C14.3452 10.7087 14.625 10.9885 14.625 11.3337V13.0007C14.6246 13.8978 13.8973 14.6257 13 14.6257H3C2.10275 14.6257 1.37536 13.8978 1.375 13.0007V11.3337C1.375 10.9885 1.65482 10.7087 2 10.7087C2.34518 10.7087 2.625 10.9885 2.625 11.3337V13.0007C2.62536 13.2075 2.79312 13.3757 3 13.3757H13C13.2069 13.3757 13.3746 13.2075 13.375 13.0007V11.3337C13.375 10.9885 13.6548 10.7087 14 10.7087ZM7.65625 1.47723C7.89875 1.31744 8.22895 1.344 8.44238 1.55731L11.4424 4.55731C11.6864 4.80133 11.6863 5.19799 11.4424 5.44208C11.1983 5.68616 10.8017 5.68616 10.5576 5.44208L8.625 3.50946V10.6667C8.62482 11.0117 8.34505 11.2917 8 11.2917C7.65493 11.2917 7.37518 11.0117 7.375 10.6667V3.50946L5.44238 5.44208C5.19831 5.68616 4.80169 5.68616 4.55762 5.44208C4.31367 5.19799 4.31358 4.80135 4.55762 4.55731L7.55762 1.55731L7.65625 1.47723Z" />
			</svg>`;
		}
		case 'mm-list-filter-icon':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M10 11.25C10.4142 11.25 10.75 11.5858 10.75 12C10.75 12.4142 10.4142 12.75 10 12.75H6C5.58579 12.75 5.25 12.4142 5.25 12C5.25 11.5858 5.58579 11.25 6 11.25H10ZM12 7.25C12.4142 7.25 12.75 7.58579 12.75 8C12.75 8.41421 12.4142 8.75 12 8.75H4C3.58579 8.75 3.25 8.41421 3.25 8C3.25 7.58579 3.58579 7.25 4 7.25H12ZM14 3.25C14.4142 3.25 14.75 3.58579 14.75 4C14.75 4.41421 14.4142 4.75 14 4.75H2C1.58579 4.75 1.25 4.41421 1.25 4C1.25 3.58579 1.58579 3.25 2 3.25H14Z" />
			</svg>`;
		}
		case 'mm-multidomain-selector-no-matching-icon':
		{
			return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M14.9971 1.04199C16.2627 1.04199 17.2891 2.06832 17.2891 3.33398V12.5127C17.289 12.6786 17.2229 12.8379 17.1055 12.9551L11.2705 18.7773C11.1534 18.8941 10.9945 18.96 10.8291 18.96H5C3.73319 18.9598 2.70623 17.9319 2.70801 16.665L2.72852 3.33008C2.73049 2.06591 3.75637 1.04213 5.02051 1.04199H14.9971ZM5.02051 2.29199C4.44596 2.29213 3.97941 2.75746 3.97852 3.33203L3.95801 16.667C3.95731 17.2427 4.42429 17.7098 5 17.71H10.208V14.167C10.208 12.9014 11.2344 11.8751 12.5 11.875H16.0391V3.33398C16.0391 2.7587 15.5723 2.29199 14.9971 2.29199H5.02051ZM12.5 13.125C11.9248 13.1251 11.458 13.5918 11.458 14.167V16.8232L15.165 13.125H12.5Z" />
			</svg>`;
		}
		case 'mm-generic-menubutton-dropdown-icon':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M11.4698 5.46973C11.7627 5.17688 12.2375 5.17686 12.5303 5.46973C12.823 5.76262 12.8231 6.23744 12.5303 6.53027L8.53034 10.5303C8.23751 10.8231 7.7627 10.823 7.46979 10.5303L3.46979 6.53027C3.17692 6.23738 3.17691 5.76262 3.46979 5.46973C3.76269 5.1769 4.23746 5.17687 4.53034 5.46973L8.00007 8.93945L11.4698 5.46973Z" />
			</svg>`;
		}
		case 'mm-generic-input-search-icon':
		{
			return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M7.33301 1.375C10.6236 1.375 13.2918 4.04246 13.292 7.33301C13.292 8.75294 12.7931 10.0553 11.9639 11.0791L14.4414 13.5576C14.6855 13.8017 14.6855 14.1973 14.4414 14.4414C14.1973 14.6854 13.8017 14.6855 13.5576 14.4414L11.0791 11.9639C10.0553 12.7931 8.75294 13.292 7.33301 13.292C4.04246 13.2918 1.375 10.6236 1.375 7.33301C1.37518 4.04257 4.04257 1.37518 7.33301 1.375ZM7.33301 2.625C4.73292 2.62518 2.62518 4.73292 2.625 7.33301C2.625 9.93325 4.73281 12.0418 7.33301 12.042C9.93336 12.042 12.042 9.93336 12.042 7.33301C12.0418 4.73281 9.93325 2.625 7.33301 2.625Z" />
			</svg>`;
		}
		case 'mm-generic-production-icon':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M14.2031 2.1875C14.4288 2.18754 14.6493 2.25192 14.8389 2.37207L14.918 2.42676L14.9922 2.48828C15.1359 2.61622 15.2467 2.77691 15.3145 2.95703L15.3447 3.04883L16.3506 6.5791C16.3528 6.58679 16.3536 6.59481 16.3555 6.60254C16.3583 6.61419 16.3611 6.6258 16.3633 6.6377C16.3694 6.67081 16.3723 6.70402 16.373 6.7373C16.3731 6.74154 16.375 6.74575 16.375 6.75V7.875C16.375 8.6375 16.0724 9.36904 15.5332 9.9082C15.4444 9.99696 15.3485 10.0767 15.25 10.1523V15.1875C15.2497 15.5325 14.97 15.8125 14.625 15.8125H3.375C3.02998 15.8125 2.75025 15.5325 2.75 15.1875V10.1523C2.65153 10.0767 2.55556 9.99696 2.4668 9.9082C1.92763 9.36904 1.625 8.6375 1.625 7.875V6.75C1.625 6.74575 1.62589 6.74153 1.62598 6.7373C1.62666 6.70406 1.6297 6.67077 1.63574 6.6377C1.63777 6.62652 1.63996 6.61545 1.64258 6.60449C1.64469 6.59568 1.64691 6.58688 1.64941 6.57812L2.65723 3.04883L2.6875 2.95703C2.76617 2.74779 2.90283 2.56451 3.08203 2.42871C3.28695 2.27355 3.53693 2.18862 3.79395 2.1875H14.2031ZM6.75 9.66211C6.68227 9.74741 6.61098 9.83043 6.5332 9.9082C5.99404 10.4474 5.2625 10.75 4.5 10.75C4.33105 10.75 4.16415 10.7321 4 10.7031V14.5625H14V10.7031C13.8358 10.7321 13.6689 10.75 13.5 10.75C12.7375 10.75 12.006 10.4474 11.4668 9.9082C11.389 9.83043 11.3177 9.74741 11.25 9.66211C11.1823 9.74741 11.111 9.83043 11.0332 9.9082C10.494 10.4474 9.7625 10.75 9 10.75C8.2375 10.75 7.50596 10.4474 6.9668 9.9082C6.88902 9.83043 6.81773 9.74741 6.75 9.66211ZM2.875 7.875C2.875 8.30598 3.04584 8.71967 3.35059 9.02441C3.43079 9.10462 3.51868 9.17535 3.6123 9.23633C3.66093 9.25631 3.7055 9.28347 3.74707 9.31445C3.9775 9.43479 4.23529 9.5 4.5 9.5C4.93098 9.5 5.34467 9.32916 5.64941 9.02441C5.95416 8.71967 6.125 8.30598 6.125 7.875V7.375H2.875V7.875ZM7.375 7.875C7.375 8.30598 7.54584 8.71967 7.85059 9.02441C8.15533 9.32916 8.56902 9.5 9 9.5C9.43098 9.5 9.84467 9.32916 10.1494 9.02441C10.4542 8.71967 10.625 8.30598 10.625 7.875V7.375H7.375V7.875ZM11.875 7.375V7.875C11.875 8.30598 12.0458 8.71967 12.3506 9.02441C12.6553 9.32916 13.069 9.5 13.5 9.5C13.7644 9.5 14.0217 9.43454 14.252 9.31445C14.2935 9.28344 14.3382 9.25636 14.3867 9.23633C14.4806 9.17525 14.569 9.10482 14.6494 9.02441C14.9542 8.71967 15.125 8.30598 15.125 7.875V7.375H11.875ZM3.07812 6.125H14.9219L14.1553 3.4375H3.84668L3.07812 6.125Z" />
			</svg>`;
		}
		case 'mm-generic-sandbox-icon':
		{
			return `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path class="mm10_svg_icon_color" d="M15.75 4.4375C16.4058 4.4375 16.9375 4.96916 16.9375 5.625V10.6875C16.9375 11.3433 16.4058 11.875 15.75 11.875H14.125V14.0625C14.125 14.4077 13.8452 14.6875 13.5 14.6875C13.1548 14.6875 12.875 14.4077 12.875 14.0625V11.875H5.125V14.0625C5.125 14.4077 4.84518 14.6875 4.5 14.6875C4.15482 14.6875 3.875 14.4077 3.875 14.0625V11.875H2.25C1.59416 11.875 1.0625 11.3433 1.0625 10.6875V5.91602C1.06239 5.90918 1.06238 5.90235 1.0625 5.89551V5.625C1.0625 4.96916 1.59416 4.4375 2.25 4.4375H15.75ZM2.3125 10.625H5.52148L2.3125 7.41602V10.625ZM7.29102 10.625H10.584L5.64648 5.6875H2.35352L7.29102 10.625ZM12.3535 10.625H15.6465L10.709 5.6875H7.41602L12.3535 10.625ZM15.6875 8.89648V5.6875H12.4785L15.6875 8.89648Z" />
			</svg>`;
		}
		default:
		{
			return MivaSVGIconMap_Extensions( icon );
		}
	}
}

function MivaSVGIconMapWithSpan( icon )
{
	var span;

	span			= newElement( 'span', { 'class': 'mm10_svg_icon_span' }, null, null );
	span.innerHTML	= MivaSVGIconMap( icon );

	return span;
}

// MMUploadButton
////////////////////////////////////////////////////

function MMUploadButton( parent, multiple )
{
	MMButton.call( this, parent );

	this.multiple			= multiple;
	this.accept				= '';
	this.file_input_name	= '';
	this.event_onchange		= function( button, file_input ) { ; };

	this.filediv			= newElement( 'div', { 'class': 'mm9_button_upload_container' }, null, this.button );

	this.Reset();
}

DeriveFrom( MMButton, MMUploadButton );

MMUploadButton.prototype.CreateTopLevelElement = function( parent )
{
	return newElement( 'label', { 'class': 'mm_button_style_secondary', 'data-mm-button': '' }, null, parent ? parent : null );
}

MMUploadButton.prototype.SetFileInputName = function( name )
{
	this.file_input_name = name;
	this.Reset();

	return this;
}

MMUploadButton.prototype.Event_FileOnClick = function( e )
{
	if ( !this.button.disabled )
	{
		return true;
	}

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

MMUploadButton.prototype.GetFileInput = function()
{
	return this.file;
}

MMUploadButton.prototype.SetMultiple = function( multiple )
{
	this.multiple = multiple;
	this.Reset();
}

MMUploadButton.prototype.SetAccept = function( accept )
{
	this.accept = accept;
	this.Reset();
}

MMUploadButton.prototype.SetOnChangeHandler = function( callback )
{
	var self = this;

	this.event_onchange	= callback;
	this.file.onchange	= function( event ) { self.event_onchange( self, self.file ); };
}

MMUploadButton.prototype.Reset = function()
{
	var self = this;

	EmptyElement_NoResize( this.filediv );

	this.file				= newElement( 'input', { type: 'file', name: encodeentities( this.file_input_name ) }, null, this.filediv );
	this.file.onfocus		= function( event ) { return self.Event_Focus( event ? event : window.event ); };
	this.file.onblur		= function( event ) { return self.Event_Blur( event ? event : window.event ); };
	this.file.onclick		= function( event ) { return self.Event_FileOnClick( event ? event : window.event ); };
	this.file.onchange		= function( event ) { self.event_onchange( self, self.file ); };

	if ( this.multiple )
	{
		this.file.setAttribute( 'multiple', '' );
	}

	if ( typeof this.accept === 'string' && this.accept.length )
	{
		this.file.setAttribute( 'accept', encodeentities( this.accept ) );
	}

	this.button.onfocus		= function() { self.file.focus(); };
	this.button.onblur		= function() { ; };
}

MMUploadButton.prototype.OnClick = function( e )
{
	this.file.value = null;

	this.file.blur();
	this.Event_Blur( e );

	return MMButton.prototype.OnClick.call( this, e );
}

// MMPlaceholderInput
////////////////////////////////////////////////////

var MMPlaceholderInput = class extends MMInput
{
	constructor( parent, name, placeholder )
	{
		super( parent, name, '' );

		this.SetPlaceholderText( placeholder );
	}

	SetFocus()
	{
		super.Focus();
	}
}

// MMPlaceholderInput
////////////////////////////////////////////////////

var MMPlaceholderInput_Password = class extends MMPlaceholderInput
{
	constructor( parent, name, placeholder )
	{
		super( parent, name, '' );

		this.SetType( 'password' );
	}
}

// MMSearch
////////////////////////////////////////////////////

function MMSearch( parent )
{
	var self = this;

	this.focused										= false;
	this.hovered										= false;
	this.disabled										= false;
	this.visible										= true;
	this.keystackhandler								= null;
	this.placeholder_text								= '';

	this.element_container								= newElement( 'span',	{ 'class': 'mm9_search_container' },						null, parent ? parent : null );
	this.element_placeholder_container					= newElement( 'span',	{ 'class': 'mm9_search_placeholder_container' },			null, this.element_container );
	this.element_search_container						= newElement( 'span',	{ 'class': 'mm9_search_search_container' },					null, this.element_container );
	this.element_placeholder							= newElement( 'input',	{ 'type': 'text', 'class': 'mm9_search_placeholder' },		null, this.element_placeholder_container );
	this.element_search									= newElement( 'input',	{ 'type': 'text', 'class': 'mm9_search' },					null, this.element_search_container );

	this.element_placeholder.tabIndex					= -1;
	this.element_placeholder.onfocus					= function( event ) { self.element_search.focus(); };
	this.element_search.onfocus							= function( event )	{ self.Focus(); };
	this.element_search.onblur							= function( event )	{ self.Blur(); };
	this.element_container.onmouseover					= function( event )	{ self.HoverOver(); }
	this.element_container.onmouseout					= function( event )	{ self.HoverOut(); }

	AddEvent( document,					'mousedown',	function( event ) { return self.Event_DocumentMouseDown( event ? event : window.event ); } );
	AddEvent( document,					'click',		function( event ) { return self.Event_DocumentClick( event ? event : window.event ); } );
	AddEvent( this.element_container,	'click',		function( event ) { return self.Event_ContainerClick( event ? event : window.event ); } );
}

MMSearch.prototype.Search = function()
{
	var self = this;

	this.onSearch( this.element_search.value );

	this.element_search.blur();
	setTimeout( function() { self.element_search.focus(); }, 0 );
}

MMSearch.prototype.Enter = function( e )
{
	this.Search();
}

MMSearch.prototype.Esc = function( e )
{
	if ( this.element_search.value.length )
	{
		return this.Clear();
	}

	this.element_search.blur();
}

MMSearch.prototype.Clear = function()
{
	this.element_search.value = '';
}

MMSearch.prototype.Event_DocumentClick = function( e )
{
	var t = ( e.target ) ? e.target : e.srcElement;

	if ( ( t == this.element_container ) || containsChild( this.element_container, t ) )
	{
		if ( this.disabled )
		{
			eventStopPropagation( e );
			return eventPreventDefault( e );
		}

		this.Focus();
		this.element_search.focus();
	}
	else
	{
		this.Blur();
	}
}

MMSearch.prototype.Event_DocumentMouseDown = function( e )
{
	var t = ( e.target ) ? e.target : e.srcElement;

	if ( ( t == this.element_search ) ||
		 ( t == this.element_container ) )
	{
		if ( this.disabled )
		{
			eventStopPropagation( e );
			return eventPreventDefault( e );
		}
	}
}

MMSearch.prototype.SetPlaceholderText = function( placeholder_text )
{
	this.placeholder_text			= placeholder_text;
	this.element_placeholder.value	= this.placeholder_text;
}

MMSearch.prototype.SetValue = function( value )
{
	if ( value && value.length )	this.element_placeholder.value = '';
	else							this.element_placeholder.value = this.placeholder_text;

	this.element_search.value = value;
}

MMSearch.prototype.GetValue = function()
{
	return this.element_search.value;
}

MMSearch.prototype.Event_ContainerClick = function( e )
{
	if ( this.disabled )
	{
		eventStopPropagation( e );
		return eventPreventDefault( e );
	}

	this.element_search.focus();
}

MMSearch.prototype.Focus = function()
{
	var self = this;

	if ( this.disabled )
	{
		return this.element_search.blur();
	}

	if ( this.focused )
	{
		return;
	}

	this.focused						= true;
	this.element_placeholder.value		= '';
	this.element_search.className		= classNameAdd( this.element_search, 'mm9_search_active' );
	this.element_container.className	= classNameAdd( this.element_container, 'mm9_search_container_active' );

	if ( this.keystackentry )
	{
		KeyDownHandlerStack_Remove( this.keystackentry );
	}

	this.keystackentry					= KeyDownHandlerStack_Add();
	KeyDownHandlerStackEntry_AddKeyCode( this.keystackentry, 13, function( e ) { self.Enter( e ); } );
	KeyDownHandlerStackEntry_AddKeyCode( this.keystackentry, 27, function( e ) { self.Esc( e ); } );
	KeyDownHandlerStackEntry_AddKeyCode( this.keystackentry, 85, function( e )
	{
		if ( e.ctrlKey )
		{
			self.Clear();
			return eventPreventDefault( e );
		}
	} );

	this.onFocus();
}

MMSearch.prototype.Blur = function()
{
	if ( !this.focused )
	{
		return;
	}

	this.focused						= false;
	this.element_search.className		= classNameRemove( this.element_search, 'mm9_search_active' );
	this.element_container.className	= classNameRemove( this.element_container, 'mm9_search_container_active' );

	if ( this.element_search.value.length == 0 )
	{
		this.element_placeholder.value	= this.placeholder_text;
	}

	if ( this.keystackentry )
	{
		KeyDownHandlerStack_Remove( this.keystackentry );

		this.keystackentry				= null;
	}

	this.onBlur();
}

MMSearch.prototype.HoverOver = function()
{
	if ( this.disabled )
	{
		return;
	}

	this.hovered						= true;
	this.element_container.className	= classNameAdd( this.element_container, 'mm9_search_container_hover' );
}

MMSearch.prototype.HoverOut = function()
{
	this.hovered						= false;
	this.element_container.className	= classNameRemove( this.element_container, 'mm9_search_container_hover' );
}

MMSearch.prototype.Disable = function()
{
	this.disabled						= true;
	this.element_container.className	= classNameAdd( this.element_container, 'mm9_search_container_disabled' );
	this.element_search.blur();
	this.Blur();
	this.HoverOut();
	this.onDisable();
}

MMSearch.prototype.Enable = function()
{
	this.disabled						= false;
	this.element_container.className	= classNameRemove( this.element_container, 'mm9_search_container_disabled' );

	this.onEnable();
}

MMSearch.prototype.Hide = function()
{
	this.visible							= false;
	this.element_container.style.display	= 'none';

	this.Blur();
	this.HoverOut();
}

MMSearch.prototype.Show = function()
{
	this.visible							= true;
	this.element_container.style.display	= '';
}

MMSearch.prototype.Visible = function()
{
	return this.visible;
}

MMSearch.prototype.onSearch = function( value ) { ; }
MMSearch.prototype.onDisable = function() { ; }
MMSearch.prototype.onEnable = function() { ; }
MMSearch.prototype.onFocus = function() { ; }
MMSearch.prototype.onBlur = function() { ; }

// MMMRUImageCache
////////////////////////////////////////////////////

function MMMRUImageCache()
{
	//
	// The class caches two things:
	//
	// 1.  The x most recent images (default: 100)
	// 2.  All constrained image metadata (default: 5000)
	//
	// Cached images are more strictly limited to prevent excessive browser memory consuption.
	// Image metadata, on the other hand, is relatively inexpensive to store locally, while
	// the round-trip request to load that data from the server is considerably more expensive.
	//

	this.delegator					= new AJAX_ThreadPool( 3 );
	this.cache_data					= new Array();
	this.cache_data_map				= new Object();
	this.cache_data_limit			= 100;
	this.cache_metadata				= new Array();
	this.cache_metadata_map			= new Object();
	this.cache_metadata_limit		= 5000;
}

MMMRUImageCache.prototype.SetDelegatorThreadCount = function( threads )
{
	this.delegator.SetThreadCount( threads );
}

MMMRUImageCache.prototype.SetDataCacheMostRecentLimit = function( limit )
{
	this.cache_data_limit = limit;
	this.Limit();
}

MMMRUImageCache.prototype.SetMetaDataCacheMostRecentLimit = function( limit )
{
	this.cache_metadata_limit = limit;
	this.Limit();
}

MMMRUImageCache.prototype.Limit = function()
{
	var key;

	while ( this.cache_data.length > this.cache_data_limit )
	{
		key = this.cache_data.pop();
		delete this.cache_data_map[ key ];
	}

	while ( this.cache_metadata.length > this.cache_metadata_limit )
	{
		key = this.cache_metadata.pop();
		delete this.cache_metadata_map[ key ];
	}
}

MMMRUImageCache.prototype.ImageData_Insert = function( key, image_data )
{
	var index;

	if ( ( index = this.cache_data.indexOf( key ) ) !== -1 )	this.cache_data.splice( index, 1 );
	else														this.cache_data_map[ key ] = image_data;

	this.cache_data.unshift( key );
	this.Limit();
}

MMMRUImageCache.prototype.ImageData_Remove = function( key )
{
	var index;

	if ( ( index = this.cache_data.indexOf( key ) ) !== -1 )
	{
		this.cache_data.splice( index, 1 );
	}

	delete this.cache_data_map[ key ];
}

MMMRUImageCache.prototype.ImageDataList_Empty = function()
{
	this.cache_data		= new Array();
	this.cache_data_map	= new Object();
}

MMMRUImageCache.prototype.ImageMetaData_Insert = function( key, image_file, width, height )
{
	var index;

	if ( ( index = this.cache_metadata.indexOf( key ) ) !== -1 )
	{
		this.cache_metadata.splice( index, 1 );
	}
	else
	{
		this.cache_metadata_map[ key ] =
		{
			image_file:	image_file,
			width:		width,
			height:		height
		};
	}

	this.cache_metadata.unshift( key );
	this.Limit();
}

MMMRUImageCache.prototype.ImageMetaData_Remove = function( key )
{
	var index;

	if ( ( index = this.cache_metadata.indexOf( key ) ) !== -1 )
	{
		this.cache_metadata.splice( index, 1 );
	}

	delete this.cache_data_map[ key ];
}

MMMRUImageCache.prototype.ImageMetaDataList_Empty = function()
{
	this.cache_metadata		= new Array();
	this.cache_metadata_map	= new Object();
}

MMMRUImageCache.prototype.Image_Load = function( image_id, width, height, onimagedataloaded )
{
	var self = this;
	var key = width + ':' + height + ':' + image_id;

	if ( this.cache_data_map.hasOwnProperty( key ) )
	{
		return this.GeneratedImage_Load_NearestConstrained_Callback( key, onimagedataloaded );
	}
	else if ( this.cache_metadata_map.hasOwnProperty( key ) )
	{
		this.ImageData_Load_Constrained( width, height, this.cache_metadata_map[ key ].image_file, this.cache_metadata_map[ key ].width, this.cache_metadata_map[ key ].height, function( image_data )
		{
			self.ImageData_Insert( key, image_data );
			self.GeneratedImage_Load_NearestConstrained_Callback( key, onimagedataloaded );
		} );

		return;
	}

	GeneratedImage_Load_NearestConstrained( image_id, width, height, function( response )
	{
		if ( !response.success )
		{
			return;
		}

		self.ImageMetaData_Insert( key, response.data.image_file, response.data.width, response.data.height );
		self.ImageData_Load_Constrained( width, height, response.data.image_file, response.data.width, response.data.height, function( image_data )
		{
			self.ImageData_Insert( key, image_data );
			self.GeneratedImage_Load_NearestConstrained_Callback( key, onimagedataloaded );
		} );
	}, this.delegator );

	this.delegator.Run();
}

MMMRUImageCache.prototype.GeneratedImage_Load_NearestConstrained_Callback = function( key, onimagedataloaded )
{
	if ( ( this.cache_data_map[ key ] !== null ) && ( typeof onimagedataloaded === 'function' ) )
	{
		onimagedataloaded( this.cache_data_map[ key ] );
	}
}

MMMRUImageCache.prototype.ImageData_Load_Constrained = function( requested_width, requested_height, image_file, width, height, callback )
{
	var image;

	image			= new Image();
	image.onerror	= function()
	{
		//
		// "null" is returned to allow the value to be "cached" so that
		// we don't attempt to re-load this image data, knowing that it
		// is not present on the server.
		//

		callback( null );
	};
	image.onload	= function()
	{
		var i, steps, canvas, factor, context, final_width, final_height, canvas_downsample, context_downsample;

		if ( width > height )
		{
			final_width		= requested_width;
			final_height	= requested_height * ( height / width );
		}
		else
		{
			final_width		= requested_width * ( width / height );
			final_height	= requested_height;
		}

		canvas				= newElement( 'canvas', { width: final_width, height: final_height }, null, null );
		context				= canvas.getContext( '2d' );

		if ( width <= requested_width && height <= requested_height )
		{
			//
			// Don't downsample, just draw it at the original size
			//

			context.drawImage( image, 0, 0 );
		}
		else
		{
			//
			// Downsample the image so we get a cleaner image, rather than a
			// blurry/pixelated version. If the browser supports the
			// CanvasRenderingContext2D.filter functionality, we'll use that
			// as it is better, otherwise, manually downsample in steps
			//

			canvas_downsample	= newElement( 'canvas', { width: width / 2, height: height / 2 }, null, null );
			context_downsample	= canvas_downsample.getContext( '2d' );

			if ( typeof context.filter !== 'undefined' )
			{
				canvas_downsample.width		= width;
				canvas_downsample.height	= height;

				steps						= ( canvas_downsample.width / canvas.width ) >> 1;
				context_downsample.filter	= 'blur(' + steps + 'px)';

				context_downsample.drawImage( image, 0, 0 );
				context.drawImage( canvas_downsample, 0, 0, canvas_downsample.width, canvas_downsample.height, 0, 0, canvas.width, canvas.height );
			}
			else
			{
				steps						= Math.ceil( Math.log( width / final_width ) / Math.log( 2 ) );
				factor						= 1 / Math.pow( 2, steps - 2 );
				canvas_downsample.width		= width * 0.5;
				canvas_downsample.height	= height * 0.5;

				context_downsample.drawImage( image, 0, 0, canvas_downsample.width, canvas_downsample.height );

				for ( i = 1; i < steps - 1; i++ )
				{
					context_downsample.drawImage( canvas_downsample, 0, 0, canvas_downsample.width * 0.5, canvas_downsample.height * 0.5 );
				}

				context.drawImage( canvas_downsample, 0, 0, canvas_downsample.width * factor, canvas_downsample.height * factor, 0, 0, canvas.width, ( height / width ) * canvas.width );
			}
		}

		callback( canvas.toDataURL( 'image/png' ) );
	};

	image.src		= image_file;
}

// MMCachedPreferences
////////////////////////////////////////////////////

function MMCachedPreferenceList_Update( key_array, value_array )
{
	var i, j, i_len, j_len, last_path, path_array;

	if ( typeof MMCachedPreferences === 'undefined' )
	{
		return;
	}

	if ( key_array && key_array.length && value_array && value_array.length )
	{
		for ( i = 0, i_len = key_array.length; i < i_len; i++ )
		{
			path_array	= key_array[ i ].split( '.' );
			last_path	= MMCachedPreferences;

			for ( j = 0, j_len = path_array.length; j < j_len; j++ )
			{
				if ( typeof last_path[ path_array[ j ] ] === 'undefined' )	last_path[ path_array[ j ] ] = new Object();
				if ( j == ( j_len - 1 ) )									last_path[ path_array[ j ] ] = value_array[ i ];

				last_path = last_path[ path_array[ j ] ];
			}
		}
	}
}

function MMCachedPreferenceList_Delete_Key( key )
{
	var i, i_len, last_path, path_array;

	if ( typeof MMCachedPreferences === 'undefined' )
	{
		return;
	}

	path_array	= key.split( '.' );
	last_path	= MMCachedPreferences;

	for ( i = 0, i_len = path_array.length; i < i_len; i++ )
	{
		if ( i == ( i_len - 1 ) )											delete last_path[ path_array[ i ] ];
		else if ( typeof last_path[ path_array[ i ] ] === 'undefined' )		return;

		last_path = last_path[ path_array[ i ] ];
	}
}

function MMCachedPreferenceList_Heirarchy( key_prefix )
{
	var i, i_len, path_array, preferencelist;

	if ( ( typeof MMCachedPreferences === 'undefined' ) || ( typeof key_prefix !== 'string' ) || ( key_prefix.length == 0 ) )
	{
		return null;
	}

	path_array			= key_prefix.split( '.' );
	preferencelist		= MMCachedPreferences;

	for ( i = 0, i_len = path_array.length; i < i_len; i++ )
	{
		if ( typeof preferencelist[ path_array[ i ] ] === 'undefined' )
		{
			return null;
		}

		preferencelist	= preferencelist[ path_array[ i ] ];
	}

	return preferencelist;
}

// KeyDown Stack Handler
////////////////////////////////////////////////////

var keydown_stack = new Array();

function KeyDownHandlerStack_Add( onEnter, onESC )
{
	var stack_entry = KeyDownHandlerStack_GenerateEntry( onEnter, onESC );

	KeyDownHandlerStack_AppendEntry( stack_entry );

	return stack_entry;
}

function KeyDownHandlerStack_AddAfterEntry( entry, onEnter, onESC )
{
	var stack_entry, entry_index;

	stack_entry = KeyDownHandlerStack_GenerateEntry( onEnter, onESC );
	entry_index	= arrayIndexOf( keydown_stack, entry );

	if ( entry_index == -1 )	KeyDownHandlerStack_AppendEntry( stack_entry );
	else						KeyDownHandlerStack_InsertEntry( entry_index + 1, stack_entry );

	return stack_entry;
}

function KeyDownHandlerStack_GenerateEntry( onEnter, onESC )
{
	var stack_entry;

	stack_entry							= new Object();
	stack_entry.keycode_actions			= new Object();
	stack_entry.keycode_actions[ 13 ]	= onEnter;
	stack_entry.keycode_actions[ 27 ]	= onESC;

	return stack_entry;
}

function KeyDownHandlerStack_AppendEntry( stack_entry )
{
	if ( keydown_stack.length == 0 )
	{
		AddEvent( document, 'keydown',	Stack_OnKeyDown );
	}

	keydown_stack.push( stack_entry );
	KeyDownHandlerStack_Collapse();
}

function KeyDownHandlerStack_InsertEntry( index, stack_entry )
{
	if ( keydown_stack.length == 0 )
	{
		AddEvent( document, 'keydown',	Stack_OnKeyDown );
	}

	keydown_stack.splice( index, 0, stack_entry );
	KeyDownHandlerStack_Collapse();
}

function KeyDownHandlerStack_Remove( stack_entry )
{
	var index;

	if ( ( index = arrayIndexOf( keydown_stack, stack_entry ) ) != -1 )
	{
		keydown_stack.splice( index, 1 );
	}

	if ( keydown_stack.length == 0 )
	{
		RemoveEvent( document, 'keydown', Stack_OnKeyDown );
	}

	KeyDownHandlerStack_Collapse();
}

function KeyDownHandlerStack_Collapse()
{
	keydown_stack = arrayFilter( keydown_stack, function( obj ) { return obj ? true : false; } );
}

function KeyDownHandlerStackEntry_AddKeyCode( stack_entry, keycode, action )
{
	stack_entry.keycode_actions[ keycode ] = action;
}

function KeyDownHandlerStackEntry_BubbleKeyCode( stack_entry, keycode )
{
	stack_entry.keycode_actions[ keycode ] = function( e )
	{
		var index;

		if ( ( index = arrayIndexOf( keydown_stack, stack_entry ) ) > 0 )
		{
			if ( typeof keydown_stack[ index - 1 ].keycode_actions[ keycode ] === 'function' )	return keydown_stack[ index - 1 ].keycode_actions[ keycode ]( e );
			else if ( typeof keydown_stack[ index - 1 ].keycode_actions[ '*' ] === 'function' )	return keydown_stack[ index - 1 ].keycode_actions[ '*' ]( e );
		}
	};
}

function KeyDownHandlerStackEntry_ManualBubbleKeyCode( e, stack_entry, keycode )
{
	var index;

	if ( ( index = arrayIndexOf( keydown_stack, stack_entry ) ) > 0 )
	{
		if ( typeof keydown_stack[ index - 1 ].keycode_actions[ keycode ] === 'function' )	return keydown_stack[ index - 1 ].keycode_actions[ keycode ]( e );
		else if ( typeof keydown_stack[ index - 1 ].keycode_actions[ '*' ] === 'function' )	return keydown_stack[ index - 1 ].keycode_actions[ '*' ]( e );
	}
}

function KeyDownHandlerStackEntry_BubbleUnsetKeyCodes( stack_entry )
{
	stack_entry.keycode_actions[ '*' ] = function( e )
	{
		var index, keycode;

		keycode = e.keyCode || e.which;

		if ( ( index = arrayIndexOf( keydown_stack, stack_entry ) ) > 0 )
		{
			if ( typeof keydown_stack[ index - 1 ].keycode_actions[ keycode ] === 'function' )	return keydown_stack[ index - 1 ].keycode_actions[ keycode ]( e );
			else if ( typeof keydown_stack[ index - 1 ].keycode_actions[ '*' ] === 'function' )	return keydown_stack[ index - 1 ].keycode_actions[ '*' ]( e );
		}
	};
}

function KeyDownHandlerStackEntry_RemoveKeyCode( stack_entry, keycode )
{
	stack_entry.keycode_actions[ keycode ] = null;
}

function Stack_OnKeyDown( e )
{
	var func, keycode, stack_entry, focus_element;

	if ( !e )
	{
		if ( ( e = window.event ) == null )
		{
			return true;
		}
	}

	if ( keydown_stack.length )
	{
		focus_element	= getFocusElement();
		stack_entry		= keydown_stack[ keydown_stack.length - 1 ];
		keycode			= e.keyCode || e.which;
		func			= null;

		if ( typeof stack_entry.keycode_actions[ keycode ] === 'function' )		func = stack_entry.keycode_actions[ keycode ];
		else if ( typeof stack_entry.keycode_actions[ '*' ] === 'function' )	func = stack_entry.keycode_actions[ '*' ];

		if ( func )
		{
			if ( e.keyCode == 13 && focus_element && focus_element.tagName )
			{
				if ( ( focus_element.tagName.toLowerCase() == 'input' && focus_element.type == 'button' ) ||
					 ( focus_element.tagName.toLowerCase() == 'textarea' ) ||
					 ( focus_element.tagName.toLowerCase() == 'a' && focus_element.href ) ||
					 ( isContentEditable( focus_element ) ) )
				{
					return true;
				}
			}

			return func( e );
		}
	}

	return true;
}

function MMCopyTextToClipboard( text, callback /* optional */ )
{
	var element_textarea;

	if ( navigator.clipboard )
	{
		navigator.clipboard.writeText( text ).then( function()
		{
			if ( typeof callback === 'function' )
			{
				callback();
			}
		}, function( e )
		{
			if ( typeof callback === 'function' )
			{
				callback( e );
			}
		} );

		return;
	}

	element_textarea				= newElement( 'textarea', { 'value': text }, null, null );
	element_textarea.style.position	= 'absolute';
	element_textarea.style.top		= '-99999px';
	element_textarea.style.left		= '-99999px';

	document.body.appendChild( element_textarea );

	element_textarea.focus();
	element_textarea.select();

	try
	{
		var successful = document.execCommand( 'copy' );

		if ( !successful )
		{
			throw new Error( 'Copy failed' );
		}

		if ( typeof callback === 'function' )
		{
			callback();
		}
	}
	catch ( e )
	{
		if ( typeof callback === 'function' )
		{
			callback( e );
		}
	}

	document.body.removeChild( element_textarea );
}

function MMPostMessageListen( onmessage, { destination = window, source = null } = {} )
{
	destination.addEventListener( 'message', ( e ) =>
	{
		if ( source !== null && e.source !== source )
		{
			return;
		}

		try
		{
			const data = JSON.parse( e.data );

			onmessage( data.command, data.data );
		}
		catch ( err )
		{
			if ( typeof e.data === 'string' && e.data.length )
			{
				onmessage( e.data, null );
			}
		}
	} );
}

// Font Embed Generator Functions
////////////////////////////////////////////////////

function FontEmbedGenerator_Google( fonts )
{
	if ( !Array.isArray( fonts ) || fonts.length === 0 )
	{
		return '';
	}

	const query_params = fonts.map( font =>
	{
		var family = `family=${encodeURIComponent( font.google_font_name )}:`;

		if ( font.styles.italic )
		{
			family += 'ital,';
		}

		const weight_map = new Array();

		if ( font.styles.normal )	weight_map.push( ...Object.keys( font.weights ).filter( key => font.weights[ key ] ).map( weight => `${font.styles.italic ? '0,' : '' }${weight}` ) );
		if ( font.styles.italic )	weight_map.push( ...Object.keys( font.weights ).filter( key => font.weights[ key ] ).map( weight => `1,${weight}` ) );

		family += `wght@${weight_map.join( ';' )}`;

		return family;
	} ).join( '&' );

	return `<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?${query_params}&display=swap" rel="stylesheet">`;
}

// Animation Functions
////////////////////////////////////////////////////

function InitializeAnimationFrame()
{
	var prefixlist, i, i_len;

	prefixlist							= [ 'ms', 'moz', 'webkit', 'o' ];

	for ( i = 0, i_len = prefixlist.length; i < i_len && !window.requestAnimationFrame; i++ )
	{
		window.requestAnimationFrame	= window[ prefixlist[ i ] + 'RequestAnimationFrame' ];
		window.cancelAnimationFrame		= window[ prefixlist[ i ] + 'CancelAnimationFrame' ] || window[ prefixlist[ i ] + 'CancelRequestAnimationFrame' ];
	}

	if ( !window.requestAnimationFrame )
	{
		window.requestAnimationFrame = function( callback, element )
		{
			return setTimeout( function() { callback(); }, 16 );
		};
	}

	if ( !window.cancelAnimationFrame )
	{
		window.cancelAnimationFrame = function( id )
		{
			clearTimeout( id );
		};
	}
}

InitializeAnimationFrame();

function createAnimation( opts )
{
	var animation = new Object();

	animation.duration	= opts.duration;
	animation.delay		= opts.delay;
	animation.animation = function( timePassed )
	{
		var progress, delta;

		if ( timePassed < opts.delay )				return;
		else if ( animation.mm_animation_complete )	return;

		if ( typeof opts.onstart === 'function' )
		{
			opts.onstart();
			opts.onstart = null;
		}

		if ( opts.duration == 0 )		progress = 1;
		else							progress = stod_max( ( timePassed - opts.delay ) / opts.duration, 1 );

		delta = opts.delta( progress );
		delta = stod_def( delta, 0 );
		opts.step( delta );

		if ( progress == 1 )
		{
			if ( opts.oncomplete )
			{
				opts.oncomplete();
				opts.oncomplete = null;
			}

			animation.mm_animation_complete = true;
		}
	}

	return animation;
}

function beginAnimations( animationlist, animation_id, onstart, oncomplete )
{
	var i, i_len, duration, start;

	animation_id	= animation_id ? animation_id : 'animation_id';
	duration		= 0;
	start			= new Date().getTime();

	for ( i = 0, i_len = animationlist.length; i < i_len; i++ )
	{
		if ( duration < ( animationlist[ i ].duration + animationlist[ i ].delay ) )
		{
			duration = animationlist[ i ].duration + animationlist[ i ].delay;
		}

		animationlist[ i ].mm_animation_complete = false;
	}

	if ( typeof onstart === 'function' )
	{
		onstart();
	}

	function Animate()
	{
		var i, i_len, progress, timePassed;

		if ( window[ animation_id ] )
		{
			cancelAnimationFrame( window[ animation_id ] );
			window[ animation_id ] = null;
		}

		timePassed = ( new Date().getTime() ) - start;

		for ( i = 0, i_len = animationlist.length; i < i_len; i++ )
		{
			animationlist[ i ].animation( timePassed );
		}

		if ( duration == 0 )	progress = 1;
		else					progress = stod_max( timePassed / duration, 1 );

		if ( progress == 1 )
		{
			if ( typeof oncomplete === 'function' )
			{
				oncomplete();
			}

			return;
		}

		window[ animation_id ] = requestAnimationFrame( Animate );
	}

	Animate();
}

function animationLinear( progress )
{
	return progress;
}

function animationBounce( progress )
{
	var a, b;

	for ( a = 0, b = 1; 1; a += b, b /= 2 )
	{
		if ( progress >= ( 7 - 4 * a ) / 11 )
		{
			return -Math.pow( ( 11 - 6 * a - 11 * progress ) / 4, 2 ) + Math.pow( b, 2 );
		}
	}
}

function makeEaseOut( delta )
{
	return function( progress )
	{
		return 1 - delta( 1 - progress );
	}
}

function animationCircular( progress )
{
	return ( 1 - Math.sin( Math.acos( progress ) ) );
}

function animationEaseOutCircular( progress )
{
	return ( 1 - Math.sin( Math.acos( progress ) ) );
}

function animationBack( progress, x )
{
	return Math.pow( progress, 2 ) * ( ( x + 1 ) * progress - x )
}

function animationPower( progress )
{
	return Math.pow( progress, 2 );
}

function makeEaseInOut( delta )
{
	return function( progress )
	{
		if ( progress < .5 )	return delta( 2 * progress ) / 2;
		else					return ( 2 - delta( 2 * ( 1 - progress ) ) ) / 2;
	}
}

var animationBounceEaseOut		= makeEaseOut( animationBounce );
var animationBounceEaseInOut	= makeEaseInOut( animationBounce );
var animationCircularEaseOut	= makeEaseOut( animationCircular );
var animationCircularEaseInOut	= makeEaseInOut( animationCircular );
