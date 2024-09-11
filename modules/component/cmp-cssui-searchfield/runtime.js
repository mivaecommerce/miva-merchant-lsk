// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2019 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

/*
	Required elements:
		$unique_id = some_unique_to_DOM_value;

		<input type="[any text supported input]" class="any" data-mm_searchfield="Yes" data-mm_searchfield_id="$unique_id" value="&mvte:global:Search;" />
		<[HTMLElement] data-mm_searchfield_menu="Yes" data-mm_searchfield_id="$unique_id"></[HTMLElement]>
*/

(function( obj, eventType, fn )
{
	if ( obj.addEventListener )
	{
		obj.addEventListener( eventType, fn, false );
	}
	else if ( obj.attachEvent )
	{
		obj.attachEvent( 'on' + eventType, fn );
	}
})( window, 'load', function() { MMSearchField_Initialize(); } );

var mm_searchfields = new Object();

function MMSearchField_Initialize()
{
	var i, id, i_len, lookup, elements;

	FireEvent( window, 'mmsearchfield_override' );

	lookup			= new Object();
	elements		= document.getElementsByTagName( '*' );

	for ( i = 0, i_len = elements.length; i < i_len; i++ )
	{
		if ( id = elements[ i ].getAttribute( 'data-mm_searchfield_id' ) )
		{
			if ( !lookup[ id ] )
			{
				lookup[ id ] = new Object();
			}

			if ( elements[ i ].getAttribute( 'data-mm_searchfield' ) )				lookup[ id ].element_search	= elements[ i ];
			else if ( elements[ i ].getAttribute( 'data-mm_searchfield_menu' ) )	lookup[ id ].element_menu	= elements[ i ];
		}
	}

	for ( id in lookup )
	{
		if ( !lookup.hasOwnProperty( id )						||
			 !lookup[ id ].element_search						||
			 !lookup[ id ].element_menu							||
			 ( lookup[ id ].element_search.nodeType !== 1 )		||
			 ( lookup[ id ].element_menu.nodeType !== 1 )		||
			 ( lookup[ id ].element_search.nodeName.toLowerCase() !== 'input' ) )
		{
			continue;
		}

		mm_searchfields[ id ] = new MMSearchField( lookup[ id ].element_search, lookup[ id ].element_menu );
	}

	FireEvent( window, 'mmsearchfield_initialized' );
}

function MMSearchField( element_search, element_menu )
{
	var self = this;

	// Elements
	this.element_search					= element_search;
	this.element_menu					= element_menu;

	// Values
	this.current_search					= '';
	this.search_timeout					= null;
	this.search_delay					= 400;
	this.menu_visible					= false;
	this.menu_items						= new Array();
	this.selected_item					= null;
	this.product_count					= 5;
	this.has_focus						= false;
	this.delegator						= new AJAX_ThreadPool( 1 );
	this.last_displayed_search_value	= null;

	// Events
	this.event_search_focus				= function( event ) { return self.Event_Focus( event ? event : window.event ); };
	this.event_search_keydown			= function( event ) { return self.Event_Keydown( event ? event : window.event ); };
	this.event_search_keyup				= function( event ) { return self.Event_Keyup( event ? event : window.event ); };
	this.event_search_blur				= function( event ) { return self.Event_Blur( event ? event : window.event ); };
	this.event_search_paste				= function( event ) { setTimeout( function() { self.Search( self.element_search.value ); }, 0 ); };
	this.event_search_click				= function( event ) { eventStopPropagation( event ? event : window.event ); };
	this.event_document_mousedown		= function( event ) { return self.Event_Document_MouseDown( event ? event : window.event ); };
	this.event_document_mousemove		= function( event ) { return self.Event_Document_MouseMove( event ? event : window.event ); };

	AddEvent( this.element_search, 'focus',		this.event_search_focus );
	AddEvent( this.element_search, 'keydown',	this.event_search_keydown );
	AddEvent( this.element_search, 'keyup',		this.event_search_keyup );
	AddEvent( this.element_search, 'blur',		this.event_search_blur );
	AddEvent( this.element_search, 'paste',		this.event_search_paste );
	AddEvent( this.element_search, 'click',		this.event_search_click );

	// Initial Setup

	this.Menu_Empty();
	this.Menu_Hide();
}

MMSearchField.prototype.GetSearchURL = function()
{
	return MMSearchField_Search_URL_sep;
}

MMSearchField.prototype.SetLoadCount = function( count )
{
	this.product_count = count;
}

MMSearchField.prototype.SetSearchDelay = function( delay )
{
	this.search_delay = delay;
}

MMSearchField.prototype.Menu_Empty = function()
{
	this.menu_items						= new Array();
	this.element_menu.innerHTML 		= '';
	this.last_displayed_search_value	= null;

	this.Menu_Item_Select( null );
}

MMSearchField.prototype.Menu_Show = function()
{
	if ( this.menu_visible )
	{
		return;
	}

	this.menu_visible = true;
	this.element_menu.style.display = 'block';
}

MMSearchField.prototype.Menu_Hide = function()
{
	if ( !this.menu_visible )
	{
		return;
	}

	this.menu_visible = false;
	this.element_menu.style.display = 'none';
}

MMSearchField.prototype.Menu_Append_Header = function()
{
	var item;

	if ( item = this.onMenuAppendHeader() )
	{
		this.element_menu.appendChild( item );
	}
}

MMSearchField.prototype.Menu_Append_Item = function( data )
{
	var self = this;
	var item;

	if ( item = this.onMenuAppendItem( data.menuitem ) )
	{
		item.mm_data		= data;
		item.action			= data.product_link;
		item.onclick		= function( event ) { self.Menu_Item_OnClick( event ? event : window.event, this.action ); };
		item.onmousemove	= function( event ) { self.Event_MenuItem_MouseMove( event ? event : window.event, item ); };
		this.element_menu.appendChild( item );
		this.menu_items.push( item );
	}
}

MMSearchField.prototype.Menu_Append_StoreSearch = function()
{
	var self = this;
	var item;

	if ( item = this.onMenuAppendStoreSearch( this.element_search.value ) )
	{
		item.action					= this.GetSearchURL() + encodeURIComponent( this.element_search.value );
		item.onclick				= function( event ) { self.Menu_Item_OnClick( event ? event : window.event, this.action ); };
		item.onmousemove			= function( event ) { self.Event_MenuItem_MouseMove( event ? event : window.event, item ); };

		this.element_menu.appendChild( item );

		this.menu_item_storesearch	= item;
		this.menu_items.push( item );
	}
}

MMSearchField.prototype.Menu_Replace_StoreSearch = function()
{
	var self = this;
	var item;

	if ( item = this.onMenuAppendStoreSearch( this.element_search.value ) )
	{
		item.action			= this.GetSearchURL() + encodeURIComponent( this.element_search.value );
		item.onclick		= function( event ) { self.Menu_Item_OnClick( event ? event : window.event, this.action ); };
		item.onmousemove	= function( event ) { self.Event_MenuItem_MouseMove( event ? event : window.event, item ); };

		this.element_menu.appendChild( item );

		if ( this.menu_item_storesearch && ( ( index = this.menu_items.indexOf( this.menu_item_storesearch ) ) != -1 ) )
		{
			this.menu_item_storesearch.parentNode.removeChild( this.menu_item_storesearch );
			this.menu_items.splice( index, 1 );
		}

		if ( this.selected_item === this.menu_item_storesearch )
		{
			this.Menu_Item_Select( item );
		}

		this.menu_item_storesearch = item;
		this.menu_items.push( item );
	}
}

MMSearchField.prototype.Menu_Item_Select = function( item )
{
	this.selected_item = item;

	if ( item !== null )
	{
		this.selected_item.className = classNameAdd( this.selected_item, 'mm_searchfield_menuitem_selected' );
	}
}

MMSearchField.prototype.Menu_Item_OnClick = function( e, url )
{
	window.location.href = url;
}

MMSearchField.prototype.SetFocus = function()
{
	this.element_search.focus();
}

MMSearchField.prototype.Search = function( value )
{
	var self = this;

	if ( ( typeof value !== 'string' ) || ( value.length == 0 ) )
	{
		this.Menu_Empty();
		this.Menu_Hide();

		return;
	}
	else if ( value.length < 3 )
	{
		this.Menu_Empty();
		this.Menu_Show();
		this.Menu_Replace_StoreSearch();

		return;
	}

	AJAX_Call_Module( function( response ) { self.Search_Callback( response, value ); }, 'runtime',
					  'cmp-cssui-searchfield',
					  'Search',
					  'Search=' + encodeURIComponent( value ) +
					  '&Count=' + this.product_count,
					  this.delegator );

	this.delegator.LimitQueueToCount( 1 );
	this.delegator.Run();
}

MMSearchField.prototype.Search_Callback = function( response, original_search_value )
{
	var i, i_len, last_selected;

	last_selected			= this.selected_item;

	this.Menu_Empty();

	if ( !this.has_focus || this.element_search.value.length == 0 )
	{
		this.Menu_Empty();
		this.Menu_Hide();

		return;
	}

	this.Menu_Show();

	if ( !response.success || ( response.data.length == 0 ) || ( this.element_search.value != original_search_value ) )
	{
		return this.Menu_Append_StoreSearch();
	}

	this.last_displayed_search_value = this.element_search.value;

	this.Menu_Append_Header();

	for ( i = 0, i_len = response.data.length; i < i_len; i++ )
	{
		this.Menu_Append_Item( response.data[ i ] );
	}

	this.Menu_Append_StoreSearch();

	if ( last_selected )
	{
		for ( i = 0, i_len = this.menu_items.length; i < i_len; i++ )
		{
			if ( this.menu_items[ i ].action == last_selected.action )
			{
				this.Menu_Item_Select( this.menu_items[ i ] );
				break;
			}
		}
	}
}

MMSearchField.prototype.Event_Keydown = function( e )
{
	var keycode, modifier;

	keycode				= e.keyCode || e.which;
	modifier			= e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
	this.current_search = this.element_search.value;

	if ( keycode == 9 && !modifier )			return this.Menu_Hide();
	else if ( keycode == 13 && !modifier )		return this.Event_Enter( e );
	else if ( keycode == 27 && !modifier )		return this.Event_ESC( e );
	else if ( keycode == 38 && !modifier )		return this.Event_ArrowUp( e );
	else if ( keycode == 40 && !modifier )		return this.Event_ArrowDown( e );

	if ( keycode == 85 && keySupportsMultiSelect( e ) )
	{
		this.element_search.value	= '';
		this.current_search			= '';

		cursorToEnd( this.element_search );
		this.Menu_Empty();
		this.Menu_Hide();

		return eventPreventDefault( e );
	}

	if ( this.element_search.value.length == 0 )
	{
		this.Menu_Empty();
		this.Menu_Hide();
	}
	else
	{
		this.Menu_Show();
		this.Menu_Replace_StoreSearch();
	}

	return true;
}

MMSearchField.prototype.Event_Keyup = function( e )
{
	var self = this;
	var keycode = e.keyCode || e.which;

	if ( keycode == 13 )		return;	/* Enter Key */
	else if ( keycode == 27 )	return; /* Esc Key */
	else if ( keycode == 38 )	return;	/* Up Arrow */
	else if ( keycode == 40 )	return;	/* Down Arrow */

	if ( this.element_search.value.length == 0 )
	{
		this.Menu_Empty();
		this.Menu_Hide();
	}
	else
	{
		this.Menu_Show();
		this.Menu_Replace_StoreSearch();
	}

	if ( this.current_search == this.element_search.value )
	{
		return;
	}

	if ( this.search_timeout )
	{
		clearTimeout( this.search_timeout );
	}

	this.search_timeout = setTimeout( function()
	{
		self.Search( self.element_search.value );
		self.search_timeout = null;
	}, this.search_delay );
}

MMSearchField.prototype.Event_Focus = function( e )
{
	if ( this.has_focus )
	{
		return;
	}

	this.has_focus					= true;
	this.element_search.className	= classNameAdd( this.element_search, 'focus' );

	this.onFocus( e );

	if ( this.element_search.value === this.last_displayed_search_value )
	{
		this.Menu_Show();
	}
	else if ( this.element_search.value.length )
	{
		this.Menu_Empty();
		this.Menu_Show();
		this.Menu_Replace_StoreSearch();
		this.Search( this.element_search.value );
	}

	AddEvent( document, 'mousedown', this.event_document_mousedown );
}

MMSearchField.prototype.Event_Blur = function( e )
{
	if ( !this.has_focus )
	{
		return;
	}

	this.has_focus					= false;
	this.element_search.className	= classNameRemove( this.element_search, 'focus' );

	this.Menu_Hide();
	this.onBlur( e );

	RemoveEvent( document, 'mousedown', this.event_document_mousedown );
}

MMSearchField.prototype.Event_Enter = function( e )
{
	if ( this.selected_item && this.selected_item.action )	this.Menu_Item_OnClick( e, this.selected_item.action );
	else													this.Menu_Item_OnClick( e, this.GetSearchURL() + encodeURIComponent( this.element_search.value ) );

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

MMSearchField.prototype.Event_ESC = function( e )
{
	if ( this.menu_visible )
	{
		this.Menu_Hide();
	}
	else
	{
		this.element_search.value	= '';
		this.current_search			= '';

		this.Menu_Empty();
		this.Menu_Hide();
	}

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

MMSearchField.prototype.Event_ArrowUp = function( e )
{
	var i, i_len, index, next_index;

	if ( !this.menu_visible )
	{
		this.Search( this.element_search.value );

		return eventPreventDefault( e );
	}

	for ( i = 0, i_len = this.menu_items.length; i < i_len; i++ )
	{
		this.menu_items[ i ].className = classNameRemove( this.menu_items[ i ], 'mm_searchfield_menuitem_selected' );
	}

	if ( this.menu_items.length == 0 )
	{
		this.Menu_Item_Select( null );
	}

	if ( ( index = this.menu_items.indexOf( this.selected_item ) ) != -1 )
	{
		next_index = ( index - 1 < 0 ) ? ( this.menu_items.length - 1 ) : ( index - 1 );
	}
	else
	{
		next_index = ( this.menu_items.length - 1 );
	}

	this.Menu_Item_Select( this.menu_items[ next_index ] );

	return eventPreventDefault( e );
}

MMSearchField.prototype.Event_ArrowDown = function( e )
{
	var i, i_len, index, next_index;

	if ( !this.menu_visible )
	{
		this.Search( this.element_search.value );

		return eventPreventDefault( e );
	}

	for ( i = 0, i_len = this.menu_items.length; i < i_len; i++ )
	{
		this.menu_items[ i ].className = classNameRemove( this.menu_items[ i ], 'mm_searchfield_menuitem_selected' );
	}

	if ( this.menu_items.length == 0 )
	{
		this.Menu_Item_Select( null );
	}

	if ( ( index = this.menu_items.indexOf( this.selected_item ) ) != -1 )
	{
		next_index = ( index + 1 > this.menu_items.length - 1 ) ? 0 : ( index + 1 );
	}
	else
	{
		next_index = 0;
	}

	this.Menu_Item_Select( this.menu_items[ next_index ] );

	return eventPreventDefault( e );
}

MMSearchField.prototype.Event_Document_MouseDown = function( e )
{
	var target = e.target || e.srcElement;

	if ( target === this.element_menu || containsChild( this.element_menu, target ) )
	{
		eventStopPropagation( e );
		return eventPreventDefault( e );
	}
}

MMSearchField.prototype.Event_MenuItem_MouseMove = function( e, item )
{
	var i, i_len;

	for ( i = 0, i_len = this.menu_items.length; i < i_len; i++ )
	{
		this.menu_items[ i ].className	= classNameRemove( this.menu_items[ i ], 'mm_searchfield_menuitem_selected' );
	}

	this.Menu_Item_Select( item );
}
