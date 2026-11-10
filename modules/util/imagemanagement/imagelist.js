// Miva Merchant
//
// This file and the source codes contained herein are the property of
// Miva, Inc.  Use of this file is restricted to the specific terms and
// conditions in the License Agreement associated with this file.  Distribution
// of this file or portions of this file for uses not covered by the License
// Agreement is not allowed without a written agreement signed by an officer of
// Miva, Inc.
//
// Copyright 1998-2026 Miva, Inc.  All rights reserved.
// http://www.miva.com
//

// Image Management: Image List
////////////////////////////////////////////////////

var ImageManagement_ImageList = ImageManagement_ImageList || class ImageManagement_ImageList extends MMList
{
	#mru_cache;
	#can_delete;
	#delete_image;

	constructor()
	{
		super( 'imagemanagement_imagelist' );

		this.#delete_image	= false;
		this.#can_delete	= CanI( 'IMGS', 0, 0, 0, 1 );
		this.#mru_cache		= new MMMRUImageCache();
	}

	Attach( parent_id )
	{
		setTimeout( () =>
		{
			super.Attach( parent_id );
			this.#delayedConstructor();
		} );
	}

	#delayedConstructor()
	{
		this.Feature_EditDialog_Enable( 'Edit Image' );

		if ( this.#can_delete )
		{
			this.Feature_Delete_Enable( 'Delete Image(s)', 'Delete Image(s)' );
		}

		if ( CanI_IsAdministrator() || CanI_IsStoreManager() )
		{
			const button_checkforupdated	= this.Feature_Controls_Create_Action(	'Check for Updated Images',	'', this.#actionCheckForUpdatedImages );
			const button_partition			= this.Feature_Controls_Create_Action(	'Partition Images',			'', this.#actionPartitionImages );
			const button_deleteresized		= this.Feature_Selection_Create_Action(	'Delete Resized',			'', this.#actionDeleteResizedImages );

			this.Feature_Controls_SetPrimary_Action( button_checkforupdated );
			this.Feature_Controls_SetSecondary_Action( button_partition );
			this.Feature_Selection_SetSecondary_Action( button_deleteresized );
		}

		this.Feature_Controls_SetSearchPlaceholderText( 'Search Images...' );
		this.SetDefaultSort( 'image', '-' );
	}

	onLoad( filter, sort, offset, count, callback, delegator )
	{
		ImageListWithGeneratedImages_Load_Query( filter, sort, offset, count, callback, delegator );
	}

	onCreateRootColumnList()
	{
		const columnlist =
		[
			new MMList_Column_CachedImagePreview( 'Image Preview', 'imagepreview', this.#mru_cache )
				.SetOnRetrieveValue( ( record ) => { return record.id; } ),
			new MMList_Column_Name( 'Image', 'image', '' ),
			new MMList_Column_DateTime( 'Modified', 'image_mtime', '' )
					.SetDefaultActive( false )
					.SetSearchable( false )
					.SetSortByField( '' ),
			new MMList_Column_Numeric( 'Width', 'width', '', 0 ),
			new MMList_Column_Numeric( 'Height', 'height', '', 0 ),
			new MMList_Column_Numeric( 'Size', 'image_size', '', 0 )
					.SetDefaultActive( false )
					.SetSearchable( false )
					.SetSortByField( '' )
					.SetOnDisplayData( ( record ) => { return document.createTextNode( record.image_size == 0 ? 'Unknown' : FormattedFileSize( record.image_size ) ); } ),
			new MMList_Column_Numeric( 'Reference Count', 'refcount', '', 0 )
					.SetDefaultActive( false ),
			new MMList_Column_TextArea( 'Image Alt Text', 'Alt Text', 'alt_text', '', false )
		];

		return columnlist;
	}

	onEdit( item )
	{
		const dialog	= new ImageEditDialog( item.record );
		dialog.onDelete	= () => { this.Refresh(); }
		dialog.onClose	= ( changes_saved ) =>
		{
			if ( changes_saved )
			{
				this.Refresh( true );
			}
		}

		dialog.Show();
	}

	onDelete( item, callback, delegator )
	{
		Image_Delete( item.record.id, this.#delete_image, callback, delegator );
	}

	onDeleteConfirmationTitle()
	{
		return `Delete selected ${Plural( this.ActiveItemList_Count(), 'image', 'images' )}?`;
	}

	onDeleteConfirmationButton()
	{
		return `Delete ${Plural( this.ActiveItemList_Count(), 'Image', 'Images' )}`;
	}

	onDeleteConfirmationMessage()
	{
		const element_container 						= newElement( 'mm-flex-section',	{ 'width': '450px', 'row-gap': 'spacing-300' },							null, null );
		const element_radio_remove						= newElement( 'mm-radio',			{ 'group-name': 'imagemanagement-imageeditdialog-deletemasterimage' },	null, element_container );
		const element_radio_removeanddelete				= newElement( 'mm-radio',			{ 'group-name': 'imagemanagement-imageeditdialog-deletemasterimage' },	null, element_container );
		const element_remove_container					= newElement( 'mm-flex-group',		{ 'direction': 'column', 'align-items': 'start', 'row-gap': '0' },		null, element_radio_remove );
		const element_remove_title						= newElement( 'mm-text',			{ 'type': 'paragraph-medium', 'tone': '900', 'weight': '500' },			null, element_remove_container );
		const element_remove_subtitle					= newElement( 'mm-text',			{ 'type': 'paragraph-medium' },											null, element_remove_container );
		const element_removeanddelete_container			= newElement( 'mm-flex-group',		{ 'direction': 'column', 'align-items': 'start', 'row-gap': '0' },		null, element_radio_removeanddelete );
		const element_removeanddelete_title				= newElement( 'mm-text',			{ 'type': 'paragraph-medium', 'tone': '900', 'weight': '500' },			null, element_removeanddelete_container );
		const element_removeanddelete_subtitle			= newElement( 'mm-text',			{ 'type': 'paragraph-medium' },											null, element_removeanddelete_container );

		element_remove_title.textContent				= 'Remove from library';
		element_remove_subtitle.textContent				= 'The image file stays on your server';
		element_removeanddelete_title.textContent		= 'Delete from library and server';
		element_removeanddelete_subtitle.textContent	= `Permanently deletes the file. Any pages still using it will show a broken image. This can't be undone.`;

		element_radio_remove.text						= element_remove_container;
		element_radio_removeanddelete.text				= element_removeanddelete_container;

		element_radio_remove.onchange					= ( checked ) => { this.#delete_image = !checked; };
		element_radio_removeanddelete.onchange			= ( checked ) => { this.#delete_image = checked; };

		if ( !this.#delete_image )	element_radio_remove.checked			= true;
		else						element_radio_removeanddelete.checked	= true;

		return element_container;
	}

	#actionDeleteResizedImages()
	{
		const dialog	= new ConfirmationDialog();
		dialog.onYes	= () => { this.#actionDeleteResizedImagesLowLevel(); };

		dialog.SetButtonNoText( 'Cancel' );
		dialog.SetButtonYesText( 'Continue' );
		dialog.SetTitle( 'Delete Resized Images?' );
		dialog.Show( `Any resized versions of the selected images will be deleted.<br />
					  The resized image files will be permanently removed from the server.<br />
					  <br />
					  Continue?` );
	}

	#actionDeleteResizedImagesLowLevel()
	{
		const list = new Array();

		for ( let i = 0, i_len = this.ActiveItemList_Count(); i < i_len; i++ )
		{
			const item = this.ActiveItemList_ItemAtIndex( i );

			if ( item !== null )
			{
				list.push( item.record.id );
			}
		}

		const processingdialog = new ProcessingDialog();
		processingdialog.Show( 'Deleting Resized Images...' );

		ImageManagement_ImageList_Delete_GeneratedImages( list, ( response ) =>
		{
			processingdialog.Hide();

			if ( !response.success )
			{
				return this.onError( response.error_message );
			}

			this.Refresh();
		} );
	}

	#actionCheckForUpdatedImages()
	{
		const dialog	= new ConfirmationDialog();
		dialog.onYes	= () => { this.#actionCheckForUpdatedImagesLowLevel(); };

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

	#actionCheckForUpdatedImagesLowLevel()
	{
		const dialog	= new UpdatedImagesDialog();
		dialog.onHide	= () => { this.Refresh(); };

		dialog.Show();
	}

	#actionPartitionImages()
	{
		const dialog	= new ConfirmationDialog();
		dialog.onYes	= () => { this.#actionPartitionImagesLowLevel(); };

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

	#actionPartitionImagesLowLevel()
	{
		const dialog = new PartitionImagesDialog();
		dialog.onHide = () => { this.Refresh(); }

		dialog.Show();
	}
}