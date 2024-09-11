// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2023 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// TemplateOrderEmail Add/Edit Dialog
////////////////////////////////////////////////////

function TemplateOrderEmail_AddEditDialog( email )
{
	var self = this;

	// Variables
	this.email							= email;
	this.can_modify						= CanI( 'FUFL', 0, 0, 1, 0 );
	this.can_delete						= CanI( 'FUFL', 0, 0, 1, 0 );

	// Controls
	this.dialog							= document.getElementById( 'templateorderemail_addeditdialog' );
	this.title							= document.getElementById( 'templateorderemail_addeditdialog_title' );

	this.text_code						= document.getElementById( 'templateorderemail_addeditdialog_code' );
	this.edit_code						= document.getElementById( 'templateorderemail_addeditdialog_edit_code' );
	this.edit_name						= document.getElementById( 'templateorderemail_addeditdialog_name' );
	this.edit_from						= document.getElementById( 'templateorderemail_addeditdialog_from' );
	this.edit_reply_to					= document.getElementById( 'templateorderemail_addeditdialog_reply_to' );
	this.edit_to						= document.getElementById( 'templateorderemail_addeditdialog_to' );
	this.edit_cc						= document.getElementById( 'templateorderemail_addeditdialog_cc' );
	this.edit_bcc						= document.getElementById( 'templateorderemail_addeditdialog_bcc' );
	this.edit_subject					= document.getElementById( 'templateorderemail_addeditdialog_subject' );
	this.edit_mimetype					= document.getElementById( 'templateorderemail_addeditdialog_mimetype' );
	this.edit_sending					= document.getElementById( 'templateorderemail_addeditdialog_sending' );
	this.edit_order_created				= document.getElementById( 'templateorderemail_addeditdialog_order_sources' );
	this.edit_order_created_multiselect = MultiSelect_TemplateBasedEmails_Order_Sources;
	this.checkbox_on_bord				= document.getElementById( 'templateorderemail_addeditdialog_on_bord' );
	this.checkbox_on_retc				= document.getElementById( 'templateorderemail_addeditdialog_on_retc' );
	this.checkbox_on_retr				= document.getElementById( 'templateorderemail_addeditdialog_on_retr' );
	this.checkbox_on_shpc				= document.getElementById( 'templateorderemail_addeditdialog_on_shpc' );
	this.checkbox_on_shps				= document.getElementById( 'templateorderemail_addeditdialog_on_shps' );
	this.checkbox_on_cust				= document.getElementById( 'templateorderemail_addeditdialog_on_cust' );
	this.checkbox_on_gftcert			= document.getElementById( 'templateorderemail_addeditdialog_on_gftcert' );
	this.checkbox_on_digital			= document.getElementById( 'templateorderemail_addeditdialog_on_digital' );
	this.checkbox_on_sub_crt			= document.getElementById( 'templateorderemail_addeditdialog_on_sub_crt' );
	this.checkbox_on_sub_chg			= document.getElementById( 'templateorderemail_addeditdialog_on_sub_chg' );
	this.checkbox_on_sub_can			= document.getElementById( 'templateorderemail_addeditdialog_on_sub_can' );
	this.checkbox_on_sub_oos			= document.getElementById( 'templateorderemail_addeditdialog_on_sub_oos' );
	this.checkbox_on_sub_pnd			= document.getElementById( 'templateorderemail_addeditdialog_on_sub_pnd' );
	this.edit_sub_days					= document.getElementById( 'templateorderemail_addeditdialog_sub_days' );
	this.checkbox_on_pc_exp				= document.getElementById( 'templateorderemail_addeditdialog_on_pc_exp' );
	this.select_pc_type					= document.getElementById( 'templateorderemail_addeditdialog_pc_type' );
	this.edit_pc_days					= document.getElementById( 'templateorderemail_addeditdialog_pc_days' );
	this.edit_authfail					= document.getElementById( 'templateorderemail_addeditdialog_authfail_sources' );
	this.edit_authfail_multiselect		= MultiSelect_TemplateBasedEmails_AuthFail_Sources;
	this.checkbox_send_b64				= document.getElementById( 'templateorderemail_addeditdialog_send_b64' );
	this.checkbox_vis_cust				= document.getElementById( 'templateorderemail_addeditdialog_vis_cust' );
	this.checkbox_vis_ordr				= document.getElementById( 'templateorderemail_addeditdialog_vis_ordr' );
	this.checkbox_on_abandon			= new MMDialog_Checkbox_Controller( 'templateorderemail_addeditdialog_on_abandon' );
	this.edit_ab_time					= new MMDialog_Edit_Controller( 'templateorderemail_addeditdialog_ab_time' );
	this.edit_ab_minsub					= new MMDialog_Edit_Controller( 'templateorderemail_addeditdialog_ab_minsub' );
	this.edit_ab_maxsub					= new MMDialog_Edit_Controller( 'templateorderemail_addeditdialog_ab_maxsub' );
	this.checkbox_ab_kpalive			= new MMDialog_Checkbox_Controller( 'templateorderemail_addeditdialog_ab_kpalive' );
	this.edit_ab_kpmins					= new MMDialog_Edit_Controller( 'templateorderemail_addeditdialog_ab_kpmins' );

	this.button_cancel					= document.getElementById( 'templateorderemail_addeditdialog_button_cancel' );
	this.button_delete					= document.getElementById( 'templateorderemail_addeditdialog_button_delete' );
	this.button_save					= document.getElementById( 'templateorderemail_addeditdialog_button_save' );

	// Events
	if ( this.button_cancel )	this.button_cancel.onclick		= function() { self.Cancel(); }
	if ( this.button_save )		this.button_save.onclick		= function() { if ( self.can_modify || !self.email ) self.Save(); }
	if ( this.button_delete )	this.button_delete.onclick		= function() { if ( self.can_delete ) self.Delete(); }
}

TemplateOrderEmail_AddEditDialog.prototype.Show = function()
{
	if ( this.email )	this.ShowEdit();
	else				this.ShowAdd();
}

TemplateOrderEmail_AddEditDialog.prototype.ShowEdit = function()
{
	this.Clear_Order_Sources();
	this.Clear_AuthFail_Sources();

	this.title.innerHTML				= 'Edit Email';

	this.text_code.innerHTML			= encodeentities( this.email.code );
	this.text_code.style.display		= 'block';
	this.edit_code.style.display		= 'none';
	this.edit_name.value				= this.email.name;
	this.edit_from.value				= this.email.email_from;
	this.edit_reply_to.value			= this.email.email_rp_to;
	this.edit_to.value					= this.email.email_to;
	this.edit_cc.value					= this.email.email_cc;
	this.edit_bcc.value					= this.email.email_bcc;
	this.edit_subject.value				= this.email.email_subj;
	this.edit_mimetype.value			= this.email.mime_type;
	this.edit_sending.value				= this.email.enabled ? 1 : 0;
	this.checkbox_on_bord.checked		= this.email.on_bord;
	this.checkbox_on_retc.checked		= this.email.on_retc;
	this.checkbox_on_retr.checked		= this.email.on_retr;
	this.checkbox_on_shpc.checked		= this.email.on_shpc;
	this.checkbox_on_shps.checked		= this.email.on_shps;
	this.checkbox_on_cust.checked		= this.email.on_cust;
	this.checkbox_on_gftcert.checked	= this.email.on_gftcert;
	this.checkbox_on_digital.checked	= this.email.on_digital;
	this.checkbox_on_sub_crt.checked	= this.email.on_sub_crt;
	this.checkbox_on_sub_chg.checked	= this.email.on_sub_chg;
	this.checkbox_on_sub_can.checked	= this.email.on_sub_can;
	this.checkbox_on_sub_oos.checked	= this.email.on_sub_oos;
	this.checkbox_on_sub_pnd.checked	= this.email.on_sub_pnd;
	this.edit_sub_days.value			= this.email.sub_days;
	this.checkbox_on_pc_exp.checked		= this.email.on_pc_exp;
	this.select_pc_type.value			= this.email.pc_type;
	this.edit_pc_days.value				= this.email.pc_days;
	this.checkbox_send_b64.checked		= this.email.send_b64;
	this.checkbox_vis_cust.checked		= this.email.vis_cust;
	this.checkbox_vis_ordr.checked		= this.email.vis_ordr;
	this.checkbox_on_abandon.SetChecked( this.email.on_abandon );
	this.edit_ab_time.SetValue( this.email.ab_time );
	this.edit_ab_minsub.SetValue( this.email.ab_minsub.toFixed( 2 ) );
	this.edit_ab_maxsub.SetValue( this.email.ab_maxsub.toFixed( 2 ) );
	this.checkbox_ab_kpalive.SetChecked( this.email.ab_kpalive );
	this.edit_ab_kpmins.SetValue( this.email.ab_kpmins );

	this.button_save.value				= 'Save';
	this.button_save.style.display		= this.can_modify ? 'inline' : 'none';
	this.button_delete.style.display	= this.can_delete ? 'inline' : 'none';

	Modal_Show( this.dialog, this.button_save.onclick, this.button_cancel.onclick );

	this.edit_name.focus();

	this.Add_Order_Sources();
	this.Add_AuthFail_Sources();
}

TemplateOrderEmail_AddEditDialog.prototype.ShowAdd = function()
{
	this.Clear_Order_Sources();
	this.Clear_AuthFail_Sources();

	this.title.innerHTML				= 'Add Email';

	this.edit_code.value				= '';
	this.text_code.style.display		= 'none';
	this.edit_code.style.display		= 'block';
	this.edit_name.value				= '';
	this.edit_from.value				= '&mvt:store:email;';
	this.edit_reply_to.value			= '&mvt:store:email;';
	this.edit_to.value					= '&mvt:order:bill_email;';
	this.edit_cc.value					= '';
	this.edit_bcc.value					= '';
	this.edit_subject.value				= '';
	this.edit_mimetype.value			= 'text/html; charset=&mvt:store:charset;';
	this.edit_sending.value				= 1;
	this.checkbox_on_bord.checked		= false;
	this.checkbox_on_retc.checked		= false;
	this.checkbox_on_retr.checked		= false;
	this.checkbox_on_shpc.checked		= false;
	this.checkbox_on_shps.checked		= false;
	this.checkbox_on_cust.checked		= false;
	this.checkbox_on_gftcert.checked	= false;
	this.checkbox_on_digital.checked	= false;
	this.checkbox_on_sub_crt.checked	= false;
	this.checkbox_on_sub_chg.checked	= false;
	this.checkbox_on_sub_can.checked	= false;
	this.checkbox_on_sub_oos.checked	= false;
	this.checkbox_on_sub_pnd.checked	= false;
	this.edit_sub_days.value			= 1;
	this.checkbox_on_pc_exp.checked		= false;
	this.select_pc_type.value			= "S";
	this.edit_pc_days.value				= 30;
	this.checkbox_send_b64.checked		= false;
	this.checkbox_vis_cust.checked		= true;
	this.checkbox_vis_ordr.checked		= true;
	this.checkbox_on_abandon.SetChecked( false );
	this.edit_ab_time.SetValue( 30 );
	this.edit_ab_minsub.SetValue( '0.00' );
	this.edit_ab_maxsub.SetValue( '0.00' );
	this.checkbox_ab_kpalive.SetChecked( false );
	this.edit_ab_kpmins.SetValue( 2880 );

	this.button_save.value				= 'Add';
	this.button_save.style.display		= 'inline';
	this.button_delete.style.display	= 'none';

	Modal_Show( this.dialog, this.button_save.onclick, this.button_cancel.onclick );

	this.edit_code.focus();
}

TemplateOrderEmail_AddEditDialog.prototype.Hide = function()
{
	Modal_Hide();
}

TemplateOrderEmail_AddEditDialog.prototype.Cancel = function()
{
	this.Hide();
	this.oncancel();
}

TemplateOrderEmail_AddEditDialog.prototype.Validate = function( data )
{
	var i, validate_options;

	if ( ( this.email == null ) && this.edit_code.value.length == 0 )
	{
		Modal_Alert( 'Please enter an email code.' );
		this.edit_code.focus();

		return false;
	}

	if ( this.edit_name.value.length == 0 )
	{
		Modal_Alert( 'Please enter an email name.' );
		this.edit_name.focus();

		return false;
	}

	if ( this.edit_from.value.length == 0 )
	{
		Modal_Alert( 'Please enter a from address.' );
		this.edit_from.focus();

		return false;
	}

	if ( this.edit_to.value.length == 0 )
	{
		Modal_Alert( 'Please enter a to address.' );
		this.edit_to.focus();

		return false;
	}

	if ( this.edit_subject.value.length == 0 )
	{
		Modal_Alert( 'Please enter a subject.' );
		this.edit_subject.focus();

		return false;
	}

	if ( this.edit_mimetype.value.length == 0 )
	{
		Modal_Alert( 'Please enter a mime type.' );
		this.edit_mimetype.focus();

		return false;
	}

	validate_options 			= new Object();

	if ( !ValidateWholeNumber( this.edit_sub_days.value, validate_options ) )
	{
		Modal_Alert( validate_options.message );

		this.edit_sub_days.select();
		this.edit_sub_days.focus();

		return false;
	}

	if ( !ValidateWholeNumber( this.edit_pc_days.value, validate_options ) )
	{
		Modal_Alert( validate_options.message );

		this.edit_pc_days.select();
		this.edit_pc_days.focus();

		return false;
	}

	if ( !this.edit_ab_time.Validate_WholeNumber_GreaterThan( 0 ) )			return;
	if ( !this.edit_ab_minsub.Validate_FloatingPointNumber_NonNegative() ) 	return;
	if ( !this.edit_ab_maxsub.Validate_FloatingPointNumber_NonNegative() ) 	return;
	if ( !this.edit_ab_kpmins.Validate_WholeNumber_GreaterThan( 0 ) ) 		return;

	if ( stod_def_nonneg( this.edit_ab_minsub.GetValue() ) > stod_def_nonneg( this.edit_ab_maxsub.GetValue() ) && stod_def_nonneg( this.edit_ab_maxsub.GetValue() ) != 0 )
	{
		this.edit_ab_minsub.Focus();

		return this.onerror( 'Abandoned basket subtotal range minimum cannot be greater than the maximum' );
	}

	data.code					= this.email ? this.email.code : this.edit_code.value;
	data.name 					= this.edit_name.value;
	data.email_from 			= this.edit_from.value;
	data.email_to 				= this.edit_to.value;
	data.email_reply_to 		= this.edit_reply_to.value;
	data.email_cc 				= this.edit_cc.value;
	data.email_bcc 				= this.edit_bcc.value;
	data.email_subject 			= this.edit_subject.value;
	data.mime_type 				= this.edit_mimetype.value;
	data.enabled 				= this.edit_sending.value;
	data.on_order_sources		= new Array();
	data.on_bord 				= this.checkbox_on_bord.checked;
	data.on_retc 				= this.checkbox_on_retc.checked;
	data.on_retr 				= this.checkbox_on_retr.checked;
	data.on_shpc 				= this.checkbox_on_shpc.checked;
	data.on_shps 				= this.checkbox_on_shps.checked;
	data.on_cust 				= this.checkbox_on_cust.checked;
	data.on_gftcert 			= this.checkbox_on_gftcert.checked;
	data.on_digital 			= this.checkbox_on_digital.checked;
	data.on_sub_crt 			= this.checkbox_on_sub_crt.checked;
	data.on_sub_chg 			= this.checkbox_on_sub_chg.checked;
	data.on_sub_can 			= this.checkbox_on_sub_can.checked;
	data.on_sub_oos 			= this.checkbox_on_sub_oos.checked;
	data.on_sub_pnd				= this.checkbox_on_sub_pnd.checked;
	data.sub_days 				= this.edit_sub_days.value;
	data.on_pc_exp 				= this.checkbox_on_pc_exp.checked;
	data.pc_type				= this.select_pc_type.value;
	data.pc_days 				= this.edit_pc_days.value;
	data.on_authfail_sources	= new Array();
	data.send_b64 				= this.checkbox_send_b64.checked;
	data.vis_cust 				= this.checkbox_vis_cust.checked;
	data.vis_ordr 				= this.checkbox_vis_ordr.checked;
	data.on_abandon				= this.checkbox_on_abandon.GetChecked();
	data.ab_time				= this.edit_ab_time.GetValue();
	data.ab_minsub				= this.edit_ab_minsub.GetValue();
	data.ab_maxsub				= this.edit_ab_maxsub.GetValue();
	data.ab_kpalive				= this.checkbox_ab_kpalive.GetChecked();
	data.ab_kpmins				= this.edit_ab_kpmins.GetValue();

	for ( i = 0; i < this.edit_order_created.options.length; i++ )
	{
		data.on_order_sources.push( this.edit_order_created.options[ i ].value );
	}

	for ( i = 0; i < this.edit_authfail.options.length; i++ )
	{
		data.on_authfail_sources.push( this.edit_authfail.options[ i ].value );
	}

	return true;
}

TemplateOrderEmail_AddEditDialog.prototype.Save = function()
{
	var self = this;
	var data = new Object();

	if ( !this.Validate( data ) )
	{
		return false;
	}

	if ( this.email )
	{
		TemplateOrderEmail_Update( data, function( response ) { self.Save_Callback( response ); } );
	}
	else
	{
		TemplateOrderEmail_Insert( data, function( response ) { self.Save_Callback( response ); } );
	}
}

TemplateOrderEmail_AddEditDialog.prototype.Save_Callback = function( response )
{
	this.button_save.value		= this.email ? "Save" : "Add";
	this.button_save.disabled	= false;

	if ( !response.success )
	{
		if ( !response.validation_error )
		{
			this.onerror( response.error_message );
		}
		else
		{
			if ( response.error_field === 'Code' )		this.edit_code.focus();

			if ( response.error_field_message.length )	this.onerror( response.error_field_message );
			else										this.onerror( response.error_message );
		}

		return;
	}

	this.Hide();
	this.onsave();
}

TemplateOrderEmail_AddEditDialog.prototype.Delete = function()
{
	var self = this;

	if ( !confirm( 'Deleting an email cannot be undone.  Continue?' ) )
	{
		return;
	}

	TemplateOrderEmail_Delete( this.email.code, function( response ) { self.Delete_Callback( response ); } );
}

TemplateOrderEmail_AddEditDialog.prototype.Delete_Callback = function( response )
{
	if ( !response.success )
	{
		return this.onerror( response.error_message );
	}

	this.Hide();
	this.ondelete();
}

TemplateOrderEmail_AddEditDialog.prototype.Clear_Order_Sources = function()
{
	var i;

	for ( i = 0; i < this.edit_order_created_multiselect.select_deselected.options.length; i++ )
	{
		this.edit_order_created_multiselect.select_deselected.options[ i ].selected = false;
	}

	for ( i = 0; i < this.edit_order_created_multiselect.select_selected.options.length; i++ )
	{
		this.edit_order_created_multiselect.select_selected.options[ i ].selected = true;
	}

	this.edit_order_created_multiselect.Remove();
}

TemplateOrderEmail_AddEditDialog.prototype.Add_Order_Sources = function()
{
	var i, current_option;

	for ( i = 0; i < this.edit_order_created_multiselect.select_deselected.options.length; i++ )
	{
		current_option = this.edit_order_created_multiselect.select_deselected.options[ i ];

		if ( this.email.on_ordr[ current_option.value ] )
		{
			current_option.selected = true;
		}
	}

	this.edit_order_created_multiselect.Add();
}

TemplateOrderEmail_AddEditDialog.prototype.Clear_AuthFail_Sources = function()
{
	var i;

	for ( i = 0; i < this.edit_authfail_multiselect.select_deselected.options.length; i++ )
	{
		this.edit_authfail_multiselect.select_deselected.options[ i ].selected = false;
	}

	for ( i = 0; i < this.edit_authfail_multiselect.select_selected.options.length; i++ )
	{
		this.edit_authfail_multiselect.select_selected.options[ i ].selected = true;
	}

	this.edit_authfail_multiselect.Remove();
}

TemplateOrderEmail_AddEditDialog.prototype.Add_AuthFail_Sources = function()
{
	var i, current_option;

	for ( i = 0; i < this.edit_authfail_multiselect.select_deselected.options.length; i++ )
	{
		current_option = this.edit_authfail_multiselect.select_deselected.options[ i ];

		if ( this.email.on_athfail[ current_option.value ] )
		{
			current_option.selected = true;
		}
	}

	this.edit_authfail_multiselect.Add();
}

TemplateOrderEmail_AddEditDialog.prototype.onerror		= function( error )	{ Modal_Alert( error ); }
TemplateOrderEmail_AddEditDialog.prototype.oncancel		= function()		{ ; }
TemplateOrderEmail_AddEditDialog.prototype.onsave		= function()		{ ; }
TemplateOrderEmail_AddEditDialog.prototype.ondelete		= function()		{ ; }
