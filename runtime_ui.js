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

// Misc HTML/JavaScript functions
////////////////////////////////////////////////////

function MMProdList_FormElement_Value( element )
{
	var node, type;

	if ( element && element.nodeType === 1 )
	{
		node = element.nodeName.toLowerCase();

		if ( node == 'textarea' )
		{
			return element.value;
		}
		else if ( node == 'select' )
		{
			return ( element.selectedIndex != -1 && element.options[ element.selectedIndex ] ? element.options[ element.selectedIndex ].value : '' );
		}
		else if ( node == 'input' )
		{
			type = element.type.toLowerCase();

			if ( type == 'text' || type == 'hidden' )
			{
				return element.value;
			}
			else if ( type == 'radio' && element.checked )
			{
				return element.value;
			}
			else if ( type == 'checkbox' )
			{
				return element.checked ? element.value : '';
			}
		}
	}

	return '';
}

function MMProdList_AddNestedFacetValue( element, code, value, submit_delay )
{
	var form, entry;

	if ( element.form )																	form = element.form;
	else if ( !( form = getNearestElementAncestorNodeTypeOrNull( element, 'FORM' ) ) )	return;

	if ( !form.mmprodlist_updatequery_form_data )
	{
		form.mmprodlist_updatequery_form_data = new Array();
	}

	entry							= new Object();
	entry.element					= element;
	entry.onParametersGenerated		= function( form_params_struct, url_params_struct )
	{
		if ( form_params_struct[ code ] )
		{
			form_params_struct[ code ].values.push( value );
		}
		else if ( url_params_struct[ code ] )
		{
			url_params_struct[ code ].values.push( value );
		}
		else
		{
			form_params_struct[ code ]			= new Object();
			form_params_struct[ code ].name		= code;
			form_params_struct[ code ].values	= new Array();
			form_params_struct[ code ].values.push( value );
		}
	};

	form.mmprodlist_updatequery_form_data.push( entry );
	MMProdList_UpdateQuery_SubmitParameters_Timeout( form, submit_delay );
}

function MMProdList_RemoveNestedFacetValue( element, code, value, submit_delay )
{
	var form, entry;

	if ( element.form )																	form = element.form;
	else if ( !( form = getNearestElementAncestorNodeTypeOrNull( element, 'FORM' ) ) )	return;

	if ( !form.mmprodlist_updatequery_form_data )
	{
		form.mmprodlist_updatequery_form_data = new Array();
	}

	entry							= new Object();
	entry.element					= element;
	entry.onParametersGenerated		= function( form_params_struct, url_params_struct )
	{
		var i, i_len;

		if ( form_params_struct[ code ] )
		{
			for ( i = 0, i_len = form_params_struct[ code ].values.length; i < i_len; i++ )
			{
				if ( form_params_struct[ code ].values[ i ] == value )
				{
					form_params_struct[ code ].values.splice( i, form_params_struct[ code ].values.length - i );

					if ( form_params_struct[ code ].values.length == 0 )
					{
						if ( form_params_struct[ code + '_reset' ] )
						{
							form_params_struct[ code + '_reset' ].values	= [ '1' ];
						}
						else
						{
							form_params_struct[ code + '_reset' ]			= new Object();
							form_params_struct[ code + '_reset' ].name		= code + '_reset';
							form_params_struct[ code + '_reset' ].values	= [ '1' ];
						}
					}

					break;
				}
			}
		}

		if ( url_params_struct[ code ] )
		{
			for ( i = 0, i_len = url_params_struct[ code ].values.length; i < i_len; i++ )
			{
				if ( url_params_struct[ code ].values[ i ] == value )
				{
					url_params_struct[ code ].values.splice( i, url_params_struct[ code ].values.length - i );

					if ( url_params_struct[ code ].values.length == 0 )
					{
						if ( url_params_struct[ code + '_reset' ] )
						{
							url_params_struct[ code + '_reset' ].values	= [ '1' ];
						}
						else
						{
							url_params_struct[ code + '_reset' ]		= new Object();
							url_params_struct[ code + '_reset' ].name	= code + '_reset';
							url_params_struct[ code + '_reset' ].values	= [ '1' ];
						}
					}

					break;
				}
			}
		}
	};

	form.mmprodlist_updatequery_form_data.push( entry );
	MMProdList_UpdateQuery_SubmitParameters_Timeout( form, submit_delay );
}

function MMProdList_UpdateQuery( element, submit_delay )
{
	var form, entry;

	if ( element.form )																	form = element.form;
	else if ( !( form = getNearestElementAncestorNodeTypeOrNull( element, 'FORM' ) ) )	return;

	if ( !form.mmprodlist_updatequery_form_data )
	{
		form.mmprodlist_updatequery_form_data = new Array();
	}

	entry							= new Object();
	entry.element					= element;
	entry.onParametersGenerated		= null;

	form.mmprodlist_updatequery_form_data.push( entry );
	MMProdList_UpdateQuery_SubmitParameters_Timeout( form, submit_delay );
}

function MMProdList_UpdateQueryBuildParameters( form )
{
	var i, j, name, query, regex, match, value, i_len, j_len, params, member;
	var element, url_param, url_params_struct, form_params_struct, merged_params_struct;

	params				= new Array();
	url_params_struct	= new Object();
	form_params_struct	= new Object();

	query				= window.location.search.substring( 1 );
	regex				= /([^=&?]+)=([^&]+)/g;

	while ( ( match = regex.exec( query ) ) !== null )
	{
		name	= CharsetDecodeAttribute( match[ 1 ] );
		value	= CharsetDecodeAttribute( match[ 2 ] );

		if ( name == 'Offset'			||
			 name == 'SearchOffset'		||
			 name == 'RelatedOffset' 	||
			 name == 'CatListingOffset' ||
			 name == 'AllOffset' )
		{
			continue;
		}

		// Handle single-value inputs that are disabled by excluding them from url_params.  Handles rangesliders that
		// wouldn't be covered in the code below because the values don't match.

		if ( !form.elements[ name ] || ( typeof form.elements[ name ] !== 'object' ) || !form.elements[ name ].disabled )
		{
			if ( !url_params_struct[ name ] )
			{
				url_params_struct[ name ]			= new Object();
				url_params_struct[ name ].name		= name;
				url_params_struct[ name ].values	= new Array();
			}

			url_params_struct[ name ].values.push( value );
		}
	}

	for ( i = 0, i_len = form.elements.length; i < i_len; i++ )
	{
		if ( form.elements[ i ].disabled )
		{
			// Remove this particular value from the url_params, if it is present, and do
			// not add this value to the form_params.

			url_param = url_params_struct[ form.elements[ i ].name ];
			if ( url_param )
			{
				for ( j = 0, j_len = url_param.values.length; j < j_len; j++ )
				{
					if ( url_param.values[ j ] == form.elements[ i ].value )
					{
						url_param.values.splice( j, 1 );
						break;
					}
				}
			}

			continue;
		}

		if ( ( typeof form.elements[ i ].name === 'string' ) && form.elements[ i ].name.length )
		{
			if ( !form_params_struct[ form.elements[ i ].name ] )
			{
				form_params_struct[ form.elements[ i ].name ]			= new Object();
				form_params_struct[ form.elements[ i ].name ].name		= form.elements[ i ].name;
				form_params_struct[ form.elements[ i ].name ].values	= new Array();
			}

			form_params_struct[ form.elements[ i ].name ].values.push( MMProdList_FormElement_Value( form.elements[ i ] ) );
		}
	}

	if ( form.mmprodlist_updatequery_form_data )
	{
		for ( i = 0, i_len = form.mmprodlist_updatequery_form_data.length; i < i_len; i++ )
		{
			element = form.mmprodlist_updatequery_form_data[ i ].element;

			if ( !element.disabled && ( typeof element.name === 'string' ) && element.name.length && !form_params_struct[ element.name ] )
			{
				form_params_struct[ element.name ]			= new Object();
				form_params_struct[ element.name ].name		= element.name;
				form_params_struct[ element.name ].values	= new Array();

				form_params_struct[ element.name ].values.push( MMProdList_FormElement_Value( element ) );
			}

			if ( typeof form.mmprodlist_updatequery_form_data[ i ].onParametersGenerated === 'function' )
			{
				form.mmprodlist_updatequery_form_data[ i ].onParametersGenerated( form_params_struct, url_params_struct )
			}
		}
	}

	merged_params_struct = url_params_struct;

	for ( member in form_params_struct )
	{
		if ( form_params_struct.hasOwnProperty( member ) )
		{
			merged_params_struct[ member ] = form_params_struct[ member ];
		}
	}

	for ( member in merged_params_struct )
	{
		if ( merged_params_struct.hasOwnProperty( member ) )
		{
			params.push( merged_params_struct[ member ] );
		}
	}

	return params;
}

function MMProdList_UpdateQuery_SubmitParameters( form, params )
{
	var i, j, i_len, j_len, elements, params_output_array;

	if ( window.mmprodlist_updatequery_submitparameters_submitted )
	{
		return;
	}

	window.mmprodlist_updatequery_submitparameters_submitted = true;
	params_output_array										 = new Array();

	params.sort( function( a, b ) { return sortAlphaNumeric( a.name, b.name, true ); } );

	for ( i = 0, i_len = params.length; i < i_len; i++ )
	{
		for ( j = 0, j_len = params[ i ].values.length; j < j_len; j++ )
		{
			if ( params[ i ].values[ j ].length )
			{
				params_output_array.push( encodeURIComponent( params[ i ].name ) + '=' + encodeURIComponent( params[ i ].values[ j ] ) );
			}
		}
	}

	if ( window.mmprodlist_updatequery_submitparameters_timeout )
	{
		clearTimeout( window.mmprodlist_updatequery_submitparameters_timeout );
		delete window.mmprodlist_updatequery_submitparameters_timeout;
	}

	if ( window.mmprodlist_updatequery_submitparameters_timeout_event_attached )
	{
		elements = form.getElementsByTagName( '*' );

		for ( i = 0, i_len = elements.length; i < i_len; i++ )
		{
			RemoveEvent( elements[ i ], 'mousedown',	window.mmprodlist_updatequery_submitparameters_timeout_event_function );
			RemoveEvent( elements[ i ], 'mousemove',	window.mmprodlist_updatequery_submitparameters_timeout_event_function );
			RemoveEvent( elements[ i ], 'mouseup',		window.mmprodlist_updatequery_submitparameters_timeout_event_function );
		}
	}

	window.location.href = [ window.location.protocol, '//', window.location.host, window.location.pathname ].join( '' ) + ( params_output_array.length ? ( '?' + params_output_array.join( '&' ) ) : '' );
}

// Overridable: If different timeout functionality is desired, override
// the following function "MMProdList_UpdateQuery_SubmitParameters_Timeout"

function MMProdList_UpdateQuery_SubmitParameters_Timeout( form, submit_delay )
{
	var i, i_len, elements;

	submit_delay = stoi_def_nonneg( submit_delay, 0 )

	if ( window.mmprodlist_updatequery_submitparameters_timeout )
	{
		clearTimeout( window.mmprodlist_updatequery_submitparameters_timeout );
		delete window.mmprodlist_updatequery_submitparameters_timeout;
	}

	if ( submit_delay === 0 )
	{
		return MMProdList_UpdateQuery_SubmitParameters_LowLevel( form );
	}

	window.mmprodlist_updatequery_submitparameters_timeout = setTimeout( function() { MMProdList_UpdateQuery_SubmitParameters_LowLevel( form ); }, submit_delay );

	if ( !window.mmprodlist_updatequery_submitparameters_timeout_event_attached )
	{
		window.mmprodlist_updatequery_submitparameters_timeout_event_attached = true;
		window.mmprodlist_updatequery_submitparameters_timeout_event_function = function( event ) { MMProdList_UpdateQuery_SubmitParameters_Timeout( form, submit_delay ); };

		elements = form.getElementsByTagName( '*' );

		for ( i = 0, i_len = elements.length; i < i_len; i++ )
		{
			AddEvent( elements[ i ], 'mousedown',	window.mmprodlist_updatequery_submitparameters_timeout_event_function );
			AddEvent( elements[ i ], 'mousemove',	window.mmprodlist_updatequery_submitparameters_timeout_event_function );
			AddEvent( elements[ i ], 'mouseup',		window.mmprodlist_updatequery_submitparameters_timeout_event_function );
		}
	}
}

function MMProdList_UpdateQuery_SubmitParameters_LowLevel( form ) 
{
	var params = MMProdList_UpdateQueryBuildParameters( form );

	MMProdList_UpdateQuery_Notify_Updating( form );
	MMProdList_UpdateQuery_SubmitParameters( form, params );
	MMProdList_UpdateQuery_Notify_Updated( form );
}

// Overridable: If different notification functionality is desired, override
// the following function "MMProdList_UpdateQuery_Notify_Updating"

function MMProdList_UpdateQuery_Notify_Updating( form )
{
	var i, i_len;

	/**
	 * Disable all inputs while keeping track of what is already disabled
	 */

	for ( i = 0, i_len = form.elements.length; i < i_len; i++ )
	{
		form.elements[ i ].mm_original_disabled = form.elements[ i ].disabled;
		form.elements[ i ].setAttribute( 'disabled', 'disabled' );
	}
}

// Overridable: If different updated functionality is desired, override
// the following function "MMProdList_UpdateQuery_Notify_Updated"

function MMProdList_UpdateQuery_Notify_Updated( form )
{
	var i, i_len;

	/**
	 * Enable any inputs which were not already disabled and setup the form for resubmission
	 */

	for ( i = 0, i_len = form.elements.length; i < i_len; i++ )
	{
		if ( form.elements[ i ].hasOwnProperty( 'mm_original_disabled' ) )
		{
			if ( !form.elements[ i ].mm_original_disabled )
			{
				form.elements[ i ].removeAttribute( 'disabled' );
			}

			delete form.elements[ i ].mm_original_disabled;
		}
	}

	window.mmprodlist_updatequery_submitparameters_submitted = false;
}

function MMFacet_RangeSlider_Initialize()
{
	var i, name, i_len, module_code, facet_code, elementlist, range_low, range_high, allow_value_input, selected_range_low, selected_range_high;

	elementlist = document.querySelectorAll( '[data-mm-facet-rangeslider-name]' );

	for ( i = 0, i_len = elementlist.length; i < i_len; i++ )
	{
		module_code				= elementlist[ i ].getAttribute( 'data-mm-facet-module-code' );
		facet_code				= elementlist[ i ].getAttribute( 'data-mm-facet-code' );
		name					= elementlist[ i ].getAttribute( 'data-mm-facet-rangeslider-name' );
		range_low				= stod_def( elementlist[ i ].getAttribute( 'data-mm-facet-rangeslider-range-low' ), 0 );
		range_high				= stod_def( elementlist[ i ].getAttribute( 'data-mm-facet-rangeslider-range-high' ), 0 );
		selected_range_low		= stod_def( elementlist[ i ].getAttribute( 'data-mm-facet-rangeslider-selected-range-low' ), 0 );
		selected_range_high		= stod_def( elementlist[ i ].getAttribute( 'data-mm-facet-rangeslider-selected-range-high' ), range_high );

		if ( elementlist[ i ].hasAttribute( 'data-mm-facet-rangeslider-allow-value-input' ) )	allow_value_input = elementlist[ i ].getAttribute( 'data-mm-facet-rangeslider-allow-value-input' ).toLowerCase();
		else																					allow_value_input = 'No';

		elementlist[ i ].mm_facet_rangeslider = new MMFacet_RangeSlider( elementlist[ i ], module_code, facet_code, name, range_low, range_high, selected_range_low, selected_range_high, allow_value_input === 'yes' || allow_value_input === '1' || allow_value_input === 'true' );
	}
}

// MMFacet_RangeSlider
////////////////////////////////////////////////////

function MMFacet_RangeSlider( element_parent, module_code, facet_code, name, range_low, range_high, selected_range_low, selected_range_high, allow_value_input )
{
	var self = this;

	this.element_parent								= element_parent;
	this.module_code								= module_code;
	this.facet_code									= facet_code;
	this.name										= name;
	this.range_low									= range_low;
	this.range_high									= range_high;
	this.range_span									= range_high - range_low;
	this.selected_range_low							= selected_range_low;
	this.selected_range_high						= selected_range_high;
	this.allow_value_input							= allow_value_input;

	this.shouldrender								= false;
	this.slider_position_low						= 0;
	this.slider_position_high						= 0;
	this.original_value								= this.selected_range_low + '-' + this.selected_range_high;

	this.element_parent.innerHTML					= '';

	this.element_value								= newElement( 'input',	{ 'type': 'hidden', 'name': name },							null, this.element_parent );
	this.element_input_container_low				= newElement( 'span',	{ 'class': 'mm_facet_rangeslider_input_container_low' },	null, this.element_parent );
	this.element_track_container					= newElement( 'span',	{ 'class': 'mm_facet_rangeslider_track_container' },		null, this.element_parent );
	this.element_track								= newElement( 'span',	{ 'class': 'mm_facet_rangeslider_track' },					null, this.element_track_container );
	this.element_track_background					= newElement( 'span',	{ 'class': 'mm_facet_rangeslider_track_background' },		null, this.element_track );
	this.element_track_selection					= newElement( 'span',	{ 'class': 'mm_facet_rangeslider_track_selection' },		null, this.element_track );
	this.element_track_handle_low					= newElement( 'span',	{ 'class': 'mm_facet_rangeslider_track_handle_low' },		null, this.element_track );
	this.element_track_handle_high					= newElement( 'span',	{ 'class': 'mm_facet_rangeslider_track_handle_high' },		null, this.element_track );
	this.element_input_container_high				= newElement( 'span',	{ 'class': 'mm_facet_rangeslider_input_container_high' },	null, this.element_parent );

	if ( !this.allow_value_input )
	{
		this.element_label_low						= newElement( 'span',	{ 'class': 'mm_facet_rangeslider_input' },					null, this.element_input_container_low );
		this.element_label_high						= newElement( 'span',	{ 'class': 'mm_facet_rangeslider_input' },					null, this.element_input_container_high );
	}
	else
	{
		this.element_input_low						= newElement( 'input',	{ 'type': 'text', 'class': 'mm_facet_rangeslider_input' },	null, this.element_input_container_low );
		this.element_input_high						= newElement( 'input',	{ 'type': 'text', 'class': 'mm_facet_rangeslider_input' },	null, this.element_input_container_high );

		this.event_keydown_input					= function( event ) { return self.Event_KeyDown_Input( event ? event : window.event ); };
		this.event_focus_input_low					= function( event ) { return self.Event_Focus_Input_Low( event ? event : window.event ); };
		this.event_blur_input_low					= function( event ) { return self.Event_Blur_Input_Low( event ? event : window.event ); };
		this.event_focus_input_high					= function( event ) { return self.Event_Focus_Input_High( event ? event : window.event ); };
		this.event_blur_input_high					= function( event ) { return self.Event_Blur_Input_High( event ? event : window.event ); };
		this.event_click_input_container_low		= function( event ) { return self.Event_Click_Input_Container_Low( event ? event : window.event ); };
		this.event_click_input_container_high		= function( event ) { return self.Event_Click_Input_Container_High( event ? event : window.event ); };

		AddEvent( this.element_input_low,				'keydown',		this.event_keydown_input );
		AddEvent( this.element_input_low,				'focus',		this.event_focus_input_low );
		AddEvent( this.element_input_low,				'blur',			this.event_blur_input_low );
		AddEvent( this.element_input_high,				'keydown',		this.event_keydown_input );
		AddEvent( this.element_input_high,				'focus',		this.event_focus_input_high );
		AddEvent( this.element_input_high,				'blur',			this.event_blur_input_high );
		AddEvent( this.element_input_container_low,		'click',		this.event_click_input_container_low );
		AddEvent( this.element_input_container_high,	'click',		this.event_click_input_container_high );
	}

	this.event_render								= function() { self.Render(); };
	this.event_returnfalse							= function() { return false; };

	this.event_mousedown_handle_low					= function( event ) { return self.Event_MouseDown_Handle_Low( event ? event : window.event ); };
	this.event_mousedown_handle_high				= function( event ) { return self.Event_MouseDown_Handle_High( event ? event : window.event ); };
	this.event_mousemove_handle_low					= function( event ) { return self.Event_MouseMove_Handle_Low( event ? event : window.event ); };
	this.event_mousemove_handle_high				= function( event ) { return self.Event_MouseMove_Handle_High( event ? event : window.event ); };
	this.event_mouseup_handle_low					= function( event ) { return self.Event_MouseUp_Handle_Low( event ? event : window.event ); };
	this.event_mouseup_handle_high					= function( event ) { return self.Event_MouseUp_Handle_High( event ? event : window.event ); };

	this.event_touchstart_handle_low				= function( event ) { return self.Event_TouchStart_Handle_Low( event ? event : window.event ); };
	this.event_touchstart_handle_high				= function( event ) { return self.Event_TouchStart_Handle_High( event ? event : window.event ); };
	this.event_touchmove_handle_low					= function( event ) { return self.Event_TouchMove_Handle_Low( event ? event : window.event ); };
	this.event_touchmove_handle_high				= function( event ) { return self.Event_TouchMove_Handle_High( event ? event : window.event ); };
	this.event_touchend_handle_low					= function( event ) { return self.Event_TouchEnd_Handle_Low( event ? event : window.event ); };
	this.event_touchend_handle_high					= function( event ) { return self.Event_TouchEnd_Handle_High( event ? event : window.event ); };

	AddEvent( this.element_track_handle_low,			'mousedown',	this.event_mousedown_handle_low );
	AddEvent( this.element_track_handle_high,			'mousedown',	this.event_mousedown_handle_high );

	AddEvent( this.element_track_handle_low,			'touchstart',	this.event_touchstart_handle_low );
	AddEvent( this.element_track_handle_high,			'touchstart',	this.event_touchstart_handle_high );

	this.SetSelectedRange( this.selected_range_low, this.selected_range_high );
	this.RequestRender();
}

MMFacet_RangeSlider.prototype.FormatValues = function( low, high )
{
	var value_low, value_high, slider_rect, handle_rect, slider_length, available_handle_length;

	slider_rect						= this.element_track.getBoundingClientRect();
	handle_rect						= this.element_track_handle_low.getBoundingClientRect();
	slider_length					= ( slider_rect.right - slider_rect.left );
	available_handle_length			= slider_length - ( handle_rect.right - handle_rect.left + 2 );

	value_low						= stoi_def( Math.round( this.range_low + stod_def( stod_range( ( ( low / available_handle_length ) * slider_length ) / slider_length, 0, 1 ) * this.range_span, 0 ) ), 0 );
	value_high						= stoi_def( Math.round( this.range_low + stod_def( stod_range( ( ( high / available_handle_length ) * slider_length ) / slider_length, 0, 1 ) * this.range_span, 0 ) ), 0 );

	this.FormatValues_LowLevel( value_low, value_high );
}

MMFacet_RangeSlider.prototype.FormatValues_LowLevel = function( value_low, value_high )
{
	var tmp_low;

	if ( value_low > value_high )
	{
		tmp_low								= value_low;
		value_low							= value_high;
		value_high							= tmp_low;
	}

	this.element_value.value				= value_low + '-' + value_high;
	this.element_value.disabled				= ( value_low == this.range_low && value_high == this.range_high ) ? true : false;

	if ( this.allow_value_input )
	{
		this.element_input_low.value		= MMFacet_RangeSlider_FormatValue( this.module_code, this.facet_code, value_low );
		this.element_input_high.value		= MMFacet_RangeSlider_FormatValue( this.module_code, this.facet_code, value_high );
	}
	else
	{
		this.element_label_low.innerHTML	= MMFacet_RangeSlider_FormatValue( this.module_code, this.facet_code, value_low );
		this.element_label_high.innerHTML	= MMFacet_RangeSlider_FormatValue( this.module_code, this.facet_code, value_high );
	}
}

MMFacet_RangeSlider.prototype.SetSelectedRange = function( low, high )
{
	var slider_rect, handle_rect, slider_length, available_handle_length;

	slider_rect					= this.element_track.getBoundingClientRect();
	handle_rect					= this.element_track_handle_low.getBoundingClientRect();
	slider_length				= ( slider_rect.right - slider_rect.left );
	available_handle_length		= slider_length - ( handle_rect.right - handle_rect.left + 2 );

	this.slider_position_low	= stod_def( ( ( ( ( low - this.range_low ) / this.range_span ) * slider_length ) / slider_length ) * available_handle_length, 0 );
	this.slider_position_high	= stod_def( ( ( ( ( high - this.range_low ) / this.range_span ) * slider_length ) / slider_length ) * available_handle_length, 0 );

	this.FormatValues_LowLevel( low, high );
}

MMFacet_RangeSlider.prototype.Event_Click_Input_Container_Low = function( e )
{
	var rect, mousepos, scrollfromtop, scrollfromleft;

	rect			= this.element_input_low.getBoundingClientRect();
	mousepos		= captureMousePosition( e );
	scrollfromtop	= getScrollTop();
	scrollfromleft	= getScrollLeft();

	if ( mousepos.y < ( rect.top + scrollfromtop ) 								||
		 mousepos.y > ( rect.top + ( rect.bottom - rect.top ) + scrollfromtop )	||
		 mousepos.x < ( rect.left + scrollfromleft ) 							||
		 mousepos.x > ( rect.left + ( rect.right - rect.left ) + scrollfromleft ) )
	{
		this.element_input_low.focus();
	}
}

MMFacet_RangeSlider.prototype.Event_Click_Input_Container_High = function( e )
{
	var rect, mousepos, scrollfromtop, scrollfromleft;

	rect			= this.element_input_high.getBoundingClientRect();
	mousepos		= captureMousePosition( e );
	scrollfromtop	= getScrollTop();
	scrollfromleft	= getScrollLeft();

	if ( mousepos.y < ( rect.top + scrollfromtop ) 								||
		 mousepos.y > ( rect.top + ( rect.bottom - rect.top ) + scrollfromtop )	||
		 mousepos.x < ( rect.left + scrollfromleft ) 							||
		 mousepos.x > ( rect.left + ( rect.right - rect.left ) + scrollfromleft ) )
	{
		this.element_input_high.focus();
	}
}

MMFacet_RangeSlider.prototype.Event_Focus_Input_Low = function( e )
{
	this.element_input_container_low.className = classNameAdd( this.element_input_container_low, 'mm_facet_rangeslider_input_active' );
}

MMFacet_RangeSlider.prototype.Event_Blur_Input_Low = function( e )
{
	this.element_input_container_low.className = classNameRemove( this.element_input_container_low, 'mm_facet_rangeslider_input_active' );
	this.SetSelectedRange( stod_def( this.element_input_low.value.replace( /[^\d.-]/g, '' ), 0 ), stod_def( this.element_input_high.value.replace( /[^\d.-]/g, '' ), 0 ) );
	this.RequestRender();
	this.Submit();
}

MMFacet_RangeSlider.prototype.Event_Focus_Input_High = function( e )
{
	this.element_input_container_high.className = classNameAdd( this.element_input_container_high, 'mm_facet_rangeslider_input_active' );
}

MMFacet_RangeSlider.prototype.Event_Blur_Input_High = function( e )
{
	this.element_input_container_high.className = classNameRemove( this.element_input_container_high, 'mm_facet_rangeslider_input_active' );
	this.SetSelectedRange( stod_def( this.element_input_low.value.replace( /[^\d.-]/g, '' ), 0 ), stod_def( this.element_input_high.value.replace( /[^\d.-]/g, '' ), 0 ) );
	this.RequestRender();
	this.Submit();
}

MMFacet_RangeSlider.prototype.Event_KeyDown_Input = function( e )
{
	var keycode = e.keyCode || e.which;

	if ( keycode == 13 )
	{
		this.SetSelectedRange( stod_def( this.element_input_low.value.replace( /[^\d.-]/g, '' ), 0 ), stod_def( this.element_input_high.value.replace( /[^\d.-]/g, '' ), 0 ) );
		this.RequestRender();
		this.Submit();
	}

	return true;
}

MMFacet_RangeSlider.prototype.Event_MouseDown_Handle_Low = function( e )
{
	var mousepos;

	AddEvent( window, 'mousemove', this.event_mousemove_handle_low );
	AddEvent( window, 'mouseup', this.event_mouseup_handle_low );
	AddEvent( window, 'blur', this.event_mouseup_handle_low );

	mousepos							= captureMousePosition( e );
	this.slider_started					= true;
	this.slider_target					= e.target ? e.target : e.srcElement;
	this.slider_startpos_low			= mousepos.x;
	this.slider_originalposition_low	= this.element_track_handle_low.getBoundingClientRect().left - this.element_track.getBoundingClientRect().left;

	clearTextSelection();
	document.body.focus();
	document.body.unselectable			= 'on';
	document.onselectstart				= this.event_returnfalse;
	this.slider_target.ondragstart		= this.event_returnfalse;

	if ( this.slider_target.setCapture )
	{
		this.slider_target.setCapture();
	}

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

MMFacet_RangeSlider.prototype.Event_MouseMove_Handle_Low = function( e )
{
	var mousepos, slider_rect, handle_rect, slider_length, available_handle_length;

	if ( this.slider_started )
	{
		eventPreventDefault( e );
		this.slider_started		= false;
	}

	mousepos					= captureMousePosition( e );
	slider_rect					= this.element_track.getBoundingClientRect();
	handle_rect					= this.element_track_handle_low.getBoundingClientRect();
	slider_length				= ( slider_rect.right - slider_rect.left );
	available_handle_length		= slider_length - ( handle_rect.right - handle_rect.left + 2 );
	this.slider_position_low	= stod_range( this.slider_originalposition_low + ( mousepos.x - this.slider_startpos_low ), 0, available_handle_length );

	clearTextSelection();
	this.RequestRender();

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

MMFacet_RangeSlider.prototype.Event_MouseUp_Handle_Low = function( e )
{
	RemoveEvent( window, 'mousemove', this.event_mousemove_handle_low );
	RemoveEvent( window, 'mouseup', this.event_mouseup_handle_low );
	RemoveEvent( window, 'blur', this.event_mouseup_handle_low );

	this.slider_started				= false;
	document.body.unselectable		= null;
	document.onselectstart			= null;
	this.slider_target.ondragstart	= null;

	if ( this.slider_target.releaseCapture )
	{
		this.slider_target.releaseCapture();
	}

	this.RequestRender();
	this.Submit();

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

MMFacet_RangeSlider.prototype.Event_MouseDown_Handle_High = function( e )
{
	var mousepos;

	AddEvent( window, 'mousemove', this.event_mousemove_handle_high );
	AddEvent( window, 'mouseup', this.event_mouseup_handle_high );
	AddEvent( window, 'blur', this.event_mouseup_handle_high );

	mousepos							= captureMousePosition( e );
	this.slider_started					= true;
	this.slider_target					= e.target ? e.target : e.srcElement;
	this.slider_startpos_high			= mousepos.x;
	this.slider_originalposition_high	= this.element_track_handle_high.getBoundingClientRect().left - this.element_track.getBoundingClientRect().left;

	clearTextSelection();
	document.body.focus();
	document.body.unselectable			= 'on';
	document.onselectstart				= this.event_returnfalse;
	this.slider_target.ondragstart		= this.event_returnfalse;

	if ( this.slider_target.setCapture )
	{
		this.slider_target.setCapture();
	}

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

MMFacet_RangeSlider.prototype.Event_MouseMove_Handle_High = function( e )
{
	var mousepos, slider_rect, handle_rect, slider_length, available_handle_length;

	if ( this.slider_started )
	{
		eventPreventDefault( e );
		this.slider_started		= false;
	}

	mousepos					= captureMousePosition( e );
	slider_rect					= this.element_track.getBoundingClientRect();
	handle_rect					= this.element_track_handle_high.getBoundingClientRect();
	slider_length				= ( slider_rect.right - slider_rect.left );
	available_handle_length		= slider_length - ( handle_rect.right - handle_rect.left + 2 );
	this.slider_position_high	= stod_range( this.slider_originalposition_high + ( mousepos.x - this.slider_startpos_high ), 0, available_handle_length );

	clearTextSelection();
	this.RequestRender();

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

MMFacet_RangeSlider.prototype.Event_MouseUp_Handle_High = function( e )
{
	RemoveEvent( window, 'mousemove', this.event_mousemove_handle_high );
	RemoveEvent( window, 'mouseup', this.event_mouseup_handle_high );
	RemoveEvent( window, 'blur', this.event_mouseup_handle_high );

	this.slider_started				= false;
	document.body.unselectable		= null;
	document.onselectstart			= null;
	this.slider_target.ondragstart	= null;

	if ( this.slider_target.releaseCapture )
	{
		this.slider_target.releaseCapture();
	}

	this.RequestRender();
	this.Submit();

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

MMFacet_RangeSlider.prototype.Event_TouchStart_Handle_Low = function( e )
{
	if ( e.touches && e.touches.length > 1 )
	{
		if ( this.touchevents_applied )
		{
			RemoveEvent( this.touch_target, 'touchmove',	this.event_touchmove_handle_low );
			RemoveEvent( this.touch_target, 'touchend',		this.event_touchend_handle_low );
			RemoveEvent( this.touch_target, 'touchcancel',	this.event_touchend_handle_low );

			this.touchevents_applied	= false;
		}

		return;
	}

	this.touches						= e.touches;
	this.touch_target					= e.target;

	this.slider_started					= true;
	this.slider_startpos_low			= this.touches[ 0 ].pageX;
	this.slider_originalposition_low	= this.element_track_handle_low.getBoundingClientRect().left - this.element_track.getBoundingClientRect().left;

	if ( !this.touchevents_applied )
	{
		this.touchevents_applied		= true;

		AddEvent( e.target, 'touchmove',	this.event_touchmove_handle_low );
		AddEvent( e.target, 'touchend',		this.event_touchend_handle_low );
		AddEvent( e.target, 'touchcancel',	this.event_touchend_handle_low );
	}

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

MMFacet_RangeSlider.prototype.Event_TouchMove_Handle_Low = function( e )
{
	var slider_rect, handle_rect, slider_length, available_handle_length;

	if ( this.slider_started )
	{
		eventPreventDefault( e );
		this.slider_started		= false;
	}

	this.touches				= e.touches;

	slider_rect					= this.element_track.getBoundingClientRect();
	handle_rect					= this.element_track_handle_low.getBoundingClientRect();
	slider_length				= ( slider_rect.right - slider_rect.left );
	available_handle_length		= slider_length - ( handle_rect.right - handle_rect.left + 2 );
	this.slider_position_low	= stod_range( this.slider_originalposition_low + ( this.touches[ 0 ].pageX - this.slider_startpos_low ), 0, available_handle_length );

	this.RequestRender();
}

MMFacet_RangeSlider.prototype.Event_TouchEnd_Handle_Low = function( e )
{
	RemoveEvent( this.touch_target, 'touchmove',	this.event_touchmove_handle_low );
	RemoveEvent( this.touch_target, 'touchend',		this.event_touchend_handle_low );
	RemoveEvent( this.touch_target, 'touchcancel',	this.event_touchend_handle_low );

	this.touchevents_applied	= false;
	this.slider_started			= false;

	this.RequestRender();
	this.Submit();

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

MMFacet_RangeSlider.prototype.Event_TouchStart_Handle_High = function( e )
{
	if ( e.touches && e.touches.length > 1 )
	{
		if ( this.touchevents_applied )
		{
			RemoveEvent( this.touch_target, 'touchmove',	this.event_touchmove_handle_high );
			RemoveEvent( this.touch_target, 'touchend',		this.event_touchend_handle_high );
			RemoveEvent( this.touch_target, 'touchcancel',	this.event_touchend_handle_high );

			this.touchevents_applied	= false;
		}

		return;
	}

	this.touches						= e.touches;
	this.touch_target					= e.target;

	this.slider_started					= true;
	this.slider_startpos_high			= this.touches[ 0 ].pageX;
	this.slider_originalposition_high	= this.element_track_handle_high.getBoundingClientRect().left - this.element_track.getBoundingClientRect().left;

	if ( !this.touchevents_applied )
	{
		this.touchevents_applied		= true;

		AddEvent( e.target, 'touchmove',	this.event_touchmove_handle_high );
		AddEvent( e.target, 'touchend',		this.event_touchend_handle_high );
		AddEvent( e.target, 'touchcancel',	this.event_touchend_handle_high );
	}

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

MMFacet_RangeSlider.prototype.Event_TouchMove_Handle_High = function( e )
{
	var slider_rect, handle_rect, slider_length, available_handle_length;

	if ( this.slider_started )
	{
		eventPreventDefault( e );
		this.slider_started		= false;
	}

	this.touches				= e.touches;

	slider_rect					= this.element_track.getBoundingClientRect();
	handle_rect					= this.element_track_handle_high.getBoundingClientRect();
	slider_length				= ( slider_rect.right - slider_rect.left );
	available_handle_length		= slider_length - ( handle_rect.right - handle_rect.left + 2 );
	this.slider_position_high	= stod_range( this.slider_originalposition_high + ( this.touches[ 0 ].pageX - this.slider_startpos_high ), 0, available_handle_length );

	this.RequestRender();
}

MMFacet_RangeSlider.prototype.Event_TouchEnd_Handle_High = function( e )
{
	RemoveEvent( this.touch_target, 'touchmove',	this.event_touchmove_handle_high );
	RemoveEvent( this.touch_target, 'touchend',		this.event_touchend_handle_high );
	RemoveEvent( this.touch_target, 'touchcancel',	this.event_touchend_handle_high );

	this.touchevents_applied	= false;
	this.slider_started			= false;

	this.RequestRender();
	this.Submit();

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

MMFacet_RangeSlider.prototype.Submit = function()
{
	if ( this.original_value !== this.element_value.value )
	{
		MMProdList_UpdateQuery( this.element_value );
	}
}

// Rendering

MMFacet_RangeSlider.prototype.RequestRender = function()
{
	if ( !this.shouldrender )
	{
		this.shouldrender = true;
		window.requestAnimationFrame( this.event_render );
	}
}

MMFacet_RangeSlider.prototype.Render = function()
{
	if ( this.shouldrender )
	{
		this.shouldrender = false;
		this.Redraw();
	}
}

MMFacet_RangeSlider.prototype.Redraw = function()
{
	var low, high, tmp_low, slider_rect, handle_rect, slider_length, available_handle_length;

	slider_rect						= this.element_track.getBoundingClientRect();
	handle_rect						= this.element_track_handle_high.getBoundingClientRect();
	slider_length					= ( slider_rect.right - slider_rect.left );
	available_handle_length			= slider_length - ( handle_rect.right - handle_rect.left + 2 );

	this.slider_position_low		= stod_range( this.slider_position_low, 0, available_handle_length );
	this.slider_position_high		= stod_range( this.slider_position_high, 0, available_handle_length );

	low								= this.slider_position_low;
	high							= this.slider_position_high;

	if ( low > high )
	{
		tmp_low	= low;
		low		= high;
		high	= tmp_low;
	}

	this.element_track_handle_low.style.left	= this.slider_position_low + 'px';
	this.element_track_handle_high.style.left	= this.slider_position_high + 'px';
	this.element_track_selection.style.left		= ( low + ( this.element_track_handle_low.offsetWidth / 2 ) ) + 'px';
	this.element_track_selection.style.right	= ( this.element_track.offsetWidth - ( high + ( this.element_track_handle_low.offsetWidth / 2 ) ) ) + 'px';

	this.FormatValues( low, high );
}

// Miscellaneous
////////////////////////////////////////////////////

function MMDynamic_Form_Submit( action, hidden_input_fields, form_attributes )
{
	var key, form;

	form = newElement( 'form', { 'action': action, 'method': 'POST', 'taget': '_self' }, null, null );

	if ( form_attributes && ( typeof form_attributes === 'object' ) )
	{
		for ( key in form_attributes )
		{
			form.setAttribute( key, form_attributes[ key ] );
		}
	}

	for ( key in hidden_input_fields )
	{
		newElement( 'input', { 'type': 'hidden', 'name': key, 'value': hidden_input_fields[ key ] }, null, form );
	}

	document.body.appendChild( form );
	form.submit();
	document.body.removeChild( form );
}
