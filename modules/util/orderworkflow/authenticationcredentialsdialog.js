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

// Order Workflow: Authentication Credentials Dialog
////////////////////////////////////////////////////

var OWFAuthenticationCredentialsDialog = class extends MMDialog
{
	#credentials;
	#button_save;
	#input_descrip;
	#button_cancel;
	#button_delete;
	#element_content;
	#select_auth_type;
	#edit_basic_password;
	#input_basic_username;
	#input_basic_password;
	#button_edit_password;

	constructor( credentials )
	{
		super( 'authenticationcredentialsdialog', 650, 0 );

		this.SetTitle( 'Add/Edit Authentication Credentials' );
		this.SetAutoHeightEnabled();
		this.SetResizeEnabled();

		this.#credentials						= credentials;

		this.#element_content					= document.getElementById( 'authenticationcredentialsdialog_content' );
		this.#input_descrip						= document.getElementById( 'authenticationcredentialsdialog_descrip' );
		this.#select_auth_type					= document.getElementById( 'authenticationcredentialsdialog_auth_type' );
		this.#input_basic_username				= document.getElementById( 'authenticationcredentialsdialog_username' );
		this.#input_basic_password				= document.getElementById( 'authenticationcredentialsdialog_password' );
		this.#button_edit_password				= document.getElementById( 'authenticationcredentialsdialog_edit_password' );

		this.#input_descrip.clearAllEvents();
		this.#select_auth_type.clearAllEvents();
		this.#input_basic_username.clearAllEvents();
		this.#input_basic_password.clearAllEvents();
		this.#button_edit_password.clearAllEvents();

		this.#input_basic_username.credential	= true;
		this.#input_basic_password.credential	= 'empty-password';

		this.#select_auth_type.onchange			= ( value ) => { this.#onAuthenticationTypeChanged( value ); };
		this.#input_descrip.onchange			= ( e ) => { this.#enableDisableButtons(); };
		this.#input_basic_username.onchange		= ( e ) => { this.#enableDisableButtons(); };

		this.#input_descrip.onenter				= ( e ) => { this.onEnter( e ); };
		this.#input_basic_username.onenter		= ( e ) => { this.onEnter( e ); };
		this.#input_basic_password.onenter		= ( e ) => { this.onEnter( e ); };

		this.#button_edit_password.onclick		= ( e ) => { this.#actionEditPassword(); };

		this.Field_Register( 'AuthenticationCredentials_Description',	this.#input_descrip );
		this.Field_Register( 'AuthenticationCredentials_Type',			this.#select_auth_type );
		this.Field_Register( 'AuthenticationCredentials_Data:username',	this.#input_basic_username );
		this.Field_Register( 'AuthenticationCredentials_Data:password',	this.#input_basic_password );

		this.#button_cancel						= this.ActionItem_Add_Secondary(			'Close',	() => { this.#actionCancel(); } );
		this.#button_delete						= this.ActionItem_Add_Negative_Secondary(	'Delete',	() => { this.#actionDelete(); } );
		this.#button_save						= this.ActionItem_Add_Primary(				'Save',		() => { this.#actionSave(); } );
	}

	//
	// MMDialog Function Overrides
	//

	onEnter()
	{
		this.#button_save.SimulateClick();
	}

	onESC()
	{
		this.#button_cancel.SimulateClick();
	}

	onSetContent()
	{
		if ( this.#credentials )
		{
			this.SetTitle( 'Edit Authentication Credentials' );

			this.#edit_basic_password				= false;
			this.#input_basic_username.required		= false;
			this.#input_basic_password.disabled		= true;

			this.#button_edit_password.show();

			this.#input_descrip.value				= this.#credentials.descrip;
			this.#select_auth_type.value			= this.#credentials.auth_type;

			if ( this.#credentials.auth_type === 'basic' )	this.#input_basic_username.value = this.#credentials.auth_data?.username || '';
			else											this.#input_basic_username.value = '';

			this.#input_basic_password.value		= '';

			this.#button_delete.Show();
		}
		else
		{
			this.SetTitle( 'Add Authentication Credentials' );

			this.#edit_basic_password				= true;
			this.#input_basic_username.required		= true;
			this.#input_basic_password.disabled		= false;

			this.#button_edit_password.hide();

			this.#input_descrip.value				= '';
			this.#select_auth_type.value			= 'basic';
			this.#input_basic_username.value		= '';
			this.#input_basic_password.value		= '';

			this.#button_delete.Hide();
		}

		this.#onAuthenticationTypeChanged( this.#select_auth_type.value );
	}

	onVisible()
	{
		this.#input_descrip.focus();
	}

	//
	// Private Functions
	//

	#onAuthenticationTypeChanged( auth_type )
	{
		if ( auth_type === 'basic' )	classNameAddIfMissing( this.#element_content, 'basic' );
		else							classNameRemoveIfPresent( this.#element_content, 'basic' );

		this.#enableDisableButtons();
	}

	#enableDisableButtons()
	{
		if ( this.#input_descrip.value.length		&&
			 this.#select_auth_type.value.length	&&
			 ( this.#select_auth_type.value === 'basic' && this.#input_basic_username.value.length ) )
		{
			this.#button_save.Enable();
		}
		else
		{
			this.#button_save.Disable();
		}
	}

	//
	// Action Functions
	//

	#actionEditPassword()
	{
		this.#edit_basic_password			= true;
		this.#input_basic_password.disabled	= false;

		this.#button_edit_password.hide();
		this.#input_basic_password.focus();
	}

	#actionCancel()
	{
		this.Hide();
		this.onCancel();
	}

	#actionSaveValidate( data )
	{
		if ( ( !this.#input_descrip.input().Validate_NonEmpty() ) ||
			 ( !this.#select_auth_type.select().Validate_ValueSelected() ) ||
			 ( ( data.auth_type === 'basic' ) && ( !this.#input_basic_username.input().Validate_NonEmpty() ) ) )
		{
			return false;
		}

		data.descrip					= this.#input_descrip.value;
		data.auth_type					= this.#select_auth_type.value;
		data.auth_data					= new Object();

		if ( data.auth_type === 'basic' )
		{
			data.auth_data.username		= this.#input_basic_username.value;

			if ( this.#edit_basic_password )
			{
				data.auth_data.password	= this.#input_basic_password.value;
			}
		}

		return true;
	}

	#actionSave()
	{
		var confirm_dialog;
		const data = new Object();

		if ( !this.#actionSaveValidate( data ) )
		{
			return;
		}

		if ( this.#credentials && data.auth_data.password?.length === 0 )
		{
			confirm_dialog 			= new ConfirmationDialog();
			confirm_dialog.onYes	= () =>
			{
				this.#actionSaveLowLevel( data );
			}

			confirm_dialog.SetTitle( 'Empty Password Detected' );
			confirm_dialog.SetMessage( 'An empty password has been detected. Are you sure you wish<br />to overwrite the existing saved password with an empty password?' );
			confirm_dialog.SetButtonNoText( 'Cancel' );
			confirm_dialog.SetButtonYesText( 'Save Anyway' );

			return confirm_dialog.Show();
		}

		this.#actionSaveLowLevel( data );
	}

	#actionSaveLowLevel( data )
	{
		this.ActionItem_Processing_Start( this.#button_save );

		if ( this.#credentials )	OWFAuthenticationCredentials_Update( this.#credentials.id, data, ( response ) => { this.#actionSaveCallback( response ); } );
		else						OWFAuthenticationCredentials_Insert( data, ( response ) => { this.#actionSaveCallback( response ); } );
	}

	#actionSaveCallback( response )
	{
		this.ActionItem_Processing_End();

		if ( !this.ValidateResponse( response ) )
		{
			return;
		}

		this.Hide();
		this.onSave( response.data );
	}

	#actionDelete()
	{
		var confirm_dialog;

		confirm_dialog 			= new ConfirmationDialog();
		confirm_dialog.onYes	= () =>
		{
			this.ActionItem_Processing_Start( this.#button_delete );
			OWFAuthenticationCredentials_Delete( this.#credentials.id, ( response ) => { this.#actionDeleteCallback( response ); } );
		}

		confirm_dialog.SetTitle( 'Delete Authentication Credentials?' );
		confirm_dialog.SetMessage( 'Are you sure you wish to delete these credentials? This cannot be undone.' );

		confirm_dialog.Show();
	}

	#actionDeleteCallback( response )
	{
		this.ActionItem_Processing_End();

		if ( !this.ValidateResponse( response ) )
		{
			return;
		}

		this.Hide();
		this.onDelete();
	}

	//
	// Caller Overwritable Functions
	//

	onCancel()				{ ; }
	onSave( credentials )	{ ; }
	onDelete()				{ ; }	
}