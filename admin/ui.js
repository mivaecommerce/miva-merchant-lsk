// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2025 Miva, Inc.  All rights reserved.
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
		else if ( node == 'mm-radio' && list[ i ].checked )
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

function MMLoadingIndicator( element_parent )
{
	var self = this;

	this.visible			= false;
	this.dimension			= 48;
	this.line_width			= 2;
	this.foreground_color	= '#539cff';
	this.loop_duration		= 3000;
	this.time_sync			= ( new Date() ).getTime();
	this.render_write		= function( data ) { self.Render_Write( data ); };

	this.element_canvas		= newElement( 'canvas',	{ 'class': 'mm_loading_indicator', 'width': this.dimension, 'height': this.dimension },	null, element_parent );
	this.context			= this.element_canvas.getContext( '2d' );
}

MMLoadingIndicator.prototype.SetDimension = function( dimension )
{
	this.dimension				= dimension;
	this.element_canvas.width	= this.dimension;
	this.element_canvas.height	= this.dimension;

	return this;
}

MMLoadingIndicator.prototype.SetLineWidth = function( line_width )
{
	this.line_width = line_width;
	return this;
}

MMLoadingIndicator.prototype.SetForegroundColor = function( foreground_color )
{
	this.foreground_color = foreground_color;
	return this;
}

MMLoadingIndicator.prototype.SetLoopDuration = function( loop_duration )
{
	this.loop_duration = loop_duration;
	return this;
}

MMLoadingIndicator.prototype.SetTimeSync = function( time_sync )
{
	this.time_sync = time_sync;
	return this;
}

MMLoadingIndicator.prototype.Show = function()
{
	if ( this.visible )
	{
		return;
	}

	this.visible = true;

	classNameAddIfMissing( this.element_canvas, 'visible' );
	MMRender_onRender_AddHook( null, this.render_write );

	this.onShow();
}

MMLoadingIndicator.prototype.Hide = function()
{
	if ( !this.visible )
	{
		return;
	}

	this.visible = false;

	classNameRemoveIfPresent( this.element_canvas, 'visible' );
	MMRender_onRender_RemoveHook( null, this.render_write );

	this.onHide();
}

MMLoadingIndicator.prototype.Render_Write = function( data )
{
	var delta, arc_end, arc_start;

	delta						= ( ( ( new Date() ).getTime() - this.time_sync ) % this.loop_duration ) / this.loop_duration;
	arc_start					= 360;
	arc_end						= 720;

	this.context.strokeStyle	= this.foreground_color;
	this.context.lineWidth		= this.line_width;
	this.context.lineCap		= 'round';

	this.context.clearRect( 0, 0, this.dimension, this.dimension );
	this.context.beginPath();

	if ( delta < .5 )	this.context.arc( this.dimension / 2, this.dimension / 2, ( Math.min( this.dimension, this.dimension ) / 2 ) - this.line_width, ( arc_start * ( Math.PI / 180 ) * ( delta * 2 ) ) - ( Math.PI / 2 ), ( arc_end * ( Math.PI / 180 ) * ( delta * 2 ) ) - ( Math.PI / 2 ), false );
	else				this.context.arc( this.dimension / 2, this.dimension / 2, ( Math.min( this.dimension, this.dimension ) / 2 ) - this.line_width, ( arc_end * ( Math.PI / 180 ) * ( delta * 2 ) ) - ( Math.PI / 2 ), ( arc_start * ( Math.PI / 180 ) * ( delta * 2 ) ) - ( Math.PI / 2 ), false );

	this.context.stroke();
}

MMLoadingIndicator.prototype.onShow = function() { ; }
MMLoadingIndicator.prototype.onHide = function() { ; }

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
	dispatchNewEvent( target,
					  type,
					  options ? options.screenX			: null,
					  options ? options.screenY			: null,
					  options ? options.clientX			: null,
					  options ? options.clientY			: null,
					  options ? options.ctrlKey			: null,
					  options ? options.altKey			: null,
					  options ? options.shiftKey		: null,
					  options ? options.metaKey			: null,
					  options ? options.button			: null,
					  options ? options.relatedTarget	: null );
}

function dispatchNewEvent( target, type, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget )
{
	var e;

	if ( document.createEvent )					// all browsers except IE before version 9
	{
		e			= document.createEvent( 'MouseEvent' );
		e.initMouseEvent( type, true, true, window, 0, screenX ? screenX : 0, screenY ? screenY : 0, clientX ? clientX : 0, clientY ? clientY : 0, ctrlKey ? ctrlKey : false, altKey ? altKey : false, shiftKey ? shiftKey : false, metaKey ? metaKey : false, button ? button : 0, relatedTarget ? relatedTarget : null );
		target.dispatchEvent( e );
	}
	else if ( document.createEventObject )		// IE before version 9
	{
		e			= document.createEventObject();
		e.button	= 1;						// left button is down
		e.screenX	= screenX ? screenX : 0;
		e.screenY	= screenY ? screenY : 0;
		e.clientX	= clientX ? clientX : 0;
		e.clientY	= clientY ? clientY : 0;
		e.ctrlKey	= ctrlKey ? ctrlKey : false;
		e.altKey	= altKey ? altKey : false;
		e.shiftKey	= shiftKey ? shiftKey : false;
		e.metaKey	= metaKey ? metaKey : false;

		target.fireEvent( 'on' + type, e );
	}
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
	var type = 'LEFT';

	if ( e.which )
	{
		if ( e.which == 3 )			type = 'RIGHT';
		else if ( e.which == 2 )	type = 'MIDDLE';
	}
	else if ( e.button )
	{
		if ( e.button == 2 )		type = 'RIGHT';
		else if ( e.button == 4 )	type = 'MIDDLE';
	}

	return type;
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
	return newElement( 'a', { 'class': 'mm9_button' }, null, parent ? parent : null );
}

MMButton.prototype.CreateToolTipMenuButton = function()
{
	if ( this.menubutton_tooltip )
	{
		return;
	}

	this.menubutton_tooltip = new MMMenuButton( '', this.button.tooltipElement );
	this.menubutton_tooltip.SetTabIndex( 1 );
	this.menubutton_tooltip.SetCustomContent( MivaSVGIconMapWithSpan( 'tooltip' ) );
	this.menubutton_tooltip.SetMenuAsRootMenu( true );
	this.menubutton_tooltip.SetClassName( 'mm_button_tooltip' );
	this.menubutton_tooltip.SetMenuClassName( 'mm_button_tooltip_menu' );
	this.menubutton_tooltip.SetButtonClassName( 'mm_button_tooltip_button' );
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
	var item, span;

	this.CreateToolTipMenuButton();
	this.menubutton_tooltip.Menu_Empty();

	if ( !ValueIsEmpty( node_or_text ) )
	{
		if ( typeof node_or_text !== 'string' )
		{
			item				= new MMMenuButton_Item( null, node_or_text );
		}
		else
		{
			span				= newElement( 'span', { 'class': 'mm_button_tooltip_menu_item_default' }, null, null );
			span.textContent	= node_or_text;
			item				= new MMMenuButton_Item( null, span );
		}

		item.SetNeverSelectable();
		this.menubutton_tooltip.MenuItem_Insert( item, -1 );
	}

	return this;
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

	this.ShowText();

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

	this.button.className	= classNameAdd( this.button, 'focus' );

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
	this.button.className = classNameRemove( this.button, 'focus' );
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

	this.button.className			= classNameAdd( this.button, 'active' );
	this.button.className			= classNameAdd( this.button, 'focus' );
	this.target						= e.target ? e.target : e.srcElement;

	doc.body.focus();
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
	var doc, win, target;

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
	this.button.className			= classNameRemove( this.button, 'active' );

	if ( this.target != target || getFocusElement() != this.button )
	{
		this.button.className		= classNameRemove( this.button, 'focus' );
	}

	doc.body.unselectable		= null;
	doc.onselectstart			= null;
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

	this.element_checkbox.className	= classNameAdd( this.element_checkbox, 'focus' );

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

	this.element_checkbox.className = classNameRemove( this.element_checkbox, 'focus' );
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

MMSelect.prototype.SetSelectOne = function( flag, text, value )
{
	this.flag_selectone	= flag;

	if ( typeof text !== 'undefined' )	this.text_selectone		= text;
	if ( typeof value !== 'undefined' )	this.value_selectone	= value;

	if ( this.flag_selectone )
	{
		this.AddOption( this.text_selectone, this.value_selectone );
	}

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

MMSelect.prototype.AddOption = function( text, value, /* optional */ option_display_element )
{
	return this.InsertOption( text, value, option_display_element, -1 );
}

MMSelect.prototype.InsertOption = function( text, value, /* optional */ option_display_element, index )
{
	var self = this;
	var option;

	index				= stoi_max( stoi_def_nonneg( index, this.options.length ), this.options.length );

	option				= new Object();
	option.text			= text;
	option.value		= value;
	option.element		= option_display_element;
	option.menu_option	= new MMMenuButton_Item( null, option_display_element ? option_display_element : option.text, function( event, option ) { self.SetValue( value ); }, option.value );

	this.menubutton.MenuItem_Insert( option.menu_option, index );
	this.options.splice( index, 0, option );

	if ( this.selectedIndex >= index && index !== this.options.length - 1 )
	{
		this.selectedIndex++;
	}
	else if ( this.selectedIndex === index && index === this.options.length - 1 )
	{
		this.SetSelectedIndex( index );
	}
	else if ( this.selectedIndex === -1 )
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

	this.loaded		= false;
	this.loading	= true;

	if ( ( this.deferred_selection === null ) && this.selectedIndex >= 0 && ( option = this.GetOptionAtIndex( this.selectedIndex ) ) !== null )
	{
		this.deferred_selection	= option.value;
	}

	this.SetLoading();

	if ( typeof this.func_load == 'function' )
	{
		this.func_load( params, function( response ) { self.Load_Callback( response ); } );
	}
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
		this.AddOption( this.text_selectone, this.value_selectone );
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

	if ( this.deferred_selection === null )
	{
		if ( original_index !== this.selectedIndex )
		{
			this.Change( this.GetValue( null ) );
		}
	}
	else
	{
		this.SetValue( this.deferred_selection );
		this.deferred_selection	= null;
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

	if ( ( typeof this.func_load == 'function' ) && !this.loaded )
	{
		this.deferred_selection = value;
		return;
	}

	original_index = this.selectedIndex;

	this.SetSelectedIndex( -1 );

	for ( i = 0, i_len = this.options.length; i < i_len; i++ )
	{
		if ( this.options[ i ].value === value )
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

	if ( this.loading || this.selectedIndex === -1 || ( option = this.GetOptionAtIndex( this.selectedIndex ) ) === null )
	{
		return default_value;
	}

	return option.value;
}

MMSelect.prototype.GetOption = function()
{
	var option;

	if ( this.loading || this.selectedIndex === -1 || ( option = this.GetOptionAtIndex( this.selectedIndex ) ) === null )
	{
		return null;
	}

	return option;
}

MMSelect.prototype.GetText = function( default_text )
{
	var option;

	if ( this.loading || this.selectedIndex === -1 || ( option = this.GetOptionAtIndex( this.selectedIndex ) ) === null )
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

	if ( ( option = this.GetOptionAtIndex( index ) ) !== null )
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
			 !this.options[ i ].menu_option.Visible() )
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
	var self = this;

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
	this.element_container						= newElement( 'span', 	{ 'class': 'mm_input_container' }, 			null, this.element_parent );
	this.element_title							= newElement( 'span', 	{ 'class': 'mm_input_title' },		 		null, this.element_container );
	this.element_title_text						= newElement( 'span', 	{ 'class': 'mm_input_title_text' },			null, this.element_title );
	this.element_title_tooltip					= newElement( 'span', 	{ 'class': 'mm_input_title_tooltip' }, 		null, this.element_title );
	this.element_input							= this.Create_Input( name, this.element_container );
	this.element_label							= newElement( 'span', 	{ 'class': 'mm_input_label' },		 		null, this.element_container );
	this.element_error_container				= newElement( 'span',	{ 'class': 'mm_input_error_container' },	null, null );
	this.element_error_message					= newElement( 'span',	{ 'class': 'mm_input_error_message' },		null, this.element_error_container );
	this.element_error_tail						= newElement( 'span',	{ 'class': 'mm_input_error_tail' },			null, this.element_error_container );

	this.element_input.tabIndex					= this.tab_index;

	this.event_render_autosize					= function() { self.Render_AutoSize(); self.render_autosize_id = requestAnimationFrame( self.event_render_autosize ); };
	this.event_render_error						= function() { self.Render_Error(); self.render_error_id = requestAnimationFrame( self.event_render_error ); };
	this.event_mouseover_container				= function( event ) { return self.Event_OnMouseOver_Container( event ? event : window.event ); }
	this.event_mouseout_container				= function( event ) { return self.Event_OnMouseOut_Container( event ? event : window.event ); }

	AddEvent( this.element_container,	'mousedown',	function( event ) { return self.Event_OnMouseDown_Container( event ? event : window.event ); } );
	AddEvent( this.element_input,		'focus',		function( event ) { return self.Event_OnFocus_Input( event ? event : window.event ); } );
	AddEvent( this.element_input,		'blur',			function( event ) { return self.Event_OnBlur_Input( event ? event : window.event ); } );
	AddEvent( this.element_input,		'change',		function( event ) { return self.Event_OnChange_Input( event ? event : window.event ); } );
	AddEvent( this.element_input,		'input',		function( event ) { return self.Event_OnInput_Input( event ? event : window.event ); } );
	AddEvent( this.element_input,		'keydown',		function( event ) { return self.Event_OnKeyDown_Input( event ? event : window.event ); } );
	AddEvent( this.element_input,		'keyup',		function( event ) { return self.Event_OnKeyUp_Input( event ? event : window.event ); } );
	AddEvent( this.element_input,		'cut',			function( event ) { return self.Event_OnCut_Input( event ? event : window.event ); } );
	AddEvent( this.element_input,		'paste',		function( event ) { return self.Event_OnPaste_Input( event ? event : window.event ); } );

	this.SetValue( this.value );
}

MMInput.prototype.Create_Input = function( name, parent )
{
	return newElement( 'input',	{ 'class': 'mm_input', 'name': name, 'type': 'text' }, null, parent );
}

MMInput.prototype.CreateToolTipMenuButton = function()
{
	if ( this.menubutton_tooltip )
	{
		return;
	}

	this.menubutton_tooltip = new MMMenuButton( '', this.element_title_tooltip );
	this.menubutton_tooltip.SetTabIndex( 1 );
	this.menubutton_tooltip.SetCustomContent( MivaSVGIconMapWithSpan( 'tooltip' ) );
	this.menubutton_tooltip.SetMenuAsRootMenu( true );
	this.menubutton_tooltip.SetClassName( 'mm_input_tooltip' );
	this.menubutton_tooltip.SetMenuClassName( 'mm_input_tooltip_menu' );
	this.menubutton_tooltip.SetButtonClassName( 'mm_input_tooltip_button' );
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
	var item, span;

	this.CreateToolTipMenuButton();
	this.menubutton_tooltip.Menu_Empty();

	if ( !ValueIsEmpty( node_or_text ) )
	{
		if ( typeof node_or_text !== 'string' )
		{
			item				= new MMMenuButton_Item( null, node_or_text );
		}
		else
		{
			span				= newElement( 'span', { 'class': 'mm_input_tooltip_menu_item_default' }, null, null );
			span.textContent	= node_or_text;
			item				= new MMMenuButton_Item( null, span );
		}

		item.SetNeverSelectable();
		this.menubutton_tooltip.MenuItem_Insert( item, -1 );
	}

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

MMInput.prototype.ClearInvalid = function()
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
	if ( this.error_visible )
	{
		return;
	}

	this.error_visible		= true;
	this.render_error_id	= requestAnimationFrame( this.event_render_error );

	document.body.appendChild( this.element_error_container );
	this.Redraw_Error();
}

MMInput.prototype.Hide_Error = function()
{
	if ( !this.error_visible )
	{
		return;
	}

	this.error_visible = false;
	this.element_error_container.parentNode.removeChild( this.element_error_container );
	cancelAnimationFrame( window[ this.render_error_id ] );
}

MMInput.prototype.Redraw_Error = function()
{
	var node, rect_node, dimensions, overflow_x, overflow_y, scrollfromtop, rect_container;
	var scrollfromleft, rect_error_container, rect_container_parent, rect_error_container_parent;

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

	overflow_x		= computedStyleValue( this.element_error_container.parentNode, 'overflow-x' );
	overflow_y		= computedStyleValue( this.element_error_container.parentNode, 'overflow-y' );
	scrollfromtop	= ( ( overflow_y === 'scroll' || overflow_y === 'auto' ) ? this.element_error_container.parentNode.scrollTop : 0 );
	scrollfromleft	= ( ( overflow_x === 'scroll' || overflow_x === 'auto' ) ? this.element_error_container.parentNode.scrollLeft : 0 );

	if ( ( rect_container.bottom + rect_error_container.height ) > dimensions.y )
	{
		this.element_error_container.style.top		= ( rect_container.top - rect_error_container.height - rect_error_container_parent.top + scrollfromtop ) + 'px';
		this.element_error_container.className		= classNameAdd( this.element_error_container, 'above' );
	}
	else
	{
		this.element_error_container.style.top		= ( rect_container.bottom - rect_error_container_parent.top + scrollfromtop ) + 'px';
		this.element_error_container.className		= classNameRemove( this.element_error_container, 'above' );
	}

	if ( this.error_match_container_width )
	{
		this.element_error_container.style.width	= rect_container.width + 'px';
	}
	else
	{
		this.element_error_container.style.width	= '';
	}

	this.element_error_container.style.left			= stoi_range( rect_container.left - rect_error_container_parent.left + scrollfromleft, 0 - rect_error_container_parent.left + scrollfromleft, dimensions.x - rect_error_container_parent.left + scrollfromleft ) + 'px';
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

		this.#element_container	= newElement( 'span', { 'class': 'mm_weight_input_container small' }, null, parent );

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
	var self = this;

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
	this.element_textarea_container			= newElement( 'span',		{ 'class': 'mm_textarea_container' }, 						null, this.element_container );
	this.element_textarea_scroller			= newElement( 'span',		{ 'class': 'mm_textarea_scroller' },						null, this.element_textarea_container );
	this.element_textarea_calculator 		= newElement( 'textarea',	{ 'class': 'mm_textarea_editor mm_textarea_calculator' },	null, this.element_textarea_scroller );
	this.element_textarea					= newElement( 'textarea',	{ 'class': 'mm_textarea_editor', 'name': name },			null, this.element_textarea_scroller );
	this.element_resizer					= newElement( 'span',		{ 'class': 'mm_textarea_resizer' },							null, this.element_textarea_container );
	this.element_resize_overlay				= newElement( 'span',		{ 'class': 'mm_textarea_resize_overlay' },					null, this.element_textarea_container );
	this.element_error_container			= newElement( 'span',		{ 'class': 'mm_textarea_error_container' },					null, null );
	this.element_error_message				= newElement( 'span',		{ 'class': 'mm_textarea_error_message' },					null, this.element_error_container );
	this.element_error_tail					= newElement( 'span',		{ 'class': 'mm_textarea_error_tail' },						null, this.element_error_container );

	this.event_render_read					= function( data ) { self.Render_Read( data ); };
	this.event_render_write					= function( data ) { self.Render_Write( data ); };
	this.event_resizer_mousedown			= function( event ) { return self.Event_ResizerMouseDown( event ? event : window.event ); };
	this.event_resizer_mousemove			= function( event ) { return self.Event_ResizerMouseMove( event ? event : window.event ); };
	this.event_resizer_mouseup				= function( event ) { return self.Event_ResizerMouseUp( event ? event : window.event ); };
	this.event_mouseover_textarea_container	= function( event ) { return self.Event_OnMouseOver_TextArea_Container( event ? event : window.event ); }
	this.event_mouseout_textarea_container	= function( event ) { return self.Event_OnMouseOut_TextArea_Container( event ? event : window.event ); }

	AddEvent( this.element_textarea_container,	'mousedown',	function( event ) { return self.Event_OnMouseDown_TextArea_Container( event ? event : window.event ); } );
	AddEvent( this.element_textarea,			'focus',		function( event ) { return self.Event_OnFocus_Input( event ? event : window.event ); } );
	AddEvent( this.element_textarea,			'blur',			function( event ) { return self.Event_OnBlur_Input( event ? event : window.event ); } );
	AddEvent( this.element_textarea,			'change',		function( event ) { return self.Event_OnChange_Input( event ? event : window.event ); } );
	AddEvent( this.element_textarea,			'keydown',		function( event ) { return self.Event_OnKeyDown_Input( event ? event : window.event ); } );
	AddEvent( this.element_textarea,			'keyup',		function( event ) { return self.Event_OnKeyUp_Input( event ? event : window.event ); } );
	AddEvent( this.element_textarea,			'cut',			function( event ) { return self.Event_OnCut_Input( event ? event : window.event ); } );
	AddEvent( this.element_textarea,			'paste',		function( event ) { return self.Event_OnPaste_Input( event ? event : window.event ); } );
	AddEvent( this.element_title,				'click',		function( event ) { return self.Event_OnClick_Title( event ? event : window.event ); } );

	MMRender_onRender_AddHook( this.event_render_read, this.event_render_write );

	this.SetValue( this.value );
	this.SetResizeEnabled();
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
	this.element_title.textContent = text;

	return this;
}

MMTextArea.prototype.SetName = function( name )
{
	this.element_textarea.name = name;
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

	if ( this.invalid )
	{
		if ( typeof error_message === 'string' && error_message.length && error_message !== this.element_error_message.textContent )
		{
			this.element_error_message.textContent = error_message;

			RemoveEvent( this.element_textarea_container, 'mouseover',	this.event_mouseover_textarea_container );
			RemoveEvent( this.element_textarea_container, 'mouseout',	this.event_mouseout_textarea_container );

			AddEvent( this.element_textarea_container, 'mouseover',	this.event_mouseover_textarea_container );
			AddEvent( this.element_textarea_container, 'mouseout',	this.event_mouseout_textarea_container );
		}

		return;
	}

	this.invalid = true;

	classNameAddIfMissing( this.element_container, 'invalid' );

	if ( typeof error_message === 'string' && error_message.length )
	{
		this.element_error_message.textContent = error_message;

		AddEvent( this.element_textarea_container, 'mouseover',	this.event_mouseover_textarea_container );
		AddEvent( this.element_textarea_container, 'mouseout',	this.event_mouseout_textarea_container );
	}

	this.onSetInvalid();
}

MMTextArea.prototype.ClearInvalid = function()
{
	if ( !this.invalid )
	{
		return;
	}

	this.invalid							= false;
	this.invalid_error_message				= '';
	this.element_error_message.textContent	= '';

	classNameRemoveIfPresent( this.element_container, 'invalid' );

	RemoveEvent( this.element_textarea_container, 'mouseover',	this.event_mouseover_textarea_container );
	RemoveEvent( this.element_textarea_container, 'mouseout',	this.event_mouseout_textarea_container );

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
	if ( this.error_visible )
	{
		return;
	}

	this.error_visible = true;

	this.onRetrieveErrorParent().appendChild( this.element_error_container );
	this.Redraw_Error();
}

MMTextArea.prototype.Hide_Error = function()
{
	if ( !this.error_visible )
	{
		return;
	}

	this.error_visible = false;

	this.element_error_container.parentNode.removeChild( this.element_error_container );
	cancelAnimationFrame( window[ this.render_error_id ] );
}

MMTextArea.prototype.Redraw_Error = function()
{
	var node, rect_node, dimensions, overflow_x, overflow_y, scrollfromtop, rect_container;
	var scrollfromleft, rect_error_container, rect_container_parent, rect_error_container_parent;

	if ( !this.error_visible )
	{
		return;
	}

	dimensions					= windowDimensions();
	rect_container				= this.element_textarea_container.getBoundingClientRect();
	rect_container_parent		= this.element_textarea_container.parentNode.getBoundingClientRect();
	rect_error_container		= this.element_error_container.getBoundingClientRect();
	rect_error_container_parent	= this.element_error_container.parentNode.getBoundingClientRect();

	if ( rect_container.bottom < 0 || rect_container.top > dimensions.y || rect_container.right < 0 || rect_container.left > dimensions.x )
	{
		this.element_error_container.style.visibility = 'hidden';
		return;
	}

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

	overflow_x		= computedStyleValue( this.element_error_container.parentNode, 'overflow-x' );
	overflow_y		= computedStyleValue( this.element_error_container.parentNode, 'overflow-y' );
	scrollfromtop	= ( ( overflow_y === 'scroll' || overflow_y === 'auto' ) ? this.element_error_container.parentNode.scrollTop : 0 );
	scrollfromleft	= ( ( overflow_x === 'scroll' || overflow_x === 'auto' ) ? this.element_error_container.parentNode.scrollLeft : 0 );

	if ( ( rect_container.bottom + rect_error_container.height ) > dimensions.y )
	{
		this.element_error_container.style.top		= ( rect_container.top - rect_error_container.height - rect_error_container_parent.top + scrollfromtop ) + 'px';
		this.element_error_container.className		= classNameAdd( this.element_error_container, 'above' );
	}
	else
	{
		this.element_error_container.style.top		= ( rect_container.bottom - rect_error_container_parent.top + scrollfromtop ) + 'px';
		this.element_error_container.className		= classNameRemove( this.element_error_container, 'above' );
	}

	if ( this.error_match_container_width )
	{
		this.element_error_container.style.width	= rect_container.width + 'px';
	}
	else
	{
		this.element_error_container.style.width	= '';
	}

	this.element_error_container.style.left			= stoi_range( rect_container.left - rect_error_container_parent.left + scrollfromleft, 0 - rect_error_container_parent.left + scrollfromleft, dimensions.x - rect_error_container_parent.left + scrollfromleft ) + 'px';
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

	if ( target === this.element_textarea )
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
	else if ( keycode === 13 && keySupportsMultiSelect( e ) )
	{
		return this.onEnter( e );
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
		default:
		{
			return '';
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
	return newElement( 'label', { 'class': 'mm9_button' }, null, parent ? parent : null );
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

function MMPlaceholderInput( parent, name, placeholder )
{
	var self = this;

	this.disabled								= false;
	this.focused								= false;
	this.keystackentry							= null;

	this.element_parent							= parent;
	this.element_container						= newElement( 'span', 	{ 'class': 'mm9_placeholderinput_container' }, 			null, this.element_parent );
	this.element_input_container				= newElement( 'span', 	{ 'class': 'mm9_placeholderinput_input_container' }, 	null, this.element_container );
	this.element_placeholder					= newElement( 'span', 	{ 'class': 'mm9_placeholderinput_placeholder' }, 		null, this.element_input_container );
	this.element_input							= this.Create_Input( name, this.element_input_container );

	if ( typeof document.createElement( 'input' ).placeholder !== 'undefined' )
	{
		this.element_placeholder.style.display	= 'none';
	}

	AddEvent( this.element_container,	'click',		function( event ) { self.SetFocus(); } );
	AddEvent( this.element_placeholder,	'mousedown',	function( event ) { self.SetFocus(); } );
	AddEvent( this.element_input,		'focus',		function( event ) { self.Focus(); } );
	AddEvent( this.element_input,		'blur',			function( event ) { self.Blur(); } );
	AddEvent( this.element_input,		'change',		function( event ) { self.Validate(); } );
	AddEvent( this.element_input,		'keyup',		function( event ) { return self.KeyUpHandler( event ? event : window.event ); } );

	this.SetPlaceholderText( placeholder );
}

MMPlaceholderInput.prototype.Create_Input = function( name, parent )
{
	 return newElement( 'input', { 'class': 'mm9_placeholderinput_input', 'name': name, 'type': 'text' }, null, parent ? parent : null );
}

MMPlaceholderInput.prototype.Enable = function()
{
	this.disabled						= false;
	this.element_input.disabled			= false;
	this.element_container.className	= classNameRemove( this.element_container, 'disabled' );
}

MMPlaceholderInput.prototype.Disable = function()
{
	this.disabled						= true;
	this.element_input.disabled			= true;
	this.element_container.className	= classNameAdd( this.element_container, 'disabled' );
}

MMPlaceholderInput.prototype.IsEnabled = function()
{
	return !this.disabled;
}

MMPlaceholderInput.prototype.SetFocus = function()
{
	if ( this.disabled )
	{
		return;
	}

	this.element_input.focus();
}

MMPlaceholderInput.prototype.SetValue = function( value )
{
	this.element_input.value = value;
}

MMPlaceholderInput.prototype.GetValue = function()
{
	return this.element_input.value;
}

MMPlaceholderInput.prototype.SetAutoComplete = function( autocomplete )
{
	this.element_input.autocomplete = autocomplete ? 'on' : 'off';
}

MMPlaceholderInput.prototype.SetPlaceholderText = function( placeholder_text )
{
	this.element_placeholder.innerHTML 			= '';
	this.element_placeholder.placeholder_value	= placeholder_text;
	this.element_input.placeholder				= placeholder_text;

	this.element_placeholder.appendChild( document.createTextNode( this.element_placeholder.placeholder_value ) );
}

MMPlaceholderInput.prototype.Container = function()
{
	return this.element_container;
}

MMPlaceholderInput.prototype.ContainedInput = function()
{
	return this.element_input;
}

MMPlaceholderInput.prototype.KeyUpHandler = function( e )
{
	if ( this.disabled )
	{
		return;
	}

	this.Validate();
}

MMPlaceholderInput.prototype.Focus = function()
{
	var self = this;

	if ( this.disabled )
	{
		return this.element_input.blur();
	}

	if ( this.focused )
	{
		return;
	}

	this.focused						= true;
	this.element_container.className	= classNameAdd( this.element_container, 'focus' );
	this.element_placeholder.innerHTML	= '';

	if ( this.keystackentry )
	{
		KeyDownHandlerStack_Remove( this.keystackentry );
	}

	this.keystackentry					= KeyDownHandlerStack_Add();
	KeyDownHandlerStackEntry_AddKeyCode( this.keystackentry, 13, function( e ) { return self.onEnter( e ); } );
	KeyDownHandlerStackEntry_AddKeyCode( this.keystackentry, 27, function( e ) { return self.onEsc( e ); } );
	KeyDownHandlerStackEntry_AddKeyCode( this.keystackentry, 85, function( e )
	{
		if ( e.ctrlKey )
		{
			self.Clear();
			return eventPreventDefault( e );
		}
	} );
}

MMPlaceholderInput.prototype.Blur = function( element )
{
	if ( !this.focused )
	{
		return;
	}

	this.focused						= false;
	this.element_container.className	= classNameRemove( this.element_container, 'focus' );

	if ( this.element_input.value.length == 0 )
	{
		this.element_placeholder.innerHTML = '';
		this.element_placeholder.appendChild( document.createTextNode( this.element_placeholder.placeholder_value ) );
	}

	if ( this.keystackentry )
	{
		KeyDownHandlerStack_Remove( this.keystackentry );

		this.keystackentry				= null;
	}
}

MMPlaceholderInput.prototype.Validate = function()
{
	if ( !this.onValidate() )
	{
		return false;
	}

	if ( this.GetValue().length )
	{
		this.element_placeholder.innerHTML = '';
	}

	return true;
}

MMPlaceholderInput.prototype.onEsc = function( e )
{
	if ( this.element_input.value.length )
	{
		return this.Clear();
	}

	this.element_input.blur();
}

MMPlaceholderInput.prototype.Clear = function()
{
	this.element_input.value = '';
}

MMPlaceholderInput.prototype.onValidate = function() { return true; };
MMPlaceholderInput.prototype.onEnter = function( e ) { ; };

// MMPlaceholderInput
////////////////////////////////////////////////////

function MMPlaceholderInput_Password( parent, name, placeholder )
{
	MMPlaceholderInput.call( this, parent, name, placeholder );
}

DeriveFrom( MMPlaceholderInput, MMPlaceholderInput_Password );

MMPlaceholderInput_Password.prototype.Create_Input = function( name, parent )
{
	 return newElement( 'input', { 'class': 'mm9_placeholderinput_input password', 'name': name, 'type': 'password' }, null, parent ? parent : null );
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
