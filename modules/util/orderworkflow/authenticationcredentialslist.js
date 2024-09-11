// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2020 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// Order Workflow: Authentication Credentials List 
////////////////////////////////////////////////////

function OWFAuthenticationCredentialsList()
{
	MMList.call( this, 'mm_owfauthenticationcredentialslist' );

	if ( CanI( 'OWFP', 0, 1, 0, 0 ) )
	{
		this.button_add = this.Feature_Controls_Create_Action( 'Add Authentication Credentials', '', this.Add );
		this.Feature_Controls_SetPrimary_Action( this.button_add );
	}

	if ( CanI( 'OWFP', 0, 0, 1, 0 ) )
	{
		this.Feature_EditDialog_Enable( 'Edit Authentication Credentials' );
	}

	if ( CanI( 'OWFP', 0, 0, 0, 1 ) )
	{
		this.Feature_Delete_Enable( 'Delete Authentication Credentials' );
	}

	this.Feature_Controls_SetSearchPlaceholderText( 'Search Authentication Credentials...' );
	this.SetDefaultSort( 'id', '' );
}

DeriveFrom( MMList, OWFAuthenticationCredentialsList );

OWFAuthenticationCredentialsList.prototype.onLoad = OWFAuthenticationCredentialsList_Load_Query;

OWFAuthenticationCredentialsList.prototype.Add = function()
{
	var self = this;
	var dialog;

	dialog			= new OWFAuthenticationCredentialsDialog( null );
	dialog.onSave	= function( credentials ) { self.Refresh(); }

	dialog.Show();
}

OWFAuthenticationCredentialsList.prototype.onEdit = function( item )
{
	var self = this;
	var dialog;

	dialog			= new OWFAuthenticationCredentialsDialog( item.record );
	dialog.onSave	= function( credentials ) { self.Refresh(); };
	dialog.onDelete	= function() { self.Refresh(); };

	dialog.Show();
}

OWFAuthenticationCredentialsList.prototype.onDelete = function( item, callback, delegator )
{
	OWFAuthenticationCredentials_Delete( item.record.id, callback, delegator );
}

OWFAuthenticationCredentialsList.prototype.onCreateRootColumnList = function()
{
	var columnlist =
	[
		new MMList_Column_SortOnlyColumn( 'ID', 'id' ),
		new MMList_Column_Name( 'Description', 'descrip' )
			.SetNavigationEnabled( true ),
		new MMList_Column_MappedTextValues( 'Authentication Type', 'auth_type', [ 'basic' ], [ 'Basic' ] ),
		new MMList_Column_Numeric( 'Reference Count', 'refcount', '', 0 )
	];

	return columnlist;
}
