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

// Search And Replace
////////////////////////////////////////////////////

function TemplateSearchAndReplace_Interface()
{
	var self = this;
	var element;

	this.can_modify											= CanI( 'PAGE', 0, 0, 1, 0 );
	this.key_prefix											= generateKeyPrefix() + '.TemplateSearchAndReplace';
	this.processing_button									= null;
	this.processing_button_text								= '';
	this.processing_button_enabled							= new Array();
	this.itemlist_results									= new Array();
	this.request_onselectionupdated							= false;
	this.request_onselectionupdated_id						= null;

	this.render_onselectionupdated							= function() { self.Render_OnSelectionUpdated(); };
	this.event_onclick_selection							= function( event ) { return self.Event_OnClick_Selection( event ? event : window.event ); };

	this.element_container									= document.getElementById( 'templatesearchandreplace_interface_container' );

	this.element_search_container							= newElement( 'span', { 'class': 'templatesearchandreplace_interface_container visible' },						null, this.element_container );
	this.element_search_title								= newElement( 'span', { 'class': 'templatesearchandreplace_interface_title mm10_style_header_font' },			null, this.element_search_container );
	this.element_search_content								= newElement( 'span', { 'class': 'templatesearchandreplace_interface_content' },								null, this.element_search_container );
	this.element_search_row_find							= newElement( 'span', { 'class': 'templatesearchandreplace_interface_search_row visible' },						null, this.element_search_content );
	this.element_search_row_field_find						= newElement( 'span', { 'class': 'templatesearchandreplace_interface_search_row_field' },						null, this.element_search_row_find );
	this.element_search_row_actions_find					= newElement( 'span', { 'class': 'templatesearchandreplace_interface_search_row_actions' },						null, this.element_search_row_find );

	if ( this.can_modify )
	{
		this.element_search_row_replace						= newElement( 'span', { 'class': 'templatesearchandreplace_interface_search_row replace' },						null, this.element_search_content );
		this.element_search_row_field_replace				= newElement( 'span', { 'class': 'templatesearchandreplace_interface_search_row_field' },						null, this.element_search_row_replace );
		this.element_search_row_actions_replace				= newElement( 'span', { 'class': 'templatesearchandreplace_interface_search_row_actions' },						null, this.element_search_row_replace );
	}

	this.element_results_container							= newElement( 'span', { 'class': 'templatesearchandreplace_interface_container' },								null, this.element_container );
	this.element_results_title								= newElement( 'span', { 'class': 'templatesearchandreplace_interface_title mm10_style_header_font' },			null, this.element_results_container );
	this.element_results_subtitle							= newElement( 'span', { 'class': 'templatesearchandreplace_interface_subtitle' },								null, this.element_results_container );
	this.element_results_content							= newElement( 'span', { 'class': 'templatesearchandreplace_interface_content' },								null, this.element_results_container );
	this.element_results_header								= newElement( 'span', { 'class': 'templatesearchandreplace_interface_results_header' },							null, this.element_results_content );

	if ( this.can_modify )
	{
		this.element_results_header_selection_container		= newElement( 'span', { 'class': 'templatesearchandreplace_interface_results_header_selection_container' },		null, this.element_results_header );
		this.element_results_header_selection_checkbox		= newElement( 'span', { 'class': 'templatesearchandreplace_interface_results_header_selection_checkbox' },		null, this.element_results_header_selection_container );
		this.element_results_header_selection_checkbox_bg1	= newElement( 'span', { 'class': 'templatesearchandreplace_interface_results_header_selection_checkbox_bg1' },	null, this.element_results_header_selection_checkbox );
		this.element_results_header_selection_checkbox_bg2	= newElement( 'span', { 'class': 'templatesearchandreplace_interface_results_header_selection_checkbox_bg2' },	null, this.element_results_header_selection_checkbox );

		this.element_results_header_label					= newElement( 'span', { 'class': 'templatesearchandreplace_interface_results_header_label' },					null, this.element_results_header );
		this.element_results_header_label.textContent		= '0 Selected';

		AddEvent( this.element_results_header_selection_container, 'click', this.event_onclick_selection );
	}

	this.element_results_header_actions						= newElement( 'span', { 'class': 'templatesearchandreplace_interface_results_header_actions' },					null, this.element_results_header );
	this.element_results									= newElement( 'span', { 'class': 'templatesearchandreplace_interface_results' },								null, this.element_results_content );

	this.element_search_title.textContent					= 'Template Search And Replace';
	this.element_results_title.textContent					= 'Results';
	this.element_results_subtitle.textContent				= '0 search results found';

	this.textarea_find										= new MMTextArea( this.element_search_row_field_find, 'Find', '' );
	this.textarea_find.SetTitle( 'Find' );
	this.textarea_find.AddClassName( [ 'whole_width', 'title_visible' ] );
	this.textarea_find.SetAutoHeightEnabled( 44, 150 );
	this.textarea_find.SetOnEnterHandler( function( e ) { self.button_find.SimulateClick(); } );
	this.textarea_find.SetOnChangeHandler( function( value )
	{
		if ( value.length )	self.button_find.Enable();
		else				self.button_find.Disable();
	} );

	this.button_find										= new MMButton( this.element_search_row_actions_find );
	this.button_find.SetText( 'Find' );
	this.button_find.SetClassName( 'mm10_button_style_primary templatesearchandreplace_interface_search_button' );
	this.button_find.SetOnClickHandler( function( e ) { self.Find(); } );
	this.button_find.Disable();

	element													= newElement( 'span', { 'class': 'mm10_button_style_xxx_tertiary_icon' },		null, null );
	element.element_bg1										= newElement( 'span', { 'class': 'mm10_button_style_xxx_tertiary_icon_bg1' },	null, element );
	element.element_bg2										= newElement( 'span', { 'class': 'mm10_button_style_xxx_tertiary_icon_bg2' },	null, element );
	element.element_bg3										= newElement( 'span', { 'class': 'mm10_button_style_xxx_tertiary_icon_bg3' },	null, element );

	this.menubutton_options									= new MMMenuButton( '', this.element_search_row_actions_find );
	this.menubutton_options_matchcase						= this.menubutton_options.Menu_Append_Item_Checkbox( 'Match Case', function() { UserPreferenceList_Save( Store_Code, [ self.key_prefix + '.match_case' ], [ self.menubutton_options_matchcase.Checked() ? '1' : '0' ], function( response ) { ; } ); }, null );
	this.menubutton_options.onAddKeyStackEntry				= function( keystackentry ) { KeyDownHandlerStackEntry_BubbleUnsetKeyCodes( keystackentry ); };
	this.menubutton_options.onButtonAddKeyStackEntry		= function( keystackentry ) { KeyDownHandlerStackEntry_BubbleUnsetKeyCodes( keystackentry ); };
	this.menubutton_options.SetAnimateMenu( true );
	this.menubutton_options.SetMenuAsRootMenu( true );
	this.menubutton_options.SetMenuAsRootMenu_AutosizesFromRight( true );
	this.menubutton_options.SetCustomContent( element );
	this.menubutton_options.SetClassName( 'mm10_menubutton_container_style_common' );
	this.menubutton_options.SetMenuClassName( 'mm10_menubutton_container_style_common_menu' );
	this.menubutton_options.SetButtonClassName( 'mm10_button_style_secondary tertiary' );

	this.button_newsearch									= new MMButton( this.element_search_row_actions_find );
	this.button_newsearch.SetText( 'New Search' );
	this.button_newsearch.SetClassName( 'mm10_button_style_secondary templatesearchandreplace_interface_search_button' );
	this.button_newsearch.SetOnClickHandler( function( e ) { self.NewSearch(); } );
	this.button_newsearch.Hide();

	if ( this.can_modify )
	{
		this.textarea_replace								= new MMTextArea( this.element_search_row_field_replace, 'Replace', '' );
		this.textarea_replace.SetTitle( 'Replace' );
		this.textarea_replace.AddClassName( [ 'whole_width', 'title_visible' ] );
		this.textarea_replace.SetAutoHeightEnabled( 44, 150 );
		this.textarea_replace.SetOnEnterHandler( function( e ) { self.button_replace.SimulateClick(); } );

		this.button_replace									= new MMButton( this.element_search_row_actions_replace );
		this.button_replace.SetText( 'Replace Selected' );
		this.button_replace.SetClassName( 'mm10_button_style_primary templatesearchandreplace_interface_search_button' );
		this.button_replace.SetOnClickHandler( function( e ) { self.Replace(); } );
	}

	this.button_collapse_all								= new MMButton( this.element_results_header_actions );
	this.button_collapse_all.SetText( 'Collapse All' );
	this.button_collapse_all.SetClassName( 'mm10_button_style_link' );
	this.button_collapse_all.SetOnClickHandler( function( e ) { self.Collapse_All(); } );

	newElement( 'span', { 'class': 'templatesearchandreplace_interface_results_header_actions_border' }, null, this.element_results_header_actions );

	this.button_expand_all									= new MMButton( this.element_results_header_actions );
	this.button_expand_all.SetText( 'Expand All' );
	this.button_expand_all.SetClassName( 'mm10_button_style_link' );
	this.button_expand_all.SetOnClickHandler( function( e ) { self.Expand_All(); } );

	setTimeout( function()
	{
		var cached_preferences;

		if ( self.key_prefix.length == 0 )
		{
			self.LoadPreferences( {} );
		}
		else if ( typeof window.MMCachedPreferences !== 'undefined' )
		{
			cached_preferences = cloneObject( MMCachedPreferenceList_Heirarchy( self.key_prefix ) );
			self.LoadPreferences( cached_preferences ? cached_preferences : {} );
		}
		else
		{
			UserPreferenceList_Load_Heirarchy( self.key_prefix, function( response )
			{
				self.LoadPreferences( response.success ? response.data : {} );
			} );
		}
	}, 0 );
}

TemplateSearchAndReplace_Interface.prototype.LoadPreferences = function( preferences )
{
	var match_case;

	if ( preferences && typeof preferences.match_case !== 'undefined' )	match_case = stob( preferences.match_case );
	else																match_case = false;

	this.menubutton_options_matchcase.SetChecked( match_case );
	this.textarea_find.Focus();
}

TemplateSearchAndReplace_Interface.prototype.SetProcessing_Start = function( button, button_text )
{
	var i, i_len;

	this.processing_button			= button;
	this.processing_button_text		= button.GetText();
	this.processing_button_enabled	= new Array();

	if ( this.textarea_find.IsEnabled() )								this.processing_button_enabled.push( this.textarea_find );
	if ( this.button_find.IsEnabled() )									this.processing_button_enabled.push( this.button_find );
	if ( this.menubutton_options.IsEnabled() )							this.processing_button_enabled.push( this.menubutton_options );
	if ( this.button_newsearch.IsEnabled() )							this.processing_button_enabled.push( this.button_newsearch );
	if ( this.textarea_replace && this.textarea_replace.IsEnabled() )	this.processing_button_enabled.push( this.textarea_replace );
	if ( this.button_replace && this.button_replace.IsEnabled() )		this.processing_button_enabled.push( this.button_replace );

	for ( i = 0, i_len = this.processing_button_enabled.length; i < i_len; i++ )
	{
		this.processing_button_enabled[ i ].Disable();
	}

	button.SetText( button_text || 'Processing...' );
}

TemplateSearchAndReplace_Interface.prototype.SetProcessing_End = function()
{
	var i, i_len;

	for ( i = 0, i_len = this.processing_button_enabled.length; i < i_len; i++ )
	{
		this.processing_button_enabled[ i ].Enable();
	}

	this.processing_button.SetText( this.processing_button_text );
}

TemplateSearchAndReplace_Interface.prototype.ResultItems = function()
{
	return this.itemlist_results;
}

TemplateSearchAndReplace_Interface.prototype.ResultItem_Count = function()
{
	return this.itemlist_results.length;
}

TemplateSearchAndReplace_Interface.prototype.ResultItem_IndexOf = function( item )
{
	return this.itemlist_results.indexOf( item );
}

TemplateSearchAndReplace_Interface.prototype.ResultItem_AtIndex = function( index )
{
	if ( index >= 0 && this.itemlist_results.hasOwnProperty( index ) && this.itemlist_results[ index ] instanceof TemplateSearchAndReplace_Interface_ResultItem )
	{
		return this.itemlist_results[ index ];
	}

	return null;
}

TemplateSearchAndReplace_Interface.prototype.ResultItem_Create = function( result )
{
	var self = this;
	var item;

	item					= new TemplateSearchAndReplace_Interface_ResultItem( result, this.can_modify );
	item.onSelectionUpdated	= function() { self.Request_OnSelectionUpdated(); };

	return item;
}

TemplateSearchAndReplace_Interface.prototype.ResultItem_Append = function( result )
{
	return this.ResultItem_Insert( this.ResultItem_Create( result ), -1 );
}

TemplateSearchAndReplace_Interface.prototype.ResultItem_Insert = function( item, index )
{
	var item_sibling;

	if ( ( item_sibling = this.ResultItem_AtIndex( index ) ) === null )
	{
		index = this.itemlist_results.length;
	}

	item.SetParentNode_InsertBefore( this.element_results, item_sibling ? item_sibling.ContainedElement() : null );
	this.itemlist_results.splice( index, 0, item );

	return item;
}

TemplateSearchAndReplace_Interface.prototype.ResultItem_Remove = function( item )
{
	var index;

	if ( item.MatchItem_Count_Selected() )
	{
		item.Deselect();
	}

	item.MatchItems_Empty();

	if ( this.element_results === item.ParentNode() )
	{
		this.element_results.removeChild( item.ContainedElement() );
	}

	if ( ( index = this.itemlist_results.indexOf( item ) ) !== -1 )
	{
		this.itemlist_results.splice( index, 1 );
	}
}

TemplateSearchAndReplace_Interface.prototype.ResultItems_Empty = function()
{
	var item;

	while ( this.itemlist_results.length )
	{
		item = this.itemlist_results.pop();

		if ( item.MatchItem_Count_Selected() )
		{
			item.Deselect();
		}

		item.MatchItems_Empty();

		if ( this.element_results === item.ParentNode() )
		{
			this.element_results.removeChild( item.ContainedElement() );
		}
	}
}

TemplateSearchAndReplace_Interface.prototype.NewSearch = function()
{
	this.ResultItems_Empty();

	this.button_find.Show();
	this.menubutton_options.Show();
	this.button_newsearch.Hide();
	this.textarea_find.SetReadOnly( false );

	classNameRemoveIfPresent( this.element_results_container, 'visible' );

	if ( this.element_search_row_replace )
	{
		classNameRemoveIfPresent( this.element_search_row_replace, 'visible' );
	}

	this.textarea_find.Select();
}

TemplateSearchAndReplace_Interface.prototype.Find = function()
{
	var self = this;
	var matches = new Array();

	this.SetProcessing_Start( this.button_find );
	EmptyElement_NoResize( this.element_results );
	TemplateSearchAndReplace_Find( 0, this.textarea_find.GetValue(), this.menubutton_options_matchcase.Checked(), function( response ) { self.Find_Callback( response, matches ); } );
}

TemplateSearchAndReplace_Interface.prototype.Find_Callback = function( response, matches )
{
	var self = this;
	var i, item, i_len, total_match_count;

	if ( !this.ValidateResponse( response ) )
	{
		this.SetProcessing_End();
		this.ResultItems_Empty();
		EmptyElement_NoResize( this.element_results );

		return;
	}

	matches = matches.concat( response.data.matches );

	if ( !response.data.complete )
	{
		return TemplateSearchAndReplace_Find( response.data.last_template_id, this.textarea_find.GetValue(), this.menubutton_options_matchcase.Checked(), function( response ) { self.Find_Callback( response, matches ); } );
	}

	this.SetProcessing_End();
	this.ResultItems_Empty();
	EmptyElement_NoResize( this.element_results );

	matches.sort( function( a, b ) { return sortAlphaNumeric( a.template_name, b.template_name, true ); } );

	total_match_count = 0;

	for ( i = 0, i_len = matches.length; i < i_len; i++ )
	{
		item				= this.ResultItem_Append( matches[ i ] );
		total_match_count	+= item.MatchItem_Count();
	}

	this.element_results_subtitle.textContent = total_match_count + ' search results found containing "' + this.textarea_find.GetValue() + '"';

	this.button_find.Hide();
	this.menubutton_options.Hide();
	this.button_newsearch.Show();
	this.textarea_find.SetReadOnly( true );

	classNameAddIfMissing( this.element_results_container, 'visible' );

	if ( this.ResultItem_Count() )		classNameRemoveIfPresent( this.element_results_container, 'empty' );
	else								classNameAddIfMissing( this.element_results_container, 'empty' );

	if ( this.element_search_row_replace )
	{
		if ( this.ResultItem_Count() )	classNameAddIfMissing( this.element_search_row_replace, 'visible' );
		else							classNameRemoveIfPresent( this.element_search_row_replace, 'visible' );
	}

	if ( this.textarea_replace )
	{
		this.textarea_replace.SetValue( '' );
		this.textarea_replace.Focus();
	}

	this.Request_OnSelectionUpdated();
}

TemplateSearchAndReplace_Interface.prototype.Replace = function()
{
	var self = this;
	var i, item, i_len, dialog, templates, selected_count;

	templates			= new Array();
	selected_count		= this.Count_Selected();

	for ( i = 0, i_len = this.ResultItem_Count(); i < i_len; i++ )
	{
		if ( ( item = this.ResultItem_AtIndex( i ) ) === null )
		{
			continue;
		}

		if ( !item.MatchItem_Count_Selected() )
		{
			continue;
		}

		templates.push( item.GenerateTitle() );
	}

	dialog 				= new TemplateSearchAndReplace_ConfirmationNotesDialog( this.textarea_find.GetValue(), this.textarea_replace.GetValue(), templates.join( '\r\n' ), selected_count );
	dialog.onReplace	= function( notes )
	{
		self.Replace_LowLevel( notes );
	}

	dialog.Show();
}

TemplateSearchAndReplace_Interface.prototype.Replace_LowLevel = function( notes )
{
	var self = this;
	var i, i_len, item, templates, replace_text;

	templates		= new Array();
	replace_text	= this.textarea_replace.GetValue();

	for ( i = 0, i_len = this.ResultItem_Count(); i < i_len; i++ )
	{
		if ( ( item = this.ResultItem_AtIndex( i ) ) === null )
		{
			continue;
		}

		if ( !item.MatchItem_Count_Selected() )
		{
			continue;
		}

		templates.push( item.BuildTemplate() );
	}

	this.SetProcessing_Start( this.button_replace, 'Replacing...' );
	TemplateSearchAndReplace_Replace( this.textarea_replace.GetValue(), notes, templates, function( response ) { self.Replace_Callback( response, replace_text, notes, templates ); } );
}

TemplateSearchAndReplace_Interface.prototype.Replace_Callback = function( response, replace_text, notes, templates )
{
	var self = this;
	var dialog;

	if ( !this.ValidateResponse( response ) )
	{
		return this.SetProcessing_End();
	}

	if ( response.processed < templates.length )
	{
		templates = templates.slice( response.processed );
		TemplateSearchAndReplace_Replace( replace_text, notes, templates, function( response ) { self.Replace_Callback( response, replace_text, notes, templates ); } );

		return;
	}

	this.SetProcessing_End();

	dialog			= new ActionDialog();
	dialog.onHide	= function()
	{
		if ( self.Count_Selected() === self.Count_Total() )
		{
			return self.NewSearch();
		}

		self.Find();
	};

	dialog.SetTitle( 'Success!' );
	dialog.SetMessage( 'All selections have been replaced' );
	dialog.Show();
}

TemplateSearchAndReplace_Interface.prototype.Count_Selected = function()
{
	var i, i_len, item, selected_count;

	selected_count = 0;

	for ( i = 0, i_len = this.ResultItem_Count(); i < i_len; i++ )
	{
		if ( ( item = this.ResultItem_AtIndex( i ) ) === null )
		{
			continue;
		}

		selected_count += item.MatchItem_Count_Selected();
	}

	return selected_count;
}

TemplateSearchAndReplace_Interface.prototype.Count_Total = function()
{
	var i, i_len, item, count;

	count = 0;

	for ( i = 0, i_len = this.ResultItem_Count(); i < i_len; i++ )
	{
		if ( ( item = this.ResultItem_AtIndex( i ) ) === null )
		{
			continue;
		}

		count += item.MatchItem_Count();
	}

	return count;
}

TemplateSearchAndReplace_Interface.prototype.Select_All = function()
{
	var i, i_len, item;

	if ( !this.can_modify )
	{
		return;
	}

	for ( i = 0, i_len = this.ResultItem_Count(); i < i_len; i++ )
	{
		if ( ( item = this.ResultItem_AtIndex( i ) ) === null )
		{
			continue;
		}

		item.Select();
	}
}

TemplateSearchAndReplace_Interface.prototype.Deselect_All = function()
{
	var i, i_len, item;

	if ( !this.can_modify )
	{
		return;
	}

	for ( i = 0, i_len = this.ResultItem_Count(); i < i_len; i++ )
	{
		if ( ( item = this.ResultItem_AtIndex( i ) ) === null )
		{
			continue;
		}

		item.Deselect();
	}
}

TemplateSearchAndReplace_Interface.prototype.Collapse_All = function()
{
	var i, i_len, item;

	for ( i = 0, i_len = this.ResultItem_Count(); i < i_len; i++ )
	{
		if ( ( item = this.ResultItem_AtIndex( i ) ) === null )
		{
			continue;
		}

		item.Collapse();
	}
}

TemplateSearchAndReplace_Interface.prototype.Expand_All = function()
{
	var i, i_len, item;

	for ( i = 0, i_len = this.ResultItem_Count(); i < i_len; i++ )
	{
		if ( ( item = this.ResultItem_AtIndex( i ) ) === null )
		{
			continue;
		}

		item.Expand();
	}
}

TemplateSearchAndReplace_Interface.prototype.Request_OnSelectionUpdated = function()
{
	if ( this.can_modify && !this.request_onselectionupdated )
	{
		this.request_onselectionupdated		= true;
		this.request_onselectionupdated_id	= window.requestAnimationFrame( this.render_onselectionupdated );
	}
}

TemplateSearchAndReplace_Interface.prototype.Render_OnSelectionUpdated = function()
{
	var total_count, selected_count;

	this.request_onselectionupdated	= false;

	if ( !this.can_modify )
	{
		return;
	}

	total_count		= this.Count_Total();
	selected_count	= this.Count_Selected();

	if ( total_count > 0 && selected_count === total_count )	classNameReplaceIfAltered( this.element_results_header, 'partially_selected', 'selected' );
	else if ( selected_count > 0 )								classNameReplaceIfAltered( this.element_results_header, 'selected', 'partially_selected' );
	else														classNameRemoveIfPresent( this.element_results_header, [ 'selected', 'partially_selected' ] );

	if ( this.element_results_header_label )
	{
		this.element_results_header_label.textContent = selected_count + ' Selected';
	}

	if ( this.button_replace )
	{
		if ( selected_count > 0 )	this.button_replace.Enable();
		else						this.button_replace.Disable();
	}
}

TemplateSearchAndReplace_Interface.prototype.Event_OnClick_Selection = function( e )
{
	var rightclick;

	if ( 'which' in e )			rightclick = ( e.which == 3 ); 
	else if ( 'button' in e )	rightclick = ( e.button == 2 );
	else						rightclick = false;

	if ( rightclick )			return true;

	if ( this.Count_Total() !== this.Count_Selected() )	this.Select_All();
	else												this.Deselect_All();

	return true;
}

TemplateSearchAndReplace_Interface.prototype.ValidateResponse = function( response )
{
	if ( !response.success )
	{
		if ( !response.validation_error )				this.onError( response.error_message );
		else if ( response.error_field_message.length )	this.onError( response.error_field_message );
		else											this.onError( 'One or more fields were improperly filled out' );

		return false;
	}

	return true;
}

TemplateSearchAndReplace_Interface.prototype.onError = function( error_message, onhide_callback )
{
	var dialog;

	dialog			= new ActionDialog();
	dialog.onHide	= function()
	{
		if ( typeof onhide_callback === 'function' )
		{
			onhide_callback();
		}
	};

	dialog.SetTitle( 'Error' );
	dialog.SetMessage( error_message );
	dialog.Show();
}

// TemplateSearchAndReplace_Interface_ResultItem
////////////////////////////////////////////////////

function TemplateSearchAndReplace_Interface_ResultItem( result, can_modify )
{
	var self = this;
	var i, i_len;

	this.result								= result;
	this.can_modify							= can_modify;
	this.itemlist_matches					= new Array();
	this.collapsed							= false;
	this.request_onselectionupdated			= false;
	this.request_onselectionupdated_id		= null;
	this.animation_id						= GenerateUniqueID();

	this.render_onselectionupdated			= function() { self.Render_OnSelectionUpdated(); };
	this.event_onclick_selection			= function( event ) { return self.Event_OnClick_Selection( event ? event : window.event ); };
	this.event_onclick_title				= function( event ) { return self.Event_OnClick_Title( event ? event : window.event ); };

	this.element_container					= newElement( 'span', { 'class': 'templatesearchandreplace_interface_result_item' },								null, null );
	this.element_header						= newElement( 'span', { 'class': 'templatesearchandreplace_interface_result_item_header' },							null, this.element_container );

	if ( this.can_modify )
	{
		this.element_selection_container	= newElement( 'span', { 'class': 'templatesearchandreplace_interface_result_item_selection_container' },			null, this.element_header );
		this.element_selection_checkbox		= newElement( 'span', { 'class': 'templatesearchandreplace_interface_result_item_selection_checkbox' },				null, this.element_selection_container );
		this.element_selection_bg1			= newElement( 'span', { 'class': 'templatesearchandreplace_interface_result_item_selection_checkbox_bg1' },			null, this.element_selection_checkbox );
		this.element_selection_bg2			= newElement( 'span', { 'class': 'templatesearchandreplace_interface_result_item_selection_checkbox_bg2' },			null, this.element_selection_checkbox );

		AddEvent( this.element_selection_container, 'click', this.event_onclick_selection );
	}

	this.element_title						= newElement( 'span', { 'class': 'templatesearchandreplace_interface_result_item_title mm10_style_header_font' },	null, this.element_header );
	this.element_spacer						= newElement( 'span', { 'class': 'templatesearchandreplace_interface_result_item_spacer' },							null, this.element_header );
	this.element_label_container			= newElement( 'span', { 'class': 'templatesearchandreplace_interface_result_item_label_container' },				null, this.element_header );
	this.element_view						= newElement( 'span', { 'class': 'templatesearchandreplace_interface_result_item_label_view' },						null, this.element_label_container );

	if ( this.can_modify )
	{
		this.element_label					= newElement( 'span', { 'class': 'templatesearchandreplace_interface_result_item_label' },							null, this.element_label_container );
		this.element_label.textContent		= '0 Selected';
	}

	this.element_match_container			= newElement( 'span', { 'class': 'templatesearchandreplace_interface_result_item_match_container' },				null, this.element_container );

	this.element_title.textContent			= this.GenerateTitle();

	if ( this.result.hasOwnProperty( 'page' ) )								this.BuildView( 'View Page',				{ Screen: 'PAGE', Store_Code: Store_Code, Edit_Page: self.result.page.code } );
	else if ( this.result.hasOwnProperty( 'cssresource' ) )					this.BuildView( 'View CSS Resource',		{ Screen: 'UIRS', Store_Code: Store_Code, Tab: 'CSSR', Filter_CSSResource_Code: self.result.cssresource.code } );
	else if ( this.result.hasOwnProperty( 'scriptresource' ) )				this.BuildView( 'View JavaScript Resource',	{ Screen: 'UIRS', Store_Code: Store_Code, Tab: 'JSRS', Filter_JavaScriptResource_Code: self.result.scriptresource.code } );
	else if ( this.result.hasOwnProperty( 'readytheme_contentsection' ) )	this.BuildView( 'View Content Section',		{ Screen: 'SUTL', Store_Code: Store_Code, Module_Code: 'readytheme', Module_Screen: 'RTCS', Edit_ContentSection: self.result.readytheme_contentsection.code } );
	else if ( this.result.hasOwnProperty( 'readytheme_navigationset' ) )	this.BuildView( 'View Navigation Set',		{ Screen: 'SUTL', Store_Code: Store_Code, Module_Code: 'readytheme', Module_Screen: 'RTNS', Edit_NavigationSet: self.result.readytheme_navigationset.code } );
	else if ( this.result.hasOwnProperty( 'readytheme_productlisting' ) )	this.BuildView( 'View Product Listing',		{ Screen: 'SUTL', Store_Code: Store_Code, Module_Code: 'readytheme', Module_Screen: 'RTPL', Edit_ProductListing: self.result.readytheme_productlisting.code } );
	else if ( this.result.hasOwnProperty( 'product' ) )						this.BuildView( 'View Product',				{ Screen: 'PROD', Store_Code: Store_Code, Edit_Product: self.result.product.code } );
	else if ( this.result.hasOwnProperty( 'category' ) )					this.BuildView( 'View Category',			{ Screen: 'CTGY', Store_Code: Store_Code, Edit_Category: self.result.category.code } );

	for ( i = 0, i_len = this.result.matchlist.length; i < i_len; i++ )
	{
		this.MatchItem_Append( this.result.matchlist[ i ] );
	}

	AddEvent( this.element_title, 'click', this.event_onclick_title );
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.GenerateTitle = function()
{
	if ( this.result.hasOwnProperty( 'page' ) )								return 'Page: ' + this.result.page.name + ' (' + this.result.template_name + ')';
	else if ( this.result.hasOwnProperty( 'cssresource' ) )					return 'CSS Resource: ' + this.result.cssresource.code;
	else if ( this.result.hasOwnProperty( 'scriptresource' ) )				return 'JavaScript Resource: ' + this.result.scriptresource.code;
	else if ( this.result.hasOwnProperty( 'readytheme_contentsection' ) )	return 'ReadyTheme Content Section: ' + this.result.readytheme_contentsection.name;
	else if ( this.result.hasOwnProperty( 'readytheme_navigationset' ) )	return 'ReadyTheme Navigation Set: ' + this.result.readytheme_navigationset.name;
	else if ( this.result.hasOwnProperty( 'readytheme_productlisting' ) )	return 'ReadyTheme Product Listing: ' + this.result.readytheme_productlisting.name;
	else if ( this.result.hasOwnProperty( 'product' ) )						return 'Product: ' + this.result.product.name + ' (' + this.result.template_name + ')';
	else if ( this.result.hasOwnProperty( 'category' ) )					return 'Category: ' + this.result.category.name + ' (' + this.result.template_name + ')';
	else																	return 'Template: ' + this.result.template_name;
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.BuildView = function( label, params )
{
	var button_view;

	button_view = new MMButton( this.element_view );
	button_view.SetText( label );
	button_view.SetAllowMiddleClick( true );
	button_view.SetClassName( 'mm10_button_style_link' );
	button_view.SetOnClickHandler( function( e ) { return OpenLinkHandler( e, Adminurl, params ); } );
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.ContainedElement = function()
{
	return this.element_container;
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.SetParentNode_InsertBefore = function( parent_node, existing_node )
{
	parent_node.insertBefore( this.ContainedElement(), existing_node );
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.ParentNode = function()
{
	return this.ContainedElement().parentNode;
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.Select = function()
{
	var i, i_len, item;

	if ( !this.can_modify )
	{
		return;
	}

	for ( i = 0, i_len = this.MatchItem_Count(); i < i_len; i++ )
	{
		if ( ( item = this.MatchItem_AtIndex( i ) ) === null )
		{
			continue;
		}

		item.Select();
	}
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.Deselect = function()
{
	var i, i_len, item;

	if ( !this.can_modify )
	{
		return;
	}

	for ( i = 0, i_len = this.MatchItem_Count(); i < i_len; i++ )
	{
		if ( ( item = this.MatchItem_AtIndex( i ) ) === null )
		{
			continue;
		}

		item.Deselect();
	}
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.GetResult = function()
{
	return this.result;
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.BuildTemplate = function()
{
	var i, i_len, item, template, replacement;

	template				= new Object();
	template.template_id	= this.result.template_id;
	template.version_id		= this.result.version_id;
	template.replacements	= new Array();

	for ( i = 0, i_len = this.MatchItem_Count(); i < i_len; i++ )
	{
		if ( ( item = this.MatchItem_AtIndex( i ) ) === null )
		{
			continue;
		}

		if ( !item.Selected() )
		{
			continue;
		}

		replacement				= new Object();
		replacement.start_index	= item.GetTemplateStartIndex();
		replacement.end_index	= item.GetTemplateEndIndex();

		template.replacements.push( replacement );
	}

	return template;
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.MatchItems = function()
{
	return this.itemlist_matches;
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.MatchItem_Count = function()
{
	return this.itemlist_matches.length;
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.MatchItem_Count_Selected = function()
{
	var i, i_len, item, selected_count;

	selected_count = 0;

	for ( i = 0, i_len = this.MatchItem_Count(); i < i_len; i++ )
	{
		if ( ( item = this.MatchItem_AtIndex( i ) ) === null )
		{
			continue;
		}

		if ( item.Selected() )
		{
			selected_count++;
		}
	}

	return selected_count;
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.MatchItem_IndexOf = function( item )
{
	return this.itemlist_matches.indexOf( item );
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.MatchItem_AtIndex = function( index )
{
	if ( index >= 0 && this.itemlist_matches.hasOwnProperty( index ) && this.itemlist_matches[ index ] instanceof TemplateSearchAndReplace_Interface_MatchItem )
	{
		return this.itemlist_matches[ index ];
	}

	return null;
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.MatchItem_Create = function( match )
{
	var self = this;
	var item;

	item			= new TemplateSearchAndReplace_Interface_MatchItem( match, this.can_modify );
	item.onSelect	= function() { self.Match_OnSelect( match ); };
	item.onDeselect	= function() { self.Match_OnDeselect( match ); };

	return item;
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.MatchItem_Append = function( match )
{
	return this.MatchItem_Insert( this.MatchItem_Create( match ), -1 );
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.MatchItem_Insert = function( item, index )
{
	var item_sibling;

	if ( ( item_sibling = this.MatchItem_AtIndex( index ) ) === null )
	{
		index = this.itemlist_matches.length;
	}

	item.SetParentNode_InsertBefore( this.element_match_container, item_sibling ? item_sibling.ContainedElement() : null );
	this.itemlist_matches.splice( index, 0, item );

	return item;
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.MatchItem_Remove = function( item )
{
	var index;

	if ( item.Selected() )
	{
		item.Deselect();
	}

	if ( this.element_match_container === item.ParentNode() )
	{
		this.element_match_container.removeChild( item.ContainedElement() );
	}

	if ( ( index = this.itemlist_matches.indexOf( item ) ) !== -1 )
	{
		this.itemlist_matches.splice( index, 1 );
	}
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.MatchItems_Empty = function()
{
	var item;

	while ( this.itemlist_matches.length )
	{
		item = this.itemlist_matches.pop();

		if ( item.Selected() )
		{
			item.Deselect();
		}

		if ( this.element_match_container === item.ParentNode() )
		{
			this.element_match_container.removeChild( item.ContainedElement() );
		}
	}
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.Match_OnSelect = function( match )
{
	this.Request_OnSelectionUpdated();
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.Match_OnDeselect = function( match )
{
	this.Request_OnSelectionUpdated();
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.Toggle_Collapse = function()
{
	if ( this.Collapsed() )	this.Expand();
	else					this.Collapse();
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.Collapse = function()
{
	var self = this;
	var height_title, animationlist, height_content;

	if ( this.collapsed )
	{
		return;
	}

	this.collapsed										= true;

	classNameAddIfMissing( this.element_container, 'collapsed' );

	this.element_container.style.overflow				= 'hidden';
	this.element_header.style.zIndex					= 2;
	this.element_match_container.style.zIndex			= 1;
	this.element_match_container.style.display			= 'block';
	this.element_match_container.style.position			= 'absolute';
	this.element_match_container.style.left				= 0;
	this.element_match_container.style.right			= 0;
	this.element_match_container.style.bottom			= 0;

	height_title										= this.element_header.offsetHeight;
	height_content										= this.element_match_container.offsetHeight;

	this.element_container.style.height					= height_title + 'px';

	animationlist										= new Array();
	animationlist.push( createAnimation(
	{
		delay: 0,
		duration: 200,
		delta: animationLinear,
		step: function( delta )
		{
			self.element_container.style.height			= ( height_title + ( height_content * ( 1 - delta ) ) ) + 'px';
		},
		oncomplete: function()
		{
			self.element_match_container.style.display	= 'none';

			// Reset overridden values

			self.element_container.style.overflow		= '';
			self.element_container.style.height			= '';
			self.element_header.style.zIndex			= '';
			self.element_match_container.style.zIndex	= '';
			self.element_match_container.style.position	= '';
			self.element_match_container.style.left		= '';
			self.element_match_container.style.right	= '';
			self.element_match_container.style.bottom	= '';
		}
	} ) );

	cancelAnimationFrame( window[ this.animation_id ] );
	beginAnimations( animationlist, this.animation_id );
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.Expand = function()
{
	var self = this;
	var height_title, animationlist, height_content;

	if ( !this.collapsed )
	{
		return;
	}

	this.collapsed = false;

	classNameRemoveIfPresent( this.element_container, 'collapsed' );

	this.element_container.style.overflow				= 'hidden';
	this.element_header.style.zIndex					= 2;
	this.element_match_container.style.zIndex			= 1;
	this.element_match_container.style.display			= 'block';
	this.element_match_container.style.position			= 'absolute';
	this.element_match_container.style.left				= 0;
	this.element_match_container.style.right			= 0;
	this.element_match_container.style.bottom			= 0;

	height_title										= this.element_header.offsetHeight;
	height_content										= this.element_match_container.offsetHeight;

	this.element_container.style.height					= height_title + 'px';

	animationlist										= new Array();
	animationlist.push( createAnimation(
	{
		delay: 0,
		duration: 200,
		delta: animationLinear,
		step: function( delta )
		{
			self.element_container.style.height			= ( height_title + ( height_content * delta ) ) + 'px';
		},
		oncomplete: function()
		{
			// Reset overridden values

			self.element_container.style.overflow		= '';
			self.element_container.style.height			= '';
			self.element_header.style.zIndex			= '';
			self.element_match_container.style.zIndex	= '';
			self.element_match_container.style.position	= '';
			self.element_match_container.style.left		= '';
			self.element_match_container.style.right	= '';
			self.element_match_container.style.bottom	= '';
		}
	} ) );

	cancelAnimationFrame( window[ this.animation_id ] );
	beginAnimations( animationlist, this.animation_id );
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.Collapsed = function()
{
	return this.collapsed;
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.Request_OnSelectionUpdated = function()
{
	if ( this.can_modify && !this.request_onselectionupdated )
	{
		this.request_onselectionupdated		= true;
		this.request_onselectionupdated_id	= window.requestAnimationFrame( this.render_onselectionupdated );
	}
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.Render_OnSelectionUpdated = function()
{
	var selected_count;

	this.request_onselectionupdated	= false;

	if ( !this.can_modify )
	{
		return;
	}

	selected_count = this.MatchItem_Count_Selected();

	if ( this.MatchItem_Count() > 0 && selected_count === this.MatchItem_Count() )	classNameReplaceIfAltered( this.element_container, 'partially_selected', 'selected' );
	else if ( selected_count > 0 )													classNameReplaceIfAltered( this.element_container, 'selected', 'partially_selected' );
	else																			classNameRemoveIfPresent( this.element_container, [ 'selected', 'partially_selected' ] );

	if ( this.element_label )
	{
		this.element_label.textContent = selected_count + ' Selected';
	}

	this.onSelectionUpdated();
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.Event_OnClick_Title = function( e )
{
	var rightclick;

	if ( 'which' in e )			rightclick = ( e.which == 3 ); 
	else if ( 'button' in e )	rightclick = ( e.button == 2 );
	else						rightclick = false;

	if ( rightclick )			return true;

	this.Toggle_Collapse();

	return true;
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.Event_OnClick_Selection = function( e )
{
	var rightclick;

	if ( 'which' in e )			rightclick = ( e.which == 3 ); 
	else if ( 'button' in e )	rightclick = ( e.button == 2 );
	else						rightclick = false;

	if ( rightclick )			return true;

	if ( this.MatchItem_Count() !== this.MatchItem_Count_Selected() )	this.Select();
	else																this.Deselect();

	return true;
}

TemplateSearchAndReplace_Interface_ResultItem.prototype.onSelectionUpdated = function() { ; }

// TemplateSearchAndReplace_Interface_MatchItem
////////////////////////////////////////////////////

function TemplateSearchAndReplace_Interface_MatchItem( match, can_modify )
{
	var self = this;

	this.match								= match;
	this.can_modify							= can_modify;
	this.itemlist_matches					= new Array();
	this.event_onclick_selection			= function( event ) { return self.Event_OnClick_Selection( event ? event : window.event ); };

	this.element_container					= newElement( 'span', { 'class': 'templatesearchandreplace_interface_match_item' },							null, null );

	if ( this.can_modify )
	{
		this.element_selection_container	= newElement( 'span', { 'class': 'templatesearchandreplace_interface_match_item_selection_container' },		null, this.element_container );
		this.element_selection_checkbox		= newElement( 'span', { 'class': 'templatesearchandreplace_interface_match_item_selection_checkbox' },		null, this.element_selection_container );
		this.element_selection_bg1			= newElement( 'span', { 'class': 'templatesearchandreplace_interface_match_item_selection_checkbox_bg1' },	null, this.element_selection_checkbox );
		this.element_selection_bg2			= newElement( 'span', { 'class': 'templatesearchandreplace_interface_match_item_selection_checkbox_bg2' },	null, this.element_selection_checkbox );

		AddEvent( this.element_selection_container,	'click', this.event_onclick_selection );
	}

	this.element_preview					= newElement( 'span', { 'class': 'templatesearchandreplace_interface_match_item_preview' },					null, this.element_container );
	this.element_preview_pre				= newElement( 'span', { 'class': 'templatesearchandreplace_interface_match_item_preview_pre' },				null, this.element_preview );
	this.element_preview_match				= newElement( 'span', { 'class': 'templatesearchandreplace_interface_match_item_preview_match' },			null, this.element_preview );
	this.element_preview_post				= newElement( 'span', { 'class': 'templatesearchandreplace_interface_match_item_preview_post' },			null, this.element_preview );

	this.element_preview_pre.textContent	= this.match.match.substring( 0, this.match.local_start_index );
	this.element_preview_match.textContent	= this.match.match.substring( this.match.local_start_index, this.match.local_end_index );
	this.element_preview_post.textContent	= this.match.match.substring( this.match.local_end_index );
}

TemplateSearchAndReplace_Interface_MatchItem.prototype.ContainedElement = function()
{
	return this.element_container;
}

TemplateSearchAndReplace_Interface_MatchItem.prototype.SetParentNode_InsertBefore = function( parent_node, existing_node )
{
	parent_node.insertBefore( this.ContainedElement(), existing_node );
}

TemplateSearchAndReplace_Interface_MatchItem.prototype.ParentNode = function()
{
	return this.ContainedElement().parentNode;
}

TemplateSearchAndReplace_Interface_MatchItem.prototype.GetTemplateStartIndex = function()
{
	return this.match.template_start_index;
}

TemplateSearchAndReplace_Interface_MatchItem.prototype.GetTemplateEndIndex = function()
{
	return this.match.template_end_index;
}

TemplateSearchAndReplace_Interface_MatchItem.prototype.Toggle_Selection = function()
{
	if ( !this.can_modify )
	{
		return;
	}

	if ( this.selected )	this.Deselect();
	else					this.Select();
}

TemplateSearchAndReplace_Interface_MatchItem.prototype.Select = function()
{
	if ( !this.can_modify )
	{
		return;
	}

	this.selected = true;

	classNameAddIfMissing( this.element_container, 'selected' );
	this.onSelect();
}

TemplateSearchAndReplace_Interface_MatchItem.prototype.Deselect = function()
{
	if ( !this.can_modify )
	{
		return;
	}

	this.selected = false;

	classNameRemoveIfPresent( this.element_container, 'selected' );
	this.onDeselect();
}

TemplateSearchAndReplace_Interface_MatchItem.prototype.Selected = function()
{
	return this.selected;
}

TemplateSearchAndReplace_Interface_MatchItem.prototype.Event_OnClick_Selection = function( e )
{
	var rightclick;

	if ( 'which' in e )			rightclick = ( e.which == 3 ); 
	else if ( 'button' in e )	rightclick = ( e.button == 2 );
	else						rightclick = false;

	if ( rightclick )			return true;

	this.Toggle_Selection();

	return true;
}

TemplateSearchAndReplace_Interface_MatchItem.prototype.onSelect		= function() { ; }
TemplateSearchAndReplace_Interface_MatchItem.prototype.onDeselect	= function() { ; }