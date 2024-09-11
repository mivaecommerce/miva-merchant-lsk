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
// Prefix         : MER-UTL-CBFR-
// Next Error Code: 2
//

function Runtime_CombinationFacetValueList_Load_Field( facet_code, field_values, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'runtime',
							 'combofacets',
							 'Runtime_CombinationFacetValueList_Load_Field',
							 'CombinationFacet_Code='	+ encodeURIComponent( facet_code ) +
							 '&CombinationFacetValues='	+ EncodeArray( field_values ),
							 delegator );
}

function Runtime_CombinationFacetAppliedValueList_Load_Cookie( facet_code, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'runtime',
							 'combofacets',
							 'Runtime_CombinationFacetAppliedValueList_Load_Cookie',
							 'CombinationFacet_Code='	+ encodeURIComponent( facet_code ),
							 delegator );
}

function Runtime_CombinationFacetAppliedValueList_Set_Cookie( facet_code, field_values, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'runtime',
							 'combofacets',
							 'Runtime_CombinationFacetAppliedValueList_Set_Cookie',
							 'CombinationFacet_Code='	+ encodeURIComponent( facet_code ) +
							 '&CombinationFacetValues='	+ EncodeArray( field_values ),
							 delegator );
}

function Runtime_CombinationFacetAppliedValueList_Clear_Cookie( facet_code, callback, delegator )
{
	return AJAX_Call_Module( callback,
							 'runtime',
							 'combofacets',
							 'Runtime_CombinationFacetAppliedValueList_Clear_Cookie',
							 'CombinationFacet_Code='	+ encodeURIComponent( facet_code ),
							 delegator );
}

function MMCombinationFacet( facet_code )
{
	this.fields				= new Array();
	this.facet_code			= facet_code;
	this.button_setcookie	= null;
	this.button_clearcookie	= null;
}

MMCombinationFacet.prototype.SetButton_SetCookie = function( element_setcookie )
{
	var self = this;

	this.button_setcookie			= element_setcookie;
	this.button_setcookie.onclick	= function( event ) { return self.Event_SetCookie_OnClick( event ? event : window.event ); };

	this.Button_SetCookie_Hide();
	this.Button_SetCookie_Disable();
}

MMCombinationFacet.prototype.Button_SetCookie_Disable = function()
{
	if ( this.button_setcookie )
	{
		this.button_setcookie.disabled	= true;
		this.button_setcookie.className	= classNameAdd( this.button_setcookie, 'disabled' );
	}
}

MMCombinationFacet.prototype.Button_SetCookie_Enable = function()
{
	if ( this.button_setcookie )
	{
		this.button_setcookie.disabled	= false;
		this.button_setcookie.className	= classNameRemove( this.button_setcookie, 'disabled' );
	}
}

MMCombinationFacet.prototype.Button_SetCookie_Show = function()
{
	if ( this.button_setcookie )
	{
		this.button_setcookie.style.display = '';
	}
}

MMCombinationFacet.prototype.Button_SetCookie_Hide = function()
{
	if ( this.button_setcookie )
	{
		this.button_setcookie.style.display = 'none';
	}
}

MMCombinationFacet.prototype.Event_SetCookie_OnClick = function( e )
{
	if ( this.button_setcookie && !this.button_setcookie.disabled )
	{
		this.SetCookie();
	}

	return eventPreventDefault( e );
}

MMCombinationFacet.prototype.SetButton_ClearCookie = function( element_clearcookie )
{
	var self = this;

	this.button_clearcookie			= element_clearcookie;
	this.button_clearcookie.onclick	= function( event ) { return self.Event_ClearCookie_OnClick( event ? event : window.event ); };

	this.Button_ClearCookie_Hide();
	this.Button_ClearCookie_Disable();
}

MMCombinationFacet.prototype.Button_ClearCookie_Disable = function()
{
	if ( this.button_clearcookie )
	{
		this.button_clearcookie.disabled	= true;
		this.button_clearcookie.className	= classNameAdd( this.button_clearcookie, 'disabled' );
	}
}

MMCombinationFacet.prototype.Button_ClearCookie_Enable = function()
{
	if ( this.button_clearcookie )
	{
		this.button_clearcookie.disabled	= false;
		this.button_clearcookie.className	= classNameRemove( this.button_clearcookie, 'disabled' );
	}
}

MMCombinationFacet.prototype.Button_ClearCookie_Show = function()
{
	if ( this.button_clearcookie )
	{
		this.button_clearcookie.style.display = '';
	}
}

MMCombinationFacet.prototype.Button_ClearCookie_Hide = function()
{
	if ( this.button_clearcookie )
	{
		this.button_clearcookie.style.display = 'none';
	}
}

MMCombinationFacet.prototype.Event_ClearCookie_OnClick = function( e )
{
	if ( this.button_clearcookie && !this.button_clearcookie.disabled )
	{
		this.ClearCookie();
	}

	return eventPreventDefault( e );
}

MMCombinationFacet.prototype.FacetField_Append = function( field )
{
	var self = this;

	field.index				= this.fields.length;

	field.onLoad			= function( callback ) { self.Field_Load( field, callback ); };
	field.onValueChanged	= function( value )
	{
		if ( field.index === -1 )								return;
		else if ( field.index === self.fields.length - 1 )		self.SelectionComplete();
		else if ( field.index + 1 < self.fields.length )		self.Field_Load_Index( field.index + 1 );
	}

	field.Disable();
	this.fields.push( field );
}

MMCombinationFacet.prototype.Load_Cookie = function()
{
	var self = this;
	Runtime_CombinationFacetAppliedValueList_Load_Cookie( this.facet_code, function( response ) { self.Runtime_CombinationFacetAppliedValueList_Load_Cookie_Callback( response ); } );
}

MMCombinationFacet.prototype.Runtime_CombinationFacetAppliedValueList_Load_Cookie_Callback = function( response )
{
	var i, i_len;

	if ( response.success && response.data && Array.isArray( response.data ) && response.data.length !== 0 && response.data.length <= this.fields.length )
	{
		for ( i = 0, i_len = this.fields.length; i < i_len; i++ )
		{
			if ( i in response.data )
			{
				this.fields[ i ].AddOption( response.data[ i ], response.data[ i ], true, true );
				this.fields[ i ].SetValue( response.data[ i ] );
				this.fields[ i ].Disable();
			}
			else
			{
				this.fields[ i ].Disable();
				this.fields[ i ].Hide();
			}
		}

		this.Initialize_CookieSet();
	}
	else
	{
		this.Initialize_NoCookieSet();
	}
}

MMCombinationFacet.prototype.Initialize_NoCookieSet = function()
{
	this.Button_SetCookie_Show();
	this.Button_SetCookie_Disable();
	this.Button_ClearCookie_Hide();
	this.Button_ClearCookie_Disable();
	this.Field_Load_Index( 0 );
}

MMCombinationFacet.prototype.Initialize_CookieSet = function()
{
	this.Button_SetCookie_Hide();
	this.Button_SetCookie_Disable();
	this.Button_ClearCookie_Show();
	this.Button_ClearCookie_Enable();
}

MMCombinationFacet.prototype.Field_Load_Index = function( index )
{
	var i, i_len;

	if ( index >= this.fields.length )
	{
		return this.SelectionComplete();
	}

	for ( i = index, i_len = this.fields.length; i < i_len; i++ )
	{
		this.fields[ i ].Reset();
	}

	this.fields[ index ].Load();
}

MMCombinationFacet.prototype.Field_Load = function( field, callback )
{
	var self = this;
	var i, i_len, field_values;

	this.Button_SetCookie_Disable();

	field_values = new Array();

	for ( i = 0, i_len = this.fields.length; i < i_len; i++ )
	{
		if ( i === field.index )
		{
			break;
		}
		else if ( this.fields[ i ].Disabled() || this.fields[ i ].GetValue( null ) === null )
		{
			return;
		}
		else
		{
			field_values.push( this.fields[ i ].GetValue() );
		}
	}

	Runtime_CombinationFacetValueList_Load_Field( this.facet_code, field_values, function( response ) { self.Field_Load_Callback( response, field, callback ); } );
}

MMCombinationFacet.prototype.Field_Load_Callback = function( response, field, callback )
{
	var i, i_len;

	if ( !response.success )
	{
		return;
	}

	if ( response.data.length === 0 )
	{
		for ( i = 0, i_len = this.fields.length; i < i_len; i++ )
		{
			if ( i < field.index )
			{
				this.fields[ i ].Show();
				this.fields[ i ].Enable();
			}
			else
			{
				this.fields[ i ].Hide();
				this.fields[ i ].Disable();
			}
		}

		return this.SelectionComplete();
	}

	for ( i = 0, i_len = this.fields.length; i < i_len; i++ )
	{
		if ( i > field.index )	this.fields[ i ].Disable();
		else					this.fields[ i ].Enable();

		this.fields[ i ].Show();
	}

	callback( response.data );
}

MMCombinationFacet.prototype.IsSelectionComplete = function()
{
	var i, i_len;

	for ( i = 0, i_len = this.fields.length; i < i_len; i++ )
	{
		if ( this.fields[ i ].Visible() && ( this.fields[ i ].Disabled() || this.fields[ i ].GetValue( null ) === null ) )
		{
			return false;
		}
	}

	return true;
}

MMCombinationFacet.prototype.SelectionComplete = function()
{
	if ( this.button_setcookie )
	{
		return this.Button_SetCookie_Enable();
	}

	this.onSelectionComplete();
}

MMCombinationFacet.prototype.SetCookie = function()
{
	var i, i_len, field_values;

	field_values = new Array();

	for ( i = 0, i_len = this.fields.length; i < i_len; i++ )
	{
		if ( this.fields[ i ].Disabled() || this.fields[ i ].GetValue( null ) === null )
		{
			break;
		}

		field_values.push( this.fields[ i ].GetValue() );
		this.fields[ i ].Disable();
	}

	this.SetCookie_LowLevel( field_values );
}

MMCombinationFacet.prototype.SetCookie_LowLevel = function( field_values )
{
	var self = this;

	this.Button_SetCookie_Disable();
	Runtime_CombinationFacetAppliedValueList_Set_Cookie( this.facet_code, field_values, function( response )
	{
		self.Button_SetCookie_Enable();
		self.onSetCookie();
	} );
}

MMCombinationFacet.prototype.ClearCookie = function()
{
	var self = this;
	var i, i_len;

	for ( i = 0, i_len = this.fields.length; i < i_len; i++ )
	{
		this.fields[ i ].Disable();
	}

	this.Button_ClearCookie_Disable();
	Runtime_CombinationFacetAppliedValueList_Clear_Cookie( this.facet_code, function( response )
	{
		self.Button_ClearCookie_Enable();
		self.onClearCookie();
	} );
}

MMCombinationFacet.prototype.onSetCookie			= function() { window.location.href = window.location.protocol + '//' + window.location.host + window.location.pathname; };
MMCombinationFacet.prototype.onClearCookie			= function() { window.location.href = window.location.protocol + '//' + window.location.host + window.location.pathname; };
MMCombinationFacet.prototype.onSelectionComplete	= function() { this.SetCookie(); };

// MMCombinationFacet_Select
////////////////////////////////////////////////////

function MMCombinationFacet_Select( element )
{
	var self = this;

	this.element						= typeof element === 'string' ? document.getElementById( element ) : element;
	this.element.onchange				= function( event ) { self.OnChange(); };

	this.selectone_enabled				= false;
	this.selectone_text					= '<Select One>';
	this.selectone_value				= '';
	this.selectone_option_selected		= false;
	this.selectone_option_disabled		= false;
	this.selectone_option				= null;

	this.loaded							= false;
	this.disabled						= false;
	this.deferred_selection				= null;
	this.onvaluechanged_hooks			= new Array();
	this.element.empty_length			= this.element.options.length;
}

MMCombinationFacet_Select.prototype.SetSelectOne = function( text, value, selected, disabled )
{
	this.element.options.length		= 0;
	this.element.empty_length		= 1;

	this.selectone_enabled			= true;
	this.selectone_text				= typeof text === 'string' ? text : '<Select One>';
	this.selectone_value			= typeof value === 'string' ? value : '';
	this.selectone_option_selected	= selected;
	this.selectone_option_disabled	= disabled;
	this.selectone_option			= this.AddOptionAtIndex( this.selectone_text, this.selectone_value, this.selectone_option_selected, this.selectone_option_disabled, 0 );
}

MMCombinationFacet_Select.prototype.Show = function()
{
	this.visible				= true;
	this.element.style.display	= '';
}

MMCombinationFacet_Select.prototype.Hide = function()
{
	this.visible				= false;
	this.element.style.display	= 'none';
}

MMCombinationFacet_Select.prototype.Visible = function()
{
	return this.visible;
}

MMCombinationFacet_Select.prototype.Enable = function()
{
	this.disabled			= false;
	this.element.disabled	= false;
}

MMCombinationFacet_Select.prototype.Disable = function()
{
	this.disabled			= true;
	this.element.disabled	= true;
}

MMCombinationFacet_Select.prototype.Disabled = function()
{
	return this.disabled;
}

MMCombinationFacet_Select.prototype.Empty = function()
{
	this.element.options.length = this.element.empty_length;
}

MMCombinationFacet_Select.prototype.Reset = function()
{
	this.element.options.length = this.element.empty_length;

	if ( this.selectone_enabled )	this.SetValue( this.selectone_value );
	else							this.SetValue( null );
}

MMCombinationFacet_Select.prototype.AddOptionAtIndex = function( text, value, selected, disabled, index )
{
	var i, i_len, option;

	option			= new Option( text, value );
	option.selected	= selected ? true : false;
	option.disabled	= disabled ? true : false;

	this.element.options[ index ] = option;

	if ( option.selected )
	{
		for ( i = 0, i_len = this.element.options.length - 1; i < i_len; i++ )
		{
			if ( i !== index )
			{
				this.element.options[ i ].selected = false;
			}
		}

		this.element.selectedIndex = index;
	}

	return option;
}

MMCombinationFacet_Select.prototype.AddOption = function( text, value, selected, disabled )
{
	return this.AddOptionAtIndex( text, value, selected, disabled, this.element.options.length );
}

MMCombinationFacet_Select.prototype.DisableOption = function( value, value_if_selected )
{
	var i, i_len;

	for ( i = 0, i_len = this.element.options.length; i < i_len; i++ )
	{
		if ( this.element.options[ i ].value === value )
		{
			if ( this.element.options[ i ].selected )
			{
				this.SetValue( value_if_selected );
			}

			this.element.options[ i ].disabled	= true;
		}
	}
}

MMCombinationFacet_Select.prototype.EnableOption = function( value )
{
	var i, i_len;

	for ( i = 0, i_len = this.element.options.length; i < i_len; i++ )
	{
		if ( this.element.options[ i ].value === value )
		{
			this.element.options[ i ].disabled	= false;
		}
	}
}

MMCombinationFacet_Select.prototype.SetValue = function( value )
{
	var self = this;
	var i, i_len, original_selected_value;

	if ( !this.loaded )
	{
		this.deferred_selection	= value;
		return;
	}

	this.element.onchange		= function( event ) { ; };
	original_selected_value		= this.GetValue( null );
	this.element.selectedIndex	= -1;

	for ( i = 0, i_len = this.element.options.length; i < i_len; i++ )
	{
		if ( this.element.options[ i ].value == value )
		{
			this.element.selectedIndex = i;
			break;
		}
	}

	if ( !this.Disabled() && original_selected_value !== value )
	{
		this.OnChange();
	}

	this.element.onchange		= function( event ) { self.OnChange(); };
}

MMCombinationFacet_Select.prototype.GetValue = function( default_value )
{
	var option;

	if ( this.element.selectedIndex < 0 || typeof ( option = this.element.options[ this.element.selectedIndex ] ) === 'undefined' || option.disabled )
	{
		return default_value;
	}

	return option.value;
}

MMCombinationFacet_Select.prototype.GetText = function( default_text )
{
	var option;

	if ( this.element.selectedIndex < 0 || typeof ( option = this.element.options[ this.element.selectedIndex ] ) === 'undefined' || option.disabled )
	{
		return default_text;
	}

	return option.text;
}

MMCombinationFacet_Select.prototype.GetAttribute = function( attribute )
{
	var option;

	if ( this.element.selectedIndex < 0 || typeof ( option = this.element.options[ this.element.selectedIndex ] ) === 'undefined' || option.disabled )
	{
		return '';
	}

	return option.getAttribute( attribute );
}

MMCombinationFacet_Select.prototype.SetLoading = function()
{
	this.Empty();
	this.Disable();
}

MMCombinationFacet_Select.prototype.Load = function()
{
	var self = this;

	this.loaded = false;

	if ( ( this.deferred_selection === null ) && this.element.selectedIndex >= 0 && this.element.options[ this.element.selectedIndex ] )
	{
		this.deferred_selection = this.element.options[ this.element.selectedIndex ].value;
	}

	this.SetLoading();
	this.onLoad( function( response ) { self.Load_Callback( response ); } );
}

MMCombinationFacet_Select.prototype.Load_Callback = function( data )
{
	var i, i_len;

	this.Show();
	this.Empty();
	this.Enable();

	for ( i = 0, i_len = data.length; i < i_len; i++ )
	{
		this.AddOption( data[ i ], data[ i ], false, false );
	}

	this.loaded = true;

	if ( this.deferred_selection !== null )
	{
		this.SetValue( this.deferred_selection );
		this.deferred_selection	= null;
	}
}

MMCombinationFacet_Select.prototype.OnChange = function()
{
	var value;

	if ( ( value = this.GetValue( null ) ) === null )
	{
		return;
	}

	this.onValueChanged( value );
}

MMCombinationFacet_Select.prototype.Focus = function()
{
	this.element.focus();
}

// Overridden by parent class
MMCombinationFacet_Select.prototype.onLoad			= function( callback ) { callback( { "success": false, "error_code": "MER-UTL-CBFR-00001", "error_message": "MMCombinationFacet_Select Derived Class did not override onLoad" } ); };
MMCombinationFacet_Select.prototype.onValueChanged	= function( value ) { ; };
