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

// Modal_Callbacks
////////////////////////////////////////////////////

if ( typeof miva_dialog_registry === 'undefined' )
{
	var miva_dialog_registry = new Object();
}

function MivaDialogRegistry_RegisterDialog( key )
{
	miva_dialog_registry[ key ]					= new Object();
	miva_dialog_registry[ key ].onshow_hooks	= new Object();
	miva_dialog_registry[ key ].onhide_hooks	= new Object();
	miva_dialog_registry[ key ].onresize_hooks	= new Object();
}

function MivaDialogRegistry_AddOnShow( key, fn_key, fn )
{
	if ( miva_dialog_registry[ key ] && ( typeof fn === 'function' ) )
	{
		miva_dialog_registry[ key ].onshow_hooks[ fn_key ] = fn;
	}
}

function MivaDialogRegistry_RemoveOnShow( key, fn_key )
{
	if ( miva_dialog_registry[ key ] && miva_dialog_registry[ key ].onshow_hooks[ fn_key ] )
	{
		delete miva_dialog_registry[ key ].onshow_hooks[ fn_key ];
	}
}

function MivaDialogRegistry_RemoveAllOnShow( key )
{
	if ( miva_dialog_registry[ key ] )
	{
		miva_dialog_registry[ key ].onshow_hooks = new Object();
	}
}

function MivaDialogRegistry_OnShow( key )
{
	var member;

	if ( miva_dialog_registry[ key ] )
	{
		for ( member in miva_dialog_registry[ key ].onshow_hooks )
		{
			if ( miva_dialog_registry[ key ].onshow_hooks.hasOwnProperty( member ) && ( typeof miva_dialog_registry[ key ].onshow_hooks[ member ] === 'function' ) )
			{
				miva_dialog_registry[ key ].onshow_hooks[ member ]();
			}
		}
	}
}

function MivaDialogRegistry_AddOnHide( key, fn_key, fn )
{
	if ( miva_dialog_registry[ key ] && ( typeof fn === 'function' ) )
	{
		miva_dialog_registry[ key ].onhide_hooks[ fn_key ] = fn;
	}
}

function MivaDialogRegistry_RemoveOnHide( key, fn_key )
{
	if ( miva_dialog_registry[ key ] && miva_dialog_registry[ key ].onhide_hooks[ fn_key ] )
	{
		delete miva_dialog_registry[ key ].onhide_hooks[ fn_key ];
	}
}

function MivaDialogRegistry_RemoveAllOnHide( key )
{
	if ( miva_dialog_registry[ key ] )
	{
		miva_dialog_registry[ key ].onhide_hooks = new Object();
	}
}

function MivaDialogRegistry_OnHide( key )
{
	var member;

	if ( miva_dialog_registry[ key ] )
	{
		for ( member in miva_dialog_registry[ key ].onhide_hooks )
		{
			if ( miva_dialog_registry[ key ].onhide_hooks.hasOwnProperty( member ) && ( typeof miva_dialog_registry[ key ].onhide_hooks[ member ] === 'function' ) )
			{
				miva_dialog_registry[ key ].onhide_hooks[ member ]();
			}
		}
	}
}

function MivaDialogRegistry_AddOnResize( key, fn_key, fn )
{
	if ( miva_dialog_registry[ key ] && ( typeof fn === 'function' ) )
	{
		miva_dialog_registry[ key ].onresize_hooks[ fn_key ] = fn;
	}
}

function MivaDialogRegistry_RemoveOnResize( key, fn_key )
{
	if ( miva_dialog_registry[ key ] && miva_dialog_registry[ key ].onresize_hooks[ fn_key ] )
	{
		delete miva_dialog_registry[ key ].onresize_hooks[ fn_key ];
	}
}

function MivaDialogRegistry_RemoveAllOnResize( key )
{
	if ( miva_dialog_registry[ key ] )
	{
		miva_dialog_registry[ key ].onresize_hooks = new Object();
	}
}

function MivaDialogRegistry_OnResize( key )
{
	var member;

	if ( miva_dialog_registry[ key ] )
	{
		for ( member in miva_dialog_registry[ key ].onresize_hooks )
		{
			if ( miva_dialog_registry[ key ].onresize_hooks.hasOwnProperty( member ) && ( typeof miva_dialog_registry[ key ].onresize_hooks[ member ] === 'function' ) )
			{
				miva_dialog_registry[ key ].onresize_hooks[ member ]();
			}
		}
	}
}

function MivaDialogRegistry_Deregister( key )
{
	miva_dialog_registry[ key ] = returnUndefined();
}

function Modal_Callbacks( element, key )
{
	this.key		= key;
	this.element	= element;

	if ( typeof this.key === 'string' && this.key.length )
	{
		MivaDialogRegistry_RegisterDialog( this.key );
	}
}

Modal_Callbacks.prototype.PreferenceKeyPrefix = function()
{
	return '';
}

Modal_Callbacks.prototype.Container = function()
{
	return this.element;
}

Modal_Callbacks.prototype.onRestorePosition = function( position, dimensions )
{
}

Modal_Callbacks.prototype.onPreferenceLoad = function( prefs, callback )
{
	if ( typeof callback == 'function' )
	{
		callback( prefs );
	}
}

Modal_Callbacks.prototype.onModalShow = function( z_index )
{
	if ( this.element && this.element.style )
	{
		this.element.style.zIndex	= z_index;
		this.element.style.display	= 'block';

		this.visible				= true;

		if ( typeof this.key === 'string' && this.key.length )
		{
			MivaDialogRegistry_OnShow( this.key );
		}
	}
}

Modal_Callbacks.prototype.onModalHide = function()
{
	if ( this.element && this.element.style )
	{
		this.element.style.display = 'none';
	}

	this.visible = false;

	if ( typeof this.key === 'string' && this.key.length )
	{
		MivaDialogRegistry_OnHide( this.key );
	}
}

Modal_Callbacks.prototype.onModalResize = function()
{
	if ( typeof this.key === 'string' && this.key.length )
	{
		MivaDialogRegistry_OnResize( this.key );
	}
}

// Modal Dialog Background
////////////////////////////////////////////////////

var modal_default_onresize	= null;
var modal_default_onkeydown	= null;
var modal_stack				= new Array();
var modal_start_hooks		= new Array();
var modal_resize_hooks		= new Array();
var modal_end_hooks			= new Array();

Modal_Start_AddHook = function( fn1 )
{
	modal_start_hooks.push( fn1 );
}

Modal_Start_RemoveHook = function( fn1 )
{
	var index = arrayIndexOf( modal_start_hooks, fn1 );

	if ( index != -1 )
	{
		modal_start_hooks.splice( index, 1 );
	}
}

Modal_Start_Handler = function()
{
	var i, i_len;

	for ( i = 0, i_len = modal_start_hooks.length; i < i_len; i++ )
	{
		if ( typeof modal_start_hooks[ i ] === 'function' )
		{
			modal_start_hooks[ i ]();
		}
	}
}

Modal_Resize_AddHook = function( fn1 )
{
	modal_resize_hooks.push( fn1 );
}

Modal_Resize_RemoveHook = function( fn1 )
{
	var index = arrayIndexOf( modal_resize_hooks, fn1 );

	if ( index != -1 )
	{
		modal_resize_hooks.splice( index, 1 );
	}
}

Modal_Resize_Handler = function()
{
	var i, i_len;

	for ( i = 0, i_len = modal_resize_hooks.length; i < i_len; i++ )
	{
		if ( typeof modal_resize_hooks[ i ] === 'function' )
		{
			modal_resize_hooks[ i ]();
		}
	}
}

Modal_End_AddHook = function( fn1 )
{
	modal_end_hooks.push( fn1 );
}

Modal_End_RemoveHook = function( fn1 )
{
	var index = arrayIndexOf( modal_end_hooks, fn1 );

	if ( index != -1 )
	{
		modal_end_hooks.splice( index, 1 );
	}
}

Modal_End_Handler = function()
{
	var i, i_len;

	for ( i = 0, i_len = modal_end_hooks.length; i < i_len; i++ )
	{
		if ( typeof modal_end_hooks[ i ] === 'function' )
		{
			modal_end_hooks[ i ]();
		}
	}
}

//
// Z-Index tracker for dialogs, menus, etc
//

var mm_modal_z_index = new Array();
var mm_modal_z_index_map = new Object();

function Modal_ZIndex_Create( ref )
{
	var z_index;

	try
	{
		//
		// We must wrap this in a try-catch so that if the window doesn't have
		// access (cross-origin) to the top window, we can still generate a unique id
		//

		if ( window !== top && typeof top.Modal_ZIndex_Create === 'function' )
		{
			return top.Modal_ZIndex_Create( ref );
		}
	}
	catch ( e )
	{
		;
	}

	Modal_ZIndex_Delete( ref );

	if ( mm_modal_z_index.length === 0 )	z_index = 1;
	else									z_index = mm_modal_z_index_map[ mm_modal_z_index[ mm_modal_z_index.length - 1 ] ] + 1;

	mm_modal_z_index.push( ref );
	mm_modal_z_index_map[ ref ] = z_index;

	return mm_modal_z_index_map[ ref ];
}

function Modal_ZIndex_Delete( ref )
{
	var index;

	try
	{
		//
		// We must wrap this in a try-catch so that if the window doesn't have
		// access (cross-origin) to the top window, we can still generate a unique id
		//

		if ( window !== top && typeof top.Modal_ZIndex_Delete === 'function' )
		{
			return top.Modal_ZIndex_Delete( ref );
		}
	}
	catch ( e )
	{
		;
	}

	if ( ( index = mm_modal_z_index.indexOf( ref ) ) !== -1 )
	{
		mm_modal_z_index.splice( index, 1 );
	}

	delete mm_modal_z_index[ ref ];
}

function Modal_Show( dialog, onEnter, onESC, onPreferenceLoad )
{
	var key_prefix;
	var dimensions;
	var stack_entry;
	var modal_background;
	var cached_preferences;

	if ( modal_stack.length === 0 )
	{
		AddEvent( window,	'resize',	Modal_OnResize );
		AddEvent( window,	'scroll',	Modal_OnScroll );

		Modal_Start_Handler();
	}

	if ( !( dialog instanceof Modal_Callbacks ) )
	{
		if ( dialog.mmdialog_skin )			dialog	= dialog.mmdialog_skin;
		else if ( !dialog.prevent_skin )	dialog	= dialog.mmdialog_skin = new MMDialog_Skin( dialog );
		else								dialog	= new Modal_Callbacks( dialog, dialog.id );
	}
	
	modal_background				= document.getElementById( 'modal_background' );

	if ( dialog && typeof dialog.Container === 'function' )
	{
		if ( dialog.Container().parentNode !== document.body )					document.body.appendChild( dialog.Container() );
		if ( dialog.Container().parentNode !== modal_background.parentNode )	dialog.Container().parentNode.appendChild( modal_background );
	}

	if ( dialog instanceof MMDialog_Skin )
	{
		dialog.Set_SkinnedOnEnter( onEnter );
		dialog.Set_SkinnedOnESC( onESC );
		dialog.Set_SkinnedOnPreferenceLoad( onPreferenceLoad );
	}

	stack_entry						= new Object();
	stack_entry.identifier			= GenerateUniqueID();
	stack_entry.dialog				= dialog;
	stack_entry.onEnter				= onEnter;
	stack_entry.onESC				= onESC;
	stack_entry.onPreferenceLoad	= onPreferenceLoad;
	stack_entry.z_index_background	= Modal_ZIndex_Create( stack_entry.identifier + '_background' );
	stack_entry.z_index				= Modal_ZIndex_Create( stack_entry.identifier );

	dimensions						= Modal_Dimensions();
	modal_background.style.zIndex	= stack_entry.z_index_background;
	modal_background.style.display	= 'block';
	modal_background.style.height	= dimensions.y + 'px';
	modal_background.style.width	= dimensions.x + 'px';

	modal_stack.push( stack_entry );

	key_prefix						= dialog.PreferenceKeyPrefix();

	if ( key_prefix.length == 0 )
	{
		Modal_UserPreferenceList_Load_Heirarchy_Callback( {} );
	}
	else if ( typeof MMCachedPreferences !== 'undefined' )
	{
		cached_preferences			= cloneObject( MMCachedPreferenceList_Heirarchy( key_prefix ) );
		Modal_UserPreferenceList_Load_Heirarchy_Callback( cached_preferences ? cached_preferences : {} );
	}
	else
	{
		UserPreferenceList_Load_Heirarchy( key_prefix, function( response )
		{
			Modal_UserPreferenceList_Load_Heirarchy_Callback( response.success ? response.data : {} );
			Modal_EnableDisable( modal_background.style.zIndex );
		} );
	}

	Modal_EnableDisable( modal_background.style.zIndex );
	return stack_entry.z_index;
}

function Modal_UserPreferenceList_Load_Heirarchy_Callback( preferences )
{
	var position, dimensions, stack_entry;

	stack_entry		= modal_stack[ modal_stack.length -1 ];
	position		= preferences ? preferences.position : null;
	dimensions		= preferences ? preferences.dimensions : null;

	if ( preferences && preferences.position )		delete preferences.position;
	if ( preferences && preferences.dimensions )	delete preferences.dimensions;

	stack_entry.dialog.onRestorePosition( position, dimensions );
	stack_entry.dialog.onPreferenceLoad( preferences, stack_entry.onPreferenceLoad );

	stack_entry.keydown_stackentry	= KeyDownHandlerStack_Add( stack_entry.onEnter, stack_entry.onESC );
	stack_entry.dialog.onModalShow( stack_entry.z_index );
}

function Modal_Dimensions()
{
	var width, height, modal_background;

	modal_background	= document.getElementById( 'modal_background' );
	width				= modal_background.parentNode.scrollWidth;
	height				= modal_background.parentNode.scrollHeight;

	return { x : width, y : height };
}

function Modal_ViewPort()
{
	var width, height, modal_background;

	modal_background	= document.getElementById( 'modal_background' );
	width				= windowDimensions().x - offsetLeft( modal_background );
	height				= windowDimensions().y - offsetTop( modal_background );

	return { x : width, y : height };
}

function Modal_Rect()
{
	var modal_background = document.getElementById( 'modal_background' );

	return modal_background.getBoundingClientRect();
}

function Modal_ScrollTo( position )
{
	var stack_entry;

	if ( modal_stack.length )
	{
		stack_entry = modal_stack[ modal_stack.length - 1 ];

		if ( stack_entry.dialog instanceof MMDialog_Skin )
		{
			stack_entry.dialog.ScrollTo( position );
		}
	}
}

function Modal_Hide()
{
	var stack_entry;
	var modal_background = document.getElementById( 'modal_background' );

	if ( modal_stack.length == 0 )
	{
		return;
	}

	stack_entry = modal_stack.pop();
	stack_entry.dialog.onModalHide();

	Modal_ZIndex_Delete( stack_entry.identifier + '_background' );
	Modal_ZIndex_Delete( stack_entry.identifier );

	KeyDownHandlerStack_Remove( stack_entry.keydown_stackentry );

	if ( modal_stack.length > 0 )
	{
		if ( modal_stack[ modal_stack.length - 1 ].dialog && typeof modal_stack[ modal_stack.length - 1 ].dialog.Container === 'function' && modal_stack[ modal_stack.length - 1 ].dialog.Container().parentNode !== modal_background.parentNode )
		{
			modal_stack[ modal_stack.length - 1 ].dialog.Container().parentNode.appendChild( modal_background );
			Modal_Resize();
		}

		modal_background.style.zIndex = modal_stack[ modal_stack.length - 1 ].z_index_background;
		Modal_EnableDisable( modal_background.style.zIndex );
	}
	else
	{
		RemoveEvent( window, 'resize', Modal_OnResize );
		RemoveEvent( window, 'scroll', Modal_OnScroll );

		modal_background.style.display = 'none';

		Modal_EnableDisable( 0 );
		Modal_End_Handler();
	}
}

function Modal_Resize( inresize )
{
	var i;
	var window_height, window_width;
	var modal_background = document.getElementById( 'modal_background' );

	for ( i = 0; i < modal_stack.length; i++ )
	{
		modal_stack[ i ].dialog.onModalResize( inresize );
	}

	if ( modal_background && modal_background.style.display == 'block' )
	{
		if ( window.innerWidth )
		{
			window_width	= window.innerWidth;
			window_height	= window.innerHeight;
		}
		else if ( document.documentElement && document.documentElement.clientWidth )
		{
			window_width	= document.documentElement.clientWidth;
			window_height	= document.documentElement.clientHeight;
		}
		else if ( document.body && document.body.clientWidth )
		{
			window_width	= document.body.clientWidth;
			window_height	= document.body.clientHeight;
		}
		else
		{
			return;
		}

		if ( !inresize || ( ( window_height !== this.last_window_height ) || ( window_width !== this.last_window_width ) ) )
		{
			this.last_window_height				= window_height;
			this.last_window_width				= window_width;

			modal_background.style.display		= 'none';
			modal_background.style.height		= Modal_Dimensions().y + 'px';
			modal_background.style.width		= Modal_Dimensions().x + 'px';
			modal_background.style.display		= 'block';
		}

		Modal_EnableDisable( modal_background.style.zIndex );
	}

	Modal_Resize_Handler();
}

function Modal_OnResize()
{
	setTimeout( function() { Modal_Resize( true ); }, 0 );
	return true;
}

function Modal_OnScroll()
{
	var modal_background;

	Modal_Resize();
	
	modal_background			= document.getElementById( 'modal_background' );
	modal_background.innerHTML	= '';
	
	return true;
}

function Modal_Alert( message )
{
	var save_onkeydown, element_focus;

	element_focus 		= getFocusElement()
	save_onkeydown		= document.onkeydown;
	document.onkeydown	= modal_default_onkeydown;

	if ( element_focus )
	{
		element_focus.blur();
	}

	alert( message );

	if ( element_focus )
	{
		element_focus.focus();
	}

	document.onkeydown	= save_onkeydown;
}

function Modal_EnableDisable( zindex )
{
	var focus_element;

	Modal_EnableDisable_Elements( zindex, document.getElementsByTagName( "a" ) );
	Modal_EnableDisable_Elements( zindex, document.getElementsByTagName( "area" ) );
	Modal_EnableDisable_Elements( zindex, document.getElementsByTagName( "object" ) );

	Modal_EnableDisable_Elements( zindex, document.getElementsByTagName( "button" ) );
	Modal_EnableDisable_Elements( zindex, document.getElementsByTagName( "input" ) );
	Modal_EnableDisable_Elements( zindex, document.getElementsByTagName( "select" ) );
	Modal_EnableDisable_Elements( zindex, document.getElementsByTagName( "textarea" ) );

	focus_element = getFocusElement();

	if ( focus_element && focus_element.parentNode && ( Modal_zIndex( focus_element ) < zindex ) )
	{
		focus_element.blur();
	}
}

function Modal_EnableDisable_Elements( zindex, elements )
{
	var i, element, element_zindex;

	if ( elements == null || elements.length == 0 )	return;

	for ( i = 0; i < elements.length; i++ )
	{
		element			= elements[ i ];
		element_zindex	= Modal_zIndex( element );

		if ( element_zindex < zindex )
		{
			if ( element.modal_original_tabIndex == null )
			{
				element.modal_original_tabIndex	= element.tabIndex;
			}

			element.tabIndex					= -1;
		}
		else if ( element.modal_original_tabIndex != null )
		{
			element.tabIndex					= element.modal_original_tabIndex;
			element.modal_original_tabIndex		= null;
		}
	}
}

function Modal_zIndex( element )
{
	while ( element )
	{
		if ( element.style && element.style.zIndex )
		{
			return element.style.zIndex;
		}

		element = element.parentNode;
	}

	return 0;
}

function Modal_SavePreferences( dialog, prefs )
{
	var key_array, value_array;

	key_array	= new Array();
	value_array	= new Array();

	Modal_UserPreferencesToArrays( dialog.id, prefs, key_array, value_array );
	UserPreferenceList_Save( Store_Code, key_array, value_array, function( response ) { ; } );
}

function Modal_UserPreferencesToArrays( prefix, object, key_array, value_array )
{
	var key, value;

	for ( key in object )
	{
		value	= object[ key ];

		if ( typeof value == 'object' )
		{
			Modal_UserPreferencesToArrays( prefix + '.' + key, value, key_array, value_array );
		}
		else
		{
			key_array.push( prefix + '.' + key );
			value_array.push( value.toString() );
		}
	}
}

// MMDialog_Skin
////////////////////////////////////////////////////

function MMDialog_Skin( dialog )
{
	var self = this;
	var scrollbar_element;

	this.orig_dialog				= dialog;
	this.title						= getScopedElementsByClassName( 'mm_dialog_title', dialog )[ 0 ];

	if ( !this.title )
	{
		return new Modal_Callbacks( dialog, dialog.id );
	}

	Modal_Callbacks.call( this, dialog, this.MivaDialogRegistryPrefix() );

	this.actionitemlist				= new Array();
	this.key_prefix					= generateKeyPrefix() + '.' + dialog.id;
	this.shouldrender				= false;

	this.skinned_onEnter			= null;
	this.skinned_onESC				= null;
	this.skinned_onPreferenceLoad	= null;

	this.last_actionbar_height		= 0;
	this.last_title_height			= 0;
	this.last_window_height			= 0;
	this.last_window_width			= 0;
	this.last_dialog_width			= 0;
	this.last_dialog_height			= 0;

	this.positioned					= false;
	this.position_top				= 0;
	this.position_left				= 0;

	classNameAddIfMissing( this.orig_dialog, 'mm9_skinned_dialog' );

	this.dialog						= newElement( 'div', { 'class': 'mm9_skinned_dialog_container' },				null, this.orig_dialog.parentNode );
	this.content_container			= newElement( 'div', { 'class': 'mm_dialog_content_container' },				null, this.orig_dialog );
	this.content					= newElement( 'div', { 'class': 'mm_dialog_content' },							null, this.content_container );
	this.close						= newElement( 'div', { 'class': 'mm9_dialog_close mm9_mivaicon icon-cancel' },	null, this.orig_dialog );
	this.actionbar					= newElement( 'div', { 'class': 'mm9_dialog_actionbar' },						null, this.orig_dialog );

	scrollbar_element				= newElement( 'div', { 'class': 'mm_dialog_skinned_scrollbar_width' },			null, document.body );
	this.scrollbar_width			= scrollbar_element.offsetWidth - scrollbar_element.clientWidth;
	scrollbar_element.parentNode.removeChild( scrollbar_element );

	this.render_read				= function( data ) { self.Render_Read( data ); };
	this.render_write				= function( data ) { self.Render_Write( data ); };

	this.event_close_onclick		= function( event ) { ( typeof self.skinned_onESC === 'function' ) ? self.skinned_onESC() : Modal_Hide(); return eventStopPropagation( event ? event : window.event ); };
	this.event_move_onmousedown		= function( event ) { return self.Move_OnMouseDown( event ? event : window.event ); };
	this.event_move_onmousemove		= function( event ) { return self.Move_OnMouseMove( event ? event : window.event ); };
	this.event_move_onmouseup		= function( event ) { return self.Move_OnMouseUp( event ? event : window.event ); };
	this.event_returnfalse			= function() { return false; };

	AddEvent( this.title,	'mousedown',	this.event_move_onmousedown );
	AddEvent( this.close,	'click',		this.event_close_onclick );

	this.dialog.appendChild( this.orig_dialog );
	this.Initialize();
}

DeriveFrom( Modal_Callbacks, MMDialog_Skin );

MMDialog_Skin.prototype.Set_SkinnedOnEnter = function( onEnter )
{
	this.skinned_onEnter = onEnter;
}

MMDialog_Skin.prototype.Set_SkinnedOnESC = function( onESC )
{
	this.skinned_onESC = onESC;
}

MMDialog_Skin.prototype.Set_SkinnedOnPreferenceLoad = function( onPreferenceLoad )
{
	this.skinned_onPreferenceLoad = onPreferenceLoad;
}

MMDialog_Skin.prototype.Container = function()
{
	return this.dialog;
}

MMDialog_Skin.prototype.ScrollTo = function( position )
{
	if ( position === 'top' )			this.content_container.scrollTop = 0;
	else if ( position === 'bottom' )	this.content_container.scrollTop = this.content_container.scrollHeight - this.content_container.clientHeight;
	else								this.content_container.scrollTop = position;
}

MMDialog_Skin.prototype.Initialize = function()
{
	var i, j, i_len, j_len, buttons, elementlist_buttons, elementlist_children, elementlist_left_buttons_container, elementlist_right_button_container;

	//
	// Scrape buttons
	//

	elementlist_left_buttons_container		= getScopedElementsByClassName( 'mm_dialog_buttons_left', this.orig_dialog );
	elementlist_right_button_container		= getScopedElementsByClassName( 'mm_dialog_buttons_right', this.orig_dialog );
	buttons									= new Array();

	this.orig_dialog.insertBefore( this.title, this.content_container );

	if ( elementlist_left_buttons_container && elementlist_left_buttons_container.length )
	{
		for ( i = 0, i_len = elementlist_left_buttons_container.length; i < i_len; i++ )
		{
			elementlist_buttons	= elementlist_left_buttons_container[ i ].getElementsByTagName( 'input' );

			for ( j = 0, j_len = elementlist_buttons.length; j < j_len; j++ )
			{
				if ( elementlist_buttons[ j ].type.toLowerCase() === 'button' )
				{
					buttons.push( elementlist_buttons[ j ] );
				}
			}

			elementlist_left_buttons_container[ i ].style.display = 'none';
		}
	}

	if ( elementlist_right_button_container && elementlist_right_button_container.length )
	{
		for ( i = 0, i_len = elementlist_right_button_container.length; i < i_len; i++ )
		{
			elementlist_buttons	= elementlist_right_button_container[ i ].getElementsByTagName( 'input' );

			for ( j = 0, j_len = elementlist_buttons.length; j < j_len; j++ )
			{
				if ( elementlist_buttons[ j ].type.toLowerCase() === 'button' )
				{
					buttons.push( elementlist_buttons[ j ] );
				}
			}

			elementlist_right_button_container[ i ].style.display = 'none';
		}
	}

	if ( buttons.length )
	{
		classNameAddIfMissing( this.actionbar, 'visible' );

		for ( i = 0, i_len = buttons.length; i < i_len; i++ )
		{
			if ( i === i_len - 1 )
			{
				if ( buttons[ i ].value.toLowerCase() == 'cancel' ||
					 buttons[ i ].value.toLowerCase() == 'close' )						classNameAddIfMissing( buttons[ i ], 'mm_legacy_input_button_style_secondary' );
				else if ( buttons[ i ].value.toLowerCase() == 'reset' )					classNameAddIfMissing( buttons[ i ], 'mm_legacy_input_button_style_negative' );
				else if ( buttons[ i ].value.toLowerCase().indexOf( 'delete' ) == 0 )	classNameAddIfMissing( buttons[ i ], 'mm_legacy_input_button_style_negative' );
				else																	classNameAddIfMissing( buttons[ i ], 'mm_legacy_input_button_style_primary' );
			}
			else
			{
				if ( buttons[ i ].value.toLowerCase() == 'reset' )						classNameAddIfMissing( buttons[ i ], 'mm_legacy_input_button_style_negative_muted' );
				else if ( buttons[ i ].value.toLowerCase().indexOf( 'delete' ) == 0 )	classNameAddIfMissing( buttons[ i ], 'mm_legacy_input_button_style_negative_muted' );
				else																	classNameAddIfMissing( buttons[ i ], 'mm_legacy_input_button_style_secondary' );
			}

			this.actionbar.appendChild( buttons[ i ] );
			this.actionitemlist.push( buttons[ i ] );
		}
	}

	//
	// Shift original dialog elements into this.content
	//

	elementlist_children = new Array();

	for ( i = 0, i_len = this.orig_dialog.childNodes.length; i < i_len; i++ )
	{
		elementlist_children.push( this.orig_dialog.childNodes[ i ] );
	}

	for ( i = 0, i_len = elementlist_children.length; i < i_len; i++ )
	{
		if ( elementlist_children[ i ] !== this.title				&& 
			 elementlist_children[ i ] !== this.close				&&
			 elementlist_children[ i ] !== this.content_container	&&
			 elementlist_children[ i ] !== this.content				&&
			 elementlist_children[ i ] !== this.actionbar )
		{
			this.content.appendChild( elementlist_children[ i ] );
		}
	}
}

MMDialog_Skin.prototype.PreferenceKeyPrefix = function()
{
	return this.key_prefix;
}

MMDialog_Skin.prototype.MivaDialogRegistryPrefix = function()
{
	return this.orig_dialog.id;
}

MMDialog_Skin.prototype.Move_OnMouseDown = function( e )
{
	var rightclick;

	if ( 'which' in e )					rightclick = ( e.which == 3 ); 
    else if ( 'button' in e )			rightclick = ( e.button == 2 );
	else								rightclick = false;

	if ( rightclick )					return;

	this.started						= true;
	this.move_target					= e.target ? e.target : e.srcElement;
	this.move_startpos					= captureMousePosition( e );
	this.move_originalposition_left		= this.position_left;
	this.move_originalposition_top		= this.position_top;

	document.body.style.cursor			= 'move';
	this.title.style.cursor				= 'move';

	AddEvent( document, 'mousemove',	this.event_move_onmousemove );
	AddEvent( document, 'mouseup',		this.event_move_onmouseup );
	AddEvent( window,	'blur',			this.event_move_onmouseup );

	clearTextSelection();
	document.body.focus();
	document.body.unselectable			= 'on';
	document.onselectstart				= this.event_returnfalse;
	this.move_target.ondragstart		= this.event_returnfalse;

	if ( this.move_target.setCapture )
	{
		this.move_target.setCapture();
	}
}

MMDialog_Skin.prototype.Move_OnMouseMove = function( e )
{
	var mousepos;

	if ( this.started )
	{
		eventPreventDefault( e );
		this.started					= false;
	}

	clearTextSelection();

	mousepos				= captureMousePosition( e );

	this.positioned			= true;
	this.position_left		= this.move_originalposition_left + ( mousepos.x - this.move_startpos.x );
	this.position_top		= this.move_originalposition_top + ( mousepos.y - this.move_startpos.y );
	this.shouldrender		= true;
}

MMDialog_Skin.prototype.Move_OnMouseUp = function( e )
{
	var key_array, value_array;

	RemoveEvent( document,	'mousemove',	this.event_move_onmousemove );
	RemoveEvent( document,	'mouseup',		this.event_move_onmouseup );
	RemoveEvent( window,	'blur',			this.event_move_onmouseup );

	document.body.style.cursor		= 'default';
	this.title.style.cursor			= 'default';

	document.body.unselectable		= null;
	document.onselectstart			= null;
	this.move_target.ondragstart	= null;

	if ( this.move_target.releaseCapture )
	{
		this.move_target.releaseCapture();
	}

	if ( this.position_left < 0 )	this.position_left = 0;
	if ( this.position_top < 0 )	this.position_top = 0;

	this.shouldrender				= true;
	key_array						= [ this.key_prefix + '.position.top', this.key_prefix + '.position.left'];
	value_array						= [ this.position_top, this.position_left ];

	UserPreferenceList_Save( Store_Code, key_array, value_array, function( response ) { ; } );
	Modal_Resize();
}

MMDialog_Skin.prototype.onRestorePosition = function( position, dimensions )
{
	if ( position )
	{
		this.positioned		= true;
		this.position_top	= stod_def_nonneg( position.top,	this.position_top );
		this.position_left	= stod_def_nonneg( position.left,	this.position_left );
	}
}

MMDialog_Skin.prototype.onModalShow = function( z_index )
{
	this.visible				= true;
	this.dialog.style.zIndex	= z_index;
	this.dialog.style.height	= '';
	this.dialog.style.width		= '';
	this.dialog.style.overflow	= '';

	this.Redraw();
	MivaDialogRegistry_OnShow( this.MivaDialogRegistryPrefix() );
	MMRender_onRender_AddHook( this.render_read, this.render_write );
}

MMDialog_Skin.prototype.onModalHide = function()
{
	this.visible				= false;
	this.dialog.style.left		= '-10000px';
	this.dialog.style.top		= 0;
	this.dialog.style.height	= '1px';
	this.dialog.style.width		= '1px';
	this.dialog.style.overflow	= 'hidden';

	MivaDialogRegistry_OnHide( this.MivaDialogRegistryPrefix() );
	MMRender_onRender_RemoveHook( this.render_read, this.render_write );
}

MMDialog_Skin.prototype.Render_Read = function( data )
{
	data.horizontal_scrollbar_present	= this.content_container.scrollWidth > this.content_container.clientWidth;
	data.actionbar_height				= this.actionbar.offsetHeight;
	data.title_height					= this.title.offsetHeight;
	data.dimensions						= windowDimensions();
	data.rect							= this.dialog.getBoundingClientRect();
}

MMDialog_Skin.prototype.Render_Write = function( data )
{
	var redraw;

	if ( data.horizontal_scrollbar_present )
	{
		redraw									= true;

		this.content_container.style.width		= 'auto';
		this.content_container.style.width		= stoi_def_nonneg( this.content_container.offsetWidth + ( this.content_container.scrollWidth > this.content_container.clientWidth ? this.scrollbar_width : 0 ), 0 ) + 'px';
	}

	if ( data.actionbar_height !== this.last_actionbar_height	||
		 data.title_height !== this.last_title_height			||
		 data.dimensions.y !== this.last_window_height			||
		 data.dimensions.x !== this.last_window_width )
	{
		redraw									= true;

		this.last_actionbar_height				= data.actionbar_height;
		this.last_title_height					= data.title_height;
		this.last_window_height					= data.dimensions.y;
		this.last_window_width					= data.dimensions.x;

		this.content_container.style.maxHeight	= ( data.dimensions.y - ( this.actionbar.offsetHeight + this.title.offsetHeight ) ) + 'px';
	}

	if ( data.rect.width !== this.last_dialog_width ||
		 data.rect.height !== this.last_dialog_height )
	{
		redraw									= true;

		this.last_dialog_width					= data.rect.width;
		this.last_dialog_height					= data.rect.height;
	}

	if ( this.shouldrender )
	{
		redraw									= true;
		this.shouldrender						= false;
	}

	if ( redraw )
	{
		this.Redraw();
	}
}

MMDialog_Skin.prototype.Redraw = function()
{
	var rect, rect_parent, window_dimensions;

	rect					= this.dialog.getBoundingClientRect();
	rect_parent				= this.dialog.parentNode.getBoundingClientRect();
	window_dimensions		= windowDimensions();

	if ( !this.positioned )
	{
		this.position_left	= window_dimensions.x / 2 - rect.width / 2;
		this.position_top	= stoi_def_nonneg( Math.min( ( ( window_dimensions.y - rect_parent.top ) / 4 ), ( ( window_dimensions.y - rect_parent.top ) / 2 ) - ( rect.height / 2 ) ), 0 );
	}

	if ( this.position_left < 0 )	this.position_left	= 0;
	if ( this.position_top < 0 )	this.position_top	= 0;

	this.dialog.style.left	= this.position_left + 'px';
	this.dialog.style.top	= this.position_top + 'px';
}
