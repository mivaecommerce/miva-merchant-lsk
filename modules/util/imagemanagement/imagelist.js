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

// Image List
////////////////////////////////////////////////////

function ImageManagement_ImageList()
{
	MMBatchList.call( this, 'mm9_batchlist_imagemanagementlist' );

	this.processingdialog						= new ProcessingDialog();

	if ( CanI_IsAdministrator() || CanI_IsStoreManager() )
	{
		this.Feature_EditDialog_Enable( 'Edit Image' );
		this.Feature_RowDoubleClick_Enable();

		this.Feature_Delete_Enable( 'Delete Image(s)' );

		this.button_checkforupdatedimages		= this.Feature_Buttons_AddButton_Persistent( 'Check for Updated Images',	'',	'',			this.ImageManagement_CheckForUpdatedImages );
		this.button_partitionimages				= this.Feature_Buttons_AddButton_Persistent( 'Partition Images',			'',	'',			this.ImageManagement_PartitionImages );
		this.button_deletegenerated				= this.Feature_Buttons_AddButton_Dynamic( 'Delete Resized',					'',	'delete',	this.ImageManagement_DeleteResizedImages );

		if ( this.button_recorddelete_delete )	this.button_recorddelete_delete.SetText( 'Delete Image' );
	}

	this.Feature_SearchBar_SetPlaceholderText( 'Search Images...' );
	this.SetDefaultSort( 'image', '-' );
}

DeriveFrom( MMBatchList, ImageManagement_ImageList );

ImageManagement_ImageList.prototype.onLoad = ImageManagement_ImageList_Load_Query;

ImageManagement_ImageList.prototype.onCreateRootColumnList = function()
{
	var columnlist =
	[
		new MMBatchList_Column_Name( 'Image', 'image', '' ),
		new MMBatchList_Column_DateTime( 'Modified', 'image_mtime', '' )
				.SetSearchable( false )
				.SetSortByField( '' ),
		new MMBatchList_Column_Numeric( 'Width', 'width', '', 0 ),
		new MMBatchList_Column_Numeric( 'Height', 'height', '', 0 ),
		new MMBatchList_Column_Numeric( 'Size', 'image_size', '', 0 )
				.SetSearchable( false )
				.SetSortByField( '' )
				.SetOnDisplayData( function( record ) { return document.createTextNode( record.image_size == 0 ? 'Unknown' : ( Math.round( record.image_size / 1024  ) + ' KB' ) ); } ),
		new MMBatchList_Column_Numeric( 'Reference Count', 'refcount', '', 0 )
	];

	return columnlist;
}

ImageManagement_ImageList.prototype.onEdit = function( item )
{
	const self = this;
	var dialog;

	dialog					= new ImageManagement_ImageDialog( item.record );
	dialog.ondeletemaster	= function() { self.Refresh(); }

	dialog.Show();
}

ImageManagement_ImageList.prototype.onDelete = function( item, callback, delegator )
{
	ImageManagement_Image_Delete( item.record.id, callback, delegator );
}

ImageManagement_ImageList.prototype.onDeleteConfirmationMessage = function()
{
	return ( 'You are about to delete ' + ( this.ActiveItemList_Count() > 1 ? ( this.ActiveItemList_Count() + ' images.\n' ) : '1 image.\n' ) +
		     '\n' +
		     'The images will be removed from any products to which they are assigned.  Any resized ' +
		     'versions of the master image will also be deleted. The image files will be permanently ' +
		     'removed from the server.\n' +
		     '\n' +
		     'This cannot be undone.' );
}

ImageManagement_ImageList.prototype.ImageManagement_DeleteResizedImages = function()
{
	const self = this;
	var dialog;

	dialog			= new ConfirmationDialog();
	dialog.onYes	= function() { self.ImageManagement_DeleteResizedImages_LowLevel(); };

	dialog.SetButtonNoText( 'Cancel' );
	dialog.SetButtonYesText( 'Continue' );
	dialog.SetTitle( 'Delete Resized Images?' );
	dialog.Show( `Any resized versions of the selected images will be deleted.<br />
				  The resized image files will be permanently removed from the server.<br />
				  <br />
				  Continue?` );
}

ImageManagement_ImageList.prototype.ImageManagement_DeleteResizedImages_LowLevel = function()
{
	const self = this;
	var i, i_len, item, list;

	list = new Array();
	
	for ( i = 0, i_len = this.ActiveItemList_Count(); i < i_len; i++ )
	{
		if ( ( item = this.ActiveItemList_ItemAtIndex( i ) ) === null )
		{
			continue;
		}

		list.push( item.record.id );
	}

	this.processingdialog.Show( 'Deleting Resized Images...' );
	ImageManagement_ImageList_Delete_GeneratedImages( list, function( response ) { self.ImageManagement_ImageList_Delete_GeneratedImages_Callback( response ); } );
}

ImageManagement_ImageList.prototype.ImageManagement_ImageList_Delete_GeneratedImages_Callback = function( response )
{
	this.processingdialog.Hide();

	if ( !response.success )
	{
		return this.onError( response.error_message );
	}

	this.Refresh();
}

ImageManagement_ImageList.prototype.ImageManagement_CheckForUpdatedImages = function()
{
	const self = this;
	var dialog;

	dialog			= new ConfirmationDialog();
	dialog.onYes	= function() { self.ImageManagement_CheckForUpdatedImages_LowLevel(); };

	dialog.SetButtonNoText( 'Cancel' );
	dialog.SetButtonYesText( 'Continue' );
	dialog.SetTitle( 'Check for Updated Images?' );
	dialog.Show( `This function will check for images that have been updated outside of the<br />
				  Miva Merchant Administrative interface (for example, via FTP).<br />
				  <br />
				  Any resized versions of a master image that are older than the master image will<br />
				  be discarded, allowing them to be regenerated from the updated master image.<br />
				  <br />
				  Depending on the number of images present, this process may take a long time.<br />
				  <br />
				  Continue?` );
}

ImageManagement_ImageList.prototype.ImageManagement_CheckForUpdatedImages_LowLevel = function()
{
	const self = this;
	var dialog;

	dialog			= new UpdatedImagesDialog();
	dialog.onHide	= function() { self.Refresh(); };

	dialog.Show();
}

ImageManagement_ImageList.prototype.ImageManagement_PartitionImages = function()
{
	const self = this;
	var dialog;

	dialog			= new ConfirmationDialog();
	dialog.onYes	= function() { self.ImageManagement_PartitionImages_LowLevel(); };

	dialog.SetButtonNoText( 'Cancel' );
	dialog.SetButtonYesText( 'Continue' );
	dialog.SetTitle( 'Partition Images?' );
	dialog.Show( `This function will check for images as well as generated images that have not been partitioned<br />
				  into subdirectories and move them into their respective partition directory.<br />
				  <br />
				  Depending on the number of images present, this process may take a long time.<br />
				  <br />
				  Continue?` );
}

ImageManagement_ImageList.prototype.ImageManagement_PartitionImages_LowLevel = function()
{
	const self = this;
	var dialog;

	dialog = new PartitionImagesDialog();
	dialog.onHide = function() { self.Refresh(); }

	dialog.Show();
}
