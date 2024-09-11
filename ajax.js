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
// Prefix         : MER-AJX-
// Next Error Code: 18
//

// Order Processing Server-side AJAX calls
////////////////////////////////////////////////////

var json_url, json_nosessionurl, Session_ID;

function AJAX_New()
{
	var http_request = null;

	if ( window.XMLHttpRequest )
	{
		http_request = new XMLHttpRequest();
	}
	else if ( window.ActiveXObject )
	{
		http_request = new ActiveXObject( "Microsoft.XMLHTTP" );
	}

	return http_request;
}

function AJAX_Initialize()
{
	var session_start, session_id;

	if ( ( ( typeof json_nosessionurl ) == 'string' ) &&
		 ( ( typeof Session_ID ) == 'string' ) )
	{
		return;
	}

	if ( ( session_start = json_url.toLowerCase().indexOf( 'session_id=' ) ) == -1 )
	{
		json_nosessionurl	= json_url;
		session_id			= '';
	}
	else
	{
		if ( ( session_end = json_url.indexOf( '&', session_start + 11 /* length of 'Session_ID=' */ ) ) == -1 )
		{
			session_end		= json_url.length;
		}

		session_id			= json_url.substring( session_start + 11, session_end );
		json_nosessionurl	= json_url.slice( 0, session_start ) + json_url.slice( session_end + 1 );
	}

	if ( ( typeof Session_ID ) == 'undefined' )
	{
		Session_ID			= session_id;
	}
}

function AJAX_Invalid_Session( response, reload_window, callback )
{
	reload_window.location.reload();
}

function AJAX_Append_SessionParameters( parameters, session_type )
{
	var session_parameters;

	session_parameters		= 'Session_Type=' + encodeURIComponent( session_type );

	if ( ( session_type == 'admin' ) && ( ( typeof Session_ID ) != 'undefined' ) )
	{
		session_parameters	+= '&Session_ID=' + encodeURIComponent( Session_ID );
	}

	if ( ( ( typeof parameters ) != 'string' ) || ( parameters.length == 0 ) )	return session_parameters;
	else																		return parameters + '&' + session_parameters;
}

function AJAX_Append_SessionParameters_JSON( parameters, session_type )
{
	if ( !parameters )
	{
		parameters				= new Object();
	}

	parameters.Session_Type		= session_type;

	if ( ( session_type == 'admin' ) && ( ( typeof Session_ID ) != 'undefined' ) )
	{
		parameters.Session_ID	= Session_ID;
	}

	return parameters;
}

function AJAX_Append_FieldList_JSON( parameters, fields )
{
	var name, field, regex, last_index, last_match, field_param, current_match;

	if ( !parameters )
	{
		parameters = new Object();
	}

	regex = new RegExp( '(\\[\\s{0,}(?<index>\\d{1,})\\s{0,}\\]|(?<structure>:))', 'g' );

	for ( field of fields )
	{
		field_param	= parameters;
		last_match	= null;
		last_index	= 0;

		while ( ( current_match = regex.exec( field.name ) ) !== null )
		{
			if ( last_match && typeof last_match.groups.index !== 'undefined' )
			{
				if ( typeof current_match.groups.structure !== 'undefined' )	field_param = AJAX_Append_FieldList_JSON_CreateObjectPath( field_param, last_match.groups.index - 1 );
				else if ( typeof current_match.groups.index !== 'undefined' )	field_param = AJAX_Append_FieldList_JSON_CreateArrayPath( field_param, last_match.groups.index - 1 );
			}

			name = field.name.substring( last_index, current_match.index );

			if ( name.length )
			{
				if ( typeof current_match.groups.structure !== 'undefined' )	field_param = AJAX_Append_FieldList_JSON_CreateObjectPath( field_param, name );
				else if ( typeof current_match.groups.index !== 'undefined' )	field_param = AJAX_Append_FieldList_JSON_CreateArrayPath( field_param, name );
			}

			last_match = current_match;
			last_index = regex.lastIndex; 
		}

		name = field.name.substring( last_index, field.name.length );

		if ( name.length && ( !last_match || typeof last_match.groups.index === 'undefined' ) )			AJAX_Append_FieldList_JSON_SetPathValue( field_param, name, field.value );
		else if ( name.length === 0 && last_match && typeof last_match.groups.index !== 'undefined' )	AJAX_Append_FieldList_JSON_SetPathValue( field_param, last_match.groups.index - 1, field.value );
		else
		{
			//
			// Invalid parsed name
			//
		}
	}

	return parameters;
}

function AJAX_Append_FieldList_JSON_CreateArrayPath( parameters, name )
{
	if ( !parameters.hasOwnProperty( name ) || !Array.isArray( parameters[ name ] ) )
	{
		parameters[ name ] = new Array();
	}

	parameters = parameters[ name ];

	return parameters;
}

function AJAX_Append_FieldList_JSON_CreateObjectPath( parameters, name )
{
	if ( !parameters.hasOwnProperty( name ) || typeof parameters[ name ] !== 'object' )
	{
		parameters[ name ] = new Object();
	}

	parameters = parameters[ name ];

	return parameters;
}

function AJAX_Append_FieldList_JSON_SetPathValue( parameters, name, value )
{
	if ( !parameters.hasOwnProperty( name ) )			parameters[ name ] = value;
	else if ( !Array.isArray( parameters[ name ] ) )	parameters[ name ] = new Array( parameters[ name ], value );
	else												parameters[ name ].push( value );
}

function AJAX_Call_Module( callback, session_type, module_code, func, parameters, delegator )
{
	if ( delegator )
	{
		return delegator.AJAX_Call_Module( callback, session_type, module_code, func, parameters );
	}

	AJAX_Initialize();
	return AJAX_Call_LowLevel( null,
							   callback,
							   'application/x-www-form-urlencoded', AJAX_Append_SessionParameters( parameters, session_type ),
							   'Store_Code=' + AJAX_CharsetEncodeAttribute( Store_Code ) + '&Function=Module&Module_Code=' + AJAX_CharsetEncodeAttribute( module_code ) + '&Module_Function=' + AJAX_CharsetEncodeAttribute( func ),
							   function( http_request )
							   {
									var response;

									response				= new Object();
									response.success		= 0;
									response.error_code		= 'MER-AJX-00002';
									response.error_message	= 'Miva Merchant returned an invalid response.\n' +
															  'Module: ' + module_code + '\n' +
															  'Function: ' + func + '\n' +
															  'Response: ' + http_request.responseText;
									return response;
							   } );
}

function AJAX_Call_Module_JSON( callback, session_type, module_code, func, data, delegator )
{
	if ( delegator )
	{
		return delegator.AJAX_Call_Module_JSON( callback, session_type, module_code, func, data );
	}

	AJAX_Initialize();
	return AJAX_Call_LowLevel( null,
							   callback,
							   'application/json', JSON.stringify( AJAX_Append_SessionParameters_JSON( data, session_type ) ),
							   'Store_Code=' + AJAX_CharsetEncodeAttribute( Store_Code ) + '&Function=Module&Module_Code=' + AJAX_CharsetEncodeAttribute( module_code ) + '&Module_Function=' + AJAX_CharsetEncodeAttribute( func ),
							   function( http_request )
							   {
									var response;

									response				= new Object();
									response.success		= 0;
									response.error_code		= 'MER-AJX-00013';
									response.error_message	= 'Miva Merchant returned an invalid response.\n' +
															  'Function: ' + func + '\n' +
															  'Response: ' + http_request.responseText;

									return response;
							   } );
}

function AJAX_Call_Module_FieldList( callback, session_type, module_code, func, parameters, fields, delegator )
{
	var i;

	for ( i = 0; i < fields.length; i++ )
	{
		parameters += ( parameters.length ? '&' : '' ) + encodeURIComponent( fields[ i ].name ) + '=' + ( fields[ i ].hasOwnProperty( 'encoded_value' ) ? fields[ i ].encoded_value : encodeURIComponent( fields[ i ].value ) );
	}

	return AJAX_Call_Module( callback, session_type, module_code, func, parameters, delegator );
}

function AJAX_Call_Module_JSON_FieldList( callback, session_type, module_code, func, parameters, fields, delegator )
{
	return AJAX_Call_Module_JSON( callback, session_type, module_code, func, AJAX_Append_FieldList_JSON( parameters, fields ), delegator );
}

function AJAX_Call_Module_WithFile( progress_object, session_type, module_code, func, parameters, file_field, file_input, file_object, delegator )
{
	var response;

	if ( delegator )
	{
		return delegator.AJAX_Call_Module_WithFile( progress_object, session_type, module_code, func, parameters, file_field, file_input, file_object );
	}

	AJAX_Initialize();

	if ( file_object && window.FormData )
	{
		return AJAX_Call_Module_WithFile_FormData( progress_object, session_type, module_code, func, parameters, file_field, file_object );
	}

	response				= new Object();
	response.success		= 0;
	response.error_code		= 'MER-AJX-00009';
	response.error_message	= 'This browser does not support file upload with the provided parameters';

	progress_object.Complete( response );
	if ( window.Modal_Resize ) Modal_Resize();
}

function AJAX_Call_Module_WithFile_FormData( progress_object, session_type, module_code, func, parameters, file_field, file_object )
{
	var content, param, http_request;

	content	= new FormData();

	for ( param in parameters )
	{
		content.append( param, parameters[ param ] );
	}

	content.append( 'Session_Type',		session_type );

	if ( ( session_type === 'admin' ) && ( ( typeof Session_ID ) != 'undefined' ) )
	{
		content.append( 'Session_ID',	Session_ID );
	}

	content.append( file_field,			file_object );

	if ( ( http_request = AJAX_New() ) == null )
	{
		return null;
	}

	progress_object.Initialize( http_request, true );

	http_request.upload.addEventListener( 'progress',	function( event ) { progress_object.Progress( ( event.loaded / event.total * 100 ).toFixed( 0 ) ); }, false );
	http_request.upload.addEventListener( 'load',		function( event ) { progress_object.Progress( 100 ); }, false );

	return AJAX_Call_LowLevel( http_request,
							   function( response ) { progress_object.Complete( response ); },
							   null,
							   content,
							   'Store_Code=' + AJAX_CharsetEncodeAttribute( Store_Code ) + '&Function=Module&Module_Code=' + AJAX_CharsetEncodeAttribute( module_code ) + '&Module_Function=' + AJAX_CharsetEncodeAttribute( func ),
							   function( http_request )
							   {
									var response;

									response				= new Object();
									response.success		= 0;
									response.error_code		= 'MER-AJX-00010';
									response.error_message	= 'Miva Merchant returned an invalid response.\n' +
															  'Function: ' + func + '\n' +
															  'Response: ' + http_request.responseText;

									return response;
							   } );
}

function AJAX_Call_Domain( callback, session_type, func, parameters, delegator )
{
	if ( delegator )
	{
		return delegator.AJAX_Call_Domain( callback, session_type, func, parameters );
	}

	AJAX_Initialize();
	return AJAX_Call_LowLevel( null,
							   callback,
							   'application/x-www-form-urlencoded', AJAX_Append_SessionParameters( parameters, session_type ),
							   'Function=' + AJAX_CharsetEncodeAttribute( func ),
							   function( http_request )
							   {
									var response;

									response				= new Object();
									response.success		= 0;
									response.error_code		= 'MER-AJX-00008';
									response.error_message	= 'Miva Merchant returned an invalid response.\n' +
															  'Function: ' + func + '\n' +
															  'Response: ' + http_request.responseText;

									return response;
							   } );
}

function AJAX_Call_Domain_JSON( callback, session_type, func, parameters, delegator )
{
	if ( delegator )
	{
		return delegator.AJAX_Call_Domain_JSON( callback, session_type, func, parameters );
	}

	AJAX_Initialize();
	return AJAX_Call_LowLevel( null,
							   callback,
							   'application/json', JSON.stringify( AJAX_Append_SessionParameters_JSON( parameters, session_type ) ),
							   'Function=' + AJAX_CharsetEncodeAttribute( func ),
							   function( http_request )
							   {
									var response;

									response				= new Object();
									response.success		= 0;
									response.error_code		= 'MER-AJX-00014';
									response.error_message	= 'Miva Merchant returned an invalid response.\n' +
															  'Function: ' + func + '\n' +
															  'Response: ' + http_request.responseText;

									return response;
							   } );
}

function AJAX_Call_Module_Domain_JSON( callback, session_type, module_code, func, parameters, delegator )
{
	if ( delegator )
	{
		return delegator.AJAX_Call_Module_Domain_JSON( callback, session_type, module_code, func, parameters );
	}

	AJAX_Initialize();
	return AJAX_Call_LowLevel( null,
							   callback,
							   'application/json', JSON.stringify( AJAX_Append_SessionParameters_JSON( parameters, session_type ) ),
							   'Function=Module&Module_Code=' + AJAX_CharsetEncodeAttribute( module_code ) + '&Module_Function=' + AJAX_CharsetEncodeAttribute( func ),
							   function( http_request )
							   {
									var response;

									response				= new Object();
									response.success		= 0;
									response.error_code		= 'MER-AJX-00017';
									response.error_message	= 'Miva Merchant returned an invalid response.\n' +
															  'Function: ' + func + '\n' +
															  'Response: ' + http_request.responseText;

									return response;
							   } );
}

function AJAX_Call_Domain_FieldList( callback, session_type, func, parameters, fields, delegator )
{
	var i;

	for ( i = 0; i < fields.length; i++ )
	{
		parameters += ( parameters.length ? '&' : '' ) + encodeURIComponent( fields[ i ].name ) + '=' + ( fields[ i ].hasOwnProperty( 'encoded_value' ) ? fields[ i ].encoded_value : encodeURIComponent( fields[ i ].value ) );
	}

	return AJAX_Call_Domain( callback, session_type, func, parameters, delegator );
}

function AJAX_Call( callback, session_type, func, parameters, delegator )
{
	if ( delegator )
	{
		return delegator.AJAX_Call( callback, session_type, func, parameters );
	}

	return AJAX_Call_WithStoreCode( callback, session_type, Store_Code, func, parameters, delegator );
}

function AJAX_Call_WithStoreCode( callback, session_type, store_code, func, parameters, delegator )
{
	if ( delegator )
	{
		return delegator.AJAX_Call_WithStoreCode( callback, session_type, store_code, func, parameters );
	}

	AJAX_Initialize();
	return AJAX_Call_LowLevel( null,
							   callback,
							   'application/x-www-form-urlencoded', AJAX_Append_SessionParameters( parameters, session_type ),
							   'Store_Code=' + AJAX_CharsetEncodeAttribute( store_code ) + '&Function=' + AJAX_CharsetEncodeAttribute( func ),
							   function( http_request )
							   {
									var response;

									response				= new Object();
									response.success		= 0;
									response.error_code		= 'MER-AJX-00012';
									response.error_message	= 'Miva Merchant returned an invalid response.\n' +
															  'Function: ' + func + '\n' +
															  'Response: ' + http_request.responseText;

									return response;
							   } );
}

function AJAX_Call_JSON( callback, session_type, func, parameters, delegator )
{
	if ( delegator )
	{
		return delegator.AJAX_Call_JSON( callback, session_type, func, parameters );
	}

	AJAX_Initialize();
	return AJAX_Call_LowLevel( null,
							   callback,
							   'application/json', JSON.stringify( AJAX_Append_SessionParameters_JSON( parameters, session_type ) ),
							   'Store_Code=' + AJAX_CharsetEncodeAttribute( Store_Code ) + '&Function=' + AJAX_CharsetEncodeAttribute( func ),
							   function( http_request )
							   {
									var response;

									response				= new Object();
									response.success		= 0;
									response.error_code		= 'MER-AJX-00015';
									response.error_message	= 'Miva Merchant returned an invalid response.\n' +
															  'Function: ' + func + '\n' +
															  'Response: ' + http_request.responseText;

									return response;
							   } );
}

function AJAX_Call_FieldList( callback, session_type, func, parameters, fields, delegator )
{
	var i;

	for ( i = 0; i < fields.length; i++ )
	{
		parameters += ( parameters.length ? '&' : '' ) + encodeURIComponent( fields[ i ].name ) + '=' + ( fields[ i ].hasOwnProperty( 'encoded_value' ) ? fields[ i ].encoded_value : encodeURIComponent( fields[ i ].value ) );
	}

	return AJAX_Call( callback, session_type, func, parameters, delegator );
}

function AJAX_Call_JSON_FieldList( callback, session_type, func, parameters, fields, delegator )
{
	return AJAX_Call_JSON( callback, session_type, func, AJAX_Append_FieldList_JSON( parameters, fields ), delegator );
}

function AJAX_Call_WithFile( progress_object, session_type, func, parameters, file_field, file_input, file_object, delegator )
{
	var response;

	if ( delegator )
	{
		return delegator.AJAX_Call_WithFile( progress_object, session_type, func, parameters, file_field, file_input, file_object );
	}

	AJAX_Initialize();

	if ( file_object && window.FormData )
	{
		return AJAX_Call_WithFile_FormData( progress_object, session_type, func, parameters, file_field, file_object );
	}

	response				= new Object();
	response.success		= 0;
	response.error_code		= 'MER-AJX-00006';
	response.error_message	= 'This browser does not support file upload with the provided parameters';

	progress_object.Complete( response );
	if ( window.Modal_Resize ) Modal_Resize();
}

function AJAX_Call_WithFile_FormData( progress_object, session_type, func, parameters, file_field, file_object )
{
	var content, param, http_request;

	content	= new FormData();

	for ( param in parameters )
	{
		if ( typeof parameters[ param ] === 'boolean' )		content.append( param, parameters[ param ] ? '1' : '0' );
		else if ( Array.isArray( parameters[ param ] ) )	content.append( param, PackArray( parameters[ param ] ) );
		else												content.append( param, parameters[ param ] );
	}

	content.append( 'Session_Type',		session_type );

	if ( ( session_type === 'admin' ) && ( ( typeof Session_ID ) != 'undefined' ) )
	{
		content.append( 'Session_ID',	Session_ID );
	}

	content.append( file_field,			file_object );

	if ( ( http_request = AJAX_New() ) == null )
	{
		return null;
	}

	progress_object.Initialize( http_request, true );

	http_request.upload.addEventListener( 'progress',	function( event ) { progress_object.Progress( ( event.loaded / event.total * 100 ).toFixed( 0 ) ); }, false );
	http_request.upload.addEventListener( 'load',		function( event ) { progress_object.Progress( 100 ); }, false );

	return AJAX_Call_LowLevel( http_request,
							   function( response ) { progress_object.Complete( response ); },
							   null,
							   content,
							   'Store_Code=' + AJAX_CharsetEncodeAttribute( Store_Code ) + '&Function=' + AJAX_CharsetEncodeAttribute( func ),
							   function( http_request )
							   {
									var response;

									response				= new Object();
									response.success		= 0;
									response.error_code		= 'MER-AJX-00003';
									response.error_message	= 'Miva Merchant returned an invalid response.\n' +
															  'Function: ' + func + '\n' +
															  'Response: ' + http_request.responseText;

									return response;
							   } );
}

function AJAX_Call_WithFileList_FormData( progress_object, session_type, func, parameters, files )
{
	var i, i_len, content, param, http_request;

	content	= new FormData();

	for ( param in parameters )
	{
		content.append( param, parameters[ param ] );
	}

	content.append( 'Session_Type',		session_type );

	if ( ( session_type === 'admin' ) && ( ( typeof Session_ID ) != 'undefined' ) )
	{
		content.append( 'Session_ID',	Session_ID );
	}

	for ( i = 0, i_len = files.length; i < i_len; i++ )
	{
		content.append( files[ i ].name, files[ i ].file );
	}

	if ( ( http_request = AJAX_New() ) == null )
	{
		return null;
	}

	progress_object.Initialize( http_request, true );

	http_request.upload.addEventListener( 'progress',	function( event ) { progress_object.Progress( ( event.loaded / event.total * 100 ).toFixed( 0 ) ); }, false );
	http_request.upload.addEventListener( 'load',		function( event ) { progress_object.Progress( 100 ); }, false );

	return AJAX_Call_LowLevel( http_request,
							   function( response ) { progress_object.Complete( response ); },
							   null,
							   content,
							   'Store_Code=' + AJAX_CharsetEncodeAttribute( Store_Code ) + '&Function=' + AJAX_CharsetEncodeAttribute( func ),
							   function( http_request )
							   {
									var response;

									response				= new Object();
									response.success		= 0;
									response.error_code		= 'MER-AJX-00003';
									response.error_message	= 'Miva Merchant returned an invalid response.\n' +
															  'Function: ' + func + '\n' +
															  'Response: ' + http_request.responseText;

									return response;
							   } );
}

function AJAX_Call_LowLevel( http_request, callback, content_type, content, uri, error_response )
{
	if ( http_request == null )
	{
		if ( ( http_request = AJAX_New() ) == null )
		{
			return null;
		}
	}

	AJAX_Call_Initialize( http_request, callback, content_type, uri, error_response );
	http_request.send( content );

	return http_request;
}

function AJAX_Call_Initialize( http_request, callback, content_type, uri, error_response )
{
	http_request.open( 'POST', json_nosessionurl + uri, true );
	http_request.setRequestHeader( 'If-Modified-Since',	'Sat, 1 Jan 2000 00:00:00 GMT' );		// Avoid caching

	if ( content_type )
	{
		http_request.setRequestHeader( 'Content-Type', content_type );
	}

	http_request.onreadystatechange = function()
	{
		var response = null, content_length = null, content_encoding = null;

		if ( http_request.readyState == 4 )
		{
			if ( http_request.status == 200 )
			{
				// Prevent eval() of a partial response due to a navigation away from the current page, pressing
				// the stop button, etc...
				if ( typeof http_request.getResponseHeader != 'undefined' )
				{
					content_length		= http_request.getResponseHeader( 'Content-Length' );
					content_encoding	= http_request.getResponseHeader( 'Content-Encoding' );
				}

				if ( content_length && ( content_length != http_request.responseText.length ) &&
					 ( content_encoding == null || ( content_encoding == 'identity' ) ) )
				{
					return;
				}

				try
				{
					if ( ( typeof JSON !== 'undefined' ) &&
						 ( typeof JSON.parse !== 'undefined' ) )	response = JSON.parse( http_request.responseText );
					else											response = eval( '(' + http_request.responseText + ')' );
				}
				catch ( e )
				{
					response = error_response( http_request );
				}

				if ( ( response.error_code == 'session_timeout' ) ||
					 ( response.error_code == 'too_many_sessions' ) )
				{
					AJAX_Invalid_Session( response, window, callback );
					return;
				}

				callback( response );
				if ( window.Modal_Resize ) Modal_Resize();
			}

			http_request = null;
		}
	}
}

function AJAX_AutoComplete_Initialize( http_request, callback, session_type, func, parameters )
{
	AJAX_Initialize();
	AJAX_Call_Initialize( http_request,
						  callback,
						  'application/x-www-form-urlencoded',
						  'Store_Code=' + AJAX_CharsetEncodeAttribute( Store_Code ) + '&Function=' + AJAX_CharsetEncodeAttribute( func ),
						  function( http_request )
						  {
							  var response;

							  response					= new Object();
							  response.success			= 0;
							  response.error_code		= 'MER-AJX-00007';
							  response.error_message	= 'Miva Merchant returned an invalid response.\n' +
														  'Function: ' + func + '\n' +
														  'Response: ' + http_request.responseText;

							  return response;
						  } );

	http_request.autocomplete_content	= AJAX_Append_SessionParameters( parameters, session_type );
}

function AJAX_AutoComplete_Execute( http_request )
{
	http_request.send( http_request.autocomplete_content );
}

//
// Runtime Specific Functions
//

function AJAX_Call_JSON_Runtime( callback, session_type, func, parameters, flags, delegator )
{
	if ( delegator )
	{
		return delegator.AJAX_Call_JSON_Runtime( callback, session_type, func, parameters, flags );
	}

	if ( !parameters )
	{
		parameters = new Object();
	}

	parameters.Session_Type = session_type;

	return AJAX_Call_Runtime_LowLevel( callback, flags,
									   'application/json', JSON.stringify( parameters ),
									   'Store_Code=' + AJAX_CharsetEncodeAttribute( Store_Code ) + '&Function=' + AJAX_CharsetEncodeAttribute( func ),
									   function( http_request )
									   {
											var response;

											response				= new Object();
											response.success		= 0;
											response.error_code		= 'MER-AJX-00016';
											response.error_message	= 'Miva Merchant returned an invalid response.\n' +
																	  'Function: ' + func + '\n' +
																	  'Response: ' + http_request.responseText;

											return response;
									   } );
}

function AJAX_Call_Runtime_LowLevel( callback, flags, content_type, content, uri, error_response )
{
	var http_request, flags_lookup;

	flags_lookup							= new Object();
	flags_lookup.with_credentials			= false;

	if ( typeof flags === 'string' )
	{
		flags
			.split( ',' )
			.map( flag => flag.trim() )
			.filter( flag => flag !== '' )
			.map( flag => flags_lookup[ flag ] = true );
	}

	http_request					= new XMLHttpRequest();
	http_request.withCredentials	= flags_lookup.with_credentials;

	http_request.open( 'POST', runtime_json_url + uri, true );
	http_request.setRequestHeader( 'If-Modified-Since', 'Sat, 1 Jan 2000 00:00:00 GMT' ); // Avoid caching

	if ( content_type )
	{
		http_request.setRequestHeader( 'Content-Type', content_type );
	}

	http_request.onload = function( event )
	{
		var response, content_length, content_encoding;

		response				= null;
		content_length			= null;
		content_encoding		= null;

		//
		// Prevent parsing of a partial response due to a navigation away from the current page, pressing
		// the stop button, etc...
		//

		if ( typeof http_request.getResponseHeader != 'undefined' )
		{
			content_length		= http_request.getResponseHeader( 'Content-Length' );
			content_encoding	= http_request.getResponseHeader( 'Content-Encoding' );
		}

		if ( content_length && ( content_length != http_request.responseText.length ) &&
			 ( content_encoding == null || ( content_encoding == 'identity' ) ) )
		{
			return;
		}

		try
		{
			response = JSON.parse( http_request.responseText );
		}
		catch ( e )
		{
			response = error_response( http_request );
		}

		if ( typeof callback === 'function' )
		{
			callback( response );
		}

		http_request = null;
	};

	http_request.send( content );

	return http_request;
}

//
// Helper Functions
//

function PackArray( array )
{
	var i;
	var packed = '';

	if ( array == null || array.length == 0 )
	{
		return '';
	}

	for ( i = 0; i < array.length - 1; i++ )
	{
		packed += encodeURIComponent( array[ i ] ) + '|';
	}

	packed += encodeURIComponent( array[ i ] );
	return packed;
}

function EncodeArray( array )
{
	return encodeURIComponent( PackArray( array ) );
}

function PackTwoDimensionalArray( array )
{
	var i, j;
	var packed = '';

	if ( array == null || array.length == 0 )
	{
		return '';
	}

	for ( i = 0; i < array.length; i++ )
	{
		for ( j = 0; j < array[ i ].length; j++ )
		{
			packed		+= encodeURIComponent( array[ i ][ j ] );
			if ( j < array[ i ].length - 1 )
			{
				packed	+= '%7C';
			}
		}

		if ( i < array.length - 1 )
		{
			packed		+= '|';
		}
	}

	return packed;
}

function EncodeTwoDimensionalArray( array )
{
	return encodeURIComponent( PackTwoDimensionalArray( array ) );
}

function Base64ToArrayBuffer( value )
{
	var i, i_len;
	var decoded, array;

	decoded			= atob( value );
	i_len			= decoded.length;
	array			= new Uint8Array( i_len );

	for ( i = 0; i < i_len; i++ )
	{
		array[ i ]	= decoded.charCodeAt( i );
	}

	return array.buffer;	
}

function ArrayBufferToBase64( buffer )
{
	var i, i_len;
	var c_array, u8_array;

	c_array				= new Array();
	u8_array			= new Uint8Array( buffer );

	for ( i = 0, i_len = u8_array.byteLength; i < i_len; i++ )
	{
		c_array[ i ]	= String.fromCharCode( u8_array[ i ] );
	}

	return btoa( c_array.join( '' ) );
}

function AddEvent( obj, eventType, fn  )
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

function FireEvent( obj, eventType )
{
	var e;

	try
	{
		e = new Event( eventType, { 'bubbles': true, 'cancelable': true } );
		obj.dispatchEvent( e );
	}
	catch ( e )
	{
		//
		// Internet Explorer fallback. Requires window to be the dispatcher
		//

		e			= document.createEvent( 'HTMLEvents' );
		e.initEvent( eventType, true, true );
		e.eventName	= eventType;
		window.dispatchEvent( e );
	}
}

/*
 * Note: This function is also present (with a different name) in ui.js and v55_ui.js.
 *       Modifications here should be made in those other locations as well.
 */

function AJAX_CharsetEncodeAttribute( instring )
{
	var encoded;

	if ( AJAX_isUnicode() )
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

/*
 * Note: This function is also present (with a different name) in ui.js and v55_ui.js.
 *       Modifications here should be made in those other locations as well.
 */

function AJAX_isUnicode()
{
	return ( document.characterSet || document.charset || '' ).search( 'UTF' ) == 0 ? true : false;
}

// AJAX_ThreadPool
////////////////////////////////////////////////////

function AJAX_ThreadPool( threads )
{
	this.threads		= threads;
	this.active_count	= 0;
	this.running		= false;
	this.queue			= new Array();
	this.running_queue	= new Array();
}

AJAX_ThreadPool.prototype.AJAX_Call_Module = function( callback, session_type, module_code, func, parameters )
{
	var self = this;
	var request, adjusted_callback;

	adjusted_callback = function( response )
	{
		var index;

		callback( response );
		self.ThreadComplete();

		index = arrayIndexOf( self.running_queue, request );

		if ( index != -1 )
		{
			self.running_queue.splice( index, 1 );
		}
	}

	request = function()
	{
		self.running_queue.push( request );
		request.http_request = AJAX_Call_Module( adjusted_callback, session_type, module_code, func, parameters );
	}

	this.queue.push( request );

	return request;
}

AJAX_ThreadPool.prototype.AJAX_Call_Module_JSON = function( callback, session_type, module_code, func, data )
{
	var self = this;
	var request, adjusted_callback;

	adjusted_callback = function( response )
	{
		var index;

		callback( response );
		self.ThreadComplete();

		index = arrayIndexOf( self.running_queue, request );

		if ( index != -1 )
		{
			self.running_queue.splice( index, 1 );
		}
	}

	request = function()
	{
		self.running_queue.push( request );
		request.http_request = AJAX_Call_Module_JSON( adjusted_callback, session_type, module_code, func, data );
	}

	this.queue.push( request );

	return request;
}

AJAX_ThreadPool.prototype.AJAX_Call_Module_WithFile = function( progress_object, session_type, module_code, func, parameters, file_field, file_input, file_object )
{
	var self = this;
	var request;

	progress_object.AJAX_ThreadPool_OriginalComplete = progress_object.Complete;
	progress_object.Complete = function( response )
	{
		var index;

		progress_object.AJAX_ThreadPool_OriginalComplete( response );

		self.ThreadComplete();

		index = arrayIndexOf( self.running_queue, request );

		if ( index != -1 )
		{
			self.running_queue.splice( index, 1 );
		}

		progress_object.Complete							= progress_object.AJAX_ThreadPool_OriginalComplete;
		progress_object.AJAX_ThreadPool_OriginalComplete	= null;
	}

	request = function()
	{
		self.running_queue.push( request );
		request.http_request = AJAX_Call_Module_WithFile( progress_object, session_type, module_code, func, parameters, file_field, file_input, file_object );
	}

	this.queue.push( request );

	return request;
}

AJAX_ThreadPool.prototype.AJAX_Call_Domain = function( callback, session_type, func, parameters )
{
	var self = this;
	var request, adjusted_callback;

	adjusted_callback = function( response )
	{
		var index;

		callback( response );
		self.ThreadComplete();

		index = arrayIndexOf( self.running_queue, request );

		if ( index != -1 )
		{
			self.running_queue.splice( index, 1 );
		}
	}

	request = function()
	{
		self.running_queue.push( request );
		request.http_request = AJAX_Call_Domain( adjusted_callback, session_type, func, parameters );
	}

	this.queue.push( request );

	return request;
}

AJAX_ThreadPool.prototype.AJAX_Call_Domain_JSON = function( callback, session_type, func, parameters )
{
	var self = this;
	var request, adjusted_callback;

	adjusted_callback = function( response )
	{
		var index;

		callback( response );
		self.ThreadComplete();

		index = arrayIndexOf( self.running_queue, request );

		if ( index != -1 )
		{
			self.running_queue.splice( index, 1 );
		}
	}

	request = function()
	{
		self.running_queue.push( request );
		request.http_request = AJAX_Call_Domain_JSON( adjusted_callback, session_type, func, parameters );
	}

	this.queue.push( request );

	return request;
}

AJAX_ThreadPool.prototype.AJAX_Call_Module_Domain_JSON = function( callback, session_type, module_code, func, parameters )
{
	var self = this;
	var request, adjusted_callback;

	adjusted_callback = function( response )
	{
		var index;

		callback( response );
		self.ThreadComplete();

		index = arrayIndexOf( self.running_queue, request );

		if ( index != -1 )
		{
			self.running_queue.splice( index, 1 );
		}
	}

	request = function()
	{
		self.running_queue.push( request );
		request.http_request = AJAX_Call_Module_Domain_JSON( adjusted_callback, session_type, module_code, func, parameters );
	}

	this.queue.push( request );

	return request;
}

AJAX_ThreadPool.prototype.AJAX_Call = function( callback, session_type, func, parameters )
{
	var self = this;
	var request, adjusted_callback;

	adjusted_callback = function( response )
	{
		var index;

		callback( response );
		self.ThreadComplete();

		index = arrayIndexOf( self.running_queue, request );

		if ( index != -1 )
		{
			self.running_queue.splice( index, 1 );
		}
	}

	request = function()
	{
		self.running_queue.push( request );
		request.http_request = AJAX_Call( adjusted_callback, session_type, func, parameters );
	}

	this.queue.push( request );

	return request;
}

AJAX_ThreadPool.prototype.AJAX_Call_WithStoreCode = function( callback, session_type, store_code, func, parameters )
{
	var self = this;
	var request, adjusted_callback;

	adjusted_callback = function( response )
	{
		var index;

		callback( response );
		self.ThreadComplete();

		index = arrayIndexOf( self.running_queue, request );

		if ( index != -1 )
		{
			self.running_queue.splice( index, 1 );
		}
	}

	request = function()
	{
		self.running_queue.push( request );
		request.http_request = AJAX_Call_WithStoreCode( adjusted_callback, session_type, store_code, func, parameters );
	}

	this.queue.push( request );

	return request;
}

AJAX_ThreadPool.prototype.AJAX_Call_JSON = function( callback, session_type, func, parameters )
{
	var self = this;
	var request, adjusted_callback;

	adjusted_callback = function( response )
	{
		var index;

		callback( response );
		self.ThreadComplete();

		index = arrayIndexOf( self.running_queue, request );

		if ( index != -1 )
		{
			self.running_queue.splice( index, 1 );
		}
	}

	request = function()
	{
		self.running_queue.push( request );
		request.http_request = AJAX_Call_JSON( adjusted_callback, session_type, func, parameters );
	}

	this.queue.push( request );

	return request;
}

AJAX_ThreadPool.prototype.AJAX_Call_JSON_Runtime = function( callback, session_type, func, parameters, flags )
{
	var self = this;
	var request, adjusted_callback;

	adjusted_callback = function( response )
	{
		var index;

		callback( response );
		self.ThreadComplete();

		index = arrayIndexOf( self.running_queue, request );

		if ( index != -1 )
		{
			self.running_queue.splice( index, 1 );
		}
	}

	request = function()
	{
		self.running_queue.push( request );
		request.http_request = AJAX_Call_JSON_Runtime( adjusted_callback, session_type, func, parameters, flags );
	}

	this.queue.push( request );

	return request;
}

AJAX_ThreadPool.prototype.AJAX_Call_WithFile = function( progress_object, session_type, func, parameters, file_field, file_input, file_object )
{
	var self = this;
	var request;

	progress_object.AJAX_ThreadPool_OriginalComplete = progress_object.Complete;
	progress_object.Complete = function( response )
	{
		var index;

		progress_object.AJAX_ThreadPool_OriginalComplete( response );

		self.ThreadComplete();

		index = arrayIndexOf( self.running_queue, request );

		if ( index != -1 )
		{
			self.running_queue.splice( index, 1 );
		}

		progress_object.Complete							= progress_object.AJAX_ThreadPool_OriginalComplete;
		progress_object.AJAX_ThreadPool_OriginalComplete	= null;
	}

	request = function()
	{
		self.running_queue.push( request );
		request.http_request = AJAX_Call_WithFile( progress_object, session_type, func, parameters, file_field, file_input, file_object );
	}

	this.queue.push( request );

	return request;
}

AJAX_ThreadPool.prototype.AJAX_Call_Custom = function( callback, fn1 )
{
	var self = this;
	var request, adjusted_callback;

	adjusted_callback = function( response )
	{
		var index;

		callback( response );
		self.ThreadComplete();

		index = arrayIndexOf( self.running_queue, request );

		if ( index != -1 )
		{
			self.running_queue.splice( index, 1 );
		}
	}

	request = function()
	{
		self.running_queue.push( request );

		//
		// adjusted_callback should always be passed parameter "response"
		// request should have member "http_request" added if using an XMLHTTPRequest is made
		//

		setTimeout( function() { fn1( adjusted_callback, request ); }, 0 );
	}

	this.queue.push( request );

	return request;
}

AJAX_ThreadPool.prototype.Run = function()
{
	var i, i_len;

	if ( this.running )
	{
		if ( this.active_count < this.threads )
		{
			for ( i = this.active_count; i <= this.threads; i++ )
			{
				this.ThreadStart();
			}
		}

		return;
	}

	this.onStart();
	this.running = true;

	if ( this.queue.length == 0 )
	{
		return this.Finished();
	}

	for ( i = 0, i_len = this.threads; ( i < i_len ) && ( this.queue.length > 0 ); i++ )
	{
		this.ThreadStart();
	}
}

AJAX_ThreadPool.prototype.Cancel = function()
{
	var queue, popped;

	queue				= this.running_queue;
	this.active_count	= 0;
	this.running		= false;
	this.queue			= new Array();
	this.running_queue	= new Array();

	while ( queue.length )
	{
		popped = queue.pop();

		if ( popped && popped.http_request )
		{
			popped.http_request.onload				= function() {};
			popped.http_request.onreadystatechange	= function() {};

			popped.http_request.abort();
		}
	}

	this.onComplete();
}

AJAX_ThreadPool.prototype.Queue_Count = function()
{
	return this.queue.length;
}

AJAX_ThreadPool.prototype.Thread_Limit = function()
{
	return this.threads;
}

AJAX_ThreadPool.prototype.DequeueFromStart = function( count )
{
	if ( !count )
	{
		count = 1;
	}

	while ( this.queue.length && count-- )
	{
		this.queue.splice( 0, 1 );
	}
}

AJAX_ThreadPool.prototype.LimitQueueToCount = function( count )
{
	if ( !count )
	{
		return;
	}

	while ( this.queue.length > count )
	{
		this.queue.splice( 0, 1 );
	}
}

AJAX_ThreadPool.prototype.RemoveFromQueue = function( request )
{
	var index = this.queue.indexOf( request );

	if ( index !== -1 )
	{
		this.queue.splice( index, 1 );
	}
}

AJAX_ThreadPool.prototype.SetThreadCount = function( threads )
{
	this.threads = threads
}

AJAX_ThreadPool.prototype.ThreadStart = function()
{
	if ( this.queue.length == 0 )
	{
		if ( this.active_count == 0 )
		{
			this.Finished();
		}

		return;
	}

	this.active_count++;
	this.queue.splice( 0, 1 )[ 0 ]();
}

AJAX_ThreadPool.prototype.ThreadComplete = function()
{
	this.active_count--;
	this.ThreadStart();
}

AJAX_ThreadPool.prototype.Finished = function()
{
	if ( this.active_count == 0 )
	{
		this.running = false;

		this.onComplete();
	}
}

AJAX_ThreadPool.prototype.Running = function()
{
	if ( this.running )
	{
		return true;
	}

	return false;
}

AJAX_ThreadPool.prototype.onStart = function() { ; }
AJAX_ThreadPool.prototype.onComplete = function() { ; }
