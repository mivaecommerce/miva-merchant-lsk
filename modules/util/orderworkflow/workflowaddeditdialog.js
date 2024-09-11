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

if ( !window.mm_orderworkflow_initialization )
{
	window.mm_orderworkflow_initialization											= new Object();
	window.mm_orderworkflow_initialization.queuelist_response						= null;
	window.mm_orderworkflow_initialization.queuelist_loading						= false;
	window.mm_orderworkflow_initialization.queue_hooks								= new Array();
	window.mm_orderworkflow_initialization.customfieldlist_response					= null;
	window.mm_orderworkflow_initialization.customfieldlist_loading					= false;
	window.mm_orderworkflow_initialization.customfield_hooks						= new Array();
	window.mm_orderworkflow_initialization.authenticationcredentialslist_response	= null;
	window.mm_orderworkflow_initialization.authenticationcredentialslist_loading	= false;
	window.mm_orderworkflow_initialization.authenticationcredentials_hooks			= new Array();

	window.OrderWorkflow_InitializationDelegator_GetQueueList = function( callback, delegator )
	{
		if ( window.mm_orderworkflow_initialization.queuelist_response !== null )
		{
			return callback( cloneObject( window.mm_orderworkflow_initialization.queuelist_response ) );
		}

		window.mm_orderworkflow_initialization.queue_hooks.push( callback );

		if ( !window.mm_orderworkflow_initialization.queuelist_loading )
		{
			window.mm_orderworkflow_initialization.queuelist_loading = true;
			OWFQueueList_Load_Query( '', 'id', 0, 0, function( response ) { OrderWorkflow_InitializationDelegator_onQueueListLoaded( response ); }, delegator )
		}
	}

	window.OrderWorkflow_InitializationDelegator_GetCustomFieldList = function( callback, delegator )
	{
		if ( window.mm_orderworkflow_initialization.customfieldlist_response !== null )
		{
			return callback( cloneObject( window.mm_orderworkflow_initialization.customfieldlist_response ) );
		}

		window.mm_orderworkflow_initialization.customfield_hooks.push( callback );

		if ( !window.mm_orderworkflow_initialization.customfieldlist_loading )
		{
			window.mm_orderworkflow_initialization.customfieldlist_loading = true;
			OrderCustomFieldList_Load( function( response ) { OrderWorkflow_InitializationDelegator_onCustomFieldListLoaded( response ); }, delegator );
		}
	}

	window.OrderWorkflow_InitializationDelegator_GetAuthenticationCredentialsList = function( callback, delegator )
	{
		if ( window.mm_orderworkflow_initialization.authenticationcredentialslist_response !== null )
		{
			return callback( cloneObject( window.mm_orderworkflow_initialization.authenticationcredentialslist_response ) );
		}

		window.mm_orderworkflow_initialization.authenticationcredentials_hooks.push( callback );

		if ( !window.mm_orderworkflow_initialization.authenticationcredentialslist_loading )
		{
			window.mm_orderworkflow_initialization.authenticationcredentialslist_loading = true;
			OWFAuthenticationCredentialsList_Load_Query( '', 'id', 0, 0, function( response ) { OrderWorkflow_InitializationDelegator_onAuthenticationCredentialsListLoaded( response ); }, delegator )
		}
	}

	window.OrderWorkflow_InitializationDelegator_ClearQueueList = function()
	{
		window.mm_orderworkflow_initialization.queuelist_response = null;
	}

	window.OrderWorkflow_InitializationDelegator_ClearCustomFieldList = function()
	{
		window.mm_orderworkflow_initialization.customfieldlist_response = null;
	}

	window.OrderWorkflow_InitializationDelegator_ClearAuthenticationCredentialsList = function()
	{
		window.mm_orderworkflow_initialization.authenticationcredentialslist_response = null;
	}

	window.OrderWorkflow_InitializationDelegator_onQueueListLoaded = function( response )
	{
		var callback;

		window.mm_orderworkflow_initialization.queuelist_loading	= false;
		window.mm_orderworkflow_initialization.queuelist_response	= response;

		while ( window.mm_orderworkflow_initialization.queue_hooks.length )
		{
			callback = window.mm_orderworkflow_initialization.queue_hooks.shift();

			if ( typeof callback === 'function' )
			{
				callback( cloneObject( window.mm_orderworkflow_initialization.queuelist_response ) );
			}
		}
	}

	window.OrderWorkflow_InitializationDelegator_onCustomFieldListLoaded = function( response )
	{
		var callback;

		window.mm_orderworkflow_initialization.customfieldlist_loading	= false;
		window.mm_orderworkflow_initialization.customfieldlist_response	= response;

		while ( window.mm_orderworkflow_initialization.customfield_hooks.length )
		{
			callback = window.mm_orderworkflow_initialization.customfield_hooks.shift();

			if ( typeof callback === 'function' )
			{
				callback( cloneObject( window.mm_orderworkflow_initialization.customfieldlist_response ) );
			}
		}
	}

	window.OrderWorkflow_InitializationDelegator_onAuthenticationCredentialsListLoaded = function( response )
	{
		var callback;

		window.mm_orderworkflow_initialization.authenticationcredentialslist_loading	= false;
		window.mm_orderworkflow_initialization.authenticationcredentialslist_response	= response;

		while ( window.mm_orderworkflow_initialization.authenticationcredentials_hooks.length )
		{
			callback = window.mm_orderworkflow_initialization.authenticationcredentials_hooks.shift();

			if ( typeof callback === 'function' )
			{
				callback( cloneObject( window.mm_orderworkflow_initialization.authenticationcredentialslist_response ) );
			}
		}
	}
}

// Order Workflow: Workflow Add Edit Dialog
////////////////////////////////////////////////////

function OWFWorkflow_AddEditDialog( workflow )
{
	var self = this;

	this.workflow									= workflow;

	MMDialog.call( this, 'mm9_dialog_owfworkflowaddeditdialog', null, null );

	// Elements
	this.element_container							= document.getElementById( 'workflow_addeditdialog_container' );
	this.element_loading							= document.getElementById( 'workflow_addeditdialog_loading' );
	this.element_step_container						= document.getElementById( 'workflow_addeditdialog_step_container' );

	// Navigation Elements
	this.element_navigationitem_steps				= document.getElementById( 'workflow_addeditdialog_navigationitem_steps' );
	this.element_navigationitem_menu				= document.getElementById( 'workflow_addeditdialog_navigationitem_menu' );

	// Navigation Setup
	this.element_navigationitem_menu.onclick		= function( event ) { return self.Event_MenuToggle_OnClick( event ? event : window.event ); };

	// Variables
	this.prefs										= new Object();
	this.load_complete								= false;
	this.load_start_ts								= 0;
	this.load_min_wait								= 500;
	this.waiting_for_load							= false;
	this.navigationmenu_visible						= false;

	this.step_index									= -1;
	this.itemlist_steps								= new Array();

	this.element_step_container.innerHTML			= '';
	this.element_navigationitem_steps.innerHTML		= '';

	this.step_details								= new OWFWorkflow_Step_Details( workflow ? true : false );
	this.step_triggers								= new OWFWorkflow_Step_Triggers( workflow ? true : false );
	this.step_conditions							= new OWFWorkflow_Step_Conditions( workflow ? true : false );
	this.step_actions								= new OWFWorkflow_Step_Actions( workflow ? true : false );
	this.step_overview								= new OWFWorkflow_Step_Overview( workflow ? true : false );

	this.AddStep( this.step_details );
	this.AddStep( this.step_triggers );
	this.AddStep( this.step_conditions );
	this.AddStep( this.step_actions );
	this.AddStep( this.step_overview );

	this.SetFullscreenEnabled( false );
}

DeriveFrom( MMDialog, OWFWorkflow_AddEditDialog );

// Overridden MMDialog Functions

OWFWorkflow_AddEditDialog.prototype.onESC = function( e )
{
	this.Cancel();
}

OWFWorkflow_AddEditDialog.prototype.onPreferenceLoad = function( prefs, callback )
{
	var menu_open;

	this.prefs = prefs;

	if ( this.prefs.hasOwnProperty( 'menu_open' ) )
	{
		menu_open = stob( this.prefs.menu_open );

		if ( menu_open )	this.NavigationMenu_Show();
		else				this.NavigationMenu_Hide();
	}

	MMDialog.prototype.onPreferenceLoad.call( this, prefs, callback );
}

OWFWorkflow_AddEditDialog.prototype.onModalShow = function( z_index )
{
	this.Fullscreen_Start();

	MMDialog.prototype.onModalShow.call( this, z_index );
}

OWFWorkflow_AddEditDialog.prototype.onFullscreen_End = function()
{
	if ( this.visible )
	{
		this.Hide();
	}
}

OWFWorkflow_AddEditDialog.prototype.onSetContent = function()
{
	var self = this;
	var i, i_len, errors, dialog, delegator;

	this.element_container.className		= classNameRemove( this.element_container, 'menu_open' );

	this.load_complete						= false;
	this.waiting_for_load					= false;

	this.element_loading.style.opacity		= 1;
	this.element_loading.style.display		= 'block';

	errors									= new Array();
	delegator								= new AJAX_ThreadPool( 3 );
	delegator.onStart						= function()
	{
		self.load_start_ts = ( new Date() ).getTime();
	}
	delegator.onComplete					= function()
	{
		self.load_complete		= true;
		self.workflow_modified	= cloneObject( self.workflow_original );

		if ( errors.length )
		{
			dialog			= new AlertDialog();
			dialog.onClose	= function() { self.Hide(); };

			return dialog.Show( errors[ 0 ] );
		}

		if ( self.waiting_for_load )
		{
			self.waiting_for_load = false;

			if ( !self.workflow )	self.onVisible_Add();
			else					self.onVisible_Edit();
		}
	};

	window.OrderWorkflow_InitializationDelegator_GetQueueList( function( queuelist ) { /* Preload */ }, delegator );
	window.OrderWorkflow_InitializationDelegator_GetCustomFieldList( function( customfieldlist ) { /* Preload */ }, delegator );
	window.OrderWorkflow_InitializationDelegator_GetAuthenticationCredentialsList( function( customfieldlist ) { /* Preload */ }, delegator );

	for ( i = 0, i_len = this.itemlist_steps.length; i < i_len; i++ )
	{
		this.itemlist_steps[ i ].End( 0, null );
		this.itemlist_steps[ i ].ClearValid();
		this.itemlist_steps[ i ].ClearInvalid();
	}

	if ( this.workflow )
	{
		this.workflow_original				= cloneObject( this.workflow );

		if ( !this.workflow.hasOwnProperty( 'triggers' ) )	OWFWorkflowTriggerList_Load_Workflow( this.workflow.id, function( response ) { self.OWFWorkflowTriggerList_Load_Workflow_Callback( response, errors ); }, delegator );
		if ( !this.workflow.hasOwnProperty( 'cond' ) )		OWFWorkflowConditionList_Load_Workflow( this.workflow.id, function( response ) { self.OWFWorkflowConditionList_Load_Workflow_Callback( response, errors ); }, delegator );
		if ( !this.workflow.hasOwnProperty( 'actions' ) )	OWFWorkflowActionList_Load_Workflow( this.workflow.id, function( response ) { self.OWFWorkflowActionList_Load_Workflow_Callback( response, errors ); }, delegator );
	}
	else
	{
		this.workflow_original				= new Object();
		this.workflow_original.id			= 0;
		this.workflow_original.enabled		= true;
		this.workflow_original.name			= '';
		this.workflow_original.wait_for		= false;
		this.workflow_original.wait_int		= 5;
		this.workflow_original.wait_max		= 60;
		this.workflow_original.triggers		= new Array();
		this.workflow_original.cond			= new Array();
		this.workflow_original.actions		= new Array();

		this.workflow_modified				= cloneObject( this.workflow_original );
	}

	delegator.Run();
}

OWFWorkflow_AddEditDialog.prototype.onVisible = function()
{
	if ( this.load_complete )
	{
		if ( !this.workflow )		this.onVisible_Add();
		else						this.onVisible_Edit();
	}
	else
	{
		this.waiting_for_load = true;
	}
}

OWFWorkflow_AddEditDialog.prototype.onVisible_Add = function()
{
	var self = this;
	var delay, animationlist;

	this.SetCurrentStep( null );

	delay			= stoi_def_nonneg( this.load_min_wait - stoi_def( ( new Date() ).getTime() - this.load_start_ts, 0 ), 0 );
	animationlist	= new Array();
	animationlist.push( createAnimation(
	{
		delay: delay,
		duration: 200,
		delta: animationLinear,
		step: function( delta )
		{
			self.element_loading.style.opacity = ( 1 - delta );
		},
		oncomplete: function()
		{
			self.element_loading.style.display = 'none';
			self.ShowStep( self.step_details );
		}
	} ) );

	cancelAnimationFrame( window[ this.animation_id ] );
	beginAnimations( animationlist, this.animation_id );
}

OWFWorkflow_AddEditDialog.prototype.onVisible_Edit = function()
{
	var self = this;
	var i, i_len, delay, errors, animationlist;

	this.SetCurrentStep( null );

	for ( i = 0, i_len = this.itemlist_steps.length; i < i_len; i++ )
	{
		errors = new Array();

		this.itemlist_steps[ i ].RestoreData( this.workflow_modified );

		if ( !this.itemlist_steps[ i ].Validate( errors ) )	this.itemlist_steps[ i ].SetInvalid( errors );
		else												this.itemlist_steps[ i ].SetValid();
	}

	delay			= stoi_def_nonneg( this.load_min_wait - stoi_def( ( new Date() ).getTime() - this.load_start_ts, 0 ), 0 );
	animationlist	= new Array();
	animationlist.push( createAnimation(
	{
		delay: delay,
		duration: 200,
		delta: animationLinear,
		step: function( delta )
		{
			self.element_loading.style.opacity = ( 1 - delta );
		},
		oncomplete: function()
		{
			self.element_loading.style.display = 'none';
			self.ShowStep( self.step_overview );
		}
	} ) );

	cancelAnimationFrame( window[ this.animation_id ] );
	beginAnimations( animationlist, this.animation_id );
}

OWFWorkflow_AddEditDialog.prototype.onHide = function()
{
	var i, i_len;

	for ( i = 0, i_len = this.itemlist_steps.length; i < i_len; i++ )
	{
		this.itemlist_steps[ i ].End( 0, null );
	}

	Modal_Resize();
}

// Navigation Functions

OWFWorkflow_AddEditDialog.prototype.Event_MenuToggle_OnClick = function( e )
{
	var key_array, value_array;

	this.NavigationMenu_Toggle();

	key_array						= new Array();
	value_array						= new Array();
	this.prefs.menu_open			= this.navigationmenu_visible.toString();

	Modal_UserPreferencesToArrays( this.key_prefix, this.prefs, key_array, value_array );
	this.SavePreferences( key_array, value_array );

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

OWFWorkflow_AddEditDialog.prototype.NavigationMenu_Toggle = function()
{
	if ( this.navigationmenu_visible )	this.NavigationMenu_Hide();
	else								this.NavigationMenu_Show();
}

OWFWorkflow_AddEditDialog.prototype.NavigationMenu_Show = function()
{
	this.navigationmenu_visible			= true;
	this.element_container.className	= classNameAdd( this.element_container, 'menu_open' );
}

OWFWorkflow_AddEditDialog.prototype.NavigationMenu_Hide = function()
{
	this.navigationmenu_visible			= false;
	this.element_container.className	= classNameRemove( this.element_container, 'menu_open' );
}

OWFWorkflow_AddEditDialog.prototype.Event_OnClick_Next = function( e, step )
{
	this.ShowNextStep();

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

OWFWorkflow_AddEditDialog.prototype.Event_OnClick_Close = function( e, step )
{
	this.Cancel();

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

OWFWorkflow_AddEditDialog.prototype.Event_OnClick_Delete = function( e, step )
{
	this.Delete();

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

OWFWorkflow_AddEditDialog.prototype.Event_OnClick_Create = function( e, step )
{
	this.Save();

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

OWFWorkflow_AddEditDialog.prototype.Event_OnClick_Update = function( e, step )
{
	this.Save();

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

OWFWorkflow_AddEditDialog.prototype.Event_OnClick_Previous = function( e, step )
{
	this.ShowPreviousStep();

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

OWFWorkflow_AddEditDialog.prototype.Event_OnClick_NavigationItem = function( e, step )
{
	this.ShowStep( step );

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

OWFWorkflow_AddEditDialog.prototype.Event_OnClick_EditName = function( e )
{
	this.ShowStep( this.step_details );

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

OWFWorkflow_AddEditDialog.prototype.AddStep = function( step )
{
	var self = this;

	step.onClick_Next			= function( event ) { return self.Event_OnClick_Next( event ? event : window.event, step ); };
	step.onClick_Close			= function( event ) { return self.Event_OnClick_Close( event ? event : window.event, step ); };
	step.onClick_Delete			= function( event ) { return self.Event_OnClick_Delete( event ? event : window.event, step ); };
	step.onClick_Create			= function( event ) { return self.Event_OnClick_Create( event ? event : window.event, step ); };
	step.onClick_Update			= function( event ) { return self.Event_OnClick_Update( event ? event : window.event, step ); };
	step.onClick_Previous		= function( event ) { return self.Event_OnClick_Previous( event ? event : window.event, step ); };
	step.onClick_NavigationItem	= function( event ) { return self.Event_OnClick_NavigationItem( event ? event : window.event, step ); };
	step.onClick_EditName		= function( event ) { return self.Event_OnClick_EditName( event ? event : window.event ); };

	step.SetContentParent( this.element_step_container );
	step.SetNavigationParent( this.element_navigationitem_steps );
	this.itemlist_steps.push( step );
}

OWFWorkflow_AddEditDialog.prototype.StepExists = function( step )
{
	if ( step instanceof OWFWorkflow_Step && this.itemlist_steps.indexOf( step ) !== -1 )
	{
		return true;
	}

	return false;
}

OWFWorkflow_AddEditDialog.prototype.SetCurrentStep = function( step )
{
	this.step_index = this.itemlist_steps.indexOf( step );
}

OWFWorkflow_AddEditDialog.prototype.GetCurrentStep = function()
{
	if ( this.step_index === -1 || !this.itemlist_steps.hasOwnProperty( this.step_index ) || !( this.itemlist_steps[ this.step_index ] instanceof OWFWorkflow_Step ) )
	{
		return null;
	}

	return this.itemlist_steps[ this.step_index ];
}

OWFWorkflow_AddEditDialog.prototype.ShowPreviousStep = function()
{
	var index = stoi_min( this.step_index - 1, 0 );

	this.ShowStep( this.itemlist_steps[ index ] );
}

OWFWorkflow_AddEditDialog.prototype.ShowNextStep = function()
{
	var index = stoi_max( this.step_index + 1, this.itemlist_steps.length - 1 );

	this.ShowStep( this.itemlist_steps[ index ] );
}

OWFWorkflow_AddEditDialog.prototype.ShowStep = function( step )
{
	var i, i_len, errors, from_step, oncomplete, end_duration, animationlist;

	if ( !this.StepExists( step ) )
	{
		return;
	}

	if ( ( from_step = this.GetCurrentStep() ) === null )
	{
		for ( i = 0, i_len = this.itemlist_steps.length; i < i_len; i++ )
		{
			this.itemlist_steps[ i ].End( 0, null );
		}
	}
	else
	{
		if ( from_step === step )
		{
			return;
		}

		errors = new Array();

		if ( from_step.Validate( errors ) )	from_step.SetValid();
		else								from_step.ClearValid();

		this.workflow_modified = from_step.SaveData();

		for ( i = 0, i_len = this.itemlist_steps.length; i < i_len; i++ )
		{
			if ( this.itemlist_steps[ i ] !== from_step )
			{
				this.itemlist_steps[ i ].End( 0, null );
			}
		}
	}

	animationlist = new Array();

	if ( from_step !== null )	end_duration = from_step.End( 0, animationlist );
	else						end_duration = 0;

	step.RestoreData( this.workflow_modified );
	step.Begin( end_duration, animationlist );

	oncomplete = function() { step.Visible(); };

	this.SetCurrentStep( step );
	cancelAnimationFrame( window[ this.animation_id ] );
	beginAnimations( animationlist, this.animation_id, null, oncomplete );
}

// Action Functions

OWFWorkflow_AddEditDialog.prototype.Cancel = function()
{
	var i, i_len, step;

	if ( ( step = this.GetCurrentStep() ) !== null )
	{
		this.workflow_modified = step.SaveData();
	}

	if ( this.workflow_original.name		!== this.workflow_modified.name		||
		 this.workflow_original.enabled		!== this.workflow_modified.enabled	||
		 this.workflow_original.wait_for	!== this.workflow_modified.wait_for	||
		 this.workflow_original.wait_int	!== this.workflow_modified.wait_int	||
		 this.workflow_original.wait_max	!== this.workflow_modified.wait_max	||
		 !this.CompareConditions( this.workflow_original.cond, this.workflow_modified.cond ) ||
		 !this.CompareActions( this.workflow_original.actions, this.workflow_modified.actions ) )
	{
		return this.WorkflowModified_DisplayCancelDiscardSaveDialog();
	}

	if ( this.workflow_original.triggers.length !== this.workflow_modified.triggers.length )
	{
		return this.WorkflowModified_DisplayCancelDiscardSaveDialog();
	}
	else
	{
		//
		// When comparing triggers, only content, and not order, matters
		//

		for ( i = 0, i_len = this.workflow_original.triggers.length; i < i_len; i++ )
		{
			if ( this.workflow_modified.triggers.indexOf( this.workflow_original.triggers[ i ] ) === -1 )
			{
				return this.WorkflowModified_DisplayCancelDiscardSaveDialog();
			}
		}
	}

	this.Cancel_LowLevel();
}

OWFWorkflow_AddEditDialog.prototype.Cancel_LowLevel = function()
{
	this.Fullscreen_End();
}

OWFWorkflow_AddEditDialog.prototype.Delete = function()
{
	var self = this;
	var dialog, button_cancel, button_delete;

	if ( !this.workflow )
	{
		return;
	}

	dialog 			= new ActionDialog();
	dialog.onESC	= function( e ) { button_cancel.SimulateClick(); };

	button_cancel	= dialog.Button_Add_Right_Secondary( 'Cancel',			'', function() { ; } );
	button_delete	= dialog.Button_Add_Right_Negative_Primary( 'Delete',	'', function() { self.Delete_LowLevel(); } );

	dialog.SetTitle( 'Delete Workflow?' );
	dialog.SetMessage( 'This action cannot be undone.' );
	dialog.Show();
}

OWFWorkflow_AddEditDialog.prototype.Delete_LowLevel = function()
{
	var self = this;
	OWFWorkflow_Delete( this.workflow.id, function( response ) { self.Delete_Callback( response ); } );
}

OWFWorkflow_AddEditDialog.prototype.Delete_Callback = function( response )
{
	if ( !response.success )
	{
		return this.onError( response.error_message );
	}

	this.Hide();
	this.onDelete();
}

OWFWorkflow_AddEditDialog.prototype.Save = function()
{
	var self = this;
	var step, data, errors, dialog, button_save, button_cancel, validate_details, validate_actions, validate_triggers, validate_overview, validate_conditions;

	if ( ( step = this.GetCurrentStep() ) !== null )
	{
		this.workflow_modified	= step.SaveData();
	}

	this.step_details.ClearInvalid();
	this.step_triggers.ClearInvalid();
	this.step_conditions.ClearInvalid();
	this.step_actions.ClearInvalid();
	this.step_overview.ClearInvalid();

	this.step_details.RestoreData( this.workflow_modified );
	this.step_triggers.RestoreData( this.workflow_modified );
	this.step_conditions.RestoreData( this.workflow_modified );
	this.step_actions.RestoreData( this.workflow_modified );
	this.step_overview.RestoreData( this.workflow_modified );

	errors				= new Object();
	errors.details		= new Array();
	errors.triggers		= new Array();
	errors.conditions	= new Array();
	errors.actions		= new Array();
	errors.overview		= new Array();

	if ( validate_details = this.step_details.Validate( errors.details ) )			this.step_details.SetValid();
	if ( validate_triggers = this.step_triggers.Validate( errors.triggers ) )		this.step_triggers.SetValid();
	if ( validate_conditions = this.step_conditions.Validate( errors.conditions ) )	this.step_conditions.SetValid();
	if ( validate_actions = this.step_actions.Validate( errors.actions ) )			this.step_actions.SetValid();
	if ( validate_overview = this.step_overview.Validate( errors.overview ) )		this.step_overview.SetValid();

	if ( !validate_details ||
		 !validate_triggers ||
		 !validate_conditions ||
		 !validate_actions ||
		 !validate_overview )
	{
		return this.Errors( errors );
	}

	data				= new Object();
	data.name			= this.workflow_modified.name;
	data.enabled		= this.workflow_modified.enabled;
	data.wait_for		= this.workflow_modified.wait_for;
	data.cond			= this.workflow_modified.cond;

	if ( data.wait_for )
	{
		data.wait_int	= this.workflow_modified.wait_int;
		data.wait_max	= this.workflow_modified.wait_max;
	}
	else
	{
		data.wait_int	= 0;
		data.wait_max	= 0;
	}

	data.triggers		= this.workflow_modified.triggers;
	data.actions		= this.workflow_modified.actions;

	if ( data.cond.length > 0 )
	{
		return this.Save_LowLevel( data );
	}

	dialog 			= new ActionDialog();
	dialog.onESC	= function( e ) { button_cancel.SimulateClick(); };
	dialog.onEnter	= function( e ) { button_save.SimulateClick(); };

	button_cancel	= dialog.Button_Add_Right_Secondary( 'Cancel',	'', function() { ; } );
	button_save		= dialog.Button_Add_Right_Primary( 'Save',		'', function() { self.Save_LowLevel( data ); } );

	dialog.SetTitle( 'Save anyway?' );
	dialog.SetMessage( 'No conditions have been added for this workflow. All orders processed by this workflow via the selected triggers will have the specified action(s) applied.' );
	dialog.Show();
}

OWFWorkflow_AddEditDialog.prototype.Save_LowLevel = function( data )
{
	var self = this;

	if ( this.workflow )	OWFWorkflow_Update( this.workflow.id, data, function( response ) { self.Save_Callback( response ); } );
	else					OWFWorkflow_Insert( data, function( response ) { self.Save_Callback( response ); } );
}

OWFWorkflow_AddEditDialog.prototype.Save_Callback = function( response )
{
	if ( !response.success )
	{
		return this.Process_Response_Errors( response );
	}

	this.Hide();
	this.onSave();
}

// Helper Functions

OWFWorkflow_AddEditDialog.prototype.OWFWorkflowTriggerList_Load_Workflow_Callback = function( response, errors )
{
	if ( !response.success )
	{
		return errors.push( response.error_message );
	}

	this.workflow_original.triggers = response.data;
}

OWFWorkflow_AddEditDialog.prototype.OWFWorkflowActionList_Load_Workflow_Callback = function( response, errors )
{
	if ( !response.success )
	{
		return errors.push( response.error_message );
	}

	this.workflow_original.actions = response.data;
}

OWFWorkflow_AddEditDialog.prototype.OWFWorkflowConditionList_Load_Workflow_Callback = function( response, errors )
{
	if ( !response.success )
	{
		return errors.push( response.error_message );
	}

	this.workflow_original.cond = response.data;
}

OWFWorkflow_AddEditDialog.prototype.CompareConditions = function( original_conditions, modified_conditions )
{
	var i, i_len, original_field, modified_field, original_value, modified_value, original_operator, modified_operator;
	var original_field_type, modified_field_type, original_value_type, modified_value_type, original_operator_type, modified_operator_type;

	if ( !Array.isArray( original_conditions ) || !Array.isArray( modified_conditions ) )
	{
		return false;
	}
	else if ( original_conditions.length !== modified_conditions.length )
	{
		return false;
	}

	for ( i = 0, i_len = original_conditions.length; i < i_len; i++ )
	{
		original_operator_type = getVariableType( original_conditions[ i ].operator );
		modified_operator_type = getVariableType( modified_conditions[ i ].operator );

		if ( original_operator_type === 'string' )		original_operator = original_conditions[ i ].operator.toUpperCase();
		else if ( original_operator_type === 'number' )	original_operator = original_conditions[ i ].operator.toString();
		else											original_operator = null;

		if ( modified_operator_type === 'string' )		modified_operator = modified_conditions[ i ].operator.toUpperCase();
		else if ( modified_operator_type === 'number' )	modified_operator = modified_conditions[ i ].operator.toString();
		else											modified_operator = null;

		if ( original_operator !== modified_operator )
		{
			return false;
		}
		else if ( original_conditions[ i ].hasOwnProperty( 'field' ) !== modified_conditions[ i ].hasOwnProperty( 'field' ) )
		{
			return false;
		}
		else if ( Array.isArray( original_conditions[ i ].value ) !== Array.isArray( modified_conditions[ i ].value ) )
		{
			return false;
		}

		if ( !original_conditions[ i ].hasOwnProperty( 'field' ) )
		{
			if ( !this.CompareConditions( original_conditions[ i ].value, modified_conditions[ i ].value ) )
			{
				return false;
			}
		}
		else if ( original_conditions[ i ].hasOwnProperty( 'field' ) && Array.isArray( original_conditions[ i ].value ) )
		{
			original_field_type = getVariableType( original_conditions[ i ].field );
			modified_field_type = getVariableType( modified_conditions[ i ].field );

			if ( original_field_type === 'string' )			original_field = original_conditions[ i ].field;
			else if ( original_field_type === 'number' )	original_field = original_conditions[ i ].field.toString();
			else											original_field = null;

			if ( modified_field_type === 'string' )			modified_field = modified_conditions[ i ].field;
			else if ( modified_field_type === 'number' )	modified_field = modified_conditions[ i ].field.toString();
			else											modified_field = null;

			if ( original_field !== modified_field )
			{
				return false;
			}
			else if ( !this.CompareConditions( original_conditions[ i ].value, modified_conditions[ i ].value ) )
			{
				return false;
			}
		}
		else
		{
			original_field_type = getVariableType( original_conditions[ i ].field );
			modified_field_type = getVariableType( modified_conditions[ i ].field );

			if ( original_field_type === 'string' )			original_field = original_conditions[ i ].field;
			else if ( original_field_type === 'number' )	original_field = original_conditions[ i ].field.toString();
			else											original_field = null;

			if ( modified_field_type === 'string' )			modified_field = modified_conditions[ i ].field;
			else if ( modified_field_type === 'number' )	modified_field = modified_conditions[ i ].field.toString();
			else											modified_field = null;

			if ( original_field !== modified_field )
			{
				return false;
			}

			original_value_type = getVariableType( original_conditions[ i ].value );
			modified_value_type = getVariableType( modified_conditions[ i ].value );

			if ( original_value_type === 'string' )			original_value = original_conditions[ i ].value;
			else if ( original_value_type === 'number' )	original_value = original_conditions[ i ].value.toString();
			else											original_value = null;

			if ( modified_value_type === 'string' )			modified_value = modified_conditions[ i ].value;
			else if ( modified_value_type === 'number' )	modified_value = modified_conditions[ i ].value.toString();
			else											modified_value = null;

			if ( original_value !== modified_value )
			{
				return false;
			}
		}
	}

	return true;
}

OWFWorkflow_AddEditDialog.prototype.CompareActions = function( original_actions, modified_actions )
{
	var i, i_len;

	if ( !Array.isArray( original_actions ) || !Array.isArray( modified_actions ) )
	{
		return false;
	}
	else if ( original_actions.length !== modified_actions.length )
	{
		return false;
	}

	for ( i = 0, i_len = original_actions.length; i < i_len; i++ )
	{
		if ( original_actions[ i ].act !== modified_actions[ i ].act )
		{
			return false;
		}

		if ( original_actions[ i ].act === 'payment' )
		{
			if ( original_actions[ i ].act_data.capture_enabled			!== modified_actions[ i ].act_data.capture_enabled )			return false;
			if ( original_actions[ i ].act_data.capture_includes		!== modified_actions[ i ].act_data.capture_includes )			return false;
			if ( original_actions[ i ].act_data.capture_nontax_charges	!== modified_actions[ i ].act_data.capture_nontax_charges )		return false;
			if ( original_actions[ i ].act_data.refund_enabled			!== modified_actions[ i ].act_data.refund_enabled )				return false;
			if ( original_actions[ i ].act_data.refund_includes			!== modified_actions[ i ].act_data.refund_includes )			return false;
			if ( original_actions[ i ].act_data.refund_shipping_charges	!== modified_actions[ i ].act_data.refund_shipping_charges )	return false;
			if ( original_actions[ i ].act_data.refund_handling_charges	!== modified_actions[ i ].act_data.refund_handling_charges )	return false;
			if ( original_actions[ i ].act_data.refund_payment_charges	!== modified_actions[ i ].act_data.refund_payment_charges )		return false;
			if ( original_actions[ i ].act_data.refund_tax_charges		!== modified_actions[ i ].act_data.refund_tax_charges )			return false;
			if ( original_actions[ i ].act_data.refund_other_charges	!== modified_actions[ i ].act_data.refund_other_charges )		return false;
			if ( original_actions[ i ].act_data.prorate_discounts		!== modified_actions[ i ].act_data.prorate_discounts )			return false;
			if ( original_actions[ i ].act_data.add_notes				!== modified_actions[ i ].act_data.add_notes )					return false;

			//
			// Loose comparison to avoid string vs number failures
			//

			if ( original_actions[ i ].act_data.capture_dollars_within	!= modified_actions[ i ].act_data.capture_dollars_within )		return false;
		}
		else if ( !compareObjects( original_actions[ i ], modified_actions[ i ] ) )
		{
			return false;
		}
	}

	return true;
}

OWFWorkflow_AddEditDialog.prototype.WorkflowModified_DisplayCancelDiscardSaveDialog = function()
{
	var self = this;
	var dialog, button_save, button_cancel, button_discard;

	dialog 			= new ActionDialog();
	dialog.onESC	= function( e ) { button_cancel.SimulateClick(); };
	dialog.onEnter	= function( e ) { button_save.SimulateClick(); };

	button_cancel	= dialog.Button_Add_Left_Secondary(				'Cancel',	'',	function() { ; } );
	button_discard	= dialog.Button_Add_Right_Negative_Secondary(	'Discard',	'', function() { self.Cancel_LowLevel(); } );
	button_save		= dialog.Button_Add_Right_Primary(				'Save',		'', function() { self.Save(); } );

	dialog.SetTitle( 'Save changes?' );
	dialog.SetMessage( 'Your changes will be lost if you don\'t save them.' );
	dialog.Show();
}

OWFWorkflow_AddEditDialog.prototype.Process_Response_Errors = function( response )
{
	var i, i_len, error, errors;

	errors				= new Object();
	errors.details		= new Array();
	errors.triggers		= new Array();
	errors.conditions	= new Array();
	errors.actions		= new Array();
	errors.overview		= new Array();

	if ( !response.validation_error )
	{
		error				= new Object();
		error.error_field	= '';
		error.error_message	= response.error_message;

		errors.overview.push( error );
	}
	else
	{
		if ( response.input_errors )
		{
			for ( i = 0, i_len = response.error_fields.length; i < i_len; i++ )
			{
				error				= new Object();
				error.error_field	= response.error_fields[ i ].error_field;
				error.error_message	= response.error_fields[ i ].error_message;

				this.Process_Response_Errors_MapErrorToStep( error, errors );
			}
		}
		else if ( response.error_field.length )
		{
			error				= new Object();
			error.error_field	= response.error_field;
			error.error_message	= response.error_field_message;

			this.Process_Response_Errors_MapErrorToStep( error, errors );
		}
	}

	this.Errors( errors );
}

OWFWorkflow_AddEditDialog.prototype.Process_Response_Errors_MapErrorToStep = function( error, errors )
{
	if ( error.error_field === 'Workflow_Name' )							errors.details.push( error );
	else if ( error.error_field === 'Workflow_Enabled' )					errors.details.push( error );
	else if ( error.error_field === 'Workflow_WaitUntilTrue' )				errors.details.push( error );
	else if ( error.error_field === 'Workflow_WaitUntilTrue_Interval' )		errors.details.push( error );
	else if ( error.error_field === 'Workflow_WaitUntilTrue_Maximum' )		errors.details.push( error );
	else if ( error.error_field === 'Workflow_Triggers' )					errors.triggers.push( error );
	else if ( error.error_field === 'Workflow_Conditions' )					errors.conditions.push( error );
	else if ( error.error_field === 'Workflow_Actions' )					errors.actions.push( error );
	else if ( error.error_field.indexOf( 'Workflow_Triggers[' ) === 0 )		errors.triggers.push( error );
	else if ( error.error_field.indexOf( 'Workflow_Conditions[' ) === 0 )	errors.conditions.push( error );
	else if ( error.error_field.indexOf( 'Workflow_Actions[' ) === 0 )		errors.actions.push( error );
	else																	errors.overview.push( error );
}

OWFWorkflow_AddEditDialog.prototype.Errors = function( errors )
{
	if ( errors.details.length )			this.ShowStep( this.step_details );
	else if ( errors.triggers.length )		this.ShowStep( this.step_triggers );
	else if ( errors.conditions.length )	this.ShowStep( this.step_conditions );
	else if ( errors.actions.length )		this.ShowStep( this.step_actions );
	else if ( errors.overview.length )		this.ShowStep( this.step_overview );

	if ( errors.details.length )			this.step_details.SetInvalid( errors.details );
	if ( errors.triggers.length )			this.step_triggers.SetInvalid( errors.triggers );
	if ( errors.conditions.length )			this.step_conditions.SetInvalid( errors.conditions );
	if ( errors.actions.length )			this.step_actions.SetInvalid( errors.actions );
	if ( errors.overview.length )			this.step_overview.SetInvalid( errors.overview );
}

// Override/Callback Functions

OWFWorkflow_AddEditDialog.prototype.onError		= function( error_message ) { new AlertDialog().Show( error_message ); }
OWFWorkflow_AddEditDialog.prototype.onDelete	= function() { ; }
OWFWorkflow_AddEditDialog.prototype.onSave		= function() { ; }

// OWFWorkflow_Step
////////////////////////////////////////////////////

function OWFWorkflow_Step( icon, title )
{
	var self = this;

	this.errors										= new Array();
	this.step_visible								= false;
	this.default_fade_out_duration					= 200;
	this.default_fade_in_duration					= 200;

	this.feature_actionbar_enabled					= false;

	this.feature_titledcontent_enabled				= false;
	this.feature_titledcontent_titlebar_static		= false;
	this.feature_titledcontent_scroll_y				= false;

	this.keystackentry								= KeyDownHandlerStack_GenerateEntry( function( e ) { return self.onEnter_Step( e ); },
																						 function( e ) { return self.onESC_Step( e ); } );

	this.element_container							= newElement( 'span', { 'class': 'workflow_addeditdialog_step' },								null, null );
	this.element_content							= newElement( 'span', { 'class': 'workflow_addeditdialog_step_content' },						null, this.element_container );
	this.element_close_container					= newElement( 'span', { 'class': 'workflow_addeditdialog_step_close_container' },				null, this.element_content );

	this.element_navigationitem						= newElement( 'span', { 'class': 'workflow_addeditdialog_navigationitem' },						null, null );
	this.element_navigationitem_icon				= newElement( 'span', { 'class': 'workflow_addeditdialog_navigationitem_icon mm9_mivaicon' },	null, this.element_navigationitem );
	this.element_navigationitem_title				= newElement( 'span', { 'class': 'workflow_addeditdialog_navigationitem_title' },				null, this.element_navigationitem );
	this.element_navigationitem_badge				= newElement( 'span', { 'class': 'workflow_addeditdialog_navigationitem_badge' },				null, this.element_navigationitem );
	this.element_navigationitem_badge_el1			= newElement( 'span', { 'class': 'workflow_addeditdialog_navigationitem_badge_el1' },			null, this.element_navigationitem_badge );
	this.element_navigationitem_badge_el2			= newElement( 'span', { 'class': 'workflow_addeditdialog_navigationitem_badge_el2' },			null, this.element_navigationitem_badge );

	this.element_scrollbar							= newElement( 'div', { 'class': 'mm9_scrollbar_calculator' },									null, document.body );

	// Scrollbar Dimensions Calculation
	this.scrollbar_width							= this.element_scrollbar.offsetWidth - this.element_scrollbar.clientWidth;
	this.scrollbar_height							= this.element_scrollbar.offsetHeight - this.element_scrollbar.clientHeight;

	this.element_scrollbar.parentNode.removeChild( this.element_scrollbar );

	this.element_container.style.display			= 'none';

	this.element_navigationitem_title.textContent	= title;
	this.element_navigationitem_icon.innerHTML		= MivaIconMap( icon );

	this.element_navigationitem.onclick				= function( event ) { return self.onClick_NavigationItem( event ? event : window.event ); };

	// Controls
	this.button_close								= new MMButton( this.element_close_container );
	this.button_close.SetImage( 'cancel' );
	this.button_close.SetClassName( 'workflow_addeditdialog_step_close_button' );
	this.button_close.SetOnClickHandler( function( e ) { return self.onClick_Close( e ); } );

	// Events
	this.event_render_validation					= function() { self.Render_Validation(); self.render_validation_id = requestAnimationFrame( self.event_render_validation ); };
	this.event_render_titledcontent					= function() { self.Render_TitledContent(); self.render_titledcontent_id = requestAnimationFrame( self.event_render_titledcontent ); };
}

OWFWorkflow_Step.prototype.ContainedElement = function()
{
	return this.element_container;
}

OWFWorkflow_Step.prototype.SetContentParent = function( element_parent )
{
	element_parent.appendChild( this.element_container );
	return this;
}

OWFWorkflow_Step.prototype.SetNavigationParent = function( element_parent )
{
	element_parent.appendChild( this.element_navigationitem );
	return this;
}

OWFWorkflow_Step.prototype.SetValid = function()
{
	if ( this.flag_valid )
	{
		return;
	}

	this.flag_valid							= true;
	this.element_container.className		= classNameAdd( this.element_container, 'valid' );
	this.element_navigationitem.className	= classNameAdd( this.element_navigationitem, 'valid' );

	this.ClearInvalid();
	this.onSetValid();
}

OWFWorkflow_Step.prototype.ClearValid = function()
{
	if ( !this.flag_valid )
	{
		return;
	}

	this.flag_valid							= false;
	this.element_container.className		= classNameRemove( this.element_container, 'valid' );
	this.element_navigationitem.className	= classNameRemove( this.element_navigationitem, 'valid' );

	this.onClearValid();
}

OWFWorkflow_Step.prototype.GetValid = function()
{
	return this.flag_valid;
}

OWFWorkflow_Step.prototype.SetInvalid = function( errors )
{
	//
	// "errors" is an array of error objects containing the members "error_field"
	// and "error_message". The member "error_field" can be any string, including
	// an empty string, and should be matched up to an existing field if possible.
	// The first error_message in the list (since this could be called multiple
	// times) will be set as the displayed popup error message.
	//

	if ( this.flag_invalid )
	{
		return;
	}

	this.errors								= errors;
	this.flag_invalid						= true;
	this.error_message_displayed			= false;
	this.element_container.className		= classNameAdd( this.element_container, 'invalid' );
	this.element_navigationitem.className	= classNameAdd( this.element_navigationitem, 'invalid' );

	this.ClearValid();

	if ( this.step_visible )
	{
		this.DisplayErrors();
	}

	this.onSetInvalid();
}

OWFWorkflow_Step.prototype.ClearInvalid = function()
{
	if ( !this.flag_invalid )
	{
		return;
	}

	this.errors								= new Array();
	this.flag_invalid						= false;
	this.error_message_displayed			= false;
	this.element_container.className		= classNameRemove( this.element_container, 'invalid' );
	this.element_navigationitem.className	= classNameRemove( this.element_navigationitem, 'invalid' );

	this.onClearInvalid();
}

OWFWorkflow_Step.prototype.GetInvalid = function()
{
	return this.flag_invalid;
}

OWFWorkflow_Step.prototype.Validate = function( errors )
{
	//
	// The passed in variable "errors" is an array that can contain
	// a list of "error" objects. These "error" objects can be used
	// to set specific error data when Validate does not return true.
	// The following are acceptable members that can be set on the
	// error object.
	//
	// error				= new Object();
	// error.error_field	= '[field_name]';
	// error.error_message	= '[message]';
	//
	// errors.push( error );
	//

	return true;
}

OWFWorkflow_Step.prototype.SaveData = function()
{
	this.onSaveData();

	return this.workflow;
}

OWFWorkflow_Step.prototype.RestoreData = function( data )
{
	this.workflow = data;

	if ( this.feature_actionbar_enabled )
	{
		this.element_actionbar_name.textContent	= data.name;
	}

	this.onRestoreData();
}

OWFWorkflow_Step.prototype.Begin = function( delay, animationlist )
{
	var self = this;

	// Start Render
	this.render_validation_id					= requestAnimationFrame( this.event_render_validation );

	if ( this.feature_titledcontent_enabled )
	{
		this.render_titledcontent_id			= requestAnimationFrame( this.event_render_titledcontent );
	}

	if ( !Array.isArray( animationlist ) )
	{
		this.element_navigationitem.className	= classNameAdd( this.element_navigationitem, 'selected' );
		this.element_container.style.display	= 'block';

		if ( this.keystackentry )
		{
			KeyDownHandlerStack_AppendEntry( this.keystackentry );
		}

		return 0;
	}

	animationlist.push( createAnimation(
	{
		delay: delay,
		duration: this.default_fade_in_duration,
		delta: animationLinear,
		onstart: function()
		{
			self.element_navigationitem.className	= classNameAdd( self.element_navigationitem, 'selected' );
			self.element_container.style.display	= 'block';
			self.element_container.style.opacity	= 0;
		},
		step: function( delta )
		{
			self.element_container.style.opacity	= delta;
		},
		oncomplete: function()
		{
			self.element_container.style.opacity	= '';

			if ( self.keystackentry )
			{
				KeyDownHandlerStack_AppendEntry( self.keystackentry );
			}
		}
	} ) );

	return this.default_fade_in_duration;
}

OWFWorkflow_Step.prototype.End = function( delay, animationlist )
{
	var self = this;

	this.step_visible = false;

	// Stop Render
	cancelAnimationFrame( this.render_validation_id );
	cancelAnimationFrame( this.render_titledcontent_id );

	if ( !Array.isArray( animationlist ) )
	{
		this.element_navigationitem.className	= classNameRemove( this.element_navigationitem, 'selected' );
		this.element_container.style.display	= 'none';

		if ( this.keystackentry )
		{
			KeyDownHandlerStack_Remove( this.keystackentry );
		}

		return 0;
	}

	animationlist.push( createAnimation(
	{
		delay: delay,
		duration: this.default_fade_out_duration,
		delta: animationLinear,
		onstart: function()
		{
			self.element_navigationitem.className	= classNameRemove( self.element_navigationitem, 'selected' );
			self.element_container.style.display	= 'block';
			self.element_container.style.opacity	= 1;

			if ( self.keystackentry )
			{
				KeyDownHandlerStack_Remove( self.keystackentry );
			}
		},
		step: function( delta )
		{
			self.element_container.style.opacity	= ( 1 - delta );
		},
		oncomplete: function()
		{
			self.element_container.style.display	= 'none';
			self.element_container.style.opacity	= '';
		}
	} ) );

	return this.default_fade_out_duration;
}

OWFWorkflow_Step.prototype.Visible = function()
{
	this.step_visible = true;

	if ( this.errors.length )
	{
		this.DisplayErrors();
	}

	if ( this.feature_actionbar_enabled )
	{
		this.element_actionbar_name_container.style.width = 'calc(100% - ' + this.element_actionbar_buttons_container.offsetWidth + 'px)';
	}

	this.onVisible();
}

OWFWorkflow_Step.prototype.DisplayErrors = function()
{
	var dialog;

	if ( !this.errors.length )
	{
		return;
	}

	this.onDisplayErrors();

	if ( !this.error_message_displayed )
	{
		this.error_message_displayed = true;

		dialog = new AlertDialog();
		dialog.SetTitle( 'Error' );

		if ( this.errors.length > 1 )	dialog.Show( 'One or more fields were improperly filled out' );
		else							dialog.Show( this.errors[ 0 ].error_message );
	}
}

OWFWorkflow_Step.prototype.Render_Validation = function()
{
	;
}

OWFWorkflow_Step.prototype.Render_TitledContent = function()
{
	var scroll_top;

	if ( this.button_scrolltotop )
	{
		if ( this.element_data_container.scrollTop > 0 )	this.button_scrolltotop.Enable();
		else												this.button_scrolltotop.Disable();
	}

	if ( this.element_data_container.scrollHeight > this.element_data_container.clientHeight )
	{
		if ( !this.feature_titledcontent_scroll_y )
		{
			this.feature_titledcontent_scroll_y					= true;
			this.element_titlebar.style.right					= this.scrollbar_width + 'px';
		}
	}
	else
	{
		if ( this.feature_titledcontent_scroll_y )
		{
			this.feature_titledcontent_scroll_y					= false;
			this.element_titlebar.style.right					= '';
		}
	}

	scroll_top = stod_range( -this.element_data_container.scrollTop, -64, 0 )

	if ( scroll_top !== this.last_data_container_scrolltop )
	{
		if ( scroll_top === -64 )
		{
			if ( !this.feature_titledcontent_titlebar_static )
			{
				this.feature_titledcontent_titlebar_static		= true;
				this.element_titlebar.className					= classNameAdd( this.element_titlebar, 'static' );
			}
		}
		else
		{
			if ( this.feature_titledcontent_titlebar_static )
			{
				this.feature_titledcontent_titlebar_static		= false;
				this.element_titlebar.className					= classNameRemove( this.element_titlebar, 'static' );
			}
		}

		this.last_data_container_scrolltop						= scroll_top;
		this.element_titlebar.style.transform					= 'translateY(' + scroll_top + 'px)';
		this.element_close_container.style.transform			= 'translateY(' + scroll_top + 'px)';
	}
}

OWFWorkflow_Step.prototype.onEnter_Step = function( e )
{
	if ( this.button_update )		this.button_update.SimulateClick();
	else if ( this.button_next )	this.button_next.SimulateClick();

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

OWFWorkflow_Step.prototype.onESC_Step = function( e )
{
	return this.onClick_Close( e );
}

// Feature TitledContent

OWFWorkflow_Step.prototype.Feature_TitledContent_Enable = function( title, subtitle )
{
	this.feature_titledcontent_enabled			= true;
	this.titledcontent_animation_id				= GenerateUniqueID();

	this.element_titlebar						= newElement( 'span', { 'class': 'workflow_addeditdialog_step_titlebar' },									null, this.element_content );
	this.element_titlebar_content				= newElement( 'span', { 'class': 'workflow_addeditdialog_step_titlebar_content' },							null, this.element_titlebar );
	this.element_titlebar_title					= newElement( 'span', { 'class': 'workflow_addeditdialog_step_titlebar_title mm10_style_header_font' },		null, this.element_titlebar_content );
	this.element_titlebar_subtitle				= newElement( 'span', { 'class': 'workflow_addeditdialog_step_titlebar_subtitle mm10_style_header_font' },	null, this.element_titlebar_content );
	this.element_titlebar_controls				= newElement( 'span', { 'class': 'workflow_addeditdialog_step_titlebar_controls' },							null, this.element_titlebar_content );
	this.element_data_container					= newElement( 'span', { 'class': 'workflow_addeditdialog_step_data_container' },							null, this.element_content );

	if ( typeof title === 'string' && title.length )		this.element_titlebar_title.textContent		= title;
	if ( typeof subtitle === 'string' && subtitle.length )	this.element_titlebar_subtitle.textContent	= subtitle;
}

OWFWorkflow_Step.prototype.Feature_TitledContent_ScrollToTop = function()
{
	var self = this;
	var scrolltop, animationlist;

	scrolltop			= this.element_data_container.scrollTop;
	animationlist		= new Array();
	animationlist.push( createAnimation(
	{
		delay: 0,
		duration: 200,
		delta: animationLinear,
		step: function( delta )
		{
			self.element_data_container.scrollTop = ( 1 - delta ) * scrolltop;
		},
		oncomplete: function()
		{
			self.element_data_container.scrollTop = 0;
			self.button_scrolltotop.Disable();
		}
	} ) );

	cancelAnimationFrame( window[ this.titledcontent_animation_id ] );
	beginAnimations( animationlist, this.titledcontent_animation_id );
}

OWFWorkflow_Step.prototype.TitleBar_Control_MenuButton_Add = function( image, hover_text )
{
	var menubutton;

	menubutton = new MMMenuButton( '', this.element_titlebar_controls );
	menubutton.SetAnimateMenu( true );
	menubutton.SetMenuAsRootMenu( true );
	menubutton.SetClassName( 'mm10_menubutton_container_style_common' );
	menubutton.SetMenuClassName( 'mm10_menubutton_container_style_common_menu' );
	menubutton.SetButtonClassName( 'mm10_button_style_secondary_borderless icon' );
	menubutton.SetHoverText( hover_text );
	menubutton.SetImage( image );

	return menubutton;
}

OWFWorkflow_Step.prototype.TitleBar_Control_Button_Add = function( image, hover_text )
{
	var button;

	button = new MMButton( this.element_titlebar_controls );
	button.SetImage( image );
	button.SetHoverText( hover_text );
	button.SetClassName( 'mm10_button_style_secondary_borderless icon' );

	return button;
}

OWFWorkflow_Step.prototype.TitleBar_Control_Button_Add_ScrollToTop = function()
{
	var self = this;
	var element_custom;

	element_custom								= newElement( 'span', { 'class': 'workflow_addeditdialog_step_titlebar_control_button_scrolltotop_custom' },		null, null );
	element_custom.element_el1					= newElement( 'span', { 'class': 'workflow_addeditdialog_step_titlebar_control_button_scrolltotop_custom_el1' },	null, element_custom );
	element_custom.element_el2					= newElement( 'span', { 'class': 'workflow_addeditdialog_step_titlebar_control_button_scrolltotop_custom_el2' },	null, element_custom );
	element_custom.element_el3					= newElement( 'span', { 'class': 'workflow_addeditdialog_step_titlebar_control_button_scrolltotop_custom_el3' },	null, element_custom );

	this.button_scrolltotop = new MMButton( this.element_titlebar_controls );
	this.button_scrolltotop.SetHoverText( 'Scroll to top' );
	this.button_scrolltotop.SetCustomContent( element_custom );
	this.button_scrolltotop.SetClassName( 'mm10_button_style_secondary_borderless icon' );
	this.button_scrolltotop.SetOnClickHandler( function( e ) { self.Feature_TitledContent_ScrollToTop(); } );
	this.button_scrolltotop.Disable();

	return this.button_scrolltotop;
}

// Feature ActionBar

OWFWorkflow_Step.prototype.Feature_ActionBar_Enable = function()
{
	var self = this;

	this.feature_actionbar_enabled						= true;

	this.element_actionbar								= newElement( 'span', { 'class': 'workflow_addeditdialog_step_actionbar' },								null, this.element_content );
	this.element_actionbar_name_container				= newElement( 'span', { 'class': 'workflow_addeditdialog_step_actionbar_name_container' },				null, this.element_actionbar );
	this.element_actionbar_name_title					= newElement( 'span', { 'class': 'workflow_addeditdialog_step_actionbar_name_title' },					null, this.element_actionbar_name_container );
	this.element_actionbar_name							= newElement( 'span', { 'class': 'workflow_addeditdialog_step_actionbar_name mm10_style_header_font' },	null, this.element_actionbar_name_container );
	this.element_actionbar_name_edit					= newElement( 'span', { 'class': 'workflow_addeditdialog_step_actionbar_name_edit' },					null, this.element_actionbar_name_container );
	this.element_actionbar_buttons_container			= newElement( 'span', { 'class': 'workflow_addeditdialog_step_actionbar_buttons_container' },			null, this.element_actionbar );

	this.element_actionbar_name_title.textContent		= 'Workflow Name';

	this.button_edit_name								= new MMButton( this.element_actionbar_name_edit );
	this.button_edit_name.SetText( 'Edit' );
	this.button_edit_name.SetClassName( 'mm10_button_style_link' );
	this.button_edit_name.SetOnClickHandler( function( e ) { self.onClick_EditName( e ); } );
}

OWFWorkflow_Step.prototype.ActionBar_Button_Add_Previous = function()
{
	var self = this;

	this.button_previous = new MMButton( this.element_actionbar_buttons_container );
	this.button_previous.SetText( 'Previous' );
	this.button_previous.SetClassName( 'mm10_button_style_secondary' );
	this.button_previous.SetOnClickHandler( function( e ) { self.onClick_Previous( e ); } );
}

OWFWorkflow_Step.prototype.ActionBar_Button_Add_Next = function( primary )
{
	var self = this;

	this.button_next = new MMButton( this.element_actionbar_buttons_container );
	this.button_next.SetText( 'Next' );

	if ( primary )	this.button_next.SetClassName( 'mm10_button_style_primary' );
	else			this.button_next.SetClassName( 'mm10_button_style_secondary' );

	this.button_next.SetOnClickHandler( function( e ) { self.onClick_Next( e ); } );
	this.button_next.Disable();
}

OWFWorkflow_Step.prototype.ActionBar_Button_Add_Delete = function()
{
	var self = this;

	if ( !CanI( 'OWFP', 0, 0, 0, 1 ) )
	{
		return;
	}

	this.button_delete = new MMButton( this.element_actionbar_buttons_container );
	this.button_delete.SetText( 'Delete Workflow' );
	this.button_delete.SetClassName( 'mm10_button_style_negative_muted' );
	this.button_delete.SetOnClickHandler( function( e ) { self.onClick_Delete( e ); } );
}

OWFWorkflow_Step.prototype.ActionBar_Button_Add_Update = function()
{
	var self = this;

	this.button_update = new MMButton( this.element_actionbar_buttons_container );
	this.button_update.SetText( 'Update' );
	this.button_update.SetClassName( 'mm10_button_style_primary' );
	this.button_update.SetOnClickHandler( function( e ) { self.onClick_Update( e ); } );
}

OWFWorkflow_Step.prototype.ActionBar_Button_Add_Create = function()
{
	var self = this;

	this.button_create = new MMButton( this.element_actionbar_buttons_container );
	this.button_create.SetText( 'Create' );
	this.button_create.SetClassName( 'mm10_button_style_primary' );
	this.button_create.SetOnClickHandler( function( e ) { self.onClick_Create( e ); } );
}

// Override Functions: Steps
OWFWorkflow_Step.prototype.onVisible				= function() { ; }
OWFWorkflow_Step.prototype.onSetValid				= function() { ; }
OWFWorkflow_Step.prototype.onClearValid				= function() { ; }
OWFWorkflow_Step.prototype.onSetInvalid				= function() { ; }
OWFWorkflow_Step.prototype.onClearInvalid			= function() { ; }
OWFWorkflow_Step.prototype.onSaveData				= function() { ; }
OWFWorkflow_Step.prototype.onRestoreData			= function() { ; }
OWFWorkflow_Step.prototype.onDisplayErrors			= function() { ; }

// Override Functions: Caller
OWFWorkflow_Step.prototype.onClick_Next				= function( e ) { ; }
OWFWorkflow_Step.prototype.onClick_Close			= function( e ) { ; }
OWFWorkflow_Step.prototype.onClick_Delete			= function( e ) { ; }
OWFWorkflow_Step.prototype.onClick_Create			= function( e ) { ; }
OWFWorkflow_Step.prototype.onClick_Update			= function( e ) { ; }
OWFWorkflow_Step.prototype.onClick_Previous			= function( e ) { ; }
OWFWorkflow_Step.prototype.onClick_NavigationItem	= function( e ) { ; }
OWFWorkflow_Step.prototype.onClick_EditName			= function( e ) { ; }

// OWFWorkflow_Step_Details
////////////////////////////////////////////////////

function OWFWorkflow_Step_Details( editmode )
{
	var self = this;

	OWFWorkflow_Step.call( this, 'details', 'Workflow Info' );

	//
	// Workflow name is displayed and edited in the content of this
	// step. Hide the actionbar's name container on this step so that
	// we're not showing duplicated/outdated data
	//

	this.Feature_ActionBar_Enable();
	this.element_actionbar_name_container.style.display		= 'none';
	this.element_actionbar_name_edit.style.display			= 'none';

	this.element_box										= newElement( 'span', { 'class': 'workflow_addeditdialog_step_details_box' },								null, this.element_content );
	this.element_box_title									= newElement( 'span', { 'class': 'workflow_addeditdialog_step_details_box_title mm10_style_header_font' },	null, this.element_box );
	this.element_box_content								= newElement( 'span', { 'class': 'workflow_addeditdialog_step_details_box_content' },						null, this.element_box );
	this.element_box_action									= newElement( 'span', { 'class': 'workflow_addeditdialog_step_details_box_action' },						null, this.element_box );

	this.element_name_container								= newElement( 'span', { 'class': 'workflow_addeditdialog_step_details_name_container' },					null, this.element_box_content );

	this.element_enabled_container							= newElement( 'span', { 'class': 'workflow_addeditdialog_step_details_enabled' },							null, this.element_box_content );
	this.element_enabled_title								= newElement( 'span', { 'class': 'workflow_addeditdialog_step_details_enabled_title' },						null, this.element_enabled_container );
	this.element_enabled_checkbox_container					= newElement( 'span', { 'class': 'workflow_addeditdialog_step_details_enabled_checkbox' },					null, this.element_enabled_container );

	this.element_wait_container								= newElement( 'span', { 'class': 'workflow_addeditdialog_step_details_wait' },								null, this.element_box_content );
	this.element_wait_title									= newElement( 'span', { 'class': 'workflow_addeditdialog_step_details_wait_title' },						null, this.element_wait_container );
	this.element_wait_for_checkbox_container				= newElement( 'span', { 'class': 'workflow_addeditdialog_step_details_wait_checkbox' },						null, this.element_wait_container );
	this.element_wait_for_content							= newElement( 'span', { 'class': 'workflow_addeditdialog_step_details_wait_for_content' },					null, this.element_wait_container );
	this.element_wait_for_title								= newElement( 'span', { 'class': 'workflow_addeditdialog_step_details_wait_for_title' },					null, this.element_wait_for_content );
	this.element_wait_int_container							= newElement( 'span', { 'class': 'workflow_addeditdialog_step_details_wait_int_container' },				null, this.element_wait_for_content );
	this.element_wait_int									= newElement( 'span', { 'class': 'workflow_addeditdialog_step_details_wait_int' },							null, this.element_wait_int_container );
	this.element_wait_max_container							= newElement( 'span', { 'class': 'workflow_addeditdialog_step_details_wait_max_container' },				null, this.element_wait_for_content );
	this.element_wait_max									= newElement( 'span', { 'class': 'workflow_addeditdialog_step_details_wait_max' },							null, this.element_wait_max_container );

	// User Input Fields
	this.input_name											= new MMInput( this.element_name_container, '', '' );
	this.input_name.onValidate								= function( value ) { return this.Validate_String_NonEmpty_WithMaxLength( 254 ); };
	this.input_name.SetTitle( 'Workflow Name' );
	this.input_name.SetClassName( 'mm_input_common medium whole_width title_visible' );
	this.input_name.SetOnEnterHandler( function( e ) { return self.onEnter_Step( e ); } );

	this.checkbox_enabled									= new MMCheckBoxSlider( true, this.element_enabled_checkbox_container );
	this.checkbox_enabled.SetOnChangeHandler( function( checked ) { self.MMCheckBoxSlider_OnChange_WorkflowEnabled( checked ); } );

	this.checkbox_wait_for									= new MMCheckBoxSlider( false, this.element_wait_for_checkbox_container );
	this.checkbox_wait_for.SetOnChangeHandler( function( checked ) { self.MMCheckBoxSlider_OnChange_WaitUntilTrueEnabled( checked ); } );

	this.input_wait_int										= new MMInput( this.element_wait_int, 'WaitUntilTrue_Interval', '' );
	this.input_wait_int.onValidate							= function( value ) { return this.Validate_WholeNumber_GreaterThan( 0 ) };
	this.input_wait_int.Disable();
	this.input_wait_int.SetTitle( 'Interval' );
	this.input_wait_int.SetLabel( 'min' );
	this.input_wait_int.SetClassName( 'mm_input_common whole_width title_visible label_visible' );
	this.input_wait_int.SetOnEnterHandler( function( e ) { return self.onEnter_Step( e ); } );

	this.input_wait_max										= new MMInput( this.element_wait_max, 'WaitUntilTrue_Maximum', '' );
	this.input_wait_max.onValidate							= function( value ) { return this.Validate_WholeNumber_GreaterThan( 0 ) };
	this.input_wait_max.Disable();
	this.input_wait_max.SetTitle( 'Maximum' );
	this.input_wait_max.SetLabel( 'min' );
	this.input_wait_max.SetClassName( 'mm_input_common whole_width title_visible label_visible' );
	this.input_wait_max.SetOnEnterHandler( function( e ) { return self.onEnter_Step( e ); } );

	this.element_box_title.textContent						= 'Create Your Workflow';
	this.element_enabled_title.textContent					= 'Workflow: Enabled';
	this.element_wait_title.textContent						= 'Wait Until True';
	this.element_wait_for_title.textContent					= 'When enabled, this workflow will be rerun every [interval] minutes until the defined conditions are met or the [maximum] minutes threshold is reached.';

	// Variables
	this.name_has_empty_class								= true;

	if ( editmode )
	{
		this.ActionBar_Button_Add_Next( false );
		this.ActionBar_Button_Add_Update();
	}
	else
	{
		this.ActionBar_Button_Add_Next( true );
	}
}

DeriveFrom( OWFWorkflow_Step, OWFWorkflow_Step_Details );

OWFWorkflow_Step_Details.prototype.Validate = function( errors )
{
	var error, validation_error;

	validation_error = new Object();

	if ( !this.input_name.Validate_String_NonEmpty_WithMaxLength_Silent( 254, validation_error ) )
	{
		error				= new Object();
		error.error_field	= 'Workflow_Name';
		error.error_message	= validation_error.error_message;

		errors.push( error );
	}

	if ( this.checkbox_wait_for.GetChecked() )
	{
		validation_error = new Object();

		if ( !this.input_wait_int.Validate_WholeNumber_GreaterThan_Silent( 0, validation_error ) )
		{
			error				= new Object();
			error.error_field	= 'Workflow_WaitUntilTrue_Interval';
			error.error_message	= validation_error.error_message;

			errors.push( error );
		}

		validation_error = new Object();

		if ( !this.input_wait_max.Validate_WholeNumber_GreaterThan_Silent( 0, validation_error ) )
		{
			error				= new Object();
			error.error_field	= 'Workflow_WaitUntilTrue_Maximum';
			error.error_message	= validation_error.error_message;

			errors.push( error );
		}
	}

	if ( errors.length )
	{
		return false;
	}

	return true;
}

OWFWorkflow_Step_Details.prototype.onSetValid = function()
{
	this.button_next.Enable();
}

OWFWorkflow_Step_Details.prototype.onClearValid = function()
{
	this.button_next.Disable();
}

OWFWorkflow_Step_Details.prototype.onDisplayErrors = function()
{
	var i, i_len;

	for ( i = 0, i_len = this.errors.length; i < i_len; i++ )
	{
		if ( this.errors[ i ].error_field === 'Workflow_Name' )							this.input_name.SetInvalid( this.errors[ i ].error_message );
		else if ( this.errors[ i ].error_field === 'Workflow_WaitUntilTrue_Interval' )	this.input_wait_int.SetInvalid( this.errors[ i ].error_message );
		else if ( this.errors[ i ].error_field === 'Workflow_WaitUntilTrue_Maximum' )	this.input_wait_max.SetInvalid( this.errors[ i ].error_message );
	}
}

OWFWorkflow_Step_Details.prototype.onSaveData = function()
{
	this.workflow.name		= this.input_name.GetValue();
	this.workflow.enabled	= this.checkbox_enabled.GetChecked();
	this.workflow.wait_for	= this.checkbox_wait_for.GetChecked();
	this.workflow.wait_int	= stoi( this.input_wait_int.GetValue() );
	this.workflow.wait_max	= stoi( this.input_wait_max.GetValue() );
}

OWFWorkflow_Step_Details.prototype.onRestoreData = function()
{
	this.input_name.SetValue( this.workflow.name );
	this.checkbox_enabled.SetChecked( this.workflow.enabled );
	this.checkbox_wait_for.SetChecked( this.workflow.wait_for );
	this.input_wait_int.SetValue( this.workflow.wait_int );
	this.input_wait_max.SetValue( this.workflow.wait_max );

	this.MMCheckBoxSlider_OnChange_WorkflowEnabled( this.checkbox_enabled.GetChecked() );
	this.MMCheckBoxSlider_OnChange_WaitUntilTrueEnabled( this.checkbox_wait_for.GetChecked() );
}

OWFWorkflow_Step_Details.prototype.onVisible = function()
{
	this.input_name.Focus();
}

OWFWorkflow_Step_Details.prototype.MMCheckBoxSlider_OnChange_WorkflowEnabled = function( checked )
{
	this.element_enabled_title.textContent = 'Workflow: ' + ( checked ? 'Enabled' : 'Disabled' );
}

OWFWorkflow_Step_Details.prototype.MMCheckBoxSlider_OnChange_WaitUntilTrueEnabled = function( checked )
{
	this.element_wait_title.textContent				= 'Wait Until True: ' + ( checked ? 'Enabled' : 'Disabled' );
	this.element_wait_for_content.style.opacity		= checked ? '1' : '0';

	if ( checked )
	{
		this.input_wait_int.Enable();
		this.input_wait_max.Enable();
	}
	else
	{
		this.input_wait_int.Disable();
		this.input_wait_max.Disable();
	}
}

OWFWorkflow_Step_Details.prototype.Render_Validation = function()
{
	var focus_element = getFocusElement();

	if ( !this.step_visible )
	{
		return;
	}

	if ( this.name_has_empty_class && ( focus_element === this.input_name.element_input || this.input_name.GetValue().length > 0 ) )
	{
		this.name_has_empty_class = false;
	}
	else if ( !this.name_has_empty_class && focus_element !== this.input_name.element_input && this.input_name.GetValue().length === 0 )
	{
		this.name_has_empty_class = true;
	}

	if ( this.input_name.GetValue().length === 0 ||
		 this.input_name.GetInvalid() ||
		 ( this.checkbox_wait_for.GetChecked() && ( this.input_wait_int.GetInvalid() || this.input_wait_max.GetInvalid() ) ) )
	{
		this.ClearValid();
	}
	else
	{
		this.SetValid();
	}
}

// OWFWorkflow_Step_Triggers
////////////////////////////////////////////////////

function OWFWorkflow_Step_Triggers( editmode )
{
	var i, i_len, item;

	OWFWorkflow_Step.call( this, 'triggers', 'Triggers' );

	this.Feature_TitledContent_Enable( 'Triggers', 'Select all that apply' );
	this.Feature_ActionBar_Enable();

	// Variables
	this.triggers					= OWFWorkflow_AvailableTriggers();
	this.itemlist_triggers			= new Array();
	this.itemlist_selectedtriggers	= new Array();

	// Elements
	this.element_triggers_wrapper	= newElement( 'span', { 'class': 'workflow_addeditdialog_step_triggers_triggers_wrapper' }, null, this.element_data_container );

	this.TitleBar_Control_Button_Add_ScrollToTop();

	for ( i = 0, i_len = this.triggers.length; i < i_len; i++ )
	{
		item = this.TriggerList_Append();
		item.SetValue( this.triggers[ i ] );
	}

	if ( editmode )
	{
		this.ActionBar_Button_Add_Previous();
		this.ActionBar_Button_Add_Next( false );
		this.ActionBar_Button_Add_Update();
	}
	else
	{
		this.ActionBar_Button_Add_Previous();
		this.ActionBar_Button_Add_Next( true );
	}
}

DeriveFrom( OWFWorkflow_Step, OWFWorkflow_Step_Triggers );

OWFWorkflow_Step_Triggers.prototype.Validate = function( errors )
{
	var error;

	if ( this.itemlist_selectedtriggers.length === 0 )
	{
		error				= new Object();
		error.error_field	= '';
		error.error_message	= 'Please add at least one trigger';

		errors.push( error );
	}

	if ( errors.length )
	{
		return false;
	}

	return true;
}

OWFWorkflow_Step_Triggers.prototype.onSetValid = function()
{
	this.button_next.Enable();
}

OWFWorkflow_Step_Triggers.prototype.onClearValid = function()
{
	this.button_next.Disable();
}

OWFWorkflow_Step_Triggers.prototype.onSaveData = function()
{
	this.workflow.triggers	= this.GetTriggers();
}

OWFWorkflow_Step_Triggers.prototype.onRestoreData = function()
{
	this.SetTriggers( this.workflow.triggers );
}

OWFWorkflow_Step_Triggers.prototype.SetTriggers = function( triggers )
{
	var i, i_len, item, item_trigger;

	this.Trigger_Selection_Empty();

	for ( i = 0, i_len = this.itemlist_triggers.length; i < i_len; i++ )
	{
		item			= this.itemlist_triggers[ i ];
		item_trigger	= item.GetValue();

		if ( triggers.indexOf( item_trigger.code ) === -1 )	item.Deselect();
		else												item.Select();
	}
}

OWFWorkflow_Step_Triggers.prototype.GetTriggers = function()
{
	var i, i_len, item, triggers, item_trigger;

	triggers = new Array();

	for ( i = 0, i_len = this.itemlist_selectedtriggers.length; i < i_len; i++ )
	{
		item			= this.itemlist_selectedtriggers[ i ];
		item_trigger	= item.GetValue();

		triggers.push( item_trigger.code );
	}

	return triggers;
}

OWFWorkflow_Step_Triggers.prototype.TriggerList_Append = function()
{
	var self = this;
	var item;

	item			= new OWFWorkflow_Step_Triggers_TriggerItem( this.element_triggers_wrapper );
	item.onSelect	= function() { self.Trigger_OnSelect( item ); };
	item.onDeselect	= function() { self.Trigger_OnDeselect( item ); };

	this.itemlist_triggers.push( item );

	return item;
}

OWFWorkflow_Step_Triggers.prototype.Trigger_Selection_Empty = function()
{
	var i, i_len, items;

	items = this.itemlist_selectedtriggers.slice();

	for ( i = 0, i_len = items.length; i < i_len; i++ )
	{
		items[ i ].Deselect();
	}

	this.itemlist_selectedtriggers = new Array();
}

OWFWorkflow_Step_Triggers.prototype.Trigger_OnSelect = function( item )
{
	if ( this.itemlist_selectedtriggers.indexOf( item ) === -1 )
	{
		this.itemlist_selectedtriggers.push( item );
	}
}

OWFWorkflow_Step_Triggers.prototype.Trigger_OnDeselect = function( item )
{
	var index;

	if ( ( index = this.itemlist_selectedtriggers.indexOf( item ) ) !== -1 )
	{
		this.itemlist_selectedtriggers.splice( index, 1 );
	}
}

OWFWorkflow_Step_Triggers.prototype.Render_Validation = function()
{
	if ( !this.step_visible )
	{
		return;
	}

	if ( this.itemlist_selectedtriggers.length === 0 )
	{
		this.ClearValid();
	}
	else if ( this.itemlist_selectedtriggers.length > 0 )
	{
		this.SetValid();
	}
}

// OWFWorkflow_Step_Triggers_TriggerItem
////////////////////////////////////////////////////

function OWFWorkflow_Step_Triggers_TriggerItem( element_parent )
{
	var self = this;

	// Variables
	this.trigger					= null;
	this.selected					= false;
	this.selectable					= true;
	this.event_onclick_selection	= function( event ) { return self.Event_OnClick_Selection( event ? event : window.event ); };

	// Elements
	this.element_container			= newElement( 'span', { 'class': 'workflow_addeditdialog_step_triggers_triggeritem' },				null, element_parent );
	this.element_checkbox			= newElement( 'span', { 'class': 'workflow_addeditdialog_step_triggers_triggeritem_checkbox_container mm9_mivaicon icon-checkmark' },
																																		null, this.element_container );
	this.element_trigger			= newElement( 'span', { 'class': 'workflow_addeditdialog_step_triggers_triggeritem_trigger' },		null, this.element_container );

	// Events
	AddEvent( this.element_container, 'click', this.event_onclick_selection );
}

OWFWorkflow_Step_Triggers_TriggerItem.prototype.SetValue = function( trigger )
{
	this.trigger						= trigger;
	this.element_trigger.textContent	= trigger.name;
}

OWFWorkflow_Step_Triggers_TriggerItem.prototype.GetValue = function()
{
	return this.trigger;
}

OWFWorkflow_Step_Triggers_TriggerItem.prototype.SetSelectable = function( selectable )
{
	this.selectable	= selectable;

	if ( this.selected )
	{
		this.Deselect();
	}

	return this;
}

OWFWorkflow_Step_Triggers_TriggerItem.prototype.Toggle_Selection = function()
{
	if ( this.selected )	this.Deselect();
	else					this.Select();
}

OWFWorkflow_Step_Triggers_TriggerItem.prototype.Select = function()
{
	if ( !this.selectable )
	{
		return;
	}

	this.selected						= true;
	this.element_container.className	= classNameAdd( this.element_container, 'selected' );

	this.onSelect();
}

OWFWorkflow_Step_Triggers_TriggerItem.prototype.Deselect = function()
{
	this.selected						= false;
	this.element_container.className	= classNameRemove( this.element_container, 'selected' );

	this.onDeselect();
}

OWFWorkflow_Step_Triggers_TriggerItem.prototype.Selected = function()
{
	return this.selected;
}

OWFWorkflow_Step_Triggers_TriggerItem.prototype.Event_OnClick_Selection = function( e )
{
	this.Toggle_Selection();

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

OWFWorkflow_Step_Triggers_TriggerItem.prototype.onSelect	= function() { ; }
OWFWorkflow_Step_Triggers_TriggerItem.prototype.onDeselect	= function() { ; }

// OWFWorkflow_Step_Conditions
////////////////////////////////////////////////////

function OWFWorkflow_Step_Conditions( editmode )
{
	var self = this;
	var element_custom;

	OWFWorkflow_Step.call( this, 'conditions', 'Conditions' );

	this.Feature_TitledContent_Enable( 'Conditions', '' );
	this.Feature_ActionBar_Enable();

	// Variables
	this.root_group												= null;
	this.last_focus_element										= null;
	this.conditions												= new Array();
	this.selected_conditions									= new Array();
	this.min_wait												= true;
	this.can_set_valid											= false;
	this.draganddrop_active										= null;
	this.draganddrop_parent										= null;
	this.draganddrop_index										= -1;
	this.draganddrop_selection									= new Array();
	this.draganddrop_animation_id								= GenerateUniqueID();

	// Elements
	this.element_conditions_wrapper								= newElement( 'span', { 'class': 'workflow_addeditdialog_step_conditions_conditions_wrapper' },							null, this.element_data_container );
	this.element_condition_empty_message						= newElement( 'span', { 'class': 'workflow_addeditdialog_step_conditions_condition_empty_message' },					null, null );
	this.element_condition_empty_message_buttons_container		= newElement( 'span', { 'class': 'workflow_addeditdialog_step_conditions_condition_empty_message_buttons_container' },	null, this.element_condition_empty_message );
	this.element_condition_empty_message_text					= newElement( 'span', { 'class': 'workflow_addeditdialog_step_conditions_condition_empty_message_text' },				null, this.element_condition_empty_message );

	this.element_condition_empty_message_text.textContent		= 'When no conditions are present, actions will be applied to all triggered orders.';

	// Top Controls
	this.menubutton_add											= this.TitleBar_Control_MenuButton_Add( 'add', 'Add' );
	this.menubutton_add.Menu_Append_Item( 'Condition',			function( event ) { self.Event_OnClick_AddExpression( event ? event : window.event ); } );
	this.menubutton_add.Menu_Append_Item( 'List Condition',		function( event ) { self.Event_OnClick_AddArrayGroup( event ? event : window.event ); } );

	this.menubutton_group										= this.TitleBar_Control_MenuButton_Add( 'group', 'Group' );
	this.menubutton_group.Menu_Append_Item( 'Group by: AND',	function( event ) { self.Condition_Selection_GroupBy_AND(); } );
	this.menubutton_group.Menu_Append_Item( 'Group by: OR',		function( event ) { self.Condition_Selection_GroupBy_OR(); } );
	this.menubutton_group.ContainedButton().Disable();

	this.button_ungroup											= this.TitleBar_Control_Button_Add( 'ungroup', 'Ungroup' );
	this.button_ungroup.SetOnClickHandler( function( e ) { self.Condition_Selection_Ungroup(); } );
	this.button_ungroup.Disable();

	this.button_deselect										= this.TitleBar_Control_Button_Add( 'cancel', 'Deselect' );
	this.button_deselect.SetOnClickHandler( function( e ) { self.Condition_Selection_Empty(); } );
	this.button_deselect.Disable();

	this.button_delete											= this.TitleBar_Control_Button_Add( 'delete', 'Delete' );
	this.button_delete.SetOnClickHandler( function( e ) { self.Condition_Selection_Delete(); } );
	this.button_delete.Disable();

	this.TitleBar_Control_Button_Add_ScrollToTop();

	// Empty Message Buttons
	element_custom												= newElement( 'span', { 'class': 'workflow_addeditdialog_step_conditions_empty_message_button_custom' },			null, null );
	element_custom.element_icon									= newElement( 'span', { 'class': 'workflow_addeditdialog_step_conditions_empty_message_button_custom_icon mm9_mivaicon icon-circle_add' },
																																													null, element_custom );
	element_custom.element_text									= newElement( 'span', { 'class': 'workflow_addeditdialog_step_conditions_empty_message_button_custom_text' },		null, element_custom );
	element_custom.element_subtext								= newElement( 'span', { 'class': 'workflow_addeditdialog_step_conditions_empty_message_button_custom_subtext' },	null, element_custom );

	element_custom.element_text.textContent						= 'Add a condition';
	element_custom.element_subtext.textContent					= 'matches against a single data field';

	this.button_emptymessage_addexpression						= new MMButton( this.element_condition_empty_message_buttons_container );
	this.button_emptymessage_addexpression.SetCustomContent( element_custom );
	this.button_emptymessage_addexpression.SetClassName( 'workflow_addeditdialog_step_conditions_empty_message_button' );
	this.button_emptymessage_addexpression.SetOnClickHandler( function( e ) { self.Event_OnClick_AddExpression( e ); } );

	element_custom												= newElement( 'span', { 'class': 'workflow_addeditdialog_step_conditions_empty_message_button_custom' },			null, null );
	element_custom.element_icon									= newElement( 'span', { 'class': 'workflow_addeditdialog_step_conditions_empty_message_button_custom_icon mm9_mivaicon icon-circle_add' },
																																													null, element_custom );
	element_custom.element_text									= newElement( 'span', { 'class': 'workflow_addeditdialog_step_conditions_empty_message_button_custom_text' },		null, element_custom );
	element_custom.element_subtext								= newElement( 'span', { 'class': 'workflow_addeditdialog_step_conditions_empty_message_button_custom_subtext' },	null, element_custom );

	element_custom.element_text.textContent						= 'Add a list condition';
	element_custom.element_subtext.textContent					= 'match against an array of data';

	this.button_emptymessage_addarraygroup						= new MMButton( this.element_condition_empty_message_buttons_container );
	this.button_emptymessage_addarraygroup.SetCustomContent( element_custom );
	this.button_emptymessage_addarraygroup.SetClassName( 'workflow_addeditdialog_step_conditions_empty_message_button' );
	this.button_emptymessage_addarraygroup.SetOnClickHandler( function( e ) { self.Event_OnClick_AddArrayGroup( e ); } );

	if ( editmode )
	{
		this.ActionBar_Button_Add_Previous();
		this.ActionBar_Button_Add_Next( false );
		this.ActionBar_Button_Add_Update();
	}
	else
	{
		this.ActionBar_Button_Add_Previous();
		this.ActionBar_Button_Add_Next( true );
	}
}

DeriveFrom( OWFWorkflow_Step, OWFWorkflow_Step_Conditions );

OWFWorkflow_Step_Conditions.prototype.Validate = function( errors )
{
	var i, i_len, error;

	for ( i = 0, i_len = this.conditions.length; i < i_len; i++ )
	{
		if ( this.conditions[ i ] instanceof OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup || this.conditions[ i ] instanceof OWFWorkflow_Step_Conditions_ConditionItem_Expression )
		{
			if ( this.conditions[ i ].GetInvalid_Field() )
			{
				error				= new Object();
				error.error_field	= this.Validate_BuildErrorPath( this.conditions[ i ] ) + ':field';
				error.error_message	= this.conditions[ i ].GetInvalidMessage_Field();

				errors.push( error );
			}
			else if ( this.conditions[ i ].GetField().length === 0 )
			{
				error				= new Object();
				error.error_field	= this.Validate_BuildErrorPath( this.conditions[ i ] ) + ':field';
				error.error_message	= 'Field cannot be empty';

				errors.push( error );
			}

			if ( this.conditions[ i ].GetInvalid_Operator() )
			{
				error				= new Object();
				error.error_field	= this.Validate_BuildErrorPath( this.conditions[ i ] ) + ':operator';
				error.error_message	= this.conditions[ i ].GetInvalidMessage_Operator();

				errors.push( error );
			}
			else if ( !this.conditions[ i ].GetOperator() || this.conditions[ i ].GetOperator().length === 0 )
			{
				error				= new Object();
				error.error_field	= this.Validate_BuildErrorPath( this.conditions[ i ] ) + ':operator';
				error.error_message	= 'Please select an operator';

				errors.push( error );
			}

			if ( this.conditions[ i ] instanceof OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup && !this.conditions[ i ].Conditions().length )
			{
				error				= new Object();
				error.error_field	= this.Validate_BuildErrorPath( this.conditions[ i ] ) + ':value';
				error.error_message	= 'List Condition must contain at least one child';

				errors.push( error );
			}
		}
	}

	if ( errors.length )
	{
		return false;
	}

	return true;
}

OWFWorkflow_Step_Conditions.prototype.Validate_BuildErrorPath = function( condition )
{
	var i, i_len, error_path, path_to_condition;

	//
	// Build path to root to match JSON error output format:
	// Workflow_Conditions[ grandparent_index ][ parent_index ][ index ]...
	//

	path_to_condition	= condition.PathToCondition();
	error_path			= 'Workflow_Conditions';

	for ( i = 1, i_len = path_to_condition.length; i < i_len; i++ )
	{
		error_path		+= '[' + ( stoi_def_nonneg( path_to_condition[ i ].Parent_IndexOfCondition(), 0 ) + 1 ) + ']';
	}

	return error_path;
}

OWFWorkflow_Step_Conditions.prototype.onSetValid = function()
{
	this.button_next.Enable();
}

OWFWorkflow_Step_Conditions.prototype.onClearValid = function()
{
	this.button_next.Disable();
}

OWFWorkflow_Step_Conditions.prototype.onDisplayErrors = function()
{
	var i, i_len;

	for ( i = 0, i_len = this.errors.length; i < i_len; i++ )
	{
		if ( this.errors[ i ].error_field.indexOf( 'Workflow_Conditions[' ) === 0 )
		{
			this.onDisplayErrors_Condition_SetInvalid_FromError( this.errors[ i ] );
		}
	}
}

OWFWorkflow_Step_Conditions.prototype.onDisplayErrors_Condition_SetInvalid_FromError = function( error )
{
	var i, i_len, match, condition, field_name, regex_index, regex_field, index_path_list;

	regex_index		= new RegExp( '\\[(?:\\s)*(\\d+)(?:\\s)*\\]', 'g' );
	regex_field		= new RegExp( '.*:(.*?)$', '' );
	index_path_list	= new Array();
	field_name		= '';

	while ( ( match = regex_index.exec( error.error_field ) ) !== null )
	{
		index_path_list.push( stoi_def_nonneg( match[ 1 ], -1 ) );
	}

	if ( ( match = regex_field.exec( error.error_field ) ) !== null )
	{
		field_name = match[ 1 ];
	}

	if ( index_path_list.length === 0 || typeof field_name !== 'string' || field_name.length === 0 )
	{
		return;
	}

	condition = this.root_group;

	for ( i = 0, i_len = index_path_list.length; i < i_len; i++ )
	{
		if ( index_path_list[ i ] === -1 )
		{
			return;
		}

		if ( ( condition = condition.Condition_AtIndex( index_path_list[ i ] - 1 ) ) === null )
		{
			return;
		}

		if ( i === ( i_len - 1 ) )
		{
			if ( condition instanceof OWFWorkflow_Step_Conditions_ConditionItem_Expression ||
				 condition instanceof OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup )
			{
				if ( field_name === 'field' )			condition.SetInvalid_Field( error.error_message );
				else if ( field_name === 'operator' )	condition.SetInvalid_Operator( error.error_message );
				else if ( field_name === 'value' )		condition.SetInvalid_Value( error.error_message );
			}

			return;
		}
		else if ( !( condition instanceof OWFWorkflow_Step_Conditions_ConditionItem_Group ) )
		{
			return;
		}
	}
}

OWFWorkflow_Step_Conditions.prototype.onSaveData = function()
{
	this.workflow.cond = this.GetConditions();
}

OWFWorkflow_Step_Conditions.prototype.onRestoreData = function()
{
	this.SetConditions( this.workflow.cond );
}

OWFWorkflow_Step_Conditions.prototype.Begin = function( delay, animationlist )
{
	var self = this;
	var return_delay = OWFWorkflow_Step.prototype.Begin.call( this, delay, animationlist );

	if ( this.min_wait )
	{
		this.min_wait = false;

		animationlist.push( createAnimation(
		{
			delay: return_delay,
			duration: 500,
			delta: animationLinear,
			step: function( delta )
			{
				;
			},
			oncomplete: function()
			{
				self.can_set_valid = true;
			}
		} ) );
	}

	return return_delay;
}

OWFWorkflow_Step_Conditions.prototype.GetAvailableColors = function()
{
	return [ '#11c7ab', '#ff6b50', '#791ad6', '#6a6e79', '#ffa700',
			 '#d10d9c', '#78f0de', '#ff9d8b', '#a66fff', '#8b8f98',
			 '#72dba7', '#ffcc6a', '#db5fba', '#009b83', '#d0381c',
			 '#562b80', '#27935d', '#e27100', '#a81681', '#2c766b',
			 '#7b1c0b', '#2f0a53', '#106f40', '#8d4600', '#64084b' ];
}

OWFWorkflow_Step_Conditions.prototype.SetConditions = function( conditions )
{
	this.conditions								= new Array();
	this.selected_conditions					= new Array();
	this.element_conditions_wrapper.innerHTML	= '';
	this.root_group								= this.Condition_Insert_Group_AND( null, -1 );
	this.root_group.SetParentNode( this.element_conditions_wrapper );
	this.root_group.SetSelection_Disabled();
	this.root_group.SetDragAndDrop_Disabled();
	this.root_group.SetSelectable( false );

	if ( ( conditions.length === 1 )						&&
		 ( !conditions[ 0 ].hasOwnProperty( 'field' ) )		&&
		 ( typeof conditions[ 0 ].operator === 'string' )	&&
		 ( conditions[ 0 ].operator.toUpperCase() === 'OR' ) )
	{
		this.root_group.SetGroupType( 'OR' );
		this.SetConditions_LowLevel( this.root_group, conditions[ 0 ].value );
	}
	else
	{
		this.root_group.SetGroupType( 'AND' );
		this.SetConditions_LowLevel( this.root_group, conditions );
	}

	if ( this.conditions.length <= 1 )
	{
		this.element_data_container.appendChild( this.element_condition_empty_message );
	}

	this.ConditionList_UpdateColors();
	this.EnableDisableButtons();
}

OWFWorkflow_Step_Conditions.prototype.SetConditions_LowLevel = function( parent_condition, conditions )
{
	var i, i_len, operator, condition;

	//
	// We are not attempting to validate here. Blindly add the conditions, even
	// if they have invalid values. We'll catch invalid values when you attempt
	// to create or update. This prevents entries from disappearing if
	// they're invalid.
	//

	for ( i = 0, i_len = conditions.length; i < i_len; i++ )
	{
		operator = typeof conditions[ i ].operator === 'string' ? conditions[ i ].operator.toUpperCase() : conditions[ i ].operator;

		if ( !conditions[ i ].hasOwnProperty( 'field' ) )
		{
			if ( operator === 'OR' )	condition = this.Condition_Insert_Group_OR( parent_condition, -1 );
			else						condition = this.Condition_Insert_Group_AND( parent_condition, -1 );

			this.SetConditions_LowLevel( condition, conditions[ i ].value );
		}
		else if ( conditions[ i ].hasOwnProperty( 'field' ) && Array.isArray( conditions[ i ].value ) )
		{
			//
			// Array Group children are always joined with 'AND'. If only
			// one condition exists, and that condition is an 'OR', ignore
			// the first child and set the group type to 'OR' (display only)
			//

			condition = this.Condition_Insert_ArrayGroup( parent_condition, -1 );
			condition.SetField( conditions[ i ].field );
			condition.SetOperator( operator );

			if ( ( conditions[ i ].value.length === 1 )							&&
				 ( !conditions[ i ].value[ 0 ].hasOwnProperty( 'field' ) )		&&
				 ( typeof conditions[ i ].value[ 0 ].operator === 'string' )	&&
				 ( conditions[ i ].value[ 0 ].operator.toUpperCase() === 'OR' ) )
			{
				condition.SetGroupType( 'OR' );
				this.SetConditions_LowLevel( condition, conditions[ i ].value[ 0 ].value );
			}
			else
			{
				condition.SetGroupType( 'AND' );
				this.SetConditions_LowLevel( condition, conditions[ i ].value );
			}
		}
		else
		{
			condition = this.Condition_Insert_Expression( parent_condition, -1 );
			condition.SetField( conditions[ i ].field );
			condition.SetOperator( operator );
			condition.SetValue( typeof conditions[ i ].value === 'undefined' ? '' : conditions[ i ].value );
		}
	}
}

OWFWorkflow_Step_Conditions.prototype.GetConditions = function()
{
	var output_condition;

	if ( this.root_group.GetGroupType() === 'AND' )
	{
		return this.GetConditions_LowLevel( this.root_group );
	}

	output_condition			= new Object();
	output_condition.operator	= 'OR';
	output_condition.value		= this.GetConditions_LowLevel( this.root_group );

	return [ output_condition ];
}

OWFWorkflow_Step_Conditions.prototype.GetConditions_LowLevel = function( conditiongroup )
{
	var i, i_len, result, condition, output_condition, adjusted_condition;

	result = new Array();

	for ( i = 0, i_len = conditiongroup.Condition_Count(); i < i_len; i++ )
	{
		if ( ( condition = conditiongroup.Condition_AtIndex( i ) ) === null )
		{
			continue;
		}

		if ( condition instanceof OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup )
		{
			output_condition				= new Object();
			output_condition.field			= condition.GetField();
			output_condition.operator		= condition.GetOperator();

			if ( condition.GetGroupType() === 'AND' )
			{
				output_condition.value		= this.GetConditions_LowLevel( condition );
			}
			else
			{
				adjusted_condition			= new Object();
				adjusted_condition.operator	= 'OR';
				adjusted_condition.value	= this.GetConditions_LowLevel( condition );

				output_condition.value		= [ adjusted_condition ];
			}

			result.push( output_condition );
		}
		else if ( condition instanceof OWFWorkflow_Step_Conditions_ConditionItem_Group )
		{
			output_condition				= new Object();
			output_condition.operator		= condition.GetGroupType() === 'AND' ? 'AND' : 'OR';
			output_condition.value			= this.GetConditions_LowLevel( condition );

			result.push( output_condition );
		}
		else if ( condition instanceof OWFWorkflow_Step_Conditions_ConditionItem_Expression )
		{
			output_condition				= new Object();
			output_condition.field			= condition.GetField();
			output_condition.operator		= condition.GetOperator();

			if ( output_condition.operator !== 'TRUE'	&&
				 output_condition.operator !== 'FALSE'	&&
				 output_condition.operator !== 'NULL'	&&
				 output_condition.operator !== 'NOTNULL' )
			{
				output_condition.value	= condition.GetValue();
			}

			if ( typeof output_condition.value === 'string' && output_condition.value.length === 0 )
			{
				delete output_condition.value;
			}

			result.push( output_condition );
		}
	}

	return result;
}

OWFWorkflow_Step_Conditions.prototype.Condition_Selection_Empty = function()
{
	var i, i_len, conditions;

	conditions = this.selected_conditions.slice();

	for ( i = 0, i_len = conditions.length; i < i_len; i++ )
	{
		conditions[ i ].Deselect();
	}

	this.EnableDisableButtons();
}

OWFWorkflow_Step_Conditions.prototype.Condition_Selection_GroupBy_AND = function()
{
	var conditions = this.selected_conditions.slice();

	this.ConditionList_GroupBy_AND( conditions, false );
	this.Condition_Selection_Empty();
}

OWFWorkflow_Step_Conditions.prototype.Condition_Selection_GroupBy_OR = function()
{
	var conditions = this.selected_conditions.slice();

	this.ConditionList_GroupBy_OR( conditions, true );
	this.Condition_Selection_Empty();
}

OWFWorkflow_Step_Conditions.prototype.Condition_Selection_Ungroup = function()
{
	var conditions = this.selected_conditions.slice();

	this.ConditionList_Ungroup( conditions );
	this.Condition_Selection_Empty();
}

OWFWorkflow_Step_Conditions.prototype.Condition_Selection_Delete = function()
{
	var conditions = this.selected_conditions.slice();

	this.ConditionList_Delete( conditions );
	this.Condition_Selection_Empty();
}

OWFWorkflow_Step_Conditions.prototype.Condition_Insert_Expression = function( condition_parent, index )
{
	var self = this;
	var condition;

	condition											= new OWFWorkflow_Step_Conditions_ConditionItem_Expression();
	condition.onInsert_Condition_Above					= function() { self.Condition_Insert_Expression( condition.Parent(), stoi_def_nonneg( condition.Parent_IndexOfCondition(), 0 ) ); self.ConditionList_UpdateColors(); };
	condition.onInsert_ListCondition_Above				= function() { self.Condition_Insert_ArrayGroup( condition.Parent(), stoi_def_nonneg( condition.Parent_IndexOfCondition(), 0 ) ); self.ConditionList_UpdateColors(); };
	condition.onInsert_Condition_Below					= function() { self.Condition_Insert_Expression( condition.Parent(), stoi_def_nonneg( condition.Parent_IndexOfCondition(), 0 ) + 1 ); self.ConditionList_UpdateColors(); };
	condition.onInsert_ListCondition_Below				= function() { self.Condition_Insert_ArrayGroup( condition.Parent(), stoi_def_nonneg( condition.Parent_IndexOfCondition(), 0 ) + 1 ); self.ConditionList_UpdateColors(); };
	condition.onEnter_Field								= function( e ) { return self.onEnter_Step( e ); };
	condition.onEnter_Value								= function( e ) { return self.onEnter_Step( e ); };

	return this.Condition_Insert_LowLevel( condition, condition_parent, index );
}

OWFWorkflow_Step_Conditions.prototype.Condition_Insert_ArrayGroup = function( condition_parent, index )
{
	var self = this;
	var condition;

	condition											= new OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup()
	condition.onInsert_Condition_Above					= function() { self.Condition_Insert_Expression( condition.Parent(), stoi_def_nonneg( condition.Parent_IndexOfCondition(), 0 ) ); self.ConditionList_UpdateColors(); };
	condition.onInsert_ListCondition_Above				= function() { self.Condition_Insert_ArrayGroup( condition.Parent(), stoi_def_nonneg( condition.Parent_IndexOfCondition(), 0 ) ); self.ConditionList_UpdateColors(); };
	condition.onInsert_Condition_AsChild				= function() { self.Condition_Insert_Expression( condition, -1 ); self.ConditionList_UpdateColors(); };
	condition.onInsert_ListCondition_AsChild			= function() { self.Condition_Insert_ArrayGroup( condition, -1 ); self.ConditionList_UpdateColors(); };
	condition.onInsert_Condition_Below					= function() { self.Condition_Insert_Expression( condition.Parent(), stoi_def_nonneg( condition.Parent_IndexOfCondition(), 0 ) + 1 ); self.ConditionList_UpdateColors(); };
	condition.onInsert_ListCondition_Below				= function() { self.Condition_Insert_ArrayGroup( condition.Parent(), stoi_def_nonneg( condition.Parent_IndexOfCondition(), 0 ) + 1 ); self.ConditionList_UpdateColors(); };
	condition.onEnter_Field								= function( e ) { return self.onEnter_Step( e ); };
	condition.onEnter_Value								= function( e ) { return self.onEnter_Step( e ); };

	return this.Condition_Insert_LowLevel( condition, condition_parent, index );
}

OWFWorkflow_Step_Conditions.prototype.Condition_Insert_Group_AND = function( condition_parent, index )
{
	var condition;

	condition = new OWFWorkflow_Step_Conditions_ConditionItem_Group();
	condition.SetGroupType( 'AND' );

	return this.Condition_Insert_LowLevel( condition, condition_parent, index );
}

OWFWorkflow_Step_Conditions.prototype.Condition_Insert_Group_OR = function( condition_parent, index )
{
	var condition;

	condition = new OWFWorkflow_Step_Conditions_ConditionItem_Group();
	condition.SetGroupType( 'OR' );

	return this.Condition_Insert_LowLevel( condition, condition_parent, index );
}

OWFWorkflow_Step_Conditions.prototype.Condition_Insert_LowLevel = function( condition, condition_parent, index )
{
	var self = this;

	condition.SetSelection_Enabled();
	condition.SetDragAndDrop_Enabled();

	condition.onSelect					= function() { self.Condition_OnSelect( condition ); };
	condition.onDeselect				= function() { self.Condition_OnDeselect( condition ); };
	condition.onRequestDelete			= function() { self.ConditionList_Delete( [ condition ] ); };
	condition.onDragAndDrop_CanStart	= function() { return !classNameContains( self.element_container, 'draganddrop_disabled' ); };
	condition.onDragAndDrop_Start		= function( mousepos_x, mousepos_y ) { self.Condition_onDragAndDrop_Start( condition, mousepos_x, mousepos_y ); };
	condition.onDragAndDrop_Move		= function( mousepos_x, mousepos_y ) { self.Condition_onDragAndDrop_Move( condition, mousepos_x, mousepos_y ); };
	condition.onDragAndDrop_End			= function( cancelled ) { self.Condition_onDragAndDrop_End( condition, cancelled ); };

	if ( condition_parent )
	{
		condition_parent.Condition_Insert( condition, index );

		if ( condition instanceof OWFWorkflow_Step_Conditions_ConditionItem_Expression || condition instanceof OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup )
		{
			condition.Focus();
		}
	}

	this.conditions.push( condition );

	if ( this.conditions.length > 1 )
	{
		if ( this.element_condition_empty_message.parentNode )
		{
			// Remove key events if either button has focus
			this.button_emptymessage_addexpression.ForceRemoveFocus();
			this.button_emptymessage_addarraygroup.ForceRemoveFocus();

			this.element_condition_empty_message.parentNode.removeChild( this.element_condition_empty_message );
		}
	}

	return condition;
}

OWFWorkflow_Step_Conditions.prototype.Condition_OnSelect = function( condition )
{
	if ( this.selected_conditions.indexOf( condition ) === -1 )
	{
		this.selected_conditions.push( condition );
	}

	this.ConditionSelectionList_UpdateSort();
	this.EnableDisableButtons();
}

OWFWorkflow_Step_Conditions.prototype.Condition_OnDeselect = function( condition )
{
	var index;

	if ( ( index = this.selected_conditions.indexOf( condition ) ) !== -1 )
	{
		this.selected_conditions.splice( index, 1 );
	}

	this.EnableDisableButtons();
}

OWFWorkflow_Step_Conditions.prototype.ConditionSelectionList_UpdateSort = function()
{
	var tmp_selected_conditions;

	tmp_selected_conditions = new Array();
	this.ConditionSelectionList_UpdateSort_LowLevel( tmp_selected_conditions, this.root_group.Conditions() );
	this.selected_conditions = tmp_selected_conditions;
}

OWFWorkflow_Step_Conditions.prototype.ConditionSelectionList_UpdateSort_LowLevel = function( tmp_selected_conditions, conditions )
{
	var i, i_len;

	for ( i = 0, i_len = conditions.length; i < i_len; i++ )
	{
		if ( conditions[ i ].Selected() )
		{
			tmp_selected_conditions.push( conditions[ i ] );
		}

		if ( conditions[ i ] instanceof OWFWorkflow_Step_Conditions_ConditionItem_Group )
		{
			this.ConditionSelectionList_UpdateSort_LowLevel( tmp_selected_conditions, conditions[ i ].Conditions() );
		}
	}
}

OWFWorkflow_Step_Conditions.prototype.Condition_onDragAndDrop_Start = function( condition, mousepos_x, mousepos_y )
{
	var i, rect, i_len, end_top, end_left, start_top, oncomplete, start_left, scrollfromtop, cloned_element, container_rect, rect_condition, scrollfromleft, selected_condition, cloned_element_list;

	if ( !condition.Selected() || !this.DragAndDrop_CanUseSelection() )
	{
		this.Condition_Selection_Empty();
		condition.Select();
	}

	rect									= condition.BoundingClientRect();
	container_rect							= this.element_content.getBoundingClientRect();
	scrollfromtop							= getScrollTop();
	scrollfromleft							= getScrollLeft();

	this.draganddrop_active					= true;
	this.draganddrop_parent					= condition.Parent();
	this.draganddrop_index					= condition.Parent_IndexOfCondition();
	this.draganddrop_selection				= this.selected_conditions.slice();

	this.draganddrop_mousepos_x_start		= mousepos_x;
	this.draganddrop_mousepos_y_start		= mousepos_y;
	this.draganddrop_mousepos_x_offset		= ( mousepos_x - rect.left ) - scrollfromleft;
	this.draganddrop_mousepos_y_offset		= ( mousepos_y - rect.top ) - scrollfromtop;

	this.draganddrop_element				= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_draganddrop_element' }, null, null );
	this.draganddrop_element.style.top		= ( rect.top - container_rect.top ) + 'px';
	this.draganddrop_element.style.left		= ( rect.left - container_rect.left ) + 'px';
	this.draganddrop_element.style.width	= ( rect.width ) + 'px';

	this.draganddrop_element_position		= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_draganddrop_element_position' },	null, null );

	this.draganddrop_animationlist_start	= new Array();
	this.draganddrop_animationlist_end		= new Array();

	cloned_element_list						= new Array();

	for ( i = 0, i_len = this.draganddrop_selection.length; i < i_len; i++ )
	{
		selected_condition				= this.draganddrop_selection[ i ];
		rect_condition					= selected_condition.BoundingClientRect();

		selected_condition.SetDragAndDrop_Active();

		start_top						= ( stod_def( ( rect_condition.top + scrollfromtop ), 0 ) - ( rect.top - container_rect.top ) );
		start_left						= 0;

		if ( i > 1 )		end_top = 10;
		else if ( i > 0 )	end_top = 5;
		else				end_top = 0;

		if ( i > 1 )		end_left = 10;
		else if ( i > 0 )	end_left = 5;
		else				end_left = 0;

		cloned_element						= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_draganddrop_overlay' }, null, null );
		cloned_element.style.width			= rect_condition.width + 'px';
		cloned_element.style.height			= rect_condition.height + 'px';
		cloned_element.style.top			= start_top + 'px';
		cloned_element.style.left			= start_left + 'px';
		cloned_element.style.overflow		= 'hidden';
		cloned_element.style.zIndex			= -i;

		if ( i === 0 )
		{
			cloned_element.element_drag_container					= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_draganddrop_overlay_drag_container' },	null, cloned_element );
			cloned_element.element_drag								= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_draganddrop_overlay_drag' },				null, cloned_element.element_drag_container );
			cloned_element.element_drag_bg1							= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_draganddrop_overlay_drag_bg1' },			null, cloned_element.element_drag );
			cloned_element.element_drag_bg2							= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_draganddrop_overlay_drag_bg2' },			null, cloned_element.element_drag );
			cloned_element.element_drag_bg3							= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_draganddrop_overlay_drag_bg3' },			null, cloned_element.element_drag );
			cloned_element.element_drag_bg4							= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_draganddrop_overlay_drag_bg4' },			null, cloned_element.element_drag );
			cloned_element.element_drag_bg5							= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_draganddrop_overlay_drag_bg5' },			null, cloned_element.element_drag );
			cloned_element.element_drag_bg6							= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_draganddrop_overlay_drag_bg6' },			null, cloned_element.element_drag );
			cloned_element.element_drag_active_tag					= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_draganddrop_overlay_tag' },				null, cloned_element );
			cloned_element.element_drag_active_message				= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_draganddrop_overlay_message' },			null, cloned_element );

			cloned_element.element_drag_active_tag.textContent		= '0';
			cloned_element.element_drag_active_message.textContent	= 'Moving 0 Records';

			classNameAddIfMissing( cloned_element, 'workflow_addeditdialog_condition_draganddrop_overlay_border' );
		}

		this.draganddrop_element.appendChild( cloned_element );
		this.DragAndDrop_AnimateToDragPosition_Start( this.draganddrop_animationlist_start, cloned_element, start_top, end_top, start_left, end_left, rect_condition.width, rect.width, rect_condition.height, 70 );
		this.DragAndDrop_AnimateToDragPosition_End( this.draganddrop_animationlist_end, cloned_element );

		cloned_element_list.push( cloned_element );
	}

	oncomplete = function()
	{
		var i, i_len;

		for ( i = 3, i_len = cloned_element_list.length; i < i_len; i++ )
		{
			cloned_element_list[ i ].style.display = 'none';
		}
	}

	this.element_data_container.appendChild( this.draganddrop_element_position );
	this.element_data_container.appendChild( this.draganddrop_element );

	cancelAnimationFrame( window[ this.draganddrop_animation_id ] );
	beginAnimations( this.draganddrop_animationlist_start, this.draganddrop_animation_id, null, oncomplete );

	classNameAddIfMissing( this.element_conditions_wrapper, 'draganddrop' );
}

OWFWorkflow_Step_Conditions.prototype.DragAndDrop_AnimateToDragPosition_Start = function( animationlist, row, start_top, end_top, start_left, end_left, start_width, end_width, start_height, end_height )
{
	var self = this;
	var translate_y, translate_x;

	translate_y			= end_top - start_top;
	translate_x			= end_left - start_left;
	row.style.transform	= 'translateY(0) translateX(0)';

	animationlist.push( createAnimation(
	{
		delay:		0,
		duration:	250,
		delta:		animationCircularEaseOut,
		step:		function( delta )
		{
			var count, formatted_count;

			count				= Math.round( delta * self.draganddrop_selection.length );
			formatted_count		= count.toString().replace( /\B(?=(\d{3})+(?!\d))/g, ',' );

			row.style.transform	= 'translateY(' + ( delta * translate_y ) + 'px) translateX(' + ( delta * translate_x ) + 'px)';
			row.style.width		= ( ( ( 1 - delta ) * start_width ) + ( delta * end_width ) ) + 'px';
			row.style.height	= ( ( ( 1 - delta ) * start_height ) + ( delta * end_height ) ) + 'px';

			if ( row && row.element_drag_active_tag )		row.element_drag_active_tag.textContent			= formatted_count;
			if ( row && row.element_drag_active_message )	row.element_drag_active_message.textContent		= 'Moving ' + formatted_count + ( count > 1 ? ' Records' : ' Record' );
		}
	} ) );
}

OWFWorkflow_Step_Conditions.prototype.DragAndDrop_AnimateToDragPosition_End = function( animationlist, row )
{
	row.style.opacity	= 1;

	animationlist.push( createAnimation(
	{
		delay:		0,
		duration:	150,
		delta:		animationLinear,
		step:		function( delta )
		{
			row.style.opacity = ( 1 - delta );
		}
	} ) );
}

OWFWorkflow_Step_Conditions.prototype.Condition_onDragAndDrop_Move = function( condition, mousepos_x, mousepos_y )
{
	var i, i_len, result, root_rect, parent_rect, hole_created, container_top, scrollfromtop, container_left, scrollfromleft, condition_parent, condition_result, selected_condition;
	var positioning_element, position_on_selection, condition_result_parent, rect_positioning_element, selected_condition_index, hide_draganddrop_indicator, rect_position_indicator_parent;

	result = this.Condition_onDragAndDrop_Move_LowLevel( this.root_group, mousepos_y );

	if ( result === null )
	{
		root_rect						= this.root_group.BoundingClientRect();

		result							= new Object();
		result.parent					= this.root_group;

		if ( ( ( root_rect.y + ( root_rect.height / 2 ) ) >= mousepos_y ) )		result.index = 0;
		else																	result.index = this.root_group.Condition_Count();
	}

	if ( condition === result.parent || ( condition instanceof OWFWorkflow_Step_Conditions_ConditionItem_Group && condition.Condition_ContainsDescendant( result.parent ) ) )
	{
		result 							= new Object();
		result.parent					= condition.Parent();
		result.index					= condition.Parent_IndexOfCondition();
	}

	positioning_element					= null;
	position_on_selection				= false;
	hide_draganddrop_indicator			= false;

	for ( i = 0, i_len = this.draganddrop_selection.length; i < i_len; i++ )
	{
		selected_condition				= this.draganddrop_selection[ i ];
		selected_condition_index		= selected_condition.Parent_IndexOfCondition();
		hole_created					= ( selected_condition.Parent() === result.parent && selected_condition_index < result.index );

		if ( selected_condition.Parent() === result.parent )
		{
			if ( ( result.index > selected_condition_index ) &&
				 ( selected_condition_index === ( selected_condition.Parent().Condition_Count() - 1 ) ) )	position_on_selection = true;
			else if ( hole_created && ( ( result.index - 1 ) === selected_condition_index ) )				position_on_selection = true;
			else if ( !hole_created && result.index === selected_condition_index )							position_on_selection = true;

			if ( position_on_selection )
			{
				positioning_condition	= selected_condition;
				positioning_element		= selected_condition.ContainedElement();

				break;
			}
		}
		else if ( selected_condition instanceof OWFWorkflow_Step_Conditions_ConditionItem_Group && ( selected_condition === result.parent || selected_condition.Condition_ContainsDescendant( result.parent ) ) )
		{
			position_on_selection 		= true;
			positioning_condition		= selected_condition;
			positioning_element			= selected_condition.ContainedElement();

			break;
		}
	}

	if ( positioning_element === null )
	{
		if ( result.parent.Condition_Count() === 0 )				positioning_element = result.parent.ContainedConditionsElement();
		else if ( result.index >= result.parent.Condition_Count() )	positioning_element = result.parent.Condition_ContainedElement_AtIndex( result.index - 1 );
		else														positioning_element = result.parent.Condition_ContainedElement_AtIndex( result.index );
	}

	//
	// Verify condition stays in array group
	//

	condition_parent = condition.Parent();

	while ( condition_parent !== null )
	{
		if ( condition_parent instanceof OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup )
		{
			break;
		}

		condition_parent = condition_parent.Parent();
	}

	if ( result.parent.Condition_Count() === 0 )
	{
		condition_result_parent = result.parent;
	}
	else
	{
		if ( result.index >= result.parent.Condition_Count() )	condition_result = result.parent.Condition_AtIndex( result.index - 1 );
		else													condition_result = result.parent.Condition_AtIndex( result.index );

		condition_result_parent = condition_result.Parent();
	}

	while ( condition_result_parent !== null )
	{
		if ( condition_result_parent instanceof OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup )
		{
			break;
		}

		condition_result_parent = condition_result_parent.Parent();
	}

	if ( condition_result_parent !== condition_parent )
	{
		hide_draganddrop_indicator = true;
	}

	if ( position_on_selection || !hide_draganddrop_indicator )
	{
		if ( position_on_selection )
		{
			this.draganddrop_parent		= positioning_condition.Parent();
			this.draganddrop_index		= positioning_condition.Parent_IndexOfCondition();
		}
		else if ( !hide_draganddrop_indicator )
		{
			this.draganddrop_parent		= result.parent;
			this.draganddrop_index		= result.index;
		}

		rect_position_indicator_parent	= this.draganddrop_element_position.parentNode.getBoundingClientRect();
		rect_positioning_element		= positioning_element.getBoundingClientRect();

		if ( !position_on_selection )
		{
			if ( result.parent.Condition_Count() === 0 )				this.draganddrop_element_position.style.top = ( ( this.element_data_container.scrollTop + ( rect_positioning_element.top + ( rect_positioning_element.height / 2 ) ) ) - rect_position_indicator_parent.top ) + 'px';
			else if ( result.index >= result.parent.Condition_Count() )	this.draganddrop_element_position.style.top = ( ( this.element_data_container.scrollTop + rect_positioning_element.bottom ) - rect_position_indicator_parent.top + 5 ) + 'px';
			else														this.draganddrop_element_position.style.top = ( ( this.element_data_container.scrollTop + rect_positioning_element.top ) - rect_position_indicator_parent.top - 5 ) + 'px';

			this.draganddrop_element_position.style.height = '2px';
		}
		else
		{
			condition_parent			= positioning_condition.Parent();
			condition_start 			= positioning_condition;
			condition_end				= positioning_condition;

			for ( i = condition_start.Parent_IndexOfCondition(); i >= 0; i-- )
			{
				if ( ( looped_condition = condition_parent.Condition_AtIndex( i ) ) === null )
				{
					continue;
				}

				if ( this.draganddrop_selection.indexOf( looped_condition ) === -1 )
				{
					break;
				}

				condition_start	= looped_condition;
			}

			for ( i = condition_end.Parent_IndexOfCondition(), i_len = condition_parent.Condition_Count(); i < i_len; i++ )
			{
				if ( ( looped_condition = condition_parent.Condition_AtIndex( i ) ) === null )
				{
					continue;
				}

				if ( this.draganddrop_selection.indexOf( looped_condition ) === -1 )
				{
					break;
				}

				condition_end = looped_condition;
			}

			rect_positioning_element_start					= condition_start.BoundingClientRect();
			rect_positioning_element_end					= condition_end.BoundingClientRect();

			this.draganddrop_element_position.style.top		= ( ( this.element_data_container.scrollTop + rect_positioning_element_start.top ) - rect_position_indicator_parent.top ) + 'px';
			this.draganddrop_element_position.style.height	= ( rect_positioning_element_end.bottom - rect_positioning_element_start.top ) + 'px';
		}

		this.draganddrop_element_position.style.width		= ( rect_positioning_element.width ) + 'px';
		this.draganddrop_element_position.style.left		= ( this.element_data_container.scrollLeft + rect_positioning_element.left - rect_position_indicator_parent.left ) + 'px';
	}

	scrollfromtop		= this.draganddrop_element.parentNode.scrollTop;
	scrollfromleft		= this.draganddrop_element.parentNode.scrollLeft;
	parent_rect			= this.draganddrop_element.parentNode.getBoundingClientRect();

	if ( condition instanceof OWFWorkflow_Step_Conditions_ConditionItem_Group )
	{
		container_top	= ( mousepos_y - parent_rect.top ) - 40;
		container_left	= ( mousepos_x - parent_rect.left ) - 40;
	}
	else
	{
		container_top	= ( mousepos_y - parent_rect.top ) - this.draganddrop_mousepos_y_offset;
		container_left	= ( mousepos_x - parent_rect.left ) - this.draganddrop_mousepos_x_offset;
	}

	this.draganddrop_element.style.top	= ( container_top + scrollfromtop ) + 'px';
	this.draganddrop_element.style.left	= ( container_left + scrollfromleft ) + 'px';
}

OWFWorkflow_Step_Conditions.prototype.Condition_onDragAndDrop_Move_LowLevel = function( conditiongroup, mousepos_y )
{
	var i, i_len, result, condition, condition_prev, condition_rect, conditiongroup_rect, condition_prev_rect;

	if ( !( conditiongroup instanceof OWFWorkflow_Step_Conditions_ConditionItem_Group ) )
	{
		return null;
	}

	conditiongroup_rect	= conditiongroup.ContainedElement().getBoundingClientRect();

	if ( mousepos_y >= conditiongroup_rect.top && mousepos_y <= conditiongroup_rect.bottom )
	{
		for ( i = 0, i_len = conditiongroup.Condition_Count(); i < i_len; i++ )
		{
			if ( ( condition = conditiongroup.Condition_AtIndex( i ) ) === null )
			{
				continue;
			}

			condition_rect = condition.ContainedElement().getBoundingClientRect();

			if ( condition instanceof OWFWorkflow_Step_Conditions_ConditionItem_Group )
			{
				if ( ( result = this.Condition_onDragAndDrop_Move_LowLevel( condition, mousepos_y ) ) !== null )
				{
					return result;
				}
			}

			if ( i === 0 )
			{
				if ( mousepos_y >= condition_rect.top &&
					 mousepos_y <= ( condition_rect.top + ( condition_rect.height / 2 ) ) )
				{
					//
					// Insert BEFORE condition
					//

					result			= new Object();
					result.parent	= conditiongroup;
					result.index	= i;

					return result;
				}
			}
			else if ( ( condition_prev = conditiongroup.Condition_AtIndex( i - 1 ) ) !== null )
			{
				condition_prev_rect	= condition_prev.ContainedElement().getBoundingClientRect();

				if ( mousepos_y >= ( condition_prev_rect.top + ( condition_prev_rect.height / 2 ) ) &&
					 mousepos_y <= ( condition_rect.top + ( condition_rect.height / 2 ) ) )
				{
					//
					// Insert BEFORE condition
					//

					result			= new Object();
					result.parent	= conditiongroup;
					result.index	= i;

					return result;
				}
			}
		}

		if ( mousepos_y < ( conditiongroup_rect.top + ( conditiongroup_rect.height / 2 ) ) )
		{
			//
			// Insert at beginning of conditiongroup
			//

			result			= new Object();
			result.parent	= conditiongroup;
			result.index	= 0;

			return result;
		}

		//
		// Insert at end of conditiongroup
		//

		result			= new Object();
		result.parent	= conditiongroup;
		result.index	= conditiongroup.Condition_Count();

		return result;
	}

	return null;
}

OWFWorkflow_Step_Conditions.prototype.Condition_onDragAndDrop_End = function( condition, cancelled )
{
	var self = this;

	this.draganddrop_active = false;

	cancelAnimationFrame( window[ this.draganddrop_animation_id ] );
	beginAnimations( this.draganddrop_animationlist_end, this.draganddrop_animation_id, null, function()
	{
		var i, i_len, index, insert_condition, selected_condition, conditionlist_insert, selected_condition_parent;

		self.Condition_Selection_Empty();

		classNameRemoveIfPresent( self.element_conditions_wrapper, 'draganddrop' );

		for ( i = 0, i_len = self.draganddrop_selection.length; i < i_len; i++ )
		{
			self.draganddrop_selection[ i ].SetDragAndDrop_Inactive();
		}

		if ( self.draganddrop_element.parentNode )
		{
			self.draganddrop_element.parentNode.removeChild( self.draganddrop_element );
		}

		if ( self.draganddrop_element_position.parentNode )
		{
			self.draganddrop_element_position.parentNode.removeChild( self.draganddrop_element_position );
		}

		if ( !cancelled )
		{
			conditionlist_insert			= new Array();

			for ( i = 0, i_len = self.draganddrop_selection.length; i < i_len; i++ )
			{
				selected_condition			= self.draganddrop_selection[ i ];
				selected_condition_parent	= selected_condition.Parent();

				if ( self.draganddrop_selection.indexOf( selected_condition_parent ) !== -1 )
				{
					continue;
				}

				conditionlist_insert.push( selected_condition );
			}

			index							= self.draganddrop_index - conditionlist_insert.reduce( function( hole_offset, reduced_condition ) { return hole_offset + ( ( reduced_condition.Parent() === self.draganddrop_parent && reduced_condition.Parent_IndexOfCondition() < self.draganddrop_index ) ? 1 : 0 ); }, 0 );

			for ( i = 0, i_len = conditionlist_insert.length; i < i_len; i++ )
			{
				selected_condition			= conditionlist_insert[ i ];
				selected_condition_parent	= selected_condition.Parent();

				selected_condition.RemoveFromParent();

				if ( selected_condition_parent.Condition_Count() === 0 && selected_condition_parent !== self.root_group && !( selected_condition_parent instanceof OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup ) )
				{
					self.ConditionList_Delete( [ selected_condition_parent ] );
				}
			}

			while ( conditionlist_insert.length )
			{
				insert_condition = conditionlist_insert.pop();
				self.draganddrop_parent.Condition_Insert( insert_condition, index );
			}
		}

		for ( i = 0, i_len = self.draganddrop_selection.length; i < i_len; i++ )
		{
			self.draganddrop_selection[ i ].Select();
		}

		self.ConditionList_UpdateColors();
	} );
}

OWFWorkflow_Step_Conditions.prototype.Condition_CommonAncestor = function( conditions )
{
	var i, j, i_len, j_len, path, pathlist;

	pathlist = new Array();

	if ( conditions.length === 1 )
	{
		if ( conditions[ 0 ] instanceof OWFWorkflow_Step_Conditions_ConditionItem_Group )	return conditions[ 0 ];
		else																				return conditions[ 0 ].Parent();
	}

	for ( i = 0, i_len = conditions.length; i < i_len; i++ )
	{
		path = conditions[ i ].PathToCondition();

		if ( path.length === 0 )
		{
			return null;
		}

		pathlist.push( path );
	}

	if ( pathlist.length )
	{
		for ( i = 0, i_len = pathlist[ 0 ].length; i < i_len; i++ )
		{
			for ( j = 1, j_len = pathlist.length; j < j_len; j++ )
			{
				if ( pathlist[ 0 ][ i ] !== pathlist[ j ][ i ] )
				{
					if ( i === 0 )	return null;
					else			return pathlist[ 0 ][ i - 1 ];
				}
			}
		}
	}

	return null;
}

OWFWorkflow_Step_Conditions.prototype.ConditionList_GroupBy_AND = function( conditions )
{
	var i, i_len, index, condition;

	if ( conditions.length === 0 || conditions[ 0 ] === this.root_group )
	{
		return;
	}

	try			{ index = conditions[ 0 ].Parent_IndexOfCondition(); }
	catch ( e )	{ index = -1; }

	condition = this.Condition_Insert_Group_AND( conditions[ 0 ].Parent(), index );

	for ( i = 0, i_len = conditions.length; i < i_len; i++ )
	{
		conditions[ i ].RemoveFromParent();
		condition.Condition_Insert( conditions[ i ], -1 );
	}

	this.ConditionList_UpdateColors();
}

OWFWorkflow_Step_Conditions.prototype.ConditionList_GroupBy_OR = function( conditions )
{
	var i, i_len, index, condition;

	if ( conditions.length === 0 || conditions[ 0 ] === this.root_group )
	{
		return;
	}

	try			{ index = conditions[ 0 ].Parent_IndexOfCondition(); }
	catch ( e )	{ index = -1; }

	condition = this.Condition_Insert_Group_OR( conditions[ 0 ].Parent(), index );

	for ( i = 0, i_len = conditions.length; i < i_len; i++ )
	{
		conditions[ i ].RemoveFromParent();
		condition.Condition_Insert( conditions[ i ], -1 );
	}

	this.ConditionList_UpdateColors();
}

OWFWorkflow_Step_Conditions.prototype.ConditionList_Ungroup = function( conditions )
{
	var i, index, common_ancestor, new_condition_parent;

	if ( ( conditions.length === 1 ) && ( ( conditions[ 0 ] instanceof OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup ) || ( !( conditions[ 0 ] instanceof OWFWorkflow_Step_Conditions_ConditionItem_Group ) && ( conditions[ 0 ].Parent() !== this.root_group ) ) ) )
	{
		common_ancestor	= conditions[ 0 ].Parent();
	}
	else if ( ( conditions.length === 1 ) && ( conditions[ 0 ] instanceof OWFWorkflow_Step_Conditions_ConditionItem_Group ) && !( conditions[ 0 ] instanceof OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup ) && ( conditions[ 0 ] !== this.root_group ) )
	{
		common_ancestor	= conditions[ 0 ];
		conditions		= conditions[ 0 ].Conditions().slice();
	}
	else
	{
		common_ancestor	= this.Condition_CommonAncestor( conditions );

		if ( common_ancestor === this.root_group || conditions[ 0 ].Parent() !== common_ancestor )
		{
			return;
		}
	}

	new_condition_parent	= common_ancestor.Parent();
	index					= new_condition_parent.Condition_IndexOf( common_ancestor );

	for ( i = conditions.length - 1; i >= 0; i-- )
	{
		conditions[ i ].RemoveFromParent();
		new_condition_parent.Condition_Insert( conditions[ i ], index );
	}

	if ( common_ancestor.Condition_Count() === 0 && !( common_ancestor instanceof OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup ) )
	{
		this.ConditionList_Delete( [ common_ancestor ] );
	}

	this.ConditionList_UpdateColors();
}

OWFWorkflow_Step_Conditions.prototype.ConditionList_Delete = function( conditions )
{
	var i, i_len, index, local_conditions;

	local_conditions = conditions.slice();

	for ( i = 0, i_len = local_conditions.length; i < i_len; i++ )
	{
		if ( local_conditions[ i ] instanceof OWFWorkflow_Step_Conditions_ConditionItem_Group )
		{
			this.ConditionList_Delete( local_conditions[ i ].Conditions() );
		}

		local_conditions[ i ].RemoveFromParent();

		if ( ( index = this.conditions.indexOf( local_conditions[ i ] ) ) !== -1 )
		{
			this.conditions.splice( index, 1 );
		}
	}

	if ( this.conditions.length <= 1 && this.element_condition_empty_message.parentNode !== this.element_data_container )
	{
		this.element_data_container.appendChild( this.element_condition_empty_message );
	}

	this.ConditionList_UpdateColors();
}

OWFWorkflow_Step_Conditions.prototype.ConditionList_UpdateColors = function()
{
	this.ConditionList_UpdateColors_LowLevel( this.root_group, this.GetAvailableColors() );
}

OWFWorkflow_Step_Conditions.prototype.ConditionList_UpdateColors_LowLevel = function( conditiongroup, colors )
{
	var i, i_len, color, condition;

	if ( colors.length === 0 )
	{
		colors = this.GetAvailableColors();
	}

	color = colors.shift();

	for ( i = 0, i_len = conditiongroup.Condition_Count(); i < i_len; i++ )
	{
		if ( ( condition = conditiongroup.Condition_AtIndex( i ) ) === null )
		{
			continue;
		}

		condition.SetColor( color );

		if ( condition instanceof OWFWorkflow_Step_Conditions_ConditionItem_Group )
		{
			this.ConditionList_UpdateColors_LowLevel( condition, colors );
		}
	}
}

OWFWorkflow_Step_Conditions.prototype.DragAndDrop_CanUseSelection = function()
{
	var i, j, i_len, j_len, condition, all_selected, child_condition, parent_condition;

	if ( this.selected_conditions.length === 0 )
	{
		return true;
	}

	parent_list	= new Array();

	for ( i = 0, i_len = this.selected_conditions.length; i < i_len; i++ )
	{
		condition					= this.selected_conditions[ i ];
		parent_condition			= condition.Parent();

		if ( parent_list.indexOf( parent_condition ) === -1 )
		{
			all_selected			= true;

			for ( j = 0, j_len = parent_condition.Condition_Count(); j < j_len; j++ )
			{
				if ( ( child_condition = parent_condition.Condition_AtIndex( j ) ) === null )
				{
					continue;
				}

				if ( !child_condition.Selected() )
				{
					all_selected	= false;
					break;
				}
			}

			if ( !all_selected || !parent_condition.Selected() )
			{
				parent_list.push( parent_condition );
			}
		}
	}

	if ( parent_list.length > 1 )
	{
		return false;
	}

	return true;
}

OWFWorkflow_Step_Conditions.prototype.EnableDisableButtons = function()
{
	var i, i_len, groupable, ungroupable, common_ancestor, draganddrop_enabled;

	if ( this.selected_conditions.length === 1 &&
		 this.selected_conditions[ 0 ] === this.root_group )
	{
		this.button_delete.Disable();
		this.button_deselect.Disable();
	}
	else if ( this.selected_conditions.length )
	{
		this.button_delete.Enable();
		this.button_deselect.Enable();
	}
	else
	{
		this.button_delete.Disable();
		this.button_deselect.Disable();
	}

	groupable = this.selected_conditions.length > 1;

	if ( groupable )
	{
		for ( i = 1, i_len = this.selected_conditions.length; i < i_len; i++ )
		{
			if ( this.selected_conditions[ i ].Parent() !== this.selected_conditions[ 0 ].Parent() )
			{
				groupable = false;
				break;
			}
		}
	}

	draganddrop_enabled = this.DragAndDrop_CanUseSelection();

	if ( this.selected_conditions.length === 0 )
	{
		ungroupable = false;
	}
	else if ( ( ( this.selected_conditions.length === 1 ) && ( ( this.selected_conditions[ 0 ] instanceof OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup ) || ( !( this.selected_conditions[ 0 ] instanceof OWFWorkflow_Step_Conditions_ConditionItem_Group ) && ( this.selected_conditions[ 0 ].Parent() !== this.root_group ) ) ) ) ||
			  ( ( this.selected_conditions.length === 1 ) && ( this.selected_conditions[ 0 ] instanceof OWFWorkflow_Step_Conditions_ConditionItem_Group ) && !( this.selected_conditions[ 0 ] instanceof OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup ) && ( this.selected_conditions[ 0 ] !== this.root_group ) ) )
	{
		ungroupable = true;
	}
	else
	{
		common_ancestor	= this.Condition_CommonAncestor( this.selected_conditions );

		if ( common_ancestor === this.root_group ||
			 this.selected_conditions[ 0 ].Parent() !== common_ancestor )	ungroupable = false;
		else																ungroupable = true;
	}

	if ( draganddrop_enabled )	classNameRemoveIfPresent( this.element_container, 'draganddrop_disabled' );
	else						classNameAddIfMissing( this.element_container, 'draganddrop_disabled' );

	if ( groupable )			this.menubutton_group.ContainedButton().Enable();
	else						this.menubutton_group.ContainedButton().Disable();

	if ( ungroupable )			this.button_ungroup.Enable();
	else						this.button_ungroup.Disable();
}

OWFWorkflow_Step_Conditions.prototype.Event_OnClick_AddExpression = function( e )
{
	if ( this.selected_conditions.length !== 1 )
	{
		this.Condition_Insert_Expression( this.root_group, -1 );
	}
	else
	{
		if ( this.selected_conditions[ 0 ] instanceof OWFWorkflow_Step_Conditions_ConditionItem_Group )	this.Condition_Insert_Expression( this.selected_conditions[ 0 ], -1 );
		else																							this.Condition_Insert_Expression( this.selected_conditions[ 0 ].Parent(), stoi_def_nonneg( this.selected_conditions[ 0 ].Parent_IndexOfCondition(), 0 ) + 1 );
	}

	this.ConditionList_UpdateColors();
}

OWFWorkflow_Step_Conditions.prototype.Event_OnClick_AddArrayGroup = function( e )
{
	var condition;

	if ( this.selected_conditions.length !== 1 )
	{
		condition = this.Condition_Insert_ArrayGroup( this.root_group, -1 );
	}
	else
	{
		if ( this.selected_conditions[ 0 ] instanceof OWFWorkflow_Step_Conditions_ConditionItem_Group )	condition = this.Condition_Insert_ArrayGroup( this.selected_conditions[ 0 ], -1 );
		else																							condition = this.Condition_Insert_ArrayGroup( this.selected_conditions[ 0 ].Parent(), stoi_def_nonneg( this.selected_conditions[ 0 ].Parent_IndexOfCondition(), 0 ) + 1 );
	}

	this.ConditionList_UpdateColors();
	this.Condition_Selection_Empty();
	condition.Select();
}

OWFWorkflow_Step_Conditions.prototype.Render_Validation = function()
{
	var i, i_len;

	if ( !this.step_visible || this.draganddrop_active )
	{
		return;
	}

	if ( this.can_set_valid )
	{
		if ( this.conditions.length <= 1 )
		{
			this.SetValid();
		}
		else if ( this.conditions.length > 1 )
		{
			for ( i = 0, i_len = this.conditions.length; i < i_len; i++ )
			{
				if ( this.conditions[ i ] instanceof OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup || this.conditions[ i ] instanceof OWFWorkflow_Step_Conditions_ConditionItem_Expression )
				{
					if ( this.conditions[ i ].GetField().length === 0 || this.conditions[ i ].GetInvalid_Field() )
					{
						this.ClearValid();
						return;
					}

					if ( !this.conditions[ i ].GetOperator() || this.conditions[ i ].GetOperator().length === 0 || this.conditions[ i ].GetInvalid_Operator() )
					{
						this.ClearValid();
						return;
					}
				}
			}

			this.SetValid();
		}
	}
}

// OWFWorkflow_Step_Conditions_ConditionItem
////////////////////////////////////////////////////

function OWFWorkflow_Step_Conditions_ConditionItem()
{
	var self = this;

	this.parent									= null;
	this.selectable								= true;
	this.selected								= false;
	this.element_container						= newElement( 'span', { 'class': 'workflow_addeditdialog_condition' }, null, null );
	this.selection_enabled						= false;
	this.draganddrop_active						= false;
	this.draganddrop_enabled					= false;
	this.draganddrop_keystackentry				= null;
	this.color									= null;

	this.render_draganddrop_start				= function() { self.Render_DragAndDrop_Start(); };
	this.render_draganddrop_move				= function() { self.Render_DragAndDrop_Move(); };
	this.render_draganddrop_end					= function() { self.Render_DragAndDrop_End(); };
	this.event_returnfalse						= function( event ) { return eventPreventDefault( event ? event : window.event ); };
	this.event_onclick_selection				= function( event ) { return self.Event_OnClick_Selection( event ? event : window.event ); };
	this.event_onmousedown_selection			= function( event ) { self.can_select = true; return true; };
	this.event_onmousedown_draganddrop			= function( event ) { return self.Event_OnMouseDown_DragAndDrop( event ? event : window.event ); };
	this.event_onmousemove_draganddrop			= function( event ) { return self.Event_OnMouseMove_DragAndDrop( event ? event : window.event ); };
	this.event_onmouseup_draganddrop			= function( event ) { return self.Event_OnMouseUp_DragAndDrop( event ? event : window.event ); };
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.ContainedElement = function()
{
	return this.element_container;
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.BoundingClientRect = function()
{
	return this.element_container.getBoundingClientRect();
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.SetColor = function( color )
{
	this.color = color;
	this.UpdateColor();
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.UpdateColor = function()
{
	;
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.SetSelection_Enabled = function()
{
	this.selection_enabled = true;

	return this;
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.SetSelection_Disabled = function()
{
	this.selection_enabled = false;

	return this;
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.SetDragAndDrop_Enabled = function()
{
	this.draganddrop_enabled = true;

	return this;
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.SetDragAndDrop_Disabled = function()
{
	this.draganddrop_enabled = false;

	return this;
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.SetDragAndDrop_Active = function()
{
	classNameAddIfMissing( this.element_container, 'draganddrop' );
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.SetDragAndDrop_Inactive = function()
{
	classNameRemoveIfPresent( this.element_container, 'draganddrop' );
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.DragAndDrop_Start = function()
{
	var self = this;

	if ( !this.draganddrop_enabled || this.draganddrop_active )
	{
		return;
	}

	this.draganddrop_active			= true;
	this.draganddrop_keystackentry	= KeyDownHandlerStack_Add( null, function( e ) { return self.DragAndDrop_Cancel( e ); } );

	this.onDragAndDrop_Start( this.mouse_position_start.x, this.mouse_position_start.y );
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.DragAndDrop_Move = function()
{
	if ( !this.draganddrop_active )
	{
		return;
	}

	this.onDragAndDrop_Move( this.mouse_position.x, this.mouse_position.y );
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.DragAndDrop_End = function( cancelled )
{
	if ( !this.draganddrop_active )
	{
		return;
	}

	KeyDownHandlerStack_Remove( this.draganddrop_keystackentry );

	this.draganddrop_active			= false;
	this.draganddrop_keystackentry	= null;

	this.onDragAndDrop_End( cancelled );
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.DragAndDrop_Cancel = function( e )
{
	if ( !this.draganddrop_active )
	{
		return;
	}

	this.can_select					= false;
	this.mouse_running				= false;

	document.body.unselectable		= null;
	document.onselectstart			= null;
	this.mouse_target.ondragstart	= null;

	if ( this.mouse_target.releaseCapture )
	{
		this.mouse_target.releaseCapture();
	}

	RemoveEvent( document,	'mousemove',	this.event_onmousemove_draganddrop );
	RemoveEvent( document,	'mouseup',		this.event_onmouseup_draganddrop );
	RemoveEvent( window,	'blur',			this.event_onmouseup_draganddrop );

	this.DragAndDrop_End( true );

	return true;
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.RequestRender_DragAndDrop_Start = function()
{
	if ( !this.render_draganddrop_start_requested )
	{
		this.render_draganddrop_start_requested = true;
		window.requestAnimationFrame( this.render_draganddrop_start );
	}
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.RequestRender_DragAndDrop_Move = function()
{
	if ( !this.render_draganddrop_move_requested )
	{
		this.render_draganddrop_move_requested = true;
		window.requestAnimationFrame( this.render_draganddrop_move );
	}
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.RequestRender_DragAndDrop_End = function()
{
	if ( !this.render_draganddrop_end_requested )
	{
		this.render_draganddrop_end_requested = true;
		window.requestAnimationFrame( this.render_draganddrop_end );
	}
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.Render_DragAndDrop_Start = function()
{
	this.render_draganddrop_start_requested = false;
	this.DragAndDrop_Start();
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.Render_DragAndDrop_Move = function()
{
	this.render_draganddrop_move_requested = false;
	this.DragAndDrop_Move();
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.Render_DragAndDrop_End = function()
{
	this.render_draganddrop_end_requested = false;
	this.DragAndDrop_End();
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.SetSelectable = function( selectable )
{
	this.selectable	= selectable;

	if ( this.selected )
	{
		this.Deselect();
	}

	return this;
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.Toggle_Selection = function()
{
	if ( this.selected )	this.Deselect();
	else					this.Select();
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.Select = function()
{
	if ( !this.selectable )
	{
		return;
	}

	this.selected						= true;
	this.element_container.className	= classNameAdd( this.element_container, 'selected' );

	this.UpdateColor();
	this.onSelect();
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.Deselect = function()
{
	this.selected						= false;
	this.element_container.className	= classNameRemove( this.element_container, 'selected' );

	this.UpdateColor();
	this.onDeselect();
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.Selected = function()
{
	return this.selected;
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.SetParent = function( condition_parent )
{
	this.parent = condition_parent;
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.Parent = function()
{
	if ( !this.parent )
	{
		return null;
	}

	return this.parent;
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.Parent_IndexOfCondition = function()
{
	if ( !this.parent )
	{
		return null;
	}

	return this.parent.Condition_IndexOf( this );
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.RemoveFromParent = function()
{
	if ( !this.parent )
	{
		return;
	}

	this.Deselect();
	this.parent.Condition_Remove( this );
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.SetParentNode = function( parent_node )
{
	parent_node.appendChild( this.ContainedElement() );
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.SetParentNode_InsertBefore = function( parent_node, existing_node )
{
	parent_node.insertBefore( this.ContainedElement(), existing_node );
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.ParentNode = function()
{
	return this.ContainedElement().parentNode;
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.PathToCondition = function()
{
	var path, condition;

	path		= new Array();
	condition	= this;

	path.unshift( condition );

	while ( ( condition = condition.Parent() ) !== null )
	{
		path.unshift( condition );
	}

	return path;
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.Event_OnClick_Selection = function( e )
{
	var rightclick;

	if ( !this.selection_enabled || !this.can_select )
	{
		return true;
	}

	if ( 'which' in e )			rightclick = ( e.which == 3 ); 
	else if ( 'button' in e )	rightclick = ( e.button == 2 );
	else						rightclick = false;

	if ( rightclick )			return true;

	this.Toggle_Selection();

	return true;
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.Event_OnMouseDown_DragAndDrop = function( e )
{
	var rightclick, margin_top, margin_left, container_rect, scrollfromtop, scrollfromleft;

	if ( !this.draganddrop_enabled || !this.onDragAndDrop_CanStart() )
	{
		return true;
	}

	if ( 'which' in e )			rightclick = ( e.which == 3 ); 
	else if ( 'button' in e )	rightclick = ( e.button == 2 );
	else						rightclick = false;

	if ( rightclick )					return true;

	container_rect						= this.element_container.getBoundingClientRect();
	scrollfromtop						= getScrollTop();
	scrollfromleft						= getScrollLeft();
	margin_top							= stoi_def( computedStyleValue( this.element_container, 'margin-top' ), 10 );
	margin_left							= stoi_def( computedStyleValue( this.element_container, 'margin-left' ), 20 );

	this.can_select						= true;
	this.mouse_running					= true;
	this.mouse_started					= true;
	this.mouse_moved					= false;
	this.mouse_movediff					= 0;
	this.mouse_target					= e.target ? e.target : e.srcElement;
	this.mouse_position					= captureMousePosition( e );
	this.mouse_position_x_offset		= this.mouse_position.x - scrollfromleft - container_rect.left + margin_left;
	this.mouse_position_y_offset		= this.mouse_position.y - scrollfromtop - container_rect.top + margin_top;
	this.mouse_position_start			= this.mouse_position;

	clearTextSelection();
	document.body.focus();
	document.body.unselectable			= 'on';
	document.onselectstart				= this.event_returnfalse;
	this.mouse_target.ondragstart		= this.event_returnfalse;

	if ( this.mouse_target.setCapture )
	{
		this.mouse_target.setCapture();
	}

	AddEvent( document, 'mousemove',	this.event_onmousemove_draganddrop );
	AddEvent( document, 'mouseup',		this.event_onmouseup_draganddrop );
	AddEvent( window,	'blur',			this.event_onmouseup_draganddrop );

	return true;
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.Event_OnMouseMove_DragAndDrop = function( e )
{
	if ( this.mouse_started )
	{
		eventPreventDefault( e );
		this.mouse_started	= false;
	}

	this.mouse_position		= captureMousePosition( e );
	this.mouse_moved		= true;
	this.mouse_movediff		= Math.max( this.mouse_movediff, Math.max( Math.abs( this.mouse_position.y - this.mouse_position_start.y ), Math.abs( this.mouse_position.x - this.mouse_position_start.x ) ) );

	if ( this.mouse_movediff > 3 )
	{
		if ( !this.draganddrop_active )
		{
			this.RequestRender_DragAndDrop_Start();
		}

		this.RequestRender_DragAndDrop_Move();
	}
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.Event_OnMouseUp_DragAndDrop = function( e )
{
	this.mouse_running				= false;

	document.body.unselectable		= null;
	document.onselectstart			= null;
	this.mouse_target.ondragstart	= null;

	if ( this.mouse_target.releaseCapture )
	{
		this.mouse_target.releaseCapture();
	}

	RemoveEvent( document,	'mousemove',	this.event_onmousemove_draganddrop );
	RemoveEvent( document,	'mouseup',		this.event_onmouseup_draganddrop );
	RemoveEvent( window,	'blur',			this.event_onmouseup_draganddrop );

	if ( this.draganddrop_active )
	{
		this.can_select = false;
		this.RequestRender_DragAndDrop_End();
	}

	return true;
}

OWFWorkflow_Step_Conditions_ConditionItem.prototype.onSelect				= function() { ; }
OWFWorkflow_Step_Conditions_ConditionItem.prototype.onDeselect				= function() { ; }
OWFWorkflow_Step_Conditions_ConditionItem.prototype.onRequestDelete			= function() { ; }
OWFWorkflow_Step_Conditions_ConditionItem.prototype.onDragAndDrop_CanStart	= function() { return true; }
OWFWorkflow_Step_Conditions_ConditionItem.prototype.onDragAndDrop_Start		= function( mousepos_x, mousepos_y ) { ; }
OWFWorkflow_Step_Conditions_ConditionItem.prototype.onDragAndDrop_Move		= function( mousepos_x, mousepos_y ) { ; }
OWFWorkflow_Step_Conditions_ConditionItem.prototype.onDragAndDrop_End		= function( cancelled ) { ; }

// OWFWorkflow_Step_Conditions_ConditionItem_Expression
////////////////////////////////////////////////////

function OWFWorkflow_Step_Conditions_ConditionItem_Expression()
{
	var self = this;
	var element_custom;

	OWFWorkflow_Step_Conditions_ConditionItem.call( this );

	this.invalid_field							= false;
	this.invalid_operator						= false;
	this.invalid_value							= false;
	this.cache_flatfieldlist					= null;

	this.element_row							= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_row' },						null, this.element_container );
	this.element_group_color					= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_group_color' },				null, this.element_row );

	this.element_drag_container					= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_drag_container' },			null, this.element_row );
	this.element_drag							= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_drag' },						null, this.element_drag_container );
	this.element_drag_bg1						= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_drag_bg1' },					null, this.element_drag );
	this.element_drag_bg2						= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_drag_bg2' },					null, this.element_drag );
	this.element_drag_bg3						= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_drag_bg3' },					null, this.element_drag );
	this.element_drag_bg4						= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_drag_bg4' },					null, this.element_drag );
	this.element_drag_bg5						= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_drag_bg5' },					null, this.element_drag );
	this.element_drag_bg6						= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_drag_bg6' },					null, this.element_drag );

	this.element_selection_container			= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_selection_container' },		null, this.element_row );
	this.element_selection_checkbox				= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_selection_checkbox' },		null, this.element_selection_container );
	this.element_selection_bg1					= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_selection_checkbox_bg1' },	null, this.element_selection_checkbox );
	this.element_selection_bg2					= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_selection_checkbox_bg2' },	null, this.element_selection_checkbox );

	this.element_field							= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_field_container' },			null, this.element_row );
	this.element_operator						= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_operator_container' },		null, this.element_row );
	this.element_value							= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_value_container' },			null, this.element_row );
	this.element_menu							= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_menu_container' },			null, this.element_row );

	this.element_value.style.opacity			= 0;

	this.input_field							= new MMAutoCompleteInput( this.element_field, '', '' );
	this.input_field.onSetInvalid				= function() { self.onSetInvalid_Field(); };
	this.input_field.onClearInvalid				= function() { self.onClearInvalid_Field(); };
	this.input_field.onSearch					= function( search, callback, delegator ) { self.Field_OnSearch( search, callback ); };
	this.input_field.onPopulateEntry			= function( element, field ) { self.Field_OnPopulateEntry( element, field ); };
	this.input_field.onEntrySelected			= function( element, field ) { self.Field_OnEntrySelected( element, field ); };
	this.input_field.SetTitle( 'Field' );
	this.input_field.SetSearchTimeout( 20 );
	this.input_field.SetClassName( 'mm_input_common whole_width medium' );
	this.input_field.SetMenuAsRootMenu( true, true );
	this.input_field.SetAutoCompleteClassName( this.input_field.GetAutoCompleteClassName() + ' workflow_addeditdialog_condition_menu_shadow' );
	this.input_field.SetOnEnterHandler( function( e ) { return self.onEnter_Field( e ); } );

	this.select_operator						= new MMSelect( this.element_operator );
	this.select_operator.onSetInvalid			= function() { self.onSetInvalid_Operator(); };
	this.select_operator.onClearInvalid			= function() { self.onClearInvalid_Operator(); };
	this.select_operator.SetTitle( 'Operator' );
	this.select_operator.SetMenuAsRootMenu( true, true );
	this.select_operator.SetHoverText( 'Select Operator' );
	this.select_operator.SetClassName( 'mm_select_common whole_width medium' );
	this.select_operator.SetSelectOne( true, '<Select One>', '' );
	this.select_operator.AddOption( 'Equal To',								'EQ' );
	this.select_operator.AddOption( 'Equal To (Comma Separated List)',		'IN' );
	this.select_operator.AddOption( 'Not Equal To',							'NE' );
	this.select_operator.AddOption( 'Not Equal To (Comma Separated List)',	'NOT_IN' );
	this.select_operator.AddOption( 'Contains',								'CO' );
	this.select_operator.AddOption( 'Does Not Contain',						'NC' );
	this.select_operator.AddOption( 'Greater Than',							'GT' );
	this.select_operator.AddOption( 'Greater Than Or Equal To',				'GE' );
	this.select_operator.AddOption( 'Less Than',							'LT' );
	this.select_operator.AddOption( 'Less Than Or Equal To',				'LE' );
	this.select_operator.AddOption( 'Like',									'LIKE' );
	this.select_operator.AddOption( 'Not Like',								'NOTLIKE' );
	this.select_operator.AddOption( 'Empty',								'NULL' );
	this.select_operator.AddOption( 'Not Empty',							'NOTNULL' );
	this.select_operator.AddOption( 'Yes',									'TRUE' );
	this.select_operator.AddOption( 'No',									'FALSE' );
	this.select_operator.SetOnChangeHandler( function( value )
	{
		if ( value === ''	||
			 value === 'TRUE'	||
			 value === 'FALSE'	||
			 value === 'NULL'	||
			 value === 'NOTNULL' )
		{
			self.input_value.Disable();
			self.element_value.style.opacity = 0;
		}
		else
		{
			self.input_value.Enable();
			self.element_value.style.opacity = 1;
		}
	} );

	this.input_value							= new MMInput( this.element_value, '', '' );
	this.input_value.onSetInvalid				= function() { self.onSetInvalid_Value(); };
	this.input_value.onClearInvalid				= function() { self.onClearInvalid_Value(); };
	this.input_value.SetTitle( 'Value' );
	this.input_value.SetClassName( 'mm_input_common whole_width medium' );
	this.input_value.SetOnEnterHandler( function( e ) { return self.onEnter_Value( e ); } );
	this.input_value.Disable();

	element_custom								= newElement( 'span', { 'class': 'workflow_addeditdialog_step_conditions_row_button_custom' },		null, null );
	element_custom.element_icon					= newElement( 'span', { 'class': 'workflow_addeditdialog_step_conditions_row_button_custom_el1' },	null, element_custom );
	element_custom.element_text					= newElement( 'span', { 'class': 'workflow_addeditdialog_step_conditions_row_button_custom_el2' },	null, element_custom );
	element_custom.element_subtext				= newElement( 'span', { 'class': 'workflow_addeditdialog_step_conditions_row_button_custom_el3' },	null, element_custom );

	this.menubutton_menu						= new MMMenuButton( '', this.element_menu );
	this.menubutton_menu.SetAnimateMenu( true );
	this.menubutton_menu.SetMenuAsRootMenu( true );
	this.menubutton_menu.SetMenuAsRootMenu_AutosizesFromRight( true );
	this.menubutton_menu.SetHoverText( 'More Options' );
	this.menubutton_menu.SetCustomContent( element_custom );
	this.menubutton_menu.SetClassName( 'mm10_menubutton_container_style_common' );
	this.menubutton_menu.SetMenuClassName( 'mm10_menubutton_container_style_common_menu' );
	this.menubutton_menu.SetButtonClassName( 'workflow_addeditdialog_step_conditions_row_button' );
	this.menubutton_menu.Menu_Append_Item( 'Add Condition Above',		function( event ) { self.onInsert_Condition_Above(); } );
	this.menubutton_menu.Menu_Append_Item( 'Add List Condition Above',	function( event ) { self.onInsert_ListCondition_Above(); } );
	this.menubutton_menu.Menu_Append_Divider();
	this.menubutton_menu.Menu_Append_Item( 'Add Condition Below',		function( event ) { self.onInsert_Condition_Below(); } );
	this.menubutton_menu.Menu_Append_Item( 'Add List Condition Below',	function( event ) { self.onInsert_ListCondition_Below(); } );
	this.menubutton_menu.Menu_Append_Divider();
	this.menubutton_menu.Menu_Append_Item_Negative( 'Delete',			function( event ) { self.onRequestDelete(); } );

	AddEvent( this.element_selection_container,	'click',		this.event_onclick_selection );
	AddEvent( this.element_selection_container,	'mousedown',	this.event_onmousedown_selection );
	AddEvent( this.element_drag_container,		'mousedown',	this.event_onmousedown_draganddrop );
}

DeriveFrom( OWFWorkflow_Step_Conditions_ConditionItem, OWFWorkflow_Step_Conditions_ConditionItem_Expression );

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.BoundingClientRect = function()
{
	return this.element_row.getBoundingClientRect();
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.Focus = function()
{
	this.input_field.Focus();
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.SetField = function( field )
{
	this.input_field.SetValue( field );
	this.ResetAvailableFields();
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.GetField = function()
{
	return this.input_field.GetValue();
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.SetOperator = function( operator )
{
	this.select_operator.SetValue( operator );
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.GetOperator = function()
{
	return this.select_operator.GetValue();
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.SetValue = function( value )
{
	this.input_value.SetValue( value );
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.GetValue = function()
{
	var operator = this.GetOperator();

	if ( operator === 'TRUE'	||
		 operator === 'FALSE'	||
		 operator === 'NULL'	||
		 operator === 'NOTNULL' )	return null;
	else							return this.input_value.GetValue();
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.UpdateColor = function()
{
	if ( this.selected || this.invalid_field || this.invalid_operator || this.invalid_value )
	{
		this.element_group_color.style.backgroundColor = '';
	}
	else
	{
		this.element_group_color.style.backgroundColor = this.color;
	}
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.SetInvalid_Field = function( error_message )
{
	this.input_field.SetInvalid( error_message );
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.ClearInvalid_Field = function()
{
	this.input_field.ClearInvalid();
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.GetInvalid_Field = function()
{
	return this.input_field.GetInvalid();
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.GetInvalidMessage_Field = function()
{
	return this.input_field.GetInvalid_Message();
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.onSetInvalid_Field = function()
{
	if ( this.invalid_field )
	{
		return;
	}

	this.invalid_field					= true;
	this.element_container.className	= classNameAdd( this.element_container, 'invalid' );

	this.UpdateColor();
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.onClearInvalid_Field = function()
{
	if ( !this.invalid_field )
	{
		return;
	}

	this.invalid_field = false;

	if ( !this.invalid_field && !this.invalid_operator && !this.invalid_value )
	{
		this.element_container.className = classNameRemove( this.element_container, 'invalid' );
	}

	this.UpdateColor();
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.SetInvalid_Operator = function( error_message )
{
	this.select_operator.SetInvalid( error_message );
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.ClearInvalid_Operator = function()
{
	this.select_operator.ClearInvalid();
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.GetInvalid_Operator = function()
{
	return this.select_operator.GetInvalid();
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.GetInvalidMessage_Operator = function()
{
	return this.select_operator.GetInvalid_Message();
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.onSetInvalid_Operator = function()
{
	if ( this.invalid_operator )
	{
		return;
	}

	this.invalid_operator				= true;
	this.element_container.className	= classNameAdd( this.element_container, 'invalid' );

	this.UpdateColor();
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.onClearInvalid_Operator = function()
{
	if ( !this.invalid_operator )
	{
		return;
	}

	this.invalid_operator = false;

	if ( !this.invalid_field && !this.invalid_operator && !this.invalid_value )
	{
		this.element_container.className = classNameRemove( this.element_container, 'invalid' );
	}

	this.UpdateColor();
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.SetInvalid_Value = function( error_message )
{
	this.input_value.SetInvalid( error_message );
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.ClearInvalid_Value = function()
{
	this.input_value.ClearInvalid();
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.onSetInvalid_Value = function()
{
	if ( this.invalid_value )
	{
		return;
	}

	this.invalid_value					= true;
	this.element_container.className	= classNameAdd( this.element_container, 'invalid' );

	this.UpdateColor();
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.onClearInvalid_Value = function()
{
	if ( !this.invalid_value )
	{
		return;
	}

	this.invalid_value = false;

	if ( !this.invalid_field && !this.invalid_operator && !this.invalid_value )
	{
		this.element_container.className = classNameRemove( this.element_container, 'invalid' );
	}

	this.UpdateColor();
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.Field_OnSearch = function( search, callback )
{
	var i, j, i_len, found, j_len, fields, results, lastfound, searchlist;

	fields		= this.GetAvailableFieldsAsFlatArray();
	results		= new Array();
	searchlist	= search.split( ' ' );

	for ( i = 0, i_len = fields.length; i < i_len; i++ )
	{
		found		= true;
		lastfound	= -1;

		for ( j = 0, j_len = searchlist.length; j < j_len; j++ )
		{
			lastfound = fields[ i ].title.toLowerCase().indexOf( searchlist[ j ].toLowerCase(), lastfound + 1 );

			if ( lastfound == -1 )
			{
				found = false;
				break;
			}
		}

		if ( found )
		{
			results.push( fields[ i ] );
		}
	}

	callback( results );
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.Field_OnPopulateEntry = function( element_parent, field )
{
	var element;

	element				= newElement( 'span', { 'class': 'mm_autocompleteinput_entry_text' }, null, element_parent );
	element.textContent	= field.title;
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.Field_OnEntrySelected = function( element_parent, field )
{
	this.input_field.SetValue( field.title );
	this.input_field.ClearInvalid();
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.GetAvailableFields = function()
{
	return OWFWorkflow_AvailableFields();
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.ResetAvailableFields = function()
{
	this.cache_flatfieldlist = null;
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.GetAvailableFieldsAsFlatArray = function()
{
	var i, field, i_len, fields, fieldlist, array_list, condition_parent;

	if ( this.cache_flatfieldlist === null )
	{
		array_list			= new Array();
		condition_parent	= this.Parent();

		while ( condition_parent !== null )
		{
			if ( condition_parent instanceof OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup )
			{
				field = condition_parent.GetField();

				if ( typeof field === 'string' && field.length )
				{
					fieldlist	= field.split( ':' );
					array_list	= fieldlist.concat( array_list );
				}
			}

			condition_parent = condition_parent.Parent();
		}

		fields = cloneObject( this.GetAvailableFields() );

		while ( array_list.length )
		{
			for ( i = 0, i_len = fields.length; i < i_len; i++ )
			{
				if ( fields[ i ].field === array_list[ 0 ] )
				{
					fields = fields[ i ].children;
					break;
				}
			}

			if ( i >= i_len )
			{
				fields = new Array();
				break;
			}

			array_list.shift();
		}

		this.cache_flatfieldlist = this.GetAvailableFieldsAsFlatArray_LowLevel( fields, '' );
	}

	return cloneObject( this.cache_flatfieldlist );
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.GetAvailableFieldsAsFlatArray_LowLevel = function( fields, prefix )
{
	var i, i_len, results;

	results = new Array();

	for ( i = 0, i_len = fields.length; i < i_len; i++ )
	{
		this.GetAvailableFieldsAsFlatArray_AddResult( results, fields[ i ], prefix );
	}

	return results;
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.GetAvailableFieldsAsFlatArray_AddResult = function( results, field, prefix )
{
	var i, i_len, result;

	if ( Array.isArray( field.children ) )
	{
		if ( field.children.length === 0 )
		{
			return;
		}
		else if ( field.type === 'array' )
		{
			result			= new Object();
			result.field	= field.field;
			result.type		= 'integer';
			result.title	= 'length(' + prefix + ( prefix.length ? ':' : '' ) + field.field + ')';

			results.push( result );

			return;
		}

		prefix += ( prefix.length ? ':' : '' ) + field.field;

		for ( i = 0, i_len = field.children.length; i < i_len; i++ )
		{
			this.GetAvailableFieldsAsFlatArray_AddResult( results, field.children[ i ], prefix );
		}
	}
	else
	{
		result			= cloneObject( field );
		result.title	= prefix + ( prefix.length ? ( ':' + field.field ) : field.field );

		results.push( result );
	}
}

OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.onInsert_Condition_Above		= function() { ; };
OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.onInsert_ListCondition_Above	= function() { ; };
OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.onInsert_Condition_Below		= function() { ; };
OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.onInsert_ListCondition_Below	= function() { ; };
OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.onEnter_Field				= function( e ) { ; };
OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.onEnter_Value				= function( e ) { ; };

// OWFWorkflow_Step_Conditions_ConditionItem_Group
////////////////////////////////////////////////////

function OWFWorkflow_Step_Conditions_ConditionItem_Group()
{
	var self = this;

	OWFWorkflow_Step_Conditions_ConditionItem.call( this );

	this.event_onclick_group_action_and				= function( event ) { return self.Event_OnClick_GroupActionAND( event ? event : window.event ); };
	this.event_onclick_group_action_or				= function( event ) { return self.Event_OnClick_GroupActionOR( event ? event : window.event ); };

	this.element_container.className				= classNameAdd( this.element_container, 'workflow_addeditdialog_condition_group' );
	this.element_container.className				= classNameAdd( this.element_container, 'empty' );

	this.element_bracket_container					= newElement( 'span', { 'class': 'workflow_addeditdialog_conditiongroup_bracket_container' },		null, this.element_container );
	this.element_bracket							= newElement( 'span', { 'class': 'workflow_addeditdialog_conditiongroup_bracket' },					null, this.element_bracket_container );
	this.element_group_action_container				= newElement( 'span', { 'class': 'workflow_addeditdialog_conditiongroup_group_action_container' },	null, this.element_container );
	this.element_group_action_active				= newElement( 'span', { 'class': 'workflow_addeditdialog_conditiongroup_group_action_active' },		null, this.element_group_action_container );
	this.element_group_action_title					= newElement( 'span', { 'class': 'workflow_addeditdialog_conditiongroup_group_action_title' },		null, this.element_group_action_container );
	this.element_group_action_and					= newElement( 'span', { 'class': 'workflow_addeditdialog_conditiongroup_group_action_and' },		null, this.element_group_action_container );
	this.element_group_action_or					= newElement( 'span', { 'class': 'workflow_addeditdialog_conditiongroup_group_action_or' },			null, this.element_group_action_container );
	this.element_children_container					= newElement( 'span', { 'class': 'workflow_addeditdialog_conditiongroup_children' },				null, this.element_container );

	this.element_group_action_title.textContent		= 'GROUP BY:';
	this.element_group_action_and.textContent		= 'AND';
	this.element_group_action_or.textContent		= 'OR';

	this.group_type									= 'AND';
	this.conditions									= new Array();

	AddEvent( this.element_bracket_container,	'mousedown',	this.event_onmousedown_draganddrop );
	AddEvent( this.element_group_action_title,	'mousedown',	this.event_onmousedown_draganddrop );
	AddEvent( this.element_bracket_container,	'click',		this.event_onclick_selection );
	AddEvent( this.element_group_action_title,	'click',		this.event_onclick_selection );
	AddEvent( this.element_group_action_and,	'click',		this.event_onclick_group_action_and );
	AddEvent( this.element_group_action_or,		'click',		this.event_onclick_group_action_or );
}

DeriveFrom( OWFWorkflow_Step_Conditions_ConditionItem, OWFWorkflow_Step_Conditions_ConditionItem_Group );

OWFWorkflow_Step_Conditions_ConditionItem.prototype.BoundingClientRect = function()
{
	var rect, rect_title, rect_bracket, rect_children;

	rect_title		= this.element_group_action_title.getBoundingClientRect();
	rect_bracket	= this.element_bracket_container.getBoundingClientRect();
	rect_children	= this.element_children_container.getBoundingClientRect();

	rect			= new Object();
	rect.top		= rect_title.top;
	rect.right		= rect_children.right;
	rect.bottom		= rect_bracket.bottom;
	rect.left		= rect_bracket.left;
	rect.x			= rect.left;
	rect.y			= rect.top;
	rect.width		= rect.right - rect.left;
	rect.height		= rect.bottom - rect.top;

	return rect;
}

OWFWorkflow_Step_Conditions_ConditionItem_Group.prototype.ContainedConditionsElement = function()
{
	return this.element_children_container;
}

OWFWorkflow_Step_Conditions_ConditionItem_Group.prototype.SetGroupType = function( type )
{
	if ( type === 'AND' )
	{
		this.group_type									= 'AND';
		this.element_group_action_container.className	= classNameRemove( this.element_group_action_container, 'group_by_or' );
	}
	else
	{
		this.group_type									= 'OR';
		this.element_group_action_container.className	= classNameAdd( this.element_group_action_container, 'group_by_or' );
	}

	this.UpdateColor();

	return this;
}

OWFWorkflow_Step_Conditions_ConditionItem_Group.prototype.GetGroupType = function()
{
	return this.group_type;
}

OWFWorkflow_Step_Conditions_ConditionItem_Group.prototype.Conditions = function()
{
	return this.conditions;
}

OWFWorkflow_Step_Conditions_ConditionItem_Group.prototype.Condition_Count = function()
{
	return this.conditions.length;
}

OWFWorkflow_Step_Conditions_ConditionItem_Group.prototype.Condition_IndexOf = function( condition )
{
	return this.conditions.indexOf( condition );
}

OWFWorkflow_Step_Conditions_ConditionItem_Group.prototype.Condition_AtIndex = function( index )
{
	if ( index >= 0 && this.conditions.hasOwnProperty( index ) && this.conditions[ index ] instanceof OWFWorkflow_Step_Conditions_ConditionItem )
	{
		return this.conditions[ index ];
	}

	return null;
}

OWFWorkflow_Step_Conditions_ConditionItem_Group.prototype.Condition_ContainedElement_AtIndex = function( index )
{
	if ( index >= 0 && this.conditions.hasOwnProperty( index ) && this.conditions[ index ] instanceof OWFWorkflow_Step_Conditions_ConditionItem )
	{
		return this.conditions[ index ].ContainedElement();
	}

	return null;
}

OWFWorkflow_Step_Conditions_ConditionItem_Group.prototype.Condition_Insert = function( condition, index )
{
	var sibling_condition;

	if ( ( sibling_condition = this.Condition_AtIndex( index ) ) === null )
	{
		index = this.conditions.length;
	}

	condition.SetParent( this );
	condition.SetParentNode_InsertBefore( this.element_children_container, sibling_condition ? sibling_condition.ContainedElement() : null );
	this.conditions.splice( index, 0, condition );

	this.element_container.className = classNameRemove( this.element_container, 'empty' );
}

OWFWorkflow_Step_Conditions_ConditionItem_Group.prototype.Condition_Remove = function( condition )
{
	var index;

	if ( this.element_children_container === condition.ParentNode() )
	{
		this.element_children_container.removeChild( condition.ContainedElement() );
	}

	if ( ( index = this.conditions.indexOf( condition ) ) !== -1 )
	{
		this.conditions.splice( index, 1 );
	}

	if ( this.conditions.length === 0 )
	{
		this.element_container.className = classNameAdd( this.element_container, 'empty' );

		if ( this.Parent() )
		{
			this.onRequestDelete();
		}
	}
}

OWFWorkflow_Step_Conditions_ConditionItem_Group.prototype.Condition_ContainsDescendant = function( condition )
{
	var i, i_len;

	for ( i = 0, i_len = this.conditions.length; i < i_len; i++ )
	{
		if ( this.conditions[ i ] === condition )
		{
			return true;
		}
		else if ( this.conditions[ i ] instanceof OWFWorkflow_Step_Conditions_ConditionItem_Group )
		{
			if ( this.conditions[ i ].Condition_ContainsDescendant( condition ) )
			{
				return true;
			}
		}
	}

	return false;
}

OWFWorkflow_Step_Conditions_ConditionItem_Group.prototype.ConditionList_ResetAvailableFields = function()
{
	var i, i_len, condition;

	for ( i = 0, i_len = this.Condition_Count(); i < i_len; i++ )
	{
		if ( ( condition = this.Condition_AtIndex( i ) ) === null )
		{
			continue;
		}

		if ( condition instanceof OWFWorkflow_Step_Conditions_ConditionItem_Group )	condition.ConditionList_ResetAvailableFields();
		else																		condition.ResetAvailableFields();
	}
}

OWFWorkflow_Step_Conditions_ConditionItem_Group.prototype.Event_OnClick_GroupActionAND = function( e )
{
	this.SetGroupType( 'AND' );

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

OWFWorkflow_Step_Conditions_ConditionItem_Group.prototype.Event_OnClick_GroupActionOR = function( e )
{
	this.SetGroupType( 'OR' );

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

OWFWorkflow_Step_Conditions_ConditionItem_Group.prototype.UpdateColor = function()
{
	if ( this.selected || this.invalid_field || this.invalid_operator || this.invalid_value )
	{
		this.element_bracket.style.borderColor					= '';
		this.element_group_action_active.style.backgroundColor	= '';
		this.element_group_action_title.style.color				= '';
		this.element_group_action_and.style.color				= '';
		this.element_group_action_or.style.color				= '';
	}
	else
	{
		this.element_bracket.style.borderColor					= this.color;
		this.element_group_action_active.style.backgroundColor	= this.color;
		this.element_group_action_title.style.color				= this.color;

		if ( this.group_type === 'AND' )
		{
			this.element_group_action_or.style.color			= this.color;
			this.element_group_action_and.style.color			= '';
		}
		else
		{
			this.element_group_action_or.style.color			= '';
			this.element_group_action_and.style.color			= this.color;
		}
	}
}

// OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup
////////////////////////////////////////////////////

function OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup()
{
	var self = this;
	var element_custom;

	OWFWorkflow_Step_Conditions_ConditionItem_Group.call( this );

	this.invalid_field							= false;
	this.invalid_operator						= false;
	this.cache_flatfieldlist					= null;

	this.element_container.className			= classNameAdd( this.element_container, 'workflow_addeditdialog_conditiongroup_arraygrouping' );

	this.element_bracket_top					= newElement( 'span', { 'class': 'workflow_addeditdialog_conditiongroup_arraygrouping_bracket_top' },					null, this.element_bracket_container );
	this.element_bracket_linked					= newElement( 'span', { 'class': 'workflow_addeditdialog_conditiongroup_arraygrouping_bracket_linked icon-linked' },	null, this.element_bracket_container );

	this.element_row							= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_row' },												null, null );
	this.element_group_color					= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_group_color' },										null, this.element_row );

	this.element_drag_container					= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_drag_container' },									null, this.element_row );
	this.element_drag							= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_drag' },												null, this.element_drag_container );
	this.element_drag_bg1						= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_drag_bg1' },											null, this.element_drag );
	this.element_drag_bg2						= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_drag_bg2' },											null, this.element_drag );
	this.element_drag_bg3						= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_drag_bg3' },											null, this.element_drag );
	this.element_drag_bg4						= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_drag_bg4' },											null, this.element_drag );
	this.element_drag_bg5						= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_drag_bg5' },											null, this.element_drag );
	this.element_drag_bg6						= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_drag_bg6' },											null, this.element_drag );

	this.element_selection_container			= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_selection_container' },								null, this.element_row );
	this.element_selection_checkbox				= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_selection_checkbox' },								null, this.element_selection_container );
	this.element_selection_bg1					= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_selection_checkbox_bg1' },							null, this.element_selection_checkbox );
	this.element_selection_bg2					= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_selection_checkbox_bg2' },							null, this.element_selection_checkbox );

	this.element_field							= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_field_container' },									null, this.element_row );
	this.element_operator						= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_operator_container' },								null, this.element_row );
	this.element_value							= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_value_container' },									null, this.element_row );
	this.element_menu							= newElement( 'span', { 'class': 'workflow_addeditdialog_condition_menu_container' },									null, this.element_row );

	this.element_value.style.opacity			= 0;

	this.element_container.insertBefore( this.element_row, this.element_bracket_container );

	this.input_field							= new MMAutoCompleteInput( this.element_field, '', '' );
	this.input_field.onSetInvalid				= function() { self.onSetInvalid_Field(); };
	this.input_field.onClearInvalid				= function() { self.onClearInvalid_Field(); };
	this.input_field.onSearch					= function( search, callback, delegator ) { self.Field_OnSearch( search, callback ); };
	this.input_field.onPopulateEntry			= function( element, field ) { self.Field_OnPopulateEntry( element, field ); };
	this.input_field.onEntrySelected			= function( element, field ) { self.Field_OnEntrySelected( element, field ); };
	this.input_field.onChange					= function( value ) { self.Field_OnChange( value ); };
	this.input_field.SetTitle( 'Array Field' );
	this.input_field.SetSearchTimeout( 20 );
	this.input_field.SetClassName( 'mm_input_common whole_width medium' );
	this.input_field.SetOnEnterHandler( function( e ) { return self.onEnter_Field( e ); } );

	this.select_operator						= new MMSelect( this.element_operator );
	this.select_operator.onSetInvalid			= function() { self.onSetInvalid_Operator(); };
	this.select_operator.onClearInvalid			= function() { self.onClearInvalid_Operator(); };
	this.select_operator.SetTitle( 'Operator' );
	this.select_operator.SetClassName( 'mm_select_common whole_width medium' );
	this.select_operator.SetHoverText( 'Select Operator' );
	this.select_operator.SetSelectOne( true, '<Select One>', '' );
	this.select_operator.AddOption( 'All',		'ALL' );
	this.select_operator.AddOption( 'Any',		'ANY' );
	this.select_operator.AddOption( 'First',	'FIRST' );
	this.select_operator.AddOption( 'Last',		'LAST' );
	this.select_operator.AddOption( 'Index',	'NUMBER' );
	this.select_operator.SetOnChangeHandler( function( value )
	{
		if ( value !== 'NUMBER' )
		{
			self.input_value.Disable();
			self.element_value.style.opacity = 0;
		}
		else
		{
			self.input_value.Enable();
			self.element_value.style.opacity = 1;
		}
	} );

	this.input_value							= new MMInput( this.element_value, '', '' );
	this.input_value.onSetInvalid				= function() { self.onSetInvalid_Operator(); };
	this.input_value.onClearInvalid				= function() { self.onClearInvalid_Operator(); };
	this.input_value.onValidate					= function( value ) { return self.ValidateValueInput( value ); };
	this.input_value.SetTitle( 'Index' );
	this.input_value.SetClassName( 'mm_input_common whole_width medium' );
	this.input_value.SetOnEnterHandler( function( e ) { return self.onEnter_Value( e ); } );
	this.input_value.Disable();

	element_custom								= newElement( 'span', { 'class': 'workflow_addeditdialog_step_conditions_row_button_custom' },		null, null );
	element_custom.element_icon					= newElement( 'span', { 'class': 'workflow_addeditdialog_step_conditions_row_button_custom_el1' },	null, element_custom );
	element_custom.element_text					= newElement( 'span', { 'class': 'workflow_addeditdialog_step_conditions_row_button_custom_el2' },	null, element_custom );
	element_custom.element_subtext				= newElement( 'span', { 'class': 'workflow_addeditdialog_step_conditions_row_button_custom_el3' },	null, element_custom );

	this.menubutton_menu						= new MMMenuButton( '', this.element_menu );
	this.menubutton_menu.SetAnimateMenu( true );
	this.menubutton_menu.SetMenuAsRootMenu( true );
	this.menubutton_menu.SetMenuAsRootMenu_AutosizesFromRight( true );
	this.menubutton_menu.SetHoverText( 'More Options' );
	this.menubutton_menu.SetCustomContent( element_custom );
	this.menubutton_menu.SetClassName( 'mm10_menubutton_container_style_common' );
	this.menubutton_menu.SetMenuClassName( 'mm10_menubutton_container_style_common_menu' );
	this.menubutton_menu.SetButtonClassName( 'workflow_addeditdialog_step_conditions_row_button' );
	this.menubutton_menu.Menu_Append_Item( 'Add Condition Above',			function( event ) { self.onInsert_Condition_Above(); } );
	this.menubutton_menu.Menu_Append_Item( 'Add List Condition Above',		function( event ) { self.onInsert_ListCondition_Above(); } );
	this.menubutton_menu.Menu_Append_Divider();
	this.menubutton_menu.Menu_Append_Item( 'Add Condition As Child',		function( event ) { self.onInsert_Condition_AsChild(); } );
	this.menubutton_menu.Menu_Append_Item( 'Add List Condition As Child',	function( event ) { self.onInsert_ListCondition_AsChild(); } );
	this.menubutton_menu.Menu_Append_Divider();
	this.menubutton_menu.Menu_Append_Item( 'Add Condition Below',			function( event ) { self.onInsert_Condition_Below(); } );
	this.menubutton_menu.Menu_Append_Item( 'Add List Condition Below',		function( event ) { self.onInsert_ListCondition_Below(); } );
	this.menubutton_menu.Menu_Append_Divider();
	this.menubutton_menu.Menu_Append_Item_Negative( 'Delete',				function( event ) { self.onRequestDelete(); } );

	AddEvent( this.element_selection_container,	'click',		this.event_onclick_selection );
	AddEvent( this.element_selection_container,	'mousedown',	this.event_onmousedown_selection );
	AddEvent( this.element_drag_container,		'mousedown',	this.event_onmousedown_draganddrop );

	this.SetGroupType( 'AND' );
}

DeriveFrom( OWFWorkflow_Step_Conditions_ConditionItem_Group, OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup );

OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.BoundingClientRect = function()
{
	var rect, rect_row, rect_bracket;

	rect_row		= this.element_row.getBoundingClientRect();
	rect_bracket	= this.element_bracket_container.getBoundingClientRect();

	rect			= new Object();
	rect.top		= rect_row.top;
	rect.right		= rect_row.right;
	rect.bottom		= rect_bracket.bottom;
	rect.left		= rect_row.left;
	rect.x			= rect.left;
	rect.y			= rect.top;
	rect.width		= rect.right - rect.left;
	rect.height		= rect.bottom - rect.top;

	return rect;
}

OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.ValidateValueInput = function( value )
{
	var options;

	if ( value.length === 0 )
	{
		return true;
	}

	options						= new Object();
	options.disallow_negative	= true;

	if ( !ValidateWholeNumber( value, options ) || stoi( value ) < 1 )
	{
		this.input_value.SetInvalid( 'Please enter a positive whole number' );
		return false;
	}

	return true;
}

OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.GetAvailableFieldsAsFlatArray_AddResult = function( results, field, prefix )
{
	var i, i_len, result;

	if ( Array.isArray( field.children ) && field.children.length )
	{
		prefix += ( prefix.length ? ':' : '' ) + field.field;

		if ( field.type === 'array' )
		{
			//
			// Only add the first reached array for a given level
			// to be added to the results array. We don't want nested
			// arrays to be added because they can't be reached without
			// first having an array group for it's parent
			//

			result			= cloneObject( field );
			result.title	= prefix;

			results.push( result );

			return;
		}

		for ( i = 0, i_len = field.children.length; i < i_len; i++ )
		{
			this.GetAvailableFieldsAsFlatArray_AddResult( results, field.children[ i ], prefix );
		}
	}
}

OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.SetField = function( field )
{
	this.input_field.SetValue( field );
	this.ConditionList_ResetAvailableFields();
}

OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.SetOperator = function( operator )
{
	var options;

	options						= new Object();
	options.disallow_negative	= true;

	if ( ValidateWholeNumber( operator, options ) && stoi( operator ) > 0 )
	{
		this.select_operator.SetValue( 'NUMBER' );
		this.input_value.SetValue( operator );
	}
	else
	{
		this.select_operator.SetValue( operator );
	}
}

OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.GetOperator = function()
{
	if ( this.select_operator.GetValue() === 'NUMBER' )
	{
		return this.input_value.GetValue();
	}

	return this.select_operator.GetValue();
}

OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.Field_OnChange = function( value )
{
	this.ConditionList_ResetAvailableFields();
}

OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.SetInvalid_Operator = function( error_message )
{
	if ( this.select_operator.GetValue() === 'NUMBER' )	this.input_value.SetInvalid( 'Please enter an index' );
	else												this.select_operator.SetInvalid( error_message );
}

OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.ClearInvalid_Operator = function()
{
	this.input_value.ClearInvalid();
	this.select_operator.ClearInvalid();
}

OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.GetInvalid_Operator = function()
{
	if ( this.select_operator.GetValue() === 'NUMBER' )	return this.input_value.GetInvalid();
	else												return this.select_operator.GetInvalid();
}

OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.GetInvalidMessage_Operator = function()
{
	if ( this.select_operator.GetValue() === 'NUMBER' )	return this.input_value.GetInvalid_Message();
	else												return this.select_operator.GetInvalid_Message();
}

OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.SetInvalid_Value = function( error_message )
{
	if ( this.invalid_value )
	{
		this.invalid_value_message				= error_message;
		this.invalid_value_element.textContent	= error_message;

		return;
	}

	this.invalid_value_message					= error_message;
	this.invalid_value_element					= newElement( 'div', { 'class': 'workflow_addeditdialog_conditiongroup_arraygrouping_child_required' }, null, null );
	this.invalid_value_element.textContent		= error_message;
	this.element_container.className			= classNameAdd( this.element_container, 'child_required' );

	this.element_children_container.appendChild( this.invalid_value_element );
	this.onSetInvalid_Value();
}

OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.ClearInvalid_Value = function()
{
	if ( !this.invalid_value )
	{
		return;
	}

	if ( this.invalid_value_element.parentNode )
	{
		this.invalid_value_element.parentNode.removeChild( this.invalid_value_element );
	}

	this.invalid_value_message			= null;
	this.invalid_value_element			= null;
	this.element_container.className	= classNameRemove( this.element_container, 'child_required' );

	this.onClearInvalid_Value();
}

OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.GetInvalid_Value = function()
{
	return this.invalid_value;
}

OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.GetInvalidMessage_Value = function()
{
	return this.invalid_value_message;
}

OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.Condition_Insert = function( condition, index )
{
	OWFWorkflow_Step_Conditions_ConditionItem_Group.prototype.Condition_Insert.call( this, condition, index );

	this.ClearInvalid_Value();
}

OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.Condition_Remove = function( condition )
{
	var index;

	if ( this.element_children_container === condition.ParentNode() )
	{
		this.element_children_container.removeChild( condition.ContainedElement() );
	}

	if ( ( index = this.conditions.indexOf( condition ) ) !== -1 )
	{
		this.conditions.splice( index, 1 );
	}

	if ( this.conditions.length === 0 )
	{
		this.element_container.className = classNameAdd( this.element_container, 'empty' );
	}

	this.ClearInvalid_Value();
}

OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.UpdateColor = function()
{
	OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.UpdateColor.call( this );

	if ( this.selected || this.invalid_field || this.invalid_operator || this.invalid_value )
	{
		this.element_bracket.style.borderColor					= '';
		this.element_bracket_top.style.borderColor				= '';
		this.element_bracket_linked.style.color					= '';
		this.element_group_action_active.style.backgroundColor	= '';
		this.element_group_action_title.style.color				= '';
		this.element_group_action_and.style.color				= '';
		this.element_group_action_or.style.color				= '';
	}
	else
	{
		this.element_bracket.style.borderColor					= this.color;
		this.element_bracket_top.style.borderColor				= this.color;
		this.element_bracket_linked.style.color					= this.color;
		this.element_group_action_active.style.backgroundColor	= this.color;
		this.element_group_action_title.style.color				= this.color;

		if ( this.group_type === 'AND' )	this.element_group_action_or.style.color	= this.color;
		else								this.element_group_action_and.style.color	= this.color;
	}
}

OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.onInsert_Condition_Above					= function() { ; };
OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.onInsert_ListCondition_Above				= function() { ; };
OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.onInsert_Condition_AsChild				= function() { ; };
OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.onInsert_ListCondition_AsChild			= function() { ; };
OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.onInsert_Condition_Below					= function() { ; };
OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.onInsert_ListCondition_Below				= function() { ; };

OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.Focus									= OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.Focus;
OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.GetField									= OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.GetField;
OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.SetInvalid_Field							= OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.SetInvalid_Field;
OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.ClearInvalid_Field						= OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.ClearInvalid_Field;
OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.GetInvalid_Field							= OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.GetInvalid_Field;
OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.GetInvalidMessage_Field					= OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.GetInvalidMessage_Field;
OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.onSetInvalid_Field						= OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.onSetInvalid_Field;
OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.onClearInvalid_Field						= OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.onClearInvalid_Field;
OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.onSetInvalid_Operator					= OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.onSetInvalid_Operator;
OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.onClearInvalid_Operator					= OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.onClearInvalid_Operator;
OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.onSetInvalid_Value						= OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.onSetInvalid_Value;
OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.onClearInvalid_Value						= OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.onClearInvalid_Value;
OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.Field_OnSearch							= OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.Field_OnSearch;
OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.Field_OnPopulateEntry					= OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.Field_OnPopulateEntry;
OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.Field_OnEntrySelected					= OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.Field_OnEntrySelected;
OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.ResetAvailableFields						= OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.ResetAvailableFields;
OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.GetAvailableFields						= OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.GetAvailableFields;
OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.GetAvailableFieldsAsFlatArray			= OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.GetAvailableFieldsAsFlatArray;
OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.GetAvailableFieldsAsFlatArray_LowLevel	= OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.GetAvailableFieldsAsFlatArray_LowLevel;
OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.onEnter_Field							= OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.onEnter_Field;
OWFWorkflow_Step_Conditions_ConditionItem_ArrayGroup.prototype.onEnter_Value							= OWFWorkflow_Step_Conditions_ConditionItem_Expression.prototype.onEnter_Value;

// OWFWorkflow_Step_Actions
////////////////////////////////////////////////////

function OWFWorkflow_Step_Actions( editmode )
{
	var self = this;

	OWFWorkflow_Step.call( this, 'actions', 'Actions' );

	this.Feature_TitledContent_Enable( 'Actions', '' );
	this.Feature_ActionBar_Enable();

	// Variables
	this.itemlist_actions										= new Array();
	this.itemlist_selectedactions								= new Array();
	this.draganddrop_animation_id								= GenerateUniqueID();

	// Elements
	this.element_actions_wrapper								= newElement( 'span', { 'class': 'workflow_addeditdialog_step_actions_actions_wrapper' },							null, this.element_data_container );
	this.element_actions_empty_message							= newElement( 'span', { 'class': 'workflow_addeditdialog_step_actions_action_empty_message' },						null, null );
	this.element_actions_empty_message_buttons_container		= newElement( 'span', { 'class': 'workflow_addeditdialog_step_actions_action_empty_message_buttons_container' },	null, this.element_actions_empty_message );
	this.element_actions_empty_message_text						= newElement( 'span', { 'class': 'workflow_addeditdialog_step_actions_action_empty_message_text' },					null, this.element_actions_empty_message );

	this.element_actions_empty_message_text.textContent			= 'Please add at least one action to be performed when the conditions are met for the triggered order.';

	// Top Controls
	this.button_add												= this.TitleBar_Control_Button_Add( 'add', 'Add Action' );
	this.button_add.SetOnClickHandler( function( e ) { self.ActionItem_CreateAndInsert( null , -1 ); } );

	this.button_deselect										= this.TitleBar_Control_Button_Add( 'cancel', 'Deselect' );
	this.button_deselect.SetOnClickHandler( function( e ) { self.ActionItemSelectionList_Empty(); } );
	this.button_deselect.Disable();

	this.button_delete											= this.TitleBar_Control_Button_Add( 'delete', 'Delete Action(s)' );
	this.button_delete.SetOnClickHandler( function( e ) { self.ActionItemSelectionList_DeleteSelectedItems(); } );
	this.button_delete.Disable();

	this.TitleBar_Control_Button_Add_ScrollToTop();

	// Empty Message Buttons
	this.button_emptymessage_addaction							= new MMButton( this.element_actions_empty_message_buttons_container );
	this.button_emptymessage_addaction.SetImage( 'circle_add' );
	this.button_emptymessage_addaction.SetText( 'Add An Action' );
	this.button_emptymessage_addaction.SetClassName( 'workflow_addeditdialog_step_actions_empty_message_button' );
	this.button_emptymessage_addaction.SetOnClickHandler( function( e ) { self.ActionItem_CreateAndInsert( null , -1 ) } );

	if ( editmode )
	{
		this.ActionBar_Button_Add_Previous();
		this.ActionBar_Button_Add_Next( false );
		this.ActionBar_Button_Add_Update();
	}
	else
	{
		this.ActionBar_Button_Add_Previous();
		this.ActionBar_Button_Add_Next( true );
	}
}

DeriveFrom( OWFWorkflow_Step, OWFWorkflow_Step_Actions );

OWFWorkflow_Step_Actions.prototype.Validate = function( errors )
{
	var i, j, error, i_len, j_len, errors_action;

	if ( this.itemlist_actions.length === 0 )
	{
		error				= new Object();
		error.error_field	= '';
		error.error_message	= 'Please add at least one action';

		errors.push( error );
	}

	for ( i = 0, i_len = this.itemlist_actions.length; i < i_len; i++ )
	{
		errors_action = new Array();

		if ( !this.itemlist_actions[ i ].Validate( errors_action ) )
		{
			for ( j = 0, j_len = errors_action.length; j < j_len; j++ )
			{
				errors_action[ j ].error_field = 'Workflow_Actions[' + ( i + 1 ) + ']:' + errors_action[ j ].error_field;
				errors.push( errors_action[ j ] );
			}
		}
	}

	if ( errors.length )
	{
		return false;
	}

	return true;
}

OWFWorkflow_Step_Actions.prototype.onSetValid = function()
{
	this.button_next.Enable();
}

OWFWorkflow_Step_Actions.prototype.onClearValid = function()
{
	this.button_next.Disable();
}

OWFWorkflow_Step_Actions.prototype.onDisplayErrors = function()
{
	var i, i_len;

	for ( i = 0, i_len = this.errors.length; i < i_len; i++ )
	{
		if ( this.errors[ i ].error_field.indexOf( 'Workflow_Actions[' ) === 0 )
		{
			this.onDisplayErrors_Action_SetInvalid_FromError( this.errors[ i ] );
		}
	}
}

OWFWorkflow_Step_Actions.prototype.onDisplayErrors_Action_SetInvalid_FromError = function( error )
{
	var index, field, match, regex;

	regex = new RegExp( 'Workflow_Actions\\[(?:\\s)*(\\d+)(?:\\s)*\\]:(.*?)$', 'g' );

	if ( ( match = regex.exec( error.error_field ) ) === null )
	{
		return;
	}

	index	= stoi_def_nonneg( match[ 1 ], -1 );
	field	= match[ 2 ];

	if ( index === -1 || !this.itemlist_actions.hasOwnProperty( index - 1 ) || !( this.itemlist_actions[ index - 1 ] instanceof OWFWorkflow_Step_Actions_ActionItem ) )
	{
		return;
	}

	if ( field === 'act' )										this.itemlist_actions[ index - 1 ].SetInvalid_Action( error.error_message );
	else if ( field === 'act_data' )							this.itemlist_actions[ index - 1 ].SetInvalid_ActionData( field, error.error_message );
	else if ( field === 'act_data:module_code' )				this.itemlist_actions[ index - 1 ].SetInvalid_ActionData( field, error.error_message );
	else if ( field === 'act_data:field' )						this.itemlist_actions[ index - 1 ].SetInvalid_ActionData( field, error.error_message );
	else if ( field === 'act_data:value' )						this.itemlist_actions[ index - 1 ].SetInvalid_ActionData( field, error.error_message );
	else if ( field === 'act_data:url' )						this.itemlist_actions[ index - 1 ].SetInvalid_ActionData( field, error.error_message );
	else if ( field === 'act_data:cred_id' )					this.itemlist_actions[ index - 1 ].SetInvalid_ActionData( field, error.error_message );
	else if ( field === 'act_data:capture_includes' )			this.itemlist_actions[ index - 1 ].SetInvalid_ActionData( field, error.error_message );
	else if ( field === 'act_data:refund_includes' )			this.itemlist_actions[ index - 1 ].SetInvalid_ActionData( field, error.error_message );
	else if ( field === 'act_data:capture_nontax_charges' )		this.itemlist_actions[ index - 1 ].SetInvalid_ActionData( field, error.error_message );
	else if ( field === 'act_data:capture_dollars_within' )		this.itemlist_actions[ index - 1 ].SetInvalid_ActionData( field, error.error_message );
}

OWFWorkflow_Step_Actions.prototype.onSaveData = function()
{
	this.workflow.actions = this.GetActions();
}

OWFWorkflow_Step_Actions.prototype.onRestoreData = function()
{
	this.SetActions( this.workflow.actions );
}

OWFWorkflow_Step_Actions.prototype.SetActions = function( actions )
{
	var i, i_len;

	this.itemlist_actions					= new Array();
	this.itemlist_selectedactions			= new Array();
	this.element_actions_wrapper.innerHTML	= '';

	if ( Array.isArray( actions ) )
	{
		for ( i = 0, i_len = actions.length; i < i_len; i++ )
		{
			this.ActionItem_CreateAndInsert( actions[ i ], -1 );
		}
	}

	if ( this.itemlist_actions.length === 0 )
	{
		this.element_data_container.appendChild( this.element_actions_empty_message );
	}

	this.EnableDisableButtons();
}

OWFWorkflow_Step_Actions.prototype.GetActions = function()
{
	var i, i_len, result;

	result = new Array();

	for ( i = 0, i_len = this.itemlist_actions.length; i < i_len; i++ )
	{
		result.push( this.itemlist_actions[ i ].GetAction() );
	}

	return result;
}

OWFWorkflow_Step_Actions.prototype.ActionItemSelectionList_UpdateSort = function()
{
	var self = this;

	this.itemlist_selectedactions.sort( function( a, b )
	{
		var index_a, index_b;

		index_a = self.itemlist_actions.indexOf( a );
		index_b = self.itemlist_actions.indexOf( b );

		return index_a - index_b;
	} );
}

OWFWorkflow_Step_Actions.prototype.ActionItemSelectionList_Append = function( item )
{
	if ( this.itemlist_selectedactions.indexOf( item ) === -1 )
	{
		this.itemlist_selectedactions.push( item );
	}

	this.ActionItemSelectionList_UpdateSort();
}

OWFWorkflow_Step_Actions.prototype.ActionItemSelectionList_Remove = function( item )
{
	var index = this.itemlist_selectedactions.indexOf( item );

	if ( index !== -1 )
	{
		this.itemlist_selectedactions.splice( index, 1 );
	}
}

OWFWorkflow_Step_Actions.prototype.ActionItemSelectionList_DeleteSelectedItems = function()
{
	var item;

	while ( this.itemlist_selectedactions.length )
	{
		item = this.itemlist_selectedactions.pop();
		this.ActionItem_Delete( item );
	}
}

OWFWorkflow_Step_Actions.prototype.ActionItemSelectionList_Empty = function()
{
	var i, i_len, items;

	items = this.itemlist_selectedactions.slice();

	for ( i = 0, i_len = items.length; i < i_len; i++ )
	{
		items[ i ].Deselect();
	}

	this.itemlist_selectedactions = new Array();

	this.EnableDisableButtons();
}

OWFWorkflow_Step_Actions.prototype.ActionItem_AtIndex = function( index )
{
	if ( index >= 0 && this.itemlist_actions.hasOwnProperty( index ) && this.itemlist_actions[ index ] instanceof OWFWorkflow_Step_Actions_ActionItem )
	{
		return this.itemlist_actions[ index ];
	}

	return null;
}

OWFWorkflow_Step_Actions.prototype.ActionItem_ContainedElement_AtIndex = function( index )
{
	var item;

	if ( ( item = this.ActionItem_AtIndex( index ) ) !== null )
	{
		return item.ContainedElement();
	}

	return null;
}

OWFWorkflow_Step_Actions.prototype.ActionItem_IndexOf = function( item )
{
	return this.itemlist_actions.indexOf( item );
}

OWFWorkflow_Step_Actions.prototype.ActionItem_Count = function()
{
	return this.itemlist_actions.length;
}

OWFWorkflow_Step_Actions.prototype.ActionItem_Create = function( action )
{
	var self = this;
	var item;

	item						= new OWFWorkflow_Step_Actions_ActionItem();
	item.onSelect				= function() { self.ActionItem_OnSelect( item ); };
	item.onDeselect				= function() { self.ActionItem_OnDeselect( item ); };
	item.onRequestDelete		= function() { self.ActionItem_Delete( item ); };
	item.onDragAndDrop_Start	= function( mousepos_x, mousepos_y ) { self.ActionItem_onDragAndDrop_Start( item, mousepos_x, mousepos_y ); };
	item.onDragAndDrop_Move		= function( mousepos_x, mousepos_y ) { self.ActionItem_onDragAndDrop_Move( item, mousepos_x, mousepos_y ); };
	item.onDragAndDrop_End		= function( cancelled ) { self.ActionItem_onDragAndDrop_End( item, cancelled ); };
	item.onInsert_Action_Above	= function() { self.ActionItem_CreateAndInsert( null, self.ActionItem_IndexOf( item ) ); };
	item.onInsert_Action_Below	= function() { self.ActionItem_CreateAndInsert( null, self.ActionItem_IndexOf( item ) + 1 ); };
	item.onEnter_Value			= function( e ) { return self.onEnter_Step( e ); };

	item.SetAction( action );
	item.SetDragAndDrop_Enabled();

	return item;
}

OWFWorkflow_Step_Actions.prototype.ActionItem_Insert = function( item, index )
{
	var sibling_item;

	if ( ( sibling_item = this.ActionItem_AtIndex( index ) ) === null )
	{
		index = this.itemlist_actions.length;
	}

	item.SetParentNode( this.element_actions_wrapper );
	item.SetParentNode_InsertBefore( this.element_actions_wrapper, sibling_item ? sibling_item.ContainedElement() : null );

	this.itemlist_actions.splice( index, 0, item );

	if ( this.itemlist_actions.length > 0 )
	{
		if ( this.element_actions_empty_message.parentNode )
		{
			this.button_emptymessage_addaction.ForceRemoveFocus(); // Remove key events if button has focus
			this.element_actions_empty_message.parentNode.removeChild( this.element_actions_empty_message );
		}
	}
}

OWFWorkflow_Step_Actions.prototype.ActionItem_CreateAndInsert = function( action, index )
{
	var item = this.ActionItem_Create( action );

	this.ActionItem_Insert( item, index );

	return item;
}

OWFWorkflow_Step_Actions.prototype.ActionItem_Delete = function( item )
{
	var index;

	item.Remove();

	if ( ( index = this.itemlist_actions.indexOf( item ) ) !== -1 )
	{
		this.itemlist_actions.splice( index, 1 );
	}

	if ( this.itemlist_actions.length === 0 )
	{
		this.element_data_container.appendChild( this.element_actions_empty_message );
	}

	this.EnableDisableButtons();
}

OWFWorkflow_Step_Actions.prototype.ActionItem_OnSelect = function( item )
{
	this.ActionItemSelectionList_Append( item );
	this.EnableDisableButtons();
}

OWFWorkflow_Step_Actions.prototype.ActionItem_OnDeselect = function( item )
{
	this.ActionItemSelectionList_Remove( item );
	this.EnableDisableButtons();
}

OWFWorkflow_Step_Actions.prototype.ActionItem_onDragAndDrop_Start = function( item, mousepos_x, mousepos_y )
{
	var i, rect, i_len, rect_item, start_top, oncomplete, start_left, item_selected, scrollfromtop, cloned_element, container_rect, scrollfromleft, cloned_element_list;

	if ( !item.Selected() )
	{
		this.ActionItemSelectionList_Empty();
		item.Select();
	}

	rect									= item.BoundingClientRect();
	container_rect							= this.element_content.getBoundingClientRect();
	scrollfromtop							= getScrollTop();
	scrollfromleft							= getScrollLeft();

	this.draganddrop_active					= true;
	this.draganddrop_index					= this.ActionItem_IndexOf( item );
	this.draganddrop_selection				= this.itemlist_selectedactions.slice();

	this.draganddrop_mousepos_x_start		= mousepos_x;
	this.draganddrop_mousepos_y_start		= mousepos_y;
	this.draganddrop_mousepos_x_offset		= ( mousepos_x - rect.left ) - scrollfromleft;
	this.draganddrop_mousepos_y_offset		= ( mousepos_y - rect.top ) - scrollfromtop;

	this.draganddrop_element				= newElement( 'span', { 'class': 'workflow_addeditdialog_action_draganddrop_element' }, null, null );
	this.draganddrop_element.style.top		= ( rect.top - container_rect.top ) + 'px';
	this.draganddrop_element.style.left		= ( rect.left - container_rect.left ) + 'px';
	this.draganddrop_element.style.width	= ( rect.width ) + 'px';

	this.draganddrop_element_position		= newElement( 'span', { 'class': 'workflow_addeditdialog_action_draganddrop_element_position' },	null, null );

	this.draganddrop_animationlist_start	= new Array();
	this.draganddrop_animationlist_end		= new Array();

	cloned_element_list						= new Array();

	for ( i = 0, i_len = this.draganddrop_selection.length; i < i_len; i++ )
	{
		item_selected						= this.draganddrop_selection[ i ];
		rect_item							= item_selected.BoundingClientRect();

		item_selected.SetDragAndDrop_Active();

		start_top							= ( stod_def( ( rect_item.top + scrollfromtop ), 0 ) - ( rect.top - container_rect.top ) );
		start_left							= 0;

		if ( i > 1 )		end_top = 10;
		else if ( i > 0 )	end_top = 5;
		else				end_top = 0;

		if ( i > 1 )		end_left = 10;
		else if ( i > 0 )	end_left = 5;
		else				end_left = 0;

		cloned_element						= newElement( 'span', { 'class': 'workflow_addeditdialog_action_draganddrop_overlay' }, null, null );
		cloned_element.style.width			= rect_item.width + 'px';
		cloned_element.style.height			= rect_item.height + 'px';
		cloned_element.style.top			= start_top + 'px';
		cloned_element.style.left			= start_left + 'px';
		cloned_element.style.overflow		= 'hidden';
		cloned_element.style.zIndex			= -i;

		if ( i === 0 )
		{
			cloned_element.element_drag_container					= newElement( 'span', { 'class': 'workflow_addeditdialog_action_draganddrop_overlay_drag_container' },	null, cloned_element );
			cloned_element.element_drag								= newElement( 'span', { 'class': 'workflow_addeditdialog_action_draganddrop_overlay_drag' },			null, cloned_element.element_drag_container );
			cloned_element.element_drag_bg1							= newElement( 'span', { 'class': 'workflow_addeditdialog_action_draganddrop_overlay_drag_bg1' },		null, cloned_element.element_drag );
			cloned_element.element_drag_bg2							= newElement( 'span', { 'class': 'workflow_addeditdialog_action_draganddrop_overlay_drag_bg2' },		null, cloned_element.element_drag );
			cloned_element.element_drag_bg3							= newElement( 'span', { 'class': 'workflow_addeditdialog_action_draganddrop_overlay_drag_bg3' },		null, cloned_element.element_drag );
			cloned_element.element_drag_bg4							= newElement( 'span', { 'class': 'workflow_addeditdialog_action_draganddrop_overlay_drag_bg4' },		null, cloned_element.element_drag );
			cloned_element.element_drag_bg5							= newElement( 'span', { 'class': 'workflow_addeditdialog_action_draganddrop_overlay_drag_bg5' },		null, cloned_element.element_drag );
			cloned_element.element_drag_bg6							= newElement( 'span', { 'class': 'workflow_addeditdialog_action_draganddrop_overlay_drag_bg6' },		null, cloned_element.element_drag );
			cloned_element.element_drag_active_tag					= newElement( 'span', { 'class': 'workflow_addeditdialog_action_draganddrop_overlay_tag' },				null, cloned_element );
			cloned_element.element_drag_active_message				= newElement( 'span', { 'class': 'workflow_addeditdialog_action_draganddrop_overlay_message' },			null, cloned_element );

			cloned_element.element_drag_active_tag.textContent		= '0';
			cloned_element.element_drag_active_message.textContent	= 'Moving 0 Records';

			classNameAddIfMissing( cloned_element, 'workflow_addeditdialog_action_draganddrop_overlay_border' );
		}

		this.draganddrop_element.appendChild( cloned_element );
		this.DragAndDrop_AnimateToDragPosition_Start( this.draganddrop_animationlist_start, cloned_element, start_top, end_top, start_left, end_left, rect_item.width, rect.width, rect_item.height, 44 );
		this.DragAndDrop_AnimateToDragPosition_End( this.draganddrop_animationlist_end, cloned_element );

		cloned_element_list.push( cloned_element );
	}

	oncomplete = function()
	{
		var i, i_len;

		for ( i = 3, i_len = cloned_element_list.length; i < i_len; i++ )
		{
			cloned_element_list[ i ].style.display = 'none';
		}
	}

	this.element_data_container.appendChild( this.draganddrop_element_position );
	this.element_data_container.appendChild( this.draganddrop_element );

	cancelAnimationFrame( window[ this.draganddrop_animation_id ] );
	beginAnimations( this.draganddrop_animationlist_start, this.draganddrop_animation_id, null, oncomplete );

	classNameAddIfMissing( this.element_actions_wrapper, 'draganddrop' );
}

OWFWorkflow_Step_Actions.prototype.DragAndDrop_AnimateToDragPosition_Start = function( animationlist, row, start_top, end_top, start_left, end_left, start_width, end_width, start_height, end_height )
{
	var self = this;
	var translate_y, translate_x;

	translate_y			= end_top - start_top;
	translate_x			= end_left - start_left;
	row.style.transform	= 'translateY(0) translateX(0)';

	animationlist.push( createAnimation(
	{
		delay:		0,
		duration:	250,
		delta:		animationCircularEaseOut,
		step:		function( delta )
		{
			var count, formatted_count;

			count				= Math.round( delta * self.draganddrop_selection.length );
			formatted_count		= count.toString().replace( /\B(?=(\d{3})+(?!\d))/g, ',' );

			row.style.transform	= 'translateY(' + ( delta * translate_y ) + 'px) translateX(' + ( delta * translate_x ) + 'px)';
			row.style.width		= ( ( ( 1 - delta ) * start_width ) + ( delta * end_width ) ) + 'px';
			row.style.height	= ( ( ( 1 - delta ) * start_height ) + ( delta * end_height ) ) + 'px';

			if ( row && row.element_drag_active_tag )		row.element_drag_active_tag.textContent		= formatted_count;
			if ( row && row.element_drag_active_message )	row.element_drag_active_message.textContent	= 'Moving ' + formatted_count + ( count > 1 ? ' Records' : ' Record' );
		}
	} ) );
}

OWFWorkflow_Step_Actions.prototype.DragAndDrop_AnimateToDragPosition_End = function( animationlist, row )
{
	row.style.opacity	= 1;

	animationlist.push( createAnimation(
	{
		delay:		0,
		duration:	150,
		delta:		animationLinear,
		step:		function( delta )
		{
			row.style.opacity = ( 1 - delta );
		}
	} ) );
}

OWFWorkflow_Step_Actions.prototype.ActionItem_onDragAndDrop_Move = function( item, mousepos_x, mousepos_y )
{
	var i, i_len, index, item_end, item_start, item_looped, parent_rect, hole_created, container_top, item_selected, scrollfromtop, container_left, scrollfromleft, positioning_item;
	var item_selected_index, positioning_element, position_on_selection, rect_positioning_element, rect_positioning_element_end, rect_position_indicator_parent, rect_positioning_element_start;

	index						= this.ActionItem_onDragAndDrop_Move_LowLevel( item, mousepos_y );
	positioning_element			= null;
	position_on_selection		= false;

	for ( i = 0, i_len = this.draganddrop_selection.length; i < i_len; i++ )
	{
		item_selected			= this.draganddrop_selection[ i ];
		item_selected_index		= this.ActionItem_IndexOf( item_selected );
		hole_created			= item_selected_index < index;

		if ( ( index > item_selected_index ) && ( item_selected_index === ( this.ActionItem_Count() - 1 ) ) )	position_on_selection = true;
		else if ( hole_created && ( ( index - 1 ) === item_selected_index ) )									position_on_selection = true;
		else if ( !hole_created && ( index === item_selected_index ) )											position_on_selection = true;

		if ( position_on_selection )
		{
			positioning_item	= item_selected;
			positioning_element	= item_selected.ContainedElement();

			break;
		}
	}

	if ( positioning_element === null )
	{
		if ( this.ActionItem_Count() === 0 )			positioning_element = this.element_actions_wrapper;
		else if ( index >= this.ActionItem_Count() )	positioning_element = this.ActionItem_ContainedElement_AtIndex( index - 1 );
		else											positioning_element = this.ActionItem_ContainedElement_AtIndex( index );
	}

	if ( position_on_selection )	this.draganddrop_index = this.ActionItem_IndexOf( positioning_item );
	else							this.draganddrop_index = index;

	rect_position_indicator_parent	= this.draganddrop_element_position.parentNode.getBoundingClientRect();
	rect_positioning_element		= positioning_element.getBoundingClientRect();

	if ( !position_on_selection )
	{
		if ( this.ActionItem_Count() === 0 )			this.draganddrop_element_position.style.top = ( this.element_data_container.scrollTop + ( rect_positioning_element.top + ( rect_positioning_element.height / 2 ) ) - rect_position_indicator_parent.top ) + 'px';
		else if ( index >= this.ActionItem_Count() )	this.draganddrop_element_position.style.top = ( this.element_data_container.scrollTop + ( rect_positioning_element.bottom + 8 ) - rect_position_indicator_parent.top ) + 'px';
		else											this.draganddrop_element_position.style.top = ( this.element_data_container.scrollTop + ( rect_positioning_element.top - 8 ) - rect_position_indicator_parent.top ) + 'px';

		this.draganddrop_element_position.style.height = '2px';
	}
	else
	{
		item_start 	= positioning_item;
		item_end	= positioning_item;

		for ( i = this.ActionItem_IndexOf( item_start ); i >= 0; i-- )
		{
			if ( ( item_looped = this.ActionItem_AtIndex( i ) ) === null )
			{
				continue;
			}

			if ( this.draganddrop_selection.indexOf( item_looped ) === -1 )
			{
				break;
			}

			item_start = item_looped;
		}

		for ( i = this.ActionItem_IndexOf( item_end ), i_len = this.ActionItem_Count(); i < i_len; i++ )
		{
			if ( ( item_looped = this.ActionItem_AtIndex( i ) ) === null )
			{
				continue;
			}

			if ( this.draganddrop_selection.indexOf( item_looped ) === -1 )
			{
				break;
			}

			item_end = item_looped;
		}

		rect_positioning_element_start					= item_start.BoundingClientRect();
		rect_positioning_element_end					= item_end.BoundingClientRect();

		this.draganddrop_element_position.style.top		= ( ( this.element_data_container.scrollTop + rect_positioning_element_start.top ) - rect_position_indicator_parent.top ) + 'px';
		this.draganddrop_element_position.style.height	= ( rect_positioning_element_end.bottom - rect_positioning_element_start.top ) + 'px';
	}

	this.draganddrop_element_position.style.width		= ( rect_positioning_element.width ) + 'px';
	this.draganddrop_element_position.style.left		= ( this.element_data_container.scrollLeft + rect_positioning_element.left - rect_position_indicator_parent.left ) + 'px';

	scrollfromtop										= this.draganddrop_element.parentNode.scrollTop;
	scrollfromleft										= this.draganddrop_element.parentNode.scrollLeft;
	parent_rect											= this.draganddrop_element.parentNode.getBoundingClientRect();
	container_top										= ( mousepos_y - parent_rect.top ) - this.draganddrop_mousepos_y_offset;
	container_left										= ( mousepos_x - parent_rect.left ) - this.draganddrop_mousepos_x_offset;

	this.draganddrop_element.style.top					= ( container_top + scrollfromtop ) + 'px';
	this.draganddrop_element.style.left					= ( container_left + scrollfromleft ) + 'px';
}

OWFWorkflow_Step_Actions.prototype.ActionItem_onDragAndDrop_Move_LowLevel = function( item, mousepos_y )
{
	var i, i_len, item_rect, item_prev, item_prev_rect;

	for ( i = 0, i_len = this.itemlist_actions.length; i < i_len; i++ )
	{
		if ( ( item = this.ActionItem_AtIndex( i ) ) === null )
		{
			continue;
		}

		item_rect = item.ContainedElement().getBoundingClientRect();

		if ( i === 0 )
		{
			if ( mousepos_y <= ( item_rect.top + ( item_rect.height / 2 ) ) )
			{
				//
				// Insert BEFORE item
				//

				return i;
			}
		}
		else if ( ( item_prev = this.ActionItem_AtIndex( i - 1 ) ) !== null )
		{			item_prev_rect	= item_prev.ContainedElement().getBoundingClientRect();

			if ( mousepos_y >= ( item_prev_rect.top + ( item_prev_rect.height / 2 ) ) &&
				 mousepos_y <= ( item_rect.top + ( item_rect.height / 2 ) ) )
			{
				//
				// Insert BEFORE item
				//

				return i;
			}
		}
	}

	//
	// Insert at end of list
	//

	return this.ActionItem_Count();
}

OWFWorkflow_Step_Actions.prototype.ActionItem_onDragAndDrop_End = function( item, cancelled )
{
	var self = this;

	this.draganddrop_active = false;

	cancelAnimationFrame( window[ this.draganddrop_animation_id ] );
	beginAnimations( this.draganddrop_animationlist_end, this.draganddrop_animation_id, null, function()
	{
		var i, i_len, index, item_insert, itemlist_insert;

		self.ActionItemSelectionList_Empty();

		classNameRemoveIfPresent( self.element_actions_wrapper, 'draganddrop' );

		for ( i = 0, i_len = self.draganddrop_selection.length; i < i_len; i++ )
		{
			self.draganddrop_selection[ i ].SetDragAndDrop_Inactive();
		}

		if ( self.draganddrop_element.parentNode )
		{
			self.draganddrop_element.parentNode.removeChild( self.draganddrop_element );
		}

		if ( self.draganddrop_element_position.parentNode )
		{
			self.draganddrop_element_position.parentNode.removeChild( self.draganddrop_element_position );
		}

		if ( !cancelled )
		{
			itemlist_insert	= self.draganddrop_selection.slice();
			index			= self.draganddrop_index - itemlist_insert.reduce( function( hole_offset, item_reduced ) { return hole_offset + ( self.ActionItem_IndexOf( item_reduced ) < self.draganddrop_index ? 1 : 0 ); }, 0 );

			for ( i = 0, i_len = itemlist_insert.length; i < i_len; i++ )
			{
				self.ActionItem_Delete( itemlist_insert[ i ] );
			}

			while ( itemlist_insert.length )
			{
				item_insert = itemlist_insert.pop();
				self.ActionItem_Insert( item_insert, index );
			}
		}

		for ( i = 0, i_len = self.draganddrop_selection.length; i < i_len; i++ )
		{
			self.draganddrop_selection[ i ].Select();
		}
	} );
}

OWFWorkflow_Step_Actions.prototype.EnableDisableButtons = function()
{
	if ( this.itemlist_selectedactions.length )
	{
		this.button_delete.Enable();
		this.button_deselect.Enable();
	}
	else
	{
		this.button_delete.Disable();
		this.button_deselect.Disable();
	}
}

OWFWorkflow_Step_Actions.prototype.Render_Validation = function()
{
	var i, i_len, errors_action;

	if ( !this.step_visible || this.draganddrop_active )
	{
		return;
	}

	if ( this.itemlist_actions.length === 0 )
	{
		this.ClearValid();
	}
	else
	{
		for ( i = 0, i_len = this.itemlist_actions.length; i < i_len; i++ )
		{
			errors_action = new Array();

			if ( !this.itemlist_actions[ i ].Validate( errors_action ) )
			{
				this.ClearValid();
				return;
			}
		}

		this.SetValid();
	}
}

// OWFWorkflow_Step_Actions_ActionItem
////////////////////////////////////////////////////

function OWFWorkflow_Step_Actions_ActionItem()
{
	var self = this;
	var element_custom;

	// Variables
	this.action							= null;
	this.editmode						= false;
	this.selectable						= true;
	this.selected						= false;
	this.draganddrop_active				= false;
	this.draganddrop_enabled			= false;
	this.draganddrop_keystackentry		= null;
	this.animation_id					= GenerateUniqueID();

	this.render_draganddrop_start		= function() { self.Render_DragAndDrop_Start(); };
	this.render_draganddrop_move		= function() { self.Render_DragAndDrop_Move(); };
	this.render_draganddrop_end			= function() { self.Render_DragAndDrop_End(); };
	this.event_returnfalse				= function( event ) { return eventPreventDefault( event ? event : window.event ); };
	this.event_onclick_expand			= function( event ) { return self.Event_OnClick_Expand( event ? event : window.event ); };
	this.event_onclick_selection		= function( event ) { return self.Event_OnClick_Selection( event ? event : window.event ); };
	this.event_onmousedown_draganddrop	= function( event ) { return self.Event_OnMouseDown_DragAndDrop( event ? event : window.event ); };
	this.event_onmousemove_draganddrop	= function( event ) { return self.Event_OnMouseMove_DragAndDrop( event ? event : window.event ); };
	this.event_onmouseup_draganddrop	= function( event ) { return self.Event_OnMouseUp_DragAndDrop( event ? event : window.event ); };

	// Elements
	this.element_container				= newElement( 'span', { 'class': 'workflow_addeditdialog_action' },									null, null );

	this.element_row					= newElement( 'span', { 'class': 'workflow_addeditdialog_action_row' },								null, this.element_container );
	this.element_title					= newElement( 'span', { 'class': 'workflow_addeditdialog_action_title' },							null, this.element_row );

	this.element_drag_container			= newElement( 'span', { 'class': 'workflow_addeditdialog_action_drag_container' },					null, this.element_title );
	this.element_drag					= newElement( 'span', { 'class': 'workflow_addeditdialog_action_drag' },							null, this.element_drag_container );
	this.element_drag_bg1				= newElement( 'span', { 'class': 'workflow_addeditdialog_action_drag_bg1' },						null, this.element_drag );
	this.element_drag_bg2				= newElement( 'span', { 'class': 'workflow_addeditdialog_action_drag_bg2' },						null, this.element_drag );
	this.element_drag_bg3				= newElement( 'span', { 'class': 'workflow_addeditdialog_action_drag_bg3' },						null, this.element_drag );
	this.element_drag_bg4				= newElement( 'span', { 'class': 'workflow_addeditdialog_action_drag_bg4' },						null, this.element_drag );
	this.element_drag_bg5				= newElement( 'span', { 'class': 'workflow_addeditdialog_action_drag_bg5' },						null, this.element_drag );
	this.element_drag_bg6				= newElement( 'span', { 'class': 'workflow_addeditdialog_action_drag_bg6' },						null, this.element_drag );

	this.element_selection_container	= newElement( 'span', { 'class': 'workflow_addeditdialog_action_selection_container' },				null, this.element_title );
	this.element_selection_checkbox		= newElement( 'span', { 'class': 'workflow_addeditdialog_action_selection_checkbox' },				null, this.element_selection_container );
	this.element_selection_bg1			= newElement( 'span', { 'class': 'workflow_addeditdialog_action_selection_checkbox_bg1' },			null, this.element_selection_checkbox );
	this.element_selection_bg2			= newElement( 'span', { 'class': 'workflow_addeditdialog_action_selection_checkbox_bg2' },			null, this.element_selection_checkbox );

	this.element_action					= newElement( 'span', { 'class': 'workflow_addeditdialog_action_action' },							null, this.element_title );
	this.element_action_bg_1			= newElement( 'span', { 'class': 'workflow_addeditdialog_action_action_bg_1' },						null, this.element_action );
	this.element_action_bg_2			= newElement( 'span', { 'class': 'workflow_addeditdialog_action_action_bg_2' },						null, this.element_action );
	this.element_summary				= newElement( 'span', { 'class': 'workflow_addeditdialog_action_summary' },							null, this.element_title );
	this.element_expand					= newElement( 'span', { 'class': 'workflow_addeditdialog_action_expand' },							null, this.element_title );
	this.element_expand_bg_1			= newElement( 'span', { 'class': 'workflow_addeditdialog_action_expand_bg_1' },						null, this.element_expand );
	this.element_expand_bg_2			= newElement( 'span', { 'class': 'workflow_addeditdialog_action_expand_bg_2' },						null, this.element_expand );
	this.element_menu					= newElement( 'span', { 'class': 'workflow_addeditdialog_action_menu_container' },					null, this.element_title );
	this.element_content				= newElement( 'span', { 'class': 'workflow_addeditdialog_action_content' },							null, this.element_row );

	this.element_act_container			= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_container' },					null, this.element_content );
	this.element_act_data_container		= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_container' },				null, this.element_content );

	// Menu Dropdown Setup
	element_custom						= newElement( 'span', { 'class': 'workflow_addeditdialog_step_actions_row_button_custom' },			null, null );
	element_custom.element_icon			= newElement( 'span', { 'class': 'workflow_addeditdialog_step_actions_row_button_custom_el1' },		null, element_custom );
	element_custom.element_text			= newElement( 'span', { 'class': 'workflow_addeditdialog_step_actions_row_button_custom_el2' },		null, element_custom );
	element_custom.element_subtext		= newElement( 'span', { 'class': 'workflow_addeditdialog_step_actions_row_button_custom_el3' },		null, element_custom );

	this.menubutton_menu				= new MMMenuButton( '', this.element_menu );
	this.menubutton_menu.SetAnimateMenu( true );
	this.menubutton_menu.SetMenuAsRootMenu( true );
	this.menubutton_menu.SetMenuAsRootMenu_AutosizesFromRight( true );
	this.menubutton_menu.SetHoverText( 'More Options' );
	this.menubutton_menu.SetCustomContent( element_custom );
	this.menubutton_menu.SetClassName( 'mm10_menubutton_container_style_common' );
	this.menubutton_menu.SetMenuClassName( 'mm10_menubutton_container_style_common_menu' );
	this.menubutton_menu.SetButtonClassName( 'workflow_addeditdialog_step_actions_row_button' );
	this.menubutton_menu.Menu_Append_Item( 'Add Action Above',	function( event ) { self.onInsert_Action_Above(); } );
	this.menubutton_menu.Menu_Append_Item( 'Add Action Below',	function( event ) { self.onInsert_Action_Below(); } );
	this.menubutton_menu.Menu_Append_Divider();
	this.menubutton_menu.Menu_Append_Item_Negative( 'Delete',	function( event ) { self.onRequestDelete(); } );

	this.Initialize_Action();
	this.Initialize_Note();
	this.Initialize_Queue();
	this.Initialize_Webhook();
	this.Initialize_Payment();
	this.Initialize_VOID();
	this.Initialize_CustomField();

	AddEvent( this.element_expand,				'click',		this.event_onclick_expand );
	AddEvent( this.element_summary,				'click',		this.event_onclick_expand );
	AddEvent( this.element_selection_container,	'click',		this.event_onclick_selection );
	AddEvent( this.element_drag_container,		'mousedown',	this.event_onmousedown_draganddrop );
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Initialize_Action = function()
{
	var self = this;

	this.select_action					= new MMSelect( this.element_act_container );
	this.select_action.onSetInvalid		= function() { self.Field_OnSetInvalid(); };
	this.select_action.onClearInvalid	= function() { self.Field_OnClearInvalid(); };
	this.select_action.SetOnChangeHandler( function( value ) { self.onSelectChanged_Action( value ); } );
	this.select_action.SetClassName( 'mm_select_common whole_width medium title_visible' );
	this.select_action.SetHoverText( 'Select Action' );
	this.select_action.SetTitle( 'Action' );
	this.select_action.SetSelectOne( true, '<Select One>',	'' );
	this.select_action.AddOption( 'Add to Queue',			'queue_add' );
	this.select_action.AddOption( 'Move to Queue',			'queue_move' );
	this.select_action.AddOption( 'Remove from Queue',		'queue_remove' );
	this.select_action.AddOption( 'Remove from All Queues',	'queue_remove_all' );
	this.select_action.AddOption( 'Add Note',				'note_add' );
	this.select_action.AddOption( 'Set Custom Field',		'customfield_set' );
	this.select_action.AddOption( 'Webhook (GET)',			'webhook_get' );
	this.select_action.AddOption( 'Webhook (POST)',			'webhook_post_order' );
	this.select_action.AddOption( 'Payment Actions',		'payment' );
	this.select_action.AddOption( 'VOID',					'void' );
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Initialize_Note = function()
{
	var self = this;

	this.element_note_container					= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_note_container' }, null, this.element_act_data_container );
	this.element_note_container.style.display	= 'none';

	this.textarea_note							= new MMTextArea( this.element_note_container, 'Note_Value', '' );
	this.textarea_note.onSetInvalid				= function() { self.Field_OnSetInvalid(); };
	this.textarea_note.onClearInvalid			= function() { self.Field_OnClearInvalid(); };
	this.textarea_note.SetTitle( 'Note Text' );
	this.textarea_note.SetResizeEnabled( { horizontal: false } );
	this.textarea_note.AddClassName( [ 'title_visible', 'whole_width' ] );
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Initialize_Queue = function()
{
	var self = this;

	this.element_queue_container				= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_queue_container' },		null, this.element_act_data_container );
	this.element_queue_select_container			= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_queue_select_container' },	null, this.element_queue_container );
	this.element_queue_button_container			= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_queue_button_container' },	null, this.element_queue_container );

	this.element_queue_container.style.display	= 'none';

	this.select_queue							= new MMSelect( this.element_queue_select_container );
	this.select_queue.onSetInvalid				= function() { self.Field_OnSetInvalid(); };
	this.select_queue.onClearInvalid			= function() { self.Field_OnClearInvalid(); };
	this.select_queue.SetClassName( 'mm_select_common whole_width medium title_visible' );
	this.select_queue.SetHoverText( 'Select Queue' );
	this.select_queue.SetTitle( 'Queue' );
	this.select_queue.SetSelectOne( true, '<Select One>', '' );
	this.select_queue.SetLoadFunction( function( params, callback ) { OrderWorkflow_InitializationDelegator_GetQueueList( callback ); } );
	this.select_queue.SetPopulateFunction( function( queue ) { this.AddOption( queue.name, queue.code ); } );
	this.select_queue.SetOnLoadCompleteHandler( function( response )
	{
		if ( response.success && ( response.data.data.length === 0 ) )
		{
			self.select_queue.Empty();
			self.select_queue.Disable();
			self.select_queue.AddOption( '<No Queues Present>', '' );
		}
	} );
	this.select_queue.Load();

	this.button									= new MMButton( this.element_queue_button_container );
	this.button.SetImage( 'add' );
	this.button.SetClassName( 'mm10_button_style_alternative_1 icon' );
	this.button.SetOnClickHandler( function( e )
	{
		var dialog;

		dialog			= new OWFQueue_AddDialog();
		dialog.onSave	= function( queue_code )
		{
			OrderWorkflow_InitializationDelegator_ClearQueueList();

			self.select_queue.Load();
			self.select_queue.SetValue( queue_code );
		};

		dialog.Show();
	} );
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Initialize_Webhook = function()
{
	var self = this;

	this.element_webhook_container								= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_webhook_container' },							null, this.element_act_data_container );
	this.element_webhook_url_container							= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_webhook_url_container' },						null, this.element_webhook_container );
	this.element_webhook_auth_credentials_container				= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_webhook_auth_credentials_container' },			null, this.element_webhook_container );
	this.element_webhook_auth_credentials_select_container		= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_webhook_auth_credentials_select_container' },	null, this.element_webhook_auth_credentials_container );
	this.element_webhook_auth_credentials_button_container		= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_webhook_auth_credentials_button_container' },	null, this.element_webhook_auth_credentials_container );

	this.element_webhook_container.style.display				= 'none';

	this.input_webhook_url										= new MMInput( this.element_webhook_url_container, 'Webhook_URL', '' );
	this.input_webhook_url.onSetInvalid							= function() { self.Field_OnSetInvalid(); };
	this.input_webhook_url.onClearInvalid						= function() { self.Field_OnClearInvalid(); };
	this.input_webhook_url.SetTitle( 'Webhook URL' );
	this.input_webhook_url.SetClassName( 'mm_input_common whole_width medium title_visible' );
	this.input_webhook_url.SetOnEnterHandler( function( e ) { return self.onEnter_Value( e ); } );

	this.select_webhook_auth_credentials						= new MMSelect( this.element_webhook_auth_credentials_select_container );
	this.select_webhook_auth_credentials.onSetInvalid			= function() { self.Field_OnSetInvalid(); };
	this.select_webhook_auth_credentials.onClearInvalid			= function() { self.Field_OnClearInvalid(); };
	this.select_webhook_auth_credentials.SetClassName( 'mm_select_common whole_width medium title_visible' );
	this.select_webhook_auth_credentials.AddMenuClassName( 'workflow_addeditdialog_action_act_data_webhook_authentication_credentials_select_menu' );
	this.select_webhook_auth_credentials.SetHoverText( 'Select Authentication Credentials' );
	this.select_webhook_auth_credentials.SetTitle( 'Authentication Credentials' );
	this.select_webhook_auth_credentials.SetSelectOne( true, 'None', 0 );
	this.select_webhook_auth_credentials.SetLoadFunction( function( params, callback ) { OrderWorkflow_InitializationDelegator_GetAuthenticationCredentialsList( callback ); } );
	this.select_webhook_auth_credentials.SetPopulateFunction( function( credentials )
	{
		var element;

		element									= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_webhook_authentication_credentials_select_menu_item_content' },	null, null );
		element.element_title					= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_webhook_authentication_credentials_select_menu_item_title' },		null, element );
		element.element_notes					= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_webhook_authentication_credentials_select_menu_item_subtitle' },	null, element );

		element.element_title.textContent		= credentials.descrip;

		if ( credentials.auth_type === 'basic' )
		{
			element.element_notes.textContent	= 'Authentication Type: Basic';
		}

		this.AddOption( credentials.descrip, credentials.id, element );
	} );
	this.select_webhook_auth_credentials.Load();

	this.button_add_auth_credentials							= new MMButton( this.element_webhook_auth_credentials_button_container );
	this.button_add_auth_credentials.SetImage( 'add' );
	this.button_add_auth_credentials.SetClassName( 'mm10_button_style_alternative_1 icon' );
	this.button_add_auth_credentials.SetOnClickHandler( function( e )
	{
		var dialog;

		dialog			= new OWFAuthenticationCredentialsDialog( null );
		dialog.onSave	= function( credentials )
		{
			OrderWorkflow_InitializationDelegator_ClearAuthenticationCredentialsList();

			self.select_webhook_auth_credentials.Load();
			self.select_webhook_auth_credentials.SetValue( credentials.id );
		}

		dialog.Show();
	} );
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Initialize_Payment = function()
{
	var self = this;

	this.element_payment_container									= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_payment_container' },				null, this.element_act_data_container );
	this.element_payment_operations_section							= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section column' },					null, this.element_payment_container );
	this.element_payment_rules_section								= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section column' },					null, this.element_payment_container );
	this.element_payment_settings_section							= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section column' },					null, this.element_payment_container );

	this.element_payment_container.style.display					= 'none';

	//
	// Automatic Payment Operations
	//

	this.element_payment_operations_title							= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section_item visible title' },		null, this.element_payment_operations_section );
	this.element_payment_operations_subtitle						= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section_item visible subtitle' },	null, this.element_payment_operations_section );
	this.element_payment_operations_content							= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section column' },					null, this.element_payment_operations_section );
	this.element_payment_operations_capture_container				= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section_item visible' },			null, this.element_payment_operations_content );
	this.element_payment_operations_refund_container				= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section_item visible' },			null, this.element_payment_operations_content );

	this.element_payment_operations_title.textContent				= 'Automatic Payment Operations';
	this.element_payment_operations_subtitle.textContent			= 'What payment actions do you want to perform?';

	this.checkbox_payment_capture_enabled							= new MMCheckBoxSlider( false, this.element_payment_operations_capture_container );
	this.checkbox_payment_capture_enabled.SetText( 'Capture' );
	this.checkbox_payment_capture_enabled.AddClassName( 'small' );

	this.checkbox_payment_refund_enabled							= new MMCheckBoxSlider( false, this.element_payment_operations_refund_container );
	this.checkbox_payment_refund_enabled.SetText( 'Refund' );
	this.checkbox_payment_refund_enabled.AddClassName( 'small' );

	//
	// Payment Operation Rules
	//

	this.element_payment_rules_title								= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section_item visible title' },		null, this.element_payment_rules_section );
	this.element_payment_rules_subtitle								= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section_item visible subtitle' },	null, this.element_payment_rules_section );
	this.element_payment_rules_content								= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section match_height' },			null, this.element_payment_rules_section );
	this.element_payment_rules_capture_container					= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section column' },					null, this.element_payment_rules_content );
	this.element_payment_rules_divider								= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section_divider' },				null, this.element_payment_rules_content );
	this.element_payment_rules_refund_container						= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section column' },					null, this.element_payment_rules_content );

	this.element_payment_rules_title.textContent					= 'Payment Operation Rules';
	this.element_payment_rules_subtitle.textContent					= 'Choose the settings that will determine how automatic payments are calculated.';

	this.element_payment_capture_settings_section					= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section column' },					null, this.element_payment_rules_capture_container );
	this.element_payment_capture_includes_container					= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section_item visible' },			null, this.element_payment_capture_settings_section );
	this.element_payment_capture_nontax_charges_container			= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section_item visible' },			null, this.element_payment_capture_settings_section );
	this.element_payment_capture_dollars_within_container			= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section_item visible' },			null, this.element_payment_capture_settings_section );

	this.select_payment_capture_includes							= new MMSelect( this.element_payment_capture_includes_container );
	this.select_payment_capture_includes.onSetInvalid				= function() { self.Field_OnSetInvalid(); };
	this.select_payment_capture_includes.onClearInvalid				= function() { self.Field_OnClearInvalid(); };
	this.select_payment_capture_includes.SetOnChangeHandler( function( value ) { self.onSelectChanged_PaymentCaptureAmount( value ); } );
	this.select_payment_capture_includes.SetClassName( 'mm_select_common whole_width medium title_visible' );
	this.select_payment_capture_includes.SetTitle( 'Collected Amount Includes' );
	this.select_payment_capture_includes.SetSelectOne( true, '<Select One>',			'' );
	this.select_payment_capture_includes.AddOption( 'Amount Of All Created Shipments',	'created_shipments' );
	this.select_payment_capture_includes.AddOption( 'Amount Of All Shipped Shipments',	'shipped_shipments' );
	this.select_payment_capture_includes.AddOption( 'Entire Order Amount',				'all' );

	this.select_payment_capture_nontax_charges						= new MMSelect( this.element_payment_capture_nontax_charges_container );
	this.select_payment_capture_nontax_charges.onSetInvalid			= function() { self.Field_OnSetInvalid(); };
	this.select_payment_capture_nontax_charges.onClearInvalid		= function() { self.Field_OnClearInvalid(); };
	this.select_payment_capture_nontax_charges.SetClassName( 'mm_select_common whole_width medium title_visible' );
	this.select_payment_capture_nontax_charges.SetTitle( 'Capture Non-Tax Charges' );
	this.select_payment_capture_nontax_charges.AddOption( 'Capture All Non-Tax Charges On First Capture',	'first' );
	this.select_payment_capture_nontax_charges.AddOption( 'Capture All Non-Tax Charges On Last Capture',	'last' );
	this.select_payment_capture_nontax_charges.Disable();

	this.input_payment_capture_dollars_within						= new MMInput( this.element_payment_capture_dollars_within_container, 'Capture_Dollars_Within', '' );
	this.input_payment_capture_dollars_within.onSetInvalid			= function() { self.Field_OnSetInvalid(); };
	this.input_payment_capture_dollars_within.onClearInvalid		= function() { self.Field_OnClearInvalid(); };
	this.input_payment_capture_dollars_within.SetTitle( 'If Capture Amount Is Within X Dollars Of Total, Capture All' );
	this.input_payment_capture_dollars_within.SetClassName( 'mm_input_common whole_width medium title_visible' );
	this.input_payment_capture_dollars_within.SetOnEnterHandler( function( e ) { return self.onEnter_Value( e ); } );
	this.input_payment_capture_dollars_within.SetValue( '0.00' );
	this.input_payment_capture_dollars_within.Disable();

	this.element_payment_refund_settings_section					= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section column' },					null, this.element_payment_rules_refund_container );
	this.element_payment_refund_includes_container					= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section_item visible' },			null, this.element_payment_refund_settings_section );
	this.element_payment_refund_order_charges_label					= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section_item visible label' },		null, this.element_payment_refund_settings_section );
	this.element_payment_refund_order_charges_shipping_container	= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section_item visible' },			null, this.element_payment_refund_settings_section );
	this.element_payment_refund_order_charges_handling_container	= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section_item visible' },			null, this.element_payment_refund_settings_section );
	this.element_payment_refund_order_charges_payment_container		= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section_item visible' },			null, this.element_payment_refund_settings_section );
	this.element_payment_refund_order_charges_tax_container			= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section_item visible' },			null, this.element_payment_refund_settings_section );
	this.element_payment_refund_order_charges_other_container		= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section_item visible' },			null, this.element_payment_refund_settings_section );

	this.element_payment_refund_order_charges_label.textContent		= 'Refund Order Charges When Entire Order Is Returned';

	this.select_payment_refund_includes								= new MMSelect( this.element_payment_refund_includes_container );
	this.select_payment_refund_includes.onSetInvalid				= function() { self.Field_OnSetInvalid(); };
	this.select_payment_refund_includes.onClearInvalid				= function() { self.Field_OnClearInvalid(); };
	this.select_payment_refund_includes.SetOnChangeHandler( function( value ) { self.onSelectChanged_PaymentRefundAmount( value ); } );
	this.select_payment_refund_includes.SetClassName( 'mm_select_common whole_width medium title_visible' );
	this.select_payment_refund_includes.SetTitle( 'Collected Amount Excludes' );
	this.select_payment_refund_includes.SetSelectOne( true, '<Select One>',				'' );
	this.select_payment_refund_includes.AddOption( 'Amount Of All Created Returns',		'created_returns' );
	this.select_payment_refund_includes.AddOption( 'Amount Of All Received Returns',	'received_returns' );

	this.checkbox_payment_refund_order_charges_shipping				= new MMCheckBox( false, this.element_payment_refund_order_charges_shipping_container );
	this.checkbox_payment_refund_order_charges_shipping.SetText( 'Shipping Charges' );
	this.checkbox_payment_refund_order_charges_shipping.Disable();

	this.checkbox_payment_refund_order_charges_handling				= new MMCheckBox( false, this.element_payment_refund_order_charges_handling_container );
	this.checkbox_payment_refund_order_charges_handling.SetText( 'Handling Charges' );
	this.checkbox_payment_refund_order_charges_handling.Disable();

	this.checkbox_payment_refund_order_charges_payment				= new MMCheckBox( false, this.element_payment_refund_order_charges_payment_container );
	this.checkbox_payment_refund_order_charges_payment.SetText( 'Payment Charges' );
	this.checkbox_payment_refund_order_charges_payment.Disable();

	this.checkbox_payment_refund_order_charges_tax					= new MMCheckBox( false, this.element_payment_refund_order_charges_tax_container );
	this.checkbox_payment_refund_order_charges_tax.SetText( 'Non-Item Level Tax Charges' );
	this.checkbox_payment_refund_order_charges_tax.Disable();

	this.checkbox_payment_refund_order_charges_other				= new MMCheckBox( false, this.element_payment_refund_order_charges_other_container );
	this.checkbox_payment_refund_order_charges_other.SetText( 'Other Charges' );
	this.checkbox_payment_refund_order_charges_other.Disable();

	//
	// Additional Settings
	//

	this.element_payment_settings_title								= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section_item visible title' },		null, this.element_payment_settings_section );
	this.element_payment_settings_content							= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section column' },					null, this.element_payment_settings_section );
	this.element_payment_prorate_discounts_container				= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section_item visible' },			null, this.element_payment_settings_content );
	this.element_payment_add_notes_container						= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_section_item visible' },			null, this.element_payment_settings_content );

	this.element_payment_settings_title.textContent					= 'Additional Settings';

	this.checkbox_payment_prorate_discounts							= new MMCheckBox( false, this.element_payment_prorate_discounts_container );
	this.checkbox_payment_prorate_discounts.SetText( 'Prorate Order-Level Discounts' );

	this.checkbox_payment_add_notes									= new MMCheckBox( false, this.element_payment_add_notes_container );
	this.checkbox_payment_add_notes.SetText( 'Add Payment Operation Notes to Order' );
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Initialize_VOID = function()
{
	this.element_void_container					= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_void_container' }, null, this.element_act_data_container );
	this.element_void_container.style.display	= 'none';

	this.checkbox_void_add_notes				= new MMCheckBox( false, this.element_void_container );
	this.checkbox_void_add_notes.SetText( 'Add VOID Notes to Order' );
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Initialize_CustomField = function()
{
	var self = this;

	this.element_customfield_container					= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_customfield_container' },			null, this.element_act_data_container );
	this.element_customfield_select_container			= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_customfield_select_container' },	null, this.element_customfield_container );
	this.element_customfield_editor_container			= newElement( 'span', { 'class': 'workflow_addeditdialog_action_act_data_customfield_editor_container' },	null, this.element_customfield_container );

	this.element_customfield_container.style.display	= 'none';

	this.select_customfield_set_loaded					= false;
	this.select_customfield_set							= new MMSelect( this.element_customfield_select_container );
	this.select_customfield_set.onSetInvalid			= function() { self.Field_OnSetInvalid(); };
	this.select_customfield_set.onClearInvalid			= function() { self.Field_OnClearInvalid(); };
	this.select_customfield_set.SetClassName( 'mm_select_common whole_width medium title_visible' );
	this.select_customfield_set.SetHoverText( 'Select Custom Field' );
	this.select_customfield_set.SetTitle( 'Custom Field' );
	this.select_customfield_set.SetSelectOne( true, '<Select One>', '' );
	this.select_customfield_set.SetOnChangeHandler( function( value ) { self.onSelectChanged_CustomFieldSet( value ); } );
	this.select_customfield_set.SetLoadFunction( function( params, callback ) { OrderWorkflow_InitializationDelegator_GetCustomFieldList( callback ); } );

	this.select_customfield_set.SetPopulateFunction( function( customfield )
	{
		var option;

		option				= this.AddOption( customfield.name, 'CustomField_Values:' + customfield.module.code + ':' + customfield.code );
		option.customfield	= customfield;
	} );

	this.select_customfield_set.SetOnLoadCompleteHandler( function( response )
	{
		self.select_customfield_set_loaded = true;

		if ( response.success && ( response.data.length === 0 ) )
		{
			self.select_customfield_set.Empty();
			self.select_customfield_set.Disable();
			self.select_customfield_set.AddOption( '<No Custom Fields Present>', '' );
		}
		else if ( self.action !== null )
		{
			self.select_customfield_set.SetValue( 'CustomField_Values:' + self.action.act_data.module_code + ':' + self.action.act_data.field );

			if ( self.mapped_customfield_set instanceof OWFWorkflow_Step_Actions_ActionItem_CustomField_Base )
			{
				self.mapped_customfield_set.SetValue( self.action.act_data.value );
			}
		}
	} );

	this.select_customfield_set.Load();
}

OWFWorkflow_Step_Actions_ActionItem.prototype.ContainedElement = function()
{
	return this.element_container;
}

OWFWorkflow_Step_Actions_ActionItem.prototype.BoundingClientRect = function()
{
	return this.element_container.getBoundingClientRect();
}

OWFWorkflow_Step_Actions_ActionItem.prototype.SetAction = function( action )
{
	this.select_action.SetSelectedIndex( -1 );

	if ( !action )
	{
		this.action = null;

		this.select_action.SetValue( '' );
		this.onSelectChanged_Action( '' );
		this.EditMode_Show( false );
	}
	else
	{
		this.action = action;
		this.select_action.SetValue( action.act );

		if ( action.act === 'note_add' )
		{
			this.SetAction_Note( action );
		}
		else if ( action.act === 'queue_add' ||
				  action.act === 'queue_move' ||
				  action.act === 'queue_remove' )
		{
			this.SetAction_Queue( action );
		}
		else if ( action.act === 'webhook_get' ||
				  action.act === 'webhook_post_order' )
		{
			this.SetAction_Webhook( action );
		}
		else if ( action.act === 'payment' )
		{
			this.SetAction_Payment( action );
		}
		else if ( action.act === 'void' )
		{
			this.SetAction_VOID( action );
		}
		else if ( action.act === 'customfield_set' )
		{
			this.SetAction_CustomField( action );
		}
	}
}

OWFWorkflow_Step_Actions_ActionItem.prototype.SetAction_Note = function( action )
{
	this.textarea_note.SetValue( action.act_data );
	this.element_note_container.style.display = '';
}

OWFWorkflow_Step_Actions_ActionItem.prototype.SetAction_Queue = function( action )
{
	this.select_queue.SetValue( action.act_data );
	this.element_queue_container.style.display = '';
}

OWFWorkflow_Step_Actions_ActionItem.prototype.SetAction_Webhook = function( action )
{
	if ( action.act_data &&
		 action.act_data.hasOwnProperty( 'url' ) &&
		 typeof action.act_data.url === 'string' )		this.input_webhook_url.SetValue( action.act_data.url );

	if ( action.act_data &&
		 action.act_data.hasOwnProperty( 'cred_id' ) &&
		 typeof action.act_data.cred_id === 'number' )	this.select_webhook_auth_credentials.SetValue( action.act_data.cred_id );
	else												this.select_webhook_auth_credentials.SetValue( 0 );

	this.element_webhook_container.style.display = '';
}

OWFWorkflow_Step_Actions_ActionItem.prototype.SetAction_Payment = function( action )
{
	if ( action.act_data && action.act_data.hasOwnProperty( 'capture_enabled' ) &&
		 typeof action.act_data.capture_enabled === 'boolean' )				this.checkbox_payment_capture_enabled.SetChecked( action.act_data.capture_enabled );
	else																	this.checkbox_payment_capture_enabled.SetChecked( false );

	if ( action.act_data && action.act_data.hasOwnProperty( 'capture_includes' ) &&
		 typeof action.act_data.capture_includes === 'string' )				this.select_payment_capture_includes.SetValue( action.act_data.capture_includes );
	else																	this.select_payment_capture_includes.SetValue( '' );

	if ( action.act_data && action.act_data.hasOwnProperty( 'capture_nontax_charges' ) &&
		 typeof action.act_data.capture_nontax_charges === 'string' )		this.select_payment_capture_nontax_charges.SetValue( action.act_data.capture_nontax_charges );
	else																	this.select_payment_capture_nontax_charges.SetValue( 'first' );

	if ( action.act_data && action.act_data.hasOwnProperty( 'capture_dollars_within' ) &&
		 typeof action.act_data.capture_dollars_within === 'number' )		this.input_payment_capture_dollars_within.SetValue( action.act_data.capture_dollars_within.toFixed( 2 ) );
	else if ( action.act_data && action.act_data.hasOwnProperty( 'capture_dollars_within' ) &&
		 typeof action.act_data.capture_dollars_within === 'string' )		this.input_payment_capture_dollars_within.SetValue( action.act_data.capture_dollars_within );
	else																	this.input_payment_capture_dollars_within.SetValue( '0.00' );

	if ( action.act_data && action.act_data.hasOwnProperty( 'refund_enabled' ) &&
		 typeof action.act_data.refund_enabled === 'boolean' )				this.checkbox_payment_refund_enabled.SetChecked( action.act_data.refund_enabled );
	else																	this.checkbox_payment_refund_enabled.SetChecked( false );

	if ( action.act_data && action.act_data.hasOwnProperty( 'refund_includes' ) &&
		 typeof action.act_data.refund_includes === 'string' )				this.select_payment_refund_includes.SetValue( action.act_data.refund_includes );
	else																	this.select_payment_refund_includes.SetValue( '' );

	if ( action.act_data && action.act_data.hasOwnProperty( 'refund_shipping_charges' ) &&
		 typeof action.act_data.refund_shipping_charges === 'boolean' )		this.checkbox_payment_refund_order_charges_shipping.SetChecked( action.act_data.refund_shipping_charges );
	else																	this.checkbox_payment_refund_order_charges_shipping.SetChecked( false );

	if ( action.act_data && action.act_data.hasOwnProperty( 'refund_handling_charges' ) &&
		 typeof action.act_data.refund_handling_charges === 'boolean' )		this.checkbox_payment_refund_order_charges_handling.SetChecked( action.act_data.refund_handling_charges );
	else																	this.checkbox_payment_refund_order_charges_handling.SetChecked( false );

	if ( action.act_data && action.act_data.hasOwnProperty( 'refund_payment_charges' ) &&
		 typeof action.act_data.refund_payment_charges === 'boolean' )		this.checkbox_payment_refund_order_charges_payment.SetChecked( action.act_data.refund_payment_charges );
	else																	this.checkbox_payment_refund_order_charges_payment.SetChecked( false );

	if ( action.act_data && action.act_data.hasOwnProperty( 'refund_tax_charges' ) &&
		 typeof action.act_data.refund_tax_charges === 'boolean' )			this.checkbox_payment_refund_order_charges_tax.SetChecked( action.act_data.refund_tax_charges );
	else																	this.checkbox_payment_refund_order_charges_tax.SetChecked( false );

	if ( action.act_data && action.act_data.hasOwnProperty( 'refund_other_charges' ) &&
		 typeof action.act_data.refund_other_charges === 'boolean' )		this.checkbox_payment_refund_order_charges_other.SetChecked( action.act_data.refund_other_charges );
	else																	this.checkbox_payment_refund_order_charges_other.SetChecked( false );

	if ( action.act_data && action.act_data.hasOwnProperty( 'prorate_discounts' ) &&
		 typeof action.act_data.prorate_discounts === 'boolean' )			this.checkbox_payment_prorate_discounts.SetChecked( action.act_data.prorate_discounts );
	else																	this.checkbox_payment_prorate_discounts.SetChecked( false );

	if ( action.act_data && action.act_data.hasOwnProperty( 'add_notes' ) &&
		 typeof action.act_data.add_notes === 'boolean' )					this.checkbox_payment_add_notes.SetChecked( action.act_data.add_notes );
	else																	this.checkbox_payment_add_notes.SetChecked( false );

	this.onSelectChanged_PaymentCaptureAmount( this.select_payment_capture_includes.GetValue( '' ) );
	this.onSelectChanged_PaymentRefundAmount( this.select_payment_refund_includes.GetValue( '' ) );

	this.element_payment_container.style.display = '';
}

OWFWorkflow_Step_Actions_ActionItem.prototype.SetAction_VOID = function( action )
{
	if ( action.act_data && action.act_data.hasOwnProperty( 'add_notes' ) &&
		 typeof action.act_data.add_notes === 'boolean' )					this.checkbox_void_add_notes.SetChecked( action.act_data.add_notes );
	else																	this.checkbox_void_add_notes.SetChecked( false );

	this.element_void_container.style.display = '';
}

OWFWorkflow_Step_Actions_ActionItem.prototype.SetAction_CustomField = function( action )
{
	if ( this.select_customfield_set_loaded )
	{
		if ( action.act_data && action.act_data.hasOwnProperty( 'module_code' ) && action.act_data.hasOwnProperty( 'field' ) )
		{
			this.select_customfield_set.SetValue( 'CustomField_Values:' + action.act_data.module_code + ':' + action.act_data.field );

			if ( this.mapped_customfield_set instanceof OWFWorkflow_Step_Actions_ActionItem_CustomField_Base )
			{
				this.mapped_customfield_set.SetValue( action.act_data.value );
			}
		}
	}

	this.element_customfield_container.style.display = '';
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Validate = function( errors )
{
	var error, action;

	if ( this.select_action.GetInvalid() )
	{
		error				= new Object();
		error.error_field	= 'act';
		error.error_message	= this.select_action.GetInvalid_Message();

		errors.push( error );

		return false;
	}

	if ( !this.select_action.Validate_ValueSelected_Silent() )
	{
		error				= new Object();
		error.error_field	= 'act';
		error.error_message	= 'Please select an action';

		errors.push( error );

		return false;
	}

	action = this.select_action.GetValue( '' );

	if ( action === 'note_add' )
	{
		return this.Validate_Note( errors );
	}
	else if ( action === 'queue_add' ||
			  action === 'queue_move' ||
			  action === 'queue_remove' )
	{
		return this.Validate_Queue( errors );
	}
	else if ( action === 'webhook_get' ||
			  action === 'webhook_post_order' )
	{
		return this.Validate_Webhook( errors );
	}
	else if ( action === 'payment' )
	{
		return this.Validate_Payment( errors );
	}
	else if ( action === 'customfield_set' )
	{
		return this.Validate_CustomField( errors );
	}

	return true;
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Validate_Note = function( errors )
{
	var error;

	if ( this.textarea_note.GetInvalid() )
	{
		error				= new Object();
		error.error_field	= 'act_data';
		error.error_message	= this.textarea_note.GetInvalid_Message();

		errors.push( error );

		return false;
	}

	if ( !this.textarea_note.Validate_NonEmpty_Silent() )
	{
		this.textarea_note.ClearInvalid();

		error				= new Object();
		error.error_field	= 'act_data';
		error.error_message	= 'Please specify a note';

		errors.push( error );

		return false;
	}

	return true;
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Validate_Queue = function( errors )
{
	var error;

	if ( this.select_queue.GetInvalid() )
	{
		error				= new Object();
		error.error_field	= 'act_data';
		error.error_message	= this.select_queue.GetInvalid_Message();

		errors.push( error );

		return false;
	}

	if ( !this.select_queue.Validate_ValueSelected_Silent() )
	{
		error				= new Object();
		error.error_field	= 'act_data';
		error.error_message	= 'Please select a queue';

		errors.push( error );

		return false;
	}

	return true;
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Validate_Webhook = function( errors )
{
	var error;

	if ( this.input_webhook_url.GetInvalid() )
	{
		error				= new Object();
		error.error_field	= 'act_data:url';
		error.error_message	= this.input_webhook_url.GetInvalid_Message();

		errors.push( error );

		return false;
	}

	if ( !this.input_webhook_url.Validate_NonEmpty_Silent() )
	{
		this.input_webhook_url.ClearInvalid();

		error				= new Object();
		error.error_field	= 'act_data:url';
		error.error_message	= 'Please specify a webhook URL';

		errors.push( error );

		return false;
	}

	if ( this.select_webhook_auth_credentials.GetInvalid() )
	{
		error				= new Object();
		error.error_field	= 'act_data:cred_id';
		error.error_message	= this.select_webhook_auth_credentials.GetInvalid_Message();

		errors.push( error );

		return false;
	}

	return true;
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Validate_Payment = function( errors )
{
	var error, validation_error;

	if ( this.select_payment_capture_includes.GetInvalid() )
	{
		error				= new Object();
		error.error_field	= 'act_data:capture_includes';
		error.error_message	= this.select_payment_capture_includes.GetInvalid_Message();

		errors.push( error );

		return false;
	}

	if ( !this.select_payment_capture_includes.Validate_ValueSelected_Silent() )
	{
		error				= new Object();
		error.error_field	= 'act_data:capture_includes';
		error.error_message	= 'Please select an option';

		errors.push( error );

		return false;
	}

	if ( this.select_payment_refund_includes.GetInvalid() )
	{
		error				= new Object();
		error.error_field	= 'act_data:refund_includes';
		error.error_message	= this.select_payment_refund_includes.GetInvalid_Message();

		errors.push( error );

		return false;
	}

	if ( !this.select_payment_refund_includes.Validate_ValueSelected_Silent() )
	{
		error				= new Object();
		error.error_field	= 'act_data:refund_includes';
		error.error_message	= 'Please select an option';

		errors.push( error );

		return false;
	}

	if ( this.select_payment_capture_nontax_charges.GetInvalid() )
	{
		error				= new Object();
		error.error_field	= 'act_data:capture_nontax_charges';
		error.error_message	= this.select_payment_capture_nontax_charges.GetInvalid_Message();

		errors.push( error );

		return false;
	}

	if ( this.select_payment_capture_includes.GetValue( '' ) !== 'all' && !this.select_payment_capture_nontax_charges.Validate_ValueSelected_Silent() )
	{
		error				= new Object();
		error.error_field	= 'act_data:capture_nontax_charges';
		error.error_message	= 'Please select a non-tax charge option';

		errors.push( error );

		return false;
	}

	if ( this.input_payment_capture_dollars_within.GetInvalid() )
	{
		error				= new Object();
		error.error_field	= 'act_data:capture_dollars_within';
		error.error_message	= this.input_payment_capture_dollars_within.GetInvalid_Message();

		errors.push( error );

		return false;
	}

	validation_error		= new Object();

	if ( this.select_payment_capture_includes.GetValue( '' ) !== 'all' && !this.input_payment_capture_dollars_within.Validate_FloatingPointNumber_NonNegative_Silent( validation_error ) )
	{
		error				= new Object();
		error.error_field	= 'act_data:capture_dollars_within';
		error.error_message	= validation_error.error_message;

		errors.push( error );

		return false;
	}

	return true;
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Validate_CustomField = function( errors )
{
	var error;

	if ( this.select_customfield_set.GetInvalid() )
	{
		error				= new Object();
		error.error_field	= 'act_data:field';
		error.error_message	= this.select_customfield_set.GetInvalid_Message();

		errors.push( error );

		return false;
	}

	if ( !this.select_customfield_set.Validate_ValueSelected_Silent() ||
		 !( this.mapped_customfield_set instanceof OWFWorkflow_Step_Actions_ActionItem_CustomField_Base ) )
	{
		error				= new Object();
		error.error_field	= 'act_data:field';
		error.error_message	= 'Please select a custom field';

		errors.push( error );

		return false;
	}

	if ( !this.mapped_customfield_set.Validate( errors ) )
	{
		return false;
	}

	return true;
}

OWFWorkflow_Step_Actions_ActionItem.prototype.GetAction = function()
{
	var action;

	action			= this.action !== null ? cloneObject( this.action ) : ( new Object() );
	action.act		= this.select_action.GetValue( '' );

	if ( action.act === 'queue_add' )					action.act_data = this.select_queue.GetValue( '' );
	else if ( action.act === 'queue_move' )				action.act_data = this.select_queue.GetValue( '' );
	else if ( action.act === 'queue_remove' )			action.act_data = this.select_queue.GetValue( '' );
	else if ( action.act === 'queue_remove_all' )		action.act_data = '';
	else if ( action.act === 'note_add' )				action.act_data = this.textarea_note.GetValue();
	else if ( action.act === 'webhook_get' )			action.act_data = this.GetActionData_Webhook();
	else if ( action.act === 'webhook_post_order' )		action.act_data = this.GetActionData_Webhook();
	else if ( action.act === 'payment' )				action.act_data = this.GetActionData_Payment();
	else if ( action.act === 'void' )					action.act_data = this.GetActionData_VOID();
	else if ( action.act === 'customfield_set' )		action.act_data = ( this.mapped_customfield_set instanceof OWFWorkflow_Step_Actions_ActionItem_CustomField_Base ) ? this.mapped_customfield_set.GetValue() : null;
	else												action.act_data = '';

	return action;
}

OWFWorkflow_Step_Actions_ActionItem.prototype.GetActionData_Webhook = function()
{
	var act_data;

	act_data			= new Object();
	act_data.url		= this.input_webhook_url.GetValue();
	act_data.cred_id	= this.select_webhook_auth_credentials.GetValue( '' );

	return act_data;
}

OWFWorkflow_Step_Actions_ActionItem.prototype.GetActionData_Payment = function()
{
	var act_data;

	act_data							= new Object();
	act_data.capture_enabled			= this.checkbox_payment_capture_enabled.GetChecked();
	act_data.capture_includes			= this.select_payment_capture_includes.GetValue( '' );
	act_data.capture_nontax_charges		= this.select_payment_capture_nontax_charges.GetValue( '' );
	act_data.capture_dollars_within		= this.input_payment_capture_dollars_within.GetValue();
	act_data.refund_enabled				= this.checkbox_payment_refund_enabled.GetChecked();
	act_data.refund_includes			= this.select_payment_refund_includes.GetValue( '' );
	act_data.refund_shipping_charges	= this.checkbox_payment_refund_order_charges_shipping.GetChecked();
	act_data.refund_handling_charges	= this.checkbox_payment_refund_order_charges_handling.GetChecked();
	act_data.refund_payment_charges		= this.checkbox_payment_refund_order_charges_payment.GetChecked();
	act_data.refund_tax_charges			= this.checkbox_payment_refund_order_charges_tax.GetChecked();
	act_data.refund_other_charges		= this.checkbox_payment_refund_order_charges_other.GetChecked();
	act_data.prorate_discounts			= this.checkbox_payment_prorate_discounts.GetChecked();
	act_data.add_notes					= this.checkbox_payment_add_notes.GetChecked();

	return act_data;
}

OWFWorkflow_Step_Actions_ActionItem.prototype.GetActionData_VOID = function()
{
	var act_data;

	act_data			= new Object();
	act_data.add_notes	= this.checkbox_void_add_notes.GetChecked();

	return act_data;
}

OWFWorkflow_Step_Actions_ActionItem.prototype.SetInvalid_Action = function( error_message )
{
	this.select_action.SetInvalid( error_message );
	this.EditMode_Show( true );
}

OWFWorkflow_Step_Actions_ActionItem.prototype.SetInvalid_ActionData = function( error_field, error_message )
{
	var action = this.select_action.GetValue( '' );

	if ( action === 'queue_add' )					this.select_queue.SetInvalid( error_message );
	else if ( action === 'queue_move' )				this.select_queue.SetInvalid( error_message );
	else if ( action === 'queue_remove' )			this.select_queue.SetInvalid( error_message );
	else if ( action === 'note_add' )				this.textarea_note.SetInvalid( error_message );
	else if ( action === 'webhook_get' )			this.SetInvalid_ActionData_Webhook( error_field, error_message );
	else if ( action === 'webhook_post_order' )		this.SetInvalid_ActionData_Webhook( error_field, error_message );
	else if ( action === 'payment' )				this.SetInvalid_ActionData_Payment( error_field, error_message );
	else if ( action === 'customfield_set' )
	{
		if ( this.mapped_customfield_set instanceof OWFWorkflow_Step_Actions_ActionItem_CustomField_Base &&
			 error_field === 'act_data:value' )		this.mapped_customfield_set.SetInvalid( error_message );
		else										this.select_customfield_set.SetInvalid( error_message );
	}

	this.EditMode_Show( true );
}

OWFWorkflow_Step_Actions_ActionItem.prototype.SetInvalid_ActionData_Webhook = function( error_field, error_message )
{
	if ( error_field === 'act_data:url' )			this.input_webhook_url.SetInvalid( error_message );
	else if ( error_field === 'act_data:cred_id' )	this.select_webhook_auth_credentials.SetInvalid( error_message );
}

OWFWorkflow_Step_Actions_ActionItem.prototype.SetInvalid_ActionData_Payment = function( error_field, error_message )
{
	if ( error_field === 'act_data:capture_includes' )				this.select_payment_capture_includes.SetInvalid( error_message );
	else if ( error_field === 'act_data:capture_nontax_charges' )	this.select_payment_capture_nontax_charges.SetInvalid( error_message );
	else if ( error_field === 'act_data:capture_dollars_within' )	this.input_payment_capture_dollars_within.SetInvalid( error_message );
	else if ( error_field === 'act_data:refund_includes' )			this.select_payment_refund_includes.SetInvalid( error_message );
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Field_OnSetInvalid = function()
{
	this.element_container.className = classNameAdd( this.element_container, 'invalid' );
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Field_OnClearInvalid = function()
{
	if ( !this.select_action.GetInvalid()					&&
		 !this.select_queue.GetInvalid()					&&
		 !this.input_webhook_url.GetInvalid()				&&
		 !this.select_webhook_auth_credentials.GetInvalid()	&&
		 !this.select_customfield_set.GetInvalid()			&&
		 !this.textarea_note.GetInvalid()					&&
		 ( !( this.mapped_customfield_set instanceof OWFWorkflow_Step_Actions_ActionItem_CustomField_Base ) || !this.mapped_customfield_set.GetInvalid() ) )
	{
		this.element_container.className = classNameRemove( this.element_container, 'invalid' );
	}
}

OWFWorkflow_Step_Actions_ActionItem.prototype.onSelectChanged_Action = function( value )
{
	var option = this.select_action.GetOptionWithValue( value );

	this.element_act_data_container.style.display				= 'none';
	this.element_note_container.style.display					= 'none';
	this.element_queue_container.style.display					= 'none';
	this.element_webhook_container.style.display				= 'none';
	this.element_payment_container.style.display				= 'none';
	this.element_void_container.style.display					= 'none';
	this.element_customfield_container.style.display			= 'none';

	if ( option && option.value.length )
	{
		if ( option.value === 'queue_add' ||
			 option.value === 'queue_move' ||
			 option.value === 'queue_remove' )
		{
			this.element_queue_container.style.display			= '';
		}
		else if ( option.value === 'customfield_set' )
		{
			this.element_customfield_container.style.display	= '';
		}
		else if ( option.value === 'note_add' )
		{
			this.element_note_container.style.display			= '';
		}
		else if ( option.value === 'webhook_get' ||
				  option.value === 'webhook_post_order' )
		{
			this.element_webhook_container.style.display		= '';
		}
		else if ( option.value === 'payment' )
		{
			this.element_payment_container.style.display		= '';
		}
		else if ( option.value === 'void' )
		{
			this.element_void_container.style.display			= '';
		}

		this.element_act_data_container.style.display			= '';
	}

	if ( option && option.value.length )	this.element_summary.textContent = option.text;
	else									this.element_summary.textContent = '<Select Action>';
}

OWFWorkflow_Step_Actions_ActionItem.prototype.onSelectChanged_PaymentCaptureAmount = function( value )
{
	if ( value === '' || value === 'all' )
	{
		this.select_payment_capture_nontax_charges.Disable();
		this.input_payment_capture_dollars_within.Disable();
	}
	else
	{
		this.select_payment_capture_nontax_charges.Enable();
		this.input_payment_capture_dollars_within.Enable();
	}
}

OWFWorkflow_Step_Actions_ActionItem.prototype.onSelectChanged_PaymentRefundAmount = function( value )
{
	if ( value === '' || value === 'all' )
	{
		this.checkbox_payment_refund_order_charges_shipping.Disable();
		this.checkbox_payment_refund_order_charges_handling.Disable();
		this.checkbox_payment_refund_order_charges_payment.Disable();
		this.checkbox_payment_refund_order_charges_tax.Disable();
		this.checkbox_payment_refund_order_charges_other.Disable();
	}
	else
	{
		this.checkbox_payment_refund_order_charges_shipping.Enable();
		this.checkbox_payment_refund_order_charges_handling.Enable();
		this.checkbox_payment_refund_order_charges_payment.Enable();
		this.checkbox_payment_refund_order_charges_tax.Enable();
		this.checkbox_payment_refund_order_charges_other.Enable();
	}
}

OWFWorkflow_Step_Actions_ActionItem.prototype.onSelectChanged_CustomFieldSet = function( value )
{
	var self = this;
	var type, option, float_value;

	option = this.select_customfield_set.GetOptionWithValue( value );
	this.element_customfield_editor_container.innerHTML	= '';

	if ( !option || !option.customfield )
	{
		return;
	}

	if ( ( colon_pos = option.customfield.type.indexOf( ':' ) ) == -1 )
	{
		type		= option.customfield.type;
		float_value	= 0;
	}
	else
	{
		type		= option.customfield.type.substring( 0, colon_pos );
		float_value	= stod_def_nonneg( option.customfield.type.substring( colon_pos + 1 ), 0 );
	}

	if ( type === 'textarea' )			this.mapped_customfield_set = new OWFWorkflow_Step_Actions_ActionItem_CustomField_TextArea( option.customfield, this.element_customfield_editor_container );
	else if ( type === 'choice' )		this.mapped_customfield_set = new OWFWorkflow_Step_Actions_ActionItem_CustomField_Select( option.customfield, this.element_customfield_editor_container );
	else if ( type === 'checkbox' )		this.mapped_customfield_set = new OWFWorkflow_Step_Actions_ActionItem_CustomField_Checkbox( option.customfield, this.element_customfield_editor_container );
	else if ( type === 'imageupload' )	this.mapped_customfield_set = new OWFWorkflow_Step_Actions_ActionItem_CustomField_ImageUpload( option.customfield, this.element_customfield_editor_container );
	else if ( type === 'customupload' )	this.mapped_customfield_set = new OWFWorkflow_Step_Actions_ActionItem_CustomField_CustomUpload( option.customfield, this.element_customfield_editor_container );
	else if ( type === 'multitext' )	this.mapped_customfield_set = new OWFWorkflow_Step_Actions_ActionItem_CustomField_MultiText( option.customfield, this.element_customfield_editor_container );
	else if ( type === 'numeric' )		this.mapped_customfield_set = new OWFWorkflow_Step_Actions_ActionItem_CustomField_Numeric( option.customfield, this.element_customfield_editor_container, float_value );
	else if ( type === 'currency' )		this.mapped_customfield_set = new OWFWorkflow_Step_Actions_ActionItem_CustomField_Numeric( option.customfield, this.element_customfield_editor_container, 2 );
	else if ( type === 'date' )			this.mapped_customfield_set = new OWFWorkflow_Step_Actions_ActionItem_CustomField_Date( option.customfield, this.element_customfield_editor_container );
	else if ( type === 'datetime' )		this.mapped_customfield_set = new OWFWorkflow_Step_Actions_ActionItem_CustomField_DateTime( option.customfield, this.element_customfield_editor_container );
	else /* ( type === 'text' ) */		this.mapped_customfield_set = new OWFWorkflow_Step_Actions_ActionItem_CustomField_Text( option.customfield, this.element_customfield_editor_container );

	this.mapped_customfield_set.onSetInvalid	= function() { self.Field_OnSetInvalid(); };
	this.mapped_customfield_set.onClearInvalid	= function() { self.Field_OnClearInvalid(); };
	this.mapped_customfield_set.onEnter_Value	= function( e ) { return self.onEnter_Value( e ); }
}

OWFWorkflow_Step_Actions_ActionItem.prototype.SetDragAndDrop_Enabled = function()
{
	this.draganddrop_enabled = true;

	return this;
}

OWFWorkflow_Step_Actions_ActionItem.prototype.SetDragAndDrop_Disabled = function()
{
	this.draganddrop_enabled = false;

	return this;
}

OWFWorkflow_Step_Actions_ActionItem.prototype.SetDragAndDrop_Active = function()
{
	classNameAddIfMissing( this.element_container, 'draganddrop' );
}

OWFWorkflow_Step_Actions_ActionItem.prototype.SetDragAndDrop_Inactive = function()
{
	classNameRemoveIfPresent( this.element_container, 'draganddrop' );
}

OWFWorkflow_Step_Actions_ActionItem.prototype.DragAndDrop_Start = function()
{
	var self = this;

	if ( !this.draganddrop_enabled || this.draganddrop_active )
	{
		return;
	}

	this.draganddrop_active			= true;
	this.draganddrop_keystackentry	= KeyDownHandlerStack_Add( null, function( e ) { return self.DragAndDrop_Cancel( e ); } );

	this.onDragAndDrop_Start( this.mouse_position_start.x, this.mouse_position_start.y );
}

OWFWorkflow_Step_Actions_ActionItem.prototype.DragAndDrop_Move = function()
{
	if ( !this.draganddrop_active )
	{
		return;
	}

	this.onDragAndDrop_Move( this.mouse_position.x, this.mouse_position.y );
}

OWFWorkflow_Step_Actions_ActionItem.prototype.DragAndDrop_End = function( cancelled )
{
	if ( !this.draganddrop_active )
	{
		return;
	}

	KeyDownHandlerStack_Remove( this.draganddrop_keystackentry );

	this.draganddrop_active			= false;
	this.draganddrop_keystackentry	= null;

	this.onDragAndDrop_End( cancelled );
}

OWFWorkflow_Step_Actions_ActionItem.prototype.DragAndDrop_Cancel = function( e )
{
	if ( !this.draganddrop_active )
	{
		return;
	}

	this.mouse_running				= false;

	document.body.unselectable		= null;
	document.onselectstart			= null;
	this.mouse_target.ondragstart	= null;

	if ( this.mouse_target.releaseCapture )
	{
		this.mouse_target.releaseCapture();
	}

	RemoveEvent( document,	'mousemove',	this.event_onmousemove_draganddrop );
	RemoveEvent( document,	'mouseup',		this.event_onmouseup_draganddrop );
	RemoveEvent( window,	'blur',			this.event_onmouseup_draganddrop );

	this.DragAndDrop_End( true );

	return true;
}

OWFWorkflow_Step_Actions_ActionItem.prototype.RequestRender_DragAndDrop_Start = function()
{
	if ( !this.render_draganddrop_start_requested )
	{
		this.render_draganddrop_start_requested = true;
		window.requestAnimationFrame( this.render_draganddrop_start );
	}
}

OWFWorkflow_Step_Actions_ActionItem.prototype.RequestRender_DragAndDrop_Move = function()
{
	if ( !this.render_draganddrop_move_requested )
	{
		this.render_draganddrop_move_requested = true;
		window.requestAnimationFrame( this.render_draganddrop_move );
	}
}

OWFWorkflow_Step_Actions_ActionItem.prototype.RequestRender_DragAndDrop_End = function()
{
	if ( !this.render_draganddrop_end_requested )
	{
		this.render_draganddrop_end_requested = true;
		window.requestAnimationFrame( this.render_draganddrop_end );
	}
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Render_DragAndDrop_Start = function()
{
	this.render_draganddrop_start_requested = false;
	this.DragAndDrop_Start();
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Render_DragAndDrop_Move = function()
{
	this.render_draganddrop_move_requested = false;
	this.DragAndDrop_Move();
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Render_DragAndDrop_End = function()
{
	this.render_draganddrop_end_requested = false;
	this.DragAndDrop_End();
}

OWFWorkflow_Step_Actions_ActionItem.prototype.SetSelectable = function( selectable )
{
	this.selectable	= selectable;

	if ( this.selected )
	{
		this.Deselect();
	}

	return this;
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Toggle_Selection = function()
{
	if ( this.selected )	this.Deselect();
	else					this.Select();
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Select = function()
{
	if ( !this.selectable )
	{
		return;
	}

	this.selected						= true;
	this.element_container.className	= classNameAdd( this.element_container, 'selected' );

	this.onSelect();
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Deselect = function()
{
	this.selected						= false;
	this.element_container.className	= classNameRemove( this.element_container, 'selected' );

	this.onDeselect();
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Selected = function()
{
	return this.selected;
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Remove = function()
{
	this.Deselect();

	if ( this.element_container.parentNode )
	{
		this.element_container.parentNode.removeChild( this.element_container );
	}
}

OWFWorkflow_Step_Actions_ActionItem.prototype.SetParentNode = function( parent_node )
{
	parent_node.appendChild( this.element_container );
}

OWFWorkflow_Step_Actions_ActionItem.prototype.SetParentNode_InsertBefore = function( parent_node, existing_node )
{
	parent_node.insertBefore( this.element_container, existing_node );
}

OWFWorkflow_Step_Actions_ActionItem.prototype.ParentNode = function()
{
	return this.element_container.parentNode;
}

OWFWorkflow_Step_Actions_ActionItem.prototype.EditMode_Toggle = function( animate )
{
	if ( this.editmode )	this.EditMode_Hide( animate );
	else					this.EditMode_Show( animate );
}

OWFWorkflow_Step_Actions_ActionItem.prototype.EditMode_Show = function( animate )
{
	var self = this;
	var height_title, animationlist, height_content;

	if ( this.editmode )
	{
		return;
	}

	this.editmode = true;

	if ( !animate )
	{
		this.element_row.className				= classNameAdd( this.element_row, 'row_expanded' );
		this.element_content.style.display		= 'block';
	}
	else
	{
		this.element_row.className				= classNameAdd( this.element_row, 'row_expanded' );

		this.element_row.style.overflow			= 'hidden';
		this.element_title.style.zIndex			= 2;
		this.element_content.style.zIndex		= 1;
		this.element_content.style.display		= 'block';
		this.element_content.style.position		= 'absolute';
		this.element_content.style.left			= 0;
		this.element_content.style.right		= 0;
		this.element_content.style.bottom		= 0;

		height_title							= this.element_title.offsetHeight;
		height_content							= this.element_content.offsetHeight;

		this.element_row.style.height			= height_title + 'px';

		animationlist		= new Array();
		animationlist.push( createAnimation(
		{
			delay: 0,
			duration: 200,
			delta: animationLinear,
			step: function( delta )
			{
				self.element_row.style.height			= ( height_title + ( height_content * delta ) ) + 'px';
			},
			oncomplete: function()
			{
				// Reset overridden values

				self.element_row.style.overflow			= '';
				self.element_row.style.height			= '';
				self.element_title.style.zIndex			= '';
				self.element_content.style.zIndex		= '';
				self.element_content.style.position		= '';
				self.element_content.style.left			= '';
				self.element_content.style.right		= '';
				self.element_content.style.bottom		= '';
			}
		} ) );

		cancelAnimationFrame( window[ this.animation_id ] );
		beginAnimations( animationlist, this.animation_id );
	}
}

OWFWorkflow_Step_Actions_ActionItem.prototype.EditMode_Hide = function( animate )
{
	var self = this;
	var height_title, animationlist, height_content;

	if ( !this.editmode )
	{
		return;
	}

	this.editmode = false;

	if ( !animate )
	{
		this.element_row.className				= classNameRemove( this.element_row, 'row_expanded' );
		this.element_content.style.display		= 'none';
	}
	else
	{
		this.element_row.className				= classNameRemove( this.element_row, 'row_expanded' );

		this.element_row.style.overflow			= 'hidden';
		this.element_title.style.zIndex			= 2;
		this.element_content.style.zIndex		= 1;
		this.element_content.style.display		= 'block';
		this.element_content.style.position		= 'absolute';
		this.element_content.style.left			= 0;
		this.element_content.style.right		= 0;
		this.element_content.style.bottom		= 0;

		height_title							= this.element_title.offsetHeight;
		height_content							= this.element_content.offsetHeight;

		this.element_row.style.height			= height_title + 'px';

		animationlist							= new Array();
		animationlist.push( createAnimation(
		{
			delay: 0,
			duration: 200,
			delta: animationLinear,
			step: function( delta )
			{
				self.element_row.style.height			= ( height_title + ( height_content * ( 1 - delta ) ) ) + 'px';
			},
			oncomplete: function()
			{
				self.element_content.style.display		= 'none';

				// Reset overridden values

				self.element_row.style.overflow			= '';
				self.element_row.style.height			= '';
				self.element_title.style.zIndex			= '';
				self.element_content.style.zIndex		= '';
				self.element_content.style.position		= '';
				self.element_content.style.left			= '';
				self.element_content.style.right		= '';
				self.element_content.style.bottom		= '';
			}
		} ) );

		cancelAnimationFrame( window[ this.animation_id ] );
		beginAnimations( animationlist, this.animation_id );
	}
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Event_OnClick_Expand = function( e )
{
	this.EditMode_Toggle( true );

	return eventPreventDefault( e );
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Event_OnClick_Selection = function( e )
{
	var rightclick;

	if ( 'which' in e )			rightclick = ( e.which == 3 ); 
	else if ( 'button' in e )	rightclick = ( e.button == 2 );
	else						rightclick = false;

	if ( rightclick )			return true;

	this.Toggle_Selection();

	return true;
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Event_OnMouseDown_DragAndDrop = function( e )
{
	var rightclick, row_rect, scrollfromtop, scrollfromleft;

	if ( !this.draganddrop_enabled )
	{
		return true;
	}

	if ( 'which' in e )			rightclick = ( e.which == 3 ); 
	else if ( 'button' in e )	rightclick = ( e.button == 2 );
	else						rightclick = false;

	if ( rightclick )					return true;

	row_rect							= this.element_row.getBoundingClientRect();
	scrollfromtop						= getScrollTop();
	scrollfromleft						= getScrollLeft();

	this.mouse_running					= true;
	this.mouse_started					= true;
	this.mouse_moved					= false;
	this.mouse_movediff					= 0;
	this.mouse_target					= e.target ? e.target : e.srcElement;
	this.mouse_position					= captureMousePosition( e );
	this.mouse_position_x_offset		= ( this.mouse_position.x - row_rect.left ) - scrollfromleft;
	this.mouse_position_y_offset		= ( this.mouse_position.y - row_rect.top ) - scrollfromtop;
	this.mouse_position_start			= this.mouse_position;

	clearTextSelection();
	document.body.focus();
	document.body.unselectable			= 'on';
	document.onselectstart				= this.event_returnfalse;
	this.mouse_target.ondragstart		= this.event_returnfalse;

	if ( this.mouse_target.setCapture )
	{
		this.mouse_target.setCapture();
	}

	AddEvent( document, 'mousemove',	this.event_onmousemove_draganddrop );
	AddEvent( document, 'mouseup',		this.event_onmouseup_draganddrop );
	AddEvent( window,	'blur',			this.event_onmouseup_draganddrop );

	return true;
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Event_OnMouseMove_DragAndDrop = function( e )
{
	if ( this.mouse_started )
	{
		eventPreventDefault( e );
		this.mouse_started	= false;
	}

	this.mouse_position		= captureMousePosition( e );
	this.mouse_moved		= true;
	this.mouse_movediff		= Math.max( this.mouse_movediff, Math.max( Math.abs( this.mouse_position.y - this.mouse_position_start.y ), Math.abs( this.mouse_position.x - this.mouse_position_start.x ) ) );

	if ( this.mouse_movediff > 3 )
	{
		if ( !this.draganddrop_active )
		{
			this.RequestRender_DragAndDrop_Start();
		}

		this.RequestRender_DragAndDrop_Move();
	}
}

OWFWorkflow_Step_Actions_ActionItem.prototype.Event_OnMouseUp_DragAndDrop = function( e )
{
	this.mouse_running				= false;

	document.body.unselectable		= null;
	document.onselectstart			= null;
	this.mouse_target.ondragstart	= null;

	if ( this.mouse_target.releaseCapture )
	{
		this.mouse_target.releaseCapture();
	}

	RemoveEvent( document,	'mousemove',	this.event_onmousemove_draganddrop );
	RemoveEvent( document,	'mouseup',		this.event_onmouseup_draganddrop );
	RemoveEvent( window,	'blur',			this.event_onmouseup_draganddrop );

	if ( this.draganddrop_active )
	{
		this.RequestRender_DragAndDrop_End();
	}

	return true;
}

OWFWorkflow_Step_Actions_ActionItem.prototype.onSelect				= function() { ; }
OWFWorkflow_Step_Actions_ActionItem.prototype.onDeselect			= function() { ; }
OWFWorkflow_Step_Actions_ActionItem.prototype.onRequestDelete		= function() { ; }
OWFWorkflow_Step_Actions_ActionItem.prototype.onDragAndDrop_Start	= function( mousepos_x, mousepos_y ) { ; }
OWFWorkflow_Step_Actions_ActionItem.prototype.onDragAndDrop_Move	= function( mousepos_x, mousepos_y ) { ; }
OWFWorkflow_Step_Actions_ActionItem.prototype.onDragAndDrop_End		= function( cancelled ) { ; }
OWFWorkflow_Step_Actions_ActionItem.prototype.onInsert_Action_Above	= function() { ; }
OWFWorkflow_Step_Actions_ActionItem.prototype.onInsert_Action_Below	= function() { ; }
OWFWorkflow_Step_Actions_ActionItem.prototype.onEnter_Value			= function( e ) { ; }

// OWFWorkflow_Step_Actions_ActionItem_CustomField_Base
////////////////////////////////////////////////////

function OWFWorkflow_Step_Actions_ActionItem_CustomField_Base( customfield, element_parent )
{
	this.customfield	= customfield;
	this.element_parent	= element_parent;
}

OWFWorkflow_Step_Actions_ActionItem_CustomField_Base.prototype.Validate = function( errors )
{
	return true;
}

OWFWorkflow_Step_Actions_ActionItem_CustomField_Base.prototype.SetInvalid = function( error_message )
{
	this.invalid = true;
	this.onSetInvalid();
}

OWFWorkflow_Step_Actions_ActionItem_CustomField_Base.prototype.ClearInvalid = function()
{
	this.invalid = false;
	this.onClearInvalid();
}

OWFWorkflow_Step_Actions_ActionItem_CustomField_Base.prototype.GetInvalid = function()
{
	return this.invalid;
}

OWFWorkflow_Step_Actions_ActionItem_CustomField_Base.prototype.onEnter_Value	= function( e ) { ; }
OWFWorkflow_Step_Actions_ActionItem_CustomField_Base.prototype.onSetInvalid		= function() { ; }
OWFWorkflow_Step_Actions_ActionItem_CustomField_Base.prototype.onClearInvalid	= function() { ; }

// OWFWorkflow_Step_Actions_ActionItem_CustomField_TextArea
////////////////////////////////////////////////////

function OWFWorkflow_Step_Actions_ActionItem_CustomField_TextArea( customfield, element_parent )
{
	OWFWorkflow_Step_Actions_ActionItem_CustomField_Base.call( this, customfield, element_parent );

	this.textarea_value = new MMTextArea( element_parent, 'CustomField_Value', '' );
	this.textarea_value.SetTitle( 'Custom Field Value' );
	this.textarea_value.AddClassName( [ 'whole_width', 'title_visible' ] );
	this.textarea_value.SetResizeEnabled( { horizontal: false } );
}

DeriveFrom( OWFWorkflow_Step_Actions_ActionItem_CustomField_Base, OWFWorkflow_Step_Actions_ActionItem_CustomField_TextArea );

OWFWorkflow_Step_Actions_ActionItem_CustomField_TextArea.prototype.SetValue = function( value )
{
	this.textarea_value.SetValue( value );

	return this;
}

OWFWorkflow_Step_Actions_ActionItem_CustomField_TextArea.prototype.GetValue = function()
{
	var customfield;

	customfield				= new Object();
	customfield.module_code = this.customfield.module.code;
	customfield.field		= this.customfield.code;
	customfield.value		= this.textarea_value.GetValue();

	return customfield;
}

// OWFWorkflow_Step_Actions_ActionItem_CustomField_Select
////////////////////////////////////////////////////

function OWFWorkflow_Step_Actions_ActionItem_CustomField_Select( customfield, element_parent )
{
	var i, i_len;

	OWFWorkflow_Step_Actions_ActionItem_CustomField_Base.call( this, customfield, element_parent );

	this.mmselect = new MMSelect( element_parent );
	this.mmselect.SetClassName( 'mm_select_common whole_width medium title_visible' );
	this.mmselect.SetHoverText( 'Select Value' );
	this.mmselect.SetTitle( 'Custom Field Value' );
	this.mmselect.SetSelectOne( true, '<Select One>', '' );

	if ( this.customfield && Array.isArray( this.customfield.choices ) )
	{
		for ( i = 0, i_len = this.customfield.choices.length; i < i_len; i++ )
		{
			this.mmselect.AddOption( this.customfield.choices[ i ], this.customfield.choices[ i ] );
		}
	}
}

DeriveFrom( OWFWorkflow_Step_Actions_ActionItem_CustomField_Base, OWFWorkflow_Step_Actions_ActionItem_CustomField_Select );

OWFWorkflow_Step_Actions_ActionItem_CustomField_Select.prototype.SetValue = function( value )
{
	this.mmselect.SetValue( value );

	return this;
}

OWFWorkflow_Step_Actions_ActionItem_CustomField_Select.prototype.GetValue = function()
{
	var customfield;

	customfield				= new Object();
	customfield.module_code = this.customfield.module.code;
	customfield.field		= this.customfield.code;
	customfield.value		= this.mmselect.GetValue( '' );

	return customfield;
}

// OWFWorkflow_Step_Actions_ActionItem_CustomField_Checkbox
////////////////////////////////////////////////////

function OWFWorkflow_Step_Actions_ActionItem_CustomField_Checkbox( customfield, element_parent )
{
	OWFWorkflow_Step_Actions_ActionItem_CustomField_Base.call( this, customfield, element_parent );

	this.element_container			= newElement( 'span', { 'class': 'workflow_addeditdialog_action_custom_container' }, 			null, element_parent );
	this.element_title				= newElement( 'span', { 'class': 'workflow_addeditdialog_action_custom_title' },				null, this.element_container );
	this.checkbox_container			= newElement( 'span', { 'class': 'workflow_addeditdialog_action_custom_checkbox_container' },	null, this.element_container );

	this.element_title.textContent	= 'Custom Field Value';

	this.checkbox					= new MMCheckBox( false, this.checkbox_container );
	this.checkbox.SetText( customfield.name );
}

DeriveFrom( OWFWorkflow_Step_Actions_ActionItem_CustomField_Base, OWFWorkflow_Step_Actions_ActionItem_CustomField_Checkbox );

OWFWorkflow_Step_Actions_ActionItem_CustomField_Checkbox.prototype.SetValue = function( value )
{
	this.value = value;
	this.checkbox.SetChecked( this.value ? true : false );

	return this;
}

OWFWorkflow_Step_Actions_ActionItem_CustomField_Checkbox.prototype.GetValue = function()
{
	var customfield;

	customfield				= new Object();
	customfield.module_code = this.customfield.module.code;
	customfield.field		= this.customfield.code;
	customfield.value		= this.checkbox.GetChecked() ? true : false;

	return customfield;
}

// OWFWorkflow_Step_Actions_ActionItem_CustomField_ImageUpload
////////////////////////////////////////////////////

function OWFWorkflow_Step_Actions_ActionItem_CustomField_ImageUpload( customfield, element_parent )
{
	var self = this;
	var element_input_container, element_button_container;

	OWFWorkflow_Step_Actions_ActionItem_CustomField_Base.call( this, customfield, element_parent );

	this.element_container		= newElement( 'span', { 'class': 'workflow_addeditdialog_action_custom_image_container' },			null, element_parent );
	element_input_container		= newElement( 'span', { 'class': 'workflow_addeditdialog_action_custom_image_input_container' },	null, this.element_container );
	element_button_container	= newElement( 'span', { 'class': 'workflow_addeditdialog_action_custom_image_button_container' },	null, this.element_container );

	this.input_value			= new MMInput( element_input_container, 'Image_Input', '' );
	this.button					= new MMButton( element_button_container );

	this.input_value.SetTitle( 'Image Path' );
	this.input_value.SetClassName( 'mm_input_common whole_width medium title_visible' );
	this.input_value.SetOnEnterHandler( function( e ) { return self.onEnter_Value( e ); } );

	this.button.SetImage( 'picture' );
	this.button.SetClassName( 'mm10_button_style_alternative_1 icon' );
	this.button.SetOnClickHandler( function( e )
	{
		var dialog;

		dialog				= new MMImagePicker( true, true );
		dialog.onComplete	= function( images )
		{
			if ( !images || images.length != 1 )
			{
				return;
			}

			self.input_value.SetValue( images[ 0 ].image );
		};

		dialog.Show();
	} );
}

DeriveFrom( OWFWorkflow_Step_Actions_ActionItem_CustomField_Base, OWFWorkflow_Step_Actions_ActionItem_CustomField_ImageUpload );

OWFWorkflow_Step_Actions_ActionItem_CustomField_ImageUpload.prototype.SetValue = function( value )
{
	this.input_value.SetValue( value );
}

OWFWorkflow_Step_Actions_ActionItem_CustomField_ImageUpload.prototype.GetValue = function()
{
	var customfield;

	customfield				= new Object();
	customfield.module_code = this.customfield.module.code;
	customfield.field		= this.customfield.code;
	customfield.value		= this.input_value.GetValue();

	return customfield;
}

// OWFWorkflow_Step_Actions_ActionItem_CustomField_CustomUpload
////////////////////////////////////////////////////

function OWFWorkflow_Step_Actions_ActionItem_CustomField_CustomUpload( customfield, element_parent )
{
	var self = this;
	var element_input_container, element_button_container;

	OWFWorkflow_Step_Actions_ActionItem_CustomField_Base.call( this, customfield, element_parent );

	this.element_container		= newElement( 'span', { 'class': 'workflow_addeditdialog_action_custom_customupload_container' },			null, element_parent );
	element_input_container		= newElement( 'span', { 'class': 'workflow_addeditdialog_action_custom_customupload_input_container' },		null, this.element_container );
	element_button_container	= newElement( 'span', { 'class': 'workflow_addeditdialog_action_custom_customupload_button_container' },	null, this.element_container );

	this.input_value			= new MMInput( element_input_container, 'File_Input', '' );
	this.button					= new MMButton( element_button_container );

	this.input_value.SetTitle( 'File Path' );
	this.input_value.SetClassName( 'mm_input_common whole_width medium title_visible' );
	this.input_value.SetOnEnterHandler( function( e ) { return self.onEnter_Value( e ); } );

	this.button.SetImage( 'upload' );
	this.button.SetClassName( 'mm10_button_style_alternative_1 icon' );
	this.button.SetOnClickHandler( function( e )
	{
		window.FileUpload_Callback = function( value )
		{
			self.input_value.SetValue( value );
			window.FileUpload_Callback = null;
		}

		return PopupFileUpload( 'Module_Data', customfield.module.code, '' );
	} );
}

DeriveFrom( OWFWorkflow_Step_Actions_ActionItem_CustomField_Base, OWFWorkflow_Step_Actions_ActionItem_CustomField_CustomUpload );

OWFWorkflow_Step_Actions_ActionItem_CustomField_CustomUpload.prototype.SetValue = function( value )
{
	this.input_value.SetValue( value );
}

OWFWorkflow_Step_Actions_ActionItem_CustomField_CustomUpload.prototype.GetValue = function()
{
	var customfield;

	customfield				= new Object();
	customfield.module_code = this.customfield.module.code;
	customfield.field		= this.customfield.code;
	customfield.value		= this.input_value.GetValue();

	return customfield;
}

// OWFWorkflow_Step_Actions_ActionItem_CustomField_MultiText
////////////////////////////////////////////////////

function OWFWorkflow_Step_Actions_ActionItem_CustomField_MultiText( customfield, element_parent )
{
	OWFWorkflow_Step_Actions_ActionItem_CustomField_Base.call( this, customfield, element_parent );

	this.textarea_value = new MMTextArea( element_parent, 'CustomField_Value', '' );
	this.textarea_value.SetTitle( 'Custom Field Value' );
	this.textarea_value.AddClassName( [ 'whole_width', 'title_visible' ] );
	this.textarea_value.SetResizeEnabled( { horizontal: false } );
}

DeriveFrom( OWFWorkflow_Step_Actions_ActionItem_CustomField_Base, OWFWorkflow_Step_Actions_ActionItem_CustomField_MultiText );

OWFWorkflow_Step_Actions_ActionItem_CustomField_MultiText.prototype.SetValue = function( value )
{
	this.textarea_value.SetValue( value.join( '\r\n' ) );
}

OWFWorkflow_Step_Actions_ActionItem_CustomField_MultiText.prototype.GetValue = function()
{
	var customfield;

	customfield				= new Object();
	customfield.module_code = this.customfield.module.code;
	customfield.field		= this.customfield.code;
	customfield.value		= this.textarea_value.GetValue().split( '\r\n' );

	return customfield;
}

// OWFWorkflow_Step_Actions_ActionItem_CustomField_Text
////////////////////////////////////////////////////

function OWFWorkflow_Step_Actions_ActionItem_CustomField_Text( customfield, element_parent )
{
	var self = this;

	OWFWorkflow_Step_Actions_ActionItem_CustomField_Base.call( this, customfield, element_parent );

	this.input_value = new MMInput( element_parent, 'CustomField_Value', '' );
	this.input_value.SetTitle( 'Custom Field Value' );
	this.input_value.SetClassName( 'mm_input_common whole_width medium title_visible' );
	this.input_value.SetOnEnterHandler( function( e ) { return self.onEnter_Value( e ); } );
}

DeriveFrom( OWFWorkflow_Step_Actions_ActionItem_CustomField_Base, OWFWorkflow_Step_Actions_ActionItem_CustomField_Text );

OWFWorkflow_Step_Actions_ActionItem_CustomField_Text.prototype.SetValue = function( value )
{
	this.input_value.SetValue( value );
}

OWFWorkflow_Step_Actions_ActionItem_CustomField_Text.prototype.GetValue = function()
{
	var customfield;

	customfield				= new Object();
	customfield.module_code = this.customfield.module.code;
	customfield.field		= this.customfield.code;
	customfield.value		= this.input_value.GetValue();

	return customfield;
}

// OWFWorkflow_Step_Actions_ActionItem_CustomField_Numeric
////////////////////////////////////////////////////

function OWFWorkflow_Step_Actions_ActionItem_CustomField_Numeric( customfield, element_parent, float_value )
{
	var self = this;

	OWFWorkflow_Step_Actions_ActionItem_CustomField_Base.call( this, customfield, element_parent );

	this.float_value					= float_value;
	this.input_value					= new MMInput( element_parent, 'CustomField_Value', '' );
	this.input_value.onSetInvalid		= function() { self.onSetInvalid(); };
	this.input_value.onClearInvalid		= function() { self.onClearInvalid(); };
	this.input_value.onValidate			= function( value ) { return self.onValidateValue( value ) };
	this.input_value.SetTitle( 'Custom Field Value' );
	this.input_value.SetClassName( 'mm_input_common whole_width medium title_visible' );
	this.input_value.SetOnEnterHandler( function( e ) { return self.onEnter_Value( e ); } );
}

DeriveFrom( OWFWorkflow_Step_Actions_ActionItem_CustomField_Base, OWFWorkflow_Step_Actions_ActionItem_CustomField_Numeric );

OWFWorkflow_Step_Actions_ActionItem_CustomField_Numeric.prototype.SetValue = function( value )
{
	this.input_value.SetValue( value );
}

OWFWorkflow_Step_Actions_ActionItem_CustomField_Numeric.prototype.GetValue = function()
{
	var customfield;

	customfield				= new Object();
	customfield.module_code = this.customfield.module.code;
	customfield.field		= this.customfield.code;

	if ( !this.onValidateValue( this.input_value.GetValue(), null ) )	customfield.value = this.input_value.GetValue();
	else																customfield.value = stod( stod_def( this.input_value.GetValue(), 0 ).toFixed( this.float_value ) );

	return customfield;
}

OWFWorkflow_Step_Actions_ActionItem_CustomField_Numeric.prototype.onValidateValue = function( value, error /* optional */ )
{
	var options = new Object();

	if ( this.float_value == 0 )
	{
		if ( ValidateWholeNumber( value, options ) )
		{
			return true;
		}
	}
	else
	{
		options.max_left_digits		= 10;
		options.max_right_digits	= this.float_value;

		if ( ValidateFloatingPointNumber( value, options ) )
		{
			return true;
		}
	}

	if ( getVariableType( error ) === 'object' )
	{
		error.error_message = options.message;
	}

	this.input_value.SetInvalid( options.message );

	return false;
}

OWFWorkflow_Step_Actions_ActionItem_CustomField_Numeric.prototype.SetInvalid = function( error_message )
{
	this.input_value.SetInvalid( error_message );
}

OWFWorkflow_Step_Actions_ActionItem_CustomField_Numeric.prototype.ClearInvalid = function()
{
	this.input_value.ClearInvalid();
}

OWFWorkflow_Step_Actions_ActionItem_CustomField_Numeric.prototype.GetInvalid = function()
{
	return this.input_value.GetInvalid();
}

OWFWorkflow_Step_Actions_ActionItem_CustomField_Numeric.prototype.Validate = function( errors )
{
	var error = new Object();

	if ( !this.onValidateValue( this.input_value.GetValue(), error ) )
	{
		error.error_field	= 'act_data:value';
		errors.push( error );

		return false;
	}

	return true;
}

// OWFWorkflow_Step_Actions_ActionItem_CustomField_Date
////////////////////////////////////////////////////

function OWFWorkflow_Step_Actions_ActionItem_CustomField_Date( customfield, element_parent )
{
	var self = this;

	OWFWorkflow_Step_Actions_ActionItem_CustomField_Base.call( this, customfield, element_parent );

	this.value			= 0;
	this.button_date	= new MMButton( element_parent );

	this.button_date.SetClassName( 'workflow_addeditdialog_action_select_button' );
	this.button_date.SetTitle( 'Custom Field Value' );
	this.button_date.SetText( 'N/A' );

	this.button_date.SetOnClickHandler( function( event )
	{
		var dialog;

		if ( getVariableType( self.value ) === 'number' && self.value > 0 )	dialog = new MMDateTimePicker_DateOnly( ( new Date( self.value * 1000 ) ) );
		else																dialog = new MMDateTimePicker_DateOnly( ( new Date() ) );

		dialog.oncomplete = function( date )
		{
			self.value = stoi( date.getTime() / 1000 );
			self.button_date.SetText( date.toLocaleDateString() );
			self.ClearInvalid();
		};

		dialog.Show();

		eventStopPropagation( event ? event : window.event );
		return eventPreventDefault( event ? event : window.event );
	} );
}

DeriveFrom( OWFWorkflow_Step_Actions_ActionItem_CustomField_Base, OWFWorkflow_Step_Actions_ActionItem_CustomField_Date );

OWFWorkflow_Step_Actions_ActionItem_CustomField_Date.prototype.SetValue = function( value )
{
	if ( getVariableType( value ) === 'number' && value > 0 )
	{
		this.value = value;
		this.button_date.SetText( ( new Date( value * 1000 ) ).toLocaleDateString() );
		this.ClearInvalid();
	}
	else
	{
		this.value = 0;
		this.button_date.SetText( 'N/A' );
		this.ClearInvalid();
	}
}

OWFWorkflow_Step_Actions_ActionItem_CustomField_Date.prototype.GetValue = function()
{
	var customfield;

	customfield				= new Object();
	customfield.module_code = this.customfield.module.code;
	customfield.field		= this.customfield.code;
	customfield.value		= this.value;

	return customfield;
}

OWFWorkflow_Step_Actions_ActionItem_CustomField_Date.prototype.SetInvalid = function( error_message )
{
	this.button_date.AddClassName( 'invalid' );
	this.button_date.SetText( error_message );
	OWFWorkflow_Step_Actions_ActionItem_CustomField_Base.prototype.SetInvalid.call( this, error_message );
}

OWFWorkflow_Step_Actions_ActionItem_CustomField_Date.prototype.ClearInvalid = function()
{
	this.button_date.RemoveClassName( 'invalid' );
	OWFWorkflow_Step_Actions_ActionItem_CustomField_Base.prototype.ClearInvalid.call( this );
}

OWFWorkflow_Step_Actions_ActionItem_CustomField_Date.prototype.Validate = function( errors )
{
	if ( this.value === 0 )
	{
		error				= new Object();
		error.error_field	= 'act_data:value';
		error.error_message	= 'Please select a date';

		errors.push( error );

		return false;
	}

	return true;
}

// OWFWorkflow_Step_Actions_ActionItem_CustomField_DateTime
////////////////////////////////////////////////////

function OWFWorkflow_Step_Actions_ActionItem_CustomField_DateTime( customfield, element_parent )
{
	var self = this;

	OWFWorkflow_Step_Actions_ActionItem_CustomField_Base.call( this, customfield, element_parent );

	this.value			= 0;
	this.button_date	= new MMButton( element_parent );

	this.button_date.SetClassName( 'workflow_addeditdialog_action_select_button' );
	this.button_date.SetTitle( 'Custom Field Value' );
	this.button_date.SetText( 'N/A' );

	this.button_date.SetOnClickHandler( function( event )
	{
		var dialog;

		if ( getVariableType( self.value ) === 'number' && self.value > 0 )	dialog = new MMDateTimePicker( ( new Date( self.value * 1000 ) ) );
		else																dialog = new MMDateTimePicker( ( new Date() ) );

		dialog.oncomplete = function( date )
		{
			self.value = stoi( date.getTime() / 1000 );
			self.button_date.SetText( date.toLocaleString() );
			self.ClearInvalid();
		};

		dialog.Show();

		eventStopPropagation( event ? event : window.event );
		return eventPreventDefault( event ? event : window.event );
	} );
}

DeriveFrom( OWFWorkflow_Step_Actions_ActionItem_CustomField_Base, OWFWorkflow_Step_Actions_ActionItem_CustomField_DateTime );

OWFWorkflow_Step_Actions_ActionItem_CustomField_DateTime.prototype.SetValue = function( value )
{
	if ( getVariableType( value ) === 'number' && value > 0 )
	{
		this.value = value;
		this.button_date.SetText( ( new Date( value * 1000 ) ).toLocaleString() );
		this.ClearInvalid();
	}
	else
	{
		this.value = 0;
		this.button_date.SetText( 'N/A' );
		this.ClearInvalid();
	}
}

OWFWorkflow_Step_Actions_ActionItem_CustomField_DateTime.prototype.GetValue = function()
{
	var customfield;

	customfield				= new Object();
	customfield.module_code = this.customfield.module.code;
	customfield.field		= this.customfield.code;
	customfield.value		= this.value;

	return customfield;
}

OWFWorkflow_Step_Actions_ActionItem_CustomField_DateTime.prototype.SetInvalid = function( error_message )
{
	this.button_date.AddClassName( 'invalid' );
	this.button_date.SetText( error_message );
	OWFWorkflow_Step_Actions_ActionItem_CustomField_Base.prototype.SetInvalid.call( this, error_message );
}

OWFWorkflow_Step_Actions_ActionItem_CustomField_DateTime.prototype.ClearInvalid = function()
{
	this.button_date.RemoveClassName( 'invalid' );
	OWFWorkflow_Step_Actions_ActionItem_CustomField_Base.prototype.ClearInvalid.call( this );
}

OWFWorkflow_Step_Actions_ActionItem_CustomField_DateTime.prototype.Validate = function( errors )
{
	if ( this.value === 0 )
	{
		error				= new Object();
		error.error_field	= 'act_data:value';
		error.error_message	= 'Please select a date and time';

		errors.push( error );

		return false;
	}

	return true;
}

// OWFWorkflow_Step_Overview
////////////////////////////////////////////////////

function OWFWorkflow_Step_Overview( editmode )
{
	var self = this;

	OWFWorkflow_Step.call( this, 'workflow', 'Overview' );

	this.Feature_TitledContent_Enable( 'Overview', '' );
	this.Feature_ActionBar_Enable();

	this.element_actionbar_name_container.style.display		= 'none';
	this.element_actionbar_name_edit.style.display			= 'none';

	this.element_container.className						= classNameAdd( this.element_container, 'workflow_addeditdialog_step_overview' );
	this.element_navigationitem.className					= classNameAdd( this.element_navigationitem, 'workflow_addeditdialog_navigationitem_overview' );

	// Elements
	this.element_workflow_container							= newElement( 'span',	{ 'class': 'workflow_addeditdialog_step_overview_workflow_container' },						null, this.element_data_container );
	this.element_workflow_name_container					= newElement( 'span',	{ 'class': 'workflow_addeditdialog_step_overview_workflow_name_container' },				null, this.element_data_container );
	this.element_workflow_name								= newElement( 'span',	{ 'class': 'workflow_addeditdialog_step_overview_workflow_name mm10_style_header_font' },	null, this.element_workflow_name_container );
	this.element_workflow_name_edit							= newElement( 'span',	{ 'class': 'workflow_addeditdialog_step_overview_workflow_name_edit' },						null, this.element_workflow_name_container );
	this.element_canvas										= newElement( 'canvas',	{ 'class': 'workflow_addeditdialog_step_overview_canvas' },									null, this.element_workflow_container );
	this.element_workflow									= newElement( 'span',	{ 'class': 'workflow_addeditdialog_step_overview_workflow' },								null, this.element_workflow_container );
	this.element_workflow_positioner						= newElement( 'span',	{ 'class': 'workflow_addeditdialog_step_overview_workflow_positioner' },					null, this.element_workflow );
	this.element_workflow_trigger_container					= newElement( 'span',	{ 'class': 'workflow_addeditdialog_step_overview_workflow_triggers_container' },			null, this.element_workflow_positioner );
	this.element_workflow_condition_container				= newElement( 'span',	{ 'class': 'workflow_addeditdialog_step_overview_workflow_condition_container' },			null, this.element_workflow_positioner );
	this.element_workflow_action_container					= newElement( 'span',	{ 'class': 'workflow_addeditdialog_step_overview_workflow_action_container' },				null, this.element_workflow_positioner );

	this.element_add_trigger								= newElement( 'span',	{ 'class': 'workflow_addeditdialog_step_overview_workflow_box diamond error' },				null, null );
	this.element_add_trigger_shape							= newElement( 'span',	{ 'class': 'workflow_addeditdialog_step_overview_workflow_box_shape' },						null, this.element_add_trigger );
	this.element_add_trigger_text							= newElement( 'span',	{ 'class': 'workflow_addeditdialog_step_overview_workflow_box_text' },						null, this.element_add_trigger );
	this.element_add_trigger_text.textContent				= 'No Triggers Selected';

	this.element_add_action									= newElement( 'span',	{ 'class': 'workflow_addeditdialog_step_overview_workflow_box rectangle error action' },	null, null );
	this.element_add_action_shape							= newElement( 'span',	{ 'class': 'workflow_addeditdialog_step_overview_workflow_box_shape' },						null, this.element_add_action );
	this.element_add_action_text							= newElement( 'span',	{ 'class': 'workflow_addeditdialog_step_overview_workflow_box_text' },						null, this.element_add_action );
	this.element_add_action_text.textContent				= 'No Actions Selected';

	this.button_workflow_edit								= new MMButton( this.element_workflow_name_edit );
	this.button_workflow_edit.SetText( 'Edit' );
	this.button_workflow_edit.SetClassName( 'mm10_button_style_link' );
	this.button_workflow_edit.SetOnClickHandler( function( e ) { self.onClick_EditName( e ); } );

	// Top Controls
	this.button_zoom_out									= this.TitleBar_Control_Button_Add( 'zoom_out', 'Zoom Out' );
	this.button_zoom_out.SetOnClickHandler( function( e ) { self.Workflow_Zoom_Out(); } );

	this.button_zoom_in										= this.TitleBar_Control_Button_Add( 'zoom_in', 'Zoom In' );
	this.button_zoom_in.SetOnClickHandler( function( e ) { self.Workflow_Zoom_In(); } );

	// Variables
	this.canvas_width										= -1;
	this.canvas_height										= -1;
	this.workflow_scale										= 1.0;
	this.workflow_scale_multiplier							= 0.1;
	this.workflow_translate_x								= 0;
	this.workflow_translate_y								= 0;
	this.workflow_animation_id								= GenerateUniqueID();
	this.itemlist_action									= new Array();
	this.itemlist_trigger									= new Array();

	this.canvas_context										= this.element_canvas.getContext( '2d' );

	// Events
	this.event_render_workflow								= function() { self.Render_Workflow(); self.render_workflow_id = requestAnimationFrame( self.event_render_workflow ); };
	this.event_onmousedown_workflow							= function( event ) { return self.Event_OnMouseDown_Workflow( event ? event : window.event ); };
	this.event_onmousemove_workflow							= function( event ) { return self.Event_OnMouseMove_Workflow( event ? event : window.event ); };
	this.event_onmouseup_workflow							= function( event ) { return self.Event_OnMouseUp_Workflow( event ? event : window.event ); };
	this.event_onmousescroll_workflow						= function( event ) { return self.Event_OnMouseScroll_Workflow( event ? event : window.event ); };

	AddEvent( this.element_workflow, 'mousedown', this.event_onmousedown_workflow );
	AddScrollEvent( this.element_workflow, this.event_onmousescroll_workflow );

	if ( editmode )
	{
		this.ActionBar_Button_Add_Delete();
		this.ActionBar_Button_Add_Previous();
		this.ActionBar_Button_Add_Update();
	}
	else
	{
		this.ActionBar_Button_Add_Previous();
		this.ActionBar_Button_Add_Create();
	}
}

DeriveFrom( OWFWorkflow_Step, OWFWorkflow_Step_Overview );

OWFWorkflow_Step_Overview.prototype.onRestoreData = function()
{
	var i, i_len;

	if ( this.element_add_trigger.parentNode )	this.element_add_trigger.parentNode.removeChild( this.element_add_trigger );
	if ( this.element_add_action.parentNode )	this.element_add_action.parentNode.removeChild( this.element_add_action );

	this.element_workflow_trigger_container.innerHTML	= '';
	this.element_workflow_condition_container.innerHTML	= '';
	this.element_workflow_action_container.innerHTML	= '';

	this.element_workflow_name.textContent				= this.workflow.name;

	this.ActionItems_Empty();
	this.TriggerItems_Empty();

	if ( !Array.isArray( this.workflow.triggers ) || this.workflow.triggers.length === 0 )
	{
		this.element_workflow_trigger_container.appendChild( this.element_add_trigger );
	}
	else
	{
		for ( i = 0, i_len = this.workflow.triggers.length; i < i_len; i++ )
		{
			this.TriggerItem_Append( this.workflow.triggers[ i ] );
		}
	}

	this.item_condition = new OWFWorkflow_Step_Overview_ConditionItem( this.element_workflow_condition_container );
	this.item_condition.SetConditions( this.workflow.cond );

	if ( !Array.isArray( this.workflow.actions ) || this.workflow.actions.length === 0 )
	{
		this.element_workflow_action_container.appendChild( this.element_add_action );
	}
	else
	{
		for ( i = 0, i_len = this.workflow.actions.length; i < i_len; i++ )
		{
			this.ActionItem_Append( this.workflow.actions[ i ] );
		}
	}
}

OWFWorkflow_Step_Overview.prototype.Begin = function( delay, animationlist )
{
	var self = this;
	var return_delay = OWFWorkflow_Step.prototype.Begin.call( this, delay, animationlist );

	// Start Render
	this.render_workflow_id = requestAnimationFrame( this.event_render_workflow );

	if ( !Array.isArray( animationlist ) )
	{
		this.Begin_SetWorkflowSize();
	}
	else
	{
		animationlist.push( createAnimation(
		{
			delay: delay,
			duration: 0,
			delta: animationLinear,
			onstart: function()
			{
				self.Begin_SetWorkflowSize();
			},
			step: function( delta )
			{
				;
			}
		} ) );
	}

	return return_delay;
}

OWFWorkflow_Step_Overview.prototype.End = function( delay, animationlist )
{
	// Stop Render
	cancelAnimationFrame( this.render_workflow_id );

	return OWFWorkflow_Step.prototype.End.call( this, delay, animationlist );
}

OWFWorkflow_Step_Overview.prototype.Begin_SetWorkflowSize = function()
{
	var new_scale, scale_width, combined_top, scale_height, combined_left, combined_width;
	var new_scale_x, new_scale_y, original_scale, combined_height, translate_x_new, translate_y_new;
	var rect_actions_container, rect_workflow_container, rect_triggers_container, rect_positioner_container;

	rect_positioner_container							= this.element_workflow_positioner.getBoundingClientRect();
	rect_workflow_container								= this.element_workflow.getBoundingClientRect();
	rect_triggers_container								= this.element_workflow_trigger_container.getBoundingClientRect();
	rect_actions_container								= this.element_workflow_action_container.getBoundingClientRect();

	combined_top										= rect_triggers_container.top;
	combined_left										= Math.min( rect_triggers_container.left, rect_actions_container.left );
	combined_width										= Math.max( rect_triggers_container.right, rect_actions_container.right ) - Math.min( rect_triggers_container.left, rect_actions_container.left );
	combined_height										= ( rect_actions_container.bottom - rect_triggers_container.top );

	original_scale										= this.workflow_scale;
	new_scale_x											= ( rect_workflow_container.width ) * ( original_scale / combined_width );
	new_scale_y											= ( rect_workflow_container.height - 120 ) * ( original_scale / combined_height );
	new_scale											= stod_range( Math.min( new_scale_x, new_scale_y ), 0.5, 1 );

	translate_x_new										= ( rect_workflow_container.width / 2 ) - ( ( ( combined_left - rect_positioner_container.left ) + ( combined_width / 2 ) ) );
	translate_y_new										= ( rect_workflow_container.height / 2 ) - ( ( ( combined_top - rect_positioner_container.top ) + ( combined_height / 2 ) ) );

	scale_width											= ( combined_left + ( combined_width / 2 ) ) - rect_positioner_container.left;
	scale_height										= ( combined_top + ( combined_height / 2 ) ) - rect_positioner_container.top;

	this.workflow_scale									= new_scale;
	this.workflow_translate_x							= translate_x_new - ( ( ( scale_width / original_scale ) * new_scale ) - scale_width );
	this.workflow_translate_y							= stoi_min( translate_y_new - ( ( ( scale_height / original_scale ) * new_scale ) - scale_height ), 100 );

	this.Workflow_Redraw();
}

OWFWorkflow_Step_Overview.prototype.onVisible = function()
{
	this.Workflow_Redraw();
}

OWFWorkflow_Step_Overview.prototype.ActionItems = function()
{
	return this.itemlist_action;
}

OWFWorkflow_Step_Overview.prototype.ActionItem_Count = function()
{
	return this.itemlist_action.length;
}

OWFWorkflow_Step_Overview.prototype.ActionItem_IndexOf = function( item_action )
{
	return this.itemlist_action.indexOf( item_action );
}

OWFWorkflow_Step_Overview.prototype.ActionItem_AtIndex = function( index )
{
	if ( index >= 0 && this.itemlist_action.hasOwnProperty( index ) && this.itemlist_action[ index ] instanceof OWFWorkflow_Step_Overview_ActionItem )
	{
		return this.itemlist_action[ index ];
	}

	return null;
}

OWFWorkflow_Step_Overview.prototype.ActionItem_Create = function( action )
{
	return ( new OWFWorkflow_Step_Overview_ActionItem( action ) );
}

OWFWorkflow_Step_Overview.prototype.ActionItem_Append = function( action )
{
	this.ActionItem_Insert( this.ActionItem_Create( action ), -1 );
}

OWFWorkflow_Step_Overview.prototype.ActionItem_Insert = function( item_action, index )
{
	var sibling_workflow_action;

	if ( ( sibling_workflow_action = this.ActionItem_AtIndex( index ) ) === null )
	{
		index = this.itemlist_action.length;
	}

	item_action.SetParentNode_InsertBefore( this.element_workflow_action_container, sibling_workflow_action ? sibling_workflow_action.ContainedElement() : null );
	this.itemlist_action.splice( index, 0, item_action );
}

OWFWorkflow_Step_Overview.prototype.ActionItem_Remove = function( item_action )
{
	var index;

	if ( this.element_workflow_action_container === item_action.ParentNode() )
	{
		this.element_workflow_action_container.removeChild( item_action.ContainedElement() );
	}

	if ( ( index = this.itemlist_action.indexOf( item_action ) ) !== -1 )
	{
		this.itemlist_action.splice( index, 1 );
	}
}

OWFWorkflow_Step_Overview.prototype.ActionItems_Empty = function()
{
	var item_action;

	while ( this.itemlist_action.length )
	{
		item_action = this.itemlist_action.pop();

		if ( this.element_workflow_action_container === item_action.ParentNode() )
		{
			this.element_workflow_action_container.removeChild( item_action.ContainedElement() );
		}
	}
}

OWFWorkflow_Step_Overview.prototype.TriggerItems = function()
{
	return this.itemlist_trigger;
}

OWFWorkflow_Step_Overview.prototype.TriggerItem_Count = function()
{
	return this.itemlist_trigger.length;
}

OWFWorkflow_Step_Overview.prototype.TriggerItem_IndexOf = function( item_trigger )
{
	return this.itemlist_trigger.indexOf( item_trigger );
}

OWFWorkflow_Step_Overview.prototype.TriggerItem_AtIndex = function( index )
{
	if ( index >= 0 && this.itemlist_trigger.hasOwnProperty( index ) && this.itemlist_trigger[ index ] instanceof OWFWorkflow_Step_Overview_TriggerItem )
	{
		return this.itemlist_trigger[ index ];
	}

	return null;
}

OWFWorkflow_Step_Overview.prototype.TriggerItem_Create = function( trigger )
{
	return ( new OWFWorkflow_Step_Overview_TriggerItem( trigger ) );
}

OWFWorkflow_Step_Overview.prototype.TriggerItem_Append = function( trigger )
{
	this.TriggerItem_Insert( this.TriggerItem_Create( trigger ), -1 );
}

OWFWorkflow_Step_Overview.prototype.TriggerItem_Insert = function( item_trigger, index )
{
	var sibling_workflow_trigger;

	if ( ( sibling_workflow_trigger = this.TriggerItem_AtIndex( index ) ) === null )
	{
		index = this.itemlist_trigger.length;
	}

	item_trigger.SetParentNode_InsertBefore( this.element_workflow_trigger_container, sibling_workflow_trigger ? sibling_workflow_trigger.ContainedElement() : null );
	this.itemlist_trigger.splice( index, 0, item_trigger );
}

OWFWorkflow_Step_Overview.prototype.TriggerItem_Remove = function( item_trigger )
{
	var index;

	if ( this.element_workflow_trigger_container === item_trigger.ParentNode() )
	{
		this.element_workflow_trigger_container.removeChild( item_trigger.ContainedElement() );
	}

	if ( ( index = this.itemlist_trigger.indexOf( item_trigger ) ) !== -1 )
	{
		this.itemlist_trigger.splice( index, 1 );
	}
}

OWFWorkflow_Step_Overview.prototype.TriggerItems_Empty = function()
{
	var item_trigger;

	while ( this.itemlist_trigger.length )
	{
		item_trigger = this.itemlist_trigger.pop();

		if ( this.element_workflow_trigger_container === item_trigger.ParentNode() )
		{
			this.element_workflow_trigger_container.removeChild( item_trigger.ContainedElement() );
		}
	}
}

OWFWorkflow_Step_Overview.prototype.Workflow_Zoom_In = function()
{
	var new_scale, scale_width, scale_height, workflow_rect, original_scale, positioner_rect;

	workflow_rect				= this.element_workflow.getBoundingClientRect();
	positioner_rect				= this.element_workflow_positioner.getBoundingClientRect();
	original_scale				= this.workflow_scale;
	new_scale					= this.workflow_scale * ( 1 + ( this.workflow_scale_multiplier * 2 ) );
	scale_width					= workflow_rect.left + ( workflow_rect.width / 2 ) - positioner_rect.left;
	scale_height				= workflow_rect.top + ( workflow_rect.height / 2 ) - positioner_rect.top;

	this.workflow_scale			= new_scale;
	this.workflow_translate_x	= this.workflow_translate_x - ( ( ( scale_width / original_scale ) * new_scale ) - scale_width );
	this.workflow_translate_y	= this.workflow_translate_y - ( ( ( scale_height / original_scale ) * new_scale ) - scale_height );

	this.Workflow_Redraw();
}

OWFWorkflow_Step_Overview.prototype.Workflow_Zoom_Out = function()
{
	var new_scale, scale_width, scale_height, workflow_rect, original_scale, positioner_rect;

	workflow_rect				= this.element_workflow.getBoundingClientRect();
	positioner_rect				= this.element_workflow_positioner.getBoundingClientRect();
	original_scale				= this.workflow_scale;
	new_scale					= this.workflow_scale * ( 1 - ( this.workflow_scale_multiplier * 2 ) );
	scale_width					= workflow_rect.left + ( workflow_rect.width / 2 ) - positioner_rect.left;
	scale_height				= workflow_rect.top + ( workflow_rect.height / 2 ) - positioner_rect.top;

	this.workflow_scale			= new_scale;
	this.workflow_translate_x	= this.workflow_translate_x - ( ( ( scale_width / original_scale ) * new_scale ) - scale_width );
	this.workflow_translate_y	= this.workflow_translate_y - ( ( ( scale_height / original_scale ) * new_scale ) - scale_height );

	this.Workflow_Redraw();
}

OWFWorkflow_Step_Overview.prototype.Workflow_Redraw = function( animate, animate_duration, animate_onstart, animate_step, animate_oncomplete )
{
	var self = this;
	var scale_end, scale_start, workflow_rect, animationlist, positioner_rect, translate_x_end, translate_y_end, translate_x_start, translate_y_start;

	if ( !animate )
	{
		return this.Workflow_Redraw_LowLevel( this.workflow_scale, this.workflow_translate_x, this.workflow_translate_y );
	}

	workflow_rect		= this.element_workflow.getBoundingClientRect();
	positioner_rect		= this.element_workflow_positioner.getBoundingClientRect();

	scale_start 		= positioner_rect.width / this.element_workflow_positioner.offsetWidth;
	scale_end			= this.workflow_scale;
	translate_x_start	= positioner_rect.left - workflow_rect.left;
	translate_x_end		= this.workflow_translate_x;
	translate_y_start	= positioner_rect.top - workflow_rect.top;
	translate_y_end		= this.workflow_translate_y;

	animationlist		= new Array();
	animationlist.push( createAnimation(
	{
		delay: 0,
		duration: typeof animate_duration === 'number' ? animate_duration : 300,
		delta: animationLinear,
		onstart: function()
		{
			if ( typeof animate_onstart === 'function' )
			{
				animate_onstart();
			}
		},
		step: function( delta )
		{
			self.Workflow_Redraw_LowLevel( scale_end - ( ( scale_end - scale_start ) * ( 1 - delta ) ),
										   translate_x_end - ( ( translate_x_end - translate_x_start ) * ( 1 - delta ) ),
										   translate_y_end - ( ( translate_y_end - translate_y_start ) * ( 1 - delta ) ) );

			if ( typeof animate_step === 'function' )
			{
				animate_step( delta );
			}
		},
		oncomplete: function()
		{
			if ( typeof animate_oncomplete === 'function' )
			{
				animate_oncomplete();
			}
		}
	} ) );

	cancelAnimationFrame( window[ this.workflow_animation_id ] );
	beginAnimations( animationlist, this.workflow_animation_id );
}

OWFWorkflow_Step_Overview.prototype.Workflow_Redraw_SetLineDash = function( ctx, value )
{
	if ( ctx.setLineDash )
	{
		ctx.setLineDash( value );
	}
}

OWFWorkflow_Step_Overview.prototype.Workflow_Redraw_LowLevel = function( scale, translate_x, translate_y )
{
	var i, i_len, odd, element, linkage_top, element_rect, linkage_left, odd_midpoint, even_midpoint, linkage_width, linkage_height, element_canvas_rect, element_condition_rect;

	// Scale Workflow
	this.element_workflow_positioner.style.transform = 'translate(' + translate_x + 'px,' + translate_y + 'px) scale(' + scale + ')';

	// Clear Canvas
	this.canvas_context.clearRect( 0, 0, this.canvas_width, this.canvas_height );

	// Draw Canvas Linkage
	element_canvas_rect				= this.element_canvas.getBoundingClientRect();
	element_condition_rect			= this.item_condition.ContainedElement().getBoundingClientRect();

	this.canvas_context.lineWidth	= 1;
	this.canvas_context.strokeStyle	= "#cfd2d6";

	if ( this.itemlist_trigger.length === 0 )
	{
		element_rect		= this.element_add_trigger.getBoundingClientRect();

		linkage_top			= element_rect.bottom - element_canvas_rect.top;
		linkage_left		= ( element_rect.left - element_canvas_rect.left ) + ( element_rect.width / 2 );
		linkage_width		= ( element_condition_rect.left + ( element_condition_rect.width / 2 ) ) - ( element_rect.left + ( element_rect.width / 2 ) );
		linkage_height		= element_condition_rect.top - element_rect.bottom;

		if ( this.workflow_scale < 0.5 )
		{
			this.canvas_context.beginPath();
			this.Workflow_Redraw_SetLineDash( this.canvas_context, [] );
			this.canvas_context.moveTo( stoi( linkage_left ) + 0.5, stoi( linkage_top ) - stoi( element_rect.height / 2 ) + 0.5 );
			this.canvas_context.lineTo( stoi( linkage_left ) + 0.5, stoi( linkage_top + ( linkage_height / 2 ) ) + 0.5 );
			this.canvas_context.lineTo( stoi( linkage_left + linkage_width ) + 0.5, stoi( linkage_top + ( linkage_height / 2 ) ) + 0.5 );
			this.canvas_context.lineTo( stoi( linkage_left + linkage_width ) + 0.5, stoi( linkage_top + linkage_height ) + 0.5 );
			this.canvas_context.stroke();
		}
		else
		{
			this.canvas_context.beginPath();
			this.Workflow_Redraw_SetLineDash( this.canvas_context, [ 4, 4 ] );
			this.canvas_context.moveTo( stoi( linkage_left ) + 0.5, stoi( linkage_top ) - stoi( element_rect.height / 2 ) + 0.5 );
			this.canvas_context.lineTo( stoi( linkage_left ) + 0.5, stoi( linkage_top + ( linkage_height / 2 ) ) - 15 + 0.5 );
			this.canvas_context.lineTo( stoi( linkage_left ) + 0.5, stoi( linkage_top + ( linkage_height / 2 ) ) + 0.5 );
			this.canvas_context.stroke();

			this.canvas_context.beginPath();
			this.Workflow_Redraw_SetLineDash( this.canvas_context, [] );
			this.canvas_context.moveTo( stoi( linkage_left ) + 0.5, stoi( linkage_top + ( linkage_height / 2 ) ) + 0.5 );
			this.canvas_context.lineTo( stoi( linkage_left + linkage_width ) + 0.5, stoi( linkage_top + ( linkage_height / 2 ) ) + 0.5 );
			this.canvas_context.lineTo( stoi( linkage_left + linkage_width ) + 0.5, stoi( linkage_top + linkage_height ) - 5 + 0.5 );
			this.canvas_context.stroke();

			// Arrow head left
			this.canvas_context.beginPath();
			this.canvas_context.moveTo( stoi( linkage_left + linkage_width ) - 5 + 0.5, stoi( linkage_top + linkage_height ) - 10 + 0.5 );
			this.canvas_context.lineTo( stoi( linkage_left + linkage_width ) + 0.5, stoi( linkage_top + linkage_height ) - 5 + 0.5 );
			this.canvas_context.stroke();

			// Arrow head right
			this.canvas_context.beginPath();
			this.canvas_context.moveTo( stoi( linkage_left + linkage_width ) + 5 + 0.5, stoi( linkage_top + linkage_height ) - 10 + 0.5 );
			this.canvas_context.lineTo( stoi( linkage_left + linkage_width ) + 0.5, stoi( linkage_top + linkage_height ) - 5 + 0.5 );
			this.canvas_context.stroke();
		}
	}
	else
	{
		odd				= ( this.itemlist_trigger.length % 2 ) === 1;
		odd_midpoint	= Math.floor( ( this.itemlist_trigger.length - 1 ) / 2 );
		even_midpoint	= ( this.itemlist_trigger.length - 1 ) / 2;

		for ( i = 0, i_len = this.itemlist_trigger.length; i < i_len; i++ )
		{
			element				= this.itemlist_trigger[ i ].ContainedElement();
			element_rect		= element.getBoundingClientRect();

			linkage_top			= element_rect.bottom - element_canvas_rect.top;
			linkage_left		= ( element_rect.left - element_canvas_rect.left ) + ( element_rect.width / 2 );
			linkage_width		= ( element_condition_rect.left + ( element_condition_rect.width / 2 ) ) - ( element_rect.left + ( element_rect.width / 2 ) );
			linkage_height		= element_condition_rect.top - element_rect.bottom;

			if ( this.workflow_scale < 0.5 )
			{
				this.canvas_context.beginPath();
				this.Workflow_Redraw_SetLineDash( this.canvas_context, [] );
				this.canvas_context.moveTo( stoi( linkage_left ) + 0.5, stoi( linkage_top ) - stoi( element_rect.height / 2 ) + 0.5 );
				this.canvas_context.lineTo( stoi( linkage_left ) + 0.5, stoi( linkage_top + ( linkage_height / 2 ) ) + 0.5 );
				this.canvas_context.lineTo( stoi( linkage_left + linkage_width ) + 0.5, stoi( linkage_top + ( linkage_height / 2 ) ) + 0.5 );
				this.canvas_context.lineTo( stoi( linkage_left + linkage_width ) + 0.5, stoi( linkage_top + linkage_height ) + 0.5 );
				this.canvas_context.stroke();
			}
			else
			{
				this.canvas_context.beginPath();
				this.Workflow_Redraw_SetLineDash( this.canvas_context, [ 4, 4 ] );
				this.canvas_context.moveTo( stoi( linkage_left ) + 0.5, stoi( linkage_top ) - stoi( element_rect.height / 2 ) + 0.5 );
				this.canvas_context.lineTo( stoi( linkage_left ) + 0.5, stoi( linkage_top + ( linkage_height / 2 ) ) - 15 + 0.5 );

				if ( ( odd && ( i < odd_midpoint ) ) || ( !odd && ( i < even_midpoint ) ) )			this.canvas_context.arc( stoi( linkage_left ) + 15 + 0.5, stoi( linkage_top + ( linkage_height / 2 ) ) - 15 + 0.5, 15, 1 * Math.PI, 0.5 * Math.PI, true );
				else if ( ( odd && ( i > odd_midpoint ) ) || ( !odd && ( i > even_midpoint ) ) )	this.canvas_context.arc( stoi( linkage_left ) - 15 + 0.5, stoi( linkage_top + ( linkage_height / 2 ) ) - 15 + 0.5, 15, 0, 0.5 * Math.PI, false );
				else																				this.canvas_context.lineTo( stoi( linkage_left ) + 0.5, stoi( linkage_top + ( linkage_height / 2 ) ) + 0.5 );

				this.canvas_context.stroke();

				this.canvas_context.beginPath();
				this.Workflow_Redraw_SetLineDash( this.canvas_context, [] );

				if ( ( odd && ( i < odd_midpoint ) ) || ( !odd && ( i < even_midpoint ) ) )			this.canvas_context.moveTo( stoi( linkage_left ) + 15 + 0.5, stoi( linkage_top + ( linkage_height / 2 ) ) + 0.5 );
				else if ( ( odd && ( i > odd_midpoint ) ) || ( !odd && ( i > even_midpoint ) ) )	this.canvas_context.moveTo( stoi( linkage_left ) - 15 + 0.5, stoi( linkage_top + ( linkage_height / 2 ) ) + 0.5 );
				else																				this.canvas_context.moveTo( stoi( linkage_left ) + 0.5, stoi( linkage_top + ( linkage_height / 2 ) ) + 0.5 );

				this.canvas_context.lineTo( stoi( linkage_left + linkage_width ) + 0.5, stoi( linkage_top + ( linkage_height / 2 ) ) + 0.5 );
				this.canvas_context.lineTo( stoi( linkage_left + linkage_width ) + 0.5, stoi( linkage_top + linkage_height ) - 5 + 0.5 );
				this.canvas_context.stroke();

				// Arrow head left
				this.canvas_context.beginPath();
				this.canvas_context.moveTo( stoi( linkage_left + linkage_width ) - 5 + 0.5, stoi( linkage_top + linkage_height ) - 10 + 0.5 );
				this.canvas_context.lineTo( stoi( linkage_left + linkage_width ) + 0.5, stoi( linkage_top + linkage_height ) - 5 + 0.5 );
				this.canvas_context.stroke();

				// Arrow head right
				this.canvas_context.beginPath();
				this.canvas_context.moveTo( stoi( linkage_left + linkage_width ) + 5 + 0.5, stoi( linkage_top + linkage_height ) - 10 + 0.5 );
				this.canvas_context.lineTo( stoi( linkage_left + linkage_width ) + 0.5, stoi( linkage_top + linkage_height ) - 5 + 0.5 );
				this.canvas_context.stroke();
			}
		}
	}

	if ( this.itemlist_action.length === 0 )
	{
		element_rect		= this.element_add_action.getBoundingClientRect();

		linkage_top			= element_condition_rect.bottom - element_canvas_rect.top;
		linkage_left		= ( element_condition_rect.left - element_canvas_rect.left ) + ( element_condition_rect.width / 2 );
		linkage_width		= element_rect.left - ( element_condition_rect.left + ( element_condition_rect.width / 2 ) );
		linkage_height		= element_rect.top - element_condition_rect.bottom;

		if ( this.workflow_scale < 0.5 )
		{
			this.canvas_context.beginPath();
			this.Workflow_Redraw_SetLineDash( this.canvas_context, [] );
			this.canvas_context.moveTo( stoi( linkage_left ) + 0.5, stoi( linkage_top ) + 0.5 );
			this.canvas_context.lineTo( stoi( linkage_left ) + 0.5, stoi( linkage_top + linkage_height ) + 0.5 );
			this.canvas_context.stroke();
		}
		else
		{
			this.canvas_context.beginPath();
			this.Workflow_Redraw_SetLineDash( this.canvas_context, [] );
			this.canvas_context.moveTo( stoi( linkage_left ) + 0.5, stoi( linkage_top ) + 0.5 );
			this.canvas_context.lineTo( stoi( linkage_left ) + 0.5, stoi( linkage_top + linkage_height ) - 5 + 0.5 );
			this.canvas_context.stroke();

			// Arrow head left
			this.canvas_context.beginPath();
			this.Workflow_Redraw_SetLineDash( this.canvas_context, [] );
			this.canvas_context.moveTo( stoi( linkage_left ) - 5 + 0.5, stoi( linkage_top + linkage_height ) - 10 + 0.5 );
			this.canvas_context.lineTo( stoi( linkage_left ) + 0.5, stoi( linkage_top + linkage_height ) - 5 + 0.5 );
			this.canvas_context.lineTo( stoi( linkage_left ) + 0.5, stoi( linkage_top + linkage_height ) - 5 + 0.5 );
			this.canvas_context.stroke();

			// Arrow head right
			this.canvas_context.beginPath();
			this.Workflow_Redraw_SetLineDash( this.canvas_context, [] );
			this.canvas_context.moveTo( stoi( linkage_left ) + 5 + 0.5, stoi( linkage_top + linkage_height ) - 10 + 0.5 );
			this.canvas_context.lineTo( stoi( linkage_left ) + 0.5, stoi( linkage_top + linkage_height ) - 5 + 0.5 );
			this.canvas_context.stroke();
		}
	}
	else
	{
		element				= this.itemlist_action[ 0 ].ContainedElement();
		element_rect		= element.getBoundingClientRect();

		linkage_top			= element_condition_rect.bottom - element_canvas_rect.top;
		linkage_left		= ( element_condition_rect.left - element_canvas_rect.left ) + ( element_condition_rect.width / 2 );
		linkage_height		= element_rect.top - element_condition_rect.bottom;

		if ( this.workflow_scale < 0.5 )
		{
			this.canvas_context.beginPath();
			this.Workflow_Redraw_SetLineDash( this.canvas_context, [] );
			this.canvas_context.moveTo( stoi( linkage_left ) + 0.5, stoi( linkage_top ) + 0.5 );
			this.canvas_context.lineTo( stoi( linkage_left ) + 0.5, stoi( linkage_top + linkage_height ) + 0.5 );
			this.canvas_context.stroke();
		}
		else
		{
			this.canvas_context.beginPath();
			this.Workflow_Redraw_SetLineDash( this.canvas_context, [] );
			this.canvas_context.moveTo( stoi( linkage_left ) + 0.5, stoi( linkage_top ) + 0.5 );
			this.canvas_context.lineTo( stoi( linkage_left ) + 0.5, stoi( linkage_top + linkage_height ) - 5 + 0.5 );
			this.canvas_context.stroke();

			// Arrow head left
			this.canvas_context.beginPath();
			this.Workflow_Redraw_SetLineDash( this.canvas_context, [] );
			this.canvas_context.moveTo( stoi( linkage_left ) - 5 + 0.5, stoi( linkage_top + linkage_height ) - 10 + 0.5 );
			this.canvas_context.lineTo( stoi( linkage_left ) + 0.5, stoi( linkage_top + linkage_height ) - 5 + 0.5 );
			this.canvas_context.lineTo( stoi( linkage_left ) + 0.5, stoi( linkage_top + linkage_height ) - 5 + 0.5 );
			this.canvas_context.stroke();

			// Arrow head right
			this.canvas_context.beginPath();
			this.Workflow_Redraw_SetLineDash( this.canvas_context, [] );
			this.canvas_context.moveTo( stoi( linkage_left ) + 5 + 0.5, stoi( linkage_top + linkage_height ) - 10 + 0.5 );
			this.canvas_context.lineTo( stoi( linkage_left ) + 0.5, stoi( linkage_top + linkage_height ) - 5 + 0.5 );
			this.canvas_context.stroke();
		}

		for ( i = 1, i_len = this.itemlist_action.length; i < i_len; i++ )
		{
			element				= this.itemlist_action[ i ].ContainedElement();
			element_prev		= this.itemlist_action[ i - 1 ].ContainedElement();
			element_rect		= element.getBoundingClientRect();
			element_prev_rect	= element_prev.getBoundingClientRect();

			linkage_top			= ( element_rect.top + ( element_rect.height / 2 ) ) - element_canvas_rect.top;
			linkage_left		= element_prev_rect.right - element_canvas_rect.left;
			linkage_width		= element_rect.left - element_prev_rect.right;

			this.canvas_context.beginPath();
			this.Workflow_Redraw_SetLineDash( this.canvas_context, [] );
			this.canvas_context.moveTo( stoi( linkage_left ) + 0.5, stoi( linkage_top ) + 0.5 );
			this.canvas_context.lineTo( stoi( linkage_left + linkage_width ) - 5 + 0.5, stoi( linkage_top ) + 0.5 );
			this.canvas_context.stroke();

			// Arrow head top
			this.canvas_context.beginPath();
			this.Workflow_Redraw_SetLineDash( this.canvas_context, [] );
			this.canvas_context.moveTo( stoi( linkage_left + linkage_width ) - 10 + 0.5, stoi( linkage_top ) - 5 + 0.5 );
			this.canvas_context.lineTo( stoi( linkage_left + linkage_width ) - 5 + 0.5, stoi( linkage_top ) + 0.5 );
			this.canvas_context.lineTo( stoi( linkage_left + linkage_width ) - 5 + 0.5, stoi( linkage_top ) + 0.5 );
			this.canvas_context.stroke();

			// Arrow head bottom
			this.canvas_context.beginPath();
			this.Workflow_Redraw_SetLineDash( this.canvas_context, [] );
			this.canvas_context.moveTo( stoi( linkage_left + linkage_width ) - 10 + 0.5, stoi( linkage_top ) + 5 + 0.5 );
			this.canvas_context.lineTo( stoi( linkage_left + linkage_width ) - 5 + 0.5, stoi( linkage_top ) + 0.5 );
			this.canvas_context.stroke();
		}
	}
}

OWFWorkflow_Step_Overview.prototype.Render_Workflow = function()
{
	if ( this.element_workflow_container.offsetWidth !== this.canvas_width ||
		 this.element_workflow_container.offsetHeight !== this.canvas_height )
	{
		this.canvas_width	= this.element_workflow_container.offsetWidth;
		this.canvas_height	= this.element_workflow_container.offsetHeight;

		this.element_canvas.setAttribute( 'width', this.canvas_width + 'px' );
		this.element_canvas.setAttribute( 'height', this.canvas_height + 'px' );

		this.Workflow_Redraw();
	}
}

OWFWorkflow_Step_Overview.prototype.Event_OnMouseDown_Workflow = function( e )
{
	var rightclick, mousepos;

	if ( 'which' in e )			rightclick = ( e.which == 3 ); 
	else if ( 'button' in e )	rightclick = ( e.button == 2 );
	else						rightclick = false;

	if ( rightclick )			return true;

	mousepos					= captureMousePosition( e );

	this.canvas_mousedown		= true;
	this.canvas_started			= true;
	this.canvas_target			= e.target || e.srcElement;
	this.canvas_start_x			= mousepos.x;
	this.canvas_start_y			= mousepos.y;

	this.canvas_mouse_offset_x	= mousepos.x - this.workflow_translate_x;
	this.canvas_mouse_offset_y	= mousepos.y - this.workflow_translate_y;

	clearTextSelection();
	document.body.focus();
	document.body.unselectable			= 'on';
	document.onselectstart				= this.event_returnfalse;
	this.canvas_target.ondragstart		= this.event_returnfalse;

	if ( this.canvas_target.setCapture )
	{
		this.canvas_target.setCapture();
	}

	AddEvent( document,	'mousemove',	this.event_onmousemove_workflow );
	AddEvent( document,	'mouseup',		this.event_onmouseup_workflow );
	AddEvent( window,	'blur',			this.event_onmouseup_workflow );
}

OWFWorkflow_Step_Overview.prototype.Event_OnMouseMove_Workflow = function( e )
{
	var mousepos = captureMousePosition( e );

	if ( this.canvas_started )
	{
		eventPreventDefault( e );
		this.canvas_started	= false;
	}

	this.workflow_translate_x	= mousepos.x - this.canvas_mouse_offset_x;
	this.workflow_translate_y	= mousepos.y - this.canvas_mouse_offset_y;

	this.Workflow_Redraw();
}

OWFWorkflow_Step_Overview.prototype.Event_OnMouseUp_Workflow = function( e )
{
	var target;

	document.body.unselectable			= null;
	document.onselectstart				= null;
	this.canvas_target.ondragstart		= null;

	if ( this.canvas_target.releaseCapture )
	{
		this.canvas_target.releaseCapture();
	}

	target					= e.target || e.srcElement;
	this.canvas_mousedown	= false;

	RemoveEvent( document,	'mousemove',	this.event_onmousemove_workflow );
	RemoveEvent( document,	'mouseup',		this.event_onmouseup_workflow );
	RemoveEvent( window,	'blur',			this.event_onmouseup_workflow );
}

OWFWorkflow_Step_Overview.prototype.Event_OnMouseScroll_Workflow = function( e )
{
	var mousepos, new_scale, scale_width, scale_height, scrolloffset, original_scale, positioner_rect;

	mousepos					= captureMousePosition( e );
	scrolloffset				= getScrollOffset( e );
	positioner_rect				= this.element_workflow_positioner.getBoundingClientRect();
	original_scale				= this.workflow_scale;
	new_scale					= this.workflow_scale * ( 1 + ( ( scrolloffset.y > 0 ) ? this.workflow_scale_multiplier : -this.workflow_scale_multiplier ) );
	scale_width					= mousepos.x - positioner_rect.left;
	scale_height				= mousepos.y - positioner_rect.top;

	this.workflow_scale			= new_scale;
	this.workflow_translate_x	= this.workflow_translate_x - ( ( ( scale_width / original_scale ) * new_scale ) - scale_width );
	this.workflow_translate_y	= this.workflow_translate_y - ( ( ( scale_height / original_scale ) * new_scale ) - scale_height );

	this.Workflow_Redraw();
}

OWFWorkflow_Step_Overview.prototype.onEnter_Step = function( e )
{
	if ( this.button_update )		this.button_update.SimulateClick();
	else if ( this.button_create )	this.button_create.SimulateClick();

	eventStopPropagation( e );
	return eventPreventDefault( e );
}

// OWFWorkflow_Step_Overview_TriggerItem
////////////////////////////////////////////////////

function OWFWorkflow_Step_Overview_TriggerItem( trig_code, element_parent )
{
	var i, i_len, triggers;

	triggers				= OWFWorkflow_AvailableTriggers();
	this.trigger_name_map	= new Object();

	for ( i = 0, i_len = triggers.length; i < i_len; i++ )
	{
		this.trigger_name_map[ triggers[ i ].code ] = triggers[ i ].name;
	}

	this.element_container	= newElement( 'span', { 'class': 'workflow_addeditdialog_step_overview_workflow_box diamond' },	null, element_parent );
	this.element_shape		= newElement( 'span', { 'class': 'workflow_addeditdialog_step_overview_workflow_box_shape' },	null, this.element_container );
	this.element_text		= newElement( 'span', { 'class': 'workflow_addeditdialog_step_overview_workflow_box_text' },	null, this.element_container );

	this.SetTrigger( trig_code );
}

OWFWorkflow_Step_Overview_TriggerItem.prototype.ContainedElement = function()
{
	return this.element_container;
}

OWFWorkflow_Step_Overview_TriggerItem.prototype.SetParentNode_InsertBefore = function( parent_node, existing_node )
{
	parent_node.insertBefore( this.ContainedElement(), existing_node );
}

OWFWorkflow_Step_Overview_TriggerItem.prototype.ParentNode = function()
{
	return this.ContainedElement().parentNode;
}

OWFWorkflow_Step_Overview_TriggerItem.prototype.SetTrigger = function( trig_code )
{
	this.trig_code					= trig_code;
	this.element_text.textContent	= this.trigger_name_map.hasOwnProperty( trig_code ) ? this.trigger_name_map[ trig_code ] : '';
}

OWFWorkflow_Step_Overview_TriggerItem.prototype.GetTrigger = function()
{
	return this.trig_code;
}

// OWFWorkflow_Step_Overview_ConditionItem
////////////////////////////////////////////////////

function OWFWorkflow_Step_Overview_ConditionItem( element_parent )
{
	this.group_list					= [ 'AND', 'OR' ];
	this.array_list					= [ 'ALL', 'ANY', 'FIRST', 'LAST' ];
	this.expression_list			= [ 'EQ', 'GT', 'GE', 'LT', 'LE', 'CO', 'NC', 'LIKE', 'NOTLIKE', 'NE', 'IN', 'NOT_IN', 'NULL', 'NOTNULL', 'TRUE', 'FALSE' ];

	this.element_container			= newElement( 'span', { 'class': 'workflow_addeditdialog_step_overview_workflow_box circle conditions' },	null, element_parent );
	this.element_shape				= newElement( 'span', { 'class': 'workflow_addeditdialog_step_overview_workflow_box_shape' },				null, this.element_container );
	this.element_text				= newElement( 'span', { 'class': 'workflow_addeditdialog_step_overview_workflow_box_text' },				null, this.element_container );
	this.element_counter			= newElement( 'span', { 'class': 'workflow_addeditdialog_step_overview_workflow_box_counter' },				null, this.element_container );

	this.element_text.textContent	= 'Conditions';
}

OWFWorkflow_Step_Overview_ConditionItem.prototype.ContainedElement = function()
{
	return this.element_container;
}

OWFWorkflow_Step_Overview_ConditionItem.prototype.SetConditions = function( conditions )
{
	var count = stoi_def( this.CountConditions( conditions ), 0 );

	this.element_counter.textContent = count > 0 ? count : 0;
}

OWFWorkflow_Step_Overview_ConditionItem.prototype.CountConditions = function( conditions )
{
	var i, i_len, count, options, operator;

	count						= 0;
	options						= new Object();
	options.disallow_negative	= true;

	if ( !Array.isArray( conditions ) )
	{
		return 0;
	}

	for ( i = 0, i_len = conditions.length; i < i_len; i++ )
	{
		operator = typeof conditions[ i ].operator === 'string' ? conditions[ i ].operator.toUpperCase() : conditions[ i ].operator;

		if ( this.group_list.indexOf( operator ) !== -1 )
		{
			count += 1 + this.CountConditions( conditions[ i ].value );
		}
		else if ( this.array_list.indexOf( operator ) !== -1 || ( ValidateWholeNumber( operator, options ) && stoi( operator ) > 0 ) )
		{
			count += 1 + this.CountConditions( conditions[ i ].value );
		}
		else if ( this.expression_list.indexOf( operator ) !== -1 )
		{
			count += 1;
		}
	}

	return count;
}

// OWFWorkflow_Step_Overview_ActionItem
////////////////////////////////////////////////////

function OWFWorkflow_Step_Overview_ActionItem( action, element_parent )
{
	var i, i_len, actions;

	actions					= OWFWorkflow_AvailableActions();
	this.action_name_map	= new Object();

	for ( i = 0, i_len = actions.length; i < i_len; i++ )
	{
		this.action_name_map[ actions[ i ].code ] = actions[ i ].name;
	}

	this.element_container	= newElement( 'span', { 'class': 'workflow_addeditdialog_step_overview_workflow_box rectangle action' },	null, element_parent );
	this.element_shape		= newElement( 'span', { 'class': 'workflow_addeditdialog_step_overview_workflow_box_shape' },				null, this.element_container );
	this.element_text		= newElement( 'span', { 'class': 'workflow_addeditdialog_step_overview_workflow_box_text' },				null, this.element_container );

	this.SetAction( action );
}

OWFWorkflow_Step_Overview_ActionItem.prototype.ContainedElement = function()
{
	return this.element_container;
}

OWFWorkflow_Step_Overview_ActionItem.prototype.SetParentNode_InsertBefore = function( parent_node, existing_node )
{
	parent_node.insertBefore( this.ContainedElement(), existing_node );
}

OWFWorkflow_Step_Overview_ActionItem.prototype.ParentNode = function()
{
	return this.ContainedElement().parentNode;
}

OWFWorkflow_Step_Overview_ActionItem.prototype.SetAction = function( action )
{
	this.action						= action;
	this.element_text.textContent	= this.action && this.action.hasOwnProperty( 'act' ) && typeof this.action.act === 'string' && this.action_name_map[ this.action.act ] ? this.action_name_map[ this.action.act ] : '';
}

OWFWorkflow_Step_Overview_ActionItem.prototype.GetAction = function()
{
	return this.action;
}

function OWFWorkflow_AvailableTriggers()
{
	return [
		{
			code: 'order_retrieved',
			name: 'Order Retrieved'
		},
		{
			code: 'order_acknowledged',
			name: 'Order Acknowledged'
		},
		{
			code: 'order_created',
			name: 'Order Created'
		},
		{
			code: 'order_status_change',
			name: 'Order Status Change'
		},
		{
			code: 'order_total_change',
			name: 'Order Total Change'
		},
		{
			code: 'ordershipment_created',
			name: 'Order Shipment Created'
		},
		{
			code: 'ordershipment_deleted',
			name: 'Order Shipment Deleted'
		},
		{
			code: 'ordershipment_status_change',
			name: 'Order Shipment Status Change'
		},
		{
			code: 'orderitem_created',
			name: 'Order Item Created'
		},
		{
			code: 'orderitem_updated',
			name: 'Order Item Updated'
		},
		{
			code: 'orderitem_status_change',
			name: 'Order Item Status Change'
		},
		{
			code: 'orderitem_deleted',
			name: 'Order Item Deleted'
		},
		{
			code: 'orderreturn_created',
			name: 'Order Return Created'
		},
		{
			code: 'orderreturn_deleted',
			name: 'Order Return Deleted'
		},
		{
			code: 'orderreturn_status_change',
			name: 'Order Return Status Change'
		}
	];
}

function OWFWorkflow_AvailableActions()
{
	return [
		{
			code: 'queue_add',
			name: 'Add to Queue'
		},
		{
			code: 'queue_move',
			name: 'Move to Queue'
		},
		{
			code: 'queue_remove',
			name: 'Remove from Queue'
		},
		{
			code: 'queue_remove_all',
			name: 'Remove from All Queues'
		},
		{
			code: 'note_add',
			name: 'Add Note'
		},
		{
			code: 'customfield_set',
			name: 'Set Custom Field'
		},
		{
			code: 'webhook_get',
			name: 'Webhook (GET)'
		},
		{
			code: 'webhook_post_order',
			name: 'Webhook (POST)'
		},
		{
			code: 'payment',
			name: 'Payment Actions'
		},
		{
			code: 'void',
			name: 'VOID'
		}
	];
}

function OWFWorkflow_AvailableFields()
{
	return [
		{
			field: 'order',
			type: 'object',
			children: [
				{
					field: 'id',
					type: 'integer'
				},
				{
					field: 'pay_id',
					type: 'integer'
				},
				{
					field: 'batch_id',
					type: 'integer'
				},
				{
					field: 'status',
					type: 'integer'
				},
				{
					field: 'pay_status',
					type: 'integer'
				},
				{
					field: 'stk_status',
					type: 'integer'
				},
				{
					field: 'dt_instock',
					type: 'timestamp'
				},
				{
					field: 'orderdate',
					type: 'timestamp'
				},
				{
					field: 'cust_id',
					type: 'integer'
				},
				{
					field: 'ship_res',
					type: 'boolean'
				},
				{
					field: 'ship_fname',
					type: 'string'
				},
				{
					field: 'ship_lname',
					type: 'string'
				},
				{
					field: 'ship_email',
					type: 'string'
				},
				{
					field: 'ship_comp',
					type: 'string'
				},
				{
					field: 'ship_phone',
					type: 'string'
				},
				{
					field: 'ship_fax',
					type: 'string'
				},
				{
					field: 'ship_addr1',
					type: 'string'
				},
				{
					field: 'ship_addr2',
					type: 'string'
				},
				{
					field: 'ship_city',
					type: 'string'
				},
				{
					field: 'ship_state',
					type: 'string'
				},
				{
					field: 'ship_zip',
					type: 'string'
				},
				{
					field: 'ship_cntry',
					type: 'string'
				},
				{
					field: 'bill_fname',
					type: 'string'
				},
				{
					field: 'bill_lname',
					type: 'string'
				},
				{
					field: 'bill_email',
					type: 'string'
				},
				{
					field: 'bill_comp',
					type: 'string'
				},
				{
					field: 'bill_phone',
					type: 'string'
				},
				{
					field: 'bill_fax',
					type: 'string'
				},
				{
					field: 'bill_addr1',
					type: 'string'
				},
				{
					field: 'bill_addr2',
					type: 'string'
				},
				{
					field: 'bill_city',
					type: 'string'
				},
				{
					field: 'bill_state',
					type: 'string'
				},
				{
					field: 'bill_zip',
					type: 'string'
				},
				{
					field: 'bill_cntry',
					type: 'string'
				},
				{
					field: 'ship_id',
					type: 'integer'
				},
				{
					field: 'ship_data',
					type: 'string'
				},
				{
					field: 'ship_method',
					type: 'string'
				},
				{
					field: 'cust_login',
					type: 'string'
				},
				{
					field: 'cust_pw_email',
					type: 'string'
				},
				{
					field: 'business_title',
					type: 'string'
				},
				{
					field: 'payment_module',
					type: 'string'
				},
				{
					field: 'source',
					type: 'string'
				},
				{
					field: 'source_id',
					type: 'integer'
				},
				{
					field: 'total',
					type: 'double'
				},
				{
					field: 'formatted_total',
					type: 'string'
				},
				{
					field: 'total_ship',
					type: 'double'
				},
				{
					field: 'formatted_total_ship',
					type: 'string'
				},
				{
					field: 'total_tax',
					type: 'double'
				},
				{
					field: 'formatted_total_tax',
					type: 'string'
				},
				{
					field: 'total_auth',
					type: 'double'
				},
				{
					field: 'formatted_total_auth',
					type: 'string'
				},
				{
					field: 'total_capt',
					type: 'double'
				},
				{
					field: 'formatted_total_capt',
					type: 'string'
				},
				{
					field: 'total_rfnd',
					type: 'double'
				},
				{
					field: 'formatted_total_rfnd',
					type: 'string'
				},
				{
					field: 'net_capt',
					type: 'double'
				},
				{
					field: 'formatted_net_capt',
					type: 'string'
				},
				{
					field: 'pend_count',
					type: 'integer'
				},
				{
					field: 'bord_count',
					type: 'integer'
				},
				{
					field: 'note_count',
					type: 'integer'
				},
				{
					field: 'dt_updated',
					type: 'integer'
				},
				{
					field: 'customer',
					type: 'object',
					children: [
						{
							field: 'id',
							type: 'integer'
						},
						{
							field: 'account_id',
							type: 'integer'
						},
						{
							field: 'login',
							type: 'string'
						},
						{
							field: 'pw_email',
							type: 'string'
						},
						{
							field: 'ship_id',
							type: 'integer'
						},
						{
							field: 'ship_res',
							type: 'boolean'
						},
						{
							field: 'ship_fname',
							type: 'string'
						},
						{
							field: 'ship_lname',
							type: 'string'
						},
						{
							field: 'ship_email',
							type: 'string'
						},
						{
							field: 'ship_comp',
							type: 'string'
						},
						{
							field: 'ship_phone',
							type: 'string'
						},
						{
							field: 'ship_fax',
							type: 'string'
						},
						{
							field: 'ship_addr1',
							type: 'string'
						},
						{
							field: 'ship_addr2',
							type: 'string'
						},
						{
							field: 'ship_city',
							type: 'string'
						},
						{
							field: 'ship_state',
							type: 'string'
						},
						{
							field: 'ship_zip',
							type: 'string'
						},
						{
							field: 'ship_cntry',
							type: 'string'
						},
						{
							field: 'bill_id',
							type: 'integer'
						},
						{
							field: 'bill_fname',
							type: 'string'
						},
						{
							field: 'bill_lname',
							type: 'string'
						},
						{
							field: 'bill_email',
							type: 'string'
						},
						{
							field: 'bill_comp',
							type: 'string'
						},
						{
							field: 'bill_phone',
							type: 'string'
						},
						{
							field: 'bill_fax',
							type: 'string'
						},
						{
							field: 'bill_addr1',
							type: 'string'
						},
						{
							field: 'bill_addr2',
							type: 'string'
						},
						{
							field: 'bill_city',
							type: 'string'
						},
						{
							field: 'bill_state',
							type: 'string'
						},
						{
							field: 'bill_zip',
							type: 'string'
						},
						{
							field: 'bill_cntry',
							type: 'string'
						},
						{
							field: 'tax_exempt',
							type: 'boolean'
						},
						{
							field: 'order_cnt',
							type: 'integer'
						},
						{
							field: 'order_avg',
							type: 'double'
						},
						{
							field: 'order_tot',
							type: 'double'
						},
						{
							field: 'note_count',
							type: 'integer'
						},
						{
							field: 'dt_created',
							type: 'timestamp'
						},
						{
							field: 'dt_updated',
							type: 'timestamp'
						},
						{
							field: 'dt_login',
							type: 'timestamp'
						},
						{
							field: 'credit',
							type: 'double'
						},
						{
							field: 'formatted_credit',
							type: 'string'
						}
					]
				},
				{
					field: 'items',
					type: 'array',
					children: [
						{
							field: 'order_id',
							type: 'integer'
						},
						{
							field: 'line_id',
							type: 'integer'
						},
						{
							field: 'status',
							type: 'integer'
						},
						{
							field: 'subscrp_id',
							type: 'integer'
						},
						{
							field: 'subterm_id',
							type: 'integer'
						},
						{
							field: 'rma_id',
							type: 'integer'
						},
						{
							field: 'rma_code',
							type: 'string'
						},
						{
							field: 'rma_dt_issued',
							type: 'timestamp'
						},
						{
							field: 'rma_dt_recvd',
							type: 'timestamp'
						},
						{
							field: 'dt_instock',
							type: 'timestamp'
						},
						{
							field: 'code',
							type: 'string'
						},
						{
							field: 'name',
							type: 'string'
						},
						{
							field: 'sku',
							type: 'string'
						},
						{
							field: 'retail',
							type: 'double'
						},
						{
							field: 'base_price',
							type: 'double'
						},
						{
							field: 'price',
							type: 'double'
						},
						{
							field: 'weight',
							type: 'double'
						},
						{
							field: 'taxable',
							type: 'boolean'
						},
						{
							field: 'upsold',
							type: 'boolean'
						},
						{
							field: 'quantity',
							type: 'integer'
						},
						{
							field: 'total',
							type: 'double'
						},
						{
							field: 'shipment',
							type: 'object',
							children: [
								{
									field: 'id',
									type: 'integer'
								},
								{
									field: 'code',
									type: 'string'
								},
								{
									field: 'order_id',
									type: 'integer'
								},
								{
									field: 'status',
									type: 'integer'
								},
								{
									field: 'labelcount',
									type: 'integer'
								},
								{
									field: 'ship_date',
									type: 'timestamp'
								},
								{
									field: 'tracknum',
									type: 'string'
								},
								{
									field: 'tracktype',
									type: 'string'
								},
								{
									field: 'tracklink',
									type: 'string'
								},
								{
									field: 'weight',
									type: 'double'
								},
								{
									field: 'cost',
									type: 'double'
								},
								{
									field: 'formatted_cost',
									type: 'string'
								}
							]
						},
						{
							field: 'discounts',
							type: 'array',
							children: [
								{
									field: 'order_id',
									type: 'integer'
								},
								{
									field: 'line_id',
									type: 'integer'
								},
								{
									field: 'pgrp_id',
									type: 'integer'
								},
								{
									field: 'display',
									type: 'boolean'
								},
								{
									field: 'descrip',
									type: 'string'
								},
								{
									field: 'discount',
									type: 'double'
								}
							]
						},
						{
							field: 'options',
							type: 'array',
							children: [
								{
									field: 'attribute',
									type: 'string'
								},
								{
									field: 'value',
									type: 'string'
								},
								{
									field: 'weight',
									type: 'double'
								},
								{
									field: 'retail',
									type: 'double'
								},
								{
									field: 'base_price',
									type: 'double'
								},
								{
									field: 'price',
									type: 'double'
								},
								{
									field: 'discounts',
									type: 'array',
									children: [
										{
											field: 'order_id',
											type: 'integer'
										},
										{
											field: 'line_id',
											type: 'integer'
										},
										{
											field: 'attr_id',
											type: 'integer'
										},
										{
											field: 'attmpat_id',
											type: 'integer'
										},
										{
											field: 'pgrp_id',
											type: 'integer'
										},
										{
											field: 'display',
											type: 'boolean'
										},
										{
											field: 'descrip',
											type: 'string'
										},
										{
											field: 'discount',
											type: 'double'
										}
									]
								}
							]
						},
						{
							field: 'subscription',
							type: 'object',
							children: [
								{
									field: 'method',
									type: 'string'
								},
								{
									field: 'productsubscriptionterm',
									type: 'object',
									children: [
										{
											field: 'id',
											type: 'integer'
										},
										{
											field: 'product_id',
											type: 'integer'
										},
										{
											field: 'frequency',
											type: 'string'
										},
										{
											field: 'term',
											type: 'integer'
										},
										{
											field: 'descrip',
											type: 'string'
										},
										{
											field: 'n',
											type: 'integer'
										},
										{
											field: 'fixed_dow',
											type: 'integer'
										},
										{
											field: 'fixed_dom',
											type: 'integer'
										},
										{
											field: 'sub_count',
											type: 'integer'
										}
									]
								},
								{
									field: 'options',
									type: 'array',
									children: [
										{
											field: 'subscrp_id',
											type: 'integer'
										},
										{
											field: 'templ_code',
											type: 'string'
										},
										{
											field: 'attr_code',
											type: 'string'
										},
										{
											field: 'value',
											type: 'string'
										}
									]
								}
							]
						}
					]
				},
				{
					field: 'charges',
					type: 'array',
					children: [
						{
							field: 'order_id',
							type: 'integer'
						},
						{
							field: 'charge_id',
							type: 'integer'
						},
						{
							field: 'module_id',
							type: 'integer'
						},
						{
							field: 'type',
							type: 'string'
						},
						{
							field: 'descrip',
							type: 'string'
						},
						{
							field: 'amount',
							type: 'double'
						},
						{
							field: 'disp_amt',
							type: 'double'
						},
						{
							field: 'tax_exempt',
							type: 'boolean'
						}
					]
				},
				{
					field: 'coupons',
					type: 'array',
					children: [
						{
							field: 'order_id',
							type: 'integer'
						},
						{
							field: 'coupon_id',
							type: 'integer'
						},
						{
							field: 'code',
							type: 'string'
						},
						{
							field: 'descrip',
							type: 'string'
						},
						{
							field: 'total',
							type: 'double'
						}
					]
				},
				{
					field: 'discounts',
					type: 'array',
					children: [
						{
							field: 'order_id',
							type: 'integer'
						},
						{
							field: 'pgrp_id',
							type: 'integer'
						},
						{
							field: 'name',
							type: 'string'
						},
						{
							field: 'descrip',
							type: 'string'
						},
						{
							field: 'total',
							type: 'double'
						}
					]
				},
				{
					field: 'payments',
					type: 'array',
					children: [
						{
							field: 'decrypt_status',
							type: 'string'
						},
						{
							field: 'decrypt_error',
							type: 'string'
						},
						{
							field: 'description',
							type: 'string'
						}
					]
				},
				{
					field: 'notes',
					type: 'array',
					children: [
						{
							field: 'id',
							type: 'integer'
						},
						{
							field: 'cust_id',
							type: 'integer'
						},
						{
							field: 'account_id',
							type: 'integer'
						},
						{
							field: 'order_id',
							type: 'integer'
						},
						{
							field: 'user_id',
							type: 'integer'
						},
						{
							field: 'notetext',
							type: 'string'
						},
						{
							field: 'dtstamp',
							type: 'timestamp'
						},
						{
							field: 'cust_login',
							type: 'string'
						},
						{
							field: 'business_title',
							type: 'string'
						},
						{
							field: 'admin_user',
							type: 'string'
						}
					]
				}
			]
		}
	];
}
