// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2022 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// Image Detail Dialog
////////////////////////////////////////////////////

function ImageManagement_ImageDialog( image )
{
	var self = this;

	// Variables
	this.image					= image;
	this.generatedimagelist		= null;

	// Controls
	this.imagedialog			= document.getElementById( 'imagemanagement_imagedialog' );
	this.image_preview			= document.getElementById( 'imagemanagement_imagedialog_image_preview' );
	this.image_image			= document.getElementById( 'imagemanagement_imagedialog_image_image' );
	this.image_width			= document.getElementById( 'imagemanagement_imagedialog_image_width' );
	this.image_height			= document.getElementById( 'imagemanagement_imagedialog_image_height' );
	this.image_size				= document.getElementById( 'imagemanagement_imagedialog_image_size' );
	this.image_modified			= document.getElementById( 'imagemanagement_imagedialog_image_modified' );
	this.image_refcount			= document.getElementById( 'imagemanagement_imagedialog_image_refcount' );
	this.table_generatedimages	= document.getElementById( 'imagemanagement_imagedialog_generatedimages' );
	this.selectall				= document.getElementById( 'imagemanagement_imagedialog_generatedimagelist_selectall' );
	this.button_close			= document.getElementById( 'imagemanagement_imagedialog_button_close' );
	this.button_delete_selected	= document.getElementById( 'imagemanagement_imagedialog_button_delete_selected' );
	this.button_delete_master	= document.getElementById( 'imagemanagement_imagedialog_button_delete_master' );

	// Events
	if ( this.image_preview )			this.image_preview.onload			= function() { Modal_Resize(); };

	if ( this.selectall )				this.selectall.onclick				= function() { self.SelectAll( this.checked ); };

	if ( this.button_close )			this.button_close.onclick			= function() { self.Close(); };
	if ( this.button_delete_selected )	this.button_delete_selected.onclick	= function() { self.Delete_Selected(); };
	if ( this.button_delete_master )	this.button_delete_master.onclick	= function() { self.Delete_Master(); };
}

ImageManagement_ImageDialog.prototype.Show = function()
{
	this.image_preview.src					= this.image.image;
	this.image_image.innerHTML				= encodeentities( this.image.image );
	this.image_width.innerHTML				= encodeentities( this.image.width );
	this.image_height.innerHTML				= encodeentities( this.image.height );
	this.image_size.innerHTML				= this.image.image_size == 0 ? 'Unknown' : ( Math.round( this.image.image_size / 1024  ) + ' KB' );
	this.image_modified.innerHTML			= this.image.image_mtime == 0 ? 'Unknown' : Date_Format( this.image.image_mtime ) + ' ' + Time_Format( this.image.image_mtime );
	this.image_refcount.innerHTML			= encodeentities( this.image.refcount );
	this.button_delete_selected.disabled	= true;

	this.Refresh();
	Modal_Show( this.imagedialog, null, this.button_close.onclick );

	this.button_close.focus();
}

ImageManagement_ImageDialog.prototype.Hide = function()
{
	Modal_Hide();
}

ImageManagement_ImageDialog.prototype.Refresh = function()
{
	var self = this;

	TableLoading( this.table_generatedimages );

	this.generatedimagelist					= new Array();
	this.selectall.checked					= false;

	ImageManagement_GeneratedImageList_Load_Image( this.image.id, function( response ) { self.ImageManagement_GeneratedImageList_Load_Callback( response ); } );
}

ImageManagement_ImageDialog.prototype.SelectAll = function( selected )
{
	Checkbox_CheckAll( 'imagemanagement_imagedialog_generatedimage_select_', selected );
	this.EnableDisableButtons();
}

ImageManagement_ImageDialog.prototype.Select_Toggle = function( generatedimage )
{
	if ( this.selectall )	this.selectall.checked = false;

	this.EnableDisableButtons();
}

ImageManagement_ImageDialog.prototype.EnableDisableButtons = function()
{
	var selected = Checkbox_Selected_List( 'imagemanagement_imagedialog_generatedimage_select_' );

	if ( this.button_delete_selected )	this.button_delete_selected.disabled	= selected.length == 0 ? true : false;
}

ImageManagement_ImageDialog.prototype.Close = function()
{
	this.Hide();
	this.onclose();
}

ImageManagement_ImageDialog.prototype.Delete_Selected = function()
{
	var self = this;
	var selected = Checkbox_Selected_List( 'imagemanagement_imagedialog_generatedimage_select_' );

	if ( !confirm( "This selected resized images will be deleted.\n" +
				   "\n" +
				   "The resized image files will be permanently removed from the server." ) )
	{
		return;
	}

	ImageManagement_GeneratedImageList_Delete( selected, function( response )
	{
		if ( !response.success )
		{
			return self.onerror( response.error_message );
		}

		self.Refresh();
	} );
}

ImageManagement_ImageDialog.prototype.Delete_Master = function()
{
	var self = this;

	if ( !confirm( "This image will be removed from any products to which it is assigned.  Any resized " +
				   "versions of the master image will also be deleted. The image files will be permanently " +
				   "removed from the server.\n" +
				   "\n" +
				   "This cannot be undone." ) )
	{
		return;
	}

	ImageManagement_Image_Delete( this.image.id, function( response )
	{
		if ( !response.success )
		{
			return self.onerror( response.error_message );
		}

		self.Hide();
		self.ondeletemaster();
	} );
}

ImageManagement_ImageDialog.prototype.ImageManagement_GeneratedImageList_Load_Callback = function( response )
{
	EmptyElement( this.table_generatedimages );

	if ( !response.success )
	{
		return this.onerror( response.error_message );
	}

	for ( i = 0; i < response.data.length; i++ )
	{
		new ImageManagement_ImageDialog_GeneratedImage( this, response.data[ i ] );
	}

	this.EnableDisableButtons();
}

// ImageManagement_ImageDialogDialog_GeneratedImage
/////////////////////////////////////////////////////////////////

function ImageManagement_ImageDialog_GeneratedImage( dialog, generatedimage )
{
	this.dialog					= dialog;
	this.offset					= dialog.generatedimagelist.length;
	this.generatedimage			= generatedimage;

	this.tr						= newElement( 'tr',		null, null, null );

	this.td_select				= newElement( 'td',		{ 'class':	'imagemanagement_imagedialog_generatedimagelist_col_select' }, null, this.tr );
	this.select					= newElement( 'input',	{ type:		'checkbox',
														  id:		'imagemanagement_imagedialog_generatedimage_select_' + this.offset,
														  value:	generatedimage.id }, null, this.td_select );
	this.select.dialog			= dialog;
	this.select.generatedimage	= this.generatedimage;
	this.select.onclick			= function() { this.dialog.Select_Toggle( this.generatedimage ) };

	this.td_image				= newElement( 'td',		{ 'class':	'imagemanagement_imagedialog_generatedimagelist_col_image' }, null, this.tr );
	this.td_modified			= newElement( 'td',		{ 'class':	'imagemanagement_imagedialog_generatedimagelist_col_modified' }, null, this.tr );
	this.td_width				= newElement( 'td',		{ 'class':	'imagemanagement_imagedialog_generatedimagelist_col_width' }, null, this.tr );
	this.td_height				= newElement( 'td',		{ 'class':	'imagemanagement_imagedialog_generatedimagelist_col_height' }, null, this.tr );
	this.td_size				= newElement( 'td',		{ 'class':	'imagemanagement_imagedialog_generatedimagelist_col_size' }, null, this.tr );

	this.td_image.innerHTML		= encodeentities( generatedimage.image );
	this.td_modified.innerHTML	= generatedimage.image_mtime == 0 ? 'Unknown' : Date_Format( generatedimage.image_mtime ) + ' ' + Time_Format( generatedimage.image_mtime );
	this.td_width.innerHTML		= encodeentities( generatedimage.width );
	this.td_height.innerHTML	= encodeentities( generatedimage.height );
	this.td_size.innerHTML		= generatedimage.image_size == 0 ? 'Unknown' : ( Math.round( generatedimage.image_size / 1024  ) + ' KB' );

	dialog.generatedimagelist.push( this );
	dialog.table_generatedimages.appendChild( this.tr );
}

ImageManagement_ImageDialog.prototype.onerror			= function( error )	{ Modal_Alert( error ); }
ImageManagement_ImageDialog.prototype.onclose			= function()		{ ; }
ImageManagement_ImageDialog.prototype.ondeletemaster	= function()		{ ; }
