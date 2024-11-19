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
})( window, 'load', function() { AttributeMachine_Initialize(); } );

function AttributeMachine_Initialize()
{
	FireEvent( window, 'attributemachine_override' );
	FireEvent( window, 'attributemachine_initialize' );
}

function AttributeMachine( product_code, dependency_resolution, inventory_element_id, inv_long, price_element_id, swatch_element_id, invalid_msg, missing_text_msg, missing_radio_msg )
{
	this.purchase_disabled					= false;

	this.inv_div							= null;
	this.price_div							= null;
	this.additional_price_div				= null;
	this.weight_div							= null;
	this.discount_div						= null;
	this.swatches							= null;
	this.master_attributes					= null;
	this.attributes							= null;
	this.have_inventory_attributes			= false;
	this.purchase_buttons					= null;
	this.buttons							= new Array();
	this.possible_req						= null;

	this.form								= null;
	this.form_action						= null;
	this.element_product_code 				= null;
	this.element_product_quantity			= null;
	this.elementlist_product_attributes		= new Array();
	this.elementlist_product_subscription	= new Array();

	/*
	 * Provide backwards compatibility with old parameters
	 */

	if ( typeof product_code === 'object' )
	{
		this.settings						= product_code;

		if ( typeof this.settings.getElementById === 'function' )		this.getElementById			= this.settings.getElementById;
		if ( typeof this.settings.getElementsByTagName === 'function' )	this.getElementsByTagName	= this.settings.getElementsByTagName;
	}
	else
	{
		this.settings						= new Object();
		this.settings.product_code			= product_code;
		this.settings.dependency_resolution	= dependency_resolution;
		this.settings.inventory_element_id	= inventory_element_id;
		this.settings.inv_long				= inv_long;
		this.settings.price_element_id		= price_element_id;
		this.settings.swatch_element_id		= swatch_element_id;
		this.settings.invalid_msg			= invalid_msg ? invalid_msg : '';
		this.settings.missing_text_msg		= missing_text_msg ? missing_text_msg : '';
		this.settings.missing_radio_msg		= missing_radio_msg ? missing_radio_msg : '';
	}

	if ( this.settings.inventory_element_id )			this.inv_div				= this.getElementById( this.settings.inventory_element_id );
	if ( this.settings.price_element_id )				this.price_div				= this.getElementById( this.settings.price_element_id );
	if ( this.settings.additional_price_element_id )	this.additional_price_div	= this.getElementById( this.settings.additional_price_element_id );
	if ( this.settings.weight_element_id )				this.weight_div				= this.getElementById( this.settings.weight_element_id );
	if ( this.settings.discount_element_id )			this.discount_div			= this.getElementById( this.settings.discount_element_id );
	if ( this.settings.swatch_element_id )				this.swatches				= this.getElementById( this.settings.swatch_element_id );

	if ( this.price_div )								this.initial_price_value			= this.price_div.innerHTML;
	if ( this.additional_price_div )					this.initial_additional_price_value	= this.additional_price_div.innerHTML;
	if ( this.weight_div )								this.initial_weight_value			= this.weight_div.innerHTML;
	if ( this.discount_div )							this.initial_discount_value			= this.discount_div.innerHTML;
}

AttributeMachine.prototype.Initialize = function( attributes, possible )
{
	var self = this;

	if ( attributes )	return this.AttributeAndOptionList_Load_Callback( attributes, possible );
	else				Runtime_AttributeAndOptionList_Load_Product( this.settings.product_code, function( response ) { self.AttributeAndOptionList_Load_Callback( response, possible ); } );
}

AttributeMachine.prototype.Find_Purchase_Buttons = function()
{
	var i, i_len, type, node_name;

	if ( !this.form )
	{
		return;
	}

	for ( i = 0, i_len = this.form.elements.length; i < i_len; i++ )
	{
		node_name = this.form.elements[ i ].nodeName.toLowerCase();

		if ( this.form.elements[ i ].hasAttribute( 'type' ) &&
			 typeof this.form.elements[ i ].type === 'string' )		type = this.form.elements[ i ].type.toLowerCase();
		else if ( node_name === 'button' )							type = 'submit';	// Default type for HTMLButtonElement
		else if ( node_name === 'input' )							type = 'text';		// Default type for HTMLInputElement
		else														type = null;

		if ( type === 'button' || type === 'submit' )
		{
			//
			// Button, input, or custom element that wants to be treated as a button
			//

			this.buttons.push( this.form.elements[ i ] );
		}
	}
}

AttributeMachine.prototype.Disable_Purchase_Buttons = function()
{
	var i, i_len;

	if ( this.form_action === 'ATWL' || this.form_action == 'AFWL' )
	{
		return;
	}
	else if ( this.form_action === 'ADPM' )
	{
		if ( this.Purchase_FormElement_CanEnableDisable( this.element_product_quantity ) )
		{
			this.element_product_quantity.disabled = true;
		}
	}
	else if ( this.form_action === 'AUPM' )
	{
		for ( i = 0, i_len = this.buttons.length; i < i_len; i++ )
		{
			if ( this.Purchase_FormElement_CanEnableDisable( this.buttons[ i ] ) )
			{
				this.Purchase_FormElement_IncrementInvalidCount( this.buttons[ i ] );
				this.buttons[ i ].disabled = true;
			}
		}
	}
	else
	{
		for ( i = 0, i_len = this.buttons.length; i < i_len; i++ )
		{
			if ( this.Purchase_FormElement_CanEnableDisable( this.buttons[ i ] ) )
			{
				this.buttons[ i ].disabled = true;
			}
		}
	}

	this.purchase_disabled	= true;
}

AttributeMachine.prototype.Enable_Purchase_Buttons = function()
{
	var i, i_len;

	if ( this.form_action === 'ATWL' || this.form_action == 'AFWL' )
	{
		return;
	}
	else if ( this.form_action === 'ADPM' )
	{
		if ( this.Purchase_FormElement_CanEnableDisable( this.element_product_quantity ) )
		{
			this.element_product_quantity.disabled = false;
		}
	}
	else if ( this.form_action === 'AUPM' )
	{
		for ( i = 0, i_len = this.buttons.length; i < i_len; i++ )
		{
			if ( this.Purchase_FormElement_CanEnableDisable( this.buttons[ i ] ) &&
				 this.Purchase_FormElement_DecrementInvalidCount( this.buttons[ i ] ) == 0 )
			{
				this.buttons[ i ].disabled = false;
			}
		}
	}
	else
	{
		for ( i = 0, i_len = this.buttons.length; i < i_len; i++ )
		{
			if ( this.Purchase_FormElement_CanEnableDisable( this.buttons[ i ] ) )
			{
				this.buttons[ i ].disabled = false;
			}
		}
	}

	this.purchase_disabled = false;
}

AttributeMachine.prototype.Purchase_Button_CanEnableDisable = function( button )
{
	return this.Purchase_FormElement_CanEnableDisable( button );
}

AttributeMachine.prototype.Purchase_FormElement_CanEnableDisable = function( element )
{
	if ( element )
	{
		while ( ( element = element.parentNode ) != null )
		{
			if ( ( typeof element.getAttribute === 'function' ) &&
				 ( element.getAttribute( 'data-mmnodisable' ) !== null ) )
			{
				return false;
			}
		}

		return true;
	}

	return false;
}

AttributeMachine.prototype.Purchase_FormElement_IncrementInvalidCount = function( element )
{
	var invalid_count;

	invalid_count = parseInt( element.getAttribute( 'data-mminvalidcount' ) ) || 0;

	if ( !this.purchase_disabled )
	{
		invalid_count++;
	}

	element.setAttribute( 'data-mminvalidcount', invalid_count );
	return invalid_count;
}

AttributeMachine.prototype.Purchase_FormElement_DecrementInvalidCount = function( element )
{
	var invalid_count;

	invalid_count = parseInt( element.getAttribute( 'data-mminvalidcount' ) ) || 0;

	if ( this.purchase_disabled && invalid_count > 0 )
	{
		invalid_count--;
	}

	element.setAttribute( 'data-mminvalidcount', invalid_count );
	return invalid_count;
}

AttributeMachine.prototype.Gather_Form_ProductAttributeElements = function( attribute, template_attribute )
{
	var i, i_len, index, match, regex, elements;

	elements = new Array();

	if ( ( index = this.Lookup_Attribute_Form_Index( this.form, attribute.code, template_attribute ? template_attribute.code : null ) ) !== null )
	{
		if ( this.form_action === 'ADPM' )
		{
			regex = new RegExp( '^products\\[\\s{0,}(\\d{1,})\\s{0,}\\]:attributes\\[\\s{0,}' + index + '\\s{0,}\\]:value$', 'i' );

			for ( i = 0, i_len = this.elementlist_product_attributes.length; i < i_len; i++ )
			{
				if ( !this.elementlist_product_attributes[ i ].hasAttribute( 'name' ) )						continue;
				if ( ( match = this.elementlist_product_attributes[ i ].name.match( regex ) ) === null )	continue;

				elements.push( this.elementlist_product_attributes[ i ] );
			}
		}
		else if ( this.form_action === 'AUPM' )
		{
			regex = new RegExp( '^product\\[\\s{0,}(\\d{1,})\\s{0,}\\]:attributes\\[\\s{0,}' + index + '\\s{0,}\\]:value$', 'i' );

			for ( i = 0, i_len = this.elementlist_product_attributes.length; i < i_len; i++ )
			{
				if ( !this.elementlist_product_attributes[ i ].hasAttribute( 'name' ) )						continue;
				if ( ( match = this.elementlist_product_attributes[ i ].name.match( regex ) ) === null )	continue;

				elements.push( this.elementlist_product_attributes[ i ] );
			}
		}
		else
		{
			regex = new RegExp( '^product_attributes\\[\\s{0,}' + index + '\\s{0,}\\]:value$', 'i' );

			for ( i = 0, i_len = this.elementlist_product_attributes.length; i < i_len; i++ )
			{
				if ( !this.elementlist_product_attributes[ i ].hasAttribute( 'name' ) )						continue;
				if ( ( match = this.elementlist_product_attributes[ i ].name.match( regex ) ) === null )	continue;

				elements.push( this.elementlist_product_attributes[ i ] );
			}
		}
	}

	return elements;
}

AttributeMachine.prototype.AttributeAndOptionList_Load_Callback = function( response, possible )
{
	var self = this;
	var i, j, i_len, j_len, data, input, attribute, selection, last_attr_id, last_option_id, last_attmpat_id, template_attribute;

	if ( !response.success )
	{
		this.onerror( response.error_message );
	}

	this.master_attributes			= response.data;
	this.attributes					= new Array();
	this.have_inventory_attributes	= false;

	if ( !this.Lookup_Attribute_Form() )
	{
		return;
	}

	this.Find_Purchase_Buttons();

	if ( this.settings.displaydiscounts )
	{
		this.subscription_term			= new AttributeMachine_SubscriptionTerm( this, this.form, this.elementlist_product_subscription.slice() );
		this.subscription_term.onchange	= function( event ) { self.ProductSubscriptionTerm_Changed(); };
	}

	for ( i = 0, i_len = this.master_attributes.length; i < i_len; i++ )
	{
		attribute = this.master_attributes[ i ];

		if ( attribute.type != 'template' )
		{
			if ( attribute.inventory )
			{
				this.have_inventory_attributes		= true;
			}

			if ( attribute.type == 'checkbox' )				input = new AttributeMachine_Checkbox( this, attribute, null );
			else if ( attribute.type == 'text' )			input = new AttributeMachine_Text( this, attribute, null );
			else if ( attribute.type == 'memo' )			input = new AttributeMachine_Memo( this, attribute, null );
			else if ( attribute.type == 'radio' )			input = new AttributeMachine_Radio( this, attribute, null );
			else if ( attribute.type == 'select' )			input = new AttributeMachine_Select( this, attribute, null );
			else if ( attribute.type == 'swatch-select' )	input = new AttributeMachine_Select( this, attribute, null );
			else											continue;

			if ( !input.Initialize( this.form, this.Gather_Form_ProductAttributeElements( attribute, null ) ) )
			{
				this.onerror( 'Unable to locate form element(s) for attribute ' + attribute.code );
				continue;
			}

			this.attributes.push( input );
		}
		else
		{
			for ( j = 0, j_len = attribute.attributes.length; j < j_len; j++ )
			{
				template_attribute = attribute.attributes[ j ];

				if ( template_attribute.inventory )
				{
					this.have_inventory_attributes	= true;
				}

				if ( template_attribute.type == 'checkbox' )			input = new AttributeMachine_Checkbox( this, attribute, template_attribute );
				else if ( template_attribute.type == 'text' )			input = new AttributeMachine_Text( this, attribute, template_attribute );
				else if ( template_attribute.type == 'memo' )			input = new AttributeMachine_Memo( this, attribute, template_attribute );
				else if ( template_attribute.type == 'radio' )			input = new AttributeMachine_Radio( this, attribute, template_attribute );
				else if ( template_attribute.type == 'select' )			input = new AttributeMachine_Select( this, attribute, template_attribute );
				else if ( template_attribute.type == 'swatch-select' )	input = new AttributeMachine_Select( this, attribute, template_attribute );
				else													continue;

				if ( !input.Initialize( this.form, this.Gather_Form_ProductAttributeElements( attribute, template_attribute ) ) )
				{
					this.onerror( 'Unable to locate form element(s) for template attribute ' + attribute.code + ':' + template_attribute.code );
					continue;
				}

				this.attributes.push( input );
			}
		}
	}

	if ( this.attributes.length == 0 )
	{
		this.oninitializeswatches( this.master_attributes, null );
		return;
	}

	selection			= this.Build_Selection();

	if ( !selection.Has_Selected() )
	{
		last_attr_id	= 0;
		last_attmpat_id	= 0;
		last_option_id	= 0;
	}
	else
	{
		last_attr_id	= selection.selected_attr_ids[ 0 ];
		last_attmpat_id	= selection.selected_attmpat_ids[ 0 ];
		last_option_id	= selection.selected_option_ids[ 0 ];
	}

	if ( possible )
	{
		this.AttributeList_Load_Possible_Callback( possible );
	}
	else
	{
		data							= new Object();
		data.product_code				= this.settings.product_code;
		data.dependency_resolution		= this.settings.dependency_resolution;
		data.predictdiscounts			= this.settings.displaydiscounts;
		data.calculate_sale_price		= this.settings.price === 'sale' ? true : false;
		data.last_selected_attr_id		= last_attr_id;
		data.last_selected_attmpat_id	= last_attmpat_id;
		data.last_selected_option_id	= last_option_id;
		data.selected_term_id			= selection.selected_term_id;
		data.selected_attr_ids			= selection.selected_attr_ids;
		data.selected_attmpat_ids		= selection.selected_attmpat_ids;
		data.selected_option_ids		= selection.selected_option_ids;
		data.selected_attr_types		= selection.selected_attr_types;
		data.unselected_attr_ids		= selection.unselected_attr_ids;
		data.unselected_attmpat_ids		= selection.unselected_attmpat_ids;

		this.possible_req				= v96_Runtime_AttributeList_Load_ProductVariant_Possible_PredictDiscounts( data, function( possible_response ) { self.AttributeList_Load_Possible_Callback( possible_response ); } );
	}
}

AttributeMachine.prototype.ProductSubscriptionTerm_Changed = function()
{
	var self = this;
	var data, selection;

	selection						= this.Build_Selection();

	data							= new Object();
	data.product_code				= this.settings.product_code;
	data.dependency_resolution		= this.settings.dependency_resolution;
	data.predictdiscounts			= this.settings.displaydiscounts;
	data.calculate_sale_price		= this.settings.price === 'sale' ? true : false;
	data.last_selected_attr_id		= 0;
	data.last_selected_attmpat_id	= 0;
	data.last_selected_option_id	= 0;
	data.selected_term_id			= selection.selected_term_id;
	data.selected_attr_ids			= selection.selected_attr_ids;
	data.selected_attmpat_ids		= selection.selected_attmpat_ids;
	data.selected_option_ids		= selection.selected_option_ids;
	data.selected_attr_types		= selection.selected_attr_types;
	data.unselected_attr_ids		= selection.unselected_attr_ids;
	data.unselected_attmpat_ids		= selection.unselected_attmpat_ids;

	this.possible_req				= v96_Runtime_AttributeList_Load_ProductVariant_Possible_PredictDiscounts( data, function( possible_response ) { self.AttributeList_Load_Possible_Callback( possible_response ); } );
}

AttributeMachine.prototype.AttributeList_Load_Possible_Callback = function( response )
{
	var i, i_len, variant, message, attribute, cull_failures, possible_lookup, template_attribute, possible_sublookup;

	cull_failures		= new Array();
	this.possible_req	= null;

	if ( !response.success )
	{
		this.onerror( response.error_message );
	}

	this.oninitializeswatches( this.master_attributes, response );

	possible_lookup	= ( response.data ) ? this.Build_Possible_Lookup( response.data.attributes ) : null;

	// Iterate through the attributes we've created and disable any that are not possible
	for ( i = 0, i_len = this.attributes.length; i < i_len; i++ )
	{
		attribute				= this.attributes[ i ].attribute;
		template_attribute		= this.attributes[ i ].template_attribute;

		if ( !attribute.inventory && ( !template_attribute || !template_attribute.inventory ) )
		{
			continue;
		}

		possible_sublookup		= ( possible_lookup ) ? possible_lookup[ attribute.id ] : null;

		if ( possible_sublookup )
		{
			if ( template_attribute )	possible_sublookup = possible_sublookup[ template_attribute.id ];
			else						possible_sublookup = possible_sublookup[ 0 ];
		}

		if ( possible_sublookup == null )	this.attributes[ i ].Disable();
		else
		{
			if ( !this.attributes[ i ].Cull( possible_sublookup.options, possible_sublookup.selected_id, message ) )
			{
				cull_failures.push( template_attribute ? template_attribute : attribute );
			}
		}
	}

	variant = ( response.data ) ? response.data.variant : null;

	if ( response.data && response.data.have_price )
	{
		this.Pricing_Update( response.data );
		this.Weight_Update( response.data );
	}
	else
	{
		this.Pricing_Reset();
		this.Weight_Reset();
	}

	if ( !this.have_inventory_attributes )
	{
		return;
	}

	// Handle the purchase buttons and inventory message
	if ( !variant || cull_failures.length )
	{
		this.Disable_Purchase_Buttons();

		if ( this.inv_div )
		{
			this.inv_div.innerHTML = this.settings.invalid_msg;

			for ( i = 0, i_len = cull_failures.length; i < i_len; i++ )
			{
				if ( cull_failures[ i ].type == 'radio' )													message = this.settings.missing_radio_msg;
				else if ( ( cull_failures[ i ].type == 'text' ) || ( cull_failures[ i ].type == 'memo' ) )	message = this.settings.missing_text_msg;
				else																						message = '';

				message	= message.replace( '%attribute_code%',		cull_failures[ i ].code	);
				message	= message.replace( '%attribute_prompt%',	cull_failures[ i ].prompt );

				this.inv_div.innerHTML	+= message;
			}
		}
	}
	else
	{
		if ( variant.inv_active &&
			 variant.inv_level == 'out' )	this.Disable_Purchase_Buttons();
		else								this.Enable_Purchase_Buttons();

		if ( this.inv_div )					this.inv_div.innerHTML = this.settings.inv_long ? variant.inv_long : variant.inv_short;

		const product_data =
		{
			product_code:	this.settings.product_code,
			variant_id:		variant.variant_id
		};

		this.onVariantChanged( product_data );

		if ( typeof MivaEvents !== 'undefined' )
		{ 
			MivaEvents.ThrowEvent( 'variant_changed', product_data );
		}
	}
}

AttributeMachine.prototype.Pricing_Update = function( data )
{
	var i, i_len, price, additional_price, formatted_price, formatted_additional_price;

	if ( this.settings.price === 'retail' )
	{
		price			= data.retail;
		formatted_price	= data.formatted_retail;
	}
	else if ( this.settings.price === 'base' )
	{
		price			= data.base_price;
		formatted_price	= data.formatted_base_price;
	}
	else
	{
		price			= data.price;
		formatted_price	= data.formatted_price;
	}

	if ( ( this.settings.additionalprice === 'retail' ) && ( price < data.retail ) )
	{
		additional_price			= data.retail;
		formatted_additional_price	= data.formatted_retail;
	}
	else if ( ( this.settings.additionalprice === 'base' ) && ( price < data.base_price ) )
	{
		additional_price			= data.base_price;
		formatted_additional_price	= data.formatted_base_price;
	}
	else
	{
		additional_price			= null;
		formatted_additional_price	= '';
	}

	if ( this.price_div )				this.price_div.innerHTML			= formatted_price;
	if ( this.additional_price_div )	this.additional_price_div.innerHTML	= formatted_additional_price;

	if ( this.discount_div && this.settings.displaydiscounts )
	{
		this.discount_div.innerHTML	= '';

		for ( i = 0, i_len = data.discounts.length; i < i_len; i++ )
		{
			this.discount_div.appendChild( this.Generate_Discount( data.discounts[ i ] ) );
		}
	}

	const product_data =
	{
		product_code:		this.settings.product_code,
		price:				price,
		additional_price:	additional_price
	};

	this.onPriceChanged( product_data );

	if ( typeof MivaEvents !== 'undefined' )
	{ 
		MivaEvents.ThrowEvent( 'price_changed', product_data );
	}
}

AttributeMachine.prototype.Pricing_Reset = function()
{
	if ( this.price_div )				this.price_div.innerHTML			= this.initial_price_value;
	if ( this.additional_price_div )	this.additional_price_div.innerHTML	= this.initial_additional_price_value;

	if ( this.discount_div && this.settings.displaydiscounts )
	{
		this.discount_div.innerHTML = this.initial_discount_value;
	}
}

AttributeMachine.prototype.Weight_Update = function( data )
{
	if ( this.weight_div )
	{
		this.weight_div.textContent = this.weight_div.hasAttribute( 'data-mm-formatted' ) ? data.formatted_weight : data.padded_weight;
	}
}

AttributeMachine.prototype.Weight_Reset = function()
{
	if ( this.weight_div )
	{
		this.weight_div.innerHTML = this.initial_weight_value;
	}
}

AttributeMachine.prototype.Attribute_Changed = function( attribute )
{
	var self = this;
	var data, selection;

	if ( this.possible_req )
	{
		this.possible_req.onreadystatechange = function() {};
		this.possible_req.abort();
	}

	selection						= this.Build_Selection();

	data							= new Object();
	data.product_code				= this.settings.product_code;
	data.dependency_resolution		= this.settings.dependency_resolution;
	data.predictdiscounts			= this.settings.displaydiscounts;
	data.calculate_sale_price		= this.settings.price === 'sale' ? true : false;
	data.last_selected_attr_id		= attribute.attribute.id;
	data.last_selected_attmpat_id	= attribute.template_attribute ? attribute.template_attribute.id : 0;
	data.last_selected_option_id	= attribute.Selected_Option_ID();
	data.selected_term_id			= selection.selected_term_id;
	data.selected_attr_ids			= selection.selected_attr_ids;
	data.selected_attmpat_ids		= selection.selected_attmpat_ids;
	data.selected_option_ids		= selection.selected_option_ids;
	data.selected_attr_types		= selection.selected_attr_types;
	data.unselected_attr_ids		= selection.unselected_attr_ids;
	data.unselected_attmpat_ids		= selection.unselected_attmpat_ids;

	this.possible_req				= v96_Runtime_AttributeList_Load_ProductVariant_Possible_PredictDiscounts( data, function( possible_response ) { self.AttributeList_Load_Possible_Callback( possible_response ); } );
}

AttributeMachine.prototype.Build_Selection = function()
{
	var i, type, i_len, attr_id, selection, option_id, attmpat_id;

	selection = new AttributeMachine_Selection();

	if ( this.subscription_term )
	{
		selection.selected_term_id = this.subscription_term.GetValue();
	}

	for ( i = 0, i_len = this.attributes.length; i < i_len; i++ )
	{
		attr_id		= this.attributes[ i ].attribute.id;
		attmpat_id	= this.attributes[ i ].template_attribute == null ? 0 : this.attributes[ i ].template_attribute.id;
		option_id	= this.attributes[ i ].Selected_Option_ID();

		if ( option_id === null )
		{
			selection.unselected_attr_ids.push( attr_id );
			selection.unselected_attmpat_ids.push( attmpat_id );
		}
		else
		{
			type = this.attributes[ i ].template_attribute == null ? this.attributes[ i ].attribute.type : this.attributes[ i ].template_attribute.type;

			selection.selected_attr_ids.push( attr_id );
			selection.selected_attmpat_ids.push( attmpat_id );
			selection.selected_option_ids.push( option_id );
			selection.selected_attr_types.push( type );
		}
	}

	return selection;
}

AttributeMachine.prototype.Build_Possible_Lookup = function( data )
{
	var i, j, i_len, j_len, lookup, attr_id, option_id, attmpat_id;

	lookup = new Array();

	for ( i = 0, i_len = data.length; i < i_len; i++ )
	{
		attr_id		= data[ i ].id;
		attmpat_id	= data[ i ].attmpat_id;

		if ( lookup[ attr_id ] == null )
		{
			lookup[ attr_id ] = new Array();
		}

		if ( lookup[ attr_id ][ attmpat_id ] == null )
		{
			lookup[ attr_id ][ attmpat_id ]			= new Object;
			lookup[ attr_id ][ attmpat_id ].options	= new Array();
		}

		lookup[ attr_id ][ attmpat_id ].selected_id	= data[ i ].selected_id;

		for ( j = 0, j_len = data[ i ].options.length; j < j_len; j++ )
		{
			option_id												= data[ i ].options[ j ];
			lookup[ attr_id ][ attmpat_id ].options[ option_id ]	= 1;
		}
	}

	return lookup;
}

AttributeMachine.prototype.Lookup_Form_Data = function()
{
	var i, j, data, forms, i_len, j_len, action, action_value;

	forms = this.getElementsByTagName( 'form' );

	for ( i = 0, i_len = forms.length; i < i_len; i++ )
	{
		for ( j = 0, j_len = forms[ i ].elements.length; j < j_len; j++ )
		{
			if ( !forms[ i ].elements[ j ].hasAttribute( 'name' ) )
			{
				continue;
			}
			else if ( forms[ i ].elements[ j ].name.toLowerCase() === 'action' )
			{
				action = forms[ i ].elements[ j ];
				break;
			}
		}

		if ( !action )
		{
			continue;
		}

		action_value = action.value.toUpperCase();

		if ( action_value !== 'ADPR' &&
			 action_value !== 'ADPM' &&
			 action_value !== 'AUPR' &&
			 action_value !== 'AUPM' &&
			 action_value !== 'AFWL' )
		{
			continue;
		}

		if ( action_value === 'ADPM' || action_value === 'AUPM' )
		{
			if ( ( data = this.Lookup_Form_Data_LowLevel_MultiAddForm( forms[ i ], action_value ) ) !== null )
			{
				return data;
			}
		}
		else
		{
			if ( ( data = this.Lookup_Form_Data_LowLevel_SingleAddForm( forms[ i ], action_value ) ) !== null )
			{
				return data;
			}
		}
	}

	return null;
}

AttributeMachine.prototype.Lookup_Form_Data_LowLevel_MultiAddForm = function( form, action_value )
{
	var i, data, i_len, name, product_id, match_code, match_quantity, match_attributes, regex_product_code, match_subscription, regex_product_quantity;
	var elementmap_product_code, regex_product_attributes, regex_product_subscription, elementmap_product_quantity, elementmap_product_attributes, elementmap_product_subscription;

	product_id							= -1;
	elementmap_product_code				= new Object();
	elementmap_product_quantity			= new Object();
	elementmap_product_attributes		= new Object();
	elementmap_product_subscription		= new Object();

	if ( action_value === 'AUPM' )
	{
		regex_product_code				= new RegExp( '^product\\[\\s{0,}(\\d{1,})\\s{0,}\\]:code', 'i' );
		regex_product_quantity			= null;
		regex_product_attributes		= new RegExp( '^product\\[\\s{0,}(\\d{1,})\\s{0,}\\]:attributes\\[', 'i' );
		regex_product_subscription		= new RegExp( '^product\\[\\s{0,}(\\d{1,})\\s{0,}\\]:subterm_id', 'i' );
	}
	else
	{
		regex_product_code				= new RegExp( '^products\\[\\s{0,}(\\d{1,})\\s{0,}\\]:code', 'i' );
		regex_product_quantity			= new RegExp( '^products\\[\\s{0,}(\\d{1,})\\s{0,}\\]:quantity', 'i' );
		regex_product_attributes		= new RegExp( '^products\\[\\s{0,}(\\d{1,})\\s{0,}\\]:attributes\\[', 'i' );
		regex_product_subscription		= new RegExp( '^products\\[\\s{0,}(\\d{1,})\\s{0,}\\]:subterm_id', 'i' );
	}

	for ( i = 0, i_len = form.elements.length; i < i_len; i++ )
	{
		if ( !form.elements[ i ].hasAttribute( 'name' ) )
		{
			continue;
		}

		name = form.elements[ i ].name.toLowerCase();

		if ( ( ( match_code = name.match( regex_product_code ) ) !== null ) && ( typeof match_code[ 1 ] === 'string' ) && ( match_code[ 1 ].length ) )
		{
			if ( form.elements[ i ].value.toLowerCase() === this.settings.product_code.toLowerCase() )
			{
				product_id = match_code[ 1 ];
			}

			elementmap_product_code[ match_code[ 1 ] ] = form.elements[ i ];
		}
		else if ( regex_product_quantity && ( ( match_quantity = name.match( regex_product_quantity ) ) !== null ) && ( typeof match_quantity[ 1 ] === 'string' ) && ( match_quantity[ 1 ].length ) )
		{
			elementmap_product_quantity[ match_quantity[ 1 ] ] = form.elements[ i ];
		}
		else if ( ( ( match_attributes = name.match( regex_product_attributes ) ) !== null ) && ( typeof match_attributes[ 1 ] === 'string' ) && ( match_attributes[ 1 ].length ) )
		{
			if ( !Array.isArray( elementmap_product_attributes[ match_attributes[ 1 ] ] ) )
			{
				elementmap_product_attributes[ match_attributes[ 1 ] ] = new Array();
			}

			elementmap_product_attributes[ match_attributes[ 1 ] ].push( form.elements[ i ] );
		}
		else if ( ( ( match_subscription = name.match( regex_product_subscription ) ) !== null ) && ( typeof match_subscription[ 1 ] === 'string' ) && ( match_subscription[ 1 ].length ) )
		{
			if ( !Array.isArray( elementmap_product_subscription[ match_subscription[ 1 ] ] ) )
			{
				elementmap_product_subscription[ match_subscription[ 1 ] ] = new Array();
			}

			elementmap_product_subscription[ match_subscription[ 1 ] ].push( form.elements[ i ] );
		}
	}

	if ( product_id === -1 )																												return null;
	if ( !elementmap_product_code.hasOwnProperty( product_id ) )																			return null;
	if ( action_value === 'ADPM' && !elementmap_product_quantity.hasOwnProperty( product_id ) )												return null;
	if ( ( !elementmap_product_attributes.hasOwnProperty( product_id ) || elementmap_product_attributes[ product_id ].length === 0 ) &&
		 ( !elementmap_product_subscription.hasOwnProperty( product_id ) || elementmap_product_subscription[ product_id ].length === 0 ) )	return null;

	data									= new Object();
	data.form								= form;
	data.form_action						= action_value;
	data.element_product_code				= elementmap_product_code[ product_id ];
	data.element_product_quantity			= elementmap_product_quantity.hasOwnProperty( product_id ) ? elementmap_product_quantity[ product_id ] : null;
	data.elementlist_product_attributes		= elementmap_product_attributes[ product_id ];
	data.elementlist_product_subscription	= elementmap_product_subscription.hasOwnProperty( product_id ) ? elementmap_product_subscription[ product_id ] : [];

	return data;
}

AttributeMachine.prototype.Lookup_Form_Data_LowLevel_SingleAddForm = function( form, action_value )
{
	var i, name, data, i_len, element_product_code, element_product_quantity, elementlist_product_attributes, elementlist_product_subscription;

	element_product_code				= null;
	element_product_quantity			= null;
	elementlist_product_attributes		= new Array();
	elementlist_product_subscription	= new Array();

	for ( i = 0, i_len = form.elements.length; i < i_len; i++ )
	{
		if ( !form.elements[ i ].hasAttribute( 'name' ) )
		{
			continue;
		}

		name = form.elements[ i ].name.toLowerCase();

		if ( name === 'product_code' )							element_product_code		= form.elements[ i ];
		else if ( name === 'quantity' )							element_product_quantity	= form.elements[ i ];
		else if ( name === 'product_subscription_term_id' )		elementlist_product_subscription.push( form.elements[ i ] );
		else if ( name.indexOf( 'product_attributes[' ) === 0 )	elementlist_product_attributes.push( form.elements[ i ] );
	}

	if ( !element_product_code )																		return null;
	if ( action_value === 'ADPM' && !element_product_quantity )											return null;
	if ( element_product_code.value.toLowerCase() != this.settings.product_code.toLowerCase() )			return null;
	if ( elementlist_product_attributes.length === 0 && elementlist_product_subscription.length === 0 )	return null;

	data									= new Object();
	data.form								= form;
	data.form_action						= action_value;
	data.element_product_code				= element_product_code;
	data.element_product_quantity			= element_product_quantity;
	data.elementlist_product_attributes		= elementlist_product_attributes;
	data.elementlist_product_subscription	= elementlist_product_subscription;

	return data;
}

AttributeMachine.prototype.Lookup_Attribute_Form = function()
{
	var i, j, forms, i_len, j_len, action, form_data, ignore_error;

	if ( ( form_data = this.Lookup_Form_Data() ) !== null )
	{
		this.form								= form_data.form;
		this.form_action						= form_data.form_action;
		this.element_product_code				= form_data.element_product_code;
		this.element_product_quantity			= form_data.element_product_quantity;
		this.elementlist_product_attributes		= form_data.elementlist_product_attributes;
		this.elementlist_product_subscription	= form_data.elementlist_product_subscription;

		return form_data.form;
	}

	//
	// Iterate over each of the forms on screen. If the ATWL
	// form exists, then we ignore the error alert
	//

	forms = this.getElementsByTagName( 'form' );

	for ( i = 0, i_len = forms.length; i < i_len; i++ )
	{
		for ( j = 0, j_len = forms[ i ].elements.length; j < j_len; j++ )
		{
			if ( !forms[ i ].elements[ j ].hasAttribute( 'name' ) )
			{
				continue;
			}
			else if ( forms[ i ].elements[ j ].name.toLowerCase() === 'action' )
			{
				action = forms[ i ].elements[ j ];
				break;
			}
		}

		if ( !action )
		{
			continue;
		}
		else if ( action.value.toUpperCase() === 'ATWL' )
		{
			ignore_error = true;
			break;
		}
	}

	if ( !ignore_error )
	{
		this.onerror( 'Unable to locate form for inventory attributes' );
	}

	return null;
}

AttributeMachine.prototype.Lookup_Attribute_Form_Index = function( form, attribute_code, template_code )
{
	var i, j, i_len, j_len, regex, match, index, regex_template, match_template;

	if ( form !== this.form )
	{
		return null;
	}

	if ( this.form_action === 'ADPM' )
	{
		regex = new RegExp( '^products\\[\\s{0,}(\\d{1,})\\s{0,}\\]:attributes\\[\\s{0,}(\\d{1,})\\s{0,}\\]:code$', 'i' );

		for ( i = 0, i_len = this.elementlist_product_attributes.length; i < i_len; i++ )
		{
			if ( !this.elementlist_product_attributes[ i ].hasAttribute( 'name' ) )						continue;
			if ( ( match = this.elementlist_product_attributes[ i ].name.match( regex ) ) === null )	continue;
			if ( this.elementlist_product_attributes[ i ].value !== attribute_code )					continue;

			index = parseInt( match[ 2 ], 10 );

			if ( template_code === null )
			{
				return index;
			}

			regex_template = new RegExp( '^products\\[\\s{0,}(\\d{1,})\\s{0,}\\]:attributes\\[\\s{0,}(\\d{1,})\\s{0,}\\]:template_code$', 'i' );

			for ( j = 0, j_len = this.elementlist_product_attributes.length; j < j_len; j++ )
			{
				if ( !this.elementlist_product_attributes[ j ].hasAttribute( 'name' ) )										continue;
				if ( ( match_template = this.elementlist_product_attributes[ j ].name.match( regex_template ) ) === null )	continue;
				if ( this.elementlist_product_attributes[ j ].value !== template_code )										continue;

				if ( parseInt( match_template[ 2 ], 10 ) === index )
				{
					return index;
				}
			}
		}
	}
	else if ( this.form_action == 'AUPM' )
	{
		regex = new RegExp( '^product\\[\\s{0,}(\\d{1,})\\s{0,}\\]:attributes\\[\\s{0,}(\\d{1,})\\s{0,}\\]:code$', 'i' );

		for ( i = 0, i_len = this.elementlist_product_attributes.length; i < i_len; i++ )
		{
			if ( !this.elementlist_product_attributes[ i ].hasAttribute( 'name' ) )						continue;
			if ( ( match = this.elementlist_product_attributes[ i ].name.match( regex ) ) === null )	continue;
			if ( this.elementlist_product_attributes[ i ].value !== attribute_code )					continue;

			index = parseInt( match[ 2 ], 10 );

			if ( template_code === null )
			{
				return index;
			}

			regex_template = new RegExp( '^product\\[\\s{0,}(\\d{1,})\\s{0,}\\]:attributes\\[\\s{0,}(\\d{1,})\\s{0,}\\]:template_code$', 'i' );

			for ( j = 0, j_len = this.elementlist_product_attributes.length; j < j_len; j++ )
			{
				if ( !this.elementlist_product_attributes[ j ].hasAttribute( 'name' ) )										continue;
				if ( ( match_template = this.elementlist_product_attributes[ j ].name.match( regex_template ) ) === null )	continue;
				if ( this.elementlist_product_attributes[ j ].value !== template_code )										continue;

				if ( parseInt( match_template[ 2 ], 10 ) === index )
				{
					return index;
				}
			}
		}
	}
	else
	{
		regex = new RegExp( '^product_attributes\\[\\s{0,}(\\d{1,})\\s{0,}\\]:code$', 'i' );

		for ( i = 0, i_len = this.elementlist_product_attributes.length; i < i_len; i++ )
		{
			if ( !this.elementlist_product_attributes[ i ].hasAttribute( 'name' ) )						continue;
			if ( ( match = this.elementlist_product_attributes[ i ].name.match( regex ) ) === null )	continue;
			if ( this.elementlist_product_attributes[ i ].value !== attribute_code )					continue;

			index = parseInt( match[ 1 ], 10 );

			if ( template_code === null )
			{
				return index;
			}

			regex_template = new RegExp( '^product_attributes\\[\\s{0,}(\\d{1,})\\s{0,}\\]:template_code$', 'i' );

			for ( j = 0, j_len = this.elementlist_product_attributes.length; j < j_len; j++ )
			{
				if ( !this.elementlist_product_attributes[ j ].hasAttribute( 'name' ) )										continue;
				if ( ( match_template = this.elementlist_product_attributes[ j ].name.match( regex_template ) ) === null )	continue;
				if ( this.elementlist_product_attributes[ j ].value !== template_code )										continue;

				if ( parseInt( match_template[ 1 ], 10 ) === index )
				{
					return index;
				}
			}
		}
	}

	return null;
}

AttributeMachine.prototype.onerror				= function( error_message ) { console.log( error_message ); }
AttributeMachine.prototype.getElementById		= function( id ) { return document.getElementById( id ); }
AttributeMachine.prototype.getElementsByTagName	= function( tagName ) { return document.getElementsByTagName( tagName ); }
AttributeMachine.prototype.onPriceChanged		= function( product_data ) { ; }
AttributeMachine.prototype.onVariantChanged		= function( product_data ) { ; }

// AttributeMachine_SubscriptionTerm
///////////////////////////////////////////////////////////////////

function AttributeMachine_SubscriptionTerm( machine, form, elements )
{
	var self = this;
	var i, i_len;

	this.machine	= machine;
	this.elements	= new Array();

	for ( i = 0, i_len = elements.length; i < i_len; i++ )
	{
		if ( elements[ i ].nodeName.toLowerCase() === 'input' &&
			 elements[ i ].type.toLowerCase() === 'radio' )
		{
			this.elements.push( elements[ i ] );
			AddEvent( elements[ i ], 'click', function( event ) { self.onchange( event ); } );
		}
		else
		{
			this.elements.push( elements[ i ] );
			AddEvent( elements[ i ], 'change', function( event ) { self.onchange( event ); } );
		}
	}
}

AttributeMachine_SubscriptionTerm.prototype.GetValue = function()
{
	var i, i_len;

	if ( this.elements.length == 0 )
	{
		return 0;
	}

	for ( i = 0, i_len = this.elements.length; i < i_len; i++ )
	{
		if ( ( this.elements[ i ].nodeName.toLowerCase() == 'input' ) &&
			 ( this.elements[ i ].type.toLowerCase() == 'radio' ) )
		{
			if ( this.elements[ i ].checked )
			{
				return this.elements[ i ].value;
			}
		}
		else
		{
			return this.elements[ i ].value;
		}
	}
}

AttributeMachine_SubscriptionTerm.prototype.onchange = function( event ) { ; }

// AttributeMachine_Selection
///////////////////////////////////////////////////////////////////

function AttributeMachine_Selection()
{
	this.selected_term_id		= 0;
	this.selected_attr_ids		= new Array();
	this.selected_attmpat_ids	= new Array();
	this.selected_option_ids	= new Array();
	this.selected_attr_types	= new Array();

	this.unselected_attr_ids	= new Array();
	this.unselected_attmpat_ids	= new Array();
}

AttributeMachine_Selection.prototype.Has_Selected = function()
{
	return this.selected_attr_ids.length ? true : false;
}

// AttributeMachine_Checkbox
///////////////////////////////////////////////////////////////////

function AttributeMachine_Checkbox( machine, attribute, template_attribute )
{
	this.machine			= machine;
	this.attribute			= attribute;
	this.template_attribute	= template_attribute;
	this.checkbox			= null;
	this.hidden				= null;
}

AttributeMachine_Checkbox.prototype.Initialize = function( form, elements )
{
	var self = this;
	var i, i_len;

	this.checkbox = null;

	for ( i = 0, i_len = elements.length; i < i_len; i++ )
	{
		if ( !elements[ i ].hasAttribute( 'type' ) )			continue;
		if ( elements[ i ].type.toLowerCase() !== 'checkbox' )	continue;

		this.checkbox = elements[ i ];
		break;
	}

	if ( this.checkbox == null )
	{
		return false;
	}

	this.hidden				= document.createElement( 'input' );
	this.hidden.type		= 'hidden';
	this.hidden.name		= this.checkbox.name;
	this.hidden.value		= this.checkbox.checked ? 'Yes' : '';
	this.hidden.disabled	= this.checkbox.disabled ? false : true;

	this.checkbox.form.appendChild( this.hidden );

	AddEvent( this.checkbox, 'click', function()
	{
		self.machine.Attribute_Changed( self );
		return true;
	} );

	return true;
}

AttributeMachine_Checkbox.prototype.Disable = function()
{
	this.checkbox.disabled	= true;
	this.hidden.disabled	= false;
}

AttributeMachine_Checkbox.prototype.Enable = function()
{
	this.checkbox.disabled	= false;
	this.hidden.disabled	= true;
}

AttributeMachine_Checkbox.prototype.Cull = function( possible_option_lookup, selected_id )
{
	if ( selected_id == 0 )
	{
		this.checkbox.checked	= false;
		this.hidden.value		= '';
	}
	else if ( selected_id == 1 )
	{
		this.checkbox.checked	= true;
		this.hidden.value		= 'Yes';
	}

	if ( possible_option_lookup[ 0 ] == null ||
		 possible_option_lookup[ 1 ] == null )	this.Disable();
	else										this.Enable();

	return true;
}

AttributeMachine_Checkbox.prototype.Selected_Option_ID = function()
{
	if ( this.checkbox.checked )	return 1;
	else							return 0;
}

// AttributeMachine_Text
///////////////////////////////////////////////////////////////////

function AttributeMachine_Text( machine, attribute, template_attribute )
{
	this.machine			= machine;
	this.attribute			= attribute;
	this.template_attribute	= template_attribute;
	this.input				= null;
	this.last_value			= null;
}

AttributeMachine_Text.prototype.Initialize = function( form, elements )
{
	var self = this;
	var i, i_len;

	this.input = null;

	for ( i = 0, i_len = elements.length; i < i_len; i++ )
	{
		if ( !elements[ i ].hasAttribute( 'type' ) )		continue;
		if ( elements[ i ].type.toLowerCase() !== 'text' )	continue;

		this.input = elements[ i ];
		break;
	}

	if ( this.input == null )
	{
		return false;
	}

	this.last_value = this.input.value;

	AddEvent( this.input, 'change',	function( event ) { return self.Event_OnChange( event ? event : window.event ); } );
	AddEvent( this.input, 'keyup',	function( event ) { return self.Event_OnChange( event ? event : window.event ); } );

	return true;
}

AttributeMachine_Text.prototype.Event_OnChange = function( e )
{
	if ( ( this.last_value.length == 0 ) != ( this.input.value.length == 0 ) )
	{
		this.machine.Attribute_Changed( this );
	}

	this.last_value = this.input.value;

	return true;
}

AttributeMachine_Text.prototype.Disable = function()
{
	this.input.disabled	= true;
}

AttributeMachine_Text.prototype.Enable = function()
{
	this.input.disabled	= false;
}

AttributeMachine_Text.prototype.Cull = function( possible_option_lookup, selected_id )
{
	if ( possible_option_lookup[ 1 ] == null )
	{
		this.Disable();
		return true;
	}

	this.Enable();

	switch ( selected_id )
	{
		case 0 :
		{
			this.last_value		= '';
			this.input.value	= '';

			break;
		}
		case 1 :
		{
			if ( this.input.value.length == 0 )
			{
				return false;
			}

			break;
		}
	}

	return true;
}

AttributeMachine_Text.prototype.Selected_Option_ID = function()
{
	if ( this.input.disabled )		return 0;
	if ( this.input.value.length )	return 1;
	else							return 0;
}

// AttributeMachine_Memo
///////////////////////////////////////////////////////////////////

function AttributeMachine_Memo( machine, attribute, template_attribute )
{
	this.machine			= machine;
	this.attribute			= attribute;
	this.template_attribute	= template_attribute;
	this.textarea			= null;
	this.last_value			= null;
}

AttributeMachine_Memo.prototype.Initialize = function( form, elements )
{
	var self = this;
	var i, i_len;

	this.textarea = null;

	for ( i = 0, i_len = elements.length; i < i_len; i++ )
	{
		if ( elements[ i ].nodeName.toLowerCase() !== 'textarea' )
		{
			continue;
		}

		this.textarea = elements[ i ];
		break;
	}

	if ( this.textarea == null )
	{
		return false;
	}

	this.last_value = this.textarea.value;

	AddEvent( this.textarea, 'change',	function( event ) { return self.Event_OnChange( event ? event : window.event ); } );
	AddEvent( this.textarea, 'keyup',	function( event ) { return self.Event_OnChange( event ? event : window.event ); } );

	return true;
}

AttributeMachine_Memo.prototype.Event_OnChange = function( e )
{
	if ( ( this.last_value.length == 0 ) != ( this.textarea.value.length == 0 ) )
	{
		this.machine.Attribute_Changed( this );
	}

	this.last_value = this.textarea.value;

	return true;
}

AttributeMachine_Memo.prototype.Disable = function()
{
	this.textarea.disabled = true;
}

AttributeMachine_Memo.prototype.Enable = function()
{
	this.textarea.disabled = false;
}

AttributeMachine_Memo.prototype.Cull = function( possible_option_lookup, selected_id )
{
	if ( possible_option_lookup[ 1 ] == null )
	{
		this.Disable();
		return true;
	}

	this.Enable();

	switch ( selected_id )
	{
		case 0 :
		{
			this.last_value		= '';
			this.textarea.value	= '';

			break;
		}
		case 1 :
		{
			if ( this.textarea.value.length == 0 )
			{
				return false;
			}

			break;
		}
	}

	return true;
}

AttributeMachine_Memo.prototype.Selected_Option_ID = function()
{
	if ( this.textarea.disabled )		return 0;
	if ( this.textarea.value.length )	return 1;
	else								return 0;
}

// AttributeMachine_Radio
///////////////////////////////////////////////////////////////////

function AttributeMachine_Radio( machine, attribute, template_attribute )
{
	this.machine			= machine;
	this.attribute			= attribute;
	this.template_attribute	= template_attribute;
	this.options			= template_attribute ? template_attribute.options : attribute.options;
	this.radios				= new Array();
	this.empty_radio		= null;
	this.option_lookup		= null;
}

AttributeMachine_Radio.prototype.Initialize = function( form, elements )
{
	var self = this;
	var i, i_len, j, j_len;

	this.radios = new Array();

	for ( i = 0, i_len = elements.length; i < i_len; i++ )
	{
		if ( !elements[ i ].hasAttribute( 'type' ) )		continue;
		if ( elements[ i ].type.toLowerCase() !== 'radio' )	continue;

		this.radios.push( elements[ i ] );
	}

	if ( this.radios.length === 0 )
	{
		return false;
	}

	// Build an option lookup by ID that correlates to the specific radio <input> element for that option
	this.option_lookup = new Array();

	for ( i = 0, i_len = this.radios.length; i < i_len; i++ )
	{
		if ( ( this.radios[ i ].value.length === 0 ) && ( this.empty_radio === null ) )
		{
			this.empty_radio = this.radios[ i ];
		}
		else
		{
			for ( j = 0, j_len = this.options.length; j < j_len; j++ )
			{
				if ( this.radios[ i ].value == this.options[ j ].code )
				{
					this.option_lookup[ this.options[ j ].id ] = this.radios[ i ];
				}
			}
		}
	}

	for ( i = 0, i_len = this.radios.length; i < i_len; i++ )
	{
		AddEvent( this.radios[ i ], 'click', function()
		{
			self.machine.Attribute_Changed( self );
			return true;
		} );
	}

	return true;
}

AttributeMachine_Radio.prototype.Disable = function()
{
	var i;

	for ( i = 0; i < this.radios.length; i++ )
	{
		this.radios[ i ].disabled	= true;
		this.radios[ i ].checked	= false;
	}

	if ( this.empty_radio )
	{
		this.empty_radio.disabled	= false;
		this.empty_radio.checked	= true;
	}
}

AttributeMachine_Radio.prototype.Enable = function()
{
	var i;

	for ( i = 0; i < this.radios.length; i++ )
	{
		this.radios[ i ].disabled	= false;
	}
}

AttributeMachine_Radio.prototype.Cull = function( possible_option_lookup, selected_id )
{
	var i;

	this.Enable();

	for ( i = 0; i < this.options.length; i++ )
	{
		if ( !possible_option_lookup[ this.options[ i ].id ] )
		{
			this.option_lookup[ this.options[ i ].id ].disabled	= true;
		}
	}

	if ( selected_id )				this.option_lookup[ selected_id ].checked	= true;
	else if ( this.empty_radio )	this.empty_radio.checked					= true;
	else
	{
		for ( i in this.option_lookup )
		{
			this.option_lookup[ i ].checked	= false;
		}

		if ( this.template_attribute )
		{
			if ( this.template_attribute.required )	return false;
		}
		else if ( this.attribute.required )			return false;
	}

	return true;
}

AttributeMachine_Radio.prototype.Selected_Option_ID = function()
{
	var i, j;

	for ( i = 0; i < this.radios.length; i++ )
	{
		if ( this.radios[ i ].checked && !this.radios[ i ].disabled )
		{
			for ( j = 0; j < this.options.length; j++ )
			{
				if ( this.options[ j ].code == this.radios[ i ].value )
				{
					return this.options[ j ].id;
				}
			}
		}
	}

	return null;
}

// AttributeMachine_Select
///////////////////////////////////////////////////////////////////

function AttributeMachine_Select( machine, attribute, template_attribute )
{
	this.machine			= machine;
	this.attribute			= attribute;
	this.template_attribute	= template_attribute;
	this.options			= template_attribute ? template_attribute.options : attribute.options;
	this.select				= null;
	this.option_lookup		= null;
	this.empty_option		= null;
}

AttributeMachine_Select.prototype.Initialize = function( form, elements )
{
	var self = this;
	var i, j, i_len, j_len;

	this.select = null;

	for ( i = 0, i_len = elements.length; i < i_len; i++ )
	{
		if ( elements[ i ].nodeName.toLowerCase() !== 'select' )	continue;
		if ( elements[ i ].type.toLowerCase() !== 'select-one' )	continue;

		this.select = elements[ i ];
		break;
	}

	if ( this.select == null )
	{
		return false;
	}

	// Build an option lookup by ID that correlates to the specific <option> element for that option
	this.option_lookup = new Array();

	for ( i = 0, i_len = this.select.options.length; i < i_len; i++ )
	{
		if ( this.select.options[ i ].value == '' )
		{
			this.empty_option = this.select.options[ i ];
			continue;
		}

		for ( j = 0, j_len = this.options.length; j < j_len; j++ )
		{
			if ( this.select.options[ i ].value == this.options[ j ].code )
			{
				this.option_lookup[ this.options[ j ].id ] = this.select.options[ i ];
			}
		}
	}

	AddEvent( this.select, 'change', function()
	{
		self.machine.Attribute_Changed( self );
		return true;
	} );

	return true;
}

AttributeMachine_Select.prototype.Initialize_NonInventory = function( form, elements )
{
	var i, i_len;

	for ( i = 0, i_len = elements.length; i < i_len; i++ )
	{
		if ( elements[ i ].nodeName.toLowerCase() !== 'select' )	continue;
		if ( elements[ i ].type.toLowerCase() !== 'select-one' )	continue;

		this.select = elements[ i ];
		break;
	}
}

AttributeMachine_Select.prototype.Disable = function()
{
	this.select.disabled	= true;
}

AttributeMachine_Select.prototype.Enable = function()
{
	this.select.disabled	= false;
}

AttributeMachine_Select.prototype.Cull = function( possible_option_lookup, selected_id )
{
	var i, option_count, selected_index;

	this.select.options.length	= 0;
	option_count				= 0;
	selected_index				= 0;

	if ( this.empty_option )
	{
		this.select.options[ option_count++ ]		= this.empty_option;
	}

	for ( i = 0; i < this.options.length; i++ )
	{
		if ( possible_option_lookup[ this.options[ i ].id ] )
		{
			if ( this.options[ i ].id == selected_id )
			{
				selected_index						= option_count;
			}

			this.select.options[ option_count++ ]	= this.option_lookup[ this.options[ i ].id ];
		}
	}

	this.select.selectedIndex	= selected_index;

	if ( this.select.options.length )	this.Enable();
	else								this.Disable();

	return true;
}

AttributeMachine_Select.prototype.Selected_Option_ID = function()
{
	var i;
	var selected_code;

	if ( this.select.disabled ||
		 this.select.selectedIndex < 0 )
	{
		return null;
	}

	selected_code = this.select.options[ this.select.selectedIndex ].value;

	for ( i = 0; i < this.options.length; i++ )
	{
		if ( this.options[ i ].code == selected_code )
		{
			return this.options[ i ].id;
		}
	}

	return null;
}

// AttributeMachine Swatches
///////////////////////////////////////////////////////////////////

AttributeMachine.prototype.oninitializeswatches = function( attributes, possible )
{
	this.Initialize_Swatches( attributes, possible );
}

AttributeMachine.prototype.onswatchclick = function( input, attribute, option )
{
	this.Swatch_Click( input, attribute, option );
}

AttributeMachine.prototype.Initialize_Swatches = function( attributes, possible )
{
	var self = this;
	var i, j;
	var possible_lookup;
	var attribute, template_attribute, current, swatch, attr_ul;

	if ( !this.Lookup_Attribute_Form() )
	{
		return;
	}

	this.swatch_attributes = []

	for ( i = 0; i < attributes.length; i++ )
	{
		if ( attributes[ i ].type === 'template' )
		{
			for ( j = 0; j < attributes[ i ].attributes.length; j++ )
			{
				if ( attributes[ i ].attributes[ j ].type === 'swatch-select' )
				{
					this.swatch_attributes.push( new AttributeMachine_Select( this, attributes[ i ], attributes[ i ].attributes[ j ] ) );
					this.swatch_attributes[ this.swatch_attributes.length - 1 ].Initialize_NonInventory( this.form, this.Gather_Form_ProductAttributeElements( attributes[ i ], attributes[ i ].attributes[ j ] ) );
				}
			}
		}
		else if ( attributes[ i ].type === 'swatch-select' )
		{
			this.swatch_attributes.push( new AttributeMachine_Select( this, attributes[ i ], null ) );
			this.swatch_attributes[ this.swatch_attributes.length - 1 ].Initialize_NonInventory( this.form, this.Gather_Form_ProductAttributeElements( attributes[ i ], null ) );
		}
	}

	if ( this.swatch_attributes.length === 0 ) return;

	if ( this.swatches ) this.Empty_Element( this.swatches );

	possible_lookup = ( possible ) ? this.Build_Possible_Lookup( possible.data.attributes ) : null;

	for ( i = 0; i < this.swatch_attributes.length; i++ )
	{
		attribute				= this.swatch_attributes[ i ].attribute;
		template_attribute		= this.swatch_attributes[ i ].template_attribute;

		current = template_attribute ? template_attribute : attribute;

		possible_sublookup		= ( possible_lookup ) ? possible_lookup[ attribute.id ] : null;

		if ( possible_sublookup )
		{
			if ( template_attribute )	possible_sublookup	= possible_sublookup[ template_attribute.id ];
			else						possible_sublookup	= possible_sublookup[ 0 ];
		}

		attr_ul					= document.createElement( 'ul' );
		attr_ul.style.clear		= 'both';

		for ( j = 0; j < current.options.length; j++ )
		{
			if ( current.inventory && possible_sublookup )
			{
				if ( !possible_sublookup.options[ current.options[ j ].id ] ) continue;
			}

			swatch = this.Generate_Swatch( this.settings.product_code, current, current.options[ j ] );

			swatch.mm5_input		= this.swatch_attributes[ i ];
			swatch.mm5_attribute	= current;
			swatch.mm5_option		= current.options[ j ];

			AddEvent( swatch, 'click', function()
			{ 
				var node;

				if ( this.mm5_input )		node = this;
				else if ( window.event )	node = window.event.srcElement;
				else						node = null;

				while ( node && !node.mm5_input )
				{
					node = node.parentNode;
				}

				if ( node ) self.onswatchclick( node.mm5_input, node.mm5_attribute, node.mm5_option );
			} );

			if ( this.swatches ) attr_ul.appendChild( swatch );
		}		

		if ( this.swatches )	this.swatches.appendChild( attr_ul );
	}
}

AttributeMachine.prototype.Swatch_Click = function( input, attribute, option )
{
	var i

	for ( i = 0; i < input.select.options.length; i++ )
	{
		if ( input.select.options[ i ].value == option.code )
		{
			input.select.selectedIndex = i;
		}
	}					

	this.Attribute_Changed( input );
}

AttributeMachine.prototype.Empty_Element = function( container )
{
	while( container.hasChildNodes() )
	{
		container.removeChild( container.lastChild );
	}
}
