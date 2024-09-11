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

function DeriveFrom( base_class, child_class )
{
	var placeholder;

	placeholder							= function() { ; }
	placeholder.prototype				= base_class.prototype;
	child_class.prototype				= new placeholder();
	child_class.prototype.constructor	= child_class;
}

function newElement( type, attributes, styles, parent )
{
	var element;

	element = document.createElement( type );

	setElementAttributes( element, attributes );
	setElementStyles( element, styles );

	if ( parent )
	{
		parent.appendChild( element );
	}

	return element;
}

function newTextNode( text, parent )
{
	var element;

	element	= document.createTextNode( text );

	if ( parent )
	{
		parent.appendChild( element );
	}

	return element;
}

function newTextNode_EmptyParent( text, parent )
{
	if ( parent )
	{
		parent.innerHTML = '';
	}

	return newTextNode( text, parent );
}

function setElementAttributes( element, attributes )
{
	var attribute;

	for ( attribute in attributes )
	{
		if ( !attributes.hasOwnProperty( attribute ) )
		{
			continue;
		}

		if ( attribute == 'name' )			element.name		= attributes[ attribute ];
		else if ( attribute == 'class' )	element.className	= attributes[ attribute ];
		else								element.setAttribute( attribute, attributes[ attribute ] );
	}
}

function setElementStyles( element, styles )
{
	var style;

	for ( style in styles )
	{
		if ( styles.hasOwnProperty( style ) )
		{
			element.style[ style ] = styles[ style ];
		}
	}
}

function classNameContains( element, classname, allow_regex_in_classname )
{
	var i, i_len, classlist;

	classlist		= element.className.split( /\s/ );

	for ( i = 0, i_len = classlist.length; i < i_len; i++ )
	{
		if ( classlist[ i ] == '' )																						continue;
		else if ( !allow_regex_in_classname && classlist[ i ] == classname )											return true;
		else if ( allow_regex_in_classname && classlist[ i ].match( new RegExp( '(?:^)' + classname + '(?:$)' ) ) )		return true;
	}

	return false;
}

function classNameReplace( element, classname, replacement_classname, allow_regex_in_classname )
{
	var i, i_len, classlist, new_classlist;

	new_classlist	= new Array();
	classlist		= element.className.split( /\s/ );

	for ( i = 0, i_len = classlist.length; i < i_len; i++ )
	{
		if ( classlist[ i ] == '' )																						continue;
		else if ( !allow_regex_in_classname && classlist[ i ] == classname )											continue;
		else if ( allow_regex_in_classname && classlist[ i ].match( new RegExp( '(?:^)' + classname + '(?:$)' ) ) )		continue;

		new_classlist.push( classlist[ i ] );
	}

	new_classlist.push( replacement_classname );

	return new_classlist.join( ' ' );
}

function classNameReplaceIfAltered( element, classname, replacement_classname, allow_regex_in_classname )
{
	var new_classlist, original_classlist;

	original_classlist		= element.className.split( /\s/ ).map( function( filter_classname ) { return trim( filter_classname ); } );
	original_classlist		= original_classlist.filter( function( filter_classname ) { return filter_classname !== ''; } );
	new_classlist			= original_classlist.filter( function( filter_classname )
	{
		if ( filter_classname === replacement_classname )
		{
			return false;
		}

		if ( !allow_regex_in_classname )
		{
			return filter_classname !== classname;
		}

		return !filter_classname.match( new RegExp( '(?:^)' + classname + '(?:$)' ) );
	} );

	new_classlist.push( replacement_classname );

	new_classlist.sort();
	original_classlist.sort();

	if ( !compareObjects( original_classlist, new_classlist ) )
	{
		element.className = new_classlist.join( ' ' );
	}
}

function classNameAdd( element, classname )
{
	var new_classlist, original_classlist;

	original_classlist		= element.className.split( /\s/ ).map( function( filter_classname ) { return trim( filter_classname ); } );
	new_classlist			= original_classlist.filter( function( filter_classname ) { return ( filter_classname !== '' && filter_classname !== classname ); } );

	new_classlist.push( classname );

	return new_classlist.join( ' ' );
}

function classNameAddIfMissing( element, classname )
{
	var new_classlist, original_classlist;

	if ( Array.isArray( classname ) )
	{
		return classNameAddListIfMissing( element, classname );
	}

	original_classlist		= element.className.split( /\s/ ).map( function( filter_classname ) { return trim( filter_classname ); } );
	original_classlist		= original_classlist.filter( function( filter_classname ) { return filter_classname !== ''; } );
	new_classlist			= original_classlist.filter( function( filter_classname ) { return filter_classname !== classname; } );

	new_classlist.push( classname );

	new_classlist.sort();
	original_classlist.sort();

	if ( !compareObjects( original_classlist, new_classlist ) )
	{
		element.className = new_classlist.join( ' ' );
	}
}

function classNameAddList( element, classnamelist )
{
	var new_classlist, original_classlist;

	original_classlist	= element.className.split( /\s/ ).map( function( filter_classname ) { return trim( filter_classname ); } );
	new_classlist		= original_classlist.filter( function( filter_classname ) { return filter_classname !== '' && classnamelist.indexOf( filter_classname ) === -1; } );
	new_classlist		= new_classlist.concat( classnamelist );

	return new_classlist.join( ' ' );
}

function classNameAddListIfMissing( element, classnamelist )
{
	var new_classlist, original_classlist;

	original_classlist		= element.className.split( /\s/ ).map( function( filter_classname ) { return trim( filter_classname ); } );
	original_classlist		= original_classlist.filter( function( filter_classname ) { return filter_classname !== ''; } );
	new_classlist			= original_classlist.filter( function( filter_classname ) { return classnamelist.indexOf( filter_classname ) === -1; } );
	new_classlist			= new_classlist.concat( classnamelist );

	new_classlist.sort();
	original_classlist.sort();

	if ( !compareObjects( original_classlist, new_classlist ) )
	{
		element.className = new_classlist.join( ' ' );
	}
}

function classNameRemove( element, classname, allow_regex_in_classname )
{
	var new_classlist, original_classlist;

	original_classlist		= element.className.split( /\s/ ).map( function( filter_classname ) { return trim( filter_classname ); } );
	new_classlist			= original_classlist.filter( function( filter_classname )
	{
		if ( filter_classname === '' )			return false;
		else if ( !allow_regex_in_classname )	return filter_classname !== classname;

		return !filter_classname.match( new RegExp( '(?:^)' + classname + '(?:$)' ) );
	} );

	return new_classlist.join( ' ' );
}

function classNameRemoveIfPresent( element, classname, allow_regex_in_classname )
{
	var new_classlist, original_classlist;

	if ( Array.isArray( classname ) )
	{
		return classNameRemoveListIfPresent( element, classname, allow_regex_in_classname );
	}

	original_classlist		= element.className.split( /\s/ ).map( function( filter_classname ) { return trim( filter_classname ); } );
	original_classlist		= original_classlist.filter( function( filter_classname ) { return filter_classname !== ''; } );
	new_classlist			= original_classlist.filter( function( filter_classname )
	{
		if ( !allow_regex_in_classname )
		{
			return filter_classname !== classname;
		}

		return !filter_classname.match( new RegExp( '(?:^)' + classname + '(?:$)' ) );
	} );

	new_classlist.sort();
	original_classlist.sort();

	if ( !compareObjects( original_classlist, new_classlist ) )
	{
		element.className = new_classlist.join( ' ' );
	}
}

function classNameRemoveList( element, classnamelist, allow_regex_in_classname )
{
	var new_classlist, original_classlist;

	original_classlist		= element.className.split( /\s/ ).map( function( filter_classname ) { return trim( filter_classname ); } );
	new_classlist			= original_classlist.filter( function( filter_classname )
	{
		var i, i_len;

		if ( filter_classname === '' )			return false;
		else if ( !allow_regex_in_classname )	return classnamelist.indexOf( filter_classname ) === -1;

		for ( i = 0, i_len = classnamelist.length; i < i_len; i++ )
		{
			if ( filter_classname.match( new RegExp( '(?:^)' + classnamelist[ i ] + '(?:$)' ) ) )
			{
				return false;
			}
		}

		return true;
	} );

	return new_classlist.join( ' ' );
}

function classNameRemoveListIfPresent( element, classnamelist, allow_regex_in_classname )
{
	var new_classlist, original_classlist;

	original_classlist		= element.className.split( /\s/ ).map( function( filter_classname ) { return trim( filter_classname ); } );
	original_classlist		= original_classlist.filter( function( filter_classname ) { return filter_classname !== ''; } );
	new_classlist			= original_classlist.filter( function( filter_classname )
	{
		var i, i_len;

		if ( !allow_regex_in_classname )
		{
			return classnamelist.indexOf( filter_classname ) === -1;
		}

		for ( i = 0, i_len = classnamelist.length; i < i_len; i++ )
		{
			if ( filter_classname.match( new RegExp( '(?:^)' + classnamelist[ i ] + '(?:$)' ) ) )
			{
				return false;
			}
		}

		return true;
	} );

	new_classlist.sort();
	original_classlist.sort();

	if ( !compareObjects( original_classlist, new_classlist ) )
	{
		element.className = new_classlist.join( ' ' );
	}
}

function computedStyleValue( element, property )
{
	if ( element instanceof Element )
	{
		return window.getComputedStyle( element, null ).getPropertyValue( property )
	}
	else if ( element.ownerDocument && element.ownerDocument.defaultView && element instanceof element.ownerDocument.defaultView.Element )
	{
		return element.ownerDocument.defaultView.getComputedStyle( element, null ).getPropertyValue( property );
	}

	return returnUndefined()
}

function elementExistsInNodeType( element, type )
{
	while ( element )
	{
		if ( element.nodeName.toLowerCase() == type.toLowerCase() )
		{
			return true;
		}

		element = element.parentNode;
	}

	return false;
}

function getNearestElementAncestorNodeTypeOrNull( element, type /* can be comma separated string */ )
{
	var typelist = type.toLowerCase().split( ',' );

	while ( element )
	{
		if ( typelist.indexOf( element.nodeName.toLowerCase() ) != -1 )
		{
			return element;
		}

		element = element.parentNode;
	}

	return null;
}

function getNearestElementAncestorWithStyleValue( element, property, value /* can be comma separated string */ )
{
	var style, valuelist;

	valuelist = value.toLowerCase().split( ',' );

	while ( element )
	{
		style = computedStyleValue( element, property );

		if ( typeof style === 'string' && valuelist.indexOf( style.toLowerCase() ) !== -1 )
		{
			return element;
		}

		element = element.parentNode;
	}

	return null;
}

function getPreviousTreeNode( start_node, root_node )
{
	if ( start_node === root_node )
	{
		return null;
	}
	else if ( start_node.previousSibling )
	{
		if ( start_node.previousSibling.hasChildNodes() )
		{
			return start_node.previousSibling.childNodes[ start_node.previousSibling.childNodes.length - 1 ];
		}

		return start_node.previousSibling;
	}
	else if ( start_node.parentNode && start_node.parentNode !== root_node )
	{
		return start_node.parentNode;
	}

	return null;
}

function getNextTreeNode( start_node, root_node )
{
	var current_node;

	if ( start_node.hasChildNodes() )
	{
		return start_node.childNodes[ 0 ];
	}
	else if ( start_node !== root_node )
	{
		if ( start_node.nextSibling )
		{
			return start_node.nextSibling;
		}
		else
		{
			current_node = start_node;

			while ( current_node = current_node.parentNode )
			{
				if ( current_node === root_node )
				{
					return null;
				}
				else if ( current_node.nextSibling )
				{
					return current_node.nextSibling;
				}
			}
		}
	}

	return null;
}

function getScopedElementsByClassName( className, scope )
{
    var regex_match, all_elements, results, i;
    
    regex_match     = new RegExp( "(?:^|\\s)" + className + "(?:$|\\s)" );
    all_elements    = scope.getElementsByTagName( '*' );
    results         = [];
    
    for ( i = 0; all_elements[ i ] != null; i++ )
    {
        if ( typeof all_elements[ i ].className === 'string' && ( all_elements[ i ].className.indexOf( className ) != -1 ) && regex_match.test( all_elements[ i ].className ) )
        {
            results.push( all_elements[ i ] );
        }
    }
    
    return results;
}

function getScopedElementByName( name, parent_element )
{
	var i, i_len, children;

	children = parent_element.getElementsByTagName( '*' );

	if ( children )
	{
		for ( i = 0, i_len = children.length; i < i_len; i++ )
		{
			if ( children[ i ].name == name )
			{
				return children[ i ];
			}
		}
	}

	return null;
}

function containsChild( parent_elem, element )
{
	if ( element )
	{
		while ( ( element = element.parentNode ) != null )
		{
			if ( element === parent_elem )
			{
				return true;
			}
		}
	}

	return false;
}

function getScrollOffset( e )
{
	if ( e.type == 'wheel' )									return { x: -e.deltaX, y: -e.deltaY };
	else if ( ( e.deltaX || e.deltaY ) && e.deltaMode == 0 )	return { x: ( e.deltaX ? -e.deltaX : 0 ), y: ( e.deltaY ? -e.deltaY : 0 ) };
	else if ( ( e.deltaX || e.deltaY ) && e.deltaMode != 0 )	return { x: ( e.deltaX ? -e.deltaX * 18 : 0 ), y: ( e.deltaY ? -e.deltaY * 18 : 0 ) };
	else if ( e.wheelDeltaX || e.wheelDeltaY )					return { x: ( originalEvent.wheelDeltaX ? ( originalEvent.wheelDeltaX / 2 ) : 0 ), y: ( originalEvent.wheelDeltaY ? ( originalEvent.wheelDeltaY / 2 ) : ( -originalEvent.wheelDelta / 2 ) ) };
	else if ( e.detail )										return { x: 0, y: -originalEvent.detail * 18 };
	else														return { x: 0, y: ( e.wheelDelta ? e.wheelDelta / 2 : 0 ) };
}

function offsetLeft( element )
{
	var offset = 0;

	while ( element )
	{
		offset += element.offsetLeft;
		element = element.offsetParent;
	}

	return offset;
}

function offsetTop( element )
{
	var offset = 0;

	while ( element )
	{
		offset += element.offsetTop;
		element = element.offsetParent;
	}

	return offset;
}

function testBoxModel()
{
	var div;

	div							= document.createElement( 'div' );
	div.style.width				= '1px';
	div.style.paddingLeft		= '1px';

	document.body.appendChild( div );

	window.boxModelSupported	= div.offsetWidth === 2;
	window.boxModelTested		= true;

	document.body.removeChild( div ).style.display = 'none';
}

function getScrollTop()
{
	if ( !window.boxModelTested ) // box model support must be done after document.body loads
	{
		testBoxModel();
	}

	if ( 'pageYOffset' in window )			return window.pageYOffset;
	else if ( window.boxModelSupported )	return document.documentElement.scrollTop;
	else									return document.body.scrollTop;
}

function getScrollLeft()
{
	if ( !window.boxModelTested ) // box model support must be done after document.body loads
	{
		testBoxModel();
	}

	if ( 'pageXOffset' in window )			return window.pageXOffset;
	else if ( window.boxModelSupported )	return document.documentElement.scrollLeft;
	else									return document.body.scrollLeft;
}

function cursorToEnd( element )
{
	var range;

	element.focus();

    if ( typeof element.selectionStart == 'number' )
	{
        element.selectionStart	= element.value.length;
		element.selectionEnd	= element.value.length;
    }
	else if ( typeof element.createTextRange != 'undefined' )
	{
        range = element.createTextRange();

        range.collapse( false );
        range.select();
    }
}

function clearTextSelection()
{
	var range;

	if ( window.getSelection )
	{
		range = window.getSelection();
		range.removeAllRanges();
	}
	else if ( document.selection && document.body.createTextRange )
	{
		range = document.body.createTextRange();
		range.collapse( true );
		range.select();
	}
}

function keySupportsMultiSelect( e )
{
	if ( e.ctrlKey || e.metaKey ) // In general, e.metaKey is the Command key on Mac and the Windows key on Windows. 
	{
		return true;
	}

	return false;
}

function eventStopPropagation( event )
{
	if ( event.stopPropagation )
	{
		return event.stopPropagation();
	}

	event.cancelBubble = true;
}

function eventPreventDefault( event )
{
	if ( event.preventDefault )
	{
		return event.preventDefault();
	}

	event.returnValue = false;

	return false;
}

function returnUndefined()
{
	return;
}

function AddEvent( obj, eventType, fn )
{
	try
	{
		obj.addEventListener( eventType, fn, false );
		return true;
	}
	catch ( e )
	{
		try
		{
			return obj.attachEvent( 'on' + eventType, fn );
		}
		catch ( e )
		{
			return false;
		}
	}
}

function RemoveEvent( obj, eventType, fn )
{
	try
	{
		obj.removeEventListener( eventType, fn, false );
		return true;
	}
	catch ( e )
	{
		try
		{
			return obj.detachEvent( 'on' + eventType, fn );
		}
		catch ( e )
		{
			return false;
		}
	}
}

function AddScrollEvent( element, original_callback )
{
	var event_type, callback;

	if ( 'onwheel' in document.createElement( 'div' ) )	event_type = 'wheel';			// IE 9+, FF 17+
	else if ( document.onmousewheel !== undefined )		event_type = 'mousewheel';		// IE 8-, Chrome, Safari
	else												event_type = 'DOMMouseScroll';	// FF 16-

	callback = function( originalEvent )
	{
		var event, mousepos;

		mousepos						= captureMousePosition( originalEvent );
		event							= new Object();
		event.target					= originalEvent.target || originalEvent.srcElement;
		event.timeStamp					= originalEvent.timeStamp ? originalEvent.timeStamp : new Date();
		event.eventPhase				= originalEvent.eventPhase;
		event.defaultPrevented			= originalEvent.defaultPrevented;
		event.currentTarget				= originalEvent.currentTarget;
		event.cancelable				= originalEvent.cancelable;
		event.bubbles					= originalEvent.bubbles;
		event.type						= 'wheel';
		event.pageX						= mousepos.x;
		event.pageY						= mousepos.y;
		event.screenX					= originalEvent.screenX;
		event.screenY					= originalEvent.screenY;
		event.clientX					= originalEvent.clientX;
		event.clientY					= originalEvent.clientY;
		event.ctrlKey					= originalEvent.ctrlKey;
		event.altKey					= originalEvent.altKey;
		event.shiftKey					= originalEvent.shiftKey;
		event.metaKey					= originalEvent.metaKey;
		event.button					= originalEvent.button;
		event.relatedTarget				= originalEvent.relatedTarget;
		event.deltaMode					= 0;
		event.deltaZ					= originalEvent.deltaZ || 0;
		event.preventDefault			= function() { originalEvent.preventDefault ? originalEvent.preventDefault() : originalEvent.returnValue = false; };
		event.stopPropagation			= function() { originalEvent.stopPropagation ? originalEvent.stopPropagation() : originalEvent.cancelBubble = true; };
		event.stopImmediatePropagation	= originalEvent.stopImmediatePropagation;
            
		// calculate deltaY (and deltaX) according to the event
		if ( event_type == 'wheel' )
		{
			event.deltaY				= ( originalEvent.deltaMode == 0 ? originalEvent.deltaY : ( originalEvent.deltaMode == 1 ? originalEvent.deltaY * 18 : 0 ) );
			event.deltaX				= ( originalEvent.deltaMode == 0 ? originalEvent.deltaX : ( originalEvent.deltaMode == 1 ? originalEvent.deltaX * 18 : 0 ) );
		}
		else if ( event_type == 'mousewheel' )
		{
			event.deltaY				= ( originalEvent.wheelDeltaY ? ( -originalEvent.wheelDeltaY / 2 ) : ( -originalEvent.wheelDelta / 2 ) );
			event.deltaX				= ( originalEvent.wheelDeltaX ? ( -originalEvent.wheelDeltaX / 2 ) : 0 );
		}
		else
		{
			event.deltaY				= originalEvent.detail * 18;
			event.deltaX				= 0;
		}

		return original_callback( event );
	};
	original_callback.callback			= callback;

	AddEvent( element, event_type, callback );
}

function RemoveScrollEvent( element, original_callback )
{
	var event_type;

	if ( 'onwheel' in document.createElement( 'div' ) )	event_type = 'wheel';			// IE 9+, FF 17+
	else if ( document.onmousewheel !== undefined )		event_type = 'mousewheel';		// IE 8-, Chrome, Safari
	else												event_type = 'DOMMouseScroll';	// FF 16-

	RemoveEvent( element, event_type, original_callback.callback );
	original_callback.callback = null;
}

function AddClickEvent( element, onclick )
{
	element.mm_event_mousedown		= function( event ) { return element.Event_OnMouseDown( event ? event : window.event ); };
	element.mm_event_mouseup		= function( event ) { return element.Event_OnMouseUp( event ? event : window.event ); };

	element.Event_OnMouseDown = function( e )
	{
		AddEvent( document,	'mouseup',	element.mm_event_mouseup );
		AddEvent( window,	'blur',		element.mm_event_mouseup );

		eventStopPropagation( e );
		return true;
	}

	element.Event_OnMouseUp = function( e )
	{
		var target = e.target;

		RemoveEvent( document,	'mouseup',	element.mm_event_mouseup );
		RemoveEvent( window,	'blur',		element.mm_event_mouseup );

		if ( mouseClickType( e ) == 'RIGHT' )
		{
			return true;
		}

		if ( target !== element && !containsChild( element, target ) )
		{
			return true;
		}

		if ( typeof onclick === 'function' )
		{
			onclick( e );
		}

		eventStopPropagation( e );
		return eventPreventDefault( e );
	}

	AddEvent( element, 'mousedown',	element.mm_event_mousedown );
}

function RemoveClickEvent( element, onclick )
{
	RemoveEvent( element,	'mousedown',	element.mm_event_mousedown );
	RemoveEvent( document,	'mouseup',		element.mm_event_mouseup );
	RemoveEvent( window,	'blur',			element.mm_event_mouseup );
}

function regexEscape( text )
{
	return text.replace( new RegExp( '[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]', 'g' ), '\\$&' ); // Compare to PHP's preg_quote function
}

function sortAlphaNumeric( a, b, sort_asc )
{
	var regex_alpha, regex_numeric, replaced_a_alpha, replaced_b_alpha, replaced_a_numeric, replaced_b_numeric;

	regex_alpha				= new RegExp( '[^a-zA-Z]', 'g' );
	regex_numeric			= new RegExp( '[^0-9]', 'g' );

	replaced_a_alpha		= a.replace( regex_alpha, '' );
	replaced_b_alpha		= b.replace( regex_alpha, '' );

	if ( replaced_a_alpha === replaced_b_alpha )
	{
		replaced_a_numeric	= stoi( a.replace( regex_numeric, '' ) );
		replaced_b_numeric	= stoi( b.replace( regex_numeric, '' ) );

		return ( replaced_a_numeric === replaced_b_numeric ) ? 0 : ( ( replaced_a_numeric > replaced_b_numeric ) ? ( sort_asc ? 1 : -1 ) : ( sort_asc ? -1 : 1 ) );
	}

	return ( replaced_a_alpha > replaced_b_alpha ) ? ( sort_asc ? 1 : -1 ) : ( sort_asc ? -1 : 1 );
}

function stringIntersect( string_a, string_b )
{
	var i, j, i_len, j_len, grid, match, temp_string, longest_common_substring;

	match						= '';
	longest_common_substring	= 0;

	if ( string_b.length > string_a.length )
	{
		temp_string				= string_b;
		string_b				= string_a;
		string_a				= temp_string;
	}

    grid = new Array( string_a.length );

	for ( i = 0, i_len = string_a.length; i < i_len; i++ )
	{
		grid[ i ] = new Array( string_b.length );

		for ( j = 0, j_len = string_b.length; j < j_len; j++ )
		{
			grid[ i ][ j ] = 0;
		}
	}

	for ( i = 0, i_len = string_a.length; i < i_len; i++ )
	{
		for ( j = 0, j_len = string_b.length; j < j_len; j++ )
		{
			if ( string_a.charAt( i ) == string_b.charAt( j ) )
			{
				if ( i == 0 || j == 0 )		grid[ i ][ j ] = 1;
				else						grid[ i ][ j ] = grid[ i - 1 ][ j - 1 ] + 1;

				if ( grid[ i ][ j ] > longest_common_substring )
				{
					longest_common_substring	= grid[ i ][ j ];
					match						= '';
				}

				if ( grid[ i ][ j ] == longest_common_substring )
				{
					match = string_a.substring( i - longest_common_substring + 1, i + 1 );
				}
			}
		}
	}

	if ( ( ( string_b.indexOf( match ) == 0 ) && ( string_a.indexOf( match ) == ( string_a.length - match.length ) ) ) ||
		 ( ( string_a.indexOf( match ) == 0 ) && ( string_b.indexOf( match ) == ( string_b.length - match.length ) ) ) )
	{
		return match;
	}

    return '';
}

function textContent( element )
{
	if ( typeof( element.textContent ) != 'undefined' )	return element.textContent;
	if ( typeof( element.innerText ) != 'undefined' )	return element.innerText;

	return '';
}

function captureMousePosition( e ) 
{
	var x, y;
	
	if ( e.pageX || e.pageY ) 
	{
		x = e.pageX;
		y = e.pageY;
	}
	else if ( e.clientX || e.clientY ) 
	{
		x = e.clientX + getScrollLeft();
		y = e.clientY + getScrollTop();
	}

	return { x: x, y: y };
}

function getQueryStringAsArray()
{
	var result, results
	var querystring, regex, element;

	results				= new Array();
	querystring			= document.location.search.substring( 1 );
	regex				= /([^&=]+)=([^&]*)/g;

	while ( ( element = regex.exec( querystring ) ) != null )
	{
		result			= new Object();
		result.name		= element[ 1 ];
		result.value	= element[ 2 ];

		results.push( result );
	}

	return results;
}

function arrayIndexOf( array, element )
{
	var i;

	if ( array.indexOf )
	{
		return array.indexOf( element );
	}

	for ( i = 0; i < array.length; i++ )
	{
		if ( array[ i ] === element )
		{
			return i;
		}
	}

	return -1;
}

function arrayMove( arr, old_index, new_index )
{
	var k;

    while ( old_index < 0 ) old_index += arr.length;
    while ( new_index < 0 ) new_index += arr.length;

    if ( new_index >= arr.length )
    {
        k = new_index - arr.length;
        while ( ( k-- ) + 1 )
        {
            arr.push( undefined );
        }
    }

    arr.splice( new_index, 0, arr.splice( old_index, 1 )[ 0 ] );
}

function arrayFilter( array, func, passed_this )
{
	var i, i_len, value, result;

	if ( array.filter )
	{
		return array.filter( func, passed_this );
	}

	if ( array == null )					throw new TypeError();
	else if ( typeof func !== 'function' )	throw new TypeError();

	result		= new Array();

	for ( i = 0, i_len = array.length; i < i_len; i++ )
	{
		value = array[ i ];
		if ( func.call( passed_this, value, i, array ) )
		{
			result.push( value );
		}
	}

	return result;
}

function arrayFind( array, func, passed_this )
{
	var i, i_len, value;

	if ( array.find )
	{
		return array.find( func, passed_this );
	}

	if ( array == null )					throw new TypeError();
	else if ( typeof func !== 'function' )	throw new TypeError();

	for ( i = 0, i_len = array.length; i < i_len; i++ )
	{
		value = array[ i ];
		if ( func.call( passed_this, value, i, array ) )
		{
			return value;
		}
	}

	return returnUndefined();
}

function arrayUniquify( array )
{
	return [ ...new Set( [ ...array ] ) ];
}

function compareObjects( obj1, obj2 )
{
	var i, i_len, attribute, obj1_attribute_count, obj2_attribute_count;

	if ( obj1 === obj2 )
	{
		return true;
	}

	if ( obj1 instanceof Array && obj2 instanceof Array )
	{
		if ( obj1.length != obj2.length )
		{
			return false;
		}

		for ( i = 0, i_len = obj1.length; i < i_len; i++ )
		{
			if ( !compareObjects( obj1[ i ], obj2[ i ] ) )
			{
				return false;
			}
		}

		return true;
	}
	else if ( obj1 instanceof Object && obj2 instanceof Object )
	{
		obj1_attribute_count = 0;
		obj2_attribute_count = 0;

		for ( attribute in obj1 )
		{
			if ( obj1.hasOwnProperty( attribute ) )
			{
				if ( !obj2.hasOwnProperty( attribute ) )
				{
					return false;
				}

				obj1_attribute_count++;
			}
		}

		for ( attribute in obj2 )
		{
			if ( obj2.hasOwnProperty( attribute ) )
			{
				if ( !obj1.hasOwnProperty( attribute ) )
				{
					return false;
				}

				obj2_attribute_count++;
			}
		}

		if ( obj1_attribute_count != obj2_attribute_count )
		{
			return false;
		}

		for ( attribute in obj1 )
		{
			if ( obj1.hasOwnProperty( attribute ) )
			{
				if ( !compareObjects( obj1[ attribute ], obj2[ attribute ] ) )
				{
					return false;
				}
			}
		}

		return true;
	}

	return false;
}

function cloneObject( obj )
{
	var obj_copy;
	var i, i_len, attribute;

	if ( ( obj == null ) ||
		 ( typeof obj != 'object' ) )
	{
		return obj;
	}

	if ( obj instanceof Array )
	{
		obj_copy = new Array();

		for ( i = 0, i_len = obj.length; i < i_len; i++ )
		{
			obj_copy[ i ] = cloneObject( obj[ i ] );
		}

		return obj_copy;
	}
	else if ( obj instanceof Object )
	{
		obj_copy = new Object();

		for ( attribute in obj )
		{
			if ( obj.hasOwnProperty( attribute ) )
			{
				obj_copy[ attribute ] = cloneObject( obj[ attribute ] );
			}
		}

		return obj_copy;
	}

	return obj;
}

function encodeentities( input )
{
	var result;

	result	= new String( input );
	result	= result.replace(	/&/g,	'&amp;' );
	result	= result.replace(	/"/g,	'&quot;' );
	result	= result.replace(	/</g,	'&lt;' );
	result	= result.replace(	/>/g,	'&gt;' );
	result	= result.replace(	/\(/g,	'&#40;' );
	result	= result.replace(	/\)/g,	'&#41;' );

	return result;
}

function encodeattribute( text )
{
	var i, i_len, character, character_code, data;

	if ( typeof text !== 'string' )
	{
		return text;
	}

	data = '';

	for ( i = 0, i_len = text.length; i < i_len; i++ )
	{
		character		= text.charAt( i );
		character_code	= text.charCodeAt( i );

		switch ( character )
		{
			case ' '	:
			{
				data += '+';

				break; 
			}
			case '~'	:
			case '`'	:
			case '!'	:
			case '#'	:
			case '$'	:
			case '%'	:
			case '^'	:
			case '&'	:
			case '('	:
			case ')'	:
			case '+'	:
			case '='	:
			case '{'	:
			case '}'	:
			case '['	:
			case ']'	:
			case '|'	:
			case '\\'	:
			case ':'	:
			case ';'	:
			case '"'	:
			case '\''	:
			case '<'	:
			case '>'	:
			case ','	:
			case '?'	:
			case '/'	:
			{
				data += '%' + padl( character_code.toString( 16 ).toUpperCase(), 2, '0' );

				break;
			}
			default		:
			{
				if ( character_code > 0x20 && character_code < 0x7F )	data += character;
				else													data += '%' + padl( character_code.toString( 16 ).toUpperCase(), 2, '0' );

				break;
			}
		}
	}

	return data;
}

function decodeattribute( text )
{
	if ( typeof text !== 'string' )
	{
		return text;
	}
	
	return decodeURIComponent( text.replace( new RegExp( regexEscape( '+' ), 'g' ), ' ' ) );
}

function trim( value )
{
	if ( typeof value !== 'string' )	return value;
	else								return value.replace( /^\s+|\s+$/g, '' );
}

function GetNormalizedValue( value )
{
	// Normalize line breaks in value string

	if ( typeof value !== 'string' )
	{
		return '';
	}

	value = value.replace( /\r\n/gm,	'\n' );
	value = value.replace( /\r/gm,		'\n' );
	value = value.replace( /\n/gm,		'\r\n' );

	return value;
}

function RFC3339DateString( date, timezone )
{
	var fixed_timezone, rfc3339_timezone;

	timezone = stod( timezone );

	if ( timezone === 0 )
	{
		rfc3339_timezone	= 'Z';
	}
	else
	{
		fixed_timezone		= Math.abs( timezone ).toFixed( 2 );
		rfc3339_timezone	= ( ( timezone > 0 ) ? '+' : '-' ) + padl( fixed_timezone.split( '.' )[ 0 ], 2, '0' ) + ':' + padl( Math.floor( ( fixed_timezone.split( '.' )[ 1 ] * 60 ) / 100 ), 2, '0' );
	}

	return ( date.getFullYear() + '-' + padl( date.getMonth() + 1, 2, '0' ) + '-' + padl( date.getDate(), 2, '0' ) + 'T' + padl( date.getHours(), 2, '0' ) + ':' + padl( date.getMinutes(), 2, '0' ) + ':' + padl( date.getSeconds(), 2, '0' ) + rfc3339_timezone );
}

function RFC3339DateStringNoTimeZone( date )
{
	return ( date.getFullYear() + '-' + padl( date.getMonth() + 1, 2, '0' ) + '-' + padl( date.getDate(), 2, '0' ) + 'T' + padl( date.getHours(), 2, '0' ) + ':' + padl( date.getMinutes(), 2, '0' ) + ':' + padl( date.getSeconds(), 2, '0' ) + '-00:00' );
}

function padl( string, length, character )
{
	var pad;

	length		= stoi_def( length, 0 );
	pad			= new Array( Math.ceil( length / character.length ) + 1 ).join( character ); // More efficient for longer strings than a while loop

	if ( typeof string !== 'string' )
	{
		string	= "" + string;
	}

	if ( string.length >= length )
	{
		return string;
	}

	return pad.substring( 0, length - string.length ) + string;
}

function padr( string, length, character )
{
	var pad;

	length		= stoi_def( length, 0 );
	pad			= new Array( Math.ceil( length / character.length ) + 1 ).join( character ); // More efficient for longer strings than a while loop

	if ( typeof string !== 'string' )
	{
		string	= "" + string;
	}

	if ( string.length >= length )
	{
		return string;
	}

	return string + pad.substring( 0, length - string.length );
}

function stob( value )
{
	if ( typeof value !== 'string' )
	{
		return value ? true : false;
	}

	value = value.toLowerCase();

	return ( value === '' || value === '0' || value === 'no' || value === 'false' ) ? false : true;
}

function stoi( value )
{
	return parseInt( value, 10 );
}

function stoi_def( value, default_value )
{
	value = stoi( value );

	return ( ( isNaN( value ) || value == Number.POSITIVE_INFINITY || value == Number.NEGATIVE_INFINITY ) ? default_value : value );
}

function stoi_def_nonneg( value, default_value )
{
	value = stoi( value );

	return ( ( isNaN( value ) || ( value < 0 ) || value == Number.POSITIVE_INFINITY || value == Number.NEGATIVE_INFINITY ) ? default_value : value );
}

function stoi_min( value, min_value )
{
	value = stoi( value );

	return ( ( isNaN( value ) || ( value < min_value ) || value == Number.POSITIVE_INFINITY || value == Number.NEGATIVE_INFINITY ) ? min_value : value );
}

function stoi_max( value, max_value )
{
	value = stoi( value );

	return ( ( isNaN( value ) || ( value > max_value ) || value == Number.POSITIVE_INFINITY || value == Number.NEGATIVE_INFINITY ) ? max_value : value );
}

function stoi_range( value, min_value, max_value, default_value )
{
	return stoi_min( stoi_max( stoi_def( value, default_value ), max_value ), min_value );
}

function stod( value )
{
	return parseFloat( value );
}

function stod_def( value, default_value )
{
	value = stod( value );

	return ( ( isNaN( value ) || value == Number.POSITIVE_INFINITY || value == Number.NEGATIVE_INFINITY ) ? default_value : value );
}

function stod_def_nonneg( value, default_value )
{
	value = stod( value );

	return ( ( isNaN( value ) || ( value < 0 ) || value == Number.POSITIVE_INFINITY || value == Number.NEGATIVE_INFINITY ) ? default_value : value );
}

function stod_min( value, min_value )
{
	value = stod( value );

	return ( ( isNaN( value ) || ( value < min_value ) || value == Number.POSITIVE_INFINITY || value == Number.NEGATIVE_INFINITY ) ? min_value : value );
}

function stod_max( value, max_value )
{
	value = stod( value );

	return ( ( isNaN( value ) || ( value > max_value ) || value == Number.POSITIVE_INFINITY || value == Number.NEGATIVE_INFINITY ) ? max_value : value );
}

function stod_range( value, min_value, max_value, default_value )
{
	return stod_min( stod_max( stod_def( value, default_value ), max_value ), min_value );
}

function ValueIsEmpty( value )
{
	if ( value === null )										return true;
	else if ( typeof value === 'object' )						return Object.keys( value ).length === 0 && value.constructor === Object;
	else if ( typeof value === 'undefined' )					return true;
	else if ( typeof value === 'string' && value.length == 0 )	return true;

	// type is boolean, number, function, non-zero length string, etc
	return false;
}

function getMonthName_Abbreviated( date )
{
	switch ( date.getMonth() )
	{
		case 0:		return 'Jan';
		case 1:		return 'Feb';
		case 2:		return 'Mar';
		case 3:		return 'Apr';
		case 4:		return 'May';
		case 5:		return 'Jun';
		case 6:		return 'Jul';
		case 7:		return 'Aug';
		case 8:		return 'Sep';
		case 9:		return 'Oct';
		case 10:	return 'Nov';
		case 11:	return 'Dec';
	}
}

/*
 * Note: This function is also present (with a different name) in ajax.js and v55_ui.js.
 *		 Modifications here should be made in those other locations as well.
 */

function isUnicode()
{
	return ( document.characterSet || document.charset || '' ).search( 'UTF' ) == 0 ? true : false;
}

/*
 * Note: This function is also present (with a different name) in ajax.js and v55_ui.js.
 *		 Modifications here should be made in those other locations as well.
 */

function CharsetEncodeAttribute( instring )
{
	var encoded;

	if ( isUnicode() )
	{
		return encodeURIComponent( instring );
	}
	else
	{
		if ( typeof escape === 'function' )
		{
			encoded = escape( instring );
			encoded = encoded.replace( '+', '%2B' );
			encoded = encoded.replace( '/', '%2F' );
			encoded = encoded.replace( '@', '%40' );

			return encoded;
		}
		else
		{
			return instring;
		}
	}
}

function CharsetDecodeAttribute( instring )
{
	if ( isUnicode() )
	{
		return decodeattribute( instring );
	}
	else
	{
		if ( typeof unescape === 'function' )	return unescape( instring );
		else									return instring;
	}
}

function MMStripHTML( string )
{
	var html_stripper = new DOMParser().parseFromString( string, 'text/html' );
	
	return html_stripper.body.textContent;
}

( function( global )
{
	global.getVariableType = function( variable )
	{
		// Return a more accurate representation of a variable's type based on the
		// passed in [[Class]], when possible. If variable is null, return 'null'.
		// If variable is undefined, return 'undefined'. If variable is global (such
		// as the window), pass back global, otherwise, pass back the parsed toString
		// value from Object.prototype.toString, which gives us a more detailed
		// object type [object Array], [object Date], etc. While not a perfect solution
		// for every case, this will give us a much more accurate value than
		// JavaScript's builtin "typeof" operator. The anonymous wrapper function
		// ensures we receive the "global" context for later comparison

		if ( variable === null )			return 'null';		// true null
		else if ( variable == null )		return 'undefined';	// Undefined variable
		else if ( variable === global )		return 'global';	// global object, such as window
		else 								return Object.prototype.toString.call( variable ).match( /\s([a-zA-Z]+)/)[ 1 ].toLowerCase();
	}
}( this ) );
