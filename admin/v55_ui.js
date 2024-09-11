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

var Loaded = 0;
var Modified = 0;
var HaveCustomReset = 0;
var ForceResetNextLoad = 0;
var ForceDomainLevelScreen = 0;
var PreemptiveSwitch_Screen = '';
var PreemptiveSwitch_Tab = '';
var field_changes = 'You have made changes to one or more fields.\nIf you continue without updating, your changes will be lost.\n\nContinue?';
var item_delete = 'Deleting this item will remove it permanently from your store. It cannot be restored later.\n\nContinue?';

function AdminURL( screen_code, tab_code )
{
	var url;

	url		= Adminurl + 'Screen=' + v55_CharsetEncodeAttribute( screen_code );
	
	if ( tab_code && tab_code.length )
	{
		url	+= '&Tab=' + v55_CharsetEncodeAttribute( tab_code );
	}

	if ( !ForceDomainLevelScreen )
	{
		if ( typeof Edit_Store == 'string' && Edit_Store.length )
		{
			url += '&Edit_Store=' + v55_CharsetEncodeAttribute( Edit_Store );
		}
		else if ( typeof Store_Code == 'string' && Store_Code.length )
		{
			url	+= '&Store_Code=' + v55_CharsetEncodeAttribute( Store_Code );
		}
	}

	return url;
}

function DeleteItem( screen_code, action_code, button )
{
	if ( confirm( item_delete ) )
	{
		DisableButtons( button );
		DisableOnSubmitFormElements();

		document.forms[ Screen ].action = AdminURL( screen_code, Tab );
		document.forms[ Screen ].elements[ 'Action' ].value = action_code;

		if ( document.forms[ Screen ].v56_submit )	document.forms[ Screen ].v56_submit();
		else										document.forms[ Screen ].submit();
	}

	return 1;
}

function DisplayModifiedMessage()
{
	return confirm( field_changes );
}

function CheckModified()
{
	const active_element = document.activeElement;

	active_element?.blur?.();
	active_element?.focus?.();

	if ( Modified )
	{
		return DisplayModifiedMessage();
	}

	return 1;
}

function CheckItemModified()
{
	if ( ItemModified > 0 )
	{
		return DisplayModifiedMessage();
	}

	return 1;
}

function SwitchItem( url )
{
	if ( CheckItemModified() )
	{
		DisableButtons();
		document.location.replace( url );
	}

	return false;
}

function SwitchItem_Params( url, params )
{
	var form, input, match, regex;

	if ( !CheckItemModified() )
	{
		return false;
	}

	form			= document.createElement( 'form' );
	form.method		= 'POST';
	form.action		= url;
	regex			= /([^=&?]+)=([^&]+)/g;

	while ( ( match = regex.exec( params ) ) !== null )
	{
		input			= document.createElement( 'input' );
		input.type		= 'hidden';
		input.name		= CharsetDecodeAttribute( match[ 1 ] );
		input.value		= CharsetDecodeAttribute( match[ 2 ] );

		form.appendChild( input );
	}

	DisableButtons();
	document.body.appendChild( form );
	form.submit();

	return false;
}

function SwitchTab( screen_code, tab_code )
{
	if ( Loaded )
	{
		if ( CheckModified() )
		{
			DisableButtons();
			DisableOnSubmitFormElements();

			document.forms[ Screen ].action = AdminURL( screen_code, tab_code );
			document.forms[ Screen ].elements[ 'Action' ].value = '';
			document.forms[ Screen ].elements[ 'ItemModified' ].value = ItemModified;

			if ( !ForceResetNextLoad )
			{
				document.forms[ Screen ].elements[ 'Have_Fields' ].value = 1;
			}

			if ( document.forms[ Screen ].v56_submit )	document.forms[ Screen ].v56_submit();
			else										document.forms[ Screen ].submit();
		}
	}
	else
	{
		PreemptiveSwitch_Screen = screen_code;
		PreemptiveSwitch_Tab = tab_code;
	}
}

function Reload()
{
	if ( CheckModified() )
	{
		DisableButtons();
		DisableOnSubmitFormElements();

		document.forms[ Screen ].action = AdminURL( Screen, Tab );
		document.forms[ Screen ].elements[ 'Action' ].value = '';

		if ( !ForceResetNextLoad )
		{
			document.forms[ Screen ].elements[ 'Have_Fields' ].value = 1;
		}
			
		if ( document.forms[ Screen ].v56_submit )	document.forms[ Screen ].v56_submit();
		else										document.forms[ Screen ].submit();
	}
}

function DisableButtons( button )
{
	var i, i_len, element, mm_button, buttonlist;

	if ( button )
	{
		if ( button.SetProcessing_Start )
		{
			button.SetProcessing_Start();
		}
		else
		{
			button.original_value	= button.value;
			button.value			= 'Processing...';
		}
	}

	buttonlist = getScopedElementsByClassName( 'mm10_screen_button', parent.document );

	for ( i = 0, i_len = buttonlist.length; i < i_len; i++ )
	{
		mm_button = buttonlist[ i ].GetClass();

		if ( mm_button )
		{
			mm_button.Disable();
		}
	}

	for ( element in document.forms[ Screen ].elements )
	{
		if ( document.forms[ Screen ].elements[ element ] && document.forms[ Screen ].elements[ element ].type == 'button' )
		{
			document.forms[ Screen ].elements[ element ].disabled = true;
		}
	}
}

function EnableButtons( button )
{
	var i, i_len, element, mm_button, buttonlist;

	if ( button )
	{
		if ( button.SetProcessing_End )							button.SetProcessing_End();
		else if ( typeof button.original_value === 'string' )	button.value = button.original_value;
	}

	buttonlist = getScopedElementsByClassName( 'mm10_screen_button', parent.document );

	for ( i = 0, i_len = buttonlist.length; i < i_len; i++ )
	{
		mm_button = buttonlist[ i ].GetClass();

		if ( mm_button )
		{
			mm_button.Enable();
		}
	}

	for ( element in document.forms[ Screen ].elements )
	{
		if ( document.forms[ Screen ].elements[ element ] && document.forms[ Screen ].elements[ element ].type == 'button' )
		{
			document.forms[ Screen ].elements[ element ].disabled = false;
		}
	}
}

function SubmitForm( screen_code, action_code, button )
{
	DisableButtons( button );
	DisableOnSubmitFormElements();

	document.forms[ Screen ].action = AdminURL( screen_code, Tab );
	document.forms[ Screen ].elements[ 'Action' ].value = action_code;

	if ( document.forms[ Screen ].v56_submit )	document.forms[ Screen ].v56_submit();
	else										document.forms[ Screen ].submit();
}

function SubmitTab( screen_code, action_code, tab_code, button )
{
	DisableButtons( button );
	DisableOnSubmitFormElements();

	document.forms[ Screen ].action = AdminURL( screen_code, tab_code );
	document.forms[ Screen ].elements[ 'Action' ].value = action_code;

	if ( document.forms[ Screen ].v56_submit )	document.forms[ Screen ].v56_submit();
	else										document.forms[ Screen ].submit();
}

function SubmitAddMultiple( screen_code, action_code, button )
{
	DisableButtons( button );
	DisableOnSubmitFormElements();

	document.forms[ Screen ].elements[ 'Button_AddMultiple' ].value = 1;
	document.forms[ Screen ].action = AdminURL( screen_code, Tab );
	document.forms[ Screen ].elements[ 'Action' ].value = action_code;

	if ( document.forms[ Screen ].v56_submit )	document.forms[ Screen ].v56_submit();
	else										document.forms[ Screen ].submit();
}

function ResetForm( screen_code, tab_code, button )
{
	DisableButtons( button );
	DisableOnSubmitFormElements();

	document.forms[ Screen ].action = AdminURL( screen_code, tab_code );
	document.forms[ Screen ].elements[ 'Action' ].value = '';

	if ( HaveCustomReset )
	{
		CustomReset();
	}

	if ( document.forms[ Screen ].elements[ 'Have_List_Fields' ] )
	{
		document.forms[ Screen ].elements[ 'Have_List_Fields' ].value = 0;
	}

	if ( document.forms[ Screen ].v56_submit )	document.forms[ Screen ].v56_submit();
	else										document.forms[ Screen ].submit();
}

function FieldError( field, message )
{
	var element_field, selectable_input_types;

	if ( window.FieldError_HandleWithJavaScript || ( top && top.mm9_screen && window == top.Main ) )
	{
		FieldError_Message	= message;
		FieldError_Field	= field;
		FieldError_Set		= true;
	}
	else
	{
		if ( field && ( element_field = document.forms[ Screen ].elements[ field ] ) )
		{
			if ( typeof element_field.CustomElement === 'function' )
			{
				element_field = element_field.CustomElement();
			}

			selectable_input_types = [ 'text', 'password', 'color', 'date', 'datetime-local', 'email', 'month', 'number', 'url', 'week', 'search', 'tel', 'time' ];

			if ( element_field instanceof MMInputCustomElement		||
				 element_field instanceof MMTextAreaCustomElement	||
				 element_field instanceof MMSelectCustomElement )
			{
				element_field.invalid = message;
			}

			if ( element_field instanceof MMInputCustomElement )
			{
				element_field.select();
			}
			else if ( element_field.nodeName.toLowerCase() === 'input' && selectable_input_types.indexOf( element_field.type.toLowerCase() ) !== -1 )
			{
				element_field.select();
			}

			element_field.focus();
		}

		alert( message );
	}
}

function PopupColorSelector( field )
{
	var color = document.forms[ Screen ].elements[ field ].value;

	window.open( Adminurl + 'Screen=COLR&Form=' + encodeURIComponent( Screen ) + '&Field=' + encodeURIComponent( field ) + '&Color=' + encodeURIComponent( color ), 'ColorSelector', 'toolbar=no,location=no,directories=no,status=no,scrollbars=yes,resizable=yes,copyhistory=no,width=340,height=402' ).focus();
}

function PopupFileUpload( type, data, field )
{
	var URL = Adminurl + 'Screen=FUPL&FileUpload_Form=' + encodeURIComponent( Screen ) + '&FileUpload_Field=' + encodeURIComponent( field ) + '&FileUpload_Type=' + encodeURIComponent( type ) + '&FileUpload_Data=' + encodeURIComponent( data );

	if ( String( Store_Code ).length )
	{
		URL += '&Store_Code=' + encodeURIComponent( Store_Code );
	}
	else if ( String( Edit_Store ).length )
	{
		URL += '&Store_Code=' + encodeURIComponent( Edit_Store );
	}

	window.open( URL, 'FileUpload', 'toolbar=no,location=no,directories=no,status=no,scrollbars=no,resizable=yes,copyhistory=no,width=600,height=350' ).focus();
}

function PopupUserLookup( field )
{
	var URL = Adminurl + 'Screen=ULKP&Lookup_Form=' + encodeURIComponent( Screen ) + '&Lookup_Field=' + encodeURIComponent( field );

	if ( String( Store_Code ).length )
	{
		URL += '&Store_Code=' + encodeURIComponent( Store_Code );
	}
	else if ( String( Edit_Store ).length )
	{
		URL += '&Store_Code=' + encodeURIComponent( Edit_Store );
	}

	window.open( URL, 'UserLookup', 'toolbar=no,location=no,directories=no,status=no,scrollbars=yes,resizable=yes,copyhistory=no,width=960,height=700' ).focus();
}

function PopupComponentLookup( field )
{
	var URL = Adminurl + 'Screen=MLKP&Lookup_Form=' + encodeURIComponent( Screen ) + '&Lookup_Field=' + encodeURIComponent( field );

	if ( String( Store_Code ).length )
	{
		URL += '&Store_Code=' + encodeURIComponent( Store_Code );
	}
	else if ( String( Edit_Store ).length )
	{
		URL += '&Store_Code=' + encodeURIComponent( Edit_Store );
	}

	window.open( URL, 'ComponentLookup', 'toolbar=no,location=no,directories=no,status=no,scrollbars=yes,resizable=yes,copyhistory=no,width=960,height=700' ).focus();
}

function PopupPageLookup( field )
{
	var URL = Adminurl + 'Screen=PGLP&Lookup_Form=' + encodeURIComponent( Screen ) + '&Lookup_Field=' + encodeURIComponent( field );

	if ( String( Store_Code ).length )
	{
		URL += '&Store_Code=' + encodeURIComponent( Store_Code );
	}
	else if ( String( Edit_Store ).length )
	{
		URL += '&Store_Code=' + encodeURIComponent( Edit_Store );
	}

	window.open( URL, 'PageLookup', 'toolbar=no,location=no,directories=no,status=no,scrollbars=yes,resizable=yes,copyhistory=no,width=960,height=700' ).focus();
}

function PopupCategoryLookup( field )
{
	var URL = Adminurl + 'Screen=CLKP&Lookup_Form=' + encodeURIComponent( Screen ) + '&Lookup_Field=' + encodeURIComponent( field );

	if ( String( Store_Code ).length )
	{
		URL += '&Store_Code=' + encodeURIComponent( Store_Code );
	}
	else if ( String( Edit_Store ).length )
	{
		URL += '&Store_Code=' + encodeURIComponent( Edit_Store );
	}

	window.open( URL, 'CategoryLookup', 'toolbar=no,location=no,directories=no,status=no,scrollbars=yes,resizable=yes,copyhistory=no,width=960,height=700' ).focus();
}

function PopupProductLookup( field )
{
	var URL = Adminurl + 'Screen=PLKP&Lookup_Form=' + encodeURIComponent( Screen ) + '&Lookup_Field=' + encodeURIComponent( field );

	if ( String( Store_Code ).length )
	{
		URL += '&Store_Code=' + encodeURIComponent( Store_Code );
	}
	else if ( String( Edit_Store ).length )
	{
		URL += '&Store_Code=' + encodeURIComponent( Edit_Store );
	}

	window.open( URL, 'ProductLookup', 'toolbar=no,location=no,directories=no,status=no,scrollbars=yes,resizable=yes,copyhistory=no,width=960,height=700' ).focus();
}

function KeyPressReload( field, stack, evt )
{
	evt = (evt) ? evt : ((window.event) ? window.event : "")
	if (evt.keyCode==13 || evt.which==13)
		ListReload( field, stack )
	else
		return true;
}

function ListReload( field, stack )
{
	if ( CheckModified() )
	{
		DisableButtons();
		DisableOnSubmitFormElements();

		document.forms[ Screen ].elements[ 'Action' ].value = '';
		document.forms[ Screen ].elements[ field ].value = 0;
		document.forms[ Screen ].elements[ stack ].value = '';

		if ( !ForceResetNextLoad )
		{
			document.forms[ Screen ].elements[ 'Have_Fields' ].value = 1;
		}

		if ( document.forms[ Screen ].v56_submit )	document.forms[ Screen ].v56_submit();
		else										document.forms[ Screen ].submit();
	}
}

function ListReloadField( field, stack, changefield, changevalue )
{
	if ( CheckModified() )
	{
		DisableButtons();
		DisableOnSubmitFormElements();

		document.forms[ Screen ].elements[ 'Action' ].value = '';
		document.forms[ Screen ].elements[ field ].value = 0;
		document.forms[ Screen ].elements[ stack ].value = '';
		document.forms[ Screen ].elements[ changefield ].value = changevalue;

		if ( !ForceResetNextLoad )
		{
			document.forms[ Screen ].elements[ 'Have_Fields' ].value = 1;
		}

		if ( document.forms[ Screen ].v56_submit )	document.forms[ Screen ].v56_submit();
		else										document.forms[ Screen ].submit();
	}
}

function ListPrevious( field, stack )
{
	var stackvalue = document.forms[ Screen ].elements[ stack ].value;
	var pos = stackvalue.indexOf( ':' );
	var offset = stackvalue.substring( 0, pos );

	stackvalue = stackvalue.substring( pos + 1 );

	if ( CheckModified() )
	{
		DisableButtons();
		DisableOnSubmitFormElements();

		document.forms[ Screen ].elements[ 'Action' ].value = '';
		document.forms[ Screen ].elements[ stack ].value = stackvalue;
		document.forms[ Screen ].elements[ field ].value = offset;

		if ( !ForceResetNextLoad )
		{
			document.forms[ Screen ].elements[ 'Have_Fields' ].value = 1;
		}

		if ( document.forms[ Screen ].v56_submit )	document.forms[ Screen ].v56_submit();
		else										document.forms[ Screen ].submit();
	}
}

function ListNext( field, stack, offset )
{
	if ( CheckModified() )
	{
		DisableButtons();
		DisableOnSubmitFormElements();

		document.forms[ Screen ].elements[ 'Action' ].value = '';
		document.forms[ Screen ].elements[ stack ].value = document.forms[ Screen ].elements[ field ].value + ':' + document.forms[ Screen ].elements[ stack ].value;
		document.forms[ Screen ].elements[ field ].value = offset;

		if ( !ForceResetNextLoad )
		{
			document.forms[ Screen ].elements[ 'Have_Fields' ].value = 1;
		}

		if ( document.forms[ Screen ].v56_submit )	document.forms[ Screen ].v56_submit();
		else										document.forms[ Screen ].submit();
	}
}

function ArrayListReload( field )
{
	if ( CheckModified() )
	{
		DisableButtons();
		DisableOnSubmitFormElements();

		document.forms[ Screen ].elements[ 'Action' ].value = '';
		document.forms[ Screen ].elements[ field ].value = 1;

		if ( !ForceResetNextLoad )
		{
			document.forms[ Screen ].elements[ 'Have_Fields' ].value = 1;
		}

		if ( document.forms[ Screen ].v56_submit )	document.forms[ Screen ].v56_submit();
		else										document.forms[ Screen ].submit();
	}
}

function ArrayListPrevious( field )
{
	if ( CheckModified() )
	{
		DisableButtons();
		DisableOnSubmitFormElements();

		document.forms[ Screen ].elements[ 'Action' ].value = '';
		document.forms[ Screen ].elements[ field ].value = parseInt( document.forms[ Screen ].elements[ field ].value ) - 1;

		if ( !ForceResetNextLoad )
		{
			document.forms[ Screen ].elements[ 'Have_Fields' ].value = 1;
		}

		if ( document.forms[ Screen ].v56_submit )	document.forms[ Screen ].v56_submit();
		else										document.forms[ Screen ].submit();
	}
}

function ArrayListNext( field )
{
	if ( CheckModified() )
	{
		DisableButtons();
		DisableOnSubmitFormElements();

		document.forms[ Screen ].elements[ 'Action' ].value = '';
		document.forms[ Screen ].elements[ field ].value = parseInt( document.forms[ Screen ].elements[ field ].value ) + 1;

		if ( !ForceResetNextLoad )
		{
			document.forms[ Screen ].elements[ 'Have_Fields' ].value = 1;
		}

		if ( document.forms[ Screen ].v56_submit )	document.forms[ Screen ].v56_submit();
		else										document.forms[ Screen ].submit();
	}
}

function SetModified()
{
	Modified = 1;
}

function RemoveModified()
{
	Modified = 0;
}

function SetItemModified( item )
{
	if ( item )
	{
		ItemModified = 1;
	}
}

function SetForceResetNextLoad()
{
	ForceResetNextLoad = 1;
}

function v55_Screen_Form_Submit()
{
	document.forms[ Screen ].action = AdminURL( document.forms[ Screen ].elements[ 'Screen' ].value, document.forms[ Screen ].elements[ 'Tab' ].value );
	document.forms[ Screen ].v56_submit();
}

function LoadFinished()
{
	document.forms[ Screen ].v56_submit	= document.forms[ Screen ].submit;
	document.forms[ Screen ].submit		= v55_Screen_Form_Submit;

	Loaded = 1;
	if ( PreemptiveSwitch_Screen.length || PreemptiveSwitch_Tab.length )
	{
		SwitchTab( PreemptiveSwitch_Screen, PreemptiveSwitch_Tab );
	}

	if ( (typeof HaveLoadFinishedHandler) == 'undefined' ) return;
	LoadFinishedHandler();
}

function CheckAllModified( field_base, checked)
{
	var i, box;

	for ( i = 1; ( box = document.forms[ Screen ].elements[ field_base +
		"[" + i.toString() + "]" ] ) != null; i++ )
	{
		if ( !box.disabled )
		{
			box.checked = checked;
		}
	}
	Modified = 1;
}

function CheckAll( field_base, checked )
{
	var i, box;

	for ( i = 1; ( box = document.forms[ Screen ].elements[ field_base +
		"[" + i.toString() + "]" ] ) != null; i++ )
	{
		if ( !box.disabled )
		{
			box.checked = checked;
		}
	}
}

function CheckAll_Member( field_base, member, checked )
{
	var i, box;

	for ( i = 1; ( box = document.forms[ Screen ].elements[ field_base +
		"[" + i.toString() + "]:" + member ] ) != null; i++ )
	{
		if ( !box.disabled )
		{
			box.checked = checked;
		}
	}
}

function CheckAll_In( div_id, checked )
{
	var i, inputs, div_element;
	
	div_element = document.getElementById( div_id );
	inputs		= div_element ? div_element.getElementsByTagName( 'input' ) : [];
				
	for ( i = 0; i < inputs.length; i++ )
	{
		if ( inputs[ i ].type == 'checkbox' ) inputs[ i ].checked = checked;
	}
}

function CheckButtonPress()
{
	return false;
}

function Toggle( field, value )
{
	DisableButtons();
	DisableOnSubmitFormElements();

	document.forms[ Screen ].elements[ 'Action' ].value = '';
	document.forms[ Screen ].elements[ 'ItemModified' ].value = ItemModified;
	document.forms[ Screen ].elements[ field ].value = value;

	if ( !ForceResetNextLoad )
	{
		document.forms[ Screen ].elements[ 'Have_Fields' ].value = 1;
	}

	if ( document.forms[ Screen ].v56_submit )	document.forms[ Screen ].v56_submit();
	else										document.forms[ Screen ].submit();
}

function Toggle_Prompt( prompt, field, value )
{
	if ( confirm( prompt ) )
	{
		DisableButtons();
		DisableOnSubmitFormElements();

		document.forms[ Screen ].elements[ 'Action' ].value = '';
		document.forms[ Screen ].elements[ 'ItemModified' ].value = ItemModified;
		document.forms[ Screen ].elements[ field ].value = value;

		if ( !ForceResetNextLoad )
		{
			document.forms[ Screen ].elements[ 'Have_Fields' ].value = 1;
		}

		if ( document.forms[ Screen ].v56_submit )	document.forms[ Screen ].v56_submit();
		else										document.forms[ Screen ].submit();
	}
}

function TextArea_Insert( name, newText )
{
	var caret_pos, scroll_top, element_textarea;

	element_textarea			= document.forms[ Screen ].elements[ name ];
	element_textarea.focus();

	scroll_top					= element_textarea.scrollTop;
	caret_pos					= element_textarea.selectionStart + newText.length;
	element_textarea.value		= element_textarea.value.substring( 0, element_textarea.selectionStart ) + newText + element_textarea.value.substring( element_textarea.selectionEnd, element_textarea.value.length );

	element_textarea.setSelectionRange( caret_pos, caret_pos );

	element_textarea.scrollTop	= scroll_top;
}

function TextArea_TabCapture_OnKeyDown( event, self )
{
	var scroll_top;
	var caret_pos;

	if ( event.keyCode == 9 )
	{
		scroll_top		= self.scrollTop;

		if ( self.setSelectionRange )
		{
			// FireFox
			caret_pos	= self.selectionStart + 1;
			self.value	= self.value.substring( 0, self.selectionStart ) + '\t' + self.value.substring( self.selectionEnd, self.value.length );

			setTimeout( "TextArea_TabCapture_TabHandler( " + caret_pos + ", document.forms[ Screen ].elements[ '" + self.name + "' ] );", 0 );
		}
		else
		{
			// IE
			document.selection.createRange().text	= '\t';
			event.returnValue						= false;
		}

		setTimeout( function()
		{
			self.scrollTop = scroll_top;
		}, 0 );
	}
}

function TextArea_TabCapture_TabHandler( caret_pos, self )
{
	self.focus();
	self.setSelectionRange( caret_pos, caret_pos );
}

function TextArea_WordWrap_Toggle( field )
{
	var textarea;

	textarea		= document.forms[ Screen ].elements[ field ];
	textarea.setAttribute( 'wrap', ( textarea.getAttribute( 'wrap' ) == 'off' ) ? 'soft' : 'off' );
	textarea.value	+= '';	// Required for IE9
}

function DrawCredentialInput( id )
{
	var event_swap, element_input, element_hidden, element_container;

	element_input				= document.getElementById( id );
	element_hidden				= document.getElementById( id + '_hidden' );
	element_container			= document.getElementById( id + '_container' );

	element_container.tabIndex	= 0;

	event_swap					= function( event )
	{
		RemoveEvent( element_container, 'mousedown',	event_swap );
		RemoveEvent( element_container, 'focus',		event_swap );

		if ( element_hidden.parentNode )
		{
			element_hidden.parentNode.removeChild( element_hidden );
		}

		element_input.name			= element_hidden.name;
		element_input.disabled		= false;
		element_container.tabIndex	= -1;

		classNameRemoveIfPresent( element_input, 'mm_credential_input' );
		element_input.focus();
	}

	AddEvent( element_container, 'mousedown',	event_swap );
	AddEvent( element_container, 'focus',		event_swap );
}

// MultipleSelect
/////////////////////////////////////////////////

function MultipleSelect( field_id )
{
	var self = this;
	var i;
	var div_multipleselect_container, div_multipleselect_content;
	var div_multipleselect_content_deselected_container, div_multipleselect_content_controls_container, div_multipleselect_content_selected_container;

	this.field_id													= field_id;
	this.select														= document.getElementById( field_id );

	div_multipleselect_container									= document.createElement( 'div' );
	div_multipleselect_content										= document.createElement( 'div' );
	div_multipleselect_content_deselected_container					= document.createElement( 'div' );
	div_multipleselect_content_controls_container					= document.createElement( 'div' );
	div_multipleselect_content_selected_container					= document.createElement( 'div' );
	div_multipleselect_clear										= document.createElement( 'div' );
	this.select_deselected											= document.createElement( 'select' );
	this.select_selected											= document.createElement( 'select' );
	this.button_add													= document.createElement( 'input' );
	this.button_remove												= document.createElement( 'input' );
	
	div_multipleselect_container.className							= 'multipleselect_container';
	div_multipleselect_content.className							= 'multipleselect_content';
	div_multipleselect_content_deselected_container.className		= 'multipleselect_content_deselected_container';
	div_multipleselect_content_controls_container.className			= 'multipleselect_content_controls_container';
	div_multipleselect_content_selected_container.className			= 'multipleselect_content_selected_container';
	div_multipleselect_clear.className								= 'multipleselect_clear';
	this.select_deselected.className								= 'multipleselect_content_select';
	this.select_selected.className									= 'multipleselect_content_select';
	this.button_add.className										= 'multipleselect_content_button_add';
	this.button_remove.className									= 'multipleselect_content_button_remove';
	
	this.select_deselected.multiple									= true;
	this.select_selected.multiple									= true;
	this.select_deselected.size										= 5;
	this.select_selected.size										= 5;
	this.select_deselected.name										= this.field_id + '_deselected';
	this.select_selected.name										= this.field_id + '_selected';
	this.button_add.type											= 'button';
	this.button_remove.type											= 'button';
	this.button_add.value											= 'Select >';
	this.button_remove.value										= '< Deselect';
	this.select.style.display										= 'none';
	
	this.button_add.onclick											= function() { self.Add(); self.onmodified(); };
	this.button_remove.onclick										= function() { self.Remove(); self.onmodified(); };
	this.select_deselected.onmousedown								= function() { self.select_selected.selectedIndex = -1; };
	this.select_selected.onmousedown								= function() { self.select_deselected.selectedIndex = -1; };

	for ( i = 0, len_i = this.select.options.length; i < len_i; i++ )
	{
		if ( this.select.options[ i ].selected )	this.select_selected.options[ this.select_selected.options.length ]		= new Option( this.select.options[ i ].text, this.select.options[ i ].value );
		else										this.select_deselected.options[ this.select_deselected.options.length ] = new Option( this.select.options[ i ].text, this.select.options[ i ].value );
	}

	this.SortSelect( this.select_deselected );
	this.SortSelect( this.select_selected );
	this.SortSelect( this.select );
	
	this.select.options.length										= 0;

	for ( i = 0, i_len = this.select_selected.options.length; i < i_len; i++ )
	{
		select_len													= this.select.options.length;
		this.select.options[ select_len ]							= new Option( this.select_selected.options[ i ].text, this.select_selected.options[ i ].value );
		this.select.options[ select_len ].selected					= true;
	}

	div_multipleselect_content_deselected_container.appendChild( this.select_deselected );
	div_multipleselect_content_controls_container.appendChild( this.button_add );
	div_multipleselect_content_controls_container.appendChild( document.createElement( 'br' ) );
	div_multipleselect_content_controls_container.appendChild( this.button_remove );
	div_multipleselect_content_selected_container.appendChild( this.select_selected );
	div_multipleselect_content.appendChild( div_multipleselect_content_deselected_container );
	div_multipleselect_content.appendChild( div_multipleselect_content_controls_container );
	div_multipleselect_content.appendChild( div_multipleselect_content_selected_container );
	div_multipleselect_container.appendChild( div_multipleselect_content );
	div_multipleselect_container.appendChild( div_multipleselect_clear );

	this.select.parentNode.insertBefore( div_multipleselect_container, this.select );
}

MultipleSelect.prototype.Add = function()
{
	var i, i_len, select_len;

	for ( i = 0, i_len = this.select_deselected.options.length; i < i_len; i++ )
	{
		if ( this.select_deselected.options[ i ].selected )
		{
			this.select_selected.options[ this.select_selected.options.length ] = new Option( this.select_deselected.options[ i ].text, this.select_deselected.options[ i ].value );
			this.select_deselected.remove( i );
			i_len--;
			i--;
		}
	}

	this.SortSelect( this.select_deselected );
	this.SortSelect( this.select_selected );
	
	this.select.options.length						= 0;

	for ( i = 0, i_len = this.select_selected.options.length; i < i_len; i++ )
	{
		select_len									= this.select.options.length;
		this.select.options[ select_len ]			= new Option( this.select_selected.options[ i ].text, this.select_selected.options[ i ].value );
		this.select.options[ select_len ].selected	= true;
	}
}

MultipleSelect.prototype.Remove = function()
{
	var i, i_len, select_len;

	for ( i = 0, i_len = this.select_selected.options.length; i < i_len; i++ )
	{
		if ( this.select_selected.options[ i ].selected )
		{
			this.select_deselected.options[ this.select_deselected.options.length ] = new Option( this.select_selected.options[ i ].text, this.select_selected.options[ i ].value );
			this.select_selected.remove( i );
			i_len--;
			i--;
		}
	}

	this.SortSelect( this.select_deselected );
	this.SortSelect( this.select_selected );
	
	this.select.options.length						= 0;

	for ( i = 0, i_len = this.select_selected.options.length; i < i_len; i++ )
	{
		select_len									= this.select.options.length;
		this.select.options[ select_len ]			= new Option( this.select_selected.options[ i ].text, this.select_selected.options[ i ].value );
		this.select.options[ select_len ].selected	= true;
	}
}

MultipleSelect.prototype.SortSelect = function( select )
{
	var i, i_len, arr;

	arr								= new Array();

	for ( i = 0, i_len = select.options.length; i < i_len; i++ )
	{
		arr[ i ]					= select.options[ i ];
	}

	arr.sort( function( a, b )
	{
		if ( a.text > b.text ) 		return 1;
		else if ( a.text < b.text )	return -1;

		return 0;
	} );

	select.options.length 			= 0;

	for ( i = 0, i_len = arr.length; i < i_len; i++ )
	{
		select.options[ i ] 		= arr[ i ];
	}
}

MultipleSelect.prototype.onmodified = function() { ; }

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

function getScopedElementsByAttributeAndValue( attribute_name, attribute_value, scope )
{
	var i, i_len, results, all_elements;

	results			= new Array();
	all_elements    = document.getElementsByTagName( '*' );

	for ( i = 0, i_len = all_elements.length; i < i_len; i++ )
	{
		if ( all_elements[ i ].getAttribute( attribute_name ) === attribute_value )
		{
			results.push( all_elements[ i ] );
		}
	}

	return results;
}

function DisableOnSubmitFormElements()
{
	var i, j, k, i_len, j_len, k_len, elements, tag_names, form_elements;

	tag_names	= [ 'input', 'select', 'textarea' ];
	elements 	= getScopedElementsByAttributeAndValue( 'data-mmdisableonsubmit', 'on', document );

	for ( i = 0, i_len = elements.length; i < i_len; i++ )
	{
		for ( j = 0, j_len = tag_names.length; j < j_len; j++ )
		{
			form_elements = elements[ i ].getElementsByTagName( tag_names[ j ] );

			for ( k = 0, k_len = form_elements.length; k < k_len; k++ )
			{
				form_elements[ k ].disabled = true;
			}
		}
	}
}

/*
 * Note: This function is also present (with a different name) in ajax.js and ui.js.
 *       Modifications here should be made in those other locations as well.
 */

function v55_CharsetEncodeAttribute( instring )
{
	var encoded;

	if ( v55_isUnicode() )
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
 * Note: This function is also present (with a different name) in ajax.js and ui.js.
 *       Modifications here should be made in those other locations as well.
 */

function v55_isUnicode()
{
	return ( document.characterSet || document.charset || '' ).search( 'UTF' ) == 0 ? true : false;
}

